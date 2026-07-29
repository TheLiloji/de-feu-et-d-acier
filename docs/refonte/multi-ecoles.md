# Architecture multi-écoles — étude et recommandation

> **Statut :** proposition d'architecture, à valider par le chef de projet.
> **Contexte :** refonte complète du site *De Feu et d'Acier* (AMHE, section USAM
> Clermont-Ferrand, affiliée FFAMHE). Une école aujourd'hui, peut-être Lyon demain.
> **Périmètre :** ce document tranche l'organisation du contenu, des URLs et du
> déploiement. Il ne traite pas du design (voir la maquette) ni du détail du schéma
> CMS champ par champ.

---

## 1. Recommandation en une page

**Option retenue : A — monosite, contenu structuré par école dès maintenant, une
seule route aujourd'hui.**

Le site d'aujourd'hui est identique à ce qu'il serait sans aucune réflexion
multi-écoles : une page unique sur `/`, une navigation à ancres, un admin où le prof
voit « Les profs », « Créneaux », « Actualités ». Le mot « école » n'apparaît nulle
part, ni côté visiteur, ni côté CMS.

Ce qui change sous le capot, et qui ne coûte rien à faire maintenant :

1. Le contenu propre à Clermont vit dans `src/content/ecoles/clermont/`, pas à la racine.
2. Un fichier `src/config/ecoles.ts` liste les écoles. Il en contient une.
3. Les collections Keystatic sont **générées** à partir de cette liste.
4. Les composants reçoivent l'école en props, ils ne lisent jamais le contenu directement.
5. Les liens internes passent par un helper `lien(ecole, '#creneaux')`.

Le jour où Lyon ouvre : **une ligne ajoutée dans `src/config/ecoles.ts`**, le dossier
`ecoles/lyon/` créé depuis l'admin, une route `/lyon/` qui apparaît toute seule, un
sélecteur d'école affiché dans la nav parce qu'il y a désormais plus d'une école.
Aucun fichier Clermont déplacé, aucune URL cassée, aucune migration de données.

Estimation du jour J : **une demi-journée de code** (sélecteur d'école, page index des
écoles, ajustements SEO) et le temps de saisie du contenu lyonnais par ses profs.

