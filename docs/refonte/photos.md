# Inventaire visuel des images — refonte « De Feu et d'Acier »

Document de travail — phase d'audit. Toutes les images des deux dossiers ont été
ouvertes et regardées une par une (y compris des recadrages à 100 % pour juger du
piqué, du bruit et des floutages).

- Sources brutes : `nouvelles_photos/` — 16 fichiers + `ARMES/` (4 fichiers) → **20 fichiers, ≈ 246 Mo**
- Dérivés maquette : `maquette-assets/` — 13 fichiers → **≈ 5,6 Mo**
- Maquette analysée : `Maquette.pen` (4 pages : desktop v1, mobile v1, desktop V2, mobile V2, + fiches arme et prof)

**Résultat clé : les 13 fichiers de `maquette-assets/` sont tous des recadrages ou
des réductions de fichiers présents dans `nouvelles_photos/`.** La correspondance
est complète et vérifiée (dimensions + empreinte perceptuelle + inspection
visuelle). Aucune image de maquette n'est orpheline.

---

## 1. Inventaire fichier par fichier

### 1.1 `nouvelles_photos/` — les sources

Légende poids : ⚠️ = > 1 Mo, à optimiser obligatoirement avant mise en ligne.
Tous les fichiers de ce dossier dépassent 1 Mo — **aucun n'est publiable en l'état**.

| Fichier | Dim. | Poids | Sujet | Orientation / cadrage | Qualité |
|---|---|---|---|---|---|
| `_MG_5965.jpg` | 2048 × 1365 | 1,53 Mo ⚠️ | Deux escrimeurs à l'épée longue en croisée haute, sur scène noire, projecteurs et cibles au mur. Un en noir/jaune, l'autre en bleu roi. | Paysage 3:2, plan américain, très bel équilibre gauche/droite, ciel de scène qui laisse de la place au texte en haut | Excellente lecture, ambiance très forte. **Déjà un export réduit** (2048 px), pas le master. ISO 4000, bruit modéré mais bien géré. Canon 6D Mk II, 24-70 f/2.8, 24/02/2024 |
| `_ASC0652.jpg` | 4928 × 3264 | 5,04 Mo ⚠️ | Deux escrimeurs en corps-à-corps / accolade après assaut, gymnase à parement bois clair, gradins bleus. Doublet bleu à croix + doublet blanc. | Paysage 3:2, plan taille, sujets centrés, arrière-plan aéré | Très bonne. **Filigrane « Enzo Cirillo » en bas à droite** → crédit obligatoire ou recadrage. Éclairage de gymnase un peu plat mais propre |
| `_ASC0675.jpg` | 3097 × 2051 | 1,70 Mo ⚠️ | Duel serré : de dos un doublet bleu marine à croix jaunes, face à un escrimeur en gambison jaune vif, masque grillagé. Parquet clair. | Paysage 3:2, gros plan / plan poitrine, faible profondeur de champ | Très bonne, le jaune claque. **Filigrane « Enzo Cirillo »** en bas à droite. Recadrable en bandeau large |
| `IMG_2609.jpg` | 4160 × 6240 | 19,7 Mo ⚠️ | Escrimeur de profil, masque noir + masque de protection **peint en vert**, doublet vert à motifs floraux, épée levée. Fond mur bordeaux + but de handball. | Portrait 2:3, plan poitrine, sujet à gauche, belle diagonale de la lame | Très bonne composition, couleurs originales. **ISO 10000** → grain marqué à 100 %, à débruiter avant réduction. Canon EOS RP + 70-200 f/2.8, 08/05/2026 |
| `IMG_3013.jpg` | 3687 × 2458 | 12,5 Mo ⚠️ | Assaut à l'épée longue, deux combattants tout en noir (gantelets articulés, doublets rembourrés), gymnase multicolore au sol. | Paysage 3:2, plan taille, action au centre, les deux lames se croisent en haut | Bonne, mais **c'est l'image la plus bruitée du lot : ISO 12800**. Très sombre, tout-noir sur tout-noir → lisibilité faible en petite taille. Débruitage + éclaircissement des ombres recommandés. 09/05/2026 |
| `IMG_3071.jpg` | 4160 × 6240 | 28,8 Mo ⚠️ | Liage à l'épée longue vu de dos-trois-quarts : gambison rouge vs gambison vert (écusson FFAMHE + drapeau français), les deux masqués. Gymnase. | Portrait 2:3, plan pied, action très dynamique, contrepoint rouge/vert | Bonne. **ISO 8000**, grain présent. Le plus « sportif » du lot indoor. Non utilisée dans la maquette |
| `IMG_3364.jpg` | 6240 × 4160 | 28,4 Mo ⚠️ | Escrimeur de face en garde, gambison rouge et blanc, masque grillagé, épée à la verticale. Premier plan flou : gambison jaune. But de handball derrière. | Paysage 3:2, plan taille, sujet légèrement décentré à droite, cadre bien aéré | Bonne. **ISO 6400**. Le meilleur plan « frontal en garde » disponible. Non utilisée dans la maquette |
| `IMG_3607.jpg` | 4160 × 6240 | 26,9 Mo ⚠️ | Duel type rapière/épée de côté : à gauche un escrimeur en noir avec chaussettes roses fluo, à droite un gambison rouge vif. Salle bordeaux et vert. | Portrait 2:3, plan pied, jambes et fente très lisibles | Bonne. **ISO 8000**. Composition en V très efficace. 09/05/2026 |
| `MedievelMontferrand2026-7.jpg` | 6000 × 4000 | 15,0 Mo ⚠️ | Démonstration sur scène en extérieur, sous un toit de bois : fente à l'épée longue, dos flanqué de « Ad Astra Per Aspera », face à un escrimeur en gambison noir et rouge masqué. Feuillage vert derrière. | Paysage 3:2, plan pied, scène très « spectacle » | Excellente. **ISO 400, © Alexandre Vergne**. ⚠️ Le combattant de gauche **n'est pas masqué** : visage de profil parfaitement reconnaissable. Non utilisée dans la maquette |
| `MedievelMontferrand2026-53.jpg` | 6000 × 4000 | 13,7 Mo ⚠️ | Assaut à la rapière en extérieur : doublet violet/bleu vs escrimeur en violet foncé, devant un mur d'enceinte en pierre volcanique, tente beige, public assis. | Paysage 3:2, plan pied, les deux lames se croisent au centre | Excellente, lumière dure de plein soleil mais très lisible. **ISO 100, © Alexandre Vergne**, 23/05/2026 |
| `MedievelMontferrand2026-70.jpg` | 6000 × 4000 | 11,8 Mo ⚠️ | Escrimeur en doublet bleu roi et violet, **masque peint (yeux bleus, motif floral)**, face à un escrimeur en violet sombre. Remparts et ciel bleu. | Paysage 3:2, plan pied, forte profondeur, très coloré | Excellente. ISO 100, © Alexandre Vergne. ⚠️ Un homme en arrière-plan (t-shirt noir) a le **visage net et reconnaissable**. Non utilisée dans la maquette |
| `MedievelMontferrand2026-80.jpg` | 6000 × 4000 | 13,0 Mo ⚠️ | Combat « mousse » / initiation grand public : t-shirt jaune FFAMHE « Clermont-Ferrand 2024 » + casque bleu vs t-shirt marine + casque bleu, boucliers et épées en mousse, sur l'herbe devant les remparts. | Paysage 3:2, plan pied, mouvement, arrière-plan animé (public, tentes, enfants) | Excellente techniquement. ISO 100, © Alexandre Vergne. ⚠️ **Les deux pratiquants semblent adolescents, visages partiellement visibles ; enfants nets en arrière-plan** (voir §4) |
| `MedievelMontferrand2026-105.jpg` | 6000 × 3394 | 11,9 Mo ⚠️ | Deux combattants en costume historique (chausses rayées noir et blanc, doublet bleu à croix) croisant des bâtons/hampes, devant le rempart. | Paysage panoramique **déjà recadré 16:9**, plan pied | Excellente. ISO 100, © Alexandre Vergne. **Tout le monde est masqué** → la plus « sûre » du lot Montferrand côté droit à l'image. Format idéal pour un bandeau. Non utilisée dans la maquette |
| `Flouté_MedievelMontferrand2026-127.png` | 6000 × 4000 | 31,3 Mo ⚠️⚠️ | Démonstration sous la halle : un homme en veste bleue et manteau noir (lunettes) et un homme en t-shirt gris et gantelets, un présentateur en gambison jaune au micro, public dense assis autour. | Paysage 3:2, plan taille, image « vie du club » | Excellente. **PNG 31 Mo → à reconvertir impérativement.** Version retouchée : **les visages des enfants du premier rang ont été floutés un par un** (≈ 8 floutages localisés vérifiés à 100 %). Les adultes restent nets. © Alexandre Vergne |
| `PSX_20260430_200236.jpg` | 1359 × 2048 | 1,64 Mo ⚠️ | Portrait souriant d'un membre barbu en t-shirt blanc, tenant un **trophée** et une épée longue, devant les drapeaux « LYON AMHE » rouge et bleu. | Portrait 2:3, plan américain, sujet centré | Bonne. Fichier **retouché sur mobile (préfixe `PSX_` = Samsung Gallery)**, pas de master, EXIF appareil effacé. Piqué correct mais limité. 30/04/2026. **Visage parfaitement net → autorisation écrite indispensable** |

