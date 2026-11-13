import { DomainErrorCode, type CurrentUserDto } from '@kadr/shared';
import { AppError } from '@common/error/app.error.ts';
import type { PasswordHasher } from '@common/hashing/password-hasher.ts';
import type { TokenService } from '@common/tokens/token-service.ts';
import type { UseCase } from '@common/use-case/use-case.ts';
import { SESSION_TTL_MS } from '../auth.constants.ts';
import { userMapper } from '../mappers/user.mapper.ts';
import type { SessionRepository } from '../repositories/session.repository.ts';
import type { UserRepository } from '../repositories/user.repository.ts';

export interface LoginInput {
  email: string;
  password: string;
  userAgent: string | null;
  ipAddress: string | null;
}

export interface LoginOutput {
  token: string;
  expiresAt: Date;
  user: CurrentUserDto;
}

const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';
const DUMMY_PASSWORD = 'dummy-password-for-constant-time-login';

export class LoginUseCase implements UseCase<LoginInput, LoginOutput> {
  private readonly dummyPasswordHash: Promise<string>;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {
    this.dummyPasswordHash = passwordHasher.hash(DUMMY_PASSWORD);
  }

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      const dummyHash = await this.dummyPasswordHash;
      await this.passwordHasher.verify(input.password, dummyHash);
      throw new AppError(
        DomainErrorCode.INVALID_CREDENTIALS,
        INVALID_CREDENTIALS_MESSAGE,
      );
    }

    const isPasswordValid = await this.passwordHasher.verify(
      input.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new AppError(
        DomainErrorCode.INVALID_CREDENTIALS,
        INVALID_CREDENTIALS_MESSAGE,
      );
    }

    const expiresAt = new Date(new Date().getTime() + SESSION_TTL_MS);
    const token = this.tokenService.generate();
    const tokenHash = this.tokenService.hash(token);

    await this.sessionRepository.create({
      userId: user.id,
      tokenHash,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
      expiresAt,
    });

    const currentUser = userMapper.toCurrentUserDto(user);
    return { token, expiresAt, user: currentUser };
  }
}
