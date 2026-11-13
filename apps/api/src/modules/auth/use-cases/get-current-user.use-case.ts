import type { CurrentUserDto } from '@kadr/shared';
import type { UseCase } from '@common/use-case/use-case.ts';
import { userMapper } from '../mappers/user.mapper.ts';
import type { UserRepository } from '../repositories/user.repository.ts';

export interface GetCurrentUserInput {
  userId: string;
}

export class GetCurrentUserUseCase implements UseCase<
  GetCurrentUserInput,
  CurrentUserDto | null
> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: GetCurrentUserInput): Promise<CurrentUserDto | null> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) return null;
    return userMapper.toCurrentUserDto(user);
  }
}
