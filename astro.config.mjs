// @ts-check
import { defineConfig, sessionDrivers } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

/**
 * Domaine de production. Non arbitré à ce jour (cf. ARCHITECTURE.md §8) :
 * surchargeable par la variable d'environnement `SITE_URL` du builder Cloudflare.
 */
const site = process.env.SITE_URL ?? 'https://dfda-amhe.fr';

/**
 * `astro dev` tourne SANS l'adaptateur Cloudflare, et c'est délibéré.
 *
 * Depuis @astrojs/cloudflare v13, le serveur de dev exécute les routes à la
 * demande dans workerd. Or l'admin Keystatic en mode `local` — le mode de
 * développement — écrit dans les fichiers du disque : elle a besoin de Node.
 * Dans workerd elle répond « The Keystatic API route is running in a
 * non-Node.js environment ». En production le mode est `github` (HTTP pur),
 * parfaitement compatible workerd.
 *
 * Ce que ça coûte : rien pour le site public, qui est intégralement pré-rendu
 * et ne dépend d'aucun binding Cloudflare. Ce que ça rapporte : une admin qui
 * fonctionne en local.
 */
const enDev = process.argv.includes('dev');

export default defineConfig({
  site,

  // Le site public est intégralement pré-rendu au build : zéro invocation Worker
  // pour un visiteur. L'adaptateur ne sert qu'aux deux routes injectées par
  // Keystatic (`/keystatic` et `/api/keystatic/*`), déclarées `prerender = false`.
  output: 'static',

  ...(enDev
    ? {}
    : {
        adapter: cloudflare({
          /*
           * `custom` = « laisse le service d'images déclaré plus bas faire le
           * travail », c'est-à-dire sharp, dans Node, au build.
           *
           * ⚠️ Ne pas remettre `'compile'` : cette valeur impose le service
           * `@astrojs/cloudflare/image-service-workerd`, dont la fonction
           * `transform()` **renvoie le fichier d'origine sans le toucher**. La
           * conversion réelle est faite par le pré-rendu workerd, via le binding
           * Cloudflare Images — or notre pré-rendu tourne dans Node (voir
           * ci-dessous). Résultat observé : des fichiers `.avif` et `.webp`
           * contenant des octets JPEG, à la taille de l'original, sur toutes les
           * largeurs du srcset. C'est silencieux au build et cassé en ligne.
           *
           * L'avertissement « ensure it is compatible with the Cloudflare
           * Workers runtime » qui accompagne `custom` ne nous concerne pas :
           * sharp ne tourne qu'au build, et aucune page publique n'est rendue à
           * la demande.
           */
          imageService: 'custom',

          // Le pré-rendu tourne dans Node, pas dans workerd : c'est ce qui permet
          // au Reader Keystatic (node:fs, node:path) de lire le contenu au build.
          prerenderEnvironment: 'node',
        }),
      }),

  session: {
    // Driver en mémoire : rien à provisionner, et surtout aucun binding KV
    // `SESSION` réclamé au déploiement — sans driver explicite, l'adaptateur en
    // exigerait un. Le site n'utilise pas les sessions Astro ; Keystatic gère
    // son propre cookie signé. Cf. ARCHITECTURE.md §7.
    driver: sessionDrivers.lruCache(),
  },

  image: {
    // Sharp fait toute l'optimisation au build (AVIF/WebP + srcset), que
    // l'adaptateur soit chargé ou non. C'est lui que l'adaptateur reprend grâce
    // à `imageService: 'custom'`.
    service: { entrypoint: 'astro/assets/services/sharp' },

    // Route `/_image` : elle existe dans le manifeste du Worker mais aucune
    // page n'y renvoie — toutes les images sont générées au build. On la câble
    // quand même sur le passe-plat de l'adaptateur : si une URL traînait dans un
    // cache ou un signet, elle renverrait l'image d'origine plutôt qu'une erreur
    // 500 (sharp n'existe pas dans workerd).
    endpoint: {
      route: '/_image',
      entrypoint: '@astrojs/cloudflare/image-passthrough-endpoint',
    },
  },

  integrations: [
    // React n'existe que pour l'UI d'administration Keystatic (`client:only="react"`).
    // Le site public est écrit en .astro + JS vanilla : aucun fichier .jsx/.tsx dans
    // src/, donc aucun bundle React sur les pages publiques.
    react(),
    keystatic(),
  ],

  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },

  build: {
    format: 'directory',
  },
});
