# Modèle de contenu — De Feu et d'Acier (Keystatic)

> Document de conception. Il définit **ce que le CMS contient**, **qui édite quoi**, et
> **comment le contenu se rattache à une école**. Le rendu (routes, composants, images
> optimisées) est traité dans le document d'architecture ; ici on ne fixe que l'interface :
> le schéma Keystatic et les fichiers produits.
>
> Cible technique : `@keystatic/core` 0.5.x (API vérifiée dans `node_modules`), stockage
> git (`local` en dev, `github` en prod), lecture par `@keystatic/core/reader` côté Astro.

---

## 1. Principes de conception

Six règles qui expliquent chaque choix de schéma ci-dessous.

1. **Une information, un seul endroit.** Le mail, le téléphone, l'adresse, le tarif et les
   créneaux ne sont saisis **qu'une fois**, dans la fiche de l'école. La FAQ, le pied de
   page, les mentions légales et le bloc « Venir essayer » les *réutilisent*. C'est ce qui
   corrige définitivement l'incohérence n°1 du contenu actuel (deux contacts différents
   selon la section).
2. **Champs structurés plutôt que markdown/HTML brut.** Un créneau, ce n'est pas un
   tableau markdown : c'est `jour` + `heureDebut` + `heureFin` + `armes` + `niveau`. Le
   HTML n'apparaît nulle part dans le CMS (le modèle actuel demande au prof d'écrire
   `<strong>` à la main : supprimé).
3. **Texte riche seulement là où c'est nécessaire.** Trois niveaux :
   - `fields.text` (une ligne ou multiligne) pour la très grande majorité des champs ;
   - `fields.markdoc.inline` pour une phrase qui a besoin de **gras**, d'*italique* ou d'un
     lien (les « lede » de sections, les titres des blocs tarif) — éditeur WYSIWYG, une
     seule ligne de contenu, stockable dans un YAML ;
   - `fields.markdoc` pour un vrai corps d'article (paragraphes, listes, images, liens).
     Un seul par fichier, déclaré en `format.contentField`.
4. **Labels en français, clés sans accent.** Le prof ne voit que les labels ; les clés
   (`titre`, `corps`, `ecole`) restent lisibles dans les diffs git.
5. **Retirer ≠ supprimer.** Chaque contenu « qui va et vient » (prof, arme, partenaire,
   photo) a une case **« Affiché sur le site »**. Un prof qui part se décoche ; on ne perd
   pas sa fiche, et on peut la remettre en un clic. La suppression reste possible.
6. **Multi-écoles dès maintenant, invisible tant qu'il n'y en a qu'une.** Le champ « École »
   existe partout où il faut, mais il est **facultatif** : vide = école principale. Tant
   que le réglage `multiEcoles` est décoché, l'admin et le site se comportent comme un
   site mono-école. Voir §3.

### Ce qui n'est PAS dans le CMS

Numéros de section (`01`, `02`…), libellés d'interface (« LE MINI-COURS », « GLISSER »,
« RETOUR »), la mosaïque de la galerie (spans CSS), les libellés de la tab bar mobile :
ce sont des éléments de gabarit, ils vivent dans les composants. Le modèle actuel les
expose (`eyebrowNumber`, `col`/`row` de la galerie, `switchToRgpd`…) : c'est du bruit pour
l'éditeur et une source de casse visuelle. On les retire.

---

## 2. Conventions communes

### 2.1 Emplacements

| Quoi | Où |
| --- | --- |
| Config | `keystatic.config.ts` (racine) |
| Entrées de collection | `src/content/<collection>/<slug>.yaml` ou `.mdoc` |
| Singletons | `src/content/<nom>.yaml` |
| Images | `public/images/<domaine>/` → servies en `/images/<domaine>/…` |

Format de données : **YAML partout** (`format: { data: 'yaml' }`). Plus lisible que JSON
en diff git, et un chef qui regarde le repo comprend ce qu'il lit. Les entrées à corps
long sont en `.mdoc` avec frontmatter YAML.

### 2.2 Helpers de schéma (à mettre en haut du fichier de config)

```ts
import { config, fields, collection, singleton } from '@keystatic/core';

/** Image stockée dans public/images/<dossier>/ */
const image = (label: string, dossier: string) =>
  fields.image({
    label,
    directory: `public/images/${dossier}`,
    publicPath: `/images/${dossier}/`,
  });

/** Cadrage : remplace l'ancien champ « point focal 50% 40% », incompréhensible. */
const cadrage = fields.select({
  label: 'Cadrage de la photo',
  description: 'Quelle partie de la photo garder si elle est recadrée.',
  options: [
    { label: 'Centre (par défaut)', value: 'centre' },
    { label: 'Haut / visages', value: 'haut' },
    { label: 'Bas', value: 'bas' },
    { label: 'Gauche', value: 'gauche' },
    { label: 'Droite', value: 'droite' },
  ],
  defaultValue: 'centre',
});

/** Photo = fichier + description alternative + cadrage. */
const photo = (label: string, dossier: string) =>
  fields.object(
    {
      fichier: image('Fichier', dossier),
      alt: fields.text({
        label: 'Description de l’image',
        description: 'Lue à voix haute par les lecteurs d’écran. Ex. « L’équipe sur la piste ».',
      }),
      cadrage,
    },
    { label },
  );

/** Bouton / lien : libellé + destination. */
const lien = (label: string) =>
  fields.object(
    {
      libelle: fields.text({ label: 'Texte du bouton' }),
      url: fields.url({ label: 'Adresse (https://…, mailto:, tel:)' }),
    },
    { label },
  );

/** Rattachement à une école (facultatif : vide = école principale / toutes). */
const ecole = fields.relationship({
  label: 'École',
  collection: 'ecoles',
  description: 'Laisser vide tant qu’il n’y a qu’une école.',
});

const ecolesConcernees = fields.multiRelationship({
  label: 'Écoles concernées',
  collection: 'ecoles',
  description: 'Laisser vide = visible pour toutes les écoles.',
});

/** Affiché / masqué, sans suppression. */
const visible = fields.checkbox({ label: 'Affiché sur le site', defaultValue: true });

/** Ordre d'affichage. Convention : 10, 20, 30… pour pouvoir intercaler. */
const ordre = fields.integer({
  label: 'Ordre d’affichage',
  description: 'Le plus petit s’affiche en premier. Utiliser 10, 20, 30… pour pouvoir intercaler.',
  defaultValue: 100,
});
```

### 2.3 Raccourcis de texte (tokens)

Pour éviter de recopier — et de désynchroniser — le tarif ou le contact dans la FAQ, les
champs texte acceptent des **raccourcis** remplacés à la génération du site par les valeurs
de l'école affichée. Ils sont rappelés dans la `description` de chaque champ concerné.

| Raccourci | Remplacé par | Exemple de rendu |
| --- | --- | --- |
| `{email}` | Mail de l'école | amhe63.dfda@gmail.com |
| `{telephone}` | Téléphone de l'école | 06 61 28 65 11 |
| `{lieu}` | Nom du lieu | Gymnase Robert Pras |
| `{adresse}` | Adresse complète | 3 rue Jean Monnet · 63100 Clermont-Ferrand |
| `{ville}` | Ville | Clermont-Ferrand |
| `{tarif}` | Montant de l'adhésion | 85 € |
| `{saison}` | Saison en cours | 2025-2026 |
| `{creneaux}` | Créneaux en une phrase | mardi de 18h à 20h et jeudi de 20h à 22h, plus la pratique libre le jeudi de 18h à 20h |
| `{creneaux_court}` | Jours de cours, et l'horaire s'il est le même partout | Mar · Jeu |
| `{essai}` | Nombre de séances d'essai offertes, en lettres | deux |
| `{nb_armes}` | Nombre d'armes affichées, en lettres | quatre |
| `{nb_profs}` | Nombre d'encadrants affichés, en lettres | trois |
| `{arme}` / `{prof}` | Nom de la fiche courante (bandeaux CTA) | l'épée longue / Gabriel |

Un raccourci inconnu est laissé tel quel et signalé dans le journal de build (garde-fou
contre les fautes de frappe).

---

## 3. Multi-écoles : le mécanisme

### 3.1 Trois portées de contenu

| Portée | Signification | Contenus |
| --- | --- | --- |
| **Local** | Appartient à une école, n'a pas de sens sans elle | créneaux, lieu, contact, tarifs, itinéraire, carte |
| **Partagé** | Appartient à l'association, identique partout | disciplines, articles, partenaires, FAQ, mentions légales, textes de marque |
| **Partagé + surcharge** | Valeur commune, qu'une école peut remplacer | photo d'en-tête, phrase d'accueil, description du club |

### 3.2 Comment c'est implémenté

1. **Une collection `ecoles`.** Une entrée = une implantation (Clermont-Ferrand,
   plus tard Lyon). Elle porte **tout le local** : adresse, contact, créneaux, tarifs,
   carte, réseaux, plus d'éventuelles surcharges (photo hero, phrase d'accueil).
   → Ouvrir une école = créer une entrée et cocher « Active ». Zéro code.
2. **Un champ `ecole` (relationship) sur le contenu attaché à un lieu** : profs, photos de
   galerie, annonces locales. Facultatif : **vide = école principale**.
3. **Un champ `ecolesConcernees` (multiRelationship) sur le contenu partagé** qui pourrait
   ne pas l'être : disciplines (une arme peut n'être enseignée qu'à Lyon), partenaires,
   FAQ. Vide = toutes.
