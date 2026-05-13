// CONTACT — Form + practical info + footer

const Field = ({ label, placeholder, multiline = false, type = 'text' }) => {
  const [focus, setFocus] = React.useState(false);
  return (
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        flex: 1,
        minWidth: 0,
        position: 'relative',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: 'var(--eyebrow)',
          fontSize: 10,
          letterSpacing: '0.32em',
          color: focus ? 'var(--accent)' : 'var(--parch-mute)',
          textTransform: 'uppercase',
          transition: 'color 200ms var(--ease)',
        }}
      >
        <Diamond size={4} color={focus ? 'var(--accent)' : 'var(--parch-mute)'} />
        {label}
      </span>
      <span style={{ position: 'relative', display: 'block' }}>
        {multiline ? (
          <textarea
            placeholder={placeholder}
            rows={4}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            className="forge-field"
            style={{
              width: '100%',
              padding: '16px 0',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--parch-line)',
              color: 'var(--parch)',
              fontFamily: 'var(--display)',
              fontSize: 22,
              fontWeight: 400,
              outline: 'none',
              resize: 'vertical',
            }}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            className="forge-field"
            style={{
              width: '100%',
              padding: '16px 0',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--parch-line)',
              color: 'var(--parch)',
              fontFamily: 'var(--display)',
              fontSize: 24,
              fontWeight: 400,
              outline: 'none',
            }}
          />
        )}
        {/* Animated underline — grows from the left when focused */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0, right: 0, bottom: 0,
            height: 1,
            background: 'var(--accent)',
            transform: focus ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 320ms var(--ease)',
            pointerEvents: 'none',
          }}
        />
      </span>
    </label>
  );
};

