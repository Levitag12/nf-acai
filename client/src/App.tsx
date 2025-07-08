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
    <div>
      <h1>Render Fullstack Deploy</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