4. **Un interrupteur dans `reglages`** : `multiEcoles` (case à cocher) + `ecolePrincipale`
   (relationship). Décoché → le site est mono-école : `/` affiche l'école principale, pas
   de sélecteur, pas de pages `/ecoles/…`. Coché → le sélecteur d'école apparaît et
   chaque école active obtient sa page.

### 3.3 Conséquence sur les routes (rappel, détaillé côté architecture)

| Route | Portée | Source |
| --- | --- | --- |
| `/` | École principale (ou choix si `multiEcoles`) | singletons + `ecoles` |
| `/ecoles/<slug>/` | Une école (créée seulement si `multiEcoles`) | `ecoles` |
| `/armes/<slug>/` | Partagé | `disciplines` |
| `/profs/<slug>/` | Partagé (fiche indique son école) | `profs` |
| `/actualites/` et `/actualites/<slug>/` | Partagé | `articles` + `annonces` |
| `/faq/`, `/galerie/`, `/mentions-legales/` | Partagé | collections + `legal` |

**Règle de non-régression** : aucune section du site ne lit une adresse, un horaire ou un
tarif ailleurs que dans une entrée `ecoles`. Si cette règle est tenue, ouvrir Lyon ne
demande aucune modification de gabarit.

---

## 4. Collections

Vue d'ensemble :

| Clé | Label admin | Chemin | Slug | Portée | Volume attendu |
| --- | --- | --- | --- | --- | --- |
| `ecoles` | Écoles | `src/content/ecoles/*` | nom | — | 1 → 3 |
| `annonces` | Annonces (messages courts) | `src/content/annonces/*` | titre | locale ou globale | 0 → 5 actives |
| `articles` | Articles (actus / blog) | `src/content/articles/*` | titre | partagée | 10 → 100 |
| `profs` | Encadrants | `src/content/profs/*` | nom | locale | 3 → 10 |
| `disciplines` | Armes & disciplines | `src/content/disciplines/*` | nom | partagée (+ écoles) | 4 → 8 |
| `partenaires` | Partenaires | `src/content/partenaires/*` | nom | partagée (+ écoles) | 3 → 10 |
| `faq` | Questions fréquentes | `src/content/faq/*` | question | partagée (+ écoles) | 8 → 25 |
| `galerie` | Albums photo | `src/content/galerie/*` | titre | partagée (+ école) | 1 → 15 |

---

### 4.1 `ecoles` — Écoles

**Rôle.** La fiche d'une implantation : tout ce qui change quand on ouvre ailleurs.
C'est la **source unique** du lieu, du contact, des créneaux et du tarif.

| Champ | Label | Type | Notes |
| --- | --- | --- | --- |
| `nom` | Nom de l'école | `slug` | « Clermont-Ferrand » → `clermont-ferrand` |
| `statut` | Statut | `select` | active / ouverture prochaine / archivée |
| `ville` | Ville | `text` | sert au hero (« à Clermont-Ferrand ») |
| `presentation` | Phrase de présentation | `markdoc.inline` | facultatif, surcharge le texte du club |
| `lieu.nom` | Nom du lieu | `text` | Gymnase Robert Pras |
| `lieu.adresse` | Adresse | `text` | 3 rue Jean Monnet |
| `lieu.codePostal` / `lieu.ville` | CP / Ville | `text` | 63100 / Clermont-Ferrand |
| `lieu.itineraire` | Lien « Itinéraire » | `url` | Google Maps |
| `lieu.photo` | Photo du lieu | `object(fichier,alt,cadrage)` | l'entrée du gymnase ; vide ⇒ bloc compact, sans cadre |
| `lieu.photosInterieur` | Photos de l'intérieur | `array(object(fichier,alt))` | visionneuse ouverte au clic sur la photo du lieu |
| `contact.email` | E-mail | `text` (pattern mail) | **le** mail affiché partout |
| `contact.telephone` | Téléphone | `text` | format affiché ; le `tel:` est déduit |
| `contact.responsable` | Responsable | `text` | Clémence Sillac (mentions légales) |
| `contact.fonction` | Fonction | `text` | Présidente de section |
| `adhesion.montant` | Montant annuel (€) | `integer` | 85 → `{tarif}` |
| `adhesion.saison` | Saison | `text` | 2025-2026 → `{saison}` |
| `adhesion.lienInscription` | Lien d'adhésion | `url` | HelloAsso |
| `adhesion.aPrevoir` | À se procurer | `array(text)` | « un masque d'escrime », « des gants coqués » |
| `essai.seancesOffertes` | Séances d'essai offertes | `integer` | 2 |
| `essai.materielPrete` | Matériel prêté | `checkbox` | alimente « matériel prêté » |
| `creneaux` | Créneaux hebdomadaires | `array(object)` | voir ci-dessous |
| `reseaux` | Réseaux | `object` | facebook, instagram, hemaRatings, helloAsso |
| `affiliation.club` | Club support | `text` | USAM Clermont-Ferrand |
| `affiliation.federation` | Fédération | `text` | FFAMHE |
| `photoHero` | Photo d'en-tête (surcharge) | `photo` | vide = photo commune |
| `ordre` | Ordre | `integer` | ordre dans le sélecteur |

Créneau (élément du tableau `creneaux`) : `jour` (select lun→dim), `heureDebut`,
`heureFin` (`text` pattern `HH:MM`), `armes` (`multiRelationship` → `disciplines`),
`intitule` (`text`, prioritaire sur `armes` — sert à « Pratique libre »), `niveau`
(select : tous niveaux / débutants / confirmés / sans encadrant), `encadre` (checkbox).

```ts
ecoles: collection({
  label: 'Écoles',
  path: 'src/content/ecoles/*',
  slugField: 'nom',
  format: { data: 'yaml' },
  columns: ['nom', 'statut'],
  schema: {
    nom: fields.slug({ name: { label: 'Nom de l’école', validation: { isRequired: true } } }),
    statut: fields.select({
      label: 'Statut',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Ouverture prochaine', value: 'bientot' },
        { label: 'Archivée', value: 'archivee' },
      ],
      defaultValue: 'active',
    }),
    ville: fields.text({ label: 'Ville' }),
    presentation: fields.markdoc.inline({
      label: 'Phrase de présentation (facultatif)',
      description: 'Laisser vide pour utiliser le texte commun de la section « Le club ».',
    }),
    lieu: fields.object({
      nom: fields.text({ label: 'Nom du lieu' }),
      adresse: fields.text({ label: 'Adresse (rue)' }),
      codePostal: fields.text({ label: 'Code postal' }),
      ville: fields.text({ label: 'Ville' }),
      itineraire: fields.url({ label: 'Lien « Itinéraire » (Google Maps)' }),
      carte: fields.url({ label: 'Carte à intégrer (OpenStreetMap)' }),
    }, { label: 'Lieu d’entraînement' }),
    contact: fields.object({
      email: fields.text({ label: 'E-mail', validation: { pattern: { regex: /.+@.+\..+/, message: 'Adresse e-mail invalide' } } }),
      telephone: fields.text({ label: 'Téléphone', description: 'Format affiché, ex. 06 61 28 65 11' }),
      responsable: fields.text({ label: 'Responsable (mentions légales)' }),
      fonction: fields.text({ label: 'Fonction', defaultValue: 'Présidente de section' }),
    }, { label: 'Contact' }),
    adhesion: fields.object({
      montant: fields.integer({ label: 'Adhésion annuelle (€)', defaultValue: 85 }),
      saison: fields.text({ label: 'Saison', defaultValue: '2025-2026' }),
      lienInscription: fields.url({ label: 'Lien d’adhésion (HelloAsso)' }),
      aPrevoir: fields.array(fields.text({ label: 'Équipement' }), {
        label: 'À se procurer soi-même',
        itemLabel: (p) => p.value || 'Équipement',
      }),
    }, { label: 'Adhésion & tarifs' }),
    essai: fields.object({
      seancesOffertes: fields.integer({ label: 'Séances d’essai offertes', defaultValue: 2 }),
      materielPrete: fields.checkbox({ label: 'Matériel prêté pour l’essai', defaultValue: true }),
    }, { label: 'Séances d’essai' }),
    creneaux: fields.array(
      fields.object({
        jour: fields.select({
          label: 'Jour',
          options: [
            { label: 'Lundi', value: 'lundi' }, { label: 'Mardi', value: 'mardi' },
            { label: 'Mercredi', value: 'mercredi' }, { label: 'Jeudi', value: 'jeudi' },
            { label: 'Vendredi', value: 'vendredi' }, { label: 'Samedi', value: 'samedi' },
            { label: 'Dimanche', value: 'dimanche' },
          ],
          defaultValue: 'mardi',
        }),
        heureDebut: fields.text({ label: 'Début', defaultValue: '18:00', validation: { pattern: { regex: /^\d{2}:\d{2}$/, message: 'Format HH:MM' } } }),
        heureFin: fields.text({ label: 'Fin', defaultValue: '20:00', validation: { pattern: { regex: /^\d{2}:\d{2}$/, message: 'Format HH:MM' } } }),
        armes: fields.multiRelationship({ label: 'Armes travaillées', collection: 'disciplines' }),
        intitule: fields.text({ label: 'Intitulé libre', description: 'Ex. « Pratique libre ». Prioritaire sur la liste d’armes.' }),
        niveau: fields.select({
          label: 'Niveau',
          options: [
            { label: 'Tous niveaux', value: 'tous' },
            { label: 'Débutants', value: 'debutants' },
            { label: 'Confirmés', value: 'confirmes' },
            { label: 'Sans encadrant', value: 'libre' },
          ],
          defaultValue: 'tous',
        }),
        encadre: fields.checkbox({ label: 'Séance encadrée', defaultValue: true }),
      }),
      { label: 'Créneaux hebdomadaires', itemLabel: (p) => `${p.fields.jour.value} ${p.fields.heureDebut.value}–${p.fields.heureFin.value}` },
    ),
    reseaux: fields.object({
      facebook: fields.url({ label: 'Facebook' }),
      instagram: fields.url({ label: 'Instagram' }),
      hemaRatings: fields.url({ label: 'HEMA Ratings (club)' }),
      helloAsso: fields.url({ label: 'HelloAsso (association)' }),
    }, { label: 'Liens & réseaux' }),
    affiliation: fields.object({
      club: fields.text({ label: 'Club support', defaultValue: 'USAM Clermont-Ferrand' }),
      federation: fields.text({ label: 'Fédération', defaultValue: 'FFAMHE' }),
      lienClub: fields.url({ label: 'Site du club support' }),
    }, { label: 'Affiliation' }),
    photoHero: photo('Photo d’en-tête (facultatif)', 'ecoles'),
    ordre,
  },
}),
```

