import { useState, useEffect } from "react";
import api from "../../api/api";

const LibraryModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });


//   useEffect(() => {
//     if (defaultValues) {
//       setFormData({
//         title: defaultValues.title || "",
//         description: defaultValues.description || "",
//       });
//     }
//   }, [defaultValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/library", formData)
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded w-full max-w-xl ">
        <h2 className="text-xl font-bold mb-8 text-center">
          Create New Survey
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-bg font-semibold">
          <div className="mb-6">
            <label className="block mb-1 font-semibold text-base text-gray-800">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-semibold text-base text-gray-800">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
              required
            />
          </div>
          <div className="flex justify-between gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-[#87bc24f6] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#86BC24] text-white px-4 py-2 rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LibraryModal;
