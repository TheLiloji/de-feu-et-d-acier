# Widgets de corps libre — cahier des charges

> **Statut : SPÉCIFICATION.** Ce document est le contrat des trois chantiers qui
> suivent (schéma CMS, moteur de rendu, branchement des gabarits). Il s'appuie
> sur l'API réellement lue dans `node_modules/@keystatic/core@0.6.3` et
> `node_modules/@markdoc/markdoc@0.4.0` : toutes les signatures citées au §1 ont
> été relevées dans les fichiers indiqués, et tous les fragments `.mdoc` du §3
> ont été produits par `Markdoc.format()` puis re-parsés pour vérifier qu'ils
> sont stables. En cas de conflit avec `content-model.md`, ce fichier gagne pour
> les quatre champs concernés ; `ARCHITECTURE.md` reste au-dessus de tout.

## 0. Demande client et périmètre

Le rédacteur compose **librement** les pages à corps de texte : il écrit du
markdown et insère des widgets où il veut, dans l'ordre qu'il veut. L'exemple
donné par le client : « petit texte, vidéo, interview, autre texte, widget vers
la page épée longue, widget vers un livre de la bibliothèque, texte, plein de
photos en galerie ».

Quatre champs sont concernés, et **eux seuls** :

| Gabarit | Collection | Champ | Fichier de contenu |
| --- | --- | --- | --- |
| Fiche encadrant | `profs_<ecole>` | `bio` | `src/content/ecoles/<ecole>/profs/*.mdoc` |
| Fiche arme | `disciplines` | `description` | `src/content/commun/disciplines/*.mdoc` |
| Article | `articles_<ecole>` | `corps` | `src/content/ecoles/<ecole>/articles/*.mdoc` |
| Fiche de traité | `traites` | `presentation` | `src/content/commun/traites/*.mdoc` |

L'accueil reste fermé (sections fixes). Les réponses de FAQ et les présentations
de partenaires restent en `texteRiche` sans widget : ce sont des blocs courts
rendus dans un `<details>` ou une carte, où un carrousel n'aurait aucun sens.

Six widgets sont livrés : « Galerie de photos », « Vidéo »,
« Questions-réponses », « Renvoi vers une page du site », « Bouton »,
« Planche seule ».

---

## 1. L'API réelle de Keystatic 0.6.3

### 1.1 `@keystatic/core/content-components`

Fichier de types :
`node_modules/@keystatic/core/dist/declarations/src/content-components.d.ts`
(réexporté par `dist/keystatic-core-content-components.d.ts`).

Signatures **exactes**, recopiées de ce fichier :

```ts
type BlockComponentConfig<Schema extends Record<string, ComponentSchema>> = {
    label: string;
    description?: string;
    icon?: ReactElement;
    schema: Schema;
    forSpecificLocations?: boolean;
} & ({
    ContentView?: (props: {
        value: ParsedValueForComponentSchema<ObjectField<Schema>>;
    }) => ReactNode;
} | {
    NodeView?: (props: {
        value: ParsedValueForComponentSchema<ObjectField<Schema>>;
        onChange(value: ParsedValueForComponentSchema<ObjectField<Schema>>): void;
        onRemove(): void;
        isSelected: boolean;
    }) => ReactNode;
});
type BlockComponent<Schema extends Record<string, ComponentSchema>> =
    BlockComponentConfig<Schema> & {
    kind: 'block';
    handleFile?: (file: File, config: Config) =>
        false | Promise<ParsedValueForComponentSchema<ObjectField<Schema>>>;
};
export declare function block<Schema extends Record<string, ComponentSchema>>(
    config: BlockComponentConfig<Schema>): BlockComponent<Schema>;
```

```ts
type WrapperComponentConfig<Schema extends Record<string, ComponentSchema>> = {
    label: string;
    description?: string;
    icon?: ReactElement;
    schema: Schema;
    forSpecificLocations?: boolean;
} & ({
    ContentView?: (props: {
        value: ParsedValueForComponentSchema<ObjectField<Schema>>;
        children: ReactNode;
    }) => ReactNode;
} | {
    NodeView?: (props: { … ; children: ReactNode; }) => ReactNode;
});
export declare function wrapper<…>(config: WrapperComponentConfig<Schema>):
    WrapperComponent<Schema>;   // kind: 'wrapper'
```

```ts
type InlineComponentConfig<Schema> = {
    label: string;
    description?: string;
    icon?: ReactElement;
    schema: Schema;
    ToolbarView?(props: { value; onChange(value); onRemove(); }): ReactNode;
} & ({ ContentView?… } | { NodeView?… });
export declare function inline<…>(config): InlineComponent<Schema>; // kind: 'inline'

type MarkComponentConfig<Schema> = {
    label: string;
    icon: ReactElement;              // obligatoire pour un mark
    schema: Schema;
    tag?: 'span' | 'strong' | 'em' | 'u' | 'del' | 'code' | 'a' | 'sub' | 'sup'
        | 'kbd' | 'abbr' | 'mark' | 's' | 'small' | 'big';
    style?: Thing<{ [key: string]: string }, Schema>;
    className?: Thing<string, Schema>;
};
export declare function mark<…>(config): MarkComponent<Schema>;     // kind: 'mark'

type RepeatingComponentConfig<Schema> = WrapperComponentConfig<Schema> & {
    children: string | string[];
    validation?: { children?: { min?: number; max?: number } };
};
export declare function repeating<…>(config): RepeatingComponent<Schema>;

export declare function cloudImage(args: { label: string }): BlockComponent<…>;

export type ContentComponent =
    WrapperComponent<…> | BlockComponent<…> | RepeatingComponent<…>
    | InlineComponent<…> | MarkComponent<…>;
```

L'implémentation (`dist/keystatic-core-content-components.js`) est triviale :
`block(config)` renvoie `{ kind: 'block', ...config }`. Toute l'intelligence est
dans `createEditorSchema`.

**Les six widgets sont des `block`.** Pas de `wrapper` (aucun widget n'enveloppe
du texte), pas de `repeating`, pas d'`inline`, pas de `mark`.

### 1.2 `fields.markdoc({ components })`

Fichier de types :
`dist/declarations/src/form/fields/markdoc/index.d.ts`.

```ts
export declare function markdoc({ label, description, options, components, extension }: {
    label: string;
    description?: string;
    options?: MarkdocEditorOptions;
    extension?: 'mdoc' | 'md';
    components?: Record<string, ContentComponent>;
}): markdoc.Field;

export declare namespace markdoc {
    type Field = ContentFormField<EditorState, EditorState, { node: MarkdocNode }>;
    var createMarkdocConfig: typeof import("./markdoc-config.js").createMarkdocConfig;
    var inline: (…) => markdoc.inline.Field;
}
```

`MarkdocEditorOptions` (fichier `markdoc/config.d.ts`) est exactement ce que le
projet passe déjà dans `corpsRiche()` / `texteRiche()` : `bold`, `italic`,
`strikethrough`, `code`, `heading`, `blockquote`, `orderedList`,
`unorderedList`, `table`, `link`, `image`, `divider`, `codeBlock`.

**La clé du `Record` est le nom du tag Markdoc.** Voir `getCustomNodeSpecs`
(`dist/index-bea09e17.js` l. 20354) : le nœud ProseMirror porte le nom
`name`, et `proseMirrorToMarkdoc` (l. 26345) écrit
`new Ast.Node('tag', internalToSerialized(componentConfig.schema, node.attrs.props, state), children, name)`.

`markdoc.createMarkdocConfig({ options, components, render })` existe et sert à
fabriquer un `Markdoc.Config` de rendu (mapping tag → nom de composant React).
**Le projet ne l'utilise pas** : le rendu public est en `.astro`, pas en React
(ARCHITECTURE.md §2), et le moteur du §4 fait l'aiguillage lui-même.

### 1.3 Sérialisation vers le `.mdoc`

Chaîne complète, lue dans `dist/index-bea09e17.js` :

1. `serializeFromEditorState` (l. 27404) : `proseMirrorToMarkdoc(...)` puis
   `format(markdocNode)` puis `format(parse(markdoc))`. La double passe
   normalise : **le fichier écrit est un point fixe du formateur**.
2. `proseMirrorToMarkdoc` (l. 26345) fabrique un nœud `tag` dont les attributs
   viennent de `internalToSerialized(componentConfig.schema, node.attrs.props, state)`
   (l. 20087), qui délègue à `serializeProps$1` (l. 18529).
