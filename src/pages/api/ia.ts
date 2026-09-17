/**
 * `/api/ia` — l'assistant de la page « Questions d'armes ».
 *
 * Seule route serveur du site en dehors de l'admin Keystatic (déclarée dans le
 * `run_worker_first` de wrangler.jsonc, sinon le routage statique lui servirait
 * la 404). Deux verbes :
 *
 *   - `GET`  : l'état du service — `{ actif: true|false }`. C'est ce que la
 *     page interroge (une fois, au premier focus du champ) pour décider
 *     d'afficher ou non le bouton « Poser la question ». **Arbitrage** : un
 *     drapeau injecté au build serait faux par construction — la clé est un
 *     secret du Worker, que le builder CI ne connaît pas ; c'est donc une
 *     réponse de statut, au coût d'une petite requête différée au premier
 *     geste du visiteur (jamais au chargement).
 *   - `POST` : `{ question: string }` → `{ reponse, sources[] }`. Recherche
 *     lexicale dans l'index embarqué (`src/ia/moteur.ts`), puis rédaction par
 *     l'API Gemini à partir des seuls passages retrouvés.
 *
 * ── La clé ────────────────────────────────────────────────────────────────
 *
 * `GEMINI_API_KEY`, secret du Worker (`wrangler secret put GEMINI_API_KEY`),
 * lu au runtime via `cloudflare:workers` comme les secrets Keystatic (même
 * motif que src/middleware.ts : `locals.runtime.env` lève depuis Astro 6). En
 * dev (Node, sans adaptateur), repli sur `import.meta.env` — d'où le mode
 * bouchon : `GEMINI_API_KEY=bouchon npm run dev` prouve le chemin complet
 * requête → passages → prompt → rendu sans un octet vers Google.
 *
 * **Sans clé, le service répond proprement « non activé »** (503, JSON
 * français) et l'interface n'affiche jamais le bouton : le site reste 100 %
 * fonctionnel en mode suggestions. C'est l'état déployé en premier.
 *
 * ── Garde-fous d'abus ─────────────────────────────────────────────────────
 *
 *   - question de 3 à 300 caractères ;
 *   - en-tête `Origin` (ou à défaut `Referer`) exigé et même origine — un
 *     autre site ne peut pas faire consommer notre quota par ses visiteurs ;
 *   - ~10 questions/heure par IP. **Best effort assumé** : un compteur en
 *     mémoire d'isolat (perdu quand l'isolat est recyclé, jamais partagé
 *     entre points de présence) doublé du Cache API (persistance locale au
 *     PoP, éviction possible à tout moment). Un abuseur distribué passerait
 *     au travers ; le coût plafond reste celui du palier gratuit de Gemini,
 *     c'est le risque accepté de la v1 — la vraie parade serait Durable
 *     Objects ou le produit Rate Limiting, hors de proportion ici.
 *
 * **Aucun log du contenu des questions**, ni côté Worker (pas de
 * `console.log` de la question), ni ailleurs : l'IP n'est manipulée que
 * hachée (SHA-256 tronqué) pour le comptage. La contrepartie visiteur est
 * écrite noir sur blanc dans /confidentialite/.
 */
import type { APIRoute } from 'astro';
import { chercherPassages, type PassageRetrouve } from '../../ia/moteur';

export const prerender = false;

