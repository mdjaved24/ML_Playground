import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing Page/LandingPage';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';
// import Homepage from './pages/Homepage/Homepage.jsx';
// import LearnPage from './pages/Learn/LearnPage.jsx';
// import Playground from './pages/Playground/Playground.jsx';
// import Dashboard from './pages/Dashboard/Dashboard.jsx';
// import SavedModels from './pages/Saved Models/SavedModels.jsx';
// import ProfilePage from './pages/Profile/ProfilePage.jsx'; // make sure path matches

import ProtectedRoute from './ProtectedRoute';
import Homepage from './pages/Homepage/Homepage';
import LearnPage from './pages/Learn/LearnPage';
import Playground from './pages/Playground/Playground';
import Dashboard from './pages/Dashboard/Dashboard';
import SavedModels from './pages/Saved Models/SavedModels';
import ProfilePage from './pages/Profile/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />

        {/* Protected Route  */}
        <Route element={<ProtectedRoute />}>
          <Route path='/home' element={<Homepage/>}></Route>
          <Route path='/learn' element={<LearnPage/>}></Route>
          <Route path='/playground' element={<Playground />}></Route>
          <Route path='/models' element={<SavedModels />}></Route>
          <Route path='/profile' element={<ProfilePage />}></Route>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
