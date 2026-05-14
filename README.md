# De Feu et d'Acier

Site web de **De Feu et d'Acier**, section AMHE (Arts Martiaux Historiques Européens) de l'USAM Clermont-Ferrand.

## Stack

Site statique en **React UMD + Babel standalone**, sans étape de build. Les fichiers JSX sont servis tels quels et transpilés par Babel dans le navigateur. Déployé sur **Cloudflare Pages** avec des **Pages Functions** pour le CMS.

## Structure

```
.
├── index.html              # Point d'entrée du site public
├── src/                    # Composants React (hero, sections, footer…)
├── assets/                 # Images, vidéos, logo (statique, versionné en Git)
├── content/
│   └── seed.js             # Contenu par défaut bundled (fallback CMS)
├── admin/                  # Interface CMS pour les chefs
│   ├── index.html
│   ├── admin.jsx
│   └── schemas.js
├── functions/              # Cloudflare Pages Functions (backend CMS)
│   ├── lib/auth.js
│   ├── api/login.js, logout.js, session.js
│   ├── api/content/[section].js
│   ├── api/images/index.js, [key].js
│   └── images/[key].js     # Sert les images uploadées depuis R2
└── wrangler.toml           # Bindings KV + R2
```

## Lancer en local (site public uniquement)

```bash
python3 -m http.server 8000
```

Ouvrir <http://localhost:8000/>. L'admin (`/admin/`) chargera mais ne pourra pas se connecter — les Pages Functions ne tournent qu'en environnement Cloudflare (ou via `wrangler pages dev`).

Pour tester l'admin en local avec les Functions :

```bash
npx wrangler pages dev .
```

## CMS · déploiement Cloudflare

L'admin permet aux chefs d'éditer le contenu du site sans toucher au code. Stockage : **Cloudflare KV** pour les textes, **Cloudflare R2** pour les images uploadées.

### 1. Créer les ressources

```bash
# KV : stocke les overrides de contenu (1 clé par section)
npx wrangler kv namespace create CONTENT_KV
# → copier l'id retourné dans wrangler.toml

# R2 : stocke les images uploadées via /admin
npx wrangler r2 bucket create dfda-images
```

### 2. Coller les IDs dans `wrangler.toml`

Remplacer `REPLACE_WITH_KV_NAMESPACE_ID` par l'id obtenu à l'étape 1.

### 3. Définir les secrets

Dans le dashboard Cloudflare → Pages → ton projet → Settings → Environment variables, ajouter ces secrets (en **Production** ET **Preview**) :

| Variable          | Valeur                                                        |
|-------------------|---------------------------------------------------------------|
| `ADMIN_PASSWORD`  | Mot de passe partagé pour `/admin` (à communiquer aux chefs) |
| `SESSION_SECRET`  | Chaîne aléatoire ≥ 32 caractères, ex. `openssl rand -hex 32` |

**Ne jamais committer ces valeurs dans le repo.**

### 4. Déployer

Push sur `main` ou la branche connectée à Cloudflare Pages, ou :

```bash
npx wrangler pages deploy .
```

### 5. Utiliser l'admin

Aller sur `https://<ton-domaine>/admin/`, se connecter avec `ADMIN_PASSWORD`, choisir une section dans la barre latérale, éditer, **Enregistrer**.

- Les modifs apparaissent sur le site quasi-instantanément (cache HTTP de 30 s sur `/api/content`).
- "Revenir au défaut" supprime l'override en KV → le site retombe sur le seed bundled (`content/seed.js`).
- L'upload d'images crée des fichiers dans R2 servis publiquement via `/images/<nom>`.

## Comment ça marche

1. À chaque chargement de page, chaque section appelle `useContent('hero')` (etc.).
2. Le hook retourne **immédiatement** la valeur du seed bundled (`window.CONTENT_SEED.hero`) pour rendre la page sans flash.
3. En arrière-plan, le hook fetch `/api/content/hero` :
   - Si KV a un override → le hook met à jour le state → React re-render avec le nouveau contenu.
   - Sinon (204) → on garde le seed.
4. Côté admin, "Enregistrer" PUT le JSON dans KV. Au prochain `useContent`, le site servira la valeur KV.

## Liens

- [Page USAM Clermont-Ferrand](https://www.usam-clermont.fr/)
- [HelloAsso · De Feu et d'Acier](https://www.helloasso.com/associations/usam-amhe-clermont-ferrand)
- [Facebook · 63AMHE](https://www.facebook.com/63AMHE/)
- [HEMA Ratings · club](https://hemaratings.com/clubs/details/1155/)