**Exemple** — `src/content/ecoles/clermont-ferrand.yaml`

```yaml
nom: Clermont-Ferrand
statut: active
ville: Clermont-Ferrand
presentation: ''
lieu:
  nom: Gymnase Robert Pras
  adresse: 3 rue Jean Monnet
  codePostal: '63100'
  ville: Clermont-Ferrand
  itineraire: https://www.google.com/maps/dir/?api=1&destination=Gymnase+Robert+Pras...
  carte: https://www.openstreetmap.org/export/embed.html?bbox=...
contact:
  email: amhe63.dfda@gmail.com
  telephone: 06 61 28 65 11
  responsable: Clémence Sillac
  fonction: Présidente de section
adhesion:
  montant: 85
  saison: '2025-2026'
  lienInscription: https://www.helloasso.com/associations/usam-amhe-clermont-ferrand/adhesions/...
  aPrevoir:
    - un masque d'escrime standard
    - des gants coqués
essai:
  seancesOffertes: 2
  materielPrete: true
creneaux:
  - jour: mardi
    heureDebut: '18:00'
    heureFin: '20:00'
    armes: [epee-longue, rapiere, messer, combat-viking]
    intitule: ''
    niveau: tous
    encadre: true
  - jour: jeudi
    heureDebut: '18:00'
    heureFin: '20:00'
    armes: []
    intitule: Pratique libre
    niveau: libre
    encadre: false
  - jour: jeudi
    heureDebut: '20:00'
    heureFin: '22:00'
    armes: [epee-longue, epee-bocle]
    intitule: ''
    niveau: tous
    encadre: true
reseaux:
  facebook: https://www.facebook.com/63AMHE/
  hemaRatings: https://hemaratings.com/clubs/details/1155/
  helloAsso: https://www.helloasso.com/associations/usam-amhe-clermont-ferrand
affiliation:
  club: USAM Clermont-Ferrand
  federation: FFAMHE
  lienClub: https://usam-clermont-ferrand.com/amhe-arts-martiaux-historiques-europeens
ordre: 10
```

> **Arbitrage — pourquoi pas de collection `creneaux` séparée ?**
> Trois créneaux par école, modifiés une fois par an. Une collection séparée obligerait à
> choisir l'école à chaque création (source d'erreur : un créneau orphelin ne s'affiche
> nulle part et personne ne comprend pourquoi) et éclaterait l'information sur deux écrans.
> Dans la fiche école, le prof voit lieu + contact + tarif + créneaux **au même endroit**,
> et le tableau se réordonne au glisser-déposer. Si un jour les créneaux deviennent des
> séances datées (stages, séances exceptionnelles), on créera une collection `seances`
> distincte — le tableau hebdomadaire restera ce qu'il est.

---

### 4.2 `annonces` — Messages courts datés

**Rôle.** « Pas de cours jeudi », « Stage rapière le 12 », « Inscriptions ouvertes ».
Une ou deux phrases, une date, éventuellement un lien, éventuellement épinglée dans le
bandeau en haut de page. **Se périme toute seule.**

Différence avec un article : voir §4.3, tableau comparatif.

| Champ | Label | Type | Notes |
| --- | --- | --- | --- |
| `titre` | Titre court | `slug` | 60 car. max |
| `date` | Date de l'annonce | `date` | défaut : aujourd'hui |
| `message` | Message | `markdoc.inline` | 200 car. conseillés, gras/lien autorisés |
| `ton` | Type de message | `select` | info / important / urgent → couleur du bandeau |
| `lien` | Lien (facultatif) | `object(libelle,url)` | |
| `bandeau` | Épingler en haut du site | `checkbox` | défaut faux |
| `dateFin` | Retirer automatiquement le | `date` | vide = manuel |
| `ecole` | École | `relationship` | vide = toutes |

**Règles d'affichage** (à implémenter, pas de champ à saisir) :
- une annonce est **active** si `dateFin` est vide ou dans le futur ;
- le bandeau pré-header affiche **une seule** annonce : la plus récente parmi les actives
  cochées `bandeau` ;
- la section « Actualités » de l'accueil liste les annonces actives (max 3), puis les
  derniers articles ;
- une annonce expirée disparaît du site mais reste dans le CMS (archive).

```ts
annonces: collection({
  label: 'Annonces (messages courts)',
  path: 'src/content/annonces/*',
  slugField: 'titre',
  format: { data: 'yaml' },
  columns: ['titre', 'date'],
  schema: {
    titre: fields.slug({
      name: { label: 'Titre court', validation: { isRequired: true, length: { max: 60 } } },
    }),
    date: fields.date({ label: 'Date', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
    message: fields.markdoc.inline({
      label: 'Message',
      description: 'Une à deux phrases. Raccourcis disponibles : {email}, {telephone}, {creneaux}.',
    }),
    ton: fields.select({
      label: 'Type de message',
      options: [
        { label: 'Information', value: 'info' },
        { label: 'Important', value: 'important' },
        { label: 'Urgent (séance annulée…)', value: 'urgent' },
      ],
      defaultValue: 'info',
    }),
    lien: lien('Lien (facultatif)'),
    bandeau: fields.checkbox({
      label: 'Épingler en haut du site',
      description: 'Affiche l’annonce dans le bandeau, au-dessus du menu. Une seule annonce à la fois : la plus récente gagne.',
      defaultValue: false,
    }),
    dateFin: fields.date({
      label: 'Retirer automatiquement le',
      description: 'Après cette date, l’annonce disparaît du site. Laisser vide pour la retirer à la main.',
    }),
    ecole,
  },
}),
```

**Exemple** — `src/content/annonces/pas-de-cours-le-jeudi-1er-mai.yaml`

```yaml
titre: Pas de cours le jeudi 1er mai
date: 2026-04-27
message: 'Gymnase fermé le **1er mai** : pas de séance. On se retrouve le mardi suivant.'
ton: important
lien:
  libelle: ''
  url: null
bandeau: true
dateFin: 2026-05-02
ecole: clermont-ferrand
```

---

### 4.3 `articles` — Actualités / blog

**Rôle.** Compte rendu de tournoi, présentation d'un stage, article de fond sur une source.
Titre, image de couverture, chapô, corps rédigé, page dédiée.

| Champ | Label | Type | Notes |
| --- | --- | --- | --- |
| `titre` | Titre | `slug` | |
| `date` | Date de publication | `date` | tri antéchronologique |
| `statut` | Statut | `select` | brouillon / publié — un brouillon n'est jamais généré |
| `chapo` | Chapô | `text` multiline | 280 car., sert de teaser et de description SEO |
| `couverture` | Image de couverture | `photo` | fichier + alt + cadrage |
| `categorie` | Catégorie | `select` | vie du club / tournoi / stage / sources & technique / matériel |
| `auteur` | Écrit par | `relationship` → `profs` | facultatif |
| `epingle` | Mettre à la une | `checkbox` | remonte en tête de `/actualites` |
| `corps` | Contenu | `markdoc` (contentField) | titres h2/h3, gras, italique, listes, liens, images, citations |
| `galerie` | Photos de l'article | `array(photo)` | facultatif |
| `liens` | Liens utiles | `array(object)` | résultats, inscriptions… |
| `ecolesConcernees` | Écoles concernées | `multiRelationship` | vide = toutes |

**Annonce vs article — la règle à donner au prof :**

| | Annonce | Article |
| --- | --- | --- |
| Longueur | 1-2 phrases | libre |
| A une page à elle | non | oui (`/actualites/<slug>`) |
| Image | non | couverture obligatoire |
| Durée de vie | quelques jours/semaines, expire seule | permanent, archivé |
| Peut être épinglée en bandeau | oui | non |
| Cas typique | « Pas de cours jeudi » | « Retour sur le tournoi de Lyon » |

