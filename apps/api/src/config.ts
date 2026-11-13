import { requireEnv } from '@kadr/shared';

export const loadAppConfig = () => {
  const env = process.env;

  return {
    port: Number(requireEnv(env, 'PORT')),
    host: requireEnv(env, 'HOST'),
    isProduction: env['NODE_ENV'] === 'production',
    db: {
      url: requireEnv(env, 'DATABASE_URL'),
    },
    auth: {
      passwordPepper: requireEnv(env, 'PASSWORD_PEPPER'),
    },
  };
};

export type AppConfig = ReturnType<typeof loadAppConfig>;
