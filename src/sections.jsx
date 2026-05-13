// SECTIONS — Club, Manifesto, Disciplines, Salle d'armes, Tournois, Galerie, Identité

// ───────────────────────────────────────────────────────────────────
// Section-level responsive + interaction styles (single source of truth)
// ───────────────────────────────────────────────────────────────────
const SectionsStyles = () => (
  <style>{`
    /* Generic editorial 2-col grid used in many sections */
    .editorial-split { display: grid; gap: 80px; align-items: start; }
    .editorial-split.split-12-085 { grid-template-columns: 1.2fr 0.85fr; gap: 120px; }
    .editorial-split.split-085-115 { grid-template-columns: 0.85fr 1.15fr; }
    .editorial-split.split-1-1 { grid-template-columns: 1fr 1fr; }
    .editorial-split.split-085-115-end { grid-template-columns: 0.85fr 1.15fr; align-items: end; }
    .editorial-split.split-14-1-end { grid-template-columns: 1.4fr 1fr; align-items: end; }
    .editorial-split.center { align-items: center; }
    .editorial-split.bottom { align-items: end; }

    /* Pillars (Club 3-col) — sobre, sans effet ember dédié (pas interactif) */
    .pillars { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--parch-line); border-bottom: 1px solid var(--parch-line); }
    .pillar {
      padding: 52px 44px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      border-left: 1px solid var(--parch-line);
    }
    .pillar:first-child { border-left: none; }

    /* Disciplines card strip */
    .disc-strip { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0; width: 100%; height: 620px; border-top: 1px solid var(--parch-line); }
    .disc-card {
      position: relative;
      overflow: hidden;
      cursor: pointer;
      transition: filter 320ms var(--ease);
      outline: none;
      background: var(--coal);
      border-right: 1px solid var(--parch-line);
    }
    .disc-card:last-child { border-right: none; }
    /* Filet ember en haut de la carte active */
    .disc-card::after {
      content: '';
      position: absolute;
      left: 0; right: 0; top: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent) 35%, var(--ember-hot) 65%, transparent);
      opacity: 0;
      transition: opacity 280ms var(--ease);
      z-index: 3;
      pointer-events: none;
    }
    .disc-card[aria-pressed="true"]::after { opacity: 0.9; }
    /* Mobile : descriptif toujours visible, l'utilisateur scrolle latéralement
       et n'a pas le hover desktop pour révéler le texte. */
    @media (hover: none) {
      .disc-card .disc-desc {
        max-height: 200px !important;
        opacity: 1 !important;
      }
    }

    /* Schedule table — hover discret (juste un wash) */
    .salle-table-row { display: grid; grid-template-columns: 80px 220px 1.6fr 1fr; padding: 26px 0; align-items: center; gap: 24px; border-bottom: 1px solid var(--parch-line); transition: background 200ms var(--ease); }
    .salle-table-header { display: grid; grid-template-columns: 80px 220px 1.6fr 1fr; padding: 18px 0; border-bottom: 1px solid var(--parch-line); align-items: center; gap: 24px; }

    /* Tournois split */
    .tournois-grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: 56px; align-items: start; }

    /* Galerie masonry — filtre commun (cool + légère désaturation), hover réchauffe */
    .galerie-grid { display: grid; grid-template-columns: repeat(12, 1fr); grid-auto-rows: 160px; gap: 12px; }
    .galerie-tile { position: relative; overflow: hidden; width: 100%; height: 100%; }
    .galerie-tile img { transition: transform 700ms var(--ease), filter 500ms var(--ease); filter: saturate(0.88) contrast(1.04) brightness(0.92); }
    .galerie-tile:hover img { transform: scale(1.06); filter: saturate(0.95) contrast(1.06) brightness(1.0); }
    .galerie-tile .caption {
      position: absolute; left: 16px; right: 16px; bottom: 14px;
      font-family: var(--display); font-style: italic; font-size: 14.5px;
      color: var(--parch); opacity: 0; transform: translateY(8px);
      transition: opacity 280ms var(--ease), transform 280ms var(--ease);
      text-shadow: 0 1px 12px rgba(0,0,0,0.7);
      pointer-events: none;
    }
    .galerie-tile::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(180deg, transparent 55%, rgba(8,7,10,0.65) 100%);
      opacity: 0;
      transition: opacity 280ms var(--ease);
      pointer-events: none;
    }
    .galerie-tile:hover::after { opacity: 1; }
    .galerie-tile:hover .caption { opacity: 1; transform: translateY(0); }
    /* Tactile : pas de hover, on affiche caption + voile en permanence */
    @media (hover: none) {
      .galerie-tile::after { opacity: 1 !important; }
      .galerie-tile .caption { opacity: 1 !important; transform: translateY(0) !important; }
    }

    /* Section title + lede 2-col header */
    .section-head { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: end; margin-bottom: 80px; }
    .section-head.short-gap { margin-bottom: 64px; }
    .section-head .lede-col { max-width: 460px; justify-self: end; }

    /* Footer */
    .footer-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 48px; padding-top: 56px; border-top: 1px solid var(--parch-line); margin-bottom: 64px; }
    .footer-foot { display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; padding-top: 32px; border-top: 1px solid var(--parch-line); }

    /* Contact */
    .contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 100px; align-items: start; }
    .contact-info-row { display: grid; grid-template-columns: 200px 1fr; gap: 24px; align-items: baseline; padding-bottom: 18px; border-bottom: 1px solid var(--parch-line); }
    .contact-form-row { display: flex; gap: 32px; }

    /* ── Responsive: 1100px and below ── */
    @media (max-width: 1100px) {
      .editorial-split.split-12-085, .editorial-split.split-085-115,
      .editorial-split.split-085-115-end, .editorial-split.split-14-1-end,
      .editorial-split.split-1-1 { gap: 56px; }
    }

    /* ── Tablet: 900px and below ── */
    @media (max-width: 900px) {
      section { padding: 100px 0 110px !important; }
      .editorial-split { grid-template-columns: 1fr !important; gap: 40px !important; align-items: start !important; }
      .editorial-split .lede-col, .editorial-split img { justify-self: start !important; }
      .section-head { grid-template-columns: 1fr !important; gap: 28px !important; margin-bottom: 56px !important; align-items: start !important; }
      .section-head .lede-col { justify-self: start !important; max-width: 100% !important; }
      .pillars { grid-template-columns: 1fr !important; }
      .pillar { border-left: none !important; border-top: 1px solid var(--parch-line); padding: 36px 0 !important; }
      .pillar:first-child { border-top: none; }
      .tournois-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
      .tournois-facts li { grid-template-columns: 160px 1fr !important; }
      .galerie-grid { grid-template-columns: repeat(6, 1fr) !important; grid-auto-rows: 140px !important; }
      .galerie-tile-l { grid-column: span 6 !important; grid-row: span 2 !important; }
      .galerie-tile-m { grid-column: span 3 !important; grid-row: span 2 !important; }
      .galerie-tile-s { grid-column: span 3 !important; grid-row: span 2 !important; }
      .contact-grid { grid-template-columns: 1fr !important; gap: 64px !important; }
      .contact-form-row { flex-direction: column; gap: 28px; }
      .contact-info-row { grid-template-columns: 1fr !important; gap: 6px; }
      .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 40px !important; }
      .footer-grid > div:first-child { grid-column: 1 / -1; }
      /* Disciplines: horizontal scroll-snap row */
      .disc-strip { grid-template-columns: repeat(5, 78%) !important; height: 480px !important; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
      .disc-card { scroll-snap-align: start; }
      /* Salle table → cards */
      .salle-table-header { display: none !important; }
      .salle-table-row { grid-template-columns: 1fr !important; gap: 6px !important; padding: 22px 0 !important; }
    }

    /* ── Phone: 640px and below ── */
    @media (max-width: 640px) {
      .footer-grid { grid-template-columns: 1fr !important; }
      .footer-grid > div:first-child { grid-column: auto; }
      section h2.display { font-size: clamp(40px, 11vw, 64px) !important; }
      .galerie-grid { grid-auto-rows: 120px !important; }
    }
  `}</style>
);


