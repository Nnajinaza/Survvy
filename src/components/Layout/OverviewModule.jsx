import React from 'react';
import { Link } from 'react-router-dom';

const OverviewModule = () => {
    const brand = "#86BC24"; // Example brand color, replace with your actual brand color
  return (
    <div className=''>
      {/* <h2 >Dashboard Overview</h2> */}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {/* Organizations Overview */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-xl font-semibold">Organizations</h3>
          <p className="text-2xl font-bold">15</p>
          <p className="text-gray-500">Total Organizations</p>
          <Link to="/dashboard" className={`text-[${brand}] hover:text-blue-500`}>View Details</Link>
        </div>

        {/* Surveys Overview */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-xl font-semibold">Surveys</h3>
          <p className="text-2xl font-bold">32</p>
          <p className="text-gray-500">Active Surveys</p>
          <Link to="/dashboard" className={`text-[${brand}] hover:text-blue-500`}>View Details</Link>
        </div>

        {/* Users Overview */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-xl font-semibold">Users</h3>
          <p className="text-2xl font-bold">112</p>
          <p className="text-gray-500">Total Users</p>
          <Link to="/dashboard" className={`text-[${brand}] hover:text-blue-500`}>View Details</Link>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Recent Activities</h3>
        {/* Example of recent activities */}
        <ul className="list-disc pl-5">
          <li>New organization "Org C" added</li>
          <li>Survey "Survey 1" completed</li>
          <li>New user "John Doe" registered</li>
        </ul>
      </div>
    </div>
  );
};

export default OverviewModule;
