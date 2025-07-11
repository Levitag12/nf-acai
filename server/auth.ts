import { Router } from "express";
import { db } from "./db.js";
import { users } from "../shared/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const authRoutes = Router();

authRoutes.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Validação básica
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Usuário e senha são obrigatórios." });
  }

  try {
    // Busca usuário no banco
    const foundUser = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!foundUser) {
      return res.status(401).json({ message: "Usuário ou senha inválidos." });
    }

    // Compara senha
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.hashedPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Usuário ou senha inválidos." });
    }

    // Sucesso
    return res.status(200).json({
      message: "Login bem-sucedido!",
      role: foundUser.role,
    });

  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
});

export default authRoutes;
