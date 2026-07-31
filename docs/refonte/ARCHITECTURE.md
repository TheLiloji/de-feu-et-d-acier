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
| Périmètre | Accueil + **fiches arme** + **fiches prof** (blocs vidéo/interview **masqués tant que vides**) + annonces + articles + **« Les sources »**, le mini-wiki des traités historiques (`/sources/` et `/sources/<slug>/`). |
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
- **Profs** : collection par école. Portrait + alt + cadrage (select), armes enseignées (sélection dans le catalogue disciplines), accroche, bio en **corps libre** (texte + widgets, cf. widgets.md), lien externe, « Mis en avant », « Affiché sur le site », interview Q/R (array, masquable), vidéo (masquable). La bio **ne vit plus dans la colonne du hero** : elle est une section pleine largeur, sous le hero et avant l'interview — un corps qui peut porter une galerie et deux vidéos n'a pas sa place dans un hero.
- **Disciplines** : catalogue commun. L'épée-bocle **existe** dans le catalogue avec `affichee: false` (sélectionnable dans les créneaux, invisible dans la grille des cartes). 4 cartes affichées aujourd'hui.
- **Traités (« Les sources »)** : collection **commune**, `src/content/commun/traites/`. Titre, auteur, année, tradition, bibliothèque de conservation, cote, lien de numérisation, droits (résumé + adresse de la licence), armes concernées, présentation riche, extrait cité (citation + crédit + lien), et un tableau de **planches** (image, description, légende, folio, ligne de crédit, « planche majestueuse »). Pages `/sources/` (liste) + `/sources/<slug>/` (fiche). 8 traités, 34 planches aujourd'hui. L'ordre est **éditorial et non chronologique** : le champ « Ordre » groupe les traités par arme, si bien que l'I.33 (vers 1320), le plus ancien du corpus, arrive en 7ᵉ position — d'où des voisins de bas de fiche annoncés « Traité précédent / suivant », jamais « Plus ancien / Plus récent ».
- **L'encadré « La source » d'une fiche arme ne porte plus d'image.** La planche, sa description et son crédit viennent tous les trois de la fiche du traité, parce qu'ils sont **inséparables** : laisser déposer une image quelconque à côté d'une ligne de crédit de bibliothèque produirait une fausse attribution. Ne restent dans la fiche arme que la voix du club (titre, texte) et une surcharge de lien facultative. Même règle pour la planche de « La rigueur » sur l'accueil, dont le crédit est saisi avec l'image.
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
- **« Les sources » est entrée dans le menu principal**, entre « Nous rejoindre » et « Tournois » — donc dans la nav desktop **et** dans le tiroir mobile, qui partagent la même liste. La décision est **mesurée**, pas calculée : à 1000 px (la bascule), la liste des 7 entrées fait 724 px sans être rognée, le CTA reste entier dans la fenêtre, rien ne passe à la ligne, et le document ne déborde pas. Un calcul par somme de composants avait conclu l'inverse ; il se trompait. **Marge restante : 24 px** (la liste casse à 749 px) — une 8ᵉ entrée ne tiendra pas, et il faudra alors relever `BASCULE_NAV` vers ~1100 px plutôt que rogner la barre. L'entrée reste aussi dans le pied de page, colonne « Le club », comme Disciplines, FAQ et Tournois.
- États hover/focus non maquettés : sobres, dans le langage établi ($ember-hot, soulignés, filets). `prefers-reduced-motion` respecté sur toutes les animations (reveal, carrousel).
- **Parité de contenu desktop/mobile obligatoire** (mobile-first indexing) : le mobile compacte (accordéons, carrousel, grilles resserrées) mais ne **supprime** aucun contenu — décision chef de projet là où la maquette mobile masquait galerie/FAQ/partenaires/tournois.
- Gabarits **non maquettés** (bandeau annonce, liste actus, page article) : à concevoir dans le langage visuel établi (filets 1 px, eyebrows, Cormorant display, alternance $ink/$coal).
- Numérotation des sections (01·, 02·…) : **calculée au rendu**, jamais stockée en base.
- **La barre d'onglets mobile (`TabBar`) est du chrome global** — décision client : elle est rendue sur **toutes** les pages du site (accueil, fiches arme et prof, liste et détail d'actualités, « Les sources » et fiche de traité, mentions légales, confidentialité, 404), et non sur les trois gabarits que maquette design-spec §9.12. Elle se place après `<main>`, dans le slot `pied`, à la suite du `Footer` ; sa cale réserve sa hauteur en fin de flux et `html { scroll-padding-bottom }` (global.css) l'empêche de masquer le focus clavier. Une page nouvelle sans TabBar est un défaut, pas un choix.
- **Typographie française composée au rendu, jamais à la saisie** (`src/lib/typographie.ts`) : apostrophe courbe, fine insécable devant `? ! ;` et à l'intérieur des `« »`, insécable devant `:`. Le point d'application est `resoudre()` (`src/lib/raccourcis.ts`), par lequel transite tout le texte à raccourcis du CMS, plus `analyserTitre()` (`src/components/ui/titre.ts`) pour les titres display bâtis sur des données brutes (nom d'arme, nom d'encadrant, titre d'article). Le rédacteur écrit normalement, le site compose : corriger les fichiers de contenu un par un ne tient pas, la faute revient à la saisie suivante.
- **Crédit photo** : le CMS ne porte que le nom, le « © » est posé au rendu par `creditAffiche()` (`src/lib/images.ts`) — un seul format sur tout le site, quels que soient les photographes et les moments de saisie. Un « © » saisi malgré tout est absorbé, jamais doublé.
- Accessibilité : alt obligatoires (depuis le CMS), landmarks, contrastes vérifiés, navigation clavier sur carrousel/accordéon/menu.

## 6. Médias — photos, planches de traités, vidéos

- Masters dans `nouvelles_photos/` (246 Mo) : **jamais** utilisés directement. Dérivés optimisés committés dans `src/assets/photos/{commun,clermont}/` : JPEG qualité haute, **≤ 2400 px**, **≤ 1,5 Mo**, EXIF nettoyé **sauf Copyright**, noms kebab-case sans accent. `astro:assets` (`<Image>`/`<Picture>`, sharp) génère avif/webp/srcset au build.
- Attributions par section : suivre `photos.md` + les 2 swaps du §1.
- Crédits : champ crédit dans le CMS ; **© Alexandre Vergne — L'IMAGINARIUM** sur les 8 fichiers concernés (cf. photos.md). `_ASC0652/_ASC0675` : filigrane « Enzo Cirillo » assumé tel quel pour l'instant.
- Carte viking (`disc-viking`) : source médiocre (393 px) assumée temporairement — recadrer/soigner au mieux, TODO reshoot signalé au client.
- Tuile galerie légendée « Combat viking » dans la maquette : la photo montre une initiation grand public → **légende corrigée** (« Initiation », pas de mensonge), photo conservée.
- Portraits profs : réutiliser les portraits existants de l'ancien site (`Marie.png`, `Gabriel.jpg`, `Ludwig.jpeg` dans `public/assets/` — les récupérer AVANT le nettoyage, les convertir en dérivés propres).
- Carte OSM : **abandonnée** (le plan schématique SVG qui la remplaçait a été refusé par le club). À sa place, `lieu.photo` — une vraie photo de l'entrée, saisie dans l'admin — et `lieu.photosInterieur`, ouvertes dans une visionneuse au clic. Le lien « Itinéraire » sortant reste (pas d'iframe, pas de tuiles distantes : zéro cookie, conforme à la promesse RGPD du site). Tant qu'aucune photo n'est déposée, le bloc se rend en version compacte — adresse, contact, itinéraire.

### Planches de traités — droits, et pourquoi ils ne se négocient pas

Une planche de traité n'est pas une photo du club : c'est l'image d'une bibliothèque, publiée sous des conditions écrites. Les règles ci-dessous sont **intransgressibles**, et le garde-fou n° 6 du build les fait respecter (§7).

- **Le crédit est rendu verbatim, par planche.** Ni « © » ajouté — la plupart de ces planches sont sous *Public Domain Mark 1.0* ou déclarées « domaine public » par Gallica, donc explicitement sans droit d'auteur, et un « © » y serait un contresens juridique — ni composition typographique, ni capitales : `text-transform: uppercase` déformerait « Source gallica.bnf.fr ». C'est la **seule chaîne du site** qui échappe à `typographieFr`, et la seule à laquelle `creditAffiche()` ne doit jamais être appliqué. Le point de passage unique est `creditPlanche()` / `creditPlancheHtml()` (`src/components/sources/traites.ts`), qui ne font qu'un `.trim()`.
- **Un crédit par planche, jamais un gabarit.** Les corpus MDZ portent le folio dans leur ligne de crédit : le champ « crédit » de la fiche est un modèle à trous, seul `creditLignePlanche` fait foi. Le crédit Marozzo doit conserver « digitalisiert von Google » ; le crédit de l'I.33 (Royal Armouries) exige le lien vers la licence CC BY 4.0 **et** la mention des modifications.
- **Le crédit est affiché sous chaque planche**, jamais regroupé en bas de page — c'est l'image qu'il crédite —, et **repris dans la visionneuse** : une reproduction en plein écran sans sa mention de source ne serait pas en règle. Sur la page de liste, chaque carte nomme sa bibliothèque et une phrase renvoie à la fiche pour le crédit complet, ce que CC BY 4.0 §3.a.2 autorise explicitement pour une vignette.
- Les adresses contenues dans un crédit sont rendues **cliquables sans qu'un caractère visible change** (CC BY 4.0 §3.a.2 demande « a URI or hyperlink » vers la licence). La ponctuation qui suit l'adresse reste hors du lien ; les URN du MDZ restent du texte, ce sont des identifiants.
- **Ce qui n'est pas publié.** La traduction moderne Ringeck/ARDAMHE de l'épée longue (`sources-masters/liechtenauer-epee-longue/texte-ringeck-ardamhe/`) : droits non établis, le fichier `NE-PAS-PUBLIER.txt` fait foi. La transcription ARDAMHE de la Noble Science n'est reprise qu'en **courts extraits** (droit de courte citation), créditée « Transcription ARDAMHE, hébergée par la FFAMHE » avec lien vers la page source — jamais en intégralité. Le bloc d'extrait refuse de rendre une citation sans crédit **ni** lien, en plus du garde-fou de build : deux verrous plutôt qu'un.

### Vidéos — lecteur natif, fichiers sur notre propre R2

- **Aucun lecteur de plateforme embarqué.** Une `<iframe>` YouTube ou Vimeo déposerait des cookies tiers avant tout consentement, ce que la promesse RGPD du site interdit (même raison que la carte OSM ci-dessus). Les vidéos du club sont déposées sur **notre stockage R2** et lues par le `<video>` natif du navigateur (`VideoCard.astro`) : `controls` sans `autoplay`, ce qui donne clavier, plein écran et sous-titres sans une ligne de JavaScript. Un `<video>` servi depuis notre propre domaine ne contredit pas la promesse : il n'y a ni tiers, ni cookie.
- Une adresse de plateforme reste acceptée par le champ, mais la vignette n'est alors qu'un **lien sortant**, et le départ du site est annoncé à l'écran (nom de l'hébergeur + `arrow-up-right`) plutôt que deviné.
- **Sous-titres obligatoires dès qu'une vidéo est publiée** (WCAG 1.2.2) : un champ « Sous-titres (fichier .vtt) » accompagne chaque vidéo, à remplir avec la piste française déposée à côté du fichier. Un champ « Image d'attente » permet de donner au lecteur une affiche autre que la vignette.

### Le fond du hero — deux cadrages de photo, une vidéo prévue

- La photo de fond de l'accueil existe en **deux cadrages**, saisis dans le singleton « Accueil · En-tête » : **paysage** (photo de référence, servie partout par défaut) et **portrait** (facultatif, pour les téléphones tenus droits). Quand les deux sont déposés, `Hero.astro` rend un `<picture>` art-directed : la `<source>` portrait est retenue par `(max-width: 819px) and (orientation: portrait)` — 820 est **la** bascule de contenu du site (§5), déjà celle du voile du hero ; la condition d'orientation évite de servir un cadrage vertical à un téléphone tenu couché, où `object-fit: cover` n'en garderait qu'une bande. Le navigateur ne télécharge **qu'une** des deux photos (comportement natif de `<picture>`, aucun preload à arbitrer), et l'`<img>` — l'image LCP — garde `loading="eager"` + `fetchpriority="high"`. Un `<picture>` n'a qu'un `alt` : c'est celui de la photo paysage, d'où la consigne de l'admin — le portrait est la même scène, recadrée en hauteur.
- **Vidéo de fond (prévue, non construite)** — décision client : « une possibilité plus tard de mettre une vidéo ». Le jour venu : champ vidéo optionnel du singleton (mêmes règles que `champsVideo` — fichier mp4 de même origine, R2, jamais de plateforme) ; vidéo remplie ⇒ elle **prime sur les photos**, en autoplay muet en boucle (`muted playsinline loop`, sans commandes) ; `prefers-reduced-motion` ⇒ on sert les photos ; `poster` = la photo paysage. Le plan pas à pas est en tête de `src/components/sections/Hero.astro`, dont les couches sont déjà découpées pour que l'ajout soit un petit diff.

## 7. Git, build, déploiement

- Travail sur la branche **`refonte`**. `origin/refonte` archive aussi les masters photos — c'est voulu.
- À la toute fin : `nouvelles_photos/` et `maquette-assets/` retirés de l'arbre, puis **squash-merge** vers `main` → l'historique de `main` ne porte jamais les 246 Mo.
- Déploiement : `wrangler deploy` direct (wrangler connecté au compte asso). `wrangler.jsonc` neuf (l'ancien `wrangler.toml` référence un KV de l'ANCIEN compte — poubelle). Flag `nodejs_compat` requis (Keystatic importe node:fs/path). Si l'adaptateur exige un KV SESSION : le créer sur le nouveau compte, sinon désactiver les sessions.
- Admin : Keystatic mode `local` en dev, `github` en prod (repo `TheLiloji/de-feu-et-d-acier`). GitHub App + 4 secrets à créer en phase déploiement (cf. checklist stack-notes). Rebuild auto à chaque sauvegarde : à brancher en phase déploiement (Workers Builds ou GitHub Actions) — pas le sujet de la construction.
- Garde-fous au build (`src/lib/validation.ts`, appelé une fois par `Base.astro`), **neuf contrôles** → build en échec avec un message clair, jamais un avertissement : raccourci inconnu ; aucune école principale (ou plusieurs) ; image de contenu sans description alternative ; doublon de bandeau épinglé ; image déposée dans un format que le build ne sait pas traiter ; **droits d'un traité** — planche sans description ou sans crédit, traité sans adresse de licence, extrait cité sans crédit ni lien vers sa source ; **la planche de « La rigueur »** sans sa ligne de crédit (elle vit dans le singleton `rigueur`, hors de la collection, et c'est la planche la plus visible du site) ; **piste de sous-titres `.vtt` en adresse absolue** — un `<track>` cross-origin est abandonné en silence par le navigateur (la vidéo va sur R2, le `.vtt` reste dans `public/`) ; **les widgets des quatre corps libres** (bio d'un encadrant, description longue d'une arme, contenu d'un article, présentation d'un traité) — renvoi vers un slug inexistant ou vers une page non publiée, renvoi sans destination choisie, photo de galerie sans description, planche sans description ou sans crédit, widget inconnu, widget imbriqué dans une citation ou une liste, bouton sans texte ou sans adresse. Le n° 6 vérifie en outre que chaque arme rattachée à un traité existe bien dans le catalogue des disciplines ; le n° 9 est le seul à ouvrir les corps Markdoc, que les parcours récursifs des autres contrôles sautent parce que le lecteur les expose en valeurs paresseuses (cf. widgets.md §5).

## 8. Ce qui reste à la charge du client avant mise en ligne publique

- Autorisations écrites : portrait `PSX_…` (si on veut le remettre), pratiquants de `…-80` ; confirmer l'étendue de la cession Alexandre Vergne (8 photos).
- Identifier l'auteur de `_MG_5965.jpg` (le hero !) et de la série `IMG_*`.
- Photo viking correcte (nature morte cohérente avec la série Vergne) + portraits profs récents si souhaité.
- Choix du domaine définitif (impacte l'URL de callback de la GitHub App).
- Comptes GitHub des rédacteurs (Keystatic mode GitHub = collaborateurs du repo).
