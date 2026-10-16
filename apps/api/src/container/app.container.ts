import type { AppConfig } from '../config.ts';
import type { Logger } from '../logger/index.ts';
import { initInfrastructure } from './infrastructure.container.ts';

export const appContainer = (config: AppConfig, logger: Logger) => {
  const infrastructure = initInfrastructure(config, logger);

  return {
    infrastructure,
  };
};

export type AppContainer = ReturnType<typeof appContainer>;
