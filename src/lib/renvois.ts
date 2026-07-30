/**
 * Cibles du widget « Renvoi vers une page du site ».
 *
 * Le widget de circulation ne stocke qu'un type et un slug (widgets.md §3.4) :
 * tout le reste de la carte — le visuel, le titre, le sous-titre, le sur-titre,
 * l'adresse — vient **du contenu réel de la page visée**, résolu ici, au build.
 * Un renvoi ne peut donc pas se désynchroniser de sa cible : renommer une arme
 * renomme la carte qui y mène.
 *
 * Aucun crédit d'image n'est porté par une carte de renvoi : c'est une vignette
 * de navigation, et la page visée porte l'attribution complète. Pour un traité,
 * c'est ce qu'autorise explicitement CC BY 4.0 §3.a.2, et c'est déjà la règle de
 * la page de liste des sources (ARCHITECTURE.md §6).
 *
 * Le module est **pur** : il reçoit les collections en paramètre et ne lit rien
 * lui-même (multi-ecoles.md §6.6, invariants 3 et 4).
 */
import {
  anneeCourte,
  auteurCourt,
  plancheVedetteResolue,
} from '../components/sources/traites';
import type { TypeRenvoi } from '../cms/widgets';
import type { EcoleConfig } from '../config/ecoles';
import type { Article, Discipline, Prof, Traite } from './contenu';
import { cadrageCss, resoudrePhoto } from './images';
import { lien, lienArme, lienArticle, lienProf } from './liens';
import { typographieFr } from './typographie';

/**
 * Les quatre destinations d'un renvoi.
 *
 * Le type est **celui du schéma CMS** (`src/cms/widgets.ts`), réexporté ici pour
 * que les gabarits n'aient qu'un module à connaître : deux définitions
 * parallèles finiraient par diverger le jour où une cinquième destination
 * apparaîtrait. L'import est purement typé, donc effacé à la compilation.
 */
export type { TypeRenvoi };

/** Une page atteignable par un renvoi, prête à rendre en `MediaCard`. */
export interface CibleRenvoi {
  /** Clé d'index : `${type}:${slug}`. */
  cle: string;
  type: TypeRenvoi;
  slug: string;
  href: string;
  titre: string;
  sousTitre: string;
  eyebrow: string;
  image: ImageMetadata | null;
  alt: string;
  objectPosition: string;
  libelleLien: string;
}

/**
 * Libellés des catégories d'article — repris de la page `/actualites/<slug>/`,
 * déplacés ici parce que la carte de renvoi les affiche aussi (widgets.md §3.4).
 * Ils doivent rester d'accord avec le champ « Catégorie » de `keystatic.config.ts`.
 */
export const CATEGORIES_ARTICLES: Record<string, string> = {
  'vie-du-club': 'Vie du club',
  tournoi: 'Tournoi',
  stage: 'Stage',
  sources: 'Sources & technique',
  materiel: 'Matériel',
};

/** Libellé affichable d'une catégorie d'article. Vide si la clé est inconnue. */
export const libelleCategorie = (valeur?: string | null): string =>
  CATEGORIES_ARTICLES[valeur ?? ''] ?? '';

/**
 * Comment on nomme chaque type dans un message d'erreur destiné au rédacteur.
 * L'article défini fait partie du libellé : une phrase d'erreur doit se lire.
 */
const NOM_DU_TYPE: Record<TypeRenvoi, string> = {
  arme: 'l’arme',
  traite: 'le traité de la bibliothèque',
  encadrant: 'l’encadrant',
  article: 'l’article',
};

/** Clé d'index d'une cible. */
export const cleRenvoi = (type: TypeRenvoi, slug: string): string => `${type}:${slug}`;

/**
 * Coupe un texte sur un mot — le chapô d'un article tient rarement dans le
 * sous-titre d'une carte. Aucun point de suspension n'est ajouté quand la coupe
 * tombe sur une fin de phrase.
 */
function tronquer(texte: string, longueur: number): string {
  if (texte.length <= longueur) return texte;
  const coupe = texte.slice(0, longueur);
  const espace = coupe.lastIndexOf(' ');
  const garde = espace > longueur * 0.5 ? coupe.slice(0, espace) : coupe;
  return `${garde.replace(/[\s,;:.–—-]+$/, '')}…`;
}

export interface EntreesRenvois {
  ecole: EcoleConfig;
  disciplines: readonly Discipline[];
  traites: readonly Traite[];
  profs: readonly Prof[];
  articles: readonly Article[];
}

/**
 * Toutes les pages qu'un renvoi peut viser, dans l'école servie.
 *
 * Le filtre de chaque type est **exactement** celui du `getStaticPaths` de la
 * page correspondante : une arme non affichée, un encadrant masqué ou un
 * brouillon n'ont pas d'adresse sur le site, et n'entrent donc pas dans
 * l'index. C'est ce qui permet au garde-fou n° 9 de refuser un renvoi cassé
 * plutôt que de publier un lien mort.
 */
