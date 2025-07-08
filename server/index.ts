import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/hello", (_, res) => {
  res.json({ message: "Hello from Express + Vite!" });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticPath = path.join(__dirname, "../client/dist");

app.use(express.static(staticPath));

app.get("*", (_, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
