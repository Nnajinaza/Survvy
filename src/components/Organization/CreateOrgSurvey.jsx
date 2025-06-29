import { useState } from "react";
import api from "../../api/api";

const CreateSurveyOrg = ({ organizationId, onCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isActive: false,
    organization: organizationId,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/survey", formData);
      console.log("New survey created:", response.data);
      onCreated?.(response.data);
    } catch (err) {
      console.error("Failed to create survey", err);
    }
  };

  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-12 py-12">
      <div className="w-full max-w-3xl bg-white p-6 rounded shadow-md">
        <h4 className="text-[#86BC23] font-bold text-xl sm:text-2xl mb-8 uppercase text-center">
          Create a new survey
        </h4>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Title</label>
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
            <label className="block mb-1 font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-700">Is Active</label>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-[#86BC24] text-white font-medium px-6 py-2 rounded hover:bg-[#76a81f] transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSurveyOrg;
