/**
 * Typographie française — normalisation appliquée **au rendu**, jamais à la
 * saisie.
 *
 * Pourquoi ici plutôt que dans les fichiers de contenu : un client qui écrit
 * « Faut-il déjà faire du sport ? » dans Keystatic tape une espace ordinaire,
 * et une apostrophe droite dans « l'épée ». Corriger les fichiers un par un ne
 * tient pas : la faute revient à chaque saisie. On corrige donc au passage,
 * dans le seul goulot par lequel tout le texte du CMS transite déjà —
 * `resoudre()` de `src/lib/raccourcis.ts` (cf. ARCHITECTURE.md §7 : les
 * garde-fous vivent dans le code, pas dans la discipline des rédacteurs).
 *
 * Ce qui est normalisé
 * --------------------
 *   - **apostrophe** : `'` → `’` (U+2019) après une lettre ou un chiffre —
 *     « l'épée » → « l’épée ». À 44 px en Cormorant, l'apostrophe droite se
 *     rend comme une prime détachée qui jure avec le dessin de la fonte ;
 *   - **ponctuation haute** `? ! ;` : l'espace qui la précède devient une
 *     **espace fine insécable** (U+202F) — plus de « ? » orphelin en début de
 *     ligne dans une question de FAQ ;
 *   - **deux-points** `:` : espace **insécable** ordinaire (U+00A0). C'est la
 *     règle de l'Imprimerie nationale — fine devant `; ! ?`, espace-mot devant
 *     `:` — et c'est aussi le choix le plus sûr : le deux-points est la seule
 *     de ces ponctuations qui apparaisse dans des chaînes techniques ;
 *   - **guillemets** `« »` : une fine insécable à l'intérieur, dans les deux
 *     sens — plus de « » » seul en tête de ligne.
 *
 * Ce qui ne l'est **pas**, volontairement
 * ---------------------------------------
 *   - **aucune espace n'est créée** là où le rédacteur n'en a pas mis : seules
 *     les espaces existantes sont converties. C'est ce qui protège « 18:30 »,
 *     « https:// », « mailto: » et « L'Imaginarium! » d'une transformation non
 *     désirée ;
 *   - l'intérieur des balises HTML, ainsi que le contenu de `<code>`, `<pre>`,
 *     `<kbd>`, `<samp>`, `<script>` et `<style>` : un `href="mailto:…"` ne doit
 *     jamais recevoir d'espace insécable. D'où les deux fonctions ci-dessous —
 *     `typographieFr` pour une chaîne nue, `typographieFrHtml` pour un fragment
 *     rendu depuis markdoc.
 *
 * U+202F et U+00A0 appartiennent tous deux au sous-ensemble `latin` des polices
 * chargées (`unicode-range: … U+2000-206F …`, cf. Fontsource) : aucun caractère
 * de substitution n'apparaît, ni en Cormorant Garamond, ni en Inter.
 */

/** Espace fine insécable (U+202F) — avant `? ! ;` et à l'intérieur des `« »`. */
export const FINE = ' ';

/** Espace insécable ordinaire (U+00A0) — avant `:`, et devant une unité. */
export const INSECABLE = ' ';

/** Toutes les formes d'espace qu'on accepte de convertir (le retour à la ligne
    n'en fait pas partie : il est éditorial, on n'y touche pas). */
const ESPACES = '[ \\t\\u00A0\\u202F\\u2009]';

const APOSTROPHE = /([\p{L}\p{N}])'/gu;
const AVANT_PONCTUATION_HAUTE = new RegExp(`${ESPACES}+([?!;])`, 'g');
const AVANT_DEUX_POINTS = new RegExp(`${ESPACES}+:`, 'g');
const APRES_GUILLEMET_OUVRANT = new RegExp(`«${ESPACES}*`, 'g');
const AVANT_GUILLEMET_FERMANT = new RegExp(`${ESPACES}*»`, 'g');

/**
 * Normalise une chaîne de **texte nu** (titre, chapô, libellé, question).
 *
 * Idempotente : la repasser sur un texte déjà normalisé ne change rien.
 */
export function typographieFr(texte: string | null | undefined): string {
  if (!texte) return '';
  return texte
    .replace(APOSTROPHE, '$1’')
    .replace(APRES_GUILLEMET_OUVRANT, `«${FINE}`)
    .replace(AVANT_GUILLEMET_FERMANT, `${FINE}»`)
    .replace(AVANT_PONCTUATION_HAUTE, `${FINE}$1`)
    .replace(AVANT_DEUX_POINTS, `${INSECABLE}:`);
}

/** Balises dont le contenu est littéral : on n'y touche pas. */
const BALISES_LITTERALES = new Set(['code', 'pre', 'kbd', 'samp', 'script', 'style']);

/**
 * Normalise un **fragment HTML** : seuls les nœuds texte sont traités, jamais
 * l'intérieur d'une balise. Même technique que `lierEmail()` dans `Faq.astro` —
 * on découpe sur les balises et on ne touche qu'un morceau sur deux.
 *
 * Sur une chaîne sans balise, se comporte exactement comme `typographieFr`.
 */
export function typographieFrHtml(html: string | null | undefined): string {
  if (!html) return '';
  if (!html.includes('<')) return typographieFr(html);

  let profondeurLitterale = 0;

  return html
    .split(/(<[^>]*>)/)
    .map((morceau) => {
      const estBalise = morceau.length > 1 && morceau.startsWith('<') && morceau.endsWith('>');

      if (estBalise) {
        const fermante = /^<\/\s*([a-zA-Z][\w:-]*)/.exec(morceau);
        if (fermante) {
          if (BALISES_LITTERALES.has(fermante[1]!.toLowerCase())) {
            profondeurLitterale = Math.max(0, profondeurLitterale - 1);
          }
          return morceau;
        }

        const ouvrante = /^<\s*([a-zA-Z][\w:-]*)/.exec(morceau);
        if (
          ouvrante &&
          !morceau.endsWith('/>') &&
          BALISES_LITTERALES.has(ouvrante[1]!.toLowerCase())
        ) {
          profondeurLitterale += 1;
        }
        return morceau;
      }

      return profondeurLitterale > 0 ? morceau : typographieFr(morceau);
    })
    .join('');
}
