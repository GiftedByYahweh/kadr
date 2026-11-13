import {
  SESSION_RENEW_THRESHOLD_MS,
  SESSION_TTL_MS,
} from './auth.constants.ts';

export const authService = {
  sessionExpiresAt(now: Date): Date {
    return new Date(now.getTime() + SESSION_TTL_MS);
  },

  isSessionExpired(expiresAt: Date, now: Date): boolean {
    return expiresAt.getTime() <= now.getTime();
  },

  shouldRenewSession(expiresAt: Date, now: Date): boolean {
    const remainingMs = expiresAt.getTime() - now.getTime();
    return remainingMs < SESSION_RENEW_THRESHOLD_MS;
  },
};
