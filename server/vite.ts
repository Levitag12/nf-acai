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
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
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

// --- FUNÇÃO CORRIGIDA ---
export function serveStatic(app: Express) {
  // O caminho correto para a pasta de build do cliente em produção.
  // A Vercel coloca tudo na pasta 'dist'.
  const distPath = path.resolve(import.meta.dirname, "..");

  // Verifica se o ficheiro index.html existe para garantir que o build foi bem-sucedido.
  if (!fs.existsSync(path.join(distPath, "index.html"))) {
    throw new Error(
      `Não foi possível encontrar o index.html no diretório de build: ${distPath}. Verifique se o cliente foi construído corretamente.`,
    );
  }

  // Serve todos os ficheiros estáticos (CSS, JS, imagens) a partir da pasta 'dist'.
  app.use(express.static(distPath));

  // Para qualquer outra requisição, serve o ficheiro principal index.html.
  // Isto é crucial para que o roteamento do React funcione corretamente.
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