// ───────────────────────────────────────────────────────────────────
// MANIFESTO — treatise drawing right, large pull-quote left.
// Editorial spread feel, alludes to historical sources.
// ───────────────────────────────────────────────────────────────────
const Manifesto = () => (
  <section
    id="rigueur"
    data-screen-label="05 La rigueur"
    style={{
      position: 'relative',
      padding: '160px 0 180px',
      background: 'var(--ink)',
    }}
  >
    <div className="container">
      <Reveal>
        <SectionLabel number={4} name="La rigueur" />
      </Reveal>

      <div className="editorial-split split-12-085">
        <div>
          <Reveal>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(48px, 5.2vw, 84px)',
                lineHeight: 0.96,
                marginBottom: 48,
                maxWidth: 760,
              }}
            >
              Le geste juste,
              <br />
              avant le costume.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <p
              className="lede"
              style={{
                fontSize: 24,
                lineHeight: 1.4,
                maxWidth: 680,
                marginBottom: 40,
                color: 'var(--parch-soft)',
              }}
            >
              On étudie les arts martiaux européens à partir des traités
              et sources historiques, dans une pratique moderne, sportive
              et sécurisée. On y vient pour le geste, pas pour le costume.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                maxWidth: 600,
                color: 'var(--parch-mute)',
                marginBottom: 56,
              }}
            >
              Ici on s'entraîne en tenue de sport, masque d'escrime et
              protections modernes, avec des armes d'entraînement adaptées
              à chaque discipline. Les sources anciennes ne sont pas un
              décor — elles sont la partition que l'on lit, que l'on
              questionne, et qu'on éprouve sur le tapis.
            </p>
          </Reveal>
        </div>

        {/* Right column — treatise drawing, sober frame */}
        <Reveal delay={150}>
          <figure
            className="treatise-frame"
            style={{
              margin: 0,
              position: 'relative',
              padding: 0,
              border: '1px solid var(--parch-line)',
              background: 'var(--char)',
            }}
          >
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                background: '#e8dec0',
              }}
            >
              <img
                src="assets/treatise.jpg"
                alt="Planche issue d'un traité d'escrime historique"
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  filter: 'contrast(1.02)',
                }}
              />
            </div>
            <figcaption
              style={{
                margin: 0,
                padding: '18px 22px 20px',
                fontFamily: 'var(--body)',
                fontSize: 13.5,
                lineHeight: 1.55,
                color: 'var(--parch-mute)',
                borderTop: '1px solid var(--parch-line)',
              }}
            >
              Planche extraite d'un traité d'escrime historique. Étude
              des gardes, des distances, du timing — des gestes que l'on
              cherche à comprendre, puis à éprouver dans la salle.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────
