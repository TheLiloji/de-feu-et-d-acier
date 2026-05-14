// Gestion de session pour /admin.
//
// Pas de base de données : on emet un cookie auto-signé (HMAC-SHA256) qui
// porte sa date d'expiration. À chaque requête protégée on revérifie la
// signature. Si SESSION_SECRET tourne (ou est révoqué), tous les cookies
// existants deviennent invalides.

const COOKIE_NAME = 'dfda_admin';
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 h

const encoder = new TextEncoder();

function b64urlEncode(bytes) {
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(s) {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  const b64 = (s + pad).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return b64urlEncode(new Uint8Array(sig));
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function signSession(secret, ttlSeconds = SESSION_TTL_SECONDS) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const sig = await hmac(secret, String(exp));
  return { value: `${exp}.${sig}`, maxAge: ttlSeconds };
}

export async function verifySession(secret, cookieValue) {
  if (!cookieValue || typeof cookieValue !== 'string') return false;
  const dot = cookieValue.indexOf('.');
  if (dot < 1) return false;
  const exp = cookieValue.slice(0, dot);
  const sig = cookieValue.slice(dot + 1);
  if (!/^\d+$/.test(exp)) return false;
  if (Number(exp) < Math.floor(Date.now() / 1000)) return false;
  const expected = await hmac(secret, exp);
  return timingSafeEqual(sig, expected);
}

export function parseCookie(header, name) {
  if (!header) return null;
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}

export function sessionCookie(value, maxAge) {
  // Path=/ : valable pour tout le site. HttpOnly bloque JS d'y accéder
  // (XSS resistance). Secure : seulement HTTPS. SameSite=Lax suffit ici.
  return `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function isAuthenticated(request, env) {
  if (!env.SESSION_SECRET) return false;
  const cookie = parseCookie(request.headers.get('cookie'), COOKIE_NAME);
  if (!cookie) return false;
  return verifySession(env.SESSION_SECRET, cookie);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
