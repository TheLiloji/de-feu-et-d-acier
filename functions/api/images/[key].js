// DELETE /api/images/<key>  → supprime l'image dans R2 (admin)

import { isAuthenticated } from '../../lib/auth.js';

export async function onRequestDelete({ request, params, env }) {
  if (!(await isAuthenticated(request, env))) return json({ error: 'Unauthorized' }, 401);
  if (!env.IMAGES_R2) return json({ error: 'R2 not configured' }, 500);

  const key = decodeURIComponent(params.key || '');
  if (!key || key.includes('/')) return json({ error: 'Invalid key' }, 400);

  await env.IMAGES_R2.delete(key);
  return json({ ok: true });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
