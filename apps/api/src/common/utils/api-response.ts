import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  AppErrorCode,
} from '@kadr/shared';

interface ErrorResponseOptions {
  code: AppErrorCode;
  message: string;
}

export const successResponse = <T>(data: T): ApiSuccessResponse<T> => ({
  success: true,
  data,
  timestamp: Date.now(),
});

export const errorResponse = (
  options: ErrorResponseOptions,
): ApiErrorResponse => ({
  success: false,
  code: options.code,
  message: options.message,
  timestamp: Date.now(),
});