export function indexRenvois({
  ecole,
  disciplines,
  traites,
  profs,
  articles,
}: EntreesRenvois): CibleRenvoi[] {
  const cibles: CibleRenvoi[] = [];

  for (const arme of disciplines) {
    if (!arme.entry.affichee) continue;
    cibles.push({
      cle: cleRenvoi('arme', arme.slug),
      type: 'arme',
      slug: arme.slug,
      href: lienArme(ecole, arme.slug),
      titre: typographieFr(arme.entry.nom),
      sousTitre: typographieFr(arme.entry.sousTitre),
      eyebrow: typographieFr(arme.entry.epoque),
      image: resoudrePhoto(arme.entry.photo?.fichier),
      alt: arme.entry.photo?.alt ?? '',
      objectPosition: cadrageCss(arme.entry.photo?.cadrage),
      libelleLien: 'Découvrir l’arme',
    });
  }

  for (const traite of traites) {
    // Toutes les fiches de traité existent : la collection n'a pas de champ
    // « affiché », et `/sources/<slug>/` est généré pour chacune.
    const planche = plancheVedetteResolue(traite.entry.planches);
    cibles.push({
      cle: cleRenvoi('traite', traite.slug),
      type: 'traite',
      slug: traite.slug,
      href: lien(ecole, `/sources/${traite.slug}/`),
      titre: typographieFr(traite.entry.titre),
      sousTitre: [auteurCourt(traite.entry.auteur), anneeCourte(traite.entry.annee)]
        .filter(Boolean)
        .join(' · '),
      eyebrow: 'Les sources',
      image: planche?.source ?? null,
      alt: planche?.alt ?? '',
      // Une planche se montre entière : elle n'est pas cadrée comme une photo.
      objectPosition: cadrageCss(null),
      libelleLien: 'Étudier la source',
    });
  }

  for (const prof of profs) {
    if (!prof.entry.visible) continue;
    cibles.push({
      cle: cleRenvoi('encadrant', prof.slug),
      type: 'encadrant',
      slug: prof.slug,
      href: lienProf(ecole, prof.slug),
      titre: typographieFr(prof.entry.nom),
      sousTitre: typographieFr(prof.entry.accroche),
      eyebrow: 'Les profs',
      image: resoudrePhoto(prof.entry.portrait?.fichier),
      alt: prof.entry.portrait?.alt ?? '',
      objectPosition: cadrageCss(prof.entry.portrait?.cadrage),
      libelleLien: 'Voir la fiche',
    });
  }

  for (const article of articles) {
    if (article.entry.statut !== 'publie') continue;
    cibles.push({
      cle: cleRenvoi('article', article.slug),
      type: 'article',
      slug: article.slug,
      href: lienArticle(ecole, article.slug),
      titre: typographieFr(article.entry.titre),
      sousTitre: tronquer(typographieFr(article.entry.chapo), 120),
      eyebrow: libelleCategorie(article.entry.categorie),
      image: resoudrePhoto(article.entry.couverture?.fichier),
      alt: article.entry.couverture?.alt ?? '',
      objectPosition: cadrageCss(article.entry.couverture?.cadrage),
      libelleLien: 'Lire l’article',
    });
  }

  return cibles;
}

/** Les slugs disponibles pour un type — cités quand un renvoi est cassé. */
export function slugsDisponibles(
  renvois: readonly CibleRenvoi[],
  type: TypeRenvoi,
): string[] {
  return renvois.filter((cible) => cible.type === type).map((cible) => cible.slug);
}

/**
 * « 1ᵉʳ bloc du texte », « 4ᵉ bloc du texte » — ce que le rédacteur compte à
 * l'œil dans l'admin. Même formulation que le garde-fou n° 9
 * (`src/lib/validation.ts`) : les deux chemins signalent la même faute au même
 * endroit, ils doivent la nommer pareil.
 */
const rangDuBloc = (index: number): string =>
  `${index + 1}${index === 0 ? 'ᵉʳ' : 'ᵉ'} bloc du texte`;

/**
 * Résout la cible d'un widget « Renvoi », ou **casse le build**.
 *
 * Les deux fautes possibles ont leur message (widgets.md §5, sous-règles 9a et
 * 9b) : une carte muette ou un lien mort en production seraient l'un et l'autre
 * pires qu'un build refusé.
 *
 * En pratique le garde-fou n° 9 les attrape avant, parce qu'il tourne dans le
 * frontmatter de `Base.astro` — donc dès la première page construite, avant tout
 * corps. Ces deux messages restent le filet du dessous : ils s'affichent si le
 * contrôle est un jour désactivé, ou si un gabarit rend un corps sans passer par
 * `Base`.
 */
export function resoudreRenvoi(
  renvois: readonly CibleRenvoi[],
  widget: { type: TypeRenvoi | ''; slug: string },
  source: string,
  rang: number,
): CibleRenvoi {
  const ou = `${source} › ${rangDuBloc(rang)}`;

  if (!widget.type || !widget.slug) {
    throw new Error(
      `Renvoi sans destination — ${ou}.\n` +
        'Choisir une page dans la liste déroulante du widget, ou supprimer le widget.',
    );
  }

  const cible = renvois.find((c) => c.cle === cleRenvoi(widget.type as TypeRenvoi, widget.slug));
  if (cible) return cible;

  const disponibles = slugsDisponibles(renvois, widget.type);
  throw new Error(
    `Renvoi cassé — ${ou}.\n` +
      `La carte pointe vers ${NOM_DU_TYPE[widget.type]} « ${widget.slug} », ` +
      'qui n’a pas de page sur le site.\n' +
      (disponibles.length > 0
        ? `Pages disponibles pour ce type : ${disponibles.join(', ')}.`
        : 'Aucune page de ce type n’est publiée : choisir un autre type de renvoi.'),
  );
}
