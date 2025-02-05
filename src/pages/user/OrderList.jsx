import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const PumpOperatorPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stations, setStations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDateFilter, setFromDateFilter] = useState('');
  const [toDateFilter, setToDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10; // Number of orders per page

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/orders/`);
        const data = await response.json();
        
        // Sort orders by date in descending order
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
        Swal.fire('Error', 'Failed to load orders', 'error');
      } finally {
        setLoading(false);
      }
    };

    const fetchStations = async () => {
        try {
          const response = await fetch(`${API_URL}/stations/`);
          const data = await response.json();
          setStations(data);
        } catch (error) {
          console.error("Failed to fetch stations", error);
        }
      };

    fetchOrders();
    fetchStations();
  }, []);

  const getStationName = (stationId) => {
    const station = stations.find((s) => s.id === parseInt(stationId));
    return station ? station.name : "Unknown";
  };

  // Filter orders by status and date range
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    const matchesFromDate =
      fromDateFilter ? new Date(order.created_at) >= new Date(fromDateFilter) : true;
    const matchesToDate =
      toDateFilter ? new Date(order.created_at) <= new Date(toDateFilter) : true;
    return matchesStatus && matchesFromDate && matchesToDate;
  });

  // Get the current page's orders
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Handle next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-10">Order Management</h1>
      </div>

      {/* Filter Section */}
      <div className="flex space-x-4 mb-4">
        {/* Status Filter */}
        <select
          className="px-4 py-2 border rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
        </select>

        {/* From Date Filter */}
        <input
          type="date"
          className="px-4 py-2 border rounded-md"
          value={fromDateFilter}
          onChange={(e) => setFromDateFilter(e.target.value)}
        />

        {/* To Date Filter */}
        <input
          type="date"
          className="px-4 py-2 border rounded-md"
          value={toDateFilter}
          onChange={(e) => setToDateFilter(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Loading orders...</div>
          ) : currentOrders.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No orders available</div>
          ) : (
            <table className="w-full text-center">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">#</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Order Name</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Oil Type</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Station</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Status </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentOrders.map((order, index) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.name}</td>
                    <td
                      className={`px-6 py-4 text-sm font-medium ${
                        order.status === "Pending"
                          ? "text-yellow-600 bg-yellow-100 px-3 py-1 rounded-md"
                          : order.status === "Approved"
                          ? "text-green-600 bg-green-100 px-3 py-1 rounded-md"
                          : "text-gray-900"
                      }`}
                    >
                      {order.status}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.oil_type}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{getStationName(order.station)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.status}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Custom Pagination */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={prevPage}
          className="px-4 py-2 bg-gray-300 text-white rounded-md mx-2"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        
        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 ${
              currentPage === index + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            } rounded-md`}
          >
            {index + 1}
          </button>
        ))}
        
        <button
          onClick={nextPage}
          className="px-4 py-2 bg-gray-300 text-white rounded-md mx-2"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PumpOperatorPage;
