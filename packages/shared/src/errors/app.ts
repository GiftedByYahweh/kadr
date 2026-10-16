import type { DomainErrorCode } from './domain.ts';
import type { HttpStatusCode } from './http.ts';

export type AppErrorCode = DomainErrorCode | HttpStatusCode;
