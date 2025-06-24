import { useState } from "react";
import ActionMenu from "../../utils/ActionMenu";
import api from "../../api/api";
import SurveyFormModal from "../../utils/Modals/SurveyFormModal";
import ConfirmDeleteModal from "../../utils/Modals/ConfirmDeleteModal";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import ShareSurveyModal from "./ShareSurveyComponent";
import { useNavigate } from "react-router-dom";

const SurveyList = ({ surveys, orgName, staffs }) => {
  const [survey, setSurveys] = useState(surveys);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  // const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [setLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const itemsPerPage = 10;

  const navigate = useNavigate();
  
  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const response = survey;

      const allSurveys = response.data || [];

      // Apply frontend pagination manually
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedSurveys = allSurveys.slice(
        startIndex,
        startIndex + itemsPerPage
      );

      setSurveys(paginatedSurveys);
      setTotalPages(Math.ceil(allSurveys.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching surveys:", error);
    } finally {
      setLoading(false);
    }
  };

  const id = survey.id

  const handleView = () => {
    navigate(`/survey/${id}`);
  }  

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
      fetchSurveys();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting survey:", error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedSurvey) {
        await api.patch(
          `/survey/${selectedSurvey.id}`,
          formData
        );
      } else {
        await api.post("/survey", formData);
      }
      fetchSurveys();
      setIsFormModalOpen(false);
      setSelectedSurvey(null); // Reset selected survey after submission
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="mt-6">
      {/* <h3 className="text-lg font-semibold mb-2">Surveys</h3> */}
      <ul className="list-disc pl-6 h-[500px]">
        <table className="min-w-full table-auto border">
          <thead>
            <tr className="bg-gray-200 text-gray-600 text-sm uppercase font-bold text-left py-4 ">
              <th className="px-4 py-2 border-b">Title</th>
              <th className="px-4 py-2 border-b">Description</th>
              <th className="px-4 py-2 border-b">Active</th>
              <th className="px-4 py-2 border-b">Join Code</th>
              <th className="px-4 py-2 border-b">Organization</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((survey) => (
              <tr
                key={survey.id}
                className="border-b hover:bg-gray-100 font-[600] text-gray-800 text-base"
              >
                <td className="px-4 py-2">{survey.title}</td>
                <td className="px-4 py-2">{survey.description}</td>
                <td className="px-4 py-2">{survey.isActive ? "Yes" : "No"}</td>
                <td className="px-4 py-2">{survey.joinCode}</td>
                <td className="px-4 py-2">{orgName}</td>
                <td className="px-4 py-2 text-center">
                  <ActionMenu
                    onEdit={() => handleEdit(survey)}
                    onView={() => handleView(id)} // you can replace this with real view logic
                    onDelete={() => handleDelete(survey)}
                    onShare={() => handleShare(survey)}
                  />{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ul>
      <div className="flex justify-end items-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200"
          }`}
        >
          {/* Prev */}
          <FaAngleDoubleLeft className=" text-center flex justify-center my-1" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-[#86BC24] text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-200"
          }`}
        >
          {/* Next */}
          <FaAngleDoubleRight className="flex justify-center my-1" />
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
