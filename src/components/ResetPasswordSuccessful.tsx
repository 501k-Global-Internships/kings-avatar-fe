import React from 'react'
import Header from './Header'
import userIcon from '../assets/user.svg';
import logo1 from '../assets/logo1.svg';
import logo2 from '../assets/logo2.svg';
import checkIcon from '../assets/Checked.svg'
import { Link } from 'react-router-dom';

const ResetPasswordSuccessful: React.FC = () => {
  return (
    <div className="container">
      <Header loginSignUp={false} setLoginSignUp={() => { }} selectedLink='home' />
      <div className="sign-up">
        <div className="content">
          <div className="body-text">
            <h1>Reset Your</h1>
            <h1><span>Password?.</span></h1>
          </div>
          <div className="form-inputs">
            <div className="checked">
              <img src={checkIcon} alt="" />
              <p> your <span>password reset</span> is successful!</p>
            </div>
            <div className="confirm-acc">
              <p>Click <span><Link to="/sign-in">here</Link></span> to login to your account</p>
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
  )
}

export default ResetPasswordSuccessful
