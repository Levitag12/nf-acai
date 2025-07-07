import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./auth";
import routes from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

// Habilita CORS e JSON
app.use(cors());
app.use(express.json());

// Rotas API
app.use("/auth", authRoutes);
app.use("/", routes);

// Serve arquivos estáticos do frontend buildado (React)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../client/dist");

app.use(express.static(clientDistPath));

// SPA fallback (React Router, etc.)
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
