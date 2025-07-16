import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './pages/Landing Page/LandingPage'
import Login from './pages/Auth/Login'
import Homepage from './pages/Homepage/Homepage.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Signup from './pages/Auth/Signup.jsx'
import ForgotPassword from './pages/Auth/ForgotPassword.jsx'
import LearnPage from './pages/Learn/LearnPage.jsx'
import Playground from './pages/Playground/Playground.jsx'

import ProtectedRoute from './ProtectedRoute';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/home' element={<Homepage />} />
        <Route path='/learn' element={<LearnPage />} />
        

        {/* ✅ Protected Routes */}
        <Route 
          path='/home' 
            element={
            <ProtectedRoute>
            <Homepage />
            </ProtectedRoute>
            } />

        <Route
         path='/playground'
          element={
            <ProtectedRoute>
          <Playground />
          </ProtectedRoute>} />

        <Route
          path='/models'
          element={
            <ProtectedRoute>
              <SavedModels />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}


export default App
