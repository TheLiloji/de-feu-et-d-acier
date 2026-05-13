// HERO — vidéo en fond, message clair, multi-CTA, quick-info row.
//
// Stratégie média responsive :
//   • Desktop (>768 px) : <video> 16:9.
//       - 1ère source : Hero.webm (AV1/VP9, ~30% plus léger qu'mp4 à qualité égale).
//       - 2e source  : Hero.mp4  (H.264 baseline, fallback universel).
//       Le browser prend la première source qu'il sait décoder.
//   • Mobile  (≤768 px) :
//       - si HAS_MOBILE_VIDEO = true  → <video> verticale (Hero-mobile.mp4)
//       - sinon                       → <img> poster, cadré sur les corps
//   • prefers-reduced-motion : on coupe l'autoplay et on affiche le poster.
//
// Le Hero.mp4 16:9 n'est JAMAIS chargé sur mobile (économie data + évite
// le crop moche sur les lames). Pour activer la vidéo mobile dédiée, déposer
// assets/Hero-mobile.mp4 (idéalement 9:16, ≤ 1.5 Mo) et passer HAS_MOBILE_VIDEO à true.
//
// Le poster mobile (assets/hero-poster-mobile.webp) tombe automatiquement
// en cascade sur assets/hero-studio.avif si le fichier n'existe pas encore.

const HAS_MOBILE_VIDEO = false; // ← true dès que assets/Hero-mobile.mp4 est déposée
const MOBILE_VIDEO_SRC = 'assets/Hero-mobile.mp4';
const MOBILE_POSTER_PREFERRED = 'assets/hero-poster-mobile.webp'; // à fournir : crop vertical 1080×1920 centré sur les corps
const MOBILE_POSTER_FALLBACK = 'assets/hero-studio.avif';
const DESKTOP_VIDEO_MP4 = 'assets/Hero.mp4';
const DESKTOP_VIDEO_WEBM = 'assets/Hero.webm'; // optionnel — sera ignoré si 404
const DESKTOP_POSTER = 'assets/hero-studio.avif';

