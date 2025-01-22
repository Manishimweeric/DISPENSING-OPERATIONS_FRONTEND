// import React, { useState, useEffect } from 'react';
// import { Plus, X } from 'lucide-react';
// import Swal from 'sweetalert2';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// const InventoryManagement = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [customers, setCustomers] = useState([]); // State to store customers data
//   const [oilTypes, setOilTypes] = useState([]); // State to store oil types
//   const [loading, setLoading] = useState(true); // Loading state
//   const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [customersResponse, oilTypesResponse] = await Promise.all([
//           fetch(`${API_URL}/customers/`),
//           fetch(`${API_URL}/oiltypes/`)
//         ]);

//         const customersData = await customersResponse.json();
//         const oilTypesData = await oilTypesResponse.json();

//         setCustomers(customersData);
//         setOilTypes(oilTypesData);
//       } catch (error) {
//         console.error('Failed to fetch data', error);
//         Swal.fire('Error', 'Failed to load customer data', 'error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });

//     const sortedData = [...customers].sort((a, b) => {
//       if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
//       if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
//       return 0;
//     });

//     setCustomers(sortedData);
//   };

//   // Helper function to get oil type name
//   const getOilTypeName = (oilTypeId) => {
//     const oilType = oilTypes.find(type => type.id === parseInt(oilTypeId));
//     return oilType ? oilType.name : 'Unknown';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Customer Management</h1>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//         <div className="p-4 border-b">
//           <h2 className="text-lg font-semibold">Customer List</h2>
//         </div>
//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="text-center py-4">Loading customer data...</div>
//           ) : (
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => handleSort('name')}>
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => handleSort('quantity')}>
//                     Quantity
//                   </th>
//                   <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => handleSort('plate_number')}>
//                     Plate Number
//                   </th>
//                   <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => handleSort('date')}>
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
//                     Oil Type
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {customers.map((customer) => (
//                   <tr key={customer.id}>
//                     <td className="px-6 py-4 text-sm text-gray-900">{customer.name}</td>
//                     <td className="px-6 py-4 text-sm text-gray-900">{customer.quantity}</td>
//                     <td className="px-6 py-4 text-sm text-gray-900">{customer.plate_number}</td>
//                     <td className="px-6 py-4 text-sm text-gray-900">{new Date(customer.created_at).toLocaleDateString()}</td>
//                     <td className="px-6 py-4 text-sm text-gray-900">{getOilTypeName(customer.oil_type)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InventoryManagement;

import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const InventoryManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState([]); // State to store customers data
  const [oilTypes, setOilTypes] = useState([]); // State to store oil types
  const [loading, setLoading] = useState(true); // Loading state
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [searchName, setSearchName] = useState(''); // Search by customer name
  const [searchOilType, setSearchOilType] = useState(''); // Search by oil type

  // Helper function to get oil type name
  const getOilTypeName = (oilTypeId) => {
    const oilType = oilTypes.find(type => type.id === parseInt(oilTypeId));
    return oilType ? oilType.name : 'Unknown';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customersResponse, oilTypesResponse] = await Promise.all([
          fetch(`${API_URL}/customers/`),
          fetch(`${API_URL}/oiltypes/`)
        ]);

        const customersData = await customersResponse.json();
        const oilTypesData = await oilTypesResponse.json();

        setCustomers(customersData);
        setOilTypes(oilTypesData);
      } catch (error) {
        console.error('Failed to fetch data', error);
        Swal.fire('Error', 'Failed to load customer data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...customers].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setCustomers(sortedData);
  };

  const handleSearchName = (e) => setSearchName(e.target.value);
  

  const filteredCustomers = customers.filter(customer => {
    const oilTypeName = getOilTypeName(customer.oil_type).toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchName.toLowerCase()) &&
      oilTypeName.includes(searchOilType.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Customer List</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search by name"
              value={searchName}
              onChange={handleSearchName}
              className="border rounded px-2 py-1"
            />
          
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Loading customer data...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => handleSort('name')}>
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => handleSort('quantity')}>
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => handleSort('plate_number')}>
                    Plate Number
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => handleSort('date')}>
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Oil Type
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.plate_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(customer.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{getOilTypeName(customer.oil_type)}</td>
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

export default InventoryManagement;
