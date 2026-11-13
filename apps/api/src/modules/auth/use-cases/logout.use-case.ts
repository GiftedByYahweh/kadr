import type { UseCase } from '@common/use-case/use-case.ts';
import type { SessionRepository } from '../repositories/session.repository.ts';

export interface LogoutInput {
  sessionId: string;
}

export class LogoutUseCase implements UseCase<LogoutInput, void> {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(input: LogoutInput): Promise<void> {
    await this.sessionRepository.deleteById(input.sessionId);
  }
}
