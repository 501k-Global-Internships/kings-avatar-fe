import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { AxiosError } from 'axios';
import axios from '../api/axios';
import { ErrorResponse } from './AppInterface';
import Header from './Header';
import googleIcon from '../assets/google.svg';
import facebookIcon from '../assets/facebook.svg';
import userIcon from '../assets/user.svg';
import logo1 from '../assets/logo1.svg';
import logo2 from '../assets/logo2.svg';
import './App.scss';

const SignIp: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState<Boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [errMsg, setErrMsg] = useState<{ msg: string }[] | string>('');
  const errRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate()

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/users/sign-in',
        JSON.stringify({ email, password }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      localStorage.setItem('token', response?.data?.token);
      localStorage.setItem('email', response?.data?.email);

      navigate('/dashboard');
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;

      if (error.response && error.response.data) {
        if (Array.isArray(error.response.data.errors)) {
          setErrMsg(error.response.data.errors);
        } else {
          setErrMsg([{ msg: error.response.data.message }]);
        }
      } else {
        setErrMsg([{ msg: "No Server Response!" }]);
      }
      errRef?.current?.focus();
    }
  }

  return (
    <div className="container">
      <Header loginSignUp={false} setLoginSignUp={() => {}}/>
      <div className="sign-up">
        <div className="content">
          <div className="body-text">
            <h1>Login & Start</h1>
            <h1>Creating Your</h1>
            <h1><span>Event.</span></h1>
          </div>
          <div className="form-inputs">
            {Array.isArray(errMsg) ? (
              errMsg.map((error, index) => (
                <p key={index}
                  ref={index === 0 ? errRef : null}
                  className={errMsg ? "errmsg" : "offscreen"}
                  aria-live="assertive">
                  {error.msg}
                </p>
              ))
            ) : (
              <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive">
                {errMsg}
              </p>
            )}
            <form action="" onSubmit={handleSubmit}>
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email address' />
              <div className="input">
                <input
                  type={passwordVisible ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Create password' />
                <FontAwesomeIcon
                  icon={passwordVisible ? faEye : faEyeSlash}
                  className="eye-icon"
                  onClick={handleTogglePasswordVisibility}
                />
              </div>
              <div className="forgot-password">
                <Link to="/forgot-password">Forget Password?</Link>
              </div>
              <div className="btn">
                <button type='submit'>Login</button>
              </div>
              <p className="instruction">New user? Click <Link to="/sign-up">here</Link> to Create an account</p>
              <div className="options">
                <hr />
                <p className="option">or login with</p>
                <hr />
              </div>
              <div className="signup-icons">
                <div className="center">
                  <div className="google">
                    <img src={googleIcon} alt="" />
                    <p>Google</p>
                  </div>
                  <div className="facebook">
                    <img src={facebookIcon} alt="" />
                    <p>Facebook</p>
                  </div>
                </div>
              </div>
            </form>
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

export default SignIp;
