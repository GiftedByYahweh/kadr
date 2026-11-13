import type { DbProvider } from '@db/db.provider.ts';
import {
  DrizzleSessionRepository,
  DrizzleUserRepository,
  type SessionRepository,
  type UserRepository,
} from '@modules/auth/index.ts';

export interface Repositories {
  user: UserRepository;
  session: SessionRepository;
}

export function initRepositories(dbProvider: DbProvider): Repositories {
  const user = new DrizzleUserRepository(dbProvider);
  const session = new DrizzleSessionRepository(dbProvider);

  return { user, session };
}
