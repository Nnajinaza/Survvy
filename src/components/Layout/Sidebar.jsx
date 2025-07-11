// import { useDashboard } from "../../context/DashboardContext";
import { FaHome, FaUsers, FaClipboardList, FaBars, FaChevronLeft } from "react-icons/fa";
import { useDashboard } from "../../context/DashboardContext";
import React, { useEffect, useState } from 'react';

// SidebarLink component
const SidebarLink = ({ name, icon, moduleKey, isCollapsed }) => {
  const { activeModule, changeModule } = useDashboard();

  const isActive = activeModule === moduleKey;

  return (
    <button
      onClick={() => changeModule(moduleKey)}
      className={`flex items-center gap-3 w-full p-2 mt-2 font-semibold rounded-lg mb-2 ${
        isActive ? 'bg-slate-100 text-[#86BC24]' : 'hover:bg-white hover:text-[#86BC24]'
      } ${isCollapsed ? 'justify-center' : 'pl-4'}`}
    >
      {icon}
      {!isCollapsed && <span>{name}</span>}
    </button>
  );
};

// Sidebar component
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Collapse on small screens by default
  useEffect(() => {
    if (window.innerWidth < 1024) setIsCollapsed(true);
  }, []);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className={`flex flex-col pt-8 bg-[#86BC24] text-white shadow-lg transition-all duration-300 
      ${isCollapsed ? 'w-20 items-center' : 'w-64'} h-full p-4`}>
      
      <div className="flex items-center justify-between mb-10 w-full">
        {!isCollapsed && <h1 className="text-2xl font-bold">Survey App</h1>}
        <button className="text-white text-lg" onClick={toggleSidebar}>
          {isCollapsed ? <FaBars /> : <FaChevronLeft />}
        </button>
      </div>

      <SidebarLink name="Home" icon={<FaHome size={20}/>} moduleKey="overview" isCollapsed={isCollapsed} />
      <SidebarLink name="Organization" icon={<FaUsers size={20}/>} moduleKey="organization" isCollapsed={isCollapsed} />
      <SidebarLink name="Surveys" icon={<FaClipboardList size={20}/>} moduleKey="surveys" isCollapsed={isCollapsed} />
    </div>
  );
};
export default Sidebar;
