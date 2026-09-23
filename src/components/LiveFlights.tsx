import { useEffect, useState } from "react";

interface FlightSample {
  callsign: string;
  originCountry: string;
  altitudeM: number | null;
  velocityMs: number | null;
}

interface FlightsResponse {
  count: number;
  sample: FlightSample[];
  source: "cache" | "live" | "stale-fallback";
}

export default function LiveFlights() {
  const [data, setData] = useState<FlightsResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/live-flights")
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    const interval = setInterval(() => {
      fetch("/api/live-flights")
        .then((res) => res.json())
        .then((json) => {
          if (!cancelled) setData(json);
        })
        .catch(() => {});
    }, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (error) return null;

  return (
    <div className="rounded-2xl bg-navy-light/50 border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-teal font-semibold uppercase text-sm tracking-wide">Live UK Airspace</p>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
        </span>
      </div>

      {data ? (
        <>
          <p className="text-3xl font-bold text-white mb-1">{data.count.toLocaleString()}</p>
          <p className="text-white/50 text-sm mb-4">aircraft currently tracked over the UK</p>

          {data.sample.length > 0 && (
            <ul className="space-y-1.5 text-sm">
              {data.sample.slice(0, 4).map((f) => (
                <li key={f.callsign} className="flex justify-between text-white/70">
                  <span className="font-mono">{f.callsign}</span>
                  <span className="text-white/40">{f.originCountry}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p className="text-white/40 text-sm animate-pulse">Loading live data…</p>
      )}

      <p className="text-white/30 text-xs mt-4">Data via OpenSky Network</p>
    </div>
  );
}
