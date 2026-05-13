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
              fontSize: 'clamp(64px, 12vw, 196px)',
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
            style={{
              marginTop: 36,
              fontFamily: 'var(--eyebrow)',
              fontSize: 12,
              letterSpacing: '0.42em',
              textTransform: 'uppercase',
              color: 'var(--parch-soft)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 18,
            }}
          >
            <span style={{ width: 36, height: 1, background: 'var(--parch-line)' }} />
            <span>Arts Martiaux Historiques Européens · Clermont-Ferrand</span>
            <span style={{ width: 36, height: 1, background: 'var(--parch-line)' }} />
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

      {/* Indicateur de scroll discret, bas centré */}
      <a
        href="#manifesto"
        aria-label="Faire défiler"
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 28,
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
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
          style={{
            width: 1,
            height: 32,
            background: 'currentColor',
            opacity: 0.5,
          }}
        />
      </a>

      {/* Effet titre forge : injecté ici pour rester avec le composant */}
      <style>{`
        .forge-title {
          /* Métal sortant de la forge : cendre froide en haut → braise en bas */
          background: linear-gradient(
            180deg,
            #c9bda5 0%,
            #b89c78 22%,
            #8a5a3a 44%,
            #6a2a18 64%,
            #b8381f 82%,
            #e8552a 94%,
            #4a1208 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          /* Halos : un net derrière (profondeur), un large (chaleur diffuse) */
          filter:
            drop-shadow(0 6px 18px rgba(0,0,0,0.55))
            drop-shadow(0 14px 40px rgba(200,64,48,0.32))
            drop-shadow(0 0 80px rgba(200,64,48,0.18));
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>
    </section>
  );
};

window.Hero = Hero;
