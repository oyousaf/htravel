import { redis } from "./redis";
import {
  defaultHajj,
  defaultUmrah,
  maktabOptions,
  type DateWindow,
  type HajjSeason,
  type UmrahPackage,
} from "../data/hajjUmrah";

// The Hajj season as displayed, with its title and drop-off date worked out from the packages.
export type HajjView = HajjSeason & {
  title: string; // "Hajj 2027"
  departDate: string; // earliest departure; the section leaves /packages on this day
};

export interface UmrahEdits {
  name: string;
  departDate: string;
  returnDate: string;
  deposit: number;
  hotels: { name: string; stars: number; nights: number }[];
  rooms: number[];
}

export interface HajjEdits {
  maktab: string;
  // Dates are optional because saves made before they were editable don't have them.
  packages: { departure?: DateWindow; return?: DateWindow; hotels: string[]; rooms: number[] }[];
}

const UMRAH_KEY = "packages:umrah";
const HAJJ_KEY = "packages:hajj";

const memory: { umrah: UmrahEdits | null; hajj: HajjEdits | null } = { umrah: null, hajj: null };

async function read<T>(key: string, fallback: T | null): Promise<T | null> {
  if (!redis) return fallback;
  return (await redis.get<T>(key)) ?? null;
}

// --- Dates and prices -------------------------------------------------------

const DAY_MS = 24 * 60 * 60 * 1000;

function parseYmd(ymd: string): Date {
  return new Date(`${ymd}T00:00:00Z`);
}

export function isValidYmd(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(parseYmd(value).getTime());
}

export function nightsBetween(from: string, to: string): number {
  return Math.round((parseYmd(to).getTime() - parseYmd(from).getTime()) / DAY_MS);
}

export function addDays(ymd: string, days: number): string {
  return new Date(parseYmd(ymd).getTime() + days * DAY_MS).toISOString().slice(0, 10);
}

const fmt = (ymd: string, options: Intl.DateTimeFormatOptions) =>
  parseYmd(ymd).toLocaleDateString("en-GB", { timeZone: "UTC", ...options });

export const shortDate = (ymd: string) => fmt(ymd, { day: "numeric", month: "short" });
export const dayDate = (ymd: string) => fmt(ymd, { weekday: "short", day: "numeric", month: "short" });

// "18 – 30 October 2026", "28 October – 9 November 2026", "28 December 2026 – 9 January 2027"
export function dateRange(from: string, to: string): string {
  const [a, b] = [parseYmd(from), parseYmd(to)];
  if (a.getUTCFullYear() !== b.getUTCFullYear()) {
    return `${fmt(from, { day: "numeric", month: "long", year: "numeric" })} – ${fmt(to, { day: "numeric", month: "long", year: "numeric" })}`;
  }
  if (a.getUTCMonth() !== b.getUTCMonth()) {
    return `${fmt(from, { day: "numeric", month: "long" })} – ${fmt(to, { day: "numeric", month: "long", year: "numeric" })}`;
  }
  return `${a.getUTCDate()} – ${fmt(to, { day: "numeric", month: "long", year: "numeric" })}`;
}

function ordinal(day: number): string {
  const suffix = day % 100 >= 11 && day % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][day % 10] ?? "th";
  return `${day}${suffix}`;
}

// "4th May 2027", "4th or 5th May 2027", "7th – 10th May 2027", "30th May – 2nd June 2027"
export function dateWindow({ from, to }: DateWindow): string {
  const [a, b] = [parseYmd(from), parseYmd(to)];
  const day = (d: Date) => ordinal(d.getUTCDate());
  const month = (ymd: string) => fmt(ymd, { month: "long" });
  const year = (d: Date) => d.getUTCFullYear();

  if (from === to) return `${day(a)} ${month(from)} ${year(a)}`;
  if (year(a) !== year(b)) return `${day(a)} ${month(from)} ${year(a)} – ${day(b)} ${month(to)} ${year(b)}`;
  if (a.getUTCMonth() !== b.getUTCMonth()) return `${day(a)} ${month(from)} – ${day(b)} ${month(to)} ${year(b)}`;
  const joiner = nightsBetween(from, to) === 1 ? " or " : " – ";
  return `${day(a)}${joiner}${day(b)} ${month(to)} ${year(b)}`;
}

