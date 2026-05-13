// Main app — assembles all sections, manages tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#e0552c",
  "heroVariant": "studio",
  "showTreatise": true,
  "italicAccent": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [scrolled, setScrolled] = React.useState(false);

  // Apply accent color through CSS variable
  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', tweaks.accent);
  }, [tweaks.accent]);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <SectionsStyles />
      <ContactStyles />
      <Nav scrolled={scrolled} />
      <Hero />
      <FirstSteps />
      <Manifesto />
      <Club />
      <Encadrement />
      <Disciplines />
      <Salle />
      <Tournois />
      <Galerie />
      <Identite />
      <Contact />
      <LegalNotes />
      <Footer />

      <TweaksPanel title="Tweaks · D.F.D.A">
        <TweakSection label="Identité">
          <TweakColor
            label="Accent"
            value={tweaks.accent}
            options={['#e0552c', '#c84030', '#5d7c93', '#d8a13a', '#8a6f5d']}
            onChange={(v) => setTweak('accent', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
