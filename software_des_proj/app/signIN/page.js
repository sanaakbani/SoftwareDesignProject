'use client'; // Client-side rendering
import Link from 'next/link';
import { useState } from 'react';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match. Please try again.");
      setPassword('');
      setConfirmPassword('');
    } else {
      // Implement sign-up functionality
      console.log('Signed up successfully with username:', username, 'and password:', password);
      // Redirect to a link (For demo purposes, redirecting to example.com)
      window.location.href = 'https://example.com';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Sign Up Page</h1>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border border-gray-300 rounded-md px-3 py-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border border-gray-300 rounded-md px-3 py-2"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="border border-gray-300 rounded-md px-3 py-2"
        />
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex gap-4">
          <button onClick={handleSignUp} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded cursor-pointer">
            Sign Up
          </button>
        </div>
        <div>
          <p>Already have an account? <Link href="/"><span className="text-blue-500 cursor-pointer">Sign In</span></Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
