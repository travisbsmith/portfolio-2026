import { randomBytes, createHmac, timingSafeEqual } from 'crypto';

export const SESSION_COOKIE = 'dashboard_session';

function getSecret(): string {
  const secret = process.env.SESSION_SECRET ?? import.meta.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET env var is required');
  return secret;
}

export function generateSessionToken(): string {
  const nonce = randomBytes(16).toString('hex');
  const mac = createHmac('sha256', getSecret()).update(nonce).digest('hex');
  return `${nonce}.${mac}`;
}

export function isAuthenticated(cookies: { get(name: string): { value: string } | undefined }): boolean {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;

  const dot = token.lastIndexOf('.');
  if (dot === -1) return false;

  const nonce = token.slice(0, dot);
  const mac = token.slice(dot + 1);

  try {
    const expected = createHmac('sha256', getSecret()).update(nonce).digest('hex');
    const expectedBuf = Buffer.from(expected, 'hex');
    const actualBuf = Buffer.from(mac, 'hex');
    if (expectedBuf.length !== actualBuf.length) return false;
    return timingSafeEqual(expectedBuf, actualBuf);
  } catch {
    return false;
  }
}
