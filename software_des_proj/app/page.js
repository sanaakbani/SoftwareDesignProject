'use client'; // Client-side rendering
import Link from 'next/link';
import { useState } from 'react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/subscribers/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Username: username, Password: password })
      });

      const data = await response.json();

      if (response.ok) {
        // If validation is successful, navigate to the second page
        window.location.href = `/registration1?username=${username}`;
      } else {
        setError('Incorrect username or password. If not registered Click Sign in Button');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while trying to log in.');
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
          className="border border-gray-300 rounded-md px-3 py-2 text-black"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border border-gray-300 rounded-md px-3 py-2 text-black"
        />
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex gap-4">
          <button
            onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer"
          >
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
