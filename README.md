# De Feu et d'Acier

Site de **De Feu et d'Acier**, section AMHE (arts martiaux historiques européens)
de l'USAM Clermont-Ferrand.

Site statique pré-rendu au build, administré par un CMS dont le contenu vit dans
ce dépôt. Aucune base de données, aucun appel serveur pour un visiteur.

## Stack

| Brique | Choix |
| --- | --- |
| Framework | **Astro 7**, `output: 'static'` — les 12 pages sont générées au build |
| Hébergement | **Cloudflare Workers** (projet `dfda-amhe`, compte de l'association) |
| CMS | **Keystatic** — mode `local` en développement, `github` en production |
| Contenu | YAML + Markdoc dans `src/content/`, versionné avec le code |
| Images | `astro:assets` + **sharp** au build : AVIF / WebP / JPEG, `srcset` complet |
| Polices | Cormorant Garamond (titres) et Inter (texte), auto-hébergées via Fontsource |
| Interactivité | JS vanilla dans des `<script>` Astro — carrousels, accordéons, menu, apparitions |
| React | **uniquement** l'interface d'administration Keystatic ; zéro octet de React sur les pages publiques |

Décisions d'architecture et documents d'analyse : **`docs/refonte/`** —
[`ARCHITECTURE.md`](docs/refonte/ARCHITECTURE.md) fait foi, les autres documents
détaillent le design (`design-spec.md`), le modèle de contenu (`content-model.md`),
l'ouverture d'une deuxième salle (`multi-ecoles.md`), les photos (`photos.md`) et
les pièges Cloudflare / Keystatic (`stack-notes.md`).

## Commandes

```bash
npm install

npm run dev       # serveur de développement + admin sur http://localhost:4321/keystatic
npm run build     # génère dist/ (site + Worker) — échoue si le contenu est invalide
npm run preview   # sert le résultat du build dans workerd, comme en production
npm run check     # astro check : types des pages et des composants
npm run deploy    # wrangler deploy (déploiement manuel, compte de l'association)
```

`astro dev` tourne **sans** l'adaptateur Cloudflare, délibérément : l'admin
Keystatic en mode `local` écrit dans les fichiers du disque et a besoin de Node.
Le site public, lui, ne dépend d'aucun binding Cloudflare.

## Structure du contenu

Le dossier **est** l'école : il n'y a aucun champ « école » à remplir dans
l'admin, et l'ouverture d'une deuxième salle consiste à ajouter une ligne dans
`src/config/ecoles.ts` puis un dossier sous `src/content/ecoles/`.

```
src/content/
├── commun/                        # contenu de l'association, valable partout
│   ├── identite.yaml              # logotype, description, image de partage
│   ├── hero.yaml                  # en-tête de l'accueil
│   ├── entetes.yaml               # sur-titres, titres et chapôs des sections
│   ├── club.yaml  rigueur.yaml  rejoindre.yaml  tournois.yaml
│   ├── fiches.yaml                # bandeaux de fin des fiches arme et prof
│   ├── menus.yaml                 # menu principal, barre mobile, pied de page
│   ├── legal.yaml                 # mentions légales et confidentialité
│   ├── disciplines/*.mdoc         # catalogue des armes (une fiche par arme)
│   ├── faq/*.mdoc                 # questions générales
│   └── partenaires/*.mdoc
└── ecoles/clermont/               # contenu propre à la salle
    ├── ecole.yaml                 # lieu, contact, créneaux, tarifs, réseaux
    ├── profs/*.mdoc               # encadrants, bio, interview, vidéo
    ├── articles/*.mdoc            # actualités
    ├── annonces/*.yaml            # messages courts, épinglables en bandeau
    ├── faq/*.mdoc                 # questions locales (créneaux, tarif)
    └── galerie/*.yaml             # albums photo
```

Les photos éditoriales vivent dans `src/assets/photos/{commun,clermont}/` — jamais
dans `public/`, sinon elles échapperaient à l'optimisation.

### Raccourcis de texte

Le contact, le tarif, le lieu et les horaires ne sont saisis **qu'une fois**,
dans la fiche de l'école. Partout ailleurs on écrit un raccourci, résolu à la
génération du site :

`{email}` `{telephone}` `{lieu}` `{adresse}` `{ville}` `{tarif}` `{saison}`
`{creneaux}` `{essai}` `{nb_armes}` `{nb_profs}` — plus `{arme}` et `{prof}` sur
les pages de fiche.

`{nb_armes}` et `{nb_profs}` sont **comptés** sur ce qui est réellement affiché :
le titre « Quatre armes, quatre grammaires. » se recale tout seul si une carte
apparaît ou disparaît.

### Garde-fous du build

`npm run build` s'arrête, avec la liste complète des problèmes et le fichier
fautif, si :

1. un texte contient un raccourci inconnu (`{tarrif}`) ;
2. aucune école n'est marquée principale, ou plusieurs le sont ;
3. une image de contenu n'a pas de description alternative ;
4. deux annonces sont épinglées en bandeau en même temps.

Le code est dans `src/lib/validation.ts`, appelé une fois par `src/layouts/Base.astro`.

## Structure du code

```
src/
├── pages/            # 7 gabarits → 12 pages (accueil, fiches arme et prof,
│                     #   actualités, article, mentions légales, confidentialité)
├── layouts/Base.astro    # <head>, données structurées, garde-fous
├── components/
│   ├── sections/     # les blocs de l'accueil + en-tête, pied de page, menu
│   ├── fiches/       # blocs propres aux fiches arme et prof
│   └── ui/           # briques réutilisables (boutons, cartes, carrousel, icônes…)
├── lib/              # lecture du contenu, liens, images, raccourcis, validation
├── config/ecoles.ts  # source de vérité des implantations
├── styles/           # tokens.css (couleurs, typo, espacements) + global.css
└── assets/photos/    # photos dérivées, optimisées au build
```

## Administration

L'admin est servie sur `/keystatic`.

- **En développement** (`npm run dev`) : mode `local`, les modifications
  s'écrivent directement dans `src/content/` — à committer comme du code.
- **En production** : mode `github`, chaque « Enregistrer » produit un commit sur
  `TheLiloji/de-feu-et-d-acier` et déclenche un nouveau build. Les rédacteurs
  doivent être collaborateurs du dépôt.

### Variables d'environnement

**Trois secrets runtime**, à créer côté Cloudflare (Settings → Variables and
Secrets) avant la mise en ligne de l'admin. Ne jamais les committer :

| Nom | Rôle |
|---|---|
| `KEYSTATIC_SECRET` | signe le cookie de session de l'admin |
| `KEYSTATIC_GITHUB_CLIENT_ID` | OAuth de la GitHub App |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | idem |

**Une valeur publique, inlinée au build** : `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
Ce n'en est **pas** un quatrième secret. Keystatic la lit via `import.meta.env`
dans son bundle client : Vite la remplace au moment du `astro build`, et un
secret Cloudflare du même nom resterait inerte quel que soit le nombre de
redéploiements. Elle doit donc être présente dans l'environnement qui exécute
`npm run build` : copier `.env.example` en `.env` et y renseigner le slug. Sans
elle, l'admin
fonctionne, mais le bouton « Install GitHub App » de l'écran de mise en route
est remplacé par un avertissement et un lien vers `github.com/apps/undefined`.
En attendant, l'App s'installe à la main depuis GitHub.

## Déploiement

```bash
npm run build
npm run deploy      # wrangler deploy -c dist/server/wrangler.json
```

Le site public est entièrement pré-rendu : il est servi en assets statiques. Le
Worker n'est réveillé que pour les motifs listés dans `run_worker_first`
(wrangler.jsonc) — `/keystatic`, `/api/keystatic/*` et `/_image`. Toute autre
URL inconnue est servie directement par les assets, avec la page `404.html`.

## Liens

- [USAM Clermont-Ferrand](https://usam-clermont-ferrand.com/amhe-arts-martiaux-historiques-europeens)
- [HelloAsso · adhésion](https://www.helloasso.com/associations/usam-amhe-clermont-ferrand)
- [Facebook · 63AMHE](https://www.facebook.com/63AMHE/)
- [HEMA Ratings · le club](https://hemaratings.com/clubs/details/1155/)
- [FFAMHE](https://ffamhe.fr)
