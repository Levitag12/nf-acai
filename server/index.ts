import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";
import { fileURLToPath } from 'url';

const app = express();

// --- CONFIGURAÇÃO DE CORS FINAL E ROBUSTA ---
// Caminhos corrigidos para refletir exatamente os seus serviços no Render
const allowedOrigins = [
  'https://taskmaster-1-9how.onrender.com', // O seu frontend
  'https://taskmaster-tnzt.onrender.com',   // O seu backend/API
  'http://localhost:5173'                   // Para desenvolvimento local
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite pedidos se a origem estiver na lista ou se não houver origem (ex: Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  credentials: true, // Permite o envio de cookies de sessão
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], // Permite todos os métodos necessários
  allowedHeaders: ['Content-Type', 'Authorization'], // Permite os cabeçalhos necessários
}));
// ------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware de log (sem alterações)
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  // ... (resto do middleware de log)
  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Em produção, o backend não serve o frontend.
  if (process.env.NODE_ENV !== "production") {
    await setupVite(app, server);
  }

  // Inicia o servidor
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
