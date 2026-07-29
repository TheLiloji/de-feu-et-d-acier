/**
 * Seuils de bascule du gabarit — source unique.
 *
 * Le site n'a qu'un seul vrai changement de gabarit, hérité de la maquette :
 * mobile (390) → desktop (1440), interpolé au `clamp()` entre les deux. Deux
 * seuils seulement découpent cette rampe, et ils ne se valent pas :
 *
 *   - **820 px** — bascule de *contenu* : une grille passe de une à deux
 *     colonnes, un accordéon redevient une liste, un carrousel une mosaïque.
 *     Chaque section choisit le sien ; rien ne les lie entre elles.
 *   - **1000 px** — bascule du **chrome de navigation**, et elle est indivisible.
 *     La nav desktop (six liens centrés + CTA) ne tient pas sous 1000 px
 *     (cf. `Nav.astro`, calcul de largeur) : en dessous, la page est en gabarit
 *     mobile — blason + burger, tiroir plein écran, barre d'onglets fixe en bas.
 *
 * Le second seuil apparaît dans plusieurs fichiers, et une seule valeur qui
 * diverge suffit à ouvrir un trou : entre 820 et 1000, la bande n'avait plus
 * ni liens de nav, ni tiroir (masqué par sa propre CSS), ni barre d'onglets.
 * D'où cette constante, et le commentaire qui la cite dans chacune des feuilles
 * concernées — une media query CSS ne pouvant pas lire une variable, les
 * littéraux `1000px` restent, mais ils ont désormais une adresse unique où l'on
 * vérifie ce qu'ils valent.
 *
 * Fichiers alignés sur `BASCULE_NAV` :
 *   - `src/components/sections/Nav.astro`      (nav desktop / barre mobile)
 *   - `src/components/sections/MenuMobile.astro` (tiroir : CSS + script)
 *   - `src/components/ui/TabBar.astro`         (barre d'onglets + sa cale)
 *   - `src/components/fiches/ProfHero.astro`   (bouton HEMA sous le portrait)
 *   - `src/components/fiches/ProfCta.astro`    (copie mobile du même bouton)
 *   - `src/styles/global.css`                  (`scroll-padding-bottom`)
 */

/** Largeur à partir de laquelle le chrome desktop remplace le chrome mobile. */
export const BASCULE_NAV = 1000;

/** `matchMedia` : vrai quand la page est en chrome desktop. */
export const REQUETE_NAV_DESKTOP = `(min-width: ${BASCULE_NAV}px)`;
