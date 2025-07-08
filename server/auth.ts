import { Router } from "express";
import { db } from "../db"; // Importa a conexão com o banco de dados
import { users } from "@shared/schema"; // Importa a tabela de usuários do seu schema
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt"; // Importa o bcrypt para senhas

const authRoutes = Router();

authRoutes.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Usuário e senha são obrigatórios." });
  }

  try {
    console.log(`Buscando usuário: ${username}`);

    // Procura o usuário no banco de dados
    const foundUser = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!foundUser) {
      console.log(`Usuário não encontrado: ${username}`);
      return res.status(401).json({ message: "Usuário ou senha inválidos" });
    }

    // Compara a senha enviada com a senha hasheada no banco
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordCorrect) {
      console.log(`Senha incorreta para o usuário: ${username}`);
      return res.status(401).json({ message: "Usuário ou senha inválidos" });
    }

    console.log(`Usuário ${username} autenticado com sucesso. Função: ${foundUser.role}`);

    // Retorna a mensagem de sucesso e a função (role) do usuário
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