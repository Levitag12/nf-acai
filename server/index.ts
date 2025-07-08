// server/index.ts

import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---
app.use(cors({
  origin: 'https://nf-acai-xbqk.onrender.com', // A URL do seu Static Site
  credentials: true
}));
app.use(express.json());

// --- ROTAS DA API ---

// Rota de Login que retorna a função do usuário
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  console.log(`Tentativa de login para: ${username}`);

  // Lógica de exemplo
  if (username === "admin" && password === "password") {
    console.log("Usuário admin autenticado.");
    // Retorna a função 'admin'
    return res.status(200).json({ message: "Login bem-sucedido!", role: "admin" });
  }

  if (username === "consultor" && password === "password") {
    console.log("Usuário consultor autenticado.");
    // Retorna a função 'consultant'
    return res.status(200).json({ message: "Login bem-sucedido!", role: "consultant" });
  }

  console.log(`Falha na autenticação para: ${username}`);
  return res.status(401).json({ message: "Usuário ou senha inválidos" });
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});