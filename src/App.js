// App.jsx or wherever your routes are defined
import React from 'react';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Signup from './pages/user/signup';

const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </Router>
  );
};

export default App;