import { FaPlusCircle } from "react-icons/fa";
import Papa from "papaparse";
import { useState } from "react";
import api from "../../api/api";

const StaffList = ({ staff, onImportStaff, orgId }) => {
  const [staffList, setStaffList] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data.map((row) => ({
          fullName: row.name || `${row.firstname ?? ""} ${row.lastname ?? ""}`.trim(),
          email: row.email,
          role: row.role || "Staff",
          department: row.department ?? "",
        })).filter(s => s.email && s.fullName); // basic validation

        onImportStaff(parsedData);
        setStaffList(parsedData);
      },
    });
  };

  const sendToBackend = async () => {
    try {
      const response = await api.post("/staff/import-staff", {
        orgId,
        staff: staffList,
      });

      alert("Import success!");
      setStaffList([]);
      console.log(response.data);
    } catch (err) {
      console.error("Import failed", err);
      alert("Failed to import staff.");
    }
  };

return (
  <div className="px-4 pt-6"> {/* pt-6 adds top spacing */}
    {/* Top Row: Import Button + Save Button (if applicable) */}
    <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
      <label className="bg-[#86BC23]/80 hover:bg-[#86BC23] text-white px-4 py-2 rounded-md sm:font-medium sm:text-base text-sm flex items-center justify-end text-end gap-2 cursor-pointer">
        Import CSV <FaPlusCircle />
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>

      {staffList.length > 0 && (
        <button
          className="bg-[#86BC23] text-white px-4 py-2 rounded-md font-medium"
          onClick={sendToBackend}
        >
          Save Imported Staff
        </button>
      )}
    </div>

    {/* Staff Table */}
    <div className="overflow-x-auto border rounded shadow-sm">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 uppercase text-sm">
          <tr>
            <th className="px-4 py-3">Full Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {staff.map((s, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2">{s.fullName}</td>
              <td className="px-4 py-2">{s.email}</td>
              <td className="px-4 py-2">{s.role || "Staff"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default StaffList;
