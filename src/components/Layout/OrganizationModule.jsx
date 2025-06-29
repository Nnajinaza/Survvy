import React, { useState, useEffect } from "react";
import OrganizationFormModal from "../../utils/Modals/OrganizationFormModal";
import ConfirmDeleteModal from "../../utils/Modals/ConfirmDeleteModal";
import api from "../../api/api";
import ActionMenu from "../../utils/ActionMenu";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrganizationModule = () => {
  const [organizations, setOrganizations] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  // const [setShowShareModal] = useState(false);

  const itemsPerPage = 10;

  const navigate = useNavigate();

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await api.get("/organizations", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
        },
      });

      // Apply frontend pagination manually
      const allOrganizations = response.data.data;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedOrganizations = allOrganizations.slice(
        startIndex,
        startIndex + itemsPerPage
      );
      setOrganizations(paginatedOrganizations);
      setTotalPages(Math.ceil(response.data.total / itemsPerPage));
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [searchTerm, currentPage]);

  const handleView = (org) => {
    navigate(`/organizations/${org.id}`);
  };

  // const handleShare = (organization) => {
  //   setSelectedOrg(organization);
  //   setShowShareModal(true);
  // };

  const handleEdit = (org) => {
    setSelectedOrg(org);
    setIsFormModalOpen(true);
  };

  const handleDelete = (org) => {
    setSelectedOrg(org);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/organizations/${selectedOrg.id}`);
      fetchOrganizations(); // Refresh the list after deletion
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting organization:", error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedOrg) {
        // Update organization
        const updatedOrg = await api.patch(
          `/organizations/${selectedOrg.id}`,
          formData
        );
        console.log("Updated organization:", updatedOrg.data);
      } else {
        // Create new organization
        await api.post("/organizations", formData);
      }
      fetchOrganizations();
      setIsFormModalOpen(false);
      setSelectedOrg(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsFormModalOpen(false);
      setSelectedOrg(null);
      alert("Error submitting form. Please try again.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

return (
  <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
    {/* Search & Add Section */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <input
        type="text"
        placeholder="Search by organization name"
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full max-w-[400px] sm:w-auto flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#86BC24]"
      />
      <button
        onClick={() => setIsFormModalOpen(true)}
        className="flex items-center gap-2 bg-[#86BC24] text-white px-4 py-2 rounded-md font-medium hover:bg-[#76a81e] transition"
      >
        <FaPlusCircle />
        Add New Organization
      </button>
    </div>

    {/* Table or Loader */}
    {loading ? (
      <div className="flex justify-center items-center gap-3 h-40 text-gray-700 text-sm font-medium">
        <svg className="animate-spin h-5 w-5 text-[#86BC24]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        Loading organization data, please wait...
      </div>
    ) : (
      <div className="flex flex-col h-full">
      <div className="w-full overflow-x-auto flex-1 overflow-y-auto">
        {/* Responsive Table */}
        <div className="min-w-[800px] lg:min-w-full border rounded-lg shadow-sm h-[500px]">
          <table className="w-full table-auto text-xs sm:text-sm text-left ">
            <thead className="bg-gray-100 text-gray-700 uppercase font-bold">
              <tr>
                <th className="px-3 sm:px-4 py-2 border-b">Name</th>
                <th className="px-3 sm:px-4 py-2 border-b">Description</th>
                <th className="px-3 sm:px-4 py-2 border-b">Staff Number</th>
                <th className="px-3 sm:px-4 py-2 border-b">Sector</th>
                <th className="px-3 sm:px-4 py-2 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50 border-b">
                  <td className="px-3 sm:px-4 py-2 font-medium">{org.name}</td>
                  <td className="px-3 sm:px-4 py-2">{org.description}</td>
                  <td className="px-3 sm:px-4 py-2">{org.staffNumber}</td>
                  <td className="px-3 sm:px-4 py-2">{org.sector}</td>
                  <td className="px-3 sm:px-4 py-2 text-center">
                    <ActionMenu
                      onEdit={() => handleEdit(org)}
                      onView={() => handleView(org)}
                      onDelete={() => handleDelete(org)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap justify-end items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            <FaAngleDoubleLeft />
          </button>

          {Array.from({ length: totalPages }, (_, i) => {
            const page = i + 1;
            const showPage =
              page >= Math.max(1, currentPage - 2) &&
              page <= Math.min(totalPages, currentPage + 2);
            return showPage ? (
              <button
                key={`page-${page}`}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded border ${
                  currentPage === page
                    ? "bg-[#86BC24] text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ) : null;
          })}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            <FaAngleDoubleRight />
          </button>
        </div>
      </div>
      </div>
    )}

    {/* Modals */}
    <OrganizationFormModal
      isOpen={isFormModalOpen}
      onClose={() => setIsFormModalOpen(false)}
      onSubmit={handleFormSubmit}
      defaultValues={selectedOrg}
    />
    <ConfirmDeleteModal
      isOpen={isDeleteModalOpen}
      onCancel={() => setIsDeleteModalOpen(false)}
      onConfirm={handleDeleteConfirm}
      name={selectedOrg?.name}
    />
  </div>
);

  // return (
  //   <div className="">
  //     <div className="mb-4 flex justify-between items-center gap-4 ">
  //       {/* <h1 className="text-2xl font-bold mb-4">Organizations</h1> */}
  //       <input
  //         type="text"
  //         placeholder="Search by organization name"
  //         value={searchTerm}
  //         onChange={handleSearchChange}
  //         className="px-3 py-2 border rounded-sm"
  //       />
  //       <button
  //         onClick={() => setIsFormModalOpen(true)}
  //         className="bg-[#86BC24] text-white px-4 py-2 rounded font-medium"
  //       >
  //         Add New Organization
  //         <FaPlusCircle className="ml-4 inline" />
  //       </button>
  //     </div>

  //     {loading ? (
  //       <div>Loading...</div>
  //     ) : (
  //       <>
  //         <table className="min-w-full table-auto border mt-8">
  //           <thead>
  //             <tr className="bg-gray-200 text-gray-800 text-sm uppercase font-bold text-left py-4 ">
  //               <th className="px-4 py-2 border-b">Name</th>
  //               <th className="px-4 py-2 border-b">Description</th>
  //               <th className="px-4 py-2 border-b">Staff Number</th>
  //               <th className="px-4 py-2 border-b">Sector</th>
  //               <th className="px-4 py-2 border-b">Actions</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {organizations.map((org) => (
  //               <tr key={org.id} className="border-b hover:bg-gray-100">
  //                 <td className="px-4 text-sm font-medium py-2  ">
  //                   {org.name}
  //                 </td>
  //                 <td className="px-4 text-sm font-medium py-2 ">
  //                   {org.description}
  //                 </td>
  //                 <td className="px-4 text-sm font-medium py-2 ">
  //                   {org.staffNumber}
  //                 </td>
  //                 <td className="px-4 text-sm font-medium py-2 ">
  //                   {org.sector}
  //                 </td>
  //                 <td className="py-2 px-4 text-sm font-medium  gap-2">
  //                   <ActionMenu
  //                     onEdit={() => handleEdit(org)}
  //                     onView={() => handleView(org)}
  //                     onDelete={() => handleDelete(org)}
  //                     // onShare={() => handleShare(org)}
  //                   />{" "}
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //         <div className="flex justify-end items-end bg-slate-00 mt-60 gap-2">
  //           <button
  //             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
  //             disabled={currentPage === 1}
  //             className={`px-3 py-1 rounded ${
  //               currentPage === 1
  //                 ? "bg-gray-300 cursor-not-allowed"
  //                 : "bg-gray-200"
  //             }`}
  //           >
  //            <FaAngleDoubleLeft className="ml-2 inline"/>
  //           </button>

  //           {Array.from({ length: totalPages }, (_, i) => {
  //             const startPage = Math.max(1, currentPage - 2);
  //             const endPage = Math.min(totalPages, currentPage + 2);
  //             if (i + 1 >= startPage && i + 1 <= endPage) {
  //               return (
  //                 <button
  //                   key={`page-${i}`}
  //                   onClick={() => setCurrentPage(i + 1)}
  //                   className={`px-3 py-1 rounded ${
  //                     currentPage === i + 1
  //                       ? "bg-[#86BC24] text-white"
  //                       : "bg-gray-200"
  //                   }`}
  //                 >
  //                   {i + 1}
  //                 </button>
  //               );
  //             }
  //             return (null);
  //           })}

  //           <button
  //             onClick={() =>
  //               setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  //             }
  //             disabled={currentPage === totalPages}
  //             className={`px-3 py-1 rounded ${
  //               currentPage === totalPages
  //                 ? "bg-gray-300 cursor-not-allowed"
  //                 : "bg-gray-200"
  //             }`}
  //           >
              
  //             <FaAngleDoubleRight className="ml-2 inline" />
  //           </button>
  //         </div>
  //       </>
  //     )}

  //     {/* Pagination */}
  //     {/* <div className="flex justify-center mt-4 gap-2">
  //       {Array.from({ length: totalPages }, (_, i) => (
  //         <button
  //           key={i}
  //           className={`px-3 py-1 rounded ${
  //             currentPage === i + 1 ? "bg-[#86BC24] text-white" : "bg-gray-200"
  //           }`}
  //           onClick={() => setCurrentPage(i + 1)}
  //         >
  //           refre {i + 1}
  //         </button>
  //       ))}
  //     </div> */}

  //     {/* Modals */}
  //     <OrganizationFormModal
  //       isOpen={isFormModalOpen}
  //       onClose={() => setIsFormModalOpen(false)}
  //       onSubmit={handleFormSubmit}
  //       defaultValues={selectedOrg}
  //     />
  //     <ConfirmDeleteModal
  //       isOpen={isDeleteModalOpen}
  //       onCancel={() => setIsDeleteModalOpen(false)}
  //       onConfirm={handleDeleteConfirm}
  //       name={selectedOrg?.name}
  //     />
  //   </div>
  // );
};

export default OrganizationModule;
