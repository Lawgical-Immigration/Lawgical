import React, { useState } from 'react';
import LoginPage from '../components/LoginPage';

export default function Dashboard() {
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  const openEmployeeModal = () => {
    setIsEmployeeModalOpen(true);
  };

  const closeEmployeeModal = () => {
    setIsEmployeeModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center bg-gray-200 p-4 border border-gray-300">
      {/* Header */}
      <div className="w-full bg-blue-400 p-4">
        <h1 className="text-center text-2xl font-bold text-black">LAWGICAL</h1>
      </div>

      {/* Buttons Row */}
      <div className="flex justify-between w-full mt-4 px-10">
        <button
          className="border border-gray-500 p-2 bg-white text-black"
          onClick={openEmployeeModal}
        >
          EMPLOYEE
        </button>
        <button className="border border-gray-500 p-2 bg-white text-black">
          EMPLOYER
        </button>
        <button className="border border-gray-500 p-2 bg-white text-black">
          ATTORNEY
        </button>
      </div>

      {/* Employee Login Modal */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-end">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeEmployeeModal}
              >
                &#10005; {/* X icon for closing the modal */}
              </button>
            </div>
            <LoginPage />
          </div>
        </div>
      )}
    </div>
  );
}
