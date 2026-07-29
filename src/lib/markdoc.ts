/**
 * Rendu des corps Markdoc en HTML — **au build, jamais au runtime**.
 *
 * Les champs longs du CMS (`fields.markdoc`) ne sont pas rendus par le Reader
 * Keystatic : il renvoie l'arbre analysé (`{ node }`). La conversion se fait
 * ici, dans Node, pendant le pré-rendu des pages.
 *
 * Ce module a été créé à l'intégration pour réunir trois implémentations
 * identiques écrites en parallèle (`src/components/fiches/bio.ts`, et une copie
 * locale dans `Faq.astro` et `Partenaires.astro`). Deux autres rendus existent
 * encore ailleurs — `ArmeCorps.astro` et `actualites/[slug].astro` — mais ce ne
 * sont pas des doublons : ils parcourent l'arbre eux-mêmes pour en extraire les
 * images et les faire passer par `astro:assets`, ce que le renderer générique
 * ne sait pas faire.
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
 * Arbre Markdoc → fragment HTML.
 *
 * Le `<article>` racine posé par `transform` est retiré : la sémantique est
 * portée par la page (une fiche prof est déjà un `<article>`, une réponse de
 * FAQ vit dans un `<details>`). Imbriquer les deux brouillerait le plan du
 * document.
 */
export function rendreMarkdoc(noeud: unknown): string {
  if (noeud === null || noeud === undefined) return '';

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
export function rendreCorps(corps: CorpsMarkdoc | null | undefined): string {
  return corps?.node ? rendreMarkdoc(corps.node) : '';
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
