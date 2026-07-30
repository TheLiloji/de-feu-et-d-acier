/**
 * Rendu des corps Markdoc en HTML — **au build, jamais au runtime**.
 *
 * Les champs longs du CMS (`fields.markdoc`) ne sont pas rendus par le Reader
 * Keystatic : il renvoie l'arbre analysé (`{ node }`). La conversion se fait
 * ici, dans Node, pendant le pré-rendu des pages.
 *
 * Ce module a été créé à l'intégration pour réunir trois implémentations
 * identiques écrites en parallèle (`src/components/fiches/bio.ts`, et une copie
 * locale dans `Faq.astro` et `Partenaires.astro`).
 *
 * ⚠️ **Ce rendu ne sait pas afficher les widgets de corps libre.** Les quatre
 * champs qui les acceptent (biographie d'un encadrant, description longue d'une
 * arme, contenu d'un article, présentation d'un traité) passent par
 * `src/components/corps/CorpsLibre.astro`, qui découpe l'arbre avant de le
 * rendre (`src/lib/corps.ts`). Ce module-ci sert les textes riches **sans
 * widget** : réponses de FAQ et présentations de partenaires.
 *
 * Il y a un second bénéfice, moins évident : les assertions `as any` de ce
 * rendu, quand elles vivaient dans le frontmatter d'un `.astro`, mettaient en
 * échec la détection de l'interface `Props` par le compilateur Astro — le
 * composant se retrouvait typé `Record<string, any>` et ses props n'étaient
 * plus vérifiées à l'appel. Les garder dans un `.ts` supprime le problème.
 *
 * Sécurité : le renderer HTML de Markdoc échappe le texte et ne laisse passer
 * que les nœuds autorisés par le schéma du champ (gras, italique, liens,
 * listes — ni image, ni code, ni HTML brut, cf. `texteRiche` de
 * `keystatic.config.ts`). Le contenu vient d'un dépôt git dont les rédacteurs
 * sont des collaborateurs : `set:html` est ici légitime.
 */
import Markdoc from '@markdoc/markdoc';

/** Ce que renvoie un champ markdoc du Reader Keystatic (`await entree.bio()`). */
export interface CorpsMarkdoc {
  node: unknown;
}

/** Vrai si le nœud rendu est le `<article>` que Markdoc pose autour d'un document. */
function estArticle(bloc: unknown): boolean {
  return (
    typeof bloc === 'object' &&
    bloc !== null &&
    'name' in bloc &&
    (bloc as { name?: string }).name === 'article'
  );
}

/**
 * Message du garde-fou : un widget dans un champ qui ne sait pas les afficher.
 *
 * Le libellé des widgets est ici en toutes lettres, et non importé de
 * `src/cms/widgets.ts` : ce module est chargé par la FAQ et les partenaires,
 * qui n'ont aucune raison de tirer `@keystatic/core` dans leur graphe.
 */
function erreurWidget(source: string): Error {
  return new Error(
    `Un widget se trouve dans un champ qui ne sait pas les afficher — ${source}.\n` +
      'Les widgets (galerie, vidéo, questions-réponses, renvoi, bouton, planche) ' +
      'ne sont acceptés que dans la biographie d’un encadrant, la description longue ' +
      'd’une arme, le contenu d’un article et la présentation d’un traité.',
  );
}

/**
 * Refuse tout nœud `tag` de l'arbre.
 *
 * Sans cette passe, `Markdoc.transform` appelé **sans configuration** supprime
 * les tags qu'il ne connaît pas, sans un mot : `findSchema` renvoie `{}`, et
 * `if (!schema || !schema.render) return children` rend les enfants — or un
 * widget est un tag auto-fermant, donc sans enfant. Le bloc disparaîtrait de la
 * page sans erreur ni avertissement, ce qui est le pire résultat possible
 * (widgets.md §1.5 et §4.5).
 */
function refuserWidgets(noeud: unknown, source: string): void {
  if (Array.isArray(noeud)) {
    for (const enfant of noeud) refuserWidgets(enfant, source);
    return;
  }
  if (!noeud || typeof noeud !== 'object') return;

  const n = noeud as { type?: string; children?: unknown };
  if (n.type === 'tag') throw erreurWidget(source);
  if (Array.isArray(n.children)) {
    for (const enfant of n.children) refuserWidgets(enfant, source);
  }
}

/**
 * Arbre Markdoc → fragment HTML.
 *
 * Le `<article>` racine posé par `transform` est retiré : la sémantique est
 * portée par la page (une fiche prof est déjà un `<article>`, une réponse de
 * FAQ vit dans un `<details>`). Imbriquer les deux brouillerait le plan du
 * document.
 *
 * @param source Chemin du fichier et nom du champ, cités en cas de widget mal
 *               placé. Facultatif, mais toujours utile : c'est la seule
 *               indication que reçoit le rédacteur.
 */
export function rendreMarkdoc(noeud: unknown, source = 'un texte du CMS'): string {
  if (noeud === null || noeud === undefined) return '';

  refuserWidgets(noeud, source);

  const rendu = Markdoc.transform(noeud as never);
  const blocs = Array.isArray(rendu) ? rendu : [rendu];

  return blocs
    .map((bloc) => {
      const contenu = estArticle(bloc)
        ? ((bloc as { children?: unknown[] }).children ?? [])
        : bloc;
      return Markdoc.renderers.html(contenu as never);
    })
    .join('');
}

/** Même chose, à partir de l'objet `{ node }` rendu par le lecteur. */
export function rendreCorps(
  corps: CorpsMarkdoc | null | undefined,
  source = 'un texte du CMS',
): string {
  return corps?.node ? rendreMarkdoc(corps.node, source) : '';
}

/**
 * Version texte brut d'un fragment HTML — pour la meta description et
 * l'OpenGraph. Aucune balise, espaces normalisés, coupé proprement sur un mot.
 */
export function corpsEnTexte(html: string, longueur = 155): string {
  const texte = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

  if (texte.length <= longueur) return texte;
  const coupe = texte.slice(0, longueur);
  const espace = coupe.lastIndexOf(' ');
  return `${(espace > 40 ? coupe.slice(0, espace) : coupe).replace(/[\s,;:.–—-]+$/, '')}…`;
}
