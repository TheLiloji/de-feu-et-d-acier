/**
 * Données structurées schema.org.
 *
 * Reprise du bloc JSON-LD de l'ancien site (complet et vérifié : adresse du
 * gymnase, affiliations FFAMHE et USAM, `sameAs` Facebook / HEMA Ratings /
 * HelloAsso), **paramétré par école** au lieu d'être codé en dur : le jour où
 * une deuxième salle ouvre, elle obtient son propre balisage sans qu'on touche
 * au gabarit. Cf. stack-notes.md §5.3 et multi-ecoles.md §4 (option A, SEO).
 *
 * Type retenu : `SportsClub` — plus précis que `SportsOrganization` pour une
 * salle localisée, et il accepte `openingHoursSpecification`, alimenté
 * directement par les créneaux du CMS.
 */
import type { Ecole } from './ecoles';
import { base, lienAbsolu } from './liens';

const JOURS_SCHEMA: Record<string, string> = {
  lundi: 'https://schema.org/Monday',
  mardi: 'https://schema.org/Tuesday',
  mercredi: 'https://schema.org/Wednesday',
  jeudi: 'https://schema.org/Thursday',
  vendredi: 'https://schema.org/Friday',
  samedi: 'https://schema.org/Saturday',
  dimanche: 'https://schema.org/Sunday',
};

/** « 06 61 28 65 11 » → « +33661286511 » (format E.164 attendu par schema.org). */
function telephoneE164(telephone?: string | null): string | undefined {
  if (!telephone) return undefined;
  const chiffres = telephone.replace(/[^\d+]/g, '');
  if (chiffres.startsWith('+')) return chiffres;
  if (chiffres.startsWith('0')) return `+33${chiffres.slice(1)}`;
  return chiffres || undefined;
}

/**
 * Sérialise un nœud JSON-LD pour l'injecter dans un `<script>`.
 *
 * `</script>` ou un séparateur de ligne Unicode dans une chaîne du CMS
 * fermerait la balise et casserait le `<head>` de la page. On échappe donc
 * avant l'injection — le JSON reste valide, les échappements `\uXXXX` étant
 * compris par tout parseur. C'est l'unique sérialiseur du site : `Base.astro`
 * (SportsClub) et la page d'une question (FAQPage, BreadcrumbList) passent
 * tous par lui.
 */
export function serialiserJsonLd(noeud: Record<string, unknown>): string {
  return JSON.stringify(noeud)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/[\u2028\u2029]/g, (c) => `\\u${c.charCodeAt(0).toString(16)}`);
}

function sansVides<T extends Record<string, unknown>>(objet: T): T {
  return Object.fromEntries(
    Object.entries(objet).filter(([, v]) => {
      if (v === undefined || v === null || v === '') return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    }),
  ) as T;
}

export interface OptionsJsonLd {
  ecole: Ecole;
  /** Origine du site, pour construire les URL absolues. */
  site: URL;
  /** Nom de l'association, depuis le singleton « Identité du site ». */
  nom: string;
  /**
   * Description **du club**, depuis le singleton « Identité du site ».
   *
   * ⚠️ Surtout pas la meta description de la page courante : le nœud décrit
   * l'association, pas la page qui le porte. Les douze pages du site
   * publiaient sinon douze `SportsClub` homonymes aux descriptions
   * contradictoires (« Arme médiévale germanique… » sur /armes/messer/),
   * qu'aucun agrégateur ne peut réconcilier.
   */
  description?: string | null;
  /** URL absolue de l'image de partage, si disponible. */
  image?: string | null;
}

