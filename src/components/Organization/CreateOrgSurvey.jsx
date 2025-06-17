import { useState } from "react";
import api from "../../api/api";

const CreateSurveyOrg = ({ organizationId, onCreated }) => {
  console.log("org name:", organizationId)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isActive: false,
    organization: organizationId.name,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (formData) => {
    const newSurvey = await api.post("/survey", formData);
    console.log("New survey created:", newSurvey.data); // Log the new survey data
  };

  return (
    <div className=" flex justify-start px-12 bg-pink-00 h-[560px]">
      <div className="bg-slate-00 p-6 rounded w-full max-w-3xl">
        <h4 className="text-[#86BC23] font-bold text-2xl mb-8 uppercase">Create a new survey</h4>
        <form onSubmit={handleSubmit} className="bg-slate-00 h-full">
          <div className="bg-slate-00">
            <label className="block mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          {/* <div>
              <label className="block mb-1">Join Code</label>
              <input
                type="text"
                name="joinCode"
                value={formData.joinCode}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div> */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Is Active</label>
          </div>
          <div className="flex justify-end gap-2 bg-slate-00 items-baseline mt-48">
            <button
              type="submit"
              className="hover:bg-[#86BC24] hover:text-white px-4 py-2 rounded font-medium text-slate-500 bg-gray-200"
              onClick={onCreated}
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
