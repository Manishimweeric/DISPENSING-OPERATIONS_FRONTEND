import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Swal from 'sweetalert2';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const DashboardPage = () => {
  const [chartData, setChartData] = useState([]);
  const [pumpsters, setPumpsters] = useState([]);
  const [loading, setLoading] = useState(false);
  const userStationId = localStorage.getItem('station'); 

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setLoading(true);

        const [customersResponse, usersResponse, stocksResponse] = await Promise.all([
          fetch(`${API_URL}/customers/`),
          fetch(`${API_URL}/users/`),
          fetch(`${API_URL}/stocks/`),
        ]);

        if (!customersResponse.ok || !usersResponse.ok || !stocksResponse.ok) {
          throw new Error('Failed to fetch one or more endpoints.');
        }

        const customersData = await customersResponse.json();
        const usersData = await usersResponse.json();
        const stocksData = await stocksResponse.json();

        const totalCustomers = customersData.length;
        const totalPumpsters = usersData.filter((user) => user.role === 'Pumpster' && user.station == userStationId ).length;
        const totalInventory = stocksData.length;

        setChartData([
          { name: 'Customers', count: totalCustomers },
          { name: 'Pumpsters', count: totalPumpsters },
          { name: 'Inventory', count: totalInventory },
        ]);

        setPumpsters(usersData.filter((user) => user.role === 'Pumpster' && user.station == userStationId ));
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Failed to load summary data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  // Ensure chartData is populated before rendering
  if (loading || chartData.length === 0) {
    return <p className="text-center text-xl font-semibold">Loading...</p>;
  }

  return (
    <div className="w-full h-full px-1 py-5">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Dashboard Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Cards */}
          {['Customers', 'Pumpsters', 'Inventory'].map((category, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-center mb-4">
                <span className="text-2xl font-bold text-gray-700">{category}</span>
              </div>
              <p className="text-lg font-semibold text-center text-gray-800">
                {category === 'Customers' ? chartData[0].count : category === 'Pumpsters' ? chartData[1].count : chartData[2].count}
              </p>
              <p className="text-center text-gray-600 mt-2">{category}Count</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
              Total Numbers of Customers, Pumpsters, and Inventory
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">Pumpsters</h3>
              {pumpsters.length > 0 ? (
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 text-left text-gray-600">Name</th>
                      <th className="py-2 px-4 text-left text-gray-600">Phone</th>
                      <th className="py-2 px-4 text-left text-gray-600">Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pumpsters.map((pumpster) => (
                      <tr key={pumpster.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 text-gray-700">{pumpster.name}</td>
                        <td className="py-2 px-4 text-gray-600">{pumpster.phone_number}</td>
                        <td className="py-2 px-4 text-gray-600">
                          {new Date(pumpster.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center">No pumpsters available.</p>
              )}
            </div>

        </div>

        {/* Summary Stats (Hello Cards Section) */}
        
      </div>
    </div>
  );
};

export default DashboardPage;