3. `serializeProps$1` traite les genres de schéma ainsi :
   - `object` : `Object.fromEntries(entries.filter(([_, val]) => val !== undefined))`,
     donc **une valeur `undefined` disparaît de la sortie** ;
   - `array` : `value.map(val => val === undefined ? null : val)` ;
   - `conditional` : `{ discriminant }` seul si `value.value === undefined`,
     sinon `{ discriminant, value }` ;
   - `form` de `formKind: 'asset'` (`fields.image`, `fields.file`) : renvoie
     `` `${getSrcPrefix(publicPath, slug)}${filename}` `` et pousse le fichier
     dans `extraFiles` avec `parent: schema.directory` ;
   - `child` : `undefined` (donc **`fields.child` est inutilisable ici**).
4. Le formateur Markdoc (`@markdoc/markdoc/src/formatter.ts`) écrit le tag :
   ```
   case 'tag': …
     const tag = [OPEN + SPACE + n.tag, ...attributes];
     const isLongTagOpening = inlineTag.length + open.length * 2 > (o.maxTagOpeningWidth || 80);
     yield (!n.inline && isLongTagOpening ? tag.join(NL + …) : inlineTag)
         + SPACE + (n.children.length ? '' : '/') + CLOSE;
   ```
   Donc : tag auto-fermant `{% nom … /%}` pour un `block` sans enfant, une
   ligne si l'ouverture tient en **80 signes**, un attribut par ligne au-delà,
   et une ligne vide avant et après.
5. `formatScalar` sérialise les valeurs : chaînes en JSON (`"…"`, échappement
   `\n` et `\"`), nombres et booléens nus, `null` littéral, tableaux
   `[a, b]`, objets `{cle: valeur, cle2: valeur2}` (clé nue si elle passe
   `IDENTIFIER_REGEX = /^[a-zA-Z0-9_-]+$/`, entre guillemets sinon).

**Vérifié en machine** (script jeté après usage) : un attribut objet imbriqué
dans un tableau, une chaîne multiligne, les accents, les guillemets typographiques
et les guillemets droits échappés font tous un aller-retour
`format` → `parse` → `format` **identique au caractère près**.

**Vérifié aussi, et c'est un piège mortel** : si une valeur imbriquée vaut
`undefined`, `formatScalar` écrit littéralement `undefined`, ce que la grammaire
Markdoc refuse ; le tag entier devient invalide et **ses attributs sont perdus**
(`node.attributes === {}`, erreur `Expected "(" but "}" found.`). Keystatic ne
produit jamais ce cas (cf. les trois filtres du point 3), mais une écriture
manuelle ou un script de migration le peut : toute migration de contenu doit
repasser par `format(parse(texte))` pour vérifier la stabilité.

### 1.4 Lecture : ce que le Reader restitue

`dist/index-bea09e17.js` l. 27803 :

```js
reader: {
  parse: (_, { content }) => {
    const text = textDecoder.decode(content);
    return { node: parse(text) };     // parse = Markdoc.parse
  }
},
```

Donc :

- le Reader renvoie **l'AST Markdoc brut**, `{ node }`, exactement comme
  aujourd'hui pour `bio`, `description`, `corps`, `presentation` ;
- il n'applique **aucune** validation : les tags inconnus, les attributs
  inconnus, les champs obligatoires vides passent sans un mot ;
- un tag de widget apparaît comme un nœud `{ type: 'tag', tag: '<nom>',
  attributes: {…}, children: [] }`, **enfant direct du nœud `document`** quand
  il a été inséré au premier niveau ;
- le champ reste **paresseux** tant que `resolveLinkedFiles` n'est pas demandé
  (`dist/generic-5907f9e7.js` l. 135 : `contentFieldPathsToEagerlyResolve =
  resolveLinkedFiles ? [] : undefined`). C'est pourquoi `entry.corps` est une
  fonction à appeler (`await entree.corps()`), et pourquoi les garde-fous
  actuels, qui sautent les valeurs de type `function`, ne voient rien des corps.

### 1.5 Le piège central : `Markdoc.transform` mange les tags inconnus

`@markdoc/markdoc/src/transformer.ts` :

```ts
node(node, config = {}) {
  const schema = this.findSchema(node, config) ?? {};   // tags[node.tag]
  if (schema && schema.transform instanceof Function) return schema.transform(node, config);
  const children = this.children(node, config);
  if (!schema || !schema.render) return children;       // ← ici
  …
}
```

`src/lib/markdoc.ts` appelle `Markdoc.transform(noeud)` **sans configuration**.
Conséquence mesurée : un `{% galerie … /%}` traversant `rendreCorps()` ne
produit **rien du tout**, sans erreur ni avertissement. `Markdoc.validate()`
le signalerait (`Undefined tag: 'galerie'`), mais personne ne l'appelle.

C'est la raison d'être du moteur du §4, et la raison pour laquelle
`rendreMarkdoc()` doit **lever** sur un nœud `tag` (§4.5) : une disparition
silencieuse de contenu est le pire résultat possible.

### 1.6 Contraintes et pièges vérifiés

| Point | Constat | Conséquence pour le chantier |
| --- | --- | --- |
| Nom de tag | `Identifier = [a-zA-Z0-9_-]+` (`src/grammar/tag.pegjs` l. 173, `IDENTIFIER_REGEX` dans `src/utils.ts`) | Clés ASCII, sans accent : `galerie`, `video`, `questions`, `renvoi`, `bouton`, `planche`. |
| Tag non déclaré à l'ouverture | `markdocNodeToProseMirrorNode$1` pousse `Missing component definition for <tag>`, puis `markdocToProseMirror` **lève** (l. 26432 : `if (_state.errors.length) throw new Error(...)`) | Les **quatre** champs doivent déclarer **le même jeu** de composants, sinon l'entrée devient impossible à ouvrir dans l'admin. |
| Attribut inconnu | `parseProps` : `Key on object value "x" is not allowed` → même levée | **Retirer un champ d'un widget est une rupture** : tout `.mdoc` qui le porte encore devient illisible dans l'admin. Toute suppression de champ se fait avec une migration des fichiers dans le même commit. |
| Champ manquant | `parseProps` remplit avec `parse(undefined)` (chaîne vide, `null`, `[]`) | **Ajouter** un champ facultatif est rétrocompatible. |
| Fichier image absent du dépôt | `deserializeProps$1` passe `asset: undefined`, `image.parse` renvoie `null` | Ouvrir puis enregistrer une entrée dont l'image a été supprimée du dépôt **efface la référence**. À dire dans le guide admin. |
| `fields.image` dans un widget | `transformFilename` est honoré (l. 13487), et `getDirectoriesForEditorField` (l. 27747) collecte les répertoires via `collectDirectoriesUsedInSchema` | `imageEditoriale()` est réutilisable tel quel. |
| `icon` | C'est un `ReactElement` ; les icônes livrées (`@keystar/ui/icon/icons/*`) sont des fragments JSX qui tirent tout le design system | **Aucun `icon`** sur nos widgets : les entrées du menu « + » s'afficheront avec leur libellé et leur description, sans glyphe. Voir §7. |
| `ContentView` | Rendu **dans** le bloc, sous la barre de titre du `BlockWrapper` | Autorisé, mais uniquement en éléments DOM simples via `createElement`, jamais de composant `@keystar/ui`. Voir §7. |
| Poids du bundle | `dist/keystatic-core-content-components.node.js` et `.worker.js` sont des **stubs** : ils n'importent que `react/jsx-runtime` et deux modules déjà tirés par `@keystatic/core` | Importer `block` depuis `@keystatic/core/content-components` dans `keystatic.config.ts` **n'alourdit ni le pré-rendu Node ni le Worker**. C'est le seul import à faire. |
| Interface du bloc | `BlockWrapper` (l. 20151) : cadre à filet, libellé du composant en capitales, bouton « Edit », dialogue « Edit \<label\> » contenant le formulaire | Le libellé français porte tout le sens ; « Edit » et « Done » sont en dur en anglais dans cette version. `config({ locale: 'fr-FR' })` traduirait « Cancel » et l'essentiel du reste : à proposer au client, hors périmètre. |
| Validation à la saisie | `FormValue` (l. 19845) : `clientSideValidateProp(props.schema, state)` avant d'accepter. `validateValueWithSchema` (l. 3814) descend dans `object`, `array` (longueur comprise, via `validateArrayLength`) et `conditional` | `validation: { isRequired: true }` et `validation: { length: { min: 1 } }` bloquent réellement le bouton « Done ». Deux réserves : le message est bâti en anglais (`` `${label} must not be empty` ``, seul le libellé est français), et rien de tout cela ne protège un fichier écrit à la main ni le contenu antérieur. D'où le garde-fou n° 9. |
| Menu d'insertion | `InsertBlockMenu` (l. 24262) : bouton « + » de la barre d'outils, raccourci `/`, entrées **triées par `label`**, chacune avec son `description` en seconde ligne | Les libellés sont choisis pour que le tri alphabétique reste lisible. |
| Déplacement d'un bloc | Aucune poignée de glisser-déposer dans cette version (recherche infructueuse de `dragHandle`, `draggable`, `Move up`) | « Déplaçable » = sélection du nœud puis couper/coller (`Ctrl+X` / `Ctrl+V`), la sérialisation du presse-papier étant en Markdoc (`markdocClipboard`, l. 26687). À écrire dans le guide admin. |
| Liste déroulante de `fields.relationship` | `RelationshipInput` (`dist/keystatic-core.js` l. 2717) affiche `useSlugsInCollection(collection)`, un `Combobox` dont chaque item est **le slug brut** | Le rédacteur voit `epee-longue`, `talhoffer-1467`, `gabriel-tardio`. Les slugs du projet sont du français lisible : c'est acceptable, et la `description` du champ le dit. |
| Emplacement d'un bloc | Le spec de nœud est `group: 'block …'`, or `blockquote` et `list_item` ont `content: 'block+'` | Un widget **peut** techniquement être posé dans une citation ou une puce. Le moteur ne sait pas rendre ce cas : garde-fou n° 9, sous-règle 9f. |

