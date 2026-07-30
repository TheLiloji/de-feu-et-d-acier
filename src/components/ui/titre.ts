/**
 * Analyse des titres de section à ligne accentuée.
 *
 * Onze titres de la maquette suivent le même schéma : deux ou trois lignes de
 * Cormorant, dont **une** en `$ember` w300 italique (design-spec §9.3). La
 * coupure des lignes est éditoriale — « Une lame, un masque, / et l'envie de
 * bien faire. » n'est pas un retour automatique, c'est un choix d'auteur — et
 * l'accent ne porte pas toujours sur une ligne entière : dans les piliers
 * « Nous rejoindre », il porte sur un mot au milieu d'une phrase.
 *
 * D'où une convention de balisage minimale, écrite directement dans le champ
 * texte du CMS :
 *
 *   - un **retour à la ligne** sépare deux lignes du titre ;
 *   - `*…*` marque le fragment accentué (ember, italique, graisse 300) ;
 *   - `\*` écrit une astérisque littérale.
 *
 *   « Trois encadrants,\n*trois écoles.* »
 *   « Les deux premières séances sont *gratuites*, alors pourquoi pas ? »
 *
 * Rien d'autre n'est interprété : ni gras, ni liens, ni HTML. Un champ de titre
 * reste un titre.
 *
 * **Le marqueur a débordé du titre**, et c'est voulu : l'accroche d'un encadrant
 * l'emploie pour désigner la part de la ligne qui passe en or (`analyserLigne`,
 * plus bas). Une deuxième convention pour dire la même chose — « ce morceau-ci
 * est l'accent » — aurait été une convention de trop dans un CMS tenu par des
 * bénévoles. C'est donc le même balisage, le même parseur et les mêmes règles
 * d'échappement ; seule la peinture change d'un emploi à l'autre.
 *
 * **Typographie** : chaque fragment passe par `typographieFr`. La plupart des
 * titres arrivent déjà normalisés — ils transitent par `resoudre()`, qui le fait
 * pour tout le texte du CMS — mais pas tous : un nom d'arme, un nom d'encadrant
 * ou un titre d'article sont des données brutes, servies directement à
 * `SectionTitle`. Le filet est posé ici plutôt que chez chacun des appelants :
 * c'est le seul point par lequel passent les onze titres display du site, et la
 * fonction est idempotente — la repasser sur un texte déjà composé ne fait rien.
 */
import { typographieFr } from '../../lib/typographie';

export interface FragmentTitre {
  texte: string;
  accent: boolean;
}

export type LigneTitre = FragmentTitre[];

/** Entrée acceptée par la prop `lignes` de `SectionTitle`. */
export type EntreeLigne = string | { texte: string; accent?: boolean } | FragmentTitre[];

/**
 * Marqueur interne substitué aux `\*` le temps du découpage.
 * Caractère de contrôle U+0000 : il ne peut pas provenir d'un champ CMS.
 */
const SENTINELLE = '\u0000';

/**
 * Découpe une chaîne en lignes, chaque ligne en fragments accentués ou non.
 *
 * Les astérisques non appariées sont conservées telles quelles plutôt que de
 * faire échouer le rendu : un titre mal balisé s'affiche, il ne casse pas la
 * page. Le contrôle de cohérence est du ressort du script de validation.
 */
export function analyserTitre(source: string): LigneTitre[] {
  const protege = typographieFr(source).replace(/\\\*/g, SENTINELLE);

  return protege
    .split('\n')
    .map((ligne) => ligne.trim())
    .filter((ligne) => ligne.length > 0)
    .map((ligne) => decouperFragments(ligne));
}

function decouperFragments(ligne: string): LigneTitre {
  const morceaux = ligne.split('*');

  // Un nombre pair de morceaux signifie une astérisque orpheline : on rend la
  // ligne telle quelle, astérisques comprises, plutôt que d'accentuer au hasard.
  if (morceaux.length % 2 === 0) {
    return [{ texte: restaurer(ligne), accent: false }];
  }

  const fragments: LigneTitre = [];
  morceaux.forEach((morceau, index) => {
    if (morceau === '') return;
    fragments.push({ texte: restaurer(morceau), accent: index % 2 === 1 });
  });

  return fragments.length > 0 ? fragments : [{ texte: '', accent: false }];
}

function restaurer(texte: string): string {
  return texte.split(SENTINELLE).join('*');
}

/**
 * Normalise la prop `lignes` / `lines` vers la structure interne.
 *
 * Une entrée chaîne peut elle-même contenir des retours à la ligne et des
 * marqueurs `*…*` : elle produit alors plusieurs lignes, d'où le `flatMap`.
 */
export function normaliserLignes(entrees: EntreeLigne[]): LigneTitre[] {
  return entrees
    .flatMap((entree): LigneTitre[] => {
      // `analyserTitre` normalise déjà ; les deux autres formes sont des
      // fragments déjà découpés, qu'on compose ici pour la même raison.
      if (typeof entree === 'string') return analyserTitre(entree);
      if (Array.isArray(entree)) {
        return [entree.map((f) => ({ ...f, texte: typographieFr(f.texte) }))];
      }
      return [[{ texte: typographieFr(entree.texte), accent: entree.accent ?? false }]];
    })
    .filter((ligne) => ligne.length > 0);
}

/** Texte brut d'un titre — pour un `aria-label`, un `<title>` ou un test. */
export function texteBrut(lignes: LigneTitre[]): string {
  return lignes.map((ligne) => ligne.map((fragment) => fragment.texte).join('')).join(' ');
}

/**
 * Fragments d'un champ tenant sur **une seule ligne** — l'accroche d'un
 * encadrant, une ligne de punch.
 *
 * Même convention que les titres, et surtout **le même parseur** : `*…*` marque
 * le fragment mis en valeur, `\*` écrit une astérisque littérale, une astérisque
 * orpheline laisse la ligne intacte. Ce qui change n'est pas la syntaxe mais ce
 * que l'appelant en fait — le titre de section peint son accent en ember
 * italique, l'accroche de palmarès le peint en or.
 *
 * Un retour à la ligne saisi par erreur dans un champ d'une ligne ne coupe rien
 * ici : les lignes sont recollées, puisque la destination est un `<p>` unique.
 */
export function analyserLigne(source: string | null | undefined): LigneTitre {
  if (!source) return [];
  return analyserTitre(source).flat();
}

/**
 * Le texte d'un champ balisé, **marqueurs retirés**.
 *
 * Tout ce qui n'est pas le rendu visible d'un champ à fragments doit passer par
 * là : `<title>`, meta description, sous-titre d'une carte de renvoi. Un
 * `*` échappé au balisage se lirait sinon tel quel dans un résultat Google.
 */
export function texteSansMarqueurs(source: string | null | undefined): string {
  if (!source) return '';
  return texteBrut(analyserTitre(source));
}
