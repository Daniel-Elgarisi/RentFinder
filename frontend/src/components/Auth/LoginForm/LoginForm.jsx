import React, { useState } from "react";
import "../Login&RegisterFormStyle.css";
import { FaUser, FaLock } from "react-icons/fa";

function LoginForm({ onLogin, onToggleView }) {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const isValidLength = password.length >= 8;

    if (!isValidLength || !hasUpperCase || !hasDigit) {
      alert("# הסיסמה חייבת להיות באורך של לפחות 8 תווים, לכלול לפחות ספרה אחת ואות גדולה אחת.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validatePassword(password))
      onLogin(emailAddress, password);
    else
      setPassword('');
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>התחברות</h1>
        <div className="input-box">
          <input type="email" placeholder="אימייל" required value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input type="password" placeholder="סיסמא" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <FaLock className="icon" />
        </div>
        <button type="submit">התחבר</button>
        <div className="register-link">
          <p>איו לך חשבון? <a onClick={onToggleView}>הרשמה</a></p>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
