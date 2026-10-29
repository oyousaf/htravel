import type { APIRoute } from "astro";
import { json, passwordMatches, startSession } from "../../../lib/adminAuth";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
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

  startSession(cookies);
  return json({ ok: true });
};
