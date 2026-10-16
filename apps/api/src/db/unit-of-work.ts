import type { DbProvider } from './db.provider.ts';

export interface UnitOfWork {
  run<T>(fn: () => Promise<T>): Promise<T>;
}

export const unitOfWork = (dbProvider: DbProvider): UnitOfWork => ({
  run: (fn) => dbProvider.transaction(fn),
});
