import { redis } from "./redis";

export interface ManualRates {
  cashPickup: number;
  bankTransfer: number;
  date: string; // YYYY-MM-DD, the day the client quotes these rates for
  updatedAt: string;
}

const KEY = "rates:pkr-manual";

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