/** Modèle « flash » gratuit courant. En changer ne demande que cette ligne. */
const MODELE = 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODELE}:generateContent`;

const QUESTION_MIN = 3;
const QUESTION_MAX = 300;
const LIMITE_PAR_HEURE = 10;
const NB_PASSAGES = 6;

/** Le prompt système : strict, français, sobre — le ton du site. */
const PROMPT_SYSTEME = [
  'Tu es l’assistant du site du club d’AMHE « De Feu et d’Acier » (Clermont-Ferrand).',
  'Tu réponds à des questions de curieux sur les arts martiaux historiques européens, les armes anciennes et les traités d’escrime.',
  'Règles absolues :',
  `- Tu réponds UNIQUEMENT à partir des passages fournis ci-dessous. Tu n’ajoutes aucun fait qui n’y figure pas, même si tu crois le connaître.`,
  '- Si les passages ne suffisent pas à répondre, tu le dis simplement, et tu renvoies vers les questions publiées de la page et vers les profs du club.',
  '- 120 mots maximum. Une réponse courte et juste vaut mieux qu’une réponse longue.',
  '- Ton sobre et précis, sans emphase, sans point d’exclamation. Jamais de tiret cadratin.',
  '- Tu ne donnes JAMAIS de conseil médical, de sécurité ou d’équipement de protection : pour tout ce qui touche à la pratique physique en salle, tu renvoies vers les profs du club.',
  '- Tu ne cites pas d’adresse web dans le texte (les sources sont affichées sous ta réponse par le site).',
  '- Tu réponds en français, en texte brut, sans mise en forme Markdown.',
].join('\n');

// ── Environnement ──────────────────────────────────────────────────────────

/**
 * La clé, lue au runtime du Worker d'abord (`cloudflare:workers`, comme les
 * secrets Keystatic), sinon dans l'environnement de dev (`import.meta.env`).
 */
async function lireCle(): Promise<string> {
  try {
    const { env } = await import('cloudflare:workers');
    const cle = env.GEMINI_API_KEY;
    if (typeof cle === 'string' && cle.trim()) return cle.trim();
  } catch {
    /* hors workerd : dev Node — on regarde import.meta.env */
  }
  const cle = import.meta.env.GEMINI_API_KEY;
  return typeof cle === 'string' ? cle.trim() : '';
}

/** `GEMINI_API_KEY=bouchon` : chemin complet sans appel réseau (dev/recette). */
const estBouchon = (cle: string) => cle.toLowerCase() === 'bouchon';

// ── Petites réponses JSON, toutes du même moule ────────────────────────────

const json = (corps: unknown, statut = 200) =>
  new Response(JSON.stringify(corps), {
    status: statut,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });

const erreur = (statut: number, message: string) => json({ erreur: message }, statut);

// ── Limite par IP : mémoire d'isolat + Cache API, best effort ──────────────

interface Compteur {
  compte: number;
  expire: number;
}

/** Compteurs de l'isolat courant. Perdus à son recyclage : assumé. */
const compteurs = new Map<string, Compteur>();

/** SHA-256 tronqué : on ne garde jamais l'adresse IP en clair. */
async function hacherIp(ip: string): Promise<string> {
  const empreinte = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  return [...new Uint8Array(empreinte).slice(0, 12)]
    .map((o) => o.toString(16).padStart(2, '0'))
    .join('');
}

/** Adresse fictive interne : une clé de Cache API doit être une URL http. */
const cleCache = (hash: string) => `https://limite.ia.interne/${hash}`;

async function ouvrirCache(): Promise<Cache | null> {
  try {
    return await caches.open('limite-ia');
  } catch {
    return null; // dev Node : pas de Cache API, la mémoire suffit
  }
}

/** Vrai si l'IP a dépassé la limite. Incrémente le compteur sinon. */
async function limiteAtteinte(ip: string): Promise<boolean> {
  const hash = await hacherIp(ip);
  const maintenant = Date.now();

  let compteur = compteurs.get(hash);
  const cache = await ouvrirCache();

  // L'isolat ne sait rien de cette IP : le Cache API, peut-être, si.
  if ((!compteur || compteur.expire <= maintenant) && cache) {
    try {
      const enCache = await cache.match(cleCache(hash));
      if (enCache) {
        const lu = (await enCache.json()) as Compteur;
        if (lu.expire > maintenant) compteur = lu;
      }
    } catch {
      /* cache illisible : on repart de zéro, best effort */
    }
  }

  if (!compteur || compteur.expire <= maintenant) {
    compteur = { compte: 0, expire: maintenant + 3600_000 };
  }

  if (compteur.compte >= LIMITE_PAR_HEURE) return true;

  compteur.compte += 1;
  compteurs.set(hash, compteur);
  if (cache) {
    const ttl = Math.max(60, Math.ceil((compteur.expire - maintenant) / 1000));
    try {
      await cache.put(
        cleCache(hash),
        new Response(JSON.stringify(compteur), {
          headers: { 'Cache-Control': `max-age=${ttl}` },
        }),
      );
    } catch {
      /* best effort : la mémoire d'isolat reste le premier verrou */
    }
  }

  // Ménage opportuniste : la Map ne grossit pas au fil des heures.
  if (compteurs.size > 2000) {
    for (const [cle, valeur] of compteurs) {
      if (valeur.expire <= maintenant) compteurs.delete(cle);
    }
  }

  return false;
}

// ── Génération ─────────────────────────────────────────────────────────────

/** Le message utilisateur : la question, puis les passages numérotés. */
function composerPrompt(question: string, passages: PassageRetrouve[]): string {
  const blocs = passages.map((p, i) => `[${i + 1}] ${p.titre}\n${p.texte}`);
  return `Question du visiteur : ${question}\n\nPassages :\n\n${blocs.join('\n\n')}`;
}

