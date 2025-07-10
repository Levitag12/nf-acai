import { db } from './db.js';
import * as schema from '../shared/schema.js'; // <-- CORREÇÃO AQUI
import bcrypt from 'bcrypt';

export async function runSeed() {
  console.log("🌱 Iniciando a população do banco de dados a partir do endpoint...");

  console.log("🗑️  Limpando tabelas existentes...");
  await db.delete(schema.attachments);
  await db.delete(schema.documents);
  await db.delete(schema.users);
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

  return { success: true, message: "Banco de dados populado com sucesso!" };
}