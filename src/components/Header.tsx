import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { HeaderProps } from './AppInterface';
import './Header.scss';

const Header: React.FC<HeaderProps> = ({ loginSignUp, setLoginSignUp, selectedLink }) => {

  return (
    <header>
      <div className="header">
        <div className="header-title">
          <h2>KINGS <span>AVATAR</span></h2>
        </div>
        <div className="nav">
          <nav>
            <ul>
              <li className={selectedLink === 'home' ? 'blue' : 'black'}>
                <Link to="/">Home</Link>
              </li>
              <li className={selectedLink === 'about' ? 'blue' : 'black'}>
                <Link to="/about-us">About Us</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="get-started">
          <p onClick={() => setLoginSignUp(!loginSignUp)}>
            Get Started
            <FontAwesomeIcon className="icon" icon={loginSignUp ? faAngleUp : faAngleDown} />
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
