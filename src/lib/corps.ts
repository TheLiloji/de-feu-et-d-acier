/**
 * Corps libres — découpage de l'arbre Markdoc en prose et en widgets.
 *
 * Quatre champs du CMS acceptent des widgets insérés au fil du texte
 * (widgets.md §0) : la biographie d'un encadrant, la description longue d'une
 * arme, le contenu d'un article et la présentation d'un traité. Le lecteur
 * Keystatic en renvoie l'arbre analysé (`{ node }`), dans lequel un widget
 * apparaît comme un nœud `tag` enfant direct du `document`.
 *
 * Ce module ne fait que **lire** cet arbre : il le découpe en une suite de
 * blocs, dans l'ordre de saisie, et refuse ce qui ne s'afficherait pas. Le
 * rendu, lui, appartient à `src/components/corps/CorpsLibre.astro`.
 *
 * ⚠️ **Aucune dépendance à `astro:assets`** : ce module est aussi importable
 * depuis les garde-fous du build (`src/lib/validation.ts`), qui tournent dans
 * Node sans pipeline d'images.
 *
 * ⚠️ **`Markdoc.transform` mange les tags qu'il ne connaît pas** — sans erreur
 * ni avertissement (widgets.md §1.5). C'est la raison d'être du découpage : un
 * corps qui traverserait `rendreMarkdoc()` perdrait ses widgets en silence.
 * D'où, ici, deux refus explicites (widget inconnu, widget imbriqué) et, dans
 * `src/lib/markdoc.ts`, une levée sur tout nœud `tag`.
 */
import {
  LIBELLES_WIDGETS,
  NOMS_WIDGETS,
  TYPES_RENVOI,
  estNomWidget,
  type NomWidget,
  type TypeRenvoi,
} from '../cms/widgets';
import { corpsEnTexte, rendreMarkdoc } from './markdoc';

/**
 * Vue minimale d'un nœud Markdoc.
 *
 * On ne type ici que ce qu'on lit — les nœuds sont des instances `Ast.Node`
 * dont `Markdoc.transform` appelle les méthodes, et qu'on se garde bien de
 * recopier ou de faire voyager comme données (widgets.md §6.4).
 */
export interface NoeudCorps {
  type?: string;
  tag?: string;
  attributes?: Record<string, unknown> | null;
  children?: readonly NoeudCorps[] | null;
}

/** Un morceau de corps : soit un run de prose, soit un widget. */
export type BlocCorps =
  | { type: 'prose'; noeuds: readonly unknown[] }
  | { type: 'widget'; nom: NomWidget; attributs: Record<string, unknown>; rang: number };

// ── Messages ────────────────────────────────────────────────────────────────
//
// Ils disent quoi corriger et où : le rédacteur ne lit pas un AST, il voit le
// n-ième bloc de son texte dans l'admin (widgets.md §5).

/** Sous-règle 9e — un tag qui ne correspond à aucun widget. */
export function erreurWidgetInconnu(nom: string, source: string): Error {
  return new Error(
    `Widget inconnu « ${nom} » — ${source}.\n` +
      `Widgets disponibles : ${NOMS_WIDGETS.join(', ')}.\n` +
      'Ce bloc ne s’afficherait pas sur le site.',
  );
}

/** Sous-règle 9f — un widget posé dans une citation ou dans une puce. */
export function erreurWidgetMalPlace(nom: NomWidget, source: string): Error {
  return new Error(
    `Widget mal placé « ${LIBELLES_WIDGETS[nom]} » — ${source}.\n` +
      'Un widget se pose entre deux paragraphes, jamais à l’intérieur d’une ' +
      'citation ou d’une liste.',
  );
}

// ── Découpage ───────────────────────────────────────────────────────────────

const enfantsDe = (noeud: NoeudCorps): readonly NoeudCorps[] =>
  Array.isArray(noeud.children) ? noeud.children : [];

/**
 * Le run porte-t-il quelque chose à afficher ?
 *
 * Deux widgets qui se suivent laissent entre eux un run de prose fait d'un
 * paragraphe vide (le formateur Markdoc sépare les tags par une ligne blanche).
 * Le rendre produirait un `<p></p>` et un blanc de plus dans le rythme.
 */
function porteDuContenu(noeud: NoeudCorps): boolean {
  if (noeud.type === 'hr' || noeud.type === 'image') return true;
  if (noeud.type === 'text' || noeud.type === 'code' || noeud.type === 'fence') {
    return String(noeud.attributes?.content ?? '').trim().length > 0;
  }
  return enfantsDe(noeud).some(porteDuContenu);
}

/** Refuse un widget rencontré ailleurs qu'au premier niveau du document. */
function refuserWidgetsImbriques(noeuds: readonly NoeudCorps[], source: string): void {
  for (const noeud of noeuds) {
    if (!noeud || typeof noeud !== 'object') continue;
    if (noeud.type === 'tag') {
      const nom = String(noeud.tag ?? '');
      throw estNomWidget(nom)
        ? erreurWidgetMalPlace(nom, source)
        : erreurWidgetInconnu(nom, source);
    }
    refuserWidgetsImbriques(enfantsDe(noeud), source);
  }
}

/**
 * Découpe un corps Markdoc en runs de prose et en widgets, dans l'ordre.
 *
 * Le `rang` d'un widget est son index parmi les enfants du document : stable
 * d'un build à l'autre, il sert à fabriquer les `id` de visionneuse et les
 * `idTitre`, et c'est lui que citent les messages d'erreur.
 *
 * @param source Chemin du fichier et nom du champ, cités dans les messages.
 */
