// SECTIONS — Club, Manifesto, Disciplines, Salle d'armes, Tournois, Galerie, Identité

// ───────────────────────────────────────────────────────────────────
// MANIFESTO — treatise drawing right, large pull-quote left.
// Editorial spread feel, alludes to historical sources.
// ───────────────────────────────────────────────────────────────────
const Manifesto = () => (
  <section
    id="manifesto"
    data-screen-label="02 Manifeste"
    style={{
      position: 'relative',
      padding: '160px 0 180px',
      background: 'var(--ink)',
    }}
  >
    <div className="container">
      <Reveal>
        <SectionLabel number={1} name="Manifeste" />
      </Reveal>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.85fr',
          gap: 120,
          alignItems: 'start',
        }}
      >
        <div>
          <Reveal>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(48px, 5.2vw, 84px)',
                lineHeight: 0.96,
                marginBottom: 48,
                maxWidth: 760,
              }}
            >
              Le geste juste,
              <br />
              avant le costume.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <p
              className="lede"
              style={{
                fontSize: 24,
                lineHeight: 1.4,
                maxWidth: 680,
                marginBottom: 40,
                color: 'var(--parch-soft)',
              }}
            >
              On étudie les arts martiaux européens à partir des traités
              et sources historiques, dans une pratique moderne, sportive
              et sécurisée. On y vient pour le geste, pas pour le costume.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                maxWidth: 600,
                color: 'var(--parch-mute)',
                marginBottom: 56,
              }}
            >
              Ici on s'entraîne en tenue de sport, masque d'escrime et
              protections modernes, avec des armes d'entraînement adaptées
              à chaque discipline. Les sources anciennes ne sont pas un
              décor — elles sont la partition que l'on lit, que l'on
              questionne, et qu'on éprouve sur le tapis.
            </p>
          </Reveal>

          {/* Marginalia — disciplines pratiquées au club */}
          <Reveal delay={260}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                rowGap: 22,
                columnGap: 40,
                paddingTop: 32,
                borderTop: '1px solid var(--parch-line)',
                maxWidth: 600,
              }}
            >
              {[
                ['Mardi',  'Épée longue · rapière · messer · viking'],
                ['Jeudi',  'Épée longue · épée de côté'],
                ['Libre',  'Pratique sans encadrant le jeudi soir'],
                ['Saison', 'Tournois FFAMHE & rencontres interclubs'],
              ].map(([year, title]) => (
                <React.Fragment key={year}>
                  <div
                    style={{
                      fontFamily: 'var(--eyebrow)',
                      fontSize: 10.5,
                      letterSpacing: '0.28em',
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {year}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--display)',
                      fontStyle: 'italic',
                      fontSize: 19,
                      color: 'var(--parch)',
                      lineHeight: 1.3,
                    }}
                  >
                    {title}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right column — treatise drawing in a parchment-toned frame */}
        <Reveal delay={150}>
          <figure
            style={{
              margin: 0,
              position: 'relative',
              padding: 24,
              background:
                'linear-gradient(180deg, rgba(236,227,207,0.05), rgba(236,227,207,0.02))',
              border: '1px solid var(--parch-line)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 14,
                left: 14,
                right: 14,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'var(--eyebrow)',
                fontSize: 9,
                letterSpacing: '0.3em',
                color: 'var(--parch-mute)',
                textTransform: 'uppercase',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              <span>Folio · Planche XIV</span>
              <Diamond size={4} color="var(--accent)" />
            </div>
            <div
              style={{
                background: '#efe4c4',
                padding: 0,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                src="assets/treatise.jpg"
                alt="Planche issue d'un traité d'escrime médiévale"
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  filter: 'sepia(0.15) contrast(1.05)',
                }}
              />
            </div>
            <figcaption
              style={{
                marginTop: 18,
                fontFamily: 'var(--display)',
                fontStyle: 'italic',
                fontSize: 14.5,
                lineHeight: 1.5,
                color: 'var(--parch-mute)',
              }}
            >
              Planche extraite d'un traité d'escrime ancien. Étude des
              gardes, des distances, du timing — autant de gestes que l'on
              cherche à comprendre, puis à éprouver dans la salle.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────
// CLUB — full-width with split image and intro
// ───────────────────────────────────────────────────────────────────
const Club = () => (
  <section
    id="club"
    data-screen-label="03 Le Club"
    style={{
      position: 'relative',
      padding: '160px 0 180px',
      background: 'var(--coal)',
      borderTop: '1px solid var(--parch-line)',
    }}
  >
    <div className="container">
      <Reveal>
        <SectionLabel number={2} name="Le Club" />
      </Reveal>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '0.85fr 1.15fr',
          gap: 80,
          alignItems: 'center',
          marginBottom: 100,
        }}
      >
        <Reveal>
          <div>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(48px, 5.2vw, 80px)',
                lineHeight: 0.96,
                marginBottom: 28,
              }}
            >
              Une bande
              <br />
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'var(--accent)',
                }}
              >
                d'escrimeurs,
              </em>
              <br />
              une école.
            </h2>
            <p
              style={{
                fontSize: 16.5,
                lineHeight: 1.7,
                color: 'var(--parch-mute)',
                maxWidth: 520,
                margin: 0,
              }}
            >
              Section AMHE de l'USAM Clermont-Ferrand, affiliée à la
              FFAMHE, le club accueille débutants et pratiquants
              confirmés, en loisir comme en compétition. Encadrement
              assuré par Gabriel Tardio. La salle est ouverte à toutes et
              tous, et l'on prend le temps de bien faire les choses.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <Photo
            src="assets/team-track.webp"
            alt="L'équipe sur la piste"
            focal="50% 40%"
            style={{ aspectRatio: '16/10', width: '100%' }}
          />
        </Reveal>
      </div>

      {/* Pillars */}
      <Reveal delay={150}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
            borderTop: '1px solid var(--parch-line)',
            borderBottom: '1px solid var(--parch-line)',
          }}
        >
          {[
            {
              n: '01',
              title: 'Source',
              body: 'Étude des textes et traités historiques. Lecture, mise en pratique, reconstitution martiale des gestes anciens.',
            },
            {
              n: '02',
              title: 'Geste',
              body: 'Technique structurée par le drill, le sentiment du fer, et la mise en pratique en assaut libre.',
            },
            {
              n: '03',
              title: 'Salle',
              body: 'Un esprit d\'école d\'armes : exigence sportive, respect du partenaire, et progression à son rythme.',
            },
          ].map((p, i) => (
            <div
              key={p.n}
              style={{
                padding: '52px 44px',
                borderLeft:
                  i > 0 ? '1px solid var(--parch-line)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  fontFamily: 'var(--eyebrow)',
                  fontSize: 10.5,
                  letterSpacing: '0.32em',
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                }}
              >
                <span>{p.n}</span>
                <span
                  style={{
                    width: 28,
                    height: 1,
                    background: 'var(--accent)',
                    display: 'inline-block',
                  }}
                />
              </div>
              <div
                className="display"
                style={{
                  fontSize: 40,
                  lineHeight: 1,
                  fontWeight: 400,
                  fontStyle: 'italic',
                }}
              >
                {p.title}.
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 14.5,
                  lineHeight: 1.65,
                  color: 'var(--parch-mute)',
                  maxWidth: 320,
                }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────
// DISCIPLINES — 4 large interactive cards in a row
// Hover expands to reveal details about the weapon system
// ───────────────────────────────────────────────────────────────────
const Disciplines = () => {
  const [active, setActive] = React.useState('longue');
  const disciplines = [
    {
      id: 'longue',
      n: '01',
      name: 'Épée longue',
      sub: 'Arme emblématique des AMHE',
      era: 'Médiévale',
      desc: 'Pratiquée à deux mains, l\'épée longue est l\'arme emblématique des AMHE médiévales. Travail de garde, de pointe et d\'entrée au corps.',
      img: 'assets/duel-reflection.webp',
      focal: '60% 50%',
    },
    {
      id: 'rapiere',
      n: '02',
      name: 'Rapière',
      sub: 'Escrime de la Renaissance',
      era: 'Renaissance',
      desc: 'Arme plus tardive, liée à l\'escrime de la Renaissance et de l\'époque moderne. Jeu de pointe fin, distance, et déplacement précis.',
      img: 'assets/duel-blue.webp',
      focal: '65% 50%',
    },
    {
      id: 'messer',
      n: '03',
      name: 'Messer',
      sub: 'Grand couteau de combat',
      era: 'Médiévale',
      desc: 'Arme médiévale germanique, proche d\'un grand couteau de combat à un tranchant. Système populaire mêlant escrime et lutte rapprochée.',
      img: 'assets/kit-still-life.webp',
      focal: '60% 50%',
    },
    {
      id: 'cote',
      n: '04',
      name: 'Épée de côté',
      sub: 'Du Moyen Âge à la Renaissance',
      era: 'Transition',
      desc: 'Arme de transition entre le Moyen Âge tardif et la Renaissance. À une main, polyvalente, elle annonce les escrimes de l\'âge moderne.',
      img: 'assets/sparring.jpg',
      focal: '50% 30%',
    },
    {
      id: 'viking',
      n: '05',
      name: 'Combat viking',
      sub: 'Bouclier & arme courte',
      era: 'Haut Moyen Âge',
      desc: 'Pratique inspirée des traditions martiales anciennes, avec bouclier et armes adaptées selon les cours. Jeu de pression, contact, contrôle.',
      img: 'assets/group-gym.jpg',
      focal: '50% 40%',
    },
  ];
  return (
    <section
      id="disciplines"
      data-screen-label="04 Disciplines"
      style={{
        position: 'relative',
        padding: '160px 0 0',
        background: 'var(--ink)',
        borderTop: '1px solid var(--parch-line)',
      }}
    >
      <div className="container" style={{ marginBottom: 64 }}>
        <Reveal>
          <SectionLabel number={3} name="Les disciplines" />
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'end',
          }}
        >
          <Reveal>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(48px, 5.2vw, 84px)',
                lineHeight: 0.96,
                margin: 0,
              }}
            >
              Cinq armes,
              <br />
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'var(--accent)',
                }}
              >
                cinq grammaires.
              </em>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.7,
                color: 'var(--parch-mute)',
                maxWidth: 460,
                justifySelf: 'end',
              }}
            >
              On peut tout pratiquer, on peut se spécialiser. Chaque arme
              ouvre une école de pensée et un répertoire technique
              distincts, étalés sur plusieurs siècles.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Card row — full bleed */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 0,
          width: '100%',
          height: 620,
          borderTop: '1px solid var(--parch-line)',
        }}
      >
        {disciplines.map((d) => {
          const isActive = active === d.id;
          return (
            <div
              key={d.id}
              onMouseEnter={() => setActive(d.id)}
              onFocus={() => setActive(d.id)}
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
              style={{
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                borderRight:
                  d.id !== 'viking' ? '1px solid var(--parch-line)' : 'none',
                transition: 'flex 320ms cubic-bezier(0.2,0.7,0.3,1)',
                outline: 'none',
                background: 'var(--coal)',
              }}
            >
              <img
                src={d.img}
                alt={d.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: d.focal,
                  filter: isActive
                    ? 'grayscale(0) contrast(1.05) brightness(0.95)'
                    : 'grayscale(0.85) contrast(1.0) brightness(0.55)',
                  transition: 'filter 320ms, transform 600ms cubic-bezier(0.2,0.7,0.3,1)',
                  transform: isActive ? 'scale(1.04)' : 'scale(1.0)',
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: isActive
                    ? 'linear-gradient(180deg, rgba(8,7,10,0.05) 0%, rgba(8,7,10,0.4) 50%, rgba(8,7,10,0.95) 100%)'
                    : 'linear-gradient(180deg, rgba(8,7,10,0.3) 0%, rgba(8,7,10,0.7) 60%, rgba(8,7,10,0.95) 100%)',
                  transition: 'background 320ms',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  padding: '40px 36px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--eyebrow)',
                      fontSize: 10.5,
                      letterSpacing: '0.32em',
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {d.n}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--eyebrow)',
                      fontSize: 9.5,
                      letterSpacing: '0.32em',
                      color: 'var(--parch-mute)',
                      textTransform: 'uppercase',
                      textAlign: 'right',
                    }}
                  >
                    {d.era}
                  </div>
                </div>

                <div>
                  <div
                    className="display"
                    style={{
                      fontSize: 48,
                      lineHeight: 0.96,
                      marginBottom: 8,
                      fontWeight: 400,
                    }}
                  >
                    {d.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--display)',
                      fontStyle: 'italic',
                      fontSize: 18,
                      color: 'var(--parch-mute)',
                      marginBottom: 22,
                    }}
                  >
                    {d.sub}
                  </div>
                  <div
                    style={{
                      maxHeight: isActive ? 200 : 0,
                      opacity: isActive ? 1 : 0,
                      overflow: 'hidden',
                      transition:
                        'max-height 320ms cubic-bezier(0.2,0.7,0.3,1), opacity 240ms',
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 1,
                        background: 'var(--accent)',
                        marginBottom: 16,
                      }}
                    />
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        lineHeight: 1.65,
                        color: 'var(--parch-soft)',
                      }}
                    >
                      {d.desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────
// SALLE D'ARMES — proper weekly grid of training sessions
// ───────────────────────────────────────────────────────────────────
const Salle = () => {
  const slots = [
    { day: 'Mar', time: '18h00 — 20h00', disc: 'Épée longue · rapière · messer · viking', lvl: 'Tous niveaux',   loc: 'Gymnase Robert Pras' },
    { day: 'Jeu', time: '18h00 — 20h00', disc: 'Pratique libre',                          lvl: 'Sans encadrant', loc: 'Gymnase Robert Pras' },
    { day: 'Jeu', time: '20h00 — 22h00', disc: 'Épée longue · épée de côté',              lvl: 'Tous niveaux',   loc: 'Gymnase Robert Pras' },
  ];

  return (
    <section
      id="salle"
      data-screen-label="05 Salle d'armes"
      style={{
        position: 'relative',
        padding: '160px 0 180px',
        background: 'var(--coal)',
        borderTop: '1px solid var(--parch-line)',
      }}
    >
      <div className="container">
        <Reveal>
          <SectionLabel number={4} name="Salle d'armes" />
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'end',
            marginBottom: 80,
          }}
        >
          <Reveal>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(48px, 5.2vw, 84px)',
                lineHeight: 0.96,
                margin: 0,
              }}
            >
              Trois créneaux
              <br />
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'var(--accent)',
                }}
              >
                par semaine.
              </em>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.7,
                color: 'var(--parch-mute)',
                maxWidth: 440,
                justifySelf: 'end',
              }}
            >
              Première séance possible après contact avec le club —
              tenue de sport, chaussures propres pour le gymnase, bouteille
              d'eau. Le matériel d'initiation peut être prêté.
            </p>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div
            style={{
              borderTop: '1px solid var(--parch-line)',
              borderBottom: '1px solid var(--parch-line)',
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '80px 200px 1.4fr 1fr 1.3fr 60px',
                padding: '18px 0',
                borderBottom: '1px solid var(--parch-line)',
                alignItems: 'center',
                gap: 24,
              }}
            >
              {['Jour', 'Horaire', 'Discipline', 'Niveau', 'Lieu', ''].map((h, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: 'var(--eyebrow)',
                    fontSize: 10,
                    letterSpacing: '0.32em',
                    color: 'var(--parch-mute)',
                    textTransform: 'uppercase',
                  }}
                >
                  {h}
                </div>
              ))}
            </div>

            {slots.map((s, i) => (
              <SlotRow key={i} slot={s} />
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div
            style={{
              marginTop: 56,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: 32,
              flexWrap: 'wrap',
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--display)',
                fontStyle: 'italic',
                fontSize: 18,
                lineHeight: 1.5,
                color: 'var(--parch-mute)',
                maxWidth: 580,
              }}
            >
              Gymnase Robert Pras — 3 rue Jean Monnet, 63100
              Clermont-Ferrand. Vérifiez les horaires avant de venir
              pour une première séance.
            </p>
            <a
              href="#contact"
              className="btn btn--ghost"
              style={{ flexShrink: 0 }}
            >
              Nous contacter avant de venir
              <ArrowGlyph size={12} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const SlotRow = ({ slot }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 200px 1.4fr 1fr 1.3fr 60px',
        padding: '26px 0',
        alignItems: 'center',
        gap: 24,
        borderBottom: '1px solid var(--parch-line)',
        position: 'relative',
        transition: 'background 200ms',
        background: hover ? 'rgba(236, 227, 207, 0.025)' : 'transparent',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--display)',
          fontStyle: 'italic',
          fontSize: 22,
          color: 'var(--accent)',
          lineHeight: 1,
        }}
      >
        {slot.day}.
      </div>
      <div
        style={{
          fontFamily: 'var(--display)',
          fontSize: 22,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          color: 'var(--parch)',
        }}
      >
        {slot.time}
      </div>
      <div
        style={{
          fontFamily: 'var(--display)',
          fontSize: 22,
          lineHeight: 1,
          color: 'var(--parch)',
        }}
      >
        {slot.disc}
      </div>
      <div
        style={{
          fontFamily: 'var(--eyebrow)',
          fontSize: 10.5,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--parch-mute)',
        }}
      >
        {slot.lvl}
      </div>
      <div
        style={{
          fontFamily: 'var(--body)',
          fontSize: 13.5,
          color: 'var(--parch-soft)',
        }}
      >
        {slot.loc}
      </div>
      <div
        style={{
          textAlign: 'right',
          color: hover ? 'var(--accent)' : 'var(--parch-mute)',
          transition: 'color 200ms, transform 200ms',
          transform: hover ? 'translateX(4px)' : 'translateX(0)',
        }}
      >
        <ArrowGlyph size={14} color="currentColor" />
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────
// TOURNOIS — events with podium photo and editorial list
// ───────────────────────────────────────────────────────────────────
const Tournois = () => {
  const events = [
    {
      date: 'Annuel', year: 'FFAMHE',
      title: 'La Bravade',
      type: 'Tournoi AMHE',
      city: 'Événement référencé',
      desc: 'Rendez-vous récurrent du circuit AMHE auquel le club participe régulièrement. Épreuves variées selon les éditions.',
      tag: 'Tournoi',
    },
    {
      date: 'Saison', year: 'FFAMHE',
      title: 'Tournois fédéraux',
      type: 'Circuit FFAMHE',
      city: 'France',
      desc: 'Compétitions officielles ouvertes aux licenciés : épée longue (open, débutant, féminin), épée seule, épée de côté, rapière.',
      tag: 'Fédéral',
    },
    {
      date: 'Toute l\'année', year: 'AMHE',
      title: 'Stages & rencontres interclubs',
      type: 'Inter-clubs · stages',
      city: 'France',
      desc: 'Échanges réguliers avec d\'autres clubs AMHE, stages techniques et rencontres conviviales — la compétition n\'est pas obligatoire.',
      tag: 'Interclubs',
    },
  ];

  return (
    <section
      id="tournois"
      data-screen-label="06 Tournois"
      style={{
        position: 'relative',
        padding: '160px 0 180px',
        background: 'var(--ink)',
        borderTop: '1px solid var(--parch-line)',
      }}
    >
      <div className="container">
        <Reveal>
          <SectionLabel number={5} name="Tournois & saison" />
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '0.85fr 1.15fr',
            gap: 80,
            marginBottom: 100,
            alignItems: 'end',
          }}
        >
          <Reveal>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(48px, 5.2vw, 84px)',
                lineHeight: 0.96,
                margin: 0,
              }}
            >
              Saison
              <br />
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'var(--accent)',
                }}
              >
                de compétition.
              </em>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.7,
                color: 'var(--parch-mute)',
                maxWidth: 520,
                justifySelf: 'end',
              }}
            >
              Le club est présent sur le circuit FFAMHE et référencé sur
              HEMA Ratings. La compétition reste un choix : on peut
              pratiquer en loisir ou viser les tournois, à son rythme.
            </p>
          </Reveal>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.6fr',
            gap: 56,
            alignItems: 'start',
          }}
        >
          <Reveal>
            <Photo
              src="assets/podium.jpg"
              alt="Podium FFAMHE"
              focal="50% 30%"
              style={{ aspectRatio: '3/4', width: '100%' }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, transparent 50%, rgba(8,7,10,0.92) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 28,
                  right: 28,
                  bottom: 28,
                }}
              >
                <Eyebrow>Compétiteurs</Eyebrow>
                <div
                  className="display"
                  style={{
                    marginTop: 14,
                    fontSize: 28,
                    lineHeight: 1.05,
                  }}
                >
                  Plusieurs membres du club engagés en compétition,
                  référencés sur HEMA Ratings.
                </div>
              </div>
            </Photo>
          </Reveal>

          <Reveal delay={150}>
            <div>
              {events.map((e, i) => (
                <EventRow key={i} event={e} index={i} last={i === events.length - 1} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const EventRow = ({ event, index, last }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '180px 1fr auto',
        gap: 40,
        padding: '40px 0',
        borderTop: index === 0 ? '1px solid var(--parch-line)' : 'none',
        borderBottom: '1px solid var(--parch-line)',
        alignItems: 'start',
        position: 'relative',
        transition: 'all 220ms',
      }}
    >
      <div>
        <div
          style={{
            fontFamily: 'var(--eyebrow)',
            fontSize: 10,
            letterSpacing: '0.32em',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          {event.year}
        </div>
        <div
          className="display"
          style={{
            fontSize: 30,
            lineHeight: 1.05,
            fontStyle: 'italic',
          }}
        >
          {event.date}
        </div>
      </div>
      <div>
        <div
          style={{
            fontFamily: 'var(--eyebrow)',
            fontSize: 10,
            letterSpacing: '0.28em',
            color: 'var(--parch-mute)',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          {event.type} · {event.city}
        </div>
        <div
          className="display"
          style={{
            fontSize: 38,
            lineHeight: 1.05,
            marginBottom: 14,
          }}
        >
          {event.title}
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 14.5,
            lineHeight: 1.65,
            color: 'var(--parch-mute)',
            maxWidth: 560,
          }}
        >
          {event.desc}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 24,
          paddingTop: 6,
        }}
      >
        <span
          style={{
            padding: '8px 14px',
            border: '1px solid var(--parch-line)',
            fontFamily: 'var(--eyebrow)',
            fontSize: 9.5,
            letterSpacing: '0.28em',
            color: 'var(--parch-soft)',
            textTransform: 'uppercase',
          }}
        >
          {event.tag}
        </span>
        <span
          style={{
            color: hover ? 'var(--accent)' : 'var(--parch-mute)',
            transition: 'color 220ms, transform 220ms',
            transform: hover ? 'translateX(6px)' : 'translateX(0)',
          }}
        >
          <ArrowGlyph size={18} color="currentColor" />
        </span>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────
// GALERIE — masonry-ish grid with real photos
// ───────────────────────────────────────────────────────────────────
const Galerie = () => (
  <section
    id="galerie"
    data-screen-label="07 Galerie"
    style={{
      position: 'relative',
      padding: '160px 0 180px',
      background: 'var(--coal)',
      borderTop: '1px solid var(--parch-line)',
    }}
  >
    <div className="container">
      <Reveal>
        <SectionLabel number={6} name="Galerie" />
      </Reveal>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          marginBottom: 80,
          alignItems: 'end',
        }}
      >
        <Reveal>
          <h2
            className="display"
            style={{
              fontSize: 'clamp(48px, 5.2vw, 84px)',
              lineHeight: 0.96,
              margin: 0,
            }}
          >
            Quelques
            <br />
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--accent)',
              }}
            >
              images de salle.
            </em>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <a
            href="https://www.facebook.com/63AMHE/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--ghost"
            style={{ justifySelf: 'end' }}
          >
            Voir sur Facebook
            <ArrowGlyph size={12} />
          </a>
        </Reveal>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridAutoRows: '160px',
          gap: 12,
        }}
      >
        <Reveal style={{ gridColumn: 'span 7', gridRow: 'span 3' }}>
          <Photo
            src="assets/duel-reflection.webp"
            alt="Combat sur piste avec reflet dans une flaque"
            focal="50% 50%"
            style={{ width: '100%', height: '100%' }}
          />
        </Reveal>
        <Reveal delay={50} style={{ gridColumn: 'span 5', gridRow: 'span 2' }}>
          <Photo
            src="assets/team-track.webp"
            alt="Équipe sur la piste d'athlétisme"
            focal="50% 50%"
            style={{ width: '100%', height: '100%' }}
          />
        </Reveal>
        <Reveal delay={100} style={{ gridColumn: 'span 5', gridRow: 'span 2' }}>
          <Photo
            src="assets/kit-still-life.webp"
            alt="Équipement et longue épée disposés au sol"
            focal="50% 50%"
            style={{ width: '100%', height: '100%' }}
          />
        </Reveal>
        <Reveal delay={150} style={{ gridColumn: 'span 4', gridRow: 'span 3' }}>
          <Photo
            src="assets/group-gym.jpg"
            alt="Photo de groupe en gymnase après un événement"
            focal="50% 40%"
            style={{ width: '100%', height: '100%' }}
          />
        </Reveal>
        <Reveal delay={200} style={{ gridColumn: 'span 4', gridRow: 'span 3' }}>
          <Photo
            src="assets/sparring.jpg"
            alt="Assaut en salle, longue épée"
            focal="50% 30%"
            style={{ width: '100%', height: '100%' }}
          />
        </Reveal>
        <Reveal delay={250} style={{ gridColumn: 'span 4', gridRow: 'span 3' }}>
          <Photo
            src="assets/duel-blue.webp"
            alt="Garde en doublet bleu"
            focal="60% 50%"
            style={{ width: '100%', height: '100%' }}
          />
        </Reveal>
      </div>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────
