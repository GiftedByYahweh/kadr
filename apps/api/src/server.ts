import { HttpStatusCode, SystemApiRoutes } from '@kadr/shared';
import fastifyCookie from '@fastify/cookie';
import fastifyRateLimit from '@fastify/rate-limit';
import fastify, { type FastifyInstance } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { AppError } from '@common/error/app.error.ts';
import {
  HTTP_STATUS_BY_APP_ERROR,
  HTTP_STATUS_MESSAGES,
} from '@common/error/http-status.map.ts';
import { errorResponse, successResponse } from '@common/utils/api-response.ts';
import type { AppConfig } from './config.ts';
import type { AppContainer } from '@container/index.ts';
import type { Logger } from '@logger/index.ts';
import { authRoutes, AuthGuard } from '@modules/auth/index.ts';

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

async function registerPlugins(server: FastifyInstance) {
  await server.register(fastifyCookie);
  await server.register(fastifyRateLimit, {
    global: false,
    errorResponseBuilder: () => new AppError(HttpStatusCode.TOO_MANY_REQUESTS),
  });
}

async function registerRoutes(
  server: FastifyInstance,
  container: AppContainer,
  config: AppConfig,
) {
  server.get(SystemApiRoutes.health, async () => {
    await container.infrastructure.dbProvider.ping();
    return { uptime: process.uptime() };
  });

  const authUseCases = container.useCases.auth;
  const authGuard = new AuthGuard(
    authUseCases.authenticateSession,
    config.isProduction,
  );
  const auth = authRoutes({
    login: authUseCases.login,
    logout: authUseCases.logout,
    getCurrentUser: authUseCases.getCurrentUser,
    authGuard,
    secureCookies: config.isProduction,
  });
  await server.register(auth);
}

export const buildServer = async (
  options: BuildServerOptions,
): Promise<FastifyInstance> => {
  const { container, config, logger } = options;
  const server = fastify({ trustProxy: true });
  server.decorateRequest('auth', null);
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  registerResponseHooks(server);
  registerLifecycleHooks(server, container);
  registerErrorHandlers(server, logger);
  await registerPlugins(server);
  await registerRoutes(server, container, config);

  await server.ready();
  return server;
};
