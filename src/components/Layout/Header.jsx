import { FaBell, FaSearch } from "react-icons/fa";

export const Header = ({ onMenuClick, brand }) => (
  <header className="h-16 px-4 flex items-center justify-between bg-white shadow-md">
    {/* <div className="flex items-center gap-3 ">
      <button className="lg:hidden text-lg" onClick={onMenuClick}>
        <FaBars />
      </button>
    </div> */}
    <div className="flex-1 max-w-md mx-4 hidden md:block">
      <label className="relative w-full">
        <input
          type="text"
          placeholder="Search..."
          className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[${brand}]`}
        />
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
      </label>
    </div>
    <div className="flex items-center gap-4">
      <button className={`text-gray-600 hover:text-[${brand}] text-lg`}>
        <FaBell />
      </button>
      <div className={`w-8 h-8 bg-[${brand}] text-white flex items-center justify-center rounded-full font-bold`}>U</div>
    </div>
  </header>
);