import { db } from "../server/db";
// Importar todas as tabelas necessárias para a limpeza
import { users, documents, attachments } from "../shared/schema";
import { storage } from "../server/storage";
import bcrypt from "bcrypt";

// Interface unificada para os dados do utilizador
interface UserData {
  name: string;
  username: string;
  password: string;
  role: "ADMIN" | "CONSULTANT";
}

async function seed() {
  try {
    console.log("🌱 Iniciando a população do banco de dados...");

    // 1. Limpa as tabelas na ordem correta para respeitar as chaves estrangeiras.
    console.log("🗑️  Limpando tabelas existentes...");
    // Primeiro os "netos" (anexos)
    await db.delete(attachments);
    // Depois os "filhos" (documentos)
    await db.delete(documents);
    // Finalmente os "pais" (utilizadores)
    await db.delete(users);
    console.log("✅ Tabelas limpas com sucesso.");

    // Lista única de utilizadores para criar
    const usersToCreate: UserData[] = [
      { name: "Admin User", username: "admin", password: "g147g147g147", role: "ADMIN" },
      { name: "Admin User 2", username: "admin2", password: "258", role: "ADMIN" },
      { name: "Sergio Bandeira", username: "sergio.bandeira", password: "1122", role: "CONSULTANT" },
      { name: "Mayco Muniz", username: "mayco.muniz", password: "1133", role: "CONSULTANT" },
      { name: "Fernando Basil", username: "fernando.basil", password: "1144", role: "CONSULTANT" },
      { name: "Paulo Marcio", username: "paulo.marcio", password: "1155", role: "CONSULTANT" },
      { name: "Mauricio Simões", username: "mauricio.simoes", password: "1166", role: "CONSULTANT" },
    ];

    console.log(`\n📋 Criando ${usersToCreate.length} utilizadores...`);

    for (const userData of usersToCreate) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const userPayload = {
        id: userData.username,
        email: `${userData.username}@company.com`,
        name: userData.name,
        hashedPassword,
        role: userData.role,
      };

      await storage.createUser(userPayload);
      console.log(`✅ Utilizador '${userData.username}' criado com sucesso.`);
    }

    console.log("\n🎉 População do banco de dados concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao popular o banco de dados:", error);
    process.exit(1);
  }
}

seed();
