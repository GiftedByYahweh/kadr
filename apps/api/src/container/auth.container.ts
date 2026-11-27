import type { AppConfig } from '@config';
import {
  AuthenticateSessionUseCase,
  AuthGuard,
  authRoutes,
  CreateUserUseCase,
  DrizzleSessionRepository,
  DrizzleUserRepository,
  GetCurrentUserUseCase,
  LoginUseCase,
  LogoutUseCase,
  SetUserPasswordUseCase,
} from '@modules/auth/index.ts';
import type { InfrastructureContainer } from './infrastructure.container.ts';

export function initAuthContainer(
  config: AppConfig,
  infrastructure: InfrastructureContainer,
) {
  const userRepository = new DrizzleUserRepository(infrastructure.dbProvider);
  const sessionRepository = new DrizzleSessionRepository(
    infrastructure.dbProvider,
  );

  const login = new LoginUseCase(
    userRepository,
    sessionRepository,
    infrastructure.passwordHasher,
    infrastructure.tokenService,
  );
  const logout = new LogoutUseCase(sessionRepository);
  const authenticateSession = new AuthenticateSessionUseCase(
    sessionRepository,
    infrastructure.tokenService,
  );
  const getCurrentUser = new GetCurrentUserUseCase(userRepository);
  const createUser = new CreateUserUseCase(
    userRepository,
    infrastructure.passwordHasher,
  );
  const setUserPassword = new SetUserPasswordUseCase(
    userRepository,
    sessionRepository,
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