export const gbp = (amount: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(amount);

// The business is in the UK, so "today" means today in London.
export function todayInLondon(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" });
}

// A package stays listed until its departure day.
export const isUpcoming = (departDate: string) => departDate > todayInLondon();

// --- Reading ----------------------------------------------------------------

export async function getUmrah(): Promise<UmrahPackage> {
  const edits = await read<UmrahEdits>(UMRAH_KEY, memory.umrah).catch(() => null);
  if (!edits) return defaultUmrah;

  return {
    ...defaultUmrah,
    name: edits.name,
    departDate: edits.departDate,
    returnDate: edits.returnDate,
    deposit: edits.deposit,
    hotels:
      edits.hotels.length === defaultUmrah.hotels.length
        ? defaultUmrah.hotels.map((h, i) => ({ ...h, ...edits.hotels[i] }))
        : defaultUmrah.hotels,
    rooms:
      edits.rooms.length === defaultUmrah.rooms.length
        ? defaultUmrah.rooms.map((r, i) => ({ ...r, price: edits.rooms[i] }))
        : defaultUmrah.rooms,
  };
}

function withSeasonDates(season: HajjSeason): HajjView {
  const departDate = season.packages.map((p) => p.departure.from).sort()[0];
  return { ...season, departDate, title: `Hajj ${departDate.slice(0, 4)}` };
}

export async function getHajj(): Promise<HajjView> {
  const edits = await read<HajjEdits>(HAJJ_KEY, memory.hajj).catch(() => null);
  if (!edits) return withSeasonDates(defaultHajj);

  return withSeasonDates({
    ...defaultHajj,
    maktab: edits.maktab,
    packages: defaultHajj.packages.map((p, i) => {
      const e = edits.packages[i];
      if (!e) return p;
      return {
        ...p,
        departure: e.departure ?? p.departure,
        return: e.return ?? p.return,
        hotels:
          e.hotels.length === p.hotels.length ? p.hotels.map((h, j) => ({ ...h, name: e.hotels[j] })) : p.hotels,
        rooms: e.rooms.length === p.rooms.length ? p.rooms.map((r, j) => ({ ...r, price: e.rooms[j] })) : p.rooms,
      };
    }),
  });
}

// --- Validating and saving ----------------------------------------------------

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function text(value: unknown, label: string): string {
  const s = typeof value === "string" ? value.trim() : "";
  if (!s) throw new Error(`${label} can't be empty.`);
  if (s.length > 80) throw new Error(`${label} is too long.`);
  return s;
}

function wholeNumber(value: unknown, label: string, min: number, max: number): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`${label} must be a whole number from ${min} to ${max}.`);
  return n;
}

const price = (value: unknown, label: string) => wholeNumber(value, label, 1, 100000);

function list(value: unknown, length: number): unknown[] {
  if (!Array.isArray(value) || value.length !== length) throw new Error("The form is out of date. Reload the page and try again.");
  return value;
}

function windowField(value: unknown, label: string): DateWindow {
  const w = (value ?? {}) as Record<string, unknown>;
  if (!isValidYmd(w.from) || !isValidYmd(w.to)) throw new Error(`Pick both ${label} dates.`);
  if (w.to < w.from) throw new Error(`The latest ${label} date can't be before the earliest.`);
  return { from: w.from, to: w.to };
}

function validate<T>(build: () => T): Result<T> {
  try {
    return { ok: true, value: build() };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Invalid details." };
  }
}

export function validateUmrah(body: Record<string, unknown>): Result<UmrahEdits> {
  return validate(() => {
    const name = text(body.name, "Package name");
    if (!isValidYmd(body.departDate) || !isValidYmd(body.returnDate)) throw new Error("Pick both dates.");
    const nights = nightsBetween(body.departDate, body.returnDate);
    if (nights < 1) throw new Error("The return date must be after the departure date.");

    const hotels = list(body.hotels, defaultUmrah.hotels.length).map((raw, i) => {
      const h = (raw ?? {}) as Record<string, unknown>;
      const city = defaultUmrah.hotels[i].city;
      return {
        name: text(h.name, `${city} hotel`),
        stars: wholeNumber(h.stars, `${city} hotel stars`, 1, 5),
        nights: wholeNumber(h.nights, `${city} nights`, 1, 60),
      };
    });
    const hotelNights = hotels.reduce((sum, h) => sum + h.nights, 0);
    if (hotelNights !== nights) {
      throw new Error(`Hotel nights add up to ${hotelNights}, but the dates cover ${nights} nights.`);
    }

    const rooms = list(body.rooms, defaultUmrah.rooms.length).map((p, i) => price(p, defaultUmrah.rooms[i].label));
    return {
      name,
      departDate: body.departDate,
      returnDate: body.returnDate,
      deposit: price(body.deposit, "Deposit"),
      hotels,
      rooms,
    };
  });
}

export function validateHajj(body: Record<string, unknown>): Result<HajjEdits> {
  return validate(() => {
    if (typeof body.maktab !== "string" || !maktabOptions.includes(body.maktab)) throw new Error("Choose a maktab zone.");
    const packages = list(body.packages, defaultHajj.packages.length).map((raw, i) => {
      const p = (raw ?? {}) as Record<string, unknown>;
      const defaults = defaultHajj.packages[i];
      const departure = windowField(p.departure, `${defaults.name} departure`);
      const ret = windowField(p.return, `${defaults.name} return`);
      if (ret.from <= departure.to) {
        throw new Error(`The ${defaults.name} return dates must be after its departure dates.`);
      }
      return {
        departure,
        return: ret,
        hotels: list(p.hotels, defaults.hotels.length).map((name, j) =>
          text(name, `${defaults.name} ${defaults.hotels[j].city} hotel`)
        ),
        rooms: list(p.rooms, defaults.rooms.length).map((v, j) => price(v, `${defaults.name} ${defaults.rooms[j].label}`)),
      };
    });
    return { maktab: body.maktab, packages };
  });
}

export async function saveUmrah(edits: UmrahEdits): Promise<void> {
  if (!redis) memory.umrah = edits;
  else await redis.set(UMRAH_KEY, edits);
}

export async function saveHajj(edits: HajjEdits): Promise<void> {
  if (!redis) memory.hajj = edits;
  else await redis.set(HAJJ_KEY, edits);
}
