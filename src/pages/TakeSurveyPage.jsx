// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../api/api";

// const TakeSurveyPage = () => {
//   const { surveyId } = useParams();
//   const [survey, setSurvey] = useState(null);
//   const [answers, setAnswers] = useState({});

//   useEffect(() => {
//     const fetchSurvey = async () => {
//       try {
//         const { data } = await api.get(`/survey/${surveyId}`);
//         setSurvey(data);
//       } catch (error) {
//         console.error("Failed to load survey", error);
//       }
//     };

//     fetchSurvey();
//   }, [surveyId]);

//   const handleChange = (questionId, value) => {
//     setAnswers((prev) => ({ ...prev, [questionId]: value }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const formatted = Object.entries(answers).map(([questionId, answer]) => ({
//         questionId,
//         answer,
//       }));
//       await api.post(`/response/submit`, { surveyId, responses: formatted });
//       alert("Responses submitted!");
//     } catch (error) {
//       console.error("Failed to submit responses", error);
//       alert("Submission failed");
//     }
//   };

//   if (!survey) return <p>Loading...</p>;

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-2">{survey.title}</h1>
//       <p className="text-gray-600 mb-6">{survey.description}</p>

//       {survey.questions?.map((q) => (
//         <div key={q.id} className="mb-4">
//           <label className="block font-medium mb-1">{q.question}</label>
//           {["text", "number", "date"].includes(q.type) ? (
//             <input
//               type={q.type}
//               value={answers[q.id] || ""}
//               onChange={(e) => handleChange(q.id, e.target.value)}
//               className="border p-2 rounded w-full"
//             />
//           ) : q.type === "rating" ? (
//             <div className="flex gap-2">
//               {[1, 2, 3, 4, 5].map((num) => (
//                 <button
//                   key={num}
//                   onClick={() => handleChange(q.id, num)}
//                   className={`px-3 py-1 rounded border ${
//                     answers[q.id] === num ? "bg-yellow-400 text-white" : "bg-white"
//                   }`}
//                 >
//                   {num}
//                 </button>
//               ))}
//             </div>
//           ) : (
//             <div className="space-y-1">
//               {q.options?.map((opt) => (
//                 <div key={opt.id}>
//                   <label className="flex items-center space-x-2">
//                     <input
//                       type={q.type === "checkbox" ? "checkbox" : "radio"}
//                       name={q.id}
//                       value={opt.value}
//                       checked={
//                         q.type === "checkbox"
//                           ? (answers[q.id] || []).includes(opt.value)
//                           : answers[q.id] === opt.value
//                       }
//                       onChange={(e) => {
//                         if (q.type === "checkbox") {
//                           const prev = answers[q.id] || [];
//                           const updated = e.target.checked
//                             ? [...prev, opt.value]
//                             : prev.filter((v) => v !== opt.value);
//                           handleChange(q.id, updated);
//                         } else {
//                           handleChange(q.id, e.target.value);
//                         }
//                       }}
//                     />
//                     <span>{opt.value}</span>
//                   </label>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}

//       <button
//         onClick={handleSubmit}
//         className="bg-blue-600 text-white px-6 py-2 rounded"
//       >
//         Submit
//       </button>
//     </div>
//   );
// };

// export default TakeSurveyPage;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { FaCheckCircle } from "react-icons/fa";

