import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {useNavigate } from 'react-router-dom';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    role: '',
    station: '',
  });
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState([]);
  const [roles] = useState(['Manager', 'Pumpster']);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch(`${API_URL}/api/stations/`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch stations');
        setStations(data);
      } catch (error) {
        console.error('Error fetching stations:', error);
      }
    };
    fetchStations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      Swal.fire('Success', 'Thank you for Registering Employee!!', 'success').then(() => {
        navigate('/admindashboard/users');
      });
    } catch (err) {
      Swal.fire('Error!', err.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex  ml-48 bg-gray-100 py-12 px-6 lg:px-8">
      <div className=" w-[80%] rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Register</h1>
        <p className="text-gray-600 mb-6">Create an account to get started</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="fullName"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="block w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your email address"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={handleChange}
              required
              className="block w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="block w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Create a password"
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="block w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select a role</option>
              {roles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Station */}
          <div>
            <label htmlFor="station" className="block text-sm font-medium text-gray-700">
              Station
            </label>
            <select
              id="station"
              name="station"
              value={formData.station}
              onChange={handleChange}
              required
              className="block w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select a station</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-yellow-700 hover:bg-yellow-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                loading && 'opacity-50 cursor-not-allowed'
              }`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
