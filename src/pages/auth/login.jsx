import React, { useState } from 'react';
import { MdEmail, MdLock } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'email') {
      setEmail(value);
    } else if (id === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire('Error', 'Email and password are required', 'error');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const role = data.user.role;   
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('role', role);
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem('user_id', data.user.id);
        Swal.fire('Success', 'Logged in successfully!', 'success').then(() => {
          if (role === 'admin') {
            navigate('/admindashboard'); 
          } else if (role === 'user') {
            navigate('/userdashboard'); 
          }else if (role === 'Operation') {
              navigate('/operationDashboard');
          } else {
            navigate('/login');
          }
        });
      } else {
        Swal.fire('Error', data.detail || 'Invalid credentials', 'error');
      }
    } catch (error) {
      console.log(error);
      Swal.fire('Error', 'Something went wrong. Please try again later.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col mt-20 md:flex-row bg-white shadow-lg rounded-lg overflow-hidden" style={{ maxWidth: '1400px', width: '90%', minHeight: 'auto', height: '85vh' }}>
        <div className="w-full md:w-1/2 bg-cover bg-center hidden md:block" style={{ backgroundImage: "url('image/pers.jpg')", minHeight: '300px' }} />
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 relative">
          <div className="absolute top-4 right-4">
            <h1 className="text-xl md:text-2xl font-bold text-green-600">Source OIL</h1>
          </div>
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-lg md:text-xl text-center mb-4 md:mb-6">Hello Again!</h2>
            <h3 className="text-md md:text-lg text-center mb-5 md:mb-8">Welcome Back</h3>
            
            <form onSubmit={handleSubmit}>
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
                    value={email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
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
                    value={password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-sm font-medium shadow-md hover:shadow-lg"
              >
                Login
              </button>
            </form>
            <p className="mt-4 md:mt-6 text-center text-xs md:text-sm text-gray-600">
              <a href="#" className="font-medium text-green-600 hover:text-green-500">
                Forgot Password?
              </a>
            </p>
            <p className="mt-4 mb-0 text-center text-muted">
              Need an account? 
              <Link to="/signup" className="text-decoration-none text-blue-600 hover:text-primary-dark transition duration-200 ml-1">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
