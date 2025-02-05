import React, { useState, useEffect } from 'react';
import { MdEdit, MdDelete, MdSearch, MdRefresh } from 'react-icons/md';
import Swal from 'sweetalert2';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const OilManagementTable = () => {
  const [oils, setOils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOils = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/oiltypes/`);
      if (response.ok) {
        const data = await response.json();
        setOils(data);
      } else {
        Swal.fire('Error', 'Failed to fetch oils', 'error');
      }
    } catch (error) {
      console.error('Error fetching oils:', error);
      Swal.fire('Error', 'Failed to fetch oils', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOils();
  }, []);

  const handleDeleteOil = async (oilId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const response = await fetch(`${API_URL}/oiltypes/${oilId}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          Swal.fire('Deleted!', 'Oil type has been deleted.', 'success');
          fetchOils();
        } else {
          Swal.fire('Error', 'Failed to delete oil type', 'error');
        }
      }
    } catch (error) {
      console.error('Error deleting oil type:', error);
      Swal.fire('Error', 'Failed to delete oil type', 'error');
    }
  };

  const filteredOils = oils.filter(oil => {
    const statusMatch = selectedStatus === 'all' || oil.status === selectedStatus;
    const searchMatch = oil.name.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <div className="p-6 bg-white rounded-lg mt-10  shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Oil Management</h2>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 w-full md:w-64"
              placeholder="Search oils..."
              value={searchTerm}  
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={fetchOils}
            className="flex items-center justify-center px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <MdRefresh className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50 text-center">
            <tr>
              <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-4">Loading...</td>
              </tr>
            ) : filteredOils.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4">No oils found</td>
              </tr>
            ) : (
              filteredOils.map((oil) => (
                <tr key={oil.id} className="hover:bg-gray-50 text-center">
                  <td className="px-6 py-4 whitespace-nowrap">{oil.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${oil.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {oil.status.charAt(0).toUpperCase() + oil.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {oil.price} FRW
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

export default OilManagementTable;