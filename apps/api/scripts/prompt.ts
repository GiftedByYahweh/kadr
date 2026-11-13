import { createInterface, type Interface } from 'node:readline';
import { Writable } from 'node:stream';

export class Prompt {
  private muted = false;
  private readonly readline: Interface;
  private readonly lines: AsyncIterator<string>;

  constructor() {
    const output = new Writable({
      write: (chunk: Buffer, encoding: BufferEncoding, callback) => {
        if (!this.muted) process.stdout.write(chunk, encoding);
        callback();
      },
    });
    this.readline = createInterface({
      input: process.stdin,
      output,
      terminal: process.stdin.isTTY,
    });
    this.lines = this.readline[Symbol.asyncIterator]();
  }

  async ask(question: string): Promise<string> {
    process.stdout.write(question);
    const answer = await this.readLine();
    return answer.trim();
  }

  async askHidden(question: string): Promise<string> {
    process.stdout.write(question);
    this.muted = true;
    const answer = await this.readLine();
    this.muted = false;
    process.stdout.write('\n');
    return answer;
  }

  close(): void {
    this.readline.close();
  }

  private async readLine(): Promise<string> {
    const next = await this.lines.next();
    if (next.done) throw new Error('Input closed');
    return next.value;
  }
}
