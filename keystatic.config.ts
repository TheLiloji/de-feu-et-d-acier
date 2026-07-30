import { collection, config, fields, singleton } from '@keystatic/core';
import {
  ECOLES,
  ECOLE_PRINCIPALE,
  MULTI,
  libelleEcole,
  type EcoleConfig,
} from './src/config/ecoles';
import {
  ACCENT,
  RACCOURCIS,
  cadrage,
  champsVideo,
  enTete,
  imageEditoriale,
  imageLogo,
  lien,
  ordre,
  photo,
  photoDecorative,
  planchePatrimoniale,
  visible,
} from './src/cms/champs';
import { widgetsDeCorps } from './src/cms/widgets';

// ───────────────────────────────────────────────────────────────────────────
//  Stockage : fichiers locaux en dev, commits GitHub en prod.
//  Cf. stack-notes.md §1.2 — le contenu vit dans git, historique et rollback
//  gratuits, mais chaque « Enregistrer » = 1 commit + 1 rebuild.
// ───────────────────────────────────────────────────────────────────────────
//  En dev, PUBLIC_KEYSTATIC_STORAGE=github force le mode GitHub — sert à
//  l'assistant de création de la GitHub App et à tester l'auth en local.
//  (Préfixe PUBLIC_ obligatoire : ce fichier est aussi bundlé côté client,
//  et Vite n'expose à import.meta.env que les variables préfixées.)
const storage =
  import.meta.env.PROD || import.meta.env.PUBLIC_KEYSTATIC_STORAGE === 'github'
    ? ({ kind: 'github', repo: 'TheLiloji/de-feu-et-d-acier' } as const)
    : ({ kind: 'local' } as const);

// ───────────────────────────────────────────────────────────────────────────
//  Champs de texte
//
//  Les helpers de schéma communs — photo, cadrage, champs vidéo, lien, ordre,
//  en-tête de section… — vivent dans `src/cms/champs.ts`, et les six widgets
//  de corps libre dans `src/cms/widgets.ts`. Ne restent ici que les deux
//  gabarits de texte riche : ils dépendent des clés de collection que ce
//  fichier déplie, ce que le module des widgets ne peut pas connaître.
//  Cf. docs/refonte/widgets.md §3 et §6.
// ───────────────────────────────────────────────────────────────────────────

/**
 * Rappel des blocs insérables, ajouté à la description des quatre corps libres.
 * Le menu d’insertion existe déjà dans l’éditeur, mais rien ne le signale à
 * qui ne l’a jamais cliqué — et c’est toute la composition libre des pages.
 */
const BLOCS =
  'Le bouton « + » de la barre d’outils insère un bloc là où se trouve le curseur : galerie de photos, vidéo, questions-réponses, renvoi vers une autre page du site, bouton, planche de traité. Texte et blocs s’enchaînent dans l’ordre que vous voulez. Mode d’emploi : GUIDE-ADMIN.md, § 6.';

/**
 * Les deux collections d’école visées par les listes déroulantes du widget
 * « Renvoi vers une page du site ». Un encadrant et un article appartiennent à
 * une école ; une arme et un traité sont communs à toute l’association.
 */
interface CiblesRenvoi {
  /** Clé de la collection des encadrants, ex. `profs_clermont`. */
  profs: string;
  /** Clé de la collection des articles, ex. `articles_clermont`. */
  articles: string;
}

/**
 * Corps libre : texte riche **et** widgets insérables. Les quatre gabarits de
 * contenu long du site — biographie d’un encadrant, description longue d’une
 * arme, contenu d’un article, présentation d’un traité.
 *
 * ⚠️ Les quatre champs déclarent **le même jeu de widgets**, à dessein : un tag
 * présent dans un fichier mais absent du champ qui le relit rend l’entrée
 * impossible à ouvrir dans l’admin (widgets.md §1.6). Le jour où un cinquième
 * gabarit accueille des widgets, il passe par ce helper, pas par un autre.
 */
const corpsLibre = (
  label: string,
  dossierImages: string,
  cibles: CiblesRenvoi,
  description?: string,
) =>
  fields.markdoc({
    label,
    description: description ? `${description} ${BLOCS}` : BLOCS,
    options: {
      heading: [2, 3],
      bold: true,
      italic: true,
      link: true,
      blockquote: true,
      orderedList: true,
      unorderedList: true,
      divider: true,
      table: false,
      code: false,
      codeBlock: false,
      strikethrough: false,
      image: {
        directory: `src/assets/photos/${dossierImages}`,
        publicPath: `/src/assets/photos/${dossierImages}/`,
      },
    },
    components: widgetsDeCorps({
      dossierImages,
      collectionProfs: cibles.profs,
      collectionArticles: cibles.articles,
    }),
  });

/**
 * Les cibles de renvoi depuis un contenu **commun** (armes, traités).
 *
 * Un contenu commun n’appartient à aucune école, alors que les encadrants et
 * les articles, eux, en ont une : le dossier EST l’école (ARCHITECTURE.md §3).
 * On vise donc l’école principale, celle qui est servie sur « / ». Aujourd’hui
 * elle est la seule ; le jour où une deuxième salle ouvre, deux options
 * resteront ouvertes — retirer ces deux types des corps communs, ou résoudre le
 * renvoi vers l’école de la page servie. À trancher à ce moment-là.
 */
const CIBLES_COMMUNES: CiblesRenvoi = {
  profs: `profs_${ECOLE_PRINCIPALE.slug}`,
  articles: `articles_${ECOLE_PRINCIPALE.slug}`,
};

/** Texte riche court : gras, italique, liens. Pas de titre, pas d'image. */
const texteRiche = (label: string, description?: string) =>
  fields.markdoc({
    label,
    description,
    options: {
      heading: false,
      bold: true,
      italic: true,
      link: true,
      unorderedList: true,
      orderedList: true,
      blockquote: false,
      divider: false,
      table: false,
      code: false,
      codeBlock: false,
      strikethrough: false,
      image: false,
    },
  });

// ───────────────────────────────────────────────────────────────────────────
//  Collections par école
//  Le dossier EST l'école : jamais de champ « École » à remplir.
//  Cf. multi-ecoles.md §4 (option A) et ARCHITECTURE.md §3.
// ───────────────────────────────────────────────────────────────────────────

const racine = (e: EcoleConfig) => `src/content/ecoles/${e.slug}`;

/**
 * Les cinq collections d'une école, sous leur nom générique. Le suffixe
 * (`profs_clermont`…) est ajouté à l'assemblage : c'est là que le typage
 * littéral des clés est déclaré, en types mappés — TypeScript ne sait pas le
 * déduire depuis le corps d'une fonction.
 */
