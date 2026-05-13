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
        minHeight: '100vh',
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

      {/* Bloc central */}
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
          padding: '120px 24px 40px',
        }}
      >
        <Reveal delay={80}>
          <img
            src="assets/logo.png?v=2"
            alt="De Feu et d'Acier — logo"
            style={{
              width: 'clamp(78px, 9vw, 120px)',
              height: 'auto',
              marginBottom: 24,
              background: 'transparent',
            }}
          />
        </Reveal>

        <Reveal delay={200}>
          <h1
            className="display forge-title"
            style={{
              margin: 0,
              fontSize: 'clamp(54px, 11vw, 176px)',
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
          <h2
            className="hero-h2"
            style={{
              marginTop: 28,
              marginBottom: 0,
              fontFamily: 'var(--display)',
              fontWeight: 400,
              fontSize: 'clamp(20px, 2.4vw, 30px)',
              lineHeight: 1.3,
              color: 'var(--parch)',
              letterSpacing: '-0.005em',
              maxWidth: 820,
            }}
          >
            Arts Martiaux Historiques Européens
            {' '}
            <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>
              à Clermont-Ferrand
            </span>
          </h2>
        </Reveal>

        <Reveal delay={480}>
          <p
            className="hero-pitch"
            style={{
              margin: '20px auto 0',
              maxWidth: 700,
              fontSize: 'clamp(15px, 1.2vw, 17px)',
              lineHeight: 1.6,
              color: 'var(--parch-soft)',
            }}
          >
            On lit les sources, on prend la garde, on échange en assaut —
            <span style={{ color: 'var(--parch)' }}> sous masque et protections.</span>
            <br />
            <span className="hero-pitch-sub">
              Épée longue · rapière · épée de côté · messer · viking — Mardi &amp; Jeudi à Clermont-Ferrand.
            </span>
          </p>
        </Reveal>

        <Reveal delay={620}>
          <div
            className="hero-ctas"
            style={{
              display: 'flex',
              gap: 14,
              marginTop: 36,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <a href="#contact" className="btn btn--ember">
              Faire une séance d'essai
              <ArrowGlyph size={13} color="currentColor" />
            </a>
            <a href="#salle" className="btn btn--ghost">
              Voir les entraînements
              <ArrowGlyph size={13} color="currentColor" />
            </a>
          </div>
        </Reveal>
      </div>

      {/* Quick-info band ancré au bas du hero */}
      <Reveal delay={780}>
        <div
          className="hero-quickinfo"
          style={{
            position: 'relative',
            zIndex: 4,
            margin: '0 auto',
            padding: '22px 56px 80px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
            maxWidth: 1480,
            width: '100%',
            color: 'var(--parch)',
          }}
        >
          {[
            { l: 'Lieu', v: 'Gymnase Robert Pras', s: 'Clermont-Ferrand' },
            { l: 'Créneaux', v: 'Mardi & Jeudi', s: '18h — 22h' },
            { l: 'Adhésion', v: '85 € / an', s: 'saison 25-26' },
            { l: 'Accueil', v: 'Tous niveaux', s: 'matériel prêté' },
          ].map((it, i) => (
            <div
              key={it.l}
              className="hero-quickinfo-cell"
              style={{
                paddingTop: 18,
                borderTop: '1px solid rgba(236, 232, 222, 0.18)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--eyebrow)',
                  fontSize: 10.5,
                  letterSpacing: '0.26em',
                  textTransform: 'uppercase',
                  color: 'var(--parch-mute)',
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                {it.l}
              </div>
              <div
                style={{
                  fontFamily: 'var(--display)',
                  fontSize: 22,
                  lineHeight: 1.15,
                  color: 'var(--parch)',
                  marginBottom: 2,
                }}
              >
                {it.v}
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  color: 'var(--parch-mute)',
                  letterSpacing: '0.02em',
                }}
              >
                {it.s}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Indicateur de scroll discret */}
      <a
        href="#firststeps"
        aria-label="Faire défiler"
        className="hero-scroll"
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 18,
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          color: 'var(--parch-soft)',
          zIndex: 4,
          fontFamily: 'var(--eyebrow)',
          fontSize: 9.5,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          fontWeight: 500,
        }}
      >
        <span
          aria-hidden="true"
          className="hero-scroll-line"
          style={{
            width: 1,
            height: 30,
            background: 'currentColor',
            display: 'block',
          }}
        />
      </a>

      {/* Effet titre forge */}
      <style>{`
        .hero-pitch-sub {
          display: inline-block;
          margin-top: 8px;
          font-family: var(--eyebrow);
          font-size: 11.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--parch-mute);
          font-weight: 500;
        }
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
        .hero-scroll-line { animation: scroll-tick 2.6s var(--ease) infinite; }
        .hero-scroll:hover { color: var(--parch); }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
          .hero-scroll-line { animation: none; opacity: 0.5; }
        }
        @media (max-width: 1100px) {
          .hero-quickinfo { padding: 22px 32px 72px !important; }
        }
        @media (max-width: 900px) {
          .hero-section { min-height: auto !important; }
          .hero-stage { padding: 96px 22px 24px !important; }
          .hero-quickinfo {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
            padding: 4px 22px 80px !important;
          }
        }
        @media (max-width: 640px) {
          /* Compacter le hero pour faire entrer les CTA au-dessus du fold sur smartphones */
          .hero-stage img[alt^="De Feu"] { margin-bottom: 18px !important; }
          .hero-h2 { font-size: 18px !important; line-height: 1.35 !important; margin-top: 22px !important; }
          .hero-pitch { font-size: 14.5px !important; line-height: 1.55 !important; }
          .hero-pitch-sub { font-size: 10px !important; letter-spacing: 0.14em !important; }
          .hero-ctas { flex-direction: column !important; align-items: stretch !important; width: 100%; max-width: 320px; margin: 28px auto 0 !important; }
          .hero-ctas .btn { justify-content: center; min-height: 48px; }
          .hero-quickinfo-cell { padding-top: 12px !important; }
          .hero-quickinfo-cell > div:nth-child(2) { font-size: 18px !important; line-height: 1.2 !important; }
          .hero-quickinfo-cell > div:nth-child(3) { font-size: 11.5px !important; }
        }
      `}</style>
    </section>
  );
};

window.Hero = Hero;
