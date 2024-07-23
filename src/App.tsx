import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import SignUpSuccessful from './components/SignUpSuccessful';
import Dashboard from './components/Dashboard';
import DashboardEdit from './components/DashboardEdit';
import DashboardShapes from './components/DashboardShapes';
import DashboardText from './components/DashboardText';
import DashboardGallery from './components/DashboardGallery';
import DashboardProject from './components/DashboardProjectImages';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up-success" element={<SignUpSuccessful />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard-edit" element={<DashboardEdit />} />
        <Route path="/dashboard-shapes" element={<DashboardShapes />} />
        <Route path="/dashboard-text" element={<DashboardText />} />
        <Route path="/dashboard-gallery" element={<DashboardGallery />} />
        <Route path="/dashboard-projects" element={<DashboardProject />} />
      </Routes>
    </div>
  );
}

export default App;
