import { ADMIN_API_PREFIX } from '@kadr/shared';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { SESSION_COOKIE_NAME } from '../auth.constants.ts';

export function readSessionCookie(request: FastifyRequest): string | undefined {
  return request.cookies[SESSION_COOKIE_NAME];
}

export function setSessionCookie(
  reply: FastifyReply,
  token: string,
  expiresAt: Date,
  secure: boolean,
): void {
  reply.setCookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: ADMIN_API_PREFIX,
    expires: expiresAt,
  });
}

export function clearSessionCookie(reply: FastifyReply): void {
  reply.clearCookie(SESSION_COOKIE_NAME, { path: ADMIN_API_PREFIX });
}
