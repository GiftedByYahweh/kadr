import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { API_PREFIX, requireEnv } from '@kadr/shared';

const ROOT_DIR = fileURLToPath(new URL('../..', import.meta.url));

const devServer = (mode: string) => {
  const env = loadEnv(mode, ROOT_DIR, '');
  return {
    port: Number(requireEnv(env, 'GALLERY_DEV_PORT')),
    strictPort: true,
    proxy: { [API_PREFIX]: requireEnv(env, 'API_PROXY_TARGET') },
  };
};

export default defineConfig(({ command, mode }) => {
  const config = {
    plugins: [vue()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
  };
  if (command === 'serve') return { ...config, server: devServer(mode) };
  return config;
});
