#!/usr/bin/env node
/**
 * Recette automatisée du site — `npm run recette`.
 *
 * Rejoue, sur le rendu réel (jamais déduit du source), les huit contrôles
 * d'acceptation qui suivent une grosse édition de contenu ou précèdent un
 * déploiement manuel. Voir docs/RECETTE.md pour le mode d'emploi et la
 * lecture d'un échec.
 *
 *   1. Les routes connues répondent 200 ; une adresse inconnue répond 404.
 *   2. Zéro débordement horizontal à 390/820/1000/1440 px sur 6 gabarits.
 *   3. Zéro <script>/<noscript> visible (le piège du `display: grid` universel).
 *   4. Un seul <h1> par page ; sitemap.xml compte autant d'URL que de pages
 *      HTML construites, 404 exclue.
 *   5. Sur chaque fiche de traité : autant de crédits affichés que de
 *      planches ; « digitalisiert von Google » sur Marozzo ; lien de licence
 *      CC BY 4.0 sur l'I.33.
 *   6. « Netflix » apparaît exactement une fois sur l'accueil ; zéro tiret
 *      cadratin dans un paragraphe de prose (hors crédits et citations).
 *   7. Aucune image cassée (`naturalWidth === 0`) ; zéro violation axe-core
 *      WCAG 2.1 AA.
 *   8. Les canaux techniques répondent : `/rss.xml` bien formé, au moins un
 *      article, liens absolus ; `/.well-known/security.txt` avec un contact
 *      et une date d'expiration à venir ; `/site.webmanifest` valide et
 *      toutes ses icônes servies.
 *
 * Par défaut, le script construit le site (`npm run build`) puis démarre son
 * propre `npm run preview` sur http://localhost:4321, qu'il arrête à la fin
 * (succès, échec ou interruption — tout passe par un `finally`). On peut lui
 * donner une cible déjà en ligne avec `--url` :
 *
 *   npm run recette                              # build + preview locaux
 *   npm run recette -- --url=http://localhost:4321   # preview déjà lancé
 *   npm run recette -- --url=https://dfda-amhe.fr     # site déployé
 *
 * En mode `--url`, le contrôle 4 (sitemap vs pages HTML) est ignoré si
 * `dist/client/` n'existe pas localement — il compare le sitemap servi au
 * contenu du dernier build sur ce poste, pas à un site distant qu'il ne peut
 * pas parcourir intégralement.
 */

import { chromium } from 'playwright';
import { execSync, spawn } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const DIST_CLIENT = path.join(REPO, 'dist', 'client');
const BASE_DEFAUT = 'http://localhost:4321';
const VIEWPORT_DEFAUT = { width: 1440, height: 900 };

// ── Le plan du site : à tenir à jour à la main, comme sitemap.xml.ts ───────
//
// 21 pages connues (toutes attendues à 200) + 1 adresse volontairement
// inconnue (attendue à 404) = les 22 routes du cahier des charges.

const ROUTES_CONNUES = [
  '/',
  '/actualites/',
  '/actualites/le-site-fait-peau-neuve/',
  '/armes/epee-longue/',
  '/armes/messer/',
  '/armes/combat-viking/',
  '/armes/rapiere/',
  '/profs/gabriel-tardio/',
  '/profs/marie-poignant/',
  '/profs/ludwig-fort/',
  '/sources/',
  '/sources/talhoffer-1467/',
  '/sources/leckuchner-cgm582/',
  '/sources/noble-science-1538/',
  '/sources/sainct-didier-1573/',
  '/sources/fabris-1606/',
  '/sources/marozzo-opera-nova/',
  '/sources/i33/',
  '/sources/paulus-kal/',
  '/mentions-legales/',
  '/confidentialite/',
];

/** Ne correspond à aucune page : sert uniquement à vérifier le 404. */
const ROUTE_INCONNUE = '/cette-page-n-existe-pas--recette-qa/';

/** Fiches de traité, dérivées des routes /sources/<slug>/ ci-dessus. */
const SLUGS_TRAITES = ROUTES_CONNUES.filter((r) => r.startsWith('/sources/') && r !== '/sources/').map(
  (r) => r.split('/')[2],
);

/**
 * 6 gabarits représentatifs pour le contrôle de débordement (point 2) : le
 * passer sur les 21 pages coûterait cher pour peu de gain, ces six-là
 * couvrent le hero de l'accueil, une fiche arme, une fiche prof, la liste
 * d'actualités, l'index des sources et une fiche de traité (la plus dense en
 * mise en page : galerie, encadré de numérisation, extrait).
 */
