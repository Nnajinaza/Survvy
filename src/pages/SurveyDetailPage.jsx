import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import CreateSurveyQuestions from "../components/Survey/CreateSurveyQuestions";
import ManageSurveyQuestions from "../components/Survey/ManageSurveyQuestion";
import ShareSurveyModal from "../components/Organization/ShareSurveyComponent";
import ResponseSection from "../components/Survey/ResponseSection";
import SurveyHeader from "../components/Survey/SurveyHeader";


const SurveyDetailPage = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSection, setShowSection] = useState(1);

  const handleChange = (nos) => {
    setShowSection(nos);
  };

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
  <div className="py-6 px-4 sm:px-6 md:px-8">
    <SurveyHeader
      survey={survey}
      showSection={showSection}
      handleChange={handleChange}
      handleShare={handleShare}
    />

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
      <div className="pt-4">
        <ResponseSection surveyId={id} />
        {/* You can add response visualizations, charts, etc. here */}
      </div>
    )}

    {/* Share Modal */}
    <ShareSurveyModal
      isOpen={showShareModal}
      onClose={() => setShowShareModal(false)}
      survey={survey}
      staffEmails={survey.organization?.staffs?.map((staff) => staff.email) || []}
    />
  </div>
);

  // return (
  //   <div className="py-6 px-">
  //     <SurveyHeader survey={survey} showSection={showSection} handleChange={handleChange} handleShare={handleShare}/>
  //     {showSection === 1 && (
  //       <>
  //         {survey.questions.length === 0 ? (
  //           <div className="pt-4 mt-4">
  //             <CreateSurveyQuestions surveyId={id} />
  //           </div>
  //         ) : (
  //           <ManageSurveyQuestions surveyId={id} />
  //         )}
  //       </>
  //     )}
  //     {showSection === 2 && (
  //       <div className="">
  //         <ResponseSection surveyId={id} />
  //         {/* You can add response components here */}
  //       </div>
  //     )}{" "}
  //     <ShareSurveyModal
  //       isOpen={showShareModal}
  //       onClose={() => setShowShareModal(false)}
  //       survey={survey}
  //       staffEmails={survey.organization.staffs.map((staff) => staff.email)}
  //     />
  //   </div>
  // );
};

export default SurveyDetailPage;
