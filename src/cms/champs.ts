/**
 * Helpers de schéma Keystatic, partagés.
 *
 * Ces fabriques vivaient dans `keystatic.config.ts`. Elles en sont sorties le
 * jour où les widgets de corps libre (`src/cms/widgets.ts`) ont eu besoin des
 * mêmes champs — une image éditoriale, un cadrage, les trois champs d'une
 * vidéo — sans pouvoir importer le fichier de configuration, qui les importe
 * lui-même. Aucun changement de comportement : c'est un déplacement.
 *
 * Règle : libellés en français, clés sans accent (lisibles en diff git),
 * descriptions écrites pour un encadrant qui n'est pas technicien.
 */
import { fields } from '@keystatic/core';

/**
 * Rappel de la syntaxe d'accent, ajouté aux descriptions des champs rendus par
 * `SectionTitle` : le fragment entouré d'astérisques passe en ember italique,
 * c'est le seul accent coloré de la maquette (design-spec §9.3). La convention
 * n'était documentée nulle part côté admin — d'où des titres à plat.
 */
export const ACCENT =
  'Entourer d’astérisques le fragment à mettre en valeur (ember, italique) : *gratuites*. Écrire \\* pour une astérisque littérale.';

/** Rappel des raccourcis, ajouté aux descriptions des champs qui les acceptent. */
export const RACCOURCIS =
  'Raccourcis : {email}, {telephone}, {lieu}, {adresse}, {tarif}, {saison}, {creneaux}, {creneaux_court}, {essai}.';

/**
 * Normalise le nom du fichier déposé depuis l'admin.
 *
 * Keystatic enregistre par défaut le fichier **tel quel** : `IMG_4821.JPG`,
 * `Rapière (2).jpg`… Or le build retrouve les photos par leur chemin. Une
 * extension en capitales ou un nom accentué se traduisait par une photo
 * silencieusement absente du site. On assainit donc à l'entrée : minuscules,
 * accents retirés, tout le reste ramené à des tirets.
 *
 * ⚠️ Keystatic n'appelle `transformFilename` que pour une image déposée **dans
 * un champ d'éditeur** — `fields.markdoc`, donc les widgets de corps libre.
 * Ailleurs, il compose le nom depuis la clé du champ et garde l'extension. Les
 * deux chemins donnent un nom sûr ; celui-ci garde en plus le nom d'origine.
 */
export const nomDeFichier = (original: string): string =>
  original
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

/**
 * Image éditoriale. Elle atterrit dans `src/assets/photos/…` pour passer par
 * `astro:assets` (sharp) au build : AVIF/WebP + srcset. Cf. photos.md §5.
 * Ne jamais pointer vers `public/` pour une photo : aucune optimisation.
 */
export const imageEditoriale = (label: string, dossier: string, description?: string) =>
  fields.image({
    label,
    directory: `src/assets/photos/${dossier}`,
    publicPath: `/src/assets/photos/${dossier}/`,
    transformFilename: nomDeFichier,
    description:
      description ??
      'JPEG ou PNG déjà préparé : 2400 px maximum sur le grand côté, moins de 1,5 Mo. Ne jamais déposer un fichier brut d’appareil photo.',
  });

/**
 * Logo de partenaire. Même dossier que les photos communes — c'est là que le
 * chantier photos les a déposés (cf. docs/refonte/photos-manifest.json). Le
 * rendu servira le fichier d'origine sans le recompresser : un logo à plat
 * supporte mal une repasse JPEG.
 */
export const imageLogo = (label: string) =>
  fields.image({
    label,
    directory: 'src/assets/photos/commun',
    publicPath: '/src/assets/photos/commun/',
    transformFilename: nomDeFichier,
    description: 'PNG à fond transparent de préférence. Le fichier est servi tel quel.',
  });

/** Cadrage : remplace le « point focal 50% 40% », incompréhensible pour un prof. */
export const cadrage = fields.select({
  label: 'Cadrage de la photo',
  description: 'Quelle partie de la photo garder si elle doit être recadrée.',
  options: [
    { label: 'Centre (par défaut)', value: 'centre' },
    { label: 'Haut / visages', value: 'haut' },
    { label: 'Bas', value: 'bas' },
    { label: 'Gauche', value: 'gauche' },
    { label: 'Droite', value: 'droite' },
  ],
  defaultValue: 'centre',
});

