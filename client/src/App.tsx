import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      {/* Esta linha diz para mostrar a LoginPage na rota principal */}
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
}

export default App;