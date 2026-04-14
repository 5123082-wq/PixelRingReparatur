import crypto from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(crypto.scrypt);
const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const HASH_PREFIX = 'scrypt';

function timingSafeEquals(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    return false;
  }

  return crypto.timingSafeEqual(a, b);
}

export async function hashAdminPassword(password: string): Promise<string> {
  const normalized = password.trim();

  if (normalized.length < 12) {
    throw new Error('Admin password must be at least 12 characters long.');
  }

  const salt = crypto.randomBytes(SALT_BYTES);
  const derivedKey = (await scryptAsync(normalized, salt, KEY_LENGTH)) as Buffer;

  return [HASH_PREFIX, salt.toString('base64url'), derivedKey.toString('base64url')].join('$');
}

export async function verifyAdminPassword(
  password: string,
  storedHash: string | null | undefined
): Promise<boolean> {
  if (!storedHash) {
    return false;
  }

  const [prefix, saltValue, keyValue] = storedHash.split('$');
  if (prefix !== HASH_PREFIX || !saltValue || !keyValue) {
    return false;
  }

  try {
    const salt = Buffer.from(saltValue, 'base64url');
    const expectedKey = Buffer.from(keyValue, 'base64url');
    const actualKey = (await scryptAsync(password.trim(), salt, expectedKey.length)) as Buffer;

    return timingSafeEquals(actualKey, expectedKey);
  } catch {
    return false;
  }
}