// IDENTITÉ — wide Clermont-Ferrand cinematic strip
// ───────────────────────────────────────────────────────────────────
const Identite = () => (
  <section
    id="identite"
    data-screen-label="08 Clermont"
    style={{
      position: 'relative',
      padding: 0,
      background: 'var(--ink)',
      borderTop: '1px solid var(--parch-line)',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        position: 'relative',
        minHeight: 640,
        background:
          'radial-gradient(ellipse at 30% 50%, rgba(200,64,48,0.18), transparent 55%), linear-gradient(180deg, var(--ink), #15110e)',
      }}
    >
      {/* Mountain silhouette */}
      <svg
        viewBox="0 0 1600 400"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '55%',
          opacity: 0.55,
        }}
      >
        <defs>
          <linearGradient id="puyGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1a1411" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#08070a" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d="M0 400 L0 280 L160 220 L300 240 L420 180 L520 200 L640 130 L780 170 L900 200 L1040 150 L1180 220 L1320 200 L1480 240 L1600 220 L1600 400 Z"
          fill="url(#puyGrad)"
        />
        <path
          d="M0 400 L0 320 L120 290 L260 310 L380 280 L520 300 L640 250 L780 280 L920 270 L1080 310 L1220 290 L1380 310 L1500 300 L1600 310 L1600 400 Z"
          fill="#08070a"
          opacity="0.85"
        />
      </svg>

      <div className="container" style={{ position: 'relative', padding: '140px 56px' }}>
        <Reveal>
          <SectionLabel number={7} name="Clermont-Ferrand" />
        </Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: 80,
            alignItems: 'end',
          }}
        >
          <Reveal>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(56px, 6vw, 108px)',
                lineHeight: 0.96,
                margin: 0,
              }}
            >
              Une ville de pierre noire,
              <br />
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'var(--accent)',
                }}
              >
                au pied des volcans.
              </em>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 16.5,
                  lineHeight: 1.7,
                  color: 'var(--parch-soft)',
                  maxWidth: 480,
                  marginBottom: 32,
                }}
              >
                La cathédrale est noire, les murs taillés dans la pierre
                de Volvic, le Puy de Dôme veille à l'horizon. C'est une
                ville qui sait ce que le feu peut faire à la pierre, et ce
                que l'acier doit à la patience.
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--display)',
                  fontStyle: 'italic',
                  fontSize: 22,
                  lineHeight: 1.4,
                  color: 'var(--parch)',
                }}
              >
                On s'y retrouve assez bien.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

Object.assign(window, {
  Manifesto,
  Club,
  Disciplines,
  Salle,
  Tournois,
  Galerie,
  Identite,
});
