import React from 'react';
import { Link } from 'react-router-dom';
import user2 from '../assets/user2.svg'
import history from '../assets/history.svg';
import files from '../assets/files.svg';
import DashboardHeader from './DashboardHeader';
import './App.scss';

const Dashboard: React.FC = () => {

  return (
    <div className="container">
      <DashboardHeader />
      <div className="sign-up dashboard">
        <div className="content dbd-content">
          <div className="body-text dbd-text ">
            <h1>Get Started</h1>
            <h1>With Creating</h1>
            <h1><span>Your Avatar.</span></h1>
          </div>
          <div className="form-inputs dbd-nav">
            <div className="nav-options">
              <nav>
                <ul>
                  <li className="">
                    <Link to="/dashboard-edit"><img src={user2} alt="" />CREATE AVATAR</Link>
                  </li>
                  <li className="">
                    <Link to="/dashboard-gallery"><img src={history} alt="" />HISTORY</Link>
                  </li>
                  <li className="">
                    <Link to="/dashboard-projects"><img src={files} alt="" />PROJECTS</Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
