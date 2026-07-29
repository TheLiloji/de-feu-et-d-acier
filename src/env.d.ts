/// <reference types="astro/client" />

/**
 * Variables et bindings du Worker Cloudflare, lus au runtime.
 *
 * Déclaration minimale volontaire : `npx wrangler types` génère un
 * `worker-configuration.d.ts` de 550 ko de types globaux workerd qui entrent en
 * conflit avec les types DOM dont le site public a besoin. On ne déclare donc
 * que ce qu'on utilise réellement — aujourd'hui les trois secrets Keystatic,
 * lus par `src/middleware.ts`.
 *
 * `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` n'y figure pas, et c'est volontaire :
 * Keystatic la lit via `import.meta.env` dans son bundle client, donc au build.
 * Rien ne la lit dans `cloudflare:workers`.
 */
declare module 'cloudflare:workers' {
  export const env: {
    KEYSTATIC_SECRET?: string;
    KEYSTATIC_GITHUB_CLIENT_ID?: string;
    KEYSTATIC_GITHUB_CLIENT_SECRET?: string;
    [cle: string]: unknown;
  };
}
