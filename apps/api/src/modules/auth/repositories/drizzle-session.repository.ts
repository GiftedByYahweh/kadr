import { eq } from 'drizzle-orm';
import type { DbProvider } from '@db/db.provider.ts';
import { firstRowOrThrow } from '@db/helpers.ts';
import type { Session } from '../entities/session.entity.ts';
import { sessionMapper } from '../mappers/session.mapper.ts';
import { sessionsTable } from '../tables/sessions.table.ts';
import type {
  CreateSessionData,
  SessionRepository,
} from './session.repository.ts';

export class DrizzleSessionRepository implements SessionRepository {
  constructor(private readonly db: DbProvider) {}

  async findByTokenHash(tokenHash: string): Promise<Session | null> {
    const rows = await this.db
      .current()
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.tokenHash, tokenHash));
    const row = rows[0];
    if (!row) return null;
    return sessionMapper.toEntity(row);
  }

  async create(data: CreateSessionData): Promise<Session> {
    const rows = await this.db
      .current()
      .insert(sessionsTable)
      .values(data)
      .returning();
    return sessionMapper.toEntity(firstRowOrThrow(rows));
  }

  async updateExpiresAt(id: string, expiresAt: Date): Promise<void> {
    await this.db
      .current()
      .update(sessionsTable)
      .set({ expiresAt })
      .where(eq(sessionsTable.id, id));
  }

  async deleteById(id: string): Promise<void> {
    await this.db
      .current()
      .delete(sessionsTable)
      .where(eq(sessionsTable.id, id));
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    await this.db
      .current()
      .delete(sessionsTable)
      .where(eq(sessionsTable.tokenHash, tokenHash));
  }
}
