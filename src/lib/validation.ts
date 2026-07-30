/**
 * Garde-fous du build — ARCHITECTURE.md §7.
 *
 * Neuf vérifications, neuf échecs de build avec un message qui dit **quoi
 * corriger et où** :
 *
 *   1. un raccourci inconnu dans un texte du CMS (`{tarrif}`, `{Email}`) ;
 *   2. aucune école principale, ou plusieurs ;
 *   3. une image de contenu sans description alternative ;
 *   4. deux annonces épinglées en bandeau en même temps ;
 *   5. une image déposée dans un format que le build ne sait pas traiter ;
 *   6. un traité dont les droits ne sont pas en règle (planche sans description
 *      ou sans crédit, licence sans adresse, extrait cité sans sa source), ou
 *      rattaché à une arme absente du catalogue des disciplines ;
 *   7. la planche de « La rigueur », sur l'accueil, publiée sans sa ligne de
 *      crédit — même exigence que le n° 6, hors de la collection des traités ;
 *   8. une piste de sous-titres `.vtt` appelée par une adresse absolue, que le
 *      navigateur abandonnerait en silence (CORS) ;
 *   9. un widget de corps libre en défaut : renvoi vers une page inexistante ou
 *      non publiée, image de galerie ou planche sans description, planche sans
 *      crédit, widget inconnu, widget imbriqué dans une citation ou une liste,
 *      bouton sans texte ou sans adresse.
 *
 * Pourquoi ici et pas dans un script `prebuild`
 * ---------------------------------------------
 * Le contenu se lit avec le Reader Keystatic, qui a besoin de
 * `keystatic.config.ts` — un module Vite (`import.meta.env`, imports sans
 * extension) que `node` seul ne sait pas charger. La validation tourne donc
 * *dans* le build, appelée une fois par `src/layouts/Base.astro`, que les sept
 * pages du site traversent. Résultat identique à un `prebuild` : le build
 * s'arrête, avec la liste complète des problèmes plutôt que le premier.
 *
 * Le contrôle est mémoïsé : une seule passe pour tout un build, et une passe
 * par rechargement en `astro dev` (on veut justement voir l'erreur revenir tant
 * qu'elle n'est pas corrigée).
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  LIBELLES_WIDGETS,
  NOMS_WIDGETS,
  TYPES_RENVOI,
  estNomWidget,
  type TypeRenvoi,
} from '../cms/widgets';
import { ECOLES, ECOLE_PRINCIPALE, type EcoleConfig } from '../config/ecoles';
import {
  annoncesDe,
  articlesDe,
  lireDisciplines,
  lireTraites,
  profsDe,
  reader,
} from './contenu';
import { EXTENSIONS_PHOTOS, resoudrePhoto } from './images';
import { RACCOURCIS_CONNUS } from './raccourcis';

/** Racine du contenu éditorial, relative à la racine du dépôt. */
const RACINE_CONTENU = 'src/content';

/** Extensions balayées à la recherche de raccourcis. */
const EXTENSIONS = ['.yaml', '.yml', '.mdoc', '.md', '.json'];

/**
 * Tout ce qui ressemble à une tentative de raccourci — pas seulement la forme
 * canonique `{minuscules_et_underscores}`. `{Email}` ou `{ tarif }` passaient
 * l'ancien motif strict *et* n'étaient jamais remplacés par `resoudre()` : le
 * texte partait littéralement en production. Ils sont désormais refusés au
 * build, avec la bonne orthographe dans le message.
 */
const MOTIF_RACCOURCI = /\{([^{}\n]{1,40})\}/g;

/** Forme canonique d'une clé : « {  Nb Armes } » → « nb_armes ». */
function normaliserCle(brut: string): string {
  return brut.trim().toLocaleLowerCase('fr').replace(/[\s-]+/g, '_');
}

// ── Balayage des fichiers de contenu ───────────────────────────────────────

function fichiersDeContenu(racine: string): string[] {
  let entrees: string[];
  try {
    entrees = readdirSync(racine);
  } catch {
    return [];
  }

  const trouves: string[] = [];
  for (const nom of entrees) {
    const chemin = join(racine, nom);
    if (statSync(chemin).isDirectory()) {
      trouves.push(...fichiersDeContenu(chemin));
    } else if (EXTENSIONS.some((ext) => nom.endsWith(ext))) {
      trouves.push(chemin);
    }
  }
  return trouves;
}

/**
 * 1. Raccourcis inconnus, ou mal orthographiés.
 *
 * Le balayage se fait sur les **fichiers**, pas sur les entrées du lecteur :
 * il couvre ainsi les corps markdoc (bio d'un prof, description longue d'une
 * arme, réponse de FAQ, article) autant que les champs YAML. Ces cinq familles
 * de texte riche passent bien par `resoudre()` au rendu — la vérification est
 * donc doublée là où le contenu est effectivement affiché, et celle-ci ne rate
 * rien, y compris un champ que personne n'affiche encore.
 *
 * Deux formes de faute sont refusées :
 *   - une clé inconnue en forme canonique (`{tarrif}`) ;
 *   - une clé connue mal écrite (`{Email}`, `{ tarif }`, `{nb armes}`), qui
 *     passait l'ancien motif strict *et* n'était jamais remplacée au rendu.
 *
 * Le reste des accolades est laissé tranquille : `{2, 3}` dans un texte n'est
 * pas une tentative de raccourci et ne doit pas faire échouer un build.
 */
