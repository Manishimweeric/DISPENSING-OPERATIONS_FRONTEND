import React, { useState, useEffect } from 'react';
import { MdSearch, MdPrint } from 'react-icons/md';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const SupportList = () => {
  const [supports, setSupports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Number of items to display per page

  useEffect(() => {
    fetchSupportMessages();
  }, []);

  const fetchSupportMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/support/`);
      if (response.ok) {
        const data = await response.json();
        setSupports(data);
      } else {
        Swal.fire('Error', 'Failed to fetch support messages', 'error');
      }
    } catch (error) {
      console.error('Error fetching support messages:', error);
      Swal.fire('Error', 'Failed to fetch support messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Support Messages Report', doc.internal.pageSize.width / 2, 15, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated on: ' + new Date().toLocaleString(), doc.internal.pageSize.width / 2, 25, { align: 'center' });

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(15, 30, doc.internal.pageSize.width - 15, 30);

    doc.autoTable({
      startY: 40,
      head: [['Name', 'Email', 'Phone', 'Message', 'Date']],
      body: supports.map(support => [
        support.name,
        support.email,
        support.phone_number, // Make sure this matches API response
        support.message,
        new Date(support.created_at).toLocaleDateString(),
      ]),
      theme: 'striped',
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 3, halign: 'center', valign: 'middle' },
      headStyles: { fillColor: [52, 152, 219], textColor: 255, fontSize: 12, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [236, 240, 241] },
      margin: { top: 40, left: 15, right: 15 },
    });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text('Prepared by Source Oil', 15, finalY);
    doc.save('Support_Messages_Report.pdf');
  };

  const filteredSupports = supports.filter(support =>
    support.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    support.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    support.phone_number.includes(searchTerm)
  );

  // Sort by date in descending order
  const sortedSupports = filteredSupports.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Pagination Logic
  const totalPages = Math.ceil(sortedSupports.length / itemsPerPage);
  const currentSupports = sortedSupports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Support Messages</h2>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <button
            onClick={generatePDF}
            className="flex items-center justify-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <MdPrint className="mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : currentSupports.length === 0 ? (
        <p className="text-center text-gray-500">No support messages found.</p>
      ) : (
        <div className="space-y-4">
          {currentSupports.map((support) => (
            <div key={support.id} className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-700">{support.name}</h3>
                <span className="text-sm text-gray-500">{new Date(support.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-600"><strong>Email:</strong> {support.email}</p>
              <p className="text-gray-600"><strong>Phone:</strong> {support.phone_number}</p>
              <p className="text-gray-700 mt-2 border-t pt-2">{support.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Previous
        </button>
        <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SupportList;
