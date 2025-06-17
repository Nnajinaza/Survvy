import { FaHome, FaBuilding, FaFileAlt, FaBookOpen, FaCog } from "react-icons/fa";

export const navLinks = [
  { name: "Overview", path: "/", icon: <FaHome /> },
  { name: "Organization", path: "/organization", icon: <FaBuilding /> },
  { name: "Surveys", path: "/surveys", icon: <FaFileAlt /> },
  { name: "Library", path: "/library", icon: <FaBookOpen /> },
  { name: "Settings", path: "/settings", icon: <FaCog /> },
];