### 1.2 `nouvelles_photos/ARMES/` — les natures mortes d'armes

| Fichier | Dim. | Poids | Sujet | Cadrage | Qualité |
|---|---|---|---|---|---|
| `épée double.jpg` | 4000 × 6000 | 10,1 Mo ⚠️ | Deux épées longues plantées sur un présentoir, poignées en cuir noir, pommeaux en « bouchon de parfum », quillons droits. Fond : bâche beige et mur gris flous. | Portrait 2:3, gros plan, très faible profondeur de champ | Excellente. ISO 100, 50 mm f/1.8, © Alexandre Vergne, 23/05/2026 |
| `Rapière.jpg` | 4000 × 6000 | 11,3 Mo ⚠️ | Coquille de rapière en cloche vue en contre-plongée, garde et branches, autres rapières floues derrière. | Portrait 2:3, macro, bokeh très marqué | Excellente. Même série, même lumière que ci-dessus. ISO 100, © Alexandre Vergne |
| `Messer.png` | 842 × 1264 | 2,06 Mo ⚠️ | Deux messers (grands couteaux) plantés, plaquettes de bois rivetées laiton, nagel visible. Même table, même fond que les deux précédentes. | Portrait 2:3, gros plan | **Le fichier est déjà un recadrage réduit** : 842 px de large seulement, exporté en PNG (d'où les 2 Mo pour une petite image). Le piqué est excellent, mais **le master haute résolution manque au lot** — à redemander à Alexandre Vergne |
| `Viking.webp` | 393 × 698 | 102 Ko | Deux boucliers ronds vikings, l'un montrant le dos (planches + brace), l'autre la face peinte de runes avec umbo laiton. Décor : jardin, palissade et lierre. | Portrait, gros plan | ❌ **Point noir du lot.** 393 px de large : sous-dimensionné même pour la carte discipline (360 × 620 CSS). À 200 % on voit les artefacts de compression, les détails sont pâteux. Photo de téléphone, décor de jardin privé, manche rouge d'une tenue non-AMHE au bord. **N'appartient pas visuellement à la série des trois autres armes** (fond, lumière, style). À refaire |

### 1.3 `maquette-assets/` — les dérivés utilisés dans `Maquette.pen`

Ces 13 fichiers sont des **exports de travail** produits pour la maquette. Ils
serviront de référence de cadrage mais **ne seront pas les fichiers de production** :
ils seront régénérés depuis les masters via le pipeline Astro (§5).

| Fichier | Dim. | Poids | Provenance | Recadrage appliqué |
|---|---|---|---|---|
| `hero.jpg` | 2048 × 1365 | 432 Ko | `_MG_5965.jpg` | Aucun recadrage, simple recompression (1,53 Mo → 432 Ko) |
| `club.jpg` | 2200 × 1467 | 412 Ko | `Flouté_MedievelMontferrand2026-127.png` | Réduction 6000 → 2200 px. **Les floutages des enfants sont bien conservés** (vérifié à 100 %) |
| `tournois.jpg` | 1194 × 1800 | 574 Ko | `PSX_20260430_200236.jpg` | Réduction + très léger recadrage latéral |
| `disc-epee-longue.jpg` | 933 × 1400 | 165 Ko | `ARMES/épée double.jpg` | Réduction 4000 → 933 px, ratio 2:3 conservé |
| `disc-messer.jpg` | 842 × 1264 | 120 Ko | `ARMES/Messer.png` | Conversion PNG → JPG, **dimensions identiques** |
| `disc-rapiere.jpg` | 933 × 1400 | 177 Ko | `ARMES/Rapière.jpg` | Réduction 4000 → 933 px |
| `disc-viking.jpg` | 393 × 698 | 90 Ko | `ARMES/Viking.webp` | Conversion WebP → JPG, **dimensions identiques** |
| `galerie-1.jpg` | 2200 × 1467 | **1,30 Mo ⚠️** | `IMG_3013.jpg` | Réduction. Le plus lourd des dérivés (photo très bruitée → JPEG inefficace) |
| `galerie-2.jpg` | 1800 × 1200 | 619 Ko | `MedievelMontferrand2026-53.jpg` | Réduction 6000 → 1800 px |
| `galerie-3.jpg` | 1800 × 1192 | 375 Ko | `_ASC0652.jpg` | Réduction, **filigrane Enzo Cirillo conservé et visible** |
| `galerie-4.jpg` | 1067 × 1600 | 483 Ko | `IMG_2609.jpg` | Réduction 4160 → 1067 px |
| `galerie-5.jpg` | 1600 × 1067 | 513 Ko | `MedievelMontferrand2026-80.jpg` | Réduction 6000 → 1600 px |
| `galerie-6.jpg` | 1067 × 1600 | 416 Ko | `IMG_3607.jpg` | Réduction 4160 → 1067 px |

---

## 2. Correspondance maquette ↔ sources

### 2.1 Table de correspondance (vérifiée)

| Dérivé maquette | Source dans `nouvelles_photos/` | Master haute déf. disponible ? |
|---|---|---|
| `hero.jpg` | `_MG_5965.jpg` | ⚠️ Non — la source est déjà un export 2048 px |
| `club.jpg` | `Flouté_MedievelMontferrand2026-127.png` | ✅ 6000 × 4000 |
| `tournois.jpg` | `PSX_20260430_200236.jpg` | ⚠️ Non — retouche mobile, 1359 px |
| `disc-epee-longue.jpg` | `ARMES/épée double.jpg` | ✅ 4000 × 6000 |
| `disc-messer.jpg` | `ARMES/Messer.png` | ⚠️ Non — 842 px, master à redemander |
| `disc-rapiere.jpg` | `ARMES/Rapière.jpg` | ✅ 4000 × 6000 |
| `disc-viking.jpg` | `ARMES/Viking.webp` | ❌ Non — 393 px, inexploitable |
| `galerie-1.jpg` | `IMG_3013.jpg` | ✅ 3687 × 2458 |
| `galerie-2.jpg` | `MedievelMontferrand2026-53.jpg` | ✅ 6000 × 4000 |
| `galerie-3.jpg` | `_ASC0652.jpg` | ✅ 4928 × 3264 |
| `galerie-4.jpg` | `IMG_2609.jpg` | ✅ 4160 × 6240 |
| `galerie-5.jpg` | `MedievelMontferrand2026-80.jpg` | ✅ 6000 × 4000 |
| `galerie-6.jpg` | `IMG_3607.jpg` | ✅ 4160 × 6240 |

### 2.2 Sources non utilisées dans la maquette (réserve)

Six photos sont disponibles mais n'apparaissent nulle part dans `Maquette.pen`.
Elles constituent la réserve pour les actualités, les fiches armes et le
remplissage de galerie :

`IMG_3071.jpg` · `IMG_3364.jpg` · `_ASC0675.jpg` ·
`MedievelMontferrand2026-7.jpg` · `MedievelMontferrand2026-70.jpg` ·
`MedievelMontferrand2026-105.jpg`

### 2.3 Emplacements et tailles de rendu relevés dans la maquette

Ces valeurs conditionnent les largeurs à générer (§5).

| Emplacement | Desktop (CSS) | Mobile 390 (CSS) | Fichier maquette |
|---|---|---|---|
| Hero plein écran | 1440 × 900 | 390 × 780 | `hero.jpg` |
| Carte discipline (×4) | 360 × 620 | 258 × 350 | `disc-*.jpg` |
| Photo équipe « Le club » | 688 × 430 | 346 × 250 | `club.jpg` |
| Photo « Tournois » | 489 × 652 | — | `tournois.jpg` |
| Galerie — tuile large | 770 × 504 | 236 × 172 | `galerie-1.jpg` |
| Galerie — tuiles moyennes | 546 × 332 | 236 × 172 | `galerie-2`, `galerie-3` |
| Galerie — tuiles portrait | 435 × 504 | 236 × 172 | `galerie-4/5/6` |
| Fiche arme — hero | 588 × 660 | 390 × 430 | `disc-epee-longue.jpg` |
| Fiche arme — vignette leçon | 427 × 250 | 346 × 195 | `galerie-1/3/6` (placeholders) |
| Fiche prof — portrait | 500 × 600 | 390 × 440 | `public/assets/Gabriel.jpg` (ancien) |
| Fiche prof — vignette vidéo | 640 × 360 | 346 × 195 | `galerie-3.jpg` (placeholder) |
| Grille profs (×3) | 427 × 427 | 158 × 150 | `Marie.png`, `Gabriel.jpg`, `Ludwig.jpeg` (anciens) |
| Manifesto (fond mobile) | — | 390 × 290 | `galerie-3.jpg` (v1) / `treatise.jpg` (V2) |

### 2.4 Incohérences relevées entre légende de maquette et contenu réel

1. **`galerie-5` est légendée « Tuile Combat viking » (desktop V2) et « Photo Combat
   viking » (mobile).** La photo montre en réalité une initiation grand public à
   l'épée **en mousse**, avec casques de sport bleus et boucliers synthétiques —
   ni viking, ni AMHE au sens strict. À corriger : soit changer la légende
   (« Initiation », « Portes ouvertes », « Médiévale de Montferrand »), soit
   fournir une vraie photo de combat viking.
2. **`disc-viking.jpg` n'est pas une photo de pratique**, c'est une photo de deux
   boucliers dans un jardin. Les trois autres cartes discipline sont des natures
   mortes d'atelier cohérentes entre elles. La carte viking casse la série.
3. **Aucun nouveau portrait de professeur** n'est présent dans `nouvelles_photos/`.
   La maquette réutilise `Marie.png`, `Gabriel.jpg`, `Ludwig.jpeg` de l'ancien site.
4. **Aucune gravure / planche de traité** dans le lot : la section « La rigueur »
   dépend toujours de `public/assets/treatise.jpg`.

---

## 3. Attribution recommandée par section

Format : **choix principal** → *alternative 1* → *alternative 2*.

### 3.1 Hero (`01 · Hero`)

| | Fichier | Justification |
|---|---|---|
| **Principal** | `_MG_5965.jpg` | Le seul plan « scène » du lot : fond noir, projecteurs, deux silhouettes en croisée haute. Contraste fort → le titre blanc et le voile sombre de la maquette fonctionnent parfaitement. Composition symétrique qui supporte le recadrage 16:10 en desktop et 1:2 en mobile |
| *Alt. 1* | `MedievelMontferrand2026-105.jpg` | Déjà en 16:9 natif (6000 × 3394), ISO 100, tout le monde masqué, décor de remparts très identitaire de Clermont. Idéal si l'on veut un hero « extérieur / patrimoine » |
| *Alt. 2* | `MedievelMontferrand2026-53.jpg` | Plein soleil, couleurs violettes fortes, mur de pierre volcanique. Plus estival, moins martial |

⚠️ **Limite technique** : `_MG_5965.jpg` ne fait que 2048 px de large. Pour un hero
plein écran, cela couvre un desktop 1× (jusqu'à 2048 px de viewport) mais **pas un
écran Retina 1440 px** (qui demanderait 2880 px). Deux options : demander le master
RAW/JPEG plein format au photographe, ou assumer un léger flou sur écrans HiDPI —
acceptable ici parce que l'image est assombrie par un voile et floutée en bas.
Point focal recommandé : `50% 45%` (garde le croisement des lames visible sous le titre).

### 3.2 Le club (`04 · Le club`, photo équipe 688 × 430)

| | Fichier | Justification |
|---|---|---|
| **Principal** | `Flouté_MedievelMontferrand2026-127.png` | C'est la photo « le club en action devant du public » : elle raconte la démonstration, l'ambiance, la transmission. Et **c'est la seule version conforme droit à l'image du lot** (enfants floutés) |
| *Alt. 1* | `_ASC0652.jpg` | L'accolade de fin d'assaut, geste de respect — très parlant pour une section « valeurs / le club ». Attention au filigrane |
| *Alt. 2* | `MedievelMontferrand2026-80.jpg` | Registre « ouverture, tout public », mais pose un problème de mineurs (§4) |

Point focal recommandé : `45% 40%` (les deux protagonistes, pas le public).

### 3.3 Disciplines (4 cartes portrait 360 × 620)

| Discipline | **Principal** | Alternative |
|---|---|---|
| Épée longue | `ARMES/épée double.jpg` | `IMG_3071.jpg` (action, mais casse la série nature morte) |
| Messer | `ARMES/Messer.png` ⚠️ master à redemander | — aucune autre photo de messer dans le lot |
| Rapière | `ARMES/Rapière.jpg` | `IMG_3607.jpg` ou `MedievelMontferrand2026-53.jpg` (rapière en action) |
| Combat viking | `ARMES/Viking.webp` ❌ **provisoire** | *Aucune alternative dans le lot.* Photo à produire |

**Recommandation forte** : les quatre cartes doivent former une série homogène.
Trois d'entre elles sont des natures mortes signées Alexandre Vergne, prises le même
jour, sur la même table, avec le même 50 mm f/1.8 → même lumière, même bokeh. La
quatrième est une photo de téléphone dans un jardin, à 393 px. Deux chemins possibles :

- **Chemin A (recommandé)** : refaire une nature morte « bouclier + hache/épée viking »
  dans les mêmes conditions, et redemander à Alexandre Vergne le master du messer.
  Coût : une demi-heure de shooting.
- **Chemin B (dégradé)** : basculer les quatre cartes sur des photos d'action
  (`IMG_3071` épée longue, `MedievelMontferrand2026-53` rapière…) — mais il n'existe
  toujours aucune photo de combat viking ni de messer en action dans le lot.

Point focal recommandé pour les quatre cartes : `50% 40%`.

### 3.4 Tournois (`07 · Tournois`, 489 × 652 portrait)

| | Fichier | Justification |
|---|---|---|
| **Principal** | `PSX_20260430_200236.jpg` | Trophée + drapeau « Lyon AMHE » : c'est littéralement la preuve du propos « circuit FFAMHE, résultats ». Cadrage portrait natif, exactement le format demandé |
| *Alt. 1* | `IMG_3364.jpg` | Escrimeur de face en garde en compétition — plus neutre, aucune personne identifiable, recadrable en portrait |
| *Alt. 2* | `IMG_3071.jpg` | Action de compétition verticale, très dynamique, tous masqués |

⚠️ Le principal expose un visage net et une identité. Autorisation écrite requise, et
prévoir `IMG_3364.jpg` en repli si le membre change d'avis.

### 3.5 Galerie (6 tuiles)

Attribution proposée, en gardant la structure de grille de la maquette V2 :

| Tuile | Format | **Principal** | Légende suggérée | Alternative |
|---|---|---|---|---|
| 1 — large | 770 × 504 | `IMG_3013.jpg` | « À l'assaut » | `_ASC0675.jpg` (plus lisible, moins bruité) |
| 2 — moyenne | 546 × 332 | `MedievelMontferrand2026-53.jpg` | « Médiévale de Montferrand » | `MedievelMontferrand2026-105.jpg` |
| 3 — moyenne | 546 × 332 | `_ASC0652.jpg` | « Au contact » | `_ASC0675.jpg` |
| 4 — portrait | 435 × 504 | `IMG_2609.jpg` | « En garde » | `IMG_3364.jpg` |
| 5 — portrait | 435 × 504 | `MedievelMontferrand2026-80.jpg` | ⚠️ **pas** « Combat viking » → « Portes ouvertes » | `MedievelMontferrand2026-70.jpg` (masque peint, très photogénique) |
| 6 — portrait | 435 × 504 | `IMG_3607.jpg` | « Le duel » | `IMG_3071.jpg` |

**Si la tuile 5 doit être remplacée pour raison de droit à l'image**, le meilleur
substitut est `MedievelMontferrand2026-70.jpg` (masque peint aux yeux bleus, très
identifiable visuellement) ou `MedievelMontferrand2026-105.jpg` (costumes
historiques, format panoramique).

La galerie doit rester **pilotée par le CMS** : un tableau de tuiles avec
`image / alt / légende / point focal / crédit`, sans nombre fixe. Six tuiles est la
mise en page de maquette, pas une contrainte de schéma.

### 3.6 Sections sans image disponible

| Section | Besoin | État |
|---|---|---|
| `03 · Profs` (3 portraits carrés 427 × 427) | 1 portrait par prof, + 1 portrait 500 × 600 par fiche prof | ❌ Rien dans `nouvelles_photos/`. Anciens fichiers `Marie.png` / `Gabriel.jpg` / `Ludwig.jpeg` à reprendre en attendant. **Recommandation : séance portraits homogène** (même fond, même lumière), d'autant que le client veut pouvoir ajouter/retirer des profs facilement — sans gabarit photo, chaque ajout cassera la grille |
| `05 · La rigueur` (gravure 488 × 517) | Planche de traité historique | ❌ Rien dans le lot. Conserver `treatise.jpg`, ou puiser dans le domaine public (Wiktenauer / Bibliothèques numériques) en documentant la source |
| Fiches armes — mini-cours (3 vignettes 427 × 250) | Miniatures vidéo | ❌ Rien. La maquette utilise des photos de galerie en placeholder. À produire au moment où les vidéos existeront |
| `10 · Partenaires` | Logos FFAMHE, Faits d'Armes, Black Armoury | ✅ Déjà dans `public/assets/` |
| Open Graph / partage social | 1200 × 630 | ❌ À produire — recadrage de `_MG_5965.jpg` ou `MedievelMontferrand2026-105.jpg` |

---

## 4. Vigilance droit à l'image

### 4.1 Ce qui a été vérifié

Chaque photo a été inspectée à 100 % dans les zones où des personnes apparaissent.

**`Flouté_MedievelMontferrand2026-127.png` — conforme.** Le préfixe « Flouté_ » est
exact : un floutage gaussien localisé a été appliqué **individuellement sur le visage
de chaque enfant du premier rang** (environ huit floutages distincts, tous confirmés
au pixel). Les adultes du public restent nets, et les trois protagonistes de la
démonstration (homme à lunettes, homme en t-shirt gris, présentateur en gambison
jaune) sont parfaitement identifiables — ce qui est cohérent avec l'hypothèse qu'il
s'agit de membres du club.
👉 **La version non floutée de cette photo n'est pas présente dans le lot.** Le
fichier `MedievelMontferrand2026-127` original n'y figure pas. C'est le bon
comportement : il ne faut pas l'ajouter au dépôt.
👉 `maquette-assets/club.jpg` **conserve bien les floutages** — vérifié.

### 4.2 Photos non floutées comportant des visages nets

| Fichier | Personnes reconnaissables | Mineurs ? | Risque | Action |
|---|---|---|---|---|
| `PSX_20260430_200236.jpg` | 1 — portrait plein cadre, plan américain, visage net | Non (adulte) | **Élevé** : c'est un portrait, pas une captation de foule | Autorisation écrite nominative obligatoire avant publication |
| `MedievelMontferrand2026-80.jpg` | 2 pratiquants au premier plan, visages partiellement visibles sous casque ; en arrière-plan : **un enfant en bleu, une enfant en robe de princesse, un enfant à casquette** | **Probable** — les deux pratiquants paraissent adolescents | **Élevé** | Autorisation parentale pour les pratiquants + flouter les enfants d'arrière-plan, ou remplacer la photo |
| `MedievelMontferrand2026-7.jpg` | 1 combattant non masqué, profil droit net | Non apparent | Moyen | Autorisation du membre. Sinon recadrer ou écarter |
| `MedievelMontferrand2026-70.jpg` | 1 homme en arrière-plan (t-shirt noir), visage net ; silhouettes floues autour | Non apparent | Moyen | Vérifier qu'il s'agit d'un membre ; sinon flouter (il est en arrière-plan, floutage indolore) |
| `MedievelMontferrand2026-53.jpg` | 1 personne en t-shirt jaune en arrière-plan, visage net ; public assis flou | Non apparent | Faible-moyen | Vérifier, flouter si besoin |
| `MedievelMontferrand2026-105.jpg` | Aucune — tous masqués, silhouettes lointaines floues | Non | **Nul** | Rien à faire ✅ |
| `_MG_5965.jpg`, `IMG_2609`, `IMG_3013`, `IMG_3071`, `IMG_3364`, `IMG_3607` | Aucune — masques d'escrime intégraux | Non | **Nul** | Rien à faire ✅ |
| `_ASC0652.jpg` | Visage entre deux masques, partiellement visible, barbu — reconnaissable pour un proche | Non | Faible | Vérifier auprès du membre |
| `_ASC0675.jpg` | Aucune — masques intégraux | Non | **Nul** | Rien à faire ✅ |
| `ARMES/*` | Aucune personne, sauf un avant-bras ganté sur `Viking.webp` | Non | **Nul** | Rien à faire ✅ |

### 4.3 Crédits photo obligatoires

Les métadonnées EXIF sont explicites, il ne s'agit pas d'une supposition :

| Auteur | Fichiers concernés | Mention |
|---|---|---|
| **Alexandre Vergne — L'IMAGINARIUM** (EXIF `Artist` + `Copyright`) | `MedievelMontferrand2026-7 / -53 / -70 / -80 / -105`, `Flouté_…-127`, `ARMES/épée double.jpg`, `ARMES/Rapière.jpg` — soit **8 fichiers**, dont `club.jpg`, `galerie-2`, `galerie-5`, `disc-epee-longue`, `disc-rapiere` | « © Alexandre Vergne — L'Imaginarium ». Confirmer l'étendue de la cession (web, durée, réseaux sociaux) |
| **Enzo Cirillo** (filigrane incrusté en bas à droite) | `_ASC0652.jpg`, `_ASC0675.jpg` → `galerie-3` | « © Enzo Cirillo ». Le filigrane est actuellement visible dans la maquette : soit on l'assume, soit on obtient une version sans filigrane avec crédit textuel |
| Non identifié | `_MG_5965.jpg` (Canon 6D Mk II, 2024), série `IMG_*` (Canon EOS RP, mai 2026), `PSX_*` | À faire préciser par le client avant mise en ligne — le hero est l'image la plus exposée du site |

### 4.4 Recommandations de procédure

1. **Ajouter un champ `crédit` (texte) et un champ `autorisation` (booléen ou date)
   sur chaque image du schéma Keystatic.** Le crédit s'affiche en légende de galerie
   et dans les mentions légales ; l'autorisation sert de garde-fou éditorial.
2. **Bloquer par convention l'ajout d'originaux non floutés dans le dépôt.** Le CMS
   étant git-based, toute image déposée via Keystatic est publique de fait. Une note
   dans l'interface d'admin (`description` du champ image) suffira.
3. **Formaliser les autorisations** : formulaire d'adhésion avec case droit à l'image,
   et affichage panneau lors des démonstrations publiques. `CONTENU-SITE.md` (ligne 287)
   contient déjà une mention générique — à compléter avec la liste nominative des
   crédits photo.
4. **Règle par défaut : flouter tout mineur non membre.** Le travail déjà fait sur
   la photo -127 est le bon standard, il doit être appliqué à `MedievelMontferrand2026-80.jpg`
   si celle-ci est retenue.

---

## 5. Pipeline images recommandé pour Astro

### 5.1 État actuel et changement à opérer

Aujourd'hui `keystatic.config.ts` écrit les images dans `public/assets/` :

```ts
fields.image({ label, directory: 'public/assets', publicPath: '/assets/' });
```

Tout ce qui vit dans `public/` est **servi tel quel, sans aucune optimisation** :
pas de conversion AVIF/WebP, pas de variantes responsive, pas de hash de cache.
C'est le point le plus coûteux du site actuel.

**Changement recommandé** : basculer les images éditoriales dans `src/assets/`, où
`astro:assets` (sharp) les traite au build.

```ts
// keystatic.config.ts
const photo = (label: string) =>
  fields.image({
    label,
    directory: 'src/assets/photos',
    publicPath: '/src/assets/photos/',
    validation: { isRequired: false },
    description: 'JPEG ou PNG, 2000 à 2600 px de large, < 1,5 Mo. Ne jamais déposer un fichier brut d’appareil photo.',
  });
```

Comme Keystatic ne stocke qu'un chemin (chaîne), il faut un résolveur pour retrouver
le `ImageMetadata` attendu par `<Image />` :

```ts
// src/lib/images.ts
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/photos/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

export function resolvePhoto(path?: string | null) {
  if (!path) return null;
  const key = path.startsWith('/') ? path : `/${path}`;
  return files[key]?.default ?? null;
}
```

Les **logos** (FFAMHE, Faits d'Armes, Black Armoury, logo du club) restent dans
`public/assets/` : ce sont des PNG/SVG à ne pas recompresser.

### 5.2 Configuration Astro

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',                 // déjà le cas — indispensable ici
  adapter: cloudflare({ /* … */ }),
  image: {
    // Force le service sharp au build. Sans cela, l'adaptateur Cloudflare peut
    // basculer sur un service « passthrough » (sharp n'existe pas dans le runtime
    // Workers) et l'optimisation serait silencieusement désactivée.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
```

⚠️ **Point de vigilance à valider au premier build** : les pages publiques sont
pré-rendues, donc l'optimisation a lieu sur la machine de build (GitHub Actions /
Cloudflare Pages) et non dans le Worker — c'est bien. Il faut simplement vérifier
que `dist/_astro/` contient les `.avif` / `.webp` générés. Si une route publique
devait un jour passer en SSR, ses images devraient être pré-générées ou déléguées
à Cloudflare Images.

### 5.3 Formats

| Usage | Formats servis | Qualité |
|---|---|---|
| Photos (hero, galerie, club, tournois, disciplines) | `avif` → `webp` → `jpeg` (fallback) | AVIF 50-55, WebP 72-78, JPEG 78 |
| Portraits de profs | idem | idem |
| Logos partenaires | `svg` si dispo, sinon `png` non recompressé | — |
| Open Graph | `jpeg` uniquement (compatibilité maximale des crawlers), 1200 × 630 | 82 |

AVIF fait gagner 40 à 60 % par rapport au JPEG sur ce type de photos (beaucoup de
noir, beaucoup de textures) et gère mieux le grain des images à haut ISO. Le triple
format se déclare avec `<Picture>` :

```astro
---
import { Picture } from 'astro:assets';
---
<Picture
  src={photo}
  formats={['avif', 'webp']}
  fallbackFormat="jpeg"
  widths={[435, 652, 870, 1160]}
  sizes="(max-width: 640px) 45vw, (max-width: 1100px) 33vw, 435px"
  alt={tuile.alt}
  loading="lazy"
  decoding="async"
  style={`object-position:${tuile.focal}`}
/>
```

### 5.4 Largeurs responsive à générer

Déduites des tailles de rendu réelles de la maquette (§2.3), en couvrant 1× et 2×.

| Emplacement | Rendu max | `widths` | `sizes` |
|---|---|---|---|
| Hero | 1440 px (pleine largeur) | `[640, 960, 1280, 1600, 1920]` — plafonné par la source à 2048 | `100vw` |
| Carte discipline | 360 px | `[300, 360, 540, 720]` | `(max-width: 780px) 66vw, 360px` |
| Photo club | 688 px | `[346, 520, 688, 1032, 1376]` | `(max-width: 900px) 92vw, 688px` |
| Photo tournois | 489 px | `[390, 489, 735, 980]` | `(max-width: 900px) 88vw, 489px` |
| Galerie — tuile large | 770 px | `[386, 580, 770, 1160, 1540]` | `(max-width: 640px) 62vw, (max-width: 1100px) 50vw, 770px` |
| Galerie — tuile moyenne | 546 px | `[273, 410, 546, 820, 1092]` | `(max-width: 640px) 62vw, (max-width: 1100px) 38vw, 546px` |
| Galerie — tuile portrait | 435 px | `[236, 435, 652, 870]` | `(max-width: 640px) 62vw, (max-width: 1100px) 33vw, 435px` |
| Fiche arme — hero | 588 px | `[390, 588, 880, 1176]` | `(max-width: 900px) 100vw, 588px` |
| Portrait prof — grille | 427 px | `[158, 240, 427, 640, 854]` | `(max-width: 780px) 40vw, 427px` |
| Portrait prof — fiche | 500 px | `[390, 500, 780, 1000]` | `(max-width: 900px) 100vw, 500px` |
| Vignette vidéo | 640 px | `[346, 427, 640, 854, 1280]` | `(max-width: 900px) 92vw, 640px` |

### 5.5 Règles de chargement et de performance

- **Hero** : `loading="eager"`, `fetchpriority="high"`, pas de `lazy`. C'est le LCP.
- **Tout le reste** : `loading="lazy"`, `decoding="async"`.
- **`width`/`height` explicites systématiques** (Astro les injecte depuis
  `ImageMetadata`) pour éviter tout décalage de mise en page.
- **Point focal** : le champ `focal` existe déjà dans les JSON de contenu
  (`"focal": "50% 40%"`). Le conserver dans le schéma Keystatic et l'appliquer en
  `object-position`. C'est ce qui permet à la rédaction de rattraper un cadrage sans
  retoucher le fichier.
- **Placeholder** : générer une version 20 px floutée en base64 (LQIP) pour les
  grandes images, ou à défaut un aplat de couleur dominante extrait au build. Sur
  ce site très sombre, un aplat `#0d0d10` suffit et coûte zéro octet.
- **Budget cible** : page d'accueil < 1,2 Mo d'images en desktop 2×, < 500 Ko en
  mobile. Le lot actuel converti en AVIF devrait donner ≈ 130 Ko pour le hero 1920 px,
  ≈ 70 Ko par tuile de galerie 1092 px, ≈ 50 Ko par carte discipline 720 px.

### 5.6 Discipline de dépôt — critique avec un CMS git-based

Keystatic écrit dans le dépôt Git. Sans règle, les 246 Mo d'originaux et chaque
photo future de 15 Mo finiront versionnés à vie dans l'historique.

1. **Ne jamais committer les masters.** Les originaux restent hors dépôt
   (disque du club, Nextcloud, Google Drive de l'asso). Ajouter `nouvelles_photos/`
   et `maquette-assets/` au `.gitignore` une fois les dérivés produits — ou les
   déplacer dans le dossier `research/` déjà ignoré.
2. **N'entrent dans `src/assets/photos/` que des fichiers pré-préparés** : 2400 px
   sur le grand côté, JPEG qualité 82, EXIF nettoyé sauf le crédit, **< 1,5 Mo**.
   Astro se charge du reste.
3. **Fournir un script de préparation** pour que le client n'ait pas à réfléchir :

   ```bash
   # scripts/prepare-photo.sh <fichier> [nom-de-sortie]
   # → 2400 px max, JPEG q82, EXIF nettoyé sauf copyright, nom kebab-case
   magick "$1" -auto-orient -resize '2400x2400>' -strip \
     -define jpeg:extent=1200kb -quality 82 \
     -set 'exif:Copyright' "$(magick identify -format '%[EXIF:Copyright]' "$1")" \
     "src/assets/photos/${2:-$(basename "${1%.*}")}.jpg"
   ```

4. **Convention de nommage** : kebab-case, sans accent ni espace, préfixé par le
   contexte et suffixé par l'année.
   `hero-scene-2024.jpg`, `club-demo-montferrand-2026.jpg`,
   `arme-epee-longue.jpg`, `galerie-assaut-gymnase-01.jpg`,
   `prof-gabriel-tardio.jpg`.
   Les noms actuels (`épée double.jpg`, `Flouté_…`, `PSX_20260430_200236.jpg`)
   contiennent accents, espaces et majuscules — sources d'ennuis en URL et sur les
   systèmes de fichiers sensibles à la casse. À renommer au moment de l'import.
5. **Anticiper le multi-écoles** : organiser en
   `src/assets/photos/commun/`, `src/assets/photos/clermont/`,
   `src/assets/photos/<future-ecole>/`. Le champ image de Keystatic peut alors être
   scopé par école, et une nouvelle antenne n'implique aucune refonte du pipeline.

### 5.7 Traitements à appliquer avant import

| Fichier | Traitement |
|---|---|
| `Flouté_MedievelMontferrand2026-127.png` | **PNG 31 Mo → JPEG q85** (gain ≈ 97 %). Vérifier après conversion que les floutages restent nets — le JPEG ne les altère pas, mais un contrôle visuel s'impose |
| `IMG_3013.jpg` (ISO 12800) | **Débruitage** + éclaircissement léger des ombres avant réduction. Sans cela, `galerie-1` restera le fichier le plus lourd du site (1,3 Mo actuellement) alors que c'est l'image la moins lisible |
| `IMG_2609.jpg` (ISO 10000) | Débruitage modéré |
| `IMG_3071` / `IMG_3607` (ISO 8000) | Débruitage léger |
| `_ASC0652.jpg`, `_ASC0675.jpg` | Décider : garder le filigrane, ou demander une version propre + crédit textuel |
| `ARMES/Viking.webp` | ❌ Ne pas importer en production. Photo de remplacement à produire |
| `ARMES/Messer.png` | Utilisable en l'état (842 px couvre 360 × 620 en 1×, tout juste en 2×). Redemander le master à Alexandre Vergne pour la fiche arme 588 × 660 |
| Tous | `-auto-orient`, `-strip` (retirer GPS et données personnelles), puis réinjection du seul champ `Copyright` |

---

## 6. Récapitulatif des manques

| Manque | Criticité | Action |
|---|---|---|
| Photo de **combat viking** exploitable | 🔴 Bloquant — une carte discipline sur quatre | Shooting nature morte (bouclier + arme) dans les mêmes conditions que les trois autres |
| **Portraits des profs** (Marie, Gabriel, Ludwig) | 🔴 Bloquant — section 03 + fiches profs | Séance portraits homogène. Définir un gabarit (fond, cadrage, focale) pour que les futurs ajouts de profs restent cohérents |
| **Master haute déf. du hero** (`_MG_5965`) | 🟠 Important | Demander le fichier plein format au photographe |
| **Master haute déf. du messer** | 🟠 Important | Demander à Alexandre Vergne |
| **Crédits et autorisations** non formalisés | 🟠 Important | Voir §4.4 |
| **Gravure / traité** pour « La rigueur » | 🟡 Moyen | Conserver `treatise.jpg` ou sourcer dans le domaine public |
| **Image Open Graph** 1200 × 630 | 🟡 Moyen | Recadrage de `_MG_5965.jpg` ou `MedievelMontferrand2026-105.jpg` |
| **Vignettes vidéo** des mini-cours | 🟢 Faible | Reporté à la production des vidéos |
| Photo de **salle / créneaux** (lieu de pratique) | 🟢 Faible | Utile pour la section « Nous rejoindre », aucune photo du gymnase de l'USAM dans le lot |
