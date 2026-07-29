/**
 * `/sitemap.xml` — plan du site, généré depuis le contenu.
 *
 * Écrit à la main plutôt qu'avec `@astrojs/sitemap` : l'intégration ne déclare
 * aucune `peerDependency`, donc rien ne garantit qu'elle suive l'API
 * d'intégration d'Astro 7, et une trentaine de lignes suffisent ici. Les
 * sources sont exactement celles des `getStaticPaths` correspondants — une arme
 * décochée dans l'admin disparaît du site *et* du plan, sans rien à synchroniser.
 *
 * Les URL absolues passent par `lienAbsolu()` alimenté par `Astro.site` : le
 * plan reste juste quel que soit le domaine, y compris avec la surcharge
 * `SITE_URL` d'astro.config.mjs (le domaine définitif n'est pas arbitré,
 * ARCHITECTURE.md §8).
 *
 * Volontairement absents : `/keystatic` et `/api/keystatic/*` (jamais
 * pré-rendus, donc aucune URL à publier) et la page 404.
 */
import type { APIRoute } from 'astro';
import { articlesDe, lireDisciplines, profsDe } from '../lib/contenu';
import { getEcoles } from '../lib/ecoles';
import { profsAffiches } from '../components/fiches/prof';
import { lien, lienAbsolu } from '../lib/liens';

interface Entree {
  chemin: string;
  /** `AAAA-MM-JJ`, quand le contenu en porte une. */
  modifiee?: string;
  priorite: string;
}

const echapper = (valeur: string): string =>
  valeur.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async ({ site }) => {
  const origine = site ?? new URL('https://dfda-amhe.fr');
  const entrees: Entree[] = [];

  for (const ecole of await getEcoles()) {
    const [disciplines, profs, articles] = await Promise.all([
      lireDisciplines(),
      profsDe(ecole),
      articlesDe(ecole),
    ]);

    const publies = articles.filter((a) => a.entry.statut === 'publie');
    const dernierArticle = publies
      .map((a) => a.entry.date ?? '')
      .filter(Boolean)
      .sort()
      .at(-1);

    entrees.push({ chemin: lien(ecole, '/'), priorite: '1.0', modifiee: dernierArticle });
    entrees.push({
      chemin: lien(ecole, '/actualites/'),
      priorite: '0.6',
      modifiee: dernierArticle,
    });

    for (const discipline of disciplines.filter((d) => d.entry.affichee)) {
      entrees.push({ chemin: lien(ecole, `/armes/${discipline.slug}/`), priorite: '0.8' });
    }

    for (const prof of profsAffiches(profs)) {
      entrees.push({ chemin: lien(ecole, `/profs/${prof.slug}/`), priorite: '0.7' });
    }

    for (const article of publies) {
      entrees.push({
        chemin: lien(ecole, `/actualites/${article.slug}/`),
        priorite: '0.5',
        modifiee: article.entry.date ?? undefined,
      });
    }
  }

  // Pages légales : elles appartiennent à l'association, pas à une implantation
  // (content-model.md §3), donc une seule entrée, jamais préfixée.
  entrees.push({ chemin: '/mentions-legales/', priorite: '0.2' });
  entrees.push({ chemin: '/confidentialite/', priorite: '0.2' });

  const corps = entrees
    .map(({ chemin, modifiee, priorite }) =>
      [
        '  <url>',
        `    <loc>${echapper(lienAbsolu(origine, chemin))}</loc>`,
        modifiee ? `    <lastmod>${modifiee}</lastmod>` : '',
        `    <priority>${priorite}</priority>`,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${corps}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
