import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// 1. Importe as ferramentas do React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App.tsx';
import './index.css';

// 2. Crie uma instância do "cliente" do React Query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 3. Envolva a aplicação com o QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);