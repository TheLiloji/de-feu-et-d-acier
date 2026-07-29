/**
 * Numérotation des sections — calculée au rendu, jamais stockée.
 *
 * ARCHITECTURE.md §5 : « Numérotation des sections (01·, 02·…) : **calculée au
 * rendu**, jamais stockée en base. » Autrement dit, si le client masque la
 * section « Tournois » dans l'admin, « Galerie » devient 06 toute seule et
 * personne ne renumérote quoi que ce soit à la main.
 *
 * Le compteur vit dans `Astro.locals`, qui est un objet neuf à chaque rendu de
 * page — y compris en pré-rendu statique, où le middleware s'exécute au build.
 * C'est le seul endroit dont la durée de vie corresponde exactement à « une
 * page ». Un compteur de module, lui, fuirait d'une page à l'autre pendant le
 * build et dériverait à chaque rechargement en `astro dev`.
 *
 * Le secours (`REPLI`) ne sert que si `locals` n'est pas un objet exploitable :
 * on numérote alors par chemin d'URL, ce qui reste juste au build et ne dérive
 * qu'en développement. Dans tous les cas la prop `numero` de `SectionLabel`
 * permet de forcer une valeur.
 */

const CLE = '__dfdaCompteurSections';
const REPLI = new Map<string, number>();

/**
 * Renvoie le rang de la section courante (1, 2, 3…) et avance le compteur.
 *
 * @param locals  `Astro.locals` du composant appelant.
 * @param chemin  `Astro.url.pathname`, utilisé seulement par le secours.
 */
export function numeroSuivant(locals: unknown, chemin = '/'): number {
  if (locals && typeof locals === 'object') {
    try {
      const sac = locals as Record<string, unknown>;
      const precedent = typeof sac[CLE] === 'number' ? (sac[CLE] as number) : 0;
      const rang = precedent + 1;
      sac[CLE] = rang;
      return rang;
    } catch {
      // `locals` scellé ou proxifié par l'adaptateur : on passe au secours
      // plutôt que de faire échouer un build pour une numérotation.
    }
  }

  const rang = (REPLI.get(chemin) ?? 0) + 1;
  REPLI.set(chemin, rang);
  return rang;
}

/**
 * Remet le compteur à zéro pour la page courante.
 *
 * Utile si une page rend deux suites numérotées indépendantes, ou si un
 * gabarit veut repartir de 01 après un bloc emprunté à une autre page.
 */
export function reinitialiserNumerotation(locals: unknown, chemin = '/'): void {
  if (locals && typeof locals === 'object') {
    try {
      (locals as Record<string, unknown>)[CLE] = 0;
      return;
    } catch {
      /* voir numeroSuivant */
    }
  }
  REPLI.delete(chemin);
}

/** `1` → `« 01 »`, `12` → `« 12 »`. Deux chiffres, comme dans la maquette. */
export function formaterNumero(rang: number): string {
  return String(rang).padStart(2, '0');
}