export function decouperCorps(node: unknown, source: string): BlocCorps[] {
  if (!node || typeof node !== 'object') return [];

  const enfants = enfantsDe(node as NoeudCorps);
  const blocs: BlocCorps[] = [];
  let courant: NoeudCorps[] = [];

  const viderProse = () => {
    if (courant.length === 0) return;
    const noeuds = courant;
    courant = [];
    refuserWidgetsImbriques(noeuds, source);
    if (noeuds.some(porteDuContenu)) blocs.push({ type: 'prose', noeuds });
  };

  enfants.forEach((enfant, rang) => {
    if (!enfant || typeof enfant !== 'object') return;

    if (enfant.type === 'tag') {
      viderProse();
      const nom = String(enfant.tag ?? '');
      if (!estNomWidget(nom)) throw erreurWidgetInconnu(nom, source);
      blocs.push({
        type: 'widget',
        nom,
        attributs: (enfant.attributes ?? {}) as Record<string, unknown>,
        rang,
      });
      return;
    }

    courant.push(enfant);
  });

  viderProse();
  return blocs;
}

/**
 * Texte brut des seuls runs de prose — méta description et OpenGraph.
 *
 * Les widgets n'y entrent pas : une méta description qui commencerait par le
 * titre d'une vidéo ou par la légende d'une planche ne dirait pas de quoi la
 * page parle.
 */
export function texteDuCorps(
  node: unknown,
  longueur = 155,
  source = 'un corps de page',
): string {
  const html = decouperCorps(node, source)
    .filter((bloc): bloc is Extract<BlocCorps, { type: 'prose' }> => bloc.type === 'prose')
    .map((bloc) => rendreMarkdoc(bloc.noeuds, source))
    .join(' ');

  return corpsEnTexte(html, longueur);
}

// ── Lecture des attributs d'un widget ───────────────────────────────────────
//
// Un `.mdoc` peut avoir été écrit à la main, ou dater d'une version antérieure
// du schéma : rien de ce que le lecteur renvoie n'est validé (widgets.md §1.4).
// Ces fonctions ramènent chaque attribut à un type sûr, sans jamais lever — les
// fautes de contenu, elles, sont l'affaire du garde-fou n° 9.

const texte = (valeur: unknown): string => (typeof valeur === 'string' ? valeur : '');

const objets = (valeur: unknown): Record<string, unknown>[] =>
  Array.isArray(valeur)
    ? valeur.filter(
        (item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object',
      )
    : [];

/** Une photo de galerie, telle que l'admin l'enregistre. */
export interface PhotoGalerieWidget {
  image: string;
  description: string;
  cadrage: string;
  credit: string;
}

export interface WidgetGalerie {
  mode: 'grille' | 'carrousel';
  photos: PhotoGalerieWidget[];
}

export function lireGalerie(attributs: Record<string, unknown>): WidgetGalerie {
  return {
    mode: attributs.mode === 'carrousel' ? 'carrousel' : 'grille',
    photos: objets(attributs.photos).map((photo) => ({
      image: texte(photo.image),
      description: texte(photo.description),
      cadrage: texte(photo.cadrage),
      credit: texte(photo.credit),
    })),
  };
}

export interface WidgetVideo {
  titre: string;
  url: string;
  duree: string;
  vignette: string;
  sousTitres: string;
  affiche: string;
}

export function lireVideo(attributs: Record<string, unknown>): WidgetVideo {
  return {
    titre: texte(attributs.titre),
    url: texte(attributs.url),
    duree: texte(attributs.duree),
    vignette: texte(attributs.vignette),
    sousTitres: texte(attributs.sousTitres),
    affiche: texte(attributs.affiche),
  };
}

export interface WidgetQuestions {
  titre: string;
  questions: { question: string; reponse: string }[];
}

export function lireQuestions(attributs: Record<string, unknown>): WidgetQuestions {
  return {
    titre: texte(attributs.titre),
    questions: objets(attributs.questions).map((qr) => ({
      question: texte(qr.question),
      reponse: texte(qr.reponse),
    })),
  };
}

export interface WidgetRenvoi {
  /** Vide tant qu'aucun type n'a été choisi — le cas ne devrait pas exister. */
  type: TypeRenvoi | '';
  /** Vide tant qu'aucune entrée n'est choisie : c'est la faute 9b. */
  slug: string;
  libelle: string;
}

const TYPES: readonly string[] = TYPES_RENVOI;

export function lireRenvoi(attributs: Record<string, unknown>): WidgetRenvoi {
  const brut = attributs.cible;
  const cible = (brut && typeof brut === 'object' ? brut : {}) as Record<string, unknown>;
  const type = texte(cible.discriminant);

  return {
    type: TYPES.includes(type) ? (type as TypeRenvoi) : '',
    slug: texte(cible.value),
    libelle: texte(attributs.libelle),
  };
}

export interface WidgetBouton {
  libelle: string;
  url: string;
  variante: 'pleine' | 'contour';
}

export function lireBouton(attributs: Record<string, unknown>): WidgetBouton {
  return {
    libelle: texte(attributs.libelle),
    url: texte(attributs.url),
    variante: attributs.variante === 'pleine' ? 'pleine' : 'contour',
  };
}

export interface WidgetPlanche {
  image: string;
  alt: string;
  legende: string;
  credit: string;
}

export function lirePlanche(attributs: Record<string, unknown>): WidgetPlanche {
  return {
    image: texte(attributs.image),
    alt: texte(attributs.alt),
    legende: texte(attributs.legende),
    credit: texte(attributs.credit),
  };
}
