import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import banner from './../../images/bg.jpg'
import { FaBars, FaTimes } from 'react-icons/fa';

const Home = () => {
    const backgroundStyle = {
        backgroundImage: `url(${banner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        margin: '0',
        display: 'grid',            
    };

 const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <section className="h-screen w-full z-0 relative" style={backgroundStyle}>
      {/* Header */}
      <header className="h-12 z-10 bg-slate-50 px-6 flex justify-between items-center border-b-2 relative">
        <Link
          to="/"
          className="text-[#86BC24] text-2xl font-medium flex items-center"
        >
          Survvy
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-4 items-center text-lg font-serif font-medium">
          {/* <p className="text-gray-700 hover:text-[#86BC24] cursor-pointer">Request a demo</p>
          <p className="text-gray-700 hover:text-[#86BC24] cursor-pointer">Our Services</p> */}
          <p className="text-gray-700 hover:text-[#86BC24] cursor-pointer">About us</p>
          <Link to="/login" className="text-gray-700 hover:text-[#86BC24]">Login</Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-700">
          {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>

        {/* Overlay & Mobile Menu */}
        {isMenuOpen && (
          <>
            <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-40" />
            <div
              ref={menuRef}
              className={`fixed top-12 left-0 w-full bg-white shadow-md flex flex-col gap-3 px-6 py-4 text-gray-700 text-base font-medium md:hidden z-50
                transition-transform duration-300 ease-in-out transform
                ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
              `}
            >
              <p className="hover:text-[#86BC24] cursor-pointer">About us</p>
              <Link to="/login" className="hover:text-[#86BC24]">Login</Link>
            </div>
          </>
        )}
      </header>

      {/* Hero Section */}
      <div className="h-[calc(100vh-3rem)] flex justify-center items-center px-4 text-center">
        <div className="grid justify-items-center gap-4 font-serif max-w-xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Welcome to Survvy</h1>
          <p className="text-lg sm:text-xl font-medium">Your survey solution</p>
          <p className="text-lg sm:text-xl font-medium">
            Create surveys, collect data, and analyze results
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4">
            <button className="bg-[#86BC24] hover:bg-[#B6BC23] text-white px-6 py-2 rounded">
              Get Started
            </button>
            <button className="bg-gray-500 hover:bg-[#B6BC23] text-white px-6 py-2 rounded">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
   

//   return (
//     <section className='h-screen z-0' style={backgroundStyle} >
//         <header className='h-12 z-10 bg-slate-50 px-6 flex justify-between items-center border border-b-2'>
//             <Link to={"/"} className='text-[#86BC24] text-2xl text-accent font-medium flex items-center'>Survvy</Link>
//             <div className='flex justify-center gap-4 items-center text-lg font-seri font-medium'>
//                 {/* <p className='text-gray-700 hover:text-[#86BC24]'>Request a demo</p>
//                 <p className='text-gray-700 hover:text-[#86BC24]'>Our Services</p> */}
//                 <p className='text-gray-700 hover:text-[#86BC24]'>About us</p>
//                 <Link to={"/login"} className='text-gray-700 hover:text-[#86BC24]'>Login</Link>
//             </div>
//         </header>
//         <div className='grid justify-items-center items-start gap-0'>
//             <div className='grid justify-items-center gap-[2px] items-center font-serif'>
//                 <h1 className='text-4xl font-bold'>Welcome to Survvy</h1>
//                 <p className='text-xl font-medium'>Your survey solution</p>
//                 <p className='text-xl font-medium'>Create surveys, collect data, and analyze results</p>
//                 <div className='flex justify-center items-center gap-2'>
//                 <button className='bg-[#86BC24] hover:bg-[#B6BC23] text-white px-4 py-2 rounded'>Get Started</button>
//                 <button className='bg-gray-500 hover:bg-[#B6BC23] text-white px-4 py-2 rounded'>Learn More</button>
//                 </div>
//             </div>
//         </div>
//     </section>
//   )
}

export default Home