import express from "express";
import cors from "cors";
import authRoutes from "./auth";
import routes from "./routes";
import { runSeed } from "./seed-logic"; // Importa a lógica do seed

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

// --- ROTA SEGURA PARA O SEED ---
app.get("/api/seed-database", async (req, res) => {
  const secret = req.query.secret;

  // Verifica se o segredo enviado na URL é o mesmo das variáveis de ambiente
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
  console.log(`Servidor rodando na porta ${PORT}`);
});
