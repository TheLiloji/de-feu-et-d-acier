// GET  /api/images        → liste les images dans R2 (admin uniquement, sert au picker)
// POST /api/images        → upload une image (admin uniquement). Multipart form-data:
//                             - file: le binaire
//                             - name: nom souhaité (optionnel, sinon timestamp+random)

import { isAuthenticated } from '../../lib/auth.js';

const MAX_IMAGE_BYTES = 6 * 1024 * 1024; // 6 MB
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
]);
const EXT_BY_TYPE = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
};

export async function onRequestGet({ request, env }) {
  if (!(await isAuthenticated(request, env))) return json({ error: 'Unauthorized' }, 401);
  if (!env.IMAGES_R2) return json({ error: 'R2 not configured' }, 500);

  const out = [];
  let cursor;
  do {
    const page = await env.IMAGES_R2.list({ cursor, limit: 1000 });
    for (const obj of page.objects) {
      out.push({
        key: obj.key,
        size: obj.size,
        uploaded: obj.uploaded,
        url: `/images/${encodeURIComponent(obj.key)}`,
      });
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);

  out.sort((a, b) => (a.uploaded < b.uploaded ? 1 : -1));
  return json({ images: out });
}

export async function onRequestPost({ request, env }) {
  if (!(await isAuthenticated(request, env))) return json({ error: 'Unauthorized' }, 401);
  if (!env.IMAGES_R2) return json({ error: 'R2 not configured' }, 500);

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Expected multipart/form-data' }, 400);
  }
  const file = form.get('file');
  if (!(file instanceof File)) return json({ error: 'Missing file' }, 400);
  if (file.size > MAX_IMAGE_BYTES) return json({ error: 'File too large' }, 413);
  if (!ALLOWED_TYPES.has(file.type)) return json({ error: `Type not allowed: ${file.type}` }, 415);

  const ext = EXT_BY_TYPE[file.type];
  const requested = (form.get('name') || '').toString().trim();
  const key = sanitizeName(requested, ext);

  await env.IMAGES_R2.put(key, file.stream(), {
    httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' },
  });

  return json({
    ok: true,
    key,
    url: `/images/${encodeURIComponent(key)}`,
    size: file.size,
    type: file.type,
  });
}

function sanitizeName(requested, ext) {
  if (requested) {
    const cleaned = requested
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9._-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^[-.]+|[-.]+$/g, '');
    if (cleaned) {
      // Ajoute l'extension si elle n'y est pas
      if (cleaned.endsWith(`.${ext}`)) return cleaned;
      const lastDot = cleaned.lastIndexOf('.');
      if (lastDot > 0) return cleaned.slice(0, lastDot) + `.${ext}`;
      return `${cleaned}.${ext}`;
    }
  }
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${ts}-${rand}.${ext}`;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
