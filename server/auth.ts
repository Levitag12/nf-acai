import { Router } from "express";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const authRoutes = Router();

authRoutes.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Nome de usuário e senha são obrigatórios." });
  }

  try {
    console.log(`Buscando usuário: ${username}`);

    // Procura o usuário no banco pela coluna 'username'
    const foundUser = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!foundUser) {
      console.log(`Usuário não encontrado: ${username}`);
      return res.status(401).json({ message: "Usuário ou senha inválidos" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, foundUser.hashedPassword);

    if (!isPasswordCorrect) {
      console.log(`Senha incorreta para o usuário: ${username}`);
      return res.status(401).json({ message: "Usuário ou senha inválidos" });
    }

    console.log(`Usuário ${username} autenticado com sucesso. Função: ${foundUser.role}`);

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