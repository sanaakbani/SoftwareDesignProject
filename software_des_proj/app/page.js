'use client'; // Client-side rendering
import Link from 'next/link';
import { useState } from 'react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'anish' && password === 'bruh') {
      // Implement login functionality (For demo purposes, just console logging)
      window.location.href = 'https://example.com';
      console.log('Logged in successfully with username:', username);
    } else {
      setError('Incorrect username or password. If not registered Click Sign in Button');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Login Page</h1>
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
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex gap-4">
          <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer">
            Login
          </button>
          <Link href="/signIN">
            <div className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded cursor-pointer">
              Sign Up
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;