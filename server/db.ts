import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Adiciona o parâmetro de SSL obrigatório à URL de conexão
const connectionString = `${dbUrl}?sslmode=require`;

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
