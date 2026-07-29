/**
 * Raccourcis de texte — « {email} », « {tarif} », « {creneaux} »…
 *
 * Pourquoi : le contact, le tarif, le lieu et les horaires ne sont saisis
 * qu'une fois, dans la fiche école. Partout ailleurs (FAQ, pied de page,
 * mentions légales, bloc « Venir essayer ») on écrit un raccourci, résolu à la
 * génération du site. C'est ce qui rend structurellement impossible la
 * désynchronisation qui existe sur le site actuel — deux adresses de contact
 * différentes selon la section. Cf. content-model.md §2.3 et §1.
 *
 * Deux raccourcis supplémentaires sont *calculés* et non saisis : `{nb_armes}`
 * et `{nb_profs}`, qui alimentent les titres de section (« Quatre armes,
 * quatre grammaires. »). Plus jamais de « Cinq armes » au-dessus de quatre
 * cartes. Cf. ARCHITECTURE.md §4.
 *
 * ⚠️ Un raccourci inconnu fait ÉCHOUER le build, avec le nom du fichier fautif.
 * C'est délibéré : « {tarrif} » doit se voir tout de suite, pas en production.
 * Cf. ARCHITECTURE.md §7 (garde-fous au build).
 *
 * **Typographie** : tout le texte du CMS passe par `resoudre()` — c'est donc
 * ici, et nulle part ailleurs, qu'on applique la normalisation française
 * (apostrophes courbes, fine insécable devant `? ! ;`, à l'intérieur des
 * `« »`). Cf. `src/lib/typographie.ts` : le rédacteur écrit normalement, le
 * site compose correctement.
 */
import { typographieFr, typographieFrHtml, INSECABLE } from './typographie';

/** Les raccourcis reconnus. Toute autre clé entre accolades casse le build. */
export const RACCOURCIS_CONNUS = [
  'email',
  'telephone',
  'lieu',
  'adresse',
  'ville',
  'tarif',
  'saison',
  'creneaux',
  'creneaux_court',
  'essai',
  'nb_armes',
  'nb_profs',
  'arme',
  'prof',
] as const;

export type Raccourci = (typeof RACCOURCIS_CONNUS)[number];

/** Valeurs disponibles pour une page donnée. `arme` et `prof` sont contextuels. */
export type ContexteRaccourcis = {
  [K in Exclude<Raccourci, 'arme' | 'prof'>]: string;
} & {
  arme?: string;
  prof?: string;
};

const MOTIF = /\{([a-z_]+)\}/g;

/** Nombres en toutes lettres — « deux séances », « quatre armes ». */
const EN_LETTRES = [
  'zéro',
  'une',
  'deux',
  'trois',
  'quatre',
  'cinq',
  'six',
  'sept',
  'huit',
  'neuf',
  'dix',
  'onze',
  'douze',
] as const;

export function nombreEnLettres(n: number): string {
  if (!Number.isFinite(n) || n < 0) return String(n);
  const entier = Math.round(n);
  return EN_LETTRES[entier] ?? String(entier);
}

/**
 * Résout les raccourcis d'un texte, **puis** en normalise la typographie.
 *
 * Le texte peut être nu (un titre, un chapô) ou un fragment HTML rendu depuis
 * markdoc (réponse de FAQ, corps d'article) : `typographieFrHtml` ne touche
 * qu'aux nœuds texte, jamais à l'intérieur d'une balise — un `href="mailto:…"`
 * ne reçoit donc jamais d'espace insécable.
 *
 * @param texte  Le texte saisi dans le CMS.
 * @param ctx    Les valeurs de l'école (et de la fiche) courante.
 * @param source Chemin du fichier ou nom du champ, cité dans le message d'erreur.
 */
export function resoudre(
  texte: string | null | undefined,
  ctx: ContexteRaccourcis,
  source = 'un texte du CMS',
): string {
  if (!texte) return '';
  const resolu = texte.replace(MOTIF, (brut, cle: string) => {
    if (!(RACCOURCIS_CONNUS as readonly string[]).includes(cle)) {
      throw new Error(
        `Raccourci inconnu « ${brut} » dans ${source}.\n` +
          `Raccourcis disponibles : ${RACCOURCIS_CONNUS.map((r) => `{${r}}`).join(', ')}.`,
      );
    }
    const valeur = ctx[cle as Raccourci];
    if (valeur === undefined || valeur === null || valeur === '') {
      throw new Error(
        `Le raccourci « ${brut} », utilisé dans ${source}, n'a pas de valeur.\n` +
          (cle === 'arme' || cle === 'prof'
            ? `« {${cle}} » n'est disponible que sur une fiche ${cle}.`
            : 'Renseigner le champ correspondant dans la fiche de l’école.'),
      );
    }
    return valeur;
  });

  return typographieFrHtml(resolu);
}

