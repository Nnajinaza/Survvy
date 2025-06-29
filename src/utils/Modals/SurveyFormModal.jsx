import { useState, useEffect } from "react";
import api from "../../api/api";

const SurveyFormModal = ({ isOpen, onClose, onSubmit, defaultValues }) => {
  const [organizations, setOrganizations] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isActive: false,
    organization: "",
  });
    const [searchTerm] = useState("");
    const [currentPage] = useState(1);
  const itemsPerPage = 10;
  // const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    if (defaultValues) {
      setFormData({
        title: defaultValues.title || "",
        description: defaultValues.description || "",
        isActive: defaultValues.isActive || false,
        joinCode: defaultValues.joinCode || "",
        organization: defaultValues.organization || "",
      });
    }
  }, [defaultValues]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await api.get("/organizations", {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
          },
        });
          setOrganizations(response.data.data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchOrganizations();
  }, [currentPage, searchTerm]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-2 sm:px-4">
    <div className="bg-white w-full max-w-sm sm:max-w-md md:max-w-xl p-4 sm:p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
      <h2 className="text-lg sm:text-xl font-bold mb-6 text-center">
        {defaultValues ? "Edit Survey" : "Create New Survey"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 font-semibold text-sm sm:text-base">
        <div>
          <label className="block mb-1 text-gray-800">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-800">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-800">Organization</label>
          <select
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
            required
          >
            <option value="">Select an organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="mr-2 focus:ring-[#86BC24]"
          />
          <label className="text-gray-700">Is Active</label>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-[#87bc24f6] hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#86BC24] text-white px-4 py-2 rounded hover:bg-[#76a81e] transition"
          >
            {defaultValues ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default SurveyFormModal;
