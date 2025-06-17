import { FaPlusCircle } from "react-icons/fa";
import Papa from "papaparse";
import { useState } from "react";
import api from "../../api/api";

const ImportStaff = ({ onImportStaff, orgId }) => {
  const [staffList, setStaffList] = useState([]);
  const [existingEmails, setExistingEmails] = useState([]);

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

        setStaffList(parsedData);
        onImportStaff?.(parsedData);
        checkExistingEmails(parsedData); // Check existing emails
      },
    });
  };

  const checkExistingEmails = async (staff) => {
    const emailsToCheck = staff.map((s) => s.email);
    try {
      const response = await api.post("/staff/check-emails", { emails: emailsToCheck });
      console.log("",response.data)

      // Extract emails that are already registered
      const existingEmailsList = response.data.existingEmails; // Assuming response contains { existingEmails: [...] }

      setExistingEmails(existingEmailsList);

      // Filter out the existing staff emails
      const filteredStaff = staff.filter((s) => !existingEmailsList.includes(s.email));
      setStaffList(filteredStaff);
    } catch (err) {
      console.error("Error checking existing emails:", err);
    }
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

  return (
    <div className="flex flex-col justify-end items-center w-full text-left bg-slate-00">
      {/* Upload Button */}
      <label className="bg-[#86BC23] px-4 py-2 mt-3 rounded-md text-white font-medium text-base flex items-center justify-end gap-2 cursor-pointer">
        Add staff <FaPlusCircle />
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>

      {/* Render Staff Table if any */}
      {staffList.length > 0 && (
        <div className="w-full mt-6 overflow-x-auto px-6">
          <table className="min-w-full text-sm text-left border border-gray-0">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Full Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Department</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {staffList.map((s, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-3">{s.fullName}</td>
                  <td className="px-6 py-3">{s.email}</td>
                  <td className="px-6 py-3">{s.role}</td>
                  <td className="px-6 py-3">{s.department || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Save to Backend Button */}
          <button
            className="mt-4 bg-[#86BC23] text-white px-4 py-2 rounded-md"
            onClick={sendToBackend}
          >
            Save Imported Staff
          </button>
        </div>
      )}

      {/* Display message for existing emails */}
      {existingEmails.length > 0 && (
        <div className="mt-4 text-red-500 flex flex-col justify-start  bg-slate-300">
          <p>These emails are already registered and will not be added:</p>
          <ul>
            {existingEmails.map((email, idx) => (
              <li key={idx} className="">{email}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImportStaff;
