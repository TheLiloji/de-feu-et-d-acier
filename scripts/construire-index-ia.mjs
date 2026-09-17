#!/usr/bin/env node
/**
 * Construit l'index de recherche de l'assistant « Questions d'armes »
 * (`src/ia/index-ia.json`) — `npm run index-ia`.
 *
 * ── Ce que c'est ──────────────────────────────────────────────────────────
 *
 * L'étage 2 de la recherche de `/questions/` (le bouton « Poser la question »)
 * répond en deux temps : une recherche **lexicale** retrouve les passages du
 * corpus qui parlent de la question, puis l'API Gemini rédige une réponse à
 * partir de ces seuls passages (`src/pages/api/ia.ts`). Ce script fabrique la
 * matière du premier temps : les passages découpés, et l'index inversé qui
 * permet au Worker de les retrouver en quelques millisecondes sans retokeniser
 * 1,7 Mo de texte à chaque requête.
 *
 * Le choix lexical (BM25 écrit à la main, zéro dépendance) plutôt que
 * vectoriel est documenté dans ARCHITECTURE.md §4 : gratuit, sans service
 * externe, suffisant pour un corpus mono-thématique de cette taille. La voie
 * d'évolution (embeddings + Vectorize) y est décrite aussi.
 *
 * ── Les sources ───────────────────────────────────────────────────────────
 *
 * 1. Le wiki AMHE de la FFAMHE, moissonné en wikitexte dans
 *    `~/Documents/DEV/dfda-corpus/wiki-ffamhe/` (licence CC BY-NC-SA 3.0,
 *    en-tête YAML titre/source/licence par fichier). Le corpus vit HORS du
 *    dépôt ; seul l'index généré est committé.
 *    ⚠️ `wiktenauer-etude-interne/` (licences mixtes) est INTERDIT au chatbot
 *    public et n'est jamais lu ici.
 * 2. Le contenu du site lui-même : questions publiées, descriptions longues
 *    des fiches d'armes affichées, présentations des traités
 *    (`src/content/commun/`).
 *
 * ── Régénérer ─────────────────────────────────────────────────────────────
 *
 *     npm run index-ia                # corpus au chemin par défaut
 *     DFDA_CORPUS=/chemin npm run index-ia   # corpus ailleurs
 *
 * Puis committer `src/ia/index-ia.json`. À refaire quand le corpus est
 * re-moissonné ou quand le contenu du site change substantiellement — l'index
 * n'est PAS reconstruit par `npm run build`, précisément parce que le corpus
 * n'existe pas sur le builder Cloudflare.
 *
 * ── Format de l'index (champs compressés, viser < 3 Mo) ───────────────────
 *
 * {
 *   version, genere, nbPassages, longueurMoyenne,
 *   licences: ["…"],                        // dédoublonnées
 *   docs:     [[titre, url, iLicence]],     // un doc = un fichier source
 *   passages: [[iDoc, "texte", nbTermes]],  // 200-400 mots par passage
 *   termes:   { terme: [iPassage, tf, iPassage, tf, …] }  // index inversé
 * }
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tokeniser } from '../src/ia/normalisation.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const SORTIE = path.join(REPO, 'src', 'ia', 'index-ia.json');
const CORPUS = process.env.DFDA_CORPUS ?? path.resolve(REPO, '..', 'dfda-corpus', 'wiki-ffamhe');

/** Bornes de découpe d'un passage, en mots (la consigne : 200-400). */
const PASSAGE_MIN = 200;
const PASSAGE_MAX = 400;
/** En dessous, un fragment isolé n'apprend rien : il est écarté. */
const PASSAGE_PLANCHER = 30;

// ── Lecture d'un fichier à en-tête YAML plat ───────────────────────────────
//
// Les en-têtes du corpus et les frontmatters .mdoc dont on a besoin sont
// mono-lignes (titre, source, licence, statut, nom, affichee, question) : un
// vrai parseur YAML serait une dépendance pour rien. Les champs multi-lignes
// (résumés, planches…) ne sont pas lus.

