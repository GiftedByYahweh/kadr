import type { AppConfig } from '@config';
import type { Logger } from '@logger/index.ts';
import { initAuthUseCases } from './auth.container.ts';
import { initInfrastructure } from './infrastructure.container.ts';
import { initRepositories } from './repositories.container.ts';

export const appContainer = (config: AppConfig, logger: Logger) => {
  const infrastructure = initInfrastructure(config, logger);
  const repositories = initRepositories(infrastructure.dbProvider);
  const authUseCases = initAuthUseCases(infrastructure, repositories);

  return {
    infrastructure,
    repositories,
    useCases: {
      auth: authUseCases,
    },
  };
};

export type AppContainer = ReturnType<typeof appContainer>;
