/**
 * Pont entre les chemins d'images stockés par Keystatic et `astro:assets`.
 *
 * Keystatic ne stocke qu'une chaîne (« /src/assets/photos/commun/hero.jpg »).
 * `<Image>` / `<Picture>` attendent un `ImageMetadata`, produit par l'import.
 * `import.meta.glob` fait le pont : tout ce qui vit sous `src/assets/photos/`
 * est importé au build, sharp génère AVIF/WebP + srcset, et le nom de fichier
 * porte un hash de cache. Cf. photos.md §5.1 et stack-notes.md §3.4.
 *
 * Les fichiers eux-mêmes sont produits par le chantier photos ; ce module se
 * contente de les retrouver, et renvoie `null` sans casser le build si un
 * fichier référencé dans le CMS n'a pas (encore) été déposé.
 */
import { INSECABLE, typographieFr } from './typographie';

/**
 * Le motif est une **liste blanche** : uniquement les extensions qu'Astro sait
 * traiter comme `ImageMetadata` (`VALID_INPUT_FORMATS`), variantes en capitales
 * comprises — Keystatic enregistre le fichier sous son nom d'origine, et un
 * `IMG_4821.JPG` sorti d'un téléphone doit être retrouvé comme les autres.
 *
 * ⚠️ **Pas de `svg`** : dans Astro 7, un import `.svg` renvoie un *composant*,
 * pas un `ImageMetadata` — `<Picture src>` échouerait au rendu. Les logos SVG
 * restent dans `public/` (photos.md §5.1).
 */
const fichiers = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/photos/**/*.{jpg,jpeg,png,webp,avif,gif,tif,tiff,JPG,JPEG,PNG,WEBP,AVIF,GIF,TIF,TIFF}',
  { eager: true },
);

/**
 * Index secondaire en minuscules — repli quand la casse du chemin enregistré
 * par le CMS ne correspond pas exactement à celle du fichier sur le disque.
 * La correspondance **exacte** reste prioritaire : sur un système de fichiers
 * sensible à la casse, deux fichiers peuvent légitimement ne différer que par
 * elle, et l'index minusculé n'en garde qu'un.
 */
const fichiersMinuscules = new Map<string, { default: ImageMetadata }>();
for (const [cle, module] of Object.entries(fichiers)) {
  const minuscule = cle.toLowerCase();
  if (!fichiersMinuscules.has(minuscule)) fichiersMinuscules.set(minuscule, module);
}

/**
 * Extensions acceptées, en clair — le glob ci-dessus n'est pas introspectable.
 * Citée par le garde-fou n° 5 du build (src/lib/validation.ts) dans son message
 * d'erreur : les deux listes doivent rester d'accord.
 */
export const EXTENSIONS_PHOTOS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.gif',
  '.tif',
  '.tiff',
] as const;

/** Tous les chemins d'images connus du build — utilisé par les garde-fous. */
export function cheminsConnus(): string[] {
  return Object.keys(fichiers);
}

/** Retrouve le `ImageMetadata` d'un chemin Keystatic. `null` si absent. */
export function resoudrePhoto(chemin?: string | null): ImageMetadata | null {
  if (!chemin) return null;
  const cle = chemin.startsWith('/') ? chemin : `/${chemin}`;
  return (fichiers[cle] ?? fichiersMinuscules.get(cle.toLowerCase()))?.default ?? null;
}

/**
 * Échelle de largeurs par défaut d'un `srcset` — pas d'environ ×1,5.
 *
 * Sept paliers suffisent à couvrir 1× et 2× de tous les gabarits du site sans
 * multiplier les dérivés sharp. Cf. photos.md §5.4, dont les listes par usage
 * restent la référence : quand l'appelant connaît la largeur de rendu, il passe
 * `largeurs` (ou `rendMax`) plutôt que de s'en remettre à cette échelle.
 */
const ECHELLE = [240, 360, 540, 810, 1200, 1800, 2400] as const;

export interface OptionsLargeurs {
  /** Largeurs souhaitées (photos.md §5.4). Prioritaire sur l'échelle par défaut. */
  largeurs?: readonly number[] | null;
  /** Largeur CSS maximale du gabarit. Plafonne l'échelle par défaut à `2 ×`. */
  rendMax?: number | null;
}

/**
 * Largeurs d'un `srcset`, sans sur-échantillonnage ni dérivés inutiles.
 *
 * Deux erreurs symétriques à éviter, et c'est pour les tenir en un seul endroit
 * que ce helper existe (il remplace la formule « moitié du master + master »
 * qui était recopiée dans sept composants) :
 *
 *   - **trop peu de paliers** : une tuile de 167 px CSS téléchargeait le
 *     candidat 1200 w, seul disponible sous le master ;
 *   - **trop de paliers** : générer un dérivé 2400 w pour une tuile qui ne
 *     dépasse jamais 778 px CSS alourdit le build et `dist/` pour rien.
 *
 * Règle de bord : si un candidat a été écarté parce qu'il dépassait la largeur
 * native du master, on sert le master — sinon un cadre plein écran reçoit une
 * image plus petite que son rendu.
 */
