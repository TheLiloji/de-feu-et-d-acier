// CONTACT — Form + practical info + footer

/**
 * Iframe OSM avec un reload post-onLoad : OSM lit ses dimensions au boot et
 * ne se redimensionne pas, mais une fois la première frame chargée le
 * contentDocument a les bonnes tailles — le 2e load fait un rendu propre.
 */
const MapIframe = ({ src }) => {
  const ref = React.useRef(null);
  const reloadedRef = React.useRef(false);
  const onLoad = () => {
    if (reloadedRef.current) return;
    reloadedRef.current = true;
    setTimeout(() => {
      const f = ref.current;
      if (f) f.src = src;
    }, 80);
  };
  return (
    <iframe
      ref={ref}
      src={src}
      width="760"
      height="320"
      style={{ border: 0, width: '100%', height: 320, display: 'block' }}
      referrerPolicy="no-referrer-when-downgrade"
      title="Gymnase Robert Pras — Clermont-Ferrand"
      onLoad={onLoad}
    />
  );
};

/**
 * Carte OpenStreetMap pour le Gymnase Robert Pras.
 * Workaround : l'embed OSM mesure son viewport au moment de l'init et ne se
 * redimensionne pas après. On ne charge l'iframe que quand elle entre dans le
 * viewport (et qu'elle a donc ses bonnes dimensions à l'init).
 */
