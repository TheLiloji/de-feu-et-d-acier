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
  /**
   * Séance encadrée par un membre de l'équipe (case « Séance encadrée » du CMS).
   * `false` = pratique libre : le créneau existe, mais ce n'est pas un cours.
   * Absent, le créneau est traité comme un cours — c'est le défaut du CMS.
   */
  encadre?: boolean | null;
}

/** Une plage horaire d'un jour donné, bornes brutes (« 18:00 »). */
interface Plage {
  debut: string;
  fin: string;
}

/** Un ou plusieurs jours qui partagent exactement les mêmes plages. */
interface GroupeJours {
  jours: string[];
  plages: Plage[];
}

/** « a » · « a et b » · « a, b et c ». */
function enumerer(morceaux: readonly string[]): string {
  if (morceaux.length === 0) return '';
  if (morceaux.length === 1) return morceaux[0]!;
  return `${morceaux.slice(0, -1).join(', ')} et ${morceaux[morceaux.length - 1]}`;
}

/** Plages d'un même jour, triées puis fusionnées quand elles se touchent. */
function fusionner(plages: readonly Plage[]): Plage[] {
  const triees = [...plages].sort((a, b) => a.debut.localeCompare(b.debut));
  const fusion: Plage[] = [];
  for (const p of triees) {
    const precedent = fusion[fusion.length - 1];
    if (precedent && precedent.fin === p.debut) precedent.fin = p.fin;
    else fusion.push({ ...p });
  }
  return fusion;
}

const signature = (plages: readonly Plage[]) => plages.map((p) => `${p.debut}→${p.fin}`).join('|');

/**
 * Range les créneaux par jour, dans l'ordre de la semaine, puis rassemble les
 * jours voisins aux horaires identiques : « mardi et jeudi de 18h à 20h » plutôt
 * que « mardi de 18h à 20h et jeudi de 18h à 20h ».
 *
 * ⚠️ À n'appeler que sur un ensemble homogène de créneaux (les cours d'un côté,
 * la pratique libre de l'autre) : la fusion des plages contiguës d'un même jour
 * n'a de sens qu'entre séances de même nature.
 */
function groupesDeJours(creneaux: readonly CreneauBrut[]): GroupeJours[] {
  const parJour = new Map<string, Plage[]>();
  for (const c of creneaux) {
    const liste = parJour.get(c.jour) ?? [];
    liste.push({ debut: c.heureDebut, fin: c.heureFin });
    parJour.set(c.jour, liste);
  }

  // Un jour hors calendrier (saisie exotique) part en fin de semaine plutôt que
  // de disparaître de la phrase.
  const jours = [
    ...ORDRE_JOURS.filter((j) => parJour.has(j)),
    ...[...parJour.keys()].filter((j) => !ORDRE_JOURS.includes(j)),
  ];

  const groupes: GroupeJours[] = [];
  for (const jour of jours) {
    const plages = fusionner(parJour.get(jour)!);
    const precedent = groupes[groupes.length - 1];
    if (precedent && signature(precedent.plages) === signature(plages)) precedent.jours.push(jour);
    else groupes.push({ jours: [jour], plages });
  }
  return groupes;
}

/** « de 18h à 20h », ou « de 12h à 14h et de 18h à 20h » pour un jour coupé. */
const heuresEnPhrase = (plages: readonly Plage[]) =>
  plages.map((p) => `de ${heureLisible(p.debut)} à ${heureLisible(p.fin)}`).join(' et ');

const nomDuJour = (jour: string) => JOURS[jour] ?? jour;

/** « mardi de 18h à 20h et jeudi de 20h à 22h ». */
const phraseDesGroupes = (groupes: readonly GroupeJours[]) =>
  enumerer(groupes.map((g) => `${enumerer(g.jours.map(nomDuJour))} ${heuresEnPhrase(g.plages)}`));

/** « le jeudi de 18h à 20h », « les mardi et jeudi de 12h à 14h ». */
const phraseDesGroupesArticlee = (groupes: readonly GroupeJours[]) =>
  enumerer(
    groupes.map(
      (g) =>
        `${g.jours.length > 1 ? 'les' : 'le'} ${enumerer(g.jours.map(nomDuJour))} ` +
        heuresEnPhrase(g.plages),
    ),
  );

/** Un créneau encadré, donc un cours. Le défaut du CMS étant « encadré », seul `false` compte. */
const estCours = (c: CreneauBrut) => c.encadre !== false;

