import { HttpStatusCode, SystemApiRoutes } from '@kadr/shared';
import fastify, { type FastifyInstance } from 'fastify';
import { AppError } from './common/error/app.error.ts';
import {
  HTTP_STATUS_BY_APP_ERROR,
  HTTP_STATUS_MESSAGES,
} from './common/error/http-status.map.ts';
import { errorResponse, successResponse } from './common/utils/api-response.ts';
import type { AppConfig } from './config.ts';
import type { AppContainer } from './container/index.ts';
import type { Logger } from './logger/index.ts';

interface BuildServerOptions {
  container: AppContainer;
  config: AppConfig;
  logger: Logger;
}

function registerErrorHandlers(server: FastifyInstance, logger: Logger) {
  server.setNotFoundHandler((_request, reply) => {
    reply.status(HttpStatusCode.NOT_FOUND).send(
      errorResponse({
        code: HttpStatusCode.NOT_FOUND,
        message: HTTP_STATUS_MESSAGES[HttpStatusCode.NOT_FOUND],
      }),
    );
  });

  server.setSchemaErrorFormatter((errors) => {
    const error = errors[0];
    const fieldName = error?.instancePath.substring(1) ?? '';
    const message = error?.message ?? '';

    return new AppError(
      HttpStatusCode.BAD_REQUEST,
      message
        ? `Field '${fieldName}' is invalid: ${message}`
        : `Field '${fieldName}' is invalid`,
    );
  });

  server.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      reply
        .status(HTTP_STATUS_BY_APP_ERROR[error.code])
        .send(errorResponse({ code: error.code, message: error.message }));
      return;
    }

    logger.error(
      'API',
      `Unknown error at ${request.method} ${request.url}`,
      error,
    );
    reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(
      errorResponse({
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: HTTP_STATUS_MESSAGES[HttpStatusCode.INTERNAL_SERVER_ERROR],
      }),
    );
  });
}

function registerResponseHooks(server: FastifyInstance) {
  server.addHook('preSerialization', (_request, reply, payload, done) => {
    if (reply.statusCode >= HttpStatusCode.BAD_REQUEST) {
      done(null, payload);
      return;
    }

    done(null, successResponse(payload));
  });
}

function registerLifecycleHooks(
  server: FastifyInstance,
  container: AppContainer,
) {
  server.addHook('onClose', async () => {
    await container.infrastructure.dbProvider.close();
  });
}

function registerRoutes(server: FastifyInstance, container: AppContainer) {
  server.get(SystemApiRoutes.health, async () => {
    await container.infrastructure.dbProvider.ping();
    return { uptime: process.uptime() };
  });
}

export const buildServer = async (
  options: BuildServerOptions,
): Promise<FastifyInstance> => {
  const { container, logger } = options;
  const server = fastify({ trustProxy: true });

  registerResponseHooks(server);
  registerLifecycleHooks(server, container);
  registerErrorHandlers(server, logger);
  registerRoutes(server, container);

  await server.ready();
  return server;
};
