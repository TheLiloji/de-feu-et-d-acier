/**
 * Fabrique des liens internes conscients de l'école.
 *
 * Invariant n° 5 de multi-ecoles.md §6.6 : **aucun `href="#creneaux"` en dur**
 * dans un composant. Aujourd'hui `lien(ecole, '#creneaux')` rend `/#creneaux` ;
 * le jour où Lyon ouvre, il rend `/lyon/#creneaux` sans qu'aucun composant ne
 * change. C'est le seul point de discipline à tenir pendant la construction,
 * et il ne coûte rien puisqu'on écrit le code de toute façon.
 */
import type { EcoleConfig } from '../config/ecoles';

const EXTERNE = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

/** Vrai pour https://…, mailto:…, tel:…, //cdn… — à ne jamais préfixer. */
export function estExterne(cible: string): boolean {
  return EXTERNE.test(cible);
}

/** Racine d'une école : `/` pour l'école principale, `/lyon/` sinon. */
export function base(ecole: EcoleConfig): string {
  return ecole.principale ? '/' : `/${ecole.slug}/`;
}

/**
 * Résout une cible dans le contexte d'une école.
 *
 * - `'#creneaux'`        → `/#creneaux`        (ou `/lyon/#creneaux`)
 * - `'/actualites/'`     → `/actualites/`      (ou `/lyon/actualites/`)
 * - `'armes/rapiere/'`   → `/armes/rapiere/`   (ou `/lyon/armes/rapiere/`)
 * - `'https://…'`        → inchangé
 * - `''` / `undefined`   → `''` (le composant décide de masquer le lien)
 */
export function lien(ecole: EcoleConfig, cible: string | null | undefined): string {
  if (!cible) return '';
  if (estExterne(cible)) return cible;

  const racine = base(ecole);
  if (cible.startsWith('#')) return `${racine}${cible}`;

  const chemin = cible.startsWith('/') ? cible.slice(1) : cible;
  return `${racine}${chemin}`;
}

/** URL absolue, pour le canonical, l'OpenGraph et le sitemap. */
export function lienAbsolu(site: URL | string, chemin: string): string {
  return new URL(chemin, site).href;
}

/** Fiche d'une arme : `/armes/<slug>/`. */
export const lienArme = (ecole: EcoleConfig, slug: string) => lien(ecole, `/armes/${slug}/`);

/** Fiche d'un encadrant : `/profs/<slug>/`. */
export const lienProf = (ecole: EcoleConfig, slug: string) => lien(ecole, `/profs/${slug}/`);

/** Article : `/actualites/<slug>/`. */
export const lienArticle = (ecole: EcoleConfig, slug: string) =>
  lien(ecole, `/actualites/${slug}/`);
