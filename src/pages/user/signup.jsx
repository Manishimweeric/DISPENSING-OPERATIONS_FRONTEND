import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

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
  const [roles] = useState(['Manager', 'Pump operator']); // Role options

  // Fetch the stations from the API
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch(`${API_URL}/api/stations/`); // Assuming this endpoint provides a list of stations
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch stations');
        }

        setStations(data); // Set the fetched stations in state
      } catch (error) {
        console.error('Error fetching stations:', error);
      }
    };

    fetchStations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      Swal.fire({
        title: 'Success!',
        text: 'Registration successful! Redirecting to login...',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: err.message || 'Something went wrong',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mt-20 w-full flex rounded-2xl shadow-lg bg-white overflow-hidden">
        <div className="hidden md:block w-1/2">
          <img 
            src="image/woman.png"
            alt="Woman at gas station"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <div className="flex justify-end mb-6">
            <span className="text-green-500 text-lg font-semibold">Source OIL</span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">Hello!</h1>
            <p className="text-sm text-gray-600">Sign Up to Get Started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="sr-only" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full py-2.5 px-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-green-500"
                placeholder="Full Name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="sr-only" htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full py-2.5 px-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-green-500"
                placeholder="Email Address"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="sr-only" htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone_number"
                type="tel"
                required
                value={formData.phone_number}
                onChange={handleChange}
                className="block w-full py-2.5 px-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-green-500"
                placeholder="Phone Number"
              />
            </div>

            {/* Password */}
            <div>
              <label className="sr-only" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full py-2.5 px-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-green-500"
                placeholder="Password"
              />
            </div>

            {/* Role Select */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="" disabled>Select Role</option>
                {roles.map((role, index) => (
                  <option key={index} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Station Select */}
            <div>
              <label htmlFor="station" className="block text-sm font-medium text-gray-700">Station</label>
              <select
                name="station"
                id="station"
                value={formData.station}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="" disabled>Select Station</option>
                {stations.map((station) => (
                  <option key={station.id} value={station.id}>{station.name}</option> // Adjust based on your station model's attributes
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-6 w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-4 mb-0 text-center text-muted">
            Already has An Account?
            <Link to="/login" className="text-decoration-none text-green-500 hover:text-green-600 hover:text-primary-dark transition duration-200 ml-1">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;