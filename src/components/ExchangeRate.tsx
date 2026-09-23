import { useEffect, useState } from "react";

const CURRENCIES = ["PKR", "SAR", "TRY", "AED", "INR", "BDT", "EUR"] as const;
type Currency = (typeof CURRENCIES)[number];

const FLAGS: Record<Currency, string> = {
  PKR: "🇵🇰",
  SAR: "🇸🇦",
  TRY: "🇹🇷",
  AED: "🇦🇪",
  INR: "🇮🇳",
  BDT: "🇧🇩",
  EUR: "🇪🇺",
};

interface RateResponse {
  base: "GBP";
  rates: Record<Currency, number>;
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

  const otherCurrencies = CURRENCIES.filter((c) => c !== "PKR");

  return (
    <div className="rounded-2xl border border-teal/30 bg-navy-light/60 backdrop-blur px-6 py-5 sm:px-8 sm:py-6 shadow-xl">
      <p className="text-xs sm:text-sm uppercase tracking-widest text-teal font-semibold mb-2">
        Live Exchange Rate
      </p>
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-lg sm:text-xl text-white/70">1 GBP =</span>
        {data ? (
          <span className="text-4xl sm:text-5xl font-bold text-white tabular-nums">
            {data.rates.PKR.toFixed(2)}
          </span>
        ) : error ? (
          <span className="text-2xl font-semibold text-white/50">unavailable</span>
        ) : (
          <span className="text-4xl sm:text-5xl font-bold text-white/45 animate-pulse">
            ---.--
          </span>
        )}
        <span className="text-lg sm:text-xl text-white/70">PKR</span>
      </div>
      <p className="mt-3 text-xs text-white/50">
        {data ? `Last updated ${formatUpdatedAt(data.updatedAt)}` : "Last updated —"}
      </p>

      <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-x-4 gap-y-2">
        {otherCurrencies.map((code) => (
          <div key={code} className="flex items-center gap-1.5 text-sm">
            <span aria-hidden="true">{FLAGS[code]}</span>
            <span className="text-white/50">{code}</span>
            <span className="text-white font-semibold tabular-nums ml-auto">
              {data ? data.rates[code].toFixed(2) : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
