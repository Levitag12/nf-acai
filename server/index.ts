import express from "express";
import cors from "cors";
import authRoutes from "./auth";
import routes from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'https://nf-acai-xbqk.onrender.com',
  credentials: true
}));
app.use(express.json());

// Rotas
app.use("/api", authRoutes);
app.use("/", routes);

// Inicialização
app.listen(PORT, () => {
  console.log(`Servidor a rodar na porta ${PORT}`);
});
