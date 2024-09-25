import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import SignUpSuccessful from './components/SignUpSuccessful';
import Dashboard from './components/Dashboard';
import DashboardEdit from './components/DashboardEdit';
import DashboardGallery from './components/DashboardGallery';
import DashboardProject from './components/DashboardProjects';
import ForgetPassword from './components/ForgetPassword';
import ForgotPasswordSuccessful from './components/ForgotPasswordSuccessful';
import AboutUs from './components/AboutUs';
import ResetPassword from './components/ResetPassword';
import ResetPasswordSuccessful from './components/ResetPasswordSuccessful';
import GuestUser from './components/GuestUser';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up-success" element={<SignUpSuccessful />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard-edit" element={<DashboardEdit />} />
        <Route path="/dashboard-gallery" element={<DashboardGallery />} />
        <Route path="/dashboard-projects" element={<DashboardProject />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/forgot-password-successful" element={<ForgotPasswordSuccessful />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password-successful" element={<ResetPasswordSuccessful />} />
        <Route path="/guest/:id" element={<GuestUser />} />
      </Routes>
    </div>
  );
}

export default App;
