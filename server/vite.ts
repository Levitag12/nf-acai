import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // Mantém as rotas relativas à raiz
  build: {
    outDir: "dist", // Output da build (Render busca esse diretório)
    emptyOutDir: true,
  },
  server: {
    port: 5173, // Para desenvolvimento local
  },
  preview: {
    port: 10000, // ESSENCIAL para Render, pois ele usa essa porta!
  },
});
