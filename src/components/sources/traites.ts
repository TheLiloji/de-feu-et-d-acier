/**
 * Helpers partagés par la section « Les sources » — page « La bibliothèque »,
 * fiche de traité, et l'encadré « La source » des fiches arme.
 *
 * Trois besoins, tous communs à ces trois gabarits :
 *
 *   1. **choisir la planche à montrer** en tête d'un traité (la « majestueuse »
 *      cochée dans l'admin, à défaut la première) ;
 *   2. **raccourcir** trois champs éditoriaux qui ne tiennent pas sur une carte
 *      — la tradition, l'auteur et l'année sont saisis en texte libre et
 *      détaillé, ce qui est le bon choix pour la fiche et le mauvais pour une
 *      vignette. Le raccourcissement coupe sur les séparateurs que le rédacteur
 *      a lui-même écrits ; la fiche, elle, affiche toujours le champ entier ;
 *   3. **relier les armes** d'un traité au catalogue des disciplines, en sachant
 *      lesquelles ont une fiche publique (l'épée-bocle n'en a pas).
 *
 * ⚠️ **Le crédit d'une planche ne passe par aucune normalisation.** C'est la
 * seule chaîne du site dans ce cas, et c'est délibéré : cette ligne est exigée
 * mot pour mot par la bibliothèque qui a numérisé le document (« Source
 * gallica.bnf.fr / Bibliothèque nationale de France », « digitalisiert von
 * Google », le lien de licence CC BY 4.0 et la mention des modifications pour
 * le Royal Armouries). Elle n'est ni composée par `typographieFr`, ni préfixée
 * d'un « © » par `creditAffiche` — ce dernier serait même faux : la plupart de
 * ces planches sont sous *Public Domain Mark*, c'est-à-dire explicitement
 * dépourvues de droit d'auteur. Cf. `creditPlanche()` plus bas.
 */
import { resoudrePhoto } from '../../lib/images';

// ── Formes minimales lues depuis le CMS ────────────────────────────────────
//
// Comme `src/components/fiches/prof.ts`, ce module décrit structurellement ce
// dont il a besoin plutôt que d'importer les types du lecteur Keystatic : les
// helpers restent testables et utilisables depuis n'importe quel gabarit.

/** Une planche telle que l'admin l'enregistre (collection `traites`). */
export interface PlancheCms {
  image?: string | null;
  alt?: string | null;
  legende?: string | null;
  folio?: string | null;
  credit?: string | null;
  majestueuse?: boolean | null;
}

/** Une fiche de traité, champs utiles au rendu. */
export interface TraiteCms {
  titre: string;
  auteur?: string | null;
  annee?: string | null;
  tradition?: string | null;
  bibliotheque?: string | null;
  cote?: string | null;
  urlNumerisation?: string | null;
  licence?: { resume?: string | null; url?: string | null } | null;
  armes?: readonly string[] | null;
  extraitCitation?: string | null;
  extraitCredit?: string | null;
  extraitUrl?: string | null;
  planches: readonly PlancheCms[];
  ordre?: number | null;
}

/** Une entrée de la collection : le slug (l'adresse) et son contenu. */
export interface EntreeTraite {
  slug: string;
  entry: TraiteCms;
}

/** Ce qu'il faut d'une discipline pour nommer et lier une arme. */
export interface DisciplinePourArme {
  slug: string;
  entry: { nom: string; affichee?: boolean | null; ordre?: number | null };
}

// ── Planches ───────────────────────────────────────────────────────────────

/**
 * La planche mise en avant : celle que l'admin a cochée « majestueuse », à
 * défaut la première du traité.
 *
 * Repli volontaire plutôt qu'un `null` : une fiche fraîchement créée, sur
 * laquelle personne n'a encore coché la case, doit tout de même s'illustrer.
 */
export function plancheVedette<P extends PlancheCms>(
  planches: readonly P[] | null | undefined,
): P | null {
  const liste = planches ?? [];
  return liste.find((p) => p.majestueuse) ?? liste[0] ?? null;
}

