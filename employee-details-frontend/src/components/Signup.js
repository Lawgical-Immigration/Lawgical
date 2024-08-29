import React, { useState } from 'react';
import logo from '../assets/lawgical_logo_light.png'; // Import the logo
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';

const Signup = ({ closeSignup }) => {
  const [currentComponent, setCurrentComponent] = useState('signup'); // Track the current component

  const switchToLogin = () => {
    setCurrentComponent('login');
  };

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-20">
      <div className="relative p-8 bg-[#FAF2E7] rounded-lg shadow-lg w-[400px] text-center">
        {/* Close Button */}
        <button
          onClick={closeSignup}
          className="absolute text-gray-500 top-2 right-2 hover:text-gray-800"
        >
          &times;
        </button>
        {/* Logo */}
        <img src={logo} alt="Lawgical Logo" className="w-12 h-12 mx-auto mb-4" />

        {/* Title */}
        <h2 className="mb-6 text-2xl font-bold text-black">Lawgical</h2>

        {/* Render the SignupPage or LoginPage depending on the state */}
        {currentComponent === 'signup' && (
          <SignupPage switchToLogin={switchToLogin} closeSignup={closeSignup} />
        )}
        {currentComponent === 'login' && <LoginPage closeSignup={closeSignup} />}
      </div>
    </div>
  );
};

export default Signup;
