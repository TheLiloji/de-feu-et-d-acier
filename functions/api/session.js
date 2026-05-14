import { isAuthenticated } from '../lib/auth.js';

export async function onRequestGet({ request, env }) {
  const authed = await isAuthenticated(request, env);
  return new Response(JSON.stringify({ authenticated: authed }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
