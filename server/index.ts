import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// --- CONFIGURAÇÃO DE CORS FINAL E ROBUSTA ---
const allowedOrigins = [
  "https://taskmaster-1-9how.onrender.com",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origem não permitida pelo CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Habilita CORS e preflight
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware de log (opcional)
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  next();
});

// === ROTAS DE API ===
registerRoutes(app);

// === SERVE FRONTEND EM PRODUÇÃO ===
const distPath = path.join(__dirname, "..", "client", "dist");

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // Fallback para SPA (React Router)
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// === INÍCIO DO SERVIDOR ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
