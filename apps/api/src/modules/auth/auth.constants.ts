const SESSION_TTL_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const SESSION_TTL_MS = SESSION_TTL_DAYS * MS_PER_DAY;
export const SESSION_COOKIE_NAME = 'kadr_session';

export const LOGIN_RATE_LIMIT = {
  max: 15,
  timeWindow: '1 minute',
} as const;
