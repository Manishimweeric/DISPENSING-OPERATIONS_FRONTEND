import React, { useState } from 'react';
import { Phone, Mail, MapPin, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom'; 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed h-24  top-0 left-0 right-0 bg-white z-50 border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
        <div className="flex-shrink-0 flex items-center space-x-2">
          <img
            src="image/logo.jpg"
            alt="Source Oil Logo"
            className="h-20 w-20 object-contain"
          />
        </div>

          
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-yellow-700 hover:bg-gray-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className="text-gray-600 hover:text-yellow-700px-3 py-2 text-sm font-medium transition-colors duration-200 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>
            <Link to="/" className="text-gray-600 hover:text-yellow-700 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group">
              About
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>
            <Link to="/" className="text-gray-600 hover:text-bg-yellow-700px-3 py-2 text-sm font-medium transition-colors duration-200 relative group">
              Contact us
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-700transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>
            <Link to="/login" className="bg-yellow-700 text-white px-6 py-2 rounded-full hover:bg-yellow-700 transition-colors duration-200 text-sm font-medium shadow-md hover:shadow-lg">
              Login
            </Link>
          </div>

        </div>
        
        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-yellow-700 hover:bg-gray-50 rounded-md">
              Home
            </a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-yellow-700 hover:bg-gray-50 rounded-md">
              About
            </a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-yellow-700 hover:bg-gray-50 rounded-md">
              Contact us
            </a>
            <button className="w-full mt-2 bg-yellow-700 text-white px-4 py-2 rounded-full hover:bg-yellow-700 transition-colors duration-200">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