```ts
articles: collection({
  label: 'Articles (actualités)',
  path: 'src/content/articles/*',
  slugField: 'titre',
  format: { data: 'yaml', contentField: 'corps' },
  entryLayout: 'content',
  columns: ['titre', 'date'],
  schema: {
    titre: fields.slug({ name: { label: 'Titre', validation: { isRequired: true } } }),
    date: fields.date({ label: 'Date de publication', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
    statut: fields.select({
      label: 'Statut',
      options: [
        { label: 'Brouillon (non publié)', value: 'brouillon' },
        { label: 'Publié', value: 'publie' },
      ],
      defaultValue: 'brouillon',
    }),
    chapo: fields.text({
      label: 'Chapô',
      multiline: true,
      description: 'Deux ou trois lignes affichées sur la carte et dans les résultats de recherche.',
      validation: { length: { max: 280 } },
    }),
    couverture: photo('Image de couverture', 'articles'),
    categorie: fields.select({
      label: 'Catégorie',
      options: [
        { label: 'Vie du club', value: 'vie-du-club' },
        { label: 'Tournoi', value: 'tournoi' },
        { label: 'Stage', value: 'stage' },
        { label: 'Sources & technique', value: 'sources' },
        { label: 'Matériel', value: 'materiel' },
      ],
      defaultValue: 'vie-du-club',
    }),
    auteur: fields.relationship({ label: 'Écrit par', collection: 'profs' }),
    epingle: fields.checkbox({ label: 'Mettre à la une', defaultValue: false }),
    corps: fields.markdoc({
      label: 'Contenu',
      options: {
        heading: [2, 3],
        bold: true, italic: true, link: true,
        blockquote: true, orderedList: true, unorderedList: true,
        divider: true, table: false, code: false, codeBlock: false, strikethrough: false,
        image: { directory: 'public/images/articles', publicPath: '/images/articles/' },
      },
    }),
    galerie: fields.array(photo('Photo', 'articles'), {
      label: 'Photos de l’article',
      itemLabel: (p) => p.fields.alt.value || 'Photo',
    }),
    liens: fields.array(
      fields.object({ libelle: fields.text({ label: 'Texte' }), url: fields.url({ label: 'Adresse' }) }),
      { label: 'Liens utiles', itemLabel: (p) => p.fields.libelle.value || 'Lien' },
    ),
    ecolesConcernees,
  },
}),
```

**Exemple** — `src/content/articles/medievale-de-montferrand-2026.mdoc`

```markdown
---
titre: Médiévale de Montferrand 2026
date: 2026-05-04
statut: publie
chapo: Trois jours de démonstrations en centre-ville, deux cents curieux passés au stand
  et une dizaine de premières lames tenues en main.
couverture:
  fichier: medievale-2026.jpg
  alt: Assaut en épée longue devant le public
  cadrage: centre
categorie: vie-du-club
auteur: gabriel-tardio
epingle: false
liens:
  - libelle: L'album photo complet
    url: https://www.facebook.com/63AMHE/
ecolesConcernees: []
---

## Trois jours en centre-ville

Le club tenait un stand place de la Rodade…
```

---

### 4.4 `profs` — Encadrants

**Rôle.** La grille de l'accueil **et** la fiche détaillée (« Lire l'interview ») prévue
dans la maquette V2. Ajouter un prof = créer une entrée ; le retirer = décocher
« Affiché ».

| Champ | Label | Type | Notes |
| --- | --- | --- | --- |
| `nom` | Nom | `slug` | « Gabriel Tardio » → `gabriel-tardio` |
| `prenom` | Prénom (affichage mobile) | `text` | « Gabriel » — la carte mobile n'affiche que ça |
| `visible` | Affiché sur le site | `checkbox` | **le mécanisme « retirer un prof »** |
| `misEnAvant` | Mis en avant | `checkbox` | carte agrandie / référent principal |
| `portrait` | Portrait | `photo` | fichier + alt + cadrage |
| `armes` | Armes enseignées | `multiRelationship` → `disciplines` | génère « MESSER · VIKING · BOCLE » |
| `accroche` | Accroche | `text` | « Top 1 % mondial · épée longue acier » |
| `bio` | Biographie | `markdoc` (contentField) | 3-10 lignes ; extrait repris sur l'accueil |
| `lienExterne` | Lien externe | `object(libelle,url)` | HEMA Ratings, site perso |
| `interview` | Interview | `array(object)` | question + réponse (fiche prof) |
| `video` | Vidéo d'interview | `object` | url + durée + vignette |
| `ecole` | École | `relationship` | vide = école principale |
| `ordre` | Ordre | `integer` | |

```ts
profs: collection({
  label: 'Encadrants',
  path: 'src/content/profs/*',
  slugField: 'nom',
  format: { data: 'yaml', contentField: 'bio' },
  entryLayout: 'content',
  columns: ['nom', 'accroche'],
  schema: {
    nom: fields.slug({ name: { label: 'Nom complet', validation: { isRequired: true } } }),
    prenom: fields.text({ label: 'Prénom', description: 'Utilisé sur les cartes mobiles.' }),
    visible,
    misEnAvant: fields.checkbox({
      label: 'Mis en avant',
      description: 'Carte agrandie sur l’accueil. Réservé au référent principal.',
      defaultValue: false,
    }),
    portrait: photo('Portrait', 'profs'),
    armes: fields.multiRelationship({
      label: 'Armes enseignées',
      collection: 'disciplines',
      description: 'Sert à afficher la spécialité au-dessus du nom.',
    }),
    accroche: fields.text({
      label: 'Accroche',
      description: 'Une ligne, sous le nom. Ex. « Rapière française & italienne · bolonaise ».',
      validation: { length: { max: 90 } },
    }),
    bio: fields.markdoc({
      label: 'Biographie',
      options: { heading: false, bold: true, italic: true, link: true, unorderedList: true,
                 blockquote: false, orderedList: false, table: false, code: false, codeBlock: false,
                 strikethrough: false, divider: false, image: false },
    }),
    lienExterne: lien('Lien externe (facultatif)'),
    interview: fields.array(
      fields.object({
        question: fields.text({ label: 'Question' }),
        reponse: fields.text({ label: 'Réponse', multiline: true }),
      }),
      { label: 'Interview', itemLabel: (p) => p.fields.question.value || 'Question' },
    ),
    video: fields.object({
      url: fields.url({ label: 'Lien de la vidéo (YouTube, Vimeo…)' }),
      duree: fields.text({ label: 'Durée', description: 'Ex. 06:24' }),
      vignette: image('Vignette', 'profs'),
    }, { label: 'Vidéo d’interview (facultatif)' }),
    ecole,
    ordre,
  },
}),
```

**Exemple** — `src/content/profs/gabriel-tardio.mdoc`

```markdown
---
nom: Gabriel Tardio
prenom: Gabriel
visible: true
misEnAvant: true
portrait:
  fichier: gabriel-tardio.jpg
  alt: Portrait de Gabriel Tardio, masque sous le bras
  cadrage: haut
armes: [epee-longue]
accroche: Top 1 % mondial · épée longue acier
lienExterne:
  libelle: Profil HEMA Ratings
  url: https://hemaratings.com/fighters/details/5716/
interview:
  - question: Comment es-tu arrivé aux AMHE ?
    reponse: …
  - question: Qu'est-ce qu'on apprend à ton cours ?
    reponse: …
  - question: Un conseil pour une première séance ?
    reponse: …
video:
  url: null
  duree: ''
  vignette: null
ecole: clermont-ferrand
ordre: 20
---

Référent principal du club. Compétiteur reconnu du circuit AMHE, classé dans le top 1 %
mondial en épée longue acier sur HEMA Ratings. Pratique exigeante, structurée, tournée
vers l'efficacité en assaut.
```

---

### 4.5 `disciplines` — Armes & disciplines

**Rôle.** Les cartes de l'accueil **et** la fiche arme V2 (mini-cours vidéo + carte
« La source » + bandeau CTA).

| Champ | Label | Type | Notes |
| --- | --- | --- | --- |
| `nom` | Nom de l'arme | `slug` | |
| `visible` | Affiché sur le site | `checkbox` | remplace la suppression (cf. épée-bocle) |
| `sousTitre` | Sous-titre | `text` | « Arme emblématique des AMHE » |
| `epoque` | Époque | `text` | « Médiévale » |
| `dates` | Siècles | `text` | « XIVᵉ — XVᵉ s. » |
| `photo` | Photo de l'arme | `photo` | |
| `resume` | Chapô de la fiche arme | `text` multiline | 300 car. Accroche du hero de fiche **et** `<meta name="description">`. Ne doit pas reprendre l'ouverture de `description` : les deux blocs se suivent à deux blocs d'intervalle. La carte d'accueil, elle, affiche `sousTitre`. |
| `description` | Description longue | `markdoc` (contentField) | haut de la fiche arme |
| `referent` | Prof référent | `relationship` → `profs` | |
| `miniCours` | Mini-cours | `array(object)` | titre, sousTitre, duree, video, vignette, sousTitres (.vtt), affiche |
| `source` | La source | `object` | titre, texte, lien **seulement**. Plus d'image : la planche, sa description et son crédit viennent de la fiche du traité (`traites`), parce qu'ils sont inséparables — cf. ARCHITECTURE.md §4 |
| `ecolesConcernees` | Écoles concernées | `multiRelationship` | vide = toutes |
| `ordre` | Ordre | `integer` | |

