import React, { useEffect, useState } from "react";
import { MdAdd } from 'react-icons/md';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const CustomerRegistrationForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    location: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUser(parsedData.user.id)
    }
}, []);
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form's default submission behavior
  
    const user_id = localStorage.getItem("user_id");
  
    // Destructure formData
    const { name, phoneNumber, location } = formData;
  
    // Check if required fields are filled
    if (!name || !phoneNumber || !location) {
      Swal.fire('Error', 'All fields are required', 'error');
      return;
    }
  
    try {
      // Prepare the payload
      const payload = {
        name,
        Phonenumber: phoneNumber,
        location,
        user: user_id,
        quantity:0
      };
  
      const response = await fetch(`${API_URL}/api/customers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Swal.fire('Success', 'Customer registered successfully!', 'success').then(() => {
          navigate('/manager/customers');
        });
      } else {
        Swal.fire('Error', data.detail || 'Unable to register customer', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Something went wrong. Please try again later.', 'error');
    }
  };
  

  return (
    <div className="flex items-center justify-center h-full w-full mt-20 bg-gray-100">
      <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg md:text-xl mb-10 flex items-center font-semibold text-gray-700">
          <MdAdd className="text-xl md:text-2xl mr-2" />
          Register a New Customer
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Enter Full Name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium">Phone Number</label>
            <input
              id="phoneNumber"
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="block w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Enter Phone Number"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium">Location</label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="block w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Enter Location"
            />
          </div>        
          <button type="submit" className="w-full bg-green-600 py-3 rounded-lg text-white font-semibold hover:bg-green-700 transition-colors">
            Add Customer
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerRegistrationForm;
