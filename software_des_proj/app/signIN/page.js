'use client'; // Client-side rendering
import Link from 'next/link';
import { useState } from 'react';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  var x;
  const handleSignUp = async () => {
    
    if (password !== confirmPassword) {
      setError("Passwords don't match. Please try again.");
      setPassword('');
      setConfirmPassword('');
    } else {
      try {
        const response = await fetch('http://localhost:8000/subscribers/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "Username": username, "Password": password })
        });
        x = response.status;
        if (response.status === 201) {
          // If registration is successful, redirect to the login page
          if (confirm("Registration successful. You will now be redirected to the login page to sign in.")) {
            window.location.href = '/'; 
          }
        } else {
          const data = await response.json();
          setError(data.message);
          setUsername(''); // Clear username field for retrying
        }
      } catch (error) {
        console.error('Error:', error);
        setError("BRUHBRUH" +x);
      }
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
          className="border border-gray-300 rounded-md px-3 py-2 text-black"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border border-gray-300 rounded-md px-3 py-2 text-black"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="border border-gray-300 rounded-md px-3 py-2 text-black"
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

export default SignUpPage