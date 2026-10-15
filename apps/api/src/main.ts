import { buildApp } from './app.ts';
import { loadConfig } from './config.ts';
import { createDb } from './db/client.ts';

const config = loadConfig();
const db = createDb(config.databaseUrl);
const app = buildApp(db);

db.$client.on('error', (err) => app.log.error(err, 'pg pool error'));

try {
  await app.listen({ host: config.host, port: config.port });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
