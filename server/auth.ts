import { Router } from "express";
import { db } from "./db.js";
import { users } from "../shared/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const authRoutes = Router();

authRoutes.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Nome de utilizador e senha são obrigatórios." });
  }

  try {
    const foundUser = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!foundUser) {
      return res.status(401).json({ message: "Utilizador ou senha inválidos" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, foundUser.hashedPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Utilizador ou senha inválidos" });
    }

    return res.status(200).json({
      message: "Login bem-sucedido!",
      role: foundUser.role,
    });

  } catch (error) {
    console.error("Erro no processo de login:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

export default authRoutes;
