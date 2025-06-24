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
      className={`p-2 cursor-pointer rounded transition-colors duration-200 hover:bg-slate-100 hover:text-slate-800 flex items-center gap-4 mb-2  ${
        selected === key ? "bg-white/90 text-[#86BC23]" : "text-slate-900"
      }`}
    >
      <Icon />
      {!isCollapsed && label}
    </li>
  );

  return (
    <div
      className={`flex flex-col h-screen bg-[#86BC23] ${
        isCollapsed ? "w-16" : "w-64"
      } transition-all`}
    >
      <div
        className="p-4 bg-white border-r-2 rounded-r-sm border-[#86BC23] flex items-center justify-between max-h-16"
        onClick={toggleCollapse}
      >
        {/* {orgName} */}
        {isCollapsed ? (
          <button className="flex justify-center w-full hover:bg-gray-300">
            {/* <span className="mr-2">{orgName}</span>  */}
            <FaArrowCircleRight />
          </button>
        ) : (
          <>
            <span className="mr-2 text-xl font-bold">{orgName}</span>
            <button>
              <FaArrowCircleLeft />
            </button>
          </>
        )}
      </div>
      <ul className="flex-1 p-4 tet-xl text-base font-semibold">
        {navItem("Staffs", "staffs", FaUsers)}
        {navItem("Surveys", "surveys", FaClipboardList)}
        {navItem("Create Survey", "create", FaPlusCircle)}
        {navItem("Import Staff", "import", FaShareAlt)}{" "}
      </ul>
    </div>
  );
};

export default OrgSideBar;