const RejoindreMap = () => {
  const rejoindre = window.useContent('rejoindre') || {};
  const map = rejoindre.map || {};
  const containerRef = React.useRef(null);
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    if (loaded) return;
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoaded(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loaded]);
  return (
    <div className="rejoindre-map" ref={containerRef}>
      {loaded && map.iframeSrc ? (
        <MapIframe src={map.iframeSrc} />
      ) : (
        <div className="rejoindre-map-placeholder" aria-hidden="true" />
      )}
      <div className="rejoindre-map-info">
        <div className="rejoindre-map-info-l">
          <div className="rejoindre-map-name">{map.name}</div>
          <div className="rejoindre-map-addr">{map.address}</div>
        </div>
        {map.openLink && (
          <a
            href={map.openLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rejoindre-map-osm"
          >
            Ouvrir sur OSM
            <ArrowGlyph size={10} color="currentColor" />
          </a>
        )}
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────
// LEGAL MODAL — mentions légales + RGPD en overlay déclenché depuis le
// footer. L'état est synchronisé avec le hash de l'URL pour que les
// liens #mentions-legales et #rgpd restent fonctionnels (signets,
// partage de lien direct, retour arrière navigateur).
// ───────────────────────────────────────────────────────────────────
const LegalNotes = () => {
  const [openId, setOpenId] = React.useState(() => {
    if (typeof window === 'undefined') return null;
    const h = window.location.hash.replace('#', '');
    return h === 'mentions-legales' || h === 'rgpd' ? h : null;
  });

  // Sync URL hash → state
  React.useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace('#', '');
      if (h === 'mentions-legales' || h === 'rgpd') setOpenId(h);
      else if (openId) setOpenId(null);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [openId]);

  // Lock body scroll + ESC pour fermer
  React.useEffect(() => {
    if (!openId) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [openId]);

  const close = () => {
    setOpenId(null);
    // Retire le hash sans relancer le hashchange listener
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) close();
  };

  if (!openId) return null;

  const isMentions = openId === 'mentions-legales';
  const c = window.useContent('legal') || {};
  const mentions = c.mentions || {};
  const rgpd = c.rgpd || {};
  const block = isMentions ? mentions : rgpd;

  return (
    <div
      className="legal-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      onClick={onBackdropClick}
    >
      <div className="legal-modal-panel" role="document">
        <div className="legal-modal-head">
          <div>
            <div className="legal-modal-eyebrow">{c.eyebrow || 'Informations légales'}</div>
            <h2 id="legal-modal-title" className="legal-modal-title">
              {block.title || (isMentions ? 'Mentions légales' : 'Confidentialité & RGPD')}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="legal-modal-close"
            aria-label="Fermer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
              <path d="M6 6L18 18M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="legal-modal-body">
          {isMentions ? (
            <>
              {mentions.intro && <p>{mentions.intro}</p>}
              <dl className="legal-dl">
                {(mentions.entries || []).map((e, i) => (
                  <React.Fragment key={i}>
                    <dt>{e.label}</dt>
                    <dd dangerouslySetInnerHTML={{ __html: e.valueHtml || '' }} />
                  </React.Fragment>
                ))}
              </dl>
              {mentions.footnote && <p className="legal-mute">{mentions.footnote}</p>}
            </>
          ) : (
            <>
              {(rgpd.paragraphsHtml || []).map((para, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
              ))}
              {rgpd.footnote && <p className="legal-mute">{rgpd.footnote}</p>}
            </>
          )}

          <div className="legal-modal-switch">
            {isMentions ? (
              <a href="#rgpd" className="legal-modal-switch-link">
                {c.switchToRgpd || 'Voir la politique de confidentialité'}
                <ArrowGlyph size={11} color="currentColor" />
              </a>
            ) : (
              <a href="#mentions-legales" className="legal-modal-switch-link">
                {c.switchToMentions || 'Voir les mentions légales'}
                <ArrowGlyph size={11} color="currentColor" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────
// FOOTER
// ───────────────────────────────────────────────────────────────────
const Footer = () => {
  const c = window.useContent('footer') || {};
  const brand = c.brand || {};
  const columns = c.columns || [];
  const legalLinks = c.legalLinks || [];
  return (
  <footer
    style={{
      position: 'relative',
      padding: '80px 0 32px',
      background: 'var(--ink)',
      borderTop: '1px solid var(--parch-line)',
    }}
  >
    <div className="container">
      {/* Marquee-style large brand line */}
      <div className="footer-marquee">
        {brand.start} <span className="brand-feu">{brand.feu}</span>
        <em
          style={{
            fontStyle: 'italic',
            fontWeight: 300,
          }}
        >
          &nbsp;{brand.connector}&nbsp;
        </em>
        <span className="brand-acier">{brand.acier}</span>
      </div>

      <div className="footer-grid">
        <div>
          <img
            src={c.logo}
            alt={c.logoAlt}
            width="56"
            height="56"
            style={{ display: 'block', objectFit: 'contain' }}
          />
          <p
            style={{
              margin: '20px 0 0',
              fontSize: 13,
              lineHeight: 1.6,
              color: 'var(--parch-mute)',
              maxWidth: 260,
            }}
          >
            {c.description}
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.label}>
            <div
              style={{
                fontFamily: 'var(--eyebrow)',
                fontSize: 10,
                letterSpacing: '0.26em',
                color: 'var(--parch-mute)',
                textTransform: 'uppercase',
                marginBottom: 22,
                fontWeight: 500,
              }}
            >
              {col.label}
            </div>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {(col.items || []).map(([l, h]) => {
                const ext = /^https?:/.test(h);
                return (
                  <li key={l}>
                    <a
                      href={h}
                      className="ulink"
                      {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      style={{
                        fontFamily: 'var(--body)',
                        fontSize: 14.5,
                        color: 'var(--parch)',
                      }}
                    >
                      {l}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div
        className="footer-foot"
        style={{
          fontFamily: 'var(--eyebrow)',
          fontSize: 10,
          letterSpacing: '0.26em',
          color: 'var(--parch-mute)',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}
      >
        <div>{c.copyright}</div>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          {legalLinks.map(([l, h]) => (
            <a key={l} href={h} className="ulink">{l}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
  );
};

// Inject form-specific styles once
const ContactStyles = () => (
  <style>{`
    /* ── Section Rejoindre : 3 piliers texte, alignés sur le style éditorial du site ── */
    .rejoindre-pillars {
      display: flex;
      flex-direction: column;
      border-top: 1px solid var(--parch-line);
      margin-bottom: 24px;
    }
    .rejoindre-pillar {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 56px;
      padding: 48px 0 44px;
      border-bottom: 1px solid var(--parch-line);
      align-items: start;
    }
    .rejoindre-pillar:last-child { border-bottom: none; }
    .rejoindre-pillar-eyebrow {
      font-family: var(--eyebrow);
      font-size: 10.5px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--parch-mute);
      font-weight: 500;
      padding-top: 14px;
    }
    .rejoindre-pillar-content {
      max-width: 760px;
    }
    .rejoindre-pillar-headline {
      font-family: var(--display);
      font-weight: 400;
      font-size: clamp(26px, 3.1vw, 44px);
      line-height: 1.1;
      color: var(--parch);
      margin: 0 0 22px;
    }
    .rejoindre-pillar-headline em {
      font-style: italic;
      font-weight: 300;
      color: var(--accent);
    }
    .rejoindre-pillar-headline strong {
      font-weight: 500;
      color: var(--parch);
      font-variant-numeric: tabular-nums;
    }
    .rejoindre-pillar-body {
      margin: 0 0 26px;
      font-family: var(--body);
      font-size: 16px;
      line-height: 1.65;
      color: var(--parch-soft);
    }
    .rejoindre-pillar-body strong {
      color: var(--parch);
      font-weight: 500;
    }
    .rejoindre-pillar-cta {
      align-self: flex-start;
    }

    /* Carte OSM dans le pilier "viens essayer" */
    .rejoindre-map {
      margin: 8px 0 28px;
      border: 1px solid var(--parch-line);
      border-radius: 2px;
      overflow: hidden;
      background: #0d0c0b;
    }
    .rejoindre-map iframe {
      /* Dim & desaturate les tuiles OSM pour matcher la palette du site */
      filter: invert(0.92) hue-rotate(180deg) saturate(0.55) brightness(0.95) contrast(0.95);
    }
    .rejoindre-map-placeholder {
      width: 100%;
      height: 320px;
      display: block;
      background:
        linear-gradient(180deg, rgba(236,232,222,0.04), rgba(236,232,222,0.01)),
        repeating-linear-gradient(45deg, rgba(236,232,222,0.025) 0 14px, transparent 14px 28px);
    }
    .rejoindre-map-info {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 8px 18px;
      padding: 14px 18px;
      border-top: 1px solid var(--parch-line);
      background: rgba(236,232,222,0.02);
    }
    .rejoindre-map-info-l {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .rejoindre-map-name {
      font-family: var(--body);
      font-size: 15px;
      font-weight: 500;
      color: var(--parch);
      line-height: 1.3;
    }
    .rejoindre-map-addr {
      font-family: var(--body);
      font-size: 13.5px;
      color: var(--parch-soft);
      line-height: 1.4;
    }
    .rejoindre-map-osm {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: var(--eyebrow);
      font-size: 10px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--parch-mute);
      font-weight: 500;
      padding: 4px 0;
      transition: color 200ms var(--ease);
    }
    .rejoindre-map-osm:hover { color: var(--accent); }

    @media (max-width: 820px) {
      .rejoindre-pillar {
        grid-template-columns: 1fr;
        gap: 16px;
        padding: 36px 0 32px;
      }
      .rejoindre-pillar-eyebrow { padding-top: 0; }
      .rejoindre-map iframe { height: 260px !important; }
    }

    .footer-marquee {
      font-family: var(--display);
      font-size: clamp(56px, 8vw, 138px);
      line-height: 0.92;
      letter-spacing: -0.02em;
      color: var(--parch);
      margin-bottom: 64px;
      text-align: center;
    }
    @media (max-width: 640px) {
      .footer-marquee { font-size: clamp(44px, 13vw, 84px); margin-bottom: 44px; }
    }

    /* ── Legal modal (overlay) ────────────────────────────────────── */
    .legal-modal {
      position: fixed;
      inset: 0;
      z-index: 100;
      background: rgba(8, 7, 6, 0.78);
      backdrop-filter: blur(8px) saturate(120%);
      -webkit-backdrop-filter: blur(8px) saturate(120%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      animation: legal-modal-fade 200ms var(--ease);
    }
    @keyframes legal-modal-fade {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    .legal-modal-panel {
      position: relative;
      background: var(--coal);
      border: 1px solid var(--parch-line);
      border-radius: 3px;
      max-width: 720px;
      width: 100%;
      max-height: calc(100vh - 96px);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow:
        0 30px 80px -20px rgba(0,0,0,0.6),
        0 0 0 1px rgba(236,232,222,0.04) inset;
      animation: legal-modal-rise 280ms var(--ease);
    }
    @keyframes legal-modal-rise {
      from { opacity: 0; transform: translateY(16px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .legal-modal-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding: 28px 32px 22px;
      border-bottom: 1px solid var(--parch-line);
    }
    .legal-modal-eyebrow {
      font-family: var(--eyebrow);
      font-size: 10.5px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 10px;
    }
    .legal-modal-title {
      margin: 0;
      font-family: var(--display);
      font-size: clamp(22px, 2.6vw, 30px);
      line-height: 1.15;
      color: var(--parch);
      font-weight: 500;
    }
    .legal-modal-close {
      background: transparent;
      border: 1px solid var(--parch-line);
      color: var(--parch-soft);
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border-radius: 2px;
      transition: border-color 200ms var(--ease), color 200ms var(--ease), background 200ms var(--ease);
    }
    .legal-modal-close:hover {
      border-color: var(--accent);
      color: var(--accent);
      background: rgba(224,85,44,0.06);
    }
    .legal-modal-body {
      padding: 24px 32px 32px;
      font-family: var(--body);
      font-size: 14.5px;
      line-height: 1.7;
      color: var(--parch-soft);
      overflow-y: auto;
    }
    .legal-modal-body p { margin: 14px 0 0; }
    .legal-modal-body p:first-of-type { margin-top: 0; }
    .legal-modal-body a { color: var(--parch); border-bottom: 1px solid var(--parch-line); }
    .legal-modal-body a:hover { color: var(--accent); border-bottom-color: var(--accent); }
    .legal-mute { color: var(--parch-mute) !important; font-size: 13px !important; }
    .legal-dl {
      margin: 18px 0 0;
      display: grid;
      grid-template-columns: 180px 1fr;
      gap: 6px 18px;
    }
    .legal-dl dt {
      font-family: var(--eyebrow);
      font-size: 10px;
      letter-spacing: 0.26em;
      text-transform: uppercase;
      color: var(--parch-mute);
      font-weight: 500;
      padding-top: 4px;
    }
    .legal-dl dd { margin: 0; color: var(--parch-soft); padding: 4px 0; }
    .legal-modal-switch {
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid var(--parch-line);
    }
    .legal-modal-switch-link {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-family: var(--eyebrow);
      font-size: 10.5px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--accent);
      font-weight: 500;
      padding-bottom: 2px;
      border-bottom: 1px solid transparent;
      transition: border-color 200ms var(--ease);
    }
    .legal-modal-switch-link:hover { border-bottom-color: var(--accent); }
    @media (max-width: 640px) {
      .legal-modal { padding: 24px 16px; }
      .legal-modal-head { padding: 22px 22px 18px; }
      .legal-modal-body { padding: 20px 22px 26px; }
      .legal-dl { grid-template-columns: 1fr; gap: 2px 0; }
      .legal-dl dt { padding-top: 10px; }
    }
  `}</style>
);

Object.assign(window, { RejoindreMap, LegalNotes, Footer, ContactStyles });
