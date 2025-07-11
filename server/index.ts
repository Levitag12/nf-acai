import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { runSeed } from "./seed-logic.js";
import authRoutes from "./auth.js";
import routes from "./routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors({
  origin: "https://nf-acai-xbqk.onrender.com", // ajuste para seu frontend real
  credentials: true,
}));
app.use(express.json());

// --- Rotas da API ---
app.use("/api", authRoutes);
app.use("/", routes);

// --- Rota para popular o banco ---
app.get("/api/seed", async (req, res) => {
  if (req.query.secret !== "G147G147G147") {
    return res.status(401).json({ message: "Não autorizado." });
  }

  try {
    const result = await runSeed();
    res.json(result);
  } catch (error) {
    console.error("Erro ao executar seed:", error);
    res.status(500).json({ message: "Erro ao executar seed." });
  }
});

// --- Servir frontend do Vite ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.resolve(__dirname, "./client");

app.use(express.static(clientBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// --- Iniciar servidor ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
