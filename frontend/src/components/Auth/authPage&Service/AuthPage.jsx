import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';
import { register, login } from './authService';
import './AuthPage.css';

function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  const LoginHandler = async (emailAddress, password) => {
    try {
      await login(emailAddress, password);
      alert('התחברת בהצלחה!');
      navigate('/homepage');
    } catch (error) {
      alert(`ההתחברות נכשלה: ${error.response?.data?.message || 'אנא בדוק את תקינות השדות שלך ונסה שוב.'}`);
    }
  };

  const RegisterHandler = async (firstName, lastName, emailAddress, phoneNumber, password) => {
    try {
      await register(firstName, lastName, emailAddress, phoneNumber, password);
      alert('ההרשמה בוצעה בהצלחה! התחבר לאתר.');
      setIsLoginView(true);
    } catch (error) {
      alert(`ההרשמה נכשלה: ${error.response?.data?.message || 'בבקשה נסה שוב.'}`);
    }
  };

  return (
    <div className="auth-container">
       {isLoginView ? <LoginForm onToggleView={toggleView} onLogin={LoginHandler} /> : <RegisterForm onToggleView={toggleView} onRegister={RegisterHandler} />}
    </div>
);
}

export default AuthPage;