/**
 * Catalogue d'icônes — lucide, inliné.
 *
 * La maquette n'emploie qu'une seule bibliothèque : lucide (design-spec §1.6,
 * 178 occurrences, 24 glyphes distincts). Plutôt qu'une dépendance npm et un
 * runtime, on recopie ici le contenu des SVG lucide (viewBox 24×24, tracé
 * `stroke="currentColor"`, `stroke-width` 2, jointures arrondies). Résultat :
 * zéro octet de JavaScript côté visiteur, zéro requête réseau, et un `<svg>`
 * qui hérite de `color` comme n'importe quel texte.
 *
 * Les 24 glyphes de la maquette sont listés dans l'ordre du tableau de
 * design-spec §1.6 ; les quatre derniers (`mail`, `instagram`, `youtube`,
 * `external-link`) ne sont pas maquettés mais couvrent les réseaux et les liens
 * sortants que le CMS peut produire.
 *
 * Pour en ajouter un : copier le contenu de `<svg>…</svg>` du fichier lucide
 * correspondant (sans la balise racine), en une seule ligne.
 *
 * Licence lucide : ISC — https://lucide.dev/license
 */

export const ICONES = {
  // ── Les 24 glyphes relevés dans la maquette ──────────────────────────────
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  diamond:
    '<path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  'chevrons-right': '<path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/>',
  swords:
    '<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'map-pin':
    '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  house:
    '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  sword:
    '<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/>',
  image:
    '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  'arrow-left': '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  trophy:
    '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  shield:
    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  minus: '<path d="M5 12h14"/>',
  menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  euro:
    '<path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/>',
  navigation: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',

  // ── Non maquettés, mais atteignables depuis le CMS ───────────────────────
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  instagram:
    '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
  youtube:
    '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
  'external-link':
    '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
} as const;

/** Noms d'icônes acceptés par `<Icon />`. */
export type NomIcone = keyof typeof ICONES;

/**
 * Glyphes que la maquette emploie **pleins** et non en tracé.
 *
 * Le losange du label de section fait 6 à 8 px : à cette taille un contour de
 * 0,7 px se voit à peine et le glyphe paraît creux. La maquette le donne d'un
 * seul aplat `$ember` — idem pour le triangle « play » des vignettes vidéo.
 * `<Icon filled={false} />` permet de revenir au tracé si besoin.
 */
export const REMPLIES_PAR_DEFAUT: ReadonlySet<NomIcone> = new Set<NomIcone>([
  'diamond',
  'play',
  'navigation',
]);

/** Vrai si le nom correspond à une icône du catalogue (garde de type). */
export function estNomIcone(valeur: unknown): valeur is NomIcone {
  return typeof valeur === 'string' && Object.prototype.hasOwnProperty.call(ICONES, valeur);
}

/** Liste triée des noms disponibles — sert aux messages d'erreur. */
export const NOMS_ICONES = Object.keys(ICONES).sort() as NomIcone[];
