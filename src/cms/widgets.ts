/**
 * Les six widgets de corps libre — cf. docs/refonte/widgets.md.
 *
 * Le rédacteur compose librement les pages à corps de texte : il écrit du
 * markdown et insère des blocs où il veut, dans l'ordre qu'il veut. Ces blocs
 * sont des `block()` de Keystatic, proposés par le bouton « + » de la barre
 * d'outils (ou la touche « / »), avec leurs champs, leur aperçu et leur
 * dialogue d'édition.
 *
 * Quatre champs les accueillent, et eux seuls : la biographie d'un encadrant,
 * la description longue d'une arme, le contenu d'un article et la présentation
 * d'un traité. L'accueil reste fermé.
 *
 * ⚠️ Trois règles de compatibilité, vérifiées dans l'implémentation de
 * Keystatic 0.6.3 (widgets.md §1.6) :
 *
 *   - **les quatre champs doivent déclarer le même jeu de widgets.** Un tag
 *     rencontré dans un fichier mais absent du `Record` fait échouer
 *     l'ouverture de l'entrée dans l'admin, pas seulement l'affichage du bloc ;
 *   - **retirer un champ d'un widget est une rupture** : tout `.mdoc` qui le
 *     porte encore devient illisible dans l'admin (« Key on object value … is
 *     not allowed »). Une suppression de champ s'accompagne d'une migration des
 *     fichiers de contenu dans le même commit. Ajouter un champ facultatif,
 *     en revanche, est rétrocompatible ;
 *   - **aucun `icon`.** Un `icon` est un `ReactElement` ; les icônes livrées
 *     par Keystatic tirent tout `@keystar/ui` dans le graphe de
 *     `keystatic.config.ts`, lui-même importé par le pré-rendu et par le
 *     Worker. Les entrées du menu « + » s'affichent avec leur libellé et leur
 *     description, sans glyphe — et le menu les trie par libellé.
 */
import { fields } from '@keystatic/core';
import { block, type ContentComponent } from '@keystatic/core/content-components';
import { createElement, type ReactNode } from 'react';
import { cadrage, champsVideo, imageEditoriale } from './champs';

/**
 * Les noms de tag, dans l'ordre du cahier des charges.
 *
 * C'est **la** liste de référence : le moteur de rendu et le garde-fou n° 9 du
 * build l'importent tous les deux. Un widget ajouté ici sans branchement de
 * rendu fait échouer le build au lieu de disparaître silencieusement de la
 * page — `Markdoc.transform` supprime sans un mot les tags qu'il ne connaît pas.
 *
 * Les noms sont en ASCII sans accent : la grammaire Markdoc n'accepte que
 * `[a-zA-Z0-9_-]+` pour un nom de tag.
 */
export const NOMS_WIDGETS = [
  'galerie',
  'video',
  'questions',
  'renvoi',
  'bouton',
  'planche',
] as const;

export type NomWidget = (typeof NOMS_WIDGETS)[number];

/**
 * Le libellé français de chaque widget, tel qu'il s'affiche dans le menu « + »
 * et dans le cadre du bloc. Repris mot pour mot par les messages d'erreur du
 * build : le rédacteur doit lire dans son terminal le nom qu'il a cliqué.
 */
export const LIBELLES_WIDGETS: Record<NomWidget, string> = {
  galerie: 'Galerie de photos',
  video: 'Vidéo',
  questions: 'Questions-réponses',
  renvoi: 'Renvoi vers une page du site',
  bouton: 'Bouton',
  planche: 'Planche seule',
};

/** Vrai si `nom` est l'un des six widgets livrés. */
export function estNomWidget(nom: string): nom is NomWidget {
  return (NOMS_WIDGETS as readonly string[]).includes(nom);
}

/** Le type de page visée par un « Renvoi », en français. */
const LIBELLES_TYPE_RENVOI = {
  arme: 'Arme',
  traite: 'Traité',
  encadrant: 'Encadrant',
  article: 'Article',
} as const;