// CLUB — full-width with split image and intro
// ───────────────────────────────────────────────────────────────────
const Club = () => (
  <section
    id="club"
    data-screen-label="04 Le club"
    style={{
      position: 'relative',
      padding: '160px 0 180px',
      background: 'var(--coal)',
      borderTop: '1px solid var(--parch-line)',
    }}
  >
    <div className="container">
      <Reveal>
        <SectionLabel number={3} name="Le club" />
      </Reveal>

      <div className="editorial-split split-085-115 center" style={{ marginBottom: 100 }}>
        <Reveal>
          <div>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(48px, 5.2vw, 80px)',
                lineHeight: 0.96,
                marginBottom: 28,
              }}
            >
              Une bande
              <br />
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'var(--accent)',
                }}
              >
                d'escrimeurs,
              </em>
              <br />
              une école.
            </h2>
            <p
              style={{
                fontSize: 16.5,
                lineHeight: 1.7,
                color: 'var(--parch-mute)',
                maxWidth: 520,
                margin: 0,
              }}
            >
              Section AMHE de l'USAM Clermont-Ferrand, affiliée à la
              FFAMHE, le club accueille débutants et pratiquants
              confirmés, en loisir comme en compétition. Encadrement
              assuré par Gabriel Tardio. La salle est ouverte à toutes et
              tous, et l'on prend le temps de bien faire les choses.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <Photo
            src="assets/team-track.webp"
            alt="L'équipe sur la piste"
            focal="50% 40%"
            style={{ aspectRatio: '16/10', width: '100%' }}
          />
        </Reveal>
      </div>

      {/* Pillars */}
      <Reveal delay={150}>
        <div className="pillars">
          {[
            {
              n: '01',
              title: 'Source',
              body: 'Étude des textes et traités historiques. Lecture, mise en pratique, reconstitution martiale des gestes anciens.',
            },
            {
              n: '02',
              title: 'Geste',
              body: 'Technique structurée par le drill, le sentiment du fer, et la mise en pratique en assaut libre.',
            },
            {
              n: '03',
              title: 'Salle',
              body: 'Un esprit d\'école d\'armes : exigence sportive, respect du partenaire, et progression à son rythme.',
            },
          ].map((p, i) => (
            <div key={p.n} className="pillar">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  fontFamily: 'var(--eyebrow)',
                  fontSize: 10.5,
                  letterSpacing: '0.32em',
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                }}
              >
                <span>{p.n}</span>
                <span
                  style={{
                    width: 28,
                    height: 1,
                    background: 'var(--accent)',
                    display: 'inline-block',
                  }}
                />
              </div>
              <div
                className="display"
                style={{
                  fontSize: 40,
                  lineHeight: 1,
                  fontWeight: 400,
                  fontStyle: 'italic',
                }}
              >
                {p.title}.
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 14.5,
                  lineHeight: 1.65,
                  color: 'var(--parch-mute)',
                  maxWidth: 320,
                }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────
