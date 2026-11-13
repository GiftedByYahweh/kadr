import { HttpStatusCode } from '@kadr/shared';
import { AppError } from '@common/error/app.error.ts';
import type { TokenService } from '@common/tokens/token-service.ts';
import type { UseCase } from '@common/use-case/use-case.ts';
import { authService } from '../auth.service.ts';
import type { Session } from '../entities/session.entity.ts';
import type { SessionRepository } from '../repositories/session.repository.ts';

export interface AuthenticateSessionInput {
  token: string | undefined;
}

export interface AuthenticateSessionOutput {
  userId: string;
  sessionId: string;
  renewedExpiresAt: Date | null;
}

export class AuthenticateSessionUseCase implements UseCase<
  AuthenticateSessionInput,
  AuthenticateSessionOutput
> {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    input: AuthenticateSessionInput,
  ): Promise<AuthenticateSessionOutput> {
    if (!input.token) throw new AppError(HttpStatusCode.UNAUTHORIZED);

    const tokenHash = this.tokenService.hash(input.token);
    const session = await this.sessionRepository.findByTokenHash(tokenHash);
    if (!session) throw new AppError(HttpStatusCode.UNAUTHORIZED);

    const now = new Date();
    const isExpired = authService.isSessionExpired(session.expiresAt, now);
    if (isExpired) {
      await this.sessionRepository.deleteById(session.id);
      throw new AppError(HttpStatusCode.UNAUTHORIZED);
    }

    const renewedExpiresAt = await this.renewIfNeeded(session, now);
    return { userId: session.userId, sessionId: session.id, renewedExpiresAt };
  }

  private async renewIfNeeded(
    session: Session,
    now: Date,
  ): Promise<Date | null> {
    const shouldRenew = authService.shouldRenewSession(session.expiresAt, now);
    if (!shouldRenew) return null;
    const expiresAt = authService.sessionExpiresAt(now);
    await this.sessionRepository.updateExpiresAt(session.id, expiresAt);
    return expiresAt;
  }
}
