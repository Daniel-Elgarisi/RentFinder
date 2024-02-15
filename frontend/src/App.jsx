import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/Auth/AuthPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" Component={AuthPage} />
        {/* Redirect from root to /auth */}
        <Route path="/" element={<Navigate replace to="/auth" />} />
        {/* Define other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;

