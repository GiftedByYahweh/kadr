import fastify from 'fastify';
import { sql } from 'drizzle-orm';
import type { Db } from './db/client.ts';

export const buildApp = (db: Db) => {
  const app = fastify({ logger: true });

  app.get('/health', async () => {
    await db.execute(sql`select 1`);
    return { ok: true };
  });

  return app;
};
