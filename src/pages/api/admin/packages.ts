import type { APIRoute } from "astro";
import { isAuthed, json } from "../../../lib/adminAuth";
import { saveHajj, saveUmrah, validateHajj, validateUmrah } from "../../../lib/packages";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthed(cookies)) return json({ error: "Your session has expired. Log in again." }, 401);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  if (body.type === "umrah") {
    const result = validateUmrah(body);
    if (!result.ok) return json({ error: result.error }, 400);
    await saveUmrah(result.value);
    return json({ ok: true });
  }

  if (body.type === "hajj") {
    const result = validateHajj(body);
    if (!result.ok) return json({ error: result.error }, 400);
    await saveHajj(result.value);
    return json({ ok: true });
  }

  return json({ error: "Unknown package type." }, 400);
};
