import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Signup from './pages/user/signup';
import Navbar from './components/navbar'; // Adjust the path as needed
import Footer from './components/footer'; // Adjust the path as needed
import Login from './pages/auth/login'; // Adjust the path as needed
import AdminDashboard from './pages/adminDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Navbar and Footer */}
        <Route
          path="/"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />

              {/* Spacer */}
              <div className="h-20"></div>

              {/* Main Content */}
              <Home />

              {/* Footer */}
              <Footer />
            </div>
          }
        />
        <Route
          path="/signup"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />

              {/* Spacer */}
              <div className="h-20"></div>

              {/* Main Content */}
              <Signup />

              {/* Footer */}
              <Footer />
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />

              {/* Spacer */}
              <div className="h-20"></div>

              {/* Main Content */}
              <Login />

              {/* Footer */}
              <Footer />
            </div>
          }
        />

        {/* Admin Dashboard Route (No Navbar or Footer) */}
        <Route path="/admindashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
