import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors"; // 1. Importar o pacote CORS
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";
import { fileURLToPath } from 'url';

const app = express();

// 2. Configurar o CORS
// Isto permite que o seu site (frontend) faça pedidos ao seu servidor (backend).
const corsOptions = {
  // Substitua pelo URL do seu frontend no Render se for diferente
  origin: 'https://taskmaster-1-9how.onrender.com', 
  credentials: true, // Permite que cookies (para a sessão) sejam enviados
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware de log (sem alterações)
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

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

  // Lógica para servir os ficheiros estáticos em produção
  if (process.env.NODE_ENV === "production") {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const publicPath = path.join(__dirname, 'public');

    app.use(express.static(publicPath));

    app.get("*", (_req, res) => {
      res.sendFile(path.join(publicPath, "index.html"));
    });
  } else {
    // Em desenvolvimento, usa o Vite para recarregamento rápido.
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
