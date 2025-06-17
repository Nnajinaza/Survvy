import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import banner from "./../../images/bg.jpg";

const Signup = () => {
  const backgroundStyle = {
    backgroundImage: `url(${banner})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    margin: "0",
    display: "grid",
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("testing 1");
      console.log(formData);
      const res = await api.post("/auth/register", formData);

      console.log("Thi is tthe signup res", res)

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("email", res.data.user.email);
      // Update context state
      setToken({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
        userId: res.data.user.id,
        role: res.data.user.role,
        email: res.data.user.email,
      });

      console.log("user set successfully");

      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
          "Signup failed. Please check your inputs and try again."
      );
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });
    }
  };

  return (
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
      <main className="flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white/40 h-[500px] w-[400px] border-2 rounded-[6px] py-6 px-4 justify-center items-center"
        >
          <h2 className="text-2xl text-center font-medium text-[#86BC24]">
            SIGNUP
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
          <div className="grid items-center w-full gap-1 mt-4">
            <label className="font-medium text-base">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              placeholder="Confirm Password"
              onChange={handleChange}
              required
              className="py-2 px-2 rounded-[5px] border-[1px] text-grey-600 border-grey-300  focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
            />
          </div>
          <div className="mt-4 ">
            <label className="text-sm font-medium">Register as a </label>
            <select
              className="bg-grey-200 border-slate-500 rounded text-slate-800 text-sm"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-8 text-center bg-[#86BC24] rounded hover:bg-[#86BC24] w-full py-2 text-white text-base font-medium"
          >
            Signup
          </button>
          <Link
            to={"/login"}
            className="text-sm font-normal flex justify-center mt-3"
          >
            Already have an account? Login
          </Link>
        </form>
      </main>
    </section>
  );
};

export default Signup;