function verifierRaccourcis(racineProjet: string): string[] {
  const connus = new Set<string>(RACCOURCIS_CONNUS);
  const disponibles = RACCOURCIS_CONNUS.map((r) => `{${r}}`).join(', ');
  const problemes: string[] = [];

  for (const fichier of fichiersDeContenu(join(racineProjet, RACINE_CONTENU))) {
    const lignes = readFileSync(fichier, 'utf8').split('\n');
    lignes.forEach((ligne, index) => {
      for (const trouve of ligne.matchAll(MOTIF_RACCOURCI)) {
        const brut = trouve[1]!;
        if (connus.has(brut)) continue;

        const ou = `${relative(racineProjet, fichier)}:${index + 1}`;
        const canonique = normaliserCle(brut);

        if (connus.has(canonique)) {
          problemes.push(
            `Raccourci mal orthographié « {${brut}} » — ${ou}\n` +
              `    Les raccourcis s’écrivent en minuscules, sans espace : « {${canonique}} ».\n` +
              '    Tel quel, il ne serait pas remplacé et s’afficherait littéralement sur le site.',
          );
          continue;
        }

        // Forme canonique mais clé inconnue : la faute de frappe classique.
        if (/^[a-z_]+$/.test(brut)) {
          problemes.push(
            `Raccourci inconnu « {${brut}} » — ${ou}\n    Raccourcis disponibles : ${disponibles}.`,
          );
        }
      }
    });
  }

  return problemes;
}

/** 2. Exactement une école principale. */
function verifierEcolePrincipale(): string[] {
  const principales = ECOLES.filter((e) => e.principale);

  if (principales.length === 1) return [];

  if (principales.length === 0) {
    return [
      'Aucune école principale — src/config/ecoles.ts\n' +
        "    Exactement une école doit porter `principale: true` : c'est elle qui est servie sur « / ».",
    ];
  }

  return [
    `${principales.length} écoles principales (${principales.map((e) => e.slug).join(', ')}) — src/config/ecoles.ts\n` +
      '    Une seule école peut être servie sur « / ».',
  ];
}

// ── 3 et 5. Images de contenu : alternative textuelle, format exploitable ──

/**
 * Le schéma associe systématiquement `fichier` et `alt` dans un même objet
 * (`photo()` de keystatic.config.ts, et les photos d'album). La règle est donc
 * simple et sans exception : **un `fichier` renseigné exige un `alt`
 * renseigné**. Les images sans champ `alt` voisin dans le schéma — vignette de
 * vidéo, image de partage, logo de partenaire — ne sont pas concernées : leur
 * texte de remplacement est calculé côté composant (« Logo FFAMHE »), ou
 * l'image est décorative.
 *
 * Le second contrôle porte sur le **format** : Keystatic accepte tout
 * `image/*` et enregistre le fichier sous son nom d'origine. Un `.heic` sorti
 * d'un iPhone est donc committé sans broncher, mais `resoudrePhoto()` ne le
 * trouve pas et la photo disparaît du site **en silence**. L'invariant est
 * donc : pour tout `fichier` non vide non résolu, si le fichier existe bel et
 * bien sur le disque, c'est une erreur de build nommant le chemin fautif.
 * Fichier absent = cas toléré « pas encore déposé » (cf. Partenaires.astro).
 */
function verifierAlt(
  valeur: unknown,
  ou: string,
  racineProjet: string,
  vus = new Set<unknown>(),
): string[] {
  if (!valeur || typeof valeur !== 'object' || vus.has(valeur)) return [];
  vus.add(valeur);

  if (Array.isArray(valeur)) {
    return valeur.flatMap((element, i) =>
      verifierAlt(element, `${ou}[${i + 1}]`, racineProjet, vus),
    );
  }

  const objet = valeur as Record<string, unknown>;
  const problemes: string[] = [];

  const fichier = objet.fichier;
  if (typeof fichier === 'string' && fichier.trim() !== '') {
    const alt = objet.alt;
    if (typeof alt !== 'string' || alt.trim() === '') {
      problemes.push(
        `Image sans description alternative — ${ou}\n` +
          `    Fichier : ${fichier}\n` +
          '    Remplir « Description de l’image » dans l’admin : elle est lue par les lecteurs d’écran.',
      );
    }
    problemes.push(...verifierFormat(fichier.trim(), ou, racineProjet));
  }

  for (const [cle, sous] of Object.entries(objet)) {
    // Les corps markdoc sont des fonctions paresseuses : on ne les déclenche pas.
    if (typeof sous === 'function') continue;
    problemes.push(...verifierAlt(sous, `${ou} › ${cle}`, racineProjet, vus));
  }

  return problemes;
}

/** 5. Un fichier présent sur le disque mais que le build ne sait pas traiter. */
function verifierFormat(fichier: string, ou: string, racineProjet: string): string[] {
  if (resoudrePhoto(fichier)) return [];

  const relatif = fichier.startsWith('/') ? fichier.slice(1) : fichier;
  if (!existsSync(join(racineProjet, relatif))) return []; // pas encore déposé

  return [
    `Image dans un format non pris en charge — ${ou}\n` +
      `    Fichier : ${fichier}\n` +
      `    Il est bien présent dans le dépôt, mais le build ne sait pas l’optimiser : il ne s’affichera pas.\n` +
      `    Formats acceptés : ${EXTENSIONS_PHOTOS.join(', ')}. Réenregistrer la photo en JPEG et la redéposer dans l’admin.`,
  ];
}

