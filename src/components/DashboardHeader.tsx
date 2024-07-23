import React from 'react';
import settings from '../assets/settings.svg';
import notifications from '../assets/notifications.svg';
import profile1 from '../assets/profile1.svg';
import profile2 from '../assets/profile2.svg'
import './Header.scss';

const DashboardHeader: React.FC = () => {

  return (
    <header>
      <div className="header">
        <div className="header-title">
          <h2>KINGS <span>AVATAR</span></h2>
        </div>
        <div className="get-started user-side">
          <div className="settings">
            <img src={settings} alt="" />
          </div>
          <div className="notifications">
            <img src={notifications} alt="" />
          </div>
          <div className="user">
            <img className="profile1" src={profile1} alt="Profile 1" />
            <img className="profile2" src={profile2} alt="Profile 2" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