/**
 * Met une majuscule à l'initiale — pour un texte qui *commence* par un
 * raccourci.
 *
 * `{nb_armes}` rend « quatre » : c'est ce qu'il faut au milieu d'une phrase
 * (« on peut tout pratiquer, quatre armes… »), mais le titre de section
 * `« {nb_armes} armes, »` doit s'afficher « Quatre armes, », comme la maquette.
 * Sur un texte déjà capitalisé, l'appel ne change rien.
 */
export function majusculeInitiale(texte: string): string {
  return texte ? texte.charAt(0).toLocaleUpperCase('fr') + texte.slice(1) : texte;
}

/** Applique `resoudre` à chaque élément d'une liste (paragraphes, rubriques…). */
export function resoudreListe(
  textes: readonly (string | null | undefined)[] | null | undefined,
  ctx: ContexteRaccourcis,
  source?: string,
): string[] {
  return (textes ?? []).map((t, i) => resoudre(t, ctx, source ? `${source} [${i + 1}]` : undefined));
}

// ── Fabrication du contexte depuis la fiche école ───────────────────────────

const JOURS: Record<string, string> = {
  lundi: 'lundi',
  mardi: 'mardi',
  mercredi: 'mercredi',
  jeudi: 'jeudi',
  vendredi: 'vendredi',
  samedi: 'samedi',
  dimanche: 'dimanche',
};

const ORDRE_JOURS = Object.keys(JOURS);

/** « 18:00 » → « 18h », « 18:30 » → « 18h30 ». */
export function heureLisible(h: string | null | undefined): string {
  if (!h) return '';
  const [hh, mm] = h.split(':');
  return mm && mm !== '00' ? `${Number(hh)}h${mm}` : `${Number(hh)}h`;
}

export interface CreneauBrut {
  jour: string;
  heureDebut: string;
  heureFin: string;
}

/**
 * Résume les créneaux en une phrase : « mardi 18h-20h et jeudi 18h-22h ».
 * Les plages contiguës d'un même jour sont fusionnées (jeudi 18h-20h puis
 * 20h-22h se lit « jeudi 18h-22h »).
 */
export function creneauxEnPhrase(creneaux: readonly CreneauBrut[]): string {
  const parJour = new Map<string, { debut: string; fin: string }[]>();
  for (const c of creneaux) {
    const liste = parJour.get(c.jour) ?? [];
    liste.push({ debut: c.heureDebut, fin: c.heureFin });
    parJour.set(c.jour, liste);
  }

  const morceaux = ORDRE_JOURS.filter((j) => parJour.has(j)).map((jour) => {
    const plages = [...parJour.get(jour)!].sort((a, b) => a.debut.localeCompare(b.debut));
    const fusion: { debut: string; fin: string }[] = [];
    for (const p of plages) {
      const precedent = fusion[fusion.length - 1];
      if (precedent && precedent.fin === p.debut) precedent.fin = p.fin;
      else fusion.push({ ...p });
    }
    const heures = fusion.map((p) => `${heureLisible(p.debut)}-${heureLisible(p.fin)}`).join(' et ');
    return `${JOURS[jour] ?? jour} ${heures}`;
  });

  if (morceaux.length === 0) return '';
  if (morceaux.length === 1) return morceaux[0]!;
  return `${morceaux.slice(0, -1).join(', ')} et ${morceaux[morceaux.length - 1]}`;
}

/** Abréviations de jours, pour la forme compacte. */
const JOURS_COURTS: Record<string, string> = {
  lundi: 'Lun',
  mardi: 'Mar',
  mercredi: 'Mer',
  jeudi: 'Jeu',
  vendredi: 'Ven',
  samedi: 'Sam',
  dimanche: 'Dim',
};

/**
 * Forme compacte des créneaux : « Mar · Jeu 18h-22h ».
 *
 * `{creneaux}` rend la phrase complète (« mardi 18h-20h et jeudi 18h-22h »),
 * juste mais longue : dans le bandeau d'accroche du hero, en capitales avec
 * 0,24 em d'interlettrage, elle se replie sur trois lignes là où la maquette
 * (§3.1 et §4.1) pose **une** ligne. D'où ce second raccourci : les jours
 * abrégés, puis l'amplitude horaire de la semaine. Le détail exact reste porté
 * par le tableau des créneaux de « Nous rejoindre », qui, lui, est complet.
 */
