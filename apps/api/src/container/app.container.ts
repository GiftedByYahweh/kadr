import type { AppConfig } from '@config';
import type { Logger } from '@logger/index.ts';
import { initAuthContainer } from './auth.container.ts';
import { initGalleryContainer } from './gallery.container.ts';
import { initInfrastructure } from './infrastructure.container.ts';

export const appContainer = (config: AppConfig, logger: Logger) => {
  const infrastructure = initInfrastructure(config, logger);
  const auth = initAuthContainer(config, infrastructure);
  const gallery = initGalleryContainer(config, infrastructure, auth.guard);
  const routes = [auth.routes, gallery.routes];

  return {
    infrastructure,
    auth,
    routes,
  };
};

export type AppContainer = ReturnType<typeof appContainer>;
