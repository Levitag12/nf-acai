import { db } from './db.js';
import { users, documents, attachments } from '../shared/schema.js';
import bcrypt from 'bcrypt';

export async function runSeed() {
  console.log("🌱 Iniciando a população do banco de dados...");

  console.log("🗑️  Limpando tabelas...");
  await db.delete(attachments);
  await db.delete(documents);
  await db.delete(users);
  console.log("✅ Tabelas limpas.");

  const usersToCreate = [
    { id: "admin", name: "Admin User", username: "admin", passwordToHash: "g147g147g147", role: "ADMIN" as const },
    { id: "admin2", name: "Admin User 2", username: "admin2", passwordToHash: "258", role: "ADMIN" as const },
    { id: "sergio.bandeira", name: "Sergio Bandeira", username: "sergio.bandeira", passwordToHash: "1122", role: "CONSULTANT" as const },
    { id: "mayco.muniz", name: "Mayco Muniz", username: "mayco.muniz", passwordToHash: "1133", role: "CONSULTANT" as const },
    { id: "fernando.basil", name: "Fernando Basil", username: "fernando.basil", passwordToHash: "1144", role: "CONSULTANT" as const },
    { id: "paulo.marcio", name: "Paulo Marcio", username: "paulo.marcio", passwordToHash: "1155", role: "CONSULTANT" as const },
    { id: "mauricio.simoes", name: "Mauricio Simões", username: "mauricio.simoes", passwordToHash: "1166", role: "CONSULTANT" as const },
  ];

  for (const user of usersToCreate) {
    const hashedPassword = await bcrypt.hash(user.passwordToHash, 10);

    await db.insert(users).values({
      id: user.id,
      name: user.name,
      username: user.username,
      email: `${user.username}@juparana.com.br`,
      hashedPassword,
      role: user.role,
    });

    console.log(`✅ Usuário '${user.name}' inserido.`);
  }

  return { success: true, message: "Banco populado com sucesso!" };
}
