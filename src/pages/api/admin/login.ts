import type { APIRoute } from "astro";
import { json, passwordMatches, startSession } from "../../../lib/adminAuth";
import { clearFailures, lockoutRemaining, recordFailure } from "../../../lib/loginLimiter";

export const prerender = false;

const lockedOut = (seconds: number) =>
  json(
    {
      error: `Too many incorrect attempts. Try again in ${Math.ceil(seconds / 60)} minute${seconds > 60 ? "s" : ""}.`,
      retryAfter: seconds,
    },
    429
  );

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || clientAddress || "unknown";

  const remaining = await lockoutRemaining(ip);
  if (remaining > 0) return lockedOut(remaining);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  if (!passwordMatches(String(body.password ?? ""))) {
    await new Promise((r) => setTimeout(r, 1000)); // slow down guessing
    const attemptsLeft = await recordFailure(ip);
    if (attemptsLeft === 0) return lockedOut(await lockoutRemaining(ip));
    return json(
      {
        error: `Incorrect password. ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} left.`,
        attemptsLeft,
      },
      401
    );
  }

  await clearFailures(ip);
  startSession(cookies);
  return json({ ok: true });
};
