/**
 * Garde-fous du build — ARCHITECTURE.md §7.
 *
 * Six vérifications, six échecs de build avec un message qui dit **quoi
 * corriger et où** :
 *
 *   1. un raccourci inconnu dans un texte du CMS (`{tarrif}`, `{Email}`) ;
 *   2. aucune école principale, ou plusieurs ;
 *   3. une image de contenu sans description alternative ;
 *   4. deux annonces épinglées en bandeau en même temps ;
 *   5. une image déposée dans un format que le build ne sait pas traiter ;
 *   6. un traité dont les droits ne sont pas en règle (planche sans description
 *      ou sans crédit, licence sans adresse, extrait cité sans sa source).
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
import { ECOLES } from '../config/ecoles';
import { annoncesDe, lireTraites, reader } from './contenu';
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

  for (const { slug, entry } of await lireTraites()) {
    const ou = `traites › ${slug}`;
    const nom = entry.titre || slug;

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

// ── Point d'entrée ─────────────────────────────────────────────────────────

let enCours: Promise<void> | null = null;

/**
 * Lance les six contrôles. Lève une erreur unique listant tout ce qui cloche.
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