/** Photo = fichier + description alternative (obligatoire à l'usage) + cadrage. */
export const photo = (label: string, dossier: string, description?: string) =>
  fields.object(
    {
      fichier: imageEditoriale('Fichier', dossier),
      alt: fields.text({
        label: 'Description de l’image',
        description:
          'Lue à voix haute par les lecteurs d’écran, et affichée si la photo ne charge pas. Ex. « L’équipe sur la piste du gymnase ».',
      }),
      cadrage,
      credit: fields.text({
        label: 'Crédit photo (facultatif)',
        // Le « © » est posé au rendu (`creditAffiche`, src/lib/images.ts) : deux
        // photographes saisis à deux moments différents donnaient sinon deux
        // formats côte à côte. Un « © » saisi quand même est absorbé, pas doublé.
        description:
          'Le nom seul — le « © » est ajouté automatiquement. Ex. « Alexandre Vergne — L’IMAGINARIUM ».',
      }),
    },
    { label, description },
  );

/**
 * Planche de traité affichée **hors** de la section « Les sources » — la gravure
 * de « La rigueur », sur l'accueil.
 *
 * Même forme qu'une photo (fichier, description, cadrage, crédit), mais la ligne
 * de crédit y est rendue **mot pour mot**, sans « © » ajouté : ces planches sont
 * des numérisations de bibliothèque, sous *Public Domain Mark* ou déclarées
 * « domaine public » par Gallica. Un « © » y serait faux, et la mention de source
 * est exigée telle quelle par l'institution qui a numérisé le document. D'où un
 * groupe de champs à part, dont le libellé dit la vérité au prof qui le remplit
 * (cf. `creditPlanche()`, src/components/sources/traites.ts).
 */
export const planchePatrimoniale = (label: string, dossier: string) =>
  fields.object(
    {
      fichier: imageEditoriale('Fichier', dossier),
      alt: fields.text({
        label: 'Description de l’image',
        description:
          'Lue à voix haute par les lecteurs d’écran. Décrire ce que la gravure montre. Ex. « Deux joueurs d’épée à deux mains, lames croisées ».',
      }),
      cadrage,
      credit: fields.text({
        label: 'Ligne de crédit de la bibliothèque',
        multiline: true,
        description:
          'À recopier EXACTEMENT comme la bibliothèque la demande — c’est la contrepartie du droit de publier l’image. Rien n’est ajouté ni corrigé à l’affichage : ni « © », ni retouche de ponctuation. Ex. « … Rothschild 291, f. 1r. Source gallica.bnf.fr / Bibliothèque nationale de France. »',
      }),
    },
    { label },
  );

/**
 * Les trois champs d'une vidéo — adresse du fichier, sous-titres, affiche.
 *
 * Le site **n'embarque pas de lecteur de plateforme** : une `<iframe>` YouTube
 * déposerait des cookies tiers avant tout consentement (ARCHITECTURE.md §6).
 * Les vidéos du club sont donc déposées sur notre propre stockage R2 et lues par
 * le lecteur natif du navigateur (`VideoCard.astro`). Une adresse de plateforme
 * reste acceptée, mais la vignette n'est alors qu'un lien sortant : le visiteur
 * quitte le site.
 *
 * D'où les libellés ci-dessous, et le champ de sous-titres — sans piste `.vtt`,
 * une vidéo publiée est inaccessible à qui ne l'entend pas (WCAG 1.2.2).
 *
 * ⚠️ **La vidéo va sur R2, les sous-titres restent sur le site.** Une piste de
 * texte (`<track>`) est chargée avec l'état CORS de l'élément `<video>` : servie
 * depuis une autre origine que la page, elle part en mode `no-cors`, la réponse
 * est opaque, et le navigateur abandonne la piste **sans message d'erreur** — pas
 * de bouton « sous-titres » dans les commandes, personne ne s'en aperçoit. Le
 * remède théorique (`crossorigin="anonymous"` sur le `<video>`) est pire : sans
 * en-tête `Access-Control-Allow-Origin` sur le bucket, il fait échouer le
 * chargement de la **vidéo** elle-même. On demande donc un `.vtt` déposé dans
 * `public/`, appelé par un chemin de site (`/videos/lecon-01.fr.vtt`) : même
 * origine, aucun attribut, aucune règle CORS à maintenir.
 */
