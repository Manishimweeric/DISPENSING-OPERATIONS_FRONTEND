import React, { useState } from 'react';
import { Menu, X, Clock, BarChart2, Droplet, Users, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOilManagementOpen, setIsOilManagementOpen] = useState(false);
  const [isStationManagementOpen, setIsStationManagementOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
            { name: 'User Management', icon: Droplet, path: '/admindashboard/users' },
            { name: 'Signup', icon: Droplet, path: '/admindashboard/signup' },
            { name: 'Maintenance', icon: Clock, path: '/admindashboard/' },
            { name: 'Stations', icon: Users, isDropdown: true },
            { name: 'Oil', icon: Users, isDropdown: true },
            { name: 'Settings', icon: Settings, path: '/admindashboard/' },
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

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;
