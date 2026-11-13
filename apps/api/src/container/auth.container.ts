import { LoginUseCase, LogoutUseCase } from '@modules/auth/index.ts';
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

  const logout = new LogoutUseCase(
    repositories.session,
    infrastructure.tokenService,
  );

  return { login, logout };
}

export type AuthUseCases = ReturnType<typeof initAuthUseCases>;
