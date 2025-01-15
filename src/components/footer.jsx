import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-8 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Source Oil</h3>
          <p className="text-gray-400">
            Leading the way in fuel operations management and distribution.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Services</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white">Fuel Management</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Distribution</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Logistics</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Contact</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Kigali, Rwanda</li>
            <li>+250 678 9108 99</li>
            <li>contact@moralizer.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2025 Source Oil. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;