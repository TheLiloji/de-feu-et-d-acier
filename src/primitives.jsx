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
      gap: 18,
      fontFamily: 'var(--eyebrow)',
      fontSize: 11,
      letterSpacing: '0.32em',
      color: 'var(--parch-mute)',
      textTransform: 'uppercase',
      paddingBottom: 24,
      borderBottom: '1px solid var(--parch-line)',
      marginBottom: 64,
    }}
  >
    <span style={{ color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
      {String(number).padStart(2, '0')}
    </span>
    <Diamond size={4} color="var(--parch-mute)" />
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

// Diamond logo mark — recreated geometrically to use as a small brand chip
const DfdaMark = ({ size = 56, color = 'var(--parch)' }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 56 64" fill="none">
    {/* Upper triangle */}
    <path
      d="M2 30 L28 4 L54 30 L28 56 L2 30 Z"
      stroke={color}
      strokeWidth="1.3"
      fill="none"
    />
    <line x1="2" y1="30" x2="54" y2="30" stroke={color} strokeWidth="1" opacity="0.5" />
    {/* sword */}
    <line x1="28" y1="2" x2="28" y2="58" stroke={color} strokeWidth="1.3" />
    <line x1="22" y1="14" x2="34" y2="14" stroke={color} strokeWidth="1.3" />
    <circle cx="28" cy="5" r="1.8" stroke={color} strokeWidth="1.2" fill="none" />
    {/* ember triangle lower fill */}
    <path d="M5 31 L28 54 L51 31 Z" fill="var(--accent)" opacity="0.15" />
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

// Top navigation
const Nav = ({ scrolled }) => {
  const items = [
    { label: 'Le club', href: '#club' },
    { label: 'Disciplines', href: '#disciplines' },
    { label: 'Entraînements', href: '#salle' },
    { label: 'Tournois', href: '#tournois' },
    { label: 'Galerie', href: '#galerie' },
    { label: 'Contact', href: '#contact' },
  ];
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <nav
        className="site-nav"
        data-scrolled={scrolled ? 'true' : 'false'}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: scrolled ? '16px 56px' : '28px 56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled
            ? 'rgba(8, 7, 10, 0.78)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(140%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(140%)' : 'none',
          borderBottom: scrolled ? '1px solid var(--parch-line)' : '1px solid transparent',
          transition: 'padding 240ms var(--ease), background 240ms var(--ease), border-color 240ms var(--ease)',
        }}
      >
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 14 }} onClick={() => setOpen(false)}>
          <DfdaMark size={34} color="var(--parch)" />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span
              className="site-nav-title"
              style={{
                fontFamily: 'var(--display)',
                fontSize: 18,
                letterSpacing: '0.02em',
                fontWeight: 500,
              }}
            >
              De Feu et D'Acier
            </span>
            <span
              className="site-nav-tagline"
              style={{
                fontFamily: 'var(--eyebrow)',
                fontSize: 9,
                letterSpacing: '0.32em',
                color: 'var(--parch-mute)',
                textTransform: 'uppercase',
                marginTop: 3,
              }}
            >
              AMHE · Clermont-Ferrand
            </span>
          </div>
        </a>
        <ul
          className="site-nav-list"
          style={{
            display: 'flex',
            gap: 36,
            listStyle: 'none',
            margin: 0,
            padding: 0,
            alignItems: 'center',
          }}
        >
          {items.map((it) => (
            <li key={it.href}>
              <a
                href={it.href}
                className="ulink"
                style={{
                  fontFamily: 'var(--eyebrow)',
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--parch-soft)',
                  fontWeight: 500,
                }}
              >
                {it.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="btn btn--ghost"
              style={{
                padding: '11px 18px',
                fontSize: 10.5,
              }}
            >
              Nous contacter
              <ArrowGlyph size={12} />
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(v => !v)}
          className="site-nav-toggle"
          style={{
            display: 'none',
            background: 'transparent',
            border: '1px solid var(--parch-line)',
            color: 'var(--parch)',
            width: 44,
            height: 44,
            padding: 0,
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'border-color 200ms var(--ease)',
          }}
        >
          <span aria-hidden="true" style={{
            position: 'relative',
            display: 'block',
            width: 18,
            height: 12,
          }}>
            <span style={{
              position: 'absolute', left: 0, right: 0, height: 1.2,
              background: 'currentColor',
              top: open ? 5 : 0,
              transform: open ? 'rotate(45deg)' : 'none',
              transition: 'top 220ms var(--ease), transform 220ms var(--ease)',
            }} />
            <span style={{
              position: 'absolute', left: 0, right: 0, height: 1.2,
              background: 'currentColor',
              top: 5,
              opacity: open ? 0 : 1,
              transition: 'opacity 160ms var(--ease)',
            }} />
            <span style={{
              position: 'absolute', left: 0, right: 0, height: 1.2,
              background: 'currentColor',
              top: open ? 5 : 10,
              transform: open ? 'rotate(-45deg)' : 'none',
              transition: 'top 220ms var(--ease), transform 220ms var(--ease)',
            }} />
          </span>
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 49,
          background: 'rgba(8,7,10,0.96)',
          backdropFilter: 'blur(20px) saturate(140%)',
          WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 280ms var(--ease)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 24px',
        }}
      >
        <ul style={{
          listStyle: 'none', margin: 0, padding: 0,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {items.map((it, i) => (
            <li key={it.href} style={{
              borderBottom: '1px solid var(--parch-line)',
              transform: open ? 'translateY(0)' : 'translateY(8px)',
              opacity: open ? 1 : 0,
              transition: `opacity 320ms var(--ease) ${80 + i * 40}ms, transform 320ms var(--ease) ${80 + i * 40}ms`,
            }}>
              <a
                href={it.href}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '22px 4px',
                  fontFamily: 'var(--display)',
                  fontSize: 30,
                  color: 'var(--parch)',
                }}
              >
                <span>{it.label}</span>
                <ArrowGlyph size={16} color="var(--accent)" />
              </a>
            </li>
          ))}
        </ul>
        <div style={{
          marginTop: 36,
          fontFamily: 'var(--eyebrow)',
          fontSize: 10,
          letterSpacing: '0.32em',
          color: 'var(--parch-mute)',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}>
          AMHE · USAM Clermont-Ferrand
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .site-nav { padding: 16px 22px !important; }
          .site-nav[data-scrolled="true"] { padding: 14px 22px !important; }
          .site-nav-list { display: none !important; }
          .site-nav-toggle { display: inline-flex !important; }
          .site-nav-tagline { display: none; }
          .site-nav-title { font-size: 16px !important; }
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
  DfdaMark,
  Photo,
  Reveal,
  useReveal,
  Nav,
});
