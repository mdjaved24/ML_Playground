import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing Page/LandingPage';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Homepage from './pages/Homepage/Homepage.jsx';
import LearnPage from './pages/Learn/LearnPage.jsx';
import Playground from './pages/Playground/Playground.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import SavedModels from './pages/SavedModels/SavedModels.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx'; // make sure path matches

import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />

        {/* ✅ Protected Routes */}
        <Route path='/home' element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
        <Route path='/learn' element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
        <Route path='/playground' element={<ProtectedRoute><Playground /></ProtectedRoute>} />
        <Route path='/models' element={<ProtectedRoute><SavedModels /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
