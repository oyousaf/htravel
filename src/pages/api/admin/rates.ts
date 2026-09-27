import type { APIRoute } from "astro";
import { createHash, timingSafeEqual } from "node:crypto";
import { setManualRates } from "../../../lib/manualRates";

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

function passwordMatches(input: string): boolean {
  const expected = import.meta.env.ADMIN_PASSWORD;
  if (!expected) return false; // fail closed if not configured
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

function parseRate(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n > 0 && n < 10000 ? Math.round(n * 100) / 100 : null;
}

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  if (!passwordMatches(String(body.password ?? ""))) {
    await new Promise((r) => setTimeout(r, 1000)); // slow down guessing
    return json({ error: "Incorrect password." }, 401);
  }

  const cashPickup = parseRate(body.cashPickup);
  const bankTransfer = parseRate(body.bankTransfer);
  const date = String(body.date ?? "");

  if (cashPickup === null || bankTransfer === null) {
    return json({ error: "Enter both rates as numbers, e.g. 363." }, 400);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return json({ error: "Enter a valid date." }, 400);
  }

  const rates = { cashPickup, bankTransfer, date, updatedAt: new Date().toISOString() };
  await setManualRates(rates);
  return json({ ok: true, rates });
};
