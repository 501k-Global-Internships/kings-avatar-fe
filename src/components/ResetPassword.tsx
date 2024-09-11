import React, { useEffect, useMemo, useRef, useState } from 'react'
import Header from './Header';
import LoginSignUpModal from './LoginSignUpModal';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AxiosError } from 'axios';
import { ErrorResponse } from './Types';
import userIcon from '../assets/user.svg';
import logo1 from '../assets/logo1.svg';
import logo2 from '../assets/logo2.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const ResetPassword: React.FC = () => {
  const PWD_REGEX = useMemo(() => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/, []);
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  const [passwordFocus, setPasswordFocus] = useState<Boolean>(false);
  const [validPassword, setValidPassword] = useState<Boolean>(false);
  const [loginSignUp, setLoginSignUp] = useState<boolean>(false);

  const [passwordVisible, setPasswordVisible] = useState<Boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<Boolean>(false);

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
    setValidPassword(PWD_REGEX.test(newPassword));
  }, [newPassword, PWD_REGEX]);

  const closeModal = () => {
    setLoginSignUp(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const recoveryPasswordId = urlParams.get('recoveryPasswordId');

    try {
      await axios.put(`/api/users/reset-password?recoveryPasswordId=${recoveryPasswordId}`,
        JSON.stringify({ newPassword, confirmPassword }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );

      navigate('/reset-password-successful');
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
      {loginSignUp && <LoginSignUpModal closeModal={closeModal} />}
      <Header
        loginSignUp={loginSignUp}
        setLoginSignUp={setLoginSignUp}
        selectedLink=''
        getStarted={true}
      />
      <div className="sign-up">
        <div className="content fgt-pwd">
          <div className="body-text">
            <h1>Reset Your</h1>
            <h1><span>Password?.</span></h1>
          </div>
          <div className="instruction">
            <p>Input your <span>Email</span> to confirm your account.</p>
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
              <div className="input">
                <input
                  type={passwordVisible ? "text" : "password"}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                  placeholder='New password' />
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
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Confirm password' />
                <FontAwesomeIcon
                  icon={confirmPasswordVisible ? faEye : faEyeSlash}
                  className="eye-icon"
                  onClick={handleToggleConfirmPasswordVisibility}
                />
              </div>
              <div className="btn">
                <button type='submit'>Reset Password</button>
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
  )
}

export default ResetPassword
