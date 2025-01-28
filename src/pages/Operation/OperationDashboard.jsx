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
  const [customerCode, setCustomerCode] = useState("");
  const [foundCustomer, setFoundCustomer] = useState(null);
  const [Oldquantity, setOldquantity] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    plate_number: '',
    oil_type: '',
    payment_method: '',
    file : null,
  });
  
  const fetchTransactions = async () => {
    const user_id = localStorage.getItem("user_id");
    const today = new Date().toISOString().split('T')[0]; 

    try {
      const response = await fetch(`${API_URL}/customers/`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      const customers = await response.json();
  
     
    const filteredCustomers = customers
    
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

  const handleFileChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === "file" && files && files.length > 0) {
      // Update the file in the state and store the file name
      setFormData((prevData) => ({
        ...prevData,
        file: files[0], 
        fileName: files[0].name, 
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("User Id : " + userId);
    const updatedQuantity = parseInt(Oldquantity, 10) + parseInt(formData.quantity, 10);
  
    const customerData = new FormData();
    customerData.append('Customer', customerCode);
    customerData.append('quantity', formData.quantity);
    customerData.append('plate_number', formData.plate_number);
    customerData.append('Method', formData.payment_method);
    customerData.append('oil_type', formData.oil_type);
    customerData.append('user', userId);
    customerData.append('status', 1);

  
    if (formData.file) {
      customerData.append('file', formData.file);
    }

    if (formData.file) {
      console.log("file name:", formData.file.name);
      console.log("file size:", formData.file.size);
      console.log("file type:", formData.file.type);
    }

    for (let pair of customerData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    try {
      const updateResponse = await fetch(`${API_URL}/customersdata/${customerCode}/`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: updatedQuantity }), 
      });
  
      if (!updateResponse.ok) {
        throw new Error('Failed to update customer quantity');
      }
  
      console.log('Customer quantity updated successfully.');


      const detailResponse = await fetch(`${API_URL}/customer-details/`, {
        method: 'POST',
        body: customerData,  // No need to set content-type, FormData will handle it
      })

  
      if (detailResponse.ok) {
        const newCustomerDetail = await detailResponse.json();
        console.log('CustomerDetail added:', newCustomerDetail);
  
        Swal.fire({
          icon: 'success',
          title: 'Customer Detail Added',
          text: 'The customer detail has been added successfully!',
          confirmButtonText: 'OK',
        });
  
        // Reset the form
        setFormData({
          name: '',
          quantity: '',
          plate_number: '',
          oil_type: '',
          payment_method: '',
        });

        setFoundCustomer(null);
  
        // Fetch updated transactions or data
        fetchTransactions();
      } else {

        const newCustomerDetail = await detailResponse.json();
        console.error('Failed to add customer detail:', newCustomerDetail);

        throw new Error('Failed to add customer detail');

        
      }
    } catch (error) {
      console.error('Error:', error);
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while processing the request.',
        confirmButtonText: 'OK',
      });
    }
  };
    

  const handleSearch = async () => {
    try {
      const response = await fetch(`${API_URL}/customers/${customerCode}`);
      if (!response.ok) {
        if (response.status === 404) {
          Swal.fire({
            icon: 'info',
            title: 'Information ',
            text: 'No customer found with this code. Please Register first on Manager',
            confirmButtonText: 'OK',
          });
          setFoundCustomer(null); // Clear any previous customer
          return;
        }
        throw new Error('Failed to fetch customer');
      }
  
      const customer = await response.json();  
      setFoundCustomer(customer); // Store the found customer
      setFormData({ ...formData, name: customer.name});
      setOldquantity(customer.quantity);
    } catch (error) {
      console.error('Error fetching customer:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while searching for the customer.',
        confirmButtonText: 'OK',
      });
      setFoundCustomer(null); // Clear any previous customer in case of error
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
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="customer_code" className="block text-sm font-medium">
              Enter Customer Code
            </label>
            <div className="flex">
              <input
                id="customer_code"
                type="text"
                value={customerCode}
                onChange={(e) => setCustomerCode(e.target.value)}
                className="block w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Enter  Code"
              />
              <button
                onClick={handleSearch}
                type="button"
                className="ml-2 bg-yellow-700 px-6 p-3 py-3 rounded-lg text-white font-semibold hover:bg-green-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        {foundCustomer && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4 p-4 border-gray-300 bg-slate-400 text-black rounded-lg shadow-lg">
            <p className="text-md font-semibold">
              <span className="text-black">Full Name :</span> {formData.name}
            </p>
            <p className="text-md font-semibold mt-2">
              <span className="text-black">Current Quantity : </span> {Oldquantity} Ltr
            </p>
          </div>


          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="block w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Enter Quantity"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="plate_number" className="block text-sm font-medium">
              Plate Number
            </label>
            <input
              id="plate_number"
              type="text"
              name="plate_number"
              value={formData.plate_number}
              onChange={handleChange}
              className="block w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Enter Plate Number"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="oil_type" className="block text-sm font-medium">
              Oil Type
            </label>
            <select
              id="oil_type"
              name="oil_type"
              value={formData.oil_type}
              onChange={handleChange}
              className="block w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              <option value="" disabled>Select Oil Type</option>
              {oilTypes.map((oil, index) => (
                <option key={index} value={oil.id}>
                  {oil.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="payment_method" className="block text-sm font-medium">
              Payment Method
            </label>
            <select
              id="payment_method"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="block w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              <option value="" disabled>Select Payment Method</option>
              <option value="MOMO">MOMO</option>
              <option value="CARD">CARD</option>
            </select>

            <div className="mb-4">
            <label htmlFor="file" className="block text-sm font-medium">
              Upload File
            </label>
            <input
              id="file"
              name="file"
              type="file"
              onChange={handleFileChange} // Handle file selection
              className="block w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
               />
          </div>

          </div>
          <button
            type="submit"
            className="w-full bg-yellow-700 py-3 rounded-lg text-white font-semibold hover:bg-green-700 transition-colors"
          >
            Add Customer
          </button>
        </form>
      )}
    </div>
    </div>
    </div>
      {/* Main Dashboard Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Sales Overview Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
           {oilTypes.map((oil, index) => (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-xs text-gray-500 mb-1">{oil.name}</div>
              <div className="text-lg font-bold">{oil.price} FRW</div>
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
              <th className="pb-2">#</th>
                <th className="pb-2">Customer</th>
                <th className="pb-2">Created by </th>
                <th className="pb-2">Quantity</th>  
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="border-t">
                   <td className="py-2 text-sm">{index + 1}</td>
                  <td className="py-2 text-sm">{transaction.name}</td>
                  <td className="py-2 text-sm">{transaction.created_at}</td>
                  <td className="py-2 text-sm">{transaction.quantity} Ltr</td>
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
            className="px-4 py-2 bg-yellow-700 text-white rounded-lg shadow hover:bg-yellow-700 focus:outline-none"
          >
            Logout
          </Link>
        </div>
      </div>
      
   
    </div>
  );
};

export default Dashboard;



