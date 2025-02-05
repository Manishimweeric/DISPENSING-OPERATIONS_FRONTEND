import React, { useState, useEffect } from 'react';
import { MdEdit, MdDelete, MdSearch, MdRefresh, MdPrint } from 'react-icons/md';
import { Link } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const UserManagementTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stations, setStations] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/`);
      if (response.ok) {
        const data = await response.json();
        // Filter out users with the role 'Admin'
        const filteredUsers = data.filter(user => user.role !== 'admin');
        setUsers(filteredUsers);
      } else {
        Swal.fire('Error', 'Failed to fetch users', 'error');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      Swal.fire('Error', 'Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };
  

  const fetchStations = async () => {
    try {
      const response = await fetch(`${API_URL}/stations/`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch stations');
      setStations(data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStations();
  }, []);


  const getStationName = (stationId) => {
    const station = stations.find((s) => s.id === parseInt(stationId));
    return station ? station.name : 'Unknown';
};


const generatePDF = () => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text('Employees Management Report', doc.internal.pageSize.width / 2, 15, { align: 'center' });


  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text('Generated on: ' + new Date().toLocaleString(), doc.internal.pageSize.width / 2, 25, { align: 'center' });

  doc.setDrawColor(0, 0, 0); 
  doc.setLineWidth(0.5);
  doc.line(15, 30, doc.internal.pageSize.width - 15, 30);


  doc.autoTable({
    startY: 40,
    head: [['Name', 'Email', 'Phone', 'Role', 'Status']], 
    body: users.map(user => [
      user.name,
      user.email,
      user.phone_number,
      user.role,
      user.is_active ? 'Active' : 'Inactive',
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
      fillColor: [52, 152, 219],
      textColor: 255,
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

  doc.save('Employee_report.pdf');
};


  const filteredUsers = users.filter(user => {
    const roleMatch = selectedRole === 'all' || user.role === selectedRole;
    const searchMatch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone_number.includes(searchTerm);
    return roleMatch && searchMatch;
  });

  return (
    <div className="p-3 mt-10 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Employee Informations</h2>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 w-full md:w-64"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Pumpster">Pumpster</option>
          </select>
          <button
            onClick={fetchUsers}
            className="flex items-center justify-center px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <MdRefresh className="mr-2" />
            Refresh
          </button>
          <Link
            to="/admindashboard/signup"
            className="flex items-center justify-center px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <MdAdd className="mr-2" />
            Add Employee
          </Link>
          <button
            onClick={generatePDF}
            className="flex items-center justify-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <MdPrint className="mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50 text-center">
            <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Station</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">Loading...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No users found</td>
              </tr>
            ) : (
              filteredUsers.map((user,index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>  {/* Display count */}
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.phone_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'manager' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStationName(user.station)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {user.created_at}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementTable;
