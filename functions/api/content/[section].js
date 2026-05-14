// GET /api/content/<section>
//   Public. Renvoie le JSON stocké dans KV pour cette section.
//   Si KV n'a rien, on renvoie 204 No Content — le client tombera sur son seed bundled.
//
// PUT /api/content/<section>
//   Admin uniquement. Body = JSON brut. On valide que c'est du JSON parsable
//   et qu'il fait moins de 100 KB, puis on stocke dans KV sous la clé "<section>".

import { isAuthenticated } from '../../lib/auth.js';

const MAX_PAYLOAD_BYTES = 100 * 1024;
const SECTION_PATTERN = /^[a-z][a-z0-9_-]{0,40}$/;

export async function onRequestGet({ params, env }) {
  const section = params.section;
  if (!SECTION_PATTERN.test(section)) return json({ error: 'Invalid section' }, 400);
  if (!env.CONTENT_KV) return json({ error: 'KV not configured' }, 500);

  const raw = await env.CONTENT_KV.get(`content:${section}`);
  if (raw == null) return new Response(null, { status: 204 });
  return new Response(raw, {
    status: 200,
    headers: {
      'content-type': 'application/json',
      // Pas de cache long : on veut que les modifs admin apparaissent vite.
      // Le navigateur valide quand même via ETag s'il est ajouté plus tard.
      'cache-control': 'public, max-age=30',
    },
  });
}

export async function onRequestPut({ request, params, env }) {
  if (!(await isAuthenticated(request, env))) return json({ error: 'Unauthorized' }, 401);
  if (!env.CONTENT_KV) return json({ error: 'KV not configured' }, 500);

  const section = params.section;
  if (!SECTION_PATTERN.test(section)) return json({ error: 'Invalid section' }, 400);

  const body = await request.text();
  if (body.length > MAX_PAYLOAD_BYTES) return json({ error: 'Payload too large' }, 413);

  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return json({ error: 'Expected JSON object' }, 400);
  }

  // On stocke la forme normalisée (JSON.stringify) pour être sûr que la clé
  // contient toujours du JSON valide.
  await env.CONTENT_KV.put(`content:${section}`, JSON.stringify(parsed));
  return json({ ok: true });
}

export async function onRequestDelete({ request, params, env }) {
  if (!(await isAuthenticated(request, env))) return json({ error: 'Unauthorized' }, 401);
  if (!env.CONTENT_KV) return json({ error: 'KV not configured' }, 500);
  const section = params.section;
  if (!SECTION_PATTERN.test(section)) return json({ error: 'Invalid section' }, 400);
  await env.CONTENT_KV.delete(`content:${section}`);
  return json({ ok: true });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
