import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import banner from "./../../images/bg.jpg";

const Login = () => {
  const backgroundStyle = {
    backgroundImage: `url(${banner})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    margin: "0",
    display: "grid",
  };

  const [formData, setFormData] = useState({ email: "", password: "" });
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", formData);
      console.log("Login response:", res.data);
      // const { accessToken, refreshToken, user } = res.data;
  
      // Save to localStorage for persistence
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("id", res.data.user.id);
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
  
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Login failed. Please check your email and password.");
      setFormData({ email: "", password: "" });
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
  );
};

export default Login;
