import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Signup from './pages/user/signup';
import Login from './pages/auth/login';
import AdminDashboard from './pages/adminDashboard';
import Navigation from './components/navbar';
import Footer from './components/footer';

const App = () => {
  return (
    <Router>
      <Navigation /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
