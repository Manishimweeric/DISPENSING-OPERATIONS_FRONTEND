// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Signup from './pages/Admin/signup';
import Login from './pages/auth/login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Navigation from './components/navbar';
import Footer from './components/footer';
import OperationDashboard from './pages/Operation/OperationDashboard';
import ManagerDashboard from './pages/user/UserDashboard';
import StockManag from './pages/stock/stock_overview';
import Customers from './pages/user/customer';
import DashboardOverview from './pages/user/managerDash';
import UserManagement from './pages/Admin/usermanagement';
import OilTypeForm from './pages/Admin/oilRegistration';
import StationRegistrationForm from './pages/Admin/registerStation';
import StationManagement from './pages/Admin/Station';
import OilManagementTable from './pages/Admin/oils';
import PumpOperators from './pages/user/pump_operators';
import AdminOverview from './pages/Admin/adminOverview';
import HomeApp from './pages/Tank/Home';
import Calibration from './pages/Admin/Calibration';
import CalibrationList from './pages/Admin/CalibrationList';
import MaintanenceList from './pages/Admin/MaintenanceList';
import AddCustomer from './pages/user/AddCustomer';
import CalibrationUser from './pages/user/CalibrationUser';
import MaintenanceUser from './pages/user/MaintenanceUser';




const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/signup" element={<div><Navigation /><Signup />   <Footer /></div>} />
      
        {/* Main Pages */}
        <Route path="/" element={<div><Navigation /> <Home /> <Footer /></div>} />
        <Route path="/login" element={<div><Navigation /><Login /> <Footer /></div>} />
        <Route path="/OperationDashboard" element={<OperationDashboard />} />

        <Route path="/manager" element={<ManagerDashboard />}>
          <Route path="dashboard" element={<DashboardOverview />}/>
          <Route path="inventory" element={<StockManag />} />
          <Route path="customers" element={<Customers />} />
          <Route path="operators" element={<PumpOperators />} />
          <Route path="HomeApp" element={<HomeApp />} />
          <Route path="Add-customer" element={<AddCustomer />} />
          <Route path="calibrationUser" element={<CalibrationUser />} />
          <Route path="maintenanceUser" element={<MaintenanceUser />} />

          {/* <Route path="orders" element={<Orders />} />  
          <Route path="settings" element={<Settings />} /> */}
        </Route>
    <Route path="/admindashboard" element={<AdminDashboard />}>
        <Route path="dashboard" element={<AdminOverview/>} />
        <Route path="registerOil" element={<OilTypeForm />} />
        <Route path="registerStation" element={<StationRegistrationForm />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="stations" element={<StationManagement />} />
        <Route path="signup" element={<Signup />} />
        <Route path="oils" element={<OilManagementTable />} />
        <Route path="add-calibration" element={<Calibration />} />        
        <Route path="calibration" element={<CalibrationList />} />
        <Route path="maintanenceList" element={<MaintanenceList />} />
    </Route>

      </Routes>
    </Router>
  );
};

export default App;