import type { AppConfig } from '../config.ts';
import { DbProvider } from '../db/db.provider.ts';
import { AsyncTxContext } from '../db/tx-context.ts';
import { UnitOfWork } from '../db/unit-of-work.ts';
import type { Logger } from '../logger/index.ts';

interface InitInfrastructureOutput {
  dbProvider: DbProvider;
  uow: UnitOfWork;
}

export function initInfrastructure(
  config: AppConfig,
  logger: Logger,
): InitInfrastructureOutput {
  const txContext = new AsyncTxContext();
  const dbProvider = new DbProvider(config.db.url, txContext, logger);
  const uow = new UnitOfWork(dbProvider);

  return { dbProvider, uow };
}
