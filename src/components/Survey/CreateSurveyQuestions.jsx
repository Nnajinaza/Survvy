import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import api from "../../api/api";
import ManageSurveyQuestions from "./ManageSurveyQuestion";

const QUESTION_TYPES = [
  "text",
  "multiple_choice",
  "radio",
  "checkbox",
  "dropdown",
  "date",
  "number",
  "rating",
];

const defaultQuestion = () => ({
  id: uuidv4(),
  question: "",
  type: "text",
  options: [],
});

const CreateSurveyQuestions = ({ onSubmit, surveyId }) => {
  const [questions, setQuestions] = useState([defaultQuestion()]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

 
  const handleChange = (id, field, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (id, index, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === index ? value : opt)),
            }
          : q
      )
    );
  };

  const addOption = (id) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, options: [...(q.options || []), ""] } : q
      )
    );
  };

  const removeOption = (qId, oIndex) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? { ...q, options: q.options.filter((_, i) => i !== oIndex) }
          : q
      )
    );
  };
  const removeQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const moveQuestion = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= questions.length) return;
    const updated = [...questions];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, defaultQuestion()]);
  };

//   const handleSubmit = () => {
//     const formatted = questions.map((q) => ({
//       question: q.question,
//       type: q.type,
//       options: q.options?.filter((o) => o) || [],
//       surveyId,
//     }));
//     onSubmit(formatted);
//   };

  const handleSubmit = async () => {
    const payload = {
      questions: questions.map((q) => ({
        question: q.question,
        type: q.type,
        options: q.options.filter(Boolean),
        surveyId,
      })),
    };
  
    try {
      const response = await api.post("/question/bulk", payload);
      console.log("Submitted questions:", response.data);
      setShowSuccessModal(true);
      setQuestions([defaultQuestion()])
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };
  

  return (
    <div className="space-y-6 mx-40">
      {questions.map((q, index) => (
        <div key={q.id} className="border p-4 rounded shadow">
          <input
            type="text"
            placeholder="Enter question"
            className="w-full p-2 border rounded mb-2 border-gray-300  focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
            value={q.question}
            onChange={(e) => handleChange(q.id, "question", e.target.value)}
          />

          <select
            value={q.type}
            className="p-2 border rounded mb-2 w-full focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
            onChange={(e) => handleChange(q.id, "type", e.target.value)}
          >
            {QUESTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, " ")}
              </option>
            ))}
          </select>

          {["multiple_choice", "radio", "checkbox", "dropdown"].includes(
            q.type
          ) && (
            <div>
              {q.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    className="w-full p-2 border rounded mb-2 border-gray-300  focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(q.id, i, e.target.value)
                    }
                  />
                  <button
                    onClick={() => removeOption(q.id, i)}
                    className="text-red-500 hover:text-red-700 border py-3 mb-2 px-4 rounded"
                    title="Delete Option"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addOption(q.id)}
                className="text-sm text-blue-500"
              >
                + Add Option
              </button>
            </div>
          )}

          <div className="flex justify-between mt-3">
            <button
              onClick={() => moveQuestion(index, index - 1)}
              disabled={index === 0}
              className="text-sm text-gray-600"
            >
              ↑ Move Up
            </button>
            <button
              onClick={() => moveQuestion(index, index + 1)}
              disabled={index === questions.length - 1}
              className="text-sm text-gray-600"
            >
              ↓ Move Down
            </button>
            <button
              onClick={() => removeQuestion(q.id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <div className="text-end">
        <button
          onClick={addQuestion}
          className="hover:bg-[#86BC23] bg-slate-100 hover:text-white px-4 py-2 rounded mr-4 font-medium gap-4 "
        >
          Add Question
        </button>

        <button
          onClick={handleSubmit}
          className="bg-[#86bc23]/40 hover:bg-[#86BC23] hover:text-white px-4 py-2 rounded mt-4 font-medium"
        >
          Save Questions
        </button>
      </div>
      {showSuccessModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-[400px] text-center animate-fadeIn">
          <h2 className="text-xl font-bold text-green-600 mb-2">
            🎉 Question Submitted!
          </h2>
          <p className="text-gray-700 mb-4">Your question has been successfully added.</p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setShowManageModal(true)
                // trigger open manage modal here
              }}
              className="bg-[#86BC23] hover:bg-[#76aa1f] text-white px-4 py-2 rounded"
              >
              {showManageModal === true && (<ManageSurveyQuestions surveyId={surveyId} />)}
              Manage Questions
            </button>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    </div>
  );
};

export default CreateSurveyQuestions;
