import type { Session } from '../entities/session.entity.ts';
import type { sessionsTable } from '../tables/sessions.table.ts';

type SessionRow = typeof sessionsTable.$inferSelect;

export const sessionMapper = {
  toEntity(row: SessionRow): Session {
    return {
      id: row.id,
      userId: row.userId,
      tokenHash: row.tokenHash,
      userAgent: row.userAgent,
      ipAddress: row.ipAddress,
      expiresAt: row.expiresAt,
      createdAt: row.createdAt,
    };
  },
};
