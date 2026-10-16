import { AsyncLocalStorage } from 'node:async_hooks';
import type { DbExecutor } from './db.provider.ts';

export interface TxContext {
  run<T>(executor: DbExecutor, fn: () => Promise<T>): Promise<T>;
  get(): DbExecutor | undefined;
}

export const asyncTxContext = (): TxContext => {
  const storage = new AsyncLocalStorage<DbExecutor>();
  return {
    run: (executor, fn) => storage.run(executor, fn),
    get: () => storage.getStore(),
  };
};
