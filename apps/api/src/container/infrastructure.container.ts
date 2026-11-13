import { Argon2PasswordHasher } from '@common/hashing/argon2-password-hasher.ts';
import type { PasswordHasher } from '@common/hashing/password-hasher.ts';
import { CryptoTokenService } from '@common/tokens/crypto-token-service.ts';
import type { TokenService } from '@common/tokens/token-service.ts';
import type { AppConfig } from '@config';
import { DbProvider } from '@db/db.provider.ts';
import { AsyncTxContext } from '@db/tx-context.ts';
import { UnitOfWork } from '@db/unit-of-work.ts';
import type { Logger } from '@logger/index.ts';

export interface InfrastructureContainer {
  dbProvider: DbProvider;
  uow: UnitOfWork;
  passwordHasher: PasswordHasher;
  tokenService: TokenService;
}

export function initInfrastructure(
  config: AppConfig,
  logger: Logger,
): InfrastructureContainer {
  const txContext = new AsyncTxContext();
  const dbProvider = new DbProvider(config.db.url, txContext, logger);
  const uow = new UnitOfWork(dbProvider);
  const passwordHasher = new Argon2PasswordHasher(config.auth.passwordPepper);
  const tokenService = new CryptoTokenService();

  return { dbProvider, uow, passwordHasher, tokenService };
}
