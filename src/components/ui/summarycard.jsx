// 📁 src/components/dashboard/SummaryCard.tsx
import React from 'react';

const SummaryCard = ({ title, value }) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white p-4 shadow group transition-all duration-300 hover:shadow-lg my-4">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#86bc238a] to-[#86BC23] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out opacity-30 pointer-events-none" />

      <div className="relative z-10">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>  
    );
};

export default SummaryCard