/**
 * Le bouchon rend une réponse déterministe bâtie sur les mêmes passages et le
 * même prompt que la vraie génération : tout le chemin est exercé, seul
 * l'appel réseau manque.
 */
function genererBouchon(prompt: string, passages: PassageRetrouve[]): string {
  const premier = passages[0]!;
  const extrait = premier.texte.split(/\s+/).slice(0, 45).join(' ');
  return (
    `[bouchon : réponse de test, ${passages.length} passage(s), ` +
    `prompt de ${prompt.length} caractères] D’après « ${premier.titre} » : ${extrait}…`
  );
}

/** Appel REST Gemini. Rend le texte, ou `null` si l'API ne répond pas bien. */
async function genererGemini(cle: string, prompt: string): Promise<string | null> {
  let reponse: Response;
  try {
    reponse = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': cle,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: PROMPT_SYSTEME }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 2048 },
      }),
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    return null; // réseau, délai : l'appelant rend l'erreur sobre
  }
  if (!reponse.ok) return null;

  try {
    const corps = (await reponse.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const texte = (corps.candidates?.[0]?.content?.parts ?? [])
      .map((p) => p.text ?? '')
      .join('')
      .trim();
    return texte || null;
  } catch {
    return null;
  }
}

// ── Les deux verbes ────────────────────────────────────────────────────────

export const GET: APIRoute = async () => {
  const cle = await lireCle();
  return json({ actif: cle.length > 0 });
};

// Pas de déstructuration du contexte : `clientAddress` est un accesseur qui
// peut lever quand l'adresse n'est pas disponible — déstructurer l'évaluerait
// avant tout `try`.
export const POST: APIRoute = async (contexte) => {
  const { request, url } = contexte;
  // Même origine exigée : le navigateur pose toujours `Origin` sur un POST
  // fetch ; à défaut (client non navigateur), `Referer` fait foi. Rien des
  // deux, ou une autre origine → refus.
  const origine = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const memeOrigine =
    (origine && origine === url.origin) || (!origine && referer?.startsWith(url.origin));
  if (!memeOrigine) {
    return erreur(403, 'Cette adresse ne répond qu’aux pages du site.');
  }

  const cle = await lireCle();
  if (!cle) {
    return erreur(
      503,
      'Le service de réponse n’est pas activé. Les questions publiées sur cette page restent le meilleur point de départ.',
    );
  }

  let question = '';
  try {
    const corps = (await request.json()) as { question?: unknown };
    if (typeof corps.question === 'string') question = corps.question.trim();
  } catch {
    return erreur(400, 'Requête illisible : un objet JSON { question } est attendu.');
  }

  if (question.length < QUESTION_MIN || question.length > QUESTION_MAX) {
    return erreur(400, `La question doit faire entre ${QUESTION_MIN} et ${QUESTION_MAX} caractères.`);
  }

  // L'IP : l'en-tête Cloudflare d'abord, l'adaptateur ensuite (dev/preview).
  let ip = request.headers.get('cf-connecting-ip') ?? '';
  if (!ip) {
    try {
      ip = contexte.clientAddress;
    } catch {
      ip = 'inconnue';
    }
  }
  if (await limiteAtteinte(ip)) {
    return erreur(
      429,
      'Beaucoup de questions en peu de temps : le service est limité à une dizaine par heure. Réessayez un peu plus tard.',
    );
  }

  const passages = await chercherPassages(question, NB_PASSAGES);

  // Rien d'assez proche dans le corpus : pas d'appel au modèle, la réponse
  // honnête est directe (et gratuite).
  if (passages.length === 0) {
    return json({
      reponse:
        'Nos sources ne permettent pas de répondre à cette question. ' +
        'Les questions publiées sur cette page couvrent peut-être le sujet ; ' +
        'sinon, les profs du club y répondront volontiers en salle.',
      sources: [],
    });
  }

  const prompt = composerPrompt(question, passages);
  const texte = estBouchon(cle)
    ? genererBouchon(prompt, passages)
    : await genererGemini(cle, prompt);

  if (!texte) {
    return erreur(
      503,
      'Le service de réponse ne répond pas pour le moment. Réessayez plus tard, ou parcourez les questions publiées.',
    );
  }

  // Les sources citées sous la réponse : une par document, ordre des scores.
  const vues = new Set<string>();
  const sources = passages
    .filter((p) => (vues.has(p.url) ? false : (vues.add(p.url), true)))
    .slice(0, 4)
    .map((p) => ({
      titre: p.titre,
      url: p.url,
      wiki: p.licence.includes('CC BY-NC-SA'),
    }));

  return json({ reponse: texte, sources });
};