```ts
disciplines: collection({
  label: 'Armes & disciplines',
  path: 'src/content/disciplines/*',
  slugField: 'nom',
  format: { data: 'yaml', contentField: 'description' },
  entryLayout: 'content',
  columns: ['nom', 'epoque'],
  schema: {
    nom: fields.slug({ name: { label: 'Nom de l’arme', validation: { isRequired: true } } }),
    visible,
    sousTitre: fields.text({ label: 'Sous-titre', validation: { length: { max: 60 } } }),
    epoque: fields.text({ label: 'Époque', description: 'Ex. « Médiévale », « Renaissance ».' }),
    dates: fields.text({ label: 'Siècles', description: 'Ex. « XIVᵉ — XVᵉ s. »' }),
    photo: photo('Photo de l’arme', 'disciplines'),
    resume: fields.text({ label: 'Résumé (carte d’accueil)', multiline: true, validation: { length: { max: 300 } } }),
    description: fields.markdoc({
      label: 'Description longue (fiche arme)',
      options: { heading: [2, 3], bold: true, italic: true, link: true, unorderedList: true,
                 blockquote: true, orderedList: false, table: false, code: false, codeBlock: false,
                 strikethrough: false, divider: false,
                 image: { directory: 'public/images/disciplines', publicPath: '/images/disciplines/' } },
    }),
    referent: fields.relationship({ label: 'Prof référent', collection: 'profs' }),
    miniCours: fields.array(
      fields.object({
        titre: fields.text({ label: 'Titre de la leçon', description: 'Ex. « Leçon 01 — Les gardes »' }),
        sousTitre: fields.text({ label: 'Sous-titre', description: 'Ex. « Bases · posture & distances »' }),
        duree: fields.text({ label: 'Durée', description: 'Ex. 04:12' }),
        video: champsVideo.url,        // adresse du .mp4 sur notre R2
        vignette: image('Vignette', 'disciplines'),
        sousTitres: champsVideo.sousTitres, // piste .vtt française (WCAG 1.2.2)
        affiche: champsVideo.affiche,
      }),
      { label: 'Mini-cours (vidéos)', itemLabel: (p) => p.fields.titre.value || 'Leçon' },
    ),
    source: fields.object({
      titre: fields.text({ label: 'Titre', defaultValue: 'Des traités aux assauts.' }),
      texte: fields.text({ label: 'Texte', multiline: true }),
      lien: lien('Bouton « Étudier la source »'), // vide ⇒ fiche du traité de l'arme
    }, { label: 'Encadré « La source »' }),
    ecolesConcernees,
    ordre,
  },
}),
```

**Exemple** — `src/content/disciplines/epee-longue.mdoc`

```markdown
---
nom: Épée longue
visible: true
sousTitre: Arme emblématique des AMHE
epoque: Médiévale
dates: XIVᵉ — XVᵉ s.
photo:
  fichier: disc-epee-longue.jpg
  alt: Deux tireurs en garde, épée longue
  cadrage: centre
resume: Pratiquée à deux mains, l'épée longue est l'arme emblématique des AMHE. Structure,
  explosivité, versatilité, de taille comme de pointe.
referent: gabriel-tardio
miniCours:
  - titre: Leçon 01 — Les gardes
    sousTitre: Bases · posture & distances
    duree: 04:12
    video: https://media.…/lecon-01.mp4
    vignette: lecon-01.jpg
    sousTitres: https://media.…/lecon-01.fr.vtt
source:
  titre: Des traités aux assauts.
  texte: Chaque leçon s'appuie sur les sources historiques étudiées en salle, puis
    éprouvées en assaut.
  lien:
    libelle: ''
    url: ''
ecolesConcernees: []
ordre: 20
---

Pratiquée à deux mains, l'épée longue est l'arme emblématique des AMHE. Nous pratiquons
la tradition germanique de maître Johannes Liechtenauer et de ses glossateurs…
```

---

### 4.6 `partenaires`

| Champ | Label | Type | Notes |
| --- | --- | --- | --- |
| `nom` | Nom | `slug` | |
| `visible` | Affiché sur le site | `checkbox` | |
| `categorie` | Catégorie | `select` | affiliation / équipement / institution / club ami |
| `logo` | Logo | `image` | fond transparent conseillé |
| `texte` | Présentation | `markdoc` (contentField) | gras/italique/lien |
| `lien` | Bouton | `object(libelle,url)` | « Voir leurs lames » |
| `ecolesConcernees` | Écoles concernées | `multiRelationship` | |
| `ordre` | Ordre | `integer` | |

```ts
partenaires: collection({
  label: 'Partenaires',
  path: 'src/content/partenaires/*',
  slugField: 'nom',
  format: { data: 'yaml', contentField: 'texte' },
  columns: ['nom', 'categorie'],
  schema: {
    nom: fields.slug({ name: { label: 'Nom du partenaire', validation: { isRequired: true } } }),
    visible,
    categorie: fields.select({
      label: 'Catégorie',
      options: [
        { label: 'Affiliation', value: 'affiliation' },
        { label: 'Équipement', value: 'equipement' },
        { label: 'Institution', value: 'institution' },
        { label: 'Club ami', value: 'club-ami' },
      ],
      defaultValue: 'equipement',
    }),
    logo: image('Logo', 'partenaires'),
    texte: fields.markdoc({
      label: 'Présentation',
      options: { heading: false, bold: true, italic: true, link: true, unorderedList: false,
                 blockquote: false, orderedList: false, table: false, code: false,
                 codeBlock: false, strikethrough: false, divider: false, image: false },
    }),
    lien: lien('Bouton'),
    ecolesConcernees,
    ordre,
  },
}),
```

**Exemple** — `src/content/partenaires/ffamhe.mdoc`

```markdown
---
nom: FFAMHE
visible: true
categorie: affiliation
logo: ffamhe.svg
lien:
  libelle: Visiter la FFAMHE
  url: https://ffamhe.fr
ecolesConcernees: []
ordre: 10
---

La **Fédération Française des Arts Martiaux Historiques Européens** est la colonne
vertébrale de tout le milieu AMHE en France…
```

---

### 4.7 `faq`

Une entrée = une question. Réponse en texte riche (certaines réponses font huit lignes).
Les raccourcis `{tarif}`, `{creneaux}`, `{email}` évitent de redire ce qui est déjà dans
la fiche école — c'est ce qui empêche la FAQ de se désynchroniser (problème actuel).

| Champ | Label | Type | Notes |
| --- | --- | --- | --- |
| `question` | Question | `slug` | |
| `visible` | Affichée sur le site | `checkbox` | |
| `reponse` | Réponse | `markdoc` (contentField) | raccourcis autorisés |
| `categorie` | Catégorie | `select` | débuter / sécurité / pratique / tarifs & inscription / compétition |
| `miseEnAvant` | Afficher en premier (mobile) | `checkbox` | le mobile n'affiche que 3 questions |
| `ecolesConcernees` | Écoles concernées | `multiRelationship` | |
| `ordre` | Ordre | `integer` | |

```ts
faq: collection({
  label: 'Questions fréquentes',
  path: 'src/content/faq/*',
  slugField: 'question',
  format: { data: 'yaml', contentField: 'reponse' },
  columns: ['question', 'categorie'],
  schema: {
    question: fields.slug({ name: { label: 'Question', validation: { isRequired: true } } }),
    visible,
    reponse: fields.markdoc({
      label: 'Réponse',
      description: 'Raccourcis : {tarif}, {saison}, {creneaux}, {lieu}, {email}, {telephone}.',
      options: { heading: false, bold: true, italic: true, link: true, unorderedList: true,
                 orderedList: true, blockquote: false, table: false, code: false,
                 codeBlock: false, strikethrough: false, divider: false, image: false },
    }),
    categorie: fields.select({
      label: 'Catégorie',
      options: [
        { label: 'Débuter', value: 'debuter' },
        { label: 'Sécurité', value: 'securite' },
        { label: 'Déroulé des séances', value: 'seances' },
        { label: 'Tarifs & inscription', value: 'tarifs' },
        { label: 'Compétition', value: 'competition' },
      ],
      defaultValue: 'debuter',
    }),
    miseEnAvant: fields.checkbox({
      label: 'Afficher en premier (mobile)',
      description: 'Le mobile n’affiche que trois questions : cocher les trois plus utiles.',
      defaultValue: false,
    }),
    ecolesConcernees,
    ordre,
  },
}),
```

**Exemple** — `src/content/faq/combien-coute-l-adhesion.mdoc`

```markdown
---
question: Combien coûte l'adhésion ?
visible: true
categorie: tarifs
miseEnAvant: false
ecolesConcernees: []
ordre: 50
---

{tarif} pour la saison {saison}, via HelloAsso. Il est possible de rejoindre en cours
d'année. Les {essai} premières séances sont sans engagement — écrivez-nous à {email}
avant de venir pour qu'on vous attende.
```

---

### 4.8 `galerie` — Albums photo

**Rôle.** Une entrée = un **album** (un événement, une saison, « vie de salle »).
Les photos sont un tableau réordonnable au glisser-déposer à l'intérieur de l'album :
c'est ce qui rend l'ordre gérable sans champ numérique, contrairement à une collection
« une photo = une entrée ».

