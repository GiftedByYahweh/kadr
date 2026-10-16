const required = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env variable: ${name}`);
  return value;
};

export const loadConfig = () => ({
  host: process.env['HOST'] ?? '127.0.0.1',
  port: Number(process.env['PORT'] ?? 4000),
  databaseUrl: required('DATABASE_URL'),
});

export type Config = ReturnType<typeof loadConfig>;
