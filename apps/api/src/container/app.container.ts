import type { AppConfig } from '@config';
import type { Logger } from '@logger/index.ts';
import { initAuthContainer } from './auth.container.ts';
import { initInfrastructure } from './infrastructure.container.ts';
import { initRepositories } from './repositories.container.ts';

export const appContainer = (config: AppConfig, logger: Logger) => {
  const infrastructure = initInfrastructure(config, logger);
  const repositories = initRepositories(infrastructure.dbProvider);
  const auth = initAuthContainer(config, infrastructure, repositories);
  const routes = [auth.routes];

  return {
    infrastructure,
    auth,
    routes,
  };
};

export type AppContainer = ReturnType<typeof appContainer>;
