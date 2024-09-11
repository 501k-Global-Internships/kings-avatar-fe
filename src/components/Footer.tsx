import React from 'react';
import { Link } from 'react-router-dom';
import x from '../assets/x-twitter.svg';
import instagram from '../assets/instagram.svg';
import fb from '../assets/fb.svg';
import { FooterProps } from './Types';
import linkedin from '../assets/linkedin.svg';
import './Footer.scss'

const Footer: React.FC<FooterProps> = ({ backgroundImage }) => {
  return (
    <div className={backgroundImage ? "footer" : "footer footer-no-bg"}>
      <div className="container">
        <div className="bg">
          <div className="content">
            <div className="links">
              <ul>
                <li><h4>Company</h4></li>
                <li><Link to="">Home</Link></li>
                <li><Link to="">About Us</Link></li>
                <li><Link to="">FAQs</Link></li>
              </ul>
            </div>
            <div className="links">
              <ul>
                <li><h4>Services</h4></li>
                <li><Link to="">Menu</Link></li>
                <li><Link to="">Support</Link></li>
                <li><Link to="">Geolocator</Link></li>
              </ul>
            </div>
            <div className="links">
              <ul>
                <li><h4>Our Socials</h4></li>
                <li>
                  <div className="img">
                    <img src={instagram} alt="" />
                    <Link to="">Instagram</Link>
                  </div>
                </li>
                <li>
                  <div className="img">
                    <img src={x} alt="" />
                    <Link to="">Twitter</Link>
                  </div>
                </li>
                <li>
                  <div className="img">
                    <img src={fb} alt="" />
                    <Link to="">Facebook</Link>
                  </div>
                </li>
                <li>
                  <div className="img">
                    <img src={linkedin} alt="" />
                    <Link to="">LinkedIn</Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