const TakeSurveyPage = () => {
  const { surveyId } = useParams();
  console.log("aaa", surveyId);

  const [survey, setSurvey] = useState(null);
  const [staff, setStaff] = useState({
    fullName: "",
    email: "",
    role: "",
    department: "",
    joinCode: "",
    organizationId: "",
  });
  const [staffId, setStaffId] = useState(null);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [organizationnId, setOrganizationId] = useState("");
  const [joinCode, setJoinCode] = useState("");


  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const data = await api.get(`/survey/${surveyId}`);
        console.log("data", data);
        setSurvey(data);
        // const orgId = data.data.organization.id
        setOrganizationId(data.data.organization.id);
        setJoinCode(data.data.joinCode)
        console.log("data.organization.id", data.data.organization.id);
      } catch (error) {
        console.error("Failed to load survey", error);
      }
    };
    //qo3ddi
    fetchSurvey();
  }, [surveyId]);

  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("to be submitted", staff);
      const res = await api.post("/staff", {
        ...staff,
        organizationId: organizationnId,
      });
      setStaffId(res.data.id);
    } catch (err) {
      console.error("Error creating staff:", err);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitSurvey = async () => {
    const formattedResponses = Object.entries(responses).map(
      ([questionId, answer]) => {
        const response = { questionId, answer };
        if (typeof answer === "string") response.response = answer;
        if (typeof answer === "number") response.response = answer;
        if (Array.isArray(answer)) response.response = answer;
        return response;
      }
    );

    // try {
    //   await api.post("/staff/submit-response", {
    //     staffId,
    //     responses: formattedResponses,
    //   });
    //   setSubmitted(true);
    //   console.log("response was submitted successfully")
    // } catch (err) {
    //   console.error("Failed to submit survey:", err);
    // }
    try {
      console.log("joinCode:", joinCode);
      console.log("email:", staff.email);
      console.log("surveyId:", surveyId);
      console.log("answer:", formattedResponses);
      await api.post("/staff/submit-response", {
        answer: formattedResponses, // should be an array of { questionId, answer }
        surveyId: surveyId,
        joinCode: joinCode,
        email: staff.email,
      });
      setSubmitted(true);
      console.log("response was submitted successfully");
    } catch (err) {
      console.error("Failed to submit survey:", err);
    }
  };

  if (submitted)
    return (
      <section className="text-[#86BC23] bg-slate-0 h-screen font-semibold text-[20px] flex gap-3 items-center justify-center">
       <div className="w-sceen bg-slate-00 m-0">
         <FaCheckCircle />
        </div>
        <div className="w-sceen bg-slate-00 m-0">
          Survey submitted successfully!
        </div>
      </section>
    );

  if (!survey) return <p>Loading...</p>;

  console.log("this is the survey", survey);

  return (
    <div className="max-w-2xl mx-auto space-y-6 mb-10">
      <div className="bg-pink-00 text-center mt-4 border-b-[#86BC24] border-2 py-3 rounded">
        <h1 className="text-2xl font-bold uppercase">{survey.data.title}</h1>
        {/* <p className="text-gray-600 mb-4">{survey.data.description}</p> */}
      </div>

      {!staffId && (
        <form
          onSubmit={handleStaffSubmit}
          className="sace-y-9 border p-4  bg-slate-00 rounded shadow"
        >
          <h2 className="text-xl font-semibold text-center text-[#86BC24] mb-10 ">
            Personal Information
          </h2>
          <div className="mt-8 font-medium text-[px]">
            <label className="bg-slate-00">Full Name</label>
            <input
              type="text"
              placeholder="Name"
              className="py-2 px-2 w-full mb-3 mt-2 rounded-[5px] border-[1px] text-grey-600 border-gray-300  focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
              value={staff.fullName}
              onChange={(e) => setStaff({ ...staff, fullName: e.target.value })}
            />
          </div>
          <div className="mt-6 font-medium text-[px]">
            <label className="">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="py-2 px-2 w-full mb-3 mt-2 rounded-[5px] border-[1px] text-grey-600 border-gray-300  focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
              value={staff.email}
              onChange={(e) => setStaff({ ...staff, email: e.target.value })}
            />
          </div>
          <div className="mt-6 font-medium text-[px]">
            <label className="">Role</label>
            <input
              type="text"
              placeholder="Role"
              className="py-2 px-2 w-full mb-3 mt-2 rounded-[5px] border-[1px] text-grey-600 border-gray-300  focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
              value={staff.role}
              onChange={(e) => setStaff({ ...staff, role: e.target.value })}
            />
          </div>
          <div className="mt-6 font-medium text-[px]">
            <label className="">Department</label>
            <input
              type="text"
              placeholder="Department"
              className="py-2 px-2 w-full mb-3 mt-2 rounded-[5px] border-[1px] text-grey-600 border-gray-300  focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
              value={staff.department}
              onChange={(e) =>
                setStaff({ ...staff, department: e.target.value })
              }
            />
          </div>
          <div className="mt-6 font-medium text-[16px]">
            <label className="">Join Code</label>
            <input
              type="text"
              placeholder="Join Code"
              className="py-2 px-2 w-full mb-3 mt-2 rounded-[5px] border-[1px] text-grey-600 border-gray-300  focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
              value={staff.joinCode}
              onChange={(e) => setStaff({ ...staff, joinCode: e.target.value })}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#86BC23] text-end  flex justify-end mt-6 font-bold text-[14px] text-white px-4 py-2 rounded"
              >
              Continue to Survey
            </button>
          </div>
        </form>
      )}

      {staffId && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Survey Questions</h2>
          {survey.data.questions.map((q) => (
            <div key={q.id} className="p-4 border rounded shadow">
              <p className="font-medium">{q.question}</p>

              {["text", "email", "number", "date"].includes(q.type) && (
                <input
                  type={q.type}
                  className="w-full p-2 border rounded mt-2 focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                />
              )}

              {q.type === "rating" && (
                <input
                  type="range"
                  color="#86BC23"
                  min="1"
                  max="5"
                  className="w-full mt-2 text-[#86BC23]"
                  onChange={(e) =>
                    handleAnswerChange(q.id, parseInt(e.target.value))
                  }
                />
              )}

              {/* {["multiple_choice", "checkbox", "radio", "dropdown"].includes(q.type) && (
                <div className="mt-2 space-y-2">
                  {q.options.map((opt, i) => (
                    <label key={i} className="flex items-center space-x-2">
                      <input
                        type={q.type}
                        name={`q-${q.id}`}
                        value={opt.value}
                        onChange={(e) => {
                          if (q.type === "checkbox") {
                            setResponses((prev) => {
                              const prevOptions = prev[q.id] || [];
                              return {
                                ...prev,
                                [q.id]: e.target.checked
                                  ? [...prevOptions, opt.value]
                                  : prevOptions.filter((v) => v !== opt.value),
                              };
                            });
                          } else {
                            handleAnswerChange(q.id, opt.value);
                          }
                        }}
                      />
                      <span>{opt.value}</span>
                    </label>
                  ))}
                </div>
              )} */}
              {["multiple_choice", "checkbox", "radio", "dropdown"].includes(
                q.type
              ) && (
                <div className="mt-2 space-y-2">
                  {q.options.map((opt, i) => (
                    <label key={i} className="flex items-center space-x-2">
                      {/* Render checkbox or radio button */}
                      <input
                        type={q.type === "radio" ? "radio" : "checkbox"}
                        name={`q-${q.id}`}
                        value={opt.value}
                        checked={
                          q.type === "checkbox"
                            ? (responses[q.id] || []).includes(opt.value)
                            : responses[q.id] === opt.value
                        }
                        onChange={(e) => {
                          if (q.type === "checkbox") {
                            // For checkboxes, toggle the value
                            setResponses((prev) => {
                              const prevOptions = prev[q.id] || [];
                              return {
                                ...prev,
                                [q.id]: e.target.checked
                                  ? [...prevOptions, opt.value]
                                  : prevOptions.filter((v) => v !== opt.value),
                              };
                            });
                          } else {
                            // For radio buttons, set the value directly
                            handleAnswerChange(q.id, opt.value);
                          }
                        }}
                      />
                      <span>{opt.value}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="flex items-end">
            <button
              onClick={handleSubmitSurvey}
              className="bg-[#86BC23] flex items-end text-white px-4 py-2 rounded"
            >
              Submit Survey
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeSurveyPage;