| Champ | Label | Type | Notes |
| --- | --- | --- | --- |
| `titre` | Titre de l'album | `slug` | |
| `visible` | Affiché sur le site | `checkbox` | |
| `date` | Date | `date` | tri |
| `surAccueil` | Album affiché sur l'accueil | `checkbox` | un seul ; les 6 premières photos alimentent la mosaïque |
| `photos` | Photos | `array(object)` | fichier, légende, alt, cadrage, crédit |
| `ecole` | École | `relationship` | vide = toutes |

```ts
galerie: collection({
  label: 'Albums photo',
  path: 'src/content/galerie/*',
  slugField: 'titre',
  format: { data: 'yaml' },
  columns: ['titre', 'date'],
  schema: {
    titre: fields.slug({ name: { label: 'Titre de l’album', validation: { isRequired: true } } }),
    visible,
    date: fields.date({ label: 'Date', defaultValue: { kind: 'today' } }),
    surAccueil: fields.checkbox({
      label: 'Album affiché sur l’accueil',
      description: 'Les six premières photos alimentent la mosaïque de la page d’accueil. Un seul album à la fois.',
      defaultValue: false,
    }),
    photos: fields.array(
      fields.object({
        fichier: image('Photo', 'galerie'),
        legende: fields.text({ label: 'Légende', description: 'Ex. « À l’assaut ». Affichée au survol.' }),
        alt: fields.text({ label: 'Description de l’image' }),
        cadrage,
        credit: fields.text({ label: 'Crédit photo (facultatif)' }),
      }),
      { label: 'Photos', itemLabel: (p) => p.fields.legende.value || 'Photo' },
    ),
    ecole,
  },
}),
```

**Exemple** — `src/content/galerie/vie-de-salle.yaml`

```yaml
titre: Vie de salle
visible: true
date: 2026-07-01
surAccueil: true
photos:
  - fichier: galerie-1.jpg
    legende: À l'assaut
    alt: Deux tireurs en assaut libre au gymnase
    cadrage: centre
    credit: ''
  - fichier: galerie-2.jpg
    legende: Médiévale de Montferrand
    alt: Démonstration publique en extérieur
    cadrage: centre
    credit: ''
ecole: clermont-ferrand
```

### 4.9 `traites` — Les sources (traités historiques)

**Rôle.** Une entrée = un **traité**, avec ses planches. Collection **commune** (les
traités ne sont pas propres à une salle) : `src/content/commun/traites/*`. Alimente
`/sources/` (la grille), `/sources/<slug>/` (la fiche) et l'encadré « La source » des
fiches arme, qui n'a plus d'image propre.

| Champ | Label | Type | Notes |
| --- | --- | --- | --- |
| `titre` | Titre du traité | `slug` | le titre tel qu'il figure sur l'ouvrage |
| `auteur` | Auteur | `text` multiline | chaîne éditoriale complète ; la carte l'abrège (`auteurCourt`) |
| `annee` | Année | `text` | libre, pour rester prudent : « vers 1300-1330 » |
| `tradition` | Tradition / école | `text` multiline | abrégée sur la carte (`traditionCourte`) |
| `bibliotheque` | Bibliothèque de conservation | `text` | **recopié tel quel** sur la carte : une ligne exigée par une institution se relit, elle ne se devine pas |
| `cote` | Cote | `text` | |
| `urlNumerisation` | Lien vers la numérisation | `text` | **garde-fou** : la fiche doit pouvoir renvoyer au document |
| `licence` | Droits d'utilisation | `object(resume, url)` | `url` **obligatoire** — garde-fou n° 6 |
| `armes` | Armes concernées | `multiRelationship` → `disciplines` | l'ordre d'affichage vient du catalogue, pas de la saisie |
| `presentation` | Présentation | `markdoc` (contentField) | la voix du club sur le traité |
| `extraitCitation` | Extrait cité | `text` multiline | **courte citation seulement** |
| `extraitCredit` | Crédit de l'extrait | `text` | obligatoire dès qu'il y a un extrait |
| `extraitUrl` | Lien vers la page de l'extrait | `text` | obligatoire dès qu'il y a un extrait |
| `planches` | Planches | `array(object)` | cf. ci-dessous |
| `ordre` | Ordre d'affichage | `integer` | **éditorial, pas chronologique** : groupé par arme |

**Une planche** : `image`, `alt` (description, obligatoire), `legende`, `folio`,
`credit`, `majestueuse` (la planche mise en avant sur la carte et dans « La rigueur » ;
à défaut, la première).

⚠️ **`credit` est la seule chaîne du site rendue verbatim** — ni « © », ni composition
typographique, ni capitales. C'est la contrepartie du droit de publier l'image, et elle
se saisit **par planche** : les corpus MDZ portent le folio dans leur ligne de crédit,
un gabarit commun serait faux. Détail des règles dans ARCHITECTURE.md §6.

Le garde-fou n° 6 du build refuse : une planche sans description, une planche sans
crédit, un traité sans adresse de licence, un extrait sans crédit ou sans lien.

---

## 5. Singletons

| Clé | Label admin | Fichier | Contenu |
| --- | --- | --- | --- |
| `reglages` | Réglages du site | `src/content/reglages.yaml` | identité, école principale, multi-écoles, partage |
| `hero` | Accueil · En-tête | `src/content/hero.yaml` | photo, titre, baseline, boutons |
| `entetes` | Accueil · Titres des sections | `src/content/entetes.yaml` | eyebrow + titre + lede des sections adossées à une collection |
| `club` | Accueil · Le club | `src/content/club.yaml` | texte, photo, chiffres, 3 piliers |
| `rigueur` | Accueil · La rigueur | `src/content/rigueur.yaml` | manifeste, planche de traité, légende |
| `rejoindre` | Accueil · Nous rejoindre | `src/content/rejoindre.yaml` | 2 blocs « essayer » / « continuer » |
| `tournois` | Accueil · Tournois & saison | `src/content/tournois.yaml` | photo, texte, faits, boutons |
| `fiches` | Textes des fiches | `src/content/fiches.yaml` | bandeaux CTA des fiches arme et prof |
| `menus` | Menus & pied de page | `src/content/menus.yaml` | menu haut, barre mobile, colonnes du pied de page |
| `legal` | Mentions légales & confidentialité | `src/content/legal.yaml` | mentions, RGPD |

### 5.1 `reglages`

| Champ | Label | Type |
| --- | --- | --- |
| `marque.debut` / `marque.feu` / `marque.connecteur` / `marque.acier` | Mots du logo typographique | `text` × 4 |
| `baseline` | Baseline | `text` (« Arts Martiaux Historiques Européens ») |
| `description` | Description du site (SEO / partage) | `text` multiline |
| `imagePartage` | Image de partage (réseaux) | `image` |
| `ecolePrincipale` | École principale | `relationship` → `ecoles` |
| `multiEcoles` | Plusieurs écoles | `checkbox` |
| `copyright` | Mention de bas de page | `text` |

> Le logo typographique **De / Feu / et d' / Acier** est saisi **une fois ici** et réutilisé
> par le hero, le marquee du pied de page et les mentions légales. Aujourd'hui il est
> dupliqué dans `hero` et `footer` : deux endroits à corriger pour un même mot.

```ts
reglages: singleton({
  label: 'Réglages du site',
  path: 'src/content/reglages',
  format: { data: 'yaml' },
  schema: {
    marque: fields.object({
      debut: fields.text({ label: 'Mot 1', defaultValue: 'De' }),
      feu: fields.text({ label: 'Mot 2 (couleur feu)', defaultValue: 'Feu' }),
      connecteur: fields.text({ label: 'Mot 3 (italique)', defaultValue: "et d'" }),
      acier: fields.text({ label: 'Mot 4 (couleur acier)', defaultValue: 'Acier' }),
    }, { label: 'Nom du club (logo typographique)' }),
    baseline: fields.text({ label: 'Baseline', defaultValue: 'Arts Martiaux Historiques Européens' }),
    description: fields.text({ label: 'Description du site', multiline: true,
      description: 'Utilisée par Google et lors du partage d’un lien.' }),
    imagePartage: image('Image de partage', 'site'),
    ecolePrincipale: fields.relationship({ label: 'École principale', collection: 'ecoles' }),
    multiEcoles: fields.checkbox({
      label: 'Le club a plusieurs écoles',
      description: 'À cocher le jour où une deuxième école ouvre : active le sélecteur d’école et les pages par ville.',
      defaultValue: false,
    }),
    copyright: fields.text({ label: 'Mention de bas de page', defaultValue: "© De Feu et d'Acier · Clermont-Ferrand" }),
  },
}),
```

### 5.2 `hero`

| Champ | Label | Type | Notes |
| --- | --- | --- | --- |
| `photo` | Photo de fond | `photo` | surchargeable par école |
| `accroche` | Bandeau d'accroche | `text` | « {creneaux_court} — essai offert », qui rend « Mar · Jeu — essai offert » : l'horaire ne s'affiche que si les jours de cours ont les mêmes heures, ce qui n'est pas le cas à Clermont |
| `lieuTexte` | Ligne de lieu | `text` | vide = « à {ville} » automatique |
| `boutonPrincipal` / `boutonSecondaire` | Boutons | `object(libelle,url)` | |
| `inviteDefilement` | Invite de défilement | `text` | « Découvrir le club » |

Le titre vient de `reglages.marque` ; la baseline de `reglages.baseline`.

### 5.3 `entetes` — titres des sections adossées à une collection

Un objet par section, chacun : `eyebrow` (`text`), `titreLigne1` (`text`),
`titreLigne2` (`text`), `lede` (`markdoc.inline`).

