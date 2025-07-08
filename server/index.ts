import express from "express";
import cors from "cors";
import authRoutes from "./auth"; // Importa as rotas de autenticação
import routes from "./routes";   // Importa suas rotas gerais

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---
app.use(cors({
  origin: 'https://nf-acai-xbqk.onrender.com',
  credentials: true
}));
app.use(express.json());

// --- ROTAS ---
// Monta as rotas de autenticação sob o prefixo /api
app.use("/api", authRoutes); 
// Monta as rotas gerais
app.use("/", routes);

// --- INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});