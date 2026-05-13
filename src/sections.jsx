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

    /* Pillars (Club 3-col) — acier + braise au hover */
    .pillars { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--parch-line); border-bottom: 1px solid var(--parch-line); }
    .pillar {
      position: relative;
      padding: 52px 44px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      border-left: 1px solid var(--parch-line);
      transition: background 320ms var(--ease);
    }
    .pillar:first-child { border-left: none; }
    .pillar::after {
      content: '';
      position: absolute;
      left: 44px;
      bottom: 0;
      width: 36px;
      height: 1px;
      background: var(--accent);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 360ms var(--ease);
    }
    .pillar:hover { background: linear-gradient(180deg, rgba(224,85,44,0.025), transparent 70%); }
    .pillar:hover::after { transform: scaleX(1); }

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

    /* Schedule table — left ember bar appears on hover */
    .salle-table-row { display: grid; grid-template-columns: 80px 200px 1.4fr 1fr 1.3fr 60px; padding: 26px 0; align-items: center; gap: 24px; border-bottom: 1px solid var(--parch-line); position: relative; transition: background 200ms var(--ease); }
    .salle-table-row::before {
      content: '';
      position: absolute;
      left: -12px; top: 50%;
      width: 2px; height: 0;
      background: var(--accent);
      transform: translateY(-50%);
      transition: height 260ms var(--ease);
      pointer-events: none;
    }
    .salle-table-row:hover::before { height: 26px; }
    .salle-table-header { display: grid; grid-template-columns: 80px 200px 1.4fr 1fr 1.3fr 60px; padding: 18px 0; border-bottom: 1px solid var(--parch-line); align-items: center; gap: 24px; }

    /* Events */
    .event-row { display: grid; grid-template-columns: 180px 1fr auto; gap: 40px; padding: 40px 0; border-bottom: 1px solid var(--parch-line); align-items: start; position: relative; }

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

    /* Section title + lede 2-col header */
    .section-head { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: end; margin-bottom: 80px; }
    .section-head.short-gap { margin-bottom: 64px; }
    .section-head .lede-col { max-width: 460px; justify-self: end; }

    /* Footer */
    .footer-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 48px; padding-top: 56px; border-top: 1px solid var(--parch-line); margin-bottom: 64px; }
    .footer-foot { display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; padding-top: 32px; border-top: 1px solid var(--parch-line); }

    /* Contact */
    .contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 100px; align-items: start; }
    .contact-info-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; padding-top: 36px; border-top: 1px solid var(--parch-line); }
    .contact-info-row { display: grid; grid-template-columns: 200px 1fr; gap: 24px; align-items: baseline; padding-bottom: 18px; border-bottom: 1px solid var(--parch-line); }
    .contact-form-row { display: flex; gap: 32px; }

    /* Marginalia (manifesto) */
    .marginalia { display: grid; grid-template-columns: auto 1fr; row-gap: 22px; column-gap: 40px; padding-top: 32px; border-top: 1px solid var(--parch-line); max-width: 600px; }

    /* ── Responsive: 1100px and below ── */
    @media (max-width: 1100px) {
      .editorial-split.split-12-085, .editorial-split.split-085-115,
      .editorial-split.split-085-115-end, .editorial-split.split-14-1-end,
      .editorial-split.split-1-1 { gap: 56px; }
    }

    /* ── Tablet: 900px and below ── */
    @media (max-width: 900px) {
      section { padding: 100px 0 110px !important; }
      /* FirstSteps reste compact (utility band, pas une section "récit") */
      section#firststeps { padding: 56px 0 60px !important; }
      .editorial-split { grid-template-columns: 1fr !important; gap: 40px !important; align-items: start !important; }
      .editorial-split .lede-col, .editorial-split img { justify-self: start !important; }
      .section-head { grid-template-columns: 1fr !important; gap: 28px !important; margin-bottom: 56px !important; align-items: start !important; }
      .section-head .lede-col { justify-self: start !important; max-width: 100% !important; }
      .pillars { grid-template-columns: 1fr !important; }
      .pillar { border-left: none !important; border-top: 1px solid var(--parch-line); padding: 36px 0 !important; }
      .pillar:first-child { border-top: none; }
      .marginalia { grid-template-columns: 1fr !important; column-gap: 0 !important; row-gap: 6px !important; }
      .marginalia > div:nth-child(even) { padding-bottom: 14px; border-bottom: 1px dashed var(--parch-faint); margin-bottom: 6px; }
      .tournois-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
      .galerie-grid { grid-template-columns: repeat(6, 1fr) !important; grid-auto-rows: 140px !important; }
      .galerie-tile-l { grid-column: span 6 !important; grid-row: span 2 !important; }
      .galerie-tile-m { grid-column: span 3 !important; grid-row: span 2 !important; }
      .galerie-tile-s { grid-column: span 3 !important; grid-row: span 2 !important; }
      .contact-grid { grid-template-columns: 1fr !important; gap: 64px !important; }
      .contact-form-row { flex-direction: column; gap: 28px; }
      .contact-info-pair { grid-template-columns: 1fr !important; }
      .contact-info-row { grid-template-columns: 1fr !important; gap: 6px; }
      .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 40px !important; }
      .footer-grid > div:first-child { grid-column: 1 / -1; }
      /* Disciplines: horizontal scroll-snap row */
      .disc-strip { grid-template-columns: repeat(5, 78%) !important; height: 480px !important; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
      .disc-card { scroll-snap-align: start; }
      /* Salle table → cards */
      .salle-table-header { display: none !important; }
      .salle-table-row { grid-template-columns: 1fr !important; gap: 6px !important; padding: 22px 0 !important; }
      .salle-table-row > div:nth-child(6) { display: none !important; }
      .salle-table-row > div:nth-child(4) { order: 5; }
      .event-row { grid-template-columns: 1fr !important; gap: 16px !important; padding: 32px 0 !important; }
      .event-row > div:last-child { flex-direction: row !important; align-items: center !important; gap: 16px !important; }
    }

    /* ── Phone: 640px and below ── */
    @media (max-width: 640px) {
      .footer-grid { grid-template-columns: 1fr !important; }
      .footer-grid > div:first-child { grid-column: auto; }
      section h2.display { font-size: clamp(40px, 11vw, 64px) !important; }
      .galerie-grid { grid-auto-rows: 120px !important; }
      .identite-container { padding: 100px 22px !important; }
    }
    @media (max-width: 900px) {
      .identite-container { padding: 110px 22px !important; }
    }

    /* Subtle horizon ember glow at base of Identite — like the night above a forge city */
    .identite-horizon {
      position: absolute;
      left: 0; right: 0; bottom: 0;
      height: 90px;
      background: radial-gradient(60% 100% at 50% 100%, rgba(200,64,48,0.18), transparent 70%);
      pointer-events: none;
    }
  `}</style>
);

// ───────────────────────────────────────────────────────────────────
// FIRST STEPS — bande pratique juste après le hero
// Trois étapes simples : Contact → Première séance → Adhésion
// ───────────────────────────────────────────────────────────────────
const FirstSteps = () => (
  <section
    id="firststeps"
    aria-label="Comment essayer le club"
    style={{
      position: 'relative',
      padding: '72px 0 72px',
      background: 'var(--coal)',
      borderTop: '1px solid var(--parch-line)',
      borderBottom: '1px solid var(--parch-line)',
    }}
  >
    <div className="container">
      <div
        className="first-steps-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr 1fr 1fr 1fr',
          gap: 36,
          alignItems: 'start',
        }}
      >
        <Reveal>
          <div>
            <Eyebrow>Comment essayer</Eyebrow>
            <h3
              className="display"
              style={{
                margin: '14px 0 12px',
                fontSize: 'clamp(28px, 2.6vw, 38px)',
                lineHeight: 1.05,
                fontWeight: 400,
              }}
            >
              Trois étapes,
              {' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>
                pas plus.
              </em>
            </h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65, color: 'var(--parch-mute)', maxWidth: 340 }}>
              On vous attend, on vous prête le matériel, et vous décidez après si vous restez.
            </p>
          </div>
        </Reveal>

        {[
          {
            n: '01',
            title: 'Contactez le club',
            body: 'Un message, un mail ou un appel pour caler une première séance — on vous dit quand venir.',
            primary: { href: 'mailto:c.sillac@protonmail.com', label: 'Écrire un mail' },
            secondary: { href: 'tel:+33631585460', label: '06 31 58 54 60' },
          },
          {
            n: '02',
            title: 'Venez essayer',
            body: 'Tenue de sport, chaussures propres, bouteille d\'eau. On prête masque, gants et arme d\'entraînement.',
            primary: { href: '#salle', label: 'Voir les créneaux' },
            secondary: { href: '#disciplines', label: 'Les disciplines' },
          },
          {
            n: '03',
            title: 'Inscrivez-vous',
            body: 'Si ça vous plaît, adhésion 85 € pour la saison via HelloAsso. Rejoindre en cours d\'année est possible.',
            primary: {
              href: 'https://www.helloasso.com/associations/usam-amhe-clermont-ferrand/adhesions/inscription-usam-amhe-clermont-2025-2026',
              label: 'Adhérer en ligne',
              external: true,
            },
          },
        ].map((s, i) => (
          <Reveal key={s.n} delay={120 + i * 80}>
            <div className="first-step-card">
              <div className="first-step-num">
                <span>{s.n}</span>
                <span className="first-step-rule" aria-hidden="true" />
              </div>
              <div className="first-step-title">{s.title}</div>
              <p className="first-step-body">{s.body}</p>
              <div className="first-step-actions">
                <a
                  href={s.primary.href}
                  {...(s.primary.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="first-step-link first-step-link--primary"
                >
                  {s.primary.label}
                  <ArrowGlyph size={11} color="currentColor" />
                </a>
                {s.secondary && (
                  <a
                    href={s.secondary.href}
                    className="first-step-link first-step-link--mute"
                  >
                    {s.secondary.label}
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <style>{`
        .first-step-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 30px 28px 26px;
          background: linear-gradient(180deg, rgba(236,232,222,0.028), rgba(236,232,222,0.008));
          border: 1px solid var(--parch-line);
          border-radius: 2px;
          height: 100%;
          overflow: hidden;
          transition: border-color 260ms var(--ease), transform 260ms var(--ease), background 260ms var(--ease);
        }
        /* Liseré ember subtil en haut, animation au hover */
        .first-step-card::before {
          content: '';
          position: absolute;
          left: 0; right: 0; top: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0.25;
          transform: scaleX(0.4);
          transform-origin: left;
          transition: transform 420ms var(--ease), opacity 260ms var(--ease);
        }
        .first-step-card:hover {
          border-color: rgba(236,232,222,0.30);
          transform: translateY(-2px);
          background: linear-gradient(180deg, rgba(224,85,44,0.05), rgba(236,232,222,0.012));
        }
        .first-step-card:hover::before { transform: scaleX(1); opacity: 0.7; }

        .first-step-num {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          font-family: var(--eyebrow);
          font-size: 10.5px;
          letter-spacing: 0.30em;
          color: var(--accent);
          font-weight: 600;
        }
        .first-step-rule {
          display: inline-block;
          width: 28px;
          height: 1px;
          background: var(--accent);
          opacity: 0.6;
        }
        .first-step-title {
          font-family: var(--display);
          font-size: 28px;
          line-height: 1.12;
          color: var(--parch);
          font-weight: 500;
        }
        .first-step-body {
          margin: 0;
          font-size: 14px;
          line-height: 1.65;
          color: var(--parch-mute);
          flex: 1;
        }
        .first-step-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 8px;
        }
        .first-step-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--eyebrow);
          font-size: 10.5px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 500;
          min-height: 32px;
          transition: color 200ms var(--ease), gap 200ms var(--ease);
        }
        .first-step-link--primary { color: var(--parch); }
        .first-step-link--primary:hover { color: var(--accent); gap: 14px; }
        .first-step-link--mute {
          color: var(--parch-mute);
          font-variant-numeric: tabular-nums;
        }
        .first-step-link--mute:hover { color: var(--accent); }

        @media (max-width: 1100px) {
          .first-steps-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
        }
        @media (max-width: 640px) {
          .first-steps-grid { grid-template-columns: 1fr !important; }
          .first-step-card { padding: 26px 22px 22px; }
          .first-step-title { font-size: 24px; }
          .first-step-link { min-height: 44px; font-size: 11.5px; }
        }
      `}</style>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────
// MANIFESTO — treatise drawing right, large pull-quote left.
// Editorial spread feel, alludes to historical sources.
// ───────────────────────────────────────────────────────────────────
const Manifesto = () => (
  <section
    id="manifesto"
    data-screen-label="02 Manifeste"
    style={{
      position: 'relative',
      padding: '160px 0 180px',
      background: 'var(--ink)',
    }}
  >
    <div className="container">
      <Reveal>
        <SectionLabel number={1} name="Manifeste" />
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

          {/* Marginalia — disciplines pratiquées au club */}
          <Reveal delay={260}>
            <div className="marginalia">
              {[
                ['Mardi',  'Épée longue · rapière · messer · viking'],
                ['Jeudi',  'Épée longue · épée de côté'],
                ['Libre',  'Pratique sans encadrant le jeudi soir'],
                ['Saison', 'Tournois FFAMHE & rencontres interclubs'],
              ].map(([year, title]) => (
                <React.Fragment key={year}>
                  <div
                    style={{
                      fontFamily: 'var(--eyebrow)',
                      fontSize: 10.5,
                      letterSpacing: '0.28em',
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {year}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--display)',
                      fontStyle: 'italic',
                      fontSize: 19,
                      color: 'var(--parch)',
                      lineHeight: 1.3,
                    }}
                  >
                    {title}
                  </div>
                </React.Fragment>
              ))}
            </div>
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
                fontFamily: 'var(--display)',
                fontStyle: 'italic',
                fontSize: 14.5,
                lineHeight: 1.5,
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
    data-screen-label="03 Le Club"
    style={{
      position: 'relative',
      padding: '160px 0 180px',
      background: 'var(--coal)',
      borderTop: '1px solid var(--parch-line)',
    }}
  >
    <div className="container">
      <Reveal>
        <SectionLabel number={2} name="Le Club" />
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
// ENCADREMENT — qui vous accueille, ton humain, placeholders propres
// ───────────────────────────────────────────────────────────────────
const Encadrement = () => {
  const people = [
    {
      initials: 'GT',
      name: 'Gabriel Tardio',
      role: 'Encadrant',
      body: 'Gabriel mène les séances : drills techniques, lecture des traités, mise en assaut. Il prend le temps avec les débutants — comprendre le geste avant de l\'enchaîner.',
    },
    {
      initials: 'CS',
      name: 'Clémence Sillac',
      role: 'Présidente de section',
      body: 'Clémence gère la vie associative, les inscriptions et l\'accueil. C\'est la première personne à qui écrire si vous voulez venir essayer.',
      contact: [
        { l: 'mail', href: 'mailto:c.sillac@protonmail.com', v: 'c.sillac@protonmail.com' },
        { l: 'tél', href: 'tel:+33631585460', v: '06 31 58 54 60' },
      ],
    },
  ];

  return (
    <section
      id="encadrement"
      data-screen-label="04 Encadrement"
      style={{
        position: 'relative',
        padding: '160px 0 180px',
        background: 'var(--ink)',
        borderTop: '1px solid var(--parch-line)',
      }}
    >
      <div className="container">
        <Reveal>
          <SectionLabel number={3} name="Encadrement" />
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
              On vous attend,
              <br />
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>
                on vous prête le masque.
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
              Une petite équipe accueille débutants et confirmés. Pas de
              hiérarchie martiale : on s'entraide, on corrige, on prend
              le temps de bien faire les choses.
            </p>
          </Reveal>
        </div>

        <div className="staff-grid">
          {people.map((p, i) => (
            <Reveal key={p.name} delay={120 + i * 100}>
              <article className="staff-card">
                <div className="staff-portrait" aria-hidden="true">
                  <span className="staff-portrait-mono">{p.initials}</span>
                  <span className="staff-portrait-grain" />
                </div>
                <div className="staff-info">
                  <div className="staff-role">{p.role}</div>
                  <h3 className="staff-name">{p.name}</h3>
                  <p className="staff-body">{p.body}</p>
                  {p.contact && (
                    <ul className="staff-contact">
                      {p.contact.map((c) => (
                        <li key={c.l}>
                          <span className="staff-contact-l">{c.l}</span>
                          <a href={c.href} className="staff-contact-v">{c.v}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={320}>
          <p className="staff-note">
            Photos à venir — le club vit en salle, pas devant un objectif.
          </p>
        </Reveal>
      </div>

      <style>{`
        .staff-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }
        .staff-card {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 32px;
          align-items: start;
          padding: 28px;
          background: linear-gradient(180deg, rgba(236,232,222,0.025), rgba(236,232,222,0.008));
          border: 1px solid var(--parch-line);
          border-radius: 2px;
          transition: border-color 240ms var(--ease), background 240ms var(--ease);
        }
        .staff-card:hover {
          border-color: rgba(236,232,222,0.22);
          background: linear-gradient(180deg, rgba(224,85,44,0.035), rgba(236,232,222,0.01));
        }
        .staff-portrait {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          background:
            radial-gradient(80% 80% at 30% 25%, rgba(236,232,222,0.06), transparent 60%),
            radial-gradient(70% 70% at 70% 80%, rgba(224,85,44,0.12), transparent 60%),
            linear-gradient(160deg, #1d1a16 0%, #14110e 60%, #0e0c0a 100%);
          border: 1px solid var(--parch-line);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .staff-portrait-mono {
          position: relative;
          z-index: 2;
          font-family: var(--display);
          font-style: italic;
          font-weight: 400;
          font-size: 64px;
          line-height: 1;
          color: var(--parch);
          letter-spacing: -0.02em;
          background: linear-gradient(180deg, #ece8de 0%, #c7b893 55%, #8a6a4e 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          filter: drop-shadow(0 1px 0 rgba(0,0,0,0.45));
        }
        .staff-portrait-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.55  0 0 0 0 0.5  0 0 0 0 0.4  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23g)'/></svg>");
          opacity: 0.18;
          mix-blend-mode: overlay;
          pointer-events: none;
        }
        .staff-info { display: flex; flex-direction: column; gap: 12px; }
        .staff-role {
          font-family: var(--eyebrow);
          font-size: 10.5px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 600;
        }
        .staff-name {
          margin: 0;
          font-family: var(--display);
          font-size: 30px;
          line-height: 1.1;
          color: var(--parch);
          font-weight: 500;
        }
        .staff-body {
          margin: 0;
          font-size: 14.5px;
          line-height: 1.65;
          color: var(--parch-mute);
        }
        .staff-contact {
          margin: 6px 0 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .staff-contact li {
          display: inline-flex;
          align-items: baseline;
          gap: 14px;
        }
        .staff-contact-l {
          font-family: var(--eyebrow);
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--parch-mute);
          min-width: 36px;
          font-weight: 500;
        }
        .staff-contact-v {
          font-family: var(--display);
          font-size: 17px;
          color: var(--parch);
          border-bottom: 1px solid transparent;
          transition: color 200ms var(--ease), border-color 200ms var(--ease);
        }
        .staff-contact-v:hover {
          color: var(--accent);
          border-bottom-color: var(--accent);
        }
        .staff-note {
          margin: 56px 0 0;
          font-family: var(--display);
          font-style: italic;
          font-size: 15px;
          color: var(--parch-mute);
          text-align: center;
        }

        @media (max-width: 1100px) {
          .staff-grid { gap: 24px; }
          .staff-card { grid-template-columns: 140px 1fr; gap: 24px; padding: 24px; }
          .staff-portrait-mono { font-size: 52px; }
          .staff-name { font-size: 26px; }
        }
        @media (max-width: 900px) {
          .staff-grid { grid-template-columns: 1fr !important; }
          .staff-card { grid-template-columns: 120px 1fr; gap: 20px; padding: 22px; }
          .staff-portrait-mono { font-size: 44px; }
        }
        @media (max-width: 480px) {
          .staff-card { grid-template-columns: 1fr; }
          .staff-portrait { aspect-ratio: 1.6 / 1; }
          .staff-portrait-mono { font-size: 48px; }
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
      img: 'assets/duel-reflection.webp',
      focal: '60% 50%',
    },
    {
      id: 'rapiere',
      n: '02',
      name: 'Rapière',
      sub: 'Escrime de la Renaissance',
      era: 'Renaissance',
      desc: 'Arme plus tardive, liée à l\'escrime de la Renaissance et de l\'époque moderne. Jeu de pointe fin, distance, et déplacement précis.',
      img: 'assets/duel-blue.webp',
      focal: '65% 50%',
    },
    {
      id: 'messer',
      n: '03',
      name: 'Messer',
      sub: 'Grand couteau de combat',
      era: 'Médiévale',
      desc: 'Arme médiévale germanique, proche d\'un grand couteau de combat à un tranchant. Système populaire mêlant escrime et lutte rapprochée.',
      img: 'assets/kit-still-life.webp',
      focal: '60% 50%',
    },
    {
      id: 'cote',
      n: '04',
      name: 'Épée de côté',
      sub: 'Du Moyen Âge à la Renaissance',
      era: 'Transition',
      desc: 'Arme de transition entre le Moyen Âge tardif et la Renaissance. À une main, polyvalente, elle annonce les escrimes de l\'âge moderne.',
      img: 'assets/sparring.jpg',
      focal: '50% 30%',
    },
    {
      id: 'viking',
      n: '05',
      name: 'Combat viking',
      sub: 'Bouclier & arme courte',
      era: 'Haut Moyen Âge',
      desc: 'Pratique inspirée des traditions martiales anciennes, avec bouclier et armes adaptées selon les sources. Jeu de pression, contact, contrôle.',
      img: null,
      focal: '50% 40%',
      placeholder: true,
    },
  ];
  return (
    <section
      id="disciplines"
      data-screen-label="05 Disciplines"
      style={{
        position: 'relative',
        padding: '160px 0 0',
        background: 'var(--ink)',
        borderTop: '1px solid var(--parch-line)',
      }}
    >
      <div className="container" style={{ marginBottom: 64 }}>
        <Reveal>
          <SectionLabel number={4} name="Les disciplines" />
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
              {d.img ? (
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
              ) : (
                <div
                  aria-hidden="true"
                  className="disc-placeholder"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'radial-gradient(80% 60% at 30% 25%, rgba(236,232,222,0.06), transparent 65%),' +
                      'radial-gradient(80% 70% at 75% 85%, rgba(224,85,44,0.16), transparent 60%),' +
                      'linear-gradient(160deg, #1f1a16 0%, #14110e 60%, #0c0a08 100%)',
                  }}
                />
              )}
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
                      fontFamily: 'var(--display)',
                      fontStyle: 'italic',
                      fontSize: 18,
                      color: 'var(--parch-mute)',
                      marginBottom: 22,
                    }}
                  >
                    {d.sub}
                  </div>
                  <div
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
    { day: 'Mar', time: '18h00 — 20h00', disc: 'Épée longue · rapière · messer · viking', lvl: 'Tous niveaux',   loc: 'Gymnase Robert Pras' },
    { day: 'Jeu', time: '18h00 — 20h00', disc: 'Pratique libre',                          lvl: 'Sans encadrant', loc: 'Gymnase Robert Pras' },
    { day: 'Jeu', time: '20h00 — 22h00', disc: 'Épée longue · épée de côté',              lvl: 'Tous niveaux',   loc: 'Gymnase Robert Pras' },
  ];

  return (
    <section
      id="salle"
      data-screen-label="06 Salle d'armes"
      style={{
        position: 'relative',
        padding: '160px 0 180px',
        background: 'var(--coal)',
        borderTop: '1px solid var(--parch-line)',
      }}
    >
      <div className="container">
        <Reveal>
          <SectionLabel number={5} name="Salle d'armes" />
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
              {['Jour', 'Horaire', 'Discipline', 'Niveau', 'Lieu', ''].map((h, i) => (
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
                fontFamily: 'var(--display)',
                fontStyle: 'italic',
                fontSize: 18,
                lineHeight: 1.5,
                color: 'var(--parch-mute)',
                maxWidth: 580,
              }}
            >
              Gymnase Robert Pras — 3 rue Jean Monnet, 63100
              Clermont-Ferrand. Vérifiez les horaires avant de venir
              pour une première séance.
            </p>
            <a
              href="#contact"
              className="btn btn--ghost"
              style={{ flexShrink: 0 }}
            >
              Nous contacter avant de venir
              <ArrowGlyph size={12} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const SlotRow = ({ slot }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      className="salle-table-row"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'rgba(236, 227, 207, 0.025)' : 'transparent',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--display)',
          fontStyle: 'italic',
          fontSize: 22,
          color: 'var(--accent)',
          lineHeight: 1,
        }}
      >
        {slot.day}.
      </div>
      <div
        style={{
          fontFamily: 'var(--display)',
          fontSize: 22,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          color: 'var(--parch)',
        }}
      >
        {slot.time}
      </div>
      <div
        style={{
          fontFamily: 'var(--display)',
          fontSize: 22,
          lineHeight: 1,
          color: 'var(--parch)',
        }}
      >
        {slot.disc}
      </div>
      <div
        style={{
          fontFamily: 'var(--eyebrow)',
          fontSize: 10.5,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--parch-mute)',
        }}
      >
        {slot.lvl}
      </div>
      <div
        style={{
          fontFamily: 'var(--body)',
          fontSize: 13.5,
          color: 'var(--parch-soft)',
        }}
      >
        {slot.loc}
      </div>
      <div
        style={{
          textAlign: 'right',
          color: hover ? 'var(--accent)' : 'var(--parch-mute)',
          transition: 'color 200ms, transform 200ms',
          transform: hover ? 'translateX(4px)' : 'translateX(0)',
        }}
      >
        <ArrowGlyph size={14} color="currentColor" />
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────
// TOURNOIS — events with podium photo and editorial list
// ───────────────────────────────────────────────────────────────────
const Tournois = () => {
  const events = [
    {
      date: 'Annuel', year: 'FFAMHE',
      title: 'La Bravade',
      type: 'Tournoi AMHE',
      city: 'Événement référencé',
      desc: 'Rendez-vous récurrent du circuit AMHE auquel le club participe régulièrement. Épreuves variées selon les éditions.',
      tag: 'Tournoi',
    },
    {
      date: 'Saison', year: 'FFAMHE',
      title: 'Tournois fédéraux',
      type: 'Circuit FFAMHE',
      city: 'France',
      desc: 'Compétitions officielles ouvertes aux licenciés : épée longue (open, débutant, féminin), épée seule, épée de côté, rapière.',
      tag: 'Fédéral',
    },
    {
      date: 'Toute l\'année', year: 'AMHE',
      title: 'Stages & rencontres interclubs',
      type: 'Inter-clubs · stages',
      city: 'France',
      desc: 'Échanges réguliers avec d\'autres clubs AMHE, stages techniques et rencontres conviviales — la compétition n\'est pas obligatoire.',
      tag: 'Interclubs',
    },
  ];

  return (
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

        <div className="section-head" style={{ marginBottom: 100 }}>
          <Reveal>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(48px, 5.2vw, 84px)',
                lineHeight: 0.96,
                margin: 0,
              }}
            >
              Saison
              <br />
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
          </Reveal>
          <Reveal delay={120}>
            <p
              className="lede-col"
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.7,
                color: 'var(--parch-mute)',
                maxWidth: 520,
              }}
            >
              Le club est présent sur le circuit FFAMHE et référencé sur
              HEMA Ratings. La compétition reste un choix : on peut
              pratiquer en loisir ou viser les tournois, à son rythme.
            </p>
          </Reveal>
        </div>

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
                    fontSize: 28,
                    lineHeight: 1.05,
                  }}
                >
                  Plusieurs membres du club engagés en compétition,
                  référencés sur HEMA Ratings.
                </div>
              </div>
            </Photo>
          </Reveal>

          <Reveal delay={150}>
            <div>
              {events.map((e, i) => (
                <EventRow key={i} event={e} index={i} last={i === events.length - 1} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const EventRow = ({ event, index, last }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      className="event-row"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderTop: index === 0 ? '1px solid var(--parch-line)' : 'none',
      }}
    >
      <div>
        <div
          style={{
            fontFamily: 'var(--eyebrow)',
            fontSize: 10,
            letterSpacing: '0.32em',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          {event.year}
        </div>
        <div
          className="display"
          style={{
            fontSize: 30,
            lineHeight: 1.05,
            fontStyle: 'italic',
          }}
        >
          {event.date}
        </div>
      </div>
      <div>
        <div
          style={{
            fontFamily: 'var(--eyebrow)',
            fontSize: 10,
            letterSpacing: '0.28em',
            color: 'var(--parch-mute)',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          {event.type} · {event.city}
        </div>
        <div
          className="display"
          style={{
            fontSize: 38,
            lineHeight: 1.05,
            marginBottom: 14,
          }}
        >
          {event.title}
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 14.5,
            lineHeight: 1.65,
            color: 'var(--parch-mute)',
            maxWidth: 560,
          }}
        >
          {event.desc}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 24,
          paddingTop: 6,
        }}
      >
        <span
          style={{
            padding: '8px 14px',
            border: '1px solid var(--parch-line)',
            fontFamily: 'var(--eyebrow)',
            fontSize: 9.5,
            letterSpacing: '0.28em',
            color: 'var(--parch-soft)',
            textTransform: 'uppercase',
          }}
        >
          {event.tag}
        </span>
        <span
          style={{
            color: hover ? 'var(--accent)' : 'var(--parch-mute)',
            transition: 'color 220ms, transform 220ms',
            transform: hover ? 'translateX(6px)' : 'translateX(0)',
          }}
        >
          <ArrowGlyph size={18} color="currentColor" />
        </span>
      </div>
    </div>
  );
};

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
            className="btn btn--ghost lede-col"
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
          { src: 'assets/sparring.jpg',         alt: 'Assaut en salle, longue épée',                focal: '50% 30%', cap: 'À l\'assaut', cls: 'galerie-tile-s',       col: 'span 4', row: 'span 3', d: 200 },
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
// IDENTITÉ — wide Clermont-Ferrand cinematic strip
// ───────────────────────────────────────────────────────────────────
const Identite = () => (
  <section
    id="identite"
    data-screen-label="09 Clermont"
    style={{
      position: 'relative',
      padding: 0,
      background: 'var(--ink)',
      borderTop: '1px solid var(--parch-line)',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        position: 'relative',
        minHeight: 640,
        background:
          'radial-gradient(ellipse at 30% 50%, rgba(200,64,48,0.18), transparent 55%), linear-gradient(180deg, var(--ink), #15110e)',
      }}
    >
      {/* Mountain silhouette */}
      <svg
        viewBox="0 0 1600 400"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '55%',
          opacity: 0.55,
        }}
      >
        <defs>
          <linearGradient id="puyGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1a1411" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#08070a" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d="M0 400 L0 280 L160 220 L300 240 L420 180 L520 200 L640 130 L780 170 L900 200 L1040 150 L1180 220 L1320 200 L1480 240 L1600 220 L1600 400 Z"
          fill="url(#puyGrad)"
        />
        <path
          d="M0 400 L0 320 L120 290 L260 310 L380 280 L520 300 L640 250 L780 280 L920 270 L1080 310 L1220 290 L1380 310 L1500 300 L1600 310 L1600 400 Z"
          fill="#08070a"
          opacity="0.85"
        />
      </svg>
      <span aria-hidden="true" className="identite-horizon" />

      <div className="container identite-container" style={{ position: 'relative', padding: '140px 56px' }}>
        <Reveal>
          <SectionLabel number={8} name="Clermont-Ferrand" />
        </Reveal>
        <div className="editorial-split split-14-1-end">
          <Reveal>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(56px, 6vw, 108px)',
                lineHeight: 0.96,
                margin: 0,
              }}
            >
              Une ville de pierre noire,
              <br />
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'var(--accent)',
                }}
              >
                au pied des volcans.
              </em>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 16.5,
                  lineHeight: 1.7,
                  color: 'var(--parch-soft)',
                  maxWidth: 480,
                  marginBottom: 32,
                }}
              >
                La cathédrale est noire, les murs taillés dans la pierre
                de Volvic, le Puy de Dôme veille à l'horizon. C'est une
                ville qui sait ce que le feu peut faire à la pierre, et ce
                que l'acier doit à la patience.
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--display)',
                  fontStyle: 'italic',
                  fontSize: 22,
                  lineHeight: 1.4,
                  color: 'var(--parch)',
                }}
              >
                On s'y retrouve assez bien.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

Object.assign(window, {
  SectionsStyles,
  FirstSteps,
  Manifesto,
  Club,
  Encadrement,
  Disciplines,
  Salle,
  Tournois,
  Galerie,
  Identite,
});
