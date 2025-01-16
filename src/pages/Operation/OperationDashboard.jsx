import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Settings, LogOut, Users, ChevronDown, MoreHorizontal } from 'lucide-react';

const Dashboard = () => {
  // Sample data for the chart
  const salesData = [
    { month: 'Jan', Gasoline: 45000, Diesel: 38000 },
    { month: 'Feb', Gasoline: 52000, Diesel: 45000 },
    { month: 'Mar', Gasoline: 38000, Diesel: 42000 },
    { month: 'Apr', Gasoline: 35000, Diesel: 40000 },
    { month: 'May', Gasoline: 42000, Diesel: 38000 },
    { month: 'Jun', Gasoline: 28000, Diesel: 35000 },
  ];

  // Sample transactions data
  const transactions = [
    { customer: 'Gadine', fuelType: 'Gasoline', title: '2.458L', paymentMethod: 'CASH', amount: '$15' },
    { customer: 'Amini', fuelType: 'Gasoline', title: '1.485L', paymentMethod: 'CASH', amount: '$15' },
    { customer: 'Kirku', fuelType: 'Gasoline', title: '1.024L', paymentMethod: 'MOMO', amount: '$15' },
    { customer: 'Venus DS', fuelType: 'Diesel', title: '8.58L', paymentMethod: 'MOMO', amount: '$15' },
    { customer: 'Venus 3D Asset', fuelType: 'Diesel', title: '2.58L', paymentMethod: 'CASH', amount: '$15' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-48 bg-green-500 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-6">Dashboard</h1>
          <nav className="space-y-2">
            <a href="#" className="flex items-center space-x-2 p-2 bg-green-600 rounded-lg">
              <span className="text-sm">Dashboard</span>
            </a>
            {['Fuel Inventory', 'Order Management', 'Quality Control', 'Maintenance', 'Training', 'Reports', 'Settings'].map((item) => (
              <a key={item} href="#" className="flex items-center space-x-2 p-2 hover:bg-green-600 rounded-lg transition-colors">
                <span className="text-sm">{item}</span>
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <button className="w-full py-1 px-3 bg-white text-green-500 rounded-lg hover:bg-gray-100 transition-colors text-sm">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Diesel</div>
            <div className="text-lg font-bold">$350.4</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Gasoline</div>
            <div className="text-lg font-bold">$642.39</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Total Sales</div>
            <div className="text-lg font-bold">$57004.34</div>
            <div className="text-xs text-green-500">+25% since last month</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Maintenance fee</div>
            <div className="text-lg font-bold">$50.00</div>
          </div>
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Customers</div>
            <div className="text-lg font-bold">1,250</div>
            <div className="text-xs text-green-500">+10.80%</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Active</div>
            <div className="text-lg font-bold">1,180</div>
            <div className="text-xs text-red-500">-4.90%</div>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Sales Summary</h2>
            <button className="flex items-center space-x-1 text-gray-500">
              <span className="text-sm">This Week</span>
              <ChevronDown size={16} />
            </button>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="Gasoline" fill="#4F46E5" />
                <Bar dataKey="Diesel" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pump Operations */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Pump Operation</h2>
            <button>
              <MoreHorizontal className="text-gray-500" size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {['A', 'B', 'C', 'D'].map((pump) => (
              <div key={pump} className="flex items-center justify-between py-1">
                <div className="text-sm">Pump {pump}</div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  pump === 'B' ? 'bg-red-100 text-red-500' :
                  pump === 'C' ? 'bg-yellow-100 text-yellow-500' :
                  'bg-green-100 text-green-500'
                }`}>
                  {pump === 'B' ? 'Disable' :
                   pump === 'C' ? 'In maintenance' :
                   'Working'}
                </div>
                <div className="text-sm">18 Apr 2024</div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Last Transactions</h2>
            <button>
              <MoreHorizontal className="text-gray-500" size={16} />
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="pb-2">Customer</th>
                <th className="pb-2">Fuel Type</th>
                <th className="pb-2">Title</th>
                <th className="pb-2">Payment Method</th>
                <th className="pb-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 text-sm">{transaction.customer}</td>
                  <td className="py-2 text-sm">{transaction.fuelType}</td>
                  <td className="py-2 text-sm">{transaction.title}</td>
                  <td className="py-2 text-sm">{transaction.paymentMethod}</td>
                  <td className="py-2 text-sm">{transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notifications Sidebar */}
      <div className="w-64 border-l bg-white p-4">
        <h2 className="text-lg font-bold mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div>
              <div className="text-sm font-medium">New Quality test available</div>
              <div className="text-xs text-gray-500">Just now</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <div className="text-sm font-medium">Training starting soon</div>
              <div className="text-xs text-gray-500">59 minutes ago</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div>
              <div className="text-sm font-medium">New customer</div>
              <div className="text-xs text-gray-500">12 hours ago</div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">Activities</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div>
                <div className="text-sm font-medium">Schedule training</div>
                <div className="text-xs text-gray-500">Just now</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div>
                <div className="text-sm font-medium">Schedule maintenance</div>
                <div className="text-xs text-gray-500">59 minutes ago</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">Pump Operators</h2>
          <div className="space-y-2">
            {['Natali Craig', 'Drew Cano', 'Andi Lane', 'Koray Okumus', 'Kate Morrison', 'Melody Macy'].map((operator) => (
              <div key={operator} className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="text-sm font-medium">{operator}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;