export function jsonLdSportsClub({
  ecole,
  site,
  nom,
  description,
  image,
}: OptionsJsonLd): Record<string, unknown> {
  const f = ecole.fiche;

  // L'entité est ancrée sur la **racine de l'école**, pas sur la page courante :
  // toutes les pages déclarent alors le même `@id`, donc la même entité.
  // Aujourd'hui `/` (Clermont principale) ; demain `/lyon/` pour Lyon, avec son
  // propre `#club`, sans toucher au gabarit.
  const racine = base(ecole);
  const url = new URL(racine, site).href;
  const id = new URL(`${racine}#club`, site).href;

  const membreDe = [
    f.affiliation?.federation
      ? sansVides({
          '@type': 'SportsOrganization',
          name: f.affiliation.federation,
          url: f.affiliation.lienFederation || undefined,
        })
      : null,
    f.affiliation?.club
      ? sansVides({
          '@type': 'SportsOrganization',
          name: f.affiliation.club,
          url: f.affiliation.lienClub || undefined,
        })
      : null,
  ].filter(Boolean);

  const horaires = (f.creneaux ?? []).map((c) =>
    sansVides({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: JOURS_SCHEMA[c.jour] ?? undefined,
      opens: c.heureDebut,
      closes: c.heureFin,
    }),
  );

  const reseaux = [
    f.reseaux?.facebook,
    f.reseaux?.instagram,
    f.reseaux?.hemaRatings,
    f.reseaux?.helloAsso,
  ].filter((u): u is string => Boolean(u));

  return sansVides({
    '@context': 'https://schema.org',
    '@type': 'SportsClub',
    '@id': id,
    name: nom,
    alternateName: f.nom ? `${nom} — ${f.nom}` : undefined,
    url,
    logo: new URL('/apple-touch-icon.png', site).href,
    image: image || undefined,
    description: description || undefined,
    sport: [
      'Arts Martiaux Historiques Européens',
      'AMHE',
      'HEMA',
      'Escrime historique',
    ],
    areaServed: f.lieu?.ville || f.ville || ecole.ville,
    memberOf: membreDe.length ? membreDe : undefined,
    address: sansVides({
      '@type': 'PostalAddress',
      name: f.lieu?.nom || undefined,
      streetAddress: f.lieu?.adresse || undefined,
      postalCode: f.lieu?.codePostal || undefined,
      addressLocality: f.lieu?.ville || f.ville || ecole.ville,
      addressCountry: 'FR',
    }),
    geo:
      f.lieu?.latitude && f.lieu?.longitude
        ? {
            '@type': 'GeoCoordinates',
            latitude: f.lieu.latitude,
            longitude: f.lieu.longitude,
          }
        : undefined,
    openingHoursSpecification: horaires.length ? horaires : undefined,
    contactPoint: sansVides({
      '@type': 'ContactPoint',
      contactType: 'Inscriptions et première séance',
      email: f.contact?.email || undefined,
      telephone: telephoneE164(f.contact?.telephone),
      availableLanguage: 'fr',
    }),
    sameAs: reseaux.length ? reseaux : undefined,
  });
}

// ── Questions d'armes ──────────────────────────────────────────────────────
//
// **FAQPage, pas QAPage** — arbitrage documenté, pris sur la doc Google des
// résultats enrichis (relue le 17/09/2026) :
//
//   - `QAPage` est réservé par Google aux pages « où les utilisateurs peuvent
//     proposer des réponses » (forums, Q&A communautaires), avec une réponse
//     acceptée parmi plusieurs soumises. La doc dit explicitement de ne PAS
//     l'employer quand la page n'a qu'une réponse, rédigée par le site,
//     qu'aucun visiteur ne peut compléter — exactement notre cas.
//   - `FAQPage` est le type prévu pour « une page qui contient une liste de
//     questions et de réponses rédigées par le site lui-même ». Une page qui
//     n'en porte qu'une reste un FAQPage valide (`mainEntity` accepte une
//     seule Question).
//   - Depuis août 2023, Google ne montre les *résultats enrichis* FAQ que sur
//     des sites gouvernementaux et de santé « bien connus ». On ne balise donc
//     pas pour l'encart déroulant, on n'y a pas droit : on balise pour que le
//     moteur comprenne que la page répond à une question précise — ce qui
//     sert le classement sur les requêtes en question, l'objectif de la
//     rubrique.
//
// Le balisage vit sur la page de la question, jamais sur l'index /questions/ :
// dupliquer la même paire question-réponse sur deux URL est précisément ce que
// la doc demande d'éviter.

/** `FAQPage` d'une page de question : une seule Question, sa réponse en texte. */
export function jsonLdQuestion(options: {
  /** Origine du site, pour l'URL canonique de la page. */
  site: URL;
  /** Chemin de la page, ex. `/questions/l-epee-longue-c-est-lourd/`. */
  chemin: string;
  /** La question, telle qu'affichée en H1. */
  question: string;
  /** La réponse en texte brut (prose seule, sans balise). */
  reponse: string;
  /** Date de publication `AAAA-MM-JJ`, si le CMS en porte une. */
  date?: string | null;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${lienAbsolu(options.site, options.chemin)}#faq`,
    mainEntity: [
      sansVides({
        '@type': 'Question',
        name: options.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: options.reponse,
        },
        datePublished: options.date || undefined,
      }),
    ],
  };
}

/** Un maillon du fil d'Ariane à baliser. Le dernier n'a pas d'adresse. */
export interface MaillonJsonLd {
  libelle: string;
  /** Chemin du site (`/questions/`). Absent sur la page courante. */
  chemin?: string;
}

/**
 * `BreadcrumbList` — le fil d'Ariane de la page, pour que les résultats de
 * recherche affichent « Accueil › Questions d'armes › … » plutôt que l'URL
 * brute. Contrairement aux FAQ, ce résultat enrichi reste ouvert à tous les
 * sites. Le dernier maillon (la page courante) se déclare sans `item`,
 * comme la doc le prévoit.
 */
export function jsonLdFilAriane(site: URL, maillons: readonly MaillonJsonLd[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: maillons.map((maillon, i) =>
      sansVides({
        '@type': 'ListItem',
        position: i + 1,
        name: maillon.libelle,
        item: maillon.chemin ? lienAbsolu(site, maillon.chemin) : undefined,
      }),
    ),
  };
}
