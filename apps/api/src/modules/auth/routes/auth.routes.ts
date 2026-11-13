import { AdminApiRoutes, type CurrentUserDto } from '@kadr/shared';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { LOGIN_RATE_LIMIT } from '../auth.constants.ts';
import { AuthGuard } from '../guards/auth.guard.ts';
import type { GetCurrentUserUseCase } from '../use-cases/get-current-user.use-case.ts';
import type { LoginUseCase } from '../use-cases/login.use-case.ts';
import type { LogoutUseCase } from '../use-cases/logout.use-case.ts';
import { loginRouteSchema } from './auth.schema.ts';
import { clearSessionCookie, setSessionCookie } from './session-cookie.ts';

export interface AuthRoutesOptions {
  login: LoginUseCase;
  logout: LogoutUseCase;
  getCurrentUser: GetCurrentUserUseCase;
  authGuard: AuthGuard;
  secureCookies: boolean;
}

export function authRoutes(
  options: AuthRoutesOptions,
): FastifyPluginCallbackZod {
  const { login, logout, getCurrentUser, authGuard, secureCookies } = options;
  const guard = authGuard.handle.bind(authGuard);

  return (server, _pluginOptions, done) => {
    server.post(
      AdminApiRoutes.auth.login,
      {
        schema: loginRouteSchema,
        config: { rateLimit: LOGIN_RATE_LIMIT },
      },
      async (request, reply): Promise<CurrentUserDto> => {
        const result = await login.execute({
          email: request.body.email,
          password: request.body.password,
          userAgent: request.headers['user-agent'] ?? null,
          ipAddress: request.ip,
        });

        setSessionCookie(reply, result.token, result.expiresAt, secureCookies);
        return result.user;
      },
    );

    server.get(
      AdminApiRoutes.auth.me,
      { onRequest: guard },
      async (request): Promise<CurrentUserDto | null> => {
        const auth = AuthGuard.getAuth(request);
        return getCurrentUser.execute({ userId: auth.userId });
      },
    );

    server.post(
      AdminApiRoutes.auth.logout,
      { onRequest: guard },
      async (request, reply) => {
        const auth = AuthGuard.getAuth(request);
        await logout.execute({ sessionId: auth.sessionId });

        clearSessionCookie(reply);
        return null;
      },
    );

    done();
  };
}
