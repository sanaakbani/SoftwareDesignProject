'use client'; // Client-side rendering
import Link from 'next/link';
import { useState, useEffect } from 'react';

const LoginPage = () => {
  const [gallons, setGallons] = useState('');
  const [date, setDate] = useState('');
  const [total, setTotal] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [username, setUsername] = useState('');
  const [suggestedPrice, setSuggestedPrice] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState('');  
  
  useEffect(() => {
    // Fetch address as soon as the component mounts
    if (typeof window !== 'undefined') {
      // Extracting username from URL query parameters
      const queryParams = new URLSearchParams(window.location.search);
      const usernameParam = queryParams.get('username');
      
      if (usernameParam && !username) {
        setUsername(usernameParam);
      }
    }
  },[username]);

  useEffect(() => {
    // Fetch address only if username is set
    if (username) {
      fetchAddress();
      fetchHistory(username);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[username]);

  


  

  const fetchHistory = async (username) => {
    try {
      const response = await fetch(`http://localhost:8000/subscribers/username/${username}/history`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      } else {
        throw new Error('Failed to fetch history.');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      // Handle error
    }
  };



  const fetchAddress = async () => {
    try {
      const addressResponse = await fetch(`http://localhost:8000/subscribers/username/${username}/address1`);
      if (!addressResponse.ok) {
        throw new Error('Failed to fetch address.');
      }
      const addressData = await addressResponse.json();
      const deliveryAddress = addressData.Address1;
      setDeliveryAddress(deliveryAddress);
    } catch (error) {
      console.error('Error fetching address:', error);
      // Handle error
    }
  };


  
  const handleSelectChange = (event) => {
    const selectedIndex = event.target.value;
    setSelectedEntry(history[selectedIndex]);
  };

  const calculate = async () => {
    if (isNaN(gallons)) {
     
      alert('Please enter valid numeric values for Gallons and Delivery Date.');
      return;
    }
   

    const parsedGallons = parseFloat(gallons);
    const parsedDate = parseFloat(date);

    if (parsedGallons <= 0 || parsedDate <= 0) {
      alert('Gallons and Delivery Date must be greater than zero.');
      return;
    }

    // Fetch address1 using the provided endpoint
    try {
      const addressResponse = await fetch(`http://localhost:8000/subscribers/username/${username}/address1`);
      if (!addressResponse.ok) {
        throw new Error('Failed to fetch address.');
      }
      const addressData = await addressResponse.json();
      const deliveryAddress = addressData.Address1;
      setDeliveryAddress(deliveryAddress);
      // Perform calculation based on client data
      const response = await fetch(`http://localhost:8000/subscribers/calculate/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gallonsRequested: gallons,
          deliveryAddress: deliveryAddress,
          deliveryDate: date
        })
      });

      if (response.ok) {
        const data = await response.json();
      setSuggestedPrice(data.suggestedPricePerGallon);
      setTotal(data.totalAmountDue);
      fetchHistory(username);
      } else {
        throw new Error('Failed to calculate.');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
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
                value={gallons}
                onChange={(e) => setGallons(e.target.value)}
                placeholder="Enter gallons"
                className="border border-gray-300 rounded-md px-3 py-2 text-black"
              />
            </div>
            <div className="flex flex-row gap-4">
              <label>Address:</label>
              <p>{deliveryAddress}</p>
            </div>
            <div className="flex flex-row gap-4">
              <label>Delivery Date:</label>
              <input
                type="date"
                value={date}
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
              <p>{suggestedPrice.toFixed(2)}/gal</p>
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

      
      {/* History dropdown */}
      <div className="flex flex-row gap-4 mt-24">
        <label>History:</label>
        <div className="flex flex-row gap-4">
          <select onChange={handleSelectChange} className="border border-gray-300 rounded-md px-3 py-2 text-black">
            <option value="">Select History</option>
            {history.slice().reverse().map((entry, index) => (
              <option key={index} value={index}>
                {`${entry.gallonsRequested} gallons, ${entry.deliveryAddress}, ${entry.deliveryDate}, $${entry.totalAmountDue}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Entry display */}
      {selectedEntry && (
        <div className="border border-black rounded-md p-4 mt-4">
          <p><strong>gallonsRequested:</strong> {selectedEntry.gallonsRequested}</p>
          <p><strong>deliveryAddress:</strong> {selectedEntry.deliveryAddress}</p>
          <p><strong>deliveryDate:</strong> {selectedEntry.deliveryDate}</p>
          <p><strong>suggestedPricePerGallon:</strong> {selectedEntry.suggestedPricePerGallon}</p>
          <p><strong>totalAmountDue:</strong> {selectedEntry.totalAmountDue}</p>
        </div>
      )}

      {/* Edit Profile button */}
      <div className="flex flex-row gap-4 mt-14">
        <div className="flex gap-4">
        <Link href={`/registration1?username=${username}`}>
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer">
              Edit Profile
            </button>
          </Link>
        </div>
      </div>
    </div>

  );
};

export default LoginPage;