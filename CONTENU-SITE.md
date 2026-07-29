# Contenu du site — texte en ligne (version prof)

> **Ce fichier documente le texte réellement affiché sur le site en ligne**, tel
> qu'édité via l'admin CMS (`/admin`). Il a été récupéré le **6 juillet 2026**
> depuis <https://dfda-pages.pages.dev/> via l'API publique `/api/content/<section>`.
>
> Rappel de fonctionnement : chaque section est stockée dans **Cloudflare KV**
> quand un chef l'édite. Si KV n'a pas d'override, le site retombe sur les
> valeurs par défaut du repo (`content/seed.js`). Ce document reflète donc l'état
> **live**, override KV quand il existe, sinon seed.

## Origine de chaque section

| Section        | Source affichée en ligne | Modifiée par le prof ? |
| -------------- | ------------------------ | ---------------------- |
| `hero`         | `seed.js` (défaut repo)  | Non                    |
| `actualites`   | KV (édité en ligne)      | **Oui**                |
| `disciplines`  | KV (édité en ligne)      | **Oui**                |
| `profs`        | KV (édité en ligne)      | **Oui**                |
| `club`         | KV (édité en ligne)      | **Oui**                |
| `rigueur`      | KV (édité en ligne)      | **Oui**                |
| `rejoindre`    | KV (édité en ligne)      | **Oui**                |
| `tournois`     | KV (édité en ligne)      | **Oui**                |
| `galerie`      | `seed.js` (défaut repo)  | Non                    |
| `faq`          | `seed.js` (défaut repo)  | Non                    |
| `partenaires`  | KV (édité en ligne)      | **Oui**                |
| `footer`       | `seed.js` (défaut repo)  | Non                    |
| `legal`        | `seed.js` (défaut repo)  | Non                    |

> ⚠️ **Incohérences repérées** — voir la section [Notes & incohérences](#notes--incohérences) en fin de document.

---

## Hero *(en-tête — défaut repo, non modifié)*

- **Titre :** De **Feu** et d'**Acier**
- **Sous-titre :** Arts Martiaux Historiques Européens
- **Lieu :** à Clermont-Ferrand
- **Bouton :** « Venir essayer » → `#creneaux`
- **Invite de défilement :** « Découvrir le club »

---

## 0 · Actualités *(édité en ligne)*

- **Eyebrow :** Actualités
- **Titre :** Ce qui / se passe en ce moment.
- **Lede :** *(vide)*
- **Bandeau pré-header :** **désactivé** (`enabled: false`, non affiché)
  - Eyebrow : « À noter »
  - Texte : « bon jour je suis un test »
  - Lien : `bonjour.com`
- **Cartes d'actualités :** aucune *(liste vide → la section ne s'affiche pas)*

---

## 1 · Les disciplines *(édité en ligne)*

- **Eyebrow :** Les disciplines
- **Titre :** Cinq armes, / cinq grammaires.
- **Lede :** On peut tout pratiquer, on peut se spécialiser. Chaque arme ouvre une école de pensée et un répertoire technique distincts, étalés sur plusieurs siècles.

**Cartes disciplines (4) :**

### Combat viking
- Sous-titre : Bouclier & arme courte
- Époque : Haut Moyen Âge — VIIIᵉ — XIᵉ s.
- Description : Pratique inspirée des traditions martiales "Viking", avec bouclier et armes adaptées. Jeu de pression, contact, contrôle, avec une equipe qui axe sa pratique vers la reconstitution.

### Épée longue
- Sous-titre : Arme emblématique des AMHE
- Époque : Médiévale — XIVᵉ — XVᵉ s.
- Description : Pratiquée à deux mains, l'épée longue est l'arme emblématique des AMHE. Nous pratiquons la tradition germanique de Maitre Johannes Liechtenauer et de ses glossateurs. Structure, explosivité, versatilité, de taille comme de pointe, ce sont les maitres mots de cette arme.

### Messer
- Sous-titre : Grand couteau de combat
- Époque : Médiévale — XVᵉ s.
- Description : Arme médiévale germanique, proche d'un grand couteau de combat à un tranchant. Système populaire mêlant escrime et lutte rapprochée.

### Rapière
- Sous-titre : Escrime de la Renaissance
- Époque : Renaissance — XVIᵉ — XVIIᵉ s.
- Description : Arme plus tardive, liée à l'escrime de la Renaissance et de l'époque moderne. Jeu de pointe fin, distance, et déplacement précis.

---

## 2 · Les profs *(édité en ligne)*

