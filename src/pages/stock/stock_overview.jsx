import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const InventoryManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [oilTypes, setOilTypes] = useState([]); 
  const [stocks, setStocks] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [alert, setAlert] = useState(null); 
  const [formData, setFormData] = useState({
    oil_type: '',
    quantity: '',
    price_per_litre: '',
    date: '',
    status: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [oilTypesResponse, stocksResponse] = await Promise.all([
          fetch(`${API_URL}/oiltypes/`),
          fetch(`${API_URL}/stocks/`)
        ]);

        const oilTypesData = await oilTypesResponse.json();
        const stocksData = await stocksResponse.json();

        setOilTypes(oilTypesData);
        setStocks(stocksData);
      } catch (error) {
        console.error('Failed to fetch data', error);
        Swal.fire('Error', 'Failed to load inventory data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOilTypeChange = (e) => {
    const oilTypeId = e.target.value;
    setFormData({ ...formData, oil_type: oilTypeId });

    const oilType = oilTypes.find(type => type.id === parseInt(oilTypeId));
    if (oilType) {
      setFormData(prevFormData => ({
        ...prevFormData,
        price_per_litre: oilType.price,
      }));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.oil_type || !formData.quantity || !formData.price_per_litre || !formData.date || !formData.status) {
      Swal.fire('Error', 'All fields are required', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/stocks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire('Success', 'Stock recorded successfully!', 'success');
        setShowModal(false);
        setFormData({
          oil_type: '',
          quantity: '',
          price_per_litre: '',
          date: '',
          status: '',
        });
        refreshStocks();
      } else {
        const data = await response.json();
        Swal.fire('Error', data.detail || 'Unable to record stock', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Something went wrong. Please try again later.', 'error');
    }
  };

  const refreshStocks = async () => {
    try {
      const response = await fetch(`${API_URL}/stocks/`);
      const data = await response.json();
      setStocks(data);
    } catch (error) {
      console.error('Failed to refresh stocks', error);
    }
  };

  const getOilTypeName = (oilTypeId) => {
    const oilType = oilTypes.find(type => type.id === parseInt(oilTypeId));
    return oilType ? oilType.name : 'Unknown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'text-green-600';
      case 'Low Stock':
        return 'text-yellow-600';
      case 'Out of Stock':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus size={20} />
          <span>New Stock</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Weekly Inventory</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Loading inventory data...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Oil Type</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Quantity (L)</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price/L</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stocks.map((stock) => (
                  <tr key={stock.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(stock.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {getOilTypeName(stock.oil_type)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {stock.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${Number(stock.price_per_litre).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-medium ${getStatusColor(stock.status)}`}>
                        {stock.status}
                      </span>
                    </td>
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
              <h2 className="text-xl font-bold">Add New Stock</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oil Type</label>
                <select 
                  name="oil_type" 
                  value={formData.oil_type} 
                  onChange={handleOilTypeChange} 
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select Oil Type</option>
                  {oilTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (L)</label>
                <input 
                  type="number" 
                  name="quantity" 
                  value={formData.quantity} 
                  onChange={handleChange} 
                  className="w-full border rounded-lg p-2" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Litre</label>
                <input 
                  type="text" 
                  name="price_per_litre" 
                  value={formData.price_per_litre} 
                  onChange={handleChange} 
                  className="w-full border rounded-lg p-2" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleChange} 
                  className="w-full border rounded-lg p-2" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange} 
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select Status</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Add Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
