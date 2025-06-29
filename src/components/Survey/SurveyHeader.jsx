import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { FaHome } from "react-icons/fa";

const SurveyHeader = ({ survey, showSection, handleChange, handleShare }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="mb border-b pb-3 flex items-center justify-between shadow-sm px-4 sm:px-10 relative">
      {/* Left: Back to Dashboard */}
      <div className="flex items-center gap-3 ">
        <Link
          to="/dashboard"
          className="text-[#86BC23] text-xl sm:text-base uppercase font-medium hover:underline flex items-center gap-1"
        >
          <FaHome/>
          <span className="hidden">Download</span>
        </Link>
      </div>

      {/* Center: Survey Title/Description */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-center sm:text-left">
        <h1 className="text-base sm:text-lg md:text-xl font-bold uppercase text-gray-800">
            {survey.title}:
        </h1>
        <p className="text-sm sm:text-base md:text-lg uppercase font-medium text-gray-600 hidden">
            {survey.description}
        </p>
      </div>
      
      {/* Right: Actions (Desktop) */}
      <div className="hidden sm:flex gap-2">
        <button
          className={`text-sm font-medium px-3 py-2 rounded ${
            showSection === 1 ? "bg-[#86BC23] text-white" : "bg-[#86BC23]/40"
          }`}
          onClick={() => handleChange(1)}
        >
          Surveys
        </button>
        <button
          className="bg-[#86BC23]/40 text-sm ml-2 font-medium px-3 py-2 rounded hover:bg-[#86BC23] focus:bg-[#86BC23]"
          onClick={() => handleShare(survey)}
        >
          Share Survey
        </button>
        <button
          className={`text-sm font-medium px-3 py-2 ml-2 rounded ${
            showSection === 2 ? "bg-[#86BC23] text-white" : "bg-[#86BC23]/40"
          }`}
          onClick={() => handleChange(2)}
        >
          View Response
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="sm:hidden text-2xl text-[#86BC23]"
        onClick={() => setShowMenu(!showMenu)}
      >
        <FiMenu />
      </button>

      {/* Mobile Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-full right-4 z-10 bg-white shadow-lg rounded p-3 flex flex-col gap-2 mt-2 w-44 border">
          <button
            className={`text-sm font-medium px-3 py-2 rounded ${
              showSection === 1 ? "bg-[#86BC23] text-white" : "bg-[#86BC23]/40"
            }`}
            onClick={() => {
              handleChange(1);
              setShowMenu(false);
            }}
          >
            Surveys
          </button>
          <button
            className="bg-[#86BC23]/40 text-sm font-medium px-3 py-2 rounded hover:bg-[#86BC23]"
            onClick={() => {
              handleShare(survey);
              setShowMenu(false);
            }}
          >
            Share Survey
          </button>
          <button
            className={`text-sm font-medium px-3 py-2 rounded ${
              showSection === 2 ? "bg-[#86BC23] text-white" : "bg-[#86BC23]/40"
            }`}
            onClick={() => {
              handleChange(2);
              setShowMenu(false);
            }}
          >
            View Response
          </button>
        </div>
      )}
    </div>
  );
};

export default SurveyHeader;