const Hero = () => {
  const desktopVideoRef = React.useRef(null);
  const mobileVideoRef = React.useRef(null);

  // matchMedia mobile + reduced-motion — state choisi pour rendre la bonne
  // branche dès le premier paint (lazy initializer côté client).
  const getIsMobile = () =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  const getReduced = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [isMobile, setIsMobile] = React.useState(getIsMobile);
  const [reduced, setReduced] = React.useState(getReduced);

  React.useEffect(() => {
    const mqM = window.matchMedia('(max-width: 768px)');
    const mqR = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onM = (e) => setIsMobile(e.matches);
    const onR = (e) => setReduced(e.matches);
    (mqM.addEventListener ? mqM.addEventListener('change', onM) : mqM.addListener(onM));
    (mqR.addEventListener ? mqR.addEventListener('change', onR) : mqR.addListener(onR));
    return () => {
      (mqM.removeEventListener ? mqM.removeEventListener('change', onM) : mqM.removeListener(onM));
      (mqR.removeEventListener ? mqR.removeEventListener('change', onR) : mqR.removeListener(onR));
    };
  }, []);

  // Pause si reduced-motion active après le mount.
  React.useEffect(() => {
    if (!reduced) return;
    desktopVideoRef.current?.pause();
    mobileVideoRef.current?.pause();
  }, [reduced]);

  // Mobile : si une vidéo dédiée est disponible et reduced-motion off, on la
  // joue ; sinon fallback poster (img <-> hero-poster-mobile.webp, fallback
  // hero-studio.avif via onError).
  const showMobileVideo = isMobile && HAS_MOBILE_VIDEO && !reduced;
  const showMobileImage = isMobile && !showMobileVideo;
  const showDesktopVideo = !isMobile;

  const commonMediaStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'contrast(1.08) saturate(0.72) brightness(0.65)',
  };

  return (
    <section
      id="top"
      data-screen-label="01 Accueil"
      className="hero-section"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        overflow: 'hidden',
        background: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Desktop : vidéo 16:9 (montée uniquement en desktop pour éviter le download sur mobile) */}
      {showDesktopVideo && (
        <video
          ref={desktopVideoRef}
          autoPlay={!reduced}
          muted
          loop
          playsInline
          preload={reduced ? 'none' : 'metadata'}
          poster={DESKTOP_POSTER}
          aria-hidden="true"
          style={{ ...commonMediaStyle, objectPosition: '50% 50%' }}
        >
          {/* WebM en premier : le browser prend la première source qu'il sait décoder.
              Si Hero.webm n'existe pas, le navigateur passe silencieusement au mp4. */}
          <source src={DESKTOP_VIDEO_WEBM} type="video/webm" />
          <source src={DESKTOP_VIDEO_MP4} type="video/mp4" />
        </video>
      )}

      {/* Mobile : vidéo verticale dédiée si dispo */}
      {showMobileVideo && (
        <video
          ref={mobileVideoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={MOBILE_POSTER_PREFERRED}
          aria-hidden="true"
          style={{ ...commonMediaStyle, objectPosition: '50% 40%' }}
          onError={(e) => {
            // Si la vidéo mobile échoue, on bascule visuellement sur le poster
            // (l'image fallback est juste en dessous, masquée par la vidéo).
            e.currentTarget.style.display = 'none';
          }}
        >
          <source src={MOBILE_VIDEO_SRC} type="video/mp4" />
        </video>
      )}

      {/* Mobile : poster image (cadré sur les corps) */}
      {showMobileImage && (
        <img
          src={MOBILE_POSTER_PREFERRED}
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onError={(e) => {
            // Si le poster mobile custom n'existe pas, on retombe sur le poster desktop.
            if (!e.currentTarget.dataset.fallback) {
              e.currentTarget.dataset.fallback = '1';
              e.currentTarget.src = MOBILE_POSTER_FALLBACK;
            }
          }}
          style={{ ...commonMediaStyle, objectPosition: '50% 35%' }}
        />
      )}

      {/* Voile sombre cinéma — étalonné pour lisibilité du texte */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(10,9,8,0.78) 0%, rgba(10,9,8,0.42) 24%, rgba(10,9,8,0.55) 60%, rgba(10,9,8,0.95) 100%)',
        }}
      />

      {/* Halo braise par en bas — comme une forge qui couve sous le sol */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(70% 50% at 50% 112%, rgba(224,85,44,0.22), transparent 65%)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />

      {/* Bloc central — épuré : logo, H1 forge, H2 (Clermont-Ferrand mis en avant), CTA */}
      <div
        className="hero-stage"
        style={{
          position: 'relative',
          zIndex: 5,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'clamp(80px, 12vh, 140px) 24px clamp(40px, 8vh, 80px)',
          gap: 'clamp(16px, 2.4vh, 28px)',
        }}
      >
        <Reveal delay={80}>
          <img
            src="assets/logo.png?v=2"
            alt="De Feu et d'Acier — logo"
            className="hero-logo"
            style={{
              width: 'clamp(64px, 8vw, 110px)',
              height: 'auto',
              background: 'transparent',
            }}
          />
        </Reveal>

        <Reveal delay={200}>
          <h1
            className="display forge-title"
            style={{
              margin: 0,
              fontSize: 'clamp(48px, 10vw, 168px)',
              lineHeight: 0.88,
              letterSpacing: '-0.022em',
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

        <Reveal delay={360}>
          <h2 className="hero-h2">
            <span className="hero-h2-line">Arts Martiaux Historiques Européens</span>
            <span className="hero-h2-place">à Clermont-Ferrand</span>
          </h2>
        </Reveal>

        <Reveal delay={560}>
          <div className="hero-ctas">
            <a href="#rejoindre" className="btn hero-cta-primary">
              Venir essayer gratuitement
              <ArrowGlyph size={11} color="currentColor" />
            </a>
            <a href="#creneaux" className="btn btn--secondary">
              Voir les créneaux
              <ArrowGlyph size={11} color="currentColor" />
            </a>
          </div>
        </Reveal>
      </div>

      {/* Effet titre forge + responsive hero compact */}
      <style>{`
        .forge-title {
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
          filter:
            drop-shadow(0 4px 14px rgba(0,0,0,0.6))
            drop-shadow(0 12px 30px rgba(224,85,44,0.26))
            drop-shadow(0 0 90px rgba(224,85,44,0.16));
        }

        /* H2 hero : 2 lignes, "Clermont-Ferrand" mis en avant (ember, plus gros, capitales letter-spacing) */
        .hero-h2 {
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          max-width: 880px;
        }
        .hero-h2-line {
          font-family: var(--display);
          font-weight: 400;
          font-size: clamp(18px, 2.1vw, 26px);
          line-height: 1.3;
          color: var(--parch-soft);
          letter-spacing: 0;
        }
        .hero-h2-place {
          font-family: var(--display);
          font-weight: 500;
          font-style: italic;
          font-size: clamp(28px, 3.4vw, 48px);
          line-height: 1.1;
          color: var(--accent);
          letter-spacing: -0.005em;
        }

        .hero-ctas {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: clamp(8px, 1.6vh, 20px);
        }
        .hero-cta-primary {
          box-shadow:
            0 1px 0 rgba(255,255,255,0.08) inset,
            0 10px 32px -10px rgba(224, 85, 44, 0.7),
            0 0 0 0 rgba(224, 85, 44, 0.6);
          animation: hero-cta-pulse 2.8s var(--ease) infinite;
        }
        @keyframes hero-cta-pulse {
          0%, 100% { box-shadow: 0 1px 0 rgba(255,255,255,0.08) inset, 0 10px 32px -10px rgba(224, 85, 44, 0.7), 0 0 0 0 rgba(224, 85, 44, 0.4); }
          50%      { box-shadow: 0 1px 0 rgba(255,255,255,0.08) inset, 0 10px 32px -10px rgba(224, 85, 44, 0.85), 0 0 0 8px rgba(224, 85, 44, 0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
          .hero-cta-primary { animation: none !important; }
        }

        /* Responsive vertical : sur petit écran, on serre tout pour que les CTA restent visibles au-dessus du fold */
        @media (max-height: 720px) {
          .hero-logo { width: clamp(54px, 7vh, 90px) !important; }
        }
        @media (max-width: 900px) {
          .hero-stage { padding: 96px 22px 24px !important; }
        }
        @media (max-width: 640px) {
          .hero-h2 { gap: 6px; }
          .hero-h2-line { font-size: 14px; letter-spacing: 0.01em; }
          .hero-h2-place { font-size: 26px; }
          .hero-ctas {
            flex-direction: column !important;
            align-items: stretch !important;
            width: 100%;
            max-width: 320px;
            margin: 18px auto 0 !important;
          }
          .hero-ctas .btn { justify-content: center; min-height: 48px; }
        }
        /* Très petit écran vertical (téléphones bas/clavier ouvert) — réduit encore le H1 */
        @media (max-height: 600px) {
          .hero-logo { width: 48px !important; }
          .forge-title { font-size: clamp(38px, 8vw, 64px) !important; }
          .hero-stage { gap: 10px !important; padding-top: 80px !important; }
        }
      `}</style>
    </section>
  );
};

window.Hero = Hero;
