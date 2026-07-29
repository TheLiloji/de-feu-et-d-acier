# Architecture de la refonte — décisions actées

> **Statut : DÉCISIONS VALIDÉES** (chef de projet + client, 28 juillet 2026).
> Ce document est la référence de tous les agents de construction. En cas de
> conflit entre les documents d'analyse, **ce fichier gagne**. Les analyses
> détaillées restent la référence pour tout ce qui n'est pas arbitré ici :
> `design-spec.md` (design), `content-model.md` (champs CMS), `multi-ecoles.md`
> (architecture contenu), `photos.md` (images), `stack-notes.md` (pièges Cloudflare).

## 1. Décisions client (validées explicitement)

| Sujet | Décision |
| --- | --- |
| Hébergement | **Cloudflare Workers** (pas Pages). Projet `dfda-amhe`, compte asso (amhe63.dfda@gmail.com). |
| Périmètre | Accueil + **fiches arme** + **fiches prof** (blocs vidéo/interview **masqués tant que vides**) + annonces + articles. |
| Photos sensibles | **Swap préventif** : `IMG_3364.jpg` remplace `PSX_20260430_200236.jpg` (Tournois) ; `MedievelMontferrand2026-70.jpg` remplace `MedievelMontferrand2026-80.jpg` (galerie). Réversible via CMS si autorisations obtenues. |
| Contact | **Unique partout** : `amhe63.dfda@gmail.com` · `06 61 28 65 11` (FAQ, footer, mentions légales incluses). Clémence Sillac reste directrice de publication, **sans** coordonnées personnelles. `c.sillac@protonmail.com` et `06 31 58 54 60` disparaissent du site. |

## 2. Stack (versions vérifiées sur npm le 28/07/2026)

