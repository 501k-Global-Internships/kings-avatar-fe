import React, { useRef, useState } from 'react'
import { AxiosError } from 'axios';
import axios from '../api/axios';
import { ErrorResponse } from './Types';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import userIcon from '../assets/user.svg';
import logo1 from '../assets/logo1.svg';
import logo2 from '../assets/logo2.svg';
import LoginSignUpModal from './LoginSignUpModal';

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loginSignUp, setLoginSignUp] = useState<boolean>(false);

  const [errMsg, setErrMsg] = useState<{ msg: string }[] | string>('');
  const errRef = useRef<HTMLParagraphElement>(null);

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.patch('/api/users/forgot-password',
        JSON.stringify({ email }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );

      navigate('/forgot-password-successful');
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

  const closeModal = () => {
    setLoginSignUp(false);
  };

  return (
    <div className="container">
      <Header
        loginSignUp={loginSignUp}
        setLoginSignUp={setLoginSignUp}
        selectedLink=''
        getStarted={true}
      />
      {loginSignUp && <LoginSignUpModal closeModal={closeModal} />}
      <div className="sign-up">
        <div className="content fgt-pwd">
          <div className="body-text">
            <h1>Forgot Your</h1>
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
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email address'
              />
              <div className="btn btn-reset">
                <button type='submit'>Send reset link</button>
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

export default ForgetPassword
