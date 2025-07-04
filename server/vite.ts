import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        process.cwd(), // Usar process.cwd() para o caminho correto
        "client",
        "index.html",
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

// --- FUNÇÃO CORRIGIDA E ROBUSTA PARA PRODUÇÃO ---
export function serveStatic(app: Express) {
  // Na Vercel, process.cwd() aponta para a raiz do projeto.
  // O build do cliente (Vite) gera os ficheiros na pasta 'client/dist'.
  const clientDistPath = path.resolve(process.cwd(), "client", "dist");

  // Verifica se a pasta de build do cliente realmente existe.
  if (!fs.existsSync(clientDistPath)) {
    const errorMessage = `Diretório de build do cliente não encontrado em: ${clientDistPath}.`;
    console.error(errorMessage);
    // Envia uma resposta de erro clara no navegador
    app.use('*', (_req, res) => {
      res.status(500).send(`
        <h1>Erro de Configuração do Servidor</h1>
        <p>${errorMessage}</p>
        <p>Verifique os logs de build na Vercel.</p>
      `);
    });
    return;
  }

  // 1. Serve os ficheiros estáticos (JS, CSS, imagens) a partir da pasta de build do cliente.
  app.use(express.static(clientDistPath));

  // 2. Para qualquer outra rota não encontrada, envia o ficheiro principal index.html.
  // Isto é crucial para que o roteamento do React (wouter) funcione.
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(clientDistPath, "index.html"));
  });
}
