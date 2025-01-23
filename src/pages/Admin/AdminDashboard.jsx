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
import { Menu, X, Clock, BarChart2, Droplet, Users, Settings, LogOut, ChevronDown } from 'lucide-react';
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
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!stats) {
    return <div className="p-6">Loading...</div>;
  }

  // Data for the bar chart (Sales by Oil Type)
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

  // Data for the line chart (Sales Trends)
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 w-64 bg-yellow-700 text-white p-6 overflow-y-auto z-40`}
      >
        <div className="flex items-center mb-8">
          <Droplet className="h-8 w-8" />
          <span className="ml-3 text-xl font-bold">SourceOil</span>
        </div>

        {/* Sidebar Navigation */}
        <nav className="space-y-4">
          {[
            { name: 'Dashboard', icon: BarChart2, path: '/admindashboard/dashboard' },
            { name: 'User Management', icon: Users, path: '/admindashboard/users' },
            { name: 'Signup', icon: Users, path: '/admindashboard/signup' },
            { name: 'Maintenance', icon: Clock, path: '/admindashboard/' },
            { name: 'Stations', icon: Users, isDropdown: true },
            { name: 'Oil', icon:Droplet, isDropdown: true },
            { name: 'Calibration', icon: Settings, path: '/admindashboard/' },
          ].map((item) => (
            <div key={item.name}>
              <div
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${
                  item.isDropdown ? '' : 'clickable'
                }`}
                onClick={() => {
                  if (item.isDropdown) {
                    item.name === 'Oil'
                      ? setIsOilManagementOpen(!isOilManagementOpen)
                      : setIsStationManagementOpen(!isStationManagementOpen);
                  }
                }}
              >
                <item.icon className="h-5 w-5" />
                {item.isDropdown ? (
                  <>
                    <span>{item.name}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        (item.name === 'Oil' && isOilManagementOpen) || (item.name === 'Stations' && isStationManagementOpen)
                          ? 'rotate-180'
                          : ''
                      }`}
                    />
                  </>
                ) : (
                  <Link to={item.path} className="text-white">
                    {item.name}
                  </Link>
                )}
              </div>
              {item.isDropdown &&
                ((item.name === 'Oil' && isOilManagementOpen) || (item.name === 'Stations' && isStationManagementOpen)) && (
                  <div className="pl-8">
                    {item.name === 'Oil' && (
                      <>
                        <Link
                          to="/admindashboard/registerOil"
                          className="block px-4 py-2 rounded-lg hover:bg-blue-700 text-white"
                        >
                          Register Oil Type
                        </Link>
                        <Link
                          to="/admindashboard/oils"
                          className="block px-4 py-2 rounded-lg hover:bg-blue-700 text-white"
                        >
                          View Oil Types
                        </Link>
                      </>
                    )}
                    {item.name === 'Stations' && (
                      <>
                        <Link
                          to="/admindashboard/registerStation"
                          className="block px-4 py-2 rounded-lg hover:bg-blue-700 text-white"
                        >
                          Register Station
                        </Link>
                        <Link
                          to="/admindashboard/stations"
                          className="block px-4 py-2 rounded-lg hover:bg-blue-700 text-white"
                        >
                          View Stations
                        </Link>
                      </>
                    )}
                  </div>
                )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white p-4 shadow-md">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-md px-4 py-2 w-1/3 focus:outline-none focus:ring focus:ring-blue-500"
          />
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 bg-yellow-700 text-white px-4 py-2 rounded-md hover:bg-yellow-950"
            >
              <span>Admin</span>
              <ChevronDown />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-gray-500 text-sm font-semibold">Total Customers</h2>
                <p className="text-2xl font-bold">{stats.total_customers}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-gray-500 text-sm font-semibold">Total Stations</h2>
                <p className="text-2xl font-bold">{stats.total_stations}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-gray-500 text-sm font-semibold">Total Users</h2>
                <p className="text-2xl font-bold">{stats.total_users}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-gray-500 text-sm font-semibold">Total Oil Types</h2>
                <p className="text-2xl font-bold">{stats.total_oil_types}</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Sales by Oil Type</h2>
                <Bar data={salesByOilTypeData} />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Sales Trends (Last 30 Days)</h2>
                <Line data={salesTrendsData} />
              </div>
            </div>

            {/* Recent Customers Section */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Recent Customers</h2>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Name</th>
                    <th className="text-left">Plate Number</th>
                    <th className="text-left">Quantity</th>
                    <th className="text-left">Oil Type</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_customers.map((customer, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{customer.name}</td>
                      <td className="py-2">{customer.plate_number}</td>
                      <td className="py-2">{customer.quantity}</td>
                      <td className="py-2">{customer.oil_type__name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;