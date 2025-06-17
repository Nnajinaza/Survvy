import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import CreateSurveyQuestions from "../components/Survey/CreateSurveyQuestions";
import { FaArrowLeft } from "react-icons/fa";
import ManageSurveyQuestions from "../components/Survey/ManageSurveyQuestion";
import ShareSurveyModal from "../components/Organization/ShareSurveyComponent";
import ResponseSection from "../components/Survey/ResponseSection";

const SurveyDetailPage = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSection, setShowSection] = useState(1);

  const handleChange = (nos) => {
    setShowSection(nos);
  };

  // const navigate = useNavigate();

  // const { id } = useParams();

  // const handleRoute = () => {
  //   navigate("/dashboard");
  // };

  const handleShare = (survey) => {
    setShowShareModal(true);
  };

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        console.log("id", id);
        const response = await api.get(`/survey/${id}`);
        console.log("survee", response);
        setSurvey(response.data);
      } catch (error) {
        console.error("Failed to fetch survey:", error);
      }
    };

    if (id) fetchSurvey();
  }, [id]);

  if (!survey) return <div>Loadingggg...</div>;

  return (
    <div className="py-6 mx-">
      <div className="mb border-b pb-3 flex item-center justify-between shadow-sm px-4">
        <div className="flex items-center gap-3 mb-2">
          <Link
            to="/dashboard"
            className="text-[#86BC23] text-base uppercase font-medium hover:underline flex items-center gap-1"
          >
            {/* <FaArrowLeft /> */}
            Dashboard
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold uppercase text-gray-800">
            {survey.title}:
          </h1>
          <p className="text-gray-600 text-lg uppercase font-medium">
            {survey.description}
          </p>
        </div>
        <div className="gap-8">
          <button
            className={`text-sm font-medium px-3 py-2 rounded ${
              showSection === 1
                ? "bg-[#86BC23] text-white"
                : "bg-[#86BC23]/40 "
            }`}
            onClick={() => handleChange(1)}
          >
            Surveys
          </button>
          <button
            className="bg-[#86BC23]/40 text-sm ml-2 font-medium px-3 py-2  rounded hover:bg-[#86BC23] focus:bg-[#86BC23]"
            onClick={() => handleShare(survey)}
          >
            Share Survey
          </button>
          <button
            className={`text-sm font-medium px-3 py-2 ml-2 rounded ${
              showSection === 2
                ? "bg-[#86BC23] text-white"
                : "bg-[#86BC23]/40 "
            }`}
            onClick={() => handleChange(2)}
          >
            View Response
          </button>
        </div>
      </div>
      {showSection === 1 && (
        <>
          {survey.questions.length === 0 ? (
            <div className="pt-4 mt-4">
              <CreateSurveyQuestions surveyId={id} />
            </div>
          ) : (
            <ManageSurveyQuestions surveyId={id} />
          )}
        </>
      )}
      {showSection === 2 && (
        <div className="">
          <ResponseSection surveyId={id} />
          {/* You can add response components here */}
        </div>
      )}{" "}
      <ShareSurveyModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        survey={survey}
        staffEmails={survey.organization.staffs.map((staff) => staff.email)}
      />
    </div>
  );
};

export default SurveyDetailPage;
