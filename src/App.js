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
import OperationDashboard from './pages/Operation/OperationDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div><Navigation /> <Home />  <Footer /></div>} />
        <Route path="/signup" element={<div><Navigation /><Signup />   <Footer /></div>} />
        <Route path="/login" element={<div><Navigation /><Login />  <Footer /> </div>}/>
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/registerOil" element={<AdminNavbar><OilTypeForm /></AdminNavbar>} /> 
        <Route path="/OperationDashboard" element={<OperationDashboard />} />
      </Routes>     
    </Router>
  );
};

export default App;