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
import ManagerDashboard from './pages/user/UserDashboard';
import StockManag from './pages/stock/stock_overview';
import Customers from './pages/user/customer';
import DashboardOverview from './pages/user/managerDash';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<div><Navigation /> <Home /> <Footer /></div>} />
        <Route path="/signup" element={<div><Navigation /><Signup /> <Footer /></div>} />
        <Route path="/login" element={<div><Navigation /><Login /> <Footer /></div>} />

        <Route path="/admindashboard" element={<div><AdminNavbar /> <AdminDashboard /></div>} /> 
        <Route path="/registerOil" element={<div><AdminNavbar /> <OilTypeForm /></div>} /> 

        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/OperationDashboard" element={<OperationDashboard />} />


        <Route path="/managerDashboard" element={<ManagerDashboard />}>
          <Route path="dashboard" element={<DashboardOverview />}/>
          <Route path="inventory" element={<StockManag />} />
          <Route path="customers" element={<Customers />} />
          {/* <Route path="orders" element={<Orders />} />  
          <Route path="operators" element={<PumpOperators />} />
          <Route path="settings" element={<Settings />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;