const PAGES_DEBORDEMENT = [
  '/',
  '/armes/epee-longue/',
  '/profs/marie-poignant/',
  '/actualites/',
  '/sources/',
  '/sources/talhoffer-1467/',
];
const LARGEURS_DEBORDEMENT = [390, 820, 1000, 1440];

// ── Journal de résultats : chaque contrôle s'y ajoute, le résumé le relit ──

const resultats = [];

/** Enregistre un contrôle et l'affiche aussitôt en ✓/✗. */
function ligne(section, libelle, ok, detail = '') {
  resultats.push({ section, libelle, ok, detail });
  const marque = ok ? '✓' : '✗';
  console.log(`${marque} [${section}] ${libelle}${detail ? ' — ' + detail : ''}`);
}

// ── Démarrage / arrêt du serveur testé ──────────────────────────────────────

function analyserArguments(argv) {
  let urlCli = null;
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--url') urlCli = argv[i + 1];
    else if (a.startsWith('--url=')) urlCli = a.slice('--url='.length);
  }
  return { urlCli };
}

/** Attend qu'une URL réponde (n'importe quel statut : le serveur est monté). */
async function attendreServeur(url, tentativesMax = 40) {
  for (let i = 0; i < tentativesMax; i += 1) {
    try {
      const reponse = await fetch(url);
      if (reponse.status) return true;
    } catch {
      /* pas encore prêt, on retente */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

/**
 * Fournit l'URL de base à tester. Sans `--url` : construit le site puis lance
 * `npm run preview` en arrière-plan et attend qu'il réponde. Avec `--url` :
 * ne touche à rien, la cible est supposée déjà servie.
 */
async function demarrerServeur(urlCli) {
  if (urlCli) {
    console.log(`→ cible fournie : ${urlCli} (pas de build, pas de preview lancé ici)`);
    return { base: urlCli.replace(/\/+$/, ''), arreter: () => {} };
  }

  console.log('→ npm run build …');
  execSync('npm run build', { cwd: REPO, stdio: 'inherit' });

  console.log('→ npm run preview …');
  const processus = spawn('npm', ['run', 'preview'], { cwd: REPO, stdio: 'ignore', detached: true });
  const base = BASE_DEFAUT;
  const pret = await attendreServeur(`${base}/`);
  if (!pret) {
    try {
      process.kill(-processus.pid);
    } catch {
      /* déjà mort */
    }
    throw new Error(`le serveur de preview ne répond pas sur ${base} après 20 s`);
  }
  return {
    base,
    arreter: () => {
      try {
        process.kill(-processus.pid);
      } catch {
        /* déjà arrêté */
      }
    },
  };
}

// ── Petits outils Playwright partagés ───────────────────────────────────────

async function ouvrirPage(navigateur, viewport) {
  const page = await navigateur.newPage({ viewport });
  page.setDefaultTimeout(15000);
  page.setDefaultNavigationTimeout(20000);
  return page;
}

/**
 * Déclenche les images `loading="lazy"` en parcourant toute la page puis
 * remonte en haut. Sans ce défilement, les vignettes sous le premier écran
 * mesureraient `naturalWidth === 0` — un faux positif du contrôle 7, pas un
 * vrai problème.
 */
async function laisserRespirer(page) {
  // Neutralise l'animation d'apparition : un nœud `.reveal` encore à
  // opacité 0 est ignoré par axe-core et fausse les captures — les résultats
  // variaient d'un lancement à l'autre selon l'instant du scan.
  await page.addStyleTag({
    content: '.reveal { opacity: 1 !important; transform: none !important; transition: none !important; }',
  });
  await page.evaluate(async () => {
    await new Promise((termine) => {
      let y = 0;
      const pas = () => {
        y += 700;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight + 700) setTimeout(pas, 80);
        else termine();
      };
      pas();
    });
    window.scrollTo(0, 0);
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(300);
}

function chargerAxeSource() {
  const chemin = path.join(REPO, 'node_modules', 'axe-core', 'axe.min.js');
  return existsSync(chemin) ? readFileSync(chemin, 'utf8') : null;
}

// ── Mesure unique par route (points 1, 3, 4a, 6, 7) ─────────────────────────

/**
 * Visite une route UNE fois et rassemble tout ce qui ne dépend pas d'une
 * largeur de fenêtre particulière, pour éviter de recharger 21 pages une
 * fois par contrôle : statut HTTP, structure (H1, scripts visibles), images
 * cassées, tirets cadratins de prose, occurrences de « Netflix », et — si
 * axe-core est disponible — les violations WCAG AA.
 */
async function mesurerPage(navigateur, base, chemin, axeSrc) {
  const page = await ouvrirPage(navigateur, VIEWPORT_DEFAUT);
  const resultat = {
    chemin,
    statut: 0,
    h1: 0,
    scriptsVisibles: 0,
    totalImages: 0,
    imagesCassees: 0,
    tiretsProse: [],
    netflixOccurrences: 0,
    violationsAxe: null,
    erreur: null,
  };
  try {
    const reponse = await page.goto(base + chemin, { waitUntil: 'load' });
    resultat.statut = reponse ? reponse.status() : 0;
    await laisserRespirer(page);

    const dom = await page.evaluate(() => {
      // Un <p> est un crédit ou une citation si lui-même ou un de ses
      // ancêtres porte une classe qui contient "credit" ou "citation" —
      // toutes les lignes de crédit du site (planche, prof, club, etc.)
      // et les blocs de citation suivent cette convention de nommage.
      const estCreditOuCitation = (el) => {
        let n = el;
        while (n) {
          if (typeof n.className === 'string' && /credit|citation/i.test(n.className)) return true;
          n = n.parentElement;
        }
        return false;
      };

      const paragraphes = [...document.querySelectorAll('p')];
      const tiretsProse = paragraphes
        .filter((p) => {
          if (estCreditOuCitation(p)) return false;
          const texte = p.textContent.replace(/\s+/g, ' ').trim();
          if (!texte.includes('—')) return false;
          // Un tiret cadratin dans un court libellé (ex. la pastille de
          // dates « XIVᵉ — XVᵉ s. ») n'est pas de la prose : sous 8 mots,
          // ce n'est jamais une phrase rédigée.
          return texte.split(' ').filter(Boolean).length >= 8;
        })
        .map((p) => p.textContent.replace(/\s+/g, ' ').trim().slice(0, 90));

      const images = [...document.querySelectorAll('img')];

      return {
        h1: document.querySelectorAll('h1').length,
        // Critère : une boîte réellement rendue (le bug historique de la
        // grille donnait un <script> de 326 px de haut). `display` seul ne
        // suffit pas : le shell headless n'applique pas le `display: none`
        // du navigateur réel aux <noscript>, qui ne rendent pourtant rien.
        scriptsVisibles: [...document.querySelectorAll('script, noscript')].filter(
          (n) => n.getBoundingClientRect().height > 0,
        ).length,
        totalImages: images.length,
        imagesCassees: images.filter((i) => i.complete && i.naturalWidth === 0).length,
        tiretsProse,
        netflixOccurrences: (document.body.innerText.match(/Netflix/g) || []).length,
      };
    });
    Object.assign(resultat, dom);

    if (axeSrc) {
      await page.addScriptTag({ content: axeSrc });
      resultat.violationsAxe = await page.evaluate(async () => {
        const rapport = await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa'] });
        return rapport.violations.map((v) => ({ id: v.id, impact: v.impact, noeuds: v.nodes.length }));
      });
    }
  } catch (e) {
    resultat.erreur = String(e?.message ?? e).slice(0, 150);
  } finally {
    await page.close();
  }
  return resultat;
}

// ── Rapports tirés des mesures ci-dessus (une petite fonction par point) ───

function rapporterRoutes(mesures) {
  console.log('\n── 1. Statut HTTP 200 des pages connues ──');
  for (const m of mesures) {
    ligne('1-routes', m.chemin, m.statut === 200 && !m.erreur, m.erreur ?? `HTTP ${m.statut}`);
  }
}

function rapporterScripts(mesures) {
  console.log('\n── 3. Aucun <script>/<noscript> visible ──');
  for (const m of mesures) {
    ligne('3-scripts', m.chemin, m.scriptsVisibles === 0, m.scriptsVisibles ? `${m.scriptsVisibles} visible(s)` : '');
  }
}

function rapporterH1(mesures) {
  console.log('\n── 4. Un seul <h1> par page ──');
  for (const m of mesures) ligne('4-h1', m.chemin, m.h1 === 1, `${m.h1} <h1>`);
}

function rapporterImages(mesures) {
  console.log('\n── 7. Aucune image cassée (naturalWidth = 0) ──');
  for (const m of mesures) {
    ligne('7-images', m.chemin, m.imagesCassees === 0, `${m.imagesCassees}/${m.totalImages} cassée(s)`);
  }
}

function rapporterTirets(mesures) {
  console.log("\n── 6. Zéro tiret cadratin dans la prose (hors crédits/citations) ──");
  for (const m of mesures) {
    const ok = m.tiretsProse.length === 0;
    ligne('6-tirets', m.chemin, ok, ok ? '' : `« …${m.tiretsProse[0]}… »`);
  }
}

function rapporterNetflix(mesures) {
  console.log('\n── 6bis. « Netflix » présent exactement une fois sur l’accueil ──');
  const accueil = mesures.find((m) => m.chemin === '/');
  const n = accueil?.netflixOccurrences ?? 0;
  ligne('6-netflix', '/', n === 1, `${n} occurrence(s)`);
}

function rapporterAxe(mesures, axeSrc) {
  console.log('\n── 7bis. axe-core — zéro violation WCAG 2.1 AA ──');
  if (!axeSrc) {
    ligne(
      '7-axe',
      'axe-core présent dans node_modules',
      false,
      "introuvable — lance `npm install` (ajouté aux devDependencies) puis relance la recette",
    );
    return;
  }
  for (const m of mesures) {
    const violations = m.violationsAxe ?? [];
    ligne(
      '7-axe',
      m.chemin,
      violations.length === 0,
      violations.length ? violations.map((v) => `${v.id} (${v.impact}, ×${v.noeuds})`).join(', ') : '',
    );
  }
}

// ── Point 1bis : la route inconnue doit répondre 404 ────────────────────────

async function verifierRouteInconnue(navigateur, base) {
  console.log('\n── 1bis. Une adresse inconnue répond 404 ──');
  const page = await ouvrirPage(navigateur, VIEWPORT_DEFAUT);
  try {
    const reponse = await page.goto(base + ROUTE_INCONNUE, { waitUntil: 'load' });
    const statut = reponse ? reponse.status() : 0;
    ligne('1-404', ROUTE_INCONNUE, statut === 404, `HTTP ${statut}`);
  } catch (e) {
    ligne('1-404', ROUTE_INCONNUE, false, String(e?.message ?? e).slice(0, 120));
  } finally {
    await page.close();
  }
}

// ── Point 2 : débordement horizontal ────────────────────────────────────────

/** Débordement horizontal réel de la page, avec quelques coupables pour le diagnostic. */
async function mesurerDebordement(page) {
  return page.evaluate(() => {
    const d = document.documentElement;
    const coupables = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > d.clientWidth + 1 || r.left < -1)) {
        coupables.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} [${Math.round(r.left)}→${Math.round(r.right)}]`);
        if (coupables.length >= 4) break;
      }
    }
    return { scrollWidth: d.scrollWidth, clientWidth: d.clientWidth, coupables };
  });
}

async function verifierDebordement(navigateur, base) {
  console.log('\n── 2. Débordement horizontal (390 / 820 / 1000 / 1440 px) ──');
  for (const chemin of PAGES_DEBORDEMENT) {
    const page = await ouvrirPage(navigateur, { width: LARGEURS_DEBORDEMENT[0], height: 900 });
    try {
      await page.goto(base + chemin, { waitUntil: 'load' });
      for (const largeur of LARGEURS_DEBORDEMENT) {
        await page.setViewportSize({ width: largeur, height: 900 });
        await page.waitForTimeout(180);
        const o = await mesurerDebordement(page);
        const ok = o.scrollWidth <= o.clientWidth;
        ligne(
          '2-debordement',
          `${chemin} @${largeur}px`,
          ok,
          ok ? '' : `${o.scrollWidth} vs ${o.clientWidth} — ${o.coupables.join(' | ')}`,
        );
      }
    } catch (e) {
      ligne('2-debordement', chemin, false, String(e?.message ?? e).slice(0, 120));
    } finally {
      await page.close();
    }
  }
}

// ── Point 4b : sitemap.xml == pages HTML − 404 ──────────────────────────────

/** Liste récursivement les *.html sous `dossier`, chemins relatifs à `dossier`. */
function listerHtml(dossier) {
  let trouves = [];
  for (const entree of readdirSync(dossier, { withFileTypes: true })) {
    const chemin = path.join(dossier, entree.name);
    if (entree.isDirectory()) trouves = trouves.concat(listerHtml(chemin));
    else if (entree.name.endsWith('.html')) trouves.push(chemin);
  }
  return trouves;
}

async function verifierSitemap(base) {
  console.log('\n── 4bis. sitemap.xml compte autant d’URL que de pages HTML (404 exclue) ──');
  if (!existsSync(DIST_CLIENT)) {
    console.log('ℹ  dist/client/ introuvable localement — contrôle ignoré (mode --url sans build local).');
    return;
  }
  const fichiersHtml = listerHtml(DIST_CLIENT).filter((f) => path.basename(f) !== '404.html');

  let xml = '';
  try {
    xml = await (await fetch(`${base}/sitemap.xml`)).text();
  } catch (e) {
    ligne('4-sitemap', 'GET /sitemap.xml', false, String(e?.message ?? e).slice(0, 120));
    return;
  }
  const nbLoc = (xml.match(/<loc>/g) || []).length;
  ligne(
    '4-sitemap',
    'nombre d’URL du sitemap == nombre de pages HTML construites',
    nbLoc === fichiersHtml.length,
    `sitemap ${nbLoc} vs dist/client ${fichiersHtml.length} fichier(s) html (404.html exclue)`,
  );
}

// ── Point 8 : canaux techniques (RSS, security.txt) ─────────────────────────

async function verifierFluxTechniques(base) {
  console.log('\n── 8. Canaux techniques : /rss.xml et /.well-known/security.txt ──');

  try {
    const reponse = await fetch(`${base}/rss.xml`);
    const xml = reponse.ok ? await reponse.text() : '';
    const items = (xml.match(/<item>/g) || []).length;
    const liens = [...xml.matchAll(/<link>([^<]*)<\/link>/g)].map((m) => m[1]);
    const liensAbsolus = liens.length > 0 && liens.every((l) => l.startsWith('https://'));
    ligne(
      '8-flux',
      '/rss.xml répond, bien formé, au moins un article, liens absolus',
      reponse.ok && xml.includes('<rss ') && items >= 1 && liensAbsolus,
      `HTTP ${reponse.status}, ${items} item(s), ${liens.length} lien(s)`,
    );
  } catch (e) {
    ligne('8-flux', 'GET /rss.xml', false, String(e?.message ?? e).slice(0, 120));
  }

  try {
    const reponse = await fetch(`${base}/.well-known/security.txt`);
    const texte = reponse.ok ? await reponse.text() : '';
    const expire = texte.match(/^Expires:\s*(\S+)/m)?.[1];
    const encoreValable = Boolean(expire) && new Date(expire) > new Date();
    ligne(
      '8-flux',
      '/.well-known/security.txt répond, avec contact et échéance à venir',
      reponse.ok && /^Contact:\s*mailto:/m.test(texte) && encoreValable,
      `HTTP ${reponse.status}, Expires ${expire ?? 'absent'}`,
    );
  } catch (e) {
    ligne('8-flux', 'GET /.well-known/security.txt', false, String(e?.message ?? e).slice(0, 120));
  }

  try {
    const reponse = await fetch(`${base}/site.webmanifest`);
    let manifest = null;
    try {
      manifest = reponse.ok ? await reponse.json() : null;
    } catch {
      /* JSON invalide : `manifest` reste nul, la ligne ci-dessous échoue. */
    }
    const icones = Array.isArray(manifest?.icons) ? manifest.icons : [];
    const iconesServies = [];
    for (const icone of icones) {
      const r = await fetch(`${base}${icone.src}`);
      if (r.ok) iconesServies.push(icone.src);
    }
    ligne(
      '8-flux',
      '/site.webmanifest répond, JSON valide, toutes ses icônes servies',
      reponse.ok && Boolean(manifest?.name) && icones.length > 0 && iconesServies.length === icones.length,
      `HTTP ${reponse.status}, ${iconesServies.length}/${icones.length} icône(s)`,
    );
  } catch (e) {
    ligne('8-flux', 'GET /site.webmanifest', false, String(e?.message ?? e).slice(0, 120));
  }
}

// ── Point 5 : fiches de traité ───────────────────────────────────────────────

async function verifierFichesTraites(navigateur, base) {
  console.log('\n── 5. Fiches de traités : crédits == planches, mentions obligatoires ──');
  const page = await ouvrirPage(navigateur, VIEWPORT_DEFAUT);
  try {
    for (const slug of SLUGS_TRAITES) {
      await page.goto(`${base}/sources/${slug}/`, { waitUntil: 'load' });
      await laisserRespirer(page);
      const m = await page.evaluate(() => {
        const visible = (el) => {
          if (!el) return false;
          const r = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
        };
        const planches = [...document.querySelectorAll('.planches__item')];
        const creditsVisibles = planches
          .map((p) => p.querySelector('.planche__credit'))
          .filter((c) => visible(c) && c.textContent.trim().length > 0);
        return { planches: planches.length, credits: creditsVisibles.length };
      });
      ligne(
        '5-fiches',
        `/sources/${slug}/ — crédits affichés == planches affichées`,
        m.planches > 0 && m.credits === m.planches,
        `${m.credits}/${m.planches}`,
      );
    }

    // Marozzo : la numérisation est un partenariat Google, la mention est
    // contractuelle et doit figurer sur CHAQUE crédit de planche (pas
    // seulement une fois sur la page). Cf. ARCHITECTURE.md §6.
    await page.goto(`${base}/sources/marozzo-opera-nova/`, { waitUntil: 'load' });
    const marozzoOk = await page.evaluate(() =>
      [...document.querySelectorAll('.planche__credit')].every((c) => c.textContent.includes('digitalisiert von Google')),
    );
    ligne('5-marozzo', '« digitalisiert von Google » sur chaque crédit Marozzo', marozzoOk, '');

    // I.33 : licence CC BY 4.0 du Royal Armouries — le lien peut apparaître
    // dans le crédit de planche (auto-lié) ou dans l'encadré de
    // numérisation ; on le cherche n'importe où sur la page plutôt que sur
    // un sélecteur précis, pour ne pas dépendre de l'endroit où il est rendu.
    await page.goto(`${base}/sources/i33/`, { waitUntil: 'load' });
    const i33Ok = await page.evaluate(() =>
      Boolean(document.querySelector('a[href*="creativecommons.org/licenses/by/4.0"]')),
    );
    ligne('5-i33', 'lien de licence CC BY 4.0 présent sur la fiche I.33', i33Ok, '');
  } finally {
    await page.close();
  }
}

// ── Résumé final ─────────────────────────────────────────────────────────────

function imprimerResume() {
  const echecs = resultats.filter((r) => !r.ok);
  console.log(`\n===== RECETTE : ${resultats.length} contrôle(s), ${echecs.length} échec(s) =====`);
  if (echecs.length === 0) {
    console.log('Tout est vert.');
    return;
  }
  console.log('\nÀ corriger :');
  for (const e of echecs) console.log(`  ✗ [${e.section}] ${e.libelle}${e.detail ? ' — ' + e.detail : ''}`);
}

// ── Orchestration ────────────────────────────────────────────────────────────

async function main() {
  const { urlCli } = analyserArguments(process.argv.slice(2));
  const axeSrc = chargerAxeSource();
  const { base, arreter } = await demarrerServeur(urlCli);

  try {
    const navigateur = await chromium.launch();
    try {
      // Une seule visite par route connue : nourrit les points 1, 3, 4a, 6 et 7.
      const mesures = [];
      for (const chemin of ROUTES_CONNUES) {
        mesures.push(await mesurerPage(navigateur, base, chemin, axeSrc));
      }

      rapporterRoutes(mesures);
      await verifierRouteInconnue(navigateur, base);
      await verifierDebordement(navigateur, base);
      rapporterScripts(mesures);
      rapporterH1(mesures);
      await verifierSitemap(base);
      await verifierFluxTechniques(base);
      await verifierFichesTraites(navigateur, base);
      rapporterNetflix(mesures);
      rapporterTirets(mesures);
      rapporterImages(mesures);
      rapporterAxe(mesures, axeSrc);
    } finally {
      await navigateur.close();
    }
  } finally {
    arreter();
  }

  imprimerResume();
  process.exitCode = resultats.some((r) => !r.ok) ? 1 : 0;
}

main().catch((e) => {
  console.error('ÉCHEC FATAL —', e?.stack ?? e);
  process.exitCode = 1;
});
