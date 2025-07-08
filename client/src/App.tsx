// client/src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
}

export default App;