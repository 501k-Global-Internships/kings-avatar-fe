import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { AxiosError } from 'axios';
import axios from '../api/axios';
import { ErrorResponse } from './Types';
import Header from './Header';
import googleIcon from '../assets/google.svg';
import facebookIcon from '../assets/facebook.svg';
import userIcon from '../assets/user.svg';
import logo1 from '../assets/logo1.svg';
import logo2 from '../assets/logo2.svg';
import './App.scss';

const SignUp: React.FC = () => {
  const PWD_REGEX = useMemo(() => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/, []);
  const [passwordVisible, setPasswordVisible] = useState<Boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<Boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [validPassword, setValidPassword] = useState<Boolean>(false);
  const [passwordFocus, setPasswordFocus] = useState<Boolean>(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');

  const [email, setEmail] = useState<string>('');
  const [errMsg, setErrMsg] = useState<{ msg: string }[] | string>('');
  const errRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate()

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password, PWD_REGEX])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validPassword = PWD_REGEX.test(password);
    if (!validPassword) {
      setErrMsg("Invalid password.");
      return;
    }

    try {
      const response = await axios.post('/api/users/sign-up',
        JSON.stringify({ email, password, passwordConfirmation }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      localStorage.setItem('token', response?.data?.token);
      localStorage.setItem('email', response?.data?.email);

      navigate("/")
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
      <Header
        loginSignUp={false}
        setLoginSignUp={() => { }}
        selectedLink='home'
        getStarted={false}
      />
      <div className="sign-up">
        <div className="content">
          <div className="body-text">
            <h1>Signup & Start</h1>
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
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                  placeholder='Create password' />
                <FontAwesomeIcon
                  icon={passwordVisible ? faEye : faEyeSlash}
                  className="eye-icon"
                  onClick={handleTogglePasswordVisibility}
                />
              </div>
              <div className="warning">
                <p id="pwd" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  8 to 24 characters.
                  Must include uppercase and lowercase letters, a number and a special character.<br />
                  Allowed special characters: <span aria-label="exclamation mark">!</span>
                  <span aria-label="at symbol">@</span>
                  <span aria-label="hashtag">#</span>
                  <span aria-label="dollar sign">$</span>
                  <span aria-label="percent">%</span>
                </p>
              </div>
              <div className="input">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder='Confirm password' />
                <FontAwesomeIcon
                  icon={confirmPasswordVisible ? faEye : faEyeSlash}
                  className="eye-icon"
                  onClick={handleToggleConfirmPasswordVisibility}
                />
              </div>
              <div className="btn">
                <button type='submit'>Signup</button>
              </div>
              <p className="instruction">Registered already? Click <Link to="/sign-in">here</Link> to Login to your account</p>
              <div className="options">
                <hr />
                <p className="option">or signup with</p>
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

export default SignUp;
