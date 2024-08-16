import React from 'react';
import logo from '../logo.svg'; // Adjust the path if necessary

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fdf4e3]">
      <div className="relative bg-[#fdf4e3] p-8 rounded-lg shadow-lg w-[400px]">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl">
          &#10005; {/* X icon for closing the modal */}
        </button>

        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Lawgical Logo" className="w-12 h-12" />
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">Lawgical</h2>
        </div>

        {/* Continue with Google Button */}
        <button className="w-full flex items-center justify-center py-2 bg-black text-white rounded-md mb-4">
          <span className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M21.82 12.21c0-.66-.06-1.3-.18-1.92H12v3.64h5.56a4.77 4.77 0 01-2.07 3.13v2.6h3.33c1.95-1.8 3.07-4.45 3.07-7.45z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M12 22c2.7 0 4.97-.9 6.62-2.44l-3.32-2.6c-.93.63-2.1 1-3.3 1a5.46 5.46 0 01-5.13-3.67H3.47v2.63A10 10 0 0012 22z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M6.87 13.29a5.47 5.47 0 010-3.58V7.08H3.47a10 10 0 000 9.84l3.4-2.63z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M12 5.47c1.47 0 2.8.51 3.84 1.5l2.87-2.86A9.77 9.77 0 0012 2a9.99 9.99 0 00-8.53 4.92l3.4 2.63A5.46 5.46 0 0112 5.47z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          Continue with Google
        </button>

        {/* Other Sign Up Options */}
        <p className="text-center text-gray-600 text-sm mb-4">
          Other Sign Up Options
        </p>

        {/* Log In */}
        <p className="text-center text-gray-600 text-sm">
          Already have a Lawgical account?{' '}
          <button className="text-white bg-red-600 hover:bg-red-700 py-1 px-4 rounded-md mt-2">
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}
