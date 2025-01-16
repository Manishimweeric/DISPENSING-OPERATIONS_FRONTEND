import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
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
    <div className="p-8">
      {/* Sales Chart */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Sales Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Bar dataKey="Gasoline" fill="#8884d8" />
            <Bar dataKey="Diesel" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pump Operators Table */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Pump Operators</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Name</th>
              <th className="px-4 py-2 text-left text-gray-600">Status</th>
              <th className="px-4 py-2 text-left text-gray-600">Shift</th>
            </tr>
          </thead>
          <tbody>
            {pumpOperators.map((operator) => (
              <tr key={operator.name}>
                <td className="px-4 py-2">{operator.name}</td>
                <td className={`px-4 py-2 ${operator.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                  {operator.status}
                </td>
                <td className="px-4 py-2">{operator.shift}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
