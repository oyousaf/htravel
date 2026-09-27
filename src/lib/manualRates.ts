import { Redis } from "@upstash/redis";

export interface ManualRates {
  cashPickup: number;
  bankTransfer: number;
  date: string; // YYYY-MM-DD, the day the client quotes these rates for
  updatedAt: string;
}

const KEY = "rates:pkr-manual";

// Vercel's Upstash integration injects KV_REST_API_*; a direct Upstash setup uses UPSTASH_REDIS_REST_*.
const url = import.meta.env.KV_REST_API_URL ?? import.meta.env.UPSTASH_REDIS_REST_URL;
const token = import.meta.env.KV_REST_API_TOKEN ?? import.meta.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

// Local-dev fallback only: serverless instances don't share memory, so production
// must have Redis configured or saved rates won't persist.
let memory: ManualRates | null = null;

export async function getManualRates(): Promise<ManualRates | null> {
  if (!redis) return memory;
  return (await redis.get<ManualRates>(KEY)) ?? null;
}

export async function setManualRates(rates: ManualRates): Promise<void> {
  if (!redis) {
    memory = rates;
    return;
  }
  await redis.set(KEY, rates);
}
