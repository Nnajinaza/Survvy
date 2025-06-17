import { useState } from "react";
import { FaEllipsisV, FaExternalLinkSquareAlt, FaPencilAlt, FaShareAltSquare, FaTrashAlt } from "react-icons/fa";

const ActionMenu = ({ onEdit, onDelete, onView, onShare }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="text-gray-600 hover:text-black focus:outline-none"
      >
        <FaEllipsisV />
      </button>

      {open && (
        <div className="absolute right-0 z-10 w-32 mt-2 origin-top-right bg-white border border-gray-200 rounded shadow-lg">
          <button
            onClick={() => {
              setOpen(false);
              onView();
            }}
            className="flex gap-3 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 items-center" 
          >
            <FaExternalLinkSquareAlt />
            View
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex gap-3 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 items-center" 
          >
            <FaPencilAlt />
            Edit
          </button>
          {onShare ? 
          <button
            onClick={() => {
              setOpen(false);
              onShare();
            }}
            className="flex gap-3 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 items-center" 
          >
            <FaShareAltSquare />
            Share
          </button>
          : <p></p>}
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex gap-3 items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
          >
            <FaTrashAlt />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;