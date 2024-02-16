import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/Auth/authPage&Service/AuthPage';
import HomePage from './components/Pages/HomePage/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/" element={<Navigate replace to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;