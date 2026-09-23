import type { APIRoute } from "astro";

export const prerender = false;

const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // refresh every 2 hours per city

interface WeatherCache {
  city: string;
  tempC: number;
  condition: string;
  icon: string;
  updatedAt: string;
}

// In-memory cache keyed by city, scoped to the warm serverless instance.
const cache = new Map<string, WeatherCache>();

async function fetchLiveWeather(city: string): Promise<WeatherCache> {
  const apiKey = import.meta.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error("OPENWEATHER_API_KEY is not configured");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OpenWeatherMap request failed: ${res.status}`);

  const json = await res.json();
  return {
    city,
    tempC: Math.round(json.main.temp),
    condition: json.weather[0]?.main ?? "Unknown",
    icon: json.weather[0]?.icon ?? "01d",
    updatedAt: new Date().toISOString(),
  };
}

export const GET: APIRoute = async ({ url }) => {
  const city = url.searchParams.get("city");
  if (!city) {
    return new Response(JSON.stringify({ error: "Missing city parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const cached = cache.get(city);
  const isStale = !cached || Date.now() - new Date(cached.updatedAt).getTime() > CACHE_TTL_MS;

  if (!isStale && cached) {
    return Response.json({ ...cached, source: "cache" });
  }

  try {
    const live = await fetchLiveWeather(city);
    cache.set(city, live);
    return Response.json({ ...live, source: "live" });
  } catch (err) {
    if (cached) {
      return Response.json({ ...cached, source: "stale-fallback" });
    }
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};
