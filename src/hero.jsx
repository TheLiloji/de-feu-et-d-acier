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
  const content = window.useContent('hero') || {};
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
            src={content.logo}
            alt={content.logoAlt}
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
            className="display hero-brand"
            style={{
              margin: 0,
              fontSize: 'clamp(48px, 10vw, 168px)',
              lineHeight: 0.88,
              letterSpacing: '-0.022em',
              fontWeight: 500,
              color: 'var(--parch)',
            }}
          >
            {content.titleStart} <span className="brand-feu">{content.titleFeu}</span>
            <br />
            <span style={{ fontStyle: 'italic', fontWeight: 300, paddingLeft: '0.35em' }}>
              {content.titleConnector}
            </span>
            <span className="brand-acier">{content.titleAcier}</span>
          </h1>
        </Reveal>

        <Reveal delay={360}>
          <h2 className="hero-h2">
            <span className="hero-h2-line">{content.subtitleLine}</span>
            <span className="hero-h2-place">{content.subtitlePlace}</span>
          </h2>
        </Reveal>

        <Reveal delay={560}>
          <a
            href="#disciplines"
            className="hero-scroll-cue"
            aria-label="Faire défiler"
          >
            <span className="hero-scroll-line">
              <span className="hero-scroll-drop" />
            </span>
          </a>
        </Reveal>
      </div>

      {/* Responsive hero compact */}
      <style>{`
        /* "Feu" : dégradé vertical façon flamme (jaune chaud en bas → braise en haut) + halo qui respire */
        .brand-feu {
          background-image: linear-gradient(
            180deg,
            #6a1d0c 0%,
            #a83321 22%,
            #d24a26 48%,
            #ec6a32 72%,
            #ffb86a 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          filter: drop-shadow(0 0 18px rgba(232, 90, 40, 0.18));
          animation: brand-feu-breath 7.5s var(--ease) infinite;
        }
        @keyframes brand-feu-breath {
          0%, 100% { filter: drop-shadow(0 0 14px rgba(232, 90, 40, 0.14)); }
          50%      { filter: drop-shadow(0 0 26px rgba(232, 90, 40, 0.30)); }
        }

        /* "Acier" : dégradé acier brossé avec un reflet argenté qui balaie le mot */
        .brand-acier {
          background-image: linear-gradient(
            100deg,
            #5e6a75 0%,
            #5e6a75 35%,
            #b8c3cc 45%,
            #e3eaef 50%,
            #b8c3cc 55%,
            #5e6a75 65%,
            #5e6a75 100%
          );
          background-size: 260% 100%;
          background-position: 100% 0;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: brand-acier-sheen 5s var(--ease) infinite;
        }
        @keyframes brand-acier-sheen {
          0%   { background-position: 100% 0; }
          40%  { background-position: 0% 0; }
          100% { background-position: 0% 0; }
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

        /* Scroll cue : trait vertical fin avec segment lumineux qui descend en boucle */
        .hero-scroll-cue {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 16px;
          margin-top: clamp(12px, 2.4vh, 28px);
          opacity: 0.7;
          transition: opacity 240ms var(--ease);
        }
        .hero-scroll-cue:hover,
        .hero-scroll-cue:focus-visible {
          opacity: 1;
          outline: none;
        }
        .hero-scroll-line {
          position: relative;
          display: block;
          width: 1px;
          height: 56px;
          background: rgba(229, 217, 194, 0.22);
          overflow: hidden;
        }
        .hero-scroll-drop {
          position: absolute;
          left: 0;
          right: 0;
          top: -14px;
          height: 14px;
          background: linear-gradient(
            180deg,
            rgba(229, 217, 194, 0) 0%,
            var(--parch) 60%,
            rgba(229, 217, 194, 0) 100%
          );
          animation: hero-scroll-drop 2.4s var(--ease) infinite;
        }
        @keyframes hero-scroll-drop {
          0%   { transform: translateY(0); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(70px); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
          .hero-scroll-drop { animation: none !important; top: 50%; transform: translateY(-50%); opacity: 0.8; }
          .brand-feu { animation: none !important; filter: drop-shadow(0 0 16px rgba(232, 90, 40, 0.20)) !important; }
          .brand-acier { animation: none !important; background-position: 50% 0 !important; }
        }

        @media (max-height: 720px) {
          .hero-logo { width: clamp(54px, 7vh, 90px) !important; }
          .hero-scroll-line { height: 44px; }
        }
        @media (max-width: 900px) {
          .hero-stage { padding: 96px 22px 24px !important; }
        }
        @media (max-width: 640px) {
          .hero-h2 { gap: 6px; }
          .hero-h2-line { font-size: 14px; letter-spacing: 0.01em; }
          .hero-h2-place { font-size: 26px; }
        }
        /* Très petit écran vertical (téléphones bas/clavier ouvert) — réduit encore le H1 */
        @media (max-height: 600px) {
          .hero-logo { width: 48px !important; }
          .hero-brand { font-size: clamp(38px, 8vw, 64px) !important; }
          .hero-stage { gap: 10px !important; padding-top: 80px !important; }
        }
      `}</style>
    </section>
  );
};

window.Hero = Hero;
