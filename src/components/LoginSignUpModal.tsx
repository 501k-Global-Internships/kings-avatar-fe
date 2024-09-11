import React from 'react'
import { Link } from 'react-router-dom'
import { LoginSignUpModalProps } from './Types'
import './LoginSignUpModal.scss'

const LoginSIgnUpModal: React.FC<LoginSignUpModalProps>= ({ closeModal }) => {
  return (
    <div className="login-signup-modal"  onClick={closeModal}>
      <div className="links" onClick={(e) => e.stopPropagation()}>
      <Link className="login" to="/sign-in">LOGIN</Link>
      <Link className="register" to="/sign-up">SIGNUP</Link>
      </div>
  </div>
  )
}

export default LoginSIgnUpModal
