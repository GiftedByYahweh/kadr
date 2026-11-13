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
    storage: {
      endpoint: requireEnv(env, 'STORAGE_ENDPOINT'),
      region: requireEnv(env, 'STORAGE_REGION'),
      bucket: requireEnv(env, 'STORAGE_BUCKET'),
      accessKeyId: requireEnv(env, 'STORAGE_ACCESS_KEY_ID'),
      secretAccessKey: requireEnv(env, 'STORAGE_SECRET_ACCESS_KEY'),
      forcePathStyle: env['STORAGE_FORCE_PATH_STYLE'] === 'true',
    },
  };
};

export type AppConfig = ReturnType<typeof loadAppConfig>;
