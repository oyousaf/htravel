import { useEffect, useState } from "react";

interface FlightSample {
  flightNumber: string;
  airline: string;
  destinationCode: string;
  destinationName: string;
  depTime: string | null;
  terminal: string | null;
  gate: string | null;
}

interface FlightsResponse {
  airport: string;
  sample: FlightSample[];
  source: "cache" | "live" | "stale-fallback";
}

function formatTime(depTime: string | null) {
  if (!depTime) return "—";
  const match = depTime.match(/(\d{2}):(\d{2})$/);
  return match ? `${match[1]}:${match[2]}` : depTime;
}

export default function LiveFlights() {
  const [data, setData] = useState<FlightsResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = () =>
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

    load();
    const interval = setInterval(load, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (error) return null;

  return (
    <div className="rounded-2xl bg-navy-light/50 border border-white/10 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-teal font-semibold uppercase text-sm tracking-wide">Departures</p>
          <p className="text-white/50 text-xs mt-0.5">Manchester Airport</p>
        </div>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
        </span>
      </div>

      {data ? (
        data.sample.length > 0 ? (
          <ul className="space-y-3 text-sm">
            {data.sample.map((f) => (
              <li
                key={f.flightNumber}
                className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-white font-medium truncate">{f.destinationName}</span>
                  <span className="text-white/50 text-xs font-mono">
                    {f.flightNumber} · {f.airline}
                  </span>
                </div>
                <div className="flex flex-col items-end text-right shrink-0">
                  <span className="text-teal font-semibold">{formatTime(f.depTime)}</span>
                  <span className="text-white/50 text-xs">
                    {f.terminal ? `T${f.terminal}` : "T—"}
                    {f.gate ? ` · Gate ${f.gate}` : ""}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white/55 text-sm">No upcoming departures found right now.</p>
        )
      ) : (
        <p className="text-white/55 text-sm animate-pulse">Loading departures…</p>
      )}

      <p className="text-white/55 text-xs mt-4">Data via AirLabs</p>
    </div>
  );
}