/** Les quatre destinations, dans l'ordre de la liste déroulante. */
export const TYPES_RENVOI = ['arme', 'traite', 'encadrant', 'article'] as const;

/** Les quatre destinations possibles d'un « Renvoi vers une page du site ». */
export type TypeRenvoi = (typeof TYPES_RENVOI)[number];

/** Le libellé français d'un type de destination (« Arme », « Traité »…). */
export function libelleTypeRenvoi(type: TypeRenvoi): string {
  return LIBELLES_TYPE_RENVOI[type];
}

export interface OptionsWidgets {
  /** Sous-dossier de `src/assets/photos/` où déposer les images du corps. */
  dossierImages: string;
  /** Clé de la collection des encadrants visée par le widget « Renvoi ». */
  collectionProfs: string;
  /** Clé de la collection des articles visée par le widget « Renvoi ». */
  collectionArticles: string;
}

// ── Aperçu affiché dans l'éditeur ──────────────────────────────────────────
//
// `ContentView` est rendu *dans* le cadre du bloc, sous la barre de titre que
// Keystatic pose lui-même (libellé du widget + bouton « Edit »). On s'en tient
// à un résumé d'une ligne, écrit avec `createElement` : pas de JSX (aucun
// fichier .jsx/.tsx dans src/, et on le tient), pas un seul import de
// `@keystar/ui` — ce serait tout le design system dans le bundle du Worker.

const apercu = (texte: string): ReactNode =>
  createElement(
    'div',
    { style: { fontSize: '0.8125rem', lineHeight: 1.45, opacity: 0.75 } },
    texte,
  );

/** « 1 photo » / « 6 photos ». */
const pluriel = (n: number, singulier: string, pluriels = `${singulier}s`) =>
  `${n} ${n > 1 ? pluriels : singulier}`;

/** Nom de fichier seul, pour l'aperçu d'une image déposée. */
const fichierDe = (image: { filename: string } | null | undefined) => image?.filename ?? '';

/** Les morceaux non vides, séparés par un point médian. */
const ligne = (...morceaux: (string | undefined | null)[]) =>
  morceaux.map((m) => m?.trim()).filter(Boolean).join(' · ');

// ── La fabrique ────────────────────────────────────────────────────────────

/**
 * Les six widgets, paramétrés pour un gabarit donné.
 *
 * Deux choses varient d'un gabarit à l'autre : le dossier où atterrissent les
 * images déposées dans le corps, et les collections visées par les listes
 * déroulantes du widget « Renvoi » (les encadrants et les articles appartiennent
 * à une école, le dossier EST l'école — ARCHITECTURE.md §3).
 */
