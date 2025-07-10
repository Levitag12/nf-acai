import express from "express";
import cors from "cors";

// Drizzle/DB imports
import { db } from './db.js'; // <-- Adicionado .js

// Suas rotas
import authRoutes from "./auth.js"; // <-- Adicionado .js
import routes from "./routes.js";   // <-- Adicionado .js

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---
app.use(cors({
  origin: 'https://nf-acai-xbqk.onrender.com',
  credentials: true
}));
app.use(express.json());

// --- ROTAS ---
app.use("/api", authRoutes);
app.use("/", routes);

// --- INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, () => {
  console.log(`Servidor a rodar na porta ${PORT}`);
});