import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'drizzle-kit';

const ENV_FILE_PATH = fileURLToPath(new URL('../../.env', import.meta.url));

if (existsSync(ENV_FILE_PATH)) process.loadEnvFile(ENV_FILE_PATH);

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/modules/*/tables/*.table.ts',
  out: './src/db/migrations',
  breakpoints: false,
  dbCredentials: {
    url: process.env['DATABASE_URL']!,
  },
});
