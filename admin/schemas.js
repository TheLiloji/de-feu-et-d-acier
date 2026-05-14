// Schémas décrivant l'éditeur de chaque section.
// Pour chaque champ on déclare son type pour que l'UI choisisse le bon contrôle
// (input court, textarea, picker d'image, éditeur de tableau…).
//
// Types disponibles :
//   - 'string'    : <input type="text">
//   - 'number'    : <input type="number">
//   - 'longtext'  : <textarea> sans HTML
//   - 'html'      : <textarea>, contenu interprété en HTML à l'affichage
//                   (autorise <strong>, <em>, &nbsp;, <a>, <br>)
//   - 'image'     : picker avec preview + upload R2 + saisie de chemin
//   - 'url'       : <input type="url">
//   - 'array'     : liste d'items éditables (add/remove/réordonner)
//   - 'object'    : groupe imbriqué avec son propre schéma
//   - 'tuple'     : paire [label, href] (utilisé pour les liens du footer)
//   - 'paragraphs': tableau de strings (chaque entrée est une textarea html)

window.CMS_SCHEMAS = {
  actualites: {
    label: 'Actualités',
    fields: [
      { key: 'eyebrowNumber', label: 'Numéro de section', type: 'number' },
      { key: 'eyebrowLabel',  label: 'Libellé section',    type: 'string' },
      { key: 'titleLine1',    label: 'Titre ligne 1',      type: 'string', help: 'Ex. "Ce qui"' },
      { key: 'titleLine2',    label: 'Titre ligne 2 (italique accent)', type: 'string', help: 'Ex. "se passe en ce moment."' },
      { key: 'lede',          label: 'Paragraphe d\'intro (optionnel)', type: 'longtext' },

      { key: 'banner', label: 'Bandeau au-dessus de la nav', type: 'object',
        schema: { fields: [
          { key: 'enabled', label: 'Afficher le bandeau',     type: 'boolean' },
          { key: 'eyebrow', label: 'Eyebrow (uppercase)',     type: 'string', help: 'Ex. "À noter", "Info", "Urgent"' },
          { key: 'text',    label: 'Texte du bandeau',        type: 'string', help: 'Ex. "Pas de cours mardi 1er mai (férié)"' },
          { key: 'href',    label: 'Lien (optionnel)',        type: 'url',    help: 'Cliquable si renseigné' },
        ]},
      },

      { key: 'items', label: 'Cartes actualités', type: 'array',
        help: '1 carte → grand format horizontal · 2 cartes → 50/50 · 3+ cartes → grille 3 colonnes. Au clic sur une carte, un modal s\'ouvre avec le contenu détaillé.',
        itemLabel: (it, i) => it?.title || `Actualité ${i + 1}`,
        item: { fields: [
          { key: 'id',       label: 'Identifiant technique', type: 'string', help: 'Optionnel, ex. "open-lyon-juin"' },
          { key: 'eyebrow',  label: 'Eyebrow (date / catégorie)', type: 'string', help: 'Ex. "Compétition · 14 juin 2026"' },
          { key: 'title',    label: 'Titre',                  type: 'string' },
          { key: 'desc',     label: 'Description courte (carte)', type: 'longtext', help: 'Affichée sur la carte avant clic. 1-2 phrases.' },
          { key: 'image',    label: 'Image principale',       type: 'image' },
          { key: 'imageAlt', label: 'Texte alt image',        type: 'string' },

          { key: 'bodyHtml', label: 'Contenu détaillé (modal) — HTML', type: 'html', help: 'Affiché dans le modal au clic. Autorise <p>, <strong>, <em>, <a>, <ul>, <ol>.' },
          { key: 'gallery', label: 'Galerie d\'images (modal)', type: 'array',
            itemLabel: (it, i) => it?.src ? it.src.split('/').pop() : `Image ${i + 1}`,
            item: { fields: [
              { key: 'src',     label: 'Image',    type: 'image' },
              { key: 'alt',     label: 'Texte alt', type: 'string' },
              { key: 'caption', label: 'Légende (optionnelle)', type: 'string' },
            ]},
          },
          { key: 'links', label: 'Liens (modal)', type: 'array',
            help: 'Affichés comme boutons en bas du modal. Le 1er est mis en avant (ember), les suivants en outline.',
            itemLabel: (it, i) => it?.label || `Lien ${i + 1}`,
            item: { fields: [
              { key: 'label', label: 'Libellé', type: 'string' },
              { key: 'href',  label: 'URL',     type: 'url' },
            ]},
          },
        ]},
      },
    ],
  },

  hero: {
    label: 'Hero (accueil)',
    fields: [
      { key: 'logo',           label: 'Logo',                 type: 'image' },
      { key: 'logoAlt',        label: 'Texte alternatif logo', type: 'string' },
      { key: 'titleStart',     label: 'Titre — début',         type: 'string', help: 'Ex. "De"' },
      { key: 'titleFeu',       label: 'Titre — "Feu" (dégradé flamme)', type: 'string' },
      { key: 'titleConnector', label: 'Titre — connecteur italique', type: 'string', help: 'Ex. "et d\'"' },
      { key: 'titleAcier',     label: 'Titre — "Acier" (dégradé acier)', type: 'string' },
      { key: 'subtitleLine',   label: 'Sous-titre (ligne 1)', type: 'string' },
      { key: 'subtitlePlace',  label: 'Lieu mis en avant',    type: 'string' },
    ],
  },

  disciplines: {
    label: 'Disciplines',
    fields: [
      { key: 'eyebrowNumber', label: 'Numéro de section', type: 'number' },
      { key: 'eyebrowLabel',  label: 'Libellé section',    type: 'string' },
      { key: 'titleLine1',    label: 'Titre ligne 1',      type: 'string' },
      { key: 'titleLine2',    label: 'Titre ligne 2 (italique accent)', type: 'string' },
      { key: 'lede',          label: 'Paragraphe d\'intro', type: 'longtext' },
      { key: 'items', label: 'Cartes disciplines', type: 'array',
        itemLabel: (it, i) => it?.name || `Discipline ${i + 1}`,
        item: { fields: [
          { key: 'id',       label: 'Identifiant technique', type: 'string', help: 'Sans espaces, en minuscules' },
          { key: 'name',     label: 'Nom',                   type: 'string' },
          { key: 'sub',      label: 'Sous-titre',            type: 'string' },
          { key: 'era',      label: 'Époque',                type: 'string' },
          { key: 'eraDates', label: 'Dates',                 type: 'string' },
          { key: 'desc',     label: 'Description',           type: 'longtext' },
          { key: 'img',      label: 'Image',                 type: 'image' },
          { key: 'focal',    label: 'Cadrage CSS',           type: 'string', help: 'Ex. "50% 40%"' },
        ]},
      },
    ],
  },

  profs: {
    label: 'Encadrement',
    fields: [
      { key: 'eyebrowNumber', label: 'Numéro de section', type: 'number' },
      { key: 'eyebrowLabel',  label: 'Libellé section',    type: 'string' },
      { key: 'titleLine1',    label: 'Titre ligne 1',      type: 'string' },
      { key: 'titleLine2',    label: 'Titre ligne 2 (italique accent)', type: 'string' },
      { key: 'lede',          label: 'Paragraphe d\'intro', type: 'longtext' },
      { key: 'items', label: 'Profs', type: 'array',
        itemLabel: (it, i) => it?.name || `Prof ${i + 1}`,
        item: { fields: [
          { key: 'eyebrow',  label: 'Spécialité (au-dessus du nom)', type: 'string' },
          { key: 'name',     label: 'Nom complet',                   type: 'string' },
          { key: 'photo',    label: 'Photo',                         type: 'image' },
          { key: 'focal',    label: 'Cadrage CSS',                   type: 'string', help: 'Ex. "50% 30%"' },
          { key: 'punch',    label: 'Accroche (1 ligne)',            type: 'string' },
          { key: 'body',     label: 'Bio',                           type: 'longtext' },
          { key: 'link', label: 'Lien externe (optionnel)', type: 'object',
            schema: { fields: [
              { key: 'href',  label: 'URL',     type: 'url' },
              { key: 'label', label: 'Libellé', type: 'string' },
            ]},
          },
          { key: 'featured', label: 'Mise en avant (liseré ember)', type: 'boolean' },
        ]},
      },
    ],
  },

  club: {
    label: 'Le club',
    fields: [
      { key: 'eyebrowNumber', label: 'Numéro de section', type: 'number' },
      { key: 'eyebrowLabel',  label: 'Libellé section',    type: 'string' },
      { key: 'titleLine1',    label: 'Titre ligne 1',      type: 'string' },
      { key: 'titleLine2',    label: 'Titre ligne 2 (italique accent)', type: 'string' },
      { key: 'titleLine3',    label: 'Titre ligne 3',      type: 'string' },
      { key: 'body',          label: 'Description',        type: 'longtext' },
      { key: 'image',         label: 'Image',              type: 'image' },
      { key: 'imageAlt',      label: 'Texte alt image',    type: 'string' },
      { key: 'imageFocal',    label: 'Cadrage CSS',        type: 'string' },
      { key: 'pillars', label: '3 piliers', type: 'array',
        itemLabel: (it, i) => it?.title || `Pilier ${i + 1}`,
        item: { fields: [
          { key: 'n',     label: 'Numéro',     type: 'string', help: 'Ex. "01"' },
          { key: 'title', label: 'Titre',      type: 'string' },
          { key: 'body',  label: 'Description', type: 'longtext' },
        ]},
      },
    ],
  },

  rigueur: {
    label: 'La rigueur',
    fields: [
      { key: 'eyebrowNumber', label: 'Numéro de section', type: 'number' },
      { key: 'eyebrowLabel',  label: 'Libellé section',    type: 'string' },
      { key: 'titleLine1',    label: 'Titre ligne 1',      type: 'string' },
      { key: 'titleLine2',    label: 'Titre ligne 2 (italique accent)', type: 'string' },
      { key: 'ledeHtml',      label: 'Phrase d\'intro (HTML autorisé)', type: 'html' },
      { key: 'body',          label: 'Paragraphe', type: 'longtext' },
      { key: 'image',         label: 'Image (traité)', type: 'image' },
      { key: 'imageAlt',      label: 'Texte alt image', type: 'string' },
      { key: 'figureCaption', label: 'Légende sous l\'image', type: 'longtext' },
    ],
  },

  rejoindre: {
    label: 'Nous rejoindre',
    fields: [
      { key: 'eyebrowNumber', label: 'Numéro de section', type: 'number' },
      { key: 'eyebrowLabel',  label: 'Libellé section',    type: 'string' },
      { key: 'titleLine1',    label: 'Titre ligne 1',      type: 'string' },
      { key: 'titleLine2',    label: 'Titre ligne 2 (italique accent)', type: 'string' },
      { key: 'scheduleHeaders', label: 'En-têtes tableau', type: 'array',
        itemLabel: (v) => v || 'Colonne',
        item: { fields: [{ key: '__self', label: 'En-tête', type: 'string' }] },
      },
      { key: 'slots', label: 'Créneaux', type: 'array',
        itemLabel: (it) => it ? `${it.day || ''} ${it.time || ''}`.trim() : 'Créneau',
        item: { fields: [
          { key: 'day',  label: 'Jour',       type: 'string', help: 'Ex. "Mar"' },
          { key: 'time', label: 'Horaire',    type: 'string', help: 'Ex. "18h00 — 20h00"' },
          { key: 'disc', label: 'Discipline', type: 'string' },
          { key: 'lvl',  label: 'Niveau',     type: 'string' },
        ]},
      },
      { key: 'pillar1', label: 'Pilier 1 (essai)', type: 'object',
        schema: { fields: [
          { key: 'eyebrow',      label: 'Eyebrow', type: 'string' },
          { key: 'headlineHtml', label: 'Headline (HTML)', type: 'html' },
          { key: 'bodyHtml',     label: 'Paragraphes (HTML par §)', type: 'paragraphs' },
          { key: 'cta', label: 'Bouton', type: 'object',
            schema: { fields: [
              { key: 'label', label: 'Libellé', type: 'string' },
              { key: 'href',  label: 'URL',     type: 'url' },
            ]},
          },
        ]},
      },
      { key: 'pillar2', label: 'Pilier 2 (adhésion)', type: 'object',
        schema: { fields: [
          { key: 'eyebrow',      label: 'Eyebrow', type: 'string' },
          { key: 'headlineHtml', label: 'Headline (HTML)', type: 'html' },
          { key: 'bodyHtml',     label: 'Paragraphes (HTML par §)', type: 'paragraphs' },
          { key: 'cta', label: 'Bouton', type: 'object',
            schema: { fields: [
              { key: 'label', label: 'Libellé', type: 'string' },
              { key: 'href',  label: 'URL',     type: 'url' },
            ]},
          },
        ]},
      },
      { key: 'map', label: 'Carte (Gymnase)', type: 'object',
        schema: { fields: [
          { key: 'name',      label: 'Nom du lieu',      type: 'string' },
          { key: 'address',   label: 'Adresse',          type: 'string' },
          { key: 'iframeSrc', label: 'URL embed OSM',    type: 'url' },
          { key: 'openLink',  label: 'Lien "ouvrir sur OSM"', type: 'url' },
        ]},
      },
    ],
  },

  tournois: {
    label: 'Tournois',
    fields: [
      { key: 'eyebrowNumber', label: 'Numéro de section', type: 'number' },
      { key: 'eyebrowLabel',  label: 'Libellé section',    type: 'string' },
      { key: 'titleLine1',    label: 'Titre ligne 1',      type: 'string' },
      { key: 'titleLine2',    label: 'Titre ligne 2 (italique accent)', type: 'string' },
      { key: 'photo',         label: 'Photo',              type: 'image' },
      { key: 'photoAlt',      label: 'Texte alt photo',    type: 'string' },
      { key: 'photoFocal',    label: 'Cadrage CSS',        type: 'string' },
      { key: 'photoOverlayEyebrow', label: 'Surimpression — eyebrow', type: 'string' },
      { key: 'photoOverlayTitle',   label: 'Surimpression — phrase',  type: 'longtext' },
      { key: 'body',          label: 'Paragraphe',         type: 'longtext' },
      { key: 'facts', label: 'Faits clés', type: 'array',
        itemLabel: (it, i) => it?.label || `Fait ${i + 1}`,
        item: { fields: [
          { key: 'label', label: 'Catégorie', type: 'string' },
          { key: 'value', label: 'Valeur',    type: 'longtext' },
        ]},
      },
      { key: 'ctas', label: 'Boutons', type: 'array',
        itemLabel: (it, i) => it?.label || `Bouton ${i + 1}`,
        item: { fields: [
          { key: 'label', label: 'Libellé', type: 'string' },
          { key: 'href',  label: 'URL',     type: 'url' },
        ]},
      },
    ],
  },

  galerie: {
    label: 'Galerie',
    fields: [
      { key: 'eyebrowNumber', label: 'Numéro de section', type: 'number' },
      { key: 'eyebrowLabel',  label: 'Libellé section',    type: 'string' },
      { key: 'titleLine1',    label: 'Titre ligne 1',      type: 'string' },
      { key: 'titleLine2',    label: 'Titre ligne 2 (italique accent)', type: 'string' },
      { key: 'facebookLabel', label: 'Libellé bouton FB',  type: 'string' },
      { key: 'facebookHref',  label: 'URL Facebook',       type: 'url' },
      { key: 'tiles', label: 'Vignettes', type: 'array',
        itemLabel: (it, i) => it?.cap || `Vignette ${i + 1}`,
        item: { fields: [
          { key: 'src',   label: 'Image',          type: 'image' },
          { key: 'alt',   label: 'Texte alt',      type: 'string' },
          { key: 'focal', label: 'Cadrage CSS',    type: 'string', help: 'Ex. "50% 50%"' },
          { key: 'cap',   label: 'Légende',        type: 'string' },
          { key: 'col',   label: 'Colonnes grille', type: 'string', help: 'Ex. "span 7"' },
          { key: 'row',   label: 'Lignes grille',   type: 'string', help: 'Ex. "span 3"' },
        ]},
      },
    ],
  },

  faq: {
    label: 'FAQ',
    fields: [
      { key: 'eyebrowNumber', label: 'Numéro de section', type: 'number' },
      { key: 'eyebrowLabel',  label: 'Libellé section',    type: 'string' },
      { key: 'titleLine1',    label: 'Titre ligne 1',      type: 'string' },
      { key: 'titleLine2',    label: 'Titre ligne 2 (italique accent)', type: 'string' },
      { key: 'lede',          label: 'Paragraphe d\'intro', type: 'longtext' },
      { key: 'items', label: 'Questions / Réponses', type: 'array',
        itemLabel: (it, i) => it?.q ? `Q${i + 1} — ${it.q.slice(0, 50)}…` : `Question ${i + 1}`,
        item: { fields: [
          { key: 'q', label: 'Question', type: 'string' },
          { key: 'a', label: 'Réponse',  type: 'longtext' },
        ]},
      },
    ],
  },

  partenaires: {
    label: 'Partenaires',
    fields: [
      { key: 'eyebrowNumber', label: 'Numéro de section', type: 'number' },
      { key: 'eyebrowLabel',  label: 'Libellé section',    type: 'string' },
      { key: 'titleLine1',    label: 'Titre ligne 1',      type: 'string' },
      { key: 'titleLine2',    label: 'Titre ligne 2 (italique accent)', type: 'string' },
      { key: 'lede',          label: 'Paragraphe d\'intro (HTML)', type: 'html' },
      { key: 'items', label: 'Partenaires', type: 'array',
        itemLabel: (it, i) => it?.name || `Partenaire ${i + 1}`,
        item: { fields: [
          { key: 'kind',     label: 'Catégorie',        type: 'string' },
          { key: 'name',     label: 'Nom',              type: 'string' },
          { key: 'logo',     label: 'Logo',             type: 'image' },
          { key: 'href',     label: 'Lien externe',     type: 'url' },
          { key: 'alt',      label: 'Texte alt logo',   type: 'string' },
          { key: 'cta',      label: 'Libellé bouton',   type: 'string' },
          { key: 'bodyHtml', label: 'Description (HTML)', type: 'html' },
        ]},
      },
    ],
  },

  footer: {
    label: 'Footer',
    fields: [
      { key: 'logo',    label: 'Logo',            type: 'image' },
      { key: 'logoAlt', label: 'Texte alt logo',  type: 'string' },
      { key: 'brand', label: 'Marquee "De Feu et d\'Acier"', type: 'object',
        schema: { fields: [
          { key: 'start',     label: 'Mot 1',         type: 'string' },
          { key: 'feu',       label: 'Feu (flamme)',  type: 'string' },
          { key: 'connector', label: 'Connecteur italique', type: 'string' },
          { key: 'acier',     label: 'Acier (acier)',  type: 'string' },
        ]},
      },
      { key: 'description', label: 'Description courte', type: 'longtext' },
      { key: 'columns', label: 'Colonnes de liens', type: 'array',
        itemLabel: (it, i) => it?.label || `Colonne ${i + 1}`,
        item: { fields: [
          { key: 'label', label: 'Titre de colonne', type: 'string' },
          { key: 'items', label: 'Liens', type: 'array',
            itemLabel: (it) => it ? it[0] || 'Lien' : 'Lien',
            item: { fields: [{ key: '__tuple', label: '[Libellé, URL]', type: 'tuple' }] },
          },
        ]},
      },
      { key: 'copyright', label: 'Copyright', type: 'string' },
      { key: 'legalLinks', label: 'Liens légaux', type: 'array',
        itemLabel: (it) => it ? it[0] || 'Lien' : 'Lien',
        item: { fields: [{ key: '__tuple', label: '[Libellé, URL]', type: 'tuple' }] },
      },
    ],
  },

  legal: {
    label: 'Mentions légales & RGPD',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow modale', type: 'string' },
      { key: 'mentions', label: 'Mentions légales', type: 'object',
        schema: { fields: [
          { key: 'title', label: 'Titre',          type: 'string' },
          { key: 'intro', label: 'Introduction',   type: 'longtext' },
          { key: 'entries', label: 'Lignes (label : valeur)', type: 'array',
            itemLabel: (it, i) => it?.label || `Ligne ${i + 1}`,
            item: { fields: [
              { key: 'label',     label: 'Libellé',          type: 'string' },
              { key: 'valueHtml', label: 'Valeur (HTML)',    type: 'html' },
            ]},
          },
          { key: 'footnote', label: 'Note bas',  type: 'longtext' },
        ]},
      },
      { key: 'rgpd', label: 'RGPD', type: 'object',
        schema: { fields: [
          { key: 'title', label: 'Titre', type: 'string' },
          { key: 'paragraphsHtml', label: 'Paragraphes (HTML par §)', type: 'paragraphs' },
          { key: 'footnote',        label: 'Note bas',  type: 'longtext' },
        ]},
      },
      { key: 'switchToRgpd',     label: 'Lien "voir RGPD"', type: 'string' },
      { key: 'switchToMentions', label: 'Lien "voir mentions"', type: 'string' },
    ],
  },
};
