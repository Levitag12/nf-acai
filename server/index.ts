import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Servir o build do frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));

// API exemplo
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express API!" });
});

// SPA: serve index.html para rotas desconhecidas exceto API
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) return res.status(404).send("API route not found.");
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});