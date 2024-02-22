"use client";

import React, { useState } from 'react';
import styles from './page.css';

function MemberProfile() {
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

    // Submit the form data
    console.log('Form submitted:', {
      fullName,
      address1,
      address2,
      city,
      state,
      zipCode,
    });
  };

  return (
    <div className="container">
      <h1>Member Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address1">Address 1:</label>
          <input
            type="text"
            id="address1"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address2">Address 2:</label>
          <input
            type="text"
            id="address2"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="state">State:</label>
          <select id="state" value={state} onChange={(e) => setState(e.target.value)} required>
            <option value="">Select a state...</option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            {/* ... other US states */}
            <option value="WY">Wyoming</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="zipCode">Zip Code:</label>
          <input
            type="text"
            id="zipCode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            required
          />
        </div>
        
        <button type="submit"href="/calc">Save and Continue</button>
        
      </form>

<a href="/Calc">Go to Next Page</a>
    </div>
  );
}

export default MemberProfile;
