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
          fullName: row.name || `${row.firstname} ${row.lastname}`,
          email: row.email,
          role: row.role || "Staff",
          department: row.department,
        }));

        // Call a function to update the staff list
        onImportStaff(parsedData);
        setStaffList(parsedData);
      },
    });
  };

  const sendToBackend = async () => {
    try {
      const payload = {
        orgId,
        staff: staffList,
      };
      const response = await api.post("/staff/import-staff", payload);

      alert("Import success!");
      console.log(response.data);
    } catch (err) {
      console.error("Import failed", err);
      alert("Failed to import staff.");
    }
  };

  if (!staff.length)
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <p className="text-gray-500 w-full  text-center">
          No staff members found.
        </p>
        <label className="bg-[#86BC23] px-4 py-1 mt-3 rounded-md text-slate-100 font-medium text-base flex items-center gap-2 cursor-pointer">
          Add staff <FaPlusCircle />
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>
    );

  return (
    <div className="overflow-x-auto px-6">
      <table className="min-w-full text-sm text-left border border-gray-200">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-6 py-3">Full Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Role</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {staff.map((s, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-3">{s.fullName}</td>
              <td className="px-6 py-3">{s.email}</td>
              <td className="px-6 py-3">{s.role || "Staff"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {staffList.length > 0 && (
        <button
          className="mt-4 bg-[#86BC23] text-white px-4 py-2 rounded-md"
          onClick={sendToBackend}
        >
          Save Imported Staff
        </button>
      )}
    </div>
  );
};

export default StaffList;
