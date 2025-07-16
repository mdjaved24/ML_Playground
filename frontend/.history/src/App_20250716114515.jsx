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



import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SavedModels from './pages/Saved Models/SavedModels.jsx'
import ProfilePage from './pages/Profile/ProfilePage.jsx'


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/forgot-password' element={<ForgotPassword />}></Route>
        <Route path='/home' element={<Homepage/>}></Route>
        <Route path='/learn' element={<LearnPage/>}></Route>
        <Route path='/playground' element={<Playground />}></Route>
        <Route path='/models' element={<SavedModels />}></Route>
        <Route path='/profile' element={<ProfilePage />}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
      </Routes>
    </Router>
  );
}

export default App
