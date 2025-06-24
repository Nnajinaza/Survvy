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
        console.log("Updated survey:", updatedSurvey.data); // Log the updated survey data
      } else {
        console.log("Creating new survey:", formData); // Log the form data before creating a new survey
        const newSurvey = await api.post("/survey", formData);
        console.log("New survey created:", newSurvey.data); // Log the new survey data
      }
      fetchSurveys();
      setIsFormModalOpen(false);
      setSelectedSurvey(null); // Reset selected survey after submission
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title"
            className="border px-3 py-2 rounded w-full max-w-sm relative focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>

        {/* <h2 className="text-2xl font-bold">Surveys</h2> */}
        <button
          onClick={() => setIsFormModalOpen(true)}
          className="bg-[#86BC24] text-white px-4 py-2 rounded font-medium"
        >
          Add New Surveys
          <FaPlusCircle className="ml-4 inline" />
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="h-[360px] overflow-auto">
            <table className="min-w-full table-auto border">
              <thead>
                <tr className="bg-gray-200 text-gray-800 text-sm uppercase font-bold text-left py-4 ">
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
                    className="border-b hover:bg-gray-100 font-[600]  text-base"
                  >
                    <td className="px-4 text-sm font-medium py-2">
                      {survey.title}
                    </td>
                    <td className="px-4 text-sm font-medium py-2">
                      {survey.description}
                    </td>
                    <td className="px-4 text-sm font-medium py-2">
                      {survey.isActive ? "Yes" : "No"}
                    </td>
                    <td className="px-4 text-sm font-medium py-2">
                      {survey.joinCode}
                    </td>
                    <td className="px-4 text-sm font-medium py-2">
                      {survey.organization.name}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <ActionMenu
                        onEdit={() => handleEdit(survey)}
                        onView={() => handleView(survey)} // you can replace this with real view logic
                        onDelete={() => handleDelete(survey)}
                        // onShare={() => handleShare(survey)}
                      />{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-200"
              }`}
            >
              <FaAngleDoubleLeft className="ml-2 inline " /> 
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-[#86BC24] text-white"
                    : "bg-gray-200"
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
              <FaAngleDoubleRight className="ml-2 inline" />
            </button>
          </div>
        </>
      )}

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
        // staffEmails={surveys.organization.staffs.map((staff) => staff.email)}
      />
    </div>
  );
};

export default SurveyModule;
