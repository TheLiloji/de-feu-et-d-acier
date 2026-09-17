/**
 * Normalisation française partagée — la même à l'index et à la requête.
 *
 * Un moteur lexical ne retrouve que ce qu'il a indexé **à l'identique** : si le
 * script d'index écrit « rapiere » et que la page interroge « rapière », rien
 * ne sort. D'où ce module unique, importé par les quatre points qui découpent
 * du texte en termes :
 *
 *   - `scripts/construire-index-ia.mjs` (l'index BM25, au build) ;
 *   - `src/ia/moteur.ts`                (la recherche, dans le Worker) ;
 *   - `src/lib/recherche.ts`            (les mots-clés des suggestions, au build) ;
 *   - `src/components/questions/ChercheQuestions.astro` (la frappe du visiteur).
 *
 * Fichier `.mjs` et non `.ts`, à dessein : le script d'index tourne dans Node
 * nu (`node scripts/construire-index-ia.mjs`), sans transpileur. Le TypeScript
 * du site l'importe sans friction (`allowJs` est actif), les types viennent de
 * la JSDoc.
 *
 * Ce que fait `tokeniser()` :
 *   1. minuscules, accents retirés (NFD), œ→oe, æ→ae ;
 *   2. apostrophes, traits d'union et ponctuation → séparateurs ;
 *   3. termes d'au moins 2 caractères [a-z0-9] ;
 *   4. pluriel plat : « s »/« x » final retiré au-delà de 3 lettres
 *      (« rapières » → « rapiere », « travaux » → « travau » — approximation
 *      assumée : la même règle s'applique des deux côtés, c'est tout ce qui
 *      compte) ;
 *   5. mots vides français écartés.
 */

/**
 * Mots vides, déjà passés par `plier()` (donc sans accents) : la liste se
 * compare après pliage.
 * @type {ReadonlySet<string>}
 */
export const MOTS_VIDES = new Set([
  'au', 'aux', 'avec', 'ce', 'ces', 'cet', 'cette', 'comme', 'dans', 'de',
  'des', 'donc', 'dont', 'du', 'elle', 'elles', 'en', 'entre', 'est', 'et',
  'etait', 'etaient', 'ete', 'etre', 'il', 'ils', 'je', 'la', 'le', 'les',
  'leur', 'leurs', 'lui', 'mais', 'me', 'meme', 'memes', 'mes', 'mon', 'ma',
  'ne', 'ni', 'nos', 'notre', 'nous', 'on', 'ont', 'or', 'ou', 'par', 'pas',
  'plus', 'pour', 'que', 'qui', 'quoi', 'sa', 'se', 'ses', 'son', 'sont',
  'sous', 'sur', 'ta', 'te', 'tes', 'ton', 'tout', 'toute', 'toutes', 'tous',
  'tres', 'tu', 'un', 'une', 'vos', 'votre', 'vous', 'avait', 'avaient',
  'aussi', 'bien', 'cela', 'ceux', 'chez', 'deja', 'peut', 'sans', 'si',
  'ainsi', 'alors', 'apres', 'avant', 'autre', 'autres', 'car', 'ci', 'contre',
  'encore', 'enfin', 'ensuite', 'fait', 'fois', 'ici', 'jamais', 'lors',
  'moins', 'puis', 'quand', 'sont', 'soit', 'toujours', 'vers', 'y', 'etant',
  'sera', 'seront', 'fut', 'furent', 'peu', 'dire', 'dit', 'cependant',
]);

/**
 * Plie une chaîne : minuscules, accents retirés, ligatures dépliées.
 * @param {string} texte
 * @returns {string}
 */
export function plier(texte) {
  return texte
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/**
 * Découpe un texte en termes normalisés, mots vides écartés.
 * @param {string} texte
 * @returns {string[]}
 */
export function tokeniser(texte) {
  const termes = plier(texte).match(/[a-z0-9]+/g) ?? [];
  const resultat = [];
  for (let terme of termes) {
    if (terme.length < 2) continue;
    if (terme.length > 3 && (terme.endsWith('s') || terme.endsWith('x'))) {
      terme = terme.slice(0, -1);
    }
    if (MOTS_VIDES.has(terme)) continue;
    resultat.push(terme);
  }
  return resultat;
}
