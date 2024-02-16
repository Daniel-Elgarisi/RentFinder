import React, { useState } from "react";
import "../Login&RegisterFormStyle.css";
import { MdEmail } from "react-icons/md";
import { FaPhone, FaLock } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";

function RegisterForm({ onRegister, onToggleView }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const validatePhoneNumber = (phoneNumber) => {
    const isValidPhoneNumber = /^\d+$/.test(phoneNumber);
    if (!isValidPhoneNumber)
      return false;
    return true;
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const isValidLength = password.length >= 8;

    if (!isValidLength || !hasUpperCase || !hasDigit)
      return false;
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isPhoneOk = validatePhoneNumber(phoneNumber);
    const isPasswordOk = validatePassword(password);
    if (isPhoneOk && isPasswordOk)
      onRegister(firstName, lastName, emailAddress, phoneNumber, password);
    else if (!isPhoneOk && isPasswordOk) {
      setPhoneNumber("");
      alert("# מספר טלפון חייב להיות מורכב מספרות בלבד.");
    }
    else if (isPhoneOk && !isPasswordOk) {
      setPassword("");
      alert("# הסיסמה חייבת להיות באורך של לפחות 8 תווים, לכלול לפחות ספרה אחת ואות גדולה אחת.");
    }
    else {
      alert("# מספר טלפון חייב להיות מורכב מספרות בלבד.\n# הסיסמה חייבת להיות באורך של לפחות 8 תווים, לכלול לפחות ספרה אחת ואות גדולה אחת.");
      setPhoneNumber("");
      setPassword("");
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>הרשמה</h1>
        <div className="input-box">
          <input type="text" placeholder="שם פרטי" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <FaRegUser className="icon" />
        </div>
        <div className="input-box">
          <input type="text" placeholder="שם משפחה" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <FaRegUser className="icon" />
        </div>
        <div className="input-box">
          <input type="email" placeholder="אימייל" required value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
          <MdEmail className="icon" />
        </div>
        <div className="input-box">
          <input type="tel" placeholder="טלפון" required value={phoneNumber} minLength={9} maxLength={10} onChange={(e) => setPhoneNumber(e.target.value)} />
          <FaPhone className="icon" />
        </div>
        <div className="input-box">
          <input type="password" placeholder="סיסמא" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <FaLock className="icon" />
        </div>
        <button type="submit">הרשם</button>
        <div className="register-link">
          <p>
          כבר יש לך חשבון? <a onClick={onToggleView}>התחבר</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
