import React, { useState } from 'react';
import { MdWaterDrop, MdDescription, MdAttachMoney } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const OilTypeForm = () => {
  const navigate = useNavigate();
  const [oilType, setOilType] = useState({
    name: '',
    price: '',
  });
  
  const handleChange = (e) => {
    setOilType({ ...oilType, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!oilType.name || !oilType.price) {
      Swal.fire('Error', 'All fields are required', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/oiltypes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(oilType),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire('Success', 'Oil type registered successfully!', 'success').then(() => {
        });
      } else {
        Swal.fire('Error', data.detail || 'Unable to register oil type', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Something went wrong. Please try again later.', 'error');
    }
  };

  return (
    <div className="flex items-center justify-center mt-60 h-full w-full bg-gray-100">
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 relative">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-lg md:text-2xl   mb-4 md:mb-6">Register New Oil Type</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                  Oil Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdWaterDrop className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"   
                    name="name"
                    id="name"
                    value={oilType.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 md:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                    placeholder="Enter oil type name"
                  />
                </div>
              </div>

              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700" htmlFor="description">
                  Oil Price
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdDescription className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    value={oilType.description}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 md:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                    placeholder="Enter oil price per litre"
                  />
                </div>
              </div>

              

              <button
                type="submit"
                className="w-full bg-yellow-700 text-white py-2 md:py-3 px-4 md:px-6 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-yellow-700 text-sm font-medium shadow-md hover:shadow-lg"
              >
                Register Oil Type
              </button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default OilTypeForm;