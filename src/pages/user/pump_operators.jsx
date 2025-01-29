import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const PumpOperatorPage = () => {
  const [pumpOperators, setPumpOperators] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const userStationId = JSON.parse(localStorage.getItem('user')).station; 

  useEffect(() => {
    const fetchPumpOperators = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/users/`);
        const data = await response.json();
        
        // Filter pump operators by station
        const filteredData = data
          .filter(operator => operator.role === 'Pumpster' && operator.station.id === userStationId)
          .map(operator => ({
            name: operator.name,
            phone_number: operator.phone_number,
            email: operator.email,
          }));
        
        setPumpOperators(filteredData);
      } catch (error) {
        console.error('Failed to fetch pump operators data', error);
        Swal.fire('Error', 'Failed to load pump operator data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPumpOperators();
  }, [userStationId]);

  return (
    <div className=" bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-10">Pump Operator Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Loading pump operator data...</div>
          ) : (
            <table className="w-full text-center">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3  text-sm font-medium text-gray-500">#</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Phone Number</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Email</th>
               
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pumpOperators.map((operator, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-gray-900">{index + 1 }</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{operator.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{operator.phone_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{operator.email}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PumpOperatorPage;
