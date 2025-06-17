const OrganizationHeader = ({ name, onCreateSurvey, onEmailStaff }) => (
  <div className="flex items-center justify-between border-b mb-6 px-6 py-4">
    <h1 className="text-3xl font-bold text-[#86BC23]">{name}</h1>
    <div className="flex gap-4">
      <button onClick={onCreateSurvey} className="hover:bg-[#86BC23] px-3 rounded-md py-1 text-sm text-slate-900 bg-slate-300">Create Survey</button>
      <button onClick={onEmailStaff} className="hover:bg-[#86BC23] px-3 rounded-md py-1 text-sm text-slate-900 bg-slate-300">Email Staff</button>
    </div>
  </div>
);
  
  export default OrganizationHeader;
  