import { Redis } from "@upstash/redis";

// Vercel's Upstash integration injects KV_REST_API_*; a direct Upstash setup uses UPSTASH_REDIS_REST_*.
const url = import.meta.env.KV_REST_API_URL ?? import.meta.env.UPSTASH_REDIS_REST_URL;
const token = import.meta.env.KV_REST_API_TOKEN ?? import.meta.env.UPSTASH_REDIS_REST_TOKEN;

// Null locally when Redis isn't configured; callers fall back to in-memory
// storage, which serverless instances don't share, so production needs Redis.
export const redis = url && token ? new Redis({ url, token }) : null;
