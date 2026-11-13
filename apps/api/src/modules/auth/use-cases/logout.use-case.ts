import type { TokenService } from '@common/tokens/token-service.ts';
import type { UseCase } from '@common/use-case/use-case.ts';
import type { SessionRepository } from '../repositories/session.repository.ts';

export interface LogoutInput {
  token: string | null;
}

export class LogoutUseCase implements UseCase<LogoutInput, void> {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: LogoutInput): Promise<void> {
    if (input.token === null) return;
    const tokenHash = this.tokenService.hash(input.token);
    await this.sessionRepository.deleteByTokenHash(tokenHash);
  }
}
