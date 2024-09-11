import React, { useState } from 'react'
import Header from './Header'
import userIcon from '../assets/user.svg';
import logo1 from '../assets/logo1.svg';
import logo2 from '../assets/logo2.svg';
import LoginSignUpModal from './LoginSignUpModal'
import Footer from './Footer';

const AboutUs: React.FC = () => {
  const [loginSignUp, setLoginSignUp] = useState<boolean>(false);

  const closeModal = () => {
    setLoginSignUp(false);
  };

  return (
    <div className="container landing">
      <Header 
      loginSignUp={loginSignUp} 
      setLoginSignUp={setLoginSignUp} 
      selectedLink='about' 
      getStarted={true}
      />
      {loginSignUp && <LoginSignUpModal closeModal={closeModal} />}
      <div className="sign-up dash">
        <div className="content">
          <div className="body-text">
            <h1>We are Your</h1>
            <h1> first hand to</h1>
            <h1>your <span>Events.</span></h1>
          </div>
          <div className="more-text">
            <p>
              Are you ready to make your online presence more captivating and personalized?
              With the Kings Avatar Creator, you can easily upload a banner and create stunning custom
              campaign images featuring your very own pictures.
            </p>
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
      <div className="explore">
        <div className="exp-more">
          <p>
            Whether you're promoting an event, launching a new product,
            or simply expressing your unique style, Avatar Creator has you covered
          </p>
        </div>
      </div>
      <div className="more">
        <Footer backgroundImage={false} />
      </div>
    </div>
  )
}

export default AboutUs