Sections concernées : `actualites`, `disciplines`, `profs`, `galerie`, `faq`,
`partenaires`, et `sources`. Les autres sections (club, rigueur, rejoindre, tournois) ont
leur en-tête dans leur propre singleton, au-dessus de leur contenu.

`sources` est la seule rubrique qui ne titre pas une section de l'accueil mais une page
entière, « La bibliothèque » (`/sources/`) : elle est ici parce que c'est là que le club
vient chercher les titres du site, et qu'un singleton pour quatre chaînes ferait une case
de plus dans le menu de l'admin.

**Correction de l'incohérence « Cinq armes / 4 disciplines »** : les titres des sections
Disciplines et Profs utilisent les raccourcis `{nb_armes}` et `{nb_profs}`.

```yaml
disciplines:
  eyebrow: Les disciplines
  titreLigne1: '{nb_armes} armes,'
  titreLigne2: '{nb_armes} grammaires.'
  lede: On peut tout pratiquer, on peut se spécialiser…
profs:
  eyebrow: Les profs
  titreLigne1: '{nb_profs} encadrants,'
  titreLigne2: '{nb_profs} écoles.'
```

Le titre suit alors automatiquement les ajouts et retraits d'armes ou de profs : plus
jamais de « Cinq armes » avec quatre cartes en dessous. Un prof qui préfère un titre
figé écrit simplement « Quatre armes, ».

### 5.4 `club`

`eyebrow`, `titreLigne1..3`, `texte` (`markdoc.inline` multi-lignes → `markdoc` si besoin),
`photo` (`photo`), `chiffres` (`array` de `{ valeur, libelle }`, `valeur` accepte
`{nb_armes}` / `{nb_profs}`), `piliers` (`array` de `{ titre, texte }`, max 3).

### 5.5 `rigueur`

