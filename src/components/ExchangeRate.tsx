import { useEffect, useState } from "react";

interface RateResponse {
  rate: number;
  base: "GBP";
  target: "PKR";
  updatedAt: string;
  source: "cache" | "live" | "stale-fallback";
}

function formatUpdatedAt(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ExchangeRate() {
  const [data, setData] = useState<RateResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/exchange-rate");
        if (!res.ok) throw new Error("bad response");
        const json = (await res.json()) as RateResponse;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setError(true);
      }
    }

    load();
    // Client-side re-check on the same cadence as the server cache.
    const interval = setInterval(load, 3 * 60 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-teal/30 bg-navy-light/60 backdrop-blur px-6 py-5 sm:px-8 sm:py-6 shadow-xl">
      <p className="text-xs sm:text-sm uppercase tracking-widest text-teal font-semibold mb-2">
        Live Exchange Rate
      </p>
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-lg sm:text-xl text-white/70">1 GBP =</span>
        {data ? (
          <span className="text-4xl sm:text-5xl font-bold text-white tabular-nums">
            {data.rate.toFixed(2)}
          </span>
        ) : error ? (
          <span className="text-2xl font-semibold text-white/50">unavailable</span>
        ) : (
          <span className="text-4xl sm:text-5xl font-bold text-white/30 animate-pulse">
            ---.--
          </span>
        )}
        <span className="text-lg sm:text-xl text-white/70">PKR</span>
      </div>
      <p className="mt-3 text-xs text-white/50">
        {data
          ? `Last updated ${formatUpdatedAt(data.updatedAt)}`
          : error
          ? "Last updated —"
          : "Last updated —"}
      </p>
    </div>
  );
}
