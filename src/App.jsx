// src/App.jsx
import React from 'react';
import Investor from './components/Investor';
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
        path="/investor" 
        element={
          <ProtectedRoute>
            <Investor/>
          </ProtectedRoute>
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;