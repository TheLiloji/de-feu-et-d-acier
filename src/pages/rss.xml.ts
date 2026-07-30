/**
 * `/rss.xml` — flux RSS des actualités.
 *
 * Écrit à la main pour les mêmes raisons que `sitemap.xml.ts` : `@astrojs/rss`
 * est une dépendance de plus pour trente lignes de XML, et la source des
 * entrées doit rester exactement celle du `getStaticPaths` de
 * `/actualites/[slug]` — un article dépublié dans l'admin disparaît du site
 * *et* du flux, sans rien à synchroniser.
 *
 * Le flux est annoncé aux lecteurs par la balise
 * `<link rel="alternate" type="application/rss+xml">` du gabarit de base ;
 * aucun lien visible ne s'y ajoute — c'est un canal technique, pas une
 * rubrique.
 *
 * Choix de dates : le schéma d'un article ne porte qu'un jour (`AAAA-MM-JJ`).
 * On publie donc `12:00:00 UTC` pour que la date affichée par les lecteurs ne
 * recule pas d'un jour dans les fuseaux à l'ouest de Greenwich.
 *
 * Les textes passent par `typographieFr` — comme sur la page `/actualites/`,
 * le flux rend ce que le lecteur verrait à l'écran.
 */
import type { APIRoute } from 'astro';
import { articlesDe } from '../lib/contenu';
import { getEcoles } from '../lib/ecoles';
import { lien, lienAbsolu } from '../lib/liens';
import { typographieFr } from '../lib/typographie';

const echapper = (valeur: string): string =>
  valeur.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** `AAAA-MM-JJ` → date RFC 1123 à midi UTC, le format attendu par RSS 2.0. */
const dateRss = (jour: string): string => new Date(`${jour}T12:00:00Z`).toUTCString();

export const GET: APIRoute = async ({ site }) => {
  const origine = site ?? new URL('https://dfda-amhe.fr');

  interface Entree {
    titre: string;
    url: string;
    date: string;
    chapo: string;
  }

  const entrees: Entree[] = [];
  for (const ecole of await getEcoles()) {
    const articles = await articlesDe(ecole);
    for (const article of articles.filter((a) => a.entry.statut === 'publie')) {
      entrees.push({
        titre: typographieFr(article.entry.titre),
        url: lienAbsolu(origine, lien(ecole, `/actualites/${article.slug}/`)),
        date: article.entry.date ?? '',
        chapo: typographieFr(article.entry.chapo ?? ''),
      });
    }
  }
  entrees.sort((a, b) => b.date.localeCompare(a.date));

  const corps = entrees
    .map((e) =>
      [
        '    <item>',
        `      <title>${echapper(e.titre)}</title>`,
        `      <link>${echapper(e.url)}</link>`,
        `      <guid isPermaLink="true">${echapper(e.url)}</guid>`,
        e.date ? `      <pubDate>${dateRss(e.date)}</pubDate>` : '',
        e.chapo ? `      <description>${echapper(e.chapo)}</description>` : '',
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    .join('\n');

  const derniere = entrees[0]?.date;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>De Feu et d’Acier — Actualités</title>
    <link>${echapper(lienAbsolu(origine, '/actualites/'))}</link>
    <description>La vie du club d’AMHE de Clermont-Ferrand : annonces de rentrée, stages, tournois et nouvelles de la salle.</description>
    <language>fr-fr</language>
${derniere ? `    <lastBuildDate>${dateRss(derniere)}</lastBuildDate>\n` : ''}    <atom:link href="${echapper(lienAbsolu(origine, '/rss.xml'))}" rel="self" type="application/rss+xml" />
${corps}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
