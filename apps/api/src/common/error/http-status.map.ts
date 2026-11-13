import {
  DomainErrorCode,
  HttpStatusCode,
  type AppErrorCode,
} from '@kadr/shared';

export const HTTP_STATUS_MESSAGES: Record<HttpStatusCode, string> = {
  [HttpStatusCode.BAD_REQUEST]: 'Bad Request',
  [HttpStatusCode.UNAUTHORIZED]: 'Unauthorized',
  [HttpStatusCode.FORBIDDEN]: 'Not allowed',
  [HttpStatusCode.NOT_FOUND]: 'Not Found',
  [HttpStatusCode.CONFLICT]: 'Conflict',
  [HttpStatusCode.TOO_MANY_REQUESTS]: 'Too Many Requests',
  [HttpStatusCode.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
};

export const HTTP_STATUS_BY_APP_ERROR: Record<AppErrorCode, HttpStatusCode> = {
  [HttpStatusCode.BAD_REQUEST]: HttpStatusCode.BAD_REQUEST,
  [HttpStatusCode.UNAUTHORIZED]: HttpStatusCode.UNAUTHORIZED,
  [HttpStatusCode.FORBIDDEN]: HttpStatusCode.FORBIDDEN,
  [HttpStatusCode.NOT_FOUND]: HttpStatusCode.NOT_FOUND,
  [HttpStatusCode.CONFLICT]: HttpStatusCode.CONFLICT,
  [HttpStatusCode.TOO_MANY_REQUESTS]: HttpStatusCode.TOO_MANY_REQUESTS,
  [HttpStatusCode.INTERNAL_SERVER_ERROR]: HttpStatusCode.INTERNAL_SERVER_ERROR,

  [DomainErrorCode.GALLERY_NOT_FOUND]: HttpStatusCode.NOT_FOUND,
  [DomainErrorCode.GALLERY_EXPIRED]: HttpStatusCode.FORBIDDEN,
  [DomainErrorCode.GALLERY_MEDIA_NOT_FOUND]: HttpStatusCode.NOT_FOUND,

  [DomainErrorCode.INVALID_CREDENTIALS]: HttpStatusCode.UNAUTHORIZED,
};
