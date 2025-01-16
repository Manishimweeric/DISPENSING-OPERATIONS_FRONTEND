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
<<<<<<< HEAD
import OilTypeForm from './pages/Admin/oilRegistration';
=======
import OperationDashboard from './pages/Operation/OperationDashboard';
>>>>>>> 9642af982c5b23dfa9df7f3dcb05eca7cf2c5220

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div><Navigation /> <Home />  <Footer /></div>} />
        <Route path="/signup" element={<div><Navigation /><Signup />   <Footer /></div>} />
        <Route path="/login" element={<div><Navigation /><Login />  <Footer /> </div>}/>
<<<<<<< HEAD
        <Route path="/admindashboard" element={<div><AdminNavbar /> <AdminDashboard /></div>} /> 
        <Route path="/registerOil" element={<div><AdminNavbar /> <OilTypeForm /></div>} /> 
=======
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/OperationDashboard" element={<OperationDashboard />} />
>>>>>>> 9642af982c5b23dfa9df7f3dcb05eca7cf2c5220
      </Routes>     
    </Router>
  );
};

export default App;