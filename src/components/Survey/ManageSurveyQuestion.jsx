import { useEffect, useState } from "react";
import api from "../../api/api";
import { FaAngleDown, FaArrowAltCircleDown, FaArrowAltCircleUp, FaPlusCircle, FaTrashAlt } from "react-icons/fa";

const ManageSurveyQuestions = ({ surveyId }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const deleteQuestion = (index) => {
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

      await api.post(`/question/bulk-questions`, preparedQuestions);
      alert("Questions saved!");
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
  );
};

export default ManageSurveyQuestions;
