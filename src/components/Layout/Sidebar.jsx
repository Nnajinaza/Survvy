// import { NavLink } from "react-router-dom";
// import React, { useState } from 'react';
// import { FaBars, FaHome, FaQuestion, FaList, FaUsers, FaCog } from 'react-icons/fa';

// const Sidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   return (
//     <aside
//       className={`fixed top-0 left-0 h-[94%] mt-14 px-3 bg-gray-800 text-white transition-width duration-300 ease-in-out  ${
//         isCollapsed ? 'w-20' : 'w-52'
//       }`}
//     >
//       {/* <div className="flex items-center justify-end h-16 py-4 px-2 mb-4">
//         <FaBars onClick={toggleSidebar} className="cursor-pointer text-lg text-[#86BC24] hover:text-white text-end" />
//       </div> */}
//       <ul className="list-none p-0 mt-4">
//         <li className="mb-4 ">
//           <NavLink
//             to="/dashboard"
//             className="flex items-center text-white no-underline hover:text-[#86BC24] p-2"
//           >
//             <FaHome className="mr-2 text-xl" />
//             <span className={`${isCollapsed ? 'hidden' : 'inline'}`}>Dashboard</span>
//           </NavLink>
//         </li>
//         <li className="mb-4 ">
//           <NavLink
//             to="/surveys"
//             className="flex items-center text-white no-underline hover:text-[#86BC24] p-2"
//           >
//             <FaQuestion className="mr-2 text-xl" />
//             <span className={`${isCollapsed ? 'hidden' : 'inline'}`}>Surveys</span>
//           </NavLink>
//         </li>
//         <li className="mb-4 ">
//           <NavLink
//             to="/library"
//             className="flex items-center text-white no-underline hover:text-[#86BC24] p-2"
//           >
//             <FaList className="mr-2 text-xl" />
//             <span className={`${isCollapsed ? 'hidden' : 'inline'}`}>Library</span>
//           </NavLink>
//         </li>
//         <li className="mb-4 ">
//           <NavLink
//             to="/staff"
//             className="flex items-center text-white no-underline hover:text-[#86BC24] p-2"
//           >
//             <FaUsers className="mr-2 text-xl" />
//             <span className={`${isCollapsed ? 'hidden' : 'inline'}`}>Staff</span>
//           </NavLink>
//         </li>
//         <li className="mb-4 ">
//           <NavLink
//             to="/admin"
//             className="flex items-center text-white no-underline hover:text-[#86BC24] p-2"
//           >
//             <FaCog className="mr-2 text-xl" />
//             <span className={`${isCollapsed ? 'hidden' : 'inline'}`}>Admin</span>
//           </NavLink>
//         </li>
//       </ul>
//       <div className="absolute bottom-0 left-0 w-full p-4">
//       <h3 className={`text-lg ${isCollapsed ? 'block' : 'hidden'} text-[#86BC24]`}>
//           <span className="text-[#86BC24]">&copy;</span>
          
//         </h3>

//         <p className={`text-center ${isCollapsed ? 'hidden' : 'block'}`}>
//           &copy; 2023 Survey App
//         </p>
//       </div>
//     </aside>
//   );
// };
// export default Sidebar;


// import { FaChevronLeft, FaChevronRight, FaSignOutAlt } from "react-icons/fa";
// import { navLinks } from "../data/navLinks";
// import { SidebarLink } from "./SidebarLink";

// export const Sidebar = ({ collapsed, toggle, brand }) => (
//   <aside
//     className={`h-screen bg-[${brand}] text-white flex flex-col transition-all duration-300 ${
//       collapsed ? "w-20" : "w-64"
//     }`}
//   >
//     <div className="flex items-center justify-between p-4 border-b border-white">
//       {!collapsed && <span className="text-2xl font-bold">MyApp</span>}
//       <button onClick={toggle} className="text-white text-lg">
//         {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
//       </button>
//     </div>
//     <nav className="flex-1 py-6 space-y-2">
//       {navLinks.map((link) => (
//         <SidebarLink key={link.name} {...link} isCollapsed={collapsed} brand={brand} />
//       ))}
//     </nav>
//     <div className="px-4 pb-6">
//       <button className={`w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white hover:text-[${brand}] ${collapsed ? "justify-center" : ""}`}> 
//         <FaSignOutAlt /> {!collapsed && "Logout"}
//       </button>
//     </div>
//   </aside>
// );

// import { useDashboard } from "../../context/DashboardContext";
import { FaHome, FaUsers, FaClipboardList, FaCog, FaBars, FaChevronLeft } from "react-icons/fa";
import { useDashboard } from "../../context/DashboardContext";
import React, { useState } from 'react';

// SidebarLink component
const SidebarLink = ({ name, icon, moduleKey, isCollapsed }) => {
  const { activeModule, changeModule } = useDashboard();

  const isActive = activeModule === moduleKey;

  return (
    <button
      onClick={() => changeModule(moduleKey)}
      className={`flex items-center gap-3 w-full p-2 rounded-lg mb-2 ${
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
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className={`flex flex-col ${isCollapsed ? 'w-20 items-center' : 'w-64'} h-full bg-[#86BC24] text-white shadow-lg p-4 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        {!isCollapsed && <h1 className="text-2xl font-bold">Survey App</h1>}
        <button className="text-white text-lg " onClick={toggleSidebar}>
          {isCollapsed ? <FaBars /> : <FaChevronLeft />}
        </button>
      </div>

      <SidebarLink name="Home" icon={<FaHome size={20}/>} moduleKey="overview" isCollapsed={isCollapsed} />
      <SidebarLink name="Organization" icon={<FaUsers size={20}/>} moduleKey="organization" isCollapsed={isCollapsed} />
      <SidebarLink name="Surveys" icon={<FaClipboardList size={20}/>} moduleKey="surveys" isCollapsed={isCollapsed} />
      <SidebarLink name="Settings" icon={<FaCog size={20}/>} moduleKey="settings" isCollapsed={isCollapsed} />
    </div>
  );
};

export default Sidebar;
