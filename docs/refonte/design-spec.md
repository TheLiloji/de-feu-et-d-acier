# Spécification de design — maquette « De Feu et d'Acier »

> Document de référence extrait de `Maquette.pen` (format Pen v2.14, `fileToken d4413b9e-44ea-43ac-83bf-763693b18d31`).
> Généré par parcours programmatique de l'arbre JSON : **9 frames racines, 1 962 nœuds** (898 frames, 691 textes, 195 rectangles, 178 icônes).
> **Les 691 nœuds texte de la maquette figurent dans ce document** (voir le décompte de contrôle en §11).

---

## Sommaire

| § | Contenu |
|---|---|
| [0](#0-comment-lire-ce-document) | Comment lire ce document — modèle de données, conventions de notation, pattern `esp` |
| [1](#1-design-tokens) | **Design tokens** — variables, couleurs littérales, familles et échelles typographiques, espacements, rayons, icônes |
| [2](#2-frames-racines) | **Frames racines** — inventaire des 9 frames, version de référence, rythme des sections |
| [3](#3-accueil-desktop-référence--v2--site-desktop) | **Accueil desktop 1440** — spec + arbre exhaustif des 11 sections |
| [4](#4-accueil-mobile-référence--v2--mobile-390) | **Accueil mobile 390** — spec + arbre exhaustif des 10 sections |
| [5](#5-gabarit--fiche-arme--v2--fiche-arme-desktop--mobile) | **Gabarit « Fiche arme »** — desktop + mobile |
| [6](#6-gabarit--fiche-prof--v2--fiche-prof-desktop--mobile) | **Gabarit « Fiche prof »** — desktop + mobile |
| [7](#7-menu-mobile-ouvert--mobile--menu-ouvert) | **Menu mobile ouvert** |
| [8](#8-annexe--itération-v1-site-desktop--nouvelles-photos-mobile--390) | Annexe — itération V1, deltas et arbres exhaustifs |
| [9](#9-patterns-récurrents--composants-à-créer) | **Patterns récurrents → composants à créer** (15 composants) |
| [10](#10-écarts-incohérences-et-décisions-à-prendre) | **Écarts, incohérences et décisions à prendre** |
| [11](#11-contrôle-dexhaustivité) | Contrôle d'exhaustivité |

---

## 0. Comment lire ce document

### 0.1 Modèle de données de la maquette

La maquette n'est pas du HTML : c'est un arbre de quatre types de nœuds.

| Type | Rôle | Propriétés utiles |
|---|---|---|
| `frame` | conteneur, équivalent d'une `div` | `layout`, `gap`, `padding`, `justifyContent`, `alignItems`, `width/height`, `fill`, `stroke`, `strokeWidth`, `cornerRadius`, `clip` |
| `rectangle` | forme pleine : photo, voile, filet, séparateur, barre de placeholder | `width/height`, `x/y`, `fill`, `cornerRadius` |
| `text` | nœud texte atomique | `content`, `fontFamily`, `fontSize`, `fontWeight`, `fontStyle`, `letterSpacing`, `lineHeight`, `fill`, `textAlign`, `textGrowth`+`width` |
| `icon` | pictogramme de la bibliothèque **lucide** | `icon`, `library`, `width/height`, `fill` |

### 0.2 Conventions de notation utilisées dans les arbres exhaustifs

- `**frame** \`Nom\` 640×hug — layout=vertical, gap=12, pad=26/22` : frame nommée « Nom », 640 px de large, hauteur au contenu, colonne, gouttière 12, padding CSS `26px 22px`.
- Dimensions : `hug` = taille au contenu (`width: auto` / `fit-content`), `fill` = `fill_container` (`flex: 1` / `width: 100%`), sinon valeur en px.
- `layout=none` : positionnement **absolu** des enfants via `@x,y` → en CSS `position: relative` sur le parent + `position: absolute` sur les enfants.
- `layout=horizontal(défaut)` : la propriété `layout` est absente dans le JSON, ce qui signifie **rangée** (`flex-direction: row`).
- `pad=a/b` = `padding: a b` ; `pad=a/b/c/d` = `padding: a b c d` (haut/droite/bas/gauche).
- `stroke=$parch-line {"bottom": 1} inner` = **filet de 1 px uniquement en bas**, tracé à l'intérieur → `border-bottom: 1px solid var(--parch-line)`.
- `**T** « texte » — $body · 16px · wnormal · lh 1.7 · $parch-mute · fixed-width 460` : nœud texte, famille `$body`, 16 px, graisse `normal`, interligne 1.7 (unitless), couleur `$parch-mute`, largeur bloquée à 460 px.
- `img=maquette-assets/hero.jpg (mode fill)` : image de fond, `mode fill` = `object-fit: cover`, `mode fit` = `object-fit: contain`.

### 0.3 Le pattern `esp` (144 occurrences)

La maquette n'utilise **presque jamais** `gap` pour l'espacement vertical des blocs de section. Elle intercale des frames vides nommées `esp` (« espace ») de hauteur fixe : `esp 10×56`, `esp 10×28`, `esp 10×14`…

**En intégration, ces `esp` ne doivent pas être reproduits comme des `div` vides.** Ce sont des marges : `margin-top` sur l'élément suivant, ou un `gap` dédié. Leur valeur en px est la seule information à conserver. Les hauteurs relevées : 4, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 48, 56, 64.

---

## 1. Design tokens

### 1.1 Variables déclarées dans le fichier (`variables`)

Ce sont les seuls tokens formellement définis dans la maquette. La colonne « occurrences » compte les usages en `fill` sur l'ensemble du fichier / sur les seules frames V2.

| Token | Type | Valeur | Alpha | Occurrences (tout / V2) | Rôle |
|---|---|---|---|---|---|
| `$ink` | color | `#0a0908` | 100 % | 69 / 44 | Fond principal du site, texte posé sur `$ember` |
| `$coal` | color | `#15120f` | 100 % | 14 / 7 | Fond de section alterné (une section sur deux) |
| `$char` | color | `#1f1b16` | 100 % | 4 / 2 | Fond de carte/cadre interne (cadre traité, fond de carte OSM) |
| `$parch` | color | `#ece8de` | 100 % | 353 / 215 | Texte principal, pastille « play » |
| `$parch-soft` | color | `#ece8dec7` | 78 % | 144 / 78 | Texte secondaire, chapô, liens de nav |
| `$parch-mute` | color | `#ece8de85` | 52 % | 153 / 86 | Texte tertiaire, labels de tableau, mentions légales |
| `$parch-line` | color | `#ece8de1f` | 12 % | 9 fills + **157 strokes** | Filets, séparateurs, bordures de carte |
| `$ember` | color | `#e0552c` | 100 % | 220 / 118 | Accent principal : eyebrows, titres italiques, boutons pleins |
| `$ember-hot` | color | `#f06b3a` | 100 % | **0** | Déclaré mais **jamais utilisé** → réserver pour le `:hover` de `$ember` |
| `$feu` | color | `#ec6a32` | 100 % | 8 / 4 | Uniquement le mot « Feu » du logotype |
| `$acier` | color | `#b8c3cc` | 100 % | 8 / 4 | Uniquement le mot « Acier » du logotype |
| `$display` | string | `Cormorant Garamond` | — | 190 nœuds texte | Serif d'affichage : titres, noms, chiffres clés |
| `$body` | string | `Inter` | — | 251 nœuds texte | Sans-serif de labeur : paragraphes, libellés de boutons |
| `$eyebrow` | string | `Inter` | — | 250 nœuds texte | **Même police que `$body`** — token sémantique, pas typographique |

**Décision d'intégration :** `$body` et `$eyebrow` pointent tous deux vers Inter. Conserver les deux noms en CSS (`--font-body`, `--font-eyebrow`) reste utile sémantiquement, mais une seule famille est à charger. Deux graisses de `Cormorant Garamond` sont nécessaires (300 italic, 400/normal, 500) et trois d'Inter (400, 500, 600).

### 1.2 Couleurs littérales (hors variables) — voiles et surfaces

Aucune de ces valeurs n'est tokenisée dans la maquette. Elles constituent en pratique **trois familles** qu'il faut tokeniser à l'intégration.

**Famille A — voiles noirs sur photo (base `#08070a`, quasi-`$ink`)**

| Hex | Alpha | Occ. | Usage relevé |
|---|---|---|---|
| `#08070a52` | 32 % | 8 | Voile léger sur carte discipline (mobile) |
| `#08070a59` | 35 % | 2 | Voile carte « Combat viking » (desktop, plus claire que les autres) |
| `#08070a66` | 40 % | 8 | Voile sur vignette vidéo (mini-cours, interview) |
| `#08070a80` | 50 % | 20 | Bandeau bas des tuiles de galerie |
| `#08070aa6` | 65 % | 6 | Voile des cartes discipline desktop (3 cartes sur 4) |
| `#08070ac4` | 77 % | 8 | « Assise » : dégradé simulé en bas de carte discipline desktop |
| `#08070ac9` | 79 % | 8 | « Assise » de carte discipline mobile |
| `#08070ae0` | 88 % | 2 | Assise de la photo « Tournois » |

**Famille B — voiles noirs sur photo (base `#0a0908` = `$ink` exact)**

| Hex | Alpha | Occ. | Usage relevé |
|---|---|---|---|
| `#0a090859` | 35 % | 1 | Voile hero fiche prof (mobile) |
| `#0a090873` | 45 % | 1 | Voile photo club (mobile) |
| `#0a090880` | 50 % | 3 | Voile hero fiche arme (mobile), pastille « retour » |
| `#0a0908a6` | 65 % | 12 | Hero desktop V1, pastilles « Époque » et « Tag » |
| `#0a0908ab` | 67 % | 1 | Voile hero desktop **V2** (légèrement plus dense que V1) |
| `#0a0908b8` | 72 % | 2 | Voile hero mobile |
| `#0a0908cc` | 80 % | 9 | Assise photo club mobile, pastille de durée vidéo |
| `#0a0908d9` | 85 % | 3 | Assise hero de fiche (mobile), voile Manifesto |
| `#0a0908f2` | 95 % | 4 | Fond de la tab-bar mobile |
| `#0a0908f5` | 96 % | 1 | Fond du menu mobile ouvert |
| `#0a0908b3` | 70 % | 1 | Texte sur tuile `$ember` (V1 mobile uniquement) |

**Famille C — surfaces et bordures parchemin / ember**

| Hex | Alpha | Occ. | Usage relevé |
|---|---|---|---|
| `#ece8de06` | 2 % | 10 | Fond de carte prof neutre, carte « source » |
| `#ece8de08` | 3 % | 3 | Fond de tuile stat (V1 mobile) |
| `#ece8de14` | 8 % | 18 | Barres de placeholder de réponse d'interview |
| `#ece8de38` | 22 % | 6 fills + 39 strokes | Bordure de pastille, filets de la liste FAQ |
| `#ece8de47` | 28 % | 21 strokes | **Bordure de tous les boutons secondaires** |
| `#ece8de52` | 32 % | 3 | Filet décoratif court sous le logotype du hero |
| `#e0552c08` | 3 % | 2 | Fond de l'item FAQ **ouvert** |
| `#e0552c0d` | 5 % | 4 | Fond de la carte prof **mise en avant** (Gabriel) |
| `#e0552c14` | 8 % | 8 | Fond des pastilles d'icône rondes (mobile « Essayer ») |
| `#e0552c52` | 32 % | 4 strokes | Bordure de la carte prof mise en avant |

**Tokens supplémentaires recommandés** (à ajouter au thème CSS) :
`--veil-20 / 32 / 40 / 50 / 65 / 77 / 88` (famille A), `--surface-1: #ece8de06`, `--surface-2: #ece8de14`, `--line-strong: #ece8de38`, `--btn-border: #ece8de47`, `--ember-tint-3/5/8`, `--ember-border: #e0552c52`.

### 1.3 Familles typographiques réellement employées

| Famille | Nœuds texte | Graisses employées | Styles |
|---|---|---|---|
| `$display` — Cormorant Garamond | 190 | `300`, `normal`/`400`, `500`, + 15 nœuds sans `fontWeight` (⇒ défaut `400`) | roman + **italic** (utilisé sur 77 nœuds au total) |
| `$body` — Inter | 251 | `normal`/`400`, `500`, `600` | roman uniquement |
| `$eyebrow` — Inter | 250 | `normal`/`400`, `500`, `600` | roman uniquement |

Répartition globale des graisses : `normal` 234, `600` 220, `500` 189, `300` 33, absent 15.
Répartition des couleurs de texte : `$parch` 301, `$ember` 125, `$parch-mute` 119, `$parch-soft` 118, `$ink` 11, `$feu` 8, `$acier` 8, `#0a0908b3` 1.

### 1.4 Échelle typographique — desktop (V2, 256 nœuds texte)

**Titres — `$display` / Cormorant Garamond**

| px | Graisse / style | lh | Occ. | Emploi |
|---|---|---|---|---|
| 115 | 500 + 300 italic | 0.9 | 4 | Logotype géant du footer (« De Feu et d'Acier ») |
| 96 | 500 + 300 italic | 0.9 | 4 | Logotype du hero |
| 90 | (défaut 400) | 0.9 | 1 | H1 de fiche arme |
| 80 | (défaut 400) | 1 | 1 | H1 de fiche prof |
| 76 | 400 + 300 italic | 1 | 8 | **Titre de section, taille haute** (Disciplines, Rigueur, Galerie, FAQ) |
| 72 | 400 + 300 italic | 1 | 3 | Titre de section « Le club » (3 lignes) |
| 70 | 400 + 300 italic | 1 | 6 | **Titre de section, taille standard** (Profs, Nous rejoindre, Partenaires) |
| 66 | 400 + 300 italic | 1 | 2 | Titre de section « Tournois » (colonne étroite) |
| 44 | 400 | 1.1 | 2 | Titre de la bande CTA de fin de fiche |
| 42 | 400 / 500 / 300 italic | 1 / 1.1 | 10 | Nom d'arme sur carte discipline ; accroche des piliers « Nous rejoindre » |
| 40 | 400 italic | 1 | 3 | Titre de pilier (« Source. », « Geste. », « Salle. ») |
| 34 | 500 (+1 italic) | 1.1 | 7 | Nom de prof, nom de partenaire, « à Clermont-Ferrand » du hero |
| 30 | 400 | 1.1 | 1 | Titre de la carte source (« Des traités aux assauts. ») |
| 28 | 400 italic | 1.2 | 3 | Question d'interview |
| 26 | 500 | 1 | 3 | Chiffre clé (`04`, `03`, `FFAMHE`) |
| 24 | 400 | 1.1 | 1 | Accroche sur photo « Tournois » |
| 16 | 400 italic | 1.3 | 2 | Sous-titre de la bande CTA |
| 14.5 | 400 italic | — | 6 | Légende de tuile de galerie |

**Texte courant — `$body` / Inter**

| px | Graisse | lh | Occ. | Emploi |
|---|---|---|---|---|
| 19 | 400 | 1.6 | 1 | Chapô majeur (section « La rigueur ») |
| 18 | 400 | 1.4 | 1 | Sous-titre de fiche arme |
| 17 | 500 / 400 | 1.4 / 1.7 | 11 | Question de FAQ (500) ; corps de fiche (400) |
| 16 | 400 / 500 | 1.6 / 1.7 / — | 17 | **Paragraphe standard** (`lh 1.7`), horaire de créneau (500), titre de leçon (500, lh 1.3) |
| 15.5 | 500 / 400 | 1.4 | 2 | Valeur principale d'une ligne « fait » |
| 15 | 400 / 500 | 1.4 / 1.6 | 13 | Réponse FAQ, texte partenaire, cellule de tableau |
| 14.5 | 400 / 500 | 1.6 / — | 18 | Texte de pilier, liens de footer, adresse de carte |
| 13.5 | 500 / 400 | 1.4 / 1.6 | 4 | Spécialité de prof, légende du cadre traité |
| 13 | 400 / 600 | 1.4 / — | 9 | Sous-titre de carte discipline, baseline de footer, jour de créneau (600, ls 3.1) |
| 11.5 | 500 / 600 | — | 13 | **Libellé de bouton** (500 = secondaire, 600 = plein `$ember`) |
| 11 | 500 / 400 | — | 5 | Libellé du CTA du hero ; siècle sur carte discipline (ls 2) |
| 10.5 | 500 / 400 | — | 7 | Colonne « niveau » du tableau, séparateurs `/` et `·` |
| 9.5 | 600 | — | 4 | Durée de vidéo (`04:12`) |

**Sur-titres et micro-labels — `$eyebrow` / Inter (tous en capitales)**

| px | Graisse | letter-spacing | Occ. | Emploi |
|---|---|---|---|---|
| 12.5 | 600 | 3.5 | 18 | **Label de section** (`01` + `LES DISCIPLINES`) — le plus régulier |
| 11.5 | 600 | 4 | 1 | Sur-titre du hero (`ARTS MARTIAUX HISTORIQUES EUROPÉENS`) |
| 11 | 500 / 600 | 2.2 / 2.6 / 3.2 | 8 | Liens de la nav desktop, ligne d'info du hero, eyebrow de fiche prof |
| 10.5 | 600 / 500 | 1.8 → 3.4 | 39 | Époque de carte, discipline de prof, libellé de ligne « fait », lien texte fléché |
| 10 | 500 / 400 | 2.6 / 3 / 3.2 | 11 | Titres de colonne de footer, en-têtes de tableau (400, ls 3.2), mentions légales |
| 9.5 | 600 | 1.8 | 3 | Sous-libellé de leçon vidéo |
| 9 | 600 / 400 | 1.6 / 2 | 4 | Micro-label de chiffre clé (`ARMES`), mention `OPENSTREETMAP` |

### 1.5 Échelle typographique — mobile 390 (V2, 135 nœuds texte)

| Rôle | Desktop | Mobile 390 |
|---|---|---|
| Logotype hero | `$display` 96 | `$display` **62** |
| Logotype footer | `$display` 115 | `$display` **34** |
| Titre de section | `$display` 70–76 | `$display` **24–27** (ou 40 pour « 2 séances offertes ») |
| Titre de fiche | `$display` 80–90 | `$display` **36–42** |
| Nom d'arme sur carte | `$display` 42 | `$display` **27** |
| Nom de prof sur carte | `$display` 34 | `$display` **18** (prénom seul) |
| Question d'interview | `$display` 28 italic | `$display` **20** italic |
| Paragraphe | `$body` 16 / lh 1.7 | `$body` **14–14.5** / lh 1.6–1.65 |
| Sous-titre de carte | `$body` 13 | `$body` **11.5** |
| Label de section | `$eyebrow` 12.5 / ls 3.5 | `$eyebrow` **10.5** / ls 2.6 |
| Libellé de bouton | `$body` 11.5 | `$body` **11.5** (identique) |
| Libellé de tab-bar | — | `$eyebrow` **8** / ls 1.2 |

Le rapport desktop→mobile est d'environ **0.62 sur le display** et **0.88 sur le corps de texte**. Les libellés de boutons ne changent pas.

### 1.6 Espacements, rayons, filets, icônes

**Rayons (`cornerRadius`)** — quatre valeurs seulement :

| Valeur | Occ. | Emploi |
|---|---|---|
| `2` | 56 | Boutons, cartes prof desktop, photo club/tournois desktop, marqueur de tab actif |
| `3` | 39 | Cartes et photos **mobile**, vignettes vidéo, photos de fiche |
| `5` | 18 | Barres de placeholder d'interview |
| `99` | 49 | Pastilles rondes : « play », badges d'époque, durée, ronds d'icône, boutons sociaux |

Il n'y a **pas** de rayon supérieur à 3 sur les grands blocs : l'esthétique est délibérément anguleuse.

**Filets (`stroke`)** — épaisseur toujours 1 px, `strokeAlignment: inner` :

| Portée | Occ. | Traduction CSS |
|---|---|---|
| `{"bottom": 1}` | 82 | `border-bottom` |
| `{"top": 1}` | 72 | `border-top` — **séparateur inter-sections systématique** |
| `1` (toutes faces) | 61 | `border` |
| `{"left": 1}` | 4 | `border-left` (colonnes de piliers) |
| `{"top": 1, "bottom": 1}` | 2 | rangée de piliers desktop |

**Gouttières (`gap`) relevées :** 2, 3, 4, 5, 6, 8, 10, 11, 12, 14, 15, 16, 18, 20, 22, 24, 26, 34, 48, 56, 72, 100, 120.

**Paddings de section (desktop) :** `120/56/130/56` (le plus fréquent, 12 occurrences), `110/56/120/56` (Profs), `120/56/110/56` (Partenaires), `160/0/0/0` (Disciplines, dont la bande d'images est pleine largeur).
**Gouttière latérale desktop : 56 px. Gouttière latérale mobile : 22 px** (`pad=0/22` ou `pad=…/22`).
**Padding de section mobile :** `56/0/60/0` (standard), `44/0/48/0` (Partenaires), `40/22/28/22` (Footer).

**Icônes — bibliothèque `lucide` exclusivement (178 occurrences, 24 icônes distinctes)**

| Icône | Occ. | Emploi |
|---|---|---|
| `arrow-right` | 46 | Tous les boutons et liens fléchés |
| `diamond` | 34 | Séparateur du label de section (8 px desktop, 6 px mobile) |
| `plus` | 20 | Item FAQ fermé |
| `arrow-up-right` | 9 | Lien externe (Facebook, HEMA Ratings, menu mobile) |
| `play` | 8 | Pastille de lecture vidéo |
| `phone` | 6 | Tab-bar « Contact », ligne « fait » téléphone |
| `chevrons-right` | 6 | Indicateur « GLISSER » des carrousels mobiles |
| `swords` | 5 | Bouton central de la tab-bar, tuile stat |
| `chevron-down` | 4 | Scroll cue du hero |
| `map-pin` | 4 | Carte OSM, ligne « fait » lieu |
| `house` | 4 | Tab-bar « Accueil » |
| `sword` | 4 | Tab-bar « Armes » |
| `image` | 4 | Tab-bar « Photos » |
| `arrow-left` | 4 | Fil d'Ariane / bouton retour |
| `trophy` | 3 | Réseau « HEMA Ratings », tuile stat |
| `shield` | 3 | Réseau « FFAMHE », tuile stat |
| `minus` | 2 | Item FAQ **ouvert** |
| `menu` / `x` | 2 / 1 | Ouverture / fermeture du menu mobile |
| `clock` | 2 | Ligne « fait » horaires |
| `euro` | 2 | Ligne « fait » tarif |
| `navigation` | 2 | Bouton « Itinéraire » mobile |
| `facebook` | 2 | Bouton social |
| `users` | 1 | Tuile stat (V1 mobile) |

---

## 2. Frames racines

Neuf frames racines, posées de gauche à droite sur le canevas. **Les frames `V2 — …` (index 3 à 8) constituent la version de référence** : elles sont postérieures (posées à droite), plus complètes, et sont les seules à couvrir les pages de détail.

| # | Nom | Largeur | Hauteur | Fond | Layout | Position canevas | Statut |
|---|---|---|---|---|---|---|---|
| 0 | `Site desktop — nouvelles photos` | 1440 | auto | `$ink` | vertical, clip | @0,0 | **V1 — obsolète** (annexe §9) |
| 1 | `Mobile — 390` | 390 | auto | `$ink` | vertical, clip | @1640,0 | **V1 — obsolète** (annexe §9) |
| 2 | `Mobile — Menu ouvert` | 390 | 780 | `$ink` | none, clip | @2150,0 | **À reprendre** (état seul, pas de V2) — §8 |
| 3 | `V2 — Site desktop` | 1440 | auto | `$ink` | vertical, clip | @2700,0 | **RÉFÉRENCE desktop** — §3 |
| 4 | `V2 — Mobile 390` | 390 | auto | `$ink` | vertical, clip | @4340,0 | **RÉFÉRENCE mobile** — §4 |
| 5 | `V2 — Fiche arme (desktop)` | 1440 | auto | `$ink` | vertical, clip | @4930,0 | **RÉFÉRENCE** — §5 |
| 6 | `V2 — Fiche prof (desktop)` | 1440 | auto | `$ink` | vertical, clip | @6570,0 | **RÉFÉRENCE** — §6 |
| 7 | `V2 — Fiche arme (mobile)` | 390 | auto | `$ink` | vertical, clip | @8210,0 | **RÉFÉRENCE** — §5 |
| 8 | `V2 — Fiche prof (mobile)` | 390 | auto | `$ink` | vertical, clip | @8800,0 | **RÉFÉRENCE** — §6 |

**Il y a donc 4 gabarits de page** — accueil, fiche arme, fiche prof, et un état « menu mobile ouvert » — chacun décliné en desktop 1440 et mobile 390. Aucun point de rupture intermédiaire n'est maquetté : les breakpoints tablette sont à inventer côté intégration.

### 2.1 Rythme des sections de l'accueil (V2 desktop)

| Ordre | Section | Fond | Filet haut | Padding |
|---|---|---|---|---|
| 1 | `01 · Hero` | `$ink` + photo | — | plein écran 1440×900 |
| 2 | `02 · Disciplines` | `$ink` | oui | `160/0/0/0` |
| 3 | `03 · Profs` | `$ink` | oui | `110/56/120/56` |
| 4 | `04 · Le club` | **`$coal`** | oui | `120/56/130/56` |
| 5 | `05 · La rigueur` | `$ink` | **non** | `120/56/130/56` |
| 6 | `06 · Nous rejoindre` | **`$coal`** | oui | `120/56/130/56` |
| 7 | `07 · Tournois` | `$ink` | oui | `120/56/130/56` |
| 8 | `08 · Galerie` | **`$coal`** | oui | `120/56/130/56` |
| 9 | `09 · FAQ` | `$ink` | oui | `120/56/130/56` |
| 10 | `10 · Partenaires` | **`$coal`** | oui | `120/56/110/56` |
| 11 | `Footer` | `$ink` | oui | `80/56/32/56` |

L'alternance `$ink` / `$coal` est le mécanisme principal de séparation visuelle, doublé d'un filet `$parch-line` de 1 px en haut de chaque section. Seule `05 · La rigueur` n'a pas de filet haut (elle suit `04 · Le club` en `$coal`, le changement de fond suffit).

### 2.2 Rythme des sections de l'accueil (V2 mobile)

| Ordre | Section | Fond | Numéro affiché |
|---|---|---|---|
| 1 | `01 · Accueil (sans scroll)` | `$ink` + photo, 390×780 | — |
| 2 | `02 · Les armes` | `$ink` | `01` |
| 3 | `03 · Manifesto` | photo `treatise.jpg` + voile 85 %, 390×290 | — |
| 4 | `04 · Le club` | `$coal` | `02` |
| 5 | `05 · Les profs` | `$ink` | `03` |
| 6 | `06 · Essayer` | `$coal` | `04` |
| 7 | `07 · Galerie` | `$ink` | `05` |
| 8 | `08 · FAQ` | `$ink` | `06` |
| 9 | `09 · Partenaires` | `$coal` | — |
| 10 | `Footer` | `$ink` | — |

**La numérotation mobile diffère de la desktop** (mobile s'arrête à `06`, desktop va à `09`) parce que le mobile fusionne/supprime des sections : « La rigueur » devient le bloc « Manifesto » plein écran, « Tournois » disparaît, et « Nous rejoindre » devient « Essayer ». À arbitrer : soit les numéros deviennent dynamiques (index de la section rendue), soit ils sont figés en base de contenu.

---

## 3. Accueil desktop (référence) — `V2 — Site desktop`

Onze sections, largeur 1440, colonne verticale sans `gap` (chaque section porte son propre padding).

### 3.1 — Section « 01 · Hero »

**Layout** — frame 1440×900, `layout: none` : les cinq enfants sont positionnés en absolu et empilés dans l'ordre du DOM.

| Couche | Élément | Détail |
|---|---|---|
| 1 | `BG photo` | rect 1440×900 @0,0 — `maquette-assets/hero.jpg`, `object-fit: cover` |
| 2 | `Voile` | rect 1440×900 @0,0 — `#0a0908ab` (67 % de noir) |
| 3 | `Nav` | frame 1440×hug @0,0 — rangée, `justify: center`, `align: center`, `padding: 16px 40px` |
| 4 | `Contenu` | frame 1440×hug @0,**118** — colonne, `align: center` |
| 5 | `Scroll cue` | frame 1440×hug @0,**820** — colonne, `gap: 8`, `align: center` |

**Barre de navigation** — pas de logo dans la nav (le logo est dans le bloc central) : uniquement une frame `Liens`, rangée `gap: 34`, centrée. Six entrées, toutes `$eyebrow` 11 px / w500 / ls 2.2 / `$parch-soft` :
`DISCIPLINES`, `LES PROFS`, `LE CLUB`, `NOUS REJOINDRE`, `TOURNOIS`, `FAQ`.

**Bloc central `Contenu`** — la seule pile centrée du site, rythmée par des `esp` :
1. `Logo` 88×88 — `public/assets/logo.png`, `object-fit: cover`
2. `esp 26`
3. sur-titre `ARTS MARTIAUX HISTORIQUES EUROPÉENS` — `$eyebrow` 11.5 / w600 / **ls 4** / `$parch-soft`, centré, largeur bloquée 1328
4. `esp 20`
5. **Logotype `H1`** — colonne `gap: 8`, deux lignes centrées (voir pattern `Logotype`, §9.2)
6. `esp 28`
7. `Filet` — rect 60×1, `#ece8de52`
8. `esp 24`
9. `à Clermont-Ferrand` — `$display` 34 / w500 / **italic** / lh 1.1 / `$parch`
10. `esp 30`
11. `MAR · JEU 18H–22H  —  ESSAI OFFERT` — `$eyebrow` 11 / w500 / ls 2.6 / `$parch-mute` (deux espaces autour du tiret cadratin, à conserver)
12. `esp 24`
13. **Bouton `CTA`** — hug×50, `padding: 0 32`, `radius: 2`, bordure `#ece8de47` 1 px, libellé `VENIR ESSAYER` (`$body` 11 / w500 / ls 2.2 / `$parch`) + icône `arrow-right` 11 px

**Scroll cue** — icône `chevron-down` 22 px `$parch-mute` puis `DÉCOUVRIR LE CLUB` (`$eyebrow` 10 / w500 / ls 3 / `$parch-mute`).

**Images** : `maquette-assets/hero.jpg` (fond, cover), `public/assets/logo.png` (88×88).

**Conteneur** — `1440×900` fill=$ink — layout=none, clip

*Arbre exhaustif (15 nœuds texte) :*

- rect `BG photo` 1440×900 @0,0 img=`maquette-assets/hero.jpg` (mode fill)
- rect `Voile` 1440×900 @0,0 fill=#0a0908ab
- **frame** `Nav` 1440×hug @0,0 — layout=horizontal(défaut), justify=center, align=center, pad=16/40
  - **frame** `Liens` hug — layout=horizontal(défaut), gap=34, align=center
    - **T** « DISCIPLINES » — $eyebrow · 11px · w500 · ls 2.2 · $parch-soft
    - **T** « LES PROFS » — $eyebrow · 11px · w500 · ls 2.2 · $parch-soft
    - **T** « LE CLUB » — $eyebrow · 11px · w500 · ls 2.2 · $parch-soft
    - **T** « NOUS REJOINDRE » — $eyebrow · 11px · w500 · ls 2.2 · $parch-soft
    - **T** « TOURNOIS » — $eyebrow · 11px · w500 · ls 2.2 · $parch-soft
    - **T** « FAQ » — $eyebrow · 11px · w500 · ls 2.2 · $parch-soft
- **frame** `Contenu` 1440×hug @0,118 — layout=vertical, align=center
  - **frame** `Logo` 88×88 img=`public/assets/logo.png` (mode fill) — layout=none
  - **frame** `esp` 10×26 — layout=none
  - **T** « ARTS MARTIAUX HISTORIQUES EUROPÉENS » — $eyebrow · 11.5px · w600 · ls 4 · $parch-soft · align center · fixed-width 1328
  - **frame** `esp` 10×20 — layout=none
  - **frame** `H1` hug — layout=vertical, gap=8, align=center
    - **frame** `l1` hug — layout=horizontal(défaut), gap=24, justify=center, align=end
      - **T** « De » — $display · 96px · w500 · lh 0.9 · $parch
      - **T** « Feu » — $display · 96px · w500 · lh 0.9 · $feu
    - **frame** `l2` hug — layout=horizontal(défaut), gap=10, justify=center, align=end
      - **T** « et d' » — $display · 96px · w300 · italic · lh 0.9 · $parch
      - **T** « Acier » — $display · 96px · w500 · lh 0.9 · $acier
  - **frame** `esp` 10×28 — layout=none
  - rect `Filet` 60×1 fill=#ece8de52
  - **frame** `esp` 10×24 — layout=none
  - **T** « à Clermont-Ferrand » — $display · 34px · w500 · italic · lh 1.1 · $parch
  - **frame** `esp` 10×30 — layout=none
  - **T** « MAR · JEU 18H–22H  —  ESSAI OFFERT » — $eyebrow · 11px · w500 · ls 2.6 · $parch-mute
  - **frame** `esp` 10×24 — layout=none
  - **frame** `CTA` hug×50 — layout=horizontal(défaut), gap=10, justify=center, align=center, pad=0/32, radius=2, stroke=#ece8de47 1 inner
    - **T** « VENIR ESSAYER » — $body · 11px · w500 · ls 2.2 · $parch
    - *icon* `arrow-right` 11×11 fill=$parch
- **frame** `Scroll cue` 1440×hug @0,820 — layout=vertical, gap=8, align=center
  - *icon* `chevron-down` 22×22 fill=$parch-mute
  - **T** « DÉCOUVRIR LE CLUB » — $eyebrow · 10px · w500 · ls 3 · $parch-mute

### 3.2 — Section « 02 · Disciplines »

**Layout** — section pleine largeur, `$ink`, `padding-top: 160`, filet haut 1 px, deux blocs :
1. `Head container` — colonne, `padding: 0 56 64 56` (le contenu éditorial est dans la gouttière de 56)
2. `Strip disciplines` — rangée **1440 de large, sans padding, sans gap** : les quatre cartes sont collées bord à bord et débordent volontairement la gouttière.

**En-tête** — pattern `Label de section` (`01` + `diamond` + `LES DISCIPLINES`), `esp 56`, puis pattern `Section head` : titre à gauche / chapô à droite (`justify: space_between`, `align: end`).
- Titre sur deux lignes, `$display` 76, lh 1 : `Cinq armes,` (`$parch`, w400) puis `cinq grammaires.` (`$ember`, w300 **italic**)
- Chapô à droite, `$body` 16 / lh 1.7 / `$parch-mute`, **largeur bloquée à 460**

**Cartes discipline** — quatre frames 360×620, `layout: none`, `clip`. Structure identique :

| Couche | Élément | Détail |
|---|---|---|
| 1 | `Photo` | rect 360×620 @0,0, image `cover` |
| 2 | `Overlay` | rect 360×620 @0,0 — `#08070aa6` (65 %) **sauf carte Viking : `#08070a59` (35 %)** |
| 3 | `Assise` | rect 360×**250** @0,**370** — `#08070ac4`, simule un dégradé bas |
| 4 | `Era` | frame 288×hug @36,**40** — colonne `gap: 6` |
| 5 | `Bas de carte` | frame 288×hug @36,**y variable** — colonne `gap: 8` |

**Le `y` de `Bas de carte` diffère d'une carte à l'autre** : 448 pour Viking (qui porte un lien supplémentaire), 508 pour les trois autres. En intégration, ancrer le bloc en bas (`bottom: 36px`) plutôt que reproduire les `y` absolus.

| Carte | Image | Époque (`$ember`) | Siècles | Titre | Sous-titre |
|---|---|---|---|---|---|
| Combat viking | `disc-viking.jpg` | `HAUT MOYEN ÂGE` | `VIIIᵉ — XIᵉ S.` | `Combat viking` | `Bouclier & arme courte` |
| Épée longue | `disc-epee-longue.jpg` | `MÉDIÉVALE` | `XIVᵉ — XVᵉ S.` | `Épée longue` | `Arme emblématique des AMHE` |
| Messer | `disc-messer.jpg` | `MÉDIÉVALE` | `XVᵉ S.` | `Messer` | `Grand couteau de combat` |
| Rapière | `disc-rapiere.jpg` | `RENAISSANCE` | `XVIᵉ — XVIIᵉ S.` | `Rapière` | `Escrime de la Renaissance` |

**Seule la carte « Combat viking » possède le bloc `esp 12` + `div` (rect 36×1 `$ember`) + lien `DÉCOUVRIR L'ARME` + `arrow-right`.** C'est un état de maquettage partiel : ce lien doit exister sur les quatre cartes puisqu'il ouvre la fiche arme (§5).

**Écart à signaler :** le titre annonce « **Cinq** armes » mais la bande n'en contient que **quatre**. La cinquième (épée-bocle, mentionnée dans le créneau du jeudi et dans la spécialité de Ludwig Fort) n'a pas de carte. À trancher avec le client (voir §10).

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=160/0/0/0, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (22 nœuds texte) :*

- **frame** `Head container` fill×hug — layout=vertical, pad=0/56/64/56
  - **frame** `Label 1 · Les disciplines` fill×hug — layout=horizontal(défaut), gap=16, align=center, pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
    - **T** « 01 » — $eyebrow · 12.5px · w600 · ls 3.5 · $ember
    - *icon* `diamond` 8×8 fill=$ember
    - **T** « LES DISCIPLINES » — $eyebrow · 12.5px · w600 · ls 3.5 · $parch-soft
  - **frame** `esp` 10×56 — layout=none
  - **frame** `Section head` fill×hug — layout=horizontal(défaut), justify=space_between, align=end
    - **frame** `Titre` hug — layout=vertical, gap=4
      - **T** « Cinq armes, » — $display · 76px · lh 1 · $parch
      - **T** « cinq grammaires. » — $display · 76px · w300 · italic · lh 1 · $ember
    - **T** « On peut tout pratiquer, on peut se spécialiser. Chaque arme ouvre une école de pensée et un répertoire technique distincts, étalés sur plusieurs siècles. » — $body · 16px · wnormal · lh 1.7 · $parch-mute · fixed-width 460
- **frame** `Strip disciplines` 1440×hug — layout=horizontal(défaut)
  - **frame** `Carte Combat viking` 360×620 — layout=none, clip
    - rect `Photo` 360×620 @0,0 img=`maquette-assets/disc-viking.jpg` (mode fill)
    - rect `Overlay` 360×620 @0,0 fill=#08070a59
    - rect `Assise` 360×250 @0,370 fill=#08070ac4
    - **frame** `Era` 288×hug @36,40 — layout=vertical, gap=6
      - **frame** `Era l1` hug — layout=horizontal(défaut), gap=10, align=center
        - rect `tiret` 22×1 fill=$ember
        - **T** « HAUT MOYEN ÂGE » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « VIIIᵉ — XIᵉ S. » — $body · 11px · wnormal · ls 2 · $parch
    - **frame** `Bas de carte` 288×hug @36,448 — layout=vertical, gap=8
      - **T** « Combat viking » — $display · 42px · wnormal · lh 1 · $parch
      - **T** « Bouclier & arme courte » — $body · 13px · wnormal · lh 1.4 · $parch-soft · fixed-width 288
      - **frame** `esp` 10×12 — layout=none
      - rect `div` 36×1 fill=$ember
      - **frame** `Lien fiche` hug — layout=horizontal(défaut), gap=10, align=center
        - **T** « DÉCOUVRIR L'ARME » — $eyebrow · 10.5px · w600 · ls 1.8 · $parch
        - *icon* `arrow-right` 11×11 fill=$parch
  - **frame** `Carte Épée longue` 360×620 — layout=none, clip
    - rect `Photo` 360×620 @0,0 img=`maquette-assets/disc-epee-longue.jpg` (mode fill)
    - rect `Overlay` 360×620 @0,0 fill=#08070aa6
    - rect `Assise` 360×250 @0,370 fill=#08070ac4
    - **frame** `Era` 288×hug @36,40 — layout=vertical, gap=6
      - **frame** `Era l1` hug — layout=horizontal(défaut), gap=10, align=center
        - rect `tiret` 22×1 fill=$ember
        - **T** « MÉDIÉVALE » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « XIVᵉ — XVᵉ S. » — $body · 11px · wnormal · ls 2 · $parch
    - **frame** `Bas de carte` 288×hug @36,508 — layout=vertical, gap=8
      - **T** « Épée longue » — $display · 42px · wnormal · lh 1 · $parch
      - **T** « Arme emblématique des AMHE » — $body · 13px · wnormal · lh 1.4 · $parch-soft · fixed-width 288
  - **frame** `Carte Messer` 360×620 — layout=none, clip
    - rect `Photo` 360×620 @0,0 img=`maquette-assets/disc-messer.jpg` (mode fill)
    - rect `Overlay` 360×620 @0,0 fill=#08070aa6
    - rect `Assise` 360×250 @0,370 fill=#08070ac4
    - **frame** `Era` 288×hug @36,40 — layout=vertical, gap=6
      - **frame** `Era l1` hug — layout=horizontal(défaut), gap=10, align=center
        - rect `tiret` 22×1 fill=$ember
        - **T** « MÉDIÉVALE » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « XVᵉ S. » — $body · 11px · wnormal · ls 2 · $parch
    - **frame** `Bas de carte` 288×hug @36,508 — layout=vertical, gap=8
      - **T** « Messer » — $display · 42px · wnormal · lh 1 · $parch
      - **T** « Grand couteau de combat » — $body · 13px · wnormal · lh 1.4 · $parch-soft · fixed-width 288
  - **frame** `Carte Rapière` 360×620 — layout=none, clip
    - rect `Photo` 360×620 @0,0 img=`maquette-assets/disc-rapiere.jpg` (mode fill)
    - rect `Overlay` 360×620 @0,0 fill=#08070aa6
    - rect `Assise` 360×250 @0,370 fill=#08070ac4
    - **frame** `Era` 288×hug @36,40 — layout=vertical, gap=6
      - **frame** `Era l1` hug — layout=horizontal(défaut), gap=10, align=center
        - rect `tiret` 22×1 fill=$ember
        - **T** « RENAISSANCE » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « XVIᵉ — XVIIᵉ S. » — $body · 11px · wnormal · ls 2 · $parch
    - **frame** `Bas de carte` 288×hug @36,508 — layout=vertical, gap=8
      - **T** « Rapière » — $display · 42px · wnormal · lh 1 · $parch
      - **T** « Escrime de la Renaissance » — $body · 13px · wnormal · lh 1.4 · $parch-soft · fixed-width 288

### 3.3 — Section « 03 · Profs »

**Layout** — `$ink`, `padding: 110 56 120 56`, filet haut, colonne.

**En-tête** — `Label de section` (`02` · `LES PROFS`), `esp 56`, puis `Section head` avec `padding-bottom: 64` :
- Titre `$display` 70 / lh 1 : `Trois encadrants,` (`$parch`) / `trois écoles.` (`$ember` italic w300)
- Chapô `$body` 16 / lh 1.7 / `$parch-mute`, largeur 460

**`Grille profs`** — rangée `gap: 24`, trois cartes de **426.7** de large (= (1440 − 2×56 − 2×24) / 3).

**Carte prof — deux variantes :**

| | Variante neutre (Marie, Ludwig) | Variante mise en avant (Gabriel) |
|---|---|---|
| Fond | `#ece8de06` | `#e0552c0d` |
| Bordure | `$parch-line` 1 px | `#e0552c52` 1 px |
| Bandeau supérieur | — | rect `Ligne ember` 426.7×**2**, `$ember` |
| Couleur de la spécialité | `$parch-soft` | `$parch` |

Rayon 2, `clip`, colonne. Contenu commun :
1. `Photo` — frame carrée 426.7×426.7, image `cover`
2. `Contenu` — colonne `gap: 14`, `padding: 26 26 24 26`
   - discipline : `$eyebrow` 10.5 / w600 / ls 2.9 / `$ember`
   - nom : `$display` 34 / w500 / lh 1.1 / `$parch`
   - spécialité : `$body` 13.5 / w500 / lh 1.4, largeur 374.7
   - `sep` : rect 374.7×1, `$parch-line`
   - lien `LIRE L'INTERVIEW` (`$eyebrow` 10.5 / w600 / ls 1.8 / `$parch`) + `arrow-right` 10 px → **ouvre la fiche prof (§6)**

| Prof | Photo | Discipline | Spécialité |
|---|---|---|---|
| Marie Poignant | `public/assets/Marie.png` | `RAPIÈRE` | `Rapière française & italienne · bolonaise` |
| Gabriel Tardio | `public/assets/Gabriel.jpg` | `ÉPÉE LONGUE` | `Top 1 % mondial · épée longue acier` |
| Ludwig Fort | `public/assets/Ludwig.jpeg` | `MESSER · VIKING · BOCLE` | `Armes courtes & bouclier` |

**Note CMS :** la variante « mise en avant » est un booléen par prof (`highlight`), pas une position dans la grille. La grille est en trois colonnes fixes ; avec quatre profs ou plus il faudra une règle de reflow (grille auto-fit, minimum ~360 px).

**Écart V1→V2 :** en V1 chaque carte affichait une bio complète de 2 à 3 lignes ; la V2 l'a remplacée par le lien `LIRE L'INTERVIEW`. Les bios V1 restent une source de contenu utile (voir §8.1).

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=110/56/120/56, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (17 nœuds texte) :*

- **frame** `Label 2 · Les profs` fill×hug — layout=horizontal(défaut), gap=16, align=center, pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
  - **T** « 02 » — $eyebrow · 12.5px · w600 · ls 3.5 · $ember
  - *icon* `diamond` 8×8 fill=$ember
  - **T** « LES PROFS » — $eyebrow · 12.5px · w600 · ls 3.5 · $parch-soft
- **frame** `esp` 10×56 — layout=none
- **frame** `Section head` fill×hug — layout=horizontal(défaut), justify=space_between, align=end, pad=0/0/64/0
  - **frame** `Titre` hug — layout=vertical, gap=4
    - **T** « Trois encadrants, » — $display · 70px · lh 1 · $parch
    - **T** « trois écoles. » — $display · 70px · w300 · italic · lh 1 · $ember
  - **T** « Chaque arme a son référent. Tous transmettent à leur rythme, avec une pédagogie qui leur est propre et qui est issue d'une longue expérience de pratiquant, ainsi que de nombreuses heures de lecture des sources. » — $body · 16px · wnormal · lh 1.7 · $parch-mute · fixed-width 460
- **frame** `Grille profs` fill×hug — layout=horizontal(défaut), gap=24
  - **frame** `Prof Marie Poignant` 426.7×hug fill=#ece8de06 — layout=vertical, radius=2, stroke=$parch-line 1 inner, clip
    - **frame** `Photo` 426.7×426.7 img=`public/assets/Marie.png` (mode fill) — layout=none
    - **frame** `Contenu` fill×hug — layout=vertical, gap=14, pad=26/26/24/26
      - **T** « RAPIÈRE » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « Marie Poignant » — $display · 34px · w500 · lh 1.1 · $parch
      - **T** « Rapière française & italienne · bolonaise » — $body · 13.5px · w500 · lh 1.4 · $parch-soft · fixed-width 374.7
      - rect `sep` 374.7×1 fill=$parch-line
      - **frame** `Lien interview` hug — layout=horizontal(défaut), gap=8, align=center
        - **T** « LIRE L'INTERVIEW » — $eyebrow · 10.5px · w600 · ls 1.8 · $parch
        - *icon* `arrow-right` 10×10 fill=$parch
  - **frame** `Prof Gabriel Tardio` 426.7×hug fill=#e0552c0d — layout=vertical, radius=2, stroke=#e0552c52 1 inner, clip
    - rect `Ligne ember` 426.7×2 fill=$ember
    - **frame** `Photo` 426.7×426.7 img=`public/assets/Gabriel.jpg` (mode fill) — layout=none
    - **frame** `Contenu` fill×hug — layout=vertical, gap=14, pad=26/26/24/26
      - **T** « ÉPÉE LONGUE » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « Gabriel Tardio » — $display · 34px · w500 · lh 1.1 · $parch
      - **T** « Top 1 % mondial · épée longue acier » — $body · 13.5px · w500 · lh 1.4 · $parch · fixed-width 374.7
      - rect `sep` 374.7×1 fill=$parch-line
      - **frame** `Lien interview` hug — layout=horizontal(défaut), gap=8, align=center
        - **T** « LIRE L'INTERVIEW » — $eyebrow · 10.5px · w600 · ls 1.8 · $parch
        - *icon* `arrow-right` 10×10 fill=$parch
  - **frame** `Prof Ludwig Fort` 426.7×hug fill=#ece8de06 — layout=vertical, radius=2, stroke=$parch-line 1 inner, clip
    - **frame** `Photo` 426.7×426.7 img=`public/assets/Ludwig.jpeg` (mode fill) — layout=none
    - **frame** `Contenu` fill×hug — layout=vertical, gap=14, pad=26/26/24/26
      - **T** « MESSER · VIKING · BOCLE » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « Ludwig Fort » — $display · 34px · w500 · lh 1.1 · $parch
      - **T** « Armes courtes & bouclier » — $body · 13.5px · w500 · lh 1.4 · $parch-soft · fixed-width 374.7
      - rect `sep` 374.7×1 fill=$parch-line
      - **frame** `Lien interview` hug — layout=horizontal(défaut), gap=8, align=center
        - **T** « LIRE L'INTERVIEW » — $eyebrow · 10.5px · w600 · ls 1.8 · $parch
        - *icon* `arrow-right` 10×10 fill=$parch

### 3.4 — Section « 04 · Le club »

**Layout** — **`$coal`** (première rupture de fond), `padding: 120 56 130 56`, filet haut, colonne.

**En-tête** — `Label de section` (`03` · `LE CLUB`) puis `esp 56`.

**Bloc `Split`** — rangée `gap: 100`, `align: center`, `padding-bottom: 72` :
- Colonne gauche `Texte` **540** de large :
  - Titre **sur trois lignes**, `$display` 72 / lh 1, `gap: 4` : `Une bande` (`$parch`) / `d'escrimeurs,` (`$ember` w300 italic) / `une école.` (`$parch`)
  - `esp 28`
  - Paragraphe `$body` 16 / lh 1.7 / `$parch-mute`, largeur 520
  - `esp 26`
  - **`Chiffres clés`** : rangée `gap: 20`, `align: center`, `padding-top: 24`, filet haut. Trois stats séparées par des rect 1×26 `$parch-line`. Chaque stat est une rangée `gap: 10`, `align: end` : valeur `$display` 26 / w500 / lh 1 / `$parch` + label `$eyebrow` 9 / w600 / ls 1.6 / lh 1.4 / `$parch-mute`.
    `04 ARMES` · `03 ENCADRANTS` · `FFAMHE AFFILIATION`
- Colonne droite `Photo équipe` — frame **688×430**, `maquette-assets/club.jpg`, `cover`, rayon 2

**Bloc `Piliers`** — rangée pleine largeur, **filet haut ET bas**, trois colonnes de 442.7, `padding: 52 44` chacune, séparées par un `border-left` sur les 2ᵉ et 3ᵉ. Chaque pilier : rangée `Num` (`01` `$eyebrow` 10.5 / w600 / ls 3.4 / `$ember` + rect 28×1 `$ember`, `gap: 14`), titre `$display` 40 / **italic** / lh 1 / `$parch`, texte `$body` 14.5 / lh 1.6 / `$parch-mute` largeur 354.7. Colonne `gap: 18`.

| # | Titre | Texte |
|---|---|---|
| 01 | `Source.` | Étude des textes et traités historiques… |
| 02 | `Geste.` | Technique structurée par le drill… |
| 03 | `Salle.` | Un esprit d'école d'armes… |

**Images** : `maquette-assets/club.jpg`.

**Conteneur** — `fill×hug` fill=$coal — layout=vertical, pad=120/56/130/56, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (21 nœuds texte) :*

- **frame** `Label 3 · Le club` fill×hug — layout=horizontal(défaut), gap=16, align=center, pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
  - **T** « 03 » — $eyebrow · 12.5px · w600 · ls 3.5 · $ember
  - *icon* `diamond` 8×8 fill=$ember
  - **T** « LE CLUB » — $eyebrow · 12.5px · w600 · ls 3.5 · $parch-soft
- **frame** `esp` 10×56 — layout=none
- **frame** `Split` fill×hug — layout=horizontal(défaut), gap=100, align=center, pad=0/0/72/0
  - **frame** `Texte` 540×hug — layout=vertical
    - **frame** `Titre` hug — layout=vertical, gap=4
      - **T** « Une bande » — $display · 72px · lh 1 · $parch
      - **T** « d'escrimeurs, » — $display · 72px · w300 · italic · lh 1 · $ember
      - **T** « une école. » — $display · 72px · lh 1 · $parch
    - **frame** `esp` 10×28 — layout=none
    - **T** « Section AMHE de l'USAM Clermont-Ferrand, affiliée à la FFAMHE, le club accueille débutants et pratiquants confirmés, en loisir comme en compétition. Encadrement assuré par Gabriel Tardio. La salle est ouverte à toutes et tous, et l'on prend le temps de bien faire les choses. » — $body · 16px · wnormal · lh 1.7 · $parch-mute · fixed-width 520
    - **frame** `esp` 10×26 — layout=none
    - **frame** `Chiffres clés` hug — layout=horizontal(défaut), gap=20, align=center, pad=24/0/0/0, stroke=$parch-line {"top": 1} inner
      - **frame** `Stat 04` hug — layout=horizontal(défaut), gap=10, align=end
        - **T** « 04 » — $display · 26px · w500 · lh 1 · $parch
        - **T** « ARMES » — $eyebrow · 9px · w600 · ls 1.6 · lh 1.4 · $parch-mute
      - rect `sep` 1×26 fill=$parch-line
      - **frame** `Stat 03` hug — layout=horizontal(défaut), gap=10, align=end
        - **T** « 03 » — $display · 26px · w500 · lh 1 · $parch
        - **T** « ENCADRANTS » — $eyebrow · 9px · w600 · ls 1.6 · lh 1.4 · $parch-mute
      - rect `sep` 1×26 fill=$parch-line
      - **frame** `Stat FFAMHE` hug — layout=horizontal(défaut), gap=10, align=end
        - **T** « FFAMHE » — $display · 26px · w500 · lh 1 · $parch
        - **T** « AFFILIATION » — $eyebrow · 9px · w600 · ls 1.6 · lh 1.4 · $parch-mute
  - **frame** `Photo équipe` 688×430 img=`maquette-assets/club.jpg` (mode fill) — layout=none, radius=2
- **frame** `Piliers` fill×hug — layout=horizontal(défaut), stroke=$parch-line {"top": 1, "bottom": 1} inner
  - **frame** `Pilier Source` 442.7×hug — layout=vertical, gap=18, pad=52/44
    - **frame** `Num` hug — layout=horizontal(défaut), gap=14, align=center
      - **T** « 01 » — $eyebrow · 10.5px · w600 · ls 3.4 · $ember
      - rect `tiret` 28×1 fill=$ember
    - **T** « Source. » — $display · 40px · wnormal · italic · lh 1 · $parch
    - **T** « Étude des textes et traités historiques. Lecture, mise en pratique, reconstitution martiale des gestes anciens. » — $body · 14.5px · wnormal · lh 1.6 · $parch-mute · fixed-width 354.7
  - **frame** `Pilier Geste` 442.7×hug — layout=vertical, gap=18, pad=52/44, stroke=$parch-line {"left": 1} inner
    - **frame** `Num` hug — layout=horizontal(défaut), gap=14, align=center
      - **T** « 02 » — $eyebrow · 10.5px · w600 · ls 3.4 · $ember
      - rect `tiret` 28×1 fill=$ember
    - **T** « Geste. » — $display · 40px · wnormal · italic · lh 1 · $parch
    - **T** « Technique structurée par le drill, le sentiment du fer, et la mise en pratique en assaut libre. » — $body · 14.5px · wnormal · lh 1.6 · $parch-mute · fixed-width 354.7
  - **frame** `Pilier Salle` 442.7×hug — layout=vertical, gap=18, pad=52/44, stroke=$parch-line {"left": 1} inner
    - **frame** `Num` hug — layout=horizontal(défaut), gap=14, align=center
      - **T** « 03 » — $eyebrow · 10.5px · w600 · ls 3.4 · $ember
      - rect `tiret` 28×1 fill=$ember
    - **T** « Salle. » — $display · 40px · wnormal · italic · lh 1 · $parch
    - **T** « Un esprit d'école d'armes : exigence sportive, respect du partenaire, et progression à son rythme. » — $body · 14.5px · wnormal · lh 1.6 · $parch-mute · fixed-width 354.7

### 3.5 — Section « 05 · La rigueur »

**Layout** — `$ink`, `padding: 120 56 130 56`, **pas de filet haut** (le changement `$coal` → `$ink` suffit), colonne.

**En-tête** — `Label de section` (`04` · `LA RIGUEUR`), `esp 56`.

**Bloc `Split`** — rangée `gap: 120` (la plus large du site), sans alignement vertical particulier :
- Colonne gauche `Texte` **720** de large :
  - Titre `$display` 76 / lh 1 : `Le geste juste,` (`$parch`) / `avant le costume.` (`$ember` w300 italic)
  - `esp 48`
  - **Chapô de tête** `$body` **19** / lh 1.6 / `$parch-soft`, largeur 660 — c'est le seul texte à 19 px du site
  - `esp 32`
  - Paragraphe `$body` 16 / lh 1.7 / `$parch-mute`, largeur 600
- Colonne droite `Cadre traité` — **488** de large, fond `$char`, bordure `$parch-line` 1 px, colonne :
  - `Gravure` — frame 488×**517.3**, `public/assets/treatise.jpg`, `cover`
  - `Légende` — rangée `gap: 12`, `padding: 18 22 20 22`, filet haut : rect `tiret` 22×1 `$ember` + texte `$body` 13.5 / lh 1.6 / `$parch-mute`, largeur 410

**Images** : `public/assets/treatise.jpg` (le seul usage desktop de la gravure ; le mobile la réutilise en fond du Manifesto).

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=120/56/130/56

*Arbre exhaustif (7 nœuds texte) :*

- **frame** `Label 4 · La rigueur` fill×hug — layout=horizontal(défaut), gap=16, align=center, pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
  - **T** « 04 » — $eyebrow · 12.5px · w600 · ls 3.5 · $ember
  - *icon* `diamond` 8×8 fill=$ember
  - **T** « LA RIGUEUR » — $eyebrow · 12.5px · w600 · ls 3.5 · $parch-soft
- **frame** `esp` 10×56 — layout=none
- **frame** `Split` fill×hug — layout=horizontal(défaut), gap=120
  - **frame** `Texte` 720×hug — layout=vertical
    - **frame** `Titre` hug — layout=vertical, gap=4
      - **T** « Le geste juste, » — $display · 76px · lh 1 · $parch
      - **T** « avant le costume. » — $display · 76px · w300 · italic · lh 1 · $ember
    - **frame** `esp` 10×48 — layout=none
    - **T** « On étudie les arts martiaux européens à partir des traités et sources historiques, dans une pratique moderne, sportive et sécurisée. On y vient pour le geste, pas pour le costume. » — $body · 19px · wnormal · lh 1.6 · $parch-soft · fixed-width 660
    - **frame** `esp` 10×32 — layout=none
    - **T** « Ici on s'entraîne en tenue de sport, masque d'escrime et protections modernes, avec des armes d'entraînement adaptées à chaque discipline. Les sources sont a la base de notre travail, et nous poussons leur application jusqu'en assaut, avec différent niveau d'engagement. » — $body · 16px · wnormal · lh 1.7 · $parch-mute · fixed-width 600
  - **frame** `Cadre traité` 488×hug fill=$char — layout=vertical, stroke=$parch-line 1 inner
    - **frame** `Gravure` 488×517.3 img=`public/assets/treatise.jpg` (mode fill) — layout=none
    - **frame** `Légende` fill×hug — layout=horizontal(défaut), gap=12, pad=18/22/20/22, stroke=$parch-line {"top": 1} inner
      - rect `tiret` 22×1 fill=$ember
      - **T** « Planche extraite d'un traité d'escrime historique. Étude des gardes, des distances, du timing — des gestes que l'on cherche à comprendre, puis à éprouver dans la salle. » — $body · 13.5px · wnormal · lh 1.6 · $parch-mute · fixed-width 410

### 3.6 — Section « 06 · Nous rejoindre »

**Layout** — `$coal`, `padding: 120 56 130 56`, filet haut, colonne. C'est la section la plus dense : elle empile cinq blocs distincts.

**1. En-tête** — `Label de section` (`05` · `NOUS REJOINDRE`), `esp 56`, titre `$display` 70 / lh 1 sur deux lignes : `Une lame, un masque,` / `et l'envie de bien faire.` (`$ember` w300 italic), `esp 56`.

**2. Bloc `PRATIQUE`** — sur-titre `$eyebrow` 10.5 / w600 / **ls 3.4** / `$ember`, `esp 18`, puis `Faits pratique` : colonne à filet haut, chaque ligne étant un pattern `Ligne fait` — rangée `gap: 24`, `padding: 18 0`, filet bas ; label à gauche **largeur bloquée 200** (`$eyebrow` 10.5 / w600 / ls 2.7 / `$ember`), valeurs à droite en colonne `gap: 4`.

| Label | Valeur 1 (`$body` 15.5) | Valeur 2 (`$body` 15 / `$parch-soft`) |
|---|---|---|
| `LIEU` | `Gymnase Robert Pras` (w500) | `3 rue Jean Monnet · 63100 Clermont-Ferrand` |
| `CONTACT` | `amhe63.dfda@gmail.com` (w400) | `06 61 28 65 11` |

**3. Bloc `CRÉNEAUX HEBDOMADAIRES`** — même sur-titre `$ember` ls 3.4, `esp 18`, puis un **vrai tableau** : colonne à filet haut.
- Ligne d'en-tête : `padding: 18 0`, `gap: 24`, filet bas, quatre cellules `$eyebrow` 10 / w400 / ls 3.2 / `$parch-mute` de largeurs **80 / 220 / 588.3 / 367.7** : `JOUR`, `HORAIRE`, `DISCIPLINE`, `NIVEAU`
- Lignes de données : `padding: 26 0`, mêmes largeurs de colonne, filet bas

| JOUR (`$body` 13 w600 ls 3.1 `$ember`) | HORAIRE (`$body` 16 w500 `$parch`) | DISCIPLINE (`$body` 15 lh 1.4 `$parch`) | NIVEAU (`$body` 10.5 w500 ls 2.7 `$parch-mute`) |
|---|---|---|---|
| `MAR` | `18h00 — 20h00` | `Épée longue · rapière · messer · viking` | `TOUS NIVEAUX` |
| `JEU` | `18h00 — 20h00` | `Pratique libre` | `SANS ENCADRANT` |
| `JEU` | `20h00 — 22h00` | `Épée longue · épée-bocle` | `TOUS NIVEAUX` |

**4. Bloc `Piliers rejoindre`** — `esp 40`, colonne à filet haut, deux rangées `gap: 56`, `padding: 48 0 44 0`, filet bas. À gauche un label largeur 200 (`$eyebrow` 10.5 / w500 / ls 2.9 / `$parch-mute`), à droite une colonne `gap: 10`.

- **Pilier 01 — label `01 · 01 · VIENS ESSAYER`** *(la duplication « 01 · 01 » est une coquille de la maquette)*
  - Accroche `hl` : rangée `align: end` de trois fragments `$display` 42 / lh 1.1 — `Les deux premieres séances sont` (`$parch`) + `gratuites` (`$ember` w300 italic) + `, alors pourquoi ne pas essayer ?` (`$parch`). *La virgule initiale du troisième fragment est significative.*
  - `esp 10`, deux paragraphes `$body` 16 / lh 1.6 / `$parch-soft`, largeur 760
  - `esp 8` puis **`Carte OSM`** — frame 760, rayon 2, bordure `$parch-line` : `Fond carte` 760×230 `$char` avec une icône `map-pin` 34 px `$ember` positionnée @363,98 (placeholder de carte), puis `Légende carte` (rangée `space_between`, `padding: 14 18`, filet haut) : adresse en colonne `gap: 3` (`$body` 14.5 w500 + `$body` 13 `$parch-mute`) et mention `OPENSTREETMAP` (`$eyebrow` 9 / ls 2 / `$parch-mute`)
  - `esp 16` puis bouton secondaire `ITINÉRAIRE` (hug×44)
- **Pilier 02 — label `02 · 02 · POUR CONTINUER`** *(même coquille)*
  - Accroche `hl` : `85 €` (`$display` 42 w500) + `par an, un masque, des gants coqués.` + `C'est tout.` (`$ember` w300 italic)
  - `esp 10`, deux paragraphes `$body` 16 / lh 1.6 / `$parch-soft`, largeur 760
  - `esp 16` puis **bouton primaire** `ADHÉRER · HELLOASSO` — fond `$ember`, texte `$ink` `$body` 11.5 / **w600** / ls 1.8, icône `arrow-right` `$ink`, hug×44, rayon 2

**Aucune image bitmap dans cette section** — la carte est un placeholder graphique.

**Conteneur** — `fill×hug` fill=$coal — layout=vertical, pad=120/56/130/56, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (45 nœuds texte) :*

- **frame** `Label 5 · Nous rejoindre` fill×hug — layout=horizontal(défaut), gap=16, align=center, pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
  - **T** « 05 » — $eyebrow · 12.5px · w600 · ls 3.5 · $ember
  - *icon* `diamond` 8×8 fill=$ember
  - **T** « NOUS REJOINDRE » — $eyebrow · 12.5px · w600 · ls 3.5 · $parch-soft
- **frame** `esp` 10×56 — layout=none
- **frame** `Titre` hug — layout=vertical, gap=4
  - **T** « Une lame, un masque, » — $display · 70px · lh 1 · $parch
  - **T** « et l'envie de bien faire. » — $display · 70px · w300 · italic · lh 1 · $ember
- **frame** `esp` 10×56 — layout=none
- **T** « PRATIQUE » — $eyebrow · 10.5px · w600 · ls 3.4 · $ember
- **frame** `esp` 10×18 — layout=none
- **frame** `Faits pratique` fill×hug — layout=vertical, stroke=$parch-line {"top": 1} inner
  - **frame** `Fait Lieu` fill×hug — layout=horizontal(défaut), gap=24, pad=18/0, stroke=$parch-line {"bottom": 1} inner
    - **T** « LIEU » — $eyebrow · 10.5px · w600 · ls 2.7 · $ember · fixed-width 200
    - **frame** `Valeur` fill×hug — layout=vertical, gap=4
      - **T** « Gymnase Robert Pras » — $body · 15.5px · w500 · lh 1.4 · $parch
      - **T** « 3 rue Jean Monnet · 63100 Clermont-Ferrand » — $body · 15px · wnormal · lh 1.4 · $parch-soft
  - **frame** `Fait Contact` fill×hug — layout=horizontal(défaut), gap=24, pad=18/0, stroke=$parch-line {"bottom": 1} inner
    - **T** « CONTACT » — $eyebrow · 10.5px · w600 · ls 2.7 · $ember · fixed-width 200
    - **frame** `Valeur` fill×hug — layout=vertical, gap=4
      - **T** « amhe63.dfda@gmail.com » — $body · 15.5px · wnormal · lh 1.4 · $parch
      - **T** « 06 61 28 65 11 » — $body · 15px · wnormal · lh 1.4 · $parch-soft
- **frame** `esp` 10×24 — layout=none
- **T** « CRÉNEAUX HEBDOMADAIRES » — $eyebrow · 10.5px · w600 · ls 3.4 · $ember
- **frame** `esp` 10×18 — layout=none
- **frame** `Tableau` fill×hug — layout=vertical, stroke=$parch-line {"top": 1} inner
  - **frame** `En-têtes` fill×hug — layout=horizontal(défaut), gap=24, align=center, pad=18/0, stroke=$parch-line {"bottom": 1} inner
    - **T** « JOUR » — $eyebrow · 10px · wnormal · ls 3.2 · $parch-mute · fixed-width 80
    - **T** « HORAIRE » — $eyebrow · 10px · wnormal · ls 3.2 · $parch-mute · fixed-width 220
    - **T** « DISCIPLINE » — $eyebrow · 10px · wnormal · ls 3.2 · $parch-mute · fixed-width 588.3
    - **T** « NIVEAU » — $eyebrow · 10px · wnormal · ls 3.2 · $parch-mute · fixed-width 367.7
  - **frame** `Créneau Mar` fill×hug — layout=horizontal(défaut), gap=24, align=center, pad=26/0, stroke=$parch-line {"bottom": 1} inner
    - **T** « MAR » — $body · 13px · w600 · ls 3.1 · $ember · fixed-width 80
    - **T** « 18h00 — 20h00 » — $body · 16px · w500 · $parch · fixed-width 220
    - **T** « Épée longue · rapière · messer · viking » — $body · 15px · wnormal · lh 1.4 · $parch · fixed-width 588.3
    - **T** « TOUS NIVEAUX » — $body · 10.5px · w500 · ls 2.7 · $parch-mute · fixed-width 367.7
  - **frame** `Créneau Jeu` fill×hug — layout=horizontal(défaut), gap=24, align=center, pad=26/0, stroke=$parch-line {"bottom": 1} inner
    - **T** « JEU » — $body · 13px · w600 · ls 3.1 · $ember · fixed-width 80
    - **T** « 18h00 — 20h00 » — $body · 16px · w500 · $parch · fixed-width 220
    - **T** « Pratique libre » — $body · 15px · wnormal · lh 1.4 · $parch · fixed-width 588.3
    - **T** « SANS ENCADRANT » — $body · 10.5px · w500 · ls 2.7 · $parch-mute · fixed-width 367.7
  - **frame** `Créneau Jeu` fill×hug — layout=horizontal(défaut), gap=24, align=center, pad=26/0, stroke=$parch-line {"bottom": 1} inner
    - **T** « JEU » — $body · 13px · w600 · ls 3.1 · $ember · fixed-width 80
    - **T** « 20h00 — 22h00 » — $body · 16px · w500 · $parch · fixed-width 220
    - **T** « Épée longue · épée-bocle » — $body · 15px · wnormal · lh 1.4 · $parch · fixed-width 588.3
    - **T** « TOUS NIVEAUX » — $body · 10.5px · w500 · ls 2.7 · $parch-mute · fixed-width 367.7
- **frame** `esp` 10×40 — layout=none
- **frame** `Piliers rejoindre` fill×hug — layout=vertical, stroke=$parch-line {"top": 1} inner
  - **frame** `Pilier 01` fill×hug — layout=horizontal(défaut), gap=56, pad=48/0/44/0, stroke=$parch-line {"bottom": 1} inner
    - **T** « 01 · 01 · VIENS ESSAYER » — $eyebrow · 10.5px · w500 · ls 2.9 · $parch-mute · fixed-width 220
    - **frame** `Contenu` fill×hug — layout=vertical, gap=10
      - **frame** `hl` hug — layout=horizontal(défaut), align=end
        - **T** « Les deux premieres séances sont » — $display · 42px · lh 1.1 · $parch
        - **T** « gratuites » — $display · 42px · w300 · italic · lh 1.1 · $ember
        - **T** « , alors pourquoi ne pas essayer ? » — $display · 42px · lh 1.1 · $parch
      - **frame** `esp` 10×10 — layout=none
      - **T** « Peu importe que tu n'aies jamais fait de sport, que tu sortes d'un autre art martial ou que tu n'aies rien touché depuis des années — on t'accueille. Tu n'as besoin de rien apporter : on te prête le masque, et l'arme que tu veux tester (épée longue, sabre, dague, rapière…). » — $body · 16px · wnormal · lh 1.6 · $parch-soft · fixed-width 760
      - **T** « Aucun engagement, aucun frais. Viens, ça nous fait plaisir. » — $body · 16px · wnormal · lh 1.6 · $parch-soft · fixed-width 760
      - **frame** `esp` 10×8 — layout=none
      - **frame** `Carte OSM` 760×hug — layout=vertical, radius=2, stroke=$parch-line 1 inner
        - **frame** `Fond carte` 760×230 fill=$char — layout=none, clip
          - *icon* `map-pin` 34×34 fill=$ember @363,98
        - **frame** `Légende carte` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=14/18, stroke=$parch-line {"top": 1} inner
          - **frame** `Adr` hug — layout=vertical, gap=3
            - **T** « Gymnase Robert Pras » — $body · 14.5px · w500 · $parch
            - **T** « 3 rue Jean Monnet · 63100 Clermont-Ferrand » — $body · 13px · wnormal · $parch-mute
          - **T** « OPENSTREETMAP » — $eyebrow · 9px · wnormal · ls 2 · $parch-mute
      - **frame** `esp` 10×16 — layout=none
      - **frame** `Btn Itinéraire` hug×44 — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/22, radius=2, stroke=#ece8de47 1 inner
        - **T** « ITINÉRAIRE » — $body · 11.5px · w500 · ls 1.8 · $parch
        - *icon* `arrow-right` 11×11 fill=$parch
  - **frame** `Pilier 02` fill×hug — layout=horizontal(défaut), gap=56, pad=48/0/44/0, stroke=$parch-line {"bottom": 1} inner
    - **T** « 02 · 02 · POUR CONTINUER » — $eyebrow · 10.5px · w500 · ls 2.9 · $parch-mute · fixed-width 220
    - **frame** `Contenu` fill×hug — layout=vertical, gap=10
      - **frame** `hl` hug — layout=horizontal(défaut), align=end
        - **T** « 85 € » — $display · 42px · w500 · lh 1.1 · $parch
        - **T** « par an, un masque, des gants coqués. » — $display · 42px · lh 1.1 · $parch
        - **T** « C'est tout. » — $display · 42px · w300 · italic · lh 1.1 · $ember
      - **frame** `esp` 10×10 — layout=none
      - **T** « Si tu décides de rester pour l'année, l'adhésion c'est 85 € — soit littéralement moins qu'un Netflix. À ça, tu ajoutes les deux seules pièces à te procurer pour les séances régulières : un masque d'escrime standard et des gants coqués. » — $body · 16px · wnormal · lh 1.6 · $parch-soft · fixed-width 760
      - **T** « Le reste — vestes, protections, armes — on en parle au fil du temps, souvent à prix d'ami chez nos partenaires. » — $body · 16px · wnormal · lh 1.6 · $parch-soft · fixed-width 760
      - **frame** `esp` 10×16 — layout=none
      - **frame** `Btn Adhérer · HelloAsso` hug×44 fill=$ember — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/22, radius=2
        - **T** « ADHÉRER · HELLOASSO » — $body · 11.5px · w600 · ls 1.8 · $ink
        - *icon* `arrow-right` 11×11 fill=$ink

### 3.7 — Section « 07 · Tournois »

**Layout** — `$ink`, `padding: 120 56 130 56`, filet haut, colonne.

**En-tête** — `Label de section` (`06` · `TOURNOIS & SAISON`), `esp 56`.

**Bloc `Split`** — rangée `gap: 56`, photo à **gauche** (inversion par rapport à « Le club ») :
- `Photo tournois` — frame **489.2×652.3**, rayon 2, `clip`, `layout: none` :
  1. rect `img` — `maquette-assets/tournois.jpg`, `cover`
  2. rect `voile` 489.2×**326.2** @0,326.2 — `#08070ae0` (88 %), soit exactement la moitié basse
  3. `Overlay texte` — frame 433.2×hug @28,502.3, colonne `gap: 14` : eyebrow (`diamond` 6 px `$ember` + `COMPÉTITEURS`) puis accroche `$display` 24 / lh 1.1 / `$parch`, largeur 433.2
- `Contenu` — colonne `fill` :
  - Titre `$display` **66** / lh 1 : `Saison` / `de compétition.` (`$ember` w300 italic)
  - `esp 28`, paragraphe `$body` 16 / lh 1.7 / **`$parch-soft`**, largeur 580
  - `esp 36`, `Faits` : colonne à filet haut, trois patterns `Ligne fait` (label largeur 200 `$ember`, valeur `$body` 15 / lh 1.4 / `$parch` en `fill`)

| Label | Valeur |
|---|---|
| `CIRCUIT FFAMHE` | `épée longue, épée de coté, rapière — open / débutant / féminin` |
| `INTERCLUBS & STAGES` | `échanges réguliers avec d'autres clubs AMHE` |
| `LOISIR POSSIBLE` | `la compétition n'est jamais obligatoire` |

  - `esp 40`, `CTAs` : rangée `gap: 16`, deux boutons hug×44 rayon 2
    - `RÉSULTATS HEMA RATINGS` — **avec** bordure `#ece8de47`
    - `CALENDRIER FFAMHE` — **sans bordure ni fond** : bouton fantôme. Incohérence probable de la maquette, à harmoniser (voir §10).

**Images** : `maquette-assets/tournois.jpg`.

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=120/56/130/56, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (15 nœuds texte) :*

- **frame** `Label 6 · Tournois & saison` fill×hug — layout=horizontal(défaut), gap=16, align=center, pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
  - **T** « 06 » — $eyebrow · 12.5px · w600 · ls 3.5 · $ember
  - *icon* `diamond` 8×8 fill=$ember
  - **T** « TOURNOIS & SAISON » — $eyebrow · 12.5px · w600 · ls 3.5 · $parch-soft
- **frame** `esp` 10×56 — layout=none
- **frame** `Split` fill×hug — layout=horizontal(défaut), gap=56
  - **frame** `Photo tournois` 489.2×652.3 — layout=none, radius=2, clip
    - rect `img` 489.2×652.3 @0,0 img=`maquette-assets/tournois.jpg` (mode fill)
    - rect `voile` 489.2×326.2 @0,326.2 fill=#08070ae0
    - **frame** `Overlay texte` 433.2×hug @28,502.3 — layout=vertical, gap=14
      - **frame** `Eyebrow` hug — layout=horizontal(défaut), gap=10, align=center
        - *icon* `diamond` 6×6 fill=$ember
        - **T** « COMPÉTITEURS » — $eyebrow · 10.5px · w600 · ls 2.9 · $parch-soft
      - **T** « Plusieurs membres engagés en compétition, référencés sur HEMA Ratings. » — $display · 24px · wnormal · lh 1.1 · $parch · fixed-width 433.2
  - **frame** `Contenu` fill×hug — layout=vertical
    - **frame** `Titre` hug — layout=vertical, gap=4
      - **T** « Saison » — $display · 66px · lh 1 · $parch
      - **T** « de compétition. » — $display · 66px · w300 · italic · lh 1 · $ember
    - **frame** `esp` 10×28 — layout=none
    - **T** « Le club est présent sur le circuit FFAMHE et référencé sur HEMA Ratings. La compétition reste un choix : on peut pratiquer en loisir ou viser les tournois, à son rythme. » — $body · 16px · wnormal · lh 1.7 · $parch-soft · fixed-width 580
    - **frame** `esp` 10×36 — layout=none
    - **frame** `Faits` fill×hug — layout=vertical, stroke=$parch-line {"top": 1} inner
      - **frame** `Fait Circuit FFAMHE` fill×hug — layout=horizontal(défaut), gap=24, pad=18/0, stroke=$parch-line {"bottom": 1} inner
        - **T** « CIRCUIT FFAMHE » — $eyebrow · 10.5px · w600 · ls 2.7 · $ember · fixed-width 200
        - **frame** `Valeur` fill×hug — layout=vertical, gap=4
          - **T** « épée longue, épée de coté, rapière — open / débutant / féminin » — $body · 15px · wnormal · lh 1.4 · $parch · fixed-width fill_container
      - **frame** `Fait Interclubs & stages` fill×hug — layout=horizontal(défaut), gap=24, pad=18/0, stroke=$parch-line {"bottom": 1} inner
        - **T** « INTERCLUBS & STAGES » — $eyebrow · 10.5px · w600 · ls 2.7 · $ember · fixed-width 200
        - **frame** `Valeur` fill×hug — layout=vertical, gap=4
          - **T** « échanges réguliers avec d'autres clubs AMHE » — $body · 15px · wnormal · lh 1.4 · $parch · fixed-width fill_container
      - **frame** `Fait Loisir possible` fill×hug — layout=horizontal(défaut), gap=24, pad=18/0, stroke=$parch-line {"bottom": 1} inner
        - **T** « LOISIR POSSIBLE » — $eyebrow · 10.5px · w600 · ls 2.7 · $ember · fixed-width 200
        - **frame** `Valeur` fill×hug — layout=vertical, gap=4
          - **T** « la compétition n'est jamais obligatoire » — $body · 15px · wnormal · lh 1.4 · $parch · fixed-width fill_container
    - **frame** `esp` 10×40 — layout=none
    - **frame** `CTAs` hug — layout=horizontal(défaut), gap=16
      - **frame** `Btn Résultats HEMA Ratings` hug×44 — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/22, radius=2, stroke=#ece8de47 1 inner
        - **T** « RÉSULTATS HEMA RATINGS » — $body · 11.5px · w500 · ls 1.8 · $parch
        - *icon* `arrow-right` 11×11 fill=$parch
      - **frame** `Btn Calendrier FFAMHE` hug×44 — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/22, radius=2
        - **T** « CALENDRIER FFAMHE » — $body · 11.5px · w500 · ls 1.8 · $parch
        - *icon* `arrow-right` 11×11 fill=$parch

### 3.8 — Section « 08 · Galerie »

**Layout** — `$coal`, `padding: 120 56 130 56`, filet haut, colonne.

**En-tête** — `Label de section` (`07` · `GALERIE`), `esp 56`, puis `Section head` (`space_between`, `align: end`, `padding-bottom: 64`) :
- Titre `$display` 76 / lh 1 : `Quelques` / `images de salle.` (`$ember` w300 italic)
- **À droite, un bouton et non un chapô** : `SUIVRE SUR FACEBOOK`, hug×44, bordure `#ece8de47`, rayon 2

**`Grille galerie`** — frame `fill`×**1192**, `layout: none` : mosaïque à positions absolues, **pas une grille CSS régulière**. Coordonnées relevées (origine en haut à gauche du bloc, largeur utile 1328) :

| Tuile | Position | Taille | Image |
|---|---|---|---|
| `À l'assaut` | @0,0 | 769.7×504 | `galerie-1.jpg` |
| `Médiévale de Montferrand` | @781.7,0 | 546.3×332 | `galerie-2.jpg` |
| `Au contact` | @781.7,344 | 546.3×332 | `galerie-3.jpg` |
| `En garde` | @0,688 | 434.7×504 | `galerie-4.jpg` |
| `Combat viking` | @446.7,688 | 434.7×504 | `galerie-5.jpg` |
| `Le duel` | @893.3,688 | 434.7×504 | `galerie-6.jpg` |

Gouttière constante de **12 px** entre les tuiles (781.7 − 769.7 = 12 ; 446.7 − 434.7 = 12 ; 688 − 676 = 12).

**Structure d'une tuile** (`layout: none`, `clip`, **rayon 0**) :
1. rect `img` plein cadre, `cover`
2. rect `voile bas` — largeur pleine × **64** de haut, ancré en bas, `#08070a80`
3. texte de légende — `$display` 14.5 / **italic** / `$parch`, positionné @16, (hauteur − 36)

**Équivalent CSS** : `grid-template-columns: repeat(12, 1fr)` avec `gap: 12px` reproduit la mosaïque de façon fluide — colonnes 1-7 / 8-12 en haut, puis trois blocs de 4 colonnes en bas.

**Images** : `galerie-1` à `galerie-6.jpg` (toutes dans `maquette-assets/`).

**Conteneur** — `fill×hug` fill=$coal — layout=vertical, pad=120/56/130/56, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (11 nœuds texte) :*

- **frame** `Label 7 · Galerie` fill×hug — layout=horizontal(défaut), gap=16, align=center, pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
  - **T** « 07 » — $eyebrow · 12.5px · w600 · ls 3.5 · $ember
  - *icon* `diamond` 8×8 fill=$ember
  - **T** « GALERIE » — $eyebrow · 12.5px · w600 · ls 3.5 · $parch-soft
- **frame** `esp` 10×56 — layout=none
- **frame** `Section head` fill×hug — layout=horizontal(défaut), justify=space_between, align=end, pad=0/0/64/0
  - **frame** `Titre` hug — layout=vertical, gap=4
    - **T** « Quelques » — $display · 76px · lh 1 · $parch
    - **T** « images de salle. » — $display · 76px · w300 · italic · lh 1 · $ember
  - **frame** `Btn Suivre sur Facebook` hug×44 — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/22, radius=2, stroke=#ece8de47 1 inner
    - **T** « SUIVRE SUR FACEBOOK » — $body · 11.5px · w500 · ls 1.8 · $parch
    - *icon* `arrow-right` 11×11 fill=$parch
- **frame** `Grille galerie` fill×1192 — layout=none
  - **frame** `Tuile À l'assaut` 769.7×504 @0,0 — layout=none, clip
    - rect `img` 769.7×504 @0,0 img=`maquette-assets/galerie-1.jpg` (mode fill)
    - rect `voile bas` 769.7×64 @0,440 fill=#08070a80
    - **T** « À l'assaut » — $display · 14.5px · wnormal · italic · $parch @16,468
  - **frame** `Tuile Médiévale de Montferrand` 546.3×332 @781.7,0 — layout=none, clip
    - rect `img` 546.3×332 @0,0 img=`maquette-assets/galerie-2.jpg` (mode fill)
    - rect `voile bas` 546.3×64 @0,268 fill=#08070a80
    - **T** « Médiévale de Montferrand » — $display · 14.5px · wnormal · italic · $parch @16,296
  - **frame** `Tuile Au contact` 546.3×332 @781.7,344 — layout=none, clip
    - rect `img` 546.3×332 @0,0 img=`maquette-assets/galerie-3.jpg` (mode fill)
    - rect `voile bas` 546.3×64 @0,268 fill=#08070a80
    - **T** « Au contact » — $display · 14.5px · wnormal · italic · $parch @16,296
  - **frame** `Tuile En garde` 434.7×504 @0,688 — layout=none, clip
    - rect `img` 434.7×504 @0,0 img=`maquette-assets/galerie-4.jpg` (mode fill)
    - rect `voile bas` 434.7×64 @0,440 fill=#08070a80
    - **T** « En garde » — $display · 14.5px · wnormal · italic · $parch @16,468
  - **frame** `Tuile Combat viking` 434.7×504 @446.7,688 — layout=none, clip
    - rect `img` 434.7×504 @0,0 img=`maquette-assets/galerie-5.jpg` (mode fill)
    - rect `voile bas` 434.7×64 @0,440 fill=#08070a80
    - **T** « Combat viking » — $display · 14.5px · wnormal · italic · $parch @16,468
  - **frame** `Tuile Le duel` 434.7×504 @893.3,688 — layout=none, clip
    - rect `img` 434.7×504 @0,0 img=`maquette-assets/galerie-6.jpg` (mode fill)
    - rect `voile bas` 434.7×64 @0,440 fill=#08070a80
    - **T** « Le duel » — $display · 14.5px · wnormal · italic · $parch @16,468

### 3.9 — Section « 09 · FAQ »

**Layout** — `$ink`, `padding: 120 56 130 56`, filet haut, colonne.

**En-tête** — `Label de section` (`08` · `QUESTIONS FRÉQUENTES`), `esp 56`, puis `Section head` : titre `$display` 76 (`Tout ce qu'on` / `nous demande.` `$ember` w300 italic) et chapô `$body` 16 / lh 1.7 / `$parch-mute`, largeur 460.

**`Items`** — colonne à filet haut `#ece8de38` (filet plus contrasté que `$parch-line`), huit items, chacun avec filet bas `#ece8de38`.

**Accordéon — deux états maquettés :**

| | Fermé (items 2 à 8) | Ouvert (item 1 uniquement) |
|---|---|---|
| Fond de l'item | transparent | `#e0552c08` |
| Couleur de la question | `$parch` | **`$ember`** |
| Icône | `plus` 14 px `$parch-soft` | `minus` 14 px `$ember` |
| Bloc réponse | absent du DOM | présent |

**Ligne `Q`** — rangée `space_between`, `align: center`, `padding: 26 16` ; question `$body` **17** / w500 / lh 1.4, largeur bloquée **1250**.
**Bloc `Réponse`** — rangée, `padding: 0 16 30 16` ; texte `$body` 15 / lh 1.6 / `$parch-soft`, largeur bloquée **1036**.

| # | Question | Réponse maquettée |
|---|---|---|
| 1 | `Faut-il déjà faire du sport ou de l'escrime ?` | oui (état ouvert) |
| 2 | `C'est dangereux ?` | — |
| 3 | `À quoi ressemble une séance ?` | — |
| 4 | `Que dois-je apporter pour la première séance ?` | — |
| 5 | `Combien coûte l'adhésion ?` | — |
| 6 | `Quels créneaux et quel lieu ?` | — |
| 7 | `Faut-il venir à toutes les séances ?` | — |
| 8 | `Faut-il faire de la compétition ?` | — |

Seule la première réponse est rédigée dans la maquette ; les sept autres sont à récupérer dans `CONTENU-SITE.md`.

**Aucune image dans cette section.**

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=120/56/130/56, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (14 nœuds texte) :*

- **frame** `Label 8 · Questions fréquentes` fill×hug — layout=horizontal(défaut), gap=16, align=center, pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
  - **T** « 08 » — $eyebrow · 12.5px · w600 · ls 3.5 · $ember
  - *icon* `diamond` 8×8 fill=$ember
  - **T** « QUESTIONS FRÉQUENTES » — $eyebrow · 12.5px · w600 · ls 3.5 · $parch-soft
- **frame** `esp` 10×56 — layout=none
- **frame** `Section head` fill×hug — layout=horizontal(défaut), justify=space_between, align=end, pad=0/0/64/0
  - **frame** `Titre` hug — layout=vertical, gap=4
    - **T** « Tout ce qu'on » — $display · 76px · lh 1 · $parch
    - **T** « nous demande. » — $display · 76px · w300 · italic · lh 1 · $ember
  - **T** « Les questions qu'on entend le plus souvent au premier contact. Si la vôtre n'y est pas, écrivez-nous — on répond. » — $body · 16px · wnormal · lh 1.7 · $parch-mute · fixed-width 460
- **frame** `Items` fill×hug — layout=vertical, stroke=#ece8de38 {"top": 1} inner
  - **frame** `Item FAQ 1` fill×hug fill=#e0552c08 — layout=vertical, stroke=#ece8de38 {"bottom": 1} inner
    - **frame** `Q` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=26/16
      - **T** « Faut-il déjà faire du sport ou de l'escrime ? » — $body · 17px · w500 · lh 1.4 · $ember · fixed-width 1250
      - *icon* `minus` 14×14 fill=$ember
    - **frame** `Réponse` fill×hug — layout=horizontal(défaut), pad=0/16/30/16
      - **T** « Non. La séance accueille tous niveaux et l'encadrement prend le temps avec les débutants — on commence par comprendre le geste avant de l'enchaîner. Aucun pré-requis sportif ou martial. » — $body · 15px · wnormal · lh 1.6 · $parch-soft · fixed-width 1036
  - **frame** `Item FAQ 2` fill×hug — layout=vertical, stroke=#ece8de38 {"bottom": 1} inner
    - **frame** `Q` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=26/16
      - **T** « C'est dangereux ? » — $body · 17px · w500 · lh 1.4 · $parch · fixed-width 1250
      - *icon* `plus` 14×14 fill=$parch-soft
  - **frame** `Item FAQ 3` fill×hug — layout=vertical, stroke=#ece8de38 {"bottom": 1} inner
    - **frame** `Q` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=26/16
      - **T** « À quoi ressemble une séance ? » — $body · 17px · w500 · lh 1.4 · $parch · fixed-width 1250
      - *icon* `plus` 14×14 fill=$parch-soft
  - **frame** `Item FAQ 4` fill×hug — layout=vertical, stroke=#ece8de38 {"bottom": 1} inner
    - **frame** `Q` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=26/16
      - **T** « Que dois-je apporter pour la première séance ? » — $body · 17px · w500 · lh 1.4 · $parch · fixed-width 1250
      - *icon* `plus` 14×14 fill=$parch-soft
  - **frame** `Item FAQ 5` fill×hug — layout=vertical, stroke=#ece8de38 {"bottom": 1} inner
    - **frame** `Q` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=26/16
      - **T** « Combien coûte l'adhésion ? » — $body · 17px · w500 · lh 1.4 · $parch · fixed-width 1250
      - *icon* `plus` 14×14 fill=$parch-soft
  - **frame** `Item FAQ 6` fill×hug — layout=vertical, stroke=#ece8de38 {"bottom": 1} inner
    - **frame** `Q` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=26/16
      - **T** « Quels créneaux et quel lieu ? » — $body · 17px · w500 · lh 1.4 · $parch · fixed-width 1250
      - *icon* `plus` 14×14 fill=$parch-soft
  - **frame** `Item FAQ 7` fill×hug — layout=vertical, stroke=#ece8de38 {"bottom": 1} inner
    - **frame** `Q` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=26/16
      - **T** « Faut-il venir à toutes les séances ? » — $body · 17px · w500 · lh 1.4 · $parch · fixed-width 1250
      - *icon* `plus` 14×14 fill=$parch-soft
  - **frame** `Item FAQ 8` fill×hug — layout=vertical, stroke=#ece8de38 {"bottom": 1} inner
    - **frame** `Q` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=26/16
      - **T** « Faut-il faire de la compétition ? » — $body · 17px · w500 · lh 1.4 · $parch · fixed-width 1250
      - *icon* `plus` 14×14 fill=$parch-soft

### 3.10 — Section « 10 · Partenaires »

**Layout** — `$coal`, `padding: 120 56 **110** 56` (padding bas réduit, le footer suit), filet haut, colonne.

**En-tête** — `Label de section` (`09` · `PARTENAIRES`), `esp 56`, titre `$display` 70 / lh 1 (`Sans eux,` / `rien de tout ça.` `$ember` w300 italic), `esp 28`, chapô `$body` 16 / lh 1.7 / **`$parch-soft`** largeur **760** (plus large que les chapôs de 460), `esp 64`.

**`Rangées`** — colonne, trois rangées `gap: 72`, `align: center`, `padding: 56 0`, filet bas :
- `Logo` — frame **240×120**, image en **`mode fit`** (`object-fit: contain`) — seul endroit du site où les images ne sont pas en `cover`
- `Contenu` — colonne `gap: 12` : catégorie (`$eyebrow` 10.5 / w600 / ls 2.9 / `$ember`), nom (`$display` 34 / w500 / lh 1.1 / `$parch`), texte (`$body` 15 / lh 1.6 / `$parch-soft`, **largeur bloquée 976**), `esp 8`, bouton secondaire hug×44

| Logo | Catégorie | Nom | Bouton |
|---|---|---|---|
| `public/assets/logo_signature_FFAMHE.png` | `AFFILIATION` | `FFAMHE` | `VISITER LA FFAMHE` |
| `public/assets/Fait-d'arme-logo.png` | `ÉQUIPEMENT` | `Faits d'Armes` | `VOIR LEURS ÉQUIPEMENTS` |
| `public/assets/black-armoury-logo.jpg` | `ÉQUIPEMENT` | `Black Armoury` | `VOIR LEURS LAMES` |

**Attention intégration :** le fichier `Fait-d'arme-logo.png` contient une **apostrophe** dans son nom — à renommer avant mise en ligne (URL encoding, incohérences de casse serveur). Noter aussi le singulier « Fait » dans le fichier contre le pluriel « Faits d'Armes » dans le texte.

**Conteneur** — `fill×hug` fill=$coal — layout=vertical, pad=120/56/110/56, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (17 nœuds texte) :*

- **frame** `Label 9 · Partenaires` fill×hug — layout=horizontal(défaut), gap=16, align=center, pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
  - **T** « 09 » — $eyebrow · 12.5px · w600 · ls 3.5 · $ember
  - *icon* `diamond` 8×8 fill=$ember
  - **T** « PARTENAIRES » — $eyebrow · 12.5px · w600 · ls 3.5 · $parch-soft
- **frame** `esp` 10×56 — layout=none
- **frame** `Titre` hug — layout=vertical, gap=4
  - **T** « Sans eux, » — $display · 70px · lh 1 · $parch
  - **T** « rien de tout ça. » — $display · 70px · w300 · italic · lh 1 · $ember
- **frame** `esp` 10×28 — layout=none
- **T** « Un club n'existe pas tout seul. Il existe parce qu'une fédération porte la discipline au niveau national, parce que des artisans fabriquent du matériel pensé pour cette pratique, et parce que ces gens-là partagent la même exigence que nous. Les trois ci-dessous, on ne se contente pas de les mentionner — on les recommande, on travaille avec eux, et on t'invite à aller voir. » — $body · 16px · wnormal · lh 1.7 · $parch-soft · fixed-width 760
- **frame** `esp` 10×64 — layout=none
- **frame** `Rangées` fill×hug — layout=vertical
  - **frame** `Partenaire FFAMHE` fill×hug — layout=horizontal(défaut), gap=72, align=center, pad=56/0, stroke=$parch-line {"bottom": 1} inner
    - **frame** `Logo FFAMHE` 240×120 img=`public/assets/logo_signature_FFAMHE.png` (mode fit) — layout=none
    - **frame** `Contenu` fill×hug — layout=vertical, gap=12
      - **T** « AFFILIATION » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « FFAMHE » — $display · 34px · w500 · lh 1.1 · $parch
      - **T** « La Fédération Française des Arts Martiaux Historiques Européens est la colonne vertébrale de tout le milieu AMHE en France. Sans elle, pas de circuit de tournois national, pas de lien entre les associations, pas de cadre pour assurer et reconnaître les clubs. Notre affiliation, c'est ce qui permet au club de rejoindre la scène nationale, et à chaque séance ici d'être rattachée à un travail collectif beaucoup plus large que notre seule salle. » — $body · 15px · wnormal · lh 1.6 · $parch-soft · fixed-width 976
      - **frame** `esp` 10×8 — layout=none
      - **frame** `Btn Visiter la FFAMHE` hug×44 — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/22, radius=2, stroke=#ece8de47 1 inner
        - **T** « VISITER LA FFAMHE » — $body · 11.5px · w500 · ls 1.8 · $parch
        - *icon* `arrow-right` 11×11 fill=$parch
  - **frame** `Partenaire Faits d'Armes` fill×hug — layout=horizontal(défaut), gap=72, align=center, pad=56/0, stroke=$parch-line {"bottom": 1} inner
    - **frame** `Logo Faits d'Armes` 240×120 img=`public/assets/Fait-d'arme-logo.png` (mode fit) — layout=none
    - **frame** `Contenu` fill×hug — layout=vertical, gap=12
      - **T** « ÉQUIPEMENT » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « Faits d'Armes » — $display · 34px · w500 · lh 1.1 · $parch
      - **T** « Entrepreneur français travaillant directement avec les pratiquants. Vestes 350N ou 800N, gants coqués, protections rigides — chaque pièce est conçue pour résister aux assauts longue épée et durer. Quand tu veux monter ton équipement sérieusement, c'est par là qu'on commence à regarder. Fait d'armes dispose d'un vaste catalogue, et en plus, il est a deux pas d'ici. » — $body · 15px · wnormal · lh 1.6 · $parch-soft · fixed-width 976
      - **frame** `esp` 10×8 — layout=none
      - **frame** `Btn Voir leurs équipements` hug×44 — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/22, radius=2, stroke=#ece8de47 1 inner
        - **T** « VOIR LEURS ÉQUIPEMENTS » — $body · 11.5px · w500 · ls 1.8 · $parch
        - *icon* `arrow-right` 11×11 fill=$parch
  - **frame** `Partenaire Black Armoury` fill×hug — layout=horizontal(défaut), gap=72, align=center, pad=56/0, stroke=$parch-line {"bottom": 1} inner
    - **frame** `Logo Black Armoury` 240×120 img=`public/assets/black-armoury-logo.jpg` (mode fit) — layout=none
    - **frame** `Contenu` fill×hug — layout=vertical, gap=12
      - **T** « ÉQUIPEMENT » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « Black Armoury » — $display · 34px · w500 · lh 1.1 · $parch
      - **T** « Partenaire incontournable de la scène AMHE. Black Armoury a développé de nombreux produits aujourd'hui exclusifs a sa marque, la Veste Arcem notament est l'un des produits les mieux désigné pour notre pratique, et largement privilégié au club. Avec sa volonté d'innover sur le matériel et les protections, Black armoury s'impose dans la production d'equipement toujours plus calibré pour nos besoins. » — $body · 15px · wnormal · lh 1.6 · $parch-soft · fixed-width 976
      - **frame** `esp` 10×8 — layout=none
      - **frame** `Btn Voir leurs lames` hug×44 — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/22, radius=2, stroke=#ece8de47 1 inner
        - **T** « VOIR LEURS LAMES » — $body · 11.5px · w500 · ls 1.8 · $parch
        - *icon* `arrow-right` 11×11 fill=$parch

### 3.11 — Section « Footer »

**Layout** — `$ink`, `padding: 80 56 32 56`, filet haut, colonne. Trois bandes.

**1. `Marquee`** — rangée `gap: 26`, `justify: center`, `align: end`, `padding-bottom: 64`. Reprise du logotype en **`$display` 115 / lh 0.9** : `De` (`$parch` w500) · `Feu` (**`$feu`** w500) · `et d'` (`$parch` w300 italic) · `Acier` (**`$acier`** w500). C'est le plus grand texte du site.

**2. `Grille footer`** — rangée `gap: 48`, `padding: 56 0 64 0`, filet haut, quatre colonnes de **296** :
- `Marque` — colonne `gap: 20` : `Logo` 56×56 (`public/assets/logo.png`, `cover`) + baseline `$body` 13 / lh 1.6 / `$parch-mute`, largeur 260
- Trois colonnes de liens, colonne `gap: 12` : titre `$eyebrow` 10 / w500 / ls 2.6 / `$parch-mute`, puis `esp 10`, puis les liens en `$body` 14.5 / w400 / `$parch`

| `LE CLUB` | `PRATIQUE` | `SUIVRE` |
|---|---|---|
| La rigueur | Nous rejoindre | Facebook |
| Disciplines | Adhésion | HEMA Ratings |
| FAQ | Nous écrire | USAM Clermont |
| Tournois | HelloAsso | FFAMHE |
| Galerie | | |

**3. `Bas de page`** — rangée `space_between`, `align: center`, `padding-top: 32`, filet haut. À gauche `© 2026 · DE FEU ET D'ACIER · CLERMONT-FERRAND`, à droite une rangée `gap: 22` : `MENTIONS LÉGALES`, `CONFIDENTIALITÉ`. Tous en `$eyebrow` 10 / w500 / ls 2.6 / `$parch-mute`.

**Images** : `public/assets/logo.png`.

**Note :** l'année `2026` est en dur dans la maquette — à générer dynamiquement.

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=80/56/32/56, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (24 nœuds texte) :*

- **frame** `Marquee` fill×hug — layout=horizontal(défaut), gap=26, justify=center, align=end, pad=0/0/64/0
  - **T** « De » — $display · 115px · w500 · lh 0.9 · $parch
  - **T** « Feu » — $display · 115px · w500 · lh 0.9 · $feu
  - **T** « et d' » — $display · 115px · w300 · italic · lh 0.9 · $parch
  - **T** « Acier » — $display · 115px · w500 · lh 0.9 · $acier
- **frame** `Grille footer` fill×hug — layout=horizontal(défaut), gap=48, pad=56/0/64/0, stroke=$parch-line {"top": 1} inner
  - **frame** `Marque` 296×hug — layout=vertical, gap=20
    - **frame** `Logo` 56×56 img=`public/assets/logo.png` (mode fill) — layout=none
    - **T** « Section AMHE de l'USAM Clermont-Ferrand, affiliée à la FFAMHE. Arts martiaux historiques européens au cœur du Puy-de-Dôme. » — $body · 13px · wnormal · lh 1.6 · $parch-mute · fixed-width 260
  - **frame** `Col Le club` 296×hug — layout=vertical, gap=12
    - **T** « LE CLUB » — $eyebrow · 10px · w500 · ls 2.6 · $parch-mute
    - **frame** `esp` 10×10 — layout=none
    - **T** « La rigueur » — $body · 14.5px · wnormal · $parch
    - **T** « Disciplines » — $body · 14.5px · wnormal · $parch
    - **T** « FAQ » — $body · 14.5px · wnormal · $parch
    - **T** « Tournois » — $body · 14.5px · wnormal · $parch
    - **T** « Galerie » — $body · 14.5px · wnormal · $parch
  - **frame** `Col Pratique` 296×hug — layout=vertical, gap=12
    - **T** « PRATIQUE » — $eyebrow · 10px · w500 · ls 2.6 · $parch-mute
    - **frame** `esp` 10×10 — layout=none
    - **T** « Nous rejoindre » — $body · 14.5px · wnormal · $parch
    - **T** « Adhésion » — $body · 14.5px · wnormal · $parch
    - **T** « Nous écrire » — $body · 14.5px · wnormal · $parch
    - **T** « HelloAsso » — $body · 14.5px · wnormal · $parch
  - **frame** `Col Suivre` 296×hug — layout=vertical, gap=12
    - **T** « SUIVRE » — $eyebrow · 10px · w500 · ls 2.6 · $parch-mute
    - **frame** `esp` 10×10 — layout=none
    - **T** « Facebook » — $body · 14.5px · wnormal · $parch
    - **T** « HEMA Ratings » — $body · 14.5px · wnormal · $parch
    - **T** « USAM Clermont » — $body · 14.5px · wnormal · $parch
    - **T** « FFAMHE » — $body · 14.5px · wnormal · $parch
- **frame** `Bas de page` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=32/0/0/0, stroke=$parch-line {"top": 1} inner
  - **T** « © 2026 · DE FEU ET D'ACIER · CLERMONT-FERRAND » — $eyebrow · 10px · w500 · ls 2.6 · $parch-mute
  - **frame** `Légal` hug — layout=horizontal(défaut), gap=22
    - **T** « MENTIONS LÉGALES » — $eyebrow · 10px · w500 · ls 2.6 · $parch-mute
    - **T** « CONFIDENTIALITÉ » — $eyebrow · 10px · w500 · ls 2.6 · $parch-mute

---

## 4. Accueil mobile (référence) — `V2 — Mobile 390`

Dix sections, largeur 390, colonne verticale. **Gouttière latérale : 22 px** (contre 56 en desktop).

Trois différences structurelles majeures avec le desktop :

1. **Navigation par tab-bar fixe** (5 onglets, 390×80, fond `#0a0908f2`) et non par barre de liens. Le menu déroulant existe en état séparé (§8).
2. **Carrousels horizontaux** au lieu de grilles : armes, profs et galerie sont des bandes défilables (`layout: none`, `clip`, cartes positionnées en absolu au-delà de 390 px de large), signalées par le pattern `GLISSER` + `chevrons-right`.
3. **Contenu réduit** : « Tournois » et « Partenaires » (version longue) disparaissent ; « La rigueur » devient un bloc `Manifesto` plein écran de 290 px ; la FAQ n'expose que 3 questions sur 8 avec un lien `TOUTES LES QUESTIONS`.

### 4.1 — Section « 01 · Accueil (sans scroll) »

**Layout** — frame **390×780** (hauteur d'écran cible), `layout: none`, `clip`. Six couches empilées.

| Couche | Élément | Détail |
|---|---|---|
| 1 | `BG` | rect 390×780 @0,0 — `maquette-assets/hero.jpg`, `cover` |
| 2 | `Voile` | rect 390×780 @0,0 — `#0a0908b8` (72 %, plus dense que le desktop) |
| 3 | `Barre du haut` | frame 390×hug @0,0 — `space_between`, `align: center`, `padding: 14 18` : `Logo` 38×38 + icône `menu` 24 px `$parch` |
| 4 | `Contenu` | frame **346**×hug @22,**196** — colonne centrée |
| 5 | `Cue` | frame 390×hug @0,**644** — `chevron-down` 18 px + `DÉCOUVRIR LE CLUB` (`$eyebrow` 8.5 / ls 2.8) |
| 6 | `Tab bar` | frame 390×80 @0,**700** — voir pattern §9.12 |

**Bloc `Contenu`** (transposition du hero desktop) : sur-titre `ARTS MARTIAUX HISTORIQUES EUROPÉENS` (`$eyebrow` 9.5 / w600 / ls 3, centré, largeur 346), `esp 18`, logotype `H1` en `$display` **62** (`gap: 6` entre lignes, `gap: 15` puis `8` entre mots), `esp 22`, `Filet` 44×1 `#ece8de52`, `esp 20`, `à Clermont-Ferrand` (`$display` 21 / w500 / italic / lh 1.2), `esp 26`, ligne d'info (`$eyebrow` 10 / ls 2.4 / `$parch-mute`), `esp 22`, bouton `VENIR ESSAYER` hug×48 à bordure.

**Tab-bar** — onglet actif = **`Accueil`** : marqueur rect 14×2 `$ember` (rayon 2) au-dessus de l'icône, icône et libellé en `$parch` ; les autres en `$parch-mute` avec une `esp 14×2` à la place du marqueur.

**Conteneur** — `390×780` fill=$ink — layout=none, clip

*Arbre exhaustif (14 nœuds texte) :*

- rect `BG` 390×780 @0,0 img=`maquette-assets/hero.jpg` (mode fill)
- rect `Voile` 390×780 @0,0 fill=#0a0908b8
- **frame** `Barre du haut` 390×hug @0,0 — layout=horizontal(défaut), justify=space_between, align=center, pad=14/18
  - **frame** `Logo` 38×38 img=`public/assets/logo.png` (mode fill) — layout=none
  - *icon* `menu` 24×24 fill=$parch
- **frame** `Contenu` 346×hug @22,196 — layout=vertical, align=center
  - **T** « ARTS MARTIAUX HISTORIQUES EUROPÉENS » — $eyebrow · 9.5px · w600 · ls 3 · $parch-soft · align center · fixed-width 346
  - **frame** `esp` 10×18 — layout=none
  - **frame** `H1` hug — layout=vertical, gap=6, align=center
    - **frame** `l1` hug — layout=horizontal(défaut), gap=15, justify=center, align=end
      - **T** « De » — $display · 62px · w500 · lh 0.9 · $parch
      - **T** « Feu » — $display · 62px · w500 · lh 0.9 · $feu
    - **frame** `l2` hug — layout=horizontal(défaut), gap=8, justify=center, align=end
      - **T** « et d' » — $display · 62px · w300 · italic · lh 0.9 · $parch
      - **T** « Acier » — $display · 62px · w500 · lh 0.9 · $acier
  - **frame** `esp` 10×22 — layout=none
  - rect `Filet` 44×1 fill=#ece8de52
  - **frame** `esp` 10×20 — layout=none
  - **T** « à Clermont-Ferrand » — $display · 21px · w500 · italic · lh 1.2 · $parch
  - **frame** `esp` 10×26 — layout=none
  - **T** « MAR · JEU 18H–22H  —  ESSAI OFFERT » — $eyebrow · 10px · w500 · ls 2.4 · $parch-mute
  - **frame** `esp` 10×22 — layout=none
  - **frame** `CTA` hug×48 — layout=horizontal(défaut), gap=10, justify=center, align=center, pad=0/30, radius=2, stroke=#ece8de47 1 inner
    - **T** « VENIR ESSAYER » — $body · 11px · w500 · ls 2.2 · $parch
    - *icon* `arrow-right` 11×11 fill=$parch
- **frame** `Cue` 390×hug @0,644 — layout=vertical, gap=6, align=center
  - *icon* `chevron-down` 18×18 fill=$parch-mute
  - **T** « DÉCOUVRIR LE CLUB » — $eyebrow · 8.5px · w500 · ls 2.8 · $parch-mute
- **frame** `Tab bar` 390×80 @0,700 fill=#0a0908f2 — layout=horizontal(défaut), justify=space_between, align=end, pad=0/10/8/10, stroke=$parch-line {"top": 1} inner
  - **frame** `Tab Accueil` 72×66 — layout=vertical, gap=5, justify=center, align=center
    - rect `marqueur` 14×2 fill=$ember radius=2
    - *icon* `house` 19×19 fill=$parch
    - **T** « ACCUEIL » — $eyebrow · 8px · w600 · ls 1.2 · $parch
  - **frame** `Tab Armes` 72×66 — layout=vertical, gap=5, justify=center, align=center
    - **frame** `esp` 14×2 — layout=none
    - *icon* `sword` 19×19 fill=$parch-mute
    - **T** « ARMES » — $eyebrow · 8px · w600 · ls 1.2 · $parch-mute
  - **frame** `Tab Essayer` 76×hug — layout=vertical, gap=4, align=center
    - **frame** `Rond` 46×46 fill=$ember — layout=horizontal(défaut), justify=center, align=center, radius=99
      - *icon* `swords` 20×20 fill=$ink
    - **T** « ESSAYER » — $eyebrow · 8px · w600 · ls 1.2 · $parch
  - **frame** `Tab Photos` 72×66 — layout=vertical, gap=5, justify=center, align=center
    - **frame** `esp` 14×2 — layout=none
    - *icon* `image` 19×19 fill=$parch-mute
    - **T** « PHOTOS » — $eyebrow · 8px · w600 · ls 1.2 · $parch-mute
  - **frame** `Tab Contact` 72×66 — layout=vertical, gap=5, justify=center, align=center
    - **frame** `esp` 14×2 — layout=none
    - *icon* `phone` 19×19 fill=$parch-mute
    - **T** « CONTACT » — $eyebrow · 8px · w600 · ls 1.2 · $parch-mute

### 4.2 — Section « 02 · Les armes »

**Layout** — `$ink`, `padding: 56 0 60 0`, filet haut, colonne. Le carrousel déborde volontairement les gouttières, d'où le padding horizontal nul sur la section.

**Tête** — pattern `Tête de section mobile` : rangée `space_between`, `align: center`, `padding: 0 22 18 22`. À gauche l'eyebrow (`01` `$ember` + `diamond` 6 px + `LES ARMES` `$parch-soft`, tous `$eyebrow` 10.5 / w600 / ls 2.6) ; à droite l'indicateur `GLISSER` (`$eyebrow` 9 / w600 / ls 2) + `chevrons-right` 12 px `$parch-mute`.

**`Carousel`** — frame 390×**350**, `layout: none`, `clip`. Quatre cartes **258×350** aux x **22, 292, 562, 832** → largeur 258 + gouttière 12, première carte alignée sur la gouttière de 22.

**Carte discipline mobile** (rayon **3**, `clip`) :
1. rect `Photo` 258×350 `cover`
2. rect `Voile` 258×350 — `#08070a52` (32 %)
3. rect `Assise` 258×**150** @0,200 — `#08070ac9` (79 %)
4. `Époque` — **pastille** hug @16,16, fond `#0a0908a6`, `padding: 6 10`, `radius: 99`, bordure `#ece8de38` ; texte `$eyebrow` 9 / w600 / ls 1.6 / `$parch`. *Sur mobile l'époque devient un badge ; le desktop utilise un tiret + deux lignes.*
5. `Bas` — frame 218×hug @20,234, colonne `gap: 6` : nom `$display` 27 / lh 1, sous-titre `$body` 11.5 / lh 1.4 / `$parch-soft`, `esp 8×4`, lien `DÉCOUVRIR` (`$eyebrow` 9 / w600 / ls 1.8) + `arrow-right` 10 px. **Contrairement au desktop, les quatre cartes portent le lien.**

| Carte | Image | Badge époque |
|---|---|---|
| Combat viking | `disc-viking.jpg` | `VIIIᵉ — XIᵉ S.` |
| Épée longue | `disc-epee-longue.jpg` | `XIVᵉ — XVᵉ S.` |
| Messer | `disc-messer.jpg` | `XVᵉ S.` |
| Rapière | `disc-rapiere.jpg` | `XVIᵉ — XVIIᵉ S.` |

**`Points`** — pagination : rangée `gap: 6` centrée, `padding-top: 16` ; le point actif est un rect **18×3** `$ember` (rayon 2), les inactifs des rect **7×3** `#ece8de38`.

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=56/0/60/0, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (19 nœuds texte) :*

- **frame** `Tête Les armes` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=0/22/18/22
  - **frame** `Eyebrow Les armes` hug — layout=horizontal(défaut), gap=10, align=center
    - **T** « 01 » — $eyebrow · 10.5px · w600 · ls 2.6 · $ember
    - *icon* `diamond` 6×6 fill=$ember
    - **T** « LES ARMES » — $eyebrow · 10.5px · w600 · ls 2.6 · $parch-soft
  - **frame** `Swipe` hug — layout=horizontal(défaut), gap=6, align=center
    - **T** « GLISSER » — $eyebrow · 9px · w600 · ls 2 · $parch-mute
    - *icon* `chevrons-right` 12×12 fill=$parch-mute
- **frame** `Carousel` 390×350 — layout=none, clip
  - **frame** `Carte Combat viking` 258×350 @22,0 — layout=none, radius=3, clip
    - rect `Photo` 258×350 @0,0 img=`maquette-assets/disc-viking.jpg` (mode fill)
    - rect `Voile` 258×350 @0,0 fill=#08070a52
    - rect `Assise` 258×150 @0,200 fill=#08070ac9
    - **frame** `Époque` hug @16,16 fill=#0a0908a6 — layout=horizontal(défaut), pad=6/10, radius=99, stroke=#ece8de38 1 inner
      - **T** « VIIIᵉ — XIᵉ S. » — $eyebrow · 9px · w600 · ls 1.6 · $parch
    - **frame** `Bas` 218×hug @20,234 — layout=vertical, gap=6
      - **T** « Combat viking » — $display · 27px · wnormal · lh 1 · $parch
      - **T** « Bouclier & arme courte » — $body · 11.5px · wnormal · lh 1.4 · $parch-soft · fixed-width 218
      - **frame** `esp` 8×4 — layout=none
      - **frame** `Lien fiche` hug — layout=horizontal(défaut), gap=8, align=center
        - **T** « DÉCOUVRIR » — $eyebrow · 9px · w600 · ls 1.8 · $parch
        - *icon* `arrow-right` 10×10 fill=$parch
  - **frame** `Carte Épée longue` 258×350 @292,0 — layout=none, radius=3, clip
    - rect `Photo` 258×350 @0,0 img=`maquette-assets/disc-epee-longue.jpg` (mode fill)
    - rect `Voile` 258×350 @0,0 fill=#08070a52
    - rect `Assise` 258×150 @0,200 fill=#08070ac9
    - **frame** `Époque` hug @16,16 fill=#0a0908a6 — layout=horizontal(défaut), pad=6/10, radius=99, stroke=#ece8de38 1 inner
      - **T** « XIVᵉ — XVᵉ S. » — $eyebrow · 9px · w600 · ls 1.6 · $parch
    - **frame** `Bas` 218×hug @20,234 — layout=vertical, gap=6
      - **T** « Épée longue » — $display · 27px · wnormal · lh 1 · $parch
      - **T** « Arme emblématique des AMHE » — $body · 11.5px · wnormal · lh 1.4 · $parch-soft · fixed-width 218
      - **frame** `esp` 8×4 — layout=none
      - **frame** `Lien fiche` hug — layout=horizontal(défaut), gap=8, align=center
        - **T** « DÉCOUVRIR » — $eyebrow · 9px · w600 · ls 1.8 · $parch
        - *icon* `arrow-right` 10×10 fill=$parch
  - **frame** `Carte Messer` 258×350 @562,0 — layout=none, radius=3, clip
    - rect `Photo` 258×350 @0,0 img=`maquette-assets/disc-messer.jpg` (mode fill)
    - rect `Voile` 258×350 @0,0 fill=#08070a52
    - rect `Assise` 258×150 @0,200 fill=#08070ac9
    - **frame** `Époque` hug @16,16 fill=#0a0908a6 — layout=horizontal(défaut), pad=6/10, radius=99, stroke=#ece8de38 1 inner
      - **T** « XVᵉ S. » — $eyebrow · 9px · w600 · ls 1.6 · $parch
    - **frame** `Bas` 218×hug @20,234 — layout=vertical, gap=6
      - **T** « Messer » — $display · 27px · wnormal · lh 1 · $parch
      - **T** « Grand couteau de combat » — $body · 11.5px · wnormal · lh 1.4 · $parch-soft · fixed-width 218
      - **frame** `esp` 8×4 — layout=none
      - **frame** `Lien fiche` hug — layout=horizontal(défaut), gap=8, align=center
        - **T** « DÉCOUVRIR » — $eyebrow · 9px · w600 · ls 1.8 · $parch
        - *icon* `arrow-right` 10×10 fill=$parch
  - **frame** `Carte Rapière` 258×350 @832,0 — layout=none, radius=3, clip
    - rect `Photo` 258×350 @0,0 img=`maquette-assets/disc-rapiere.jpg` (mode fill)
    - rect `Voile` 258×350 @0,0 fill=#08070a52
    - rect `Assise` 258×150 @0,200 fill=#08070ac9
    - **frame** `Époque` hug @16,16 fill=#0a0908a6 — layout=horizontal(défaut), pad=6/10, radius=99, stroke=#ece8de38 1 inner
      - **T** « XVIᵉ — XVIIᵉ S. » — $eyebrow · 9px · w600 · ls 1.6 · $parch
    - **frame** `Bas` 218×hug @20,234 — layout=vertical, gap=6
      - **T** « Rapière » — $display · 27px · wnormal · lh 1 · $parch
      - **T** « Escrime de la Renaissance » — $body · 11.5px · wnormal · lh 1.4 · $parch-soft · fixed-width 218
      - **frame** `esp` 8×4 — layout=none
      - **frame** `Lien fiche` hug — layout=horizontal(défaut), gap=8, align=center
        - **T** « DÉCOUVRIR » — $eyebrow · 9px · w600 · ls 1.8 · $parch
        - *icon* `arrow-right` 10×10 fill=$parch
- **frame** `Points` fill×hug — layout=horizontal(défaut), gap=6, justify=center, align=center, pad=16/0/0/0
  - rect `d1` 18×3 fill=$ember radius=2
  - rect `d2` 7×3 fill=#ece8de38 radius=2
  - rect `d3` 7×3 fill=#ece8de38 radius=2
  - rect `d4` 7×3 fill=#ece8de38 radius=2

### 4.3 — Section « 03 · Manifesto »

**Layout** — frame **390×290**, `layout: none`, `clip`. **Pas de padding de section, pas de filet** : c'est une bande pleine largeur qui joue le rôle du bloc « La rigueur » desktop.

1. rect `BG` 390×290 — `public/assets/treatise.jpg`, `cover`
2. rect `Voile` 390×290 — `#0a0908d9` (85 %)
3. `Texte` — frame 346×hug @22,74, colonne `gap: 2`, `align: center`

Contenu : `LA RIGUEUR` (`$eyebrow` 10 / w600 / ls 3 / `$ember`), `esp 4`, puis la citation en deux nœuds `$display` 30 / italic / lh 1.1 — `« Le geste juste,` (`$parch`) et `avant le costume. »` (`$ember`) — **les guillemets français font partie du contenu texte** (ouvrant sur la première ligne, fermant sur la seconde). `esp 8`, puis `Traités historiques · pratique moderne & sécurisée` (`$body` 11.5 / w500 / `$parch-soft`).

**Conteneur** — `390×290` — layout=none, clip

*Arbre exhaustif (4 nœuds texte) :*

- rect `BG` 390×290 @0,0 img=`public/assets/treatise.jpg` (mode fill)
- rect `Voile` 390×290 @0,0 fill=#0a0908d9
- **frame** `Texte` 346×hug @22,74 — layout=vertical, gap=2, align=center
  - **T** « LA RIGUEUR » — $eyebrow · 10px · w600 · ls 3 · $ember
  - **frame** `esp` 10×4 — layout=none
  - **T** « « Le geste juste, » — $display · 30px · wnormal · italic · lh 1.1 · $parch
  - **T** « avant le costume. » » — $display · 30px · wnormal · italic · lh 1.1 · $ember
  - **frame** `esp` 10×8 — layout=none
  - **T** « Traités historiques · pratique moderne & sécurisée » — $body · 11.5px · w500 · $parch-soft

### 4.4 — Section « 04 · Le club »

**Layout** — `$coal`, `padding: 56 0 60 0`, filet haut, colonne. Tête de section `02 · LE CLUB` (sans indicateur `GLISSER`), puis un bloc `Contenu` en `padding: 0 22`.

**`Photo club`** — frame 346×250, rayon 3, `clip`, `layout: none` : image `maquette-assets/club.jpg` `cover`, voile `#0a090873` (45 %), assise 346×**120** @0,130 en `#0a0908cc` (80 %), puis `Titre` 306×hug @20,166 en colonne `gap: 2` — `Une bande d'escrimeurs,` (`$display` 24 / lh 1.1 / `$parch`) et `une école.` (`$display` 24 / w300 / italic / `$ember`). **Le titre desktop sur trois lignes devient un titre sur deux lignes incrusté dans la photo.**

`esp 20`, puis le paragraphe de présentation (`$body` 14 / lh 1.65 / `$parch-mute`, largeur 346) — texte identique au desktop.

**Les chiffres clés et les trois piliers du desktop sont absents du mobile.**

**Conteneur** — `fill×hug` fill=$coal — layout=vertical, pad=56/0/60/0, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (5 nœuds texte) :*

- **frame** `Tête Le club` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=0/22/18/22
  - **frame** `Eyebrow Le club` hug — layout=horizontal(défaut), gap=10, align=center
    - **T** « 02 » — $eyebrow · 10.5px · w600 · ls 2.6 · $ember
    - *icon* `diamond` 6×6 fill=$ember
    - **T** « LE CLUB » — $eyebrow · 10.5px · w600 · ls 2.6 · $parch-soft
- **frame** `Contenu` fill×hug — layout=vertical, pad=0/22
  - **frame** `Photo club` 346×250 — layout=none, radius=3, clip
    - rect `img` 346×250 @0,0 img=`maquette-assets/club.jpg` (mode fill)
    - rect `voile` 346×250 @0,0 fill=#0a090873
    - rect `assise` 346×120 @0,130 fill=#0a0908cc
    - **frame** `Titre` 306×hug @20,166 — layout=vertical, gap=2
      - **T** « Une bande d'escrimeurs, » — $display · 24px · wnormal · lh 1.1 · $parch
      - **T** « une école. » — $display · 24px · w300 · italic · lh 1.1 · $ember
  - **frame** `esp` 10×20 — layout=none
  - **T** « Section AMHE de l'USAM Clermont-Ferrand, affiliée à la FFAMHE, le club accueille débutants et pratiquants confirmés, en loisir comme en compétition. Encadrement assuré par Gabriel Tardio. La salle est ouverte à toutes et tous, et l'on prend le temps de bien faire les choses. » — $body · 14px · wnormal · lh 1.65 · $parch-mute · fixed-width 346

### 4.5 — Section « 05 · Les profs »

**Layout** — `$ink`, `padding: 56 0 60 0`, filet haut. Tête `03 · LES PROFS` **avec** indicateur `GLISSER`.

**`Rangée profs`** — frame 390×**232**, `layout: none`, `clip`. Trois cartes de **158** de large aux x **22, 192, 362** (gouttière 12).

**Carte prof mobile** — rayon **3**, bordure, `clip`, colonne. Mêmes deux variantes que le desktop (`#ece8de06` + `$parch-line` / `#e0552c0d` + `#e0552c52` pour Gabriel), **mais sans le bandeau `Ligne ember`**.
1. `Photo` 158×**150** (format paysage, contre carré en desktop), `cover`
2. `Infos` — colonne `gap: 4`, `padding: 12 12 14 12` : **prénom seul** `$display` 18 / w500 / lh 1, discipline `$eyebrow` 8.5 / w600 / ls 1.4 / lh 1.5 / `$ember` (largeur 134), puis lien `INTERVIEW` (`$eyebrow` 8 / w600 / ls 1.6 / `$parch-soft`) + `arrow-right` 9 px, avec `padding-top: 4`

| Carte | Photo | Prénom | Discipline |
|---|---|---|---|
| Marie Poignant | `public/assets/Marie.png` | `Marie` | `RAPIÈRE` |
| Gabriel Tardio | `public/assets/Gabriel.jpg` | `Gabriel` | `ÉPÉE LONGUE` |
| Ludwig Fort | `public/assets/Ludwig.jpeg` | `Ludwig` | `MESSER · VIKING · BOCLE` |

**Ni spécialité ni bio sur mobile** : la carte se réduit à photo + prénom + discipline + lien.

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=56/0/60/0, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (12 nœuds texte) :*

- **frame** `Tête Les profs` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=0/22/18/22
  - **frame** `Eyebrow Les profs` hug — layout=horizontal(défaut), gap=10, align=center
    - **T** « 03 » — $eyebrow · 10.5px · w600 · ls 2.6 · $ember
    - *icon* `diamond` 6×6 fill=$ember
    - **T** « LES PROFS » — $eyebrow · 10.5px · w600 · ls 2.6 · $parch-soft
  - **frame** `Swipe` hug — layout=horizontal(défaut), gap=6, align=center
    - **T** « GLISSER » — $eyebrow · 9px · w600 · ls 2 · $parch-mute
    - *icon* `chevrons-right` 12×12 fill=$parch-mute
- **frame** `Rangée profs` 390×232 — layout=none, clip
  - **frame** `Prof Marie Poignant` 158×hug @22,0 fill=#ece8de06 — layout=vertical, radius=3, stroke=$parch-line 1 inner, clip
    - **frame** `Photo` 158×150 img=`public/assets/Marie.png` (mode fill) — layout=none
    - **frame** `Infos` fill×hug — layout=vertical, gap=4, pad=12/12/14/12
      - **T** « Marie » — $display · 18px · w500 · lh 1 · $parch
      - **T** « RAPIÈRE » — $eyebrow · 8.5px · w600 · ls 1.4 · lh 1.5 · $ember · fixed-width 134
      - **frame** `Lien itw` hug — layout=horizontal(défaut), gap=6, align=center, pad=4/0/0/0
        - **T** « INTERVIEW » — $eyebrow · 8px · w600 · ls 1.6 · $parch-soft
        - *icon* `arrow-right` 9×9 fill=$parch-soft
  - **frame** `Prof Gabriel Tardio` 158×hug @192,0 fill=#e0552c0d — layout=vertical, radius=3, stroke=#e0552c52 1 inner, clip
    - **frame** `Photo` 158×150 img=`public/assets/Gabriel.jpg` (mode fill) — layout=none
    - **frame** `Infos` fill×hug — layout=vertical, gap=4, pad=12/12/14/12
      - **T** « Gabriel » — $display · 18px · w500 · lh 1 · $parch
      - **T** « ÉPÉE LONGUE » — $eyebrow · 8.5px · w600 · ls 1.4 · lh 1.5 · $ember · fixed-width 134
      - **frame** `Lien itw` hug — layout=horizontal(défaut), gap=6, align=center, pad=4/0/0/0
        - **T** « INTERVIEW » — $eyebrow · 8px · w600 · ls 1.6 · $parch-soft
        - *icon* `arrow-right` 9×9 fill=$parch-soft
  - **frame** `Prof Ludwig Fort` 158×hug @362,0 fill=#ece8de06 — layout=vertical, radius=3, stroke=$parch-line 1 inner, clip
    - **frame** `Photo` 158×150 img=`public/assets/Ludwig.jpeg` (mode fill) — layout=none
    - **frame** `Infos` fill×hug — layout=vertical, gap=4, pad=12/12/14/12
      - **T** « Ludwig » — $display · 18px · w500 · lh 1 · $parch
      - **T** « MESSER · VIKING · BOCLE » — $eyebrow · 8.5px · w600 · ls 1.4 · lh 1.5 · $ember · fixed-width 134
      - **frame** `Lien itw` hug — layout=horizontal(défaut), gap=6, align=center, pad=4/0/0/0
        - **T** « INTERVIEW » — $eyebrow · 8px · w600 · ls 1.6 · $parch-soft
        - *icon* `arrow-right` 9×9 fill=$parch-soft

### 4.6 — Section « 06 · Essayer »

**Layout** — `$coal`, `padding: 56 0 60 0`, filet haut. Tête `04 · VENIR ESSAYER`. Bloc `Contenu` en `padding: 0 22`.

**Titre** — colonne `gap: 8` : rangée `l1` (`align: end`, `gap: 11`) — `2 séances` (`$display` 40 / w500 / lh 1 / **`$ember`**) + `offertes.` (`$display` 40 / w300 / italic / `$parch`). **Inversion de la logique desktop** : ici c'est le fragment droit qui est en parchemin et le gauche en ember. Puis sous-titre `Sans engagement, matériel prêté.` (`$display` 14 / italic / lh 1.3 / `$parch-soft`).

`esp 20`, puis **`Faits`** — colonne à filet haut, quatre lignes `padding: 13 0`, `gap: 14`, `align: center`, filet bas. Chaque ligne : pastille ronde 30×30 (`#e0552c14`, `radius: 99`) avec icône 15 px `$ember`, puis colonne `gap: 2` — valeur principale `$body` 14.5 / w500 / lh 1.4 / `$parch` (largeur 300) et complément `$body` 12 / lh 1.4 / `$parch-mute` (largeur 300).

| Icône | Valeur | Complément |
|---|---|---|
| `map-pin` | `Gymnase Robert Pras` | `3 rue Jean Monnet · 63100 Clermont-Ferrand` |
| `clock` | `Mar 18h–20h · Jeu 18h–22h` | `Tous niveaux, débutants bienvenus` |
| `euro` | `85 € / an ensuite` | `Un masque, des gants coqués — c'est tout` |
| `phone` | `06 61 28 65 11` | `amhe63.dfda@gmail.com` |

`esp 24`, puis deux boutons **pleine largeur** empilés (`esp 10` entre eux) :
- `VENIR ESSAYER` — `fill`×52, fond `$ember`, texte `$ink` w600, `arrow-right` 12 px, rayon 2
- `ITINÉRAIRE` — `fill`×46, bordure `#ece8de47`, icône **`navigation`** 12 px `$parch`

**Le tableau des créneaux desktop est remplacé par ces quatre lignes condensées.**

**Conteneur** — `fill×hug` fill=$coal — layout=vertical, pad=56/0/60/0, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (15 nœuds texte) :*

- **frame** `Tête Venir essayer` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=0/22/18/22
  - **frame** `Eyebrow Venir essayer` hug — layout=horizontal(défaut), gap=10, align=center
    - **T** « 04 » — $eyebrow · 10.5px · w600 · ls 2.6 · $ember
    - *icon* `diamond` 6×6 fill=$ember
    - **T** « VENIR ESSAYER » — $eyebrow · 10.5px · w600 · ls 2.6 · $parch-soft
- **frame** `Contenu` fill×hug — layout=vertical, pad=0/22
  - **frame** `Titre` hug — layout=vertical, gap=8
    - **frame** `l1` hug — layout=horizontal(défaut), gap=11, align=end
      - **T** « 2 séances » — $display · 40px · w500 · lh 1 · $ember
      - **T** « offertes. » — $display · 40px · w300 · italic · lh 1 · $parch
    - **T** « Sans engagement, matériel prêté. » — $display · 14px · wnormal · italic · lh 1.3 · $parch-soft
  - **frame** `esp` 10×20 — layout=none
  - **frame** `Faits` fill×hug — layout=vertical, stroke=$parch-line {"top": 1} inner
    - **frame** `Fait` fill×hug — layout=horizontal(défaut), gap=14, align=center, pad=13/0, stroke=$parch-line {"bottom": 1} inner
      - **frame** `Ico` 30×30 fill=#e0552c14 — layout=horizontal(défaut), justify=center, align=center, radius=99
        - *icon* `map-pin` 15×15 fill=$ember
      - **frame** `Txt` fill×hug — layout=vertical, gap=2
        - **T** « Gymnase Robert Pras » — $body · 14.5px · w500 · lh 1.4 · $parch · fixed-width 300
        - **T** « 3 rue Jean Monnet · 63100 Clermont-Ferrand » — $body · 12px · wnormal · lh 1.4 · $parch-mute · fixed-width 300
    - **frame** `Fait` fill×hug — layout=horizontal(défaut), gap=14, align=center, pad=13/0, stroke=$parch-line {"bottom": 1} inner
      - **frame** `Ico` 30×30 fill=#e0552c14 — layout=horizontal(défaut), justify=center, align=center, radius=99
        - *icon* `clock` 15×15 fill=$ember
      - **frame** `Txt` fill×hug — layout=vertical, gap=2
        - **T** « Mar 18h–20h · Jeu 18h–22h » — $body · 14.5px · w500 · lh 1.4 · $parch · fixed-width 300
        - **T** « Tous niveaux, débutants bienvenus » — $body · 12px · wnormal · lh 1.4 · $parch-mute · fixed-width 300
    - **frame** `Fait` fill×hug — layout=horizontal(défaut), gap=14, align=center, pad=13/0, stroke=$parch-line {"bottom": 1} inner
      - **frame** `Ico` 30×30 fill=#e0552c14 — layout=horizontal(défaut), justify=center, align=center, radius=99
        - *icon* `euro` 15×15 fill=$ember
      - **frame** `Txt` fill×hug — layout=vertical, gap=2
        - **T** « 85 € / an ensuite » — $body · 14.5px · w500 · lh 1.4 · $parch · fixed-width 300
        - **T** « Un masque, des gants coqués — c'est tout » — $body · 12px · wnormal · lh 1.4 · $parch-mute · fixed-width 300
    - **frame** `Fait` fill×hug — layout=horizontal(défaut), gap=14, align=center, pad=13/0, stroke=$parch-line {"bottom": 1} inner
      - **frame** `Ico` 30×30 fill=#e0552c14 — layout=horizontal(défaut), justify=center, align=center, radius=99
        - *icon* `phone` 15×15 fill=$ember
      - **frame** `Txt` fill×hug — layout=vertical, gap=2
        - **T** « 06 61 28 65 11 » — $body · 14.5px · w500 · lh 1.4 · $parch · fixed-width 300
        - **T** « amhe63.dfda@gmail.com » — $body · 12px · wnormal · lh 1.4 · $parch-mute · fixed-width 300
  - **frame** `esp` 10×24 — layout=none
  - **frame** `Btn Venir essayer` fill×52 fill=$ember — layout=horizontal(défaut), gap=10, justify=center, align=center, radius=2
    - **T** « VENIR ESSAYER » — $body · 11.5px · w600 · ls 1.8 · $ink
    - *icon* `arrow-right` 12×12 fill=$ink
  - **frame** `esp` 10×10 — layout=none
  - **frame** `Btn Itinéraire` fill×46 — layout=horizontal(défaut), gap=10, justify=center, align=center, radius=2, stroke=#ece8de47 1 inner
    - **T** « ITINÉRAIRE » — $body · 11.5px · w500 · ls 1.8 · $parch
    - *icon* `navigation` 12×12 fill=$parch

### 4.7 — Section « 07 · Galerie »

**Layout** — `$ink`, `padding: 56 0 60 0`, filet haut. Tête `05 · EN IMAGES` **avec** indicateur `GLISSER`.

**`Filmstrip`** — frame 390×**172**, `layout: none`, `clip`. Quatre vignettes **236×172** aux x **22, 270, 518, 766** (gouttière 12), rayon 3, `clip`.

Structure d'une vignette : rect `img` `cover`, rect `voile` 236×**44** ancré en bas (`#08070a80`), légende `$display` **12** / italic / `$parch` positionnée @12,146.

| Vignette | Image | Légende |
|---|---|---|
| 1 | `galerie-1.jpg` | `À l'assaut` |
| 2 | `galerie-2.jpg` | `Montferrand` *(libellé raccourci par rapport au desktop)* |
| 3 | `galerie-5.jpg` | `Combat viking` |
| 4 | `galerie-4.jpg` | `En garde` |

**Deux images du desktop sont absentes du mobile** : `galerie-3.jpg` (« Au contact ») et `galerie-6.jpg` (« Le duel »).

**`Lien FB`** — rangée centrée, `padding-top: 20`, `gap: 8` : `SUIVRE SUR FACEBOOK` (`$eyebrow` 10 / w600 / ls 1.8 / `$parch-soft`) + **`arrow-up-right`** 11 px (icône de lien externe, contrairement au bouton desktop qui utilise `arrow-right`).

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=56/0/60/0, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (8 nœuds texte) :*

- **frame** `Tête En images` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=0/22/18/22
  - **frame** `Eyebrow En images` hug — layout=horizontal(défaut), gap=10, align=center
    - **T** « 05 » — $eyebrow · 10.5px · w600 · ls 2.6 · $ember
    - *icon* `diamond` 6×6 fill=$ember
    - **T** « EN IMAGES » — $eyebrow · 10.5px · w600 · ls 2.6 · $parch-soft
  - **frame** `Swipe` hug — layout=horizontal(défaut), gap=6, align=center
    - **T** « GLISSER » — $eyebrow · 9px · w600 · ls 2 · $parch-mute
    - *icon* `chevrons-right` 12×12 fill=$parch-mute
- **frame** `Filmstrip` 390×172 — layout=none, clip
  - **frame** `Photo À l'assaut` 236×172 @22,0 — layout=none, radius=3, clip
    - rect `img` 236×172 @0,0 img=`maquette-assets/galerie-1.jpg` (mode fill)
    - rect `voile` 236×44 @0,128 fill=#08070a80
    - **T** « À l'assaut » — $display · 12px · wnormal · italic · $parch @12,146
  - **frame** `Photo Montferrand` 236×172 @270,0 — layout=none, radius=3, clip
    - rect `img` 236×172 @0,0 img=`maquette-assets/galerie-2.jpg` (mode fill)
    - rect `voile` 236×44 @0,128 fill=#08070a80
    - **T** « Montferrand » — $display · 12px · wnormal · italic · $parch @12,146
  - **frame** `Photo Combat viking` 236×172 @518,0 — layout=none, radius=3, clip
    - rect `img` 236×172 @0,0 img=`maquette-assets/galerie-5.jpg` (mode fill)
    - rect `voile` 236×44 @0,128 fill=#08070a80
    - **T** « Combat viking » — $display · 12px · wnormal · italic · $parch @12,146
  - **frame** `Photo En garde` 236×172 @766,0 — layout=none, radius=3, clip
    - rect `img` 236×172 @0,0 img=`maquette-assets/galerie-4.jpg` (mode fill)
    - rect `voile` 236×44 @0,128 fill=#08070a80
    - **T** « En garde » — $display · 12px · wnormal · italic · $parch @12,146
- **frame** `Lien FB` fill×hug — layout=horizontal(défaut), gap=8, justify=center, align=center, pad=20/0/0/0
  - **T** « SUIVRE SUR FACEBOOK » — $eyebrow · 10px · w600 · ls 1.8 · $parch-soft
  - *icon* `arrow-up-right` 11×11 fill=$parch-soft

### 4.8 — Section « 08 · FAQ »

**Layout** — `$ink`, `padding: 56 0 60 0`, filet haut. Tête `06 · QUESTIONS`. Bloc `Contenu` en `padding: 0 22`.

**`Items`** — colonne à filet haut `#ece8de38`, **trois questions seulement**, toutes à l'état fermé : rangée `space_between`, `align: center`, `padding: 18 4`, filet bas ; question `$body` 14.5 / w500 / lh 1.4 / `$parch` (largeur 306) + icône `plus` 13 px `$parch-soft`.

1. `Faut-il déjà faire du sport ou de l'escrime ?`
2. `C'est dangereux ?`
3. `À quoi ressemble une séance ?`

**`Toutes`** — rangée `gap: 8`, `padding: 20 4 0 4` : `TOUTES LES QUESTIONS` (`$eyebrow` 10 / w600 / ls 1.8 / **`$ember`**) + `arrow-right` 11 px `$ember`. Ce lien implique **une page FAQ dédiée** (non maquettée) ou l'expansion in-place des 8 questions.

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=56/0/60/0, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (6 nœuds texte) :*

- **frame** `Tête Questions` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=0/22/18/22
  - **frame** `Eyebrow Questions` hug — layout=horizontal(défaut), gap=10, align=center
    - **T** « 06 » — $eyebrow · 10.5px · w600 · ls 2.6 · $ember
    - *icon* `diamond` 6×6 fill=$ember
    - **T** « QUESTIONS » — $eyebrow · 10.5px · w600 · ls 2.6 · $parch-soft
- **frame** `Contenu` fill×hug — layout=vertical, pad=0/22
  - **frame** `Items` fill×hug — layout=vertical, stroke=#ece8de38 {"top": 1} inner
    - **frame** `Q1` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=18/4, stroke=#ece8de38 {"bottom": 1} inner
      - **T** « Faut-il déjà faire du sport ou de l'escrime ? » — $body · 14.5px · w500 · lh 1.4 · $parch · fixed-width 306
      - *icon* `plus` 13×13 fill=$parch-soft
    - **frame** `Q2` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=18/4, stroke=#ece8de38 {"bottom": 1} inner
      - **T** « C'est dangereux ? » — $body · 14.5px · w500 · lh 1.4 · $parch · fixed-width 306
      - *icon* `plus` 13×13 fill=$parch-soft
    - **frame** `Q3` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=18/4, stroke=#ece8de38 {"bottom": 1} inner
      - **T** « À quoi ressemble une séance ? » — $body · 14.5px · w500 · lh 1.4 · $parch · fixed-width 306
      - *icon* `plus` 13×13 fill=$parch-soft
  - **frame** `Toutes` hug — layout=horizontal(défaut), gap=8, align=center, pad=20/4/0/4
    - **T** « TOUTES LES QUESTIONS » — $eyebrow · 10px · w600 · ls 1.8 · $ember
    - *icon* `arrow-right` 11×11 fill=$ember

### 4.9 — Section « 09 · Partenaires »

**Layout** — `$coal`, `padding: **44** 0 **48** 0` (le plus court du mobile), filet haut. **Pas de tête de section numérotée** — la section n'a pas d'eyebrow `07`.

`Contenu` en `padding: 0 22`, colonne `align: center` :
- `ILS NOUS ACCOMPAGNENT` — `$eyebrow` 10 / w600 / ls 2.6 / `$parch-mute`, centré, largeur 346
- `esp 20`
- `Logos` — rangée `gap: 22` centrée, trois frames **96×52** en **`mode fit`** : `logo_signature_FFAMHE.png`, `Fait-d'arme-logo.png`, `black-armoury-logo.jpg`

**Toute la partie éditoriale des partenaires (catégorie, nom, texte long, bouton) disparaît sur mobile** : il ne reste qu'une bande de logos.

**Conteneur** — `fill×hug` fill=$coal — layout=vertical, pad=44/0/48/0, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (1 nœuds texte) :*

- **frame** `Contenu` fill×hug — layout=vertical, align=center, pad=0/22
  - **T** « ILS NOUS ACCOMPAGNENT » — $eyebrow · 10px · w600 · ls 2.6 · $parch-mute · align center · fixed-width 346
  - **frame** `esp` 10×20 — layout=none
  - **frame** `Logos` fill×hug — layout=horizontal(défaut), gap=22, justify=center, align=center
    - **frame** `Logo 0` 96×52 img=`public/assets/logo_signature_FFAMHE.png` (mode fit) — layout=none
    - **frame** `Logo 1` 96×52 img=`public/assets/Fait-d'arme-logo.png` (mode fit) — layout=none
    - **frame** `Logo 2` 96×52 img=`public/assets/black-armoury-logo.jpg` (mode fit) — layout=none

### 4.10 — Section « Footer »

**Layout** — `$ink`, `padding: 40 22 28 22`, filet haut, colonne. Quatre blocs séparés par des `esp`.

1. **`Marquee`** — rangée `gap: 8`, centrée, `align: end` : logotype en `$display` **34** (contre 115 en desktop), mêmes couleurs (`$parch` / `$feu` / `$parch` italic / `$acier`). **Aucun `lineHeight` déclaré sur ces quatre nœuds** (contrairement au desktop qui impose `lh 0.9`).
2. `esp 14`, **`Contact`** — rangée centrée `gap: 10` : `amhe63.dfda@gmail.com` + rect `pt` 3×3 `$ember` (rayon 99, point de séparation) + `06 61 28 65 11`, tous deux `$body` 12 / `$parch-soft`.
3. `esp 18`, **`Réseaux`** — rangée centrée `gap: 10`, trois pastilles 34×34 (`radius: 99`, bordure `$parch-line`) avec icônes 13 px `$parch-mute` : `facebook`, `trophy` (HEMA Ratings), `shield` (FFAMHE).
4. `esp 22`, **`Légal`** — colonne `gap: 6`, `align: center` : `© 2026 · DE FEU ET D'ACIER · CLERMONT-FERRAND` puis `MENTIONS LÉGALES · CONFIDENTIALITÉ`, tous deux `$eyebrow` 8.5 / w500 / ls 1.8 / `$parch-mute`, centrés, largeur 346.

**Les quatre colonnes de liens du footer desktop n'existent pas sur mobile** (la tab-bar les remplace).

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=40/22/28/22, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (8 nœuds texte) :*

- **frame** `Marquee` fill×hug — layout=horizontal(défaut), gap=8, justify=center, align=end
  - **T** « De » — $display · 34px · w500 · $parch
  - **T** « Feu » — $display · 34px · w500 · $feu
  - **T** « et d' » — $display · 34px · w300 · italic · $parch
  - **T** « Acier » — $display · 34px · w500 · $acier
- **frame** `esp` 10×14 — layout=none
- **frame** `Contact` fill×hug — layout=horizontal(défaut), gap=10, justify=center, align=center
  - **T** « amhe63.dfda@gmail.com » — $body · 12px · wnormal · $parch-soft
  - rect `pt` 3×3 fill=$ember radius=99
  - **T** « 06 61 28 65 11 » — $body · 12px · wnormal · $parch-soft
- **frame** `esp` 10×18 — layout=none
- **frame** `Réseaux` fill×hug — layout=horizontal(défaut), gap=10, justify=center, align=center
  - **frame** `S0` 34×34 — layout=horizontal(défaut), justify=center, align=center, radius=99, stroke=$parch-line 1 inner
    - *icon* `facebook` 13×13 fill=$parch-mute
  - **frame** `S1` 34×34 — layout=horizontal(défaut), justify=center, align=center, radius=99, stroke=$parch-line 1 inner
    - *icon* `trophy` 13×13 fill=$parch-mute
  - **frame** `S2` 34×34 — layout=horizontal(défaut), justify=center, align=center, radius=99, stroke=$parch-line 1 inner
    - *icon* `shield` 13×13 fill=$parch-mute
- **frame** `esp` 10×22 — layout=none
- **frame** `Légal` fill×hug — layout=vertical, gap=6, align=center
  - **T** « © 2026 · DE FEU ET D'ACIER · CLERMONT-FERRAND » — $eyebrow · 8.5px · w500 · ls 1.8 · $parch-mute · align center · fixed-width 346
  - **T** « MENTIONS LÉGALES · CONFIDENTIALITÉ » — $eyebrow · 8.5px · w500 · ls 1.8 · $parch-mute · align center · fixed-width 346

---

## 5. Gabarit « Fiche arme » — `V2 — Fiche arme (desktop)` / `(mobile)`

Page de détail d'une discipline. Elle est **maquettée une seule fois, sur l'exemple « Épée longue »** : tous les contenus sont donc à considérer comme des variables d'un gabarit unique appliqué aux 4 (ou 5) armes.

### 5.1 Structure desktop (1440)

| # | Bloc | Layout | Fond |
|---|---|---|---|
| 1 | `Fil d'Ariane` | rangée `space_between`, `padding: 22 56`, filet bas | transparent (`$ink` hérité) |
| 2 | `Hero fiche` | rangée `gap: 100`, `align: center`, `padding: 72 56 88 56` | transparent |
| 3 | `Mini-cours` | colonne, `padding: 0 56 96 56` | transparent |
| 4 | `Source wrap` | colonne, `padding: 0 56 96 56` | transparent |
| 5 | `Bande CTA` | colonne `align: center`, `padding: 80 56 96 56`, filet haut | transparent |

**Aucune section n'a de fond propre** : la page entière est en `$ink`. Le rythme repose uniquement sur les filets et l'espacement.

**1 · Fil d'Ariane** — à gauche `arrow-left` 16 px + `RETOUR` (`$eyebrow` 10.5 / w600 / ls 2.2 / `$parch`) ; à droite le chemin en `gap: 12` : `LES ARMES` (`$parch-mute` w500) · `/` (`$body` 10.5 `$parch-mute`) · `ÉPÉE LONGUE` (`$parch` w600).

**2 · Hero fiche** — colonne texte de **640** à gauche, photo **588×660** (rayon 3, `cover`) à droite.
Texte : ligne `Era` (rect 22×1 `$ember` + `MÉDIÉVALE` `$ember` + `·` + `XIVᵉ — XVᵉ S.` `$parch-mute`), `esp 22`, H1 `$display` **90** / lh 0.9, `esp 14`, sous-titre `$body` 18 / lh 1.4 / `$parch-soft`, `esp 28`, description `$body` 17 / lh 1.7 / `$parch-soft` largeur 600, `esp 40`, deux CTA `gap: 16` :
- **primaire** `ESSAYER CETTE ARME` — hug×**50**, fond `$ember`, texte `$ink` w600, `padding: 0 32`
- **secondaire** `VOIR LE MINI-COURS` — hug×50, bordure `#ece8de47`, `padding: 0 28`

**3 · Mini-cours** — en-tête `Tête` (filet bas, `padding-bottom: 22`) : `LE MINI-COURS` (`$eyebrow` 10.5 / w600 / ls 3 / `$ember`) + `diamond` 6 px + `EXTRAITS · NIVEAU DÉBUTANT` (`$parch-mute` w500 ls 2.2). `esp 36`, puis `Vidéos` : rangée `gap: 24`, trois cartes de **426.7**.

**Carte leçon vidéo** (voir pattern §9.9) : vignette 426.7×250 (rayon 3, `clip`) = image `cover` + voile `#08070a66` + pastille `Play` 54×54 (`$parch`, rayon 99, icône `play` 20 px `$ink`) centrée @186.3,98 + badge `Durée` (`#0a0908cc`, `padding: 4 9`, rayon 99, `$body` 9.5 / w600 / ls 0.5) ancré @360.7,218 ; puis `esp 14`, titre `$body` 16 / w500 / lh 1.3 / `$parch`, sous-titre `$eyebrow` 9.5 / w600 / ls 1.8 / `$parch-mute`.

| # | Vignette | Durée | Titre | Sous-titre |
|---|---|---|---|---|
| 01 | `galerie-1.jpg` | `04:12` | `Leçon 01 — Les gardes` | `BASES · POSTURE & DISTANCES` |
| 02 | `galerie-3.jpg` | `06:48` | `Leçon 02 — Taille & pointe` | `COUPS FONDAMENTAUX` |
| 03 | `galerie-6.jpg` | `05:31` | `Leçon 03 — Le sentiment du fer` | `LIENS & PRISES DE FER` |

**4 · Source wrap** — `Carte source` : rangée `gap: 48`, `align: center`, `padding: 36 40`, fond `#ece8de06`, rayon 3, bordure `$parch-line`. Vignette `Traité` 170×200 (`public/assets/treatise.jpg`, `cover`) + colonne `gap: 12` : `LA SOURCE` (`$ember` ls 3), `Des traités aux assauts.` (`$display` 30 / lh 1.1), texte `$body` 14.5 / lh 1.6 / `$parch-mute` largeur 560, lien `ÉTUDIER LA SOURCE` + `arrow-right` (`padding-top: 6`).

**5 · Bande CTA** — colonne centrée : `Envie de tester l'épée longue ?` (`$display` 44 / lh 1.1 / `$parch`), `esp 10`, `Deux premières séances offertes — matériel prêté.` (`$display` 16 / italic / lh 1.3 / `$parch-soft`), `esp 28`, bouton primaire `VENIR ESSAYER` hug×**52**, `padding: 0 40`.

### 5.2 Structure mobile (390)

| # | Bloc | Détail |
|---|---|---|
| 1 | `Hero fiche` | 390×**430**, `layout: none` — image `cover` + voile `#0a090880` + assise 390×190 @0,240 `#0a0908d9` ; barre haute avec pastille ronde `Back` 36×36 (`#0a090880`, bordure `#ece8de38`) et badge `FICHE ARME` ; bloc bas 346 @22,280 avec badge époque `MÉDIÉVALE · XIVᵉ — XVIᵉ S.`, H1 `$display` 42, sous-titre `$body` 13 |
| 2 | `Desc` | `padding: 26 22` — paragraphe `$body` 14.5 / lh 1.6 / `$parch-soft` largeur 346 |
| 3 | `Cours` | `padding: 14 22 36 22` — même en-tête (10 px, ls 2.6), trois cartes empilées (`esp 18` entre elles), vignettes **346×195**, pastille play 46×46, titre `$body` 14 |
| 4 | `Source wrap` | `padding: 0 22 28 22` — carte compacte : vignette 64×80, `LA SOURCE` 8.5 px, titre `$display` 16, lien `ÉTUDIER` — **le paragraphe de la carte source disparaît** |
| 5 | `CTA` | bouton `ESSAYER CETTE ARME` pleine largeur ×52, fond `$ember` |
| 6 | `Tab bar` | onglet actif = **`Armes`** |

**Le fil d'Ariane desktop est remplacé par la pastille `Back` incrustée dans le hero.**

### 5.3 Arbre exhaustif — desktop (`V2 — Fiche arme (desktop)`)

##### Fil d'Ariane

**Conteneur** — `fill×hug` — layout=horizontal(défaut), justify=space_between, align=center, pad=22/56, stroke=$parch-line {"bottom": 1} inner

*Arbre exhaustif (4 nœuds texte) :*

- **frame** `Retour` hug — layout=horizontal(défaut), gap=10, align=center
  - *icon* `arrow-left` 16×16 fill=$parch
  - **T** « RETOUR » — $eyebrow · 10.5px · w600 · ls 2.2 · $parch
- **frame** `Chemin` hug — layout=horizontal(défaut), gap=12, align=center
  - **T** « LES ARMES » — $eyebrow · 10.5px · w500 · ls 2.2 · $parch-mute
  - **T** « / » — $body · 10.5px · wnormal · $parch-mute
  - **T** « ÉPÉE LONGUE » — $eyebrow · 10.5px · w600 · ls 2.2 · $parch

##### Hero fiche

**Conteneur** — `fill×hug` — layout=horizontal(défaut), gap=100, align=center, pad=72/56/88/56

*Arbre exhaustif (8 nœuds texte) :*

- **frame** `Texte` 640×hug — layout=vertical
  - **frame** `Era` hug — layout=horizontal(défaut), gap=10, align=center
    - rect `tiret` 22×1 fill=$ember
    - **T** « MÉDIÉVALE » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
    - **T** « · » — $body · 10.5px · wnormal · $parch-mute
    - **T** « XIVᵉ — XVᵉ S. » — $body · 10.5px · wnormal · ls 2 · $parch-mute
  - **frame** `esp` 10×22 — layout=none
  - **T** « Épée longue » — $display · 90px · lh 0.9 · $parch
  - **frame** `esp` 10×14 — layout=none
  - **T** « Arme emblématique des AMHE » — $body · 18px · wnormal · lh 1.4 · $parch-soft
  - **frame** `esp` 10×28 — layout=none
  - **T** « Pratiquée à deux mains, l'épée longue est l'arme emblématique des AMHE. Nous pratiquons la tradition germanique de Maitre Johannes Liechtenauer et de ses glossateurs. Structure, explosivité, versatilité, de taille comme de pointe, ce sont les maitres mots de cette arme. » — $body · 17px · wnormal · lh 1.7 · $parch-soft · fixed-width 600
  - **frame** `esp` 10×40 — layout=none
  - **frame** `CTAs` hug — layout=horizontal(défaut), gap=16
    - **frame** `Btn Essayer cette arme` hug×50 fill=$ember — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/32, radius=2
      - **T** « ESSAYER CETTE ARME » — $body · 11.5px · w600 · ls 1.8 · $ink
      - *icon* `arrow-right` 11×11 fill=$ink
    - **frame** `Btn Voir le mini-cours` hug×50 — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/28, radius=2, stroke=#ece8de47 1 inner
      - **T** « VOIR LE MINI-COURS » — $body · 11.5px · w500 · ls 1.8 · $parch
      - *icon* `arrow-right` 11×11 fill=$parch
- **frame** `Photo arme` 588×660 img=`maquette-assets/disc-epee-longue.jpg` (mode fill) — layout=none, radius=3

##### Mini-cours

**Conteneur** — `fill×hug` — layout=vertical, pad=0/56/96/56

*Arbre exhaustif (11 nœuds texte) :*

- **frame** `Tête` fill×hug — layout=horizontal(défaut), pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
  - **frame** `l` hug — layout=horizontal(défaut), gap=12, align=center
    - **T** « LE MINI-COURS » — $eyebrow · 10.5px · w600 · ls 3 · $ember
    - *icon* `diamond` 6×6 fill=$ember
    - **T** « EXTRAITS · NIVEAU DÉBUTANT » — $eyebrow · 10.5px · w500 · ls 2.2 · $parch-mute
- **frame** `esp` 10×36 — layout=none
- **frame** `Vidéos` fill×hug — layout=horizontal(défaut), gap=24
  - **frame** `Carte Leçon 01 — Les gardes` 426.7×hug — layout=vertical, gap=4
    - **frame** `Vidéo` 426.7×250 — layout=none, radius=3, clip
      - rect `thumb` 426.7×250 @0,0 img=`maquette-assets/galerie-1.jpg` (mode fill)
      - rect `veil` 426.7×250 @0,0 fill=#08070a66
      - **frame** `play` 54×54 @186.3,98 — layout=none
        - **frame** `Play` 54×54 @0,0 fill=$parch — layout=horizontal(défaut), justify=center, align=center, radius=99
          - *icon* `play` 20×20 fill=$ink
      - **frame** `dur` 54×22 @360.7,218 — layout=none
        - **frame** `Durée` hug @0,0 fill=#0a0908cc — layout=horizontal(défaut), pad=4/9, radius=99
          - **T** « 04:12 » — $body · 9.5px · w600 · ls 0.5 · $parch
    - **frame** `esp` 10×14 — layout=none
    - **T** « Leçon 01 — Les gardes » — $body · 16px · w500 · lh 1.3 · $parch
    - **T** « BASES · POSTURE & DISTANCES » — $eyebrow · 9.5px · w600 · ls 1.8 · $parch-mute
  - **frame** `Carte Leçon 02 — Taille & pointe` 426.7×hug — layout=vertical, gap=4
    - **frame** `Vidéo` 426.7×250 — layout=none, radius=3, clip
      - rect `thumb` 426.7×250 @0,0 img=`maquette-assets/galerie-3.jpg` (mode fill)
      - rect `veil` 426.7×250 @0,0 fill=#08070a66
      - **frame** `play` 54×54 @186.3,98 — layout=none
        - **frame** `Play` 54×54 @0,0 fill=$parch — layout=horizontal(défaut), justify=center, align=center, radius=99
          - *icon* `play` 20×20 fill=$ink
      - **frame** `dur` 54×22 @360.7,218 — layout=none
        - **frame** `Durée` hug @0,0 fill=#0a0908cc — layout=horizontal(défaut), pad=4/9, radius=99
          - **T** « 06:48 » — $body · 9.5px · w600 · ls 0.5 · $parch
    - **frame** `esp` 10×14 — layout=none
    - **T** « Leçon 02 — Taille & pointe » — $body · 16px · w500 · lh 1.3 · $parch
    - **T** « COUPS FONDAMENTAUX » — $eyebrow · 9.5px · w600 · ls 1.8 · $parch-mute
  - **frame** `Carte Leçon 03 — Le sentiment du fer` 426.7×hug — layout=vertical, gap=4
    - **frame** `Vidéo` 426.7×250 — layout=none, radius=3, clip
      - rect `thumb` 426.7×250 @0,0 img=`maquette-assets/galerie-6.jpg` (mode fill)
      - rect `veil` 426.7×250 @0,0 fill=#08070a66
      - **frame** `play` 54×54 @186.3,98 — layout=none
        - **frame** `Play` 54×54 @0,0 fill=$parch — layout=horizontal(défaut), justify=center, align=center, radius=99
          - *icon* `play` 20×20 fill=$ink
      - **frame** `dur` 54×22 @360.7,218 — layout=none
        - **frame** `Durée` hug @0,0 fill=#0a0908cc — layout=horizontal(défaut), pad=4/9, radius=99
          - **T** « 05:31 » — $body · 9.5px · w600 · ls 0.5 · $parch
    - **frame** `esp` 10×14 — layout=none
    - **T** « Leçon 03 — Le sentiment du fer » — $body · 16px · w500 · lh 1.3 · $parch
    - **T** « LIENS & PRISES DE FER » — $eyebrow · 9.5px · w600 · ls 1.8 · $parch-mute

##### Source wrap

**Conteneur** — `fill×hug` — layout=vertical, pad=0/56/96/56

*Arbre exhaustif (4 nœuds texte) :*

- **frame** `Carte source` fill×hug fill=#ece8de06 — layout=horizontal(défaut), gap=48, align=center, pad=36/40, radius=3, stroke=$parch-line 1 inner
  - **frame** `Traité` 170×200 img=`public/assets/treatise.jpg` (mode fill) — layout=none
  - **frame** `Texte source` fill×hug — layout=vertical, gap=12
    - **T** « LA SOURCE » — $eyebrow · 10.5px · w600 · ls 3 · $ember
    - **T** « Des traités aux assauts. » — $display · 30px · wnormal · lh 1.1 · $parch
    - **T** « Chaque leçon s'appuie sur les sources historiques étudiées en salle, puis éprouvées en assaut. » — $body · 14.5px · wnormal · lh 1.6 · $parch-mute · fixed-width 560
    - **frame** `Lien` hug — layout=horizontal(défaut), gap=10, align=center, pad=6/0/0/0
      - **T** « ÉTUDIER LA SOURCE » — $eyebrow · 10.5px · w600 · ls 1.8 · $parch
      - *icon* `arrow-right` 11×11 fill=$parch

##### Bande CTA

**Conteneur** — `fill×hug` — layout=vertical, align=center, pad=80/56/96/56, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (3 nœuds texte) :*

- **T** « Envie de tester l'épée longue ? » — $display · 44px · wnormal · lh 1.1 · $parch
- **frame** `esp` 10×10 — layout=none
- **T** « Deux premières séances offertes — matériel prêté. » — $display · 16px · wnormal · italic · lh 1.3 · $parch-soft
- **frame** `esp` 10×28 — layout=none
- **frame** `Btn Venir essayer` hug×52 fill=$ember — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/40, radius=2
  - **T** « VENIR ESSAYER » — $body · 11.5px · w600 · ls 1.8 · $ink
  - *icon* `arrow-right` 11×11 fill=$ink

### 5.4 Arbre exhaustif — mobile (`V2 — Fiche arme (mobile)`)

##### Hero fiche

**Conteneur** — `390×430` — layout=none, clip

*Arbre exhaustif (4 nœuds texte) :*

- rect `img` 390×430 @0,0 img=`maquette-assets/disc-epee-longue.jpg` (mode fill)
- rect `voile` 390×430 @0,0 fill=#0a090880
- rect `assise` 390×190 @0,240 fill=#0a0908d9
- **frame** `Barre retour` 390×hug @0,0 — layout=horizontal(défaut), justify=space_between, align=center, pad=14/18
  - **frame** `Back` 36×36 fill=#0a090880 — layout=horizontal(défaut), justify=center, align=center, radius=99, stroke=#ece8de38 1 inner
    - *icon* `arrow-left` 15×15 fill=$parch
  - **frame** `Tag` hug fill=#0a0908a6 — layout=horizontal(défaut), pad=6/11, radius=99, stroke=#ece8de38 1 inner
    - **T** « FICHE ARME » — $eyebrow · 9px · w600 · ls 1.8 · $parch
- **frame** `Bas` 346×hug @22,280 — layout=vertical, gap=4
  - **frame** `Époque` hug fill=#0a0908a6 — layout=horizontal(défaut), pad=6/10, radius=99, stroke=#ece8de38 1 inner
    - **T** « MÉDIÉVALE · XIVᵉ — XVᵉ S. » — $eyebrow · 9px · w600 · ls 1.6 · $parch
  - **frame** `esp` 10×10 — layout=none
  - **T** « Épée longue » — $display · 42px · wnormal · lh 1 · $parch
  - **T** « Arme emblématique des AMHE » — $body · 13px · wnormal · lh 1.4 · $parch-soft · fixed-width 346

##### Desc

**Conteneur** — `fill×hug` — layout=vertical, pad=26/22

*Arbre exhaustif (1 nœuds texte) :*

- **T** « Pratiquée à deux mains, l'épée longue est l'arme emblématique des AMHE. Nous pratiquons la tradition germanique de Maitre Johannes Liechtenauer et de ses glossateurs. Structure, explosivité, versatilité, de taille comme de pointe, ce sont les maitres mots de cette arme. » — $body · 14.5px · wnormal · lh 1.6 · $parch-soft · fixed-width 346

##### Cours

**Conteneur** — `fill×hug` — layout=vertical, pad=14/22/36/22

*Arbre exhaustif (11 nœuds texte) :*

- **frame** `Tête` fill×hug — layout=horizontal(défaut), pad=0/0/16/0, stroke=$parch-line {"bottom": 1} inner
  - **frame** `l` hug — layout=horizontal(défaut), gap=10, align=center
    - **T** « LE MINI-COURS » — $eyebrow · 10px · w600 · ls 2.6 · $ember
    - *icon* `diamond` 6×6 fill=$ember
    - **T** « DÉBUTANT » — $eyebrow · 10px · w500 · ls 2 · $parch-mute
- **frame** `esp` 10×20 — layout=none
- **frame** `Carte Leçon 01 — Les gardes` fill×hug — layout=vertical, gap=3
  - **frame** `Vidéo` 346×195 — layout=none, radius=3, clip
    - rect `thumb` 346×195 @0,0 img=`maquette-assets/galerie-1.jpg` (mode fill)
    - rect `veil` 346×195 @0,0 fill=#08070a66
    - **frame** `play` 46×46 @150,74.5 — layout=none
      - **frame** `Play` 46×46 @0,0 fill=$parch — layout=horizontal(défaut), justify=center, align=center, radius=99
        - *icon* `play` 17×17 fill=$ink
    - **frame** `dur` 54×22 @280,163 — layout=none
      - **frame** `Durée` hug @0,0 fill=#0a0908cc — layout=horizontal(défaut), pad=4/9, radius=99
        - **T** « 04:12 » — $body · 9.5px · w600 · ls 0.5 · $parch
  - **frame** `esp` 10×8 — layout=none
  - **T** « Leçon 01 — Les gardes » — $body · 14px · w500 · lh 1.3 · $parch
  - **T** « BASES · POSTURE & DISTANCES » — $eyebrow · 8.5px · w600 · ls 1.6 · $parch-mute
- **frame** `esp` 10×18 — layout=none
- **frame** `Carte Leçon 02 — Taille & pointe` fill×hug — layout=vertical, gap=3
  - **frame** `Vidéo` 346×195 — layout=none, radius=3, clip
    - rect `thumb` 346×195 @0,0 img=`maquette-assets/galerie-3.jpg` (mode fill)
    - rect `veil` 346×195 @0,0 fill=#08070a66
    - **frame** `play` 46×46 @150,74.5 — layout=none
      - **frame** `Play` 46×46 @0,0 fill=$parch — layout=horizontal(défaut), justify=center, align=center, radius=99
        - *icon* `play` 17×17 fill=$ink
    - **frame** `dur` 54×22 @280,163 — layout=none
      - **frame** `Durée` hug @0,0 fill=#0a0908cc — layout=horizontal(défaut), pad=4/9, radius=99
        - **T** « 06:48 » — $body · 9.5px · w600 · ls 0.5 · $parch
  - **frame** `esp` 10×8 — layout=none
  - **T** « Leçon 02 — Taille & pointe » — $body · 14px · w500 · lh 1.3 · $parch
  - **T** « COUPS FONDAMENTAUX » — $eyebrow · 8.5px · w600 · ls 1.6 · $parch-mute
- **frame** `esp` 10×18 — layout=none
- **frame** `Carte Leçon 03 — Le sentiment du fer` fill×hug — layout=vertical, gap=3
  - **frame** `Vidéo` 346×195 — layout=none, radius=3, clip
    - rect `thumb` 346×195 @0,0 img=`maquette-assets/galerie-6.jpg` (mode fill)
    - rect `veil` 346×195 @0,0 fill=#08070a66
    - **frame** `play` 46×46 @150,74.5 — layout=none
      - **frame** `Play` 46×46 @0,0 fill=$parch — layout=horizontal(défaut), justify=center, align=center, radius=99
        - *icon* `play` 17×17 fill=$ink
    - **frame** `dur` 54×22 @280,163 — layout=none
      - **frame** `Durée` hug @0,0 fill=#0a0908cc — layout=horizontal(défaut), pad=4/9, radius=99
        - **T** « 05:31 » — $body · 9.5px · w600 · ls 0.5 · $parch
  - **frame** `esp` 10×8 — layout=none
  - **T** « Leçon 03 — Le sentiment du fer » — $body · 14px · w500 · lh 1.3 · $parch
  - **T** « LIENS & PRISES DE FER » — $eyebrow · 8.5px · w600 · ls 1.6 · $parch-mute

##### Source wrap

**Conteneur** — `fill×hug` — layout=vertical, pad=0/22/28/22

*Arbre exhaustif (3 nœuds texte) :*

- **frame** `Carte source` fill×hug fill=#ece8de06 — layout=horizontal(défaut), gap=16, align=center, pad=16, radius=3, stroke=$parch-line 1 inner
  - **frame** `Traité` 64×80 img=`public/assets/treatise.jpg` (mode fill) — layout=none
  - **frame** `Texte` fill×hug — layout=vertical, gap=6
    - **T** « LA SOURCE » — $eyebrow · 8.5px · w600 · ls 2 · $ember
    - **T** « Des traités aux assauts. » — $display · 16px · wnormal · lh 1.1 · $parch
    - **frame** `Lien` hug — layout=horizontal(défaut), gap=6, align=center
      - **T** « ÉTUDIER » — $eyebrow · 8.5px · w600 · ls 1.6 · $parch
      - *icon* `arrow-right` 9×9 fill=$parch

##### CTA

**Conteneur** — `fill×hug` — layout=vertical, pad=0/22/28/22

*Arbre exhaustif (1 nœuds texte) :*

- **frame** `Btn Essayer cette arme` fill×52 fill=$ember — layout=horizontal(défaut), gap=10, justify=center, align=center, radius=2
  - **T** « ESSAYER CETTE ARME » — $body · 11.5px · w600 · ls 1.8 · $ink
  - *icon* `arrow-right` 12×12 fill=$ink

##### Tab bar

**Conteneur** — `390×80` fill=#0a0908f2 — layout=horizontal(défaut), justify=space_between, align=end, pad=0/10/8/10, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (5 nœuds texte) :*

- **frame** `Tab Accueil` 72×66 — layout=vertical, gap=5, justify=center, align=center
  - **frame** `esp` 14×2 — layout=none
  - *icon* `house` 19×19 fill=$parch-mute
  - **T** « ACCUEIL » — $eyebrow · 8px · w600 · ls 1.2 · $parch-mute
- **frame** `Tab Armes` 72×66 — layout=vertical, gap=5, justify=center, align=center
  - rect `marqueur` 14×2 fill=$ember radius=2
  - *icon* `sword` 19×19 fill=$parch
  - **T** « ARMES » — $eyebrow · 8px · w600 · ls 1.2 · $parch
- **frame** `Tab Essayer` 76×hug — layout=vertical, gap=4, align=center
  - **frame** `Rond` 46×46 fill=$ember — layout=horizontal(défaut), justify=center, align=center, radius=99
    - *icon* `swords` 20×20 fill=$ink
  - **T** « ESSAYER » — $eyebrow · 8px · w600 · ls 1.2 · $parch
- **frame** `Tab Photos` 72×66 — layout=vertical, gap=5, justify=center, align=center
  - **frame** `esp` 14×2 — layout=none
  - *icon* `image` 19×19 fill=$parch-mute
  - **T** « PHOTOS » — $eyebrow · 8px · w600 · ls 1.2 · $parch-mute
- **frame** `Tab Contact` 72×66 — layout=vertical, gap=5, justify=center, align=center
  - **frame** `esp` 14×2 — layout=none
  - *icon* `phone` 19×19 fill=$parch-mute
  - **T** « CONTACT » — $eyebrow · 8px · w600 · ls 1.2 · $parch-mute

---

## 6. Gabarit « Fiche prof » — `V2 — Fiche prof (desktop)` / `(mobile)`

Page de détail d'un encadrant, maquettée sur l'exemple **Gabriel Tardio**. Même logique de gabarit unique que la fiche arme.

### 6.1 Structure desktop (1440)

| # | Bloc | Layout |
|---|---|---|
| 1 | `Fil d'Ariane` | identique à la fiche arme — `LES PROFS` / `GABRIEL TARDIO` |
| 2 | `Hero fiche` | rangée `gap: 100`, `padding: 72 56 88 56` (**pas d'`align: center`**, les colonnes partent du haut) |
| 3 | `Interview` | colonne, `padding: 0 56 80 56` |
| 4 | `Bande CTA` | colonne `align: center`, `padding: 80 56 96 56`, filet haut |

**2 · Hero fiche**
- Colonne gauche **500** : `Portrait` 500×**600** (rayon 3, `cover`, `public/assets/Gabriel.jpg`), `esp 20`, bouton secondaire `PROFIL HEMA RATINGS` hug×**48**
- Colonne droite `fill` : eyebrow `ÉPÉE LONGUE` (`$eyebrow` 11 / w600 / **ls 3.2** / `$ember`), `esp 14`, H1 `Gabriel Tardio` (`$display` **80** / lh 1), `esp 16`, accroche `$body` 17 / w500 / lh 1.4 / `$parch`, `esp 26`, rect `filet` 56×1 `$parch-line`, `esp 26`, bio `$body` 17 / lh 1.7 / `$parch-soft` largeur 640, `esp 36`, puis **`Vidéo itw`** : vignette **640×360** (même pattern que les leçons, pastille play 64×64, icône 24 px, durée `06:24`), `esp 12`, légende `L'interview en vidéo` (`$body` 15 / w500 / `$parch`)

**3 · Interview** — `Tête` avec filet bas : `L'INTERVIEW` (`$eyebrow` 10.5 / w600 / ls 3 / `$ember`). `esp 12`, puis `QAs` : colonne de trois blocs `padding: 36 0`, filet haut à partir du 2ᵉ.
Chaque bloc : question `$display` **28** / italic / lh 1.2 / `$parch`, `esp 16`, puis un **placeholder de réponse** — colonne `gap: 8` de trois rect `#ece8de14` (rayon 5, hauteur 10) de largeurs **900 / 860 / 520**.

| # | Question |
|---|---|
| Q1 | `Comment es-tu arrivé aux AMHE ?` |
| Q2 | `Qu'est-ce qu'on apprend à ton cours ?` |
| Q3 | `Un conseil pour une première séance ?` |

**Les réponses ne sont pas rédigées dans la maquette** : les barres grises sont des placeholders. Le gabarit attend donc une liste de couples question/réponse à longueur variable (3 dans la maquette, mais rien n'impose ce nombre).

**4 · Bande CTA** — `S'entraîner avec Gabriel ?` (`$display` 44 / lh 1.1), `esp 10`, `Viens à une séance, il t'accueille.` (`$display` 16 / italic / lh 1.3 / `$parch-soft`), `esp 28`, bouton `VENIR ESSAYER` hug×52 `$ember`. **Le prénom est interpolé dans le titre** → chaîne à paramétrer.

### 6.2 Structure mobile (390)

| # | Bloc | Détail |
|---|---|---|
| 1 | `Hero fiche` | 390×**440** — portrait `cover` + voile `#0a090859` (35 %, le plus léger du site) + assise 390×200 @0,240 `#0a0908d9` ; barre haute `Back` + badge `FICHE PROF` ; bloc bas 346 @22,304 : `ÉPÉE LONGUE` (`$eyebrow` 9.5 / ls 2.2 / `$ember`), `Gabriel Tardio` (`$display` **36** / w500 / lh 1), accroche `$body` 12.5 / w500 |
| 2 | `Bio` | `padding: 26 22` — `$body` 14.5 / lh 1.6 / `$parch-soft` |
| 3 | `Vidéo` | `padding: 0 22 10 22` — vignette 346×195, pastille play 46×46, durée `06:24`, `esp 8`, légende `$body` 14 / w500 |
| 4 | `Interview` | `padding: 18 22 20 22` — en-tête `L'INTERVIEW` (10 px, ls 2.6) ; trois blocs `padding: 24 0`, question `$display` **20** italic largeur 346, placeholders 346 / 306 / 190 × 8 px |
| 5 | `CTAs` | deux boutons pleine largeur : `PROFIL HEMA RATINGS` (bordure, ×46, icône **`arrow-up-right`**) puis `VENIR ESSAYER` (`$ember`, ×52) |
| 6 | `Tab bar` | onglet actif = **`Contact`** — *incohérence probable : sur une fiche prof, `Accueil` ou `Armes` serait plus logique* |

### 6.3 Arbre exhaustif — desktop (`V2 — Fiche prof (desktop)`)

##### Fil d'Ariane

**Conteneur** — `fill×hug` — layout=horizontal(défaut), justify=space_between, align=center, pad=22/56, stroke=$parch-line {"bottom": 1} inner

*Arbre exhaustif (4 nœuds texte) :*

- **frame** `Retour` hug — layout=horizontal(défaut), gap=10, align=center
  - *icon* `arrow-left` 16×16 fill=$parch
  - **T** « RETOUR » — $eyebrow · 10.5px · w600 · ls 2.2 · $parch
- **frame** `Chemin` hug — layout=horizontal(défaut), gap=12, align=center
  - **T** « LES PROFS » — $eyebrow · 10.5px · w500 · ls 2.2 · $parch-mute
  - **T** « / » — $body · 10.5px · wnormal · $parch-mute
  - **T** « GABRIEL TARDIO » — $eyebrow · 10.5px · w600 · ls 2.2 · $parch

##### Hero fiche

**Conteneur** — `fill×hug` — layout=horizontal(défaut), gap=100, pad=72/56/88/56

*Arbre exhaustif (7 nœuds texte) :*

- **frame** `Colonne photo` 500×hug — layout=vertical
  - **frame** `Portrait` 500×600 img=`public/assets/Gabriel.jpg` (mode fill) — layout=none, radius=3
  - **frame** `esp` 10×20 — layout=none
  - **frame** `Btn Profil HEMA Ratings` hug×48 — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/22, radius=2, stroke=#ece8de47 1 inner
    - **T** « PROFIL HEMA RATINGS » — $body · 11.5px · w500 · ls 1.8 · $parch
    - *icon* `arrow-right` 11×11 fill=$parch
- **frame** `Colonne texte` fill×hug — layout=vertical
  - **T** « ÉPÉE LONGUE » — $eyebrow · 11px · w600 · ls 3.2 · $ember
  - **frame** `esp` 10×14 — layout=none
  - **T** « Gabriel Tardio » — $display · 80px · lh 1 · $parch
  - **frame** `esp` 10×16 — layout=none
  - **T** « Top 1 % mondial · épée longue acier » — $body · 17px · w500 · lh 1.4 · $parch
  - **frame** `esp` 10×26 — layout=none
  - rect `filet` 56×1 fill=$parch-line
  - **frame** `esp` 10×26 — layout=none
  - **T** « Référent principal du club. Compétiteur reconnu du circuit AMHE, classé dans le top 1 % mondial en épée longue acier sur HEMA Ratings. Pratique exigeante, structurée, tournée vers l'efficacité en assaut. » — $body · 17px · wnormal · lh 1.7 · $parch-soft · fixed-width 640
  - **frame** `esp` 10×36 — layout=none
  - **frame** `Vidéo itw` hug — layout=vertical, gap=4
    - **frame** `Vidéo` 640×360 — layout=none, radius=3, clip
      - rect `thumb` 640×360 @0,0 img=`maquette-assets/galerie-3.jpg` (mode fill)
      - rect `veil` 640×360 @0,0 fill=#08070a66
      - **frame** `play` 64×64 @288,148 — layout=none
        - **frame** `Play` 64×64 @0,0 fill=$parch — layout=horizontal(défaut), justify=center, align=center, radius=99
          - *icon* `play` 24×24 fill=$ink
      - **frame** `dur` 54×22 @574,328 — layout=none
        - **frame** `Durée` hug @0,0 fill=#0a0908cc — layout=horizontal(défaut), pad=4/9, radius=99
          - **T** « 06:24 » — $body · 9.5px · w600 · ls 0.5 · $parch
    - **frame** `esp` 10×12 — layout=none
    - **T** « L'interview en vidéo » — $body · 15px · w500 · $parch

##### Interview

**Conteneur** — `fill×hug` — layout=vertical, pad=0/56/80/56

*Arbre exhaustif (4 nœuds texte) :*

- **frame** `Tête` fill×hug — layout=horizontal(défaut), pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
  - **T** « L'INTERVIEW » — $eyebrow · 10.5px · w600 · ls 3 · $ember
- **frame** `esp` 10×12 — layout=none
- **frame** `QAs` fill×hug — layout=vertical
  - **frame** `Q1` fill×hug — layout=vertical, pad=36/0
    - **T** « Comment es-tu arrivé aux AMHE ? » — $display · 28px · wnormal · italic · lh 1.2 · $parch
    - **frame** `esp` 10×16 — layout=none
    - **frame** `Réponse (placeholder)` hug — layout=vertical, gap=8
      - rect `bar` 900×10 fill=#ece8de14 radius=5
      - rect `bar` 860×10 fill=#ece8de14 radius=5
      - rect `bar` 520×10 fill=#ece8de14 radius=5
  - **frame** `Q2` fill×hug — layout=vertical, pad=36/0, stroke=$parch-line {"top": 1} inner
    - **T** « Qu'est-ce qu'on apprend à ton cours ? » — $display · 28px · wnormal · italic · lh 1.2 · $parch
    - **frame** `esp` 10×16 — layout=none
    - **frame** `Réponse (placeholder)` hug — layout=vertical, gap=8
      - rect `bar` 900×10 fill=#ece8de14 radius=5
      - rect `bar` 860×10 fill=#ece8de14 radius=5
      - rect `bar` 520×10 fill=#ece8de14 radius=5
  - **frame** `Q3` fill×hug — layout=vertical, pad=36/0, stroke=$parch-line {"top": 1} inner
    - **T** « Un conseil pour une première séance ? » — $display · 28px · wnormal · italic · lh 1.2 · $parch
    - **frame** `esp` 10×16 — layout=none
    - **frame** `Réponse (placeholder)` hug — layout=vertical, gap=8
      - rect `bar` 900×10 fill=#ece8de14 radius=5
      - rect `bar` 860×10 fill=#ece8de14 radius=5
      - rect `bar` 520×10 fill=#ece8de14 radius=5

##### Bande CTA

**Conteneur** — `fill×hug` — layout=vertical, align=center, pad=80/56/96/56, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (3 nœuds texte) :*

- **T** « S'entraîner avec Gabriel ? » — $display · 44px · wnormal · lh 1.1 · $parch
- **frame** `esp` 10×10 — layout=none
- **T** « Viens à une séance, il t'accueille. » — $display · 16px · wnormal · italic · lh 1.3 · $parch-soft
- **frame** `esp` 10×28 — layout=none
- **frame** `Btn Venir essayer` hug×52 fill=$ember — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/40, radius=2
  - **T** « VENIR ESSAYER » — $body · 11.5px · w600 · ls 1.8 · $ink
  - *icon* `arrow-right` 11×11 fill=$ink

### 6.4 Arbre exhaustif — mobile (`V2 — Fiche prof (mobile)`)

##### Hero fiche

**Conteneur** — `390×440` — layout=none, clip

*Arbre exhaustif (4 nœuds texte) :*

- rect `img` 390×440 @0,0 img=`public/assets/Gabriel.jpg` (mode fill)
- rect `voile` 390×440 @0,0 fill=#0a090859
- rect `assise` 390×200 @0,240 fill=#0a0908d9
- **frame** `Barre retour` 390×hug @0,0 — layout=horizontal(défaut), justify=space_between, align=center, pad=14/18
  - **frame** `Back` 36×36 fill=#0a090880 — layout=horizontal(défaut), justify=center, align=center, radius=99, stroke=#ece8de38 1 inner
    - *icon* `arrow-left` 15×15 fill=$parch
  - **frame** `Tag` hug fill=#0a0908a6 — layout=horizontal(défaut), pad=6/11, radius=99, stroke=#ece8de38 1 inner
    - **T** « FICHE PROF » — $eyebrow · 9px · w600 · ls 1.8 · $parch
- **frame** `Bas` 346×hug @22,304 — layout=vertical, gap=6
  - **T** « ÉPÉE LONGUE » — $eyebrow · 9.5px · w600 · ls 2.2 · $ember
  - **T** « Gabriel Tardio » — $display · 36px · w500 · lh 1 · $parch
  - **T** « Top 1 % mondial · épée longue acier » — $body · 12.5px · w500 · lh 1.4 · $parch-soft · fixed-width 346

##### Bio

**Conteneur** — `fill×hug` — layout=vertical, pad=26/22

*Arbre exhaustif (1 nœuds texte) :*

- **T** « Référent principal du club. Compétiteur reconnu du circuit AMHE, classé dans le top 1 % mondial en épée longue acier sur HEMA Ratings. Pratique exigeante, structurée, tournée vers l'efficacité en assaut. » — $body · 14.5px · wnormal · lh 1.6 · $parch-soft · fixed-width 346

##### Vidéo

**Conteneur** — `fill×hug` — layout=vertical, pad=0/22/10/22

*Arbre exhaustif (2 nœuds texte) :*

- **frame** `Vidéo` 346×195 — layout=none, radius=3, clip
  - rect `thumb` 346×195 @0,0 img=`maquette-assets/galerie-3.jpg` (mode fill)
  - rect `veil` 346×195 @0,0 fill=#08070a66
  - **frame** `play` 46×46 @150,74.5 — layout=none
    - **frame** `Play` 46×46 @0,0 fill=$parch — layout=horizontal(défaut), justify=center, align=center, radius=99
      - *icon* `play` 17×17 fill=$ink
  - **frame** `dur` 54×22 @280,163 — layout=none
    - **frame** `Durée` hug @0,0 fill=#0a0908cc — layout=horizontal(défaut), pad=4/9, radius=99
      - **T** « 06:24 » — $body · 9.5px · w600 · ls 0.5 · $parch
- **frame** `esp` 10×8 — layout=none
- **T** « L'interview en vidéo » — $body · 14px · w500 · $parch

##### Interview

**Conteneur** — `fill×hug` — layout=vertical, pad=18/22/20/22

*Arbre exhaustif (4 nœuds texte) :*

- **frame** `Tête` fill×hug — layout=horizontal(défaut), pad=0/0/16/0, stroke=$parch-line {"bottom": 1} inner
  - **T** « L'INTERVIEW » — $eyebrow · 10px · w600 · ls 2.6 · $ember
- **frame** `QAs` fill×hug — layout=vertical
  - **frame** `Q1` fill×hug — layout=vertical, pad=24/0
    - **T** « Comment es-tu arrivé aux AMHE ? » — $display · 20px · wnormal · italic · lh 1.2 · $parch · fixed-width 346
    - **frame** `esp` 10×12 — layout=none
    - **frame** `Réponse (placeholder)` hug — layout=vertical, gap=8
      - rect `bar` 346×8 fill=#ece8de14 radius=5
      - rect `bar` 306×8 fill=#ece8de14 radius=5
      - rect `bar` 190×8 fill=#ece8de14 radius=5
  - **frame** `Q2` fill×hug — layout=vertical, pad=24/0, stroke=$parch-line {"top": 1} inner
    - **T** « Qu'est-ce qu'on apprend à ton cours ? » — $display · 20px · wnormal · italic · lh 1.2 · $parch · fixed-width 346
    - **frame** `esp` 10×12 — layout=none
    - **frame** `Réponse (placeholder)` hug — layout=vertical, gap=8
      - rect `bar` 346×8 fill=#ece8de14 radius=5
      - rect `bar` 306×8 fill=#ece8de14 radius=5
      - rect `bar` 190×8 fill=#ece8de14 radius=5
  - **frame** `Q3` fill×hug — layout=vertical, pad=24/0, stroke=$parch-line {"top": 1} inner
    - **T** « Un conseil pour une première séance ? » — $display · 20px · wnormal · italic · lh 1.2 · $parch · fixed-width 346
    - **frame** `esp` 10×12 — layout=none
    - **frame** `Réponse (placeholder)` hug — layout=vertical, gap=8
      - rect `bar` 346×8 fill=#ece8de14 radius=5
      - rect `bar` 306×8 fill=#ece8de14 radius=5
      - rect `bar` 190×8 fill=#ece8de14 radius=5

##### CTAs

**Conteneur** — `fill×hug` — layout=vertical, pad=0/22/28/22

*Arbre exhaustif (2 nœuds texte) :*

- **frame** `Btn Profil HEMA Ratings` fill×46 — layout=horizontal(défaut), gap=10, justify=center, align=center, radius=2, stroke=#ece8de47 1 inner
  - **T** « PROFIL HEMA RATINGS » — $body · 11.5px · w500 · ls 1.8 · $parch
  - *icon* `arrow-up-right` 12×12 fill=$parch
- **frame** `esp` 10×10 — layout=none
- **frame** `Btn Venir essayer` fill×52 fill=$ember — layout=horizontal(défaut), gap=10, justify=center, align=center, radius=2
  - **T** « VENIR ESSAYER » — $body · 11.5px · w600 · ls 1.8 · $ink
  - *icon* `arrow-right` 12×12 fill=$ink

##### Tab bar

**Conteneur** — `390×80` fill=#0a0908f2 — layout=horizontal(défaut), justify=space_between, align=end, pad=0/10/8/10, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (5 nœuds texte) :*

- **frame** `Tab Accueil` 72×66 — layout=vertical, gap=5, justify=center, align=center
  - **frame** `esp` 14×2 — layout=none
  - *icon* `house` 19×19 fill=$parch-mute
  - **T** « ACCUEIL » — $eyebrow · 8px · w600 · ls 1.2 · $parch-mute
- **frame** `Tab Armes` 72×66 — layout=vertical, gap=5, justify=center, align=center
  - **frame** `esp` 14×2 — layout=none
  - *icon* `sword` 19×19 fill=$parch-mute
  - **T** « ARMES » — $eyebrow · 8px · w600 · ls 1.2 · $parch-mute
- **frame** `Tab Essayer` 76×hug — layout=vertical, gap=4, align=center
  - **frame** `Rond` 46×46 fill=$ember — layout=horizontal(défaut), justify=center, align=center, radius=99
    - *icon* `swords` 20×20 fill=$ink
  - **T** « ESSAYER » — $eyebrow · 8px · w600 · ls 1.2 · $parch
- **frame** `Tab Photos` 72×66 — layout=vertical, gap=5, justify=center, align=center
  - **frame** `esp` 14×2 — layout=none
  - *icon* `image` 19×19 fill=$parch-mute
  - **T** « PHOTOS » — $eyebrow · 8px · w600 · ls 1.2 · $parch-mute
- **frame** `Tab Contact` 72×66 — layout=vertical, gap=5, justify=center, align=center
  - rect `marqueur` 14×2 fill=$ember radius=2
  - *icon* `phone` 19×19 fill=$parch
  - **T** « CONTACT » — $eyebrow · 8px · w600 · ls 1.2 · $parch

---

## 7. Menu mobile ouvert — `Mobile — Menu ouvert`

Frame 390×780, `layout: none`. **Cet écran n'a pas de version V2** : il date de la première itération, mais reste le seul état de navigation déroulante maquetté. Il est à reprendre tel quel en adaptant la liste de liens à celle de la V2.

- `Fond` — rect 390×780 en `#0a0908f5` (96 % — quasi opaque, pas de flou d'arrière-plan)
- `Barre du haut` — 390×hug @0,0, `space_between`, `padding: 14 18` : `Logo` 38×38 + icône **`x`** 24 px `$parch` (l'icône `menu` du hero devient `x`)
- `Tiroir` — frame 346×hug @22,**110**, colonne :
  - `Liens` — six lignes `space_between`, `align: center`, `padding: 20 4`, filet **haut** à partir de la 2ᵉ. Libellé en **`$display` 26 / lh 1.1 / `$parch`** (police d'affichage, pas de capitales — contraste fort avec la nav desktop) + icône `arrow-up-right` 16 px `$parch-mute`.
    `Disciplines`, `Les profs`, `Le club`, `Nous rejoindre`, `Tournois`, `FAQ`
  - `esp 28`, bouton primaire `VENIR ESSAYER` — hug×50, `$ember`, texte `$ink` `$body` 11 / w600 / ls 1.8, `padding: 0 24`
  - `esp 24`, mention `AMHE · USAM CLERMONT-FERRAND` (`$eyebrow` 10 / w500 / ls 2.6 / `$parch-mute`)

**Cohérence à établir :** la V2 mobile ne comporte plus de section « Tournois ». Si le menu est conservé à l'identique, le lien `Tournois` pointerait vers une section inexistante sur mobile.

#### Fond

**Conteneur** — rectangle `390×780` fill=#0a0908f5

*Arbre exhaustif (0 nœuds texte) :*

#### Barre du haut

**Conteneur** — `390×hug` @0,0 — layout=horizontal(défaut), justify=space_between, align=center, pad=14/18

*Arbre exhaustif (0 nœuds texte) :*

- **frame** `Logo` 38×38 img=`public/assets/logo.png` (mode fill) — layout=none
- *icon* `x` 24×24 fill=$parch

#### Tiroir

**Conteneur** — `346×hug` @22,110 — layout=vertical

*Arbre exhaustif (8 nœuds texte) :*

- **frame** `Liens` fill×hug — layout=vertical
  - **frame** `Lien Disciplines` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=20/4
    - **T** « Disciplines » — $display · 26px · wnormal · lh 1.1 · $parch
    - *icon* `arrow-up-right` 16×16 fill=$parch-mute
  - **frame** `Lien Les profs` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=20/4, stroke=$parch-line {"top": 1} inner
    - **T** « Les profs » — $display · 26px · wnormal · lh 1.1 · $parch
    - *icon* `arrow-up-right` 16×16 fill=$parch-mute
  - **frame** `Lien Le club` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=20/4, stroke=$parch-line {"top": 1} inner
    - **T** « Le club » — $display · 26px · wnormal · lh 1.1 · $parch
    - *icon* `arrow-up-right` 16×16 fill=$parch-mute
  - **frame** `Lien Nous rejoindre` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=20/4, stroke=$parch-line {"top": 1} inner
    - **T** « Nous rejoindre » — $display · 26px · wnormal · lh 1.1 · $parch
    - *icon* `arrow-up-right` 16×16 fill=$parch-mute
  - **frame** `Lien Tournois` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=20/4, stroke=$parch-line {"top": 1} inner
    - **T** « Tournois » — $display · 26px · wnormal · lh 1.1 · $parch
    - *icon* `arrow-up-right` 16×16 fill=$parch-mute
  - **frame** `Lien FAQ` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=20/4, stroke=$parch-line {"top": 1} inner
    - **T** « FAQ » — $display · 26px · wnormal · lh 1.1 · $parch
    - *icon* `arrow-up-right` 16×16 fill=$parch-mute
- **frame** `esp` 10×28 — layout=none
- **frame** `Btn Venir essayer` hug×50 fill=$ember — layout=horizontal(défaut), gap=10, justify=center, align=center, pad=0/24, radius=2
  - **T** « VENIR ESSAYER » — $body · 11px · w600 · ls 1.8 · $ink
  - *icon* `arrow-right` 11×11 fill=$ink
- **frame** `esp` 10×24 — layout=none
- **T** « AMHE · USAM CLERMONT-FERRAND » — $eyebrow · 10px · w500 · ls 2.6 · $parch-mute

---

## 8. Annexe — itération V1 (`Site desktop — nouvelles photos`, `Mobile — 390`)

Ces deux frames sont **antérieures** aux frames V2 et ne doivent pas servir de référence d'intégration. Elles sont conservées ici parce qu'elles contiennent des **contenus rédigés qui ont disparu de la V2** et qui restent exploitables.

### 8.1 Deltas V1 → V2, desktop

| Élément | V1 | V2 |
|---|---|---|
| Voile du hero | `#0a0908a6` (65 %) | `#0a0908ab` (67 %) |
| Logo du hero | 100×100 | **88×88** |
| Sur-titre du hero | `Arts Martiaux Historiques Européens` en `$display` 25 + `à Clermont-Ferrand` en `$display` 43 italic `$ember` | `ARTS MARTIAUX HISTORIQUES EUROPÉENS` en `$eyebrow` 11.5 ls 4, filet, puis `à Clermont-Ferrand` en `$display` 34 italic `$parch` |
| Ligne d'horaires du hero | absente | ajoutée (`MAR · JEU 18H–22H — ESSAI OFFERT`) |
| Cartes discipline | pas de lien | ajout du lien `DÉCOUVRIR L'ARME` (sur la carte Viking seulement) |
| Cartes prof | **bio complète de 2-3 lignes** (`$body` 14 / lh 1.6 / `$parch-mute`) + bouton `PROFIL HEMA RATINGS` | bio retirée, remplacée par le lien `LIRE L'INTERVIEW` |
| Chiffres clés du club | absents | ajoutés (`04 ARMES`, `03 ENCADRANTS`, `FFAMHE AFFILIATION`) |

**Bios V1 à récupérer (elles n'existent nulle part ailleurs dans la maquette) :**
- *Marie Poignant* — « Instructrice rapière. Travaille les traditions française et italienne, l'escrime bolonaise et les systèmes main gauche (cape, dague, bocle). Pratique AMHE… »
- *Gabriel Tardio* — « Référent principal du club. Compétiteur reconnu du circuit AMHE, classé dans le top 1 % mondial en épée longue acier sur HEMA Ratings… » *(repris tel quel dans la fiche prof V2)*
- *Ludwig Fort* — « Encadre les pratiques messer, combat viking et épée-bocle. Apporte une approche orientée armes courtes, bouclier et systèmes asymétriques — les disciplines moins courues du répertoire AMHE. »

Le texte intégral figure dans l'arbre exhaustif §8.3.

### 8.2 Deltas V1 → V2, mobile

| Élément | V1 | V2 |
|---|---|---|
| Section 04 | `Le club en bref` — **grille de 4 tuiles stat** 168×112 (rayon 3) : `04 ARMES ENSEIGNÉES` (`swords`), `03 ENCADRANTS · 3 ÉCOLES` (`users`), `Top 1 % MONDIAL · ÉPÉE LONGUE ACIER` (`trophy`, **tuile pleine `$ember`**, texte `$ink`), `FFAMHE CLUB AFFILIÉ · CIRCUIT NATIONAL` (`shield`) | `Le club` — photo incrustée + paragraphe |
| Cartes prof | prénom + discipline seuls | ajout du lien `INTERVIEW` |
| Scroll cue du hero | absent | ajouté (`DÉCOUVRIR LE CLUB`) |

**Les quatre tuiles stat V1 sont un composant réutilisable intéressant** (équivalent mobile des « chiffres clés » desktop) qui a été perdu en V2 — à reproposer au client.

### 8.3 Arbre exhaustif — `Site desktop — nouvelles photos` (V1)

#### 01 · Hero

**Conteneur** — `1440×900` fill=$ink — layout=none, clip

*Arbre exhaustif (14 nœuds texte) :*

- rect `BG photo` 1440×900 @0,0 img=`maquette-assets/hero.jpg` (mode fill)
- rect `Voile sombre` 1440×900 @0,0 fill=#0a0908a6
- **frame** `Nav` 1440×hug @0,0 — layout=horizontal(défaut), justify=center, align=center, pad=16/40
  - **frame** `Liens` hug — layout=horizontal(défaut), gap=34, align=center
    - **T** « DISCIPLINES » — $eyebrow · 11px · w500 · ls 2.2 · $parch-soft
    - **T** « LES PROFS » — $eyebrow · 11px · w500 · ls 2.2 · $parch-soft
    - **T** « LE CLUB » — $eyebrow · 11px · w500 · ls 2.2 · $parch-soft
    - **T** « NOUS REJOINDRE » — $eyebrow · 11px · w500 · ls 2.2 · $parch-soft
    - **T** « TOURNOIS » — $eyebrow · 11px · w500 · ls 2.2 · $parch-soft
    - **T** « FAQ » — $eyebrow · 11px · w500 · ls 2.2 · $parch-soft
- **frame** `Hero contenu` 1440×hug @0,170 — layout=vertical, gap=26, align=center
  - **frame** `Logo` 100×100 img=`public/assets/logo.png` (mode fill) — layout=none
  - **frame** `H1` hug — layout=vertical, gap=8, align=center
    - **frame** `De Feu` hug — layout=horizontal(défaut), gap=24, justify=center, align=end
      - **T** « De » — $display · 96px · w500 · lh 0.9 · $parch
      - **T** « Feu » — $display · 96px · w500 · lh 0.9 · $feu
    - **frame** `et d'Acier` hug — layout=horizontal(défaut), gap=10, justify=center, align=end
      - **T** « et d' » — $display · 96px · w300 · italic · lh 0.9 · $parch
      - **T** « Acier » — $display · 96px · w500 · lh 0.9 · $acier
  - **frame** `H2` hug — layout=vertical, gap=6, align=center
    - **T** « Arts Martiaux Historiques Européens » — $display · 25px · wnormal · lh 1.2 · $parch-soft
    - **T** « à Clermont-Ferrand » — $display · 43px · w500 · italic · lh 1.1 · $ember
  - **frame** `Btn Venir essayer` hug×48 — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/28, radius=2, stroke=#ece8de47 1 inner
    - **T** « VENIR ESSAYER » — $body · 11px · w500 · ls 1.8 · $parch
    - *icon* `arrow-right` 11×11 fill=$parch
- **frame** `Scroll cue` 1440×hug @0,822 — layout=vertical, gap=8, align=center
  - *icon* `chevron-down` 22×22 fill=$parch-mute
  - **T** « DÉCOUVRIR LE CLUB » — $eyebrow · 10px · w500 · ls 3 · $parch-mute

#### 02 · Disciplines

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=160/0/0/0, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (22 nœuds texte) :*

- **frame** `Head container` fill×hug — layout=vertical, pad=0/56/64/56
  - **frame** `Label 1 · Les disciplines` fill×hug — layout=horizontal(défaut), gap=16, align=center, pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
    - **T** « 01 » — $eyebrow · 12.5px · w600 · ls 3.5 · $ember
    - *icon* `diamond` 8×8 fill=$ember
    - **T** « LES DISCIPLINES » — $eyebrow · 12.5px · w600 · ls 3.5 · $parch-soft
  - **frame** `esp` 10×56 — layout=none
  - **frame** `Section head` fill×hug — layout=horizontal(défaut), justify=space_between, align=end
    - **frame** `Titre` hug — layout=vertical, gap=4
      - **T** « Cinq armes, » — $display · 76px · wnormal · lh 1 · $parch
      - **T** « cinq grammaires. » — $display · 76px · w300 · italic · lh 1 · $ember
    - **T** « On peut tout pratiquer, on peut se spécialiser. Chaque arme ouvre une école de pensée et un répertoire technique distincts, étalés sur plusieurs siècles. » — $body · 16px · wnormal · lh 1.7 · $parch-mute · fixed-width 460
- **frame** `Strip disciplines` 1440×hug — layout=horizontal(défaut)
  - **frame** `Carte Combat viking` 360×620 — layout=none, clip
    - rect `Photo` 360×620 @0,0 img=`maquette-assets/disc-viking.jpg` (mode fill)
    - rect `Overlay` 360×620 @0,0 fill=#08070a59
    - rect `Assise` 360×250 @0,370 fill=#08070ac4
    - **frame** `Era` 288×hug @36,40 — layout=vertical, gap=6
      - **frame** `Era l1` hug — layout=horizontal(défaut), gap=10, align=center
        - rect `tiret` 22×1 fill=$ember
        - **T** « HAUT MOYEN ÂGE » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « VIIIᵉ — XIᵉ S. » — $body · 11px · wnormal · ls 2 · $parch
    - **frame** `Bas de carte` 288×hug @36,350 — layout=vertical, gap=8
      - **T** « Combat viking » — $display · 42px · wnormal · lh 1 · $parch
      - **T** « Bouclier & arme courte » — $body · 13px · wnormal · lh 1.4 · $parch-soft · fixed-width 288
      - **frame** `esp` 10×10 — layout=none
      - rect `div` 36×1 fill=$ember
      - **T** « Pratique inspirée des traditions martiales "Viking", avec bouclier et armes adaptées. Jeu de pression, contact, contrôle, avec une equipe qui axe sa pratique vers la reconstitution. » — $body · 13.5px · wnormal · lh 1.6 · $parch-soft · fixed-width 288
  - **frame** `Carte Épée longue` 360×620 — layout=none, clip
    - rect `Photo` 360×620 @0,0 img=`maquette-assets/disc-epee-longue.jpg` (mode fill)
    - rect `Overlay` 360×620 @0,0 fill=#08070aa6
    - rect `Assise` 360×250 @0,370 fill=#08070ac4
    - **frame** `Era` 288×hug @36,40 — layout=vertical, gap=6
      - **frame** `Era l1` hug — layout=horizontal(défaut), gap=10, align=center
        - rect `tiret` 22×1 fill=$ember
        - **T** « MÉDIÉVALE » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « XIVᵉ — XVᵉ S. » — $body · 11px · wnormal · ls 2 · $parch
    - **frame** `Bas de carte` 288×hug @36,508 — layout=vertical, gap=8
      - **T** « Épée longue » — $display · 42px · wnormal · lh 1 · $parch
      - **T** « Arme emblématique des AMHE » — $body · 13px · wnormal · lh 1.4 · $parch-soft · fixed-width 288
  - **frame** `Carte Messer` 360×620 — layout=none, clip
    - rect `Photo` 360×620 @0,0 img=`maquette-assets/disc-messer.jpg` (mode fill)
    - rect `Overlay` 360×620 @0,0 fill=#08070aa6
    - rect `Assise` 360×250 @0,370 fill=#08070ac4
    - **frame** `Era` 288×hug @36,40 — layout=vertical, gap=6
      - **frame** `Era l1` hug — layout=horizontal(défaut), gap=10, align=center
        - rect `tiret` 22×1 fill=$ember
        - **T** « MÉDIÉVALE » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « XVᵉ S. » — $body · 11px · wnormal · ls 2 · $parch
    - **frame** `Bas de carte` 288×hug @36,508 — layout=vertical, gap=8
      - **T** « Messer » — $display · 42px · wnormal · lh 1 · $parch
      - **T** « Grand couteau de combat » — $body · 13px · wnormal · lh 1.4 · $parch-soft · fixed-width 288
  - **frame** `Carte Rapière` 360×620 — layout=none, clip
    - rect `Photo` 360×620 @0,0 img=`maquette-assets/disc-rapiere.jpg` (mode fill)
    - rect `Overlay` 360×620 @0,0 fill=#08070aa6
    - rect `Assise` 360×250 @0,370 fill=#08070ac4
    - **frame** `Era` 288×hug @36,40 — layout=vertical, gap=6
      - **frame** `Era l1` hug — layout=horizontal(défaut), gap=10, align=center
        - rect `tiret` 22×1 fill=$ember
        - **T** « RENAISSANCE » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « XVIᵉ — XVIIᵉ S. » — $body · 11px · wnormal · ls 2 · $parch
    - **frame** `Bas de carte` 288×hug @36,508 — layout=vertical, gap=8
      - **T** « Rapière » — $display · 42px · wnormal · lh 1 · $parch
      - **T** « Escrime de la Renaissance » — $body · 13px · wnormal · lh 1.4 · $parch-soft · fixed-width 288

#### 03 · Profs

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=110/56/120/56, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (18 nœuds texte) :*

- **frame** `Label 2 · Les profs` fill×hug — layout=horizontal(défaut), gap=16, align=center, pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
  - **T** « 02 » — $eyebrow · 12.5px · w600 · ls 3.5 · $ember
  - *icon* `diamond` 8×8 fill=$ember
  - **T** « LES PROFS » — $eyebrow · 12.5px · w600 · ls 3.5 · $parch-soft
- **frame** `esp` 10×56 — layout=none
- **frame** `Section head` fill×hug — layout=horizontal(défaut), justify=space_between, align=end, pad=0/0/64/0
  - **frame** `Titre` hug — layout=vertical, gap=4
    - **T** « Trois encadrants, » — $display · 70px · wnormal · lh 1 · $parch
    - **T** « trois écoles. » — $display · 70px · w300 · italic · lh 1 · $ember
  - **T** « Chaque arme a son référent. Tous transmettent à leur rythme, avec une pédagogie qui leur est propre et qui est issue d'une longue expérience de pratiquant, ainsi que de nombreuses heures de lecture des sources. » — $body · 16px · wnormal · lh 1.7 · $parch-mute · fixed-width 460
- **frame** `Grille profs` fill×hug — layout=horizontal(défaut), gap=24
  - **frame** `Prof Marie Poignant` 426.7×hug fill=#ece8de06 — layout=vertical, radius=2, stroke=$parch-line 1 inner, clip
    - **frame** `Photo` 426.7×426.7 img=`public/assets/Marie.png` (mode fill) — layout=none
    - **frame** `Contenu` fill×hug — layout=vertical, gap=14, pad=26/26/24/26
      - **T** « RAPIÈRE » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « Marie Poignant » — $display · 34px · w500 · lh 1.1 · $parch
      - **T** « Rapière française & italienne · bolonaise » — $body · 13.5px · w500 · lh 1.4 · $parch-soft · fixed-width 374.7
      - rect `sep` 374.7×1 fill=$parch-line
      - **T** « Instructrice rapière. Travaille les traditions française et italienne, l'escrime bolonaise et les systèmes main gauche (cape, dague, bocle). Pratique AMHE depuis 2013. » — $body · 14px · wnormal · lh 1.6 · $parch-mute · fixed-width 374.7
  - **frame** `Prof Gabriel Tardio` 426.7×hug fill=#e0552c0d — layout=vertical, radius=2, stroke=#e0552c52 1 inner, clip
    - rect `Ligne ember` 426.7×2 fill=$ember
    - **frame** `Photo` 426.7×426.7 img=`public/assets/Gabriel.jpg` (mode fill) — layout=none
    - **frame** `Contenu` fill×hug — layout=vertical, gap=14, pad=26/26/24/26
      - **T** « ÉPÉE LONGUE » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « Gabriel Tardio » — $display · 34px · w500 · lh 1.1 · $parch
      - **T** « Top 1 % mondial · épée longue acier » — $body · 13.5px · w500 · lh 1.4 · $parch · fixed-width 374.7
      - rect `sep` 374.7×1 fill=$parch-line
      - **T** « Référent principal du club. Compétiteur reconnu du circuit AMHE, classé dans le top 1 % mondial en épée longue acier sur HEMA Ratings. Pratique exigeante, structurée, tournée vers l'efficacité en assaut. » — $body · 14px · wnormal · lh 1.6 · $parch-mute · fixed-width 374.7
      - **frame** `Lien` hug — layout=horizontal(défaut), gap=8, align=center
        - **T** « PROFIL HEMA RATINGS » — $eyebrow · 10.5px · w600 · ls 1.8 · $parch-soft
        - *icon* `arrow-right` 10×10 fill=$parch-soft
  - **frame** `Prof Ludwig Fort` 426.7×hug fill=#ece8de06 — layout=vertical, radius=2, stroke=$parch-line 1 inner, clip
    - **frame** `Photo` 426.7×426.7 img=`public/assets/Ludwig.jpeg` (mode fill) — layout=none
    - **frame** `Contenu` fill×hug — layout=vertical, gap=14, pad=26/26/24/26
      - **T** « MESSER · VIKING · BOCLE » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « Ludwig Fort » — $display · 34px · w500 · lh 1.1 · $parch
      - **T** « Armes courtes & bouclier » — $body · 13.5px · w500 · lh 1.4 · $parch-soft · fixed-width 374.7
      - rect `sep` 374.7×1 fill=$parch-line
      - **T** « Encadre les pratiques messer, combat viking et épée-bocle. Apporte une approche orientée armes courtes, bouclier et systèmes asymétriques — les disciplines moins courues du répertoire AMHE. » — $body · 14px · wnormal · lh 1.6 · $parch-mute · fixed-width 374.7

#### 04 · Le club

**Conteneur** — `fill×hug` fill=$coal — layout=vertical, pad=120/56/130/56, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (15 nœuds texte) :*

- **frame** `Label 3 · Le club` fill×hug — layout=horizontal(défaut), gap=16, align=center, pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
  - **T** « 03 » — $eyebrow · 12.5px · w600 · ls 3.5 · $ember
  - *icon* `diamond` 8×8 fill=$ember
  - **T** « LE CLUB » — $eyebrow · 12.5px · w600 · ls 3.5 · $parch-soft
- **frame** `esp` 10×56 — layout=none
- **frame** `Split` fill×hug — layout=horizontal(défaut), gap=100, align=center, pad=0/0/72/0
  - **frame** `Texte` 540×hug — layout=vertical
    - **frame** `Titre` hug — layout=vertical, gap=4
      - **T** « Une bande » — $display · 72px · wnormal · lh 1 · $parch
      - **T** « d'escrimeurs, » — $display · 72px · w300 · italic · lh 1 · $ember
      - **T** « une école. » — $display · 72px · wnormal · lh 1 · $parch
    - **frame** `esp` 10×28 — layout=none
    - **T** « Section AMHE de l'USAM Clermont-Ferrand, affiliée à la FFAMHE, le club accueille débutants et pratiquants confirmés, en loisir comme en compétition. Encadrement assuré par Gabriel Tardio. La salle est ouverte à toutes et tous, et l'on prend le temps de bien faire les choses. » — $body · 16px · wnormal · lh 1.7 · $parch-mute · fixed-width 520
  - **frame** `Photo équipe` 688×430 img=`maquette-assets/club.jpg` (mode fill) — layout=none, radius=2
- **frame** `Piliers` fill×hug — layout=horizontal(défaut), stroke=$parch-line {"top": 1, "bottom": 1} inner
  - **frame** `Pilier Source` 442.7×hug — layout=vertical, gap=18, pad=52/44
    - **frame** `Num` hug — layout=horizontal(défaut), gap=14, align=center
      - **T** « 01 » — $eyebrow · 10.5px · w600 · ls 3.4 · $ember
      - rect `tiret` 28×1 fill=$ember
    - **T** « Source. » — $display · 40px · wnormal · italic · lh 1 · $parch
    - **T** « Étude des textes et traités historiques. Lecture, mise en pratique, reconstitution martiale des gestes anciens. » — $body · 14.5px · wnormal · lh 1.6 · $parch-mute · fixed-width 354.7
  - **frame** `Pilier Geste` 442.7×hug — layout=vertical, gap=18, pad=52/44, stroke=$parch-line {"left": 1} inner
    - **frame** `Num` hug — layout=horizontal(défaut), gap=14, align=center
      - **T** « 02 » — $eyebrow · 10.5px · w600 · ls 3.4 · $ember
      - rect `tiret` 28×1 fill=$ember
    - **T** « Geste. » — $display · 40px · wnormal · italic · lh 1 · $parch
    - **T** « Technique structurée par le drill, le sentiment du fer, et la mise en pratique en assaut libre. » — $body · 14.5px · wnormal · lh 1.6 · $parch-mute · fixed-width 354.7
  - **frame** `Pilier Salle` 442.7×hug — layout=vertical, gap=18, pad=52/44, stroke=$parch-line {"left": 1} inner
    - **frame** `Num` hug — layout=horizontal(défaut), gap=14, align=center
      - **T** « 03 » — $eyebrow · 10.5px · w600 · ls 3.4 · $ember
      - rect `tiret` 28×1 fill=$ember
    - **T** « Salle. » — $display · 40px · wnormal · italic · lh 1 · $parch
    - **T** « Un esprit d'école d'armes : exigence sportive, respect du partenaire, et progression à son rythme. » — $body · 14.5px · wnormal · lh 1.6 · $parch-mute · fixed-width 354.7

#### 05 · La rigueur

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=120/56/130/56

*Arbre exhaustif (7 nœuds texte) :*

- **frame** `Label 4 · La rigueur` fill×hug — layout=horizontal(défaut), gap=16, align=center, pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
  - **T** « 04 » — $eyebrow · 12.5px · w600 · ls 3.5 · $ember
  - *icon* `diamond` 8×8 fill=$ember
  - **T** « LA RIGUEUR » — $eyebrow · 12.5px · w600 · ls 3.5 · $parch-soft
- **frame** `esp` 10×56 — layout=none
- **frame** `Split` fill×hug — layout=horizontal(défaut), gap=120
  - **frame** `Texte` 720×hug — layout=vertical
    - **frame** `Titre` hug — layout=vertical, gap=4
      - **T** « Le geste juste, » — $display · 76px · wnormal · lh 1 · $parch
      - **T** « avant le costume. » — $display · 76px · w300 · italic · lh 1 · $ember
    - **frame** `esp` 10×48 — layout=none
    - **T** « On étudie les arts martiaux européens à partir des traités et sources historiques, dans une pratique moderne, sportive et sécurisée. On y vient pour le geste, pas pour le costume. » — $body · 19px · wnormal · lh 1.6 · $parch-soft · fixed-width 660
    - **frame** `esp2` 10×32 — layout=none
    - **T** « Ici on s'entraîne en tenue de sport, masque d'escrime et protections modernes, avec des armes d'entraînement adaptées à chaque discipline. Les sources sont a la base de notre travail, et nous poussons leur application jusqu'en assaut, avec différent niveau d'engagement. » — $body · 16px · wnormal · lh 1.7 · $parch-mute · fixed-width 600
  - **frame** `Cadre traité` 488×hug fill=$char — layout=vertical, stroke=$parch-line 1 inner
    - **frame** `Gravure` 488×517.3 img=`public/assets/treatise.jpg` (mode fill) — layout=none
    - **frame** `Légende` fill×hug — layout=horizontal(défaut), gap=12, pad=18/22/20/22, stroke=$parch-line {"top": 1} inner
      - rect `tiret` 22×1 fill=$ember
      - **T** « Planche extraite d'un traité d'escrime historique. Étude des gardes, des distances, du timing — des gestes que l'on cherche à comprendre, puis à éprouver dans la salle. » — $body · 13.5px · wnormal · lh 1.6 · $parch-mute · fixed-width 410

#### 06 · Nous rejoindre

**Conteneur** — `fill×hug` fill=$coal — layout=vertical, pad=120/56/130/56, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (45 nœuds texte) :*

- **frame** `Label 5 · Nous rejoindre` fill×hug — layout=horizontal(défaut), gap=16, align=center, pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
  - **T** « 05 » — $eyebrow · 12.5px · w600 · ls 3.5 · $ember
  - *icon* `diamond` 8×8 fill=$ember
  - **T** « NOUS REJOINDRE » — $eyebrow · 12.5px · w600 · ls 3.5 · $parch-soft
- **frame** `esp` 10×56 — layout=none
- **frame** `Titre` hug — layout=vertical, gap=4
  - **T** « Une lame, un masque, » — $display · 70px · wnormal · lh 1 · $parch
  - **T** « et l'envie de bien faire. » — $display · 70px · w300 · italic · lh 1 · $ember
- **frame** `esp2` 10×56 — layout=none
- **T** « PRATIQUE » — $eyebrow · 10.5px · w600 · ls 3.4 · $ember
- **frame** `esp3` 10×18 — layout=none
- **frame** `Faits pratique` fill×hug — layout=vertical, stroke=$parch-line {"top": 1} inner
  - **frame** `Fait Lieu` fill×hug — layout=horizontal(défaut), gap=24, pad=18/0, stroke=$parch-line {"bottom": 1} inner
    - **T** « LIEU » — $eyebrow · 10.5px · w600 · ls 2.7 · $ember · fixed-width 200
    - **frame** `Valeur` fill×hug — layout=vertical, gap=4
      - **T** « Gymnase Robert Pras » — $body · 15.5px · w500 · lh 1.4 · $parch
      - **T** « 3 rue Jean Monnet · 63100 Clermont-Ferrand » — $body · 15px · wnormal · lh 1.4 · $parch-soft
  - **frame** `Fait Contact` fill×hug — layout=horizontal(défaut), gap=24, pad=18/0, stroke=$parch-line {"bottom": 1} inner
    - **T** « CONTACT » — $eyebrow · 10.5px · w600 · ls 2.7 · $ember · fixed-width 200
    - **frame** `Valeur` fill×hug — layout=vertical, gap=4
      - **T** « amhe63.dfda@gmail.com » — $body · 15.5px · wnormal · lh 1.4 · $parch
      - **T** « 06 61 28 65 11 » — $body · 15px · wnormal · lh 1.4 · $parch-soft
- **frame** `esp4` 10×24 — layout=none
- **T** « CRÉNEAUX HEBDOMADAIRES » — $eyebrow · 10.5px · w600 · ls 3.4 · $ember
- **frame** `esp5` 10×18 — layout=none
- **frame** `Tableau` fill×hug — layout=vertical, stroke=$parch-line {"top": 1} inner
  - **frame** `En-têtes` fill×hug — layout=horizontal(défaut), gap=24, align=center, pad=18/0, stroke=$parch-line {"bottom": 1} inner
    - **T** « JOUR » — $eyebrow · 10px · wnormal · ls 3.2 · $parch-mute · fixed-width 80
    - **T** « HORAIRE » — $eyebrow · 10px · wnormal · ls 3.2 · $parch-mute · fixed-width 220
    - **T** « DISCIPLINE » — $eyebrow · 10px · wnormal · ls 3.2 · $parch-mute · fixed-width 588.3
    - **T** « NIVEAU » — $eyebrow · 10px · wnormal · ls 3.2 · $parch-mute · fixed-width 367.7
  - **frame** `Créneau Mar` fill×hug — layout=horizontal(défaut), gap=24, align=center, pad=26/0, stroke=$parch-line {"bottom": 1} inner
    - **T** « MAR » — $body · 13px · w600 · ls 3.1 · $ember · fixed-width 80
    - **T** « 18h00 — 20h00 » — $body · 16px · w500 · $parch · fixed-width 220
    - **T** « Épée longue · rapière · messer · viking » — $body · 15px · wnormal · lh 1.4 · $parch · fixed-width 588.3
    - **T** « TOUS NIVEAUX » — $body · 10.5px · w500 · ls 2.7 · $parch-mute · fixed-width 367.7
  - **frame** `Créneau Jeu` fill×hug — layout=horizontal(défaut), gap=24, align=center, pad=26/0, stroke=$parch-line {"bottom": 1} inner
    - **T** « JEU » — $body · 13px · w600 · ls 3.1 · $ember · fixed-width 80
    - **T** « 18h00 — 20h00 » — $body · 16px · w500 · $parch · fixed-width 220
    - **T** « Pratique libre » — $body · 15px · wnormal · lh 1.4 · $parch · fixed-width 588.3
    - **T** « SANS ENCADRANT » — $body · 10.5px · w500 · ls 2.7 · $parch-mute · fixed-width 367.7
  - **frame** `Créneau Jeu` fill×hug — layout=horizontal(défaut), gap=24, align=center, pad=26/0, stroke=$parch-line {"bottom": 1} inner
    - **T** « JEU » — $body · 13px · w600 · ls 3.1 · $ember · fixed-width 80
    - **T** « 20h00 — 22h00 » — $body · 16px · w500 · $parch · fixed-width 220
    - **T** « Épée longue · épée-bocle » — $body · 15px · wnormal · lh 1.4 · $parch · fixed-width 588.3
    - **T** « TOUS NIVEAUX » — $body · 10.5px · w500 · ls 2.7 · $parch-mute · fixed-width 367.7
- **frame** `esp6` 10×40 — layout=none
- **frame** `Piliers rejoindre` fill×hug — layout=vertical, stroke=$parch-line {"top": 1} inner
  - **frame** `Pilier 01` fill×hug — layout=horizontal(défaut), gap=56, pad=48/0/44/0, stroke=$parch-line {"bottom": 1} inner
    - **T** « 01 · 01 · VIENS ESSAYER » — $eyebrow · 10.5px · w500 · ls 2.9 · $parch-mute · fixed-width 220
    - **frame** `Contenu` fill×hug — layout=vertical, gap=10
      - **frame** `hl` hug — layout=horizontal(défaut), align=end
        - **T** « Les deux premieres séances sont » — $display · 42px · wnormal · lh 1.1 · $parch
        - **T** « gratuites » — $display · 42px · w300 · italic · lh 1.1 · $ember
        - **T** « , alors pourquoi ne pas essayer ? » — $display · 42px · wnormal · lh 1.1 · $parch
      - **frame** `esp` 10×10 — layout=none
      - **T** « Peu importe que tu n'aies jamais fait de sport, que tu sortes d'un autre art martial ou que tu n'aies rien touché depuis des années — on t'accueille. Tu n'as besoin de rien apporter : on te prête le masque, et l'arme que tu veux tester (épée longue, sabre, dague, rapière…). » — $body · 16px · wnormal · lh 1.6 · $parch-soft · fixed-width 760
      - **T** « Aucun engagement, aucun frais. Viens, ça nous fait plaisir. » — $body · 16px · wnormal · lh 1.6 · $parch-soft · fixed-width 760
      - **frame** `esp2` 10×8 — layout=none
      - **frame** `Carte OSM` 760×hug — layout=vertical, radius=2, stroke=$parch-line 1 inner
        - **frame** `Fond carte` 760×230 fill=$char — layout=none, clip
          - *icon* `map-pin` 34×34 fill=$ember @363,98
        - **frame** `Légende carte` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=14/18, stroke=$parch-line {"top": 1} inner
          - **frame** `Adr` hug — layout=vertical, gap=3
            - **T** « Gymnase Robert Pras » — $body · 14.5px · w500 · $parch
            - **T** « 3 rue Jean Monnet · 63100 Clermont-Ferrand » — $body · 13px · wnormal · $parch-mute
          - **T** « OPENSTREETMAP » — $eyebrow · 9px · wnormal · ls 2 · $parch-mute
      - **frame** `esp3` 10×16 — layout=none
      - **frame** `Btn Itinéraire` hug×44 — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/22, radius=2, stroke=#ece8de47 1 inner
        - **T** « ITINÉRAIRE » — $body · 11.5px · w500 · ls 1.8 · $parch
        - *icon* `arrow-right` 11×11 fill=$parch
  - **frame** `Pilier 02` fill×hug — layout=horizontal(défaut), gap=56, pad=48/0/44/0, stroke=$parch-line {"bottom": 1} inner
    - **T** « 02 · 02 · POUR CONTINUER » — $eyebrow · 10.5px · w500 · ls 2.9 · $parch-mute · fixed-width 220
    - **frame** `Contenu` fill×hug — layout=vertical, gap=10
      - **frame** `hl` hug — layout=horizontal(défaut), align=end
        - **T** « 85 € » — $display · 42px · w500 · lh 1.1 · $parch
        - **T** « par an, un masque, des gants coqués. » — $display · 42px · wnormal · lh 1.1 · $parch
        - **T** « C'est tout. » — $display · 42px · w300 · italic · lh 1.1 · $ember
      - **frame** `esp` 10×10 — layout=none
      - **T** « Si tu décides de rester pour l'année, l'adhésion c'est 85 € — soit littéralement moins qu'un Netflix. À ça, tu ajoutes les deux seules pièces à te procurer pour les séances régulières : un masque d'escrime standard et des gants coqués. » — $body · 16px · wnormal · lh 1.6 · $parch-soft · fixed-width 760
      - **T** « Le reste — vestes, protections, armes — on en parle au fil du temps, souvent à prix d'ami chez nos partenaires. » — $body · 16px · wnormal · lh 1.6 · $parch-soft · fixed-width 760
      - **frame** `esp3` 10×16 — layout=none
      - **frame** `Btn Adhérer · HelloAsso` hug×44 fill=$ember — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/22, radius=2
        - **T** « ADHÉRER · HELLOASSO » — $body · 11.5px · w600 · ls 1.8 · $ink
        - *icon* `arrow-right` 11×11 fill=$ink

#### 07 · Tournois

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=120/56/130/56, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (15 nœuds texte) :*

- **frame** `Label 6 · Tournois & saison` fill×hug — layout=horizontal(défaut), gap=16, align=center, pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
  - **T** « 06 » — $eyebrow · 12.5px · w600 · ls 3.5 · $ember
  - *icon* `diamond` 8×8 fill=$ember
  - **T** « TOURNOIS & SAISON » — $eyebrow · 12.5px · w600 · ls 3.5 · $parch-soft
- **frame** `esp` 10×56 — layout=none
- **frame** `Split` fill×hug — layout=horizontal(défaut), gap=56
  - **frame** `Photo tournois` 489.2×652.3 — layout=none, radius=2, clip
    - rect `img` 489.2×652.3 @0,0 img=`maquette-assets/tournois.jpg` (mode fill)
    - rect `voile` 489.2×326.2 @0,326.2 fill=#08070ae0
    - **frame** `Overlay texte` 433.2×hug @28,502.3 — layout=vertical, gap=14
      - **frame** `Eyebrow` hug — layout=horizontal(défaut), gap=10, align=center
        - *icon* `diamond` 6×6 fill=$ember
        - **T** « COMPÉTITEURS » — $eyebrow · 10.5px · w600 · ls 2.9 · $parch-soft
      - **T** « Plusieurs membres engagés en compétition, référencés sur HEMA Ratings. » — $display · 24px · wnormal · lh 1.1 · $parch · fixed-width 433.2
  - **frame** `Contenu` fill×hug — layout=vertical
    - **frame** `Titre` hug — layout=vertical, gap=4
      - **T** « Saison » — $display · 66px · wnormal · lh 1 · $parch
      - **T** « de compétition. » — $display · 66px · w300 · italic · lh 1 · $ember
    - **frame** `esp` 10×28 — layout=none
    - **T** « Le club est présent sur le circuit FFAMHE et référencé sur HEMA Ratings. La compétition reste un choix : on peut pratiquer en loisir ou viser les tournois, à son rythme. » — $body · 16px · wnormal · lh 1.7 · $parch-soft · fixed-width 580
    - **frame** `esp2` 10×36 — layout=none
    - **frame** `Faits` fill×hug — layout=vertical, stroke=$parch-line {"top": 1} inner
      - **frame** `Fait Circuit FFAMHE` fill×hug — layout=horizontal(défaut), gap=24, pad=18/0, stroke=$parch-line {"bottom": 1} inner
        - **T** « CIRCUIT FFAMHE » — $eyebrow · 10.5px · w600 · ls 2.7 · $ember · fixed-width 200
        - **frame** `Valeur` fill×hug — layout=vertical, gap=4
          - **T** « épée longue, épée de coté, rapière — open / débutant / féminin » — $body · 15px · wnormal · lh 1.4 · $parch · fixed-width fill_container
      - **frame** `Fait Interclubs & stages` fill×hug — layout=horizontal(défaut), gap=24, pad=18/0, stroke=$parch-line {"bottom": 1} inner
        - **T** « INTERCLUBS & STAGES » — $eyebrow · 10.5px · w600 · ls 2.7 · $ember · fixed-width 200
        - **frame** `Valeur` fill×hug — layout=vertical, gap=4
          - **T** « échanges réguliers avec d'autres clubs AMHE » — $body · 15px · wnormal · lh 1.4 · $parch · fixed-width fill_container
      - **frame** `Fait Loisir possible` fill×hug — layout=horizontal(défaut), gap=24, pad=18/0, stroke=$parch-line {"bottom": 1} inner
        - **T** « LOISIR POSSIBLE » — $eyebrow · 10.5px · w600 · ls 2.7 · $ember · fixed-width 200
        - **frame** `Valeur` fill×hug — layout=vertical, gap=4
          - **T** « la compétition n'est jamais obligatoire » — $body · 15px · wnormal · lh 1.4 · $parch · fixed-width fill_container
    - **frame** `esp3` 10×40 — layout=none
    - **frame** `CTAs` hug — layout=horizontal(défaut), gap=16
      - **frame** `Btn Résultats HEMA Ratings` hug×44 — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/22, radius=2, stroke=#ece8de47 1 inner
        - **T** « RÉSULTATS HEMA RATINGS » — $body · 11.5px · w500 · ls 1.8 · $parch
        - *icon* `arrow-right` 11×11 fill=$parch
      - **frame** `Btn Calendrier FFAMHE` hug×44 — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/22
        - **T** « CALENDRIER FFAMHE » — $body · 11.5px · w500 · ls 1.8 · $parch
        - *icon* `arrow-right` 11×11 fill=$parch

#### 08 · Galerie

**Conteneur** — `fill×hug` fill=$coal — layout=vertical, pad=120/56/130/56, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (11 nœuds texte) :*

- **frame** `Label 7 · Galerie` fill×hug — layout=horizontal(défaut), gap=16, align=center, pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
  - **T** « 07 » — $eyebrow · 12.5px · w600 · ls 3.5 · $ember
  - *icon* `diamond` 8×8 fill=$ember
  - **T** « GALERIE » — $eyebrow · 12.5px · w600 · ls 3.5 · $parch-soft
- **frame** `esp` 10×56 — layout=none
- **frame** `Section head` fill×hug — layout=horizontal(défaut), justify=space_between, align=end, pad=0/0/64/0
  - **frame** `Titre` hug — layout=vertical, gap=4
    - **T** « Quelques » — $display · 76px · wnormal · lh 1 · $parch
    - **T** « images de salle. » — $display · 76px · w300 · italic · lh 1 · $ember
  - **frame** `Btn Suivre sur Facebook` hug×44 — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/22, radius=2, stroke=#ece8de47 1 inner
    - **T** « SUIVRE SUR FACEBOOK » — $body · 11.5px · w500 · ls 1.8 · $parch
    - *icon* `arrow-right` 11×11 fill=$parch
- **frame** `Grille galerie` fill×1192 — layout=none
  - **frame** `Tuile 1` 769.7×504 @0,0 — layout=none, clip
    - rect `img` 769.7×504 @0,0 img=`maquette-assets/galerie-1.jpg` (mode fill)
    - rect `voile bas` 769.7×64 @0,440 fill=#08070a80
    - **T** « À l'assaut » — $display · 14.5px · wnormal · italic · $parch @16,468
  - **frame** `Tuile 2` 546.3×332 @781.7,0 — layout=none, clip
    - rect `img` 546.3×332 @0,0 img=`maquette-assets/galerie-2.jpg` (mode fill)
    - rect `voile bas` 546.3×64 @0,268 fill=#08070a80
    - **T** « Médiévale de Montferrand » — $display · 14.5px · wnormal · italic · $parch @16,296
  - **frame** `Tuile 3` 546.3×332 @781.7,344 — layout=none, clip
    - rect `img` 546.3×332 @0,0 img=`maquette-assets/galerie-3.jpg` (mode fill)
    - rect `voile bas` 546.3×64 @0,268 fill=#08070a80
    - **T** « Au contact » — $display · 14.5px · wnormal · italic · $parch @16,296
  - **frame** `Tuile 4` 434.7×504 @0,688 — layout=none, clip
    - rect `img` 434.7×504 @0,0 img=`maquette-assets/galerie-4.jpg` (mode fill)
    - rect `voile bas` 434.7×64 @0,440 fill=#08070a80
    - **T** « En garde » — $display · 14.5px · wnormal · italic · $parch @16,468
  - **frame** `Tuile 5` 434.7×504 @446.7,688 — layout=none, clip
    - rect `img` 434.7×504 @0,0 img=`maquette-assets/galerie-5.jpg` (mode fill)
    - rect `voile bas` 434.7×64 @0,440 fill=#08070a80
    - **T** « Combat viking » — $display · 14.5px · wnormal · italic · $parch @16,468
  - **frame** `Tuile 6` 434.7×504 @893.3,688 — layout=none, clip
    - rect `img` 434.7×504 @0,0 img=`maquette-assets/galerie-6.jpg` (mode fill)
    - rect `voile bas` 434.7×64 @0,440 fill=#08070a80
    - **T** « Le duel » — $display · 14.5px · wnormal · italic · $parch @16,468

#### 09 · FAQ

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=120/56/130/56, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (14 nœuds texte) :*

- **frame** `Label 8 · Questions fréquentes` fill×hug — layout=horizontal(défaut), gap=16, align=center, pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
  - **T** « 08 » — $eyebrow · 12.5px · w600 · ls 3.5 · $ember
  - *icon* `diamond` 8×8 fill=$ember
  - **T** « QUESTIONS FRÉQUENTES » — $eyebrow · 12.5px · w600 · ls 3.5 · $parch-soft
- **frame** `esp` 10×56 — layout=none
- **frame** `Section head` fill×hug — layout=horizontal(défaut), justify=space_between, align=end, pad=0/0/64/0
  - **frame** `Titre` hug — layout=vertical, gap=4
    - **T** « Tout ce qu'on » — $display · 76px · wnormal · lh 1 · $parch
    - **T** « nous demande. » — $display · 76px · w300 · italic · lh 1 · $ember
  - **T** « Les questions qu'on entend le plus souvent au premier contact. Si la vôtre n'y est pas, écrivez-nous — on répond. » — $body · 16px · wnormal · lh 1.7 · $parch-mute · fixed-width 460
- **frame** `Items` fill×hug — layout=vertical, stroke=#ece8de38 {"top": 1} inner
  - **frame** `Item FAQ 1` fill×hug fill=#e0552c08 — layout=vertical, stroke=#ece8de38 {"bottom": 1} inner
    - **frame** `Q` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=26/16
      - **T** « Faut-il déjà faire du sport ou de l'escrime ? » — $body · 17px · w500 · lh 1.4 · $ember · fixed-width 1250
      - *icon* `minus` 14×14 fill=$ember
    - **frame** `Réponse` fill×hug — layout=horizontal(défaut), pad=0/16/30/16
      - **T** « Non. La séance accueille tous niveaux et l'encadrement prend le temps avec les débutants — on commence par comprendre le geste avant de l'enchaîner. Aucun pré-requis sportif ou martial. » — $body · 15px · wnormal · lh 1.6 · $parch-soft · fixed-width 1036
  - **frame** `Item FAQ 2` fill×hug — layout=vertical, stroke=#ece8de38 {"bottom": 1} inner
    - **frame** `Q` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=26/16
      - **T** « C'est dangereux ? » — $body · 17px · w500 · lh 1.4 · $parch · fixed-width 1250
      - *icon* `plus` 14×14 fill=$parch-soft
  - **frame** `Item FAQ 3` fill×hug — layout=vertical, stroke=#ece8de38 {"bottom": 1} inner
    - **frame** `Q` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=26/16
      - **T** « À quoi ressemble une séance ? » — $body · 17px · w500 · lh 1.4 · $parch · fixed-width 1250
      - *icon* `plus` 14×14 fill=$parch-soft
  - **frame** `Item FAQ 4` fill×hug — layout=vertical, stroke=#ece8de38 {"bottom": 1} inner
    - **frame** `Q` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=26/16
      - **T** « Que dois-je apporter pour la première séance ? » — $body · 17px · w500 · lh 1.4 · $parch · fixed-width 1250
      - *icon* `plus` 14×14 fill=$parch-soft
  - **frame** `Item FAQ 5` fill×hug — layout=vertical, stroke=#ece8de38 {"bottom": 1} inner
    - **frame** `Q` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=26/16
      - **T** « Combien coûte l'adhésion ? » — $body · 17px · w500 · lh 1.4 · $parch · fixed-width 1250
      - *icon* `plus` 14×14 fill=$parch-soft
  - **frame** `Item FAQ 6` fill×hug — layout=vertical, stroke=#ece8de38 {"bottom": 1} inner
    - **frame** `Q` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=26/16
      - **T** « Quels créneaux et quel lieu ? » — $body · 17px · w500 · lh 1.4 · $parch · fixed-width 1250
      - *icon* `plus` 14×14 fill=$parch-soft
  - **frame** `Item FAQ 7` fill×hug — layout=vertical, stroke=#ece8de38 {"bottom": 1} inner
    - **frame** `Q` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=26/16
      - **T** « Faut-il venir à toutes les séances ? » — $body · 17px · w500 · lh 1.4 · $parch · fixed-width 1250
      - *icon* `plus` 14×14 fill=$parch-soft
  - **frame** `Item FAQ 8` fill×hug — layout=vertical, stroke=#ece8de38 {"bottom": 1} inner
    - **frame** `Q` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=26/16
      - **T** « Faut-il faire de la compétition ? » — $body · 17px · w500 · lh 1.4 · $parch · fixed-width 1250
      - *icon* `plus` 14×14 fill=$parch-soft

#### 10 · Partenaires

**Conteneur** — `fill×hug` fill=$coal — layout=vertical, pad=120/56/110/56, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (17 nœuds texte) :*

- **frame** `Label 9 · Partenaires` fill×hug — layout=horizontal(défaut), gap=16, align=center, pad=0/0/22/0, stroke=$parch-line {"bottom": 1} inner
  - **T** « 09 » — $eyebrow · 12.5px · w600 · ls 3.5 · $ember
  - *icon* `diamond` 8×8 fill=$ember
  - **T** « PARTENAIRES » — $eyebrow · 12.5px · w600 · ls 3.5 · $parch-soft
- **frame** `esp` 10×56 — layout=none
- **frame** `Titre` hug — layout=vertical, gap=4
  - **T** « Sans eux, » — $display · 70px · wnormal · lh 1 · $parch
  - **T** « rien de tout ça. » — $display · 70px · w300 · italic · lh 1 · $ember
- **frame** `esp2` 10×28 — layout=none
- **T** « Un club n'existe pas tout seul. Il existe parce qu'une fédération porte la discipline au niveau national, parce que des artisans fabriquent du matériel pensé pour cette pratique, et parce que ces gens-là partagent la même exigence que nous. Les trois ci-dessous, on ne se contente pas de les mentionner — on les recommande, on travaille avec eux, et on t'invite à aller voir. » — $body · 16px · wnormal · lh 1.7 · $parch-soft · fixed-width 760
- **frame** `esp3` 10×64 — layout=none
- **frame** `Rangées` fill×hug — layout=vertical
  - **frame** `Partenaire FFAMHE` fill×hug — layout=horizontal(défaut), gap=72, align=center, pad=56/0, stroke=$parch-line {"bottom": 1} inner
    - **frame** `Logo FFAMHE` 240×120 img=`public/assets/logo_signature_FFAMHE.png` (mode fit) — layout=none
    - **frame** `Contenu` fill×hug — layout=vertical, gap=12
      - **T** « AFFILIATION » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « FFAMHE » — $display · 34px · w500 · lh 1.1 · $parch
      - **T** « La Fédération Française des Arts Martiaux Historiques Européens est la colonne vertébrale de tout le milieu AMHE en France. Sans elle, pas de circuit de tournois national, pas de lien entre les associations, pas de cadre pour assurer et reconnaître les clubs. Notre affiliation, c'est ce qui permet au club de rejoindre la scène nationale, et à chaque séance ici d'être rattachée à un travail collectif beaucoup plus large que notre seule salle. » — $body · 15px · wnormal · lh 1.6 · $parch-soft · fixed-width 976
      - **frame** `esp` 10×8 — layout=none
      - **frame** `Btn Visiter la FFAMHE` hug×44 — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/22, radius=2, stroke=#ece8de47 1 inner
        - **T** « VISITER LA FFAMHE » — $body · 11.5px · w500 · ls 1.8 · $parch
        - *icon* `arrow-right` 11×11 fill=$parch
  - **frame** `Partenaire Faits d'Armes` fill×hug — layout=horizontal(défaut), gap=72, align=center, pad=56/0, stroke=$parch-line {"bottom": 1} inner
    - **frame** `Logo Faits d'Armes` 240×120 img=`public/assets/Fait-d'arme-logo.png` (mode fit) — layout=none
    - **frame** `Contenu` fill×hug — layout=vertical, gap=12
      - **T** « ÉQUIPEMENT » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « Faits d'Armes » — $display · 34px · w500 · lh 1.1 · $parch
      - **T** « Entrepreneur français travaillant directement avec les pratiquants. Vestes 350N ou 800N, gants coqués, protections rigides — chaque pièce est conçue pour résister aux assauts longue épée et durer. Quand tu veux monter ton équipement sérieusement, c'est par là qu'on commence à regarder. Fait d'armes dispose d'un vaste catalogue, et en plus, il est a deux pas d'ici. » — $body · 15px · wnormal · lh 1.6 · $parch-soft · fixed-width 976
      - **frame** `esp` 10×8 — layout=none
      - **frame** `Btn Voir leurs équipements` hug×44 — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/22, radius=2, stroke=#ece8de47 1 inner
        - **T** « VOIR LEURS ÉQUIPEMENTS » — $body · 11.5px · w500 · ls 1.8 · $parch
        - *icon* `arrow-right` 11×11 fill=$parch
  - **frame** `Partenaire Black Armoury` fill×hug — layout=horizontal(défaut), gap=72, align=center, pad=56/0, stroke=$parch-line {"bottom": 1} inner
    - **frame** `Logo Black Armoury` 240×120 img=`public/assets/black-armoury-logo.jpg` (mode fit) — layout=none
    - **frame** `Contenu` fill×hug — layout=vertical, gap=12
      - **T** « ÉQUIPEMENT » — $eyebrow · 10.5px · w600 · ls 2.9 · $ember
      - **T** « Black Armoury » — $display · 34px · w500 · lh 1.1 · $parch
      - **T** « Partenaire incontournable de la scène AMHE. Black Armoury a développé de nombreux produits aujourd'hui exclusifs a sa marque, la Veste Arcem notament est l'un des produits les mieux désigné pour notre pratique, et largement privilégié au club. Avec sa volonté d'innover sur le matériel et les protections, Black armoury s'impose dans la production d'equipement toujours plus calibré pour nos besoins. » — $body · 15px · wnormal · lh 1.6 · $parch-soft · fixed-width 976
      - **frame** `esp` 10×8 — layout=none
      - **frame** `Btn Voir leurs lames` hug×44 — layout=horizontal(défaut), gap=12, justify=center, align=center, pad=0/22, radius=2, stroke=#ece8de47 1 inner
        - **T** « VOIR LEURS LAMES » — $body · 11.5px · w500 · ls 1.8 · $parch
        - *icon* `arrow-right` 11×11 fill=$parch

#### Footer

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=80/56/32/56, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (24 nœuds texte) :*

- **frame** `Marquee` fill×hug — layout=horizontal(défaut), gap=26, justify=center, align=end, pad=0/0/64/0
  - **T** « De » — $display · 115px · w500 · lh 0.9 · $parch
  - **T** « Feu » — $display · 115px · w500 · lh 0.9 · $feu
  - **T** « et d' » — $display · 115px · w300 · italic · lh 0.9 · $parch
  - **T** « Acier » — $display · 115px · w500 · lh 0.9 · $acier
- **frame** `Grille footer` fill×hug — layout=horizontal(défaut), gap=48, pad=56/0/64/0, stroke=$parch-line {"top": 1} inner
  - **frame** `Marque` 296×hug — layout=vertical, gap=20
    - **frame** `Logo` 56×56 img=`public/assets/logo.png` (mode fill) — layout=none
    - **T** « Section AMHE de l'USAM Clermont-Ferrand, affiliée à la FFAMHE. Arts martiaux historiques européens au cœur du Puy-de-Dôme. » — $body · 13px · wnormal · lh 1.6 · $parch-mute · fixed-width 260
  - **frame** `Col Le club` 296×hug — layout=vertical, gap=12
    - **T** « LE CLUB » — $eyebrow · 10px · w500 · ls 2.6 · $parch-mute
    - **frame** `esp` 10×10 — layout=none
    - **T** « La rigueur » — $body · 14.5px · wnormal · $parch
    - **T** « Disciplines » — $body · 14.5px · wnormal · $parch
    - **T** « FAQ » — $body · 14.5px · wnormal · $parch
    - **T** « Tournois » — $body · 14.5px · wnormal · $parch
    - **T** « Galerie » — $body · 14.5px · wnormal · $parch
  - **frame** `Col Pratique` 296×hug — layout=vertical, gap=12
    - **T** « PRATIQUE » — $eyebrow · 10px · w500 · ls 2.6 · $parch-mute
    - **frame** `esp` 10×10 — layout=none
    - **T** « Nous rejoindre » — $body · 14.5px · wnormal · $parch
    - **T** « Adhésion » — $body · 14.5px · wnormal · $parch
    - **T** « Nous écrire » — $body · 14.5px · wnormal · $parch
    - **T** « HelloAsso » — $body · 14.5px · wnormal · $parch
  - **frame** `Col Suivre` 296×hug — layout=vertical, gap=12
    - **T** « SUIVRE » — $eyebrow · 10px · w500 · ls 2.6 · $parch-mute
    - **frame** `esp` 10×10 — layout=none
    - **T** « Facebook » — $body · 14.5px · wnormal · $parch
    - **T** « HEMA Ratings » — $body · 14.5px · wnormal · $parch
    - **T** « USAM Clermont » — $body · 14.5px · wnormal · $parch
    - **T** « FFAMHE » — $body · 14.5px · wnormal · $parch
- **frame** `Bas de page` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=32/0/0/0, stroke=$parch-line {"top": 1} inner
  - **T** « © 2026 · DE FEU ET D'ACIER · CLERMONT-FERRAND » — $eyebrow · 10px · w500 · ls 2.6 · $parch-mute
  - **frame** `Légal` hug — layout=horizontal(défaut), gap=22
    - **T** « MENTIONS LÉGALES » — $eyebrow · 10px · w500 · ls 2.6 · $parch-mute
    - **T** « CONFIDENTIALITÉ » — $eyebrow · 10px · w500 · ls 2.6 · $parch-mute

### 8.4 Arbre exhaustif — `Mobile — 390` (V1)

#### 01 · Accueil (sans scroll)

**Conteneur** — `390×780` fill=$ink — layout=none, clip

*Arbre exhaustif (14 nœuds texte) :*

- rect `BG` 390×780 @0,0 img=`maquette-assets/hero.jpg` (mode fill)
- rect `Voile` 390×780 @0,0 fill=#0a0908b8
- **frame** `Barre du haut` 390×hug @0,0 — layout=horizontal(défaut), justify=space_between, align=center, pad=14/18
  - **frame** `Logo` 38×38 img=`public/assets/logo.png` (mode fill) — layout=none
  - *icon* `menu` 24×24 fill=$parch
- **frame** `Contenu` 346×hug @22,196 — layout=vertical, align=center
  - **T** « ARTS MARTIAUX HISTORIQUES EUROPÉENS » — $eyebrow · 9.5px · w600 · ls 3 · $parch-soft · align center · fixed-width 346
  - **frame** `esp` 10×18 — layout=none
  - **frame** `H1` hug — layout=vertical, gap=6, align=center
    - **frame** `l1` hug — layout=horizontal(défaut), gap=15, justify=center, align=end
      - **T** « De » — $display · 62px · w500 · lh 0.9 · $parch
      - **T** « Feu » — $display · 62px · w500 · lh 0.9 · $feu
    - **frame** `l2` hug — layout=horizontal(défaut), gap=8, justify=center, align=end
      - **T** « et d' » — $display · 62px · w300 · italic · lh 0.9 · $parch
      - **T** « Acier » — $display · 62px · w500 · lh 0.9 · $acier
  - **frame** `esp` 10×22 — layout=none
  - rect `Filet` 44×1 fill=#ece8de52
  - **frame** `esp` 10×20 — layout=none
  - **T** « à Clermont-Ferrand » — $display · 21px · w500 · italic · lh 1.2 · $parch
  - **frame** `esp` 10×26 — layout=none
  - **T** « MAR · JEU 18H–22H  —  ESSAI OFFERT » — $eyebrow · 10px · w500 · ls 2.4 · $parch-mute
  - **frame** `esp` 10×22 — layout=none
  - **frame** `CTA` hug×48 — layout=horizontal(défaut), gap=10, justify=center, align=center, pad=0/30, radius=2, stroke=#ece8de47 1 inner
    - **T** « VENIR ESSAYER » — $body · 11px · w500 · ls 2.2 · $parch
    - *icon* `arrow-right` 11×11 fill=$parch
- **frame** `Cue` 390×hug @0,644 — layout=vertical, gap=6, align=center
  - *icon* `chevron-down` 18×18 fill=$parch-mute
  - **T** « DÉCOUVRIR » — $eyebrow · 8.5px · w500 · ls 2.8 · $parch-mute
- **frame** `Tab bar` 390×80 @0,700 fill=#0a0908f2 — layout=horizontal(défaut), justify=space_between, align=end, pad=0/10/8/10, stroke=$parch-line {"top": 1} inner
  - **frame** `Tab Accueil` 72×66 — layout=vertical, gap=5, justify=center, align=center
    - rect `marqueur` 14×2 fill=$ember radius=2
    - *icon* `house` 19×19 fill=$parch
    - **T** « ACCUEIL » — $eyebrow · 8px · w600 · ls 1.2 · $parch
  - **frame** `Tab Armes` 72×66 — layout=vertical, gap=5, justify=center, align=center
    - **frame** `esp` 14×2 — layout=none
    - *icon* `sword` 19×19 fill=$parch-mute
    - **T** « ARMES » — $eyebrow · 8px · w600 · ls 1.2 · $parch-mute
  - **frame** `Tab Essayer` 76×hug — layout=vertical, gap=4, align=center
    - **frame** `Rond` 46×46 fill=$ember — layout=horizontal(défaut), justify=center, align=center, radius=99
      - *icon* `swords` 20×20 fill=$ink
    - **T** « ESSAYER » — $eyebrow · 8px · w600 · ls 1.2 · $parch
  - **frame** `Tab Photos` 72×66 — layout=vertical, gap=5, justify=center, align=center
    - **frame** `esp` 14×2 — layout=none
    - *icon* `image` 19×19 fill=$parch-mute
    - **T** « PHOTOS » — $eyebrow · 8px · w600 · ls 1.2 · $parch-mute
  - **frame** `Tab Contact` 72×66 — layout=vertical, gap=5, justify=center, align=center
    - **frame** `esp` 14×2 — layout=none
    - *icon* `phone` 19×19 fill=$parch-mute
    - **T** « CONTACT » — $eyebrow · 8px · w600 · ls 1.2 · $parch-mute

#### 02 · Les armes

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=56/0/60/0, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (15 nœuds texte) :*

- **frame** `Tête Les armes` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=0/22/18/22
  - **frame** `Eyebrow Les armes` hug — layout=horizontal(défaut), gap=10, align=center
    - **T** « 01 » — $eyebrow · 10.5px · w600 · ls 2.6 · $ember
    - *icon* `diamond` 6×6 fill=$ember
    - **T** « LES ARMES » — $eyebrow · 10.5px · w600 · ls 2.6 · $parch-soft
  - **frame** `Swipe` hug — layout=horizontal(défaut), gap=6, align=center
    - **T** « GLISSER » — $eyebrow · 9px · w600 · ls 2 · $parch-mute
    - *icon* `chevrons-right` 12×12 fill=$parch-mute
- **frame** `Carousel` 390×350 — layout=none, clip
  - **frame** `Carte Combat viking` 258×350 @22,0 — layout=none, radius=3, clip
    - rect `Photo` 258×350 @0,0 img=`maquette-assets/disc-viking.jpg` (mode fill)
    - rect `Voile` 258×350 @0,0 fill=#08070a52
    - rect `Assise` 258×150 @0,200 fill=#08070ac9
    - **frame** `Époque` hug @16,16 fill=#0a0908a6 — layout=horizontal(défaut), pad=6/10, radius=99, stroke=#ece8de38 1 inner
      - **T** « VIIIᵉ — XIᵉ S. » — $eyebrow · 9px · w600 · ls 1.6 · $parch
    - **frame** `Bas` 218×hug @20,258 — layout=vertical, gap=6
      - **T** « Combat viking » — $display · 27px · wnormal · lh 1 · $parch
      - **T** « Bouclier & arme courte » — $body · 11.5px · wnormal · lh 1.4 · $parch-soft · fixed-width 218
  - **frame** `Carte Épée longue` 258×350 @292,0 — layout=none, radius=3, clip
    - rect `Photo` 258×350 @0,0 img=`maquette-assets/disc-epee-longue.jpg` (mode fill)
    - rect `Voile` 258×350 @0,0 fill=#08070a52
    - rect `Assise` 258×150 @0,200 fill=#08070ac9
    - **frame** `Époque` hug @16,16 fill=#0a0908a6 — layout=horizontal(défaut), pad=6/10, radius=99, stroke=#ece8de38 1 inner
      - **T** « XIVᵉ — XVᵉ S. » — $eyebrow · 9px · w600 · ls 1.6 · $parch
    - **frame** `Bas` 218×hug @20,258 — layout=vertical, gap=6
      - **T** « Épée longue » — $display · 27px · wnormal · lh 1 · $parch
      - **T** « Arme emblématique des AMHE » — $body · 11.5px · wnormal · lh 1.4 · $parch-soft · fixed-width 218
  - **frame** `Carte Messer` 258×350 @562,0 — layout=none, radius=3, clip
    - rect `Photo` 258×350 @0,0 img=`maquette-assets/disc-messer.jpg` (mode fill)
    - rect `Voile` 258×350 @0,0 fill=#08070a52
    - rect `Assise` 258×150 @0,200 fill=#08070ac9
    - **frame** `Époque` hug @16,16 fill=#0a0908a6 — layout=horizontal(défaut), pad=6/10, radius=99, stroke=#ece8de38 1 inner
      - **T** « XVᵉ S. » — $eyebrow · 9px · w600 · ls 1.6 · $parch
    - **frame** `Bas` 218×hug @20,258 — layout=vertical, gap=6
      - **T** « Messer » — $display · 27px · wnormal · lh 1 · $parch
      - **T** « Grand couteau de combat » — $body · 11.5px · wnormal · lh 1.4 · $parch-soft · fixed-width 218
  - **frame** `Carte Rapière` 258×350 @832,0 — layout=none, radius=3, clip
    - rect `Photo` 258×350 @0,0 img=`maquette-assets/disc-rapiere.jpg` (mode fill)
    - rect `Voile` 258×350 @0,0 fill=#08070a52
    - rect `Assise` 258×150 @0,200 fill=#08070ac9
    - **frame** `Époque` hug @16,16 fill=#0a0908a6 — layout=horizontal(défaut), pad=6/10, radius=99, stroke=#ece8de38 1 inner
      - **T** « XVIᵉ — XVIIᵉ S. » — $eyebrow · 9px · w600 · ls 1.6 · $parch
    - **frame** `Bas` 218×hug @20,258 — layout=vertical, gap=6
      - **T** « Rapière » — $display · 27px · wnormal · lh 1 · $parch
      - **T** « Escrime de la Renaissance » — $body · 11.5px · wnormal · lh 1.4 · $parch-soft · fixed-width 218
- **frame** `Points` fill×hug — layout=horizontal(défaut), gap=6, justify=center, align=center, pad=16/0/0/0
  - rect `d1` 18×3 fill=$ember radius=2
  - rect `d2` 7×3 fill=#ece8de38 radius=2
  - rect `d3` 7×3 fill=#ece8de38 radius=2
  - rect `d4` 7×3 fill=#ece8de38 radius=2

#### 03 · Manifesto

**Conteneur** — `390×290` — layout=none, clip

*Arbre exhaustif (4 nœuds texte) :*

- rect `BG` 390×290 @0,0 img=`maquette-assets/galerie-3.jpg` (mode fill)
- rect `Voile` 390×290 @0,0 fill=#0a0908c9
- **frame** `Texte` 346×hug @22,74 — layout=vertical, gap=2, align=center
  - **T** « LA RIGUEUR » — $eyebrow · 10px · w600 · ls 3 · $ember
  - **frame** `esp` 10×4 — layout=none
  - **T** « « Le geste juste, » — $display · 30px · wnormal · italic · lh 1.1 · $parch
  - **T** « avant le costume. » » — $display · 30px · wnormal · italic · lh 1.1 · $ember
  - **frame** `esp` 10×8 — layout=none
  - **T** « Traités historiques · pratique moderne & sécurisée » — $body · 11.5px · w500 · $parch-soft

#### 04 · Le club en bref

**Conteneur** — `fill×hug` fill=$coal — layout=vertical, pad=56/0/60/0, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (10 nœuds texte) :*

- **frame** `Tête Le club` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=0/22/18/22
  - **frame** `Eyebrow Le club` hug — layout=horizontal(défaut), gap=10, align=center
    - **T** « 02 » — $eyebrow · 10.5px · w600 · ls 2.6 · $ember
    - *icon* `diamond` 6×6 fill=$ember
    - **T** « LE CLUB » — $eyebrow · 10.5px · w600 · ls 2.6 · $parch-soft
- **frame** `Contenu` fill×hug — layout=vertical, pad=0/22
  - **frame** `Tuiles` fill×hug — layout=vertical, gap=10
    - **frame** `r1` hug — layout=horizontal(défaut), gap=10
      - **frame** `Tuile 04` 168×112 fill=#ece8de08 — layout=vertical, gap=6, justify=center, pad=16, radius=3, stroke=$parch-line 1 inner
        - *icon* `swords` 16×16 fill=$ember
        - **T** « 04 » — $display · 30px · w500 · lh 1 · $parch
        - **T** « ARMES ENSEIGNÉES » — $eyebrow · 8.5px · w600 · ls 1.6 · lh 1.5 · $parch-mute · fixed-width 136
      - **frame** `Tuile 03` 168×112 fill=#ece8de08 — layout=vertical, gap=6, justify=center, pad=16, radius=3, stroke=$parch-line 1 inner
        - *icon* `users` 16×16 fill=$ember
        - **T** « 03 » — $display · 30px · w500 · lh 1 · $parch
        - **T** « ENCADRANTS · 3 ÉCOLES » — $eyebrow · 8.5px · w600 · ls 1.6 · lh 1.5 · $parch-mute · fixed-width 136
    - **frame** `r2` hug — layout=horizontal(défaut), gap=10
      - **frame** `Tuile Top 1 %` 168×112 fill=$ember — layout=vertical, gap=6, justify=center, pad=16, radius=3
        - *icon* `trophy` 16×16 fill=$ink
        - **T** « Top 1 % » — $display · 30px · w500 · lh 1 · $ink
        - **T** « MONDIAL · ÉPÉE LONGUE ACIER » — $eyebrow · 8.5px · w600 · ls 1.6 · lh 1.5 · #0a0908b3 · fixed-width 136
      - **frame** `Tuile FFAMHE` 168×112 fill=#ece8de08 — layout=vertical, gap=6, justify=center, pad=16, radius=3, stroke=$parch-line 1 inner
        - *icon* `shield` 16×16 fill=$ember
        - **T** « FFAMHE » — $display · 30px · w500 · lh 1 · $parch
        - **T** « CLUB AFFILIÉ · CIRCUIT NATIONAL » — $eyebrow · 8.5px · w600 · ls 1.6 · lh 1.5 · $parch-mute · fixed-width 136

#### 05 · Les profs

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=56/0/60/0, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (9 nœuds texte) :*

- **frame** `Tête Les profs` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=0/22/18/22
  - **frame** `Eyebrow Les profs` hug — layout=horizontal(défaut), gap=10, align=center
    - **T** « 03 » — $eyebrow · 10.5px · w600 · ls 2.6 · $ember
    - *icon* `diamond` 6×6 fill=$ember
    - **T** « LES PROFS » — $eyebrow · 10.5px · w600 · ls 2.6 · $parch-soft
  - **frame** `Swipe` hug — layout=horizontal(défaut), gap=6, align=center
    - **T** « GLISSER » — $eyebrow · 9px · w600 · ls 2 · $parch-mute
    - *icon* `chevrons-right` 12×12 fill=$parch-mute
- **frame** `Rangée profs` 390×232 — layout=none, clip
  - **frame** `Prof Marie Poignant` 158×hug @22,0 fill=#ece8de06 — layout=vertical, radius=3, stroke=$parch-line 1 inner, clip
    - **frame** `Photo` 158×150 img=`public/assets/Marie.png` (mode fill) — layout=none
    - **frame** `Infos` fill×hug — layout=vertical, gap=4, pad=12/12/14/12
      - **T** « Marie » — $display · 18px · w500 · lh 1 · $parch
      - **T** « RAPIÈRE » — $eyebrow · 8.5px · w600 · ls 1.4 · lh 1.5 · $ember · fixed-width 134
  - **frame** `Prof Gabriel Tardio` 158×hug @192,0 fill=#e0552c0d — layout=vertical, radius=3, stroke=#e0552c52 1 inner, clip
    - **frame** `Photo` 158×150 img=`public/assets/Gabriel.jpg` (mode fill) — layout=none
    - **frame** `Infos` fill×hug — layout=vertical, gap=4, pad=12/12/14/12
      - **T** « Gabriel » — $display · 18px · w500 · lh 1 · $parch
      - **T** « ÉPÉE LONGUE » — $eyebrow · 8.5px · w600 · ls 1.4 · lh 1.5 · $ember · fixed-width 134
  - **frame** `Prof Ludwig Fort` 158×hug @362,0 fill=#ece8de06 — layout=vertical, radius=3, stroke=$parch-line 1 inner, clip
    - **frame** `Photo` 158×150 img=`public/assets/Ludwig.jpeg` (mode fill) — layout=none
    - **frame** `Infos` fill×hug — layout=vertical, gap=4, pad=12/12/14/12
      - **T** « Ludwig » — $display · 18px · w500 · lh 1 · $parch
      - **T** « MESSER · VIKING · BOCLE » — $eyebrow · 8.5px · w600 · ls 1.4 · lh 1.5 · $ember · fixed-width 134

#### 06 · Essayer

**Conteneur** — `fill×hug` fill=$coal — layout=vertical, pad=56/0/60/0, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (15 nœuds texte) :*

- **frame** `Tête Venir essayer` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=0/22/18/22
  - **frame** `Eyebrow Venir essayer` hug — layout=horizontal(défaut), gap=10, align=center
    - **T** « 04 » — $eyebrow · 10.5px · w600 · ls 2.6 · $ember
    - *icon* `diamond` 6×6 fill=$ember
    - **T** « VENIR ESSAYER » — $eyebrow · 10.5px · w600 · ls 2.6 · $parch-soft
- **frame** `Contenu` fill×hug — layout=vertical, pad=0/22
  - **frame** `Titre` hug — layout=vertical, gap=8
    - **frame** `l1` hug — layout=horizontal(défaut), gap=11, align=end
      - **T** « 2 séances » — $display · 40px · w500 · lh 1 · $ember
      - **T** « offertes. » — $display · 40px · w300 · italic · lh 1 · $parch
    - **T** « Sans engagement, matériel prêté. » — $display · 14px · wnormal · italic · lh 1.3 · $parch-soft
  - **frame** `esp` 10×20 — layout=none
  - **frame** `Faits` fill×hug — layout=vertical, stroke=$parch-line {"top": 1} inner
    - **frame** `Fait` fill×hug — layout=horizontal(défaut), gap=14, align=center, pad=13/0, stroke=$parch-line {"bottom": 1} inner
      - **frame** `Ico` 30×30 fill=#e0552c14 — layout=horizontal(défaut), justify=center, align=center, radius=99
        - *icon* `map-pin` 15×15 fill=$ember
      - **frame** `Txt` fill×hug — layout=vertical, gap=2
        - **T** « Gymnase Robert Pras » — $body · 14.5px · w500 · lh 1.4 · $parch · fixed-width 300
        - **T** « 3 rue Jean Monnet · 63100 Clermont-Ferrand » — $body · 12px · wnormal · lh 1.4 · $parch-mute · fixed-width 300
    - **frame** `Fait` fill×hug — layout=horizontal(défaut), gap=14, align=center, pad=13/0, stroke=$parch-line {"bottom": 1} inner
      - **frame** `Ico` 30×30 fill=#e0552c14 — layout=horizontal(défaut), justify=center, align=center, radius=99
        - *icon* `clock` 15×15 fill=$ember
      - **frame** `Txt` fill×hug — layout=vertical, gap=2
        - **T** « Mar 18h–20h · Jeu 18h–22h » — $body · 14.5px · w500 · lh 1.4 · $parch · fixed-width 300
        - **T** « Tous niveaux, débutants bienvenus » — $body · 12px · wnormal · lh 1.4 · $parch-mute · fixed-width 300
    - **frame** `Fait` fill×hug — layout=horizontal(défaut), gap=14, align=center, pad=13/0, stroke=$parch-line {"bottom": 1} inner
      - **frame** `Ico` 30×30 fill=#e0552c14 — layout=horizontal(défaut), justify=center, align=center, radius=99
        - *icon* `euro` 15×15 fill=$ember
      - **frame** `Txt` fill×hug — layout=vertical, gap=2
        - **T** « 85 € / an ensuite » — $body · 14.5px · w500 · lh 1.4 · $parch · fixed-width 300
        - **T** « Un masque, des gants coqués — c'est tout » — $body · 12px · wnormal · lh 1.4 · $parch-mute · fixed-width 300
    - **frame** `Fait` fill×hug — layout=horizontal(défaut), gap=14, align=center, pad=13/0, stroke=$parch-line {"bottom": 1} inner
      - **frame** `Ico` 30×30 fill=#e0552c14 — layout=horizontal(défaut), justify=center, align=center, radius=99
        - *icon* `phone` 15×15 fill=$ember
      - **frame** `Txt` fill×hug — layout=vertical, gap=2
        - **T** « 06 61 28 65 11 » — $body · 14.5px · w500 · lh 1.4 · $parch · fixed-width 300
        - **T** « amhe63.dfda@gmail.com » — $body · 12px · wnormal · lh 1.4 · $parch-mute · fixed-width 300
  - **frame** `esp` 10×24 — layout=none
  - **frame** `Btn Venir essayer` fill×52 fill=$ember — layout=horizontal(défaut), gap=10, justify=center, align=center, radius=2
    - **T** « VENIR ESSAYER » — $body · 11.5px · w600 · ls 1.8 · $ink
    - *icon* `arrow-right` 12×12 fill=$ink
  - **frame** `esp` 10×10 — layout=none
  - **frame** `Btn Itinéraire` fill×46 — layout=horizontal(défaut), gap=10, justify=center, align=center, radius=2, stroke=#ece8de47 1 inner
    - **T** « ITINÉRAIRE » — $body · 11.5px · w500 · ls 1.8 · $parch
    - *icon* `navigation` 12×12 fill=$parch

#### 07 · Galerie

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=56/0/60/0, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (8 nœuds texte) :*

- **frame** `Tête En images` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=0/22/18/22
  - **frame** `Eyebrow En images` hug — layout=horizontal(défaut), gap=10, align=center
    - **T** « 05 » — $eyebrow · 10.5px · w600 · ls 2.6 · $ember
    - *icon* `diamond` 6×6 fill=$ember
    - **T** « EN IMAGES » — $eyebrow · 10.5px · w600 · ls 2.6 · $parch-soft
  - **frame** `Swipe` hug — layout=horizontal(défaut), gap=6, align=center
    - **T** « GLISSER » — $eyebrow · 9px · w600 · ls 2 · $parch-mute
    - *icon* `chevrons-right` 12×12 fill=$parch-mute
- **frame** `Filmstrip` 390×172 — layout=none, clip
  - **frame** `Photo À l'assaut` 236×172 @22,0 — layout=none, radius=3, clip
    - rect `img` 236×172 @0,0 img=`maquette-assets/galerie-1.jpg` (mode fill)
    - rect `voile` 236×44 @0,128 fill=#08070a80
    - **T** « À l'assaut » — $display · 12px · wnormal · italic · $parch @12,146
  - **frame** `Photo Montferrand` 236×172 @270,0 — layout=none, radius=3, clip
    - rect `img` 236×172 @0,0 img=`maquette-assets/galerie-2.jpg` (mode fill)
    - rect `voile` 236×44 @0,128 fill=#08070a80
    - **T** « Montferrand » — $display · 12px · wnormal · italic · $parch @12,146
  - **frame** `Photo Combat viking` 236×172 @518,0 — layout=none, radius=3, clip
    - rect `img` 236×172 @0,0 img=`maquette-assets/galerie-5.jpg` (mode fill)
    - rect `voile` 236×44 @0,128 fill=#08070a80
    - **T** « Combat viking » — $display · 12px · wnormal · italic · $parch @12,146
  - **frame** `Photo En garde` 236×172 @766,0 — layout=none, radius=3, clip
    - rect `img` 236×172 @0,0 img=`maquette-assets/galerie-4.jpg` (mode fill)
    - rect `voile` 236×44 @0,128 fill=#08070a80
    - **T** « En garde » — $display · 12px · wnormal · italic · $parch @12,146
- **frame** `Lien FB` fill×hug — layout=horizontal(défaut), gap=8, justify=center, align=center, pad=20/0/0/0
  - **T** « SUIVRE SUR FACEBOOK » — $eyebrow · 10px · w600 · ls 1.8 · $parch-soft
  - *icon* `arrow-up-right` 11×11 fill=$parch-soft

#### 08 · FAQ

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=56/0/60/0, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (6 nœuds texte) :*

- **frame** `Tête Questions` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=0/22/18/22
  - **frame** `Eyebrow Questions` hug — layout=horizontal(défaut), gap=10, align=center
    - **T** « 06 » — $eyebrow · 10.5px · w600 · ls 2.6 · $ember
    - *icon* `diamond` 6×6 fill=$ember
    - **T** « QUESTIONS » — $eyebrow · 10.5px · w600 · ls 2.6 · $parch-soft
- **frame** `Contenu` fill×hug — layout=vertical, pad=0/22
  - **frame** `Items` fill×hug — layout=vertical, stroke=#ece8de38 {"top": 1} inner
    - **frame** `Q1` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=18/4, stroke=#ece8de38 {"bottom": 1} inner
      - **T** « Faut-il déjà faire du sport ou de l'escrime ? » — $body · 14.5px · w500 · lh 1.4 · $parch · fixed-width 306
      - *icon* `plus` 13×13 fill=$parch-soft
    - **frame** `Q2` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=18/4, stroke=#ece8de38 {"bottom": 1} inner
      - **T** « C'est dangereux ? » — $body · 14.5px · w500 · lh 1.4 · $parch · fixed-width 306
      - *icon* `plus` 13×13 fill=$parch-soft
    - **frame** `Q3` fill×hug — layout=horizontal(défaut), justify=space_between, align=center, pad=18/4, stroke=#ece8de38 {"bottom": 1} inner
      - **T** « À quoi ressemble une séance ? » — $body · 14.5px · w500 · lh 1.4 · $parch · fixed-width 306
      - *icon* `plus` 13×13 fill=$parch-soft
  - **frame** `Toutes` hug — layout=horizontal(défaut), gap=8, align=center, pad=20/4/0/4
    - **T** « TOUTES LES QUESTIONS » — $eyebrow · 10px · w600 · ls 1.8 · $ember
    - *icon* `arrow-right` 11×11 fill=$ember

#### 09 · Partenaires

**Conteneur** — `fill×hug` fill=$coal — layout=vertical, pad=44/0/48/0, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (1 nœuds texte) :*

- **frame** `Contenu` fill×hug — layout=vertical, align=center, pad=0/22
  - **T** « ILS NOUS ACCOMPAGNENT » — $eyebrow · 10px · w600 · ls 2.6 · $parch-mute · align center · fixed-width 346
  - **frame** `esp` 10×20 — layout=none
  - **frame** `Logos` fill×hug — layout=horizontal(défaut), gap=22, justify=center, align=center
    - **frame** `Logo 0` 96×52 img=`public/assets/logo_signature_FFAMHE.png` (mode fit) — layout=none
    - **frame** `Logo 1` 96×52 img=`public/assets/Fait-d'arme-logo.png` (mode fit) — layout=none
    - **frame** `Logo 2` 96×52 img=`public/assets/black-armoury-logo.jpg` (mode fit) — layout=none

#### Footer

**Conteneur** — `fill×hug` fill=$ink — layout=vertical, pad=40/22/28/22, stroke=$parch-line {"top": 1} inner

*Arbre exhaustif (8 nœuds texte) :*

- **frame** `Marquee` fill×hug — layout=horizontal(défaut), gap=8, justify=center, align=end
  - **T** « De » — $display · 34px · w500 · $parch
  - **T** « Feu » — $display · 34px · w500 · $feu
  - **T** « et d' » — $display · 34px · w300 · italic · $parch
  - **T** « Acier » — $display · 34px · w500 · $acier
- **frame** `esp` 10×14 — layout=none
- **frame** `Contact` fill×hug — layout=horizontal(défaut), gap=10, justify=center, align=center
  - **T** « amhe63.dfda@gmail.com » — $body · 12px · wnormal · $parch-soft
  - rect `pt` 3×3 fill=$ember radius=99
  - **T** « 06 61 28 65 11 » — $body · 12px · wnormal · $parch-soft
- **frame** `esp` 10×18 — layout=none
- **frame** `Réseaux` fill×hug — layout=horizontal(défaut), gap=10, justify=center, align=center
  - **frame** `S1` 34×34 — layout=horizontal(défaut), justify=center, align=center, radius=99, stroke=$parch-line 1 inner
    - *icon* `facebook` 13×13 fill=$parch-mute
  - **frame** `S2` 34×34 — layout=horizontal(défaut), justify=center, align=center, radius=99, stroke=$parch-line 1 inner
    - *icon* `trophy` 13×13 fill=$parch-mute
  - **frame** `S3` 34×34 — layout=horizontal(défaut), justify=center, align=center, radius=99, stroke=$parch-line 1 inner
    - *icon* `shield` 13×13 fill=$parch-mute
- **frame** `esp` 10×22 — layout=none
- **frame** `Légal` fill×hug — layout=vertical, gap=6, align=center
  - **T** « © 2026 · DE FEU ET D'ACIER · CLERMONT-FERRAND » — $eyebrow · 8.5px · w500 · ls 1.8 · $parch-mute · align center · fixed-width 346
  - **T** « MENTIONS LÉGALES · CONFIDENTIALITÉ » — $eyebrow · 8.5px · w500 · ls 1.8 · $parch-mute · align center · fixed-width 346

---

## 9. Patterns récurrents → composants à créer

Quatorze structures se répètent d'une section à l'autre. Chacune correspond à un composant à écrire une fois.

### 9.1 `SectionLabel` — label de section numéroté

**Desktop** (18 occurrences, la structure la plus régulière du site) : rangée `gap: 16`, `align: center`, `width: fill`, `padding-bottom: 22`, `border-bottom: 1px $parch-line`.
`{numéro}` (`$eyebrow` 12.5 / w600 / ls 3.5 / `$ember`) — icône `diamond` 8 px `$ember` — `{LIBELLÉ}` (`$eyebrow` 12.5 / w600 / ls 3.5 / `$parch-soft`).
Toujours suivi d'un `esp 56`.

**Mobile** (`SectionHead`) : rangée `space_between`, `align: center`, `padding: 0 22 18 22`, **sans filet**. À gauche le même trio en 10.5 px / ls 2.6 avec un `diamond` de 6 px ; à droite, optionnellement, l'indicateur `GLISSER` + `chevrons-right` 12 px `$parch-mute`.

```
Props : numero, libelle, swipeHint?: boolean
```

### 9.2 `Logotype` — « De Feu et d'Acier »

Trois tailles maquettées, structure identique : colonne `align: center` de deux rangées `align: end`.

| Contexte | Taille | gap colonne | gap ligne 1 | gap ligne 2 | lh |
|---|---|---|---|---|---|
| Hero desktop | `$display` 96 | 8 | 24 | 10 | 0.9 |
| Hero mobile | `$display` 62 | 6 | 15 | 8 | 0.9 |
| Footer desktop | `$display` 115 | — (une seule rangée, gap 26) | | | 0.9 |
| Footer mobile | `$display` 34 | — (une seule rangée, gap 8) | | | *non déclaré* |

Coloration invariante : `De` = `$parch` w500, `Feu` = **`$feu`** w500, `et d'` = `$parch` **w300 italic**, `Acier` = **`$acier`** w500.

```
Props : size, layout: "stacked" | "inline"
```

### 9.3 `SectionTitle` — titre sur deux (ou trois) lignes

Colonne `gap: 4`, `$display`, `lineHeight: 1`. Ligne 1 en `$parch` graisse normale ; ligne 2 en **`$ember` w300 italic**. Onze occurrences, tailles 66 / 70 / 72 / 76 selon la largeur disponible.

Variante à trois lignes (« Le club ») : lignes 1 et 3 en `$parch`, ligne 2 en `$ember` italic.
Variante inline (« Nous rejoindre » piliers, « Essayer » mobile) : rangée `align: end`, deux ou trois fragments dont un seul en `$ember` italic.

```
Props : lignes: [{texte, accent: boolean}], size
```

**Note CMS déterminante :** la coupure des lignes est **éditoriale**, pas automatique. Le champ ne peut pas être une simple chaîne : il faut soit deux champs (`titre_ligne_1`, `titre_ligne_2`), soit un marqueur d'accentuation dans une chaîne unique.

### 9.4 `SectionHead` — titre + chapô côte à côte

Rangée `width: fill`, `justify: space_between`, `align: end`, `padding-bottom: 64` (ou 0 quand le bloc suivant porte son propre padding). À gauche un `SectionTitle`, à droite soit un chapô `$body` 16 / lh 1.7 / `$parch-mute` **largeur bloquée 460**, soit un bouton (cas de la Galerie). Six occurrences.

### 9.5 `Button` — trois variantes seulement

| Variante | Fond | Bordure | Couleur du texte | Graisse | Occurrences |
|---|---|---|---|---|---|
| **Primaire** | `$ember` | — | `$ink` | **600** | 8 |
| **Secondaire** | — | `#ece8de47` 1 px | `$parch` | 500 | 12 |
| **Fantôme** | — | — | `$parch` | 500 | 1 (`CALENDRIER FFAMHE`) |

Invariants : rayon 2, rangée `justify: center` `align: center`, `gap: 10` ou 12, icône `arrow-right` (ou `arrow-up-right` pour un lien externe) de 11-12 px prenant la couleur du texte, libellé `$body` 11.5 / ls 1.8 **en capitales**.

Hauteurs relevées : **44** (bouton de section desktop), **46** (secondaire mobile), **48** (hero mobile, fiche prof), **50** (hero desktop, CTA de fiche), **52** (bande CTA finale, primaire mobile).
Padding horizontal : 22 (standard), 24, 28, 30, 32, 40 (bande CTA). Sur mobile, `width: fill` et padding nul.

```
Props : variant, size, label, icon, href, external?
```

### 9.6 `TextLink` — lien texte fléché

Rangée `gap: 8` ou 10, `align: center` : libellé `$eyebrow` 8→10.5 / **w600** / ls 1.6-1.8 en capitales + icône `arrow-right` de 9 à 11 px, même couleur. Sept occurrences : `DÉCOUVRIR L'ARME`, `DÉCOUVRIR`, `LIRE L'INTERVIEW`, `INTERVIEW`, `ÉTUDIER LA SOURCE`, `ÉTUDIER`, `TOUTES LES QUESTIONS`, `SUIVRE SUR FACEBOOK` (mobile).

### 9.7 `FactRow` — ligne label + valeur

Rangée `width: fill`, `gap: 24`, `padding: 18 0`, `border-bottom: 1px $parch-line`, dans un conteneur à `border-top`.
Label à gauche **largeur bloquée 200** : `$eyebrow` 10.5 / w600 / ls 2.7 / `$ember`. Valeur à droite en colonne `gap: 4` : ligne principale `$body` 15-15.5 / `$parch`, ligne secondaire `$body` 15 / `$parch-soft`. Cinq occurrences (Nous rejoindre, Tournois).

**Variante mobile** (`FactRowIcon`) : rangée `gap: 14`, `align: center`, `padding: 13 0` ; le label textuel est remplacé par une pastille ronde 30×30 (`#e0552c14`, rayon 99) contenant une icône 15 px `$ember`.

### 9.8 `MediaCard` — carte photo à contenu incrusté

Le pattern le plus utilisé du site (cartes discipline, photo club mobile, photo tournois, hero de fiche mobile, vignettes de galerie). Toujours `layout: none` + `clip`, quatre couches :

1. **Image** — rectangle plein cadre, `object-fit: cover`
2. **Voile uniforme** — rectangle plein cadre, noir 32 à 65 %
3. **Assise** — rectangle de largeur pleine, hauteur ≈ 40 % du cadre, ancré en bas, noir 77 à 88 % — simule un dégradé sans en utiliser un
4. **Contenu** — un ou deux blocs positionnés en absolu, marge interne 16 à 36 px

**Recommandation d'intégration :** remplacer les couches 2 et 3 par un unique `linear-gradient` (`transparent` → `rgba(8,7,10,.85)`), plus fidèle au rendu voulu et plus léger.

```
Props : image, ratio, veilOpacity, badge?, titre, sousTitre, lien?
```

### 9.9 `VideoCard` — vignette vidéo

Huit occurrences (mini-cours ×3 desktop + ×3 mobile, interview desktop + mobile).
Cadre `layout: none`, rayon **3**, `clip` :
1. `thumb` — image `cover`
2. `veil` — `#08070a66` plein cadre
3. `Play` — cercle `$parch` (rayon 99) parfaitement centré, icône `play` `$ink`
4. `Durée` — badge `#0a0908cc`, `padding: 4 9`, rayon 99, texte `$body` 9.5 / w600 / ls 0.5 / `$parch`, ancré en bas à droite (marge 12-14 px)

| Contexte | Cadre | Cercle | Icône |
|---|---|---|---|
| Mini-cours desktop | 426.7×250 | 54 | 20 |
| Interview desktop | 640×360 | 64 | 24 |
| Mobile (tous) | 346×195 | 46 | 17 |

Sous la vignette : `esp 8-14`, titre `$body` 14-16 / w500 / lh 1.3, sous-libellé `$eyebrow` 8.5-9.5 / w600 / ls 1.6-1.8 / `$parch-mute`.

### 9.10 `Pill` — pastille arrondie

Rayon 99, fond noir semi-opaque, bordure `#ece8de38` 1 px, texte `$eyebrow` 9 / w600 / ls 1.6-1.8 / `$parch`. Cinq variantes : badge d'époque (`padding: 6 10`), tag de type de fiche (`padding: 6 11`), badge de durée (sans bordure), bouton retour rond (36×36), bouton social rond (34×34, bordure `$parch-line`).

### 9.11 `Carousel` — bande défilable mobile

Trois occurrences (armes 390×350, profs 390×232, galerie 390×172). Toujours : conteneur `layout: none` + `clip` de la largeur de l'écran, cartes positionnées en absolu à partir de `x = 22` avec un pas de `largeur_carte + 12`.
Seul le carrousel des armes possède une pagination (`Points`) ; les trois annoncent le geste par l'indicateur `GLISSER`.

**Intégration :** `display: flex; overflow-x: auto; scroll-snap-type: x mandatory;` avec `padding-inline: 22px` et `gap: 12px` reproduit exactement le rendu, sans positions absolues.

### 9.12 `TabBar` — barre d'onglets mobile

Trois occurrences (accueil, fiche arme, fiche prof). Frame 390×80, fond `#0a0908f2`, `border-top: 1px $parch-line`, rangée `space_between`, `align: end`, `padding: 0 10 8 10`.
Quatre onglets standard 72×66 (colonne `gap: 5`, centrée) : marqueur d'état actif — rect 14×2 `$ember` rayon 2 si actif, `esp 14×2` sinon —, icône 19 px, libellé `$eyebrow` 8 / w600 / ls 1.2. Actif = `$parch`, inactif = `$parch-mute`.
Onglet central 76 de large mis en exergue : cercle 46×46 `$ember` (rayon 99) avec `swords` 20 px `$ink`, libellé toujours en `$parch`.

| Onglet | Icône | Actif sur |
|---|---|---|
| `ACCUEIL` | `house` | accueil |
| `ARMES` | `sword` | fiche arme |
| `ESSAYER` | `swords` (cercle `$ember`) | jamais (action) |
| `PHOTOS` | `image` | — |
| `CONTACT` | `phone` | fiche prof *(à revoir)* |

### 9.13 `Accordion` — item de FAQ

Conteneur colonne à `border-top: 1px #ece8de38`, items à `border-bottom: 1px #ece8de38`.
Ligne question : rangée `space_between`, `align: center`, `padding: 26 16` (desktop) ou `18 4` (mobile).
État fermé : question `$parch`, icône `plus`. État ouvert : fond d'item `#e0552c08`, question **`$ember`**, icône `minus` `$ember`, bloc réponse `padding: 0 16 30 16` en `$body` 15 / lh 1.6 / `$parch-soft`.

### 9.14 `Spacer` (`esp`) — 144 occurrences

Frame vide de hauteur fixe (largeur 8, 10 ou 14, sans effet). **Ne pas reproduire en HTML** : convertir en `margin`/`gap`. Voir §0.3.

### 9.15 Récapitulatif des composants à écrire

| Composant | Occurrences | Priorité |
|---|---|---|
| `Button` (3 variantes) | 21 | haute |
| `SectionLabel` / `SectionHead` mobile | 18 + 8 | haute |
| `SectionTitle` (2-3 lignes) | 11 | haute |
| `MediaCard` | 15 | haute |
| `TextLink` | 8 | haute |
| `VideoCard` | 8 | moyenne |
| `FactRow` (+ variante icône) | 9 | moyenne |
| `Pill` | 12 | moyenne |
| `TabBar` | 3 | moyenne (mobile) |
| `Carousel` | 3 | moyenne (mobile) |
| `Accordion` | 11 | moyenne |
| `Logotype` | 4 | basse |
| `ProfCard` (2 variantes × 2 formats) | 6 | haute |
| `PartnerRow` | 3 | basse |
| `ScheduleTable` | 1 | moyenne |

---

## 10. Écarts, incohérences et décisions à prendre

Relevés bruts issus du dépouillement — à arbitrer avant l'intégration.

### 10.1 Incohérences internes à la maquette

| # | Constat | Localisation | Proposition |
|---|---|---|---|
| 1 | Le titre dit « **Cinq** armes, cinq grammaires » mais la bande ne contient que **4 cartes**. L'épée-bocle apparaît pourtant dans le créneau du jeudi et dans la spécialité de Ludwig Fort. | `02 · Disciplines` desktop et mobile | Ajouter une 5ᵉ carte « Épée-bocle » (photo à produire) ou passer le titre à « Quatre armes ». Le titre doit de toute façon devenir dynamique si le CMS gère les disciplines. |
| 2 | Le lien `DÉCOUVRIR L'ARME` n'existe que sur la carte « Combat viking » (desktop) alors que les 4 cartes mobiles l'ont. | `02 · Disciplines` desktop | Généraliser aux 4 cartes. |
| 3 | Le bouton `CALENDRIER FFAMHE` n'a ni fond ni bordure (bouton fantôme) à côté d'un bouton bordé. | `07 · Tournois` desktop | Lui donner la variante secondaire. |
| 4 | Les labels des piliers affichent `01 · 01 · VIENS ESSAYER` et `02 · 02 · POUR CONTINUER` — numéro dupliqué. | `06 · Nous rejoindre` desktop | Corriger en `01 · VIENS ESSAYER`. |
| 5 | Sur la fiche prof mobile, l'onglet actif de la tab-bar est `CONTACT`. | `V2 — Fiche prof (mobile)` | Mettre `ACCUEIL` ou aucun onglet actif. |
| 6 | Le badge d'époque de la fiche arme mobile indique `XIVᵉ — XVIᵉ S.` alors que partout ailleurs l'épée longue est datée `XIVᵉ — XVᵉ S.`. | `V2 — Fiche arme (mobile)` | Coquille — retenir `XIVᵉ — XVᵉ S.` |
| 7 | La numérotation des sections diffère entre desktop (01→09) et mobile (01→06), et la section « Partenaires » mobile n'a pas de numéro du tout. | Accueil | Rendre le numéro calculé, ou ne pas le numéroter sur mobile. |
| 8 | Le menu mobile ouvert (V1) propose un lien `Tournois`, section absente de la V2 mobile. | `Mobile — Menu ouvert` | Aligner la liste sur les sections réellement rendues. |
| 9 | Fautes de frappe dans les textes : « premieres » (sans accent), « equipe », « equipement », « désigné » pour « conçu », « a » pour « à » (×3), « notament », « différent niveau ». | Sections 06, 10, 02 | Relecture avant intégration ; ces textes partent en base de contenu. |
| 10 | L'année `© 2026` est figée dans les deux footers. | Footers | Générer dynamiquement. |
| 11 | Le fichier `Fait-d'arme-logo.png` contient une apostrophe ; le texte affiché est « Faits d'Armes » (pluriel). | `10 · Partenaires` | Renommer le fichier (`faits-darmes-logo.png`). |
| 12 | 7 réponses de FAQ sur 8 et les 3 réponses d'interview ne sont pas rédigées (placeholders gris). | `09 · FAQ`, fiches prof | Récupérer dans `CONTENU-SITE.md` / auprès du client. |
| 13 | `$ember-hot` (`#f06b3a`) est déclaré mais jamais utilisé. Aucun état `:hover`, `:focus` ou `:active` n'est maquetté. | Global | Définir les états d'interaction : `$ember-hot` pour le hover du primaire, `$parch` pour la bordure du secondaire. |

### 10.2 Ce que la maquette ne couvre pas

- **Aucun breakpoint intermédiaire** (tablette 768-1200) : la transition 1440 → 390 est à inventer. Les largeurs bloquées (`fixed-width 460`, `760`, `976`, `1250`…) sont toutes à convertir en `max-width` ou en `ch`.
- **Aucun état d'interaction** : hover, focus visible, actif, désactivé, chargement.
- **Aucune page annexe** : mentions légales, politique de confidentialité, page FAQ complète (pourtant liée depuis le mobile), page « toutes les disciplines », page article/actualité.
- **Rien pour les besoins CMS annoncés** : pas de bandeau d'annonce / flash info, pas de carte d'article, pas de liste d'actualités, pas de page article. Ces gabarits sont à concevoir dans le langage visuel établi ici.
- **Rien pour le multi-écoles** : pas de sélecteur de ville, pas de mention de lieu ailleurs que dans le contenu en dur (« à Clermont-Ferrand » dans le hero, « CLERMONT-FERRAND » dans les footers, adresse du gymnase). Ces trois points sont les zones à paramétrer en priorité si une seconde école ouvre.
- **La carte OSM est un placeholder** (fond `$char` + une épingle) : le composant réel est à choisir (iframe OSM, image statique, lien sortant).
- **Aucun favicon, aucune image de partage social, aucun état vide** (galerie vide, aucun prof, aucune actualité).

### 10.3 Points d'attention pour le modèle de contenu

| Constat de maquette | Conséquence pour le schéma |
|---|---|
| Les titres de section sont coupés manuellement en 2 ou 3 lignes, avec une ligne accentuée | Deux champs par titre, ou une syntaxe d'accentuation |
| Les cartes prof ont une variante « mise en avant » | Booléen `highlight` sur l'entrée prof |
| Les cartes discipline portent époque + siècles + nom + sous-titre + lien fiche | Collection `disciplines` avec ces cinq champs + photo + description longue + mini-cours |
| Le mini-cours est une liste de vidéos (titre, sous-libellé, durée, vignette, URL) | Sous-collection ou tableau imbriqué dans `disciplines` |
| L'interview est une liste question/réponse de longueur libre | Tableau imbriqué dans `profs` |
| Les chiffres clés sont trois paires valeur/label | Tableau libre, pas trois champs figés |
| Le tableau des créneaux a 4 colonnes et 3 lignes, une ligne « sans encadrant » | Collection `creneaux` (jour, début, fin, disciplines, niveau) |
| Les partenaires ont catégorie, nom, texte long, logo, URL, libellé de bouton | Collection `partenaires` |
| La galerie desktop est une mosaïque à tailles inégales (2 formats : 504 et 332 de haut) | Champ `format` (grand/petit) ou ordre + règle de mosaïque |
| Le mobile n'affiche que 4 des 6 photos et 3 des 8 questions | Champ « mis en avant » ou limite d'affichage par contexte |

---

## 11. Contrôle d'exhaustivité

Le document couvre **691 nœuds texte**, soit la totalité des 691 nœuds `text` du fichier `Maquette.pen`, répartis ainsi :

| Frame racine | Nœuds texte | Section du document |
|---|---|---|
| `V2 — Site desktop` | 208 | §3 |
| `V2 — Mobile 390` | 92 | §4 |
| `V2 — Fiche arme (desktop)` | 30 | §5.1 + §5.3 |
| `V2 — Fiche arme (mobile)` | 25 | §5.2 + §5.4 |
| `V2 — Fiche prof (desktop)` | 18 | §6.1 + §6.3 |
| `V2 — Fiche prof (mobile)` | 18 | §6.2 + §6.4 |
| `Mobile — Menu ouvert` | 8 | §7 |
| `Site desktop — nouvelles photos` (V1) | 202 | §8.3 |
| `Mobile — 390` (V1) | 90 | §8.4 |
| **Total** | **691** | |

Chaque arbre exhaustif indique en tête le nombre de nœuds texte de sa section, ce qui permet de vérifier la couverture bloc par bloc.

---

*Document généré depuis `Maquette.pen` par parcours programmatique de l'arbre JSON. Toute modification de la maquette impose de le régénérer.*
