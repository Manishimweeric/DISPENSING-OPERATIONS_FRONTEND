import React, { useState } from 'react';
import { Plus, AlertTriangle, X, Calendar, BarChart2, Droplet } from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert';

const InventoryManagement = () => {
  const [showModal, setShowModal] = useState(false);
  
  // Sample inventory data
  const inventoryData = [
    { date: '11/11/2024', fuelType: 'Diesel', tankLevels: 90, rating: 4 },
    { date: '22/10/2024', fuelType: 'Gasoline', tankLevels: 25, rating: 3 },
    { date: '11/11/2024', fuelType: 'Diesel', tankLevels: 50, rating: 4 },
  ];

  const overallStock = [
    { category: 'Diesel', level: 'adequate', quantity: '500L', value: '₹250000' },
    { category: 'Gasoline', level: 'low', quantity: '100L', value: '₹2500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
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

      {/* Alert for Low Stock */}
      {/* {overallStock.some(stock => stock.level === 'low') && (
        // <Alert className="mb-6 border-red-200 bg-red-50">
        //   <AlertTriangle className="h-4 w-4 text-red-500" />
        //   <AlertDescription className="text-red-500">
        //     Low Fuel In Upper Tank - please place an order
        //   </AlertDescription>
        // </Alert>
      )} */}

      {/* Overall Inventory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {overallStock.map((stock) => (
          <div key={stock.category} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{stock.category}</h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                  stock.level === 'low' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {stock.level}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Remaining Quantity</div>
                <div className="text-lg font-bold">{stock.quantity}</div>
                <div className="text-sm text-gray-500">{stock.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Weekly Inventory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Fuel Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Tank Levels</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventoryData.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      item.fuelType === 'Diesel' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {item.fuelType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${item.tankLevels}%` }}
                        />
                      </div>
                      <span className="text-sm">{item.tankLevels}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < item.rating ? 'text-yellow-400' : 'text-gray-200'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Stock Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Stock</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oil Type</label>
                <select className="w-full border rounded-lg p-2">
                  <option>Diesel</option>
                  <option>Gasoline</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (L)</label>
                <input type="number" className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Litre</label>
                <input type="number" step="0.01" className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full border rounded-lg p-2">
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
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