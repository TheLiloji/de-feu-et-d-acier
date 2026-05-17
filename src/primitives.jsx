// Shared primitives for De Feu et D'Acier

const Diamond = ({ size = 12, filled = true, color = 'currentColor', style }) => (
  <span
    aria-hidden="true"
    style={{
      display: 'inline-block',
      width: size,
      height: size,
      background: filled ? color : 'transparent',
      border: filled ? 'none' : `1px solid ${color}`,
      transform: 'rotate(45deg)',
      verticalAlign: 'middle',
      ...style,
    }}
  />
);

const Eyebrow = ({ children, color = 'var(--parch-mute)', style }) => (
  <div
    className="eyebrow"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      color,
      ...style,
    }}
  >
    <Diamond size={5} color="var(--accent)" />
    <span>{children}</span>
  </div>
);

const SectionLabel = ({ number, name }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      fontFamily: 'var(--eyebrow)',
      fontSize: 12.5,
      letterSpacing: '0.28em',
      color: 'var(--parch-soft)',
      textTransform: 'uppercase',
      fontWeight: 600,
      paddingBottom: 22,
      borderBottom: '1px solid rgba(236, 232, 222, 0.18)',
      marginBottom: 56,
    }}
  >
    <span
      style={{
        color: 'var(--accent)',
        fontVariantNumeric: 'tabular-nums',
        fontWeight: 600,
      }}
    >
      {String(number).padStart(2, '0')}
    </span>
    <Diamond size={5} color="var(--accent)" />
    <span>{name}</span>
  </div>
);

const ArrowGlyph = ({ size = 14, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size * 0.7}
    viewBox="0 0 20 14"
    fill="none"
    style={{ flexShrink: 0 }}
  >
    <path
      d="M1 7H19M13 1L19 7L13 13"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
  </svg>
);

// Manuscript-style ornamental sword glyph for accents
const SwordGlyph = ({ size = 36, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <g stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="square">
      <line x1="20" y1="4" x2="20" y2="36" />
      <line x1="13" y1="11" x2="27" y2="11" />
      <circle cx="20" cy="6" r="2" />
      <line x1="18" y1="36" x2="22" y2="36" />
    </g>
  </svg>
);

// Subtle image with overlay support
const Photo = ({ src, alt = '', focal = '50% 50%', style, children, ratio }) => (
  <div
    style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--coal)',
      aspectRatio: ratio,
      ...style,
    }}
  >
    {src && (
      <img
        src={src}
        alt={alt}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: focal,
        }}
        loading="lazy"
      />
    )}
    {children}
  </div>
);

// IntersectionObserver-driven fade
const useReveal = () => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
};