async function verifierImages(racineProjet: string): Promise<string[]> {
  const problemes: string[] = [];

  const singletons = reader.singletons as unknown as Record<
    string,
    { read: () => Promise<unknown> }
  >;
  for (const [nom, singleton] of Object.entries(singletons)) {
    problemes.push(...verifierAlt(await singleton.read(), `singleton « ${nom} »`, racineProjet));
  }

  const collections = reader.collections as unknown as Record<
    string,
    { all: () => Promise<{ slug: string; entry: unknown }[]> }
  >;
  for (const [nom, collection] of Object.entries(collections)) {
    for (const entree of await collection.all()) {
      problemes.push(
        ...verifierAlt(entree.entry, `${nom} › ${entree.slug}`, racineProjet),
      );
    }
  }

  return problemes;
}

/**
 * 4. Une seule annonce épinglée en bandeau à la fois, par école.
 *
 * Même critère que `BandeauAnnonce.astro` : épinglée, message non vide, date de
 * fin non dépassée. Le composant sait choisir (« la plus récente gagne »), mais
 * ARCHITECTURE.md §7 demande que le doublon se voie au build — deux annonces
 * épinglées, c'est presque toujours une annonce qu'on a oublié de dépingler.
 */
async function verifierAnnonces(aujourdhui: string): Promise<string[]> {
  const problemes: string[] = [];

  for (const ecole of ECOLES) {
    const epinglees = (await annoncesDe(ecole)).filter((a) => {
      if (!a.entry.bandeau) return false;
      if (!a.entry.message?.trim()) return false;
      const fin = a.entry.dateFin;
      return !fin || fin >= aujourdhui;
    });

    if (epinglees.length > 1) {
      const liste = epinglees
        .map((a) => `« ${a.entry.titre || a.slug} » (${a.slug}.yaml)`)
        .join(', ');
      problemes.push(
        `${epinglees.length} annonces épinglées en bandeau — src/content/ecoles/${ecole.slug}/annonces/\n` +
          `    ${liste}\n` +
          '    Le bandeau n’en affiche qu’une : décocher « Épingler en bandeau » sur les autres, ou leur donner une date de fin.',
      );
    }
  }

  return problemes;
}

/**
 * 6. Les sources : droits d'une fiche de traité.
 *
 * Les planches de traités ne sont pas des photos du club — ce sont des images
 * appartenant à des bibliothèques, publiées sous des conditions écrites. La BnF
 * exige « Source gallica.bnf.fr / Bibliothèque nationale de France », le MDZ
 * exige bibliothèque + cote + folio + URN (plus « digitalisiert von Google »
 * sous statut NoC-NC), le Royal Armouries exige le crédit, le lien vers la
 * licence CC BY 4.0 et la mention des modifications. Une planche publiée sans
 * sa ligne de crédit met le club en faute vis-à-vis de l'institution qui l'a
 * numérisée : c'est un défaut de build, pas un oubli à corriger plus tard.
 *
 * Trois invariants, donc, en plus des contrôles génériques :
 *
 *   - chaque planche a une description alternative — le contrôle n° 3 ne la
 *     voit pas, il s'accroche au couple `fichier`/`alt` de `photo()` et la
 *     planche porte son fichier sous la clé `image` ;
 *   - chaque planche a son crédit ;
 *   - la licence du traité a une adresse, et un extrait cité a son crédit et
 *     son lien vers la page d'où il est repris.
 *
 * Le format du fichier est vérifié au passage, avec le même message que pour
 * les photos : une planche déposée en HEIC disparaîtrait sans bruit.
 */
