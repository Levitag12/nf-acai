import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // ⚠️ importante para rotas funcionarem no Render
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
