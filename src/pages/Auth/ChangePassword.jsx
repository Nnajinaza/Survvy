import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/api";
import banner from "./../../images/bg.jpg";
// import { useAuth } from '../../context/AuthContext'; // Uncomment if you need to use AuthContext
import { Link } from "react-router-dom"; // Uncomment if you need to use Link

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
      navigate("/login"); // Redirect to login page after successful password change
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to change password.");
    }
  };

  return (
    <>
      {/*     <section className="h-screen grid w-full" style={backgroundStyle}>
      <header className="h-12 z-10 bg-slate-50 px-6 flex justify-between items-center border border-b-2">
        <Link
          to={"/"}
          className="text-[#86BC24] text-2xl text-accent font-medium flex items-center"
        >
          Survvy
        </Link>
        <div className="flex justify-center gap-4 items-center text-base font-serif font-medium">
          <p className="text-gray-700 hover:text-[#86BC24]">Request a demo</p>
          <p className="text-gray-700 hover:text-[#86BC24]">Our Services</p>
          <p className="text-gray-700 hover:text-[#86BC24]">About us</p>
          <Link to={"/login"} className="text-gray-700 hover:text-[#86BC24]">
            Login
          </Link>
        </div>
      </header>
      <main className="flex justify-center">
        <form
          className="bg-white/40 h-[400px] w-[400px] border-2 rounded-[6px] py-6 px-4 justify-center items-center"
        >
          <h2 className="text-2xl text-center font-medium text-[#86BC24]">
            LOGIN
          </h2>
          <div className="grid items-center w-full mt-8">
            <label className="font-medium text-base">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
              required
              className="py-2 px-2 rounded-[5px] border-[1px] text-grey-600 border-gray-300  focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
            />
          </div>
          <div className="grid items-center w-full gap-1 mt-4">
            <label className="font-medium text-base">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Password"
              onChange={handleChange}
              required
              className="py-2 px-2 rounded-[5px] border-[1px] text-grey-600 border-grey-300  focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
            />
          </div>
          <div className="flex w-full items-end">
            <Link to={"/forgot-password"} className="text-end text-sm mt-1 w-full">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="mt-4 text-center bg-[#86BC24] rounded hover:bg-[#86BC24] w-full py-2 text-white text-base font-medium"
          >
            Login
          </button>
          <Link
            to={"/signup"}
            className="text-sm font-normal flex justify-center mt-3"
          >
            Don't have an account? Signup
          </Link>
        </form>
      </main>
    </section>
 */}
      <section className="h-screen grid w-full" style={backgroundStyle}>
        <header className="h-12 z-10 bg-slate-50 px-6 flex justify-between items-center border border-b-2">
          <Link
            to={"/"}
            className="text-[#86BC24] text-2xl text-accent font-medium flex items-center"
          >
            Survvy
          </Link>
          <div className="flex justify-center gap-4 items-center text-base font-serif font-medium">
            <p className="text-gray-700 hover:text-[#86BC24]">Request a demo</p>
            <p className="text-gray-700 hover:text-[#86BC24]">Our Services</p>
            <p className="text-gray-700 hover:text-[#86BC24]">About us</p>
            <Link to={"/login"} className="text-gray-700 hover:text-[#86BC24]">
              Login
            </Link>
          </div>
        </header>
        <div className="flex justify-center items-center h-full">
          {message && <p>{message}</p>}
          <form
            className="bg-white/40 h-[400px] w-[400px] border-2 rounded-[6px] py-6 px-4 justify-center items-center"
            onSubmit={handleSubmit}
          >
            <h1 className="text-2xl text-center font-medium text-[#86BC24]">
              Change Password
            </h1>
            <div className="grid items-center w-full mt-8">
              <label htmlFor="password" className="font-medium text-base">
                New Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-2 px-2 rounded-[5px] border-[1px] text-grey-600 border-grey-300  focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
                placeholder="New Password"
                required
              />
            </div>
            <div className="grid items-center w-full mt-8">
              <label
                htmlFor="confirmPassword"
                className="font-medium text-base"
              >
                Confirm New Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="py-2 px-2 rounded-[5px] border-[1px] text-grey-600 border-grey-300  focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
                placeholder="Confirm New Password"
                required
              />
            </div>
            <button type="submit" 
                className="mt-12 text-center bg-[#86BC24] rounded hover:bg-[#86BC24] w-full py-2 text-white text-base font-medium"

            >Change Password</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default ChangePassword;
