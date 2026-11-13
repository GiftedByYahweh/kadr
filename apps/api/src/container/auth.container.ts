import {
  AuthenticateSessionUseCase,
  CreateUserUseCase,
  GetCurrentUserUseCase,
  LoginUseCase,
  LogoutUseCase,
  SetUserPasswordUseCase,
} from '@modules/auth/index.ts';
import type { InfrastructureContainer } from './infrastructure.container.ts';
import type { Repositories } from './repositories.container.ts';

export function initAuthUseCases(
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

  return {
    login,
    logout,
    authenticateSession,
    getCurrentUser,
    createUser,
    setUserPassword,
  };
}

export type AuthUseCases = ReturnType<typeof initAuthUseCases>;
