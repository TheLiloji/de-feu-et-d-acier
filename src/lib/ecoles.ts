/**
 * Résolution des écoles : configuration (`src/config/ecoles.ts`) + fiche CMS.
 *
 * Les signatures sont multi-écoles depuis le premier jour, appelées aujourd'hui
 * avec une seule école (multi-ecoles.md §6.6, invariant 4). Le jour où Lyon
 * ouvre, ni ces fonctions ni les composants qui les consomment ne changent.
 */
import { ECOLES, ECOLE_PRINCIPALE, ecoleConfig, type EcoleConfig } from '../config/ecoles';
import { ficheEcole, type FicheEcole } from './contenu';

/** Une école complète : sa configuration technique et son contenu éditorial. */
export type Ecole = EcoleConfig & {
  /** Contenu saisi dans l'admin : lieu, contact, créneaux, tarifs, réseaux. */
  fiche: FicheEcole;
};

async function assembler(config: EcoleConfig): Promise<Ecole> {
  let fiche: FicheEcole;
  try {
    fiche = await ficheEcole(config);
  } catch (cause) {
    throw new Error(
      `Fiche d'école introuvable ou illisible pour « ${config.slug} » ` +
        `(attendue dans src/content/ecoles/${config.slug}/ecole.yaml).\n` +
        'Créer la fiche depuis l’admin Keystatic, rubrique « Lieu, contact, créneaux & tarifs ».',
      { cause },
    );
  }
  return { ...config, fiche };
}

/** Toutes les écoles déclarées, dans l'ordre de `src/config/ecoles.ts`. */
export async function getEcoles(): Promise<Ecole[]> {
  return Promise.all(ECOLES.map(assembler));
}

/** Une école par son slug. Lève si le slug n'est pas déclaré. */
export async function getEcole(slug: string): Promise<Ecole> {
  const config = ecoleConfig(slug);
  if (!config) {
    throw new Error(
      `École inconnue : « ${slug} ». Écoles déclarées : ${ECOLES.map((e) => e.slug).join(', ')}. ` +
        'Une nouvelle école se déclare dans src/config/ecoles.ts.',
    );
  }
  return assembler(config);
}

/** L'école servie sur « / ». */
export async function getEcolePrincipale(): Promise<Ecole> {
  return assembler(ECOLE_PRINCIPALE);
}

/** Les écoles secondaires — vide aujourd'hui, source des routes `/<slug>/` le jour J. */
export async function getEcolesSecondaires(): Promise<Ecole[]> {
  return Promise.all(ECOLES.filter((e) => !e.principale).map(assembler));
}
