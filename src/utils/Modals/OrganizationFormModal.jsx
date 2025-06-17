import React, { useState, useEffect } from "react";

const OrganizationFormModal = ({ isOpen, onClose, onSubmit, defaultValues }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    staffNumber: "",
    sector: "",
  });

  // Pre-fill the form when editing an organization
  useEffect(() => {
    if (defaultValues) {
      setFormData({
        name: defaultValues.name,
        description: defaultValues.description,
        staffNumber: defaultValues.staffNumber,
        sector: defaultValues.sector,
      });
    }
  }, [defaultValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      description: "",
      staffNumber: "",
      sector: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[420px]">
        <h2 className="text-xl font-bold mb-4">{defaultValues ? "Edit Organization" : "Add Organization"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="staffNumber" className="block text-sm font-medium text-gray-700">
              Staff Number
            </label>
            <input
              id="staffNumber"
              name="staffNumber"
              type="number"
              value={formData.staffNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="sector" className="block text-sm font-medium text-gray-700">
              Sector
            </label>
            <input
              id="sector"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
            />
          </div>

          <div className="flex justify-between gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white font-medium hover:bg-[#86BC23] hover:text-gray-00 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#86BC24] text-white font-medium px-4 py-2 rounded hover:bg-[#86BD24] hover:text-gray-00"
            >
              {defaultValues ? "Save Changes" : "Add Organization"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationFormModal;
