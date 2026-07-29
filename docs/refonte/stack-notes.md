# Notes de stack — audit de l'existant avant réécriture

Audit réalisé le 28/07/2026 sur la branche `refonte`, commit `e66214e`.
Objet : comprendre ce que l'ancien setup Astro + Keystatic + Cloudflare a mis en
place, pourquoi, et ce qu'on garde ou jette pour la refonte (nouveau compte
Cloudflare, nouveau projet Pages `dfda-amhe`).

Sources auditées : `astro.config.mjs`, `keystatic.config.ts`, `wrangler.toml`,
`DEPLOY.md`, `README.md`, `package.json`, `tsconfig.json`, `.gitignore`,
`src/` (24 composants `.astro`, `lib/content.ts`, 13 JSON de contenu, 1900 lignes
de CSS), `functions/`, `admin/`, historique git, et un `npm run build` réel.

---

## 0. État des lieux en une page

Le dépôt contient **deux générations de site superposées** :

| Génération | Fichiers | Statut |
|---|---|---|
| **V1** — React UMD + Babel navigateur, CMS maison sur Pages Functions (KV + R2) | `index.html`, `src/*.jsx`, `admin/`, `functions/`, `content/seed.js`, `tweaks-panel.jsx` | Mort, jamais nettoyé (la « Phase 5 » de `DEPLOY.md` n'a pas été faite) |
| **V2** — Astro 5 + Keystatic (mode GitHub) + adaptateur Cloudflare | `astro.config.mjs`, `keystatic.config.ts`, `src/components/*.astro`, `src/content/*.json`, `src/lib/content.ts`, `wrangler.toml`, `DEPLOY.md` | Fonctionnel en local (build vérifié), **jamais déployé** (aucun trace de mise en prod, `DEPLOY.md` s'arrête à l'étape « à faire ») |

Le `README.md` décrit encore **la V1** : il est faux depuis le commit `559129a`.

Le build V2 passe (`npm run build` → `dist/` en 7 s, 21 Mo). Donc l'architecture
V2 est **validée techniquement** : c'est bien elle qui sert de base de leçons.

---

## 1. Ce que l'ancien setup a mis en place, et pourquoi

### 1.1 Le montage général : statique + une poche de SSR

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://dfda-pages.pages.dev',
  output: 'static',
  adapter: cloudflare({ platformProxy: { enabled: true } }),
  integrations: [react(), keystatic()],
});
```

**Pourquoi cette forme précise :**

- `output: 'static'` → tout le site public est **pré-rendu au build**. Zéro
  invocation Worker pour un visiteur, coût nul, cache CDN parfait.
- **Mais un adaptateur quand même** : `@keystatic/astro` injecte deux routes en
  `prerender = false` — `/keystatic` (l'UI React d'admin) et `/api/keystatic/*`
  (l'OAuth GitHub + les appels d'écriture). Sans adaptateur, ces routes ne
  peuvent pas exister. Le build affiche donc `output: "static"` **et**
  `mode: "server"` : c'est l'hybride Astro 5, et c'est voulu.
- `platformProxy: { enabled: true }` → en `astro dev`, l'adaptateur démarre un
  Miniflare local pour simuler les bindings Cloudflare (KV…). Sans ça, le dev
  local diverge du runtime workerd.
- `integrations: [react()]` → **React n'est là que pour Keystatic**, pas pour le
  site public (qui est en `.astro` + JS vanilla). C'est une bonne décision à
  reconduire : le bundle React (142 ko) n'est chargé que sur `/keystatic`.

Le `dist/` produit contient `_worker.js/` (le Worker SSR), les pages
pré-rendues, et un `_routes.json` généré par l'adaptateur :

```json
{ "version": 1, "include": ["/*"], "exclude": ["/", "/_astro/*", "/assets/*"] }
```

C'est ce fichier qui dit à Pages « ces URL-là sont du statique pur, ne réveille
pas le Worker ». Voir le piège 2.7 à ce sujet.

### 1.2 Keystatic : storage local en dev, GitHub en prod

```ts
const storage = import.meta.env.PROD
  ? ({ kind: 'github', repo: 'TheLiloji/de-feu-et-d-acier' } as const)
  : ({ kind: 'local' } as const);
```

- **En dev** (`kind: 'local'`) : l'admin écrit directement dans les fichiers du
  disque. Pas d'auth, pas de réseau. Idéal pour construire le schéma.
- **En prod** (`kind: 'github'`) : l'admin s'authentifie via une **GitHub App**
  dédiée, et chaque « Enregistrer » produit un **commit** sur le repo → qui
  déclenche un build Pages → le site se met à jour en 1-3 min.

Conséquence organisationnelle importante, à assumer : **le contenu vit dans
git**. Pas de base de données, pas de sauvegarde à gérer, historique et
rollback gratuits. En contrepartie : chaque modif du client = 1 commit + 1
rebuild complet, et **le client doit avoir un compte GitHub avec accès en
écriture au repo** (Keystatic n'autorise que les collaborateurs du dépôt).

### 1.3 Les 4 variables d'environnement Keystatic

| Variable | Type | Rôle | Origine |
|---|---|---|---|
| `KEYSTATIC_GITHUB_CLIENT_ID` | Secret | OAuth de la GitHub App | GitHub App |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Secret | idem | GitHub App |
| `KEYSTATIC_SECRET` | Secret | Signe le cookie de session de l'admin | `openssl rand -hex 32` |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | Variable publique | Slug de l'App, utilisé côté client pour construire l'URL d'install | GitHub App |

Le préfixe `PUBLIC_` n'est pas décoratif : Astro **inline cette valeur au
build**. Elle doit donc être présente dans l'environnement de **build** Pages,
pas seulement au runtime.

URL de callback de la GitHub App :
`https://<domaine>/api/keystatic/github/oauth/callback`
→ elle est liée au domaine. C'est pour ça que `DEPLOY.md` recommandait de créer
la GitHub App **depuis le domaine de production**, après le passage en prod.

### 1.4 Le binding KV `SESSION` et le flag `nodejs_compat`

```toml
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "./dist"

[[kv_namespaces]]
binding = "SESSION"
id = "560c6fac499749cb87c05597b379cb5d"   # ⚠️ ANCIEN COMPTE — à recréer
```

- **`nodejs_compat`** : indispensable. Le build le prouve —

  ```
  [vite] Automatically externalized node built-in module "node:path"
         imported from @keystatic/core/dist/keystatic-core-reader.worker.js
  [vite] Automatically externalized node built-in module "node:fs/promises"
  ```

  Le Reader Keystatic embarque du `node:fs` / `node:path`. Sans le flag, le
  Worker plante au premier appel de `/api/keystatic`.

- **Binding KV `SESSION`** : l'adaptateur Cloudflare active la fonctionnalité
  « sessions » d'Astro et cherche un binding KV nommé `SESSION`. Message exact
  au build :

  ```
  [@astrojs/cloudflare] Enabling sessions with Cloudflare KV with the "SESSION" KV binding.
  [@astrojs/cloudflare] If you see the error "Invalid binding `SESSION`" [...] add the binding
  ```

  Le site ne s'en sert pas ; le binding est fourni pour éviter l'erreur runtime.
  L'ancien setup a **recyclé le namespace KV du CMS V1** (`CONTENT_KV` renommé
  en `SESSION`) pour ne pas créer de ressource. **Cet id appartient à l'ancien
  compte Cloudflare : il faut en recréer un.**

---

## 2. Checklist de déploiement réutilisable — projet Pages `dfda-amhe`

À exécuter dans cet ordre. Tout ce qui est marqué ⚠️ est un point où l'ancien
setup s'était fait piéger.

### Étape A — Vérifier qu'on est sur le bon compte Cloudflare

```bash
npx wrangler whoami
```

⚠️ Le `wrangler.toml` actuel contient un id KV du **compte précédent**. Ne rien
recopier : tous les ids de ressources sont à régénérer.

### Étape B — Créer les ressources Cloudflare

```bash
# Namespace KV pour les sessions Astro (nécessaire même si non utilisé)
npx wrangler kv namespace create SESSION
# → note l'id retourné

# Optionnel : un namespace distinct pour les previews
npx wrangler kv namespace create SESSION --preview
```

Pas de bucket R2 à créer : le CMS V2 stocke les médias **dans le repo git**,
plus dans R2. (Le bucket `dfda-images` de la V1 est à oublier.)

### Étape C — `wrangler.toml` du nouveau projet

```toml
name = "dfda-amhe"
compatibility_date = "2026-07-01"      # date récente, jamais "latest"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "./dist"

[[kv_namespaces]]
binding = "SESSION"
id = "<ID_RETOURNÉ_PAR_L_ÉTAPE_B>"

[[env.preview.kv_namespaces]]
binding = "SESSION"
id = "<ID_PREVIEW_OU_LE_MÊME>"
```

⚠️ **Dès que `pages_build_output_dir` est présent, le `wrangler.toml` devient la
source de vérité** et le dashboard passe en lecture seule pour ces champs
(bindings, flags, vars). Doc Cloudflare : *« You will be able to see, but not
edit, the same fields when you log into the Cloudflare dashboard. »*
Corollaire : ne pas configurer les bindings dans le dashboard en pensant qu'ils
s'appliqueront.

⚠️ `compatibility_date` doit être une date explicite : wrangler ne supporte pas
le « Latest » du dashboard.

### Étape D — Créer le projet Pages et le brancher au repo

Dashboard → Workers & Pages → Create → Pages → Connect to Git → repo
`TheLiloji/de-feu-et-d-acier` (ou le nouveau repo), branche de prod `main`.

Build configuration :

| Champ | Valeur |
|---|---|
| Framework preset | Astro (ou None) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(vide)* |

### Étape E — Secrets et variables (dashboard, Production **et** Preview)

Les secrets ne peuvent pas vivre dans le `wrangler.toml` (ils seraient
versionnés) — ils restent dans **Settings → Variables and Secrets**.

| Nom | Type | Valeur |
|---|---|---|
| `KEYSTATIC_SECRET` | Secret | `openssl rand -hex 32`, généré par le client |
| `KEYSTATIC_GITHUB_CLIENT_ID` | Secret | fourni à l'étape F |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Secret | fourni à l'étape F |

⚠️ Les trois doivent exister sur **Production ET Preview**, sinon `/keystatic`
affiche l'écran « configure your GitHub App » sur les previews.

⚠️ `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` **ne va pas dans ce tableau**. Ce tableau
date d'une cible Cloudflare Pages, où les variables du dashboard alimentaient
aussi le build ; la cible est désormais Workers + `wrangler.jsonc`, où elles ne
sont lues qu'au runtime. Or Keystatic lit ce slug via `import.meta.env` dans son
bundle **client** : la valeur est figée par Vite au moment du `astro build`. La
créer côté Cloudflare serait sans effet. Elle doit être présente dans
l'environnement qui exécute `npm run build` — voir `.env.example` à la racine du
dépôt (ce n'est pas un secret : le slug finit dans le bundle public).

### Étape F — GitHub App Keystatic

Deux voies :

1. **Automatique (recommandé)** : depuis `https://dfda-amhe.pages.dev/keystatic`
   déjà déployé, Keystatic propose « Create GitHub App » (flux *app manifest*
   GitHub). Il crée l'App avec la permission *Repository contents: Read & write*,
   l'installe sur le repo, et renvoie les 3 identifiants.
   ⚠️ À faire **depuis le domaine définitif** : l'URL de callback est figée dans
   l'App. Si on refait le flux depuis un domaine custom plus tard, il faut
   **ajouter** la nouvelle callback URL dans les réglages de l'App (Keystatic
   accepte plusieurs callbacks).
2. **Manuelle** : GitHub → Settings → Developer settings → GitHub Apps → New.
   Callback : `https://dfda-amhe.pages.dev/api/keystatic/github/oauth/callback`.
   Permission *Contents: Read and write*. Installer sur le repo.

### Étape G — Accès des rédacteurs

Inviter chaque personne devant éditer le site comme **collaborateur du dépôt
GitHub avec droit d'écriture**. Keystatic n'a pas d'autre système de rôles :
pas d'accès écriture au repo = pas d'accès à `/keystatic`.

### Étape H — Vérifications post-déploiement

- [ ] `https://dfda-amhe.pages.dev/` s'affiche (site public, statique)
- [ ] `/keystatic` charge et propose le login GitHub
- [ ] Une modification sauvegardée crée bien un commit sur le repo
- [ ] Le build déclenché par ce commit passe, et la modif apparaît en ligne
- [ ] Aucune erreur `Invalid binding SESSION` dans les logs Functions
- [ ] Un upload d'image depuis l'admin arrive au bon endroit du repo

---

## 3. Pièges rencontrés et contournements (traces dans le code et l'historique)

### 3.1 `[assets]` dans `wrangler.toml` → rejeté par Pages
Commit `6f6e207` : *« Cloudflare Pages rejects the [assets] section in
wrangler.toml (it is a Workers-only feature). »* Avec `pages_build_output_dir`,
Pages sert déjà tout le dossier en statique. **À ne pas réintroduire.**

### 3.2 `wrangler pages dev` en boucle de rebundle
Commentaire supprimé en Phase 4, mais la leçon reste :

> ATTENTION — `wrangler pages dev` rebundle en boucle si on laisse le state
> Miniflare dans `.wrangler/state/` : le watcher détecte les écritures
> permanentes des `.sqlite-shm`.

Contournement : `--persist-to /tmp/wrangler-dfda-state`, hors du repo.
En pratique avec Astro on utilise `astro dev` (avec `platformProxy`), donc le
problème ne devrait plus se poser — mais il ressortira si on fait un
`wrangler pages dev dist`.

### 3.3 Id de binding en placeholder → build cassé
Commit `004ef9e` : `REPLACE_WITH_KV_NAMESPACE_ID` faisait échouer la validation
des bindings au déploiement. Ne jamais committer un `wrangler.toml` avec un
placeholder d'id.

### 3.4 Les images ne passent jamais par le pipeline Astro
Le schéma Keystatic place les images dans `public/assets/` :

```ts
const img = (label: string) =>
  fields.image({ label, directory: 'public/assets', publicPath: '/assets/' });
```

Et le Reader ne renvoie que le nom de fichier, d'où ce helper dans
`src/lib/content.ts` :

```ts
export const asset = (name?: string | null): string =>
  !name ? '' : /^(https?:|\/)/.test(name) ? name : `/assets/${name}`;
```

Résultat : `<img src="/assets/photo.jpg">` brut, **aucune optimisation** — pas
de redimensionnement, pas d'AVIF/WebP, pas de `srcset`. Sur un site de club
photo-lourd (17 Mo dans `public/assets`, dont un `Hero.mp4` de 13 Mo) c'est une
vraie dette de performance. Le build le signale d'ailleurs :

```
[WARN] [adapter] Cloudflare does not support sharp at runtime. However, you can
configure `imageService: "compile"` to optimize images with sharp on prerendered
pages during build time.
```

**Recommandation pour la réécriture** : viser `directory: 'src/assets/…'` +
`imageService: 'compile'` + `<Image>` d'`astro:assets`, en mappant les chemins
Keystatic vers des `ImageMetadata` via `import.meta.glob`. C'est une dizaine de
lignes de colle, et ça change tout sur le poids des pages.

### 3.5 Le contenu est du HTML dans des champs texte
Beaucoup de champs sont des `fields.text({ multiline: true })` nommés
`bodyHtml`, `ledeHtml`, `headlineHtml`, `paragraphsHtml`, avec des
`itemLabel: (p) => p.value.replace(/<[^>]+>/g, '')` pour rendre la liste lisible
dans l'admin. Autrement dit : **on demande au client d'écrire du HTML à la
main**, et le rendu fait forcément du `set:html` derrière.

C'est le plus gros défaut ergonomique du schéma V1. Pour la réécriture,
préférer `fields.mdx` / `fields.markdoc` (éditeur riche Keystatic) partout où le
texte est du texte, et ne garder du HTML brut que pour des cas vraiment
irréductibles.

### 3.6 Sur-modélisation du hero
Le titre « De **Feu** et d'**Acier** » est découpé en 4 champs éditables
(`titleStart`, `titleFeu`, `titleConnector`, `titleAcier`) — dupliqués dans le
footer. Le client n'éditera jamais ça : c'est le nom de l'asso. Chaque champ
inutile dans l'admin est du bruit qui rend le CMS plus intimidant.
Leçon : **modéliser ce qui change, coder en dur ce qui ne change pas.**

### 3.7 `_routes.json` : la limite de 100 règles
L'adaptateur génère automatiquement l'`exclude` à partir des routes
pré-rendues. Cloudflare Pages plafonne ce fichier à **100 règles au total**.
Avec un site mono-page ça ne se voit pas ; avec plusieurs écoles × plusieurs
articles pré-rendus, on peut y arriver. À surveiller — l'adaptateur v12 expose
`routes: { extend: { exclude: [...] } }` pour forcer des motifs génériques.

### 3.8 Bundle admin de 2,8 Mo
```
dist/_astro/keystatic-page.Dxxzoo9C.js  2 777,93 kB │ gzip: 866,45 kB
```
C'est l'UI Keystatic. Elle n'est chargée que sur `/keystatic`, donc sans impact
sur les visiteurs — mais l'admin sera lourde sur une connexion mobile moyenne.
Rien à corriger, juste à savoir (et à ne pas confondre avec un problème de
perf du site public si on lit les rapports de build).

### 3.9 Le nettoyage V1 n'a jamais été fait
`DEPLOY.md` prévoyait une « Phase 5 — Nettoyage ». Elle n'a pas eu lieu :
`functions/`, `admin/`, `index.html`, `src/*.jsx` sont toujours là, et le
`README.md` documente encore le CMS mort. C'est exactement ce qui rend cet
audit nécessaire. **Cette fois, le nettoyage se fait au démarrage, pas à la
fin.**

### 3.10 ⚠️ 247 Mo de photos brutes committées
`nouvelles_photos/` fait **247 Mo** (fichiers unitaires jusqu'à 32 Mo) et est
**versionné** (commit `e66214e`) : le `.git` pèse 270 Mo. Conséquences directes :
chaque build Cloudflare Pages commence par cloner ça, chaque `git clone` du
client aussi, et le poids ne partira jamais de l'historique sans réécriture.

**À traiter avant la première mise en ligne** : sortir les originaux du repo
(dossier local ou stockage à part), n'y committer que des dérivés optimisés
(≤ 500 ko), et ajouter `nouvelles_photos/` au `.gitignore`. Si on repart d'un
repo neuf pour la refonte, le problème se règle tout seul.

### 3.11 Divers
- `src/styles/site.css` : 1618 lignes de CSS extraites telles quelles des
  `<style>` JSX de la V1 (« 58 Ko, aucune interpolation »). Report mécanique,
  jamais rationalisé. La maquette étant la nouvelle référence, on repart de zéro.
- Les composants `.astro` portent leurs styles en `style="..."` inline
  (`Photo.astro`, `Actualites.astro`…), mélangés au CSS global : deux systèmes
  de style concurrents dans le même fichier.
- Le `.gitignore` ignore `research/` et `uploads/` mais ils sont présents sur
  le disque (6 Mo + 124 Ko) — matériel de travail V1, sans valeur aujourd'hui.

---

## 4. Versions recommandées et compatibilité

**Ce point est le plus important de l'audit, parce qu'il touche une hypothèse
du cahier des charges.**

### 4.1 Le fait nouveau : l'adaptateur Cloudflare a abandonné Pages

`@astrojs/cloudflare` **v13.0.0** a supprimé le support de Cloudflare Pages.
Doc officielle Astro : *« The Astro Cloudflare adapter no longer supports
deployment on Cloudflare Pages. »* La v13+ ne cible que **Cloudflare Workers**
(avec static assets).

Or les versions se chaînent ainsi :

| Astro | Adaptateur Cloudflare | Cible supportée | Node minimum |
|---|---|---|---|
| 5.x (5.18.2) | `@astrojs/cloudflare` 12.x (12.6.13) | **Pages** ✅ et Workers | 18.20.8 / 20.3 / 22+ |
| 6.x | 13.x | Workers uniquement | 20.19.1 / 22.12+ |
| 7.x (7.1.4) | 14.x (14.1.5) | Workers uniquement | 22.12+ |

**Conclusion : « Astro dernière version » et « Cloudflare Pages » sont
désormais incompatibles.** Il faut choisir.

Contexte : Cloudflare pousse Workers + static assets pour les nouveaux projets
depuis fin 2024 (le service d'assets statiques y est gratuit et Pages Functions
est facturé au tarif Workers). Pages reste **pleinement supporté** — rien
n'oblige à migrer — mais il est dé-mis en avant dans l'interface.

### 4.2 Scénario A — rester sur Pages (conservateur, conforme au brief)

```jsonc
{
  "dependencies": {
    "astro": "^5.18.2",
    "@astrojs/cloudflare": "^12.6.13",
    "@astrojs/react": "^4.4.2",
    "@keystatic/core": "^0.6.3",
    "@keystatic/astro": "^5.2.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0"
  }
}
```

- Le projet Pages `dfda-amhe` se crée exactement comme décrit en §2.
- On peut passer **React 18 → 19** dès maintenant : `@astrojs/react` 4.4.2 et
  `@keystatic/core` 0.6.3 acceptent tous deux React 19. Ça évite une migration
  supplémentaire plus tard.
- `@keystatic/core` 0.6.x n'est **pas** une rupture d'API de configuration : le
  seul changement de la 0.6.0 est l'épinglage strict de `@keystar/ui`,
  `react-aria` et `react-stately`. Les schémas 0.5 se portent tels quels.
- `@keystatic/astro` 5.2.0 déclare `astro: '2 || 3 || 4 || 5 || 6 || 7'` — il
  n'est jamais le facteur limitant.
- Astro 5 reste maintenu (5.18.2 est récent). Ce n'est pas une impasse à court
  terme, mais c'est **une version majeure de retard qui va s'aggraver**.

### 4.3 Scénario B — Astro 7 + Cloudflare Workers (pérenne)

```jsonc
{
  "dependencies": {
    "astro": "^7.1.4",
    "@astrojs/cloudflare": "^14.1.5",
    "@astrojs/react": "^6.0.1",
    "@keystatic/core": "^0.6.3",
    "@keystatic/astro": "^5.2.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": { "wrangler": "^4.114.0" }
}
```

Ce qui change concrètement par rapport à l'ancien setup :

- **`wrangler` devient une peer dependency** : à installer explicitement en
  `devDependencies` (l'adaptateur v13+ ne l'embarque plus).
- **`wrangler.toml` pointe vers un entrypoint fourni par l'adaptateur** :
  ```jsonc
  {
    "name": "dfda-amhe",
    "main": "@astrojs/cloudflare/entrypoints/server",
    "compatibility_date": "2026-07-01",
    "compatibility_flags": ["nodejs_compat"]
  }
  ```
  Plus de `pages_build_output_dir`.
- **`platformProxy` disparaît** : le serveur de dev tourne nativement dans
  workerd (parité prod). Bon pour la fiabilité, mais le dev local devient plus
  sensible aux dépendances non compatibles Workers — d'où la nouvelle option
  `prerenderEnvironment: 'node'` en soupape.
- **`Astro.locals.runtime` est supprimé** : on lit l'env via
  `import { env } from 'cloudflare:workers'` et le contexte via
  `Astro.request.cf` / `Astro.locals.cfContext`.
- **`imageService` passe par défaut à `'cloudflare-binding'`** (au lieu de
  `'compile'`).
- **Node ≥ 22.12** requis en local **et sur le builder Cloudflare** (variable
  `NODE_VERSION` à poser dans les réglages de build). Le poste actuel est en
  Node 24.13 : OK.
- Ruptures Astro 6 à absorber au passage : collections de contenu *legacy*
  supprimées (Content Layer obligatoire, `src/content.config.ts`), Zod 4,
  changements sur le service d'images. Ruptures Astro 7 : compilateur Rust
  seul (HTML mal fermé = erreur au lieu d'être corrigé silencieusement),
  Vite 8, `src/fetch.ts` réservé, processeur Markdown par défaut changé.

Ces ruptures sont **quasi indolores sur un projet neuf** — elles coûtent cher
sur un projet migré, pas sur un projet écrit directement en Astro 7. C'est
l'argument principal du scénario B : on paie le prix maintenant, à zéro.

### 4.4 Recommandation

**Scénario B (Astro 7 + Workers static assets)**, sauf contrainte externe.
Raisons :

1. On repart de zéro : le coût des ruptures Astro 6/7 est nul aujourd'hui, et
   élevé dans 18 mois.
2. C'est la trajectoire que Cloudflare et Astro soutiennent tous les deux ; le
   scénario A démarre déjà avec une majeure de retard et un adaptateur en fin
   de ligne pour Pages.
3. La contrainte « plusieurs écoles » implique que ce code vivra longtemps et
   sera repris : autant qu'il soit sur la voie principale.
4. Le déploiement Workers est le même geste qu'un déploiement Pages (connexion
   au repo GitHub, build, preview par branche). Le compte est déjà connecté via
   wrangler.

**Si le scénario A est retenu** (par exemple parce que le nom `dfda-amhe` doit
absolument être un projet Pages, ou parce qu'on veut le chemin le plus court) :
tout fonctionne, la checklist §2 s'applique à la lettre, et il faudra juste
prévoir la bascule Pages → Workers comme dette identifiée.

Dans les deux cas : **épingler les versions** dans `package.json` et committer
le `package-lock.json`, pour que le build Cloudflare reproduise exactement le
build local.

### 4.5 Points d'attention communs aux deux scénarios

- `nodejs_compat` reste requis (Keystatic Reader → `node:fs`, `node:path`).
- Le binding KV `SESSION` reste attendu par l'adaptateur (option
  `sessionKVBindingName` pour le renommer).
- Vérifier la version de Node du builder Cloudflare : elle ne suit pas
  automatiquement celle du poste de dev.
- Keystatic n'a **pas** de plugin d'aperçu/preview intégré côté Cloudflare : le
  seul « aperçu » est la preview de branche générée après commit.

---

## 5. Ce qu'on supprime, ce qu'on garde

### 5.1 À supprimer dès le premier commit de la réécriture

| Chemin | Poids | Pourquoi |
|---|---|---|
| `index.html` (racine) | 16 ko | Point d'entrée de la V1 React-UMD |
| `src/app.jsx`, `hero.jsx`, `sections.jsx`, `primitives.jsx`, `contact.jsx`, `content-loader.jsx` | ~4 300 lignes | Composants V1 transpilés par Babel dans le navigateur |
| `tweaks-panel.jsx` | 26 ko | Panneau de réglage de design V1, jamais branché en prod |
| `content/seed.js` | 322 lignes | Contenu par défaut V1, remplacé par le CMS |
| `admin/` (`index.html`, `admin.jsx`, `schemas.js`) | ~1 100 lignes | CMS maison V1, remplacé par Keystatic |
| `functions/` (auth, login/logout/session, content/[section], images) | ~370 lignes | Pages Functions V1 (KV + R2), sans objet |
| `uploads/` | 6 Mo | Fichiers récupérés de l'ancien site (déjà `.gitignore`) |
| `research/` | 124 ko | Composants extraits par rétro-ingénierie du site d'origine (déjà `.gitignore`) |
| `src/components/*.astro` (24 fichiers) | ~1 700 lignes | Portage V1 → Astro ; la maquette est la nouvelle référence |
| `src/styles/site.css` | 1 618 lignes | CSS V1 recopié mécaniquement |
| `src/styles/global.css` | 282 lignes | Tokens de design V1 — à relire une fois puis jeter |
| `src/pages/index.astro`, `src/layouts/Base.astro`, `src/lib/content.ts` | — | À réécrire (voir §5.3 pour ce qu'on en récupère) |
| `src/content/*.json` (13) | — | Contenu à re-migrer sur le nouveau schéma (le texte vit dans `CONTENU-SITE.md`) |
| `README.md` | 4 ko | Décrit la V1 ; à réécrire entièrement |
| `DEPLOY.md` | 4 ko | Remplacé par ce document + le futur guide de déploiement |
| `wrangler.toml` | — | À réécrire (id KV de l'ancien compte) |
| `.astro/`, `dist/`, `.wrangler/` | — | Artéfacts de build, déjà `.gitignore` |

Note sur `public/assets/` : à **trier**, pas à supprimer en bloc — voir §5.2.

### 5.2 À garder

| Chemin | Pourquoi |
|---|---|
| `Maquette.pen` (824 ko) | Référence visuelle unique de la refonte |
| `maquette-assets/` (5,7 Mo, 13 images) | Images de la maquette (hero, disciplines, galerie, club, tournois) |
| `CONTENU-SITE.md` (20 ko) | Texte réel validé par le client, section par section, avec la mention de ce qui a été édité en ligne et une section « Notes & incohérences » |
| `docs/refonte/` | Livrables de la refonte (ce document et les suivants) |
| `nouvelles_photos/` (247 Mo, 19 photos) | Photos fournies par le client — **à garder localement, à sortir de git**, à optimiser avant intégration |
| `public/assets/` — les logos | `logo.png`, `logo_FFAMHE.png`, `logo_NB_FFAMHE.png`, `logo_signature*.png`, `Fait-d'arme-logo.png`, `black-armoury-logo.jpg` : logos partenaires difficiles à re-sourcer |
| `public/assets/Hero.mp4` (13 Mo) | Vidéo du hero — à garder **si** la maquette la reconduit, et à ré-encoder (13 Mo est trop lourd) |
| `public/assets/Marie.png`, `Gabriel.jpg`, `Ludwig.jpeg` | Portraits des encadrants, sauf si remplacés par `nouvelles_photos/` |
| L'historique git | Les décisions et les pièges de la V1/V2 y sont documentés en clair |

### 5.3 À ne pas garder comme fichier, mais à relire avant de jeter

Trois choses de la V2 méritent une lecture attentive avant suppression, parce
qu'elles contiennent du travail réel et vérifié :

1. **`src/layouts/Base.astro`** — le bloc JSON-LD `SportsOrganization` est
   complet et juste : adresse du Gymnase Robert Pras, e-mail et téléphone de
   contact, affiliations FFAMHE et USAM, `sameAs` (Facebook, HEMA Ratings,
   HelloAsso), meta OG et Twitter. **À reprendre presque tel quel**, en le
   sortant du layout vers un composant `<Seo>` paramétrable (indispensable si
   plusieurs écoles → une organisation par ville).
2. **`keystatic.config.ts`** — les helpers `img()`, `focal()`, `header()`,
   `linkObject()` sont une bonne base de vocabulaire de schéma, et la
   `navigation` groupée (Accueil / Sections / Pied de page & légal) est le bon
   réflexe pour que l'admin reste lisible. Le schéma lui-même est à refaire
   (voir §3.5 et §3.6, et la contrainte multi-écoles).
3. **`src/lib/content.ts`** — le pattern « un `createReader` + un `getContent()`
   qui charge tout en parallèle » est sain. Il sera à revoir pour le
   multi-écoles (lecture par club, pas globale).

### 5.4 `.gitignore` à prévoir

```gitignore
node_modules/
dist/
.astro/
.wrangler/
.dev.vars          # secrets Keystatic en local — ne jamais committer
nouvelles_photos/  # originaux lourds : hors du dépôt
.DS_Store
*.log
```

---

## 6. Impacts « plusieurs écoles » au niveau stack

La contrainte multi-écoles (Lyon ou ailleurs) n'est pas qu'un sujet de
modélisation de contenu ; elle touche deux points de stack qu'il vaut mieux
connaître **avant** d'écrire le schéma Keystatic :

- **Le dossier des médias d'un champ image est une chaîne fixe.**
  `fields.image({ directory: '…' })` n'accepte pas de valeur dynamique : on ne
  peut pas router automatiquement les uploads de Lyon vers
  `src/assets/lyon/`. Solutions : un dossier de médias commun avec convention de
  nommage, ou une définition de collection dupliquée par école.
- **`_routes.json` et la limite de 100 règles** (§3.7) : plus il y a d'écoles ×
  d'articles pré-rendus, plus l'`exclude` grossit. À vérifier au premier build
  multi-écoles.
- Le reste (routes `/[ecole]/…`, collections indexées par école, contenu
  partagé vs. contenu local) relève de l'architecture de contenu, traitée
  ailleurs.

---

## 7. Sources

- [Adaptateur Cloudflare pour Astro](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Astro — guide de migration v7](https://docs.astro.build/en/guides/upgrade-to/v7/)
- [Astro — guide de migration v6](https://docs.astro.build/en/guides/upgrade-to/v6/)
- [Changelog `@astrojs/cloudflare`](https://github.com/withastro/astro/blob/main/packages/integrations/cloudflare/CHANGELOG.md)
- [Keystatic — mode GitHub](https://keystatic.com/docs/github-mode)
- [Cloudflare Pages — configuration Wrangler](https://developers.cloudflare.com/pages/functions/wrangler-configuration/)
- [Cloudflare — migrer de Pages vers Workers](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)
