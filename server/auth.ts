import bcrypt from "bcrypt";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || "default-secret-key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // --- ROTA DE LOGIN CORRIGIDA ---
  app.post("/api/login", async (req, res) => {
    try {
      // 1. Alterado de 'email' para 'username' para corresponder ao formulário
      const { username, password } = req.body;

      // 2. Validação atualizada e mensagem traduzida
      if (!username || !password) {
        return res.status(400).json({ message: "Usuário e senha são obrigatórios" });
      }

      // 3. Busca o usuário pelo username (que é o ID do usuário)
      // A função isAuthenticated já usa storage.getUser(id), então sabemos que funciona.
      const user = await storage.getUser(username);
      if (!user || !user.hashedPassword) {
        // Mensagem genérica por segurança
        return res.status(401).json({ message: "Usuário ou senha inválidos" });
      }

      // 4. Compara a senha enviada com a senha criptografada no banco
      const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Usuário ou senha inválidos" });
      }

      // 5. Armazena o usuário na sessão para mantê-lo logado
      (req.session as any).userId = user.id;
      res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });

    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ message: "Falha no login" });
    }
  });

  // Logout route (sem alterações)
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out successfully" });
    });
  });
}

// isAuthenticated (sem alterações)
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const userId = (req.session as any)?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await storage.getUser(userId);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Attach user to request
  (req as any).user = user;
  next();
};