---

## 2. L'existant à réutiliser

Rien n'est réécrit. Le chantier assemble ce qui existe.

### 2.1 Rendu Markdoc

- **`src/lib/markdoc.ts`** : `rendreMarkdoc(noeud)`, `rendreCorps({node})`,
  `corpsEnTexte(html)`. Retire le `<article>` racine posé par `transform`.
  Consommé aujourd'hui par `Faq.astro`, `Partenaires.astro`,
  `profs/[slug].astro`, `sources/[slug].astro`.
- **`src/components/fiches/ArmeCorps.astro`** : parcours d'AST maison, avec
  résolution des images par `resoudrePhoto()` seulement (pas de `getImage`),
  échappement HTML maison, résolution des raccourcis par `resoudre()`.
- **`src/pages/actualites/[slug].astro` l. 195-319** : second parcours maison,
  celui-ci complet : `collecterImages()` ramasse les `src`, `getImage()`
  produit un dérivé WebP plafonné à 1280 px, puis `rendreMarkdoc()` local
  remplace chaque `image` par un `<img>` optimisé avec `width`/`height`.
  **C'est ce comportement-là qui devient la référence** : les deux autres
  chemins convergent dessus.

Les trois disparaissent au profit du moteur du §4.

### 2.2 Composants de rendu

| Composant | Rôle | Props utiles aux widgets |
| --- | --- | --- |
| `src/components/ui/Visionneuse.astro` | `<dialog>` plein écran, flèches, compteur, `Échap`, focus rendu | `id`, `titre`, `photos: { source: ImageMetadata; alt?; legende?; credit? }[]`. Ouverture par tout bouton portant `data-ouvrir-visionneuse` + `aria-controls="<id>"` + `data-visionneuse-index="<n>"`. |
| `src/components/ui/VideoCard.astro` | Lecteur natif si l'URL est un fichier (`mp4`/`webm`/`ogv`), lien sortant sinon, bloc masqué si vide | `url`, `image: ImageMetadata`, `affiche`, `alt`, `sousTitres`, `duree`, `titre`, `sousTitre`, `taille`, `ratio`, `rayon`, `sizes`, `rendMax` |
| `src/components/ui/MediaCard.astro` | Carte photo à contenu incrusté, carte entière cliquable si `href` | `image`, `alt`, `ratio`, `objectPosition`, `variante`, `voile`, `assise`, `rayon`, `eyebrow`, `precision`, `titre`, `titreNiveau`, `sousTitre`, `lien: { libelle; href?; externe? }`, `href`, `sizes`, `largeurs`, `rendMax` |
| `src/components/fiches/ProfInterview.astro` | Tête en sur-titre ember à filet bas, questions en Cormorant italique séparées par des filets ; les lignes vides d'une réponse font les paragraphes | `entretien: { question?; reponse? }[]`, `titre`, `idTitre`, `niveauTitre` |
| `src/components/ui/Button.astro` | Trois variantes `pleine` / `contour` / `lien`, icône de fin, gestion du lien sortant | `variante`, `libelle`, `href`, `taille`, `icone`, `externe`, `pleineLargeur` |
| `src/components/ui/Carousel.astro` | Bande défilable, flèches, compteur, grille au-delà de 820 px | `libelle`, `largeurItem`, `gap`, `nombre`, `fleches`, `compteur`, `points`, `indice`, `debordement`, `grilleDesktop` |
| `src/components/sources/GaleriePlanches.astro` | Modèle de rendu d'une planche : cadre à filet, bouton d'agrandissement, folio / légende / crédit **verbatim** | Sert de référence visuelle au widget « Planche seule ». |

### 2.3 Résolution des images et des textes

- **`src/lib/images.ts`** : `resoudrePhoto(chemin)` (glob `import.meta.glob`
  sur `/src/assets/photos/**`, repli insensible à la casse, `null` si absent),
  `largeursSrcset(image, { largeurs, rendMax })`, `cadrageCss(cadrage)`,
  `creditAffiche(nom)` (**pose le « © », réservé aux photographies**),
  `resoudre(photo)` / `resoudrePhotos(photos)`, `EXTENSIONS_PHOTOS`,
  `cheminsConnus()`.
- **`src/components/sources/traites.ts`** : `creditPlanche(brut)` (un `.trim()`
  et rien d'autre), `creditPlancheHtml(brut)` (mêmes caractères visibles, URLs
  rendues cliquables), `plancheVedetteResolue(planches)`, `resoudrePlanche()`,
  `auteurCourt()`, `anneeCourte()`, `traditionCourte()`, `armesLiees()`,
  `comptePlanches()`.
- **`src/lib/raccourcis.ts`** : `resoudre(texte, ctx, source)` résout
  `{email}`, `{tarif}`… **et** applique `typographieFrHtml`. `contexteDe()`
  fabrique le contexte.
- **`src/lib/typographie.ts`** : `typographieFr`, `typographieFrHtml`.
- **`src/lib/liens.ts`** : `lien(ecole, cible)`, `lienArme`, `lienProf`,
  `lienArticle`, `estExterne`.
- **`src/lib/contenu.ts`** : `lireDisciplines()`, `lireTraites()` /
  `traitesTries()`, `profsDe(ecole)`, `articlesDe(ecole)`, et les types
  `Discipline`, `Traite`, `Prof`, `Article`.
- **`src/components/fiches/prof.ts`** : `profsAffiches()`, `prenomDe()`,
  `libelleArmes()`.

### 2.4 Garde-fous existants

`src/lib/validation.ts`, huit contrôles, appelés une fois par `Base.astro`.
Deux d'entre eux parcourent récursivement les entrées (`verifierAlt`,
`verifierSousTitres`) et **sautent explicitement les valeurs de type
`function`** : les corps Markdoc leur échappent donc entièrement. Le n° 1
(raccourcis) balaie les **fichiers**, donc il voit déjà le texte des attributs
de widget. Le n° 9 se branche là-dessus au §5.

---

## 3. Contrat des six widgets

### 3.0 Conventions communes

- Les six sont des `block` : `{% nom … /%}`, auto-fermants, sans enfants.
- Clés de champ **sans accent**, libellés **en français**, descriptions écrites
  pour un prof qui n'est pas technicien.
- Les widgets vivent dans **`src/cms/widgets.ts`**, importé par
  `keystatic.config.ts`. Ce module n'importe que
  `@keystatic/core` (pour `fields`) et `@keystatic/core/content-components`
  (pour `block`), tous deux déjà dans le graphe du fichier de config.
- Le module exporte **une fabrique**, parce que deux paramètres varient d'un
  gabarit à l'autre :