function collectionsEcole(e: EcoleConfig) {
  const dossierPhotos = e.slug;

  // Les encadrants et les articles vers lesquels un corps de cette école peut
  // renvoyer : les siens.
  const cibles: CiblesRenvoi = {
    profs: `profs_${e.slug}`,
    articles: `articles_${e.slug}`,
  };

  return {
    profs: collection({
      label: libelleEcole('Encadrants', e),
      path: `${racine(e)}/profs/*`,
      slugField: 'nom',
      format: { data: 'yaml', contentField: 'bio' },
      entryLayout: 'content',
      columns: ['nom', 'accroche'],
      schema: {
        nom: fields.slug({
          name: { label: 'Nom complet', validation: { isRequired: true } },
        }),
        prenom: fields.text({
          label: 'Prénom',
          description: 'Affiché seul sur les cartes mobiles.',
        }),
        visible,
        misEnAvant: fields.checkbox({
          label: 'Mis en avant',
          description: 'Carte agrandie sur l’accueil. Réservé au référent principal.',
          defaultValue: false,
        }),
        portrait: photo('Portrait', dossierPhotos),
        armes: fields.multiRelationship({
          label: 'Armes enseignées',
          collection: 'disciplines',
          description: 'Affichées en spécialité au-dessus du nom, sur la carte de l’accueil.',
        }),
        accroche: fields.text({
          label: 'Accroche',
          description: 'Une ligne, sous le nom. Ex. « Rapière française & italienne · bolonaise ».',
          validation: { length: { max: 90 } },
        }),
        bio: corpsLibre('Biographie', dossierPhotos, cibles),
        lienExterne: lien('Lien externe (facultatif)', 'Profil HEMA Ratings, site personnel…'),
        interview: fields.array(
          fields.object({
            question: fields.text({ label: 'Question' }),
            reponse: fields.text({ label: 'Réponse', multiline: true }),
          }),
          {
            label: 'Interview',
            description: 'Le bloc reste masqué sur le site tant qu’aucune question n’est saisie.',
            itemLabel: (p) => p.fields.question.value || 'Question',
          },
        ),
        video: fields.object(
          {
            titre: fields.text({
              label: 'Titre affiché',
              description:
                'Ce que la vidéo montre : « En combat · saison 2025-2026 », « L’interview en vidéo »… Vide : « En vidéo ».',
            }),
            url: champsVideo.url,
            duree: fields.text({ label: 'Durée', description: 'Ex. 06:24' }),
            vignette: imageEditoriale('Vignette', dossierPhotos),
            sousTitres: champsVideo.sousTitres,
            affiche: champsVideo.affiche,
          },
          {
            label: 'Vidéo (facultatif)',
            description:
              'Interview, extrait de combat, highlight de tournoi… Le bloc reste masqué sur le site tant que l’adresse est vide. La vidéo est lue sur la page, sans lecteur YouTube.',
          },
        ),
        ordre,
      },
    }),

    annonces: collection({
      label: libelleEcole('Annonces (messages courts)', e),
      path: `${racine(e)}/annonces/*`,
      slugField: 'titre',
      format: { data: 'yaml' },
      columns: ['titre', 'date'],
      schema: {
        titre: fields.slug({
          name: {
            label: 'Titre court',
            validation: { isRequired: true, length: { max: 60 } },
          },
        }),
        date: fields.date({
          label: 'Date de l’annonce',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        message: fields.text({
          label: 'Message',
          multiline: true,
          description: `Une à deux phrases. ${RACCOURCIS}`,
          validation: { length: { max: 240 } },
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
          label: 'Épingler en bandeau',
          description:
            'Affiche l’annonce tout en haut du site, au-dessus du menu. Une seule annonce à la fois : la plus récente gagne.',
          defaultValue: false,
        }),
        dateFin: fields.date({
          label: 'Retirer automatiquement le',
          description:
            'Après cette date, l’annonce disparaît du site à la prochaine publication. Laisser vide pour la retirer à la main.',
        }),
      },
    }),

    articles: collection({
      label: libelleEcole('Articles (actualités)', e),
      path: `${racine(e)}/articles/*`,
      slugField: 'titre',
      format: { data: 'yaml', contentField: 'corps' },
      entryLayout: 'content',
      columns: ['titre', 'date'],
      schema: {
        titre: fields.slug({ name: { label: 'Titre', validation: { isRequired: true } } }),
        date: fields.date({
          label: 'Date de publication',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        statut: fields.select({
          label: 'Statut',
          description:
            'Un brouillon n’est pas affiché sur le site et n’a pas d’adresse. Attention : il est tout de même enregistré dans le dépôt, qui est public — écrire un brouillon, ce n’est pas écrire en privé.',
          options: [
            { label: 'Brouillon (pas encore affiché sur le site)', value: 'brouillon' },
            { label: 'Publié', value: 'publie' },
          ],
          defaultValue: 'brouillon',
        }),
        chapo: fields.text({
          label: 'Chapô',
          multiline: true,
          description:
            'Deux ou trois lignes, affichées sur la carte et dans les résultats de recherche Google.',
          validation: { length: { max: 280 } },
        }),
        couverture: photo('Image de couverture', dossierPhotos),
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
        auteur: fields.relationship({
          label: 'Écrit par',
          collection: `profs_${e.slug}`,
          description: 'Facultatif.',
        }),
        epingle: fields.checkbox({
          label: 'Mettre à la une',
          description: 'Remonte l’article en tête de la page « Actualités ».',
          defaultValue: false,
        }),
        corps: corpsLibre('Contenu', dossierPhotos, cibles),
        galerie: fields.array(photo('Photo', dossierPhotos), {
          label: 'Photos de l’article',
          itemLabel: (p) => p.fields.alt.value || 'Photo',
        }),
        liens: fields.array(
          fields.object({
            libelle: fields.text({ label: 'Texte' }),
            url: fields.text({ label: 'Adresse' }),
          }),
          { label: 'Liens utiles', itemLabel: (p) => p.fields.libelle.value || 'Lien' },
        ),
      },
    }),

    faq: collection({
      label: libelleEcole('Questions fréquentes (locales)', e),
      path: `${racine(e)}/faq/*`,
      slugField: 'question',
      format: { data: 'yaml', contentField: 'reponse' },
      columns: ['question', 'categorie'],
      schema: {
        question: fields.slug({ name: { label: 'Question', validation: { isRequired: true } } }),
        visible,
        reponse: texteRiche(
          'Réponse',
          `Écrire les valeurs avec des raccourcis plutôt qu’en clair, pour qu’elles restent à jour toutes seules. ${RACCOURCIS}`,
        ),
        categorie: fields.select({
          label: 'Catégorie',
          options: [
            { label: 'Débuter', value: 'debuter' },
            { label: 'Sécurité', value: 'securite' },
            { label: 'Déroulé des séances', value: 'seances' },
            { label: 'Tarifs & inscription', value: 'tarifs' },
            { label: 'Compétition', value: 'competition' },
          ],
          defaultValue: 'tarifs',
        }),
        miseEnAvant: fields.checkbox({
          label: 'Afficher en premier',
          description: 'Le mobile met en avant trois questions : cocher les plus utiles.',
          defaultValue: false,
        }),
        ordre,
      },
    }),

    galerie: collection({
      label: libelleEcole('Albums photo', e),
      path: `${racine(e)}/galerie/*`,
      slugField: 'titre',
      format: { data: 'yaml' },
      columns: ['titre', 'date'],
      schema: {
        titre: fields.slug({ name: { label: 'Titre de l’album', validation: { isRequired: true } } }),
        visible,
        date: fields.date({ label: 'Date', defaultValue: { kind: 'today' } }),
        surAccueil: fields.checkbox({
          label: 'Album affiché sur l’accueil',
          description:
            'Les six premières photos alimentent la mosaïque de la page d’accueil. Un seul album à la fois.',
          defaultValue: false,
        }),
        photos: fields.array(
          fields.object({
            fichier: imageEditoriale('Photo', dossierPhotos),
            legende: fields.text({
              label: 'Légende',
              description: 'Affichée au survol de la tuile. Ex. « À l’assaut ».',
            }),
            alt: fields.text({ label: 'Description de l’image' }),
            cadrage,
            credit: fields.text({
              label: 'Crédit photo (facultatif)',
              description:
                'Le nom seul — le « © » est ajouté automatiquement. Ex. « Alexandre Vergne — L’IMAGINARIUM ».',
            }),
          }),
          { label: 'Photos', itemLabel: (p) => p.fields.legende.value || 'Photo' },
        ),
      },
    }),
  };
}

// ───────────────────────────────────────────────────────────────────────────
//  Singleton « fiche école » — la source unique du lieu, du contact,
//  des créneaux et du tarif. Tout le reste du site s'y réfère par raccourcis.
// ───────────────────────────────────────────────────────────────────────────

function singletonEcole(e: EcoleConfig) {
  return {
    ecole: singleton({
      label: libelleEcole('Lieu, contact, créneaux & tarifs', e),
      path: `${racine(e)}/ecole`,
      format: { data: 'yaml' },
      schema: {
        nom: fields.text({ label: 'Nom de l’école', defaultValue: e.nom }),
        ville: fields.text({
          label: 'Ville',
          defaultValue: e.ville,
          description: `Utilisée par le hero (« à ${e.ville} ») et le balisage Google.`,
        }),
        statut: fields.select({
          label: 'Statut',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Ouverture prochaine', value: 'bientot' },
            { label: 'Archivée', value: 'archivee' },
          ],
          defaultValue: 'active',
        }),
        presentation: fields.text({
          label: 'Phrase de présentation (facultatif)',
          multiline: true,
          description: 'Laisser vide pour utiliser le texte commun de la section « Le club ».',
        }),
        lieu: fields.object(
          {
            nom: fields.text({ label: 'Nom du lieu' }),
            adresse: fields.text({ label: 'Adresse (rue)' }),
            codePostal: fields.text({ label: 'Code postal' }),
            ville: fields.text({ label: 'Ville' }),
            itineraire: fields.text({
              label: 'Lien « Itinéraire »',
              description: 'Lien Google Maps ou OpenStreetMap ouvrant l’itinéraire.',
            }),
            latitude: fields.text({
              label: 'Latitude',
              description: 'Ex. 45.7772. Sert au balisage Google.',
            }),
            longitude: fields.text({ label: 'Longitude', description: 'Ex. 3.0870.' }),
            // Le plan schématique dessiné en SVG a été retiré : à sa place, une
            // vraie photo du lieu. Tant qu'elle n'est pas déposée, le bloc
            // « Lieu & contact » se rend en version compacte — adresse, contact,
            // bouton « Itinéraire », et rien d'autre. Aucun cadre vide.
            photo: fields.object(
              {
                fichier: imageEditoriale(
                  'Photo du lieu',
                  e.slug,
                  'L’entrée du gymnase, pour que les nouveaux la reconnaissent. Photo en largeur de préférence : elle s’affiche dans un bandeau. JPEG déjà préparé, 2400 px maximum sur le grand côté.',
                ),
                alt: fields.text({
                  label: 'Description de l’image',
                  description:
                    'Lue à voix haute par les lecteurs d’écran, et affichée si la photo ne charge pas. Ex. « L’entrée vitrée du gymnase Robert Pras, depuis la rue ».',
                }),
                cadrage,
              },
              { label: 'Photo du lieu' },
            ),
            photosInterieur: fields.array(
              fields.object({
                fichier: imageEditoriale(
                  'Photo',
                  e.slug,
                  'Une vue de l’intérieur : la salle, le tapis, les vestiaires. JPEG déjà préparé, 2400 px maximum sur le grand côté.',
                ),
                alt: fields.text({
                  label: 'Description de l’image',
                  description:
                    'Lue à voix haute par les lecteurs d’écran. Ex. « La grande salle et son plancher, masques alignés au mur ».',
                }),
              }),
              {
                label: 'Photos de l’intérieur',
                description:
                  'Visibles dans une visionneuse, au clic sur la photo du lieu ci-dessus. Sans photo du lieu, elles ne s’affichent pas.',
                itemLabel: (p) => p.fields.alt.value || 'Photo de l’intérieur',
              },
            ),
          },
          { label: 'Lieu d’entraînement' },
        ),
        contact: fields.object(
          {
            email: fields.text({
              label: 'E-mail',
              description: 'Le seul mail affiché sur le site — repris par le raccourci {email}.',
              validation: {
                pattern: { regex: /.+@.+\..+/, message: 'Adresse e-mail invalide' },
              },
            }),
            telephone: fields.text({
              label: 'Téléphone',
              description: 'Format affiché, ex. 06 61 28 65 11. Le lien « tel: » est déduit.',
            }),
            responsable: fields.text({
              label: 'Directeur / directrice de publication',
              description: 'Nommé·e dans les mentions légales, sans coordonnées personnelles.',
            }),
            fonction: fields.text({ label: 'Fonction', defaultValue: 'Présidente de section' }),
          },
          { label: 'Contact' },
        ),
        adhesion: fields.object(
          {
            montant: fields.integer({ label: 'Adhésion annuelle (€)', defaultValue: 85 }),
            saison: fields.text({ label: 'Saison', defaultValue: '2025-2026' }),
            lienInscription: fields.text({ label: 'Lien d’adhésion (HelloAsso)' }),
            aPrevoir: fields.array(fields.text({ label: 'Équipement' }), {
              label: 'À se procurer soi-même',
              itemLabel: (p) => p.value || 'Équipement',
            }),
          },
          { label: 'Adhésion & tarifs' },
        ),
        essai: fields.object(
          {
            seancesOffertes: fields.integer({ label: 'Séances d’essai offertes', defaultValue: 2 }),
            materielPrete: fields.checkbox({
              label: 'Matériel prêté pour l’essai',
              defaultValue: true,
            }),
          },
          { label: 'Séances d’essai' },
        ),
        creneaux: fields.array(
          fields.object({
            jour: fields.select({
              label: 'Jour',
              options: [
                { label: 'Lundi', value: 'lundi' },
                { label: 'Mardi', value: 'mardi' },
                { label: 'Mercredi', value: 'mercredi' },
                { label: 'Jeudi', value: 'jeudi' },
                { label: 'Vendredi', value: 'vendredi' },
                { label: 'Samedi', value: 'samedi' },
                { label: 'Dimanche', value: 'dimanche' },
              ],
              defaultValue: 'mardi',
            }),
            heureDebut: fields.text({
              label: 'Début',
              defaultValue: '18:00',
              validation: { pattern: { regex: /^\d{2}:\d{2}$/, message: 'Format HH:MM' } },
            }),
            heureFin: fields.text({
              label: 'Fin',
              defaultValue: '20:00',
              validation: { pattern: { regex: /^\d{2}:\d{2}$/, message: 'Format HH:MM' } },
            }),
            armes: fields.multiRelationship({
              label: 'Armes travaillées',
              collection: 'disciplines',
            }),
            intitule: fields.text({
              label: 'Intitulé libre',
              description: 'Ex. « Pratique libre ». Prioritaire sur la liste d’armes.',
            }),
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
          {
            label: 'Créneaux hebdomadaires',
            itemLabel: (p) =>
              `${p.fields.jour.value} ${p.fields.heureDebut.value}–${p.fields.heureFin.value}`,
          },
        ),
        reseaux: fields.object(
          {
            facebook: fields.text({ label: 'Facebook' }),
            instagram: fields.text({ label: 'Instagram' }),
            hemaRatings: fields.text({ label: 'HEMA Ratings (fiche club)' }),
            helloAsso: fields.text({ label: 'HelloAsso (association)' }),
          },
          { label: 'Liens & réseaux' },
        ),
        affiliation: fields.object(
          {
            // Pas de nom de club en dur : la fabrique sert toutes les écoles,
            // et une deuxième salle n'aurait aucune raison de dépendre de l'USAM
            // Clermont-Ferrand.
            club: fields.text({ label: 'Club support' }),
            lienClub: fields.text({ label: 'Site du club support' }),
            federation: fields.text({ label: 'Fédération', defaultValue: 'FFAMHE' }),
            lienFederation: fields.text({ label: 'Site de la fédération' }),
          },
          { label: 'Affiliation' },
        ),
        photoHero: photo('Photo d’en-tête (facultatif)', e.slug),
        legal: fields.object(
          {
            siege: fields.text({
              label: 'Siège (si différent du lieu d’entraînement)',
              multiline: true,
            }),
          },
          { label: 'Mentions légales locales' },
        ),
      },
    }),
  };
}

// ───────────────────────────────────────────────────────────────────────────
//  Contenu commun (association) — écrit une fois, servi partout.
// ───────────────────────────────────────────────────────────────────────────

const collectionsCommunes = {
  disciplines: collection({
    label: 'Armes & disciplines',
    path: 'src/content/commun/disciplines/*',
    slugField: 'nom',
    format: { data: 'yaml', contentField: 'description' },
    entryLayout: 'content',
    columns: ['nom', 'epoque'],
    schema: {
      nom: fields.slug({ name: { label: 'Nom de l’arme', validation: { isRequired: true } } }),
      affichee: fields.checkbox({
        label: 'Affichée dans la grille des armes',
        description:
          'Décocher pour garder l’arme sélectionnable dans les créneaux et les fiches de profs, sans lui donner de carte sur l’accueil (cas de l’épée-bocle).',
        defaultValue: true,
      }),
      sousTitre: fields.text({ label: 'Sous-titre', validation: { length: { max: 60 } } }),
      epoque: fields.text({ label: 'Époque', description: 'Ex. « Médiévale », « Renaissance ».' }),
      dates: fields.text({ label: 'Siècles', description: 'Ex. « XIVᵉ — XVᵉ s. »' }),
      photo: photo('Photo de l’arme', 'commun'),
      resume: fields.text({
        label: 'Chapô de la fiche arme',
        multiline: true,
        description:
          'Le paragraphe d’accroche en haut de la fiche, qui sert AUSSI de description du site pour Google. Une phrase complète, qui se suffit à elle-même. ⚠️ Ne pas y reprendre les premières phrases de la « Description longue » ci-dessous : elles s’afficheraient deux fois à deux blocs d’intervalle. Le chapô situe l’arme, la description la raconte. (La carte d’accueil, elle, affiche le sous-titre.)',
        validation: { length: { max: 300 } },
      }),
      description: corpsLibre('Description longue (fiche arme)', 'commun', CIBLES_COMMUNES),
      miniCours: fields.array(
        fields.object({
          titre: fields.text({
            label: 'Titre de la leçon',
            description: 'Ex. « Leçon 01 — Les gardes ».',
          }),
          sousTitre: fields.text({
            label: 'Sous-titre',
            description: 'Ex. « Bases · posture & distances ».',
          }),
          duree: fields.text({ label: 'Durée', description: 'Ex. 04:12' }),
          video: champsVideo.url,
          vignette: imageEditoriale('Vignette', 'commun'),
          sousTitres: champsVideo.sousTitres,
          affiche: champsVideo.affiche,
        }),
        {
          label: 'Mini-cours (vidéos)',
          description: 'Le bloc reste masqué sur la fiche arme tant qu’aucune leçon n’est saisie.',
          itemLabel: (p) => p.fields.titre.value || 'Leçon',
        },
      ),
      // Plus de champ image ici : la planche, sa description et sa ligne de
      // crédit viennent toutes les trois de la fiche du traité (« Les sources »),
      // parce qu'elles sont inséparables — déposer une image quelconque à côté
      // d'un crédit de bibliothèque serait une fausse attribution. Restent les
      // trois champs de la voix du club : titre, texte, et une surcharge de lien
      // pour les cas où l'on veut envoyer ailleurs que sur la fiche du traité.
      source: fields.object(
        {
          titre: fields.text({ label: 'Titre', defaultValue: 'Des traités aux assauts.' }),
          texte: fields.text({ label: 'Texte', multiline: true }),
          lien: lien(
            'Bouton « Étudier la source »',
            'Facultatif. Laisser vide envoie sur la fiche du traité de cette arme, dans « Les sources » — c’est ce qu’on veut presque toujours.',
          ),
        },
        {
          label: 'Encadré « La source »',
          description:
            'Le texte du club sur ce que la source apporte à l’arme. La planche, sa description et son crédit sont pris sur la fiche du traité : rien à déposer ici.',
        },
      ),
      ordre,
    },
  }),

  traites: collection({
    label: 'Les sources (traités historiques)',
    path: 'src/content/commun/traites/*',
    slugField: 'titre',
    format: { data: 'yaml', contentField: 'presentation' },
    entryLayout: 'content',
    columns: ['titre', 'auteur', 'annee'],
    schema: {
      titre: fields.slug({
        name: {
          label: 'Titre du traité',
          description:
            'Le titre tel qu’il figure sur l’ouvrage. Ex. « Fechtbuch von 1467 », « La noble science des joueurs d’espée ».',
          validation: { isRequired: true },
        },
        slug: {
          label: 'Adresse de la fiche',
          description:
            'La fin de l’adresse web, et le nom du fichier. Ex. « talhoffer-1467 ». À ne plus changer une fois la fiche en ligne : les liens déjà partagés cesseraient de fonctionner.',
        },
      }),
      auteur: fields.text({
        label: 'Auteur',
        description:
          'Le nom du maître d’armes, ou « Anonyme » suivi de ce que l’on sait. L’imprimeur ou le traducteur peuvent être précisés à la suite.',
      }),
      annee: fields.text({
        label: 'Année',
        description:
          'Texte libre, pour pouvoir rester prudent : « 1467 », « vers 1470 », « vers 1300-1330 ».',
      }),
      tradition: fields.text({
        label: 'Tradition / école',
        multiline: true,
        description:
          'À quelle école d’escrime le traité appartient. Ex. « Tradition germanique de Johannes Liechtenauer », « École bolonaise ».',
      }),
      bibliotheque: fields.text({
        label: 'Bibliothèque de conservation',
        description: 'L’institution qui conserve l’exemplaire numérisé. Ex. « Bibliothèque nationale de France ».',
      }),
      cote: fields.text({
        label: 'Cote',
        description: 'Le numéro d’inventaire du document dans cette bibliothèque. Ex. « Cgm 582 », « MS I.33 ».',
      }),
      urlNumerisation: fields.text({
        label: 'Lien vers la numérisation',
        description:
          'L’adresse de la numérisation en ligne, chez la bibliothèque. C’est le lien « consulter la source » de la fiche.',
      }),
      licence: fields.object(
        {
          resume: fields.text({
            label: 'Ce que la licence autorise, en clair',
            multiline: true,
            description:
              'Une ou deux phrases en français simple. Ex. « Domaine public : copie et diffusion libres, la bibliothèque demande seulement d’être citée. »',
          }),
          url: fields.text({
            label: 'Adresse de la licence',
            description:
              'Obligatoire : le lien vers le texte de la licence ou les conditions d’utilisation de la bibliothèque. Sans lui, le site n’est plus en règle et le build s’arrête.',
          }),
        },
        {
          label: 'Droits d’utilisation',
          description:
            'Ce qui autorise le club à publier les planches. Ne rien saisir ici sans avoir lu la page de conditions de la bibliothèque.',
        },
      ),
      armes: fields.multiRelationship({
        label: 'Armes concernées',
        collection: 'disciplines',
        description:
          'Les disciplines qui travaillent ce traité. La fiche du traité remonte alors sur la fiche de chacune de ces armes. L’épée-bocle est sélectionnable même si elle n’a pas de carte sur l’accueil.',
      }),
      extraitCitation: fields.text({
        label: 'Court extrait du traité (facultatif)',
        multiline: true,
        description:
          'Quelques lignes seulement, dans la langue d’origine (moyen français, allemand…), au titre de la courte citation. Jamais un chapitre entier, jamais une traduction moderne dont on n’a pas les droits.',
      }),
      extraitCredit: fields.text({
        label: 'Crédit de l’extrait',
        description:
          'Qui a établi le texte cité. Ex. « Transcription ARDAMHE, hébergée par la FFAMHE ». Obligatoire dès qu’un extrait est saisi.',
      }),
      extraitUrl: fields.text({
        label: 'Lien vers la page de l’extrait',
        description: 'L’adresse exacte de la page d’où l’extrait est repris.',
      }),
      planches: fields.array(
        fields.object({
          image: imageEditoriale(
            'Fichier de la planche',
            'commun/sources',
            'La planche déjà préparée : 2400 px maximum sur le grand côté, moins de 1,5 Mo. Ne jamais déposer le fichier brut téléchargé chez la bibliothèque.',
          ),
          alt: fields.text({
            label: 'Description de la planche',
            multiline: true,
            description:
              'Obligatoire. Ce que la gravure montre, lu à voix haute par les lecteurs d’écran. Ex. « Deux escrimeurs à l’épée longue, épées croisées au-dessus de leurs têtes ». Sans elle, le build s’arrête.',
          }),
          legende: fields.text({
            label: 'Légende',
            multiline: true,
            description:
              'Le texte affiché sous la planche : ce qu’elle représente, et ce qu’elle apprend. Ne décrire que ce que l’on voit.',
          }),
          folio: fields.text({
            label: 'Folio ou page',
            description: 'L’emplacement de la planche dans l’ouvrage. Ex. « 33r », « f. 25v », « p. 51 ».',
          }),
          credit: fields.text({
            label: 'Crédit de la planche',
            multiline: true,
            description:
              'Obligatoire. La ligne de crédit exigée par la bibliothèque, à recopier telle quelle et à NE PAS modifier : elle contient le folio, la cote et la licence, et c’est elle qui rend la publication légale. En retirer un mot (par exemple « digitalisiert von Google ») met le club en faute. Sans elle, le build s’arrête.',
          }),
          majestueuse: fields.checkbox({
            label: 'Planche majestueuse',
            description:
              'À cocher pour la planche la plus spectaculaire du traité : c’est elle qui sera affichée en grand format.',
            defaultValue: false,
          }),
        }),
        {
          label: 'Planches',
          // Seul endroit de l'admin qui nomme le guide : Keystatic 0.6.3 ne
          // permet pas de description sur une collection ni sur un singleton
          // (cf. le type `Collection` / `Singleton`), et `ui.brand.mark` ferait
          // entrer React dans le bundle du Worker. Une description de champ est
          // donc le seul support disponible — et c'est ici qu'elle est le plus
          // utile, puisque c'est le seul écran où un prof peut mettre le club en
          // faute vis-à-vis d'une bibliothèque.
          description:
            'Les images du traité affichées sur le site. Chacune doit porter sa description et son crédit. Le mode d’emploi complet du site est le fichier GUIDE-ADMIN.md, à la racine du dépôt github.com/TheLiloji/de-feu-et-d-acier.',
          itemLabel: (p) => p.fields.folio.value || p.fields.alt.value || 'Planche',
        },
      ),
      presentation: corpsLibre(
        'Présentation',
        'commun',
        CIBLES_COMMUNES,
        'Trois à six phrases : de quelle tradition vient ce traité, ce qu’il contient, et pourquoi il parle aux armes travaillées au club. Rester sur ce que la source dit — pas d’enjolivement historique.',
      ),
      ordre,
    },
  }),

  partenaires: collection({
    label: 'Partenaires',
    path: 'src/content/commun/partenaires/*',
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
      logo: imageLogo('Logo'),
      logoAlt: fields.text({ label: 'Description du logo', description: 'Ex. « Logo de la FFAMHE ».' }),
      // La section « Partenaires » pose une pastille claire commune aux trois
      // logos, pour qu'ils aient le même traitement quelle que soit la façon
      // dont la marque livre son fichier. Un logo dessiné en blanc y serait
      // invisible : cette case le fait inverser. Décoché par défaut — c'est le
      // cas d'un logo normal, sombre sur fond clair, donc rien ne casse quand
      // un partenaire est ajouté sans y penser.
      logoClair: fields.checkbox({
        label: 'Logo blanc, à inverser sur fond clair',
        description:
          'À cocher si le dessin du logo est blanc (détouré, ou blanc sur un aplat noir). Dans le doute, laisser décoché et regarder le rendu.',
        defaultValue: false,
      }),
      texte: texteRiche('Présentation'),
      lien: lien('Bouton'),
      ordre,
    },
  }),

  faq: collection({
    label: 'Questions fréquentes (générales)',
    path: 'src/content/commun/faq/*',
    slugField: 'question',
    format: { data: 'yaml', contentField: 'reponse' },
    columns: ['question', 'categorie'],
    schema: {
      question: fields.slug({ name: { label: 'Question', validation: { isRequired: true } } }),
      visible,
      reponse: texteRiche(
        'Réponse',
        `Les questions qui parlent d’horaires, de lieu ou de tarif appartiennent à la FAQ de l’école, pas ici. ${RACCOURCIS}`,
      ),
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
        label: 'Afficher en premier',
        description: 'Le mobile met en avant trois questions : cocher les plus utiles.',
        defaultValue: false,
      }),
      ordre,
    },
  }),
};

// ───────────────────────────────────────────────────────────────────────────
//  Singletons communs
// ───────────────────────────────────────────────────────────────────────────

const singletonsCommuns = {
  identite: singleton({
    label: 'Identité du site',
    path: 'src/content/commun/identite',
    format: { data: 'yaml' },
    schema: {
      marque: fields.object(
        {
          debut: fields.text({ label: 'Mot 1', defaultValue: 'De' }),
          feu: fields.text({ label: 'Mot 2 (couleur feu)', defaultValue: 'Feu' }),
          connecteur: fields.text({ label: 'Mot 3 (italique)', defaultValue: "et d'" }),
          acier: fields.text({ label: 'Mot 4 (couleur acier)', defaultValue: 'Acier' }),
        },
        {
          label: 'Nom du club (logotype)',
          description:
            'Saisi une seule fois : le hero, le pied de page et les mentions légales le reprennent.',
        },
      ),
      baseline: fields.text({
        label: 'Baseline',
        defaultValue: 'Arts Martiaux Historiques Européens',
      }),
      description: fields.text({
        label: 'Description du site',
        multiline: true,
        description: 'Utilisée par Google et lors du partage d’un lien. 150 à 160 caractères.',
        validation: { length: { max: 320 } },
      }),
      imagePartage: imageEditoriale(
        'Image de partage (réseaux sociaux)',
        'commun',
        'JPEG 1200 × 630 px. Affichée quand quelqu’un partage un lien du site.',
      ),
      copyright: fields.text({
        label: 'Mention de bas de page',
        // La ville est déjà portée par la fiche d'école : la répéter ici la
        // figerait pour toutes les implantations.
        defaultValue: "© De Feu et d'Acier",
      }),
    },
  }),

  hero: singleton({
    label: 'Accueil · En-tête',
    path: 'src/content/commun/hero',
    format: { data: 'yaml' },
    schema: {
      photo: photo('Photo de fond', 'commun'),
      surTitre: fields.text({
        label: 'Sur-titre',
        defaultValue: 'Arts martiaux historiques européens',
      }),
      accroche: fields.text({
        label: 'Bandeau d’accroche',
        description: `Ex. « Mar · Jeu 18h–22h — essai offert ». ${RACCOURCIS}`,
      }),
      lieuTexte: fields.text({
        label: 'Ligne de lieu',
        description: 'Laisser vide pour afficher automatiquement « à {ville} ».',
      }),
      boutonPrincipal: lien('Bouton principal'),
      boutonSecondaire: lien('Bouton secondaire'),
      inviteDefilement: fields.text({
        label: 'Invite de défilement',
        defaultValue: 'Découvrir le club',
      }),
    },
  }),

  entetes: singleton({
    label: 'Accueil · Titres des sections',
    path: 'src/content/commun/entetes',
    format: { data: 'yaml' },
    schema: {
      actualites: enTete('Actualités'),
      disciplines: enTete(
        'Les disciplines',
        'Les raccourcis {nb_armes} et {nb_profs} se recalculent tout seuls : écrire « {nb_armes} armes, » plutôt que « Quatre armes, ».',
      ),
      profs: enTete('Les profs'),
      galerie: enTete('La galerie'),
      faq: enTete('Questions fréquentes'),
      partenaires: enTete('Partenaires'),
      // Seule rubrique qui ne titre pas une section de l'accueil mais une page à
      // part entière, « La bibliothèque » (/sources/). Elle est ici parce que
      // c'est là que le club vient chercher les titres du site, et que lui faire
      // un singleton pour quatre chaînes serait une case de plus dans le menu.
      sources: enTete(
        'Les sources',
        'Titres de la page « La bibliothèque » (/sources/), qui présente les traités étudiés au club.',
      ),
    },
  }),

  club: singleton({
    label: 'Accueil · Le club',
    path: 'src/content/commun/club',
    format: { data: 'yaml' },
    schema: {
      eyebrow: fields.text({ label: 'Sur-titre', defaultValue: 'Le club' }),
      titreLigne1: fields.text({ label: 'Titre — ligne 1' }),
      titreLigne2: fields.text({ label: 'Titre — ligne 2' }),
      titreLigne3: fields.text({ label: 'Titre — ligne 3 (facultatif)' }),
      texte: fields.text({ label: 'Texte', multiline: true, description: RACCOURCIS }),
      photo: photo('Photo', 'commun'),
      chiffres: fields.array(
        fields.object({
          valeur: fields.text({
            label: 'Valeur',
            description: 'Accepte les raccourcis {nb_armes} et {nb_profs}.',
          }),
          libelle: fields.text({ label: 'Libellé' }),
        }),
        { label: 'Chiffres clés', itemLabel: (p) => p.fields.libelle.value || 'Chiffre' },
      ),
      piliers: fields.array(
        fields.object({
          titre: fields.text({ label: 'Titre' }),
          texte: fields.text({ label: 'Texte', multiline: true }),
        }),
        {
          label: 'Piliers (3 maximum)',
          itemLabel: (p) => p.fields.titre.value || 'Pilier',
        },
      ),
    },
  }),

  rigueur: singleton({
    label: 'Accueil · La rigueur',
    path: 'src/content/commun/rigueur',
    format: { data: 'yaml' },
    schema: {
      eyebrow: fields.text({ label: 'Sur-titre', defaultValue: 'La rigueur' }),
      titreLigne1: fields.text({ label: 'Titre — ligne 1' }),
      titreLigne2: fields.text({ label: 'Titre — ligne 2' }),
      lede: fields.text({ label: 'Chapô', multiline: true }),
      texte: fields.text({ label: 'Texte', multiline: true }),
      lien: lien(
        'Bouton vers la bibliothèque',
        'Affiché sous le texte. Laisser l’adresse vide pour ne pas montrer de bouton.',
      ),
      planche: planchePatrimoniale('Planche de traité', 'commun'),
      legendePlanche: fields.text({
        label: 'Légende de la planche',
        multiline: true,
        description:
          'Ce que le club dit de la planche. La ligne de crédit de la bibliothèque, elle, se saisit dans « Planche de traité » : elle s’affiche juste en dessous, détachée par un filet.',
      }),
      manifesteMobile: fields.object(
        {
          citation: fields.text({ label: 'Citation', multiline: true }),
          sousTitre: fields.text({ label: 'Sous-titre' }),
          photo: photoDecorative(
            'Photo de fond',
            'commun',
            'Affichée derrière la citation, à 15 % de visibilité. C’est le plus souvent la planche ci-dessus : son crédit est alors celui du cadre, il n’est pas répété ici.',
          ),
        },
        {
          label: 'Écran « Manifesto » (mobile)',
          description: 'Bloc plein écran qui remplace la section « La rigueur » sur mobile.',
        },
      ),
    },
  }),

  rejoindre: singleton({
    label: 'Accueil · Nous rejoindre',
    path: 'src/content/commun/rejoindre',
    format: { data: 'yaml' },
    schema: {
      eyebrow: fields.text({ label: 'Sur-titre', defaultValue: 'Nous rejoindre' }),
      titreLigne1: fields.text({ label: 'Titre — ligne 1', description: ACCENT }),
      titreLigne2: fields.text({
        label: 'Titre — ligne 2',
        description: `Rendue en ember italique. ${ACCENT}`,
      }),
      blocEssai: fields.object(
        {
          eyebrow: fields.text({ label: 'Sur-titre', defaultValue: 'Viens essayer' }),
          titre: fields.text({ label: 'Titre', description: `${ACCENT} ${RACCOURCIS}` }),
          paragraphes: fields.array(fields.text({ label: 'Paragraphe', multiline: true }), {
            label: 'Paragraphes',
            itemLabel: (p) => p.value?.slice(0, 60) || 'Paragraphe',
          }),
          bouton: lien(
            'Bouton',
            'Laisser vide pour utiliser automatiquement le lien « Itinéraire » de l’école.',
          ),
        },
        { label: 'Bloc 01 — Venir essayer' },
      ),
      blocAdhesion: fields.object(
        {
          eyebrow: fields.text({ label: 'Sur-titre', defaultValue: 'Continuer' }),
          titre: fields.text({ label: 'Titre', description: `${ACCENT} ${RACCOURCIS}` }),
          paragraphes: fields.array(fields.text({ label: 'Paragraphe', multiline: true }), {
            label: 'Paragraphes',
            itemLabel: (p) => p.value?.slice(0, 60) || 'Paragraphe',
          }),
          bouton: lien(
            'Bouton',
            'Laisser vide pour utiliser automatiquement le lien d’adhésion de l’école.',
          ),
        },
        { label: 'Bloc 02 — Adhérer' },
      ),
      note: fields.text({
        label: 'Note sous les blocs',
        multiline: true,
        description: RACCOURCIS,
      }),
    },
  }),

  tournois: singleton({
    label: 'Accueil · Tournois & saison',
    path: 'src/content/commun/tournois',
    format: { data: 'yaml' },
    schema: {
      eyebrow: fields.text({ label: 'Sur-titre', defaultValue: 'Tournois' }),
      titreLigne1: fields.text({ label: 'Titre — ligne 1' }),
      titreLigne2: fields.text({ label: 'Titre — ligne 2' }),
      photo: photo('Photo', 'commun'),
      overlayEyebrow: fields.text({ label: 'Sur-titre incrusté sur la photo' }),
      overlayTitre: fields.text({ label: 'Accroche incrustée sur la photo' }),
      texte: fields.text({ label: 'Texte', multiline: true }),
      faits: fields.array(
        fields.object({
          titre: fields.text({ label: 'Libellé' }),
          texte: fields.text({ label: 'Valeur', multiline: true }),
        }),
        { label: 'Faits', itemLabel: (p) => p.fields.titre.value || 'Fait' },
      ),
      boutons: fields.array(
        fields.object({
          libelle: fields.text({ label: 'Texte du bouton' }),
          url: fields.text({ label: 'Adresse' }),
        }),
        { label: 'Boutons', itemLabel: (p) => p.fields.libelle.value || 'Bouton' },
      ),
    },
  }),

  fiches: singleton({
    label: 'Textes des fiches arme & prof',
    path: 'src/content/commun/fiches',
    format: { data: 'yaml' },
    schema: {
      arme: fields.object(
        {
          titre: fields.text({
            label: 'Titre du bandeau',
            description: '{arme} est remplacé par le nom de l’arme. Ex. « Envie de tester {arme} ? »',
          }),
          sousTitre: fields.text({
            label: 'Sous-titre',
            description: `Ex. « {essai} premières séances offertes — matériel prêté. » ${RACCOURCIS}`,
          }),
          bouton: lien('Bouton'),
        },
        { label: 'Bandeau de fin — fiche arme' },
      ),
      prof: fields.object(
        {
          titre: fields.text({
            label: 'Titre du bandeau',
            description: '{prof} est remplacé par le prénom. Ex. « S’entraîner avec {prof} ? »',
          }),
          sousTitre: fields.text({ label: 'Sous-titre', description: RACCOURCIS }),
          bouton: lien('Bouton'),
        },
        { label: 'Bandeau de fin — fiche prof' },
      ),
    },
  }),

  menus: singleton({
    label: 'Menus & pied de page',
    path: 'src/content/commun/menus',
    format: { data: 'yaml' },
    schema: {
      menuPrincipal: fields.array(
        fields.object({
          libelle: fields.text({ label: 'Libellé' }),
          lien: fields.text({ label: 'Ancre ou adresse', description: 'Ex. #disciplines' }),
        }),
        { label: 'Menu principal', itemLabel: (p) => p.fields.libelle.value || 'Entrée' },
      ),
      barreMobile: fields.array(
        fields.object({
          libelle: fields.text({ label: 'Libellé' }),
          icone: fields.select({
            label: 'Icône',
            options: [
              { label: 'Accueil', value: 'house' },
              { label: 'Armes', value: 'sword' },
              { label: 'Épées croisées', value: 'swords' },
              { label: 'Photos', value: 'image' },
              { label: 'Contact', value: 'phone' },
            ],
            defaultValue: 'house',
          }),
          lien: fields.text({ label: 'Ancre ou adresse' }),
        }),
        {
          label: 'Barre d’onglets mobile (5 maximum)',
          itemLabel: (p) => p.fields.libelle.value || 'Onglet',
        },
      ),
      colonnes: fields.array(
        fields.object({
          titre: fields.text({ label: 'Titre de la colonne' }),
          liens: fields.array(
            fields.object({
              libelle: fields.text({ label: 'Libellé' }),
              url: fields.text({
                label: 'Adresse',
                description:
                  'Laisser vide pour « Nous écrire » et « Adhésion » : le site utilise alors le contact et le lien d’adhésion de l’école.',
              }),
            }),
            { label: 'Liens', itemLabel: (p) => p.fields.libelle.value || 'Lien' },
          ),
        }),
        { label: 'Colonnes du pied de page', itemLabel: (p) => p.fields.titre.value || 'Colonne' },
      ),
      liensLegaux: fields.array(
        fields.object({
          libelle: fields.text({ label: 'Libellé' }),
          url: fields.text({ label: 'Adresse' }),
        }),
        { label: 'Liens légaux', itemLabel: (p) => p.fields.libelle.value || 'Lien' },
      ),
    },
  }),

  legal: singleton({
    label: 'Mentions légales & confidentialité',
    path: 'src/content/commun/legal',
    format: { data: 'yaml' },
    schema: {
      mentions: fields.object(
        {
          intro: fields.text({ label: 'Introduction', multiline: true, description: RACCOURCIS }),
          entrees: fields.array(
            fields.object({
              titre: fields.text({ label: 'Rubrique' }),
              texte: fields.text({ label: 'Texte', multiline: true, description: RACCOURCIS }),
            }),
            { label: 'Rubriques', itemLabel: (p) => p.fields.titre.value || 'Rubrique' },
          ),
          note: fields.text({ label: 'Note (droits photo)', multiline: true }),
        },
        {
          label: 'Mentions légales',
          description:
            'Le siège, le contact et les horaires ne se saisissent pas ici : ils viennent de la fiche école, via les raccourcis.',
        },
      ),
      hebergeur: fields.object(
        {
          nom: fields.text({ label: 'Nom', defaultValue: 'Cloudflare, Inc.' }),
          adresse: fields.text({
            label: 'Adresse',
            defaultValue: '101 Townsend St, San Francisco, CA 94107, USA',
          }),
        },
        { label: 'Hébergeur' },
      ),
      rgpd: fields.object(
        {
          paragraphes: fields.array(fields.text({ label: 'Paragraphe', multiline: true }), {
            label: 'Paragraphes',
            itemLabel: (p) => p.value?.slice(0, 60) || 'Paragraphe',
          }),
          note: fields.text({ label: 'Note', multiline: true, description: RACCOURCIS }),
        },
        { label: 'Confidentialité (RGPD)' },
      ),
    },
  }),
};

// ───────────────────────────────────────────────────────────────────────────
//  Assemblage
// ───────────────────────────────────────────────────────────────────────────

type EcoleEntree = (typeof ECOLES)[number];
type BaseCollectionsEcole = ReturnType<typeof collectionsEcole>;
type BaseSingletonsEcole = ReturnType<typeof singletonEcole>;

/**
 * Les clés réelles des collections, dépliées par école :
 * `profs_clermont`, `annonces_clermont`… et demain `profs_lyon`, etc.
 * Déclarées en types mappés pour que le Reader Keystatic reste typé côté Astro.
 */
type CollectionsEcoles = {
  [E in EcoleEntree as `profs_${E['slug']}`]: BaseCollectionsEcole['profs'];
} & {
  [E in EcoleEntree as `annonces_${E['slug']}`]: BaseCollectionsEcole['annonces'];
} & {
  [E in EcoleEntree as `articles_${E['slug']}`]: BaseCollectionsEcole['articles'];
} & {
  [E in EcoleEntree as `faq_${E['slug']}`]: BaseCollectionsEcole['faq'];
} & {
  [E in EcoleEntree as `galerie_${E['slug']}`]: BaseCollectionsEcole['galerie'];
};

type SingletonsEcoles = {
  [E in EcoleEntree as `ecole_${E['slug']}`]: BaseSingletonsEcole['ecole'];
};

function suffixer(base: Record<string, unknown>, slug: string) {
  return Object.entries(base).map(([nom, valeur]) => [`${nom}_${slug}`, valeur] as const);
}

const collectionsEcoles = Object.fromEntries(
  ECOLES.flatMap((e) => suffixer(collectionsEcole(e), e.slug)),
) as CollectionsEcoles;

const singletonsEcoles = Object.fromEntries(
  ECOLES.flatMap((e) => suffixer(singletonEcole(e), e.slug)),
) as SingletonsEcoles;

const collections = {
  ...collectionsCommunes,
  ...collectionsEcoles,
};

const singletons = {
  ...singletonsCommuns,
  ...singletonsEcoles,
};

/**
 * Navigation de l'admin, rangée par usage (ce que le prof vient faire),
 * pas par type technique. Mono-école : les groupes restent plats.
 * Multi-écoles : un groupe par école apparaît automatiquement.
 */
type CleNav = keyof typeof collections | keyof typeof singletons | '---';

const TEXTES_DES_PAGES = [
  'hero',
  'entetes',
  'club',
  'rigueur',
  'rejoindre',
  'tournois',
  'fiches',
] satisfies CleNav[];

const REGLAGES = ['identite', 'menus', 'legal'] satisfies CleNav[];

function navigation(): Record<string, CleNav[]> {
  const k = <P extends string>(prefixe: P, e: EcoleConfig) =>
    `${prefixe}_${e.slug}` as CleNav;

  if (!MULTI) {
    const e = ECOLES[0];
    return {
      Publier: [k('annonces', e), k('articles', e)],
      'L’école': [k('ecole', e), k('profs', e)],
      Enseignement: ['disciplines', 'traites'],
      Contenus: [k('galerie', e), k('faq', e), 'faq', 'partenaires'],
      'Textes des pages': [...TEXTES_DES_PAGES],
      Réglages: [...REGLAGES],
    };
  }

  const groupes: Record<string, CleNav[]> = {};
  for (const e of ECOLES) {
    groupes[e.nom] = [
      k('annonces', e),
      k('articles', e),
      k('ecole', e),
      k('profs', e),
      k('galerie', e),
      k('faq', e),
    ];
  }
  groupes['Contenus communs'] = ['disciplines', 'traites', 'faq', 'partenaires'];
  groupes['Textes des pages'] = [...TEXTES_DES_PAGES];
  groupes['Réglages'] = [...REGLAGES];
  return groupes;
}

export default config({
  storage,
  ui: {
    brand: { name: "De Feu et d'Acier" },
    navigation: navigation(),
  },
  collections,
  singletons,
});
