# Guide de l'administration du site

Bienvenue. Ce guide est fait pour vous, encadrants du club, sans aucune
connaissance technique. Il explique **comment modifier le site vous-mêmes** :
publier une annonce, écrire un article, changer une photo, mettre à jour les
créneaux ou le tarif.

Rien de ce que vous faites ici n'est définitif : tout est enregistré, et vous
pouvez toujours revenir en arrière ou corriger une erreur. Vous ne pouvez pas
« casser le site » en vous trompant dans un texte : au pire il refuse de
publier et vous dit pourquoi.

Chaque section ci-dessous est une **tâche**. Allez directement à celle qui vous
intéresse ; le reste peut attendre.

---

## Sommaire

1. [Avant la première connexion](#1-avant-la-première-connexion)
2. [Se connecter](#2-se-connecter)
3. [Comment l'administration est rangée](#3-comment-ladministration-est-rangée)
4. [Publier une annonce](#4-publier-une-annonce)
5. [Écrire un article](#5-écrire-un-article)
6. [Composer une page avec les blocs](#6-composer-une-page-avec-les-blocs)
7. [Ajouter, masquer ou retirer un encadrant](#7-ajouter-masquer-ou-retirer-un-encadrant)
8. [Changer une photo](#8-changer-une-photo)
9. [Modifier les créneaux, le tarif, le lieu, le contact](#9-modifier-les-créneaux-le-tarif-le-lieu-le-contact)
10. [Les photos du gymnase (à faire à la rentrée)](#10-les-photos-du-gymnase-à-faire-à-la-rentrée)
11. [Les sources : traités et planches](#11-les-sources--traités-et-planches)
12. [Quand la modification apparaît sur le site](#12-quand-la-modification-apparaît-sur-le-site)
13. [Si une modification est refusée](#13-si-une-modification-est-refusée)
14. [Qui appeler](#14-qui-appeler)
15. [Petits réflexes qui font gagner du temps](#15-petits-réflexes-qui-font-gagner-du-temps)

---

## 1. Avant la première connexion

Il faut **un compte GitHub**. C'est gratuit, ça prend cinq minutes, et c'est ce
qui sert d'identité pour modifier le site : chaque modification est signée par
son auteur, ce qui permet de revenir en arrière proprement si besoin.

1. Aller sur [github.com](https://github.com) → « Sign up ».
2. Une adresse e-mail, un mot de passe, un nom d'utilisateur. Le nom
   d'utilisateur peut être n'importe quoi (`gabriel-amhe63`, par exemple) : il
   n'apparaît pas sur le site.
3. **Envoyer ce nom d'utilisateur à Zaccharie.** Il vous ajoute au dépôt du
   site : sans cette invitation, la page d'administration s'ouvre mais refuse
   d'enregistrer.
4. GitHub vous envoie un e-mail d'invitation. Cliquer sur « Accept invitation ».

C'est la seule étape un peu administrative, et elle ne se fait qu'une fois.

---

## 2. Se connecter

Ajoutez `/keystatic` à la fin de l'adresse du site :

```
https://…/keystatic
```

La première fois, GitHub vous demande d'autoriser l'application. Acceptez : vous
arrivez sur l'administration, avec « De Feu et d'Acier » en haut à gauche et le
menu des contenus sur la gauche.

Mettez cette adresse dans vos favoris. Sur téléphone, ça fonctionne aussi, mais
pour écrire un article un ordinateur est plus confortable.

---

## 3. Comment l'administration est rangée

Le menu de gauche est classé par **ce que vous venez faire**, pas par type de
fichier :

| Groupe | Ce qu'on y trouve |
| --- | --- |
| **Publier** | *Annonces (messages courts)* · *Articles (actualités)* |
| **L'école** | *Lieu, contact, créneaux & tarifs* · *Encadrants* |
| **Enseignement** | *Armes & disciplines* · *Les sources (traités historiques)* |
| **Contenus** | *Albums photo* · *Questions fréquentes (locales)* · *Questions fréquentes (générales)* · *Partenaires* |
| **Textes des pages** | les textes fixes de l'accueil (*Accueil · En-tête*, *Accueil · Le club*, *Accueil · La rigueur*, *Accueil · Nous rejoindre*, *Accueil · Tournois & saison*, *Accueil · Titres des sections*, *Textes des fiches arme & prof*) |
| **Réglages** | *Identité du site* · *Menus & pied de page* · *Mentions légales & confidentialité* |

Neuf fois sur dix, vous n'aurez besoin que des deux premiers groupes.

Trois boutons reviennent partout, en haut à droite d'une fiche :

- **Enregistrer** (« Save ») : valide vos modifications. Rien n'est pris en
  compte avant ce clic.
- **Réinitialiser** / « Reset » : annule ce que vous venez de taper.
- **Supprimer** (« Delete ») : efface la fiche. À éviter (voir plus bas
  « retirer n'est pas supprimer »).

---

## 4. Publier une annonce

Une annonce, c'est un message court et daté : séance annulée, gymnase fermé,
inscription qui ouvre. Elle s'affiche dans une bande, tout en haut du site,
au-dessus du menu, et elle est difficile à manquer.

**Publier → Annonces (messages courts) → bouton « + »**

| Champ | Quoi mettre |
| --- | --- |
| **Titre court** | 60 caractères maximum. Ex. « Séance du 12 mars annulée ». Il sert à retrouver l'annonce dans l'administration, il n'est pas affiché sur le site. |
| **Date de l'annonce** | La date du jour est déjà remplie. |
| **Message** | C'est **le texte que les visiteurs lisent**. Une à deux phrases, 240 caractères maximum. |
| **Type de message** | *Information*, *Important*, ou *Urgent (séance annulée…)*. Change la couleur de la bande et la petite étiquette affichée à gauche du message. |
| **Lien (facultatif)** | Un *Texte du bouton* et une *Adresse* si l'annonce renvoie quelque part. |
| **Épingler en bandeau** | À cocher, sinon rien ne s'affiche. Voir juste en dessous. |
| **Retirer automatiquement le** | Voir juste en dessous. |

### Le bandeau épinglé : la case à ne pas oublier

Il n'y a pas de page « annonces » sur le site. Une annonce n'apparaît **que** si
**Épingler en bandeau** est cochée. Enregistrer une annonce sans cocher cette
case, c'est la ranger dans l'administration sans la publier : les visiteurs n'en
verront rien. C'est l'oubli classique, pensez-y en premier.

**Une seule annonce peut être épinglée à la fois.** Si vous en épinglez une
deuxième en oubliant de dépingler la première, la publication s'arrête avec un
message qui nomme les deux annonces concernées. Décochez la case sur l'ancienne,
et c'est réglé. (Le site sait choisir : c'est la plus récente qui gagne. Mais deux
annonces épinglées, c'est presque toujours une annonce oubliée, d'où l'alerte.)

Gardez le bandeau pour ce qui est vraiment urgent. Un bandeau permanent devient
invisible au bout de deux semaines.

### L'expiration automatique

**Retirer automatiquement le** est le champ qui vous évite les annonces
fantômes. Mettez-y la date après laquelle le message n'a plus de sens (le
lendemain de la séance annulée, la veille du tournoi). Passé cette date,
l'annonce disparaît du site toute seule.

Laisser ce champ vide, c'est s'engager à revenir la retirer à la main. En
pratique, remplissez-le presque toujours.

---

## 5. Écrire un article

Un article, c'est une actualité avec un titre, une photo et du texte : compte
rendu de tournoi, retour de stage, présentation de matériel. Il apparaît dans la
page « Actualités » et a sa propre adresse, partageable sur Facebook.

**Publier → Articles (actualités) → bouton « + »**

### Écrire tranquillement, publier plus tard

Le champ **Statut** a deux valeurs :

- **Brouillon (pas encore affiché sur le site)** : la valeur par défaut ;
- **Publié**.

Un brouillon n'apparaît nulle part sur le site et n'a pas d'adresse. Vous pouvez
donc l'écrire en trois fois, sur trois soirs, et ne basculer sur *Publié* que
quand il vous plaît.

> **Une nuance à connaître** : un brouillon est quand même enregistré dans le
> dépôt du site, qui est public. N'y mettez rien que vous n'écririez pas dans
> un e-mail au club.

### Les champs, dans l'ordre

| Champ | Quoi mettre |
| --- | --- |
| **Titre** | Le titre de l'article. Il sert aussi à fabriquer l'adresse de la page. |
| **Date de publication** | La date du jour est déjà remplie. |
| **Statut** | *Brouillon* tant que ce n'est pas prêt. |
| **Chapô** | Deux ou trois lignes de résumé, 280 caractères maximum. C'est ce qu'on lit sur la carte de l'article, et c'est ce que Google affiche. Prenez-en soin. |
| **Image de couverture** | Voir la section 8 sur les photos. La *Description de l'image* est obligatoire. |
| **Catégorie** | *Vie du club*, *Tournoi*, *Stage*, *Sources & technique* ou *Matériel*. |
| **Écrit par** | Facultatif. La liste propose les encadrants du club. |
| **Mettre à la une** | Remonte l'article en tête de la page « Actualités ». |
| **Contenu** | Le corps de l'article : du texte, et les blocs du § 6 (galerie, vidéo, questions-réponses, renvoi, bouton, planche). |
| **Photos de l'article** | Une galerie en fin d'article. Chaque photo a sa description. |
| **Liens utiles** | *Texte* + *Adresse*, pour les liens de fin (résultats, page de l'organisateur…). |

### Le champ « Contenu »

C'est un éditeur de texte, comme un traitement de texte allégé. Sélectionnez du
texte et une petite barre d'outils apparaît : **gras**, *italique*, lien, titre,
liste, citation, image.

Deux niveaux de titre sont disponibles. Pour un article, servez-vous du premier
pour les parties, du second seulement si une partie doit être redécoupée.

Le bouton **« + »** de cette barre d'outils insère des **blocs** au milieu du
texte : une galerie de photos, une vidéo, une série de questions-réponses, une
carte vers une autre page du site, un bouton, une planche de traité. C'est le
sujet de la section suivante.

Écrivez **normalement**. Le site s'occupe de trois choses à la publication :

- les **apostrophes** droites deviennent des apostrophes courbes (`l'` → « l’ ») ;
- l'**espace que vous tapez** devant un `?`, un `!` ou un `;` devient une espace
  fine insécable, et celle devant un `:` une espace insécable, de sorte que la
  ponctuation ne se retrouve jamais seule en début de ligne ;
- les espaces à l'intérieur des guillemets `« »` sont réglées de la même façon.

Deux choses qu'il ne fait **pas**, et qui vous restent :

- il n'**ajoute** pas d'espace là où vous n'en avez pas mis. « Vraiment? » reste
  « Vraiment? » ; tapez l'espace comme d'habitude, « Vraiment ? » ;
- il ne **fabrique pas** les guillemets français. Un `"` reste un `"`. Saisissez
  directement `«` et `»` (sur Linux : `AltGr` + `w` / `AltGr` + `x` ; sur Mac :
  `Alt` + `7` / `Alt` + `Maj` + `7`), ou demandez à Zaccharie.

---

## 6. Composer une page avec les blocs

Quatre textes du site se composent **librement** : vous écrivez vos paragraphes,
et vous glissez entre eux des blocs tout prêts, dans l'ordre que vous voulez.
Un peu de texte, une vidéo, une interview, encore du texte, une carte vers la
page de l'épée longue, une galerie de photos pour finir : la page suit votre
plan, pas l'inverse.

| Où | Le champ concerné |
| --- | --- |
| **Publier → Articles (actualités)** | *Contenu* |
| **L'école → Encadrants** | *Biographie* |
| **Enseignement → Armes & disciplines** | *Description longue (fiche arme)* |
| **Enseignement → Les sources (traités historiques)** | *Présentation* |

Les six blocs sont les mêmes dans les quatre champs. Ailleurs (réponse de la
foire aux questions, présentation d'un partenaire), le texte reste simple :
ce sont des textes courts, affichés dans un cadre où un carrousel de photos
n'aurait pas de sens.

> **Un mot de vocabulaire.** Dans les messages techniques du site (et dans la
> documentation de Zaccharie), ces blocs sont appelés des **widgets**. C'est le
> même objet, sous deux noms.

### Insérer un bloc

1. Placez le curseur sur une **ligne vide**, à l'endroit exact où le bloc doit
   apparaître.
2. Cliquez sur le **« + »** de la barre d'outils, ou tapez simplement `/`.
3. Choisissez le bloc dans la liste. Chaque entrée porte son nom et une phrase
   d'explication.
4. Le bloc s'installe dans un cadre, avec un bouton **« Edit »**. Cliquez
   dessus, remplissez les champs, puis **« Done »**.

Le cadre affiche ensuite un résumé de ce qu'il contient : « 6 photos ·
grille », « La leçon de garde · 04:12 », « Arme · epee-longue ». C'est votre
repère quand la page s'allonge.

> **Trois mots sont restés en anglais** dans cette version de l'éditeur :
> « Edit » (modifier), « Done » (terminé) et « Cancel » (annuler). Tout le
> reste, les noms des blocs et de leurs champs, est en français.

### Déplacer ou supprimer un bloc

L'éditeur n'a pas de poignée pour tirer un bloc à la souris. Cliquez sur son
cadre pour le sélectionner, puis :

- **le déplacer** : `Ctrl` + `X` pour le couper, placez le curseur sur une ligne
  vide ailleurs, `Ctrl` + `V` pour le coller. Il arrive complet, avec tout ce
  que vous aviez saisi ;
- **le supprimer** : la touche `Suppr` ou `Retour arrière`.

Sur Mac, `Cmd` remplace `Ctrl`.

### Les six blocs

| Bloc | Ce qu'il fait | À savoir |
| --- | --- | --- |
| **Galerie de photos** | Une série de photos, en *Grille* (toutes visibles) ou en *Carrousel* (une bande qui défile). Un clic ouvre la photo en grand. | Chaque photo demande sa **description**, comme partout ailleurs sur le site. Le *Crédit photo* reçoit le « © » automatiquement : réservez-le aux photos du club. Au-delà de six photos, préférez le carrousel. |
| **Vidéo** | Une vidéo lue directement sur la page, avec sa vignette et sa durée. | Mêmes champs que la vidéo d'une fiche d'encadrant. Une adresse YouTube ou Vimeo fonctionne, mais la vignette devient alors un simple lien qui fait quitter le site. Pensez au fichier de **sous-titres**. |
| **Questions-réponses** | Une suite de questions et de réponses, présentée comme le bloc « interview » d'une fiche d'encadrant. | Laissez une ligne vide dans une réponse pour faire deux paragraphes. Le *Titre du bloc* est libre : « L'interview », « Trois questions à Marie ». |
| **Renvoi vers une page du site** | Une carte cliquable vers une arme, un traité, un encadrant ou un article. | **Rien à déposer** : l'image, le titre et le sous-titre de la carte sont pris sur la page visée, et suivent ses modifications. Vous choisissez le type de page, puis son adresse dans une liste. Le *Titre de remplacement* est facultatif. |
| **Bouton** | Un bouton d'action, vers une page du site ou vers l'extérieur. | *Plein* pour l'action principale, *Contour* pour une action secondaire. Écrivez le texte normalement : les capitales sont posées à l'affichage. |
| **Planche seule** | Une image de traité, montrée entière, avec sa légende et sa ligne de crédit. | À ne pas confondre avec la galerie : voir l'avertissement plus bas. |

Dans la liste du « + », les blocs sont rangés par ordre alphabétique :
*Bouton*, *Galerie de photos*, *Planche seule*, *Questions-réponses*, *Renvoi
vers une page du site*, *Vidéo*.

### Un exemple complet

Voici une fiche d'encadrant composée de bout en bout. Chaque ligne est soit du
texte que vous tapez, soit un bloc que vous insérez :

1. **du texte** : deux paragraphes de présentation ;
2. un bloc **Vidéo** : l'extrait de son dernier tournoi ;
3. un bloc **Questions-réponses** : « Pourquoi l'épée longue ? », « Un conseil
   pour un débutant ? » ;
4. **du texte** : ce qu'elle enseigne au club ;
5. un bloc **Renvoi vers une page du site**, type *Une arme*, adresse
   `epee-longue` : la carte de l'épée longue apparaît, avec sa photo ;
6. un bloc **Renvoi vers une page du site**, type *Un traité de la
   bibliothèque*, adresse `talhoffer-1467` : la carte du manuscrit qu'elle
   travaille ;
7. **du texte** : une phrase de transition ;
8. un bloc **Galerie de photos** : huit photos de la salle, en carrousel.

Rien ne vous oblige à suivre cet ordre, et rien ne vous oblige à tout utiliser.
Une biographie de six lignes sans aucun bloc reste une biographie parfaitement
valable.

### Un bloc se pose entre deux paragraphes, jamais dedans

Un bloc occupe toute la largeur du texte. Il se pose **seul**, sur sa propre
ligne. L'éditeur vous laissera peut-être en glisser un à l'intérieur d'une
citation ou d'une puce de liste : le site ne saurait pas l'afficher là, et la
publication s'arrêtera en vous disant lequel. Sortez-le de son bloc (`Ctrl` +
`X`, puis `Ctrl` + `V` sur une ligne vide) et tout rentre dans l'ordre.

### ⚠️ Photo du club ou planche de bibliothèque : deux blocs, deux crédits

C'est la distinction à ne pas manquer, et c'est pour cela qu'il y a deux blocs
séparés plutôt qu'une case à cocher.

- **Galerie de photos** sert aux photos **du club**. Son champ *Crédit photo*
  attend le nom du photographe seul, et le site ajoute le « © » devant.
- **Planche seule** sert aux images de **traités numérisés par une
  bibliothèque**. Son champ s'appelle *Ligne de crédit de la bibliothèque*, et
  ce que vous y écrivez est affiché **mot pour mot** : aucun « © » ajouté,
  aucune ponctuation retouchée.

Cette ligne de crédit est exigée par la bibliothèque qui a numérisé l'ouvrage.
C'est elle qui donne au club le droit de publier l'image. Recopiez-la telle
quelle depuis la fiche du traité, sans en retirer un mot, y compris les
mentions qui semblent superflues comme « digitalisiert von Google ». Le § 11
détaille pourquoi.

Deux réflexes qui vous éviteront de vous tromper :

- **une planche déjà présente dans une fiche de traité se cite avec le bloc
  *Renvoi vers une page du site***, qui affiche la carte du traité et emmène le
  lecteur sur sa fiche. Ne la redéposez pas ;
- **dans le doute, appelez Zaccharie** avant de publier. Une ligne de crédit
  approximative met le club en faute.

### Ce que la publication refuse

Les blocs sont relus avant chaque mise en ligne. La publication s'arrête, en
nommant la fiche et le bloc fautif, si :

- une **photo de galerie** ou une **planche** n'a pas de description ;
- une **planche** n'a pas sa ligne de crédit ;
- un **renvoi** pointe vers une page qui n'existe pas, ou qui n'est pas publiée
  (arme retirée de la grille, encadrant masqué, article encore en brouillon) ;
- un **renvoi** n'a pas de page choisie ;
- un **bouton** n'a ni texte ni adresse ;
- un bloc est **imbriqué** dans une citation ou dans une liste.

Le message nomme le fichier, le champ et le rang du bloc, par exemple « 4ᵉ bloc
du texte ». Comptez depuis le haut du champ : un paragraphe, un titre, une
citation, une image et un bloc comptent chacun pour un.

---

## 7. Ajouter, masquer ou retirer un encadrant

**L'école → Encadrants**

### Ajouter

Bouton « + », puis :

| Champ | Quoi mettre |
| --- | --- |
| **Nom complet** | Prénom et nom. Sert aussi à l'adresse de la fiche. |
| **Prénom** | Affiché seul sur les cartes, sur téléphone. |
| **Affiché sur le site** | Coché par défaut. |
| **Mis en avant** | Carte agrandie sur l'accueil. Réservé au référent principal, un seul. |
| **Portrait** | La photo. *Description de l'image* obligatoire. |
| **Armes enseignées** | À choisir dans la liste des armes du club. Affichées au-dessus du nom sur l'accueil. |
| **Accroche** | Une ligne, 90 caractères maximum. Ex. « Rapière française & italienne · bolonaise ». |
| **Accroche dorée (palmarès)** | Décochée par défaut. Cochée, l'accroche s'écrit en lettres d'or, un reflet la traverse une fois à l'ouverture de la page, et la fiche prend quelques ornements dorés — le trait sous l'accroche, la ligne d'armes, le bouton du lien externe. **À réserver à un titre ou à un rang réel** (un classement, un podium) : si toutes les fiches sont dorées, plus aucune ne l'est. Rien d'autre ne change, et le texte reste exactement celui que vous avez écrit. |
| **Biographie** | Le corps de la fiche, affiché en pleine largeur sous le portrait. C'est un texte **à composition libre** (section 6) : titres, gras, italique, liens, listes, et les six blocs — galerie, vidéo, questions-réponses, renvoi, bouton, planche. |
| **Lien externe (facultatif)** | Profil HEMA Ratings, site personnel… |
| **Interview** | Une série de *Question* / *Réponse*. Le bloc reste invisible sur le site tant qu'aucune question n'est saisie. |
| **Vidéo (facultatif)** | *Titre affiché*, *Adresse du fichier vidéo*, *Durée*, *Vignette*, *Sous-titres*, *Image d'attente*, *Vidéo en haut de la fiche*. Invisible tant que l'adresse est vide. La vidéo est lue **sur la page**, pas dans un lecteur YouTube : c'est pourquoi on donne l'adresse du fichier `.mp4` déposé sur le stockage du club, et non un lien YouTube. Les **sous-titres** (fichier `.vtt`) sont à fournir dès qu'une vidéo est publiée : sans eux, personne ne peut suivre sans le son. Attention, ce fichier-là ne se dépose **pas** au même endroit que la vidéo : le champ attend un chemin qui commence par « / » (`/videos/interview-marie.fr.vtt`), pas une adresse complète. Envoyez le `.vtt` à Zaccharie, qui le met en place. Une adresse `https://…` serait acceptée par le formulaire mais les sous-titres ne s'afficheraient jamais, sans le moindre message. |
| ↳ **Vidéo en haut de la fiche** | Décochée par défaut. **Décochée**, la vidéo reste à l'emplacement pensé pour une interview : une vignette de taille moyenne, à côté du portrait. **Cochée**, elle monte juste sous le portrait et le nom, en grand, sur toute la largeur — c'est ce qu'il faut pour un extrait de combat ou un highlight de tournoi, qui se regardent et ne s'écoutent pas. Chaque encadrant choisit : la case ne concerne que sa fiche. |
| **Ordre d'affichage** | Le plus petit s'affiche en premier. Utilisez 10, 20, 30… pour pouvoir intercaler quelqu'un plus tard sans tout renuméroter. |

L'interview et la vidéo ne sont pas obligatoires. Une fiche sans elles est une
fiche complète, pas une fiche à trous : le site ne montre pas de cadre vide.

### Masquer plutôt que supprimer

Quelqu'un fait une pause, part un an, arrête d'encadrer sans quitter le club ?
**Décochez « Affiché sur le site »** et enregistrez. La fiche disparaît du site,
mais reste dans l'administration avec sa photo, sa bio et son interview. Le jour
où la personne revient, il suffit de recocher.

**Retirer n'est pas supprimer.** Le bouton « Supprimer » efface tout le travail
d'écriture. Gardez-le pour une fiche créée par erreur.

Bon à savoir : les titres du site se recalculent tout seuls. Si vous masquez un
encadrant, la phrase « Quatre encadrants… » de l'accueil se met à jour d'elle-même.
Vous n'avez aucun compte à corriger nulle part.

---

## 8. Changer une photo

La règle est la même partout : portrait d'encadrant, couverture d'article, album,
photo du lieu.

### Préparer le fichier

- **JPEG ou PNG.** Pas de HEIC (le format par défaut de certains iPhone), pas de
  fichier brut d'appareil photo. Sur iPhone : Réglages → Appareil photo →
  Formats → « Le plus compatible ».
- **2400 pixels maximum** sur le grand côté.
- **Moins de 1,5 Mo.**

Une photo dans un format que le site ne sait pas traiter bloque la publication,
avec un message qui nomme le fichier. Une photo simplement trop lourde passe,
mais elle ralentit le site pour les visiteurs en 4G, d'où les deux limites
ci-dessus. Si vous ne savez pas redimensionner une image, envoyez-la à
Zaccharie : c'est l'affaire de deux minutes.

### Déposer et décrire

Dans une fiche, cliquez sur le champ **Fichier** et choisissez la photo. Puis
remplissez les champs qui l'accompagnent :

- **Description de l'image** : voir ci-dessous, c'est le champ important.
- **Cadrage de la photo** : *Centre (par défaut)*, *Haut / visages*, *Bas*,
  *Gauche* ou *Droite*. Quelle partie garder si la photo doit être recadrée.
  Choisissez *Haut / visages* pour un portrait où l'on coupe des têtes.
- **Crédit photo (facultatif)** : le nom du photographe seul. Le « © » est
  ajouté automatiquement. Écrivez « Alexandre Vergne — L'IMAGINARIUM », pas
  « © Alexandre Vergne ».

> **Une exception, une seule** : les planches de traités numérisées par une
> bibliothèque. Leur champ ne s'appelle pas « Crédit photo » mais **« Ligne de
> crédit de la bibliothèque »** (planches des fiches de la rubrique *Les
> sources*, et planche de l'écran *Accueil · La rigueur*). Celle-là se recopie
> mot pour mot, telle que la bibliothèque l'exige : **aucun « © » n'y est
> ajouté**, aucune ponctuation n'est retouchée. Voir le § 11.

### Toujours remplir « Description de l'image »

C'est la seule chose vraiment obligatoire, et pour deux raisons.

D'abord les **personnes malvoyantes** : leur logiciel lit la page à voix haute,
et pour chaque photo il lit cette description. Sans elle, il annonce « image »
et passe. La visite est amputée.

Ensuite tout le monde : quand une photo ne charge pas (mauvais réseau, connexion
dans le train), c'est ce texte qui s'affiche à sa place.

Comment l'écrire : **décrivez ce que l'on voit**, en une phrase, comme à
quelqu'un au téléphone.

- Bien : « L'équipe alignée sur la piste du gymnase, masques sous le bras. »
- Bien : « Marie en garde haute à l'épée longue, de profil. »
- Inutile : « photo », « IMG_4821 », « photo du club ».

Décrivez, sans chercher à faire joli. Deux secondes d'écriture, et le site
reste utilisable par tout le monde.

> **Le site refuse de publier une photo sans description.** C'est un garde-fou
> volontaire : aucune image ne part en ligne muette.

---

## 9. Modifier les créneaux, le tarif, le lieu, le contact

**L'école → Lieu, contact, créneaux & tarifs**

C'est la fiche la plus utile du site, et celle qui mérite un mot d'explication.

### Une seule saisie, partout à jour

Le tarif, l'adresse, l'e-mail, le téléphone et les horaires ne sont saisis
**qu'ici**. Partout ailleurs (la page d'accueil, la foire aux questions, les
mentions légales, le pied de page), les textes contiennent des **raccourcis**
entre accolades, qui vont chercher la valeur dans cette fiche au moment de la
publication.

Un texte écrit ainsi dans l'administration :

> « L'adhésion est de {tarif} pour la saison {saison}. Les {essai} premières
> séances sont gratuites. On s'entraîne {creneaux} au {lieu}. »

s'affiche sur le site avec le tarif, la saison, le nombre de séances d'essai,
les horaires et le nom du gymnase, en toutes lettres.

**Conséquence pratique : le jour où le tarif change, vous le changez une seule
fois, ici.** La foire aux questions, l'accueil et les mentions légales se mettent
à jour d'eux-mêmes. Vous n'avez pas à chercher les endroits où le montant était
recopié : il n'y en a pas.

Les raccourcis disponibles :

`{email}` `{telephone}` `{lieu}` `{adresse}` `{ville}` `{tarif}` `{saison}`
`{creneaux}` `{creneaux_court}` `{essai}` `{nb_armes}` `{nb_profs}`

Quatre d'entre eux ne rendent pas ce qu'on imagine. Ils s'écrivent **en toutes
lettres**, pour se glisser au milieu d'une phrase :

| Raccourci | S'affiche aujourd'hui |
| --- | --- |
| `{essai}` | deux *(un nombre en lettres, pas « gratuites »)* |
| `{nb_armes}` / `{nb_profs}` | quatre / trois *(un nombre en lettres, recompté à chaque publication)* |
| `{tarif}` | 85 € *(le « € » est ajouté)* |
| `{creneaux_court}` | Mar · Jeu *(les heures ne s'ajoutent que si tous les cours ont le même horaire)* |

D'où la forme de l'exemple ci-dessus : on écrit « Les {essai} premières séances
sont gratuites », jamais « les deux premières séances sont {essai} ».

Deux de plus, réservés aux textes des fiches (*Textes des fiches arme & prof*) :
`{arme}` et `{prof}`, remplacés par le nom de l'arme et le prénom de l'encadrant
de la fiche en cours.

`{nb_armes}` et `{nb_profs}` sont **comptés** sur ce qui est réellement affiché.
C'est pour cela que « Quatre armes, quatre grammaires. » se recale tout seul le
jour où une carte apparaît ou disparaît.

Écrivez-les exactement comme ci-dessus : **en minuscules, sans espace à
l'intérieur des accolades**. `{Tarif}` ou `{ tarif }` ne fonctionnent pas, et la
publication vous le dira. Un raccourci mal orthographié serait affiché tel quel
aux visiteurs, d'où la vérification.

### Les créneaux

**Créneaux hebdomadaires** est une liste. Chaque ligne se déplie et contient :

| Champ | Quoi mettre |
| --- | --- |
| **Jour** | À choisir dans la liste. |
| **Début** / **Fin** | Au format `18:00`. Deux chiffres, deux points, deux chiffres. |
| **Armes travaillées** | À choisir dans la liste des armes. |
| **Intitulé libre** | Ex. « Pratique libre ». S'affiche **à la place** de la liste d'armes. |
| **Niveau** | *Tous niveaux*, *Débutants*, *Confirmés* ou *Sans encadrant*. C'est le **libellé affiché** dans la colonne « Niveau » du tableau des créneaux, rien de plus. Il ne remplace pas la case ci-dessous. |
| **Séance encadrée** | **La case qui compte.** Cochée par défaut ; décochée, le créneau est annoncé comme pratique libre partout ailleurs sur le site : la phrase des horaires sur l'accueil, dans la foire aux questions et dans les mentions légales, et le rappel court du bandeau d'accueil. |

Pour une pratique libre, **décochez toujours les deux ensemble** : *Niveau →
Sans encadrant* **et** *Séance encadrée* décochée. Avec l'un sans l'autre, le
tableau et le reste du site se contredisent.

Les lignes se réordonnent en les faisant glisser par la poignée à gauche.
Pour supprimer un créneau qui n'existe plus, la petite croix à droite de la
ligne.

### Le tarif et l'essai

Dans **Adhésion & tarifs** : le montant en euros (un nombre, sans le « € »), la
saison, le lien HelloAsso, et la liste de l'équipement à se procurer soi-même.

Dans **Séances d'essai** : le nombre de séances offertes, et si le matériel est
prêté pendant l'essai.

### Le contact

Dans **Contact** : l'e-mail et le téléphone du club. Ce sont les **seuls**
affichés sur tout le site, mentions légales comprises, d'où l'importance de ne
pas y mettre un numéro personnel.

**Directeur / directrice de publication** est une obligation légale : la personne
nommée dans les mentions légales. Ses coordonnées personnelles n'apparaissent pas
sur le site, seulement son nom et sa fonction.

---

## 10. Les photos du gymnase (à faire à la rentrée)

Il n'y a pas de carte sur le site : pas de plan Google, pas de tuiles chargées
depuis l'extérieur. C'est un choix, et c'est ce qui permet au site de ne poser
aucun cookie et de n'avoir aucun bandeau de consentement.

À la place, deux champs attendent des photos, dans
**L'école → Lieu, contact, créneaux & tarifs → Lieu d'entraînement** :

**Photo du lieu** : une photo de l'**entrée du gymnase**, prise de la rue, pour
qu'un nouveau la reconnaisse en arrivant. En largeur (paysage) de préférence :
elle s'affiche en bandeau. Sa *Description de l'image* est obligatoire, par
exemple « L'entrée vitrée du gymnase Robert Pras, depuis la rue ».

**Photos de l'intérieur** : la salle, le plancher, les vestiaires, les masques
alignés au mur. Elles s'ouvrent dans une visionneuse quand on clique sur la photo
du lieu. Chacune a sa description.

Tant que la photo du lieu n'est pas déposée, le bloc « Lieu & contact » du site
s'affiche en version courte : adresse, contact, bouton « Itinéraire ». Pas de
cadre vide, pas de rectangle gris. Le site n'a pas l'air inachevé, mais il sera
nettement plus accueillant avec les photos.

**Idée pour la rentrée** : cinq minutes avec un téléphone avant la première
séance. Une photo de l'entrée depuis le trottoir, deux ou trois de la salle
vide plutôt que pendant l'entraînement : pas de question d'autorisation à
demander.

---

## 11. Les sources : traités et planches

**Enseignement → Les sources (traités historiques)**

C'est la partie « mini-bibliothèque » du site : les traités d'escrime anciens sur
lesquels le club travaille, avec leurs planches gravées, leur bibliothèque de
conservation et leur licence.

### ⚠️ Ne jamais modifier une ligne de crédit, où qu'elle soit

Ces lignes se trouvent à **deux** endroits, et la règle y est la même :

- le champ **Crédit de la planche** de chaque planche d'une fiche de traité ;
- le champ **Ligne de crédit de la bibliothèque** de la planche de l'écran
  **L'école → Accueil du site → La rigueur**, qui s'affiche sur la page
  d'accueil et n'appartient à aucune fiche de traité.

C'est une ligne du genre :

> Hans Talhoffer, Fechtbuch von 1467, fol. 2r — Munich, Bayerische
> Staatsbibliothek, Cod.icon. 394 a (urn:nbn:de:bvb:12-bsb00020451-7).
> Numérisation Bayerische Staatsbibliothek / MDZ — Public Domain Mark 1.0.

Cette ligne est **exigée par la bibliothèque** qui a numérisé l'ouvrage. C'est
elle, et elle seule, qui donne au club le droit de publier l'image. Elle a été
rédigée mot pour mot d'après les conditions de chaque institution, et vérifiée
deux fois. La cote, le folio, ce code `urn:` illisible : tout y est utile.

**Ne la raccourcissez pas, ne la reformulez pas, n'en retirez aucun mot.**

Certaines mentions ont particulièrement l'air superflues et ne le sont pas. Sur
la fiche de Marozzo (*Opera Nova*), le crédit contient la mention « digitalisiert
von Google » : elle est **imposée** par la bibliothèque de Munich pour les
volumes numérisés avec Google, et la retirer met le club en faute. Sur la fiche
du manuscrit **I.33**, le crédit doit conserver son lien vers la licence CC BY
4.0 **et** sa mention des modifications apportées à l'image : c'est la licence
elle-même qui l'exige.

Si une ligne de crédit vous paraît fausse ou mal orthographiée, ne la corrigez
pas : **signalez-le à Zaccharie**. Elle est peut-être exacte, simplement écrite
dans la langue de la bibliothèque.

### ⚠️ Réutiliser une planche ailleurs que sur le site

Quatre des huit traités **interdisent l'usage commercial** de leurs planches :
Marozzo (*Opera Nova*, statut « No Copyright – Non-Commercial Use Only » de
Munich) et les trois numérisations de la BnF (Sainct-Didier, Fabris, La noble
science), dont les conditions de Gallica ne libèrent que la réutilisation non
commerciale.

Sur le site du club, aucun problème : c'est exactement l'usage prévu. **En
dehors** (support imprimé vendu, tee-shirt, affiche, flyer d'un stage payant,
publication sponsorisée), **demandez avant**.

Talhoffer, Lecküchner et Paulus Kal (Public Domain Mark 1.0) et I.33 (CC BY 4.0)
n'ont pas cette limite : les trois premiers sont libres de toute restriction, le
quatrième demande seulement de garder le crédit, le lien vers la licence et la
mention des modifications.

Le doute se lève en dix secondes : ouvrez la fiche du traité sur le site, le
bloc « Licence » dit ce qui est permis.

Le site refuse de publier une planche sans description **ou** sans crédit,
volontairement : c'est le seul moyen fiable de ne jamais mettre le club en
défaut.

### Ce que vous pouvez modifier tranquillement

Tout le reste, et notamment :

- **Présentation** : trois à six phrases sur la tradition du traité, ce qu'il
  contient et pourquoi il parle aux armes du club. C'est le texte le plus utile
  de la fiche, et celui que vous êtes le mieux placés pour écrire. Restez sur
  ce que la source dit : pas d'enjolivement historique.
- **Légende** d'une planche : ce qu'elle représente, et ce qu'elle apprend.
  Décrivez ce que l'on voit.
- **Description de la planche** : la description lue à voix haute par les
  lecteurs d'écran, comme pour les photos.
- **Armes concernées** : les disciplines qui travaillent ce traité. La fiche du
  traité remonte alors automatiquement sur la fiche de chacune de ces armes
  **qui a une fiche publique**. L'épée-bocle est sélectionnable pour documenter
  le rattachement, mais elle n'a pas de fiche : le traité n'y remonte nulle part.
- **Planche majestueuse** : la case à cocher sur la plus belle planche du
  traité. C'est celle qui sera affichée en grand.
- **Ordre d'affichage** : même principe que pour les encadrants. Attention, ce
  champ fait deux choses : il range les cartes de la bibliothèque, **et** il
  désigne le traité mis en avant sur les fiches arme, celui qui porte le plus
  petit numéro parmi les traités rattachés à cette arme.

### Une planche déposée ici s'affiche à plusieurs endroits

C'est le point à retenir avant de changer une image. La fiche d'une arme montre
**un seul** traité dans son encadré « La source » : celui qui porte le **plus
petit Ordre d'affichage** parmi les traités rattachés à cette arme. Et c'est la
planche majestueuse de **celui-là seulement** qui y ressort, avec sa description
et sa ligne de crédit. Vous n'avez donc rien à déposer dans la fiche de l'arme :
le champ image n'y existe plus, volontairement. Une image et son crédit ne se
séparent jamais : si l'on pouvait déposer une gravure quelconque à côté du crédit
d'un traité, on afficherait une fausse attribution sans s'en apercevoir.

Deux conséquences pratiques :

- **Changer la planche majestueuse du traité mis en avant change aussi l'image
  de la fiche arme.** C'est voulu, et c'est sans risque : le crédit suit l'image.
- Sur les autres traités rattachés à la même arme, changer la planche majestueuse
  ne touche à rien d'autre qu'à leur propre fiche et à leur carte dans la
  bibliothèque. Pour changer l'image d'une fiche arme, c'est donc l'**Ordre
  d'affichage** qu'il faut regarder d'abord.

### Les extraits de texte

Le champ **Court extrait du traité (facultatif)** accepte **quelques lignes
seulement**, dans la langue d'origine (moyen français, allemand ancien). C'est
du droit de courte citation : quelques lignes, oui ; un chapitre entier, non.

Deux champs vont avec, et sont obligatoires dès qu'un extrait est saisi :
**Crédit de l'extrait** (qui a établi le texte, par exemple « Transcription
ARDAMHE, hébergée par la FFAMHE ») et **Lien vers la page de l'extrait**.

Et une interdiction franche : **jamais de traduction moderne** dont le club n'a
pas les droits, même trouvée en ligne, même sur un site associatif. Une
transcription du texte ancien n'est pas une traduction : la première se cite
brièvement en créditant son auteur, la seconde demande une autorisation écrite.
En cas de doute, demandez avant de publier.

### Ajouter un traité

C'est faisable (bouton « + »), mais cela demande d'aller lire les conditions
d'utilisation de la bibliothèque qui conserve l'ouvrage, et de composer la ligne
de crédit exacte que cette bibliothèque exige. Les huit fiches existantes ont
demandé un travail de vérification sérieux.

**Le réflexe raisonnable : signalez le traité à Zaccharie**, qui prépare la fiche
et les crédits. Vous écrivez ensuite la présentation et les légendes, c'est-à-dire
la partie intéressante.

---

## 12. Quand la modification apparaît sur le site

Chaque clic sur **Enregistrer** enregistre votre travail. Le site public, lui,
est reconstruit à partir de ce contenu, et cette reconstruction prend un moment.

**Aujourd'hui, la reconstruction est manuelle.** Votre modification est bien
enregistrée, mais elle n'apparaît sur le site public que lorsque Zaccharie lance
la mise en ligne. Prévenez-le quand vous avez publié quelque chose qui doit
partir vite, une séance annulée par exemple.

**À terme** (prévu, pas encore branché) : la reconstruction se
déclenchera toute seule à chaque enregistrement, et il faudra compter **deux à
trois minutes** entre votre clic sur « Enregistrer » et l'affichage sur le site.

Si votre modification n'apparaît pas :

**Aujourd'hui**, aucune attente ne sert à rien. Tant que la mise en ligne n'a pas
été lancée à la main, la modification n'apparaîtra pas, même au bout d'une heure.
Un seul réflexe est utile : **rechargez la page en vidant le cache** (`Ctrl` +
`Maj` + `R` sur Windows et Linux, `Cmd` + `Maj` + `R` sur Mac) une fois que
Zaccharie vous a dit avoir publié : le navigateur garde souvent l'ancienne
version en mémoire, et c'est la cause la plus fréquente du « pourtant j'ai bien
enregistré ». Si c'est urgent, ne guettez pas le site : prévenez-le tout de
suite.

**À terme**, quand la reconstruction se déclenchera toute seule :

1. Attendez trois minutes.
2. Rechargez la page en vidant le cache.
3. Si rien ne change au bout de dix minutes, prévenez Zaccharie.

---

## 13. Si une modification est refusée

Le site sait se protéger, à deux moments.

**En enregistrant** : l'administration refuse un champ obligatoire laissé vide,
un titre trop long, un horaire mal écrit. Le champ fautif se souligne en rouge
sur place, avec la correction attendue.

**À la publication** : des garde-fous relisent l'ensemble du contenu avant de
reconstruire le site. S'ils trouvent un problème, la publication s'arrête et le
site public garde sa version précédente. Rien n'est cassé en ligne, mais votre
modification attend d'être corrigée.

**Ce message est écrit en clair, en français.** Il dit trois choses : ce qui
cloche, où, et quoi faire. Par exemple :

```
  1. Image sans description alternative — articles_clermont › tournoi-de-lyon › photos[2]
    Fichier : /src/assets/photos/clermont/podium.jpg
    Remplir « Description de l'image » dans l'admin : elle est lue par les lecteurs d'écran.
```

La marche à suivre, à chaque fois, est la même :

1. **Lire le message en entier**, y compris les lignes en retrait.
2. Repérer la fiche nommée (ici l'article « tournoi de Lyon »). Le dernier
   morceau après le « › » est le nom du champ : c'est lui qui vous dit *quelle*
   photo, ici la deuxième de la galerie de l'article.
3. Corriger ce qui est demandé (ici : remplir la description de la photo).
4. Enregistrer à nouveau.

**Quand le message parle d'un bloc**, il nomme le fichier, le champ et le rang
du bloc dans le texte :

```
  2. Renvoi cassé — src/content/commun/disciplines/epee-longue.mdoc › Description longue (fiche arme) › 4ᵉ bloc du texte
    La carte pointe vers « talhofer-1467 », qui n'existe pas parmi les traités.
    Pages disponibles : fabris-1606, i33, leckuchner-cgm582, …
    Rouvrir le widget et choisir la page dans la liste déroulante.
```

Ouvrez la fiche nommée (ici l'arme « épée longue »), allez au champ nommé, et
comptez les blocs depuis le haut : un paragraphe, un titre, une citation, une
image et un bloc inséré comptent chacun pour un.

Les refus les plus courants, et leur remède :

| Le message parle de… | Ce qu'il faut faire |
| --- | --- |
| une image sans description alternative | remplir *Description de l'image* sur la photo nommée |
| deux annonces épinglées en bandeau | décocher *Épingler en bandeau* sur l'ancienne |
| un raccourci inconnu ou mal orthographié | corriger l'orthographe entre les accolades (minuscules, sans espace) |
| une image dans un format non pris en charge | réenregistrer la photo en JPEG et la redéposer |
| une planche sans crédit, ou une licence sans adresse | ne pas improviser : appeler Zaccharie |
| un renvoi cassé, ou vers une page non publiée | rouvrir le bloc et rechoisir la page, ou publier la page visée (§ 6) |
| un renvoi sans destination | choisir une page dans la liste déroulante du bloc, ou le supprimer |
| un bouton incomplet | remplir *Texte du bouton* et *Adresse*, ou supprimer le bloc |
| un widget mal placé | sortir le bloc de la citation ou de la liste (`Ctrl` + `X`, puis `Ctrl` + `V` sur une ligne vide) |
| un widget inconnu | appeler Zaccharie : le fichier a été modifié à la main |

(« Widget » est l'autre nom d'un bloc, voir le § 6.)

Rien n'est perdu pendant ce temps : votre texte est toujours là, dans le
formulaire.

---

## 14. Qui appeler

**Zaccharie** s'occupe de la partie technique du site. Pour le joindre, passez
par l'adresse de l'association, **amhe63.dfda@gmail.com**, ou par la messagerie
du club. C'est volontairement la seule adresse citée ici : ce guide vit dans un
dépôt public, on n'y écrit pas de coordonnées personnelles.

Appelez-le sans hésiter dans ces cas :

- un message d'erreur que vous ne comprenez pas, ou qui revient après correction ;
- une photo qui ne veut pas se déposer, ou trop lourde à préparer ;
- **tout ce qui touche aux lignes de crédit des planches de traités** ;
- une modification urgente à mettre en ligne (annulation de séance) ;
- l'ajout d'un nouveau traité, d'une nouvelle arme, d'une nouvelle rubrique ;
- l'arrivée d'un nouvel encadrant à qui donner l'accès à l'administration.

Et l'inverse est vrai aussi : vous n'avez besoin de personne pour écrire un
article, corriger une faute, changer un horaire, masquer une fiche. C'est fait
pour ça.

---

## 15. Petits réflexes qui font gagner du temps

- **Enregistrez souvent.** Un formulaire ouvert deux heures dans un onglet, c'est
  une déconnexion qui vous attend.
- **Rédigez d'abord, publiez ensuite.** Le statut *Brouillon* existe pour ça.
- **Une photo, une description.** Prenez l'habitude : le champ juste après le
  fichier, toujours rempli. Vous n'aurez jamais d'erreur de publication.
- **Décochez plutôt que supprimer.** *Affiché sur le site* pour les encadrants et
  les albums : vous gardez le travail d'écriture.
- **Un bloc se pose sur une ligne vide**, jamais à l'intérieur d'une citation ou
  d'une puce. Pour le déplacer : `Ctrl` + `X`, puis `Ctrl` + `V` là où il doit
  aller (§ 6).
- **Ordre d'affichage par dizaines** : 10, 20, 30. Pour intercaler quelqu'un
  plus tard sans tout renuméroter.
- **N'écrivez jamais deux fois la même information.** Tarif, horaires, adresse,
  contact : ils sont dans la fiche de l'école, et un raccourci les rappelle
  partout. Si vous vous surprenez à recopier un montant à la main, c'est le
  signe qu'il fallait un `{tarif}`.
- **Tapez normalement.** Apostrophes et espaces avant les `? ! ; :` : le site
  s'en occupe à la publication. En revanche il ne fabrique pas les guillemets
  français : saisissez `«` et `»` vous-même (§ 5).
- **En cas de doute sur les droits d'une image ou d'un texte, ne publiez pas.**
  Demandez. Un jour d'attente ne coûte rien ; une image publiée sans droit, si.

---

*Documentation technique du site : [`README.md`](README.md) et
[`docs/refonte/`](docs/refonte/), ce n'est pas la peine de les lire pour
utiliser l'administration.*
