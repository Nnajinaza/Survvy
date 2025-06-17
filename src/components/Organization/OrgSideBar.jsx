import { useState } from "react";
import {
  FaArrowCircleLeft,
  FaArrowCircleRight,
  FaUsers,
  FaClipboardList,
  FaPlusCircle,
  FaShareAlt,
} from "react-icons/fa";

const OrgSideBar = ({ selected, onSelect, orgName }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const navItem = (label, key, Icon) => (
    <li
      onClick={() => onSelect(key)}
      className={`p-2 cursor-pointer rounded transition-colors duration-200 hover:bg-slate-400 hover:text-white flex items-center gap-4 mb-2  ${
        selected === key ? "bg-[#86BC23] text-white" : "text-slate-900"
      }`}
    >
      <Icon />
      {!isCollapsed && label}
    </li>
  );

  return (
    <div
      className={`flex flex-col h-screen bg-slate-300 ${
        isCollapsed ? "w-16" : "w-64"
      } transition-all`}
    >
      <button
        className="p-4 bg-gray-200 hover:bg-gray-300 flex items-center justify-between max-h-16"
        onClick={toggleCollapse}
      >
        {/* {orgName} */}
        {isCollapsed ? (
          <div className="flex justify-center w-full">
            {/* <span className="mr-2">{orgName}</span>  */}
            <FaArrowCircleRight />
          </div>
        ) : (
          <>
            <span className="mr-2 text-xl font-bold">{orgName}</span>
            <FaArrowCircleLeft />
          </>
        )}
      </button>
      <ul className="flex-1 p-4 text-base font-medium">
        {navItem("Staffs", "staffs", FaUsers)}
        {navItem("Surveys", "surveys", FaClipboardList)}
        {navItem("Create Survey", "create", FaPlusCircle)}
        {navItem("Import Staff", "import", FaShareAlt)}{" "}
      </ul>
    </div>
  );
};

export default OrgSideBar;
