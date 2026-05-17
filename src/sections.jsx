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

    /* Disciplines card strip — wrapper porte le swipe-hint mobile */
    .disc-strip-wrap { position: relative; }
    .disc-swipe-hint {
      display: none;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 12px 22px 6px;
      font-family: var(--eyebrow);
      font-size: 10.5px;
      letter-spacing: 0.26em;
      text-transform: uppercase;
      color: var(--parch-mute);
      font-weight: 500;
      animation: disc-swipe-nudge 2.8s var(--ease) infinite;
    }
    .disc-swipe-hint-line {
      width: 22px;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--accent));
    }
    @keyframes disc-swipe-nudge {
      0%, 70%, 100% { transform: translateX(0); opacity: 0.85; }
      35% { transform: translateX(8px); opacity: 1; }
    }
    @media (prefers-reduced-motion: reduce) {
      .disc-swipe-hint { animation: none !important; }
    }
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
    .section-head { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: end; margin-bottom: 64px; }
    .section-head.short-gap { margin-bottom: 48px; }
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
      section { padding: 68px 0 76px !important; }
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
      /* Disciplines: horizontal scroll-snap row + swipe hint visible */
      .disc-strip { grid-template-columns: repeat(5, 78%) !important; height: 480px !important; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
      .disc-card { scroll-snap-align: start; }
      .disc-swipe-hint { display: inline-flex !important; }
      /* Salle table → cards */
      .salle-table-header { display: none !important; }
      .salle-table-row { grid-template-columns: 1fr !important; gap: 6px !important; padding: 22px 0 !important; }
    }

    /* ── Phone: 640px and below ── */
    @media (max-width: 640px) {
      section { padding: 56px 0 62px !important; }
      .section-head { margin-bottom: 36px !important; gap: 18px !important; }
      .footer-grid { grid-template-columns: 1fr !important; padding-top: 40px; margin-bottom: 40px; gap: 32px !important; }
      .footer-grid > div:first-child { grid-column: auto; }
      section h2.display { font-size: clamp(40px, 11vw, 64px) !important; }
      .galerie-grid { grid-auto-rows: 120px !important; gap: 8px !important; }
      .pillars { grid-template-columns: 1fr !important; }
      .pillar { padding: 28px 0 !important; }
    }
  `}</style>
);


// ───────────────────────────────────────────────────────────────────
// PRE-HEADER BANNER — bandeau d'annonce ponctuel au-dessus de la nav.
// Style éditorial : fond ink, eyebrow ember "À noter", filet ember en bas.
// Toggle depuis l'admin (actualites.banner.enabled).
// ───────────────────────────────────────────────────────────────────
const PreHeaderBanner = () => {
  const c = window.useContent('actualites') || {};
  const b = c.banner || {};
  const enabled = b.enabled && b.text;

  // Pousse la nav vers le bas pendant que le bandeau est affiché.
  React.useEffect(() => {
    document.documentElement.style.setProperty('--prebanner-h', enabled ? '38px' : '0px');
    return () => document.documentElement.style.setProperty('--prebanner-h', '0px');
  }, [enabled]);

  if (!enabled) return null;

  const isLink = !!b.href;
  const Tag = isLink ? 'a' : 'div';
  const linkProps = isLink ? {
    href: b.href,
    target: /^https?:/.test(b.href) ? '_blank' : undefined,
    rel: /^https?:/.test(b.href) ? 'noopener noreferrer' : undefined,
  } : {};

  return (
    <Tag className={`prebanner ${isLink ? 'prebanner-link' : ''}`} {...linkProps}>
      <span className="prebanner-eyebrow">{b.eyebrow || 'À noter'}</span>
      <span className="prebanner-sep" aria-hidden="true" />
      <span className="prebanner-text">{b.text}</span>
      {isLink && <ArrowGlyph size={9} color="currentColor" />}
      <style>{`
        .prebanner {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 51;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 0 24px;
          background: var(--ink);
          border-bottom: 1px solid var(--accent);
          color: var(--parch);
          font-family: var(--body);
          font-size: 12.5px;
          line-height: 1.2;
          text-decoration: none;
          transition: background 200ms var(--ease);
        }
        .prebanner.prebanner-link { cursor: pointer; }
        .prebanner.prebanner-link:hover { background: #15110d; color: var(--parch); }
        .prebanner-eyebrow {
          font-family: var(--eyebrow);
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--accent);
          white-space: nowrap;
        }
        .prebanner-sep {
          width: 1px;
          height: 14px;
          background: var(--parch-line);
        }
        .prebanner-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 75vw;
          color: var(--parch-soft);
        }
        .prebanner-link:hover .prebanner-text { color: var(--parch); }
        @media (max-width: 640px) {
          .prebanner { gap: 10px; padding: 0 14px; font-size: 11.5px; }
          .prebanner-eyebrow { letter-spacing: 0.24em; }
          .prebanner-text { max-width: 60vw; }
        }
      `}</style>
    </Tag>
  );
};


// ───────────────────────────────────────────────────────────────────
// ACTUALITÉS — section éditoriale juste après le hero.
// SectionLabel numéroté + titre display + 1-N cartes en grille.
// Click sur une carte → ouvre un modal détaillé (body HTML + galerie + liens).
// ───────────────────────────────────────────────────────────────────
const Actualites = () => {
  const c = window.useContent('actualites') || {};
  const items = (c.items || []).filter((it) => it && (it.title || it.desc));
  const [openIdx, setOpenIdx] = React.useState(null);

  if (items.length === 0) return null;

  const layoutClass =
    items.length === 1 ? 'actu-1' :
    items.length === 2 ? 'actu-2' :
    'actu-3';

  const openItem = openIdx != null ? items[openIdx] : null;

  return (
    <section
      id="actualites"
      data-screen-label="00 Actualités"
      style={{
        position: 'relative',
        padding: '110px 0 120px',
        background: 'var(--ink)',
        borderTop: '1px solid var(--parch-line)',
      }}
    >
      <div className="container">
        <Reveal>
          <SectionLabel number={c.eyebrowNumber || 0} name={c.eyebrowLabel || 'Actualités'} />
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
              {c.titleLine1 || 'Ce qui'}
              <br />
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>
                {c.titleLine2 || 'se passe en ce moment.'}
              </em>
            </h2>
          </Reveal>
          {c.lede && (
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
                {c.lede}
              </p>
            </Reveal>
          )}
        </div>

        <div className={`actu-grid ${layoutClass}`}>
          {items.map((it, i) => (
            <Reveal key={it.id || i} delay={120 + i * 80} style={{ height: '100%' }}>
              <ActuCard
                item={it}
                variant={items.length === 1 ? 'feature' : 'compact'}
                onOpen={() => setOpenIdx(i)}
              />
            </Reveal>
          ))}
        </div>
      </div>

      {openItem && (
        <ActuModal item={openItem} onClose={() => setOpenIdx(null)} />
      )}

      <style>{`
        .actu-grid {
          display: grid;
          gap: 28px;
        }
        .actu-grid.actu-1 { grid-template-columns: 1fr; }
        .actu-grid.actu-2 { grid-template-columns: 1fr 1fr; }
        .actu-grid.actu-3 { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 1000px) {
          .actu-grid.actu-3 { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 700px) {
          .actu-grid.actu-2, .actu-grid.actu-3 { grid-template-columns: 1fr; gap: 20px; }
        }

        /* ─── Carte compacte ─── */
        .actu-card {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
          background: transparent;
          border: 1px solid var(--parch-line);
          cursor: pointer;
          text-align: left;
          padding: 0;
          color: inherit;
          font: inherit;
          transition: border-color 280ms var(--ease), transform 280ms var(--ease), background 280ms var(--ease);
          isolation: isolate;
        }
        .actu-card::after {
          content: '';
          position: absolute;
          left: -1px; right: -1px; top: -1px;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent) 30%, var(--ember-hot) 70%, transparent);
          opacity: 0;
          transition: opacity 280ms var(--ease);
          pointer-events: none;
          z-index: 3;
        }
        .actu-card:hover, .actu-card:focus-visible {
          border-color: rgba(224,85,44,0.55);
          background: rgba(224,85,44,0.025);
          transform: translateY(-3px);
          outline: none;
        }
        .actu-card:hover::after, .actu-card:focus-visible::after { opacity: 1; }

        .actu-card-photo {
          position: relative;
          overflow: hidden;
          background: var(--coal);
          aspect-ratio: 16 / 10;
        }
        .actu-card-photo img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.88) contrast(1.04) brightness(0.92);
          transition: transform 700ms var(--ease), filter 320ms var(--ease);
        }
        .actu-card:hover .actu-card-photo img,
        .actu-card:focus-visible .actu-card-photo img {
          transform: scale(1.04);
          filter: saturate(1) contrast(1.06) brightness(1);
        }
        .actu-card-photo::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 55%, rgba(8,7,10,0.55) 100%);
          pointer-events: none;
        }
        .actu-card-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 26px 28px 28px;
          flex: 1;
        }
        .actu-card-eyebrow {
          font-family: var(--eyebrow);
          font-size: 10.5px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 600;
        }
        .actu-card-title {
          margin: 0;
          font-family: var(--display);
          font-size: clamp(22px, 2.2vw, 30px);
          line-height: 1.12;
          font-weight: 500;
          color: var(--parch);
          letter-spacing: -0.005em;
        }
        .actu-card-desc {
          margin: 0;
          font-family: var(--body);
          font-size: 14.5px;
          line-height: 1.6;
          color: var(--parch-soft);
          flex: 1;
        }
        .actu-card-more {
          margin-top: 6px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--eyebrow);
          font-size: 10.5px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--accent);
          padding-bottom: 3px;
          border-bottom: 1px solid transparent;
          transition: border-color 200ms var(--ease);
          align-self: flex-start;
        }
        .actu-card:hover .actu-card-more,
        .actu-card:focus-visible .actu-card-more {
          border-bottom-color: var(--accent);
        }

        /* ─── Carte feature (quand 1 seul item) ─── */
        .actu-card.actu-card-feature {
          flex-direction: row;
          min-height: 360px;
        }
        .actu-card.actu-card-feature .actu-card-photo {
          flex: 0 0 56%;
          aspect-ratio: auto;
        }
        .actu-card.actu-card-feature .actu-card-body {
          justify-content: center;
          padding: 56px 56px;
          gap: 18px;
        }
        .actu-card.actu-card-feature .actu-card-title {
          font-size: clamp(28px, 3.4vw, 46px);
        }
        .actu-card.actu-card-feature .actu-card-desc {
          font-size: 16px;
          flex: 0 1 auto;
          max-width: 56ch;
        }
        @media (max-width: 800px) {
          .actu-card.actu-card-feature {
            flex-direction: column;
            min-height: 0;
          }
          .actu-card.actu-card-feature .actu-card-photo {
            flex: 1 1 auto;
            aspect-ratio: 16/10;
          }
          .actu-card.actu-card-feature .actu-card-body {
            padding: 28px 28px 30px;
          }
        }
      `}</style>
    </section>
  );
};

const ActuCard = ({ item, variant, onOpen }) => {
  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen();
    }
  };
  return (
    <button
      type="button"
      onClick={onOpen}
      onKeyDown={onKeyDown}
      className={`actu-card${variant === 'feature' ? ' actu-card-feature' : ''}`}
      aria-label={`Ouvrir l'actualité : ${item.title || ''}`}
    >
      {item.image && (
        <div className="actu-card-photo">
          <img src={item.image} alt={item.imageAlt || item.title || ''} loading="lazy" decoding="async" />
        </div>
      )}
      <div className="actu-card-body">
        {item.eyebrow && <div className="actu-card-eyebrow">{item.eyebrow}</div>}
        {item.title && <h3 className="actu-card-title">{item.title}</h3>}
        {item.desc && <p className="actu-card-desc">{item.desc}</p>}
        <span className="actu-card-more">
          Lire la suite
          <ArrowGlyph size={10} color="currentColor" />
        </span>
      </div>
    </button>
  );
};


