import { useEffect, useState } from "react";
import api from "../../api/api";
import { FaArrowAltCircleDown, FaArrowAltCircleUp, FaPlusCircle, FaTrashAlt } from "react-icons/fa";

const ManageSurveyQuestions = ({ surveyId }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/survey/${surveyId}`);
        setQuestions(res.data.questions || []);
      } catch (error) {
        console.error("Failed to fetch survey questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [surveyId]);

  const handleQuestionChange = (index, key, value) => {
    const updated = [...questions];
    updated[index][key] = value;
    setQuestions(updated);
  };

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        type: "text",
        options: [],
        isNew: true,
      },
    ]);
  };

  const deleteQuestion = async (index) => {
    const questionToDelete = questions[index];

  // If it's a saved question in the DB
  if (questionToDelete.id) {
    try {
      await api.delete(`/question/${questionToDelete.id}`);
    } catch (error) {
      console.error("Failed to delete question from backend:", error);
      return;
    }
  }
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const moveQuestion = (index, direction) => {
    const updated = [...questions];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= questions.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options || [];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const deleteOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(oIndex, 1);
    setQuestions(updated);
  };

  const submitAll = async () => {
    try {
      const preparedQuestions = questions.map((q) => {
        const base = {
          id: q.id,
          question: q.question,
          type: q.type,
          surveyId,
        };

        if (
          ["multiple_choice", "checkbox", "radio", "dropdown"].includes(q.type)
        ) {
          const cleanedOptions = (q.options || []).map((opt) =>
            typeof opt === "string" ? opt : opt.value
          );
          return { ...base, options: cleanedOptions };
        }

        return base;
      });

      const submittedData = await api.post(`/question/bulk-questions`, preparedQuestions);
      const res = await api.get(`/survey/${surveyId}`);
      setShowSuccessModal(true);
      setQuestions(res.data.questions || []);
      console.log(submittedData.status)

      // setQuestions([submittedData.data])
    } catch (err) {
      console.error("Error submitting questions", err);
    }
  };

  if (loading) return <p>Loading questions...</p>;

  return (
    <div className="space-y-12 mx-4 my-4">
      {questions.map((q, index) => (
        <div key={index} className="p-4 border rounded shadow relative">
          <div className="flex justify-between items-center mb-2">
            <strong>Question {index + 1}</strong>
            <div className="space-x-2">
              <button onClick={() => moveQuestion(index, -1)} disabled={index === 0}>
                <FaArrowAltCircleUp/>
              </button>
              <button onClick={() => moveQuestion(index, 1)} disabled={index === questions.length - 1}>
                <FaArrowAltCircleDown />
              </button>
              <button onClick={() => deleteQuestion(index)} className="text-red-600">
                <FaTrashAlt />
              </button>
            </div>
          </div>
          <input
            type="text"
            className="w-full p-2 border rounded mb-2"
            value={q.question}
            onChange={(e) =>
              handleQuestionChange(index, "question", e.target.value)
            }
            placeholder="Question text"
          />
          <select
            className="w-full p-2 border rounded mb-2"
            value={q.type}
            onChange={(e) =>
              handleQuestionChange(index, "type", e.target.value)
            }
          >
            <option value="text">Text</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio</option>
            <option value="dropdown">Dropdown</option>
            <option value="rating">Rating</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
          </select>

          {["multiple_choice", "checkbox", "radio", "dropdown"].includes(
            q.type
          ) && (
            <div className="space-y-2">
              <p className="font-semibold">Options:</p>
              {q.options?.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={typeof opt === "string" ? opt : opt.value}
                    onChange={(e) =>
                      handleOptionChange(index, oIndex, e.target.value)
                    }
                  />
                  <button
                    onClick={() => deleteOption(index, oIndex)}
                    className="text-red-500 px-2 border rounded py-3"
                  >
                <FaTrashAlt />
                </button>
                </div>
              ))}
              <button
                onClick={() => addOption(index)}
                className="text-sm text-blue-600"
              >
                + Add Option
              </button>
            </div>
          )}
        </div>
      ))}
      <div>
        <button
          onClick={addNewQuestion}
          className="bg-[#86bc23] text-white font-medium px-4 py-2 rounded"
        >
          <FaPlusCircle className="inline text-center mr-2" /> Add Question
        </button>
        <button
          onClick={submitAll}
          className="bg-blue-600 text-white font-medium px-4 py-2 rounded ml-4"
        >
          Save All
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

export default ManageSurveyQuestions;
