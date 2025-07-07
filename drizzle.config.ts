import type { Config } from "drizzle-kit";

export default {
  schema: "./server/src/db/schema.ts",
  out: "./server/src/db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;