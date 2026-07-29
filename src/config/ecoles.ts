/**
 * Source de vérité unique des écoles (implantations) de l'association.
 *
 * Ce fichier pilote, à lui seul :
 *   - les collections et singletons dépliés dans `keystatic.config.ts` ;
 *   - la navigation de l'admin ;
 *   - les routes Astro et les liens internes (`src/lib/liens.ts`) ;
 *   - l'affichage (ou non) du sélecteur d'école.
 *
 * Ouvrir une école = ajouter une ligne ici, puis saisir son contenu dans l'admin.
 * Cf. multi-ecoles.md §6.6 (les cinq invariants) et ARCHITECTURE.md §3.
 *
 * ⚠️ Les slugs apparaissent dans les chemins de fichiers ET dans les URLs :
 * une fois publiés, ils ne changent plus (multi-ecoles.md, risque R2).
 */

export interface EcoleConfig {
  /** Identifiant technique : minuscules, sans accent, sans espace. Définitif. */
  readonly slug: string;
  /** Nom affiché dans l'admin et dans le sélecteur d'école. */
  readonly nom: string;
  /** Ville, pour les libellés et le balisage SportsClub. */
  readonly ville: string;
  /** L'école servie sur `/`. Il en faut exactement une. */
  readonly principale: boolean;
}

export const ECOLES = [
  {
    slug: 'clermont',
    nom: 'Clermont-Ferrand',
    ville: 'Clermont-Ferrand',
    principale: true,
  },
] as const satisfies readonly EcoleConfig[];

export type EcoleSlug = (typeof ECOLES)[number]['slug'];

/**
 * Vrai dès qu'une deuxième école existe. Pilote l'apparition du sélecteur
 * d'école, des libellés « Profs — Clermont-Ferrand » dans l'admin, etc.
 */
export const MULTI: boolean = ECOLES.length > 1;

/**
 * Garde-fou de build : aucune école principale, ou plusieurs, = échec immédiat.
 * Cf. ARCHITECTURE.md §7 (garde-fous au build).
 */
function verifierEcolePrincipale(): EcoleConfig {
  const principales = ECOLES.filter((e) => e.principale);
  if (principales.length === 0) {
    throw new Error(
      "src/config/ecoles.ts : aucune école n'est marquée `principale: true`. " +
        "Exactement une école doit l'être — c'est elle qui est servie sur « / ».",
    );
  }
  if (principales.length > 1) {
    throw new Error(
      `src/config/ecoles.ts : ${principales.length} écoles sont marquées ` +
        `\`principale: true\` (${principales.map((e) => e.slug).join(', ')}). ` +
        'Une seule école peut être servie sur « / ».',
    );
  }
  return principales[0]!;
}

export const ECOLE_PRINCIPALE: EcoleConfig = verifierEcolePrincipale();

/** Retrouve la configuration d'une école par son slug. `undefined` si inconnue. */
export function ecoleConfig(slug: string): EcoleConfig | undefined {
  return ECOLES.find((e) => e.slug === slug);
}

/**
 * Libellé d'un groupe de contenu dans l'admin Keystatic.
 * Mono-école : « Les profs ». Multi-écoles : « Les profs — Clermont-Ferrand ».
 */
export function libelleEcole(base: string, ecole: EcoleConfig): string {
  return MULTI ? `${base} — ${ecole.nom}` : base;
}
