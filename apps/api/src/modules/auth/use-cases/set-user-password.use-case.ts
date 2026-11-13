import { HttpStatusCode } from '@kadr/shared';
import { AppError } from '@common/error/app.error.ts';
import type { PasswordHasher } from '@common/hashing/password-hasher.ts';
import type { UnitOfWork } from '@db/unit-of-work.ts';
import type { UseCase } from '@common/use-case/use-case.ts';
import type { SessionRepository } from '../repositories/session.repository.ts';
import type { UserRepository } from '../repositories/user.repository.ts';

export interface SetUserPasswordInput {
  email: string;
  password: string;
}

export class SetUserPasswordUseCase implements UseCase<
  SetUserPasswordInput,
  void
> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly uow: UnitOfWork,
  ) {}

  async execute(input: SetUserPasswordInput): Promise<void> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) throw new AppError(HttpStatusCode.NOT_FOUND, 'User not found');

    const passwordHash = await this.passwordHasher.hash(input.password);
    await this.uow.run(async () => {
      await this.userRepository.updatePasswordHash(user.id, passwordHash);
      await this.sessionRepository.deleteByUserId(user.id);
    });
  }
}