async function verifierTraites(racineProjet: string): Promise<string[]> {
  const problemes: string[] = [];

  // Une arme rattachée à un traité mais absente du catalogue est ignorée en
  // silence par `armesLiees()` — une pastille sans nom ne dit rien à personne.
  // Le silence est le bon comportement au rendu, et le mauvais au build :
  // renommer une discipline ferait disparaître le traité de la fiche de l'arme
  // sans que rien ne le signale.
  const catalogue = new Set((await lireDisciplines()).map((d) => d.slug));

  for (const { slug, entry } of await lireTraites()) {
    const ou = `traites › ${slug}`;
    const nom = entry.titre || slug;

    for (const arme of entry.armes ?? []) {
      if (catalogue.has(arme)) continue;
      problemes.push(
        `Arme inconnue rattachée à un traité — ${ou}\n` +
          `    « ${nom} » renvoie à l’arme « ${arme} », qui n’existe pas dans le catalogue.\n` +
          `    Armes disponibles : ${[...catalogue].join(', ')}.\n` +
          '    Corriger « Armes concernées » dans l’admin, ou recréer la discipline manquante.',
      );
    }

    if (!entry.licence?.url?.trim()) {
      problemes.push(
        `Traité sans adresse de licence — ${ou}\n` +
          `    « ${nom} »\n` +
          '    Remplir « Droits d’utilisation › Adresse de la licence » dans l’admin : c’est le lien\n' +
          '    qui prouve que le club a le droit de publier ces planches.',
      );
    }

    if (entry.extraitCitation?.trim()) {
      if (!entry.extraitCredit?.trim()) {
        problemes.push(
          `Extrait cité sans crédit — ${ou}\n` +
            `    « ${nom} »\n` +
            '    Un extrait de traité se cite avec l’auteur de la transcription. Ex. « Transcription\n' +
            '    ARDAMHE, hébergée par la FFAMHE ».',
        );
      }
      if (!entry.extraitUrl?.trim()) {
        problemes.push(
          `Extrait cité sans lien vers sa source — ${ou}\n` +
            `    « ${nom} »\n` +
            '    Remplir « Lien vers la page de l’extrait » : la courte citation suppose que l’on\n' +
            '    renvoie au texte complet.',
        );
      }
    }

    entry.planches.forEach((planche, i) => {
      const oup = `${ou} › planche ${i + 1}${planche.folio ? ` (${planche.folio})` : ''}`;

      if (!planche.alt?.trim()) {
        problemes.push(
          `Planche sans description alternative — ${oup}\n` +
            `    Fichier : ${planche.image || '(aucun)'}\n` +
            '    Remplir « Description de la planche » dans l’admin : elle est lue par les lecteurs d’écran.',
        );
      }

      if (!planche.credit?.trim()) {
        problemes.push(
          `Planche sans crédit — ${oup}\n` +
            `    Fichier : ${planche.image || '(aucun)'}\n` +
            '    Recopier la ligne de crédit exigée par la bibliothèque, sans la modifier. Sans elle,\n' +
            '    la publication de cette planche n’est pas en règle.',
        );
      }

      if (planche.image?.trim()) {
        problemes.push(...verifierFormat(planche.image.trim(), oup, racineProjet));
      }
    });
  }

  return problemes;
}

/**
 * 7. La planche de « La rigueur » — mêmes droits, hors collection.
 *
 * La section « La rigueur » de l'accueil affiche une planche de traité (la page
 * de titre de la Noble Science, numérisée par la BnF) qui ne vit **pas** dans la
 * collection `traites` : elle est saisie dans le singleton `rigueur`, avec sa
 * propre ligne de crédit. Le contrôle n° 6 ne la voit donc pas, et c'est
 * pourtant la planche la plus visible du site — celle de la page d'accueil.
 *
 * La règle est la même que pour une planche de fiche : si un fichier est déposé,
 * la ligne de crédit exigée par la bibliothèque doit l'accompagner. Le champ alt
 * est déjà couvert par le contrôle n° 3, qui reconnaît le couple `fichier`/`alt`.
 */
async function verifierPlancheRigueur(): Promise<string[]> {
  const rigueur = await reader.singletons.rigueur.read();
  const planche = rigueur?.planche;
  if (!planche?.fichier?.trim()) return [];
  if (planche.credit?.trim()) return [];

  return [
    'Planche sans crédit — Accueil · La rigueur\n' +
      `    Fichier : ${planche.fichier}\n` +
      '    Remplir « Planche de traité › Ligne de crédit de la bibliothèque ». Cette planche est\n' +
      '    une numérisation de bibliothèque : sans sa mention de source, sa publication sur la page\n' +
      '    d’accueil n’est pas en règle.',
  ];
}

/**
 * 8. Une piste de sous-titres servie depuis une autre origine que le site.
 *
 * Un `<track>` est chargé avec l'état CORS de l'élément `<video>`. Le lecteur de
 * `VideoCard.astro` n'a **pas** d'attribut `crossorigin` — délibérément : le
 * poser sans en-tête `Access-Control-Allow-Origin` sur le bucket R2 ferait
 * échouer le chargement de la vidéo elle-même. Conséquence : une piste `.vtt`
 * appelée par une adresse absolue part en `no-cors`, la réponse est opaque, et
 * le navigateur abandonne la piste **sans erreur en console** — pas de bouton de
 * sous-titres, et rien qui distingue à l'œil un lecteur correct d'un lecteur
 * amputé de son accessibilité (WCAG 1.2.2).
 *
 * D'où l'invariant : la vidéo va sur R2, le `.vtt` reste sur le site, appelé par
 * un chemin absolu de site (`/videos/lecon-01.fr.vtt`). C'est la seule règle qui
 * ne demande ni attribut ni configuration de bucket. Le contrôle s'applique aux
 * mini-cours d'une fiche arme comme à la vidéo d'interview d'un encadrant.
 */
const MOTIF_ADRESSE_ABSOLUE = /^[a-z][a-z0-9+.-]*:|^\/\//i;

