import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./auth";
import routes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/api", routes);
app.use("/auth", authRoutes);

// Servir arquivos estáticos da build do Vite (frontend)
app.use(express.static(path.join(__dirname, "..", "client", "dist")));

// Redirecionar todas as outras rotas para o index.html (SPA React)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
