import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "./db.js";
import authRoutes from "./auth.js";
import routes from "./routes.js";
import { users } from "../shared/schema.js";

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors({
  origin: 'https://nf-acai-xbqk.onrender.com',
  credentials: true
}));
app.use(express.json());

// --- Rotas ---
app.use("/api", authRoutes);
app.use("/", routes);

// --- Rota para seed do banco de dados ---
app.get("/api/seed-database", async (req, res) => {
  if (req.query.secret !== "G147G147G147") {
    return res.status(401).json({ message: "Não autorizado." });
  }

  try {
    const existing = await db.query.users.findFirst({
      where: eq(users.username, "admin"),
    });

    if (existing) {
      return res.send("Usuário admin já existe.");
    }

    const hashedPassword = await bcrypt.hash("senha123", 10);

    await db.insert(users).values({
      username: "admin",
      hashedPassword,
      role: "admin"
    });

    res.send("Usuário admin criado com sucesso.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar usuário.");
  }
});

// --- Servir frontend Vite ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.resolve(__dirname, "../client/dist");

app.use(express.static(clientBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// --- Iniciar servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