function verifierSousTitres(valeur: unknown, ou: string, vus = new Set<unknown>()): string[] {
  if (!valeur || typeof valeur !== 'object' || vus.has(valeur)) return [];
  vus.add(valeur);

  if (Array.isArray(valeur)) {
    return valeur.flatMap((element, i) => verifierSousTitres(element, `${ou}[${i + 1}]`, vus));
  }

  const objet = valeur as Record<string, unknown>;
  const problemes: string[] = [];

  const piste = objet.sousTitres;
  if (typeof piste === 'string' && piste.trim() !== '' && MOTIF_ADRESSE_ABSOLUE.test(piste.trim())) {
    problemes.push(
      `Sous-titres hébergés hors du site — ${ou}\n` +
        `    Adresse : ${piste.trim()}\n` +
        '    Le navigateur ignorerait cette piste en silence : aucun bouton de sous-titres n’apparaîtrait.\n' +
        '    Le fichier .vtt doit être déposé sur le site (dossier public/) et appelé par un chemin\n' +
        '    commençant par « / » — par exemple /videos/lecon-01.fr.vtt. Contrairement à la vidéo, il\n' +
        '    ne va pas sur le stockage R2.',
    );
  }

  for (const [cle, sous] of Object.entries(objet)) {
    if (typeof sous === 'function') continue;
    problemes.push(...verifierSousTitres(sous, `${ou} › ${cle}`, vus));
  }

  return problemes;
}

async function verifierPistesSousTitres(): Promise<string[]> {
  const problemes: string[] = [];

  const collections = reader.collections as unknown as Record<
    string,
    { all: () => Promise<{ slug: string; entry: unknown }[]> }
  >;
  for (const [nom, collection] of Object.entries(collections)) {
    for (const entree of await collection.all()) {
      problemes.push(...verifierSousTitres(entree.entry, `${nom} › ${entree.slug}`));
    }
  }

  return problemes;
}

/**
 * 9. Les corps libres : biographie, description longue, article, présentation.
 *
 * Quatre champs du CMS acceptent des **widgets** insérés dans le fil du texte
 * (docs/refonte/widgets.md). Ils échappent à tous les contrôles précédents pour
 * une raison mécanique : un corps Markdoc est une valeur **paresseuse** du
 * lecteur, c'est-à-dire une fonction, et les parcours récursifs des n° 3, 5 et
 * 8 sautent explicitement les fonctions pour ne pas déclencher une lecture de
 * fichier à chaque nœud. Personne ne regardait donc l'intérieur des corps.
 *
 * L'enjeu n'est pas théorique : `Markdoc.transform` **supprime sans un mot** un
 * tag qu'il ne connaît pas, et une carte de renvoi vers un article repassé en
 * brouillon mènerait à une page qui n'existe plus. Une disparition silencieuse
 * de contenu, ou un lien mort, sont exactement ce qu'un garde-fou doit rendre
 * impossible.
 *
 * Ce contrôle relit donc les quatre champs, tag par tag, et refuse :
 *
 *   a. un renvoi vers un slug inexistant, ou vers une page non publiée ;
 *   b. un renvoi dont la destination n'a pas été choisie ;
 *   c. une photo de galerie sans description alternative ;
 *   d. une planche sans description, ou sans sa ligne de crédit ;
 *   e. un widget dont le nom n'existe pas ;
 *   f. un widget imbriqué dans une citation, une liste ou un paragraphe ;
 *   g. une image de widget dans un format que le build ne sait pas traiter ;
 *   h. une piste de sous-titres de widget vidéo en adresse absolue ;
 *   i. un bouton sans texte ou sans adresse.
 *
 * Les points c, d, g et h reprennent **mot pour mot** les messages des
 * contrôles n° 3, 5, 6 et 8 : c'est la même faute, elle se corrige de la même
 * façon, elle doit se lire pareil.
 */

/** Nœud d'AST Markdoc, réduit à ce que le contrôle a besoin de connaître. */
interface NoeudMarkdoc {
  type?: string;
  tag?: string;
  attributes?: Record<string, unknown>;
  children?: NoeudMarkdoc[];
}

/** Un corps libre à relire : où il vit, et comment l'admin l'appelle. */
interface ChampDeCorps {
  /** Clé de collection Keystatic (`disciplines`, `profs_clermont`…). */
  collection: string;
  /** Nom du champ markdoc dans le schéma. */
  champ: string;
  /** Libellé français du champ, tel qu'il s'affiche dans l'admin. */
  libelle: string;
  /** Dossier des fichiers de la collection, pour nommer le fichier fautif. */
  dossier: string;
  /**
   * École dont dépendent les renvois « encadrant » et « article ». Les contenus
   * communs (armes, traités) n'en ont pas : ils visent l'école principale, comme
   * le schéma du widget (cf. `CIBLES_COMMUNES` dans keystatic.config.ts).
   */
  ecole: EcoleConfig;
}

function champsDeCorps(): ChampDeCorps[] {
  const champs: ChampDeCorps[] = [
    {
      collection: 'disciplines',
      champ: 'description',
      libelle: 'Description longue (fiche arme)',
      dossier: 'src/content/commun/disciplines',
      ecole: ECOLE_PRINCIPALE,
    },
    {
      collection: 'traites',
      champ: 'presentation',
      libelle: 'Présentation',
      dossier: 'src/content/commun/traites',
      ecole: ECOLE_PRINCIPALE,
    },
  ];

  for (const ecole of ECOLES) {
    champs.push(
      {
        collection: `profs_${ecole.slug}`,
        champ: 'bio',
        libelle: 'Biographie',
        dossier: `src/content/ecoles/${ecole.slug}/profs`,
        ecole,
      },
      {
        collection: `articles_${ecole.slug}`,
        champ: 'corps',
        libelle: 'Contenu',
        dossier: `src/content/ecoles/${ecole.slug}/articles`,
        ecole,
      },
    );
  }

  return champs;
}

