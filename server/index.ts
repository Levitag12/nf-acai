import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors"; // Importar o pacote CORS
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";
import { fileURLToPath } from 'url';

const app = express();

// --- CONFIGURAÇÃO DE CORS FINAL E ROBUSTA ---
// Lista explícita de todos os seus possíveis endereços de frontend
const allowedOrigins = [
  'https://taskmaster-1-9how.onrender.com', // O seu frontend principal
  'https://nf-acailandia.onrender.com',     // Um nome alternativo que você usou
  'http://localhost:5173'                   // Para desenvolvimento local
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite pedidos se a origem estiver na lista ou se não houver origem (ex: Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  credentials: true, // Permite o envio de cookies de sessão
};
app.use(cors(corsOptions));
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
  // Apenas em desenvolvimento usamos o Vite.
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
