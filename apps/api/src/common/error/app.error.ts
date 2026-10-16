import type { AppErrorCode } from '@kadr/shared';
import {
  HTTP_STATUS_BY_APP_ERROR,
  HTTP_STATUS_MESSAGES,
} from './http-status.map.ts';

export class AppError extends Error {
  readonly code: AppErrorCode;

  constructor(code: AppErrorCode, message?: string) {
    const statusCode = HTTP_STATUS_BY_APP_ERROR[code];
    const errorMessage = message ?? HTTP_STATUS_MESSAGES[statusCode];
    super(errorMessage);
    this.name = 'AppError';
    this.code = code;
  }
}