Les deux autres options ne sont pas moins chères aujourd'hui — elles sont plus chères
**tout de suite** (option B) ou plus chères au moment où on en a le plus besoin
(option C, qui divise le référencement au lancement de Lyon, exactement quand Lyon a
besoin d'être trouvée).

---

## 2. Poser le vrai problème

La question « un site ou plusieurs sites ? » est un piège : elle se décide en dix
minutes le jour venu, avec un fichier de redirections. La question coûteuse est
ailleurs.

**Le coût d'une ouverture d'école ne vient pas du déploiement. Il vient de l'endroit
où passe la frontière entre « ce qui appartient à l'association » et « ce qui
appartient à une salle ».** Si cette frontière n'existe pas dans le modèle de contenu,
l'ouverture de Lyon impose de la tracer *a posteriori*, à travers treize sections déjà
remplies, déjà éditées par un prof, déjà indexées par Google. C'est ça, la refonte
qu'on veut éviter.

Le scaffold actuel (branche `feat/astro-keystatic`) illustre exactement le piège :
treize **singletons** Keystatic, `hero`, `profs`, `rejoindre`, `tournois`, `galerie`…
Un singleton est par définition unique. On ne peut pas le dupliquer par école : il faut
changer son type, déplacer son fichier, réécrire le composant qui le consomme, et
reconstruire l'admin. Treize fois. Le travail proposé ici consiste, pour l'essentiel, à
choisir la bonne granularité **avant** de saisir le contenu, pas à ajouter de la
machinerie.

### Effet de bord favorable : ça corrige des bugs de contenu existants

L'audit de contenu (`CONTENU-SITE.md`, « Notes & incohérences ») relève que le site en
ligne affiche **deux adresses de contact différentes** selon la section : le prof a mis
à jour `amhe63.dfda@gmail.com` dans « Nous rejoindre », mais la FAQ, le footer et les
mentions légales servent toujours `c.sillac@protonmail.com`. Ce n'est pas une faute
d'inattention, c'est une conséquence du modèle : le contact est saisi à quatre endroits
indépendants.

Dans le modèle par école, le contact est un champ de la fiche école, injecté partout.
Le bug devient structurellement impossible. Même remarque pour l'adresse du gymnase,
les horaires (répétés dans « Nous rejoindre », la FAQ et les mentions légales) et le
tarif d'adhésion. **La modélisation par école est d'abord une amélioration pour
aujourd'hui ; le multi-écoles en est le bénéfice secondaire.**

---

## 3. Cartographie du contenu : qu'est-ce qui appartient à qui ?

C'est le travail préalable à toute décision d'architecture. Sans lui, les trois options
se valent ; avec lui, une seule tient.

### 3.1 Contenu de l'association (écrit une fois, servi partout)

| Contenu | Pourquoi commun |
| --- | --- |
| Identité, logo, typographie, ton | La marque est associative, pas locale |
| **La rigueur / manifeste** | Philosophie AMHE (sources, traités, tenue moderne). Vrai partout |
| **Catalogue des disciplines** | Le texte sur l'épée longue de Liechtenauer est du savoir AMHE, pas du Clermont |
| **Partenaires** | FFAMHE, Faits d'Armes, Black Armoury : relations associatives |
| **FAQ générique** | « C'est dangereux ? », « à quoi ressemble une séance ? », « faut-il faire du sport ? » |
| RGPD, confidentialité | Même politique pour tout le site |
| Structure du footer | Mêmes rubriques |

### 3.2 Contenu d'une école (dupliqué à chaque ouverture)

| Contenu | Valeur Clermont |
| --- | --- |
| Nom, slug, ville, département | Clermont-Ferrand, 63 |
| Lieu, adresse, photos du lieu, itinéraire | Gymnase Robert Pras, 3 rue Jean Monnet |
| Contact e-mail + téléphone | `amhe63.dfda@gmail.com` · 06 61 28 65 11 |
| **Créneaux** | Mar 18h-20h, Jeu 18h-20h (libre), Jeu 20h-22h |
| **Tarif + lien d'adhésion** | 85 €/an · lien HelloAsso USAM Clermont |
| **Profs** | Marie Poignant, Gabriel Tardio, Ludwig Fort |
| Disciplines *enseignées ici* | Sélection dans le catalogue commun (4 des 5) |
| Galerie photo | Photos de la salle |
| Tournois, résultats, HEMA Ratings | Fiche club HEMA Ratings n° 1155 |
| Réseaux sociaux | Page Facebook 63AMHE |
| Affiliation locale, structure porteuse | Section de l'USAM Clermont |
| Mentions légales locales | Directrice de publication, siège |
| **FAQ locale** | « Quels créneaux et quel lieu ? », « combien coûte l'adhésion ? » |

Ces deux dernières lignes méritent un mot : dans le contenu actuel, deux questions de
la FAQ sont en réalité des questions locales déguisées en questions générales. Elles
répètent horaires, adresse et tarif. Elles doivent descendre au niveau de l'école,
sinon Lyon héritera des horaires de Clermont dans sa propre FAQ.

### 3.3 Contenu à portée variable

| Contenu | Traitement proposé |
| --- | --- |
| **Articles / actualités** | Rattachés à une école par défaut. Une actu associative reste possible plus tard |
| **Annonces / bandeau flash** | Rattaché à l'école. Presque toujours local (« salle fermée jeudi ») |

Le besoin d'une annonce à l'échelle de l'association (« assemblée générale ») est
hypothétique et se règle plus tard par un bandeau commun qui s'empile au-dessus. Le
modéliser aujourd'hui serait payer pour un cas qui n'existe pas.

---

## 4. Les trois options

### Option A — Monosite, contenu structuré par école

Un dépôt, un projet Cloudflare Pages, un domaine. Le contenu est rangé par école dans
le dépôt. Astro génère une page par école au build. Aujourd'hui : une seule école, donc
une seule page, servie sur `/`.

**CMS (prof non technique).** C'est le point décisif, et il se joue sur un détail
d'implémentation : les collections Keystatic sont **générées** à partir de la liste des
écoles, au lieu d'être écrites en dur avec un champ « école » à remplir.

```ts
// src/config/ecoles.ts — source de vérité unique
export const ECOLES = [
  { slug: 'clermont', nom: 'Clermont-Ferrand', ville: 'Clermont-Ferrand',
    principale: true },
] as const;
export const MULTI = ECOLES.length > 1;
```

```ts
// keystatic.config.ts — les collections se déplient depuis ECOLES
const parEcole = (e) => ({
  [`profs_${e.slug}`]: collection({
    // Une seule école : le prof lit « Les profs », comme aujourd'hui.
    // Deux écoles : il lit « Profs — Clermont-Ferrand ».
    label: MULTI ? `Profs — ${e.nom}` : 'Les profs',
    path: `src/content/ecoles/${e.slug}/profs/*`,
    slugField: 'name',
    schema: { /* nom, spécialité, bio, photo, lien HEMA Ratings… */ },
  }),
  [`news_${e.slug}`]: collection({
    label: MULTI ? `Actualités — ${e.nom}` : 'Actualités',
    path: `src/content/ecoles/${e.slug}/news/*`,
    /* … */
  }),
});
```

Conséquence : **l'école n'est jamais un champ à remplir, c'est le dossier**. Le prof
n'a pas à choisir « Clermont » dans une liste déroulante à un seul choix, ni à se
demander ce que ça veut dire. Et le jour J, les entrées de Clermont sont déjà au bon
endroit — aucune donnée à migrer, aucun champ à rétro-remplir.

La navigation de l'admin suit la même logique : aujourd'hui elle est plate
(« Accueil / Sections / Pied de page »), le jour J elle se regroupe par école.

> Alternative écartée : une collection plate `profs` avec un champ
> `fields.relationship({ collection: 'ecoles' })`. Elle impose au prof un champ de plus
> dès aujourd'hui, et la doc Keystatic prévient que la relation stocke un *slug* et se
> casse si le slug change. Le dossier est plus robuste. À noter aussi que Keystatic ne
> documente pas l'usage de deux `*` dans un même `path` : ne pas bâtir l'architecture
> sur `ecoles/*/profs/*`, préférer des chemins concrets générés en TypeScript, comme
> ci-dessus.

**SEO.** Un seul domaine, une seule autorité. Les backlinks existants (FFAMHE, USAM
Clermont, HEMA Ratings, Facebook) alimentent le domaine entier. Quand `/lyon/`
apparaît, elle démarre sur un domaine déjà connu de Google plutôt que sur un domaine
neuf. Les requêtes cibles sont géographiques et disjointes (« AMHE Clermont-Ferrand »
contre « AMHE Lyon ») : aucune cannibalisation entre les deux pages. Un `sitemap.xml`
unique. Un balisage `SportsClub` schema.org par école, avec adresse, géolocalisation et
`openingHoursSpecification` alimenté directement par les créneaux du CMS — très
rentable pour une association locale, et quasi gratuit ici puisque la donnée est déjà
structurée par école.

**URLs.** `dfda-amhe.fr/` pour Clermont, `dfda-amhe.fr/lyon/` ensuite. Clermont garde
`/` : c'est l'école historique, celle qui porte l'antériorité de référencement et vers
laquelle pointent les liens existants. Aucune redirection le jour J.

**Coûts Cloudflare.** Un projet Pages. Chaque sauvegarde dans l'admin produit un commit
donc un build ; le plan gratuit en autorise 500 par mois, une association en consomme
quelques dizaines. Aucun coût.

**Navigation.** Aujourd'hui : rigoureusement la nav actuelle, à ancres, sur une page
unique. Demain : un sélecteur d'école discret apparaît dans la barre, les ancres restent
locales à la page de l'école consultée, le footer gagne une colonne « Nos écoles ».

**Migration 1 → 2.** Voir le §7. Résumé : une ligne de configuration, du contenu à
saisir, une demi-journée de code pour le sélecteur et la page d'index des écoles.

---

### Option B — Multi-déploiements (monorepo, un projet Pages par école)

Un dépôt contenant un paquet `theme` partagé et un site par école, chacun déployé sur
son propre projet Cloudflare Pages.

**CMS.** C'est là que l'option casse. Keystatic en mode GitHub a besoin de routes
serveur (`/keystatic`, `/api/keystatic`) et d'une GitHub App dont l'URL de callback est
liée à un domaine. Deux issues, aucune bonne :

- **Un admin par école.** Deux URLs d'admin, deux GitHub Apps, deux jeux de secrets à
  maintenir. Le prof de Clermont qui veut corriger la FAQ commune doit savoir dans
  lequel des deux admins elle vit. Rédhibitoire pour un utilisateur non technique.
- **Un admin central.** Il édite un dépôt unique dont les deux projets Pages tirent
  leur contenu. Autrement dit : on a construit l'organisation de contenu de l'option A,
  et on a ajouté par-dessus la complexité de déploiement de l'option B. On paie deux
  fois.

**SEO.** Dépend du domaine choisi, pas de l'architecture. Si les deux projets servent
des sous-dossiers d'un même domaine, il faut un routage par hôte — ce qu'un site
statique ne sait pas faire sans Worker dédié. En pratique, B pousse vers des domaines
ou sous-domaines séparés, avec les inconvénients de l'option C.

**Coûts Cloudflare.** Rien à payer, mais des frictions réelles : le quota de 500 builds
mensuels est **par compte**, pas par projet, donc les builds s'additionnent ; le plan
gratuit n'autorise **qu'un build simultané**, donc les builds font la queue ; et surtout
toute modification du thème partagé déclenche un rebuild de *chaque* projet. Avec deux
écoles c'est tolérable, avec quatre c'est pénible. La limite de 100 projets par compte
n'est pas contraignante ici.

**Navigation.** Les liens entre écoles deviennent des liens externes. Une barre de
navigation partagée doit être synchronisée entre les déploiements : à chaque ajout
d'école, il faut rebâtir tous les autres sites pour que le menu se mette à jour.

**Migration 1 → 2.** Sortir le thème dans un paquet, créer un second site, créer un
second projet Pages, une seconde GitHub App, un second jeu de secrets, un second
pipeline. C'est exactement la refonte qu'on cherche à éviter.

**Quand B serait le bon choix :** si Lyon devenait une association juridiquement
distincte, avec sa propre identité visuelle, ses propres statuts et une gouvernance
séparée. Ce n'est pas l'hypothèse posée — voir les questions ouvertes.

---

### Option C — Vitrine commune + sous-pages ou sous-domaines par école

Une page d'accueil associative qui présente le réseau, puis une entrée par école.

Il faut immédiatement séparer les deux variantes, car elles ne sont pas de même nature :

- **C sous-dossiers** (`dfda-amhe.fr/clermont/`) : c'est l'option A avec une page
  d'accueil différente. Ce n'est pas une architecture concurrente, c'est un choix
  éditorial pris sur la même base technique.
- **C sous-domaines** (`clermont.dfda-amhe.fr`) : techniquement, c'est l'option B. Un
  projet Cloudflare Pages ne peut pas servir des contenus différents selon l'hôte sans
  Worker de réécriture, donc chaque sous-domaine devient un projet à part, avec toutes
  les conséquences décrites plus haut.

**Ce que C apporte réellement**, une fois cette confusion levée : la question de savoir
si `/` est une page d'accueil associative ou la page de Clermont.

**SEO — le point qui tranche.** Aujourd'hui, `/` cible « AMHE Clermont-Ferrand ». C'est
la page qui reçoit les liens de la FFAMHE, de l'USAM, de HEMA Ratings et de Facebook.
La transformer en vitrine associative généraliste revient à retirer sa page d'atterrissage
à la seule école qui existe, au profit d'une page qui ne répond à aucune requête
concrète (personne ne cherche « De Feu et d'Acier réseau »). Sur les sous-domaines, le
problème s'aggrave : Google les traite largement comme des entités distinctes, et une
association jeune, avec un faible capital de liens, ne peut pas se permettre de le
diviser en deux au moment précis où elle lance une nouvelle salle.

**CMS.** Une strate de contenu supplémentaire à gérer (la vitrine) pour un contenu que
personne ne lira tant qu'il n'y a qu'une école.

**Coûts Cloudflare.** Nuls dans les deux variantes : le plan gratuit accepte 100
domaines personnalisés par projet, donc les sous-domaines ne se facturent pas. Le coût
de C n'est pas financier, il est éditorial et de référencement.

**Navigation.** Une vitrine impose un clic supplémentaire avant d'atteindre l'information
utile (créneaux, adresse, tarif) — un clic payé par 100 % des visiteurs pour servir une
structure qui, aujourd'hui, n'existe pas.

**Migration 1 → 2.** Si la vitrine est construite dès aujourd'hui, le jour J est
trivial mais on a payé pendant des mois. Si elle est construite le jour J en déplaçant
Clermont de `/` vers `/clermont/`, il faut une redirection 301 et accepter une période
de ré-indexation.

**Verdict :** C n'est pas une troisième architecture, c'est une décision d'URL prise
au-dessus de A ou de B. Et cette décision peut se prendre plus tard sans rien casser
(voir « portes de sortie », §8).

---

## 5. Grille comparative

Note de 1 (mauvais) à 5 (bon), du point de vue du projet tel qu'il est posé.

| Critère | A — Monosite structuré | B — Multi-déploiements | C — Vitrine + sous-domaines |
| --- | :---: | :---: | :---: |
| Simplicité CMS pour un prof non technique | **5** | 1 | 3 |
| Complexité ajoutée aujourd'hui (5 = aucune) | **5** | 2 | 3 |
| SEO au lancement de la 2ᵉ école | **5** | 2 | 2 |
| Préservation du référencement de Clermont | **5** | 3 | 2 |
| Coût Cloudflare | 5 | 4 | 5 |
| Charge d'exploitation (secrets, pipelines) | **5** | 2 | 2 |
| Navigation entre écoles | **5** | 2 | 4 |
| Effort du jour J | **4** | 1 | 3 |
| Autonomie éditoriale d'une école | 3 | **5** | 4 |
| Adapté si une école devient une entité séparée | 2 | **5** | 4 |

Les deux derniers critères sont les seuls où A perd, et ils dépendent tous deux d'une
même hypothèse : que Lyon soit une structure autonome plutôt qu'une salle de la même
association. Cette hypothèse est la question à trancher (§9).

---

## 6. L'option A en détail

### 6.1 Ce que voit le visiteur aujourd'hui

Rien de nouveau. `dfda-amhe.fr` sert la page unique de Clermont-Ferrand : hero,
disciplines, profs, club, rigueur, créneaux et adhésion, tournois, galerie, FAQ,
partenaires, footer. La nav est à ancres. Aucun sélecteur d'école, aucun fil
d'Ariane, aucune mention d'un réseau. Une seule URL indexable.

### 6.2 Ce que voit le prof dans l'admin aujourd'hui

```
De Feu et d'Acier
├── Accueil          → Hero · Bandeau d'annonce · Actualités
├── L'école          → Le club · Créneaux & adhésion · Lieu & contact · Tournois · Galerie
├── Les profs        → [+ Ajouter]  Marie Poignant · Gabriel Tardio · Ludwig Fort
├── L'association    → La rigueur · Disciplines · Partenaires · FAQ
└── Légal            → Pied de page · Mentions légales · RGPD
```

Zéro occurrence du mot « école » au sens multi-sites. « Les profs » est une vraie
collection avec un bouton *Ajouter* et un bouton *Supprimer* — le besoin explicitement
formulé par le client.

### 6.3 Arborescence des fichiers

```
src/
├── config/
│   └── ecoles.ts                  ← source de vérité (1 entrée aujourd'hui)
├── content/
│   ├── commun/                    ← contenu associatif
│   │   ├── identite.json
│   │   ├── rigueur.json
│   │   ├── partenaires/*.json     ← collection
│   │   ├── disciplines/*.json     ← collection (catalogue AMHE)
│   │   ├── faq/*.json             ← collection (questions générales)
│   │   ├── footer.json
│   │   └── rgpd.json
│   └── ecoles/
│       └── clermont/
│           ├── ecole.json         ← identité, lieu, contact, créneaux, tarif,
│           │                        disciplines enseignées, annonce, légal local
│           ├── profs/*.json       ← collection
│           ├── news/*.json        ← collection
│           ├── faq/*.json         ← collection (questions locales)
│           └── galerie.json
├── lib/
│   ├── ecoles.ts                  ← getEcole(slug), getEcoles(), getEcolePrincipale()
│   └── liens.ts                   ← lien(ecole, '#creneaux')
└── pages/
    └── index.astro                ← rend l'école principale
```

Noter l'absence de `src/pages/[ecole]/`. La route dynamique n'est **pas** créée
aujourd'hui : elle est ajoutée le jour J (fichier de quinze lignes, §7 étape 3). Une
route dynamique dont `getStaticPaths()` renvoie un tableau vide a déjà provoqué une
régression dans Astro — [issue #12891](https://github.com/withastro/astro/issues/12891),
corrigée depuis, où la route vide capturait *toutes* les URLs. Le correctif est en
place, mais il n'y a aucune raison de dépendre d'un comportement limite : ce qui doit
être prêt d'avance, c'est l'organisation du contenu et les helpers, pas un fichier
trivial.

### 6.4 Routage Astro

```astro
---
// src/pages/index.astro — aujourd'hui : Clermont sur la racine
import PageEcole from '../layouts/PageEcole.astro';
import { getEcolePrincipale } from '../lib/ecoles';
const ecole = await getEcolePrincipale();
---
<PageEcole ecole={ecole} racine />
```

Et le fichier ajouté le jour J, pas avant :

```astro
---
// src/pages/[ecole]/index.astro — les écoles secondaires (créé le jour J)
import PageEcole from '../../layouts/PageEcole.astro';
import { getEcoles, getEcolePrincipale } from '../../lib/ecoles';

export async function getStaticPaths() {
  const principale = await getEcolePrincipale();
  const autres = (await getEcoles()).filter((e) => e.slug !== principale.slug);
  return autres.map((ecole) => ({ params: { ecole: ecole.slug }, props: { ecole } }));
}
const { ecole } = Astro.props;
---
<PageEcole ecole={ecole} />
```

`PageEcole.astro` est le seul gabarit de page : il assemble les composants en leur
passant `ecole` et le contenu commun. Les composants ne lisent jamais le contenu
eux-mêmes. C'est la règle qui rend le jour J indolore.

### 6.5 Les liens internes

```ts
// src/lib/liens.ts
import { ECOLES } from '../config/ecoles';

/** '#creneaux' aujourd'hui ; '/lyon/#creneaux' quand Lyon existe. */
export function lien(ecole: Ecole, ancre: string) {
  const base = ecole.principale ? '' : `/${ecole.slug}`;
  return ancre.startsWith('#') ? `${base}/${ancre}`.replace('//', '/') : `${base}${ancre}`;
}
```

Aucun `href="#creneaux"` écrit en dur dans un composant. C'est le seul point de
discipline à tenir pendant la construction, et il ne coûte rien puisqu'on écrit le
code de toute façon.

### 6.6 Les cinq invariants à respecter pendant la refonte

1. **Aucun singleton pour du contenu d'école.** Tout ce qui figure au §3.2 vit sous
   `src/content/ecoles/<slug>/`.
2. **`src/config/ecoles.ts` est la seule source de vérité.** Il pilote les collections
   Keystatic, la navigation de l'admin, les routes Astro et l'affichage du sélecteur.
3. **Les composants reçoivent `ecole` en props.** Jamais d'import direct de JSON dans
   un composant.
4. **Les accès au contenu passent par `getEcole()` / `getEcoles()`.** Signatures
   multi-écoles dès le premier jour, appelées avec une seule école.
5. **Tous les liens internes passent par `lien()`.**

Ces cinq points ne représentent pas du travail en plus : ils représentent le *même*
travail, écrit dans le bon ordre.

---

## 7. Jour J : Lyon ouvre

Séquence exacte, dans l'ordre.

### Étape 1 — Déclarer l'école (2 minutes, développeur)

```ts
export const ECOLES = [
  { slug: 'clermont', nom: 'Clermont-Ferrand', ville: 'Clermont-Ferrand', principale: true },
  { slug: 'lyon',     nom: 'Lyon',             ville: 'Lyon',             principale: false },
] as const;
```

Effets automatiques dès le commit :
- Keystatic déplie les collections `profs_lyon`, `news_lyon`, `faq_lyon` et la fiche `ecole_lyon`.
- La navigation de l'admin se regroupe par école, les libellés passent de « Les profs »
  à « Profs — Clermont-Ferrand » / « Profs — Lyon ».
- `MULTI` devient `true`, ce qui active le sélecteur d'école dans la nav publique.
- La route `/lyon/` se génère dès que le fichier de route est ajouté (étape 3).

**Rien de ce qui concerne Clermont ne bouge.** Fichiers inchangés, URL inchangée,
référencement inchangé.

### Étape 2 — Saisir le contenu lyonnais (les profs de Lyon, dans l'admin)

Fiche école (lieu, contact, créneaux, tarif, lien HelloAsso, disciplines enseignées
choisies dans le catalogue commun), profs, photos, FAQ locale. Aucune intervention de
développeur. Prévoir de dupliquer la fiche Clermont comme point de départ pour ne pas
partir d'un formulaire vide.

### Étape 3 — Code du jour J (une demi-journée)

| Tâche | Détail |
| --- | --- |
| Créer `src/pages/[ecole]/index.astro` | ~15 lignes, gabarit fourni au §6.4 |
| Sélecteur d'école dans la nav | Affiché seulement si `MULTI`. Composant nouveau, ~40 lignes |
| Colonne « Nos écoles » au footer | Boucle sur `ECOLES` |
| Page `/ecoles/` | Liste des salles, carte, liens. Utile pour les requêtes de marque |
| Balisage `SportsClub` par école | Le gabarit existe déjà, il boucle simplement |
| `sitemap.xml` | Automatique si le sitemap est généré depuis les routes |
| Bandeau « nouvelle école » | Optionnel, sur la page Clermont, pendant un mois |

### Étape 4 — Contrôles avant mise en ligne

- `/` sert toujours Clermont, contenu identique, `<link rel="canonical">` inchangé.
- `/lyon/` répond, ses ancres fonctionnent, ses cartes et itinéraires pointent sur Lyon.
- Aucun contact, horaire ou tarif clermontois n'apparaît sur la page lyonnaise
  (le piège classique : une valeur restée en dur dans un composant).
- Le sélecteur d'école est visible sur les deux pages.
- Search Console : soumettre le sitemap mis à jour.

### Étape 5 — Cloudflare

**Rien à faire.** Même projet `dfda-amhe`, même domaine, même GitHub App Keystatic,
mêmes secrets, même pipeline. Le build produit simplement une page de plus.

C'est le point à retenir : dans l'option A, le jour J n'a pas de volet infrastructure.

---

## 8. Portes de sortie

Une architecture ne se juge pas seulement sur le chemin nominal, mais sur son coût de
sortie si l'hypothèse de départ s'avère fausse.

**Si l'association veut à terme une vraie vitrine sur `/` et la parité entre écoles**
(scénario C) : on crée `/clermont/`, on fait de `/` la vitrine, et on ajoute deux
lignes dans `public/_redirects` pour rediriger en 301 les anciennes ancres. Le capital
de référencement se transfère par la redirection permanente. Coût : une demi-journée,
plus quelques semaines de ré-indexation. Décision réversible, à prendre quand Lyon aura
prouvé qu'elle tient.

**Si Lyon devient juridiquement autonome et veut son propre site** (scénario B) : son
contenu est déjà isolé dans `src/content/ecoles/lyon/`. On extrait le dossier, on
pointe un nouveau projet Pages dessus, et on redirige `/lyon/` vers le nouveau domaine.
Le contenu associatif commun reste dupliqué une fois, ce qui est acceptable pour une
séparation. Coût : un ou deux jours.

**Si le nombre d'écoles explose** (peu probable) : l'option A absorbe N écoles sans
changement structurel ; seule l'ergonomie de l'admin demanderait une revue au-delà de
cinq ou six.

Aucune de ces sorties n'est bloquée par la recommandation. C'est ce qui la rend sûre :
elle ne parie pas, elle retarde le pari jusqu'au moment où l'information sera
disponible.

---

## 9. Risques identifiés

### R1 — Keystatic n'a pas de gestion de droits par école *(le plus sérieux)*

En mode GitHub, les droits d'édition sont des droits sur le dépôt. Il n'existe pas de
rôle « prof de Lyon, ne peut modifier que Lyon ». Toute personne ayant accès à l'admin
peut éditer le contenu de toutes les écoles, et le contenu associatif commun.

Pour une association où les responsables se connaissent, c'est acceptable, et
l'historique Git permet d'annuler n'importe quelle modification. À signaler explicitement
au client plutôt qu'à découvrir le jour d'un incident. Si cela devenait bloquant, les
recours sont un flux par branches et validations (lourd pour un non-technicien) ou un
changement de CMS (Sanity, Payload) — ce serait une refonte du CMS, pas du site, et
l'organisation du contenu proposée ici resterait valable.

### R2 — Les slugs d'école sont définitifs

`clermont` et `lyon` apparaissent dans les chemins de fichiers et dans les URLs. Les
changer casserait les liens. Les choisir sobrement, en minuscules sans accent, et ne
plus y toucher.

### R3 — Le contenu commun se remplit de clermontismes

Tant qu'il n'y a qu'une école, rien n'empêche d'écrire « à Clermont » dans un texte
rangé au niveau associatif. Le jour J, ces phrases apparaîtront sur la page de Lyon.
Parade : une relecture ciblée du contenu commun le jour J (une heure), et une
convention de rédaction pendant la saisie initiale.

### R4 — Ancres en dur

Le risque technique principal du jour J. Il disparaît si l'invariant n° 5 est tenu
(§6.6). Une vérification automatisée simple — interdire `href="#` en dur dans les
composants — le supprime complètement.