/**
 * Crédit d'une planche, **verbatim**.
 *
 * Aucune composition typographique, aucun « © » : voir l'avertissement en tête
 * de fichier. Seuls les blancs de bord sont retirés — un espace en fin de champ
 * n'est pas une mention de bibliothèque. Les blancs internes (le repli de ligne
 * d'un champ multiligne de l'admin) sont laissés au navigateur, qui les réduit
 * comme n'importe quel texte HTML.
 */
export function creditPlanche(brut?: string | null): string {
  return (brut ?? '').trim();
}

const ECHAPPEMENTS: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const echapper = (texte: string) => texte.replace(/[&<>"']/g, (c) => ECHAPPEMENTS[c] ?? c);

/**
 * Une adresse http(s) dans une ligne de crédit.
 *
 * Les parenthèses et les crochets sont exclus du motif : dans le crédit du Royal
 * Armouries, l'adresse de la licence est écrite entre parenthèses — « licence
 * CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/) » — et la parenthèse
 * fermante n'en fait pas partie. Les URN du MDZ (`urn:nbn:de:bvb:…`) ne sont pas
 * des adresses http et restent du texte, ce qui est correct : ce sont des
 * identifiants, pas des liens.
 */
const MOTIF_URL = /https?:\/\/[^\s<>"'()[\]]+/g;

/** Ponctuation qui suit une adresse sans lui appartenir. */
const PONCTUATION_FINALE = /[.,;:!?»]+$/;

/**
 * Le crédit d'une planche en HTML : **mêmes caractères visibles**, avec les
 * adresses rendues cliquables.
 *
 * Pourquoi cette fonction existe : CC BY 4.0 demande que l'attribution comporte
 * « a URI or hyperlink » vers la licence. Le crédit du Royal Armouries porte déjà
 * l'adresse en clair, ce qui satisfait la condition — mais un lien la satisfait
 * mieux, et évite au visiteur de recopier une URL à la main pour vérifier sous
 * quelle licence il regarde une image.
 *
 * Ce n'est **pas** une modification de la ligne : aucun caractère n'est ajouté,
 * retiré ni déplacé, seul le balisage change. La ponctuation qui suit l'adresse
 * (le « ). » de la parenthèse fermante) est laissée hors du lien, pour qu'un clic
 * n'emporte pas un point final dans l'adresse.
 *
 * Le texte est échappé segment par segment, avant toute injection : le contenu
 * vient du dépôt, mais une ligne de crédit n'a aucune raison d'être du HTML.
 */
export function creditPlancheHtml(brut?: string | null): string {
  const texte = creditPlanche(brut);
  if (!texte) return '';

  let html = '';
  let curseur = 0;

  for (const trouve of texte.matchAll(MOTIF_URL)) {
    const debut = trouve.index ?? 0;
    html += echapper(texte.slice(curseur, debut));

    const capture = trouve[0];
    const suffixe = capture.match(PONCTUATION_FINALE)?.[0] ?? '';
    const url = suffixe ? capture.slice(0, capture.length - suffixe.length) : capture;

    html +=
      `<a href="${echapper(url)}" target="_blank" rel="noopener noreferrer">${echapper(url)}</a>` +
      echapper(suffixe);

    curseur = debut + capture.length;
  }

  return html + echapper(texte.slice(curseur));
}

/** Planche prête à rendre : image importée par `astro:assets`, et ses mentions. */
export interface PlancheResolue {
  source: ImageMetadata;
  alt: string;
  legende: string;
  folio: string;
  credit: string;
  /** Proportions du fichier — sert à calculer `sizes` sans surcharger le build. */
  ratio: number;
}

/** Résout une planche. `null` si le fichier n'a pas (encore) été déposé. */
export function resoudrePlanche(planche?: PlancheCms | null): PlancheResolue | null {
  const source = resoudrePhoto(planche?.image);
  if (!source) return null;
  return {
    source,
    alt: (planche?.alt ?? '').trim(),
    legende: (planche?.legende ?? '').trim(),
    folio: (planche?.folio ?? '').trim(),
    credit: creditPlanche(planche?.credit),
    ratio: source.height > 0 ? source.width / source.height : 1,
  };
}

/**
 * Résout une liste de planches, en écartant celles dont le fichier manque.
 *
 * Même politique que `resoudrePhotos()` de `src/lib/images.ts` : un trou dans
 * la liste ne doit pas rendre un cadre vide. Le garde-fou n° 6 du build
 * (`src/lib/validation.ts`) attrape de son côté les planches sans description
 * ni crédit, qui sont, elles, des fautes.
 */
export function resoudrePlanches(
  planches?: readonly PlancheCms[] | null,
): PlancheResolue[] {
  return (planches ?? []).flatMap((planche) => {
    const resolue = resoudrePlanche(planche);
    return resolue ? [resolue] : [];
  });
}

/** « 6 planches », « 1 planche », « » — pour une ligne de carte ou de compte. */
export function comptePlanches(nombre: number): string {
  if (nombre <= 0) return '';
  return nombre === 1 ? '1 planche' : `${nombre} planches`;
}

// ── Champs éditoriaux raccourcis (vignettes uniquement) ────────────────────

/** Espaces multiples et replis de ligne réduits à une espace simple. */
const aplatir = (brut?: string | null) => (brut ?? '').replace(/\s+/g, ' ').trim();

/**
 * Séparateurs que les rédacteurs emploient pour enchaîner deux idées dans un
 * même champ : « Tradition bolonaise — spada sola et spada e brocchiero… ».
 * Couper dessus rend la tête de phrase, c'est-à-dire l'essentiel.
 */
const SEPARATEURS = [' — ', ' – ', ' ; '] as const;

/** Retire une ponctuation de liaison restée en fin de coupe. */
const nettoyerFin = (texte: string) => texte.trim().replace(/[,;:.]+$/, '').trim();

/**
 * Tradition abrégée pour une carte — « Tradition germanique (Liechtenauer) ».
 *
 * Le champ « Tradition / école » est multiligne et volontairement bavard : la
 * fiche du traité l'affiche en entier. Sur une carte, on garde ce qui précède
 * le premier séparateur ; si c'est encore trop long, on lâche la parenthèse de
 * précision. Rien n'est réécrit, seulement tronqué sur un point de coupe voulu
 * par le rédacteur — et jamais avec des points de suspension, qui laisseraient
 * croire à une phrase interrompue.
 */
export function traditionCourte(brut?: string | null, maxi = 46): string {
  let court = aplatir(brut);
  if (!court) return '';

  for (const separateur of SEPARATEURS) {
    const coupe = court.indexOf(separateur);
    if (coupe > 0) court = court.slice(0, coupe);
  }
  court = nettoyerFin(court);

  if (court.length <= maxi) return court;

  const parenthese = court.indexOf(' (');
  if (parenthese > 0) {
    const sans = nettoyerFin(court.slice(0, parenthese));
    if (sans) return sans;
  }
  return court;
}

/** Une parenthèse de dates de vie : « (1544-1618) », « (v. 1420-1490) ». */
const DATES_DE_VIE = /\s*\((?:v\.|av\.|ap\.|apr\.|[\d\s.–—-])+\)\s*$/;

/**
 * Auteur abrégé pour une carte — « Andre Paurñfeyndt (Paurenfeyndt) ».
 *
 * Le champ « Auteur » porte souvent la chaîne éditoriale complète (traducteur,
 * imprimeur, état de l'attribution) : « Anonyme ; attribué à un prêtre séculier
 * nommé dans le texte « Clericus Lutegerus » (Ludger). Trois mains de
 * scribes… ». On garde le nom, on laisse tomber l'appareil — qui reste affiché
 * en entier sur la fiche. Les dates de vie partent aussi : la carte porte déjà
 * l'année du traité, deux empans de temps côte à côte se confondent.
 *
 * Une parenthèse qui n'est pas une date est conservée : « (Paurenfeyndt) » est
 * une variante du nom, pas un commentaire.
 */
export function auteurCourt(brut?: string | null): string {
  let court = aplatir(brut);
  if (!court) return '';

  for (const separateur of [' ; ', ', ', '. '] as const) {
    const coupe = court.indexOf(separateur);
    if (coupe > 0) court = court.slice(0, coupe);
  }
  return nettoyerFin(court.replace(DATES_DE_VIE, ''));
}

/**
 * Année abrégée — « vers 1540 » plutôt que « vers 1540 (édition originale :
 * Modène, 1536) ».
 *
 * Le champ est en texte libre pour pouvoir rester prudent (« vers 1300-1330 ») :
 * cette prudence est précieuse et on n'y touche pas, on retire seulement la
 * parenthèse d'érudition, qui appartient à la fiche.
 */
export function anneeCourte(brut?: string | null): string {
  const texte = aplatir(brut);
  const parenthese = texte.indexOf(' (');
  return nettoyerFin(parenthese > 0 ? texte.slice(0, parenthese) : texte);
}

// ── Armes concernées ───────────────────────────────────────────────────────

/** Une arme travaillée par un traité, telle qu'on l'affiche. */
export interface ArmeLiee {
  slug: string;
  nom: string;
  /** Vrai si l'arme a une fiche publique — l'épée-bocle n'en a pas. */
  fiche: boolean;
}

const ORDRE_PAR_DEFAUT = 100;

/**
 * Les armes d'un traité, nommées depuis le catalogue et rangées dans son ordre.
 *
 * L'ordre vient des disciplines, pas de la saisie du traité : les mêmes armes
 * se présentent donc toujours dans la même suite, d'une fiche de traité à
 * l'autre comme dans la grille de l'accueil. Un slug qui ne correspond à aucune
 * discipline est ignoré — c'est le cas d'une arme retirée du catalogue, et une
 * pastille sans nom ne dit rien à personne.
 *
 * `fiche` reprend « Affichée dans la grille » : c'est le même filtre que
 * `getStaticPaths` de `/armes/[slug]`, donc la seule façon exacte de savoir si
 * `/armes/<slug>/` existe. Une arme sans fiche s'affiche sans lien plutôt que
 * de mener à une page absente.
 */
export function armesLiees(
  armes: readonly string[] | null | undefined,
  disciplines: readonly DisciplinePourArme[],
): ArmeLiee[] {
  const catalogue = new Map(disciplines.map((d) => [d.slug, d]));

  return (armes ?? [])
    .flatMap((slug) => {
      const discipline = catalogue.get(slug);
      const nom = discipline?.entry.nom?.trim();
      if (!discipline || !nom) return [];
      return [
        {
          slug,
          nom,
          fiche: Boolean(discipline.entry.affichee),
          ordre: discipline.entry.ordre ?? ORDRE_PAR_DEFAUT,
        },
      ];
    })
    .sort((a, b) => a.ordre - b.ordre || a.nom.localeCompare(b.nom, 'fr'))
    .map(({ slug, nom, fiche }) => ({ slug, nom, fiche }));
}

// ── Tri ────────────────────────────────────────────────────────────────────

/**
 * Ordre d'affichage d'une liste de traités — même règle que `traitesTries()` de
 * `src/lib/contenu.ts`, disponible ici pour un sous-ensemble déjà filtré.
 *
 * `ordre` d'abord, titre ensuite : deux fiches saisies avec le même numéro ne
 * changent pas de place d'un build à l'autre. Un ordre absent passe en dernier.
 */
export function trierTraites<T extends EntreeTraite>(traites: readonly T[]): T[] {
  return [...traites].sort(
    (a, b) =>
      (a.entry.ordre ?? Number.MAX_SAFE_INTEGER) - (b.entry.ordre ?? Number.MAX_SAFE_INTEGER) ||
      a.entry.titre.localeCompare(b.entry.titre, 'fr'),
  );
}