/** Ce qu'un renvoi peut viser, et ce qui a réellement une page sur le site. */
interface CiblesDeRenvoi {
  /** Les slugs qui ont une page publique, par type. */
  publiees: Record<TypeRenvoi, Set<string>>;
  /** Tous les slugs saisis, publiés ou non : de quoi distinguer les deux fautes. */
  connus: Record<TypeRenvoi, Set<string>>;
}

/**
 * Comment nommer chaque type de cible dans un message : « un traité », « les
 * traités ». Écrire « la fiche de type traite » à un encadrant serait absurde.
 */
const NOMS_CIBLE: Record<TypeRenvoi, { singulier: string; pluriel: string }> = {
  arme: { singulier: 'une arme', pluriel: 'les armes' },
  traite: { singulier: 'un traité', pluriel: 'les traités' },
  encadrant: { singulier: 'un encadrant', pluriel: 'les encadrants' },
  article: { singulier: 'un article', pluriel: 'les articles' },
};

/** Ce qu'il faut faire pour qu'une cible saisie mais masquée retrouve sa page. */
const REMEDE_MASQUE: Record<TypeRenvoi, string> = {
  arme: 'Sa case « Affichée dans la grille des armes » est décochée : sans carte, pas de fiche.',
  // Toutes les fiches de traité ont une page : la branche ne peut pas se
  // produire aujourd'hui, mais le jour où un champ « visible » apparaît sur la
  // collection, c'est ici que la phrase se corrige.
  traite: 'La fiche de traité existe mais n’est pas servie sur le site.',
  encadrant: 'Sa case « Affiché sur le site » est décochée : un encadrant masqué n’a pas de fiche.',
  article: 'Il est encore en brouillon, et un brouillon n’a pas d’adresse.',
};

async function ciblesDeRenvoi(ecole: EcoleConfig): Promise<CiblesDeRenvoi> {
  const [disciplines, traites, profs, articles] = await Promise.all([
    lireDisciplines(),
    lireTraites(),
    profsDe(ecole),
    articlesDe(ecole),
  ]);

  return {
    connus: {
      arme: new Set(disciplines.map((d) => d.slug)),
      traite: new Set(traites.map((t) => t.slug)),
      encadrant: new Set(profs.map((p) => p.slug)),
      article: new Set(articles.map((a) => a.slug)),
    },
    publiees: {
      arme: new Set(disciplines.filter((d) => d.entry.affichee).map((d) => d.slug)),
      traite: new Set(traites.map((t) => t.slug)),
      encadrant: new Set(profs.filter((p) => p.entry.visible).map((p) => p.slug)),
      article: new Set(articles.filter((a) => a.entry.statut === 'publie').map((a) => a.slug)),
    },
  };
}

/** « 1ᵉʳ bloc du texte », « 4ᵉ bloc du texte » — ce que le rédacteur compte à l'œil. */
function rangDuBloc(index: number): string {
  return `${index + 1}${index === 0 ? 'ᵉʳ' : 'ᵉ'} bloc du texte`;
}

/** Les slugs d'un type, triés, pour une liste d'erreur stable d'un build à l'autre. */
const listeSlugs = (slugs: Set<string>): string =>
  slugs.size === 0 ? '(aucun)' : [...slugs].sort((a, b) => a.localeCompare(b, 'fr')).join(', ');

/** Une chaîne d'attribut, débarrassée de ses espaces. Vide si l'attribut manque. */
const texteAttribut = (valeur: unknown): string =>
  typeof valeur === 'string' ? valeur.trim() : '';

function verifierCorps(
  node: unknown,
  ou: string,
  cibles: CiblesDeRenvoi,
  racineProjet: string,
): string[] {
  const enfants = (node as NoeudMarkdoc | null)?.children ?? [];
  const problemes: string[] = [];

  enfants.forEach((enfant, i) => {
    const bloc = `${ou} › ${rangDuBloc(i)}`;
    if (enfant?.type === 'tag') {
      problemes.push(...verifierWidget(enfant, bloc, cibles, racineProjet));
    } else {
      problemes.push(...verifierWidgetsImbriques(enfant, bloc));
    }
  });

  return problemes;
}

/**
 * 9f. Un widget posé ailleurs qu'au premier niveau du texte.
 *
 * L'éditeur le permet techniquement : le nœud d'un widget appartient au groupe
 * `block`, et une citation comme une puce acceptent `block+`. Le rendu, lui, ne
 * sait pas traiter ce cas — un carrousel dans une puce n'a d'ailleurs pas de
 * sens. Mieux vaut le dire au build que le laisser disparaître.
 */
function verifierWidgetsImbriques(noeud: NoeudMarkdoc | undefined, ou: string): string[] {
  if (!noeud || typeof noeud !== 'object') return [];

  const problemes: string[] = [];
  for (const enfant of noeud.children ?? []) {
    if (enfant?.type === 'tag') {
      const nom = String(enfant.tag ?? '');
      const libelle = estNomWidget(nom) ? LIBELLES_WIDGETS[nom] : nom;
      problemes.push(
        `Widget mal placé — ${ou}\n` +
          `    Le widget « ${libelle} » est imbriqué dans un autre bloc (citation, liste, paragraphe).\n` +
          '    Un widget se pose seul, entre deux paragraphes : le site ne sait pas l’afficher ailleurs.\n' +
          '    Le sortir de son bloc — le sélectionner, Ctrl+X, puis Ctrl+V sur une ligne vide.',
      );
      continue;
    }
    problemes.push(...verifierWidgetsImbriques(enfant, ou));
  }
  return problemes;
}

