
import React from 'react';
import { Menu, X, Clock, BarChart2, Droplet, Users, Settings, LogOut } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const ManagerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

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
      <div className={`fixed lg:static inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 w-64 bg-green-500 text-white p-6 overflow-y-auto z-40`}>
        <div className="flex items-center mb-8">
          <Droplet className="h-8 w-8" />
          <span className="ml-3 text-xl font-bold">SourceOil</span>
        </div>

        <nav className="space-y-4">
          {[{ name: 'Dashboard', icon: BarChart2, path: '/managerDashboard/dashboard' },
            { name: 'Inventory', icon: Droplet, path: '/managerDashboard/inventory' },
            { name: 'Orders', icon: Clock, path: '/manager/orders' },
            { name: 'Customers', icon: Users, path: '/managerDashboard/customers' },
            { name: 'Pump Operators', icon: Users, path: '/manager/operators' },
            { name: 'Settings', icon: Settings, path: '/manager/settings' }]
            .map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-800 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
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
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
