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
      alert("# Phone number must consist of digits only.");
    }
    else if (isPhoneOk && !isPasswordOk) {
      setPassword("");
      alert("# Password must be at least 8 characters long, include at least one digit and one uppercase letter.");
    }
    else {
      alert("# Phone number must consist of digits only.\n# Password must be at least 8 characters long, include at least one digit and one uppercase letter.");
      setPhoneNumber("");
      setPassword("");
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        <div className="input-box">
          <input type="text" placeholder="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <FaRegUser className="icon" />
        </div>
        <div className="input-box">
          <input type="text" placeholder="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <FaRegUser className="icon" />
        </div>
        <div className="input-box">
          <input type="email" placeholder="Email" required value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
          <MdEmail className="icon" />
        </div>
        <div className="input-box">
          <input type="tel" placeholder="Phone Number" required value={phoneNumber} minLength={9} maxLength={10} onChange={(e) => setPhoneNumber(e.target.value)} />
          <FaPhone className="icon" />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <FaLock className="icon" />
        </div>
        <button type="submit">Register</button>
        <div className="register-link">
          <p>
            Already have an account? <a onClick={onToggleView}>Login</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
