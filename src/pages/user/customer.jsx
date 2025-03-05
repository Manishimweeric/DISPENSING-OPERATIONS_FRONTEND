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
  const [customerDetails, setCustomerDetails] = useState('');
  const [showDetails, setShowDetails] = useState(false); // This will control the table visibility
  const [showResponseDetails, setShowResponseDetails] = useState(false);
  const [ResponseDetails, setResponseDetails] = useState('')


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
        fetch(`${API_URL}/oiltypes/`),
      ]);

      const customersDatas = await customersResponse.json();

      const customersData = customersDatas.filter(customer => {
        return customer.user == user_id;
      });


      const oilTypesData = await oilTypesResponse.json();

      // Assuming 'quantity' is the field you want to order by
      const sortedCustomers = customersData.sort((a, b) => b.quantity - a.quantity);

      setCustomers(sortedCustomers); // Set the sorted data
      setOilTypes(oilTypesData);
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

  const handleCloseModal = () => {
    setShowDetails(false); // Close the modal
  };

  const handleCloseResponseModal = () => {
    setShowResponseDetails(false); // Close the modal
  };

  const handleResponse = async (email) => {
    try {
      const detailResponse = await fetch(`${API_URL}/customer-responses/${email}/`, {
        method: 'GET',
      });

      if (!detailResponse.ok) {

        await Swal.fire({
          icon: "info",
          title: "Information",
          text: `Currently, there are no responses to display. Please check back later.`,
          confirmButtonText: "Wait",
        });
      }
      const detailData = await detailResponse.json();
      setResponseDetails(detailData);
      setShowResponseDetails(true);
      console.log("Fetched ResponseDetails:", ResponseDetails);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  // Print Functionality
  const handlePrint = () => {
    window.print();
  };

  const handleViewDetail = async (customerId) => {
    try {
      const detailResponse = await fetch(`${API_URL}/customer-details/?customer_id=${customerId}`, {
        method: 'GET',
      });

      if (!detailResponse.ok) {
        throw new Error('Failed to fetch customer details');
      }

      const detailData = await detailResponse.json();
      setCustomerDetails(detailData);
      setShowDetails(true);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  const handleAddDiscount = async (customer) => {
    try {
      const confirmation = await Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: `Do you want to apply a discount to ${customer.name}? This will reduce their quantity by 10,000.`,
        showCancelButton: true,
        confirmButtonText: "Yes, apply discount",
        cancelButtonText: "No, cancel",
      });

      if (!confirmation.isConfirmed) {
        return; // Exit if user cancels
      }

      if (!customer || typeof customer.quantity === "undefined") {
        throw new Error("Invalid customer data");
      }

      const currentQuantity = parseInt(customer.quantity, 10);
      if (isNaN(currentQuantity)) {
        throw new Error("Invalid quantity value");
      }

      const updatedQuantity = Math.max(currentQuantity - 1000, 0);


      const response = await fetch(`${API_URL}/send-email/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({ email: customer.email }),
      });
      const updateResponse = await fetch(`${API_URL}/customersdata/${customer.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: updatedQuantity,
          cdiscount: "taken",
          status: "2",
        }),
      });

      if (!updateResponse.ok) {
        const errorMessage = await updateResponse.text();
        throw new Error(`Failed to update: ${errorMessage}`);
      }

      await Swal.fire({
        icon: "success",
        title: "Customer Updated",
        text: `Thank you for adding a discount to ${customer.name}! Your remaining quantity is now ${updatedQuantity} Ltr.`,
        confirmButtonText: "OK",
      });

      if (typeof fetchData === "function") {
        fetchData(); // Refresh data after update
      }

    } catch (error) {
      console.error("Error:", error.message);

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "An error occurred while processing the request.",
        confirmButtonText: "OK",
      });
    }
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

  return (
    <div className="bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers Informations</h1>
        <div className="flex space-x-4">

          <button
            onClick={() => navigate('/manager/Add-customer')}
            className="flex items-center bg-yellow-700 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <MdAdd className="mr-2 text-xl" />
            Add New Customer
          </button>

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
                  <th className="px-6 py-3  text-sm font-medium text-gray-500">
                    Actions
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
                    <td className="px-6 py-4 text-sm text-gray-900 space-x-2">
                      <button
                        onClick={() => handleViewDetail(customer.id)}
                        className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                      >
                        View Detail
                      </button>
                      <button
                        onClick={() => handleAddDiscount(customer)}
                        className={`px-4 py-2 text-white rounded-md  ${customer.quantity >= 1000 ? 'bg-green-500 rounded-md hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
                        disabled={customer.quantity < 1000}
                      >
                        Add Discount
                      </button>
                      <button
                        onClick={() => handleResponse(customer.email)}
                        className="px-4 py-2 text-white bg-yellow-700 rounded-md hover:bgyellow-700"
                      >
                        View Response
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>


      {showResponseDetails && ResponseDetails.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ease-in-out">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl transform transition-transform duration-300 ease-in-out">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">Your Submitted Responses</h2>

            {ResponseDetails.length > 0 ? (
              ResponseDetails.map((response, index) => (
                <div key={index} className="mb-6 pb-6 border-b last:border-b-0">
                  <div className="text-lg font-medium text-gray-800">
                    <strong>Email:</strong>
                    <span className="text-gray-600 ml-2">{response.email}</span>
                  </div>
                  <div className="text-lg mt-2 text-gray-800">
                    <strong>Message:</strong>
                    <p className="text-gray-600">{response.message}</p>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    <strong>Submitted on:</strong>
                    <span className="ml-2">{new Date(response.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600 p-8">
                <p className="text-xl font-semibold">No Responses Available</p>
                <p className="mt-2">Currently, there are no responses to display. Please check back later.</p>
              </div>
            )}


            <div className="mt-6 flex justify-center">
              <button
                onClick={() => handleCloseResponseModal(false)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-3/4 max-w-5xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Customer Details</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-600 hover:text-gray-800"
              >
                &times;
              </button>
            </div>
            <div className="overflow-x-auto shadow rounded-lg">
              <table className="min-w-full bg-white border-collapse border text-center border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-sm font-medium text-gray-600">#</th>
                    <th className="py-2 px-4 border-b text-sm font-medium text-gray-600">Customer</th>
                    <th className="py-2 px-4 border-b text-sm font-medium text-gray-600">Quantity</th>
                    <th className="py-2 px-4 border-b text-sm font-medium text-gray-600">Plate Number</th>
                    <th className="py-2 px-4 border-b text-sm font-medium text-gray-600">Payment Method</th>
                    <th className="py-2 px-4 border-b text-sm font-medium text-gray-600">File</th>
                  </tr>
                </thead>
                <tbody>
                  {customerDetails.length > 0 ? (
                    customerDetails.map((detail, index) => (
                      <tr key={detail.id}>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{index + 1}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{detail.Customer}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{detail.quantity}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{detail.plate_number}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{detail.Method}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">
                          {detail.file ? (
                            <>
                              <a
                                href={`${API_URL}/media/uploads/${detail.file.split('/').pop()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                                download={detail.file.split('/').pop()} // Extracting file name for download
                              >
                                Payment File {/* Displaying the file name */}
                              </a>
                            </>
                          ) : (
                            'No file uploaded'
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-4 px-4 text-center text-red-500">
                        No customer details available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
