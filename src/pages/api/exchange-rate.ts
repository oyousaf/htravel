import type { APIRoute } from "astro";

export const prerender = false;

const CACHE_TTL_MS = 3 * 60 * 60 * 1000; // refresh every 3 hours
// The client shows the PKR rate minus 1 (standard practice for exchangers).
// Other currencies are shown at the raw market rate for now.
const PKR_MARGIN = 1;

const CURRENCIES = ["PKR", "EUR", "AED", "TRY", "INR", "BDT"] as const;
type Currency = (typeof CURRENCIES)[number];

interface RateCache {
  base: "GBP";
  rates: Record<Currency, number>;
  updatedAt: string;
}

// In-memory cache, scoped to the warm serverless instance. Good enough at this
// traffic volume: even a cold-start miss just costs one extra live API call,
// nowhere near exchangerate-api's 1,500/month free cap.
let cache: RateCache | null = null;

async function fetchLiveRates(): Promise<RateCache> {
  const apiKey = import.meta.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) throw new Error("EXCHANGE_RATE_API_KEY is not configured");

  const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/GBP`);
  if (!res.ok) throw new Error(`exchangerate-api request failed: ${res.status}`);

  const json = await res.json();
  if (json.result !== "success") throw new Error(`exchangerate-api error: ${json["error-type"] ?? "unknown"}`);

  const rates = {} as Record<Currency, number>;
  for (const code of CURRENCIES) {
    const rate = json.conversion_rates[code];
    if (typeof rate !== "number") throw new Error(`Missing rate for ${code}`);
    rates[code] = code === "PKR" ? rate - PKR_MARGIN : rate;
  }

  return { base: "GBP", rates, updatedAt: new Date().toISOString() };
}

export const GET: APIRoute = async () => {
  const isStale = !cache || Date.now() - new Date(cache.updatedAt).getTime() > CACHE_TTL_MS;

  if (!isStale && cache) {
    return Response.json({ ...cache, source: "cache" });
  }

  try {
    const live = await fetchLiveRates();
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