export function largeursSrcset(
  image?: ImageMetadata | null,
  { largeurs, rendMax }: OptionsLargeurs = {},
): number[] {
  if (!image) return [];
  const natif = image.width;

  let souhaitees: number[];
  if (largeurs && largeurs.length > 0) {
    souhaitees = [...largeurs];
  } else {
    const plafond = rendMax ? Math.min(natif, Math.round(rendMax * 2)) : natif;
    souhaitees = ECHELLE.filter((l) => l <= plafond);
    if ((souhaitees[souhaitees.length - 1] ?? 0) < plafond) souhaitees.push(plafond);
  }

  const retenues = [...new Set(souhaitees.filter((l) => l > 0 && l <= natif))].sort((a, b) => a - b);
  if (retenues.length === 0) return [natif];

  const aEcarte = souhaitees.some((l) => l > natif);
  if (aEcarte && retenues[retenues.length - 1]! < natif) retenues.push(natif);

  return retenues;
}

/** Traduit le cadrage du CMS en `object-position` CSS. */
export function cadrageCss(cadrage?: string | null): string {
  switch (cadrage) {
    case 'haut':
      return '50% 15%';
    case 'bas':
      return '50% 85%';
    case 'gauche':
      return '15% 50%';
    case 'droite':
      return '85% 50%';
    default:
      return '50% 50%';
  }
}

/**
 * Crédit photo affiché — « Alexandre Vergne » → « © Alexandre Vergne ».
 *
 * Le champ du CMS ne porte que le nom : deux photographes saisis à deux moments
 * différents donnaient sinon deux formats côte à côte dans la même mosaïque
 * (« © X » ici, « X » là). Le symbole est donc posé au rendu, à un seul endroit.
 * Un « © » — ou un « (c) » — quand même saisi dans l'admin est absorbé plutôt
 * que doublé : le champ tolère les deux saisies, l'affichage n'en connaît qu'une.
 * Un champ vide reste vide, on ne rend pas un « © » orphelin.
 *
 * ⚠️ **Réservé aux photographies** — celles du club et de ses photographes, dont
 * le nom est bien titulaire d'un droit d'auteur. À ne **jamais** appliquer à une
 * ligne de crédit de bibliothèque : les planches de traité publiées par le site
 * sont sous *Public Domain Mark 1.0* (Talhoffer, Lecküchner, Paulus Kal) ou
 * portent « domaine public » sur leur notice Gallica, c'est-à-dire explicitement
 * sans droit d'auteur — un « © » y serait un contresens juridique, et il
 * modifierait au passage une mention exigée mot pour mot. Ces lignes-là passent
 * par `creditPlanche()` / `creditPlancheHtml()` de
 * `src/components/sources/traites.ts`, qui les rendent verbatim. Appelants :
 * `GaleriePlanches`, `ArmeSource`, `Visionneuse` et `Rigueur.astro`.
 */
export function creditAffiche(brut?: string | null): string {
  const nom = typographieFr(brut)
    .replace(/^\s*(?:©|\(c\))\s*/i, '')
    .trim();
  // Espace insécable après le symbole : « © » ne reste jamais seul en fin de
  // ligne, séparé du nom qu'il crédite.
  return nom ? `©${INSECABLE}${nom}` : '';
}

/**
 * Forme d'une photo telle que saisie dans le CMS (`photo()` de keystatic.config).
 *
 * Tous les champs sont facultatifs : certains groupes n'en portent que deux
 * (`lieu.photo` : fichier + alt + cadrage, `lieu.photosInterieur[]` : fichier +
 * alt). Le résolveur comble ce qui manque.
 */
export interface PhotoCms {
  fichier?: string | null;
  alt?: string | null;
  cadrage?: string | null;
  credit?: string | null;
}

/** Photo prête à rendre : source importée, texte alternatif, cadrage, crédit. */
export interface PhotoResolue {
  source: ImageMetadata;
  alt: string;
  objectPosition: string;
  credit: string;
}

/** Résout une photo du CMS. Renvoie `null` si le fichier est absent. */
export function resoudre(photo?: PhotoCms | null): PhotoResolue | null {
  const source = resoudrePhoto(photo?.fichier);
  if (!source) return null;
  return {
    source,
    alt: photo?.alt ?? '',
    objectPosition: cadrageCss(photo?.cadrage),
    credit: creditAffiche(photo?.credit),
  };
}

/**
 * Résout une liste de photos du CMS (`fields.array`), en écartant celles dont
 * le fichier n'a pas (encore) été déposé — un tableau de photos à trous ne doit
 * pas rendre de cases vides. Une liste absente donne une liste vide, ce qui
 * laisse aux appelants le test unique `longueur === 0`.
 */
export function resoudrePhotos(photos?: readonly (PhotoCms | null)[] | null): PhotoResolue[] {
  return (photos ?? []).flatMap((photo) => {
    const resolue = resoudre(photo);
    return resolue ? [resolue] : [];
  });
}
