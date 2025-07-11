import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../shared/schema.js"; // <- mantém .js se estiver buildando com tsc

// Validação de variável de ambiente
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("❌ DATABASE_URL não está definida no ambiente.");
}

// Conexão com o banco de dados
export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false // Necessário no Render/Heroku
  }
});

// Drizzle ORM com tipagem de schema
export const db = drizzle(pool, { schema });
