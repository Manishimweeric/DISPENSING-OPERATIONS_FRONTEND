import React, { useState } from 'react';
import { Menu, X, Clock, BarChart2, Droplet, Users, Settings, ChevronDown,LogOut } from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-yellow-700 text-white rounded-md shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 w-64 bg-gradient-to-b from-yellow-800 to-yellow-600 text-white p-6 overflow-y-auto z-40`}
      >
        <div className="flex items-center mb-8">
          <Droplet className="h-8 w-8 text-yellow-200" />
          <span className="ml-3 text-2xl font-bold text-yellow-100">SourceOil</span>
        </div>

        <nav className="space-y-4">
          {[
            { name: 'Dashboard', icon: BarChart2, path: '/manager/dashboard' },
            { name: 'Inventory', icon: Droplet, path: '/manager/inventory' },
            { name: 'Orders', icon: Clock, path: '/manager/orders' },
            { name: 'Customers', icon: Users, path: '/manager/customers' },
            { name: 'Pump Operators', icon: Users, path: '/manager/operators' },
            { name: 'Settings', icon: Settings, path: '/manager/settings' },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-yellow-500 transition-colors duration-200"
            >
              <item.icon className="h-5 w-5 text-yellow-100" />
              <span className="text-yellow-50">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white p-4 shadow-md sticky top-0 z-30">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-md px-4 py-2 w-1/3 focus:outline-none focus:ring focus:ring-yellow-500"
          />
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 bg-yellow-700 text-white px-4 py-2 rounded-md hover:bg-yellow-800 transition-colors duration-200"
            >
              <span>Manager</span>
              <ChevronDown />
            </button>
            {isDropdownOpen && (
             <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 animate-fadeIn">
             <button
               onClick={handleLogout}
               className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
             >
               <LogOut className="h-5 w-5 text-gray-600" />
               <span>Logout</span>
             </button>
           </div>
           
            )}
          </div>
        </header>

        {/* Page Content */}
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
