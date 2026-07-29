/**
 * `/robots.txt` — autorisation générale + adresse du plan du site.
 *
 * Généré plutôt qu'écrit dans `public/` parce que l'URL du sitemap dépend du
 * domaine, et que celui-ci n'est pas arbitré (ARCHITECTURE.md §8) : `Astro.site`
 * suit la surcharge `SITE_URL` d'astro.config.mjs, un fichier statique non.
 *
 * Pas de `Disallow: /keystatic` : une ligne `Disallow` ne désindexe rien, elle
 * ne fait qu'annoncer publiquement le chemin de l'admin. C'est l'en-tête
 * `X-Robots-Tag: noindex` de `public/_headers` qui la tient hors des index.
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const origine = site ?? new URL('https://dfda-amhe.fr');

  const corps = ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('/sitemap.xml', origine).href}`, ''].join(
    '\n',
  );

  return new Response(corps, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
