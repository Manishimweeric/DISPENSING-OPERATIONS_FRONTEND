import React, { useState } from 'react';
import { MdLocalGasStation, MdLocationOn, MdCheckCircle,MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const StationRegistrationForm = () => {
  const navigate = useNavigate();
  const [station, setStation] = useState({
    name: '',
    location: '',
    status: ''
  });

  const handleChange = (e) => {
    setStation({ ...station, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!station.name || !station.location || !station.status) {
      Swal.fire('Error', 'All fields are required', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/stations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(station),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire('Success', 'Station registered successfully!', 'success').then(() => {
          
        });
      } else {
        Swal.fire('Error', data.detail || 'Unable to register station', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Something went wrong. Please try again later.', 'error');
    }
  };

  return (
    <div className="flex items-center justify-center h-full w-full mt-60 bg-gray-100">
       
          <div className="absolute top-4 right-4">
            <h1 className="text-xl md:text-2xl font-bold text-green-600">Source OIL</h1>
          </div>
          <div className="w-full max-w-2xl mx-auto">
              <h2 className="text-lg md:text-2xl mb-4 md:mb-6 flex items-center">
                <MdAdd className="text-xl md:text-2xl mr-2" />
                Register New Station
              </h2>
                  
            <form onSubmit={handleSubmit}>
              <div className="mb-4 md:mb-6  ">
                <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                  Station Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdLocalGasStation className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"ya
                    id="name"
                    value={station.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 md:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                    placeholder="Enter station name"
                  />
                </div>
              </div>

              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700" htmlFor="location">
                  Location
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdLocationOn className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={station.location}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 md:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                    placeholder="Enter station location"
                  />
                </div>
              </div>

              <div className="mb-5 md:mb-8">
                <label className="block text-sm font-medium text-gray-700" htmlFor="status">
                  Status
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdCheckCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="status"
                    id="status"
                    value={station.status}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 md:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                  >
                    <option value="">Select status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-sm font-medium shadow-md hover:shadow-lg"
              >
                Register Station
              </button>
            </form>
          </div>
        </div>
      
  
  );
};

export default StationRegistrationForm;