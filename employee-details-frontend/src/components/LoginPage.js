import React, { useState } from 'react';

const LoginPage = ({ closeSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="text-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded-md"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full py-2 font-semibold text-white bg-black rounded-md hover:bg-gray-800"
        >
          Log in
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
