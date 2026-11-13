import type { CurrentUserDto } from '@kadr/shared';
import type { User } from '../entities/user.entity.ts';
import type { usersTable } from '../tables/users.table.ts';

type UserRow = typeof usersTable.$inferSelect;

export const userMapper = {
  toEntity(row: UserRow): User {
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      passwordHash: row.passwordHash,
      createdAt: row.createdAt,
    };
  },

  toCurrentUserDto(user: User): CurrentUserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  },
};