### R5 — Un build par sauvegarde

Chaque enregistrement dans l'admin déclenche un build (~1 à 2 minutes avant que le
changement soit visible). Le plan gratuit n'autorise qu'un build simultané : deux profs
qui sauvegardent en même temps verront le second build attendre. Sans gravité, mais à
expliquer au client pour éviter le « j'ai enregistré et je ne vois rien ».

---

## 10. Questions à trancher par le chef de projet

1. **Statut juridique d'une future école.** Lyon serait-elle une salle de la même
   section associative, ou une structure distincte avec ses propres statuts, sa propre
   affiliation FFAMHE et son propre compte HelloAsso ? C'est la seule question capable
   de renverser la recommandation : dans le second cas, l'option B redevient légitime.
   *Réponse attendue avant de figer le schéma CMS.*

2. **Le nom de domaine `dfda-amhe` est-il acquis ?** Le site vit aujourd'hui sur
   `dfda-pages.pages.dev`. Confirmer l'extension retenue (`.fr` ?) et prévoir les
   redirections depuis l'ancienne adresse. Cette décision est indépendante de
   l'architecture mais conditionne le calendrier.

3. **Clermont conserve-t-elle la racine `/` ?** La recommandation dit oui, pour
   préserver son référencement. Le client peut préférer, symboliquement, que l'accueil
   soit associatif. Si oui, le dire maintenant : c'est gratuit avant le lancement,
   payant après.

