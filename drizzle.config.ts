import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: './packages/db/.env' });


export default defineConfig({
  out: './packages/db/drizzle',
  schema: './packages/db/src/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});``