// ENCADREMENT — 3 instructeurs, hiérarchie visuelle scannable.
// Format : eyebrow (spécialité) · nom display · accroche punch · bio courte.
// Pas de portrait pseudo-photo (cf. retours UX : faisait "club qui n'assume pas").
// ───────────────────────────────────────────────────────────────────
const Encadrement = () => {
  const people = [
    {
      eyebrow: 'Rapière',
      name: 'Marie Poignant',
      photo: 'assets/Marie.png',
      focal: '50% 30%',
      punch: 'Rapière française & italienne · bolonaise',
      body: 'Instructrice rapière. Travaille les traditions française et italienne, l\'escrime bolonaise et les systèmes main gauche (cape, dague, bocle). Pratique AMHE depuis 2013.',
    },
    {
      eyebrow: 'Épée longue',
      name: 'Gabriel Tardio',
      photo: 'assets/Gabriel.jpg',
      focal: '50% 30%',
      punch: 'Top 1 % mondial · épée longue acier',
      body: 'Référent principal du club. Compétiteur reconnu du circuit AMHE, classé dans le top 1 % mondial en épée longue acier sur HEMA Ratings. Pratique exigeante, structurée, tournée vers l\'efficacité en assaut.',
      link: { href: 'https://hemaratings.com/fighters/details/5716/', label: 'Profil HEMA Ratings' },
      featured: true,
    },
    {
      eyebrow: 'Messer · viking · bocle',
      name: 'Ludwig Fort',
      photo: 'assets/Ludwig.jpeg',
      focal: '50% 30%',
      punch: 'Armes courtes & bouclier',
      body: 'Encadre les pratiques messer, combat viking et épée-bocle. Apporte une approche orientée armes courtes, bouclier et systèmes asymétriques — les disciplines moins courues du répertoire AMHE.',
    },
  ];

  return (
    <section
      id="profs"
      data-screen-label="03 Profs"
      style={{
        position: 'relative',
        padding: '140px 0 160px',
        background: 'var(--ink)',
        borderTop: '1px solid var(--parch-line)',
      }}
    >
      <div className="container">
        <Reveal>
          <SectionLabel number={2} name="Les profs" />
        </Reveal>

        <div className="section-head">
          <Reveal>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(44px, 4.8vw, 76px)',
                lineHeight: 0.98,
                margin: 0,
              }}
            >
              Trois encadrants,
              <br />
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>
                trois écoles.
              </em>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p
              className="lede-col"
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.7,
                color: 'var(--parch-mute)',
              }}
            >
              Chaque arme a son référent. Tous transmettent à leur rythme,
              avec le temps qu'il faut pour comprendre le geste avant de
              l'enchaîner.
            </p>
          </Reveal>
        </div>

        <div className="prof-grid">
          {people.map((p, i) => (
            <Reveal key={p.name} delay={120 + i * 80}>
              <article className={`prof-card${p.featured ? ' prof-card--featured' : ''}`}>
                <div className="prof-photo">
                  <img
                    src={p.photo}
                    alt={`Portrait de ${p.name}`}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: p.focal }}
                  />
                </div>
                <div className="prof-content">
                  <div className="prof-eyebrow">{p.eyebrow}</div>
                  <h3 className="prof-name">{p.name}</h3>
                  <div className="prof-punch">{p.punch}</div>
                  <p className="prof-body">{p.body}</p>
                  {p.link && (
                    <a
                      href={p.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="prof-link"
                    >
                      {p.link.label}
                      <ArrowGlyph size={10} color="currentColor" />
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        .prof-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .prof-card {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 0;
          border: 1px solid var(--parch-line);
          border-radius: 2px;
          background: linear-gradient(180deg, rgba(236,232,222,0.025), rgba(236,232,222,0.005));
          height: 100%;
          position: relative;
          overflow: hidden;
          transition: border-color 240ms var(--ease), background 240ms var(--ease);
        }
        .prof-card:hover {
          border-color: rgba(236,232,222,0.22);
          background: linear-gradient(180deg, rgba(224,85,44,0.04), rgba(236,232,222,0.012));
        }
        /* Card featured (Gabriel — référent principal) : liseré ember en haut */
        .prof-card--featured {
          background: linear-gradient(180deg, rgba(224,85,44,0.05), rgba(236,232,222,0.01));
          border-color: rgba(224,85,44,0.32);
        }
        .prof-card--featured::before {
          content: '';
          position: absolute;
          left: -1px; right: -1px; top: -1px;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent) 30%, var(--ember-hot) 70%, transparent);
          z-index: 2;
        }
        /* Photo 1:1 en haut, filtre cohérent avec la galerie (légère désaturation) */
        .prof-photo {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: var(--coal);
          border-bottom: 1px solid var(--parch-line);
        }
        .prof-photo img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.85) contrast(1.04) brightness(0.95);
          transition: filter 400ms var(--ease), transform 700ms var(--ease);
        }
        .prof-card:hover .prof-photo img {
          filter: saturate(1) contrast(1.06) brightness(1);
          transform: scale(1.03);
        }
        /* Voile sombre en bas de la photo pour rattacher visuellement au texte */
        .prof-photo::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 35%;
          background: linear-gradient(180deg, transparent, rgba(10,9,8,0.55));
          pointer-events: none;
        }
        .prof-content {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 26px 26px 24px;
          flex: 1;
        }
        .prof-eyebrow {
          font-family: var(--eyebrow);
          font-size: 10.5px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 600;
        }
        .prof-name {
          margin: 0;
          font-family: var(--display);
          font-size: clamp(28px, 2.4vw, 36px);
          line-height: 1.05;
          font-weight: 500;
          color: var(--parch);
        }
        .prof-punch {
          font-family: var(--body);
          font-size: 13.5px;
          line-height: 1.4;
          color: var(--parch-soft);
          font-weight: 500;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--parch-line);
        }
        .prof-card--featured .prof-punch {
          color: var(--parch);
        }
        .prof-body {
          margin: 0;
          font-family: var(--body);
          font-size: 14px;
          line-height: 1.65;
          color: var(--parch-mute);
          flex: 1;
        }
        .prof-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
          font-family: var(--eyebrow);
          font-size: 10.5px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 500;
          color: var(--accent);
          padding-bottom: 2px;
          border-bottom: 1px solid transparent;
          transition: border-color 200ms var(--ease);
          align-self: flex-start;
        }
        .prof-link:hover { border-bottom-color: var(--accent); }

        @media (max-width: 1100px) {
          .prof-grid { gap: 18px; }
          .prof-card { padding: 26px 22px 22px; }
        }
        @media (max-width: 900px) {
          .prof-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────
// DISCIPLINES — 4 large interactive cards in a row
// Hover expands to reveal details about the weapon system
// ───────────────────────────────────────────────────────────────────
const Disciplines = () => {
  const [active, setActive] = React.useState('longue');
  const disciplines = [
    {
      id: 'longue',
      n: '01',
      name: 'Épée longue',
      sub: 'Arme emblématique des AMHE',
      era: 'Médiévale',
      desc: 'Pratiquée à deux mains, l\'épée longue est l\'arme emblématique des AMHE médiévales. Travail de garde, de pointe et d\'entrée au corps.',
      img: 'assets/duel-blue.webp',
      focal: '50% 40%',
    },
    {
      id: 'rapiere',
      n: '02',
      name: 'Rapière',
      sub: 'Escrime de la Renaissance',
      era: 'Renaissance',
      desc: 'Arme plus tardive, liée à l\'escrime de la Renaissance et de l\'époque moderne. Jeu de pointe fin, distance, et déplacement précis.',
      img: 'assets/Rapière.jpg',
      focal: '50% 40%',
    },
    {
      id: 'messer',
      n: '03',
      name: 'Messer',
      sub: 'Grand couteau de combat',
      era: 'Médiévale',
      desc: 'Arme médiévale germanique, proche d\'un grand couteau de combat à un tranchant. Système populaire mêlant escrime et lutte rapprochée.',
      img: 'assets/Messer.avif',
      focal: '50% 40%',
    },
    {
      id: 'bocle',
      n: '04',
      name: 'Épée-bocle',
      sub: 'Épée à une main & petit bouclier',
      era: 'Médiévale',
      desc: 'Combinaison d\'une épée à une main et d\'un petit bouclier rond (bocle). Tradition médiévale du combat rapproché, mêlant frappe, parade et liaisons au bouclier.',
      img: 'assets/Epee-bocle.png',
      focal: '50% 40%',
    },
    {
      id: 'viking',
      n: '05',
      name: 'Combat viking',
      sub: 'Bouclier & arme courte',
      era: 'Haut Moyen Âge',
      desc: 'Pratique inspirée des traditions martiales anciennes, avec bouclier et armes adaptées selon les sources. Jeu de pression, contact, contrôle.',
      img: 'assets/Viking.webp',
      focal: '50% 40%',
    },
  ];
  return (
    <section
      id="disciplines"
      data-screen-label="02 Disciplines"
      style={{
        position: 'relative',
        padding: '160px 0 0',
        background: 'var(--ink)',
        borderTop: '1px solid var(--parch-line)',
      }}
    >
      <div className="container" style={{ marginBottom: 64 }}>
        <Reveal>
          <SectionLabel number={1} name="Les disciplines" />
        </Reveal>

        <div className="section-head" style={{ marginBottom: 0 }}>
          <Reveal>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(48px, 5.2vw, 84px)',
                lineHeight: 0.96,
                margin: 0,
              }}
            >
              Cinq armes,
              <br />
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'var(--accent)',
                }}
              >
                cinq grammaires.
              </em>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p
              className="lede-col"
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.7,
                color: 'var(--parch-mute)',
              }}
            >
              On peut tout pratiquer, on peut se spécialiser. Chaque arme
              ouvre une école de pensée et un répertoire technique
              distincts, étalés sur plusieurs siècles.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Card row — full bleed */}
      <div className="disc-strip">
        {disciplines.map((d) => {
          const isActive = active === d.id;
          return (
            <div
              key={d.id}
              className="disc-card"
              onMouseEnter={() => setActive(d.id)}
              onClick={() => setActive(d.id)}
              onFocus={() => setActive(d.id)}
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
            >
              <img
                src={d.img}
                alt={d.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: d.focal,
                  filter: isActive
                    ? 'grayscale(0) contrast(1.06) brightness(0.92)'
                    : 'grayscale(0.85) contrast(1.0) brightness(0.55)',
                  transition: 'filter 320ms, transform 600ms cubic-bezier(0.2,0.7,0.3,1)',
                  transform: isActive ? 'scale(1.04)' : 'scale(1.0)',
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: isActive
                    ? 'linear-gradient(180deg, rgba(8,7,10,0.05) 0%, rgba(8,7,10,0.4) 50%, rgba(8,7,10,0.95) 100%)'
                    : 'linear-gradient(180deg, rgba(8,7,10,0.3) 0%, rgba(8,7,10,0.7) 60%, rgba(8,7,10,0.95) 100%)',
                  transition: 'background 320ms',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  padding: '40px 36px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--eyebrow)',
                      fontSize: 10.5,
                      letterSpacing: '0.32em',
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {d.n}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--eyebrow)',
                      fontSize: 9.5,
                      letterSpacing: '0.32em',
                      color: 'var(--parch-mute)',
                      textTransform: 'uppercase',
                      textAlign: 'right',
                    }}
                  >
                    {d.era}
                  </div>
                </div>

                <div>
                  <div
                    className="display"
                    style={{
                      fontSize: 48,
                      lineHeight: 0.96,
                      marginBottom: 8,
                      fontWeight: 400,
                    }}
                  >
                    {d.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--body)',
                      fontSize: 13,
                      letterSpacing: '0.02em',
                      color: 'var(--parch-mute)',
                      marginBottom: 22,
                    }}
                  >
                    {d.sub}
                  </div>
                  <div
                    className="disc-desc"
                    style={{
                      maxHeight: isActive ? 200 : 0,
                      opacity: isActive ? 1 : 0,
                      overflow: 'hidden',
                      transition:
                        'max-height 320ms cubic-bezier(0.2,0.7,0.3,1), opacity 240ms',
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 1,
                        background: 'var(--accent)',
                        marginBottom: 16,
                      }}
                    />
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        lineHeight: 1.65,
                        color: 'var(--parch-soft)',
                      }}
                    >
                      {d.desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────
// SALLE D'ARMES — proper weekly grid of training sessions
// ───────────────────────────────────────────────────────────────────
const Salle = () => {
  const slots = [
    { day: 'Mar', time: '18h00 — 20h00', disc: 'Épée longue · rapière · messer · viking', lvl: 'Tous niveaux'   },
    { day: 'Jeu', time: '18h00 — 20h00', disc: 'Pratique libre',                          lvl: 'Sans encadrant' },
    { day: 'Jeu', time: '20h00 — 22h00', disc: 'Épée longue · épée-bocle',                lvl: 'Tous niveaux'   },
  ];

  return (
    <section
      id="creneaux"
      data-screen-label="06 Créneaux"
      style={{
        position: 'relative',
        padding: '160px 0 180px',
        background: 'var(--coal)',
        borderTop: '1px solid var(--parch-line)',
      }}
    >
      <div className="container">
        <Reveal>
          <SectionLabel number={5} name="Créneaux et lieux" />
        </Reveal>

        <div className="section-head">
          <Reveal>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(48px, 5.2vw, 84px)',
                lineHeight: 0.96,
                margin: 0,
              }}
            >
              Trois créneaux
              <br />
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'var(--accent)',
                }}
              >
                par semaine.
              </em>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p
              className="lede-col"
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.7,
                color: 'var(--parch-mute)',
              }}
            >
              Première séance possible après contact avec le club —
              tenue de sport, chaussures propres pour le gymnase, bouteille
              d'eau. Le matériel d'initiation peut être prêté.
            </p>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div
            style={{
              borderTop: '1px solid var(--parch-line)',
              borderBottom: '1px solid var(--parch-line)',
            }}
          >
            {/* Header row */}
            <div className="salle-table-header">
              {['Jour', 'Horaire', 'Discipline', 'Niveau'].map((h, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: 'var(--eyebrow)',
                    fontSize: 10,
                    letterSpacing: '0.32em',
                    color: 'var(--parch-mute)',
                    textTransform: 'uppercase',
                  }}
                >
                  {h}
                </div>
              ))}
            </div>

            {slots.map((s, i) => (
              <SlotRow key={i} slot={s} />
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div
            style={{
              marginTop: 56,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: 32,
              flexWrap: 'wrap',
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--body)',
                fontSize: 14.5,
                lineHeight: 1.6,
                color: 'var(--parch-mute)',
                maxWidth: 580,
              }}
            >
              Gymnase Robert Pras — 3 rue Jean Monnet, 63100
              Clermont-Ferrand. Vérifiez les horaires avant de venir
              pour une première séance.
            </p>
            <a
              href="#rejoindre"
              className="btn btn--secondary"
              style={{ flexShrink: 0 }}
            >
              Nous contacter avant de venir
              <ArrowGlyph size={11} color="currentColor" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const SlotRow = ({ slot }) => (
  <div className="salle-table-row">
    <div
      style={{
        fontFamily: 'var(--body)',
        fontSize: 13,
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
        fontWeight: 600,
        color: 'var(--accent)',
        lineHeight: 1,
      }}
    >
      {slot.day}
    </div>
    <div
      style={{
        fontFamily: 'var(--body)',
        fontSize: 16,
        lineHeight: 1.2,
        fontVariantNumeric: 'tabular-nums',
        fontWeight: 500,
        color: 'var(--parch)',
      }}
    >
      {slot.time}
    </div>
    <div
      style={{
        fontFamily: 'var(--body)',
        fontSize: 15,
        lineHeight: 1.35,
        color: 'var(--parch)',
      }}
    >
      {slot.disc}
    </div>
    <div
      style={{
        fontFamily: 'var(--body)',
        fontSize: 10.5,
        letterSpacing: '0.26em',
        textTransform: 'uppercase',
        fontWeight: 500,
        color: 'var(--parch-mute)',
      }}
    >
      {slot.lvl}
    </div>
  </div>
);

// ───────────────────────────────────────────────────────────────────
// FAQ — questions fréquentes des prospects (âge, niveau, matériel, danger)
// Réponses bâties uniquement sur les infos déjà présentes sur le site.
// ───────────────────────────────────────────────────────────────────
const Faq = () => {
  const items = [
    {
      q: 'Faut-il déjà faire du sport ou de l\'escrime ?',
      a: 'Non. La séance accueille tous niveaux et l\'encadrement prend le temps avec les débutants — on commence par comprendre le geste avant de l\'enchaîner. Aucun pré-requis sportif ou martial.',
    },
    {
      q: 'C\'est dangereux ?',
      a: 'On s\'entraîne en tenue de sport, masque d\'escrime et protections modernes, avec des armes d\'entraînement adaptées à chaque discipline. Le travail est progressif : drills, sentiment du fer, puis assauts encadrés. Pas d\'arme tranchante en main, pas de contact sans équipement.',
    },
    {
      q: 'Que dois-je apporter pour la première séance ?',
      a: 'Tenue de sport, chaussures propres pour le gymnase et une bouteille d\'eau. Le matériel d\'initiation (masque, gants, arme d\'entraînement) est prêté pour découvrir.',
    },
    {
      q: 'Combien coûte l\'adhésion ?',
      a: '85 € pour la saison 2025-2026, via HelloAsso. Il est possible de rejoindre en cours d\'année. La première séance d\'essai est sans engagement — contactez-nous avant de venir pour qu\'on vous attende.',
    },
    {
      q: 'Quels créneaux et quel lieu ?',
      a: 'Mardi 18h-20h et jeudi 18h-22h au Gymnase Robert Pras (3 rue Jean Monnet, 63100 Clermont-Ferrand). Le créneau Mardi couvre épée longue, rapière, messer, viking. Le créneau Jeudi couvre épée longue et épée-bocle, précédé d\'une pratique libre sans encadrant.',
    },
    {
      q: 'Faut-il faire de la compétition ?',
      a: 'Non. Le club est présent sur le circuit FFAMHE et plusieurs membres sont référencés sur HEMA Ratings, mais la compétition n\'est jamais obligatoire. Loisir et perfectionnement technique sont une voie tout aussi reconnue.',
    },
  ];

  const [open, setOpen] = React.useState(0);

  return (
    <section
      id="faq"
      data-screen-label="10 FAQ"
      style={{
        position: 'relative',
        padding: '160px 0 180px',
        background: 'var(--ink)',
        borderTop: '1px solid var(--parch-line)',
      }}
    >
      <div className="container">
        <Reveal>
          <SectionLabel number={9} name="Questions fréquentes" />
        </Reveal>

        <div className="section-head">
          <Reveal>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(48px, 5.2vw, 84px)',
                lineHeight: 0.96,
                margin: 0,
              }}
            >
              Tout ce qu'on
              <br />
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>
                nous demande.
              </em>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p
              className="lede-col"
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.7,
                color: 'var(--parch-mute)',
              }}
            >
              Les questions qu'on entend le plus souvent au premier
              contact. Si la vôtre n'y est pas, écrivez-nous — on répond.
            </p>
          </Reveal>
        </div>

        <Reveal delay={140}>
          <ul className="faq-list">
            {items.map((it, i) => {
              const isOpen = open === i;
              return (
                <li key={i} className="faq-item" data-open={isOpen ? 'true' : 'false'}>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span className="faq-q-text">{it.q}</span>
                    <span className="faq-q-icon" aria-hidden="true" />
                  </button>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    className="faq-a"
                    hidden={!isOpen}
                  >
                    <p>{it.a}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>

      <style>{`
        .faq-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--parch-line); }
        .faq-item { border-bottom: 1px solid var(--parch-line); }
        .faq-q {
          width: 100%;
          background: transparent;
          border: 0;
          padding: 26px 8px 26px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          cursor: pointer;
          color: var(--parch);
          font-family: var(--display);
          font-size: 22px;
          line-height: 1.3;
          text-align: left;
          transition: color 200ms var(--ease);
        }
        .faq-q:hover { color: var(--accent); }
        .faq-q-text { flex: 1; }
        .faq-q-icon {
          position: relative;
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }
        .faq-q-icon::before, .faq-q-icon::after {
          content: '';
          position: absolute;
          inset: 0;
          margin: auto;
          background: currentColor;
          transition: transform 240ms var(--ease), opacity 240ms var(--ease);
        }
        .faq-q-icon::before { width: 14px; height: 1.5px; }
        .faq-q-icon::after  { width: 1.5px; height: 14px; }
        .faq-item[data-open="true"] .faq-q { color: var(--accent); }
        .faq-item[data-open="true"] .faq-q-icon::after { transform: rotate(90deg); opacity: 0; }
        .faq-a {
          padding: 0 8px 28px 0;
        }
        .faq-a p {
          margin: 0;
          max-width: 760px;
          font-family: var(--body);
          font-size: 15.5px;
          line-height: 1.7;
          color: var(--parch-soft);
        }
        @media (max-width: 640px) {
          .faq-q { font-size: 18px; padding: 22px 4px 22px 0; gap: 20px; }
          .faq-a p { font-size: 14.5px; }
        }
      `}</style>
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────
// TOURNOIS — bloc court : photo + intro + facts + 2 liens externes
// ───────────────────────────────────────────────────────────────────
const Tournois = () => (
  <section
    id="tournois"
    data-screen-label="07 Tournois"
    style={{
      position: 'relative',
      padding: '160px 0 180px',
      background: 'var(--ink)',
      borderTop: '1px solid var(--parch-line)',
    }}
  >
    <div className="container">
      <Reveal>
        <SectionLabel number={6} name="Tournois & saison" />
      </Reveal>

      <div className="tournois-grid">
        <Reveal>
          <Photo
            src="assets/podium.jpg"
            alt="Podium FFAMHE"
            focal="50% 30%"
            style={{ aspectRatio: '3/4', width: '100%' }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, transparent 50%, rgba(8,7,10,0.92) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 28,
                right: 28,
                bottom: 28,
              }}
            >
              <Eyebrow>Compétiteurs</Eyebrow>
              <div
                className="display"
                style={{
                  marginTop: 14,
                  fontSize: 26,
                  lineHeight: 1.1,
                }}
              >
                Plusieurs membres engagés en compétition,
                référencés sur HEMA Ratings.
              </div>
            </div>
          </Photo>
        </Reveal>

        <Reveal delay={150}>
          <div>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(44px, 4.6vw, 72px)',
                lineHeight: 0.98,
                margin: '0 0 28px',
              }}
            >
              Saison
              {' '}
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'var(--accent)',
                }}
              >
                de compétition.
              </em>
            </h2>
            <p
              style={{
                margin: '0 0 36px',
                fontSize: 16.5,
                lineHeight: 1.7,
                color: 'var(--parch-soft)',
                maxWidth: 580,
              }}
            >
              Le club est présent sur le circuit FFAMHE et référencé sur
              HEMA Ratings. La compétition reste un choix : on peut
              pratiquer en loisir ou viser les tournois, à son rythme.
            </p>

            <ul className="tournois-facts">
              <li>
                <span className="tournois-fact-l">Circuit FFAMHE</span>
                <span className="tournois-fact-v">épée longue, épée-bocle, rapière — open / débutant / féminin</span>
              </li>
              <li>
                <span className="tournois-fact-l">Interclubs &amp; stages</span>
                <span className="tournois-fact-v">échanges réguliers avec d'autres clubs AMHE</span>
              </li>
              <li>
                <span className="tournois-fact-l">Loisir possible</span>
                <span className="tournois-fact-v">la compétition n'est jamais obligatoire</span>
              </li>
            </ul>

            <div
              style={{
                display: 'flex',
                gap: 12,
                marginTop: 40,
                flexWrap: 'wrap',
              }}
            >
              <a
                href="https://hemaratings.com/clubs/details/1155/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--secondary"
              >
                Résultats HEMA Ratings
                <ArrowGlyph size={11} color="currentColor" />
              </a>
              <a
                href="https://ffamhe.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--tertiary"
              >
                Calendrier FFAMHE
                <ArrowGlyph size={11} color="currentColor" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </div>

    <style>{`
      .tournois-facts {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        border-top: 1px solid var(--parch-line);
      }
      .tournois-facts li {
        display: grid;
        grid-template-columns: 200px 1fr;
        gap: 24px;
        padding: 18px 0;
        border-bottom: 1px solid var(--parch-line);
        align-items: baseline;
      }
      .tournois-fact-l {
        font-family: var(--eyebrow);
        font-size: 10.5px;
        letter-spacing: 0.26em;
        text-transform: uppercase;
        color: var(--accent);
        font-weight: 600;
      }
      .tournois-fact-v {
        font-family: var(--body);
        font-size: 15px;
        line-height: 1.55;
        color: var(--parch);
      }
      @media (max-width: 640px) {
        .tournois-facts li { grid-template-columns: 1fr; gap: 4px; padding: 14px 0; }
      }
    `}</style>
  </section>
);

