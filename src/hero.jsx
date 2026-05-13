// HERO — Vidéo de combat en boucle en fond, titre "charbon de la forge".
// Allégé volontairement : logo + titre + baseline + CTA unique.
// La vidéo est attendue en assets/hero-loop.mp4 (+ .webm en option).
// Tant qu'elle n'est pas fournie, le poster (hero-studio.avif) prend le relais.

const Hero = () => {
  const videoRef = React.useRef(null);

  // Respect prefers-reduced-motion : on coupe l'auto-play.
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  return (
    <section
      id="top"
      data-screen-label="01 Accueil"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: 680,
        overflow: 'hidden',
        background: 'var(--ink)',
      }}
    >
      {/* Fond vidéo (loop, muet, autoplay) */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="assets/hero-studio.avif"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '50% 50%',
          filter: 'contrast(1.05) saturate(0.78) brightness(0.72)',
        }}
      >
        <source src="assets/Hero.mp4" type="video/mp4" />
      </video>

      {/* Voile sombre : descend en bas pour cadrer le CTA */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(8,7,10,0.72) 0%, rgba(8,7,10,0.32) 28%, rgba(8,7,10,0.42) 62%, rgba(8,7,10,0.92) 100%)',
        }}
      />

      {/* Halo braise par en bas — comme une forge qui couve sous le sol */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(70% 45% at 50% 108%, rgba(200,64,48,0.22), transparent 65%)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />

      {/* Bloc central : logo + titre + baseline + CTA */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
          zIndex: 5,
        }}
      >
        <Reveal delay={120}>
          <img
            src="assets/logo.png?v=2"
            alt="De Feu et d'Acier — logo"
            style={{
              width: 'clamp(96px, 11vw, 150px)',
              height: 'auto',
              marginBottom: 32,
              background: 'transparent',
            }}
          />
        </Reveal>

        <Reveal delay={260}>
          <h1
            className="display forge-title"
            style={{
              margin: 0,
              fontSize: 'clamp(56px, 12vw, 196px)',
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
              fontWeight: 500,
            }}
          >
            De Feu
            <br />
            <span style={{ fontStyle: 'italic', fontWeight: 300, paddingLeft: '0.35em' }}>
              et d'
            </span>
            Acier
          </h1>
        </Reveal>

        <Reveal delay={460}>
          <div
            className="hero-baseline"
            style={{
              marginTop: 36,
              fontFamily: 'var(--eyebrow)',
              fontSize: 'clamp(10px, 1.1vw, 12px)',
              letterSpacing: '0.42em',
              textTransform: 'uppercase',
              color: 'var(--parch-soft)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 18,
              maxWidth: '92vw',
              textAlign: 'center',
            }}
          >
            <span style={{ width: 36, height: 1, background: 'var(--parch-line)', flexShrink: 0 }} />
            <span>Arts Martiaux Historiques Européens · Clermont-Ferrand</span>
            <span style={{ width: 36, height: 1, background: 'var(--parch-line)', flexShrink: 0 }} />
          </div>
        </Reveal>

        <Reveal delay={640}>
          <a
            href="#contact"
            className="btn btn--solid"
            style={{ marginTop: 44 }}
          >
            Rejoindre le club
            <ArrowGlyph size={13} color="currentColor" />
          </a>
        </Reveal>
      </div>

      {/* Indicateur de scroll discret, bas centré — ligne qui respire comme une braise */}
      <a
        href="#manifesto"
        aria-label="Faire défiler"
        className="hero-scroll"
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 32,
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          color: 'var(--parch-soft)',
          zIndex: 4,
          fontFamily: 'var(--eyebrow)',
          fontSize: 9.5,
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}
      >
        <span>Faire défiler</span>
        <span
          aria-hidden="true"
          className="hero-scroll-line"
          style={{
            width: 1,
            height: 40,
            background: 'currentColor',
            display: 'block',
          }}
        />
      </a>

      {/* Effet titre forge : injecté ici pour rester avec le composant */}
      <style>{`
        .forge-title {
          /* Métal sortant de la forge : cendre froide en haut → cœur de braise en bas
             Courbe rééquilibrée : on évite l'effet de "ré-assombrissement" au pied. */
          background: linear-gradient(
            180deg,
            #d6c9ad 0%,
            #c1a37c 18%,
            #9a6a44 38%,
            #6a2e1a 58%,
            #a83321 76%,
            #d24a26 92%,
            #ec6a32 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          /* Halos étagés : net (profondeur), moyen (chaleur), large (atmosphère) */
          filter:
            drop-shadow(0 4px 14px rgba(0,0,0,0.6))
            drop-shadow(0 12px 30px rgba(200,64,48,0.28))
            drop-shadow(0 0 90px rgba(200,64,48,0.18));
        }
        .hero-scroll-line { animation: scroll-tick 2.6s var(--ease) infinite; }
        .hero-scroll:hover { color: var(--parch); }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
          .hero-scroll-line { animation: none; opacity: 0.5; }
        }
        @media (max-width: 640px) {
          .hero-baseline { font-size: 9.5px !important; letter-spacing: 0.32em !important; gap: 12px !important; }
          .hero-baseline span:first-child, .hero-baseline span:last-child { width: 20px !important; }
        }
      `}</style>
    </section>
  );
};

window.Hero = Hero;
