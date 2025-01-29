import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Download } from 'lucide-react';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const InventoryManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [oilTypes, setOilTypes] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModal, setSelectedModal] = useState();
  const [quantity, setQuantity] = useState('')
  const[price, setPrice] = useState('');
  const [formData, setFormData] = useState({
    oil_type: '',
    quantity: 0,
    price_per_litre: '',
    date: '',
  });
  const tableRef = useRef();


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

  useEffect(() => {  

    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Inventory Report', 14, 16);
    doc.autoTable({
      head: [['Date', 'Oil Type', 'Quantity (L)', 'Price/L', 'Status']],
      body: stocks.map(stock => [
        new Date(stock.date).toLocaleDateString(),
        getOilTypeName(stock.oil_type),
        stock.quantity,
        `$${Number(stock.price_per_litre).toFixed(2)}`,
        stock.status,
      ]),
      startY: 20,
    });
    doc.save('inventory-report.pdf');
  };

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

  const handleViewDetails = (stock) => {
    setSelectedModal(stock);
    setPrice(stock.price_per_litre);
  };
  const closeModal = () => {
    setSelectedModal(null);
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.oil_type || !formData.quantity || !formData.price_per_litre || !formData.date) {
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


  const handleStockSubmit = async (e) => {
    e.preventDefault();

    const updatedQuantity = parseInt(selectedModal.quantity, 10) + parseInt(quantity, 0);

    const StockData = {
      quantity:updatedQuantity,
      price_per_litre:price
    };

    console.log(StockData);

    try {
        const response = await fetch(`${API_URL}/Stocks/${selectedModal.id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(StockData),
        });

        const responseData = await response.json();

        if (!response.ok) {
            Swal.fire({
                title: 'Error',
                text: responseData.error || 'Error adding Stock. Please try again.',
                icon: 'info',
                confirmButtonText: 'Oxkay',
            });
            return;
        }

        Swal.fire({
            title: 'Success!',
            text: 'Thank you for Replenishment Your Stock.',
            icon: 'success',
            confirmButtonText: 'Great',
        });

        setPrice('');
        setQuantity('');
        fetchData();
        closeModal();
    } catch (error) {
        console.error('Error adding maintenance:', error);
        Swal.fire({
            title: 'Error',
            text: 'Error adding maintenance. Please try again.',
            icon: 'error',
            confirmButtonText: 'Okay',
        });
    }
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
    <div className="bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Information</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={20} />
            <span>Download PDF</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <span>Print</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-yellow-700 text-white px-4 py-2 rounded-lg hover:bg-yellow-800 transition-colors"
          >
            <Plus size={20} />
            <span>New Stock</span>
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Weekly Inventory</h2>
        </div>
        <div className="overflow-x-auto" ref={tableRef}>
          {loading ? (
            <div className="text-center py-4">Loading inventory data...</div>
          ) : (
            <table className="w-full text-center">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3  text-sm font-medium text-gray-500">#</th>
                  <th className="px-6 py-3  text-sm font-medium text-gray-500">Date</th>
                  <th className="px-6 py-3  text-sm font-medium text-gray-500">Oil Type</th>
                  <th className="px-6 py-3  text-sm font-medium text-gray-500">Quantity (L)</th>
                  <th className="px-6 py-3  text-sm font-medium text-gray-500">Price/L</th>
                  <th className="px-6 py-3  text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3  text-sm font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stocks.map((stock, index) => (
                  <tr key={stock.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(stock.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{getOilTypeName(stock.oil_type)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{stock.quantity} Ltr</td>
                    <td className="px-6 py-4 text-sm text-gray-900">FRW {Number(stock.price_per_litre).toFixed(2)}</td>
                    <td className="px-6 py-4 text-md"><span className={`font-medium ${getStatusColor(stock.status)}`}>{stock.status}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                    <button
                      onClick={() => handleViewDetails(stock)}
                      className="mr-2 bg-yellow-700 text-white py-1 px-3 rounded hover:bg-yellow-700"
                    >
                      Replenishment
                    </button>
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
      {selectedModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <h3 className="text-2xl font-semibold text-gray-600 mb-6">Replenishment Quantity</h3>
            <form onSubmit={handleStockSubmit} >
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-gray-700 font-medium">Quantity</label>
                  <input 
                    type="number"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter Quantity"
                  />
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-gray-700 font-medium">Price (Option *)| RWF</label>
                  <input 
                    type="number"
                    name="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter Price"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={closeModal}
                  type="button"
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Replenishment
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
