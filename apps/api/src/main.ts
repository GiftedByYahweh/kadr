import type { FastifyInstance } from 'fastify';
import { loadAppConfig } from './config.ts';
import { appContainer } from '@container/index.ts';
import { ConsoleLogger } from '@logger/index.ts';
import { buildServer } from './server.ts';

const SHUTDOWN_SIGNALS = ['SIGINT', 'SIGTERM'] as const;

const config = loadAppConfig();
const logger = new ConsoleLogger();

function registerShutdownHandlers(server: FastifyInstance): void {
  for (const signal of SHUTDOWN_SIGNALS) {
    process.on(signal, () => {
      void (async () => {
        logger.info('Server', `Received ${signal}, shutting down gracefully`);
        try {
          await server.close();
          logger.info('Server', 'Server closed gracefully');
          process.exit(0);
        } catch (err: unknown) {
          logger.error('Server', 'Error during graceful shutdown', err);
          process.exit(1);
        }
      })();
    });
  }
}

async function bootstrap(): Promise<void> {
  const container = appContainer(config, logger);
  const server = await buildServer({ container, logger });
  registerShutdownHandlers(server);

  await server.listen({ port: config.port, host: config.host });
  logger.info(
    'Server',
    `Application running on http://${config.host}:${String(config.port)}`,
  );
}

bootstrap().catch((err: unknown) => {
  logger.error('Server', 'Failed to start server', err);
  process.exit(1);
});
