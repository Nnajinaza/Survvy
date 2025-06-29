import { useEffect, useState } from "react";
import ActionMenu from "../../utils/ActionMenu";
import api from "../../api/api";
import SurveyFormModal from "../../utils/Modals/SurveyFormModal";
import ConfirmDeleteModal from "../../utils/Modals/ConfirmDeleteModal";
import ShareSurveyModal from "./ShareSurveyComponent";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SurveyList = ({ surveys, orgName, staffs }) => {
  const [surveyList, setSurveyList] = useState(surveys);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    setTotalPages(Math.ceil(surveyList.length / itemsPerPage));
  }, [surveyList]);

  const paginatedSurveys = surveyList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (survey) => {
    navigate(`/survey/${survey.id}`);
  };

  const handleEdit = (survey) => {
    setSelectedSurvey(survey);
    setIsFormModalOpen(true);
  };

  const handleShare = (survey) => {
    setSelectedSurvey(survey);
    setShowShareModal(true);
  };

  const handleDelete = (survey) => {
    setSelectedSurvey(survey);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/survey/${selectedSurvey.id}`);
      const updatedList = surveyList.filter(s => s.id !== selectedSurvey.id);
      setSurveyList(updatedList);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting survey:", error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedSurvey) {
        await api.patch(`/survey/${selectedSurvey.id}`, formData);
      } else {
        const response = await api.post("/survey", formData);
        setSurveyList(prev => [...prev, response.data]);
      }
      setIsFormModalOpen(false);
      setSelectedSurvey(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="mt-12 mx-4 h-auto">
      <div className="overflow-x-auto border rounded-md shadow-sm h-[700px]" >
        <table className="min-w-full table-auto text-sm text-left ">
          <thead className="bg-gray-100 text-gray-600 uppercase font-bold">
            <tr>
              <th className="px-4 py-2 border-b">Title</th>
              <th className="px-4 py-2 border-b">Description</th>
              <th className="px-4 py-2 border-b">Active</th>
              <th className="px-4 py-2 border-b"> <span className="hidden">JOIN</span> Code</th>
              <th className="px-4 py-2 border-b">Organization</th>
              <th className="px-4 py-2 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSurveys.map((survey) => (
              <tr key={survey.id} className="border-b hover:bg-gray-100 font-medium">
                <td className="px-4 py-2">{survey.title}</td>
                <td className="px-4 py-2">{survey.description}</td>
                <td className="px-4 py-2">{survey.isActive ? "Yes" : "No"}</td>
                <td className="px-4 py-2">{survey.joinCode}</td>
                <td className="px-4 py-2">{orgName}</td>
                <td className="px-4 py-2 text-center">
                  <ActionMenu
                    onEdit={() => handleEdit(survey)}
                    onView={() => handleView(survey)}
                    onDelete={() => handleDelete(survey)}
                    onShare={() => handleShare(survey)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200"}`}
        >
          <FaAngleDoubleLeft />
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-[#86BC24] text-white" : "bg-gray-200"}`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200"}`}
        >
          <FaAngleDoubleRight />
        </button>
      </div>

      <SurveyFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        defaultValues={selectedSurvey}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        name={selectedSurvey?.title}
      />

      <ShareSurveyModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        survey={selectedSurvey}
        staffEmails={staffs.map((staff) => staff.email)}
      />
    </div>
  );
};

export default SurveyList;
