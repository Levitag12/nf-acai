import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors"; // Importar o pacote CORS
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";
import { fileURLToPath } from 'url';

const app = express();

// --- CONFIGURAÇÃO DE CORS ROBUSTA ---
// Isto permite que o seu site no Render e o seu ambiente de desenvolvimento
// local façam pedidos para esta API.
const allowedOrigins = [
  'https://taskmaster-1-9how.onrender.com',
  'http://localhost:5173' // Para desenvolvimento local
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite pedidos sem 'origin' (como apps mobile ou Postman) ou se a origem estiver na lista
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permite que cookies (para a sessão) sejam enviados
};
app.use(cors(corsOptions));
// ------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ... (o resto do ficheiro permanece o mesmo) ...

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  if (process.env.NODE_ENV === "production") {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const publicPath = path.join(__dirname, 'public');
    app.use(express.static(publicPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(publicPath, "index.html"));
    });
  } else {
    await setupVite(app, server);
  }

  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
