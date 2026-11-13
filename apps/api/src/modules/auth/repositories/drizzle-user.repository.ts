import { eq } from 'drizzle-orm';
import type { DbProvider } from '@db/db.provider.ts';
import { firstRowOrThrow } from '@db/helpers.ts';
import type { User } from '../entities/user.entity.ts';
import { userMapper } from '../mappers/user.mapper.ts';
import { usersTable } from '../tables/users.table.ts';
import type { CreateUserData, UserRepository } from './user.repository.ts';

export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly db: DbProvider) {}

  async findById(id: string): Promise<User | null> {
    const rows = await this.db
      .current()
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    const row = rows[0];
    if (!row) return null;
    return userMapper.toEntity(row);
  }

  async findByEmail(email: string): Promise<User | null> {
    const rows = await this.db
      .current()
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    const row = rows[0];
    if (!row) return null;
    return userMapper.toEntity(row);
  }

  async create(data: CreateUserData): Promise<User> {
    const rows = await this.db
      .current()
      .insert(usersTable)
      .values(data)
      .returning();
    return userMapper.toEntity(firstRowOrThrow(rows));
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    await this.db
      .current()
      .update(usersTable)
      .set({ passwordHash })
      .where(eq(usersTable.id, id));
  }
}
