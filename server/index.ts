import express, { type Request, Response, NextFunction } from "express";
import path from "path"; // Importar o módulo 'path'
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware de log (sem alterações)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
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

  // --- LÓGICA DE SERVIR FICHEIROS ATUALIZADA ---
  // Verifica explicitamente se está em ambiente de produção
  if (process.env.NODE_ENV === "production") {
    // 1. Encontra o caminho para a pasta 'dist' do cliente
    // A partir do ficheiro atual (que estará em 'dist/'), sobe um nível e entra em 'client/dist'
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const clientDistPath = path.resolve(__dirname, '..', 'client', 'dist');

    // 2. Serve os ficheiros estáticos (JS, CSS) dessa pasta
    app.use(express.static(clientDistPath));

    // 3. Para qualquer outra rota, envia o ficheiro principal 'index.html'
    // Isto permite que o roteamento do React funcione
    app.get("*", (_req, res) => {
      res.sendFile(path.join(clientDistPath, "index.html"));
    });
  } else {
    // Em desenvolvimento, usa o Vite como antes
    await setupVite(app, server);
  }

  // Inicia o servidor (sem alterações)
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
