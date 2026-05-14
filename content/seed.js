// Contenu par défaut, livré avec le site. Sert de fallback quand le CMS
// (Cloudflare KV) ne contient pas encore d'override pour une section.
// Les chefs éditent chaque section via /admin ; la sauvegarde écrit dans KV
// et le site fetch ces valeurs au runtime pour remplacer le seed.
//
// Les champs de texte riches (avec gras/italique/&nbsp;) sont stockés en
// HTML ; ils sont rendus via dangerouslySetInnerHTML. Pas un risque XSS car
// seul un admin authentifié peut écrire dans KV.
window.CONTENT_SEED = {
  actualites: {
    eyebrowNumber: 0,
    eyebrowLabel: 'Actualités',
    titleLine1: 'Ce qui',
    titleLine2: 'se passe en ce moment.',
    lede: '',
    // Bandeau pre-header au-dessus de la nav. Toggle "enabled" pour le masquer
    // quand il n'y a rien d'urgent à annoncer.
    banner: {
      enabled: false,
      eyebrow: 'À noter',
      text: '',
      href: '',
    },
    // Cartes d'actualités sous le hero. Layout auto selon le nombre.
    // Au clic sur une carte → modal détaillé.
    // Tableau vide → la section ne s'affiche pas.
    items: [],
  },

  hero: {
    logo: 'assets/logo.png?v=2',
    logoAlt: "De Feu et d'Acier — logo",
    titleStart: 'De',
    titleFeu: 'Feu',
    titleConnector: "et d'",
    titleAcier: 'Acier',
    subtitleLine: 'Arts Martiaux Historiques Européens',
    subtitlePlace: 'à Clermont-Ferrand',
  },

  disciplines: {
    eyebrowNumber: 1,
    eyebrowLabel: 'Les disciplines',
    titleLine1: 'Cinq armes,',
    titleLine2: 'cinq grammaires.',
    lede:
      'On peut tout pratiquer, on peut se spécialiser. Chaque arme ouvre une école de pensée et un répertoire technique distincts, étalés sur plusieurs siècles.',
    items: [
      { id: 'viking',  name: 'Combat viking', sub: 'Bouclier & arme courte',           era: 'Haut Moyen Âge', eraDates: 'VIIIᵉ — XIᵉ s.',  desc: 'Pratique inspirée des traditions martiales anciennes, avec bouclier et armes adaptées selon les sources. Jeu de pression, contact, contrôle.', img: 'assets/Viking.webp',     focal: '50% 40%' },
      { id: 'longue',  name: 'Épée longue',   sub: 'Arme emblématique des AMHE',        era: 'Médiévale',      eraDates: 'XIVᵉ — XVᵉ s.',   desc: "Pratiquée à deux mains, l'épée longue est l'arme emblématique des AMHE médiévales. Travail de garde, de pointe et d'entrée au corps.",        img: 'assets/duel-blue.webp',  focal: '50% 40%' },
      { id: 'messer',  name: 'Messer',        sub: 'Grand couteau de combat',           era: 'Médiévale',      eraDates: 'XVᵉ s.',          desc: "Arme médiévale germanique, proche d'un grand couteau de combat à un tranchant. Système populaire mêlant escrime et lutte rapprochée.",        img: 'assets/Messer.avif',     focal: '50% 40%' },
      { id: 'bocle',   name: 'Épée-bocle',    sub: 'Épée à une main & petit bouclier',   era: 'Médiévale',      eraDates: 'XIIIᵉ — XVᵉ s.',  desc: "Combinaison d'une épée à une main et d'un petit bouclier rond (bocle). Tradition médiévale du combat rapproché, mêlant frappe, parade et liaisons au bouclier.", img: 'assets/Epee-bocle.png', focal: '50% 40%' },
      { id: 'rapiere', name: 'Rapière',       sub: 'Escrime de la Renaissance',          era: 'Renaissance',    eraDates: 'XVIᵉ — XVIIᵉ s.', desc: "Arme plus tardive, liée à l'escrime de la Renaissance et de l'époque moderne. Jeu de pointe fin, distance, et déplacement précis.",            img: 'assets/Rapière.jpg',     focal: '50% 40%' },
    ],
  },

  profs: {
    eyebrowNumber: 2,
    eyebrowLabel: 'Les profs',
    titleLine1: 'Trois encadrants,',
    titleLine2: 'trois écoles.',
    lede:
      "Chaque arme a son référent. Tous transmettent à leur rythme, avec le temps qu'il faut pour comprendre le geste avant de l'enchaîner.",
    items: [
      {
        eyebrow: 'Rapière',
        name: 'Marie Poignant',
        photo: 'assets/Marie.png',
        focal: '50% 30%',
        punch: 'Rapière française & italienne · bolonaise',
        body: "Instructrice rapière. Travaille les traditions française et italienne, l'escrime bolonaise et les systèmes main gauche (cape, dague, bocle). Pratique AMHE depuis 2013.",
        link: { href: '', label: '' },
        featured: false,
      },
      {
        eyebrow: 'Épée longue',
        name: 'Gabriel Tardio',
        photo: 'assets/Gabriel.jpg',
        focal: '50% 30%',
        punch: 'Top 1 % mondial · épée longue acier',
        body: "Référent principal du club. Compétiteur reconnu du circuit AMHE, classé dans le top 1 % mondial en épée longue acier sur HEMA Ratings. Pratique exigeante, structurée, tournée vers l'efficacité en assaut.",
        link: { href: 'https://hemaratings.com/fighters/details/5716/', label: 'Profil HEMA Ratings' },
        featured: true,
      },
      {
        eyebrow: 'Messer · viking · bocle',
        name: 'Ludwig Fort',
        photo: 'assets/Ludwig.jpeg',
        focal: '50% 30%',
        punch: 'Armes courtes & bouclier',
        body: "Encadre les pratiques messer, combat viking et épée-bocle. Apporte une approche orientée armes courtes, bouclier et systèmes asymétriques — les disciplines moins courues du répertoire AMHE.",
        link: { href: '', label: '' },
        featured: false,
      },
    ],
  },

  club: {
    eyebrowNumber: 3,
    eyebrowLabel: 'Le club',
    titleLine1: 'Une bande',
    titleLine2: "d'escrimeurs,",
    titleLine3: 'une école.',
    body:
      "Section AMHE de l'USAM Clermont-Ferrand, affiliée à la FFAMHE, le club accueille débutants et pratiquants confirmés, en loisir comme en compétition. Encadrement assuré par Gabriel Tardio. La salle est ouverte à toutes et tous, et l'on prend le temps de bien faire les choses.",
    image: 'assets/team-track.webp',
    imageAlt: "L'équipe sur la piste",
    imageFocal: '50% 40%',
    pillars: [
      { n: '01', title: 'Source', body: 'Étude des textes et traités historiques. Lecture, mise en pratique, reconstitution martiale des gestes anciens.' },
      { n: '02', title: 'Geste',  body: 'Technique structurée par le drill, le sentiment du fer, et la mise en pratique en assaut libre.' },
      { n: '03', title: 'Salle',  body: "Un esprit d'école d'armes : exigence sportive, respect du partenaire, et progression à son rythme." },
    ],
  },

  rigueur: {
    eyebrowNumber: 4,
    eyebrowLabel: 'La rigueur',
    titleLine1: 'Le geste juste,',
    titleLine2: 'avant le costume.',
    ledeHtml:
      'On étudie les arts martiaux européens à partir des <em style="font-style:normal;color:var(--accent);font-weight:500">traités et sources historiques</em>, dans une pratique moderne, sportive et sécurisée. On y vient pour le geste, pas pour le costume.',
    body:
      "Ici on s'entraîne en tenue de sport, masque d'escrime et protections modernes, avec des armes d'entraînement adaptées à chaque discipline. Les sources anciennes ne sont pas un décor — elles sont la partition que l'on lit, que l'on questionne, et qu'on éprouve sur le tapis.",
    image: 'assets/treatise.jpg',
    imageAlt: "Planche issue d'un traité d'escrime historique",
    figureCaption:
      "Planche extraite d'un traité d'escrime historique. Étude des gardes, des distances, du timing — des gestes que l'on cherche à comprendre, puis à éprouver dans la salle.",
  },

  rejoindre: {
    eyebrowNumber: 5,
    eyebrowLabel: 'Nous rejoindre',
    titleLine1: 'Une lame, un masque,',
    titleLine2: "et l'envie de bien faire.",
    scheduleHeaders: ['Jour', 'Horaire', 'Discipline', 'Niveau'],
    slots: [
      { day: 'Mar', time: '18h00 — 20h00', disc: 'Épée longue · rapière · messer · viking', lvl: 'Tous niveaux'   },
      { day: 'Jeu', time: '18h00 — 20h00', disc: 'Pratique libre',                          lvl: 'Sans encadrant' },
      { day: 'Jeu', time: '20h00 — 22h00', disc: 'Épée longue · épée-bocle',                lvl: 'Tous niveaux'   },
    ],
    pillar1: {
      eyebrow: '01 · Viens essayer',
      headlineHtml: 'Le premier mois est <em>gratuit</em>. Viens quand tu veux, sans prévenir.',
      bodyHtml: [
        "Peu importe que tu n'aies jamais fait de sport, que tu sortes d'un autre art martial ou que tu n'aies rien touché depuis des années — <strong>on t'accueille</strong>. Tu n'as besoin de rien apporter&nbsp;: on te prête le masque, la veste, les gants, et <strong>l'arme que tu veux tester</strong> (épée longue, sabre, dague, rapière…).",
        "Aucun engagement, aucun frais. <em>Viens, ça nous fait plaisir.</em>",
      ],
      cta: { label: 'Itinéraire', href: 'https://www.google.com/maps/dir/?api=1&destination=Gymnase+Robert+Pras%2C+3+rue+Jean+Monnet%2C+63100+Clermont-Ferrand' },
    },
    pillar2: {
      eyebrow: '02 · Pour continuer',
      headlineHtml: "<strong>85&nbsp;€</strong> par an, un masque, des gants coqués. <em>C'est tout.</em>",
      bodyHtml: [
        "Si tu décides de rester pour l'année, l'adhésion c'est 85&nbsp;€ — soit <em>littéralement moins qu'un Netflix</em>. À ça, tu ajoutes les <strong>deux seules pièces</strong> à te procurer pour les séances régulières&nbsp;: un masque d'escrime standard et des gants coqués.",
        "Le reste — vestes, protections, armes — on en parle au fil du temps, souvent à prix d'ami chez nos partenaires.",
      ],
      cta: { label: 'Adhérer · HelloAsso', href: 'https://www.helloasso.com/associations/usam-amhe-clermont-ferrand/adhesions/inscription-usam-amhe-clermont-2025-2026' },
    },
    map: {
      name: 'Gymnase Robert Pras',
      address: '3 rue Jean Monnet · 63100 Clermont-Ferrand',
      iframeSrc: 'https://www.openstreetmap.org/export/embed.html?bbox=3.0397%2C45.7808%2C3.0957%2C45.8048&layer=mapnik&marker=45.7928%2C3.0677',
      openLink: 'https://www.openstreetmap.org/?mlat=45.7928&mlon=3.0677#map=17/45.7928/3.0677',
    },
  },

  tournois: {
    eyebrowNumber: 6,
    eyebrowLabel: 'Tournois & saison',
    titleLine1: 'Saison',
    titleLine2: 'de compétition.',
    photo: 'assets/podium.jpg',
    photoAlt: 'Podium FFAMHE',
    photoFocal: '50% 30%',
    photoOverlayEyebrow: 'Compétiteurs',
    photoOverlayTitle: 'Plusieurs membres engagés en compétition, référencés sur HEMA Ratings.',
    body:
      "Le club est présent sur le circuit FFAMHE et référencé sur HEMA Ratings. La compétition reste un choix : on peut pratiquer en loisir ou viser les tournois, à son rythme.",
    facts: [
      { label: 'Circuit FFAMHE',       value: 'épée longue, épée-bocle, rapière — open / débutant / féminin' },
      { label: 'Interclubs & stages',  value: "échanges réguliers avec d'autres clubs AMHE" },
      { label: 'Loisir possible',      value: "la compétition n'est jamais obligatoire" },
    ],
    ctas: [
      { label: 'Résultats HEMA Ratings', href: 'https://hemaratings.com/clubs/details/1155/' },
      { label: 'Calendrier FFAMHE',      href: 'https://ffamhe.fr' },
    ],
  },

  galerie: {
    eyebrowNumber: 7,
    eyebrowLabel: 'Galerie',
    titleLine1: 'Quelques',
    titleLine2: 'images de salle.',
    facebookLabel: 'Voir sur Facebook',
    facebookHref: 'https://www.facebook.com/63AMHE/',
    tiles: [
      { src: 'assets/duel-reflection.webp', alt: 'Combat sur piste avec reflet dans une flaque', focal: '50% 50%', cap: 'Reflets de salle', col: 'span 7', row: 'span 3' },
      { src: 'assets/team-track.webp',      alt: "Équipe sur la piste d'athlétisme",            focal: '50% 50%', cap: "L'équipe",         col: 'span 5', row: 'span 2' },
      { src: 'assets/kit-still-life.webp',  alt: 'Équipement et longue épée disposés au sol',   focal: '50% 50%', cap: "L'équipement",     col: 'span 5', row: 'span 2' },
      { src: 'assets/group-gym.jpg',        alt: 'Photo de groupe en gymnase après un événement', focal: '50% 40%', cap: 'En gymnase',      col: 'span 4', row: 'span 3' },
      { src: 'assets/sparring.jpg',         alt: 'Assaut en salle, longue épée',                focal: '50% 50%', cap: "À l'assaut",       col: 'span 4', row: 'span 3' },
      { src: 'assets/duel-blue.webp',       alt: 'Garde en doublet bleu',                       focal: '60% 50%', cap: 'En garde',         col: 'span 4', row: 'span 3' },
    ],
  },

  faq: {
    eyebrowNumber: 8,
    eyebrowLabel: 'Questions fréquentes',
    titleLine1: "Tout ce qu'on",
    titleLine2: 'nous demande.',
    lede:
      "Les questions qu'on entend le plus souvent au premier contact. Si la vôtre n'y est pas, écrivez-nous — on répond.",
    items: [
      { q: "Faut-il déjà faire du sport ou de l'escrime ?", a: "Non. La séance accueille tous niveaux et l'encadrement prend le temps avec les débutants — on commence par comprendre le geste avant de l'enchaîner. Aucun pré-requis sportif ou martial." },
      { q: "C'est dangereux ?", a: "On s'entraîne en tenue de sport, masque d'escrime et protections modernes, avec des armes d'entraînement adaptées à chaque discipline. Le travail est progressif : drills, sentiment du fer, puis assauts encadrés. Pas d'arme tranchante en main, pas de contact sans équipement." },
      { q: "À quoi ressemble une séance ?", a: "Chaque séance commence par environ 40 minutes d'échauffement collectif, intense et rythmé — tous ensemble, sur la même cadence. On prépare les articulations, le cardio, les déplacements et la coordination, en groupe. Personne ne se retrouve seul à se demander quoi faire : on suit le rythme. Une fois le corps prêt, on enchaîne sur le travail technique du jour (drills, exercices d'opposition, puis assauts encadrés selon le niveau)." },
      { q: "Que dois-je apporter pour la première séance ?", a: "Tenue de sport, chaussures propres pour le gymnase et une bouteille d'eau. Le matériel d'initiation (masque, gants, arme d'entraînement) est prêté pour découvrir." },
      { q: "Combien coûte l'adhésion ?", a: "85 € pour la saison 2025-2026, via HelloAsso. Il est possible de rejoindre en cours d'année. La première séance d'essai est sans engagement — contactez-nous avant de venir pour qu'on vous attende." },
      { q: "Quels créneaux et quel lieu ?", a: "Mardi 18h-20h et jeudi 18h-22h au Gymnase Robert Pras (3 rue Jean Monnet, 63100 Clermont-Ferrand). Le créneau Mardi couvre épée longue, rapière, messer, viking. Le créneau Jeudi couvre épée longue et épée-bocle, précédé d'une pratique libre sans encadrant." },
      { q: "Faut-il venir à toutes les séances ?", a: "Non, c'est complètement libre. Pas besoin de prévenir si tu sautes une séance, si tu n'es pas là pendant deux semaines ou si tu n'as juste pas envie un soir — tu reviens quand tu veux, sans justification. Cela dit : la régularité reste la clé pour progresser. La technique se construit dans la répétition, et le corps s'habitue petit à petit aux gardes, aux distances et à l'effort. Plus tu viens, plus ça paie." },
      { q: "Faut-il faire de la compétition ?", a: "Non. Le club est présent sur le circuit FFAMHE et plusieurs membres sont référencés sur HEMA Ratings, mais la compétition n'est jamais obligatoire. Loisir et perfectionnement technique sont une voie tout aussi reconnue." },
    ],
  },

  partenaires: {
    eyebrowNumber: 9,
    eyebrowLabel: 'Partenaires',
    titleLine1: 'Sans eux,',
    titleLine2: 'rien de tout ça.',
    lede:
      "Un club n'existe pas tout seul. Il existe parce qu'une fédération porte la discipline au niveau national, parce que des artisans fabriquent du matériel pensé pour cette pratique, et parce que ces gens-là <em>partagent la même exigence que nous</em>. Les trois ci-dessous, on ne se contente pas de les mentionner — on les recommande, on travaille avec eux, et on t'invite à aller voir.",
    items: [
      {
        kind: 'Affiliation',
        name: 'FFAMHE',
        logo: 'assets/logo_signature_FFAMHE.png',
        href: 'https://ffamhe.fr',
        alt: 'Fédération Française des Arts Martiaux Historiques Européens',
        cta: 'Visiter la FFAMHE',
        bodyHtml: "La <strong>Fédération Française des Arts Martiaux Historiques Européens</strong> est la colonne vertébrale de tout le milieu AMHE en France. Sans elle, <em>pas de circuit de tournois national, pas de classement HEMA Ratings, pas de cadre pour assurer et reconnaître les clubs</em>. Notre affiliation, c'est ce qui permet à nos compétiteurs d'exister sur la scène, et à chaque séance ici d'être rattachée à un travail collectif beaucoup plus large que notre seule salle.",
      },
      {
        kind: 'Équipement',
        name: "Faits d'Armes",
        logo: "assets/Fait-d'arme-logo.png",
        href: 'https://faitsdarmes.com/fr/',
        alt: "Faits d'Armes — équipement AMHE",
        cta: 'Voir leurs équipements',
        bodyHtml: "Atelier français qui développe son matériel en <em>travaillant directement avec des pratiquants</em>. Vestes 350N ou 800N, gants coqués, protections rigides — chaque pièce est conçue pour <strong>résister aux assauts longue épée</strong> et durer. Quand tu veux monter ton équipement sérieusement, c'est par là qu'on commence à regarder.",
      },
      {
        kind: 'Équipement',
        name: 'Black Armoury',
        logo: 'assets/black-armoury-logo.jpg',
        href: 'https://blackarmoury.com',
        alt: 'Black Armoury — équipement HEMA',
        cta: 'Voir leurs lames',
        bodyHtml: "Forgeron-fournisseur <strong>incontournable de la scène AMHE européenne</strong>. Simulateurs d'épée longue, montants, dagues, rapières — la qualité de lame qu'on retrouve dans la main d'une bonne partie des compétiteurs sérieux. Quand tu veux <em>ton arme à toi</em>, c'est ici qu'on regarde en premier.",
      },
    ],
  },

  footer: {
    logo: 'assets/logo.png?v=2',
    logoAlt: "De Feu et d'Acier",
    brand: { start: 'De', feu: 'Feu', connector: "et d'", acier: 'Acier' },
    description:
      "Section AMHE de l'USAM Clermont-Ferrand, affiliée à la FFAMHE. Arts martiaux historiques européens au cœur du Puy-de-Dôme.",
    columns: [
      { label: 'Le club',   items: [['La rigueur', '#rigueur'], ['Disciplines', '#disciplines'], ['FAQ', '#faq'], ['Tournois', '#tournois'], ['Galerie', '#galerie']] },
      { label: 'Pratique',  items: [['Nous rejoindre', '#creneaux'], ['Adhésion', 'https://www.helloasso.com/associations/usam-amhe-clermont-ferrand/adhesions/inscription-usam-amhe-clermont-2025-2026'], ['HelloAsso', 'https://www.helloasso.com/associations/usam-amhe-clermont-ferrand']] },
      { label: 'Suivre',    items: [['Facebook', 'https://www.facebook.com/63AMHE/'], ['HEMA Ratings', 'https://hemaratings.com/clubs/details/1155/'], ['USAM Clermont', 'https://usam-clermont-ferrand.com/amhe-arts-martiaux-historiques-europeens'], ['FFAMHE', 'https://ffamhe.fr']] },
    ],
    copyright: "© 2026 · De Feu et d'Acier · Clermont-Ferrand",
    legalLinks: [['Mentions légales', '#mentions-legales'], ['Confidentialité', '#rgpd']],
  },

  legal: {
    eyebrow: 'Informations légales',
    mentions: {
      title: 'Mentions légales',
      intro:
        "Site édité par la section AMHE « De Feu et d'Acier » de l'USAM Clermont-Ferrand, association loi 1901 affiliée à la FFAMHE.",
      entries: [
        { label: "Siège & lieu d'entraînement",  valueHtml: 'Gymnase Robert Pras — 3 rue Jean Monnet, 63100 Clermont-Ferrand' },
        { label: 'Horaires hebdomadaires',       valueHtml: 'Mardi 18h00 — 20h00 · entraînement encadré, tous niveaux<br />Jeudi 18h00 — 20h00 · pratique libre, sans encadrant<br />Jeudi 20h00 — 22h00 · entraînement encadré, tous niveaux' },
        { label: 'Directrice de publication',    valueHtml: 'Clémence Sillac, présidente de section' },
        { label: 'Contact',                       valueHtml: '<a href="mailto:c.sillac@protonmail.com">c.sillac@protonmail.com</a> · <a href="tel:+33631585460">06 31 58 54 60</a>' },
        { label: 'Affiliation',                   valueHtml: "Section AMHE de l'USAM Clermont-Ferrand · fédération FFAMHE" },
        { label: 'Hébergement',                   valueHtml: 'Cloudflare Workers — Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA' },
      ],
      footnote:
        'Les photographies et illustrations utilisées sont la propriété du club ou de leurs auteurs respectifs. Toute reproduction non autorisée est interdite.',
    },
    rgpd: {
      title: 'Confidentialité & RGPD',
      paragraphsHtml: [
        "Ce site ne dépose <strong>aucun cookie</strong>, n'utilise <strong>aucun outil d'analyse</strong> et ne stocke aucune donnée personnelle côté serveur.",
        "Le formulaire de contact ouvre votre application de messagerie avec un message pré-rempli. Aucune information n'est envoyée vers ce site ni vers un service tiers : l'envoi se fait depuis votre propre boîte mail.",
        "Les coordonnées affichées (mail, téléphone, adresse) sont celles communiquées volontairement par les responsables du club pour leurs fonctions associatives.",
      ],
      footnote:
        "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression sur les données qui vous concernent. Pour exercer ces droits, contactez la présidente de section à l'adresse ci-dessus.",
    },
    switchToRgpd: 'Voir la politique de confidentialité',
    switchToMentions: 'Voir les mentions légales',
  },
};
