import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const InventoryManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState([]); // State to store customers data
  const [loading, setLoading] = useState(true); // Loading state
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/customers/`);
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Failed to fetch customers data', error);
        Swal.fire('Error', 'Failed to load customer data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...customers].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setCustomers(sortedData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus size={20} />
          <span>New Customer</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Customer List</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Loading customer data...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => handleSort('name')}>
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => handleSort('quantity')}>
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => handleSort('plate_number')}>
                    Plate Number
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => handleSort('date')}>
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => handleSort('status')}>
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Oil Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.plate_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(customer.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.status}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.oil_type.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Customer</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            {/* Add customer form goes here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