/**
 * Résume les créneaux en une phrase — **les cours d'abord, la pratique libre à
 * part** : « mardi de 18h à 20h et jeudi de 20h à 22h, plus la pratique libre le
 * jeudi de 18h à 20h ».
 *
 * Pourquoi cette séparation : à Clermont, le jeudi porte deux créneaux qui se
 * touchent — une pratique libre sans encadrant de 18h à 20h, puis le cours de
 * 20h à 22h. Les fusionner en « jeudi 18h-22h », comme le faisait la première
 * version, annonçait quatre heures de cours là où il y en a deux, et effaçait la
 * seule information qu'un visiteur doit avoir avant de pousser la porte : à 18h,
 * il n'y a personne pour l'accueillir. Une phrase de créneaux doit être *juste*
 * avant d'être courte ; le raccourci compact, lui, est fait pour la brièveté.
 *
 * Les plages contiguës d'un même jour restent fusionnées **à l'intérieur** de
 * chaque catégorie (deux cours qui s'enchaînent se lisent « de 18h à 22h »).
 *
 * Le libellé « pratique libre » est celui du site, pas celui du CMS : l'intitulé
 * libre du créneau (« Pratique libre », « Salle ouverte »…) reste affiché tel
 * quel par le tableau de « Nous rejoindre », qui, lui, détaille. Ici, une
 * formule stable — et grammaticalement sûre — vaut mieux qu'un intitulé dont on
 * ne connaît ni le genre ni le nombre.
 */
export function creneauxEnPhrase(creneaux: readonly CreneauBrut[]): string {
  const cours = groupesDeJours(creneaux.filter(estCours));
  const libres = groupesDeJours(creneaux.filter((c) => !estCours(c)));

  if (cours.length === 0) {
    // Aucun cours encadré : la pratique libre porte la phrase à elle seule.
    const seule = phraseDesGroupes(libres);
    return seule ? `${seule} en pratique libre` : '';
  }
  if (libres.length === 0) return phraseDesGroupes(cours);
  return `${phraseDesGroupes(cours)}, plus la pratique libre ${phraseDesGroupesArticlee(libres)}`;
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
 * Forme compacte des créneaux : « Mar · Jeu 18h-20h », ou « Mar · Jeu » quand
 * les cours n'ont pas les mêmes horaires d'un jour à l'autre.
 *
 * `{creneaux}` rend la phrase complète, juste mais longue : dans le bandeau
 * d'accroche du hero, en capitales avec 0,24 em d'interlettrage, elle se replie
 * sur trois lignes là où la maquette (§3.1 et §4.1) pose **une** ligne. D'où ce
 * second raccourci — les jours de cours abrégés, et l'horaire seulement s'il est
 * le même partout.
 *
 * Deux partis pris, pour rester bref **sans mentir** :
 *
 *   - on ne compte que les **cours** : un jour où la salle n'est ouverte qu'en
 *     pratique libre n'a rien à annoncer dans un bandeau qui invite à venir
 *     essayer. (Sans aucun cours encadré, on retombe sur tous les créneaux :
 *     mieux vaut une ligne approximative qu'une ligne vide.)
 *   - l'amplitude « 18h-22h » de la première version additionnait le mardi de
 *     18h à 20h et le jeudi de 20h à 22h : elle promettait quatre heures de
 *     cours par soir. L'horaire n'apparaît donc que si tous les jours de cours
 *     ont le même ; sinon, les jours suffisent.
 *
 * Le détail exact reste porté par le tableau des créneaux de « Nous rejoindre »,
 * qui, lui, est complet.
 */
export function creneauxCompact(creneaux: readonly CreneauBrut[]): string {
  const cours = creneaux.filter(estCours);
  const retenus = cours.length > 0 ? cours : creneaux;
  if (retenus.length === 0) return '';

  const groupes = groupesDeJours(retenus);
  const jours = groupes.flatMap((g) => g.jours).map((j) => JOURS_COURTS[j] ?? j);

  // Un seul groupe d'une seule plage : tous les jours retenus ont le même
  // horaire, on peut le donner. Sinon, aucune abréviation ne serait honnête.
  const uniforme = groupes.length === 1 && groupes[0]!.plages.length === 1;
  const plage = groupes[0]?.plages[0];
  const heures =
    uniforme && plage ? `${heureLisible(plage.debut)}-${heureLisible(plage.fin)}` : '';

  return [jours.join(' · '), heures].filter(Boolean).join(' ');
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
