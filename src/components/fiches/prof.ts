/**
 * Helpers partagés par la section « Les profs » (accueil) et la fiche prof.
 *
 * Deux besoins seulement, mais ils sont communs aux deux gabarits, et les
 * dupliquer les ferait diverger le jour où le club ajoutera un encadrant :
 *
 *   1. **la ligne d'armes** — « MESSER · VIKING · BOCLE » de design-spec §3.3,
 *      qui n'est pas un champ du CMS mais une composition des armes enseignées
 *      (`armes`, sélection dans le catalogue `disciplines`) ;
 *   2. **l'ordre d'affichage** — visibles seulement, triés par `ordre`.
 *
 * Rien ici n'est écrit en dur côté texte : les noms viennent du catalogue des
 * disciplines, seule l'abréviation est une règle.
 */

/** Forme minimale d'une entrée de discipline nécessaire au libellé. */
export interface DisciplinePourLibelle {
  slug: string;
  entry: { nom: string };
}

/** Forme minimale d'un encadrant nécessaire au tri. */
export interface ProfTriable {
  slug: string;
  entry: { nom: string; visible: boolean; ordre?: number | null };
}

const ORDRE_PAR_DEFAUT = 100;

/**
 * Les encadrants réellement affichés, dans l'ordre de la fiche.
 *
 * `visible` est le champ « Affiché sur le site » du CMS (principe « retirer ≠
 * supprimer ») : une fiche décochée sort de la grille **et** de `getStaticPaths`,
 * donc plus aucune page ne lui répond.
 */
export function profsAffiches<T extends ProfTriable>(profs: readonly T[]): T[] {
  return profs
    .filter((p) => p.entry.visible)
    .sort(
      (a, b) =>
        (a.entry.ordre ?? ORDRE_PAR_DEFAUT) - (b.entry.ordre ?? ORDRE_PAR_DEFAUT) ||
        a.entry.nom.localeCompare(b.entry.nom, 'fr'),
    );
}

/** Compare deux mots sans tenir compte des accents ni de la casse. */
const nu = (mot: string) =>
  mot
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

/**
 * Qualificatifs génériques qu'on retire en tête d'un nom d'arme.
 * « Combat viking » → « Viking ».
 */
const QUALIFICATIFS = ['combat', 'escrime', 'lutte'];

/**
 * Termes génériques qu'on retire devant un trait d'union.
 * « Épée-bocle » → « Bocle ».
 */
const COMPOSES = ['epee', 'espee', 'baton'];

const capitaliser = (t: string) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);

/**
 * Abrège un nom d'arme pour la ligne d'une carte prof.
 *
 * La maquette écrit « MESSER · VIKING · BOCLE » là où le catalogue dit
 * « Messer », « Combat viking », « Épée-bocle » : la carte ne dispose que de la
 * largeur d'une colonne, donc le qualificatif générique saute. Deux règles
 * suffisent à couvrir le catalogue actuel et restent justes pour la suite —
 * une arme dont le nom ne commence par aucun terme générique n'est pas touchée
 * (« Épée longue » reste « Épée longue »).
 */
export function abregerArme(nom: string): string {
  const propre = nom.trim();
  if (!propre) return '';

  const mots = propre.split(/\s+/);
  if (mots.length > 1 && QUALIFICATIFS.includes(nu(mots[0]!))) {
    return capitaliser(mots.slice(1).join(' '));
  }

  const morceaux = propre.split('-');
  if (morceaux.length === 2 && COMPOSES.includes(nu(morceaux[0]!))) {
    return capitaliser(morceaux[1]!.trim());
  }

  return propre;
}

export interface OptionsLibelleArmes {
  /** Au-delà, la ligne se termine par « · +2 ». Défaut : 3, comme la maquette. */
  max?: number;
  /** Abréger même quand l'encadrant n'enseigne qu'une arme. Défaut : non. */
  toujoursAbreger?: boolean;
}

/**
 * Compose la ligne d'armes d'un encadrant : « Messer · Viking · Bocle ».
 *
 * Les capitales sont posées par la CSS, jamais ici : l'admin garde un texte
 * lisible et un lecteur d'écran n'épelle pas « M-E-S-S-E-R ».
 *
 * Une arme seule est écrite en entier (« Épée longue », « Rapière ») — c'est ce
 * que montre la maquette pour Gabriel et Marie ; l'abréviation ne sert qu'à
 * faire tenir plusieurs armes sur une ligne.
 */
export function libelleArmes(
  armes: readonly string[] | null | undefined,
  disciplines: readonly DisciplinePourLibelle[],
  options: OptionsLibelleArmes = {},
): string {
  const { max = 3, toujoursAbreger = false } = options;

  const catalogue = new Map(disciplines.map((d) => [d.slug, d.entry.nom]));
  const noms = (armes ?? [])
    .map((slug) => catalogue.get(slug) ?? '')
    .map((n) => n.trim())
    .filter(Boolean);

  if (noms.length === 0) return '';
  if (noms.length === 1 && !toujoursAbreger) return noms[0]!;

  const abreges = noms.map(abregerArme);
  if (abreges.length <= max) return abreges.join(' · ');
  return `${abreges.slice(0, max).join(' · ')} · +${abreges.length - max}`;
}

/** Prénom affiché seul sur les cartes. Repli : premier mot du nom complet. */
export function prenomDe(entree: { nom: string; prenom?: string | null }): string {
  const saisi = entree.prenom?.trim();
  if (saisi) return saisi;
  return entree.nom.trim().split(/\s+/)[0] ?? entree.nom;
}
