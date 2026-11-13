import type { RequestAuth } from '@modules/auth/index.ts';

declare module 'fastify' {
  interface FastifyRequest {
    auth: RequestAuth | null;
  }
}
