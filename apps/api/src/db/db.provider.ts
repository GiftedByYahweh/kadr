import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import type { Logger } from '@logger/index.ts';
import type { TxContext } from './tx-context.ts';

type DbClient = ReturnType<typeof drizzle>;
export type DbExecutor =
  DbClient | Parameters<Parameters<DbClient['transaction']>[0]>[0];

export class DbProvider {
  private pool: Pool;
  private db: DbClient;

  constructor(
    url: string,
    private txContext: TxContext,
    logger: Logger,
  ) {
    this.pool = new Pool({ connectionString: url });
    this.pool.on('error', (err) => {
      logger.error('DB', 'Postgres pool error', err);
    });
    this.db = drizzle(this.pool);
  }

  current(): DbExecutor {
    return this.txContext.get() ?? this.db;
  }

  transaction<T>(fn: () => Promise<T>): Promise<T> {
    if (this.txContext.get()) return fn();
    return this.db.transaction((tx) => this.txContext.run(tx, fn));
  }

  async ping(): Promise<void> {
    await this.db.execute(sql`select 1`);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
