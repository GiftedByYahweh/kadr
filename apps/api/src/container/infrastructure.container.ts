import type { AppConfig } from '../config.ts';
import { DbProvider } from '../db/db.provider.ts';
import { asyncTxContext } from '../db/tx-context.ts';
import { unitOfWork, type UnitOfWork } from '../db/unit-of-work.ts';
import type { Logger } from '../logger/index.ts';

interface InitInfrastructureOutput {
  dbProvider: DbProvider;
  uow: UnitOfWork;
}

export function initInfrastructure(
  config: AppConfig,
  logger: Logger,
): InitInfrastructureOutput {
  const dbProvider = new DbProvider(config.db.url, asyncTxContext(), logger);

  return {
    dbProvider,
    uow: unitOfWork(dbProvider),
  };
}
