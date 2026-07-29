/**
 * Middleware — compatibilité Keystatic ↔ adaptateur Cloudflare v14, et
 * en-têtes de sécurité de l'admin.
 *
 * `@keystatic/astro` 5.2 lit ses secrets dans `context.locals.runtime.env`,
 * l'API des adaptateurs Cloudflare d'avant Astro 6. Depuis, l'adaptateur
 * remplace cette propriété par un accesseur qui **lève une erreur** invitant à
 * utiliser `import { env } from 'cloudflare:workers'`. Résultat sans ce
 * correctif : toute requête vers `/api/keystatic/*` répond 500, donc pas
 * d'admin du tout.
 *
 * On rétablit donc un `locals.runtime.env` ordinaire, alimenté par les vraies
 * variables du Worker, uniquement sur les routes de l'API Keystatic. C'est ce
 * qui permet aux **trois secrets** (`KEYSTATIC_SECRET`,
 * `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`) d'être lus au
 * runtime, comme des secrets Cloudflare, plutôt que d'être figés dans le bundle
 * au build.
 *
 * ⚠️ `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` n'est PAS de ceux-là : Keystatic le lit
 * via `import.meta.env` dans son bundle **client**, c'est-à-dire une
 * substitution Vite faite au moment du `astro build`. Un secret Cloudflare du
 * même nom resterait sans effet. Il est donc figé dans le dépôt (`.env`), cf.
 * README §« Variables d'environnement ».
 *
 * À retirer le jour où `@keystatic/astro` publie une version compatible
 * Astro 6+ : ce fichier est une rustine, pas une décision d'architecture.
 */
import { defineMiddleware } from 'astro:middleware';

const PREFIXE_API_KEYSTATIC = '/api/keystatic';
const PREFIXE_ADMIN = '/keystatic';

/**
 * En-têtes posés sur l'admin et son API.
 *
 * `public/_headers` ne peut pas s'en charger : il ne s'applique qu'aux réponses
 * servies depuis les assets statiques, or ces deux routes sortent du Worker
 * (`run_worker_first` de wrangler.jsonc). Le `frame-ancestors` évite qu'un
 * rédacteur connecté soit piégé dans une iframe tierce ; le `X-Robots-Tag`
 * désindexe réellement l'admin, là où une ligne `Disallow` de robots.txt se
 * contenterait d'en annoncer le chemin.
 */
const ENTETES_ADMIN: Record<string, string> = {
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "frame-ancestors 'none'",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
};

export const onRequest = defineMiddleware(async (context, next) => {
  const chemin = context.url.pathname;
  const estAdmin = chemin === PREFIXE_ADMIN || chemin.startsWith(`${PREFIXE_ADMIN}/`);
  const estApi = chemin.startsWith(PREFIXE_API_KEYSTATIC);

  if (!estAdmin && !estApi) return next();

  if (estApi) {
    let env: Record<string, unknown> = {};
    try {
      // Import dynamique : `cloudflare:workers` n'existe que dans workerd. En dev
      // (Node, sans adaptateur) et au pré-rendu, l'import échoue et on continue
      // avec un environnement vide — Keystatic bascule alors sur `import.meta.env`.
      ({ env } = await import('cloudflare:workers'));
    } catch {
      env = {};
    }

    // `context.locals` n'est pas réassignable, et l'adaptateur définit `runtime`
    // en lecture seule. En revanche l'accesseur `env` qu'il y place est
    // redéfinissable : on le remplace par une valeur ordinaire.
    const runtime = (context.locals as Record<string, unknown>).runtime;
    if (runtime && typeof runtime === 'object') {
      Object.defineProperty(runtime, 'env', {
        value: env,
        configurable: true,
        enumerable: true,
        writable: true,
      });
    }
  }

  const reponse = await next();
  for (const [nom, valeur] of Object.entries(ENTETES_ADMIN)) {
    reponse.headers.set(nom, valeur);
  }
  return reponse;
});
