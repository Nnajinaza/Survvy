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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-2 sm:px-4">
    <div className="bg-white w-full max-w-sm sm:max-w-md md:max-w-lg p-4 sm:p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
      <h2 className="text-lg sm:text-xl font-bold mb-6">
        {defaultValues ? "Edit Organization" : "Add Organization"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="name" className="block text-sm font-medium text-gray-800">
            Name
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-[#86BC24] focus:outline-none focus:ring-2"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="description" className="block text-sm font-medium text-gray-800">
            Description
          </label>
          <input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-[#86BC24] focus:outline-none focus:ring-2"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="staffNumber" className="block text-sm font-medium text-gray-800">
            Staff Number
          </label>
          <input
            id="staffNumber"
            name="staffNumber"
            type="number"
            value={formData.staffNumber}
            onChange={handleChange}
            required
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-[#86BC24] focus:outline-none focus:ring-2"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="sector" className="block text-sm font-medium text-gray-800">
            Sector
          </label>
          <input
            id="sector"
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            required
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-[#86BC24] focus:outline-none focus:ring-2"
          />
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-800 hover:bg-gray-400 transition px-4 py-2 rounded font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#86BC24] text-white hover:bg-[#76a81e] transition px-4 py-2 rounded font-medium"
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
