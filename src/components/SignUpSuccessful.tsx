import React from 'react';
import Header from './Header';
import userIcon from '../assets/user.svg';
import logo1 from '../assets/logo1.svg';
import logo2 from '../assets/logo2.svg';
import checkIcon from '../assets/Checked.svg'
import './App.scss';

const SignUpSuccessful: React.FC = () => {

  return (
    <div className="container">
      <Header />
      <div className="sign-up">
        <div className="content">
          <div className="body-text">
            <h1>Signup & Start</h1>
            <h1>Creating Your</h1>
            <h1><span>Event.</span></h1>
          </div>
          <div className="form-inputs">
            <div className="checked">
              <img src={checkIcon} alt="" />
              <p>Account is <span>successfully</span> Created!</p>
            </div>
            <div className="confirm-acc">
              <p>Go to your <span>Email</span> to confirm your account.</p>
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
    </div>
  );
}

export default SignUpSuccessful;