- **Astro 7.1.4** — `output: 'static'`, adaptateur seulement pour les routes Keystatic.
- **@astrojs/cloudflare 14.1.5** (Workers ; exige wrangler ^4.83 → mettre à jour).
- **@keystatic/core 0.6.3** + **@keystatic/astro 5.2.0** (peer OK avec Astro 7).
- **React 19** + **@astrojs/react 6.0.1** — React sert UNIQUEMENT l'admin Keystatic, jamais le site public.
- **TypeScript**, **sharp** (service d'images, `imageService: 'compile'` cf. stack-notes).
- Interactivité du site public : **JS vanilla dans des `<script>` Astro** (carrousel, accordéon, menu mobile, reveal). Zéro framework côté visiteur.
- Polices auto-hébergées via Fontsource : **Cormorant Garamond** (display) + **Inter** (corps). Preload du display, `font-display: swap`.
- Icônes : **lucide** (mêmes glyphes que la maquette), en SVG inline via un composant `Icon.astro` (pas de dépendance runtime).

## 3. Multi-écoles — option A actée (cf. multi-ecoles.md, qui fait foi)

- `src/config/ecoles.ts` : source de vérité, 1 entrée (`clermont`, `principale: true`). `MULTI = ECOLES.length > 1`.
- Contenu **commun** (association) : `src/content/commun/` — rigueur, disciplines (catalogue), partenaires, FAQ générale, identité, RGPD.
- Contenu **école** : `src/content/ecoles/clermont/` — ecole.yaml (lieu, contact, créneaux, tarifs, réseaux, légal local), profs/, annonces/, articles/, faq locale, galerie.
- Collections Keystatic **générées** depuis `ECOLES` (le dossier EST l'école ; **jamais** de champ « école » à remplir, pas de `fields.relationship` pour ça).
- Les composants reçoivent l'école **en props** ; liens internes via helper `lien(ecole, cible)`.
- **Pas** de route dynamique `[ecole]` aujourd'hui : `index.astro` rend l'école principale. La route apparaît le jour J.
- Arbitrage inter-documents : là où `content-model.md` proposait un mécanisme à base de `relationship`/`multiRelationship`, c'est le mécanisme par **répertoires** de `multi-ecoles.md` qui gagne. `content-model.md` reste la référence pour la **liste des champs**, leurs types et libellés français.

## 4. Modèle de contenu — arbitrages

- **Annonces** : collection par école. Message court, date, ton (info/important/urgent), « Épingler en bandeau », date de fin (expiration auto au build). Pas de page dédiée.
- **Articles** : collection par école. Titre, date, brouillon/publié, couverture + alt, chapô, corps markdoc, épinglé à la une. Pages `/actualites/` (liste) + `/actualites/<slug>/`.
- **Profs** : collection par école. Portrait + alt + cadrage (select), armes enseignées (sélection dans le catalogue disciplines), accroche, bio riche, lien externe, « Mis en avant », « Affiché sur le site », interview Q/R (array, masquable), vidéo (masquable).
- **Disciplines** : catalogue commun. L'épée-bocle **existe** dans le catalogue avec `affichee: false` (sélectionnable dans les créneaux, invisible dans la grille des cartes). 4 cartes affichées aujourd'hui.
- **Titres auto-calculés** : « {nb_armes} armes, {nb_armes} grammaires. », « {nb_profs} encadrants… » — recalculés au build depuis le contenu affiché.
- **Raccourcis** dans les textes : `{email}`, `{telephone}`, `{lieu}`, `{adresse}`, `{tarif}`, `{saison}`, `{creneaux}`, `{essai}` — résolus au build depuis la fiche école. **Raccourci inconnu = échec du build.**
- Formats : YAML pour les entrées, `.mdoc` pour les corps longs. Libellés admin 100 % français, aucun champ HTML brut.
- Texte : reprendre `CONTENU-SITE.md` **corrigé** (table des coquilles de content-model.md §fin ; contact unifié §1 ; « Cinq armes » → titre auto).
- FAQ : les **8 questions avec leurs réponses complètes** viennent de CONTENU-SITE.md (la maquette a des placeholders — ignorer). Les 2 questions locales (créneaux/lieu, tarif) descendent dans la FAQ école.

## 5. Design — règles d'implémentation

- Référence : frames **« V2 — … »** uniquement (desktop 1440 / mobile 390 + fiches arme et prof). Les frames V1 ne servent que pour les bios longues des profs.
- Tokens CSS custom properties dans `src/styles/tokens.css` : les 14 variables de la maquette + tokenisation des 30 littéraux en familles `--veil-*`, `--surface-*`, `--ember-tint-*` (cf. design-spec §tokens). `$ember-hot` réservé aux états `:hover`/`:focus-visible`.
- Styles **scopés dans les .astro**, pas de framework CSS. Espacements : les frames `esp` de la maquette deviennent des margins/gaps, jamais des div vides.
- **Fluide entre 390 et 1440** : `clamp()` sur la typo et les espacements (ratios mesurés : display ×0.62 en mobile, corps ×0.88), bascules de layout vers ~820 px. Aucun breakpoint tablette maquetté : interpoler proprement.
- **Deux seuils, et deux seulement.** `820 px` = bascule de *contenu* (une grille passe à deux colonnes, un accordéon redevient une liste) : chaque section choisit le sien, rien ne les lie. `1000 px` = bascule du **chrome de navigation**, et elle est indivisible : la nav desktop ne tient pas en dessous (calcul de largeur dans `Nav.astro`), donc en dessous la page est en gabarit mobile — blason + burger, tiroir plein écran, barre d'onglets. Le seuil est nommé `BASCULE_NAV` dans `src/lib/breakpoints.ts`, qui liste les six fichiers alignés dessus ; une valeur qui diverge ouvre une bande sans navigation.
- États hover/focus non maquettés : sobres, dans le langage établi ($ember-hot, soulignés, filets). `prefers-reduced-motion` respecté sur toutes les animations (reveal, carrousel).
- **Parité de contenu desktop/mobile obligatoire** (mobile-first indexing) : le mobile compacte (accordéons, carrousel, grilles resserrées) mais ne **supprime** aucun contenu — décision chef de projet là où la maquette mobile masquait galerie/FAQ/partenaires/tournois.
- Gabarits **non maquettés** (bandeau annonce, liste actus, page article) : à concevoir dans le langage visuel établi (filets 1 px, eyebrows, Cormorant display, alternance $ink/$coal).
- Numérotation des sections (01·, 02·…) : **calculée au rendu**, jamais stockée en base.
- **La barre d'onglets mobile (`TabBar`) est du chrome global** — décision client : elle est rendue sur **toutes** les pages du site (accueil, fiches arme et prof, liste et détail d'actualités, mentions légales, confidentialité, 404), et non sur les trois gabarits que maquette design-spec §9.12. Elle se place après `<main>`, dans le slot `pied`, à la suite du `Footer` ; sa cale réserve sa hauteur en fin de flux et `html { scroll-padding-bottom }` (global.css) l'empêche de masquer le focus clavier. Une page nouvelle sans TabBar est un défaut, pas un choix.
- **Typographie française composée au rendu, jamais à la saisie** (`src/lib/typographie.ts`) : apostrophe courbe, fine insécable devant `? ! ;` et à l'intérieur des `« »`, insécable devant `:`. Le point d'application est `resoudre()` (`src/lib/raccourcis.ts`), par lequel transite tout le texte à raccourcis du CMS, plus `analyserTitre()` (`src/components/ui/titre.ts`) pour les titres display bâtis sur des données brutes (nom d'arme, nom d'encadrant, titre d'article). Le rédacteur écrit normalement, le site compose : corriger les fichiers de contenu un par un ne tient pas, la faute revient à la saisie suivante.
- **Crédit photo** : le CMS ne porte que le nom, le « © » est posé au rendu par `creditAffiche()` (`src/lib/images.ts`) — un seul format sur tout le site, quels que soient les photographes et les moments de saisie. Un « © » saisi malgré tout est absorbé, jamais doublé.
- Accessibilité : alt obligatoires (depuis le CMS), landmarks, contrastes vérifiés, navigation clavier sur carrousel/accordéon/menu.

## 6. Photos — pipeline et décisions

- Masters dans `nouvelles_photos/` (246 Mo) : **jamais** utilisés directement. Dérivés optimisés committés dans `src/assets/photos/{commun,clermont}/` : JPEG qualité haute, **≤ 2400 px**, **≤ 1,5 Mo**, EXIF nettoyé **sauf Copyright**, noms kebab-case sans accent. `astro:assets` (`<Image>`/`<Picture>`, sharp) génère avif/webp/srcset au build.
- Attributions par section : suivre `photos.md` + les 2 swaps du §1.
- Crédits : champ crédit dans le CMS ; **© Alexandre Vergne — L'IMAGINARIUM** sur les 8 fichiers concernés (cf. photos.md). `_ASC0652/_ASC0675` : filigrane « Enzo Cirillo » assumé tel quel pour l'instant.
- Carte viking (`disc-viking`) : source médiocre (393 px) assumée temporairement — recadrer/soigner au mieux, TODO reshoot signalé au client.
- Tuile galerie légendée « Combat viking » dans la maquette : la photo montre une initiation grand public → **légende corrigée** (« Initiation », pas de mensonge), photo conservée.
- Portraits profs : réutiliser les portraits existants de l'ancien site (`Marie.png`, `Gabriel.jpg`, `Ludwig.jpeg` dans `public/assets/` — les récupérer AVANT le nettoyage, les convertir en dérivés propres).
- Carte OSM : **abandonnée** (le plan schématique SVG qui la remplaçait a été refusé par le club). À sa place, `lieu.photo` — une vraie photo de l'entrée, saisie dans l'admin — et `lieu.photosInterieur`, ouvertes dans une visionneuse au clic. Le lien « Itinéraire » sortant reste (pas d'iframe, pas de tuiles distantes : zéro cookie, conforme à la promesse RGPD du site). Tant qu'aucune photo n'est déposée, le bloc se rend en version compacte — adresse, contact, itinéraire.

## 7. Git, build, déploiement

- Travail sur la branche **`refonte`**. `origin/refonte` archive aussi les masters photos — c'est voulu.
- À la toute fin : `nouvelles_photos/` et `maquette-assets/` retirés de l'arbre, puis **squash-merge** vers `main` → l'historique de `main` ne porte jamais les 246 Mo.
- Déploiement : `wrangler deploy` direct (wrangler connecté au compte asso). `wrangler.jsonc` neuf (l'ancien `wrangler.toml` référence un KV de l'ANCIEN compte — poubelle). Flag `nodejs_compat` requis (Keystatic importe node:fs/path). Si l'adaptateur exige un KV SESSION : le créer sur le nouveau compte, sinon désactiver les sessions.
- Admin : Keystatic mode `local` en dev, `github` en prod (repo `TheLiloji/de-feu-et-d-acier`). GitHub App + 4 secrets à créer en phase déploiement (cf. checklist stack-notes). Rebuild auto à chaque sauvegarde : à brancher en phase déploiement (Workers Builds ou GitHub Actions) — pas le sujet de la construction.
- Garde-fous au build (script de validation) : raccourci inconnu, aucune école principale, image sans alt, doublon de bandeau épinglé → **build en échec avec message clair**.

## 8. Ce qui reste à la charge du client avant mise en ligne publique

- Autorisations écrites : portrait `PSX_…` (si on veut le remettre), pratiquants de `…-80` ; confirmer l'étendue de la cession Alexandre Vergne (8 photos).
- Identifier l'auteur de `_MG_5965.jpg` (le hero !) et de la série `IMG_*`.
- Photo viking correcte (nature morte cohérente avec la série Vergne) + portraits profs récents si souhaité.
- Choix du domaine définitif (impacte l'URL de callback de la GitHub App).
- Comptes GitHub des rédacteurs (Keystatic mode GitHub = collaborateurs du repo).
