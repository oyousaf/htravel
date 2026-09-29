import type { APIRoute } from "astro";
import { airportNames } from "../../data/airports";
import { airlineNames } from "../../data/airlines";

export const prerender = false;

const CACHE_TTL_MS = 5 * 60 * 1000; // refresh every 5 minutes
const AIRPORT_IATA = "MAN"; // Manchester Airport

interface AirLabsFlight {
  flight_iata?: string;
  flight_icao?: string;
  airline_iata?: string;
  arr_iata?: string;
  dep_time?: string;
  dep_time_utc?: string;
  dep_terminal?: string | null;
  dep_gate?: string | null;
  status?: string;
}

interface FlightSample {
  flightNumber: string;
  airline: string;
  destinationCode: string;
  destinationName: string;
  depTime: string | null;
  terminal: string | null;
  gate: string | null;
}

interface FlightsCache {
  airport: string;
  sample: FlightSample[];
  updatedAt: string;
}

let cache: FlightsCache | null = null;

async function fetchUpcomingDepartures(): Promise<FlightsCache> {
  const apiKey = import.meta.env.AIRLABS_API_KEY;
  if (!apiKey) throw new Error("AIRLABS_API_KEY is not configured");

  const url = `https://airlabs.co/api/v9/schedules?dep_iata=${AIRPORT_IATA}&api_key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`AirLabs request failed: ${res.status}`);

  const json = await res.json();
  const flights: AirLabsFlight[] = Array.isArray(json.response) ? json.response : [];

  const now = Date.now();

  const sample: FlightSample[] = flights
    .filter((f) => {
      if (f.status === "cancelled" || !f.dep_time || !f.dep_time_utc || !f.flight_iata) return false;
      const depTimeMs = new Date(`${f.dep_time_utc}Z`).getTime();
      return !Number.isNaN(depTimeMs) && depTimeMs > now;
    })
    .sort((a, b) => (a.dep_time_utc! > b.dep_time_utc! ? 1 : -1))
    .slice(0, 10)
    .map((f) => {
      const code = f.arr_iata ?? "—";
      return {
        flightNumber: f.flight_iata ?? f.flight_icao ?? "—",
        airline: (f.airline_iata && airlineNames[f.airline_iata]) ?? f.airline_iata ?? "",
        destinationCode: code,
        destinationName: airportNames[code] ?? code,
        depTime: f.dep_time ?? null,
        terminal: f.dep_terminal ?? null,
        gate: f.dep_gate ?? null,
      };
    });

  return { airport: AIRPORT_IATA, sample, updatedAt: new Date().toISOString() };
}

export const GET: APIRoute = async () => {
  const isStale = !cache || Date.now() - new Date(cache.updatedAt).getTime() > CACHE_TTL_MS;

  if (!isStale && cache) {
    return Response.json({ ...cache, source: "cache" });
  }

  try {
    const live = await fetchUpcomingDepartures();
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
