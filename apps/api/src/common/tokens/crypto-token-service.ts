import { createHash, randomBytes } from 'node:crypto';
import type { TokenService } from './token-service.ts';

export class CryptoTokenService implements TokenService {
  private static readonly TOKEN_BYTES = 32;

  generate(): string {
    const bytes = randomBytes(CryptoTokenService.TOKEN_BYTES);
    return bytes.toString('base64url');
  }

  hash(token: string): string {
    const hash = createHash('sha256');
    hash.update(token);
    return hash.digest('hex');
  }
}