const Contact = () => {
  const [submitted, setSubmitted] = React.useState(false);
  return (
    <section
      id="contact"
      data-screen-label="09 Contact"
      style={{
        position: 'relative',
        padding: '160px 0 100px',
        background: 'var(--coal)',
        borderTop: '1px solid var(--parch-line)',
      }}
    >
      <div className="container">
        <Reveal>
          <SectionLabel number={8} name="Rejoindre le club" />
        </Reveal>

        <Reveal>
          <h2
            className="display"
            style={{
              fontSize: 'clamp(56px, 7vw, 128px)',
              lineHeight: 0.92,
              margin: '0 0 64px',
              maxWidth: 1100,
            }}
          >
            Une lame, un masque,
            <br />
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--accent)',
              }}
            >
              et l'envie de bien faire.
            </em>
          </h2>
        </Reveal>

        <div className="contact-grid">
          {/* Left: practical info */}
          <Reveal>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 56,
              }}
            >
              <div>
                <Eyebrow>Première séance</Eyebrow>
                <p
                  style={{
                    margin: '20px 0 0',
                    fontFamily: 'var(--display)',
                    fontStyle: 'italic',
                    fontSize: 24,
                    lineHeight: 1.4,
                    color: 'var(--parch)',
                  }}
                >
                  Venez en tenue de sport, chaussures propres pour le
                  gymnase et bouteille d'eau. Le matériel d'initiation
                  peut être prêté. Contactez-nous avant de venir pour
                  qu'on vous attende.
                </p>
              </div>

              <div className="contact-info-pair">
                {[
                  { l: 'Adhésion 2025-2026', v: '85 €', s: 'inscription via HelloAsso' },
                  { l: 'Saison', v: 'Sept. → Août', s: 'rejoindre en cours d\'année possible' },
                ].map((c) => (
                  <div key={c.l}>
                    <div
                      style={{
                        fontFamily: 'var(--eyebrow)',
                        fontSize: 10,
                        letterSpacing: '0.32em',
                        color: 'var(--parch-mute)',
                        textTransform: 'uppercase',
                        marginBottom: 14,
                      }}
                    >
                      {c.l}
                    </div>
                    <div
                      className="display"
                      style={{ fontSize: 56, lineHeight: 1, marginBottom: 8 }}
                    >
                      {c.v}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: 'var(--parch-mute)',
                      }}
                    >
                      {c.s}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: 24,
                  paddingTop: 36,
                  borderTop: '1px solid var(--parch-line)',
                }}
              >
                {[
                  {
                    l: 'Lieu d\'entraînement',
                    v: 'Gymnase Robert Pras\n3 rue Jean Monnet · 63100 Clermont-Ferrand',
                  },
                  { l: 'Contact', v: 'Clémence Sillac · présidente de section' },
                  { l: 'Email', v: 'c.sillac@protonmail.com' },
                  { l: 'Téléphone', v: '06 31 58 54 60' },
                  { l: 'Inscriptions', v: 'HelloAsso — usam-amhe-clermont-ferrand' },
                ].map((c) => (
                  <div key={c.l} className="contact-info-row">
                    <div
                      style={{
                        fontFamily: 'var(--eyebrow)',
                        fontSize: 10,
                        letterSpacing: '0.28em',
                        color: 'var(--parch-mute)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {c.l}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--display)',
                        fontSize: 19,
                        lineHeight: 1.35,
                        color: 'var(--parch)',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {c.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={150}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 36,
                position: 'sticky',
                top: 120,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--display)',
                  fontStyle: 'italic',
                  fontSize: 26,
                  lineHeight: 1.45,
                  color: 'var(--parch)',
                  marginBottom: 12,
                  maxWidth: 480,
                }}
              >
                Écrivez-nous pour préparer votre venue, ou retrouvez-nous
                sur la page Facebook du club.
              </div>
              <div className="contact-form-row">
                <Field label="Nom" placeholder="Prénom Nom" />
                <Field label="Email" placeholder="vous@email.fr" type="email" />
              </div>
              <Field
                label="Sujet"
                placeholder="Première séance · stage · partenariat…"
              />
              <Field
                label="Message"
                placeholder="Quelques mots sur votre demande…"
                multiline
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 24,
                  gap: 24,
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--parch-mute)',
                    maxWidth: 280,
                    lineHeight: 1.5,
                  }}
                >
                  Aucune donnée stockée par notre faute. Le club fonctionne
                  à l'huile de coude et au mail.
                </div>
                <button type="submit" className="btn btn--solid">
                  {submitted ? 'Message envoyé.' : 'Envoyer le message'}
                  <ArrowGlyph size={13} color="currentColor" />
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────
// FOOTER
// ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer
    style={{
      position: 'relative',
      padding: '80px 0 32px',
      background: 'var(--ink)',
      borderTop: '1px solid var(--parch-line)',
    }}
  >
    <div className="container">
      {/* Marquee-style large brand line */}
      <div className="footer-marquee">
        De Feu
        <em
          style={{
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'var(--accent)',
          }}
        >
          &nbsp;et d'&nbsp;
        </em>
        Acier
      </div>

      <div className="footer-grid">
        <div>
          <DfdaMark size={48} color="var(--parch)" />
          <p
            style={{
              margin: '20px 0 0',
              fontSize: 13,
              lineHeight: 1.6,
              color: 'var(--parch-mute)',
              maxWidth: 260,
            }}
          >
            Section AMHE de l'USAM Clermont-Ferrand, affiliée à la
            FFAMHE. Arts martiaux historiques européens au cœur du
            Puy-de-Dôme.
          </p>
        </div>
        {[
          {
            label: 'Le club',
            items: [
              ['Manifeste', '#manifesto'],
              ['Disciplines', '#disciplines'],
              ['Tournois', '#tournois'],
              ['Galerie', '#galerie'],
            ],
          },
          {
            label: 'Pratique',
            items: [
              ['Salle d\'armes', '#salle'],
              ['Adhésion', 'https://www.helloasso.com/associations/usam-amhe-clermont-ferrand/adhesions/inscription-usam-amhe-clermont-2025-2026'],
              ['Première séance', '#contact'],
              ['HelloAsso', 'https://www.helloasso.com/associations/usam-amhe-clermont-ferrand'],
            ],
          },
          {
            label: 'Suivre',
            items: [
              ['Facebook', 'https://www.facebook.com/63AMHE/'],
              ['HEMA Ratings', 'https://hemaratings.com/clubs/details/1155/'],
              ['USAM Clermont', 'https://usam-clermont-ferrand.com/amhe-arts-martiaux-historiques-europeens'],
              ['FFAMHE', 'https://ffamhe.fr'],
            ],
          },
        ].map((col) => (
          <div key={col.label}>
            <div
              style={{
                fontFamily: 'var(--eyebrow)',
                fontSize: 10,
                letterSpacing: '0.32em',
                color: 'var(--parch-mute)',
                textTransform: 'uppercase',
                marginBottom: 24,
              }}
            >
              {col.label}
            </div>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              {col.items.map(([l, h]) => (
                <li key={l}>
                  <a
                    href={h}
                    className="ulink"
                    style={{
                      fontFamily: 'var(--display)',
                      fontSize: 19,
                      color: 'var(--parch)',
                    }}
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        className="footer-foot"
        style={{
          fontFamily: 'var(--eyebrow)',
          fontSize: 10,
          letterSpacing: '0.32em',
          color: 'var(--parch-mute)',
          textTransform: 'uppercase',
        }}
      >
        <div>© MMXXVI · De Feu et D'Acier · Clermont-Ferrand</div>
        <div style={{ display: 'flex', gap: 28 }}>
          <a href="#" className="ulink">
            Mentions légales
          </a>
          <a href="#" className="ulink">
            RGPD
          </a>
          <a href="#" className="ulink">
            Presse
          </a>
        </div>
      </div>
    </div>
  </footer>
);

// Inject form-specific styles once
const ContactStyles = () => (
  <style>{`
    .forge-field::placeholder {
      color: var(--parch-mute);
      opacity: 0.55;
      font-style: italic;
      font-family: var(--display);
    }
    .forge-field:focus { caret-color: var(--accent); }
    .footer-marquee {
      font-family: var(--display);
      font-size: clamp(60px, 9vw, 168px);
      line-height: 0.92;
      letter-spacing: -0.02em;
      color: var(--parch);
      margin-bottom: 80px;
      text-align: center;
    }
    @media (max-width: 640px) {
      .footer-marquee { font-size: clamp(48px, 14vw, 96px); margin-bottom: 56px; }
    }
  `}</style>
);

Object.assign(window, { Contact, Footer, ContactStyles });
