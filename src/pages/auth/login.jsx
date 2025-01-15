import React from 'react';
import { MdEmail, MdLock } from 'react-icons/md'; // Importing icons from react-icons

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* Container for Image and Form */}
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden" style={{ maxWidth: '1000px', width: '90%', minHeight: 'auto', height: 'auto' }}>
        {/* Left Side - Image (Hidden on Mobile) */}
        <div className="w-full md:w-1/2 bg-cover bg-center hidden md:block" style={{ backgroundImage: "url('image/pers.jpg')", minHeight: '300px' }}>
          {/* You can add any content or overlay here if needed */}
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 relative">
          {/* Project Name in Top-Right Corner */}
          <div className="absolute top-4 right-4">
            <h1 className="text-xl md:text-2xl font-bold text-green-600">Source OIL</h1>
          </div>

          {/* Login Form */}
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-lg md:text-xl text-center mb-4 md:mb-6">Hello Again!</h2>
            <h3 className="text-md md:text-lg text-center mb-5 md:mb-8">Welcome Back</h3>
            
            <form>
              {/* Email Input with Icon */}
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdEmail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="block w-full pl-10 pr-3 py-2 md:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              {/* Password Input with Icon */}
              <div className="mb-5 md:mb-8">
                <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    className="block w-full pl-10 pr-3 py-2 md:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              
              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-sm font-medium shadow-md hover:shadow-lg"
              >
                Login
              </button>
            </form>
            
            {/* Forgot Password Link */}
            <p className="mt-4 md:mt-6 text-center text-xs md:text-sm text-gray-600">
              <a href="#" className="font-medium text-green-600 hover:text-green-500">
                Forgot Password?
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;