const Reveal = ({ children, delay = 0, style, className = '', ...props }) => {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

// Top navigation — 3 zones (brand / nav center / CTA right), padding stable,
// pas de "saut" au scroll : seul le background change.
const Nav = ({ scrolled }) => {
  // Items centrés. Le CTA "Essayer" porte l'appel à l'action principal.
  // Ordre aligné avec la nouvelle hiérarchie (disciplines en premier).
  const items = [
    { label: 'Disciplines', href: '#disciplines', id: 'disciplines' },
    { label: 'Les profs',   href: '#profs',       id: 'profs' },
    { label: 'Le club',     href: '#club',        id: 'club' },
    { label: 'Nous rejoindre', href: '#creneaux', id: 'creneaux' },
    { label: 'Tournois',    href: '#tournois',    id: 'tournois' },
    { label: 'FAQ',         href: '#faq',         id: 'faq' },
  ];
  const [open, setOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState(null);
  // Le CTA du hero est-il visible ? Si oui, on cache le CTA de la navbar pour
  // ne pas redonder l'action et garder le hero comme zone d'appel unique.
  // Dès que le bouton sort de la viewport (scroll), le CTA navbar prend le relais.
  const [heroCtaVisible, setHeroCtaVisible] = React.useState(true);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  React.useEffect(() => {
    const cta = document.querySelector('.hero-cta');
    if (!cta) return;
    const io = new IntersectionObserver(
      ([entry]) => setHeroCtaVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(cta);
    return () => io.disconnect();
  }, []);

  // Scroll-spy : surligne l'item dont la section traverse le plus la viewport.
  // rootMargin choisi pour que la nav (haut ~70px) ne fausse pas l'intersection.
  React.useEffect(() => {
    const ids = items.map((it) => it.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <nav
        className="site-nav"
        data-scrolled={scrolled ? 'true' : 'false'}
        data-hero-cta-visible={heroCtaVisible ? 'true' : 'false'}
        aria-label="Navigation principale"
      >
        {/* Zone gauche — marque. 3 affichages selon viewport :
            • Desktop : blason + "De Feu et d'Acier"
            • Tablette étroite : blason + "DFDA" (sigle compact)
            • Très petit mobile (≤380px) : blason seul (le nom prendrait 2 lignes) */}
        <a className="site-nav-brand" href="#top" onClick={() => setOpen(false)} aria-label="De Feu et d'Acier — accueil">
          <img
            src="assets/logo.png?v=2"
            alt=""
            aria-hidden="true"
            width="28"
            height="28"
            style={{ display: 'block', objectFit: 'contain', flexShrink: 0 }}
          />
          <span className="site-nav-title site-nav-title--full">De Feu et d'Acier</span>
          <span className="site-nav-title site-nav-title--short" aria-hidden="true">DFDA</span>
        </a>

        {/* Zone centre — items centrés visuellement */}
        <ul className="site-nav-list">
          {items.map((it) => {
            const isActive = activeId === it.id;
            return (
              <li key={it.href}>
                <a
                  href={it.href}
                  className="site-nav-link"
                  data-active={isActive ? 'true' : 'false'}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {it.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Zone droite — CTA "Venir essayer" (toujours visible, action principale).
            Label aligné avec le bouton du hero pour une promesse unique. */}
        <a href="#creneaux" className="btn site-nav-cta">
          Venir essayer
          <ArrowGlyph size={11} color="currentColor" />
        </a>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(v => !v)}
          className="site-nav-toggle"
        >
          <span aria-hidden="true" className="site-nav-toggle-bars" data-open={open ? 'true' : 'false'}>
            <span /><span /><span />
          </span>
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className="site-drawer"
        data-open={open ? 'true' : 'false'}
      >
        <ul className="site-drawer-list">
          {items.map((it, i) => (
            <li
              key={it.href}
              style={{
                transitionDelay: `${80 + i * 40}ms`,
              }}
            >
              <a href={it.href} onClick={() => setOpen(false)} className="site-drawer-link">
                <span>{it.label}</span>
                <ArrowGlyph size={14} color="var(--accent)" />
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#creneaux"
          onClick={() => setOpen(false)}
          className="btn site-drawer-cta"
        >
          Venir essayer
          <ArrowGlyph size={12} color="currentColor" />
        </a>
        <div className="site-drawer-foot">AMHE · USAM Clermont-Ferrand</div>
      </div>

      <style>{`
        .site-nav {
          position: fixed;
          top: var(--prebanner-h, 0);
          left: 0; right: 0;
          z-index: 50;
          transition: background 240ms var(--ease), border-color 240ms var(--ease), top 220ms var(--ease);
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 24px;
          padding: 16px 40px;
          background: transparent;
          border-bottom: 1px solid transparent;
        }
        .site-nav[data-scrolled="true"] {
          background: rgba(10, 9, 8, 0.78);
          backdrop-filter: blur(18px) saturate(140%);
          -webkit-backdrop-filter: blur(18px) saturate(140%);
          border-bottom-color: var(--parch-line);
        }
        .site-nav-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          justify-self: start;
          color: var(--parch);
        }
        .site-nav-title {
          font-family: var(--display);
          font-size: 19px;
          line-height: 1;
          letter-spacing: 0.005em;
          font-weight: 500;
          white-space: nowrap;
        }
        .site-nav-title--short {
          display: none;
          letter-spacing: 0.08em;
          font-weight: 600;
        }
        .site-nav-list {
          display: flex;
          gap: 22px;
          list-style: none;
          margin: 0;
          padding: 0;
          justify-self: center;
          align-items: center;
        }
        .site-nav-link {
          position: relative;
          font-family: var(--body);
          font-size: 11.5px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 500;
          color: var(--parch-soft);
          padding: 8px 4px;
          transition: color 200ms var(--ease);
        }
        .site-nav-link::after {
          content: '';
          position: absolute;
          left: 4px;
          right: 4px;
          bottom: 2px;
          height: 1px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 240ms var(--ease);
        }
        .site-nav-link:hover { color: var(--parch); }
        .site-nav-link[data-active="true"] { color: var(--parch); }
        .site-nav-link[data-active="true"]::after { transform: scaleX(1); }
        .site-nav-cta {
          justify-self: end;
          min-height: 38px;
          padding: 0 18px;
          font-size: 10.5px;
          transition: opacity 280ms var(--ease), transform 280ms var(--ease);
        }
        /* CTA navbar caché tant que le bouton du hero est dans la viewport ;
           dès qu'il sort, on le révèle en fade + slide. Une seule action visible
           à la fois pour clarifier la hiérarchie. */
        .site-nav[data-hero-cta-visible="true"] .site-nav-cta {
          opacity: 0;
          transform: translateY(-4px);
          pointer-events: none;
          visibility: hidden;
        }
        .site-nav[data-hero-cta-visible="false"] .site-nav-cta {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
          visibility: visible;
        }
        .site-nav-toggle {
          display: none;
          background: transparent;
          border: 1px solid var(--parch-line);
          color: var(--parch);
          width: 44px;
          height: 44px;
          padding: 0;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          justify-self: end;
          transition: border-color 200ms var(--ease);
        }
        .site-nav-toggle:hover { border-color: var(--parch); }
        .site-nav-toggle-bars { position: relative; display: block; width: 18px; height: 12px; }
        .site-nav-toggle-bars > span {
          position: absolute;
          left: 0; right: 0;
          height: 1.2px;
          background: currentColor;
          transition: top 220ms var(--ease), transform 220ms var(--ease), opacity 160ms var(--ease);
        }
        .site-nav-toggle-bars > span:nth-child(1) { top: 0; }
        .site-nav-toggle-bars > span:nth-child(2) { top: 5px; }
        .site-nav-toggle-bars > span:nth-child(3) { top: 10px; }
        .site-nav-toggle-bars[data-open="true"] > span:nth-child(1) { top: 5px; transform: rotate(45deg); }
        .site-nav-toggle-bars[data-open="true"] > span:nth-child(2) { opacity: 0; }
        .site-nav-toggle-bars[data-open="true"] > span:nth-child(3) { top: 5px; transform: rotate(-45deg); }

        /* Drawer mobile */
        .site-drawer {
          position: fixed;
          inset: 0;
          z-index: 49;
          background: rgba(10, 9, 8, 0.96);
          backdrop-filter: blur(18px) saturate(140%);
          -webkit-backdrop-filter: blur(18px) saturate(140%);
          opacity: 0;
          pointer-events: none;
          transition: opacity 240ms var(--ease);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 88px 24px 40px;
        }
        .site-drawer[data-open="true"] { opacity: 1; pointer-events: auto; }
        .site-drawer-list { list-style: none; margin: 0 0 28px; padding: 0; display: flex; flex-direction: column; gap: 0; }
        .site-drawer-list > li {
          border-bottom: 1px solid var(--parch-line);
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 320ms var(--ease), transform 320ms var(--ease);
        }
        .site-drawer[data-open="true"] .site-drawer-list > li { opacity: 1; transform: translateY(0); }
        .site-drawer-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 4px;
          font-family: var(--display);
          font-size: 26px;
          font-weight: 500;
          color: var(--parch);
        }
        .site-drawer-cta { align-self: flex-start; }
        .site-drawer-foot {
          margin-top: 28px;
          font-family: var(--body);
          font-size: 10px;
          letter-spacing: 0.26em;
          color: var(--parch-mute);
          text-transform: uppercase;
          font-weight: 500;
          text-align: center;
        }

        /* Tablette — réduit la nav avant de basculer en drawer */
        @media (max-width: 1100px) {
          .site-nav { padding: 14px 28px; gap: 18px; }
          .site-nav-list { gap: 20px; }
          .site-nav-link { font-size: 11px; letter-spacing: 0.18em; }
          .site-nav-title { font-size: 17px; }
        }
        /* Bascule mobile : drawer + brand seul + hamburger */
        @media (max-width: 900px) {
          .site-nav {
            grid-template-columns: 1fr auto;
            padding: 10px 18px;
          }
          .site-nav-list, .site-nav-cta { display: none !important; }
          .site-nav-toggle { display: inline-flex; width: 40px; height: 40px; }
          .site-nav-brand img { width: 26px; height: 26px; }
        }
        @media (max-width: 540px) {
          .site-nav-title--full { display: none; }
          .site-nav-title--short { display: inline; font-size: 14px; }
        }
        @media (max-width: 380px) {
          .site-nav-title--short { display: none; }
          .site-nav-brand { gap: 0; }
        }
      `}</style>
    </>
  );
};

// ───────────────────────────────────────────────────────────────────
// MOBILE ACTION BAR — Sticky bottom (Tel · Mail · Essayer).
// Affichée uniquement sous 900px de large. Donne accès permanent aux
// 3 actions principales sans avoir à scroller. Padding-bottom du body
// géré ici aussi (sinon le contenu se cache derrière la barre).
// ───────────────────────────────────────────────────────────────────
const MobileActionBar = () => {
  const venue = (window.useContent && window.useContent('rejoindre')?.venue) || {};
  const tel = venue.contactPhoneHref || 'tel:+33631585460';
  const mail = venue.contactEmail
    ? `mailto:${venue.contactEmail}?subject=${encodeURIComponent("Première séance d'essai — De Feu et d'Acier")}`
    : 'mailto:c.sillac@protonmail.com';

  return (
    <>
      <div className="mobile-actionbar" role="region" aria-label="Actions rapides">
        <a href={tel} aria-label="Appeler le club">
          <span className="mab-ico" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
          <span className="mab-lbl-long">Appeler</span>
          <span className="mab-lbl-short">Tel</span>
        </a>
        <a href={mail} aria-label="Écrire au club">
          <span className="mab-ico" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </span>
          <span className="mab-lbl-long">Écrire</span>
          <span className="mab-lbl-short">Mail</span>
        </a>
        <a href="#creneaux" className="mab-cta">
          <span className="mab-lbl-long">Venir essayer</span>
          <span className="mab-lbl-short">Essayer</span>
          <ArrowGlyph size={11} color="currentColor" />
        </a>
      </div>

      <style>{`
        /* La barre n'existe qu'en mobile/tablette ≤ 900px ; sur desktop,
           le CTA est déjà accessible via la nav (qui réapparaît au scroll). */
        .mobile-actionbar { display: none; }
        @media (max-width: 900px) {
          .mobile-actionbar {
            position: fixed;
            left: 0; right: 0; bottom: 0;
            z-index: 70;
            display: grid;
            grid-template-columns: 1fr 1fr 2fr;
            background: rgba(10,9,8,0.92);
            backdrop-filter: blur(18px) saturate(140%);
            -webkit-backdrop-filter: blur(18px) saturate(140%);
            border-top: 1px solid var(--parch-line);
            padding-bottom: env(safe-area-inset-bottom, 0px);
          }
          .mobile-actionbar a {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            height: 64px;
            font-family: var(--eyebrow);
            font-size: 11px;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            font-weight: 600;
            color: var(--parch);
            text-decoration: none;
            border-right: 1px solid var(--parch-line);
            transition: background 200ms var(--ease);
          }
          .mobile-actionbar a:active { background: rgba(236,232,222,0.05); }
          .mobile-actionbar .mab-cta {
            background: var(--accent);
            color: #160806;
            border-right: none;
            box-shadow: 0 -4px 14px -8px rgba(224,85,44,0.6) inset;
          }
          .mobile-actionbar .mab-cta:active { background: var(--ember-hot); }
          .mobile-actionbar .mab-ico {
            display: inline-flex;
            width: 16px; height: 16px;
            align-items: center; justify-content: center;
            flex-shrink: 0;
          }
          .mobile-actionbar .mab-lbl-short { display: none; }
          /* Padding-bottom du body pour que le contenu ne soit pas caché
             par la barre (64px + safe area). On évite le hero qui gère
             sa propre hauteur 100svh — c'est seulement le footer/legal qui
             aurait pu être masqué. */
          body { padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px)); }
        }
        @media (max-width: 360px) {
          .mobile-actionbar .mab-lbl-long { display: none; }
          .mobile-actionbar .mab-lbl-short { display: inline; }
        }
      `}</style>
    </>
  );
};

Object.assign(window, {
  Diamond,
  Eyebrow,
  SectionLabel,
  ArrowGlyph,
  SwordGlyph,
  Photo,
  Reveal,
  useReveal,
  Nav,
  MobileActionBar,
});
