import express from "express";
import cors from "cors"; // 1. Importado o cors

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---

// 2. Adicionada a configuração do CORS para permitir requisições do seu frontend
app.use(cors({
  origin: 'https://nf-acai-xbqk.onrender.com', // A URL do seu Static Site
  credentials: true
}));

// 3. Adicionado o parser de JSON para que o backend entenda os dados de login
app.use(express.json());


// --- ROTAS DA API ---

app.get("/api/hello", (_, res) => {
  res.json({ message: "Hello from Express + Vite!" });
});

// Suas outras rotas da API (como a de login) virão aqui...
// app.post('/api/login', ...);


// 4. A parte de servir arquivos estáticos foi REMOVIDA.
// Isso agora é responsabilidade do serviço "Static Site" na Render.


// --- INICIALIZAÇÃO DO SERVIDOR ---

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
