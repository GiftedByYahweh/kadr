import { HttpStatusCode, type CurrentUserDto } from '@kadr/shared';
import { AppError } from '@common/error/app.error.ts';
import type { PasswordHasher } from '@common/hashing/password-hasher.ts';
import type { UseCase } from '@common/use-case/use-case.ts';
import { userMapper } from '../mappers/user.mapper.ts';
import type { UserRepository } from '../repositories/user.repository.ts';

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
}

export class CreateUserUseCase implements UseCase<
  CreateUserInput,
  CurrentUserDto
> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: CreateUserInput): Promise<CurrentUserDto> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError(HttpStatusCode.CONFLICT, 'Email is already taken');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = await this.userRepository.create({
      username: input.username,
      email: input.email,
      passwordHash,
    });
    return userMapper.toCurrentUserDto(user);
  }
}
