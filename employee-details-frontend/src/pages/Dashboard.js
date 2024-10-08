import React, { useState } from 'react';
import Signup from '../components/Signup';

export default function Dashboard() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openSignup = () => {
    setIsSignupOpen(true);
  };

  const closeSignup = () => {
    setIsSignupOpen(false);
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen p-4 bg-gray-200">
      {/* Header */}
      <div className="w-full p-4 bg-blue-400">
        <h1 className="text-2xl font-bold text-center text-black">LAWGICAL</h1>
      </div>

      {/* Buttons Row */}
      <div className="flex justify-between w-full px-10 mt-4">
        <button
          className="p-2 text-black bg-white border border-gray-500"
          onClick={openSignup}
        >
          EMPLOYEE
        </button>
        <button className="p-2 text-black bg-white border border-gray-500">
          EMPLOYER
        </button>
        <button className="p-2 text-black bg-white border border-gray-500">
          ATTORNEY
        </button>
      </div>

      {/* Signup Modal */}
      {isSignupOpen && <Signup closeSignup={closeSignup} />}
    </div>
  );
}