export function creneauxCompact(creneaux: readonly CreneauBrut[]): string {
  if (creneaux.length === 0) return '';

  const jours = ORDRE_JOURS.filter((j) => creneaux.some((c) => c.jour === j)).map(
    (j) => JOURS_COURTS[j] ?? j,
  );
  const inconnus = creneaux.filter((c) => !(c.jour in JOURS_COURTS)).map((c) => c.jour);
  const tousLesJours = [...jours, ...new Set(inconnus)];

  const debuts = creneaux.map((c) => c.heureDebut).filter(Boolean).sort();
  const fins = creneaux.map((c) => c.heureFin).filter(Boolean).sort();
  const amplitude =
    debuts.length > 0 && fins.length > 0
      ? `${heureLisible(debuts[0])}-${heureLisible(fins[fins.length - 1])}`
      : '';

  return [tousLesJours.join(' · '), amplitude].filter(Boolean).join(' ');
}

/** Forme minimale de fiche école attendue pour construire un contexte. */
export interface FicheEcolePourRaccourcis {
  ville?: string | null;
  lieu?: {
    nom?: string | null;
    adresse?: string | null;
    codePostal?: string | null;
    ville?: string | null;
  } | null;
  contact?: { email?: string | null; telephone?: string | null } | null;
  adhesion?: { montant?: number | null; saison?: string | null } | null;
  essai?: { seancesOffertes?: number | null } | null;
  creneaux?: readonly CreneauBrut[] | null;
}

export interface ComptesAffiches {
  /** Nombre d'armes réellement affichées dans la grille. */
  nbArmes: number;
  /** Nombre d'encadrants réellement affichés. */
  nbProfs: number;
}

/**
 * Assemble le contexte de raccourcis d'une école, pour une page donnée.
 *
 * Les valeurs *affichables* (lieu, adresse, ville, saison, créneaux, nom
 * d'arme, nom d'encadrant) sont normalisées typographiquement dès leur
 * fabrication : « Salle de l'Oradou » devient « Salle de l’Oradou » même
 * lorsqu'un composant lit `ctx.ville` ou `ctx.lieu` en direct, sans passer par
 * `resoudre()` — c'est le cas du hero (`à {ville}`).
 *
 * `email` et `telephone` en sont exclus : ce sont des valeurs *techniques*, qui
 * alimentent aussi des `mailto:` / `tel:` et des recherches de sous-chaîne
 * (`lierEmail()` dans `Faq.astro`). On ne touche jamais à une clé qui sert de
 * pivot à un lien.
 */
export function contexteDe(
  fiche: FicheEcolePourRaccourcis,
  comptes: ComptesAffiches,
  contextuel: { arme?: string; prof?: string } = {},
): ContexteRaccourcis {
  const ville = fiche.lieu?.ville || fiche.ville || '';
  const adresse = [fiche.lieu?.adresse, [fiche.lieu?.codePostal, ville].filter(Boolean).join(' ')]
    .filter(Boolean)
    .join(' · ');

  // Espace insécable devant l'unité : « 85 € » ne se coupe jamais en fin de ligne.
  const tarif = fiche.adhesion?.montant != null ? `${fiche.adhesion.montant}${INSECABLE}€` : '';

  const contextuelNormalise: { arme?: string; prof?: string } = {};
  if (contextuel.arme !== undefined) contextuelNormalise.arme = typographieFr(contextuel.arme);
  if (contextuel.prof !== undefined) contextuelNormalise.prof = typographieFr(contextuel.prof);

  return {
    email: fiche.contact?.email ?? '',
    telephone: fiche.contact?.telephone ?? '',
    lieu: typographieFr(fiche.lieu?.nom),
    adresse: typographieFr(adresse),
    ville: typographieFr(ville),
    tarif,
    saison: typographieFr(fiche.adhesion?.saison),
    creneaux: typographieFr(creneauxEnPhrase(fiche.creneaux ?? [])),
    creneaux_court: typographieFr(creneauxCompact(fiche.creneaux ?? [])),
    essai: fiche.essai?.seancesOffertes != null ? nombreEnLettres(fiche.essai.seancesOffertes) : '',
    nb_armes: nombreEnLettres(comptes.nbArmes),
    nb_profs: nombreEnLettres(comptes.nbProfs),
    ...contextuelNormalise,
  };
}

/** Numéro de téléphone en lien `tel:` — « 06 61 28 65 11 » → « tel:+33661286511 ». */
export function lienTelephone(telephone: string | null | undefined): string {
  if (!telephone) return '';
  const chiffres = telephone.replace(/[^\d+]/g, '');
  if (chiffres.startsWith('+')) return `tel:${chiffres}`;
  if (chiffres.startsWith('0')) return `tel:+33${chiffres.slice(1)}`;
  return `tel:${chiffres}`;
}
