import type { Logger } from './logger.ts';

export class ConsoleLogger implements Logger {
  info(tag: string, message: string, meta?: unknown): void {
    console.log(
      `<${new Date().toLocaleString()}> [INFO] [${tag}] ${message}`,
      meta ?? '',
    );
  }

  error(tag: string, message: string, meta?: unknown): void {
    console.error(
      `<${new Date().toLocaleString()}> [ERROR] [${tag}] ${message}`,
      meta ?? '',
    );
  }
}