// ───────────────────────────────────────────────────────────────────
// MODAL d'actualité — overlay détaillé au clic sur une carte.
// Style aligné sur le legal-modal existant (même classes réutilisées
// quand possible) pour rester cohérent avec la DA.
// ───────────────────────────────────────────────────────────────────
const ActuModal = ({ item, onClose }) => {
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const gallery = Array.isArray(item.gallery) ? item.gallery.filter((g) => g && g.src) : [];
  const links = Array.isArray(item.links) ? item.links.filter((l) => l && l.href) : [];

  return (
    <div
      className="actu-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="actu-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="actu-modal-panel" role="document">
        {item.image && (
          <div className="actu-modal-hero">
            <img src={item.image} alt={item.imageAlt || item.title || ''} />
            <button
              type="button"
              onClick={onClose}
              className="actu-modal-close"
              aria-label="Fermer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
                <path d="M6 6L18 18M18 6L6 18" />
              </svg>
            </button>
          </div>
        )}
        {!item.image && (
          <button
            type="button"
            onClick={onClose}
            className="actu-modal-close actu-modal-close-floating"
            aria-label="Fermer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
              <path d="M6 6L18 18M18 6L6 18" />
            </svg>
          </button>
        )}

        <div className="actu-modal-body">
          {item.eyebrow && <div className="actu-modal-eyebrow">{item.eyebrow}</div>}
          {item.title && (
            <h2 id="actu-modal-title" className="actu-modal-title">{item.title}</h2>
          )}
          {item.desc && <p className="actu-modal-lede">{item.desc}</p>}
          {item.bodyHtml && (
            <div className="actu-modal-content" dangerouslySetInnerHTML={{ __html: item.bodyHtml }} />
          )}

          {gallery.length > 0 && (
            <div className="actu-modal-gallery">
              {gallery.map((g, i) => (
                <figure key={i}>
                  <img src={g.src} alt={g.alt || ''} loading="lazy" />
                  {g.caption && <figcaption>{g.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}

          {links.length > 0 && (
            <div className="actu-modal-links">
              {links.map((l, i) => (
                <a
                  key={i}
                  href={l.href}
                  target={/^https?:/.test(l.href) ? '_blank' : undefined}
                  rel={/^https?:/.test(l.href) ? 'noopener noreferrer' : undefined}
                  className={i === 0 ? 'btn' : 'btn btn--secondary'}
                >
                  {l.label || l.href}
                  <ArrowGlyph size={11} color="currentColor" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .actu-modal {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(8, 7, 10, 0.78);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 60px 24px;
          overflow-y: auto;
          animation: actu-modal-fade 220ms var(--ease);
        }
        @keyframes actu-modal-fade {
          from { opacity: 0; } to { opacity: 1; }
        }
        .actu-modal-panel {
          position: relative;
          width: 100%;
          max-width: 880px;
          background: var(--ink);
          border: 1px solid var(--parch-line);
          color: var(--parch);
          animation: actu-modal-rise 320ms var(--ease);
          box-shadow: 0 30px 60px -20px rgba(0,0,0,0.6);
        }
        @keyframes actu-modal-rise {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .actu-modal-hero {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 7;
          overflow: hidden;
          background: var(--coal);
        }
        .actu-modal-hero img {
          width: 100%; height: 100%;
          object-fit: cover;
          filter: saturate(0.92) contrast(1.04);
        }
        .actu-modal-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 55%, rgba(8,7,10,0.55) 100%);
          pointer-events: none;
        }

        .actu-modal-close {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(10,9,8,0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(236,232,222,0.18);
          border-radius: 999px;
          color: var(--parch);
          cursor: pointer;
          z-index: 4;
          transition: background 200ms var(--ease), border-color 200ms var(--ease);
        }
        .actu-modal-close:hover { background: rgba(10,9,8,0.9); border-color: var(--accent); color: var(--accent); }
        .actu-modal-close-floating {
          position: absolute;
          top: 14px;
          right: 14px;
        }

        .actu-modal-body {
          padding: 48px clamp(28px, 5vw, 60px) 56px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .actu-modal-eyebrow {
          font-family: var(--eyebrow);
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 600;
        }
        .actu-modal-title {
          margin: 0;
          font-family: var(--display);
          font-size: clamp(30px, 4vw, 52px);
          line-height: 1.04;
          font-weight: 500;
          letter-spacing: -0.012em;
          color: var(--parch);
        }
        .actu-modal-lede {
          margin: 0;
          font-family: var(--body);
          font-size: 17px;
          line-height: 1.6;
          color: var(--parch-soft);
          max-width: 60ch;
        }
        .actu-modal-content {
          margin-top: 6px;
          font-family: var(--body);
          font-size: 15.5px;
          line-height: 1.75;
          color: var(--parch-soft);
        }
        .actu-modal-content p { margin: 0 0 14px; }
        .actu-modal-content p:last-child { margin-bottom: 0; }
        .actu-modal-content strong { color: var(--parch); font-weight: 500; }
        .actu-modal-content em { color: var(--accent); font-style: italic; }
        .actu-modal-content a { color: var(--accent); border-bottom: 1px solid currentColor; }
        .actu-modal-content ul, .actu-modal-content ol { margin: 0 0 14px; padding-left: 22px; }

        .actu-modal-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 10px;
          margin-top: 8px;
        }
        .actu-modal-gallery figure { margin: 0; }
        .actu-modal-gallery img {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          background: var(--coal);
          filter: saturate(0.88) contrast(1.04) brightness(0.92);
          transition: filter 300ms var(--ease);
        }
        .actu-modal-gallery img:hover { filter: saturate(1) contrast(1.06) brightness(1); }
        .actu-modal-gallery figcaption {
          margin-top: 6px;
          font-family: var(--body);
          font-size: 12.5px;
          color: var(--parch-mute);
          font-style: italic;
        }

        .actu-modal-links {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
          padding-top: 18px;
          border-top: 1px solid var(--parch-line);
        }
      `}</style>
    </div>
  );
};


// ───────────────────────────────────────────────────────────────────
// MANIFESTO — treatise drawing right, large pull-quote left.
// Editorial spread feel, alludes to historical sources.
// ───────────────────────────────────────────────────────────────────
const Manifesto = () => {
  const c = window.useContent('rigueur') || {};
  return (
  <section
    id="rigueur"
    data-screen-label="05 La rigueur"
    style={{
      position: 'relative',
      padding: '120px 0 130px',
      background: 'var(--ink)',
    }}
  >
    <div className="container">
      <Reveal>
        <SectionLabel number={c.eyebrowNumber || 4} name={c.eyebrowLabel || ''} />
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
              {c.titleLine1}
              <br />
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'var(--accent)',
                }}
              >
                {c.titleLine2}
              </em>
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <p
              className="lede"
              style={{
                maxWidth: 680,
                marginBottom: 40,
                color: 'var(--parch-soft)',
              }}
              dangerouslySetInnerHTML={{ __html: c.ledeHtml || '' }}
            />
          </Reveal>

          <Reveal delay={180}>
            <p
              style={{
                fontFamily: 'var(--body)',
                fontSize: 16,
                lineHeight: 1.7,
                maxWidth: 600,
                color: 'var(--parch-mute)',
                marginBottom: 56,
              }}
            >
              {c.body}
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
                src={c.image}
                alt={c.imageAlt}
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
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: 22,
                  height: 1,
                  background: 'var(--accent)',
                  verticalAlign: 'middle',
                  marginRight: 12,
                }}
              />
              {c.figureCaption}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </div>
  </section>
  );
};

// ───────────────────────────────────────────────────────────────────
// CLUB — full-width with split image and intro
// ───────────────────────────────────────────────────────────────────
const Club = () => {
  const c = window.useContent('club') || {};
  const pillars = c.pillars || [];
  return (
  <section
    id="club"
    data-screen-label="04 Le club"
    style={{
      position: 'relative',
      padding: '120px 0 130px',
      background: 'var(--coal)',
      borderTop: '1px solid var(--parch-line)',
    }}
  >
    <div className="container">
      <Reveal>
        <SectionLabel number={c.eyebrowNumber || 3} name={c.eyebrowLabel || ''} />
      </Reveal>

      <div className="editorial-split split-085-115 center" style={{ marginBottom: 72 }}>
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
              {c.titleLine1}
              <br />
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'var(--accent)',
                }}
              >
                {c.titleLine2}
              </em>
              <br />
              {c.titleLine3}
            </h2>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: 'var(--parch-mute)',
                maxWidth: 520,
                margin: 0,
              }}
            >
              {c.body}
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <Photo
            src={c.image}
            alt={c.imageAlt}
            focal={c.imageFocal}
            style={{ aspectRatio: '16/10', width: '100%' }}
          />
        </Reveal>
      </div>

      {/* Pillars */}
      <Reveal delay={150}>
        <div className="pillars">
          {pillars.map((p, i) => (
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
};

// ───────────────────────────────────────────────────────────────────
// ENCADREMENT — 3 instructeurs, hiérarchie visuelle scannable.
// Format : eyebrow (spécialité) · nom display · accroche punch · bio courte.
// Pas de portrait pseudo-photo (cf. retours UX : faisait "club qui n'assume pas").
// ───────────────────────────────────────────────────────────────────
const Encadrement = () => {
  const c = window.useContent('profs') || {};
  const people = c.items || [];

  return (
    <section
      id="profs"
      data-screen-label="03 Profs"
      style={{
        position: 'relative',
        padding: '110px 0 120px',
        background: 'var(--ink)',
        borderTop: '1px solid var(--parch-line)',
      }}
    >
      <div className="container">
        <Reveal>
          <SectionLabel number={c.eyebrowNumber || 2} name={c.eyebrowLabel || ''} />
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
              {c.titleLine1}
              <br />
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>
                {c.titleLine2}
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
              {c.lede}
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
                  <div className="prof-punch">
                    {p.featured && p.punch && p.punch.includes(' · ') ? (
                      <>
                        <span className="prof-punch-shine">
                          {p.punch.split(' · ')[0]}
                        </span>
                        {' · ' + p.punch.split(' · ').slice(1).join(' · ')}
                      </>
                    ) : p.punch}
                  </div>
                  <p className="prof-body">{p.body}</p>
                  {p.link && p.link.href && (
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
          /* Traitement N&B uniformisé sur les 3 portraits (les photos source ont
             des traitements différents — grain, couleur, neutre). Au hover, on
             réchauffe légèrement avec une touche de couleur. */
          filter: grayscale(1) contrast(1.06) brightness(0.92);
          transition: filter 500ms var(--ease), transform 700ms var(--ease);
        }
        .prof-card:hover .prof-photo img {
          filter: grayscale(0.55) saturate(0.85) contrast(1.06) brightness(0.96);
          transform: scale(1.03);
        }
        .prof-card--featured .prof-photo img {
          filter: grayscale(0.85) sepia(0.12) contrast(1.08) brightness(0.95);
        }
        .prof-card--featured:hover .prof-photo img {
          filter: grayscale(0.4) sepia(0.06) saturate(0.95) contrast(1.08) brightness(1);
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
        /* Effet "brillance dorée" sur la mention Top 1 % mondial */
        .prof-punch-shine {
          font-weight: 600;
          background-image: linear-gradient(
            100deg,
            #b8893f 0%,
            #b8893f 40%,
            #ffe7a0 47%,
            #fff5cc 50%,
            #ffe7a0 53%,
            #b8893f 60%,
            #b8893f 100%
          );
          background-size: 250% 100%;
          background-position: 100% 0;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: prof-punch-shine 4.4s var(--ease) infinite;
        }
        @keyframes prof-punch-shine {
          0%   { background-position: 100% 0; }
          45%  { background-position: 0% 0; }
          100% { background-position: 0% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .prof-punch-shine {
            animation: none !important;
            background-position: 100% 0 !important;
          }
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
          /* Pas de padding sur .prof-card en mobile : la photo doit aller
             jusqu'aux bords de la carte ; le texte a déjà son propre padding
             dans .prof-content (26px 26px 24px). */
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
  const content = window.useContent('disciplines') || {};
  const disciplines = content.items || [];
  const [active, setActive] = React.useState(() => disciplines[0]?.id);

  // Si le contenu change (fetch admin / seed → KV), recale l'état actif
  // sur le premier item si l'ancien ID n'existe plus.
  React.useEffect(() => {
    if (disciplines.length === 0) return;
    if (!disciplines.find((d) => d.id === active)) {
      setActive(disciplines[0].id);
    }
  }, [disciplines, active]);

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
          <SectionLabel number={content.eyebrowNumber || 1} name={content.eyebrowLabel || ''} />
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
              {content.titleLine1}
              <br />
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'var(--accent)',
                }}
              >
                {content.titleLine2}
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
              {content.lede}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Wrapper qui héberge la strip + l'indice "swipe" visible uniquement
          en mobile (où la strip devient un carousel à scroll horizontal). */}
      <div className="disc-strip-wrap">
        <div className="disc-swipe-hint" aria-hidden="true">
          <span className="disc-swipe-hint-line" />
          <span className="disc-swipe-hint-label">Glisser pour explorer</span>
          <ArrowGlyph size={12} color="currentColor" />
        </div>
      {/* Card row — full bleed. Grid template suit le nombre d'items (édition CMS). */}
      <div
        className="disc-strip"
        style={{
          gridTemplateColumns: `repeat(${Math.max(disciplines.length, 1)}, 1fr)`,
        }}
      >
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
                    ? 'linear-gradient(180deg, rgba(8,7,10,0.7) 0%, rgba(8,7,10,0.25) 22%, rgba(8,7,10,0.18) 45%, rgba(8,7,10,0.55) 72%, rgba(8,7,10,0.96) 100%)'
                    : 'linear-gradient(180deg, rgba(8,7,10,0.55) 0%, rgba(8,7,10,0.45) 35%, rgba(8,7,10,0.75) 65%, rgba(8,7,10,0.96) 100%)',
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
                    flexDirection: 'column',
                    gap: 6,
                    alignItems: 'flex-start',
                    textShadow: '0 1px 6px rgba(8,7,10,0.7)',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                      fontFamily: 'var(--eyebrow)',
                      fontSize: 10.5,
                      letterSpacing: '0.28em',
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 22,
                        height: 1,
                        background: 'var(--accent)',
                        display: 'inline-block',
                        boxShadow: '0 0 6px rgba(8,7,10,0.6)',
                      }}
                    />
                    {d.era}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--body)',
                      fontSize: 11,
                      letterSpacing: '0.18em',
                      color: 'var(--parch)',
                      textTransform: 'uppercase',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {d.eraDates}
                  </div>
                </div>

                <div style={{ textShadow: '0 2px 12px rgba(8,7,10,0.75)' }}>
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
                      color: 'var(--parch-soft)',
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
      </div>
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────
// NOUS REJOINDRE — créneaux + lieu + essai gratuit + adhésion en un bloc
// ───────────────────────────────────────────────────────────────────
const Salle = () => {
  const c = window.useContent('rejoindre') || {};
  const slots = c.slots || [];
  const headers = c.scheduleHeaders || ['Jour', 'Horaire', 'Discipline', 'Niveau'];
  const p1 = c.pillar1 || {};
  const p2 = c.pillar2 || {};
  const venue = c.venue || {};

  return (
    <section
      id="creneaux"
      data-screen-label="06 Nous rejoindre"
      style={{
        position: 'relative',
        padding: '120px 0 130px',
        background: 'var(--coal)',
        borderTop: '1px solid var(--parch-line)',
      }}
    >
      <div className="container">
        <Reveal>
          <SectionLabel number={c.eyebrowNumber || 5} name={c.eyebrowLabel || ''} />
        </Reveal>

        <Reveal>
          <h2
            className="display"
            style={{
              fontSize: 'clamp(44px, 4.8vw, 76px)',
              lineHeight: 1.02,
              margin: '0 0 56px',
              maxWidth: 980,
            }}
          >
            {c.titleLine1}
            <br />
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--accent)',
              }}
            >
              {c.titleLine2}
            </em>
          </h2>
        </Reveal>

        {/* ─── Lieu + contact direct. Réutilise le pattern .tournois-facts
              (label eyebrow ember + value, grid 200/1fr, bords parch-line)
              pour rester aligné graphiquement avec le reste du site.
              L'eyebrow "Pratique" délimite ce bloc des horaires en dessous. ─── */}
        {(venue.name || venue.contactEmail) && (
          <Reveal delay={60}>
            <div
              style={{
                fontFamily: 'var(--eyebrow)',
                fontSize: 10.5,
                letterSpacing: '0.32em',
                color: 'var(--accent)',
                fontWeight: 600,
                textTransform: 'uppercase',
                marginBottom: 18,
              }}
            >
              {c.venueEyebrow || 'Pratique'}
            </div>
            <ul className="tournois-facts">
              {venue.name && (
                <li>
                  <span className="tournois-fact-l">{venue.eyebrow || 'Lieu'}</span>
                  <span className="tournois-fact-v">
                    {venue.name}
                    {venue.address && (
                      <>
                        <br />
                        <span style={{ color: 'var(--parch-soft)' }}>{venue.address}</span>
                      </>
                    )}
                  </span>
                </li>
              )}
              {(venue.contactEmail || venue.contactPhone) && (
                <li>
                  <span className="tournois-fact-l">{venue.contactEyebrow || 'Contact'}</span>
                  <span className="tournois-fact-v" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {venue.contactEmail && (
                      <a
                        href={`mailto:${venue.contactEmail}`}
                        style={{ color: 'var(--parch)', textDecoration: 'none', borderBottom: '1px solid var(--parch-line)', alignSelf: 'flex-start' }}
                      >
                        {venue.contactEmail}
                      </a>
                    )}
                    {venue.contactPhone && (
                      <a
                        href={venue.contactPhoneHref || `tel:${venue.contactPhone.replace(/\s+/g, '')}`}
                        style={{ color: 'var(--parch-soft)', textDecoration: 'none' }}
                      >
                        {venue.contactPhone}
                      </a>
                    )}
                  </span>
                </li>
              )}
            </ul>
          </Reveal>
        )}

        {/* ─── Horaires — l'eyebrow "Créneaux" sert de marqueur visuel pour
              séparer ce bloc des infos Lieu/Contact au-dessus (qui partagent
              le même langage de lignes horizontales). ─── */}
        <Reveal delay={100}>
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                fontFamily: 'var(--eyebrow)',
                fontSize: 10.5,
                letterSpacing: '0.32em',
                color: 'var(--accent)',
                fontWeight: 600,
                textTransform: 'uppercase',
                marginBottom: 18,
              }}
            >
              {c.scheduleEyebrow || 'Créneaux hebdomadaires'}
            </div>
            <div
              style={{
                borderTop: '1px solid var(--parch-line)',
                borderBottom: '1px solid var(--parch-line)',
              }}
            >
              <div className="salle-table-header">
                {headers.map((h, i) => (
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
          </div>
        </Reveal>

        {/* ─── 2 piliers texte : viens essayer · continuer ensuite.
              Volontairement collé à la note débutant pour grouper visuellement
              "créneaux → recommandation → viens essayer". ─── */}
        <Reveal delay={140}>
          <div className="rejoindre-pillars">
            <article className="rejoindre-pillar">
              <div className="rejoindre-pillar-eyebrow">{p1.eyebrow}</div>
              <div className="rejoindre-pillar-content">
                <h3
                  className="rejoindre-pillar-headline"
                  dangerouslySetInnerHTML={{ __html: p1.headlineHtml || '' }}
                />
                {(p1.bodyHtml || []).map((para, i) => (
                  <p
                    key={i}
                    className="rejoindre-pillar-body"
                    dangerouslySetInnerHTML={{ __html: para }}
                  />
                ))}

                {/* Carte OSM — Gymnase Robert Pras */}
                <RejoindreMap />

                {p1.cta && p1.cta.href && (
                  <a
                    href={p1.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--secondary rejoindre-pillar-cta"
                  >
                    {p1.cta.label}
                    <ArrowGlyph size={11} color="currentColor" />
                  </a>
                )}
              </div>
            </article>

            <article className="rejoindre-pillar">
              <div className="rejoindre-pillar-eyebrow">{p2.eyebrow}</div>
              <div className="rejoindre-pillar-content">
                <h3
                  className="rejoindre-pillar-headline"
                  dangerouslySetInnerHTML={{ __html: p2.headlineHtml || '' }}
                />
                {(p2.bodyHtml || []).map((para, i) => (
                  <p
                    key={i}
                    className="rejoindre-pillar-body"
                    dangerouslySetInnerHTML={{ __html: para }}
                  />
                ))}
                {p2.cta && p2.cta.href && (
                  <a
                    href={p2.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn rejoindre-pillar-cta"
                  >
                    {p2.cta.label}
                    <ArrowGlyph size={11} color="currentColor" />
                  </a>
                )}
              </div>
            </article>
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
  const c = window.useContent('faq') || {};
  const items = c.items || [];

  const [open, setOpen] = React.useState(0);

  return (
    <section
      id="faq"
      data-screen-label="09 FAQ"
      style={{
        position: 'relative',
        padding: '120px 0 130px',
        background: 'var(--ink)',
        borderTop: '1px solid var(--parch-line)',
      }}
    >
      <div className="container">
        <Reveal>
          <SectionLabel number={c.eyebrowNumber || 8} name={c.eyebrowLabel || ''} />
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
              {c.titleLine1}
              <br />
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>
                {c.titleLine2}
              </em>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            {c.ledeHtml ? (
              <p
                className="lede-col faq-lede"
                style={{
                  margin: 0,
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: 'var(--parch-mute)',
                }}
                dangerouslySetInnerHTML={{ __html: c.ledeHtml }}
              />
            ) : (
              <p
                className="lede-col faq-lede"
                style={{
                  margin: 0,
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: 'var(--parch-mute)',
                }}
              >
                {c.lede}
              </p>
            )}
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
        .faq-lede a {
          color: var(--parch);
          border-bottom: 1px solid var(--parch-line);
          transition: color 200ms var(--ease), border-color 200ms var(--ease);
        }
        .faq-lede a:hover { color: var(--accent); border-bottom-color: var(--accent); }
        .faq-list {
          list-style: none;
          margin: 0;
          padding: 0;
          border-top: 1px solid rgba(236, 232, 222, 0.22);
        }
        .faq-item {
          border-bottom: 1px solid rgba(236, 232, 222, 0.22);
          transition: background 200ms var(--ease);
        }
        .faq-item:hover { background: rgba(236, 232, 222, 0.025); }
        .faq-item[data-open="true"] { background: rgba(224, 85, 44, 0.03); }
        .faq-q {
          width: 100%;
          background: transparent;
          border: 0;
          padding: 26px 16px 26px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          cursor: pointer;
          color: var(--parch);
          font-family: var(--body);
          font-size: 17px;
          font-weight: 500;
          letter-spacing: -0.005em;
          line-height: 1.4;
          text-align: left;
          transition: color 200ms var(--ease);
        }
        .faq-q:hover { color: var(--accent); }
        .faq-q-icon { color: var(--parch-soft); transition: color 200ms var(--ease); }
        .faq-q:hover .faq-q-icon { color: var(--accent); }
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
          padding: 0 16px 28px 16px;
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
          .faq-q { font-size: 15.5px; padding: 22px 12px; gap: 20px; }
          .faq-a { padding: 0 12px 24px; }
          .faq-a p { font-size: 14.5px; }
        }
      `}</style>
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────
// TOURNOIS — bloc court : photo + intro + facts + 2 liens externes
// ───────────────────────────────────────────────────────────────────
const Tournois = () => {
  const c = window.useContent('tournois') || {};
  const facts = c.facts || [];
  const ctas = c.ctas || [];
  return (
  <section
    id="tournois"
    data-screen-label="07 Tournois"
    style={{
      position: 'relative',
      padding: '120px 0 130px',
      background: 'var(--ink)',
      borderTop: '1px solid var(--parch-line)',
    }}
  >
    <div className="container">
      <Reveal>
        <SectionLabel number={c.eyebrowNumber || 6} name={c.eyebrowLabel || ''} />
      </Reveal>

      <div className="tournois-grid">
        <Reveal>
          <Photo
            src={c.photo}
            alt={c.photoAlt}
            focal={c.photoFocal}
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
              <Eyebrow>{c.photoOverlayEyebrow}</Eyebrow>
              <div
                className="display"
                style={{
                  marginTop: 14,
                  fontSize: 26,
                  lineHeight: 1.1,
                }}
              >
                {c.photoOverlayTitle}
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
              {c.titleLine1}
              {' '}
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'var(--accent)',
                }}
              >
                {c.titleLine2}
              </em>
            </h2>
            <p
              style={{
                margin: '0 0 36px',
                fontSize: 16,
                lineHeight: 1.7,
                color: 'var(--parch-soft)',
                maxWidth: 580,
              }}
            >
              {c.body}
            </p>

            <ul className="tournois-facts">
              {facts.map((f, i) => (
                <li key={i}>
                  <span className="tournois-fact-l">{f.label}</span>
                  <span className="tournois-fact-v">{f.value}</span>
                </li>
              ))}
            </ul>

            <div
              style={{
                display: 'flex',
                gap: 16,
                marginTop: 40,
                flexWrap: 'wrap',
              }}
            >
              {ctas.map((cta, i) => (
                <a
                  key={i}
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn ${i === 0 ? 'btn--secondary' : 'btn--tertiary'}`}
                  style={i === 0 ? { padding: '0 32px' } : { padding: '0 28px', minHeight: 44 }}
                >
                  {cta.label}
                  <ArrowGlyph size={11} color="currentColor" />
                </a>
              ))}
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
};

// ───────────────────────────────────────────────────────────────────
// GALERIE — masonry-ish grid with real photos
// ───────────────────────────────────────────────────────────────────
const Galerie = () => {
  const c = window.useContent('galerie') || {};
  const tiles = c.tiles || [];
  return (
  <section
    id="galerie"
    data-screen-label="08 Galerie"
    style={{
      position: 'relative',
      padding: '120px 0 130px',
      background: 'var(--coal)',
      borderTop: '1px solid var(--parch-line)',
    }}
  >
    <div className="container">
      <Reveal>
        <SectionLabel number={c.eyebrowNumber || 7} name={c.eyebrowLabel || ''} />
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
            {c.titleLine1}
            <br />
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--accent)',
              }}
            >
              {c.titleLine2}
            </em>
          </h2>
        </Reveal>
        {c.facebookHref && (
          <Reveal delay={120}>
            <a
              href={c.facebookHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn galerie-fb-cta lede-col"
              style={{ justifySelf: 'end' }}
            >
              {c.facebookLabel || 'Voir sur Facebook'}
              <ArrowGlyph size={12} />
            </a>
          </Reveal>
        )}
      </div>

      <div className="galerie-grid">
        {tiles.map((t, i) => (
          <Reveal key={i} delay={i * 50} style={{ gridColumn: t.col, gridRow: t.row }}>
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
};

// ───────────────────────────────────────────────────────────────────
// PARTENAIRES — hommage aux gens qui rendent le club possible :
// FFAMHE (la fédération qui structure tout l'AMHE en France) et
// les ateliers / boutiques qui fournissent le matériel sérieux.
// ───────────────────────────────────────────────────────────────────
const Partenaires = () => {
  const c = window.useContent('partenaires') || {};
  const partners = c.items || [];

  return (
    <section
      id="partenaires"
      data-screen-label="10 Partenaires"
      style={{
        position: 'relative',
        padding: '120px 0 110px',
        background: 'var(--coal)',
        borderTop: '1px solid var(--parch-line)',
      }}
    >
      <div className="container">
        <Reveal>
          <SectionLabel number={c.eyebrowNumber || 9} name={c.eyebrowLabel || ''} />
        </Reveal>

        <Reveal>
          <h2
            className="display"
            style={{
              fontSize: 'clamp(44px, 4.8vw, 76px)',
              lineHeight: 1.02,
              margin: '0 0 28px',
              maxWidth: 980,
            }}
          >
            {c.titleLine1}
            <br />
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--accent)',
              }}
            >
              {c.titleLine2}
            </em>
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <p
            style={{
              margin: '0 0 64px',
              maxWidth: 760,
              fontFamily: 'var(--body)',
              fontSize: 16,
              lineHeight: 1.7,
              color: 'var(--parch-soft)',
            }}
            dangerouslySetInnerHTML={{ __html: c.lede || '' }}
          />
        </Reveal>

        <div className="partenaires-rows">
          {partners.map((p, i) => (
            <Reveal key={p.name} delay={140 + i * 60}>
              <article className="partenaire-row">
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="partenaire-row-logo"
                  aria-label={p.alt}
                  title={p.name}
                >
                  <img src={p.logo} alt={p.alt} loading="lazy" />
                </a>
                <div className="partenaire-row-content">
                  <div className="partenaire-row-eyebrow">{p.kind}</div>
                  <h3 className="partenaire-row-name">{p.name}</h3>
                  <p
                    className="partenaire-row-body"
                    dangerouslySetInnerHTML={{ __html: p.bodyHtml || '' }}
                  />
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--secondary partenaire-row-cta"
                  >
                    {p.cta}
                    <ArrowGlyph size={11} color="currentColor" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        .partenaires-rows {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--parch-line);
        }
        .partenaire-row {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 72px;
          padding: 56px 0;
          border-bottom: 1px solid var(--parch-line);
          align-items: center;
        }
        .partenaire-row:last-child { border-bottom: none; }
        .partenaire-row-logo {
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0;
          transition: transform 240ms var(--ease), filter 240ms var(--ease);
          filter: saturate(0.85) brightness(0.95);
        }
        .partenaire-row-logo:hover {
          transform: translateY(-3px);
          filter: saturate(1) brightness(1);
        }
        .partenaire-row-logo img {
          display: block;
          max-width: 240px;
          max-height: 130px;
          width: auto;
          height: auto;
          object-fit: contain;
        }
        .partenaire-row-content {
          max-width: 720px;
        }
        .partenaire-row-eyebrow {
          font-family: var(--eyebrow);
          font-size: 10.5px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 600;
          margin-bottom: 12px;
        }
        .partenaire-row-name {
          margin: 0 0 18px;
          font-family: var(--display);
          font-weight: 400;
          font-size: clamp(26px, 2.6vw, 38px);
          line-height: 1.1;
          color: var(--parch);
        }
        .partenaire-row-body {
          margin: 0 0 24px;
          font-family: var(--body);
          font-size: 16px;
          line-height: 1.7;
          color: var(--parch-soft);
        }
        .partenaire-row-body strong {
          color: var(--parch);
          font-weight: 500;
        }
        .partenaire-row-body em {
          font-style: italic;
          color: var(--accent);
          font-weight: 400;
        }
        .partenaire-row-cta { align-self: flex-start; }

        @media (max-width: 900px) {
          .partenaire-row {
            grid-template-columns: 1fr;
            gap: 28px;
            padding: 44px 0;
          }
          .partenaire-row-logo img { max-width: 200px; max-height: 100px; }
        }
      `}</style>
    </section>
  );
};

Object.assign(window, {
  SectionsStyles,
  PreHeaderBanner,
  Actualites,
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
