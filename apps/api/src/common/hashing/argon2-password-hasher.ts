import argon2 from 'argon2';
import type { PasswordHasher } from './password-hasher.ts';

export class Argon2PasswordHasher implements PasswordHasher {
  private readonly pepper: Buffer;

  constructor(pepper: string) {
    this.pepper = Buffer.from(pepper);
  }

  async hash(password: string): Promise<string> {
    return argon2.hash(password, { secret: this.pepper });
  }

  async verify(password: string, storedHash: string): Promise<boolean> {
    return argon2.verify(storedHash, password, { secret: this.pepper });
  }
}