```ts
export interface OptionsWidgets {
  /** Sous-dossier de `src/assets/photos/` où déposer les images du corps. */
  dossierImages: string;
  /** Clé de la collection des encadrants visée par le widget « Renvoi ». */
  collectionProfs: string;
  /** Clé de la collection des articles visée par le widget « Renvoi ». */
  collectionArticles: string;
}

export function widgetsDeCorps(o: OptionsWidgets): Record<NomWidget, ContentComponent>;
export const NOMS_WIDGETS = ['galerie', 'video', 'questions', 'renvoi', 'bouton', 'planche'] as const;
export type NomWidget = (typeof NOMS_WIDGETS)[number];
```

`NOMS_WIDGETS` est **la** liste de référence : le moteur de rendu (§4) et le
garde-fou n° 9 (§5) l'importent, de sorte qu'un widget ajouté sans branchement
de rendu casse le build au lieu de disparaître de la page.

- Les helpers déjà présents dans `keystatic.config.ts` sont **repris tels
  quels** par la fabrique : `imageEditoriale`, `cadrage`, `champsVideo`,
  `nomDeFichier`. Ils descendent donc, avec `photo()`, `planchePatrimoniale()`
  et `lien()`, dans un module partagé `src/cms/champs.ts` importé à la fois par
  `keystatic.config.ts` et par `src/cms/widgets.ts`. Aucun changement de
  comportement, un simple déplacement.

---

### 3.1 « Galerie de photos » — tag `galerie`

**Ce que ça fait.** Une série de photos du club, en grille ou en carrousel.
Un clic ouvre la `Visionneuse` plein écran, à la bonne photo.

**Schéma Keystatic**

```ts
galerie: block({
  label: 'Galerie de photos',
  description: 'Une série de photos, en grille ou en carrousel. Un clic ouvre la photo en grand.',
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
        cadrage,                       // le select partagé, defaultValue 'centre'
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
}),
```

**Sérialisation attendue** (produite et re-parsée sans dérive) :

```
{% galerie
   mode="grille"
   photos=[{image: "/src/assets/photos/clermont/galerie-en-garde.jpg", description: "Deux tireurs en garde, masques baissés, au centre de la salle.", cadrage: "centre", credit: "Alexandre Vergne — L’IMAGINARIUM"}, {image: "/src/assets/photos/clermont/galerie-au-contact.jpg", description: "Les lames se croisent au premier plan.", cadrage: "haut", credit: ""}] /%}
```

**Rendu.** Nouveau composant `src/components/corps/GalerieCorps.astro`.

- Props : `photos: { image: ImageMetadata; alt: string; legende: string; credit: string; objectPosition: string }[]`,
  `mode: 'grille' | 'carrousel'`, `id: string` (identifiant du dialogue).
- Grille : `grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr))`,
  `gap: 12px`, cadres en `aspect-ratio: 3 / 2`, `border-radius: var(--radius-2)`,
  fond `var(--char)`, c'est-à-dire exactement le bloc « Photos » de
  `actualites/[slug].astro`, dont la CSS est reprise.
- Carrousel : `<Carousel libelle="Photos" nombre={n} indice grilleDesktop={3} />`,
  chaque tuile étant le même cadre.
- Chaque tuile est un `<button type="button" data-ouvrir-visionneuse
  aria-controls={id} aria-haspopup="dialog" data-visionneuse-index={i}>` avec un
  `<Picture>` dedans, plus le libellé caché « — agrandir la photo » (calque de
  `GaleriePlanches.astro`).
- Une seule `<Visionneuse id={id} titre="Photos" photos={vues} />` en fin de
  composant.
- Crédit affiché sous la tuile en `--fs-eyebrow-s`, `var(--parch-mute)`.
- Aucune pastille arrondie : cadres à `--radius-2`, rien d'autre.

**Résolution au build** (§4.4) : `resoudrePhoto(image)`; les entrées dont le
fichier est absent du dépôt sont **écartées** (même politique que
`resoudrePhotos()`), une galerie qui se retrouve vide n'est pas rendue.
`largeursSrcset(image, { largeurs: [280, 340, 500, 680, 900] })`,
`sizes="(min-width: 820px) 30vw, 90vw"`.
`alt` = la description **brute** (convention de tous les `alt` du site) ;
`legende` de la visionneuse = `typographieFr(description)` ;
`credit` = `creditAffiche(credit)`.

---

### 3.2 « Vidéo » — tag `video`

**Ce que ça fait.** Une vidéo lue sur la page (fichier `.mp4` du site ou de
notre R2) ou, pour une adresse de plateforme, une vignette qui est un lien
sortant. Exactement le comportement du bloc vidéo d'une fiche d'encadrant.

**Schéma Keystatic.** Les champs sont **les mêmes objets** que ceux de
`profs.schema.video`, repris depuis `src/cms/champs.ts` :

```ts
video: block({
  label: 'Vidéo',
  description: 'Une vidéo lue directement sur la page. Une adresse YouTube ou Vimeo devient un simple lien.',
  schema: {
    titre: fields.text({
      label: 'Titre affiché',
      description: 'Ce que la vidéo montre : « La leçon de garde », « En combat · saison 2025-2026 »…',
    }),
    url: champsVideo.url,             // « Adresse du fichier vidéo »
    duree: fields.text({ label: 'Durée', description: 'Ex. 06:24' }),
    vignette: imageEditoriale('Vignette', o.dossierImages),
    sousTitres: champsVideo.sousTitres, // « Sous-titres (fichier .vtt) »
    affiche: champsVideo.affiche,       // « Image d’attente (facultatif) »
  },
}),
```

**Sérialisation attendue**

```
{% video
   titre="La leçon de garde"
   url="/videos/lecon-01.mp4"
   duree="04:12"
   vignette="/src/assets/photos/commun/arme-epee-longue.jpg"
   sousTitres="/videos/lecon-01.fr.vtt"
   affiche="" /%}
```

**Rendu.** `VideoCard` directement, sans intermédiaire, dans une enveloppe de
mesure :

```astro
<VideoCard
  url={w.url}
  image={resoudrePhoto(w.vignette)}
  affiche={w.affiche}
  alt={w.titre}
  sousTitres={w.sousTitres}
  duree={w.duree}
  titre={resoudre(w.titre, ctx, source)}
  taille="l"
  ratio="16 / 9"
  rayon={3}
  sizes="(min-width: 820px) 58ch, 92vw"
  rendMax={760}
/>
```

`alt={w.titre}` reprend la convention d'`ArmeMiniCours.astro`. `masquerSiVide`
reste à sa valeur par défaut : un widget vidéo sans adresse **ni** vignette ne
rend rien, ce qui est le comportement voulu pour un bloc en cours de saisie.

---

### 3.3 « Questions-réponses » — tag `questions`

**Ce que ça fait.** Le bloc interview, disponible partout : une tête en
sur-titre ember à filet bas, puis les questions en Cormorant italique.

**Schéma Keystatic**

```ts
questions: block({
  label: 'Questions-réponses',
  description: 'Une suite de questions et de réponses, dans la présentation du bloc « interview ».',
  schema: {
    titre: fields.text({
      label: 'Titre du bloc',
      defaultValue: 'L’interview',
      description: 'Le sur-titre affiché au-dessus des questions. Ex. « L’interview », « Trois questions à Marie ».',
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
}),
```

**Sérialisation attendue**

```
{% questions
   titre="L’interview"
   questions=[{question: "Pourquoi l’épée longue ?", reponse: "Parce que c’est l’arme la mieux documentée.\n\nEt parce qu’elle apprend la mesure."}] /%}
```

Noter le `\n\n` : `fields.text({ multiline: true })` fait un aller-retour propre
dans un attribut Markdoc, vérifié en machine, contrairement à ce que suggère un
commentaire prudent de la bibliothèque (`dist/index-bea09e17.js` l. 20043).

**Rendu.** `ProfInterview` directement :

```astro
<ProfInterview
  entretien={w.questions}
  titre={resoudre(w.titre, ctx, source) || 'L’interview'}
  idTitre={`corps-questions-${w.rang}`}
  niveauTitre="h2"
/>
```

`idTitre` est indexé sur le rang du widget : plusieurs blocs dans une même page
ne se marchent pas dessus. Les questions et les réponses passent par
`resoudre()` (raccourcis + typographie française), comme celles du champ
`interview` d'une fiche d'encadrant.

