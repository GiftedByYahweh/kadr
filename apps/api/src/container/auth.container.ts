import type { AppConfig } from '@config';
import {
  AuthenticateSessionUseCase,
  AuthGuard,
  authRoutes,
  CreateUserUseCase,
  GetCurrentUserUseCase,
  LoginUseCase,
  LogoutUseCase,
  SetUserPasswordUseCase,
} from '@modules/auth/index.ts';
import type { InfrastructureContainer } from './infrastructure.container.ts';
import type { Repositories } from './repositories.container.ts';

export function initAuthContainer(
  config: AppConfig,
  infrastructure: InfrastructureContainer,
  repositories: Repositories,
) {
  const login = new LoginUseCase(
    repositories.user,
    repositories.session,
    infrastructure.passwordHasher,
    infrastructure.tokenService,
  );
  const logout = new LogoutUseCase(repositories.session);
  const authenticateSession = new AuthenticateSessionUseCase(
    repositories.session,
    infrastructure.tokenService,
  );
  const getCurrentUser = new GetCurrentUserUseCase(repositories.user);
  const createUser = new CreateUserUseCase(
    repositories.user,
    infrastructure.passwordHasher,
  );
  const setUserPassword = new SetUserPasswordUseCase(
    repositories.user,
    repositories.session,
    infrastructure.passwordHasher,
    infrastructure.uow,
  );

  const guard = new AuthGuard(authenticateSession, config.isProduction);
  const routes = authRoutes({
    login,
    logout,
    getCurrentUser,
    authGuard: guard,
    secureCookies: config.isProduction,
  });

  return { guard, routes, createUser, setUserPassword };
}

export type AuthContainer = ReturnType<typeof initAuthContainer>;
