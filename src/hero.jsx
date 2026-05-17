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
        height: '100svh',
        maxHeight: '100svh',
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
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'clamp(40px, 8vh, 120px) 24px clamp(28px, 5vh, 64px)',
          gap: 'clamp(8px, 1.6vh, 24px)',
        }}
      >
        <Reveal delay={80}>
          <img
            src={content.logo}
            alt={content.logoAlt}
            className="hero-logo"
            style={{
              width: 'clamp(40px, 7vmin, 110px)',
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
              fontSize: 'clamp(34px, 10vmin, 168px)',
              lineHeight: 0.92,
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

        {content.ctaLabel && (
          <Reveal delay={520}>
            <a
              href={content.ctaHref || '#creneaux'}
              className="btn btn--secondary hero-cta"
            >
              <span>{content.ctaLabel}</span>
              <ArrowGlyph size={11} color="currentColor" />
            </a>
          </Reveal>
        )}

      </div>

      {/* Scroll cue — suggestion discrète, pas une CTA. Chevron flèche fin
          + label minuscule en dessous, le tout à faible opacité. Devient
          un peu plus présent au hover/focus. PAS enrobé dans <Reveal> car
          le rootMargin de useReveal exclut le bas de la viewport. */}
      <a
        href="#disciplines"
        className="hero-scroll-cue"
        aria-label={content.scrollLabel || 'Découvrir le club'}
      >
        <svg
          className="hero-scroll-arrow"
          viewBox="0 0 24 14"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M2 2 L12 12 L22 2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="hero-scroll-label">
          {content.scrollLabel || 'Découvrir le club'}
        </span>
      </a>

      {/* Responsive hero compact */}
      <style>{`
        /* Le hero gère son propre padding via .hero-stage ; on neutralise
           la règle générique "section { padding: ... }" appliquée aux autres sections. */
        .hero-section { padding: 0 !important; }

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

        /* H2 hero : 2 lignes. Toutes les tailles scalent en vmin pour
           garantir que le contenu rétrécit en landscape mobile. */
        .hero-h2 {
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(2px, 0.6vh, 8px);
          max-width: 880px;
        }
        .hero-h2-line {
          font-family: var(--display);
          font-weight: 400;
          font-size: clamp(13px, 2.2vmin + 0.4vw, 26px);
          line-height: 1.25;
          color: var(--parch-soft);
          letter-spacing: 0;
        }
        .hero-h2-place {
          font-family: var(--display);
          font-weight: 500;
          font-style: italic;
          font-size: clamp(20px, 3.8vmin + 0.6vw, 48px);
          line-height: 1.1;
          color: var(--accent);
          letter-spacing: -0.005em;
        }

        /* CTA hero — bouton outlined sobre. Le scroll-cue ci-dessous porte
           l'invitation dominante. Pas d'animation ostentatoire ici. */
        .hero-cta {
          padding: 0 clamp(16px, 3vw, 30px);
          min-height: clamp(38px, 6.5vh, 50px);
          font-size: clamp(10px, 1.5vmin + 0.3vw, 12px);
          letter-spacing: 0.18em;
          font-weight: 500;
          white-space: nowrap;
          /* hérite btn--secondary : border parch, fond transparent */
        }

        /* Scroll cue — suggestion discrète. Chevron flèche en haut + label
           minuscule en dessous, le tout à faible opacité. Hover/focus le
           ramène à pleine opacité. Animation ponctuelle (un "nudge" du
           chevron toutes les 3.6s) pour rester suggéré sans agressivité. */
        .hero-scroll-cue {
          position: absolute;
          bottom: clamp(18px, 3vh, 36px);
          left: 50%;
          transform: translateX(-50%);
          z-index: 6;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          opacity: 0.45;
          color: var(--parch-soft);
          transition: opacity 280ms var(--ease), transform 280ms var(--ease);
          text-decoration: none;
        }
        .hero-scroll-cue:hover,
        .hero-scroll-cue:focus-visible {
          opacity: 1;
          transform: translateX(-50%) translateY(2px);
          outline: none;
        }
        .hero-scroll-arrow {
          display: block;
          width: clamp(16px, 2.4vmin, 22px);
          height: auto;
          color: currentColor;
          animation: hero-scroll-arrow-nudge 3.6s var(--ease) infinite;
        }
        @keyframes hero-scroll-arrow-nudge {
          0%, 70%, 100% { transform: translateY(0); opacity: 1; }
          85%           { transform: translateY(4px); opacity: 0.7; }
        }
        .hero-scroll-label {
          font-family: var(--eyebrow);
          font-size: clamp(8.5px, 1vmin + 0.1vw, 10px);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: currentColor;
          font-weight: 400;
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
          .hero-scroll-arrow { animation: none !important; }
          .brand-feu { animation: none !important; filter: drop-shadow(0 0 16px rgba(232, 90, 40, 0.20)) !important; }
          .brand-acier { animation: none !important; background-position: 50% 0 !important; }
        }

        /* Hauteurs restreintes : sous 520px on masque le label (chevron seul),
           sous 380px on cache complètement le cue car il chevaucherait le CTA. */
        @media (max-height: 520px) {
          .hero-scroll-label { display: none; }
          .hero-scroll-cue { bottom: 8px; gap: 0; padding: 4px 12px; }
        }
        @media (max-height: 380px) {
          .hero-scroll-cue { display: none; }
        }
        @media (max-width: 360px) {
          .hero-cta { letter-spacing: 0.12em; }
        }
      `}</style>
    </section>
  );
};

window.Hero = Hero;
