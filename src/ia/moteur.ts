/**
 * Moteur de recherche lexical de l'assistant « Questions d'armes ».
 *
 * Interroge l'index construit au build par `scripts/construire-index-ia.mjs`
 * (voir son en-tête pour le format et la régénération). Scoring BM25 écrit à
 * la main — pas de dépendance, pas de service externe : c'est le choix v1
 * documenté dans ARCHITECTURE.md §4, avec la voie vectorielle future.
 *
 * L'index est **committé dans le dépôt et embarqué dans le bundle du Worker**
 * (import `?raw` + `JSON.parse` au premier appel, mémoïsé au niveau du
 * module). Deux raisons à cet embarquement plutôt qu'un fichier dans
 * `public/` :
 *   - il n'existe aucune URL publique de l'index, même « non évidente » — un
 *     visiteur de passage ne peut pas le télécharger ;
 *   - le Worker n'a pas d'aller-retour réseau à faire pour le lire.
 * Le coût : ~1,5 Mo de plus dans le bundle (gzippé, bien moins) et un
 * `JSON.parse` par isolat, payé au premier appel de `/api/ia` seulement —
 * l'import est dynamique, les autres routes du Worker n'en savent rien.
 *
 * L'import `?raw` est délibéré : importer le JSON en module ferait inférer à
 * TypeScript le type littéral d'un fichier de 1,5 Mo (astro check à genoux).
 */
import { tokeniser } from './normalisation.mjs';

/** L'index tel que le script l'écrit. Champs compressés, cf. son en-tête. */
interface IndexIa {
  version: number;
  nbPassages: number;
  longueurMoyenne: number;
  licences: string[];
  /** [titre, url, indexLicence] */
  docs: [string, string, number][];
  /** [indexDoc, texte, nbTermes] */
  passages: [number, string, number][];
  /** terme → [iPassage, tf, iPassage, tf, …] */
  termes: Record<string, number[]>;
}

/** Un passage retrouvé, prêt à être cité dans le prompt et sous la réponse. */
export interface PassageRetrouve {
  titre: string;
  url: string;
  licence: string;
  texte: string;
  score: number;
}

/** Paramètres BM25 classiques ; b tempère l'avantage des passages courts. */
const K1 = 1.4;
const B = 0.75;

let indexCharge: IndexIa | null = null;

/** Parse l'index au premier appel, puis le garde pour la vie de l'isolat. */
async function chargerIndex(): Promise<IndexIa> {
  if (!indexCharge) {
    const { default: brut } = await import('./index-ia.json?raw');
    indexCharge = JSON.parse(brut) as IndexIa;
  }
  return indexCharge;
}

/**
 * Les passages les plus proches de la question, score BM25 décroissant.
 *
 * Renvoie au plus `limite` passages, et seulement ceux dont le score dépasse
 * un plancher : mieux vaut dire « les sources ne répondent pas » que nourrir
 * le modèle de passages hors sujet qu'il serait tenté de paraphraser.
 */
export async function chercherPassages(question: string, limite = 6): Promise<PassageRetrouve[]> {
  const index = await chargerIndex();
  const termes = tokeniser(question);
  if (termes.length === 0) return [];

  const scores = new Map<number, number>();
  const N = index.nbPassages;

  for (const terme of new Set(termes)) {
    const postings = index.termes[terme];
    if (!postings) continue;
    const df = postings.length / 2;
    const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
    for (let i = 0; i < postings.length; i += 2) {
      const iPassage = postings[i]!;
      const tf = postings[i + 1]!;
      const longueur = index.passages[iPassage]![2];
      const norme = tf + K1 * (1 - B + (B * longueur) / index.longueurMoyenne);
      scores.set(iPassage, (scores.get(iPassage) ?? 0) + (idf * (tf * (K1 + 1))) / norme);
    }
  }

  if (scores.size === 0) return [];

  const classes = [...scores.entries()].sort((a, b) => b[1] - a[1]);

  // Plancher relatif : un passage qui ne vaut pas le quart du meilleur ne
  // parle probablement pas de la même chose. Plancher absolu : si même le
  // meilleur est anecdotique (un seul terme banal en commun), on ne cite rien.
  const meilleur = classes[0]![1];
  if (meilleur < 2) return [];

  return classes
    .filter(([, score]) => score >= meilleur / 4)
    .slice(0, limite)
    .map(([iPassage, score]) => {
      const [iDoc, texte] = index.passages[iPassage]!;
      const [titre, url, iLic] = index.docs[iDoc]!;
      return { titre, url, licence: index.licences[iLic] ?? '', texte, score };
    });
}
