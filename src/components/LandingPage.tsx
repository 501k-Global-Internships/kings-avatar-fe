import React from 'react'
import { Link } from 'react-router-dom';
import Header from './Header'
import userIcon from '../assets/user.svg';
import logo1 from '../assets/logo1.svg';
import logo2 from '../assets/logo2.svg';
import arrows from '../assets/arrows.svg';
import one from '../assets/1.svg';
import two from '../assets/2.svg';
import three from '../assets/3.svg';
import four from '../assets/4.svg';
import circleGroup1 from '../assets/circle-group.svg'
import circleGroup2 from '../assets/circle-group-2.svg'
import circleGroup3 from '../assets/circle-group-3.svg'
import circleGroup4 from '../assets/circle-group-4.svg'
import join from '../assets/join.svg'
import groupImage from '../assets/group.svg'
import kingsAvatar from '../assets/kings-avatar.svg'
import x from '../assets/x-twitter.svg';
import instagram from '../assets/instagram.svg';
import fb from '../assets/fb.svg';
import linkedin from '../assets/linkedin.svg';

const LandingPage: React.FC = () => {
  return (
    <div className="container landing">
      <Header />
      <div className="sign-up dash">
        <div className="content">
          <div className="body-text">
            <h1>Unleash Your</h1>
            <h1>Creativity &</h1>
            <h1>Promote an</h1>
            <h1><span>Event.</span></h1>
          </div>
          <div className="more-text">
            <p>
              Are you ready to make your online presence more captivating and personalized?
              With the Kings Avatar Creator, you can easily upload a banner and create stunning custom
              campaign images featuring your very own pictures.
            </p>
          </div>
          <div className="explore">
            <div className="exp-content">
              <div className="exp">
                <p>EXPLORE</p>
                <img src={arrows} alt="" />
              </div>
            </div>
            <div className="exp-more">
              <p>
                Whether you're promoting an event, launching a new product,
                or simply expressing your unique style, Avatar Creator has you covered
              </p>
            </div>
          </div>
        </div>
        <div className="images">
          <div className="ellipse1">
            <div className="ellipse2">
              <img src={userIcon} alt="User Icon" />
            </div>
          </div>
          <img src={logo2} alt="Logo 2" className="logo logo2" />
          <img src={logo1} alt="Logo 1" className="logo logo1" />
        </div>
      </div>
      <div className="scroll">
        <h6>SCROLL FOR <span>MORE</span></h6>
      </div>
      <div className="more">
        <div className="how-it-works">
          <div className="exp">
            <h6>HOW IT WORKS</h6>
          </div>
        </div>
        <div className="upload">
          <div className="one">
            <img src={one} alt="" />
          </div>
          <div className="banner">
            <h6>UPLOAD YOUR BANNER</h6>
            <p>Choose a banner that </p>
            <p>represents your campaign</p>
            <p>or theme.</p>
          </div>
          <div className="circle">
            <img src={circleGroup1} alt="" />
          </div>
        </div>
        <div className="upload upload-2">
          <div className="circle">
            <img src={circleGroup2} alt="" />
          </div>
          <div className="banner">
            <h6>ADD YOUR PHOTO</h6>
            <p>Select and upload your</p>
            <p>pictures to personalize the</p>
            <p>campaign image.</p>
          </div>
          <div className="one">
            <img src={two} alt="" />
          </div>
        </div>
        <div className="upload upload-3">
          <div className="banner">
            <h6>CUSTOMIZE</h6>
            <p>Use our intuitive editing</p>
            <p>tools to adjust, enhance,</p>
            <p>and perfect your image.</p>
          </div>
          <div className="one">
            <img src={three} alt="" />
          </div>
          <div className="circle">
            <img src={circleGroup3} alt="" />
          </div>
        </div>
        <div className="upload upload-4">
          <div className="circle">
            <img src={circleGroup4} alt="" />
          </div>
          <div className="banner">
            <h6>SAVE AND SHARE</h6>
            <p> Download your custom</p>
            <p>campaign image or share</p>
            <p>it directly on social media</p>
          </div>
          <div className="one">
            <img src={four} alt="" />
          </div>
        </div>
        <div className="join">
          <div className="cnt">
            <img src={join} alt="" />
            <div className="join-txt">
              <h1>the Kings</h1>
              <h1>Avatar Creator</h1>
              <h1><span>Community.</span></h1>
            </div>
          </div>
          <div className="group-img">
            <img src={groupImage} alt="" />
            <div className="img-bg"></div>
          </div>
        </div>
        <div className="kings-avatar">
          <img src={kingsAvatar} alt="" />
        </div>
        <div className="start-now">
          <div className="start-cnt">
            <div className="get-started">
              <h1>GET <span>STARTED</span></h1>
              <h1>NOW</h1>
            </div>
            <div className="transform">
              <p>Transform your <span>photos</span> into powerful campaign images</p>
              <p>with Avatar Creator. <span>Sign up</span> today and start creating</p>
              <p>your personalized visual stories.</p>
            </div>
            <div className="btn">
              <Link to="/sign-up">SIGN UP</Link>
            </div>
          </div>
        </div>
        <div className="footer">
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
                        <p>Instagram</p>
                      </div>
                    </li>
                    <li>
                      <div className="img">
                        <img src={x} alt="" />
                        <p>Twitter</p>
                      </div>
                    </li>
                    <li>
                      <div className="img">
                        <img src={fb} alt="" />
                        <p>Facebook</p>
                      </div>
                    </li>
                    <li>
                      <div className="img">
                        <img src={linkedin} alt="" />
                        <p>LinkedIn</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