4. **Qui aura accès à l'admin, et faut-il une séparation des droits ?** Voir R1. Si le
   client exige que Lyon ne puisse pas modifier Clermont, il faut le savoir avant de
   confirmer Keystatic.

5. **Un prof peut-il enseigner dans deux écoles ?** Le modèle par dossier duplique alors
   sa fiche. Si le cas est prévu, une collection `profs` associative avec rattachement
   multiple est possible, au prix d'un champ supplémentaire dans l'admin dès aujourd'hui.
   *Recommandation : ne pas payer maintenant, dupliquer le jour venu.*

6. **Faut-il un flux d'actualités associatif** (toutes écoles confondues) ou les actus
   restent-elles locales ? La recommandation part sur du local ; l'ajout d'un flux
   commun reste possible plus tard.

7. **Incohérences de contenu à arbitrer avant saisie** (relevées dans `CONTENU-SITE.md`) :
   quelle adresse de contact fait foi (`amhe63.dfda@gmail.com` ou
   `c.sillac@protonmail.com`) ? Le titre « Cinq armes » doit-il redescendre à quatre, ou
   l'épée-bocle revenir dans le catalogue ? Ces arbitrages conditionnent le contenu
   initial, pas l'architecture, mais ils bloquent la saisie.

---

## 11. Ce qui est décidé si cette étude est validée

- Option **A** : un dépôt, un projet Cloudflare Pages `dfda-amhe`, un domaine.
- Contenu séparé en deux niveaux dès le premier commit : `commun/` et `ecoles/clermont/`.
- Keystatic conservé, avec des collections **générées** depuis `src/config/ecoles.ts`.
- Clermont sur `/`, écoles suivantes sur `/<slug>/`.
- Aucun élément d'interface multi-écoles tant qu'il n'y a qu'une école.
- Les cinq invariants du §6.6 sont des règles de revue de code pour toute la refonte.
