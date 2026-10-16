import { defineConfig } from 'drizzle-kit';

process.loadEnvFile();

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/modules/*/tables/*.table.ts',
  out: './src/db/migrations',
  breakpoints: false,
  dbCredentials: {
    url: process.env['DATABASE_URL']!,
  },
});