function verifierWidget(
  noeud: NoeudMarkdoc,
  ou: string,
  cibles: CiblesDeRenvoi,
  racineProjet: string,
): string[] {
  const nom = String(noeud.tag ?? '');
  const attributs = noeud.attributes ?? {};

  // 9e. Un tag que ni l'éditeur ni le rendu ne connaissent. `Markdoc.transform`
  // le supprimerait sans un mot : c'est le pire résultat possible.
  if (!estNomWidget(nom)) {
    return [
      `Widget inconnu « ${nom} » — ${ou}\n` +
        `    Widgets disponibles : ${NOMS_WIDGETS.join(', ')}.\n` +
        '    Ce bloc ne s’afficherait pas du tout sur le site. Le supprimer depuis l’admin, ou\n' +
        '    corriger son nom dans le fichier.',
    ];
  }

  switch (nom) {
    case 'galerie':
      return verifierWidgetGalerie(attributs, ou, racineProjet);
    case 'planche':
      return verifierWidgetPlanche(attributs, ou, racineProjet);
    case 'renvoi':
      return verifierWidgetRenvoi(attributs, ou, cibles);
    case 'bouton':
      return verifierWidgetBouton(attributs, ou);
    case 'video':
      return verifierWidgetVideo(attributs, ou, racineProjet);
    default:
      // « Questions-réponses » : l'éditeur exige déjà une question par bloc, et
      // rien de ce qu'il porte ne peut mettre le site en défaut.
      return [];
  }
}

/** 9c et 9g — une galerie de photos du club. */
function verifierWidgetGalerie(
  attributs: Record<string, unknown>,
  ou: string,
  racineProjet: string,
): string[] {
  const photos = Array.isArray(attributs.photos) ? attributs.photos : [];
  const problemes: string[] = [];

  photos.forEach((brute, i) => {
    const photo = (brute ?? {}) as Record<string, unknown>;
    const oup = `${ou} › photo n° ${i + 1}`;
    const fichier = texteAttribut(photo.image);

    if (!texteAttribut(photo.description)) {
      problemes.push(
        `Image sans description alternative — ${oup}\n` +
          `    Fichier : ${fichier || '(aucun)'}\n` +
          '    Remplir « Description de l’image » dans l’admin : elle est lue par les lecteurs d’écran.',
      );
    }

    if (fichier) problemes.push(...verifierFormat(fichier, oup, racineProjet));
  });

  return problemes;
}

/** 9d et 9g — une planche de bibliothèque posée dans le fil du texte. */
function verifierWidgetPlanche(
  attributs: Record<string, unknown>,
  ou: string,
  racineProjet: string,
): string[] {
  const problemes: string[] = [];
  const fichier = texteAttribut(attributs.image);

  if (!texteAttribut(attributs.alt)) {
    problemes.push(
      `Planche sans description alternative — ${ou}\n` +
        `    Fichier : ${fichier || '(aucun)'}\n` +
        '    Remplir « Description de l’image » dans l’admin : elle est lue par les lecteurs d’écran.',
    );
  }

  if (!texteAttribut(attributs.credit)) {
    problemes.push(
      `Planche sans crédit — ${ou}\n` +
        `    Fichier : ${fichier || '(aucun)'}\n` +
        '    Recopier la ligne de crédit exigée par la bibliothèque, sans la modifier. Sans elle,\n' +
        '    la publication de cette planche n’est pas en règle.',
    );
  }

  if (fichier) problemes.push(...verifierFormat(fichier, ou, racineProjet));

  return problemes;
}

/** 9a et 9b — la carte de circulation vers une autre page du site. */
function verifierWidgetRenvoi(
  attributs: Record<string, unknown>,
  ou: string,
  cibles: CiblesDeRenvoi,
): string[] {
  const cible = (attributs.cible ?? {}) as { discriminant?: unknown; value?: unknown };
  const type = texteAttribut(cible.discriminant);
  const slug = texteAttribut(cible.value);
  const types = TYPES_RENVOI as readonly string[];

  if (!types.includes(type)) {
    return [
      `Renvoi de type inconnu « ${type || '(vide)'} » — ${ou}\n` +
        `    Types disponibles : ${types.join(', ')}.\n` +
        '    Rouvrir le widget « Renvoi vers une page du site » et choisir un type dans la liste.',
    ];
  }

  const typeRenvoi = type as TypeRenvoi;
  const quoi = NOMS_CIBLE[typeRenvoi];

  // 9b. Le type est choisi, la page ne l'est pas : Keystatic n'écrit alors pas
  // de `value` du tout. La carte n'aurait ni titre, ni image, ni destination.
  if (!slug) {
    return [
      `Renvoi sans destination — ${ou}\n` +
        `    La carte annonce un renvoi vers ${quoi.singulier}, mais aucune page n’est choisie.\n` +
        `    Pages disponibles : ${listeSlugs(cibles.publiees[typeRenvoi])}.\n` +
        '    Choisir une page dans la liste déroulante du widget, ou supprimer le widget.',
    ];
  }

  // 9a, premier cas : le slug n'existe nulle part. Fiche renommée, supprimée,
  // ou adresse saisie à la main.
  if (!cibles.connus[typeRenvoi].has(slug)) {
    return [
      `Renvoi cassé — ${ou}\n` +
        `    La carte pointe vers « ${slug} », qui n’existe pas parmi ${quoi.pluriel}.\n` +
        `    Pages disponibles : ${listeSlugs(cibles.publiees[typeRenvoi])}.\n` +
        '    Rouvrir le widget et choisir la page dans la liste déroulante.',
    ];
  }

  // 9a, second cas : la fiche existe, mais elle n'est pas publiée. Le lien
  // mènerait à une page absente du site.
  if (!cibles.publiees[typeRenvoi].has(slug)) {
    return [
      `Renvoi vers une page non publiée — ${ou}\n` +
        `    La carte pointe vers « ${slug} », qui n’a pas de page sur le site.\n` +
        `    ${REMEDE_MASQUE[typeRenvoi]}\n` +
        `    Publier la fiche visée, renvoyer vers une autre page, ou supprimer le widget.\n` +
        `    Pages publiées : ${listeSlugs(cibles.publiees[typeRenvoi])}.`,
    ];
  }

  return [];
}

