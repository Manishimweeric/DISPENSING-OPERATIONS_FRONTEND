import React, { useState, useEffect } from 'react';
import { MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const StationRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    station: '',
    Date: '',
    Time: '',
    status: 'Active',
  });

  const [stations, setStations] = useState([]);

  // Fetch station list
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { station, Date, Time, status } = formData;

    if (!station || !Date || !Time) {
      Swal.fire('Error', 'All fields are required', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/calibrations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire('Success', 'Calibration registered successfully!', 'success').then(() => {
          navigate('/admindashboard/calibration'); // Redirect to calibration list or desired page
        });
      } else {
        Swal.fire('Error', data.detail || 'Unable to register calibration', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Something went wrong. Please try again later.', 'error');
    }
  };

  return (
    <div className="flex items-center justify-center h-full w-full mt-60 bg-gray-100">
      <div className="w-full max-w-2xl mx-auto">
        <h2 className="text-lg md:text-2xl mb-2 flex items-center">
          <MdAdd className="text-xl md:text-2xl mr-2" />
          Create a New Calibration
        </h2>
        <form onSubmit={handleSubmit}>
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

          <div className="mb-4 md:mb-6">
            <label className="block text-sm font-medium text-gray-700" htmlFor="Date">
              Date
            </label>
            <input
              type="date"
              name="Date"
              id="Date"
              value={formData.Date}
              onChange={handleChange}
              className="block w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="mb-4 md:mb-6">
            <label className="block text-sm font-medium text-gray-700" htmlFor="Time">
              Time
            </label>
            <input
              type="time"
              name="Time"
              id="Time"
              value={formData.Time}
              onChange={handleChange}
              className="block w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-sm font-medium"
          >
            Register Calibration
          </button>
        </form>
      </div>
    </div>
  );
};

export default StationRegistrationForm;
