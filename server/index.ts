import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---
// Garante que esta seção venha ANTES de todas as rotas.

// Configuração do CORS para permitir requisições do seu frontend
app.use(cors({
  origin: 'https://nf-acai-xbqk.onrender.com', // A URL do seu Static Site
  credentials: true
}));

// Parser de JSON para entender os dados enviados no corpo da requisição
app.use(express.json());


// --- ROTAS DA API ---

// Rota de teste
app.get("/api/hello", (_, res) => {
  res.json({ message: "Hello from Express + Vite!" });
});

// Rota de Login (Exemplo Funcional)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  console.log(`Tentativa de login recebida para o usuário: ${username}`);

  // Lógica de exemplo:
  // Verifique se o usuário é "admin" e a senha é "password"
  if (username === "admin" && password === "password") {
    console.log(`Usuário ${username} autenticado com sucesso.`);
    // Em um caso real, você geraria um token JWT ou uma sessão aqui
    res.status(200).json({ message: "Login bem-sucedido!" });
  } else {
    console.log(`Falha na autenticação para o usuário: ${username}.`);
    res.status(401).json({ message: "Usuário ou senha inválidos" });
  }
});


// --- INICIALIZAÇÃO DO SERVIDOR ---

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
