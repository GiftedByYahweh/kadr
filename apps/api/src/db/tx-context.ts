import { AsyncLocalStorage } from 'node:async_hooks';
import type { DbExecutor } from './db.provider.ts';

export interface TxContext {
  run<T>(executor: DbExecutor, fn: () => Promise<T>): Promise<T>;
  get(): DbExecutor | undefined;
}

export class AsyncTxContext implements TxContext {
  private readonly storage = new AsyncLocalStorage<DbExecutor>();

  run<T>(executor: DbExecutor, fn: () => Promise<T>): Promise<T> {
    return this.storage.run(executor, fn);
  }

  get(): DbExecutor | undefined {
    return this.storage.getStore();
  }
}