**Le champ `interview` de la collection `profs` reste en place** : il alimente
le bloc dédié de la fiche, positionné par la maquette sous le hero. Le widget
sert les trois autres gabarits, et les questions supplémentaires d'une bio.

---

### 3.4 « Renvoi vers une page du site » — tag `renvoi`

**Ce que ça fait.** Le widget de circulation. Une carte dans le langage
`MediaCard` (visuel de la cible, titre, sous-titre, flèche) menant à une page du
site. Tout est résolu **au build** depuis le contenu réel.

**Schéma Keystatic**

```ts
renvoi: block({
  label: 'Renvoi vers une page du site',
  description: 'Une carte qui envoie vers une arme, un traité de la bibliothèque, un encadrant ou un article.',
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
          description: 'La liste montre l’adresse de chaque fiche (ex. « epee-longue »). Seules les armes affichées dans la grille ont une page.',
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
          description: 'La liste montre l’adresse de chaque fiche (ex. « gabriel-tardio »). Seuls les encadrants affichés sur le site ont une page.',
        }),
        article: fields.relationship({
          label: 'Article',
          collection: o.collectionArticles,
          validation: { isRequired: true },
          description: 'La liste montre l’adresse de chaque article. Un brouillon n’a pas d’adresse : le renvoi serait cassé.',
        }),
      },
    ),
    libelle: fields.text({
      label: 'Titre de remplacement (facultatif)',
      description: 'Laisser vide pour afficher le titre de la page visée. À remplir seulement pour annoncer autrement, ex. « Le manuscrit de 1467 ».',
    }),
  },
}),
```

**Sérialisation attendue** (forme `conditional` : `{discriminant, value}`)

```
{% renvoi cible={discriminant: "arme", value: "epee-longue"} libelle="" /%}

{% renvoi
   cible={discriminant: "traite", value: "talhoffer-1467"}
   libelle="Le manuscrit de 1467" /%}
```

Tant qu'aucune entrée n'est choisie, la valeur est absente et le tag s'écrit
`cible={discriminant: "arme"}`. C'est un renvoi incomplet : le garde-fou n° 9 le
refuse.

**Résolution au build.** Une seule fonction, `src/lib/renvois.ts` :

```ts
export type TypeRenvoi = 'arme' | 'traite' | 'encadrant' | 'article';

export interface CibleRenvoi {
  /** Clé d'index : `${type}:${slug}`. */
  cle: string;
  type: TypeRenvoi;
  slug: string;
  href: string;
  titre: string;
  sousTitre: string;
  eyebrow: string;
  image: ImageMetadata | null;
  alt: string;
  objectPosition: string;
  libelleLien: string;
}

export function indexRenvois(entrees: {
  ecole: Ecole;
  disciplines: readonly Discipline[];
  traites: readonly Traite[];
  profs: readonly Prof[];
  articles: readonly Article[];
}): CibleRenvoi[];
```

Table de correspondance, champ par champ :

| Type | Retenu si | `href` | `titre` | `sousTitre` | `eyebrow` | `image` | `libelleLien` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `arme` | `entry.affichee` | `lienArme(ecole, slug)` | `typographieFr(entry.nom)` | `typographieFr(entry.sousTitre)` | `entry.epoque` | `resoudrePhoto(entry.photo?.fichier)` | `Découvrir l’arme` |
| `traite` | toujours (toutes les fiches existent) | `lien(ecole, /sources/<slug>/)` | `typographieFr(entry.titre)` | `[auteurCourt(entry.auteur), anneeCourte(entry.annee)].filter(Boolean).join(' · ')` | `Les sources` | `plancheVedetteResolue(entry.planches)?.source ?? null` | `Étudier la source` |
| `encadrant` | `entry.visible` | `lienProf(ecole, slug)` | `typographieFr(entry.nom)` | `typographieFr(entry.accroche)` | `Les profs` | `resoudrePhoto(entry.portrait?.fichier)` | `Voir la fiche` |
| `article` | `entry.statut === 'publie'` | `lienArticle(ecole, slug)` | `typographieFr(entry.titre)` | `typographieFr(entry.chapo)`, tronqué à 120 signes sur un mot | libellé de la catégorie (`CATEGORIES` de la page article, déplacé dans `src/lib/renvois.ts`) | `resoudrePhoto(entry.couverture?.fichier)` | `Lire l’article` |

`alt` et `objectPosition` : `entry.photo?.alt` / `cadrageCss(entry.photo?.cadrage)`
pour l'arme, `portrait` pour l'encadrant, `couverture` pour l'article. Pour un
traité, `alt` vient de la planche vedette (`plancheVedetteResolue().alt`) et le
cadrage reste au centre.

**Crédit d'image.** Aucun crédit n'est affiché sur une carte de renvoi : c'est
une vignette de navigation, la page visée porte l'attribution complète. Pour un
traité, cela reste conforme à CC BY 4.0 §3.a.2, qui autorise explicitement le
renvoi pour une vignette, et c'est déjà la règle appliquée par la page de liste
des sources (ARCHITECTURE.md §6).

**Rendu.** `src/components/corps/RenvoiCorps.astro`, une enveloppe autour de
`MediaCard` :

```astro
<MediaCard
  image={cible.image}
  alt={cible.alt}
  href={cible.href}
  ratio="16 / 10"
  objectPosition={cible.objectPosition}
  variante="carte"
  voile="fort"
  assise="standard"
  rayon={2}
  eyebrow={cible.eyebrow}
  titre={libelle || cible.titre}
  titreNiveau="p"
  sousTitre={cible.sousTitre}
  lien={{ libelle: cible.libelleLien }}
  sizes="(min-width: 820px) 58ch, 92vw"
  rendMax={760}
/>
```

`titreNiveau="p"` : une carte de renvoi n'est pas un titre de section, elle ne
doit pas entrer dans le plan du document. `lien.href` n'est pas fourni, la carte
entière étant déjà cliquable (`href`), ce qui évite une ancre imbriquée.

`libelle` passe par `resoudre()` : `{prof}` et `{arme}` y fonctionnent sur les
fiches qui les définissent.

**Cible absente d'une image.** Un traité sans planche déposée, un encadrant sans
portrait : `MediaCard` accepte `image={null}` et rend le cadre sombre avec son
contenu. Pas d'erreur, la carte reste lisible.

---

### 3.5 « Bouton » — tag `bouton`

**Schéma Keystatic**

```ts
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
      description: 'https://…, mailto:…, tel:…, une adresse du site (/sources/) ou une ancre (#creneaux).',
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
}),
```

**Sérialisation attendue**

```
{% bouton libelle="Venir essayer" url="#rejoindre" variante="pleine" /%}
```

**Rendu.** `src/components/corps/BoutonCorps.astro` : un
`<div class="bouton-corps">` porteur des marges de bloc, contenant

```astro
<Button
  variante={w.variante}
  libelle={resoudre(w.libelle, ctx, source)}
  href={lien(ecole, w.url)}
  externe={estExterne(href) && !/^(mailto|tel):/i.test(href)}
/>
```

`lien(ecole, url)` préfixe les cibles internes par la racine de l'école
(invariant n° 5 de `multi-ecoles.md` §6.6) et laisse les adresses absolues
intactes.

---

### 3.6 « Planche seule » — tag `planche`

**Ce que ça fait.** Une image de bibliothèque, montrée entière dans un cadre à
filet, avec sa description, sa légende et **sa ligne de crédit rendue mot pour
mot**. C'est le seul widget dont le crédit ne reçoit **jamais** de « © ».

**Schéma Keystatic**

```ts
planche: block({
  label: 'Planche seule',
  description: 'Une image de traité, avec sa légende et la ligne de crédit exigée par la bibliothèque.',
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
      description: 'Le texte affiché sous la planche : ce qu’elle représente, et ce qu’elle apprend. Ne décrire que ce que l’on voit.',
    }),
    credit: fields.text({
      label: 'Ligne de crédit de la bibliothèque',
      multiline: true,
      validation: { isRequired: true },
      description:
        'Obligatoire, à recopier EXACTEMENT comme la bibliothèque la demande — c’est la contrepartie du droit de publier l’image. Rien n’est ajouté ni corrigé à l’affichage : ni « © », ni retouche de ponctuation. En retirer un mot (par exemple « digitalisiert von Google ») met le club en faute.',
    }),
  },
}),
```

