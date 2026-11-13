import type { DbProvider } from './db.provider.ts';

export class UnitOfWork {
  constructor(private readonly dbProvider: DbProvider) {}

  run<T>(fn: () => Promise<T>): Promise<T> {
    return this.dbProvider.transaction(fn);
  }
}
