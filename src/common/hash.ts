import { randomBytes } from 'crypto';

export class Hash {
  public static generateRandomHash(length: number, prefix?: string): string {
    return `${prefix || ''}${randomBytes(length).toString('hex').slice(0, length)}`;
  }
}
