import type { APIRoute } from "astro";

export const prerender = false;

const CACHE_TTL_MS = 5 * 60 * 1000; // refresh every 5 minutes — respects OpenSky's anonymous rate limit
// Rough bounding box around the UK.
const BBOX = { lamin: 49.8, lomin: -8.6, lamax: 60.9, lomax: 1.8 };

interface FlightSample {
  callsign: string;
  originCountry: string;
  altitudeM: number | null;
  velocityMs: number | null;
}

interface FlightsCache {
  count: number;
  sample: FlightSample[];
  updatedAt: string;
}

let cache: FlightsCache | null = null;

async function fetchLiveFlights(): Promise<FlightsCache> {
  const url = `https://opensky-network.org/api/states/all?lamin=${BBOX.lamin}&lomin=${BBOX.lomin}&lamax=${BBOX.lamax}&lomax=${BBOX.lomax}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OpenSky request failed: ${res.status}`);

  const json = await res.json();
  const states: unknown[][] = json.states ?? [];

  const sample: FlightSample[] = states
    .filter((s) => typeof s[1] === "string" && s[1].trim().length > 0)
    .slice(0, 6)
    .map((s) => ({
      callsign: (s[1] as string).trim(),
      originCountry: s[2] as string,
      altitudeM: s[7] as number | null,
      velocityMs: s[9] as number | null,
    }));

  return { count: states.length, sample, updatedAt: new Date().toISOString() };
}

export const GET: APIRoute = async () => {
  const isStale = !cache || Date.now() - new Date(cache.updatedAt).getTime() > CACHE_TTL_MS;

  if (!isStale && cache) {
    return Response.json({ ...cache, source: "cache" });
  }

  try {
    const live = await fetchLiveFlights();
    cache = live;
    return Response.json({ ...live, source: "live" });
  } catch (err) {
    if (cache) {
      return Response.json({ ...cache, source: "stale-fallback" });
    }
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};
