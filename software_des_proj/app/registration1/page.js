'use client'; // Client-side rendering
import React, { useState } from 'react';
import { Link } from 'next/link';

const MemberProfile = () => {
  const [fullName, setFullName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validation
    if (!fullName || !address1 || !state || !city || !zipCode) {
      alert('Please fill in all required fields.');
      return;
    }

    // Validate Full Name length (50 characters)
    if (fullName.length > 50) {
      alert('Full Name must be at most 50 characters.');
      return;
    }

    // Validate Address 1 length (100 characters)
    if (address1.length > 100) {
      alert('Address 1 must be at most 100 characters.');
      return;
    }

    // Validate Address 2 length (100 characters)
    if (address2.length > 100) {
      alert('Address 2 must be at most 100 characters.');
      return;
    }

    // Validate City length (100 characters)
    if (city.length > 100) {
      alert('City must be at most 100 characters.');
      return;
    }

    // Validate Zip Code length (at least 5 characters)
    if (zipCode.length < 5 || zipCode.length > 9) {
      alert('Zip Code must be between 5 and 9 characters.');
      return;
    }

    // Validate Zip Code as integers only
    const zipCodePattern = /^\d+$/;
    if (!zipCodePattern.test(zipCode)) {
      alert('Zip Code must contain only digits.');
      return;
    }

    // Submit the form data
    console.log('Form submitted:', {
      fullName,
      address1,
      address2,
      city,
      state,
      zipCode,
    });

    // Redirect to the next page (For demo purposes, redirecting to /calc)
    window.location.href = '/Calc';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Member Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="form-group">
          <label htmlFor="fullName" className="mb-1 mr-2">Full Name:</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            maxLength="50"
            className="border border-gray-300 rounded-md px-3 py-2 text-black mt-1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="address1" className="mb-1 mr-2">Address 1:</label>
          <input
            type="text"
            id="address1"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            required
            maxLength="100"
            className="border border-gray-300 rounded-md px-3 py-2 text-black mt-1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="address2" className="mb-1 mr-2">Address 2:</label>
          <input
            type="text"
            id="address2"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            maxLength="100"
            className="border border-gray-300 rounded-md px-3 py-2 text-black mt-1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="city" className="mb-1 mr-2">City:</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            maxLength="100"
            className="border border-gray-300 rounded-md px-3 py-2 text-black mt-1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="state" className="mb-1 mr-2">State:</label>
          <select
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
            className="border border-gray-300 rounded-md px-3 py-2 text-black mt-1"
          >
            <option value="">Select a state...</option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PA">Pennsylvania</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="zipCode" className="mb-1 mr-2">Zip Code:</label>
          <input
            type="text"
            id="zipCode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            required
            pattern="\d+"
            minLength="5"
            maxLength="9"
            className="border border-gray-300 rounded-md px-3 py-2 text-black mt-1"
          />
        </div>
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded cursor-pointer mt-2">
          Save and Continue
        </button>
      </form>
    </div>
  );
};

export default MemberProfile;
