import type { Session } from '../entities/session.entity.ts';

export interface CreateSessionData {
  userId: string;
  tokenHash: string;
  userAgent: string | null;
  ipAddress: string | null;
  expiresAt: Date;
}

export interface SessionRepository {
  findByTokenHash(tokenHash: string): Promise<Session | null>;
  create(data: CreateSessionData): Promise<Session>;
  updateExpiresAt(id: string, expiresAt: Date): Promise<void>;
  deleteById(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}
