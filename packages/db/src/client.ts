import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from '@repo/env/web';
import * as schema from './schema.js';

declare global {
  var db: ReturnType<typeof drizzle> | undefined;
}

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const client = {
  get db() {
    if (globalThis.db) {
      return globalThis.db;
    }

    const db = drizzle({ client: pool, schema });
    
    console.log('Connected to database');
    globalThis.db = db;
    return db;
  },
};