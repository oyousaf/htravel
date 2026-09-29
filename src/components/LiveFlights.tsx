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

const COLLAPSED_COUNT = 5;

export default function LiveFlights() {
  const [data, setData] = useState<FlightsResponse | null>(null);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);

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
          <>
            {(() => {
              const visible = data.sample.slice(0, COLLAPSED_COUNT);
              const extra = data.sample.slice(COLLAPSED_COUNT);
              const renderFlight = (f: FlightSample, isLast: boolean, isFirstExtra = false) => (
                <li
                  key={f.flightNumber}
                  className={`flex items-center justify-between gap-3 pb-3 ${
                    isLast ? "" : "border-b border-white/5"
                  } ${isFirstExtra ? "pt-3" : ""}`}
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
              );

              return (
                <>
                  <ul className="space-y-3 text-sm">
                    {visible.map((f, i) => renderFlight(f, extra.length === 0 && i === visible.length - 1))}
                  </ul>

                  {extra.length > 0 && (
                    <div
                      className="grid transition-[grid-template-rows] duration-500 ease-in-out"
                      style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
                    >
                      <ul className="overflow-hidden space-y-3 text-sm">
                        {extra.map((f, i) => renderFlight(f, i === extra.length - 1, i === 0))}
                      </ul>
                    </div>
                  )}
                </>
              );
            })()}

            {data.sample.length > COLLAPSED_COUNT && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="flex items-center gap-1 mt-4 text-teal text-xs font-semibold hover:text-teal-dark transition-colors"
                >
                  {expanded ? "Show fewer" : `Show ${data.sample.length - COLLAPSED_COUNT} more`}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.25a.75.75 0 0 1-1.06 0L5.23 8.29a.75.75 0 0 1 0-1.08Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
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
