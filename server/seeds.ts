import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema';
import bcrypt from 'bcrypt';

async function seed() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    throw new Error(
      "A variável DATABASE_URL não está configurada no seu arquivo .env"
    );
  }

  // Inicializa a conexão usando o driver do Neon
  const sql = neon(dbUrl);
  const db = drizzle(sql, { schema });

  try {
    console.log("🌱 Iniciando a população do banco de dados...");
    console.log("Este processo pode demorar um pouco para 'acordar' o banco de dados...");

    console.log("🗑️  Limpando tabelas existentes...");
    // Correção: Usando a função `sql` diretamente para executar o DELETE
    await sql`DELETE FROM "attachments"`;
    await sql`DELETE FROM "documents"`;
    await sql`DELETE FROM "users"`;
    console.log("✅ Tabelas limpas com sucesso.");

    const usersToCreate = [
      { id: "admin", name: "Admin User", username: "admin", passwordToHash: "g147g147g147", role: "ADMIN" as const },
      { id: "admin2", name: "Admin User 2", username: "admin2", passwordToHash: "258", role: "ADMIN" as const },
      { id: "sergio.bandeira", name: "Sergio Bandeira", username: "sergio.bandeira", passwordToHash: "1122", role: "CONSULTANT" as const },
      { id: "mayco.muniz", name: "Mayco Muniz", username: "mayco.muniz", passwordToHash: "1133", role: "CONSULTANT" as const },
      { id: "fernando.basil", name: "Fernando Basil", username: "fernando.basil", passwordToHash: "1144", role: "CONSULTANT" as const },
      { id: "paulo.marcio", name: "Paulo Marcio", username: "paulo.marcio", passwordToHash: "1155", role: "CONSULTANT" as const },
      { id: "mauricio.simoes", name: "Mauricio Simões", username: "mauricio.simoes", passwordToHash: "1166", role: "CONSULTANT" as const },
    ];

    console.log(`\n📋 Criando ${usersToCreate.length} usuários...`);

    for (const userData of usersToCreate) {
      const hashedPassword = await bcrypt.hash(userData.passwordToHash, 10);

      await db.insert(schema.users).values({
        id: userData.id,
        name: userData.name,
        username: userData.username,
        email: `${userData.username}@juparana.com.br`,
        hashedPassword: hashedPassword,
        role: userData.role,
      });

      console.log(`✅ Usuário '${userData.name}' criado com sucesso.`);
    }

    console.log("\n🎉 População do banco de dados concluída com sucesso!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Erro ao popular o banco de dados:", error);
    process.exit(1);
  }
}

seed();
