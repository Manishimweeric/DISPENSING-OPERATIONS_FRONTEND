import React from 'react';
import { Menu, X, Clock, BarChart2, Droplet, Users, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

const ManagerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isOilManagementOpen, setIsOilManagementOpen] = React.useState(false);
  const [isStationManagementOpen, setIsStationManagementOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed lg:static inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 w-64 bg-green-500 text-white p-6 overflow-y-auto z-40`}
      >
        <div className="flex items-center mb-8">
          <Droplet className="h-8 w-8" />
          <span className="ml-3 text-xl font-bold">SourceOil</span>
        </div>

        <nav className="space-y-4">
          {[
            { name: 'Dashboard', icon: BarChart2, path: '/admindashboard/dashboard' },
            { name: 'User Management', icon: Droplet, path: '/admindashboard/users' },
            { name: 'Maintenance Management', icon: Clock, path: '/admindashboard/orders' },
            { name: 'Station Management', icon: Users, isDropdown: true },
            { name: 'Oil Management', icon: Users, isDropdown: true },
            { name: 'Settings', icon: Settings, path: '/admindashboard/stations' },
          ].map((item) => (
            <div key={item.name}>
              <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer" onClick={() => item.isDropdown ? (item.name === 'Oil Management' ? setIsOilManagementOpen(!isOilManagementOpen) : setIsStationManagementOpen(!isStationManagementOpen)) : null}>
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
                {item.isDropdown && <ChevronDown className={`h-4 w-4 transition-transform ${isOilManagementOpen || isStationManagementOpen ? 'rotate-180' : ''}`} />}
              </div>
              {item.isDropdown && ((item.name === 'Oil Management' && isOilManagementOpen) || (item.name === 'Station Management' && isStationManagementOpen)) && (
                <div className="pl-8">
                  {item.name === 'Oil Management' && (
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
                  {item.name === 'Station Management' && (
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

        <button className="absolute bottom-4 left-4 right-4 flex items-center justify-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet /> {/* Renders the selected page based on the route */}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;