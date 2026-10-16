import type { ApiErrorResponse, ApiResponse } from '../api/index.ts';
import { HttpStatusCode, type AppErrorCode } from '../errors/index.ts';

export interface RequestOptions extends Omit<
  RequestInit,
  'body' | 'method' | 'headers'
> {
  readonly headers?: Record<string, string>;
}

export interface HttpTransport {
  get<T = unknown>(
    url: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>>;
  post<T = unknown>(
    url: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>>;
  put<T = unknown>(
    url: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>>;
  patch<T = unknown>(
    url: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>>;
  delete<T = unknown>(
    url: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>>;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface SendPayload {
  readonly method: HttpMethod;
  readonly url: string;
  readonly data?: unknown;
  readonly options?: RequestOptions | undefined;
}

const JSON_CONTENT_TYPE = 'application/json';

function toErrorResponse(
  message = '',
  code: AppErrorCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
): ApiErrorResponse {
  return { success: false, code, message, timestamp: Date.now() };
}

async function handleFetchResponse<T>(
  response: Response,
): Promise<ApiResponse<T>> {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes(JSON_CONTENT_TYPE)) {
    return (await response.json()) as ApiResponse<T>;
  }

  if (response.ok) {
    const rawEtag = response.headers.get('etag');
    const data = (rawEtag ? { etag: rawEtag.replace(/"/g, '') } : null) as T;
    return { success: true, data, timestamp: Date.now() };
  }

  return toErrorResponse(response.statusText);
}

function isBinaryData(data: unknown): data is Blob | ArrayBuffer | FormData {
  return (
    data instanceof Blob ||
    data instanceof ArrayBuffer ||
    data instanceof FormData
  );
}

function prepareBody(
  data: unknown,
  headers: Record<string, string>,
): BodyInit | null {
  if (data === undefined || data === null) return null;
  if (isBinaryData(data)) return data;

  headers['Content-Type'] ??= JSON_CONTENT_TYPE;
  return JSON.stringify(data);
}

async function sendRequest<T>(
  baseUrl: string,
  payload: SendPayload,
): Promise<ApiResponse<T>> {
  const { url, data, method, options = {} } = payload;
  try {
    const headers: Record<string, string> = { ...options.headers };
    const body = prepareBody(data, headers);

    const response = await fetch(`${baseUrl}${url}`, {
      credentials: 'include',
      ...options,
      method,
      headers,
      body,
    });
    return await handleFetchResponse<T>(response);
  } catch {
    return toErrorResponse();
  }
}

export const httpTransport = (baseUrl: string): HttpTransport => ({
  get: <T = unknown>(url: string, options?: RequestOptions) =>
    sendRequest<T>(baseUrl, { method: 'GET', url, options }),

  post: <T = unknown>(url: string, data?: unknown, options?: RequestOptions) =>
    sendRequest<T>(baseUrl, { method: 'POST', url, data, options }),

  put: <T = unknown>(url: string, data?: unknown, options?: RequestOptions) =>
    sendRequest<T>(baseUrl, { method: 'PUT', url, data, options }),

  patch: <T = unknown>(url: string, data?: unknown, options?: RequestOptions) =>
    sendRequest<T>(baseUrl, { method: 'PATCH', url, data, options }),

  delete: <T = unknown>(url: string, options?: RequestOptions) =>
    sendRequest<T>(baseUrl, { method: 'DELETE', url, options }),
});
