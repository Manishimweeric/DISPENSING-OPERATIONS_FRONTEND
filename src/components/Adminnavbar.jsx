import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdDashboard, MdPerson, MdLocalGasStation, MdBuild, MdWaterDrop, MdLogout } from 'react-icons/md';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: <MdDashboard />, path: '/dashboard' },
    { name: 'User Management', icon: <MdPerson />, path: '/users' },
    { name: 'Station Management', icon: <MdLocalGasStation />, path: '/stations' },
    { name: 'Maintenance Management', icon: <MdBuild />, path: '/maintenance' },
    { name: 'Oil type', icon: <MdWaterDrop />, path: '/oiltypes' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-48 bg-green-500 text-white flex flex-col">
      <div className="p-4 flex-1">
        <h1 className="text-xl font-bold mb-6">Dashboard</h1>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center space-x-2 p-2 hover:bg-green-600 rounded-lg transition-colors"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full py-1 px-3 bg-white text-green-500 rounded-lg hover:bg-gray-100 transition-colors text-sm flex items-center justify-center gap-2"
        >
          <MdLogout />
          Logout
        </button>
      </div>
    </div>
  );
};

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar />
      <main className="ml-48 flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;