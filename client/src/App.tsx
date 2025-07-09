import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importações das suas páginas
import LoginPage from './pages/login.tsx';
import AdminDashboardPage from './pages/admin-dashboard.tsx';
import ConsultantDashboardPage from './pages/consultant-dashboard.tsx';
import NotFoundPage from './pages/not-found.tsx';

function App() {
  return (
    <Routes>
      {/* Rota Principal */}
      <Route path="/" element={<LoginPage />} />

      {/* Rotas dos Dashboards */}
      <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
      <Route path="/consultant-dashboard" element={<ConsultantDashboardPage />} />

      {/* Rota para qualquer outro caminho não encontrado */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