function separerEnTete(brut) {
  if (!brut.startsWith('---')) return { entete: '', corps: brut };
  const fin = brut.indexOf('\n---', 3);
  if (fin === -1) return { entete: '', corps: brut };
  return {
    entete: brut.slice(brut.indexOf('\n') + 1, fin),
    corps: brut.slice(brut.indexOf('\n', fin + 1) + 1),
  };
}

function champ(entete, nom) {
  const m = entete.match(new RegExp(`^${nom}:[ \\t]*(.+)$`, 'm'));
  if (!m) return '';
  return m[1].trim().replace(/^['"](.*)['"]$/, '$1');
}

// ── Nettoyage du wikitexte ─────────────────────────────────────────────────

/** Sections de pure navigation, sans matière pour une réponse. Préfixes :
 *  « Liens externes en anglais » doit tomber comme « Liens externes ». */
const SECTIONS_ECARTEES =
  /^(notes et références|notes|références|voir aussi|articles? connexes?|liens? externes?|galerie)/i;

function nettoyerWikitexte(texte) {
  let t = texte;

  // Références et balises HTML. Les <ref> portent des notes de bas de page,
  // pas du corps de texte ; les autres balises sont vidées de leur enveloppe.
  t = t.replace(/<ref[^>]*\/>/gi, '');
  t = t.replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '');
  t = t.replace(/<gallery[^>]*>[\s\S]*?<\/gallery>/gi, '');
  t = t.replace(/<[^>]+>/g, ' ');

  // Modèles {{…}} (répété : ils peuvent s'imbriquer) et images.
  for (let i = 0; i < 4; i += 1) t = t.replace(/\{\{[^{}]*\}\}/g, ' ');
  t = t.replace(/\[\[(?:Fichier|File|Image)\s*:[^\]]*\]\]/gi, ' ');
  t = t.replace(/\[\[Catégorie\s*:[^\]]*\]\]/gi, ' ');

  // Liens internes [[cible|texte]] → texte, [[cible]] → cible ;
  // liens externes [url texte] → texte.
  t = t.replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, '$1');
  t = t.replace(/\[\[([^\]]*)\]\]/g, '$1');
  t = t.replace(/\[(?:https?:\/\/|\/\/)[^\s\]]+ ([^\]]+)\]/g, '$1');

  // Graisses et italiques wiki.
  t = t.replace(/'{2,}/g, '');

  // Sections : on écarte celles de la liste noire, on garde les autres en
  // conservant leur titre comme ligne de contexte.
  const lignes = t.split('\n');
  const gardees = [];
  let sectionEcartee = false;
  for (const ligne of lignes) {
    const titre = ligne.match(/^\s*(={2,})\s*(.+?)\s*={2,}\s*$/);
    if (titre) {
      sectionEcartee = SECTIONS_ECARTEES.test(titre[2].trim());
      if (!sectionEcartee) gardees.push(titre[2].trim());
      continue;
    }
    if (!sectionEcartee) gardees.push(ligne);
  }

  return gardees
    .join('\n')
    .replace(/^\s*[*#:;]+\s*/gm, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ── Nettoyage d'un corps .mdoc du site ─────────────────────────────────────

function nettoyerMdoc(texte) {
  return texte
    .replace(/\{%[\s\S]*?%\}/g, ' ') // widgets Markdoc (galerie, renvoi…)
    .replace(/\{[a-zA-Z]+\}/g, ' ') // raccourcis {email}, {essai}…
    .replace(/^#+\s*/gm, '')
    .replace(/\*\*|__|\*|_/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ── Découpage en passages de 200-400 mots ──────────────────────────────────

const compterMots = (t) => (t.match(/\S+/g) ?? []).length;

/** Coupe un paragraphe trop long à la phrase, sans jamais dépasser MAX. */
function couperLongParagraphe(paragraphe) {
  const phrases = paragraphe.match(/[^.!?]+[.!?]+["»)\]]*\s*|[^.!?]+$/g) ?? [paragraphe];
  const morceaux = [];
  let courant = '';
  for (const phrase of phrases) {
    if (courant && compterMots(courant) + compterMots(phrase) > PASSAGE_MAX) {
      morceaux.push(courant.trim());
      courant = '';
    }
    courant += phrase;
  }
  if (courant.trim()) morceaux.push(courant.trim());
  return morceaux;
}

function decouperEnPassages(texte) {
  const paragraphes = texte
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .flatMap((p) => (compterMots(p) > PASSAGE_MAX ? couperLongParagraphe(p) : [p]));

  const passages = [];
  let courant = [];
  let mots = 0;
  const vider = () => {
    if (mots === 0) return;
    passages.push(courant.join(' '));
    courant = [];
    mots = 0;
  };

  for (const paragraphe of paragraphes) {
    const n = compterMots(paragraphe);
    if (mots > 0 && mots + n > PASSAGE_MAX) vider();
    courant.push(paragraphe);
    mots += n;
    if (mots >= PASSAGE_MIN) vider();
  }
  // Le reliquat : rattaché au passage précédent s'il est maigre, gardé sinon.
  if (mots > 0) {
    if (mots < PASSAGE_PLANCHER && passages.length > 0) {
      passages[passages.length - 1] += ' ' + courant.join(' ');
    } else if (mots >= PASSAGE_PLANCHER) {
      passages.push(courant.join(' '));
    }
  }
  return passages;
}

// ── Collecte des documents ─────────────────────────────────────────────────

/** @type {{titre: string, url: string, licence: string, texte: string}[]} */
const documents = [];

// 1. Le wiki de la FFAMHE.
if (!existsSync(CORPUS)) {
  console.error(
    `Corpus introuvable : ${CORPUS}\n` +
      'Le corpus vit hors du dépôt. Indiquer son chemin : DFDA_CORPUS=/chemin npm run index-ia',
  );
  process.exit(1);
}

for (const fichier of readdirSync(CORPUS).sort()) {
  if (!fichier.endsWith('.txt')) continue;
  const brut = readFileSync(path.join(CORPUS, fichier), 'utf8');
  const { entete, corps } = separerEnTete(brut);
  const titre = champ(entete, 'titre');
  const url = champ(entete, 'source');
  const licence = champ(entete, 'licence') || 'CC BY-NC-SA 3.0 (wiki AMHE / FFAMHE)';
  if (!titre || !url) {
    console.warn(`⚠ en-tête incomplet, fichier écarté : ${fichier}`);
    continue;
  }
  const texte = nettoyerWikitexte(corps);
  if (texte) documents.push({ titre, url, licence, texte });
}

// 2. Le contenu du site. Les URL sont relatives : rendues sur dfda-amhe.fr,
// elles restent justes quel que soit le domaine.
const LICENCE_SITE = 'Site De Feu et d’Acier';
const CONTENU = path.join(REPO, 'src', 'content', 'commun');

for (const fichier of readdirSync(path.join(CONTENU, 'questions')).sort()) {
  if (!fichier.endsWith('.mdoc')) continue;
  const brut = readFileSync(path.join(CONTENU, 'questions', fichier), 'utf8');
  const { entete, corps } = separerEnTete(brut);
  if (champ(entete, 'statut') !== 'publie') continue;
  const question = champ(entete, 'question');
  const slug = fichier.replace(/\.mdoc$/, '');
  const texte = nettoyerMdoc(corps);
  if (question && texte) {
    documents.push({ titre: question, url: `/questions/${slug}/`, licence: LICENCE_SITE, texte });
  }
}

for (const fichier of readdirSync(path.join(CONTENU, 'disciplines')).sort()) {
  if (!fichier.endsWith('.mdoc')) continue;
  const brut = readFileSync(path.join(CONTENU, 'disciplines', fichier), 'utf8');
  const { entete, corps } = separerEnTete(brut);
  if (champ(entete, 'affichee') !== 'true') continue;
  const nom = champ(entete, 'nom');
  const slug = fichier.replace(/\.mdoc$/, '');
  const texte = nettoyerMdoc(corps);
  if (nom && texte) {
    documents.push({
      titre: `${nom} (fiche du club)`,
      url: `/armes/${slug}/`,
      licence: LICENCE_SITE,
      texte,
    });
  }
}

for (const fichier of readdirSync(path.join(CONTENU, 'traites')).sort()) {
  if (!fichier.endsWith('.mdoc')) continue;
  const brut = readFileSync(path.join(CONTENU, 'traites', fichier), 'utf8');
  const { entete, corps } = separerEnTete(brut);
  const titre = champ(entete, 'titre');
  const auteur = champ(entete, 'auteur');
  const slug = fichier.replace(/\.mdoc$/, '');
  const texte = nettoyerMdoc(corps);
  if (titre && texte) {
    documents.push({
      titre: auteur ? `${titre} (${auteur})` : titre,
      url: `/sources/${slug}/`,
      licence: LICENCE_SITE,
      texte,
    });
  }
}

// ── Construction de l'index ────────────────────────────────────────────────

const licences = [];
const iLicence = (l) => {
  const i = licences.indexOf(l);
  if (i !== -1) return i;
  licences.push(l);
  return licences.length - 1;
};

const docs = [];
const passages = [];
/** @type {Map<string, number[]>} terme → [iPassage, tf, iPassage, tf, …] */
const termes = new Map();
let sommeLongueurs = 0;

for (const doc of documents) {
  const iDoc = docs.length;
  docs.push([doc.titre, doc.url, iLicence(doc.licence)]);

  // Les termes du titre comptent double : une question sur « Liechtenauer »
  // doit remonter les passages de l'article Liechtenauer même quand le corps
  // du passage dit « le maître » ou « il ».
  const termesTitre = tokeniser(doc.titre);

  for (const texte of decouperEnPassages(doc.texte)) {
    const iPassage = passages.length;
    const tf = new Map();
    const termesPassage = tokeniser(texte);
    for (const terme of termesPassage) tf.set(terme, (tf.get(terme) ?? 0) + 1);
    for (const terme of termesTitre) tf.set(terme, (tf.get(terme) ?? 0) + 2);

    const longueur = termesPassage.length + termesTitre.length * 2;
    passages.push([iDoc, texte, longueur]);
    sommeLongueurs += longueur;

    for (const [terme, n] of tf) {
      let liste = termes.get(terme);
      if (!liste) {
        liste = [];
        termes.set(terme, liste);
      }
      liste.push(iPassage, n);
    }
  }
}

const index = {
  version: 1,
  genere: new Date().toISOString().slice(0, 10),
  nbPassages: passages.length,
  longueurMoyenne: Math.round(sommeLongueurs / Math.max(passages.length, 1)),
  licences,
  docs,
  passages,
  termes: Object.fromEntries(termes),
};

const json = JSON.stringify(index);
writeFileSync(SORTIE, json);

const mo = (json.length / (1024 * 1024)).toFixed(2);
console.log(
  `Index écrit : ${path.relative(REPO, SORTIE)}\n` +
    `  ${documents.length} documents (${docs.length} retenus), ${passages.length} passages, ` +
    `${termes.size} termes\n` +
    `  longueur moyenne d'un passage : ${index.longueurMoyenne} termes\n` +
    `  taille : ${mo} Mo (viser < 3 Mo)`,
);
if (json.length > 3 * 1024 * 1024) {
  console.warn('⚠ L’index dépasse 3 Mo : resserrer le découpage ou écarter des sections.');
}
