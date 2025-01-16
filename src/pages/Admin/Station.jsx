import React, { useState, useEffect } from 'react';
import { MdEdit, MdDelete, MdSearch, MdRefresh } from 'react-icons/md';
import Swal from 'sweetalert2';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const StationManagementTable = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/stations/`);
      if (response.ok) {
        const data = await response.json();
        setStations(data);
      } else {
        Swal.fire('Error', 'Failed to fetch stations', 'error');
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
      Swal.fire('Error', 'Failed to fetch stations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleDeleteStation = async (stationId) => {
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
        const response = await fetch(`${API_URL}/stations/${stationId}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          Swal.fire('Deleted!', 'Station has been deleted.', 'success');
          fetchStations();
        } else {
          Swal.fire('Error', 'Failed to delete station', 'error');
        }
      }
    } catch (error) {
      console.error('Error deleting station:', error);
      Swal.fire('Error', 'Failed to delete station', 'error');
    }
  };

  const filteredStations = stations.filter((station) => {
    const statusMatch = selectedStatus === 'all' || station.status === selectedStatus;
    const searchMatch = station.name.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Station Management</h2>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 w-full md:w-64"
              placeholder="Search stations..."
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
            onClick={fetchStations}
            className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <MdRefresh className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">Loading...</td>
              </tr>
            ) : filteredStations.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">No stations found</td>
              </tr>
            ) : (
              filteredStations.map((station) => (
                <tr key={station.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{station.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{station.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${station.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      onClick={() =>{/* Add edit handler here if needed */}}
                    >
                      <MdEdit className="h-5 w-5" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteStation(station.id)}
                    >
                      <MdDelete className="h-5 w-5" />
                    </button>
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

export default StationManagementTable;