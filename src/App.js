// // App.jsx or wherever your routes are defined
// import React from 'react';
// import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './pages/home';
// import Login from './pages/auth/login';

// const App = () => {
//   return (
//     <Router>
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={<Login />} />
//     </Routes>
//   </Router>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar'; // Adjust the path as needed
import Footer from './components/footer'; // Adjust the path as needed
import Home from './pages/home'; // Adjust the path as needed
import Login from './pages/auth/login'; // Adjust the path as needed

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        {/* Spacer */}
        <div className="h-20"></div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
};

export default App;