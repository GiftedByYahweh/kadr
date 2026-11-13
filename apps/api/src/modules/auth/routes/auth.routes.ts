import {
  ADMIN_API_PREFIX,
  AdminApiRoutes,
  type CurrentUserDto,
} from '@kadr/shared';
import type { FastifyRequest } from 'fastify';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { LOGIN_RATE_LIMIT, SESSION_COOKIE_NAME } from '../auth.constants.ts';
import type { LoginUseCase } from '../use-cases/login.use-case.ts';
import type { LogoutUseCase } from '../use-cases/logout.use-case.ts';
import { loginRouteSchema } from './auth.schema.ts';

export interface AuthRoutesOptions {
  useCases: {
    login: LoginUseCase;
    logout: LogoutUseCase;
  };
  secureCookies: boolean;
}

function readSessionToken(request: FastifyRequest): string | null {
  const token = request.cookies[SESSION_COOKIE_NAME];
  if (token === undefined) return null;
  return token;
}

export function authRoutes(
  options: AuthRoutesOptions,
): FastifyPluginCallbackZod {
  const { useCases, secureCookies } = options;

  return (server, _pluginOptions, done) => {
    server.post(
      AdminApiRoutes.auth.login,
      {
        schema: loginRouteSchema,
        config: { rateLimit: LOGIN_RATE_LIMIT },
      },
      async (request, reply): Promise<CurrentUserDto> => {
        const result = await useCases.login.execute({
          email: request.body.email,
          password: request.body.password,
          userAgent: request.headers['user-agent'] ?? null,
          ipAddress: request.ip,
        });

        reply.setCookie(SESSION_COOKIE_NAME, result.token, {
          httpOnly: true,
          sameSite: 'lax',
          secure: secureCookies,
          path: ADMIN_API_PREFIX,
          expires: result.expiresAt,
        });
        return result.user;
      },
    );

    server.post(AdminApiRoutes.auth.logout, async (request, reply) => {
      const token = readSessionToken(request);
      await useCases.logout.execute({ token });

      reply.clearCookie(SESSION_COOKIE_NAME, { path: ADMIN_API_PREFIX });
      return null;
    });

    done();
  };
}
