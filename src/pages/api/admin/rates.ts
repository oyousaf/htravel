import type { APIRoute } from "astro";
import { isAuthed, json } from "../../../lib/adminAuth";
import { setManualRates } from "../../../lib/manualRates";
import { isValidYmd } from "../../../lib/packages";

export const prerender = false;

function parseRate(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n > 0 && n < 10000 ? Math.round(n * 100) / 100 : null;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthed(cookies)) return json({ error: "Your session has expired. Log in again." }, 401);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const cashPickup = parseRate(body.cashPickup);
  const bankTransfer = parseRate(body.bankTransfer);

  if (cashPickup === null || bankTransfer === null) {
    return json({ error: "Enter both rates as numbers, e.g. 363." }, 400);
  }
  if (!isValidYmd(body.date)) {
    return json({ error: "Enter a valid date." }, 400);
  }

  const rates = { cashPickup, bankTransfer, date: body.date, updatedAt: new Date().toISOString() };
  await setManualRates(rates);
  return json({ ok: true, rates });
};