- **Eyebrow :** Les profs
- **Titre :** Trois encadrants, / trois écoles.
- **Lede :** Chaque arme a son référent. Tous transmettent à leur rythme, avec une pédagogie qui leur est propre et qui est issue d'une longue expérience de pratiquant, ainsi que de nombreuses heures de lecture des sources.

**Encadrants (3) :**

### Marie Poignant — Rapière
- Punch : Rapière française & italienne · bolonaise
- Bio : Instructrice rapière. Travaille les traditions française et italienne, l'escrime bolonaise et les systèmes main gauche (cape, dague, bocle). Pratique AMHE depuis 2013.
- Lien : *(aucun)*

### Gabriel Tardio — Épée longue *(mis en avant)*
- Punch : Top 1 % mondial · épée longue acier
- Bio : Référent principal du club. Compétiteur reconnu du circuit AMHE, classé dans le top 1 % mondial en épée longue acier sur HEMA Ratings. Pratique exigeante, structurée, tournée vers l'efficacité en assaut.
- Lien : [Profil HEMA Ratings](https://hemaratings.com/fighters/details/5716/)

### Ludwig Fort — Messer · viking · bocle
- Punch : Armes courtes & bouclier
- Bio : Encadre les pratiques messer, combat viking et épée-bocle. Apporte une approche orientée armes courtes, bouclier et systèmes asymétriques — les disciplines moins courues du répertoire AMHE.
- Lien : *(aucun)*

---

## 3 · Le club *(édité en ligne)*

- **Eyebrow :** Le club
- **Titre :** Une bande / d'escrimeurs, / une école.
- **Corps :** Section AMHE de l'USAM Clermont-Ferrand, affiliée à la FFAMHE, le club accueille débutants et pratiquants confirmés, en loisir comme en compétition. Encadrement assuré par Gabriel Tardio. La salle est ouverte à toutes et tous, et l'on prend le temps de bien faire les choses.
- **Image :** `assets/team-track.webp` — alt : « L'équipe sur la piste »

**Piliers (3) :**

1. **Source** — Étude des textes et traités historiques. Lecture, mise en pratique, reconstitution martiale des gestes anciens.
2. **Geste** — Technique structurée par le drill, le sentiment du fer, et la mise en pratique en assaut libre.
3. **Salle** — Un esprit d'école d'armes : exigence sportive, respect du partenaire, et progression à son rythme.

---

## 4 · La rigueur *(édité en ligne)*

- **Eyebrow :** La rigueur
- **Titre :** Le geste juste, / avant le costume.
- **Lede :** On étudie les arts martiaux européens à partir des *traités et sources historiques*, dans une pratique moderne, sportive et sécurisée. On y vient pour le geste, pas pour le costume.
- **Corps :** Ici on s'entraîne en tenue de sport, masque d'escrime et protections modernes, avec des armes d'entraînement adaptées à chaque discipline. Les sources sont a la base de notre travail, et nous poussons leur application jusqu'en assaut, avec différent niveau d'engagement.
- **Image :** `assets/treatise.jpg` — alt : « Planche issue d'un traité d'escrime historique »
- **Légende figure :** Planche extraite d'un traité d'escrime historique. Étude des gardes, des distances, du timing — des gestes que l'on cherche à comprendre, puis à éprouver dans la salle.

---

## 5 · Nous rejoindre *(édité en ligne)*

- **Eyebrow :** Nous rejoindre
- **Titre :** Une lame, un masque, / et l'envie de bien faire.

**Créneaux (tableau — Jour / Horaire / Discipline / Niveau) :**

| Jour | Horaire       | Discipline                                 | Niveau         |
| ---- | ------------- | ------------------------------------------ | -------------- |
| Mar  | 18h00 — 20h00 | Épée longue · rapière · messer · viking    | Tous niveaux   |
| Jeu  | 18h00 — 20h00 | Pratique libre                             | Sans encadrant |
| Jeu  | 20h00 — 22h00 | Épée longue · épée-bocle                   | Tous niveaux   |

**Bloc 01 · Viens essayer**
- Titre : Les deux premieres séances sont *gratuites*, alors pourquoi ne pas essayer ?
- Paragraphe 1 : Peu importe que tu n'aies jamais fait de sport, que tu sortes d'un autre art martial ou que tu n'aies rien touché depuis des années — **on t'accueille**. Tu n'as besoin de rien apporter : on te prête le masque, et **l'arme que tu veux tester** (épée longue, sabre, dague, rapière…).
- Paragraphe 2 : Aucun engagement, aucun frais. *Viens, ça nous fait plaisir.*
- Bouton : [Itinéraire](https://www.google.com/maps/dir/?api=1&destination=Gymnase+Robert+Pras%2C+3+rue+Jean+Monnet%2C+63100+Clermont-Ferrand)

**Bloc 02 · Pour continuer**
- Titre : **85 €** par an, un masque, des gants coqués. *C'est tout.*
- Paragraphe 1 : Si tu décides de rester pour l'année, l'adhésion c'est 85 € — soit *littéralement moins qu'un Netflix*. À ça, tu ajoutes les **deux seules pièces** à te procurer pour les séances régulières : un masque d'escrime standard et des gants coqués.
- Paragraphe 2 : Le reste — vestes, protections, armes — on en parle au fil du temps, souvent à prix d'ami chez nos partenaires.
- Bouton : [Adhérer · HelloAsso](https://www.helloasso.com/associations/usam-amhe-clermont-ferrand/adhesions/inscription-usam-amhe-clermont-2025-2026)

**Lieu & contact**
- Lieu : **Gymnase Robert Pras** — 3 rue Jean Monnet · 63100 Clermont-Ferrand
- Contact : **amhe63.dfda@gmail.com** · **06 61 28 65 11**
- Carte : Gymnase Robert Pras, 3 rue Jean Monnet · 63100 Clermont-Ferrand (OpenStreetMap)

---

## 6 · Tournois & saison *(édité en ligne)*

- **Eyebrow :** Tournois & saison
- **Titre :** Saison / de compétition.
- **Photo :** `assets/podium.jpg` — alt : « Podium FFAMHE »
  - Overlay eyebrow : Compétiteurs
  - Overlay titre : Plusieurs membres engagés en compétition, référencés sur HEMA Ratings.
- **Corps :** Le club est présent sur le circuit FFAMHE et référencé sur HEMA Ratings. La compétition reste un choix : on peut pratiquer en loisir ou viser les tournois, à son rythme.

**Faits :**
- Circuit FFAMHE — épée longue, épée de coté, rapière — open / débutant / féminin
- Interclubs & stages — échanges réguliers avec d'autres clubs AMHE
- Loisir possible — la compétition n'est jamais obligatoire

**Boutons :**
- [Résultats HEMA Ratings](https://hemaratings.com/clubs/details/1155/)
- [Calendrier FFAMHE](https://ffamhe.fr)

---

## 7 · Galerie *(défaut repo, non modifié)*

- **Eyebrow :** Galerie
- **Titre :** Quelques / images de salle.
- **Lien :** [Suivre sur Facebook](https://www.facebook.com/63AMHE/)

**Vignettes (6) :**
1. `assets/duel-reflection.webp` — « Reflets de salle »
2. `assets/team-track.webp` — « L'équipe »
3. `assets/kit-still-life.webp` — « L'équipement »
4. `assets/group-gym.jpg` — « En gymnase »
5. `assets/sparring.jpg` — « À l'assaut »
6. `assets/duel-blue.webp` — « En garde »

---

## 8 · Questions fréquentes (FAQ) *(défaut repo, non modifié)*

- **Eyebrow :** Questions fréquentes
- **Titre :** Tout ce qu'on / nous demande.
- **Lede :** Les questions qu'on entend le plus souvent au premier contact. Si la vôtre n'y est pas, [écrivez-nous](mailto:c.sillac@protonmail.com) — on répond.

**Q — Faut-il déjà faire du sport ou de l'escrime ?**
Non. La séance accueille tous niveaux et l'encadrement prend le temps avec les débutants — on commence par comprendre le geste avant de l'enchaîner. Aucun pré-requis sportif ou martial.

**Q — C'est dangereux ?**
On s'entraîne en tenue de sport, masque d'escrime et protections modernes, avec des armes d'entraînement adaptées à chaque discipline. Le travail est progressif : drills, sentiment du fer, puis assauts encadrés. Pas d'arme tranchante en main, pas de contact sans équipement.

**Q — À quoi ressemble une séance ?**
Chaque séance commence par environ 40 minutes d'échauffement collectif, intense et rythmé — tous ensemble, sur la même cadence. On prépare les articulations, le cardio, les déplacements et la coordination, en groupe. Personne ne se retrouve seul à se demander quoi faire : on suit le rythme. Une fois le corps prêt, on enchaîne sur le travail technique du jour (drills, exercices d'opposition, puis assauts encadrés selon le niveau).

**Q — Que dois-je apporter pour la première séance ?**
Tenue de sport, chaussures propres pour le gymnase et une bouteille d'eau. Le matériel d'initiation (masque, gants, arme d'entraînement) est prêté pour découvrir.

**Q — Combien coûte l'adhésion ?**
85 € pour la saison 2025-2026, via HelloAsso. Il est possible de rejoindre en cours d'année. La première séance d'essai est sans engagement — contactez-nous avant de venir pour qu'on vous attende.

**Q — Quels créneaux et quel lieu ?**
Mardi 18h-20h et jeudi 18h-22h au Gymnase Robert Pras (3 rue Jean Monnet, 63100 Clermont-Ferrand). Le créneau Mardi couvre épée longue, rapière, messer, viking. Le créneau Jeudi couvre épée longue et épée-bocle, précédé d'une pratique libre sans encadrant.

**Q — Faut-il venir à toutes les séances ?**
Non, c'est complètement libre. Pas besoin de prévenir si tu sautes une séance, si tu n'es pas là pendant deux semaines ou si tu n'as juste pas envie un soir — tu reviens quand tu veux, sans justification. Cela dit : la régularité reste la clé pour progresser. La technique se construit dans la répétition, et le corps s'habitue petit à petit aux gardes, aux distances et à l'effort. Plus tu viens, plus ça paie.

**Q — Faut-il faire de la compétition ?**
Non. Le club est présent sur le circuit FFAMHE et plusieurs membres sont référencés sur HEMA Ratings, mais la compétition n'est jamais obligatoire. Loisir et perfectionnement technique sont une voie tout aussi reconnue.

---

## 9 · Partenaires *(édité en ligne)*

- **Eyebrow :** Partenaires
- **Titre :** Sans eux, / rien de tout ça.
- **Lede :** Un club n'existe pas tout seul. Il existe parce qu'une fédération porte la discipline au niveau national, parce que des artisans fabriquent du matériel pensé pour cette pratique, et parce que ces gens-là *partagent la même exigence que nous*. Les trois ci-dessous, on ne se contente pas de les mentionner — on les recommande, on travaille avec eux, et on t'invite à aller voir.

### FFAMHE — Affiliation
- Lien : [Visiter la FFAMHE](https://ffamhe.fr)
- Corps : La **Fédération Française des Arts Martiaux Historiques Européens** est la colonne vertébrale de tout le milieu AMHE en France. Sans elle, *pas de circuit de tournois national, pas de lien entre les associations, pas de cadre pour assurer et reconnaître les clubs*. Notre affiliation, c'est ce qui permet au club de rejoindre la scène nationale, et à chaque séance ici d'être rattachée à un travail collectif beaucoup plus large que notre seule salle.

### Faits d'Armes — Équipement
- Lien : [Voir leurs équipements](https://faitsdarmes.com/fr/)
- Corps : Entrepreneur français *travaillant directement avec les pratiquants*. Vestes 350N ou 800N, gants coqués, protections rigides — chaque pièce est conçue pour **résister aux assauts longue épée** et durer. Quand tu veux monter ton équipement sérieusement, c'est par là qu'on commence à regarder. Fait d'armes dispose d'un vaste catalogue, et en plus, il est a deux pas d'ici.

### Black Armoury — Équipement
- Lien : [Voir leurs lames](https://blackarmoury.com)
- Corps : Partenaire **incontournable de la scène AMHE**. Black Armoury a développé de nombreux produits aujourd'hui exclusifs a sa marque, la Veste Arcem notament est l'un des produits les mieux désigné pour notre pratique, et largement privilégié au club. Avec sa volonté d'innover sur le matériel et les protections, Black armoury s'impose dans la production d'equipement toujours plus calibré pour nos besoins.

---

## Footer *(défaut repo, non modifié)*

- **Marque :** De Feu et d'Acier
- **Description :** Section AMHE de l'USAM Clermont-Ferrand, affiliée à la FFAMHE. Arts martiaux historiques européens au cœur du Puy-de-Dôme.

**Colonne « Le club » :** La rigueur (`#rigueur`) · Disciplines (`#disciplines`) · FAQ (`#faq`) · Tournois (`#tournois`) · Galerie (`#galerie`)

**Colonne « Pratique » :** Nous rejoindre (`#creneaux`) · [Adhésion](https://www.helloasso.com/associations/usam-amhe-clermont-ferrand/adhesions/inscription-usam-amhe-clermont-2025-2026) · [Nous écrire](mailto:c.sillac@protonmail.com) · [HelloAsso](https://www.helloasso.com/associations/usam-amhe-clermont-ferrand)

**Colonne « Suivre » :** [Facebook](https://www.facebook.com/63AMHE/) · [HEMA Ratings](https://hemaratings.com/clubs/details/1155/) · [USAM Clermont](https://usam-clermont-ferrand.com/amhe-arts-martiaux-historiques-europeens) · [FFAMHE](https://ffamhe.fr)

- **Copyright :** © 2026 · De Feu et d'Acier · Clermont-Ferrand
- **Liens légaux :** Mentions légales (`#mentions-legales`) · Confidentialité (`#rgpd`)

---

## Informations légales *(défaut repo, non modifié)*

### Mentions légales
- **Intro :** Site édité par la section AMHE « De Feu et d'Acier » de l'USAM Clermont-Ferrand, association loi 1901 affiliée à la FFAMHE.
- **Siège & lieu d'entraînement :** Gymnase Robert Pras — 3 rue Jean Monnet, 63100 Clermont-Ferrand
- **Horaires hebdomadaires :**
  - Mardi 18h00 — 20h00 · entraînement encadré, tous niveaux
  - Jeudi 18h00 — 20h00 · pratique libre, sans encadrant
  - Jeudi 20h00 — 22h00 · entraînement encadré, tous niveaux
- **Directrice de publication :** Clémence Sillac, présidente de section
- **Contact :** c.sillac@protonmail.com · 06 31 58 54 60
- **Affiliation :** Section AMHE de l'USAM Clermont-Ferrand · fédération FFAMHE
- **Hébergement :** Cloudflare Workers — Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA
- **Note :** Les photographies et illustrations utilisées sont la propriété du club ou de leurs auteurs respectifs. Toute reproduction non autorisée est interdite.

### Confidentialité & RGPD
- Ce site ne dépose **aucun cookie**, n'utilise **aucun outil d'analyse** et ne stocke aucune donnée personnelle côté serveur.
- Le formulaire de contact ouvre votre application de messagerie avec un message pré-rempli. Aucune information n'est envoyée vers ce site ni vers un service tiers : l'envoi se fait depuis votre propre boîte mail.
- Les coordonnées affichées (mail, téléphone, adresse) sont celles communiquées volontairement par les responsables du club pour leurs fonctions associatives.
- **Note :** Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression sur les données qui vous concernent. Pour exercer ces droits, contactez la présidente de section à l'adresse ci-dessus.

---

## Notes & incohérences

Éléments repérés en comparant le texte en ligne (prof) au repo — utiles à vérifier
avant de figer ce contenu :

1. **Coordonnées de contact incohérentes selon la section.** Le prof a mis à jour
   le contact dans **Nous rejoindre** → `amhe63.dfda@gmail.com` / `06 61 28 65 11`.
   Mais les sections **FAQ**, **Footer** et **Mentions légales** (non éditées en
   ligne, donc encore sur le seed) affichent toujours l'ancien contact
   `c.sillac@protonmail.com` / `06 31 58 54 60`. → Le site montre **deux contacts
   différents** selon l'endroit.

2. **« Cinq armes » mais 4 disciplines listées.** Le titre de la section
   Disciplines dit toujours « Cinq armes, cinq grammaires. », alors que le prof a
   retiré **Épée-bocle** de la liste : il ne reste que **4** disciplines (viking,
   épée longue, messer, rapière). À harmoniser (titre ou nombre d'armes).

3. **Bandeau de test resté dans Actualités.** Le bandeau pré-header contient un
   texte de test « bon jour je suis un test » avec le lien `bonjour.com`. Il est
   **désactivé** (`enabled: false`), donc invisible sur le site, mais le contenu
   de test est présent dans KV.

4. **Coquilles / formulations dans le texte du prof** (présentes telles quelles
   en ligne) : « une equipe » (Disciplines viking), « Maitre » et « maitres mots »
   (Disciplines épée longue), « différent niveau d'engagement » (Rigueur),
   « premieres » (Rejoindre bloc 01), « a la base », « il est a deux pas »,
   « désigné » (pour « conçu »), « notament », « a sa marque », « equipement »
   (Partenaires). À corriger si tu repasses le texte au propre.

5. **Sections encore sur le seed du repo** (aucun override en ligne) : `hero`,
   `galerie`, `faq`, `footer`, `legal`. Leur texte ci-dessus vient donc du repo,
   pas d'une édition du prof.
