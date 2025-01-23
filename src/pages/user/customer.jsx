import React, { useState, useEffect } from 'react';
import {  MdPrint, MdFileDownload } from 'react-icons/md';
import { Plus, X } from 'lucide-react';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const InventoryManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState([]); // State to store customers data
  const [oilTypes, setOilTypes] = useState([]); // State to store oil types
  const [loading, setLoading] = useState(true); // Loading state
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [searchName, setSearchName] = useState(''); // Search by customer name
  const [searchOilType, setSearchOilType] = useState(''); // Search by oil type

  const getOilTypeName = (oilTypeId) => {
    const oilType = oilTypes.find((type) => type.id === parseInt(oilTypeId));
    return oilType ? oilType.name : 'Unknown';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customersResponse, oilTypesResponse] = await Promise.all([
          fetch(`${API_URL}/customers/`),
          fetch(`${API_URL}/oiltypes/`),
        ]);

        const customersData = await customersResponse.json();
        const oilTypesData = await oilTypesResponse.json();

        setCustomers(customersData);
        setOilTypes(oilTypesData);
      } catch (error) {
        console.error('Failed to fetch data', error);
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

  const handleSearchName = (e) => setSearchName(e.target.value);

  const filteredCustomers = customers.filter((customer) => {
    const oilTypeName = getOilTypeName(customer.oil_type).toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchName.toLowerCase()) &&
      oilTypeName.includes(searchOilType.toLowerCase())
    );
  });

  // Print Functionality
  const handlePrint = () => {
    window.print();
  };

  // Download PDF Functionality
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Customer List', 10, 10);

    let yPosition = 20;
    filteredCustomers.forEach((customer, index) => {
      const dataLine = `${index + 1}. Name: ${customer.name}, Quantity: ${
        customer.quantity
      }, Plate: ${customer.plate_number}, Date: ${new Date(
        customer.created_at
      ).toLocaleDateString()}, Oil Type: ${getOilTypeName(customer.oil_type)}`;
      doc.text(dataLine, 10, yPosition);
      yPosition += 10;
    });

    doc.save('customer_list.pdf');
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers Informations</h1>
        <div className="flex space-x-4">
          <button
          onClick={handlePrint}
          className="flex items-center px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <MdPrint className="mr-2" />
          Print
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <MdFileDownload className="mr-2" />
          Download PDF
        </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">  
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search by name"
              value={searchName}
              onChange={handleSearchName}
              className="border rounded px-2 py-1"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Loading customer data...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Name
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('quantity')}
                  >
                    Quantity
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('plate_number')}
                  >
                    Plate Number
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Oil Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.plate_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{getOilTypeName(customer.oil_type)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