// ───────────────────────────────────────────────────────────────────
// GALERIE — masonry-ish grid with real photos
// ───────────────────────────────────────────────────────────────────
const Galerie = () => (
  <section
    id="galerie"
    data-screen-label="08 Galerie"
    style={{
      position: 'relative',
      padding: '160px 0 180px',
      background: 'var(--coal)',
      borderTop: '1px solid var(--parch-line)',
    }}
  >
    <div className="container">
      <Reveal>
        <SectionLabel number={7} name="Galerie" />
      </Reveal>

      <div className="section-head">
        <Reveal>
          <h2
            className="display"
            style={{
              fontSize: 'clamp(48px, 5.2vw, 84px)',
              lineHeight: 0.96,
              margin: 0,
            }}
          >
            Quelques
            <br />
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--accent)',
              }}
            >
              images de salle.
            </em>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <a
            href="https://www.facebook.com/63AMHE/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--secondary lede-col"
            style={{ justifySelf: 'end' }}
          >
            Voir sur Facebook
            <ArrowGlyph size={12} />
          </a>
        </Reveal>
      </div>

      <div className="galerie-grid">
        {[
          { src: 'assets/duel-reflection.webp', alt: 'Combat sur piste avec reflet dans une flaque', focal: '50% 50%', cap: 'Reflets de salle', cls: 'galerie-tile-l', col: 'span 7', row: 'span 3', d: 0 },
          { src: 'assets/team-track.webp',      alt: "Équipe sur la piste d'athlétisme",            focal: '50% 50%', cap: 'L\'équipe', cls: 'galerie-tile-m',         col: 'span 5', row: 'span 2', d: 50 },
          { src: 'assets/kit-still-life.webp',  alt: 'Équipement et longue épée disposés au sol',   focal: '50% 50%', cap: 'L\'équipement', cls: 'galerie-tile-m',     col: 'span 5', row: 'span 2', d: 100 },
          { src: 'assets/group-gym.jpg',        alt: 'Photo de groupe en gymnase après un événement', focal: '50% 40%', cap: 'En gymnase', cls: 'galerie-tile-s',     col: 'span 4', row: 'span 3', d: 150 },
          { src: 'assets/sparring.jpg',         alt: 'Assaut en salle, longue épée',                focal: '50% 50%', cap: 'À l\'assaut', cls: 'galerie-tile-s',       col: 'span 4', row: 'span 3', d: 200 },
          { src: 'assets/duel-blue.webp',       alt: 'Garde en doublet bleu',                       focal: '60% 50%', cap: 'En garde', cls: 'galerie-tile-s',          col: 'span 4', row: 'span 3', d: 250 },
        ].map((t, i) => (
          <Reveal key={i} delay={t.d} style={{ gridColumn: t.col, gridRow: t.row }} className={t.cls}>
            <figure className="galerie-tile" style={{ margin: 0 }}>
              <Photo src={t.src} alt={t.alt} focal={t.focal} style={{ width: '100%', height: '100%' }} />
              <figcaption className="caption">{t.cap}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────
// PARTENAIRES — bandeau placé entre FAQ et bas de page.
// 2 mini-blocs : Affiliations (FFAMHE) | Équipement (Fait d'Arme,
// Black Armoury). Logos en couleur, hover discret, liens externes.
// ───────────────────────────────────────────────────────────────────
const Partenaires = () => {
  const affiliations = [
    {
      name: 'FFAMHE',
      logo: 'assets/logo_signature_FFAMHE.png',
      href: 'https://ffamhe.fr',
      alt: 'Fédération Française des Arts Martiaux Historiques Européens',
    },
  ];
  const equipement = [
    {
      name: 'Fait d\'Arme',
      logo: 'assets/Fait-d\'arme-logo.png',
      // TODO PROD : remplacer par l'URL officielle de la boutique si différente
      href: 'https://www.google.com/search?q=fait+d%27arme+escrime+historique',
      alt: 'Fait d\'Arme — équipement AMHE',
    },
    {
      name: 'Black Armoury',
      logo: 'assets/black-armoury-logo.jpg',
      href: 'https://blackarmoury.com',
      alt: 'Black Armoury — équipement HEMA',
    },
  ];

  return (
    <section
      id="partenaires"
      aria-labelledby="partenaires-title"
      style={{
        position: 'relative',
        padding: '100px 0 110px',
        background: 'var(--coal)',
        borderTop: '1px solid var(--parch-line)',
      }}
    >
      <div className="container">
        <Reveal>
          <div className="partenaires-head">
            <div className="eyebrow">Partenaires & affiliations</div>
            <h2 id="partenaires-title" className="partenaires-title">
              Ils nous accompagnent.
            </h2>
          </div>
        </Reveal>

        <div className="partenaires-grid">
          <Reveal delay={120}>
            <div className="partenaires-col">
              <div className="partenaires-col-l">Affiliation</div>
              <div className="partenaires-logos">
                {affiliations.map((p) => (
                  <a
                    key={p.name}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="partenaire-logo"
                    aria-label={p.alt}
                    title={p.name}
                  >
                    <img src={p.logo} alt={p.alt} loading="lazy" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="partenaires-col">
              <div className="partenaires-col-l">Équipement</div>
              <div className="partenaires-logos">
                {equipement.map((p) => (
                  <a
                    key={p.name}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="partenaire-logo partenaire-logo--equip"
                    aria-label={p.alt}
                    title={p.name}
                  >
                    <img src={p.logo} alt={p.alt} loading="lazy" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        .partenaires-head { margin-bottom: 56px; }
        .partenaires-title {
          margin: 14px 0 0;
          font-family: var(--display);
          font-size: clamp(36px, 4vw, 56px);
          line-height: 1.05;
          color: var(--parch);
          font-weight: 500;
        }
        .partenaires-grid {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 56px;
          align-items: start;
          padding-top: 40px;
          border-top: 1px solid var(--parch-line);
        }
        .partenaires-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .partenaires-col-l {
          font-family: var(--eyebrow);
          font-size: 10.5px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 600;
        }
        .partenaires-logos {
          display: flex;
          gap: 32px;
          flex-wrap: wrap;
          align-items: center;
        }
        /* Logos posés directement sur le fond, sans box. Bordure très
           discrète pour structurer, hover ember + lift. */
        .partenaire-logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 20px;
          background: transparent;
          border: 1px solid var(--parch-faint);
          border-radius: 2px;
          min-height: 64px;
          min-width: 140px;
          transition: border-color 220ms var(--ease), transform 220ms var(--ease);
        }
        .partenaire-logo:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
        }
        .partenaire-logo img {
          display: block;
          max-height: 48px;
          width: auto;
          max-width: 200px;
          object-fit: contain;
        }
        .partenaire-logo--equip img {
          max-height: 40px;
          max-width: 160px;
        }
        @media (max-width: 900px) {
          .partenaires-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .partenaires-logos { gap: 20px; }
        }
        @media (max-width: 640px) {
          .partenaire-logo { padding: 14px 18px; min-width: 0; }
          .partenaire-logo img { max-height: 38px; max-width: 140px; }
        }
      `}</style>
    </section>
  );
};

Object.assign(window, {
  SectionsStyles,
  Manifesto,
  Club,
  Encadrement,
  Disciplines,
  Salle,
  Faq,
  Tournois,
  Galerie,
  Partenaires,
});
