import React from 'react'
import { Link } from 'react-router-dom'
import banner from './../../images/bg.jpg'

const Home = () => {
    const backgroundStyle = {
        backgroundImage: `url(${banner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        margin: '0',
        display: 'grid',            
    };
   

  return (
    <section className='h-screen z-0' style={backgroundStyle} >
        <header className='h-12 z-10 bg-slate-50 px-6 flex justify-between items-center border border-b-2'>
            <Link to={"/"} className='text-[#86BC24] text-2xl text-accent font-medium flex items-center'>Survvy</Link>
            <div className='flex justify-center gap-4 items-center text-lg font-seri font-medium'>
                {/* <p className='text-gray-700 hover:text-[#86BC24]'>Request a demo</p>
                <p className='text-gray-700 hover:text-[#86BC24]'>Our Services</p> */}
                <p className='text-gray-700 hover:text-[#86BC24]'>About us</p>
                <Link to={"/login"} className='text-gray-700 hover:text-[#86BC24]'>Login</Link>
            </div>
        </header>
        <div className='grid justify-items-center items-start gap-0'>
            <div className='grid justify-items-center gap-[2px] items-center font-serif'>
                <h1 className='text-4xl font-bold'>Welcome to Survvy</h1>
                <p className='text-xl font-medium'>Your survey solution</p>
                <p className='text-xl font-medium'>Create surveys, collect data, and analyze results</p>
                <div className='flex justify-center items-center gap-2'>
                <button className='bg-[#86BC24] hover:bg-[#B6BC23] text-white px-4 py-2 rounded'>Get Started</button>
                <button className='bg-gray-500 hover:bg-[#B6BC23] text-white px-4 py-2 rounded'>Learn More</button>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Home