**Sérialisation attendue**

```
{% planche
   image="/src/assets/photos/commun/sources/talhoffer-1467-8r.jpg"
   alt="Deux escrimeurs à l’épée longue, lames croisées au-dessus de leurs têtes."
   legende="Le croisement haut, dit « Ochs »."
   credit="Hans Talhoffer, Fechtbuch, 1467, f. 8r. Source gallica.bnf.fr / Bibliothèque nationale de France." /%}
```

**Rendu.** `src/components/corps/PlancheCorps.astro`, calqué sur une rangée de
`GaleriePlanches.astro` :

- `<figure>` avec un `<button>` cadre ouvrant la `Visionneuse` du corps
  (`data-ouvrir-visionneuse`, `aria-controls`, `data-visionneuse-index`) ;
- `<Picture>` avec `largeursSrcset(source, { largeurs: [480, 800, 1240, 2080] })`
  et le `sizes` à trois contraintes de `GaleriePlanches` (colonne, fenêtre,
  hauteur convertie par le ratio du fichier) ;
- `<figcaption>` : légende en `typographieFr`, puis crédit rendu par
  `set:html={creditPlancheHtml(credit)}`, **jamais** par `creditAffiche()`,
  **jamais** en capitales CSS.

Une planche isolée dans un corps a sa propre visionneuse à une seule vue :
c'est ce qui rend l'image lisible sur mobile, et la reproduction plein écran
reprend le crédit intégral (règle 3 d'ARCHITECTURE.md §6).

---

## 4. Le moteur de rendu

### 4.1 Fichiers créés

| Fichier | Rôle |
| --- | --- |
| `src/cms/champs.ts` | Helpers de schéma déplacés depuis `keystatic.config.ts` (`nomDeFichier`, `imageEditoriale`, `imageLogo`, `cadrage`, `photo`, `planchePatrimoniale`, `champsVideo`, `photoDecorative`, `lien`, `visible`, `ordre`, `enTete`, `ACCENT`, `RACCOURCIS`). |
| `src/cms/widgets.ts` | `NOMS_WIDGETS`, `NomWidget`, `widgetsDeCorps(o)`. |
| `src/lib/corps.ts` | Découpage de l'AST, types partagés, extraction du texte brut. **Aucune dépendance à `astro:assets`.** |
| `src/lib/renvois.ts` | `indexRenvois()`, `CibleRenvoi`, `TypeRenvoi`. |
| `src/components/corps/CorpsLibre.astro` | L'aiguilleur : prose + widgets. |
| `src/components/corps/GalerieCorps.astro` | Widget `galerie`. |
| `src/components/corps/RenvoiCorps.astro` | Widget `renvoi`. |
| `src/components/corps/PlancheCorps.astro` | Widget `planche`. |
| `src/components/corps/BoutonCorps.astro` | Widget `bouton`. |

`video` et `questions` n'ont pas de composant propre : `CorpsLibre` appelle
directement `VideoCard` et `ProfInterview`.

### 4.2 Découpage — `src/lib/corps.ts`

```ts
export type BlocCorps =
  | { type: 'prose'; noeuds: readonly unknown[] }
  | { type: 'widget'; nom: NomWidget; attributs: Record<string, unknown>; rang: number };

/**
 * Découpe un corps Markdoc en runs de prose et en widgets, dans l'ordre.
 * `source` sert aux messages d'erreur (chemin du fichier + nom du champ).
 */
export function decouperCorps(node: unknown, source: string): BlocCorps[];

/** Texte brut des seuls runs de prose, pour la méta description et l'OpenGraph. */
export function texteDuCorps(node: unknown, longueur?: number): string;
```

Règles :

1. On parcourt **les enfants directs du nœud `document`**.
2. Un enfant de type `tag` interrompt le run de prose en cours et devient un
   bloc `widget`. Son `rang` est son index parmi les enfants du document : il
   est stable d'un build à l'autre et sert à fabriquer les `id` de visionneuse
   et les `idTitre`.
3. Un nom de tag absent de `NOMS_WIDGETS` **lève** (garde-fou 9e).
4. Les runs de prose vides sont supprimés.
5. Un `tag` rencontré **ailleurs** qu'au premier niveau lève (garde-fou 9f).
   La détection se fait par un second parcours récursif des runs de prose.

`texteDuCorps` réutilise `rendreMarkdoc` sur les runs de prose puis
`corpsEnTexte` : les widgets ne polluent pas la méta description.

### 4.3 Rendu de la prose

`CorpsLibre.astro` rend chaque run avec `Markdoc.transform(noeuds, config)` puis
`Markdoc.renderers.html(...)`, où `config` ne surcharge qu'une chose, le nœud
`image` :

```ts
const config = {
  nodes: {
    image: {
      ...Markdoc.nodes.image,
      transform(node, cfg) {
        const attrs = node.transformAttributes(cfg);
        const opt = imagesOptimisees.get(String(node.attributes.src ?? ''));
        if (!opt) return null;                    // fichier absent : image omise
        return new Markdoc.Tag('img', {
          ...attrs,
          src: opt.src,
          width: opt.largeur,
          height: opt.hauteur,
          loading: 'lazy',
          decoding: 'async',
        });
      },
    },
  },
};
```

`imagesOptimisees` est bâtie avant le rendu : parcours des runs de prose,
collecte des `src`, `resoudrePhoto()`, puis
`await getImage({ src, width: Math.min(width, 1280), format: 'webp' })`.
C'est la logique de `actualites/[slug].astro` l. 227-250, déplacée telle quelle.

Le HTML de chaque run passe ensuite par `resoudre(html, ctx, source)`, qui
résout les raccourcis **et** applique `typographieFrHtml` (ARCHITECTURE.md §5,
« typographie composée au rendu »). Il est injecté par `set:html` dans un
`<div class="corps-libre__prose">` dont la CSS est celle de `.corps` de
`actualites/[slug].astro`, mesure comprise (`max-width: 58ch`).

**Passer les runs par `Markdoc.transform` plutôt que par un parcours maison est
un changement délibéré** : `transform` échappe le texte, ne rend que les nœuds
qu'il connaît, et le champ n'autorise ni HTML brut ni code (`corpsRiche` :
`code: false`, `codeBlock: false`). C'est ce que fait déjà `rendreMarkdoc`.

### 4.4 Props de `CorpsLibre.astro`

```ts
export interface Props {
  /** Nœud renvoyé par le lecteur : `(await entree.corps()).node`. */
  node: unknown;
  /** École servie par la page, pour `lien()` du widget « Bouton ». */
  ecole: Ecole;
  /** Contexte des raccourcis de la page (`contexteDe(...)`). */
  ctx: ContexteRaccourcis;
  /** Chemin du fichier + nom du champ, cité dans tous les messages d'erreur. */
  source: string;
  /** Index des cibles de renvoi, bâti par la page (`indexRenvois(...)`). */
  renvois: readonly CibleRenvoi[];
  /** Préfixe des `id` de visionneuse. Défaut : `corps`. */
  prefixeId?: string;
  class?: string;
}
```

**Invariant respecté** : le composant ne lit aucun contenu, il reçoit l'école et
ses données en props (`multi-ecoles.md` §6.6, invariants 3 et 4).

### 4.5 `src/lib/markdoc.ts` devient strict

`rendreMarkdoc()` reste le rendu des textes riches **sans widget** (FAQ,
partenaires). On lui ajoute un garde-fou de construction : avant de transformer,
il vérifie qu'aucun nœud `tag` ne traîne dans l'arbre, et lève sinon :

```
Un widget se trouve dans un champ qui ne sait pas les afficher — <source>.
Les widgets (galerie, vidéo, questions-réponses, renvoi, bouton, planche)
ne sont acceptés que dans la biographie d'un encadrant, la description longue
d'une arme, le contenu d'un article et la présentation d'un traité.
```

Sans cette vérification, `Markdoc.transform` supprimerait le widget en silence
(§1.5). Le paramètre `source` est ajouté à `rendreMarkdoc` et `rendreCorps`.

---

## 5. Garde-fou n° 9 — les corps libres

Nouveau contrôle dans `src/lib/validation.ts`, appelé par `validerContenu()` au
même titre que les huit autres, avec un message qui dit **quoi corriger et où**.
Il est nécessaire parce que les contrôles n° 3, 5, 6 et 8 parcourent les entrées
du lecteur en **sautant les valeurs de type `function`** (l. 208 et l. 466), et
qu'un corps Markdoc en est une.

Le contrôle lit explicitement les quatre champs :

```ts
const CORPS_A_VERIFIER = [
  { collection: 'disciplines', champ: 'description', libelle: 'description longue' },
  { collection: 'traites',     champ: 'presentation', libelle: 'présentation' },
  // + par école : profs_<slug>.bio, articles_<slug>.corps
];
```

et parcourt l'AST de chacun. Sous-règles :

| # | Faute | Message |
| --- | --- | --- |
| 9a | Renvoi vers un slug qui n'existe pas, ou vers une page qui n'est pas publiée (arme non affichée, encadrant masqué, article en brouillon) | « Renvoi cassé — `<fichier>` › `<libellé du champ>` › widget n° `<rang>` / La carte pointe vers l'`<type>` « `<slug>` », qui n'a pas de page sur le site. / `<Types disponibles : …>` ou la liste des slugs valides pour ce type. » |
| 9b | Renvoi sans cible choisie (`cible.value` absent) | « Renvoi sans destination — … / Choisir une page dans la liste déroulante du widget, ou supprimer le widget. » |
| 9c | Photo de galerie sans description | « Image sans description alternative — … › galerie › photo n° i / Fichier : … / Remplir « Description de l'image » : elle est lue par les lecteurs d'écran. » (mot pour mot le message du contrôle n° 3) |
| 9d | Planche sans description, ou sans crédit | Messages du contrôle n° 6, à l'identique : « Planche sans description alternative — … », « Planche sans crédit — … / Recopier la ligne de crédit exigée par la bibliothèque, sans la modifier. » |
| 9e | Tag inconnu dans un corps | « Widget inconnu « `<nom>` » — … / Widgets disponibles : galerie, video, questions, renvoi, bouton, planche. / Ce bloc ne s'afficherait pas sur le site. » |
| 9f | Widget imbriqué dans une citation ou une puce | « Widget mal placé — … / Un widget se pose entre deux paragraphes, jamais à l'intérieur d'une citation ou d'une liste. » |
| 9g | Image de widget dans un format que le build ne sait pas traiter | Message du contrôle n° 5, à l'identique (`verifierFormat()` est réutilisé). |
| 9h | Sous-titres de widget vidéo en adresse absolue | Message du contrôle n° 8, à l'identique (`verifierSousTitres()` est réutilisé sur les attributs du widget). |
| 9i | Bouton sans libellé ou sans adresse | « Bouton incomplet — … / Un bouton sans texte ou sans adresse ne mène nulle part. » |

Toutes les localisations citent le **fichier réel** et le **rang du widget** dans
le corps, parce que c'est ce que le rédacteur voit dans l'admin (le n-ième bloc
du texte).

`validerContenu()` passe donc de huit à **neuf** contrôles. Les trois endroits
qui annoncent « huit » sont à mettre à jour dans le même commit :
`src/lib/validation.ts` (en-tête de fichier et compteur), `ARCHITECTURE.md` §7,
et le message d'erreur final qui renvoie à cette section.

---

## 6. Plan de branchement des quatre gabarits

### 6.1 `keystatic.config.ts`

Nouveau helper, à côté de `corpsRiche` et `texteRiche` :

```ts
/** Corps libre : texte riche + widgets insérables. Les 4 gabarits de contenu long. */
const corpsLibre = (
  label: string,
  dossierImages: string,
  cibles: { profs: string; articles: string },
  description?: string,
) =>
  fields.markdoc({
    label,
    description,
    options: {                       // identiques à corpsRiche(), inchangées
      heading: [2, 3],
      bold: true, italic: true, link: true, blockquote: true,
      orderedList: true, unorderedList: true, divider: true,
      table: false, code: false, codeBlock: false, strikethrough: false,
      image: {
        directory: `src/assets/photos/${dossierImages}`,
        publicPath: `/src/assets/photos/${dossierImages}/`,
      },
    },
    components: widgetsDeCorps({
      dossierImages,
      collectionProfs: cibles.profs,
      collectionArticles: cibles.articles,
    }),
  });
```

Les cibles par collection :

```ts
// dans collectionsEcole(e) :
const cibles = { profs: `profs_${e.slug}`, articles: `articles_${e.slug}` };

// dans collectionsCommunes (disciplines, traites) :
const cibles = {
  profs: `profs_${ECOLE_PRINCIPALE.slug}`,
  articles: `articles_${ECOLE_PRINCIPALE.slug}`,
};
```

Quatre substitutions, et rien d'autre :

| Ligne actuelle | Devient |
| --- | --- |
| `bio: texteRiche('Biographie'),` (l. 353) | `bio: corpsLibre('Biographie', dossierPhotos, cibles),` |
| `corps: corpsRiche('Contenu', dossierPhotos),` (l. 490) | `corps: corpsLibre('Contenu', dossierPhotos, cibles),` |
| `description: corpsRiche('Description longue (fiche arme)', 'commun'),` (l. 827) | `description: corpsLibre('Description longue (fiche arme)', 'commun', cibles),` |
| `presentation: texteRiche('Présentation', '…'),` (l. 1016) | `presentation: corpsLibre('Présentation', 'commun', cibles, '…'),` |

`corpsRiche()` n'a plus d'appelant : le supprimer. `texteRiche()` reste, employé
par la FAQ générale, la FAQ locale et les partenaires.

**Conséquence de contenu à assumer** : `bio` et `presentation` passent de
`texteRiche` (gras, italique, liens, listes) à la palette complète (titres h2/h3,
citations, filets, images). C'est le prix de la composition libre, et c'est
cohérent : les quatre champs ont désormais exactement la même barre d'outils.
Le contenu existant n'est pas touché, `format(parse(x)) === x` reste vrai.

### 6.2 `src/pages/armes/[slug].astro`

- `ArmeCorps.astro` conserve sa `<section class="corps-arme">`, sa gouttière et
  toute sa CSS de prose ; son parcours d'AST maison (l. 43-151) est supprimé et
  remplacé par `<CorpsLibre node={node} … />`.
- La page lui passe en plus `ecole`, `renvois` et garde `ctx` et `source`.
- Elle lit déjà `lireDisciplines()`, `profsDe(ecole)` et `traitesDeLArme(slug)` ;
  il faut y ajouter `lireTraites()` (ou `traitesTries()`) et `articlesDe(ecole)`
  pour bâtir l'index complet.

### 6.3 `src/pages/actualites/[slug].astro`

- Suppression du bloc « MARKDOC » (l. 195-319, hors `const contenu = await entree.corps()` l. 236) : `NoeudMarkdoc`, `echapper`,
  `collecterImages`, `imagesDuCorps`, `rendreMarkdoc` local, `corpsHtml`.
- `<div class="corps" set:html={corpsHtml} />` (l. 409) devient
  `<CorpsLibre node={contenu.node} ecole={ecole} ctx={ctx} source={…}
  renvois={renvois} class="corps" />`. Les styles `.corps :global(...)`
  descendent dans `CorpsLibre.astro`, où ils redeviennent scopés.
- La page lit déjà `lireDisciplines()`, `profsDe(ecole)` et `articlesDe(ecole)` ;
  ajouter `traitesTries()`.
- Le bloc « Photos » de fin d'article (champ `galerie`) et le bloc « Liens
  utiles » (champ `liens`) **restent** : ce sont des champs de la fiche, pas des
  widgets, et ils ont leur place fixe en bas de page. Le widget `galerie`, lui,
  sert à intercaler des photos **dans** le texte.

### 6.4 `src/pages/profs/[slug].astro`

Seule page à changer de structure, parce qu'elle convertit aujourd'hui la bio en
HTML **dans `getStaticPaths`** (l. 100-101) :

- retirer `bio` des `props` et l'import de `rendreCorps` ;
- dans le corps de la page, relire l'entrée et le corps :
  ```ts
  const prof = (await profsDe(ecole)).find((p) => p.slug === slug)!;
  const corps = await (prof.entry.bio as unknown as () => Promise<{ node: unknown }>)();
  ```
- `ProfHero` reçoit aujourd'hui `bio` en HTML : lui passer un slot, ou sortir la
  bio du hero et rendre `<CorpsLibre>` juste après. **Arbitrage : la bio sort du
  hero** et devient une section de corps à part entière, sous le hero et avant
  l'interview. Un corps qui peut contenir une galerie et deux vidéos n'a plus
  rien à faire dans une colonne de hero.
- la méta description passe de `corpsEnTexte(bio)` à
  `texteDuCorps(corps.node)`.

**Règle générale, à tenir** : un nœud Markdoc ne transite **jamais** par les
`props` de `getStaticPaths`. Ce sont des instances de `Ast.Node` dont
`Markdoc.transform` appelle les méthodes (`transformAttributes`,
`transformChildren`) ; les faire voyager comme données est fragile. Le corps se
lit dans le corps de la page, comme le font déjà la fiche arme, l'article et la
fiche de traité.

### 6.5 `src/pages/sources/[slug].astro`

- `rendreCorps(await entree.presentation())` (l. 127) devient
  `<CorpsLibre node={(await entree.presentation()).node} … />` dans la
  `<section class="presentation">`, dont la CSS est conservée.
- `corpsEnTexte(presentation)` (l. 135) devient `texteDuCorps(node)`.
- La page lit déjà `lireTraites()` et `lireDisciplines()` ; ajouter
  `profsDe(ecole)` et `articlesDe(ecole)`.

### 6.6 Récapitulatif des lectures à ajouter

`indexRenvois()` a besoin des quatre collections. Chaque page en lit déjà deux
ou trois ; le complément est un `Promise.all` de plus. Le Reader mémoïse
(`readItem` est enveloppé dans `cache()`), le coût est négligeable.

| Page | Déjà lu | À ajouter |
| --- | --- | --- |
| `armes/[slug]` | disciplines, profs, traités de l'arme | `traitesTries()`, `articlesDe(ecole)` |
| `actualites/[slug]` | disciplines, profs, articles | `traitesTries()` |
| `profs/[slug]` | disciplines, profs | `traitesTries()`, `articlesDe(ecole)` |
| `sources/[slug]` | traités, disciplines | `profsDe(ecole)`, `articlesDe(ecole)` |

---

## 7. Arbitrages tranchés

1. **Six `block`, aucun `wrapper`.** Aucun widget n'enveloppe du texte : un
   `wrapper` ajouterait une zone de saisie imbriquée sans besoin.
2. **Pas d'`icon`.** Un `icon` est un `ReactElement` ; les icônes livrées par
   Keystatic tirent `@keystar/ui` (emotion, tokens, slots) dans le graphe de
   `keystatic.config.ts`, lui-même importé par `src/lib/contenu.ts` donc par le
   pré-rendu Node et le Worker. Les entrées du menu « + » s'afficheront avec
   leur libellé et leur description, sans glyphe.
3. **`ContentView` autorisé, sobrement.** Aperçu textuel écrit avec
   `createElement` (pas de JSX : `astro.config.mjs` note « aucun fichier
   .jsx/.tsx dans src/ », et on la tient), en éléments DOM simples, sans aucun
   import de `@keystar/ui`. Contenu : galerie « 6 photos · grille », vidéo « La
   leçon de garde · 04:12 », questions-réponses « 3 questions », renvoi
   « Arme : epee-longue », planche « talhoffer-1467-8r.jpg », bouton
   « Venir essayer → #rejoindre ». Le cadre, le libellé et le bouton d'édition
   sont fournis par `BlockWrapper`.
4. **Le widget « Renvoi » propose un libellé de remplacement, facultatif.**
   Il remplace le titre de la carte, jamais le sous-titre ni le visuel, qui
   viennent toujours du contenu réel de la cible. Vide, la carte affiche le
   titre de la page.
5. **Une seule sur-couche pour le renvoi**, pas de champ « sous-titre » ni
   « image » : autoriser une image quelconque à côté du titre d'un traité
   rejouerait exactement la faute que l'encadré « La source » a corrigée
   (ARCHITECTURE.md §4, dernier point).
6. **La galerie porte un champ `cadrage`.** Le client n'en demandait que trois,
   mais toutes les photos de l'admin en ont un, il est déjà rempli par défaut,
   et sans lui une photo en portrait est décapitée dans un cadre 3/2.
7. **Pas de champ « légende » séparé dans la galerie.** La description
   obligatoire fait office de texte alternatif **et** de légende dans la
   visionneuse : deux champs presque identiques seraient remplis à moitié.
   L'`alt` reste brut, la légende est composée par `typographieFr`.
8. **Deux régimes de crédit, et jamais l'un pour l'autre.** `galerie` = photo du
   club, crédit passé par `creditAffiche()` (« © Nom »). `planche` = image de
   bibliothèque, crédit rendu **verbatim** par `creditPlancheHtml()`. C'est la
   règle intransgressible d'ARCHITECTURE.md §6, et c'est pour la rendre
   impossible à confondre que ce sont deux widgets séparés.
9. **Les images de widget vont dans le dossier du gabarit**
   (`src/assets/photos/<dossierImages>/`), y compris les planches. Une planche
   déjà présente dans une fiche de traité se cite par le widget « Renvoi », pas
   en la redéposant.
10. **Le widget « Renvoi » vise l'école principale depuis les collections
    communes** (`disciplines`, `traites`), parce que le dossier est l'école
    (ARCHITECTURE.md §3) et qu'un contenu commun n'en a pas. Aujourd'hui
    `MULTI === false`, la question ne se pose pas. Le jour où une deuxième salle
    ouvre, deux options resteront ouvertes : retirer les types « encadrant » et
    « article » des corps communs, ou résoudre le renvoi vers l'école de la page
    servie. À trancher à ce moment-là, pas avant.
11. **Un widget mal placé casse le build plutôt que de disparaître.** Tag
    inconnu, widget dans une citation, renvoi cassé : neuf sous-règles, neuf
    messages en français. Le silence est la seule chose qu'on ne s'autorise pas.
12. **Le champ `interview` de la collection `profs` est conservé.** Il alimente
    le bloc dédié de la fiche, à sa place maquettée. Le widget
    « Questions-réponses » sert les trois autres gabarits et les questions
    supplémentaires d'une bio.
13. **Le bloc « Photos » et le bloc « Liens utiles » d'un article sont
    conservés.** Ce sont des champs de fiche, à place fixe en bas de page ; le
    widget `galerie` sert à intercaler des photos dans le fil du texte.
14. **La bio d'un encadrant sort du hero.** Elle devient une section de corps
    sous le hero. Un corps qui peut porter une galerie et deux vidéos n'a plus
    sa place dans une colonne de hero.
15. **Aucune pastille arrondie** dans les six rendus : cadres à `--radius-2` ou
    `--radius-3`, filets 1 px, sur-titres ember. Le langage visuel du site, rien
    de neuf.
16. **`locale: 'fr-FR'` n'est pas ajouté par ce chantier.** Ce serait un
    changement global de l'admin (toutes les chaînes de Keystatic), à proposer
    au client séparément. Dans cette version, « Edit », « Done » et le titre du
    dialogue restent en anglais quoi qu'il arrive : ils sont écrits en dur
    (`dist/index-bea09e17.js` l. 20307 et 19884).

---

## 8. Hors périmètre

- Traduction de l'interface Keystatic (§7.16).
- Glisser-déposer des blocs dans l'éditeur : la version 0.6.3 ne le propose pas.
- Widgets pour les réponses de FAQ et les présentations de partenaires.
- Composition libre de l'accueil : le client a demandé qu'il reste fermé.
- Rendu d'un widget en aperçu React (`markdoc.createMarkdocConfig`) : le site
  public n'exécute pas React.

---

## 9. Contrôle de recette du chantier

Un corps de démonstration écrit dans l'admin, reprenant l'exemple du client dans
l'ordre exact, doit :

1. s'enregistrer en un `.mdoc` stable (`format(parse(x)) === x`) ;
2. se rouvrir dans l'admin sans erreur, tous les champs remplis ;
3. rendre, dans l'ordre : paragraphe, `VideoCard`, bloc questions-réponses,
   paragraphe, carte de renvoi vers `/armes/epee-longue/`, carte de renvoi vers
   `/sources/talhoffer-1467/`, paragraphe, galerie ;
4. ouvrir la visionneuse au clic sur la 4ᵉ photo de la galerie, à la 4ᵉ vue ;
5. échouer au build, avec le bon message, à chacune des neuf fautes du §5,
   vérifiées une par une ;
6. ne pas régresser sur `npm run check` ni sur `scripts/recette.mjs`.
