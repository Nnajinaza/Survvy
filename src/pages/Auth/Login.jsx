import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import banner from "./../../images/bg.jpg";

const Login = () => {
  const backgroundStyle = {
    backgroundImage: `url(${banner})`,
    backgroundSize: "cover",
    backgroundPosition: "cover",
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

   const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <section className="min-h-screen w-full grid" style={backgroundStyle}>
      {/* Header */}
      <header className="h-12 z-10 bg-slate-50 px-6 flex justify-between items-center border-b-2 relative">
        <Link
          to={"/"}
          className="text-[#86BC24] text-2xl font-medium flex items-center"
        >
          Survvy
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex justify-center gap-4 items-center text-base font-serif font-medium">
          {/* <p className="text-gray-700 hover:text-[#86BC24] cursor-pointer">Request a demo</p>
          <p className="text-gray-700 hover:text-[#86BC24] cursor-pointer">Our Services</p>
          <p className="text-gray-700 hover:text-[#86BC24] cursor-pointer">About us</p> */}
          <Link to={"/signup"} className="text-gray-700 hover:text-[#86BC24]">
            Register
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Mobile Pop-up Navigation */}
        {isMenuOpen && (
          <div className="absolute top-12 left-0 w-full bg-white shadow-md md:hidden z-20 py-4 px-6">
            {/* <p className="text-gray-700 hover:text-[#86BC24] mb-2">Request a demo</p>
            <p className="text-gray-700 hover:text-[#86BC24] mb-2">Our Services</p>
            <p className="text-gray-700 hover:text-[#86BC24] mb-2">About us</p> */}
            <Link to={"/signup"} className="text-gray-700 hover:text-[#86BC24] block">Register</Link>
          </div>
        )}
      </header>

      {/* Main Login Section */}
      <main className="flex justify-center items-start sm:items-center px-4 sm:px-0 mt-6 sm:mt-0">
        <form
          className="bg-white/40 border-2 rounded-[6px] py-6 px-4 w-full max-w-[400px] h-auto sm:h-[420px]"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl text-center font-medium text-[#86BC24]">LOGIN</h2>

          {/* Email */}
          <div className="grid w-full mt-8">
            <label className="font-medium text-base">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
              required
              className="py-2 px-2 rounded border text-gray-600 border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
            />
          </div>

          {/* Password */}
          <div className="grid w-full gap-1 mt-4">
            <label className="font-medium text-base">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Password"
              onChange={handleChange}
              required
              className="py-2 px-2 rounded border text-gray-600 border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
            />
          </div>

          {/* Forgot Password */}
          <div className="flex w-full justify-end">
            <Link to={"/forgot-password"} className="text-end text-sm mt-1">
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="mt-4 bg-[#86BC24] rounded hover:bg-[#76A620] w-full py-2 text-white text-base font-medium"
          >
            Login
          </button>

          {/* Sign Up Link */}
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
  
  // return (
  //   <section className="h-screen grid w-full" style={backgroundStyle}>
  //     <header className="h-12 z-10 bg-slate-50 px-6 flex justify-between items-center border border-b-2">
  //       <Link
  //         to={"/"}
  //         className="text-[#86BC24] text-2xl text-accent font-medium flex items-center"
  //       >
  //         Survvy
  //       </Link>
  //       <div className="flex justify-center gap-4 items-center text-base font-serif font-medium">
  //         <p className="text-gray-700 hover:text-[#86BC24]">Request a demo</p>
  //         <p className="text-gray-700 hover:text-[#86BC24]">Our Services</p>
  //         <p className="text-gray-700 hover:text-[#86BC24]">About us</p>
  //         <Link to={"/login"} className="text-gray-700 hover:text-[#86BC24]">
  //           Login
  //         </Link>
  //       </div>
  //     </header>
  //     <main className="flex justify-center">
  //       <form
  //         className="bg-white/40 h-[400px] w-[400px] border-2 rounded-[6px] py-6 px-4 justify-center items-center"
  //       >
  //         <h2 className="text-2xl text-center font-medium text-[#86BC24]">
  //           LOGIN
  //         </h2>
  //         <div className="grid items-center w-full mt-8">
  //           <label className="font-medium text-base">Email</label>
  //           <input
  //             type="email"
  //             name="email"
  //             value={formData.email}
  //             placeholder="Email"
  //             onChange={handleChange}
  //             required
  //             className="py-2 px-2 rounded-[5px] border-[1px] text-grey-600 border-gray-300  focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
  //           />
  //         </div>
  //         <div className="grid items-center w-full gap-1 mt-4">
  //           <label className="font-medium text-base">Password</label>
  //           <input
  //             type="password"
  //             name="password"
  //             value={formData.password}
  //             placeholder="Password"
  //             onChange={handleChange}
  //             required
  //             className="py-2 px-2 rounded-[5px] border-[1px] text-grey-600 border-grey-300  focus:outline-none focus:ring-1 focus:ring-[#86BC24]"
  //           />
  //         </div>
  //         <div className="flex w-full items-end">
  //           <Link to={"/forgot-password"} className="text-end text-sm mt-1 w-full">
  //             Forgot Password?
  //           </Link>
  //         </div>
  //         <button
  //           type="submit"
  //           onClick={handleSubmit}
  //           className="mt-4 text-center bg-[#86BC24] rounded hover:bg-[#86BC24] w-full py-2 text-white text-base font-medium"
  //         >
  //           Login
  //         </button>
  //         <Link
  //           to={"/signup"}
  //           className="text-sm font-normal flex justify-center mt-3"
  //         >
  //           Don't have an account? Signup
  //         </Link>
  //       </form>
  //     </main>
  //   </section>
  // );
};

export default Login;
