import { redis } from "./redis";

export const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 15 * 60;

// Local-dev fallback; production counts in Redis so every serverless instance shares them.
const memory = new Map<string, { count: number; expiresAt: number }>();

const key = (ip: string) => `admin:login-fails:${ip}`;

function memoryEntry(ip: string) {
  const entry = memory.get(ip);
  if (entry && entry.expiresAt <= Date.now()) {
    memory.delete(ip);
    return null;
  }
  return entry ?? null;
}

// Seconds until this IP can try again, or 0 if it isn't locked out.
export async function lockoutRemaining(ip: string): Promise<number> {
  if (!redis) {
    const entry = memoryEntry(ip);
    return entry && entry.count >= MAX_ATTEMPTS ? Math.ceil((entry.expiresAt - Date.now()) / 1000) : 0;
  }
  const count = (await redis.get<number>(key(ip))) ?? 0;
  if (count < MAX_ATTEMPTS) return 0;
  return Math.max(await redis.ttl(key(ip)), 1);
}

// Records a failed attempt and returns how many attempts are left before the lockout.
export async function recordFailure(ip: string): Promise<number> {
  let count: number;
  if (!redis) {
    const entry = memoryEntry(ip) ?? { count: 0, expiresAt: Date.now() + LOCKOUT_SECONDS * 1000 };
    entry.count += 1;
    // The lockout window starts from the attempt that triggers it.
    if (entry.count === MAX_ATTEMPTS) entry.expiresAt = Date.now() + LOCKOUT_SECONDS * 1000;
    memory.set(ip, entry);
    count = entry.count;
  } else {
    count = await redis.incr(key(ip));
    if (count === 1 || count === MAX_ATTEMPTS) await redis.expire(key(ip), LOCKOUT_SECONDS);
  }
  return Math.max(MAX_ATTEMPTS - count, 0);
}

export async function clearFailures(ip: string): Promise<void> {
  if (!redis) memory.delete(ip);
  else await redis.del(key(ip));
}
