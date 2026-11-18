import { loadAppConfig } from '@config';
import { DbProvider } from '@db/db.provider.ts';
import { AsyncTxContext } from '@db/tx-context.ts';
import { ConsoleLogger } from '@logger/index.ts';

const MIGRATE_TAG = 'Migrate';

const logger = new ConsoleLogger();
const config = loadAppConfig();
const txContext = new AsyncTxContext();
const dbProvider = new DbProvider(config.db.url, txContext, logger);

try {
  await dbProvider.migrate();
  logger.info(MIGRATE_TAG, 'Migrations applied');
} catch (error) {
  logger.error(MIGRATE_TAG, 'Migrations failed', error);
  process.exitCode = 1;
} finally {
  await dbProvider.close();
}
