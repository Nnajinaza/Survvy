import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/api";
import banner from "./../../images/bg.jpg";
// import { useAuth } from '../../context/AuthContext'; // Uncomment if you need to use AuthContext
import { Link } from "react-router-dom"; // Uncomment if you need to use Link
import { FaBars, FaTimes } from "react-icons/fa";

const ChangePassword = () => {
  const backgroundStyle = {
    backgroundImage: `url(${banner})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    margin: "0",
    display: "grid",
  };

  const [ tokenId ]  = useSearchParams();
  const resetToken = tokenId.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!resetToken) {
      setMessage("Invalid token.");
    }
  }, [resetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await api.post(`/auth/verify-reset-password/${resetToken}`, {
        password,
      });

      setMessage(response.data.message);
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to change password.");
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <section className="h-screen w-full grid" style={backgroundStyle}>
      {/* Header */}
      <header className="h-12 z-10 bg-slate-50 px-6 flex justify-between items-center border-b-2 relative">
        <Link
          to="/"
          className="text-[#86BC24] text-2xl font-medium flex items-center"
        >
          Survvy
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-4 items-center text-base font-serif font-medium">
          {/* <p className="text-gray-700 hover:text-[#86BC24] cursor-pointer">Request a demo</p>
          <p className="text-gray-700 hover:text-[#86BC24] cursor-pointer">Our Services</p>
          <p className="text-gray-700 hover:text-[#86BC24] cursor-pointer">About us</p> */}
          <Link to="/login" className="text-gray-700 hover:text-[#86BC24]">Login</Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-700">
          {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>

        {/* Overlay & Slide-in Menu */}
        {isMenuOpen && (
          <>
            <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-40" />
            <div
              ref={menuRef}
              className={`fixed top-12 left-0 w-full bg-white shadow-md flex flex-col gap-3 px-6 py-4 text-gray-700 text-base font-medium md:hidden z-50
                transition-transform duration-300 ease-in-out transform
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
              `}
            >
              {/* <p className="hover:text-[#86BC24] cursor-pointer">Request a demo</p>
              <p className="hover:text-[#86BC24] cursor-pointer">Our Services</p>
              <p className="hover:text-[#86BC24] cursor-pointer">About us</p> */}
              <Link to="/login" className="hover:text-[#86BC24]">Login</Link>
            </div>
          </>
        )}
      </header>

      {/* Main Content */}
      <main className="flex justify-center items-center px-4">
        <div className="w-full max-w-[400px] bg-white/40 border-2 rounded-[6px] py-6 px-4">
          <h1 className="text-2xl text-center font-medium text-[#86BC24] mb-6">Change Password</h1>

          {message && <p className="text-sm text-center mb-4 text-red-600">{message}</p>}

          <form onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="grid w-full mb-4">
              <label htmlFor="password" className="font-medium text-base">New Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-2 px-2 rounded-[5px] border border-gray-300 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
                placeholder="New Password"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="grid w-full mb-6">
              <label htmlFor="confirmPassword" className="font-medium text-base">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="py-2 px-2 rounded-[5px] border border-gray-300 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
                placeholder="Confirm New Password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#86BC24] hover:bg-[#76A620] text-white py-2 rounded text-base font-medium"
            >
              Change Password
            </button>
          </form>
        </div>
      </main>
    </section>
  );

  // return (
  //   <>
  //     <section className="h-screen grid w-full" style={backgroundStyle}>
  //       <header className="h-12 z-10 bg-slate-50 px-6 flex justify-between items-center border border-b-2">
  //         <Link
  //           to={"/"}
  //           className="text-[#86BC24] text-2xl text-accent font-medium flex items-center"
  //         >
  //           Survvy
  //         </Link>
  //         <div className="flex justify-center gap-4 items-center text-base font-seri font-medium">
  //           <p className="text-gray-700 hover:text-[#86BC24]">Request a demo</p>
  //           <p className="text-gray-700 hover:text-[#86BC24]">Our Services</p>
  //           <p className="text-gray-700 hover:text-[#86BC24]">About us</p>
  //           <Link to={"/login"} className="text-gray-700 hover:text-[#86BC24]">
  //             Login
  //           </Link>
  //         </div>
  //       </header>
  //       <div className="flex justify-center items-center h-full">
  //         {message && <p>{message}</p>}
  //         <form
  //           className="bg-white/40 h-[400px] w-[400px] border-2 rounded-[6px] py-6 px-4 justify-center items-center"
  //           onSubmit={handleSubmit}
  //         >
  //           <h1 className="text-2xl text-center font-medium text-[#86BC24]">
  //             Change Password
  //           </h1>
  //           <div className="grid items-center w-full mt-8">
  //             <label htmlFor="password" className="font-medium text-base">
  //               New Password:
  //             </label>
  //             <input
  //               type="password"
  //               id="password"
  //               value={password}
  //               onChange={(e) => setPassword(e.target.value)}
  //               className="py-2 px-2 rounded-[5px] border-[1px] text-grey-600 border-grey-300  focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
  //               placeholder="New Password"
  //               required
  //             />
  //           </div>
  //           <div className="grid items-center w-full mt-8">
  //             <label
  //               htmlFor="confirmPassword"
  //               className="font-medium text-base"
  //             >
  //               Confirm New Password:
  //             </label>
  //             <input
  //               type="password"
  //               id="confirmPassword"
  //               value={confirmPassword}
  //               onChange={(e) => setConfirmPassword(e.target.value)}
  //               className="py-2 px-2 rounded-[5px] border-[1px] text-grey-600 border-grey-300  focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
  //               placeholder="Confirm New Password"
  //               required
  //             />
  //           </div>
  //           <button type="submit" 
  //               className="mt-12 text-center bg-[#86BC24] rounded hover:bg-[#86BC24] w-full py-2 text-white text-base font-medium"

  //           >Change Password</button>
  //         </form>
  //       </div>
  //     </section>
  //   </>
  // );
};

export default ChangePassword;
