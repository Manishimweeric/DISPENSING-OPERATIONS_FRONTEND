import React from 'react';
import { Menu, X, Clock, BarChart2, Droplet, Users, Settings, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const ManagerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const salesData = [
    { month: 'Jan', Gasoline: 45000, Diesel: 38000 },
    { month: 'Feb', Gasoline: 52000, Diesel: 45000 },
    { month: 'Mar', Gasoline: 38000, Diesel: 42000 },
    { month: 'Apr', Gasoline: 35000, Diesel: 40000 },
  ];

  const pumpOperators = [
    { name: 'John Smith', status: 'active', shift: 'Morning' },
    { name: 'Sarah Johnson', status: 'active', shift: 'Evening' },
    { name: 'Mike Brown', status: 'break', shift: 'Morning' },
    { name: 'Emily Davis', status: 'offline', shift: 'Night' },
  ];

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
      <div className={`fixed lg:static inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 w-64 bg-blue-600 text-white p-6 overflow-y-auto z-40`}>
        <div className="flex items-center mb-8">
          <Droplet className="h-8 w-8" />
          <span className="ml-3 text-xl font-bold">FuelManager</span>
        </div>

        <nav className="space-y-4">
          {[
            { name: 'Dashboard', icon: BarChart2 },
            { name: 'Inventory', icon: Droplet },
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Sales', value: '$57,482', change: '+12%' },
              { label: 'Active Pumps', value: '6/8', change: '-1' },
              { label: 'Fuel Stock', value: '24,000L', change: '-8%' },
              { label: 'Daily Customers', value: '142', change: '+15%' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className={`text-sm mt-2 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} from last period
                </p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold mb-4">Sales Overview</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Bar dataKey="Gasoline" fill="#3B82F6" />
                    <Bar dataKey="Diesel" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pump Operators Status */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold mb-4">Pump Operators</h2>
              <div className="space-y-4">
                {pumpOperators.map((operator) => (
                  <div key={operator.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {operator.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{operator.name}</p>
                        <p className="text-sm text-gray-500">{operator.shift} Shift</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      operator.status === 'active' ? 'bg-green-100 text-green-600' :
                      operator.status === 'break' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {operator.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;