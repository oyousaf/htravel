import type { AstroCookies } from "astro";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "htravel_admin";
const SESSION_MS = 12 * 60 * 60 * 1000;

// Sessions are signed with a key derived from the password, so changing
// ADMIN_PASSWORD signs everyone out without needing a separate secret.
function signingKey(): Buffer | null {
  const password = import.meta.env.ADMIN_PASSWORD;
  return password ? createHash("sha256").update(`admin-session:${password}`).digest() : null;
}

function sign(key: Buffer, payload: string): Buffer {
  return createHmac("sha256", key).update(payload).digest();
}

export function passwordMatches(input: string): boolean {
  const expected = import.meta.env.ADMIN_PASSWORD;
  if (!expected) return false; // fail closed if not configured
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export function isAuthed(cookies: AstroCookies): boolean {
  const key = signingKey();
  const value = cookies.get(COOKIE)?.value;
  if (!key || !value) return false;

  const [expires, signature] = value.split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;

  const expected = sign(key, expires);
  const given = Buffer.from(signature, "base64url");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export function startSession(cookies: AstroCookies): void {
  const key = signingKey();
  if (!key) return;
  const expires = String(Date.now() + SESSION_MS);
  cookies.set(COOKIE, `${expires}.${sign(key, expires).toString("base64url")}`, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MS / 1000,
  });
}

export function endSession(cookies: AstroCookies): void {
  cookies.delete(COOKIE, { path: "/" });
}

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
