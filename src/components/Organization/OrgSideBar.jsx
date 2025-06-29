import { useState, useEffect } from "react";
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

  useEffect(() => {
    // Collapse sidebar by default on small screens
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const navItem = (label, key, Icon) => (
    <li
      onClick={() => onSelect(key)}
      className={`p-2 cursor-pointer rounded transition-all duration-200 hover:bg-slate-100 hover:text-slate-800 flex items-center gap-4 mb-2 ${
        selected === key ? "bg-white/90 text-[#86BC23]" : "text-slate-900"
      }`}
    >
      <Icon />
      {!isCollapsed && <span>{label}</span>}
    </li>
  );

  return (
    <div
      className={`flex flex-col bg-[#86BC23] text-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } h-screen overflow-y-auto`}
    >
      <div
        className="p-4 bg-white text-black border-r-2 rounded-r-sm border-[#86BC23] flex items-center justify-between"
        onClick={toggleCollapse}
      >
        {isCollapsed ? (
          <button className="w-full flex justify-center hover:bg-gray-300">
            <FaArrowCircleRight />
          </button>
        ) : (
          <>
            <span className="mr-2 text-xl font-bold truncate">{orgName}</span>
            <button>
              <FaArrowCircleLeft />
            </button>
          </>
        )}
      </div>

      <ul className="flex-1 p-4 text-base font-semibold">
        {navItem("Staffs", "staffs", FaUsers)}
        {navItem("Surveys", "surveys", FaClipboardList)}
        {navItem("Create Survey", "create", FaPlusCircle)}
        {navItem("Import Staff", "import", FaShareAlt)}
      </ul>
    </div>
  );
};

export default OrgSideBar;
