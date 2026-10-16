export interface Logger {
  info(tag: string, message: string, meta?: unknown): void;
  error(tag: string, message: string, meta?: unknown): void;
}
