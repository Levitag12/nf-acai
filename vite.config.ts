import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Esta é a configuração final e correta para o Render.
export default defineConfig({
  plugins: [
    react(),
    // Removemos os plugins específicos do Replit que não são necessários no Render
  ],
  resolve: {
    // Usamos process.cwd() para garantir que os caminhos funcionem em qualquer ambiente
    alias: {
      "@": path.resolve(process.cwd(), "client", "src"),
      "@shared": path.resolve(process.cwd(), "shared"),
      "@assets": path.resolve(process.cwd(), "attached_assets"),
    },
  },
  // Define o diretório raiz do frontend. O Render executará os comandos a partir daqui.
  root: "client",
  build: {
    // Constrói o site para uma pasta 'dist' DENTRO da pasta 'client'.
    // O caminho final será 'client/dist'. Esta é a configuração padrão e robusta.
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
