import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Link, useNavigate } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [salesTrends, setSalesTrends] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOilManagementOpen, setIsOilManagementOpen] = useState(false);
  const [isStationManagementOpen, setIsStationManagementOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/dashboard/stats/`)
      .then(response => {
        console.log('Dashboard Stats:', response.data);
        setStats(response.data);
      })
      .catch(error => {
        console.error('Error fetching dashboard stats:', error);
        setError('Failed to load dashboard stats.');
      });

    axios.get(`${API_URL}/dashboard/sales-trends/`)
      .then(response => {
        console.log('Sales Trends:', response.data);
        setSalesTrends(response.data);
      })
      .catch(error => {
        console.error('Error fetching sales trends:', error);
        setError('Failed to load sales trends.');
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return <div className="p-6">Loading...</div>;
  }

  const salesByOilTypeData = {
    labels: stats.sales_by_oil_type.map(item => item.oil_type__name),
    datasets: [
      {
        label: 'Total Sales',
        data: stats.sales_by_oil_type.map(item => item.total_sales),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const salesTrendsData = {
    labels: salesTrends.map(item => item.date),
    datasets: [
      {
        label: 'Daily Sales',
        data: salesTrends.map(item => item.total_quantity),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="flex  bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out`}>
        <div className="p-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <ul className="mt-4">
            <li className="mb-2">
              <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</Link>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setIsOilManagementOpen(!isOilManagementOpen)}
                className="text-gray-700 hover:text-gray-900"
              >
                Oil Management
              </button>
              {isOilManagementOpen && (
                <ul className="pl-4 mt-2">
                  <li><Link to="/oil-types" className="text-gray-700 hover:text-gray-900">Oil Types</Link></li>
                  <li><Link to="/oil-stock" className="text-gray-700 hover:text-gray-900">Oil Stock</Link></li>
                </ul>
              )}
            </li>
            <li className="mb-2">
              <button
                onClick={() => setIsStationManagementOpen(!isStationManagementOpen)}
                className="text-gray-700 hover:text-gray-900"
              >
                Station Management
              </button>
              {isStationManagementOpen && (
                <ul className="pl-4 mt-2">
                  <li><Link to="/stations" className="text-gray-700 hover:text-gray-900">Stations</Link></li>
                  <li><Link to="/station-stock" className="text-gray-700 hover:text-gray-900">Station Stock</Link></li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-2xl font-bold">{stats.total_user}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Total Customers</h3>
              <p className="text-2xl font-bold">{stats.total_customers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Total Oil Types</h3>
              <p className="text-2xl font-bold">{stats.total_oil_types}</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Sales by Oil Type</h2>
              <Bar data={salesByOilTypeData} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Sales Trends</h2>
              <Line data={salesTrendsData} />
            </div>
          </div>

          {/* Recent Customers Section */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Customers</h2>
            <table className="w-full">
              <thead>
                <tr>
                <th className="text-left">#</th>
                  <th className="text-left">Name</th>
                  <th className="text-left">Phone Number</th>
                  <th className="text-left">Quantity</th>
                  <th className="text-left">Email</th>
                  <th className="text-left">Address</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_customers.slice(0, 2).map((customer, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{index + 1}</td>
                    <td className="py-2">{customer.name}</td>
                    <td className="py-2">{customer.Phonenumber}</td>
                    <td className="py-2">{customer.quantity}</td>
                    <td className="py-2">{customer.email}</td>
                    <td className="py-2">{customer.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;