`eyebrow`, `titreLigne1/2`, `lede` (`markdoc.inline`), `texte` (`text` multiline),
`planche` (**`planchePatrimoniale`** et non `photo` : même forme — fichier, description,
cadrage, crédit — mais la ligne de crédit y est rendue **verbatim**, sans « © » ajouté,
parce que c'est une numérisation de bibliothèque ; le libellé du champ le dit au prof),
`legendePlanche` (`text` multiline, la voix du club — le crédit, lui, se saisit avec
l'image),
`manifesteMobile` (`object { citation, soustitre, photo }` — l'écran « Manifesto » de la
maquette mobile).

### 5.6 `rejoindre`

`eyebrow`, `titreLigne1/2`, puis deux blocs :

| Champ | Label | Type |
| --- | --- | --- |
| `blocEssai.eyebrow` | Éyebrow bloc 1 | `text` (« Viens essayer ») |
| `blocEssai.titre` | Titre | `markdoc.inline` (gras/italique autorisés) |
| `blocEssai.paragraphes` | Paragraphes | `array(markdoc.inline)` |
| `blocEssai.bouton` | Bouton | `object(libelle,url)` — vide = « Itinéraire » de l'école |
| `blocAdhesion.*` | idem bloc 2 | idem ; bouton par défaut = lien d'adhésion de l'école |

**Le tableau des créneaux, le lieu, le contact et les photos du lieu ne sont pas ici** : ils viennent
de la fiche école. Ce singleton ne contient que le discours.

### 5.7 `tournois`

`eyebrow`, `titreLigne1/2`, `photo` (`photo`), `overlayEyebrow`, `overlayTitre`,
`texte` (`text` multiline), `faits` (`array` de `{ titre, texte }`),
`boutons` (`array` de `{ libelle, url }`).

### 5.8 `fiches` — textes des pages arme & prof

| Champ | Label | Type | Notes |
| --- | --- | --- | --- |
| `arme.titre` | Bandeau fiche arme — titre | `text` | « Envie de tester {arme} ? » |
| `arme.sousTitre` | Sous-titre | `text` | « {essai} premières séances offertes — matériel prêté. » |
| `arme.bouton` | Bouton | `object(libelle,url)` | |
| `prof.titre` | Bandeau fiche prof — titre | `text` | « S'entraîner avec {prof} ? » |
| `prof.sousTitre` | Sous-titre | `text` | « Viens à une séance, il t'accueille. » |
| `prof.bouton` | Bouton | `object(libelle,url)` | |

### 5.9 `menus`

`menuPrincipal` (`array` de `{ libelle, lien }`), `barreMobile` (`array` de
`{ libelle, icone (select), lien }`, 5 max), `colonnes` (`array` de
`{ titre, liens: array({ libelle, url }) }`), `liensLegaux` (`array`).

Les liens « Nous écrire », « Adhésion » et « HelloAsso » peuvent rester vides : le site
utilise alors ceux de l'école (`{email}`, lien d'adhésion). Recommandation : les laisser
vides, justement.

### 5.10 `legal`

| Champ | Label | Type | Notes |
| --- | --- | --- | --- |
| `mentions.intro` | Introduction | `text` multiline | |
| `mentions.entrees` | Rubriques | `array({ titre, texte })` | `texte` accepte les raccourcis |
| `mentions.note` | Note | `text` multiline | droits photo |
| `hebergeur.nom` / `.adresse` | Hébergeur | `text` | Cloudflare, Inc. — **à mettre à jour : Cloudflare Pages** |
| `rgpd.paragraphes` | Paragraphes | `array(markdoc.inline)` | |
| `rgpd.note` | Note | `text` multiline | |

Le siège, les horaires, le responsable de publication et le contact **ne sont pas saisis
ici** : ils sont générés depuis la fiche école. C'est ce qui garantit que les mentions
légales ne mentent jamais sur le contact.

**Exemple** — `src/content/legal.yaml`

```yaml
mentions:
  intro: Site édité par la section AMHE « De Feu et d'Acier » de l'USAM Clermont-Ferrand,
    association loi 1901 affiliée à la FFAMHE.
  entrees:
    - titre: Siège & lieu d'entraînement
      texte: '{lieu} — {adresse}'
    - titre: Directrice de publication
      texte: Clémence Sillac, présidente de section
    - titre: Contact
      texte: '{email} · {telephone}'
  note: Les photographies du club sont la propriété de leurs auteurs… Les 34 reproductions
    de traités publiées dans « Les sources » n'appartiennent pas au club… (extrait ; la
    note réelle nomme les trois bibliothèques et leurs licences, cf. legal.yaml)
hebergeur:
  nom: Cloudflare, Inc.
  adresse: 101 Townsend St, San Francisco, CA 94107, USA
rgpd:
  paragraphes:
    - Ce site ne dépose **aucun cookie**, n'utilise **aucun outil d'analyse** et ne stocke
      aucune donnée personnelle côté serveur.
  note: Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de
    suppression…
```

---

## 6. Navigation de l'admin

Rangée par **usage** (ce que le prof vient faire), pas par type technique.

```ts
ui: {
  brand: { name: "De Feu et d'Acier" },
  navigation: {
    'Publier': ['annonces', 'articles'],
    'L’école': ['ecoles'],
    'Enseignement': ['profs', 'disciplines'],
    'Contenus': ['galerie', 'faq', 'partenaires'],
    'Textes des pages': ['hero', 'entetes', 'club', 'rigueur', 'rejoindre', 'tournois', 'fiches'],
    'Réglages': ['menus', 'legal', 'reglages'],
  },
},
```

Les deux premières entrées sont celles qui servent chaque semaine ; « Textes des pages »
et « Réglages » sont en bas parce qu'on y touche deux fois par an.

---

## 7. Garde-fous à implémenter au build

Le schéma seul ne suffit pas. **Sept contrôles** sont implémentés dans
`src/lib/validation.ts`, appelés une fois par `src/layouts/Base.astro`. Aucun n'est un
avertissement : chacun **fait échouer le build**, avec un message qui nomme le fichier et
le champ. Un avertissement dans un journal de build se perd, et le contenu fautif partirait
en production.

1. **Raccourci inconnu ou sans valeur** dans un texte (`{tarrif}`, ou `{tarif}` alors que
   la fiche école ne porte pas de montant).
2. **Aucune école principale**, ou plusieurs.
3. **Image de contenu sans description alternative** (accessibilité).
4. **Deux annonces épinglées en bandeau** en même temps.
5. **Image déposée dans un format que le build ne sait pas traiter** (un HEIC
   disparaîtrait sans bruit).
6. **Droits d'un traité** : planche sans description, planche sans crédit, traité sans
   adresse de licence, extrait cité sans crédit ou sans lien vers sa source.
7. **La planche de « La rigueur »** publiée sans sa ligne de crédit. Elle est saisie
   dans le singleton `rigueur` et échappe donc au contrôle n° 6, alors que c'est la
   planche la plus visible du site.

Le contrôle du **contenu orphelin** (un prof ou une annonce dont `ecole` pointe vers une
école archivée) reste à écrire : il ne peut pas se produire aujourd'hui, le site n'ayant
qu'une école.

---

## 8. Mapping ancien → nouveau

### 8.1 Correspondance des sections

| Ancien (section · champ) | Nouveau | Action |
| --- | --- | --- |
| `hero.titleStart/Feu/Connector/Acier` | `reglages.marque.*` | **déplacé** (était dupliqué avec `footer.brand`) |
| `hero.subtitleLine` | `reglages.baseline` | déplacé |
| `hero.subtitlePlace` (« à Clermont-Ferrand ») | `hero.lieuTexte` (vide) → « à {ville} » | **automatisé** |
| `hero.logo/logoAlt`, `ctaLabel/ctaHref`, `scrollLabel` | `hero.photo`, `hero.boutonPrincipal`, `hero.inviteDefilement` | repris |
| — | `hero.accroche` (« Mar · Jeu 18h–22h — essai offert ») | **nouveau** (maquette V2) |
| `actualites.banner.*` | collection `annonces` (champ `bandeau`) | **remplacé** ; contenu de test supprimé |
| `actualites` (en-tête) | `entetes.actualites` | repris |
| collection `news` (title, eyebrow, desc, bodyHtml, gallery, links) | collection `articles` (titre, categorie+date, chapo, **corps** en texte riche, galerie, liens) | **restructuré** : plus de HTML à écrire à la main |
| `disciplines` (en-tête) | `entetes.disciplines` | repris, titre passé en `{nb_armes}` |
| `disciplines.items[]` | collection `disciplines` | **éclaté en fiches** + champs `miniCours`, `source`, `referent`, `visible` |
| `disciplines.items[].focal` (« 50% 40% ») | `photo.cadrage` (select) | **simplifié** |
| `profs` (en-tête) | `entetes.profs` | repris, titre en `{nb_profs}` |
| `profs.items[]` | collection `profs` | **éclaté en fiches** + `armes` (relation), `interview`, `video`, `ecole`, `visible` |
| `profs.items[].eyebrow` (« Messer · viking · bocle ») | déduit de `profs.armes` | **automatisé** |
| `club.*` | singleton `club` | repris ; `chiffres` ajouté (maquette V2) |
| `rigueur.ledeHtml` (HTML) | `rigueur.lede` (texte riche) | **converti** |
| `rejoindre.slots[]` | `ecoles.creneaux[]` | **déplacé vers l'école** |
| `rejoindre.venue.*`, `rejoindre.map.*` | `ecoles.lieu.*`, `ecoles.contact.*` | **déplacé vers l'école** |
| `rejoindre.pillar1/pillar2.bodyHtml[]` | `rejoindre.blocEssai/blocAdhesion.paragraphes[]` | converti (texte riche, plus de HTML) |
| `rejoindre.pillar2` (« 85 € », HelloAsso) | `ecoles.adhesion.*` + raccourci `{tarif}` | **déplacé vers l'école** |
| `rejoindre.scheduleHeaders[]` | supprimé | en-têtes de tableau = gabarit |
| `tournois.*` | singleton `tournois` | repris |
| `galerie.tiles[].col/.row` | supprimé | mosaïque gérée en CSS |
| `galerie.tiles[]` | collection `galerie` → album « Vie de salle » | restructuré |
| `galerie.facebookLabel/Href` | `ecoles.reseaux.facebook` | déplacé vers l'école |
| `faq.items[]` | collection `faq` | éclaté en fiches, + `categorie`, `miseEnAvant` |
| `faq.ledeHtml` (lien mail en dur) | `entetes.faq.lede` avec `{email}` | **corrigé** (contact obsolète) |
| `partenaires.items[].bodyHtml` | collection `partenaires`, champ `texte` | converti |
| `partenaires.items[].kind` | `partenaires.categorie` (select) | typé |
| `footer.brand.*` | `reglages.marque.*` | dédupliqué |
| `footer.columns[]`, `legalLinks[]`, `copyright` | `menus.colonnes[]`, `menus.liensLegaux[]`, `reglages.copyright` | repris |
| `footer` → « Nous écrire » (`c.sillac@…`) | `menus` vide → `{email}` de l'école | **corrigé** |
| `legal.mentions.entries[]` (siège, horaires, contact en dur) | générés depuis `ecoles` | **corrigé** |
| `legal.switchToRgpd/switchToMentions` | supprimé | libellés d'interface |
| `legal.mentions` → « Hébergement : Cloudflare Workers » | `legal.hebergeur` → Cloudflare Pages | **corrigé** |

### 8.2 Incohérences du contenu actuel : traitement

| # | Constat | Traitement dans le nouveau modèle |
| --- | --- | --- |
| 1 | Deux contacts différents (`amhe63.dfda@gmail.com` / `06 61 28 65 11` dans *Nous rejoindre*, `c.sillac@protonmail.com` / `06 31 58 54 60` en FAQ, pied de page, mentions légales) | **Un seul contact**, saisi dans `ecoles.contact`. Le mail associatif `amhe63.dfda@gmail.com` et le `06 61 28 65 11` sont retenus (les plus récents, saisis par le prof). Partout ailleurs : raccourcis `{email}` / `{telephone}`. La présidente reste nommée en directrice de publication, sans contact personnel affiché. **À confirmer auprès du client.** |
| 2 | « Cinq armes, cinq grammaires. » alors que 4 disciplines sont listées (épée-bocle retirée) | Titre passé en `{nb_armes} armes, {nb_armes} grammaires.` → « Quatre armes, quatre grammaires. » aujourd'hui, à jour automatiquement demain. L'épée-bocle apparaît encore dans un créneau (« Épée longue · épée-bocle ») : soit on la recrée avec `visible: false` (elle reste sélectionnable dans les créneaux), soit on la réaffiche. **À trancher.** |
| 3 | Bandeau de test « bon jour je suis un test » / `bonjour.com` resté dans KV | Supprimé. Le nouveau bandeau vient d'une annonce épinglée : rien à migrer, la collection `annonces` démarre vide. |
| 4 | Coquilles dans le texte du prof | Corrigées à la migration, voir §8.3. |
| 5 | Sections encore sur le seed (`hero`, `galerie`, `faq`, `footer`, `legal`) | Reprises telles quelles sauf corrections ci-dessus ; la galerie est remplacée par les nouvelles photos de la maquette. |

### 8.3 Corrections de texte à appliquer à la migration

| Où | Avant | Après |
| --- | --- | --- |
| Discipline · Combat viking | avec une **equipe** qui axe | avec une **équipe** qui axe |
| Discipline · Épée longue | tradition germanique de **Maitre** Johannes Liechtenauer | de **maître** Johannes Liechtenauer |
| Discipline · Épée longue | ce sont les **maitres mots** | ce sont les **maîtres mots** |
| Rigueur | Les sources sont **a la base** de notre travail | sont **à la base** de notre travail |
| Rigueur | avec **différent niveau** d'engagement | avec **différents niveaux** d'engagement |
| Rejoindre · bloc 01 | Les deux **premieres** séances | les deux **premières** séances |
| Partenaires · Faits d'Armes | il est **a deux pas** d'ici | il est **à deux pas** d'ici |
| Partenaires · Black Armoury | produits aujourd'hui exclusifs **a sa marque** | exclusifs **à sa marque** |
| Partenaires · Black Armoury | la Veste Arcem **notament** | la Veste Arcem **notamment** |
| Partenaires · Black Armoury | l'un des produits les mieux **désigné** | l'un des produits les mieux **conçus** |
| Partenaires · Black Armoury | production d'**equipement** | production d'**équipement** |
| Tournois · faits | épée de **coté** | épée de **côté** |
| FAQ · lede | lien vers `c.sillac@protonmail.com` | `{email}` |
| FAQ · adhésion | « 85 € pour la saison 2025-2026 » | « {tarif} pour la saison {saison} » |
| FAQ · créneaux | « Mardi 18h-20h et jeudi 18h-22h au Gymnase Robert Pras… » | « {creneaux}, au {lieu}, {adresse}. » + détail par créneau. `{creneaux}` distingue désormais les cours de la pratique libre : « jeudi 18h-22h » promettait quatre heures de cours là où les deux premières sont une salle ouverte sans encadrant |
| Mentions légales | Hébergement : Cloudflare **Workers** | Hébergement : Cloudflare **Pages** |

Les corrections portent sur l'orthographe et les données obsolètes, jamais sur le ton :
le texte du prof (tutoiement, « Viens, ça nous fait plaisir ») est conservé tel quel.

### 8.4 Inventaire de départ après migration

| Collection | Entrées créées |
| --- | --- |
| `ecoles` | 1 — `clermont-ferrand` |
| `disciplines` | 4 visibles (`combat-viking`, `epee-longue`, `messer`, `rapiere`) + `epee-bocle` masquée (à trancher) |
| `profs` | 3 — `marie-poignant`, `gabriel-tardio` (mis en avant), `ludwig-fort` |
| `partenaires` | 3 — `ffamhe`, `faits-d-armes`, `black-armoury` |
| `faq` | 8 |
| `galerie` | 1 album « Vie de salle » (6 photos de `maquette-assets/`) |
| `articles` | 0 |
| `annonces` | 0 |

---

## 9. Extensions prévues (non implémentées maintenant)

Pensées dans le modèle, à activer sans refonte :

- **`evenements`** — tournois, stages et portes ouvertes datés (titre, dates, lieu, arme,
  inscription, école). Aujourd'hui le singleton `tournois` tient un discours général ;
  une collection sera nécessaire dès qu'il faudra un agenda.
- **Fiche prof multi-écoles** — un prof intervenant dans deux écoles : passer `ecole` en
  `multiRelationship`. Changement de schéma sans changement de gabarit.
- **Albums par événement** — la collection `galerie` le permet déjà (un album = un événement).
- **Traductions** — hors périmètre ; nécessiterait un préfixe de langue sur les chemins.
