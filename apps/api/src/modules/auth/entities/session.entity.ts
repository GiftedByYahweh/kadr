export interface Session {
  id: string;
  userId: string;
  tokenHash: string;
  userAgent: string | null;
  ipAddress: string | null;
  expiresAt: Date;
  createdAt: Date;
}