export const champsVideo = {
  url: fields.text({
    label: 'Adresse du fichier vidéo',
    description:
      'L’adresse du fichier .mp4 : soit un chemin du site pour une petite vidéo déjà déposée par Zaccharie (ex. /videos/gabriel-tardio-tournoi-2025-2026.mp4), soit le stockage du club (R2) pour les plus lourdes. Lue directement sur la page. Une adresse YouTube ou Vimeo fonctionne aussi, mais la vignette devient un simple lien qui fait quitter le site.',
  }),
  sousTitres: fields.text({
    label: 'Sous-titres (fichier .vtt)',
    description:
      'Le chemin du fichier de sous-titres français sur le site — il commence par « / », par exemple /videos/lecon-01.fr.vtt. Contrairement à la vidéo, ce fichier ne va PAS sur le stockage R2 : une adresse complète (https://…) ne fonctionnerait pas, le navigateur ignorerait les sous-titres sans rien dire. Confiez le .vtt à Zaccharie, qui le dépose sur le site. À remplir dès qu’une vidéo est publiée : sans lui, personne ne peut suivre sans le son. Sans effet sur une vidéo YouTube.',
  }),
  affiche: fields.text({
    label: 'Image d’attente (facultatif)',
    description:
      'Seulement si l’image fixe affichée avant le départ de la vidéo ne doit pas être la vignette ci-dessous : l’adresse d’une image déposée à côté de la vidéo.',
  }),
};

/** Photo purement décorative : pas de champ crédit, il ne serait pas affiché. */
export const photoDecorative = (label: string, dossier: string, description?: string) =>
  fields.object(
    {
      fichier: imageEditoriale('Fichier', dossier),
      alt: fields.text({
        label: 'Description de l’image',
        description:
          'Obligatoire, même si l’image est déjà décrite ailleurs sur la page : la publication est refusée sans elle (le garde-fou n° 3 du build ne fait aucune exception). Restez court, puisque la description détaillée est ailleurs.',
      }),
      cadrage,
    },
    { label, description },
  );

/** Bouton / lien : libellé + destination. */
export const lien = (label: string, description?: string) =>
  fields.object(
    {
      libelle: fields.text({ label: 'Texte du bouton' }),
      url: fields.text({
        label: 'Adresse',
        description: 'https://…, mailto:…, tel:… ou une ancre interne (#creneaux).',
      }),
    },
    { label, description },
  );

/** Affiché / masqué, sans suppression (principe « retirer ≠ supprimer »). */
export const visible = fields.checkbox({
  label: 'Affiché sur le site',
  description: 'Décocher pour retirer du site sans perdre la fiche.',
  defaultValue: true,
});

/** Ordre d'affichage. Convention 10, 20, 30… pour pouvoir intercaler. */
export const ordre = fields.integer({
  label: 'Ordre d’affichage',
  description: 'Le plus petit s’affiche en premier. Utiliser 10, 20, 30… pour pouvoir intercaler.',
  defaultValue: 100,
});

/** En-tête de section : sur-titre + titre sur deux lignes + chapô. */
export const enTete = (eyebrow: string, description?: string) =>
  fields.object(
    {
      eyebrow: fields.text({ label: 'Sur-titre', defaultValue: eyebrow }),
      titreLigne1: fields.text({ label: 'Titre — ligne 1', description: ACCENT }),
      titreLigne2: fields.text({
        label: 'Titre — ligne 2',
        description: `Rendue en ember italique. ${ACCENT}`,
      }),
      lede: fields.text({
        label: 'Chapô',
        multiline: true,
        description: RACCOURCIS,
      }),
    },
    { label: eyebrow, description },
  );
