// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Signup from './pages/user/signup';
import Login from './pages/auth/login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Navigation from './components/navbar';
import AdminNavbar from './components/Adminnavbar';  // Import the new AdminNavbar
import Footer from './components/footer';
import OilTypeForm from './pages/Admin/oilRegistration';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div><Navigation /> <Home />  <Footer /></div>} />
        <Route path="/signup" element={<div><Navigation /><Signup />   <Footer /></div>} />
        <Route path="/login" element={<div><Navigation /><Login />  <Footer /> </div>}/>
        <Route path="/admindashboard" element={<div><AdminNavbar /> <AdminDashboard /></div>} /> 
        <Route path="/registerOil" element={<div><AdminNavbar /> <OilTypeForm /></div>} /> 
      </Routes>     
    </Router>
  );
};

export default App;