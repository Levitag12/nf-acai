import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Esta é a configuração final e correta para o Render.
export default defineConfig({
  plugins: [
    react(),
    // Removemos os plugins específicos do Replit que não são necessários
  ],
  resolve: {
    // Usamos process.cwd() para garantir que os caminhos funcionem em qualquer ambiente
    alias: {
      "@": path.resolve(process.cwd(), "client", "src"),
      "@shared": path.resolve(process.cwd(), "shared"),
    },
  },
  // Define o diretório raiz do frontend.
  root: "client",
  build: {
    // Constrói o site para uma pasta 'dist' DENTRO da pasta 'client'.
    // O caminho final será 'client/dist'. Esta é a configuração padrão e robusta.
    outDir: "dist",
    emptyOutDir: true,
  },
});
