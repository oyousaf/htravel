import type { APIRoute } from "astro";

export const prerender = false;

const CACHE_TTL_MS = 3 * 60 * 60 * 1000; // refresh every 3 hours
// The client shows the market rate minus 1 PKR (standard practice for exchangers).
const CLIENT_MARGIN = 1;

interface RateCache {
  rate: number;
  base: "GBP";
  target: "PKR";
  updatedAt: string;
}

// In-memory cache, scoped to the warm serverless instance. Good enough at this
// traffic volume: even a cold-start miss just costs one extra live API call,
// nowhere near exchangerate-api's 1,500/month free cap.
let cache: RateCache | null = null;

async function fetchLiveRate(): Promise<RateCache> {
  const apiKey = import.meta.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) throw new Error("EXCHANGE_RATE_API_KEY is not configured");

  const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/GBP/PKR`);
  if (!res.ok) throw new Error(`exchangerate-api request failed: ${res.status}`);

  const json = await res.json();
  if (json.result !== "success") throw new Error(`exchangerate-api error: ${json["error-type"] ?? "unknown"}`);

  return {
    rate: json.conversion_rate - CLIENT_MARGIN,
    base: "GBP",
    target: "PKR",
    updatedAt: new Date().toISOString(),
  };
}

export const GET: APIRoute = async () => {
  const isStale = !cache || Date.now() - new Date(cache.updatedAt).getTime() > CACHE_TTL_MS;

  if (!isStale && cache) {
    return Response.json({ ...cache, source: "cache" });
  }

  try {
    const live = await fetchLiveRate();
    cache = live;
    return Response.json({ ...live, source: "live" });
  } catch (err) {
    if (cache) {
      // Serve stale data rather than nothing if the upstream API hiccups.
      return Response.json({ ...cache, source: "stale-fallback" });
    }
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};
