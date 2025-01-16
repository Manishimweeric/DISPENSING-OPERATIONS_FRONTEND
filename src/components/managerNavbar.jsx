// Sidebar.js
import React from 'react';
import { Droplet, BarChart2, Clock, Users, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-green-500 text-white p-6 overflow-y-auto">
      <div className="flex items-center mb-8">
        <Droplet className="h-8 w-8" />
        <span className="ml-3 text-xl font-bold">SourceOil</span>
      </div>

      <nav className="space-y-4">
        {[
          { name: 'Dashboard', icon: BarChart2 },
          { name: 'Inventory', icon: Droplet, path: '/stock_manag' },
          { name: 'Orders', icon: Clock },
          { name: 'Customers', icon: Users },
          { name: 'Pump Operators', icon: Users },
          { name: 'Settings', icon: Settings },
        ].map((item) => (
          <a
            key={item.name}
            href="#"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </a>
        ))}
      </nav>

      <button className="absolute bottom-4 left-4 right-4 flex items-center justify-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
