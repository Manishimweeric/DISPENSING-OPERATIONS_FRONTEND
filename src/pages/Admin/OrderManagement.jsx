import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {  MdFileDownload } from 'react-icons/md';
import { jsPDF } from 'jspdf';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const PumpOperatorPage = () => {
  const [orders, setOrders] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;


  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/orders/`);
      const data = await response.json();
      setOrders(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (error) {
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
      console.error('Failed to fetch stations', error);
    }
  };

  useEffect(() => {   

    fetchOrders();
    fetchStations();
  }, []);

  const handleApprove = async (order) => {
    try {
      const response = await fetch(`${API_URL}/orders/${order.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' }),
      });

      const Approvedresponse = await fetch(`${API_URL}/send-Order-Approved/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: order.email }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === order.id ? { ...order, status: 'Approved' } : order
          )
        );
        Swal.fire('Success', 'Order Approved!', 'success');
        fetchOrders();
      } else {
        Swal.fire('Error', 'Failed to approve order', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  const filteredOrders = orders.filter((order) => {
    const stationMatch = selectedStation ? order.station === parseInt(selectedStation) : true;
    const statusMatch = selectedStatus ? order.status === selectedStatus : true;
    const dateMatch =
      startDate && endDate
        ? new Date(order.created_at) >= new Date(startDate) &&
          new Date(order.created_at) <= new Date(endDate)
        : true;
    return stationMatch && statusMatch && dateMatch;
  });

 

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Function to generate and download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text('Station Orders Report', doc.internal.pageSize.width / 2, 15, { align: 'center' });
  
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text('Generated on: ' + new Date().toLocaleString(), doc.internal.pageSize.width / 2, 25, { align: 'center' });
  
  
    doc.setDrawColor(0, 0, 0); 
    doc.setLineWidth(0.5);
    doc.line(15, 30, doc.internal.pageSize.width - 15, 30);
  
    // Table Columns and Rows
    const tableColumn = ["#", "Order Name", "Oil Type", "Station", "Status", "Created At"];
    const tableRows = [];
  
    // Populate table rows
    paginatedOrders.forEach((order, index) => {
      const orderData = [
        index + 1 + (currentPage - 1) * rowsPerPage,
        order.name,
        order.oil_type,
        getStationName(order.station),
        order.status,
        order.created_at,
      ];
      tableRows.push(orderData);
    });
  
    // Table Styling
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35, // Start the table just below the introductory text
      margin: { top: 25, left: 14, right: 14, bottom: 20 }, // Set the margins for the page
      styles: {
        cellPadding: 3,
        fontSize: 10,
        overflow: 'linebreak',
        halign: 'center', // Center-align the table data
        valign: 'middle',
      },
      headStyles: {
        fillColor: [33, 150, 243], // Blue background for headers
        textColor: [255, 255, 255], // White text color
        fontStyle: 'bold', // Bold text for headers
        halign: 'center', // Center-align the header
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Light gray for alternate rows
      },
    });
  
    // Save the document
    doc.save('orders_report.pdf');
  };

  const getStationName = (stationId) => {
    const station = stations.find((s) => s.id === parseInt(stationId));
    return station ? station.name : "Unknown";
  };
  

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Station Order management Orders</h1>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-wrap gap-4 mb-6">
        <select className="p-2 border rounded-lg bg-gray-50" value={selectedStation} onChange={(e) => setSelectedStation(e.target.value)}>
          <option value="">All Stations</option>
          {stations.map((station) => (
            <option key={station.id} value={station.id}>{station.name}</option>
          ))}
        </select>

        <select className="p-2 border rounded-lg bg-gray-50" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
        </select>

        <div className="flex items-center space-x-4">
          <label htmlFor="startDate" className="font-medium text-gray-700">From</label>
          <input 
            type="date" 
            id="startDate" 
            className="p-2 border rounded-lg bg-gray-50" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
          />
          
          <label htmlFor="endDate" className="font-medium text-gray-700">To</label>
          <input 
            type="date" 
            id="endDate" 
            className="p-2 border rounded-lg bg-gray-50" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
          />
          
        </div>

        <div className="flex justify-end ml-64">
        <button
            onClick={downloadPDF}
            className="flex items-center px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <MdFileDownload className="mr-2" />
            Download PDF
          </button>
      </div>
      </div>
      {/* Orders Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        {loading ? (
          <div className="text-center py-4">Loading orders...</div>
        ) : paginatedOrders.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No orders available</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-center border border-gray-200">
              <thead className="bg-gray-100 text-gray-500">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Order Name</th>
                  <th className="px-6 py-3">Oil Type</th>
                  <th className="px-6 py-3">Station</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Created At</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedOrders.map((order, index) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4">{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                    <td className="px-6 py-4">{order.name}</td>
                    <td className="px-6 py-4">{order.oil_type}</td>
                    <td className="px-6 py-4">{getStationName(order.station)}</td>
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
                    <td className="px-6 py-4">{order.created_at}</td>
                    <td className="px-6 py-4">
                      {order.status === 'Pending' ? (
                        <button className="bg-yellow-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={() => handleApprove(order)}>Approve</button>
                      ) : (
                        <span className="text-gray-400">Approved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        {[...Array(totalPages)].map((_, i) => (
          <button key={i} className={`mx-1 px-4 py-2 ${currentPage === i + 1 ? 'bg-yellow-700 text-white' : 'bg-gray-300'}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
        ))}
      </div>
    </div>
  );
};

export default PumpOperatorPage;
