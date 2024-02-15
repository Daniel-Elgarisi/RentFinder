import React, { useState } from 'react';
import LoginForm from './LoginForm/LoginForm';
import RegisterForm from './RegisterForm/RegisterForm';
import { register, login } from './authService';
import './AuthPage.css';

function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  const LoginHandler = async (emailAddress, password) => {
    try {
      const user = await login(emailAddress, password);
      alert('Login successful!');
      console.log(user); // For development/testing purposes
      // Redirect to home page or another appropriate action
      // window.location.href = '/home'; // Example redirect
    } catch (error) {
      alert(`Login failed: ${error.response?.data?.message || 'Please check your credentials and try again.'}`);
    }
  };

  const RegisterHandler = async (firstName, lastName, emailAddress, phoneNumber, password) => {
    try {
      const message = await register(firstName, lastName, emailAddress, phoneNumber, password);
      alert('Registration successful! Please log in.');
      setIsLoginView(true);
      console.log(message);
    } catch (error) {
      alert(`Registration failed: ${error.response?.data?.message || 'Please try again.'}`);
    }
  };

  return (
    <div>
      {isLoginView ? <LoginForm onToggleView={toggleView} onLogin={LoginHandler} /> : <RegisterForm onToggleView={toggleView} onRegister={RegisterHandler} />}
    </div>
  );
}

export default AuthPage;