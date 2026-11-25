import type { AppConfig } from '@config';
import type { Logger } from '@logger/index.ts';
import { initAuthContainer } from './auth.container.ts';
import { initInfrastructure } from './infrastructure.container.ts';
import { initRepositories } from './repositories.container.ts';
import { initGalleryContainer } from './gallery.container.ts';


export const appContainer = (config: AppConfig, logger: Logger) => {
  const infrastructure = initInfrastructure(config, logger);
  const repositories = initRepositories(infrastructure.dbProvider);
  const auth = initAuthContainer(config, infrastructure, repositories);
  const gallery = initGalleryContainer(
    config,
    repositories,
    infrastructure,
    auth.guard,
  );

  const routes = [auth.routes, gallery.routes];

  return {
    infrastructure,
    auth,
    gallery,
    routes,
  };
};

export type AppContainer = ReturnType<typeof appContainer>;
