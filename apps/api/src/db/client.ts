import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const createDb = (url: string) => {
  const pool = new Pool({ connectionString: url });
  return drizzle(pool);
};

export type Db = ReturnType<typeof createDb>;
