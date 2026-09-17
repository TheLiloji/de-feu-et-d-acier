/**
 * Index des suggestions « Questions d'armes » — l'étage 1 de la recherche.
 *
 * Construit AU BUILD, depuis la collection des questions publiées, le petit
 * paquet de données que `ChercheQuestions.astro` inline dans la page : pour
 * chaque question, son adresse, son intitulé composé, et une chaîne de
 * mots-clés normalisés (`src/ia/normalisation.mjs` — la même normalisation
 * que la frappe du visiteur, sinon « rapière » ne retrouverait pas
 * « rapiere »). Les mots-clés viennent du titre, des armes liées (nom et
 * slug) et du début de la réponse : taper « bolonaise » ou « Marozzo » fait
 * remonter la question même quand le titre ne porte pas le mot.
 *
 * Le filtrage, lui, se passe dans le navigateur, sans réseau : l'index tient
 * en quelques kilooctets pour une douzaine de questions. Ce module ne lit
 * aucun contenu (multi-ecoles.md §6.6) : la page fournit questions et
 * disciplines, comme partout.
 */
import type { Discipline, Question } from './contenu';
import type { EcoleConfig } from '../config/ecoles';
import { texteDuCorps } from './corps';
import { lien } from './liens';
import { typographieFr } from './typographie';
import { tokeniser } from '../ia/normalisation.mjs';

/** Une entrée de l'index inliné : h = href, q = question affichée, m = mots. */
export interface EntreeSuggestion {
  h: string;
  q: string;
  m: string;
}

/** Longueur de réponse versée aux mots-clés : assez pour le vocabulaire
 *  propre de la question, pas de quoi faire gonfler la page. */
const REPONSE_MOTS_CLES = 400;

export async function indexSuggestions({
  ecole,
  questions,
  disciplines,
}: {
  ecole: EcoleConfig;
  questions: readonly Question[];
  disciplines: readonly Discipline[];
}): Promise<EntreeSuggestion[]> {
  const nomsArmes = new Map(disciplines.map((d) => [d.slug, d.entry.nom]));

  return Promise.all(
    questions.map(async (question) => {
      const reponse = await question.entry.reponse();
      const debut = texteDuCorps(
        reponse.node,
        REPONSE_MOTS_CLES,
        `src/content/commun/questions/${question.slug}.mdoc — mots-clés des suggestions`,
      ).replace(/\{[a-zA-Z]+\}/g, ' '); // raccourcis {essai}… : pas des mots-clés

      const morceaux = [
        question.entry.question,
        ...question.entry.armes.flatMap((slug) => [slug, nomsArmes.get(slug) ?? '']),
        debut,
      ];

      // Dédoublonné : le champ `m` est une chaîne où la frappe cherche des
      // sous-chaînes, la répétition n'apporterait rien.
      const mots = [...new Set(morceaux.flatMap((m) => tokeniser(m)))].join(' ');

      return {
        h: lien(ecole, `/questions/${question.slug}/`),
        q: typographieFr(question.entry.question),
        m: mots,
      };
    }),
  );
}
