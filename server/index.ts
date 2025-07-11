import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "./db.js"; // ou './db.ts' se estiver usando tsx no dev
import authRoutes from "./auth.js";
import routes from "./routes.js";
import { users } from "../shared/schema.js";

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors({
  origin: 'https://nf-acai-xbqk.onrender.com', // Render frontend
  credentials: true
}));
app.use(express.json());

// --- Rotas da API ---
app.use("/api", authRoutes);
app.use("/", routes);

// --- Rota para popular o banco com usuário admin ---
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
      id: "admin",
      username: "admin",
      email: "admin@nf-acai.com",
      name: "Administrador",
      hashedPassword,
      role: "ADMIN" // << corrigido aqui
    });

    res.send("Usuário admin criado com sucesso.");
  } catch (error) {
    console.error("Erro no seed:", error);
    res.status(500).send("Erro ao criar usuário.");
  }
});

// --- Servir Frontend compilado ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.resolve(__dirname, "../client/dist");

app.use(express.static(clientBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
