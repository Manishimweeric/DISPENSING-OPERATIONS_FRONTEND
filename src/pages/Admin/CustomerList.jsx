import * as XLSX from "xlsx";
import React, { useState, useEffect } from 'react';
import { MdPrint, MdFileDownload } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const InventoryManagement = () => {
  const navigate = useNavigate();
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


  const fetchData = async () => {
    const user_id = parseInt(localStorage.getItem('user_id'));
    try {
      setLoading(true);
      const [customersResponse, oilTypesResponse] = await Promise.all([
        fetch(`${API_URL}/customers/`),
      ]);
      const customersData = await customersResponse.json();    
      const sortedCustomers = customersData.sort((a, b) => b.quantity - a.quantity);
      setCustomers(sortedCustomers);
    } catch (error) {
      console.error('Failed to fetch data', error);
      Swal.fire('Error', 'Failed to load customer data', 'error');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
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
      const dataLine = `${index + 1}. Name: ${customer.name}, Quantity: ${customer.quantity
        }, Plate: ${customer.plate_number}, Date: ${new Date(
          customer.created_at
        ).toLocaleDateString()}, Oil Type: ${getOilTypeName(customer.oil_type)}`;
      doc.text(dataLine, 10, yPosition);
      yPosition += 10;
    });

    doc.save('customer_list.pdf');
  };




  
const generatePDF = () => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text('Customers Report', doc.internal.pageSize.width / 2, 15, { align: 'center' });


  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text('Generated on: ' + new Date().toLocaleString(), doc.internal.pageSize.width / 2, 25, { align: 'center' });

  doc.setDrawColor(0, 0, 0); 
  doc.setLineWidth(0.5);
  doc.line(15, 30, doc.internal.pageSize.width - 15, 30);


  doc.autoTable({
    startY: 40,
    head: [['Name', 'Quantity', 'Phone', 'Email']], 
    body: customers.map(customer => [
      customer.name,
      customer.Quantity,
      customer.Phonenumber,
      customer.email,
      customer.is_active ? 'Active' : 'Inactive',
    ]),
    theme: 'striped', 
    styles: {
      font: 'helvetica', 
      fontSize: 10, 
      cellPadding: 3,
      halign: 'center', 
      valign: 'middle', 
      lineWidth: 0.5, 
    },
    headStyles: {
      fillColor: [234, 179, 8],
      textColor: 0,
      fontSize: 12, 
      fontStyle: 'bold', 
    },
    alternateRowStyles: {
      fillColor: [236, 240, 241], 
    },
    margin: { top: 40, left: 15, right: 15 }, 
  });

  const finalY = doc.lastAutoTable.finalY + 10; 

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text('Prepared by Source Oil', 15, finalY);
  const pageCount = doc.internal.pages.length;
  doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`, doc.internal.pageSize.width - 15, doc.internal.pageSize.height - 10, { align: 'right' });

  doc.save('customer_report.pdf');
};

const downloadCSV = () => {
  // Define the CSV headers
  const headers = ["Name", "Quantity", "Phone", "Email", "Status"];
  const csvRows = [];

  // Push headers as the first row
  csvRows.push(headers.join(","));

  // Push each customer's data
  customers.forEach(customer => {
    csvRows.push([
      customer.name,
      customer.Quantity,
      customer.Phonenumber,
      customer.email,
      customer.is_active ? 'Active' : 'Inactive'
    ].join(","));
  });

  // Convert the rows into a CSV file
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

  // Create a download link and trigger download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Customer_Report.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



const downloadExcel = () => {
  const wb = XLSX.utils.book_new(); // Create a new workbook

  // Convert customer data into a structured sheet format
  const ws = XLSX.utils.json_to_sheet(customers.map(customer => ({
    "Name": customer.name,
    "Quantity": customer.Quantity,
    "Phone": customer.Phonenumber,
    "Email": customer.email,
    "Status": customer.is_active ? 'Active' : 'Inactive'
  })));

  // Apply header styles (optional, requires additional styling library)
  ws["!cols"] = [
    { wch: 20 }, // Name column width
    { wch: 10 }, // Quantity column width
    { wch: 15 }, 
    { wch: 25 }, 
    { wch: 10 }  // Status column width
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Customers"); // Append sheet to workbook
  XLSX.writeFile(wb, "Customer_Report.xlsx"); // Save the file
};








  return (
    <div className="bg-gray-50 p-6 mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers Informations</h1>
        <div className="flex space-x-4">
        
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <MdPrint className="mr-2" />
            Print
          </button>

          <button
            onClick={downloadCSV}
            className="flex items-center px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <MdFileDownload className="mr-2" />
            Download CSV
          </button>

          <button
            onClick={downloadExcel}
            className="flex items-center px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <MdFileDownload className="mr-2" />
            Download Excel
          </button>
          
          <button
            onClick={generatePDF}
            className="flex items-center px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-700 transition-colors"
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
            <table className="w-full text-center">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500 cursor-pointer" onClick={() => handleSort('name')}>
                    #
                  </th>
                  <th className="px-6 py-3  text-sm font-medium text-gray-500 cursor-pointer" onClick={() => handleSort('name')}>
                    Name
                  </th>
                  <th className="px-6 py-3  text-sm font-medium text-gray-500 cursor-pointer" onClick={() => handleSort('quantity')}>
                    Quantity
                  </th>
                  <th className="px-6 py-3  text-sm font-medium text-gray-500 cursor-pointer" onClick={() => handleSort('plate_number')}>
                    Phone Number
                  </th>
                  <th className="px-6 py-3  text-sm font-medium text-gray-500 cursor-pointer" onClick={() => handleSort('plate_number')}>
                    Email
                  </th>
                  <th className="px-6 py-3  text-sm font-medium text-gray-500 cursor-pointer" onClick={() => handleSort('plate_number')}>
                    Create At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer, index) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.quantity || 0} ltr</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.Phonenumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.created_at}</td>
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
