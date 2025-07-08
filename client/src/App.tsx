import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Carregando...");

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Erro ao conectar com o backend"));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="bg-card text-card-foreground p-6 rounded-xl shadow-lg max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">Render Fullstack Deploy</h1>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div> // <-- 1. div principal fechada
  ); // <-- 2. Parêntese do return fechado
} // <-- 3. Chave da função App fechada

export default App; // <-- 4. Exportação do componente