import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login.tsx';
import AdminDashboardPage from './pages/admin-dashboard.tsx';
import ConsultantDashboardPage from './pages/consultant-dashboard.tsx';
import NotFoundPage from './pages/not-found.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
      <Route path="/consultant-dashboard" element={<ConsultantDashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
