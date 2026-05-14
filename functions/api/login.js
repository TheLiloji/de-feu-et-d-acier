import { signSession, sessionCookie } from '../lib/auth.js';

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) {
    return json({ error: 'Server not configured' }, 500);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid body' }, 400);
  }
  const password = typeof body?.password === 'string' ? body.password : '';
  if (password.length === 0 || !constantTimeEqual(password, env.ADMIN_PASSWORD)) {
    // Petit délai pour ralentir le brute-force (pas une vraie défense, mais ça aide).
    await new Promise((r) => setTimeout(r, 600));
    return json({ error: 'Invalid password' }, 401);
  }
  const { value, maxAge } = await signSession(env.SESSION_SECRET);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'set-cookie': sessionCookie(value, maxAge),
    },
  });
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
