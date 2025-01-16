import React, { useEffect, useState } from "react";
import { MoreHorizontal } from 'lucide-react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const Dashboard = () => {
  const [operation, setOperation] = useState(null);
  const [oilTypes, setOilTypes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [userId, setUserId] = useState('');
  const [liters, setLiters] = useState();
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    plate_number: '',
    oil_type: '',
    payment_method: '',
  });
  
  const fetchTransactions = async () => {
    const user_id = localStorage.getItem("user_id");
    const today = new Date().toISOString().split('T')[0]; 

    try {
      const response = await fetch(`${API_URL}/customers/`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      const customers = await response.json();
  
     
    const filteredCustomers = customers.filter(customer => {
      const createdAt = customer.created_at.split(' ')[0]; 
      return customer.user == user_id && createdAt == today;
    });
    
      const totalLiters = filteredCustomers.reduce((total, customer) => {
        return total + customer.quantity;
      }, 0);

      setLiters(totalLiters)
      const oilResponse = await fetch(`${API_URL}/oiltypes/`);
      if (!oilResponse.ok) throw new Error('Failed to fetch oil types');
      const oilTypes = await oilResponse.json();
      const customersWithOilNames = filteredCustomers.map(customer => {
        const oilType = oilTypes.find(oil => oil.id === customer.oil_type);
        return {
          ...customer,
          oil_name: oilType ? oilType.name : 'Unknown'
        };
      });
  
      setTransactions(customersWithOilNames);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };


  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserId(parsedData.user.id)
      setOperation(parsedData);
    }

    const fetchOilTypes = async () => {
      try {
        const response = await fetch(`${API_URL}/oiltypes/`);
        if (!response.ok) throw new Error('Failed to fetch oil types');
        const data = await response.json();
        setOilTypes(data);
      } catch (error) {
        console.error('Error fetching oil types:', error);
      }
    };

    fetchOilTypes();
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("User Id : " + userId)

    const customerData = {
      name: formData.name,
      quantity: formData.quantity,
      plate_number: formData.plate_number,
      oil_type: formData.oil_type,
      Method: formData.payment_method,
      user : userId
    };

    try {
      const response = await fetch(`${API_URL}/customers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      
      if (response.ok) {
        const newCustomer = await response.json();
        console.log('Customer added:', newCustomer);
        Swal.fire({
          icon: 'success',
          title: 'Customer Added',
          text: 'The customer has been added successfully!',
          confirmButtonText: 'OK',
        });

           setFormData({
            name: '',
            quantity: '',
            plate_number: '',
            oil_type: '',
            payment_method: '',
          });
          fetchTransactions();
      } else {
        console.log('Failed to add customer');
        Swal.fire({
          icon: 'error',
          title: 'Failed to Add Customer',
          text: 'There was an error adding the customer.',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      // Show error alert with SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while adding the customer.',
        confirmButtonText: 'OK',
      });
    }
  };


  if (!operation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 ">

      {/* Add Customer Section */}
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Add Customer Section */}
      <div className="w-full lg:w-96 bg-slate-200 text-black shadow-xl rounded-lg p-6 mb-4 lg:mb-0">
        <h2 className="text-2xl font-bold mb-6">Add Customer</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 mt-2 rounded-lg bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter Name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium">Quantity</label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-3 mt-2 rounded-lg bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter Quantity"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="plate_number" className="block text-sm font-medium">Plate Number</label>
            <input
              id="plate_number"
              type="text"
              name="plate_number"
              value={formData.plate_number}
              onChange={handleChange}
              className="w-full p-3 mt-2 rounded-lg bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter Plate Number"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="oil_type" className="block text-sm font-medium">Oil Type</label>
            <select
              id="oil_type"
              name="oil_type"
              value={formData.oil_type}
              onChange={handleChange}
              className="w-full p-3 mt-2 rounded-lg bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select Oil Type</option>
              {oilTypes.map((oil, index) => (
                <option key={index} value={oil.id}>{oil.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="payment_method" className="block text-sm font-medium">Payment Method</label>
            <select
              id="payment_method"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full p-3 mt-2 rounded-lg bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select Payment Method</option>
              <option value="MOMO">MOMO</option>
              <option value="CASH">CASH</option>
              <option value="CARD">CARD</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-green-600 py-3 rounded-lg text-white font-semibold hover:bg-green-700 transition-colors">
            Add Customer
          </button>
        </form> 
      </div>
    </div>

      {/* Main Dashboard Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Sales Overview Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
           {oilTypes.map((oil, index) => (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-xs text-gray-500 mb-1">{oil.name}</div>
              <div className="text-lg font-bold">${oil.price}</div>
            </div>
              ))}

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Total Litter per day</div>
            <div className="text-lg font-bold">{liters} ltr</div>
          </div>
        </div>

        {/* Last 10 Transactions */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Last 10 Transactions</h2>
            <button>
              <MoreHorizontal className="text-gray-500" size={16} />
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="pb-2">Customer</th>
                <th className="pb-2">Plate Number</th>
                <th className="pb-2">Quantity</th>  
                <th className="pb-2">Fuel Type</th>
                <th className="pb-2">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 text-sm">{transaction.name}</td>
                  <td className="py-2 text-sm">{transaction.plate_number}</td>
                  <td className="py-2 text-sm">{transaction.quantity}</td>
                  <td className="py-2 text-sm">{transaction.oil_name}</td>
                  <td className="py-2 text-sm">{transaction.Method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Information Section */}
      <div className="w-full lg:w-80 bg-gray-100 shadow-xl rounded-lg p-6 space-y-6 border border-gray-300">
        <h2 className="text-3xl font-bold text-blue-600">User Information</h2>

        <div className="space-y-4">
          <div className="justify-between">
            <span className="text-lg font-medium text-gray-800">Name:</span>
            <p className="text-gray-700">{operation.user.name}</p>
          </div>

          <div className="justify-between">
            <span className="text-lg font-medium text-gray-800">Email:</span>
            <p className="text-gray-700">{operation.user.email}</p>
          </div>

          <div className="justify-between">
            <span className="text-lg font-medium text-gray-800">Phone:</span>
            <p className="text-gray-700">{operation.user.phone_number}</p>
          </div>

          <div className="justify-between">
            <span className="text-lg font-medium text-gray-800">Role:</span>
            <p className="text-gray-700">Pump {operation.user.role}</p>
          </div>
        </div>
        <div className="flex justify-center">
          <Link
            to="/login" // Replace this with the correct route for your logout logic
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 focus:outline-none"
          >
            Logout
          </Link>
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;
