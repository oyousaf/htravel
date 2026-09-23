import { useEffect, useState } from "react";

interface WeatherResponse {
  city: string;
  tempC: number;
  condition: string;
  icon: string;
  source: "cache" | "live" | "stale-fallback";
}

interface Props {
  city: string;
  label: string;
}

export default function WeatherWidget({ city, label }: Props) {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/weather?city=${encodeURIComponent(city)}`)
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

    return () => {
      cancelled = true;
    };
  }, [city]);

  if (error) return null; // no API key configured, or the call failed — fail quietly

  return (
    <div className="inline-flex items-center gap-3 rounded-full bg-navy-light/60 border border-white/10 px-4 py-2">
      {data ? (
        <>
          <img
            src={`https://openweathermap.org/img/wn/${data.icon}.png`}
            alt={data.condition}
            className="h-8 w-8"
          />
          <span className="text-white font-semibold">{data.tempC}°C</span>
          <span className="text-white/50 text-sm">in {label}</span>
        </>
      ) : (
        <span className="text-white/55 text-sm animate-pulse">Loading weather…</span>
      )}
    </div>
  );
}
