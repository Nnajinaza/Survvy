import React, { useState, useEffect } from "react";
import api from "../../api/api";
import SurveyFormModal from "../../utils/Modals/SurveyFormModal";
import ConfirmDeleteModal from "../../utils/Modals/ConfirmDeleteModal";
import ActionMenu from "../../utils/ActionMenu";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaPlusCircle,
  FaSearch,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ShareSurveyModal from "../Organization/ShareSurveyComponent";

const SurveyModule = () => {
  const [surveys, setSurveys] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const navigate = useNavigate();

  const itemsPerPage = 10;

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const response = await api.get("/survey", {
        params: {
          search: searchTerm,
        },
      });

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

  useEffect(() => {
    fetchSurveys();
  }, [searchTerm, currentPage]);

  const handleEdit = (survey) => {
    setSelectedSurvey(survey);
    setIsFormModalOpen(true);
  };

  const handleShare = (survey) => {
    setSelectedSurvey(survey);
    setShowShareModal(true);
  };

  const handleView = (survey) => {
    navigate(`/survey/${survey.id}`);
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
        const updatedSurvey = await api.patch(
          `/survey/${selectedSurvey.id}`,
          formData
        );
      } else {
        const newSurvey = await api.post("/survey", formData);
      }
      fetchSurveys();
      setIsFormModalOpen(false);
      setSelectedSurvey(null); // Reset selected survey after submission
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

return (
  <div className="w-full px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div className="relative w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search by title"
          className="border px-3 py-2 pr-10 rounded w-full max-w-sm focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
      </div>

      <button
        onClick={() => setIsFormModalOpen(true)}
        className="flex items-center gap-2 bg-[#86BC24] text-white px-4 py-2 rounded font-medium whitespace-nowrap"
      >
        Add New Survey
        <FaPlusCircle />
      </button>
    </div>

    {loading ? (
      <div className="flex justify-center items-center gap-2 text-gray-600 text-base font-medium py-12">
        <svg className="animate-spin h-5 w-5 text-[#86BC24]" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Loading surveys...
      </div>
    ) : (
      <>
        <div className="overflow-x-auto border rounded-md h-[500px]">
          <table className="min-w-full table-auto text-sm ">
            <thead>
              <tr className="bg-gray-200 text-gray-800 text-xs sm:text-sm uppercase font-bold">
                <th className="px-3 sm:px-4 py-2 border-b">Title</th>
                <th className="px-3 sm:px-4 py-2 border-b">Description</th>
                <th className="px-3 sm:px-4 py-2 border-b">Active</th>
                <th className="px-3 sm:px-4 py-2 border-b">Join Code</th>
                <th className="px-3 sm:px-4 py-2 border-b">Organization</th>
                <th className="px-3 sm:px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-gray-100 border-b text-[15px]">
                  <td className="px-4 py-2">{survey.title}</td>
                  <td className="px-4 py-2 text-clip ">{survey.description}</td>
                  <td className="px-4 py-2">{survey.isActive ? "Yes" : "No"}</td>
                  <td className="px-4 py-2">{survey.joinCode}</td>
                  <td className="px-4 py-2">{survey.organization.name}</td>
                  <td className="px-4 py-2 text-center">
                    <ActionMenu
                      onEdit={() => handleEdit(survey)}
                      onView={() => handleView(survey)}
                      onDelete={() => handleDelete(survey)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-wrap justify-end items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200"
            }`}
          >
            <FaAngleDoubleLeft className="inline" />
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200"
            }`}
          >
            <FaAngleDoubleRight className="inline" />
          </button>
        </div>
      </>
    )}

    {/* Modals */}
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
      survey={surveys}
    />
  </div>
);
};

export default SurveyModule;
