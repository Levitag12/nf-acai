import express from "express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

// Drizzle/DB imports
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './db';

// Suas rotas e lógica de seed
import authRoutes from "./auth";
import routes from "./routes";
import { runSeed } from "./seed-logic";

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---
app.use(cors({
  origin: 'https://nf-acai-xbqk.onrender.com',
  credentials: true
}));
app.use(express.json());

// --- ROTAS ---
app.use("/api", authRoutes);
app.use("/", routes);

// --- ROTA SEGURA PARA MIGRATE ---
app.get("/api/migrate", async (req, res) => {
  const secret = req.query.secret;

  if (secret !== process.env.SEED_SECRET) {
    return res.status(403).json({ message: "Acesso negado." });
  }

  try {
    console.log("Iniciando migração do banco de dados...");

    // Caminho robusto para a pasta de migrações
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const migrationsFolder = path.join(__dirname, '../drizzle');

    console.log(`Lendo migrações da pasta: ${migrationsFolder}`);
    await migrate(db, { migrationsFolder });

    console.log("Migração concluída com sucesso!");

    return res.status(200).json({ message: "Migração do banco de dados concluída com sucesso!" });
  } catch (error: any) {
    console.error("Erro ao executar a migração via endpoint:", error);
    return res.status(500).json({ message: "Erro no servidor durante a migração.", error: error.message });
  }
});

// --- ROTA SEGURA PARA O SEED ---
app.get("/api/seed-database", async (req, res) => {
  const secret = req.query.secret;

  if (secret !== process.env.SEED_SECRET) {
    return res.status(403).json({ message: "Acesso negado." });
  }

  try {
    const result = await runSeed();
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Erro ao executar o seed via endpoint:", error);
    return res.status(500).json({ message: "Erro no servidor durante o seed.", error: error.message });
  }
});


// --- INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, () => {
  console.log(`Servidor a rodar na porta ${PORT}`);
});