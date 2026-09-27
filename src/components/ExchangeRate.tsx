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
  market: { rates: Record<Currency, number>; updatedAt: string } | null;
  manual: { cashPickup: number; bankTransfer: number; date: string } | null;
}

function formatUpdatedAt(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(ymd: string): string {
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
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
    const interval = setInterval(load, 30 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const manual = data?.manual ?? null;
  const market = data?.market ?? null;
  const otherCurrencies = CURRENCIES.filter((c) => c !== "PKR");

  return (
    <div className="rounded-2xl border border-teal/30 bg-navy-light/60 backdrop-blur px-6 py-5 sm:px-8 sm:py-6 shadow-xl">
      {manual ? (
        <>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-widest text-teal font-semibold">
                Today's Exchange Rate
              </p>
              <p className="text-white/60 text-sm mt-1">
                1 GBP to PKR · {formatDate(manual.date)}
              </p>
            </div>
            <span className="shrink-0 rounded-lg bg-white px-3 py-2">
              <img src="/images/partners/allied-bank.svg" alt="Allied Bank" className="h-5 w-auto" />
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-white/70 text-sm">Cash pick-up</dt>
              <dd className="text-4xl sm:text-5xl font-bold text-white tabular-nums">
                {manual.cashPickup}
              </dd>
            </div>
            <div>
              <dt className="text-white/70 text-sm">Bank transfer</dt>
              <dd className="text-4xl sm:text-5xl font-bold text-white tabular-nums">
                {manual.bankTransfer}
              </dd>
            </div>
          </dl>
        </>
      ) : (
        <>
          <p className="text-xs sm:text-sm uppercase tracking-widest text-teal font-semibold mb-2">
            Live Exchange Rate
          </p>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-lg sm:text-xl text-white/70">1 GBP =</span>
            {market ? (
              <span className="text-4xl sm:text-5xl font-bold text-white tabular-nums">
                {market.rates.PKR.toFixed(2)}
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
            {market ? `Last updated ${formatUpdatedAt(market.updatedAt)}` : "Last updated —"}
          </p>
        </>
      )}

      {(market || !data) && (
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-x-4 gap-y-2">
          {otherCurrencies.map((code) => (
            <div key={code} className="flex items-center gap-1.5 text-sm">
              <span aria-hidden="true">{FLAGS[code]}</span>
              <span className="text-white/50">{code}</span>
              <span className="text-white font-semibold tabular-nums ml-auto">
                {market ? market.rates[code].toFixed(2) : "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
