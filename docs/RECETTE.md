# Recette du site — `npm run recette`

Contrôle automatisé et rejouable, écrit dans `scripts/recette.mjs`. Il ne
remplace pas un coup d'œil humain sur les captures d'écran (mise en page,
ton, cohérence visuelle) : il attrape ce qu'une machine peut mesurer de façon
fiable, pour que ce coup d'œil humain porte sur le reste.

## Quand la lancer

- **Avant tout déploiement manuel** (`npm run deploy`) : c'est le dernier
  filet avant que le site parte en ligne.
- **Après une grosse édition de contenu** — réécriture éditoriale sur
  plusieurs pages, ajout/retrait d'une discipline ou d'un traité, changement
  de structure de page. Ce sont les moments où une page perd son unique
  `<h1>`, où un texte raccourci casse une mise en page qui comptait sur sa
  longueur, ou où une fiche perd un crédit obligatoire.
- **Après avoir touché à `sitemap.xml.ts`, aux gabarits de fiche de traité,
  ou à la nav** — ce sont les zones où une régression est arrivée par le
  passé (cf. les commentaires dans `sitemap.xml.ts` et `scripts/recette.mjs`).

Ce n'est **pas** un test à lancer à chaque `git commit` : il construit le
site et démarre un serveur, ça prend une bonne minute.

## Prérequis (une fois)

```bash
npm install                    # installe playwright et axe-core (devDependencies)
npx playwright install chromium   # télécharge le navigateur si besoin
```

Si `axe-core` manque, le script le signale clairement dans le contrôle
« 7bis » plutôt que de planter ou de sauter le contrôle en silence.

## Lancer la recette

```bash
npm run recette
```

Par défaut, le script :

1. construit le site (`npm run build`) ;
2. démarre son propre `npm run preview` sur `http://localhost:4321` ;
3. joue les huit contrôles décrits plus bas ;
4. arrête le serveur de preview qu'il a démarré — toujours, même en cas
   d'échec ou d'interruption.

Pour tester une cible déjà en ligne (un `npm run preview` que vous avez lancé
vous-même dans un autre terminal, ou le site déployé) :

```bash
npm run recette -- --url=http://localhost:4321
npm run recette -- --url=https://dfda-amhe.fr
```

En mode `--url`, rien n'est construit ni démarré : le script suppose que la
cible sert déjà le contenu à jour. Le contrôle « sitemap.xml vs pages HTML »
compare au dossier `dist/client/` de la dernière build **locale** — s'il
n'existe pas (poste qui n'a jamais buildé, ou build fait ailleurs), ce
contrôle précis est ignoré avec un message `ℹ`, sans faire échouer la
recette pour autant.

## Ce qui est vérifié

| # | Contrôle |
|---|---|
| 1 | Les 21 pages connues répondent 200 ; une adresse inventée répond 404. |
| 2 | Zéro débordement horizontal à 390/820/1000/1440 px sur 6 gabarits représentatifs. |
| 3 | Zéro `<script>`/`<noscript>` visible à l'écran (le piège classique : un `display: grid` posé trop largement dans le CSS peut rendre visibles des balises censées être invisibles par défaut). |
| 4 | Un seul `<h1>` par page ; `sitemap.xml` compte autant d'URL que de pages HTML construites (404 exclue). |
| 5 | Sur chaque fiche de traité : autant de crédits affichés que de planches ; la mention « digitalisiert von Google » sur chaque crédit Marozzo ; le lien de licence CC BY 4.0 sur la fiche I.33. |
| 6 | « Netflix » apparaît exactement une fois sur l'accueil (texte de l'encart d'adhésion) ; zéro tiret cadratin dans un paragraphe de prose, hors lignes de crédit et citations. |
| 7 | Aucune image cassée (`naturalWidth === 0` après défilement complet) ; zéro violation `axe-core` en WCAG 2.1 AA. |
| 8 | Les canaux techniques répondent : `/rss.xml` bien formé (au moins un article, liens absolus) ; `/.well-known/security.txt` avec un contact et une date d'expiration à venir. |

## Lire un échec

La sortie est une liste `✓`/`✗`, groupée par contrôle, suivie d'un résumé :

```
✗ [2-debordement] /sources/talhoffer-1467/ @390px — 412 vs 390 — div.planches__item [0→412]
...
===== RECETTE : 187 contrôle(s), 1 échec(s) =====

À corriger :
  ✗ [2-debordement] /sources/talhoffer-1467/ @390px — 412 vs 390 — div.planches__item [0→412]
```

- Le préfixe entre crochets (`2-debordement`, `5-marozzo`, `6-tirets`…)
  renvoie au numéro du contrôle dans le tableau ci-dessus — `2-*` pour le
  débordement, `5-*` pour les fiches de traité, etc.
- Le libellé nomme la page (et, pour le débordement, la largeur) en cause.
- Le détail après le tiret est la preuve mesurée : largeurs en pixels et
  premiers éléments coupables pour un débordement, nombre de crédits vs
  planches pour une fiche, extrait du paragraphe fautif pour un tiret
  cadratin, identifiant de règle et impact pour une violation axe-core.
- Le code de sortie est `1` s'il y a au moins un échec, `0` sinon — utilisable
  tel quel dans un hook ou une CI.

Un `✗ [7-axe] axe-core présent dans node_modules` en tête de sortie signifie
que `npm install` n'a pas été relancé après l'ajout de la dépendance : ce
n'est pas un vrai problème du site, juste un poste pas à jour.

## Faire évoluer le script

`ROUTES_CONNUES` (en tête de `scripts/recette.mjs`) est la même logique que
`src/pages/sitemap.xml.ts` : toute nouvelle page publique doit être ajoutée
aux deux endroits, sinon le contrôle 1 ne la voit jamais et le contrôle 4bis
(sitemap vs pages HTML) se met à échouer pour la mauvaise raison.