/** 9i — un bouton doit mener quelque part, et dire où. */
function verifierWidgetBouton(attributs: Record<string, unknown>, ou: string): string[] {
  const libelle = texteAttribut(attributs.libelle);
  const url = texteAttribut(attributs.url);
  if (libelle && url) return [];

  return [
    `Bouton incomplet — ${ou}\n` +
      `    Texte : ${libelle || '(vide)'} · Adresse : ${url || '(vide)'}\n` +
      '    Un bouton sans texte ou sans adresse ne mène nulle part. Remplir les deux champs, ou\n' +
      '    supprimer le widget.',
  ];
}

/** 9g et 9h — une vidéo posée dans le fil du texte. */
function verifierWidgetVideo(
  attributs: Record<string, unknown>,
  ou: string,
  racineProjet: string,
): string[] {
  const problemes = verifierSousTitres(attributs, ou);
  const vignette = texteAttribut(attributs.vignette);
  if (vignette) problemes.push(...verifierFormat(vignette, ou, racineProjet));
  return problemes;
}

async function verifierCorpsLibres(racineProjet: string): Promise<string[]> {
  const problemes: string[] = [];
  const parEcole = new Map<string, CiblesDeRenvoi>();

  const collections = reader.collections as unknown as Record<
    string,
    { all: () => Promise<{ slug: string; entry: Record<string, unknown> }[]> }
  >;

  for (const champ of champsDeCorps()) {
    const collection = collections[champ.collection];
    if (!collection) continue;

    let cibles = parEcole.get(champ.ecole.slug);
    if (!cibles) {
      cibles = await ciblesDeRenvoi(champ.ecole);
      parEcole.set(champ.ecole.slug, cibles);
    }

    for (const { slug, entry } of await collection.all()) {
      // Le corps est une valeur paresseuse : une fonction qu'il faut appeler
      // pour obtenir `{ node }`, l'AST Markdoc brut (cf. widgets.md §1.4).
      const lire = entry[champ.champ];
      if (typeof lire !== 'function') continue;

      const contenu = (await (lire as () => Promise<{ node: unknown } | null>)()) ?? null;
      problemes.push(
        ...verifierCorps(
          contenu?.node,
          `${champ.dossier}/${slug}.mdoc › ${champ.libelle}`,
          cibles,
          racineProjet,
        ),
      );
    }
  }

  return problemes;
}

// ── Point d'entrée ─────────────────────────────────────────────────────────

let enCours: Promise<void> | null = null;

/**
 * Lance les neuf contrôles. Lève une erreur unique listant tout ce qui cloche.
 *
 * @param aujourdhui Date de référence (`AAAA-MM-JJ`), pour les tests.
 */
export function validerContenu(aujourdhui = new Date().toISOString().slice(0, 10)): Promise<void> {
  enCours ??= (async () => {
    const racineProjet = process.cwd();

    const problemes = [
      ...verifierEcolePrincipale(),
      ...verifierRaccourcis(racineProjet),
      ...(await verifierImages(racineProjet)),
      ...(await verifierAnnonces(aujourdhui)),
      ...(await verifierTraites(racineProjet)),
      ...(await verifierPlancheRigueur()),
      ...(await verifierPistesSousTitres()),
      ...(await verifierCorpsLibres(racineProjet)),
    ];

    if (problemes.length === 0) return;

    const titre =
      problemes.length === 1
        ? 'Le contenu du site a un problème :'
        : `Le contenu du site a ${problemes.length} problèmes :`;

    throw new Error(
      `\n${titre}\n\n` +
        problemes.map((p, i) => `  ${i + 1}. ${p}`).join('\n\n') +
        '\n\nCes contrôles sont décrits dans docs/refonte/ARCHITECTURE.md §7.\n',
    );
  })();

  return enCours;
}

/** Réinitialise la mémoïsation — utilisé par le contrôle manuel des garde-fous. */
export function reinitialiserValidation(): void {
  enCours = null;
}
