import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import './Header.scss';

const Header: React.FC = () => {
  const [selectedLink, setSelectedLink] = useState<string>('home');

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
                <Link to="" onClick={() => setSelectedLink('home')}>Home</Link>
              </li>
              <li className={selectedLink === 'about' ? 'blue' : 'black'}>
                <Link to="" onClick={() => setSelectedLink('about')}>About Us</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="get-started">
          <p><Link to="">Get Started <FontAwesomeIcon className="icon" icon={faAngleDown} /></Link></p>
        </div>
      </div>
    </header>
  );
}

export default Header;