export function widgetsDeCorps(o: OptionsWidgets): Record<NomWidget, ContentComponent> {
  return {
    // ── 1. Galerie de photos ───────────────────────────────────────────────
    galerie: block({
      label: 'Galerie de photos',
      description:
        'Une série de photos, en grille ou en carrousel. Un clic ouvre la photo en grand.',
      schema: {
        mode: fields.select({
          label: 'Présentation',
          description:
            'Grille : toutes les photos visibles à la fois. Carrousel : une bande que l’on fait défiler, utile au-delà de six photos.',
          options: [
            { label: 'Grille', value: 'grille' },
            { label: 'Carrousel', value: 'carrousel' },
          ],
          defaultValue: 'grille',
        }),
        photos: fields.array(
          fields.object({
            image: imageEditoriale('Fichier', o.dossierImages),
            description: fields.text({
              label: 'Description de l’image',
              validation: { isRequired: true },
              description:
                'Obligatoire. Lue à voix haute par les lecteurs d’écran, affichée si la photo ne charge pas, et reprise en légende dans la visionneuse. Ex. « Deux tireurs en garde, masques baissés, au centre de la salle ».',
            }),
            cadrage,
            credit: fields.text({
              label: 'Crédit photo (facultatif)',
              description:
                'Le nom du photographe seul — le « © » est ajouté automatiquement. Ex. « Alexandre Vergne — L’IMAGINARIUM ». Ne PAS s’en servir pour une image de bibliothèque : utiliser le widget « Planche seule ».',
            }),
          }),
          {
            label: 'Photos',
            itemLabel: (p) => p.fields.description.value || 'Photo',
            validation: { length: { min: 1 } },
          },
        ),
      },
      ContentView: ({ value }) =>
        apercu(
          ligne(
            pluriel(value.photos.length, 'photo'),
            value.mode === 'carrousel' ? 'carrousel' : 'grille',
          ),
        ),
    }),

    // ── 2. Vidéo ───────────────────────────────────────────────────────────
    video: block({
      label: 'Vidéo',
      description:
        'Une vidéo lue directement sur la page. Une adresse YouTube ou Vimeo devient un simple lien.',
      schema: {
        titre: fields.text({
          label: 'Titre affiché',
          description:
            'Ce que la vidéo montre : « La leçon de garde », « En combat · saison 2025-2026 »…',
        }),
        url: champsVideo.url,
        duree: fields.text({ label: 'Durée', description: 'Ex. 06:24' }),
        vignette: imageEditoriale('Vignette', o.dossierImages),
        sousTitres: champsVideo.sousTitres,
        affiche: champsVideo.affiche,
      },
      ContentView: ({ value }) =>
        apercu(ligne(value.titre, value.duree, value.url) || 'Adresse de la vidéo à renseigner'),
    }),

    // ── 3. Questions-réponses ──────────────────────────────────────────────
    questions: block({
      label: 'Questions-réponses',
      description:
        'Une suite de questions et de réponses, dans la présentation du bloc « interview ».',
      schema: {
        titre: fields.text({
          label: 'Titre du bloc',
          defaultValue: 'L’interview',
          description:
            'Le sur-titre affiché au-dessus des questions. Ex. « L’interview », « Trois questions à Marie ».',
        }),
        questions: fields.array(
          fields.object({
            question: fields.text({ label: 'Question', validation: { isRequired: true } }),
            reponse: fields.text({
              label: 'Réponse',
              multiline: true,
              description: 'Laisser une ligne vide entre deux paragraphes.',
            }),
          }),
          {
            label: 'Questions',
            itemLabel: (p) => p.fields.question.value || 'Question',
            validation: { length: { min: 1 } },
          },
        ),
      },
      ContentView: ({ value }) =>
        apercu(ligne(value.titre, pluriel(value.questions.length, 'question'))),
    }),

    // ── 4. Renvoi vers une page du site ────────────────────────────────────
    //
    // Le widget de circulation. Rien de ce qu'il affiche n'est saisi ici : le
    // visuel, le titre et le sous-titre de la carte sont pris au build sur la
    // page visée. C'est la même règle que l'encadré « La source » d'une fiche
    // arme — une image et son crédit ne se séparent jamais.
    renvoi: block({
      label: 'Renvoi vers une page du site',
      description:
        'Une carte qui envoie vers une arme, un traité de la bibliothèque, un encadrant ou un article.',
      schema: {
        cible: fields.conditional(
          fields.select({
            label: 'Type de page',
            options: [
              { label: 'Une arme', value: 'arme' },
              { label: 'Un traité de la bibliothèque', value: 'traite' },
              { label: 'Un encadrant', value: 'encadrant' },
              { label: 'Un article', value: 'article' },
            ],
            defaultValue: 'arme',
          }),
          {
            arme: fields.relationship({
              label: 'Arme',
              collection: 'disciplines',
              validation: { isRequired: true },
              description:
                'La liste montre l’adresse de chaque fiche (ex. « epee-longue »). Seules les armes affichées dans la grille ont une page.',
            }),
            traite: fields.relationship({
              label: 'Traité',
              collection: 'traites',
              validation: { isRequired: true },
              description: 'La liste montre l’adresse de chaque fiche (ex. « talhoffer-1467 »).',
            }),
            encadrant: fields.relationship({
              label: 'Encadrant',
              collection: o.collectionProfs,
              validation: { isRequired: true },
              description:
                'La liste montre l’adresse de chaque fiche (ex. « gabriel-tardio »). Seuls les encadrants affichés sur le site ont une page.',
            }),
            article: fields.relationship({
              label: 'Article',
              collection: o.collectionArticles,
              validation: { isRequired: true },
              description:
                'La liste montre l’adresse de chaque article. Un brouillon n’a pas d’adresse : le renvoi serait cassé.',
            }),
          },
        ),
        libelle: fields.text({
          label: 'Titre de remplacement (facultatif)',
          description:
            'Laisser vide pour afficher le titre de la page visée. À remplir seulement pour annoncer autrement, ex. « Le manuscrit de 1467 ».',
        }),
      },
      ContentView: ({ value }) =>
        apercu(
          ligne(
            libelleTypeRenvoi(value.cible.discriminant),
            value.cible.value ?? 'page à choisir',
            value.libelle,
          ),
        ),
    }),

    // ── 5. Bouton ──────────────────────────────────────────────────────────
    bouton: block({
      label: 'Bouton',
      description: 'Un bouton d’action, vers une page du site ou vers l’extérieur.',
      schema: {
        libelle: fields.text({
          label: 'Texte du bouton',
          validation: { isRequired: true },
          description: 'Écrire normalement : les capitales sont posées à l’affichage.',
        }),
        url: fields.text({
          label: 'Adresse',
          validation: { isRequired: true },
          description:
            'https://…, mailto:…, tel:…, une adresse du site (/sources/) ou une ancre (#creneaux).',
        }),
        variante: fields.select({
          label: 'Aspect',
          options: [
            { label: 'Plein (action principale)', value: 'pleine' },
            { label: 'Contour (action secondaire)', value: 'contour' },
          ],
          defaultValue: 'contour',
        }),
      },
      ContentView: ({ value }) =>
        apercu(`${value.libelle || 'Bouton'} → ${value.url || 'adresse à renseigner'}`),
    }),

    // ── 6. Planche seule ───────────────────────────────────────────────────
    //
    // Le seul widget dont le crédit ne reçoit JAMAIS de « © » : c'est une
    // image de bibliothèque, sa ligne de crédit s'affiche mot pour mot.
    // D'où deux widgets séparés plutôt qu'une case à cocher : on ne peut pas
    // se tromper de régime de crédit par distraction.
    planche: block({
      label: 'Planche seule',
      description:
        'Une image de traité, avec sa légende et la ligne de crédit exigée par la bibliothèque.',
      schema: {
        image: imageEditoriale(
          'Fichier de la planche',
          o.dossierImages,
          'La planche déjà préparée : 2400 px maximum sur le grand côté, moins de 1,5 Mo. Ne jamais déposer le fichier brut téléchargé chez la bibliothèque.',
        ),
        alt: fields.text({
          label: 'Description de l’image',
          multiline: true,
          validation: { isRequired: true },
          description:
            'Obligatoire. Ce que la gravure montre, lu à voix haute par les lecteurs d’écran. Ex. « Deux escrimeurs à l’épée longue, épées croisées au-dessus de leurs têtes ».',
        }),
        legende: fields.text({
          label: 'Légende',
          multiline: true,
          description:
            'Le texte affiché sous la planche : ce qu’elle représente, et ce qu’elle apprend. Ne décrire que ce que l’on voit.',
        }),
        credit: fields.text({
          label: 'Ligne de crédit de la bibliothèque',
          multiline: true,
          validation: { isRequired: true },
          description:
            'Obligatoire, à recopier EXACTEMENT comme la bibliothèque la demande — c’est la contrepartie du droit de publier l’image. Rien n’est ajouté ni corrigé à l’affichage : ni « © », ni retouche de ponctuation. En retirer un mot (par exemple « digitalisiert von Google ») met le club en faute.',
        }),
      },
      ContentView: ({ value }) =>
        apercu(ligne(fichierDe(value.image), value.legende) || 'Planche à déposer'),
    }),
  };
}
