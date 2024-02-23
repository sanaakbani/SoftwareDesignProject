'use client'; // Client-side rendering
import Link from 'next/link';
import { useState } from 'react';

const LoginPage = () => {
  const [gallons, setGallons] = useState('');
  const [date, setDate] = useState('');
  const [total, setTotal] = useState(0);

  const calculate = () => {
    if (isNaN(gallons) || isNaN(date)) {
      alert('Please enter valid numeric values for Gallons and Delivery Date.');
      return;
    }

    const parsedGallons = parseFloat(gallons);
    const parsedDate = parseFloat(date);

    if (parsedGallons <= 0 || parsedDate <= 0) {
      alert('Gallons and Delivery Date must be greater than zero.');
      return;
    }

    setTotal(parsedGallons > parsedDate ? parsedDate : parsedGallons);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-24 text-center">Fuel Quote</h1>

      <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/2">
        <div className="flex-auto">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <label>Gallons:</label>
              <input
                type="text"
                onChange={(e) => setGallons(e.target.value)}
                placeholder="Enter gallons"
                className="border border-gray-300 rounded-md px-3 py-2 text-black"
              />
            </div>
            <div className="flex flex-row gap-4">
              <label>Address:</label>
              <p>(Static random value)</p>
            </div>
            <div className="flex flex-row gap-4">
              <label>Delivery Date:</label>
              <input
                type="date"
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-black"
              />
            </div>
          </div>
        </div>

        <div className="flex-auto">
          {/* This section intentionally left blank for spacing */}
        </div>

        <div className="flex-auto">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <label>Suggested Price:</label>
              <p>{total / gallons ? (total / gallons).toFixed(2) : 0}/gal</p>
            </div>
            <div className="flex flex-row gap-4">
              <label>Total Due:</label>
              <p>{total}</p>
            </div>
            <button
              onClick={calculate}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer"
            >
              Calculate
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-4 mt-24">
        <label>History:</label>
        <div className="flex flex-row gap-4">
          <div className="border border-black rounded-md px-3 py-2">transaction 1</div>
          <div className="border border-black rounded-md px-3 py-2">price</div>
          <div className="border border-black rounded-md px-3 py-2">amount</div>
          <div className="border border-black rounded-md px-3 py-2">distance transported</div>
        </div>
      </div>

      <div className="flex flex-row gap-4 mt-14">
        <div className="flex gap-4">
          <Link href="/registration1">
            <button
              onClick={calculate}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer"
            >
              Edit Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
