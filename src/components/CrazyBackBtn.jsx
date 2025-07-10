import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRocket, FaFire } from 'react-icons/fa';

const CrazyBackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-2.5 
                 bg-gradient-to-r from-teal-500 to-purple-500 
                 text-white font-semibold text-xs sm:text-sm md:text-base 
                 rounded-full shadow-md hover:shadow-lg 
                 hover:scale-105 active:scale-95 transition-all duration-300 
                 focus:outline-none focus:ring-2 focus:ring-teal-300 
                 animate-pulse max-w-fit"
    >
      <FaArrowLeft className="text-sm sm:text-base md:text-lg rotate-[-10deg]" />
      <FaRocket className="text-yellow-300 animate-bounce" />
      <FaFire className="text-red-400 animate-pulse" />
      <span className="hidden sm:inline">Back to Home</span>
    </button>
  );
};

export default CrazyBackButton;
