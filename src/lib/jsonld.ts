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
import { base } from './liens';

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
