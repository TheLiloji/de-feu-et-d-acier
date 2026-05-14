// GET /images/<key> — Sert les images uploadées via R2, publiquement.
// Pas d'auth : les images sont publiques par construction (le site est public).

export async function onRequestGet({ params, env, request }) {
  if (!env.IMAGES_R2) return new Response('R2 not configured', { status: 500 });
  const key = decodeURIComponent(params.key || '');
  if (!key || key.includes('/')) return new Response('Invalid key', { status: 400 });

  const obj = await env.IMAGES_R2.get(key);
  if (!obj) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  if (!headers.has('cache-control')) {
    headers.set('cache-control', 'public, max-age=31536000, immutable');
  }

  // Support du If-None-Match pour économiser de la bande passante au revisite.
  const ifNoneMatch = request.headers.get('if-none-match');
  if (ifNoneMatch && ifNoneMatch === obj.httpEtag) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(obj.body, { status: 200, headers });
}
