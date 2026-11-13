import { HttpStatusCode } from '@kadr/shared';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '@common/error/app.error.ts';
import {
  clearSessionCookie,
  readSessionCookie,
  setSessionCookie,
} from '../routes/session-cookie.ts';
import type { AuthenticateSessionUseCase } from '../use-cases/authenticate-session.use-case.ts';

export interface RequestAuth {
  userId: string;
  sessionId: string;
}

export class AuthGuard {
  constructor(
    private readonly authenticateSession: AuthenticateSessionUseCase,
    private readonly secureCookies: boolean,
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const token = readSessionCookie(request);

    try {
      const result = await this.authenticateSession.execute({ token });
      request.auth = { userId: result.userId, sessionId: result.sessionId };

      if (token && result.renewedExpiresAt) {
        setSessionCookie(
          reply,
          token,
          result.renewedExpiresAt,
          this.secureCookies,
        );
      }
    } catch (error) {
      clearSessionCookie(reply);
      throw error;
    }
  }

  static getAuth(request: FastifyRequest): RequestAuth {
    if (!request.auth) throw new AppError(HttpStatusCode.UNAUTHORIZED);
    return request.auth;
  }
}
