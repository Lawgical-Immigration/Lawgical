import React, { useState } from 'react';
import logo from '../assets/lawgical_logo_light.png'; // Import the logo
import SignupForm from './SignupForm';

const SignupPage = ({ switchToLogin, closeSignup }) => {
  const [showSignupForm, setShowSignupForm] = useState(false);

  const handleGoogleLogin = () => {
  };

  const handleMicrosoftLogin = () => {
  };

  const toggleSignupForm = () => {
    setShowSignupForm(!showSignupForm);
  };

  return (
    <div>
      <div>
        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full py-2 mb-4 font-semibold text-white bg-black rounded-md hover:bg-gray-800"
        >
          <span className="mr-2">G</span> Continue with Google
        </button>

        {/* Microsoft Login Button */}
        <button
          onClick={handleMicrosoftLogin}
          className="flex items-center justify-center w-full py-2 mb-4 font-semibold text-white bg-black rounded-md hover:bg-gray-800"
        >
          <span className="mr-2">M</span> Continue with Microsoft
        </button>

        {/* Signup with Email Button */}
        <button onClick={toggleSignupForm} className="flex items-center justify-center w-full mb-4 font-light underline size-4">
          Signup With Email
        </button>

        {/* Conditional Signup Form */}
        {showSignupForm && <SignupForm />}

        {/* Already have an account */}
        <p className="mb-4 text-gray-600">Already have a Lawgical account?</p>
        <button
          onClick={switchToLogin}
          className="w-full py-2 font-semibold text-white rounded-md bg-[#9B333B] hover:bg-[#7a282e]"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
