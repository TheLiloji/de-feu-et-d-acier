/**
 * Vignettes des traités pour l'assistant « Questions d'armes » — l'étage 2.
 *
 * Quand `/api/ia` cite une page du site comme source, le panneau de réponse
 * sait désormais montrer, à côté du lien, la vignette du traité concerné :
 * une planche déjà publiée dans la bibliothèque, la même que la carte de
 * `/sources/` met en avant (la « majestueuse » cochée dans l'admin, à défaut
 * la première — `plancheVedette()`).
 *
 * Le mapping adresse → vignette est construit **au build** et inliné dans la
 * page par `ChercheQuestions.astro`, exactement comme l'index des suggestions :
 * zéro requête serveur en plus, et le dérivé d'image est celui qu'`astro:assets`
 * émet de toute façon dans le build. Le panneau, côté client, ne fait qu'une
 * consultation de dictionnaire sur l'URL de chaque source citée — une source
 * externe (wiki FFAMHE) n'y figure pas, donc n'affiche jamais d'image :
 * **les images du site uniquement**, jamais une adresse extérieure.
 *
 * Côté droits : la vignette renvoie vers la fiche du traité, qui porte la
 * planche entière et sa ligne de crédit verbatim — le même régime que les
 * cartes de la page `/sources/`, documenté dans ARCHITECTURE.md §6 (CC BY 4.0
 * §3.a.2 permet ce renvoi pour une vignette).
 *
 * Invariant multi-ecoles.md §6.6 respecté : ce module ne lit aucun contenu,
 * la page lui passe les traités qu'elle a déjà chargés.
 */
import { getImage } from 'astro:assets';
import { plancheVedette } from '../components/sources/traites';
import type { EcoleConfig } from '../config/ecoles';
import type { Traite } from './contenu';
import { resoudrePhoto } from './images';
import { lien } from './liens';

/** Une vignette inlinée : s = src du dérivé, a = alt, l/h = dimensions. */
export interface VignetteTraite {
  s: string;
  a: string;
  l: number;
  h: number;
}

/**
 * Hauteur du dérivé généré, en pixels physiques. Le panneau affiche la
 * vignette sur ~44 px CSS : 88 couvre les écrans à double densité sans
 * embarquer plus lourd que nécessaire.
 */
const HAUTEUR_DERIVE = 88;

/**
 * Le mapping `/sources/<slug>/` → vignette, prêt à inliner.
 *
 * Un traité sans planche affichable (fichier pas encore déposé) est
 * simplement absent du mapping : sa source s'affiche alors comme avant,
 * en lien seul — jamais de cadre vide.
 */
export async function vignettesTraites({
  ecole,
  traites,
}: {
  ecole: EcoleConfig;
  traites: readonly Traite[];
}): Promise<Record<string, VignetteTraite>> {
  const mapping: Record<string, VignetteTraite> = {};

  for (const traite of traites) {
    // Même choix que les cartes de /sources/ : la « majestueuse » d'abord,
    // parmi les seules planches dont le fichier existe réellement.
    const affichables = traite.entry.planches.filter((p) => resoudrePhoto(p.image));
    const planche = plancheVedette(affichables);
    if (!planche) continue;

    const meta = resoudrePhoto(planche.image);
    if (!meta) continue;

    const hauteur = Math.min(HAUTEUR_DERIVE, meta.height);
    const largeur = Math.max(1, Math.round((meta.width * hauteur) / meta.height));
    const derive = await getImage({ src: meta, width: largeur, height: hauteur, format: 'webp' });

    mapping[lien(ecole, `/sources/${traite.slug}/`)] = {
      s: derive.src,
      // L'alt de la planche, écrit dans la fiche : court et certain, comme
      // tous les alt du site — jamais une description inventée ici.
      a: (planche.alt ?? '').trim(),
      l: largeur,
      h: hauteur,
    };
  }

  return mapping;
}
