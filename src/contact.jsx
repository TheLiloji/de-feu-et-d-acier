// CONTACT — Form + practical info + footer

const Field = ({ label, placeholder, multiline = false, type = 'text', name, value, onChange, required }) => {
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
          letterSpacing: '0.28em',
          color: focus ? 'var(--accent)' : 'var(--parch-mute)',
          textTransform: 'uppercase',
          fontWeight: 500,
          transition: 'color 200ms var(--ease)',
        }}
      >
        <Diamond size={4} color={focus ? 'var(--accent)' : 'var(--parch-mute)'} />
        {label}
      </span>
      <span style={{ position: 'relative', display: 'block' }}>
        {multiline ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            rows={4}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            className="forge-field"
            style={{
              width: '100%',
              padding: '14px 0',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--parch-line)',
              color: 'var(--parch)',
              fontFamily: 'var(--body)',
              fontSize: 16,
              lineHeight: 1.55,
              fontWeight: 400,
              outline: 'none',
              resize: 'vertical',
            }}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            className="forge-field"
            style={{
              width: '100%',
              padding: '14px 0',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--parch-line)',
              color: 'var(--parch)',
              fontFamily: 'var(--body)',
              fontSize: 17,
              lineHeight: 1.4,
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
  const [form, setForm] = React.useState({ name: '', email: '', subject: '', message: '' });
  const onField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(form.subject || 'Première séance — contact site');
    const body = encodeURIComponent(
      `${form.message || ''}\n\n— ${form.name || ''}${form.email ? ` (${form.email})` : ''}`
    );
    window.location.href = `mailto:c.sillac@protonmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };
  return (
    <section
      id="rejoindre"
      data-screen-label="09 Rejoindre"
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
              margin: '0 0 40px',
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

        {/* Quick-actions mobile-first : tap-to-call / tap-to-mail */}
        <Reveal delay={80}>
          <div className="contact-quick" role="group" aria-label="Contact rapide">
            <a href="tel:+33631585460" className="contact-quick-btn contact-quick-btn--ember">
              <span className="contact-quick-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                  <path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>
                </svg>
              </span>
              <span className="contact-quick-l">Appeler</span>
              <span className="contact-quick-v">06 31 58 54 60</span>
            </a>
            <a href="mailto:c.sillac@protonmail.com" className="contact-quick-btn">
              <span className="contact-quick-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                  <rect x="3" y="5" width="18" height="14"/>
                  <path d="M3 6l9 7 9-7"/>
                </svg>
              </span>
              <span className="contact-quick-l">Écrire</span>
              <span className="contact-quick-v">c.sillac@protonmail.com</span>
            </a>
            <a
              href="https://www.helloasso.com/associations/usam-amhe-clermont-ferrand/adhesions/inscription-usam-amhe-clermont-2025-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-quick-btn"
            >
              <span className="contact-quick-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                  <path d="M5 8h14v11H5z"/>
                  <path d="M9 8V5h6v3"/>
                </svg>
              </span>
              <span className="contact-quick-l">Adhérer</span>
              <span className="contact-quick-v">HelloAsso</span>
            </a>
          </div>
        </Reveal>

        <div className="contact-grid">
          {/* Left: prix + équipement + infos pratiques */}
          <Reveal>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 56,
              }}
            >
              {/* PRIX — gros chiffre 85€ pour capter l'œil immédiatement */}
              <div className="rejoindre-price">
                <div className="rejoindre-price-eyebrow">Adhésion · saison 25-26</div>
                <div className="rejoindre-price-figure">
                  <span className="rejoindre-price-amount">85</span>
                  <span className="rejoindre-price-currency">€</span>
                  <span className="rejoindre-price-per">par an</span>
                </div>
                <p className="rejoindre-price-headline">
                  Première séance gratuite. Rejoindre en cours d'année est possible.
                </p>
              </div>

              {/* ÉQUIPEMENT — 2 listes : prêté / à acheter */}
              <div className="rejoindre-equip">
                <div className="rejoindre-equip-col">
                  <div className="rejoindre-equip-l">Prêté par le club</div>
                  <ul className="rejoindre-equip-list">
                    <li>Masque d'escrime</li>
                    <li>Gants</li>
                    <li>Arme d'entraînement</li>
                    <li>Protections complémentaires</li>
                  </ul>
                </div>
                <div className="rejoindre-equip-col rejoindre-equip-col--later">
                  <div className="rejoindre-equip-l">À prévoir après 1-2 mois</div>
                  <ul className="rejoindre-equip-list">
                    <li>Votre masque personnel</li>
                    <li>Vos gants personnels</li>
                  </ul>
                  <p className="rejoindre-equip-note">
                    Si vous décidez de continuer. Le reste (arme,
                    protections) reste fourni par le club.
                  </p>
                </div>
              </div>

              {/* INFOS PRATIQUES compactes */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: 4,
                  paddingTop: 36,
                  borderTop: '1px solid var(--parch-line)',
                }}
              >
                {[
                  {
                    l: 'Lieu d\'entraînement',
                    v: 'Gymnase Robert Pras\n3 rue Jean Monnet · 63100 Clermont-Ferrand',
                    href: 'https://www.google.com/maps/search/?api=1&query=Gymnase+Robert+Pras+3+rue+Jean+Monnet+63100+Clermont-Ferrand',
                    external: true,
                    cta: 'Itinéraire',
                  },
                  {
                    l: 'Contact',
                    v: 'Clémence Sillac · présidente de section',
                  },
                  {
                    l: 'Email',
                    v: 'c.sillac@protonmail.com',
                    href: 'mailto:c.sillac@protonmail.com',
                  },
                  {
                    l: 'Téléphone',
                    v: '06 31 58 54 60',
                    href: 'tel:+33631585460',
                  },
                  {
                    l: 'Inscriptions',
                    v: 'HelloAsso — usam-amhe-clermont-ferrand',
                    href: 'https://www.helloasso.com/associations/usam-amhe-clermont-ferrand/adhesions/inscription-usam-amhe-clermont-2025-2026',
                    external: true,
                    cta: 'Adhérer en ligne',
                  },
                ].map((c) => (
                  <div key={c.l} className="contact-info-row">
                    <div
                      style={{
                        fontFamily: 'var(--eyebrow)',
                        fontSize: 10,
                        letterSpacing: '0.26em',
                        color: 'var(--parch-mute)',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                      }}
                    >
                      {c.l}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--body)',
                        fontSize: 15,
                        lineHeight: 1.55,
                        color: 'var(--parch)',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {c.href ? (
                        <a
                          href={c.href}
                          {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="contact-link"
                        >
                          {c.v}
                          {c.cta && (
                            <span className="contact-link-cta">
                              {c.cta}
                              <ArrowGlyph size={11} color="currentColor" />
                            </span>
                          )}
                        </a>
                      ) : (
                        c.v
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={150}>
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 36,
                position: 'sticky',
                top: 120,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--body)',
                  fontSize: 17,
                  lineHeight: 1.6,
                  color: 'var(--parch-soft)',
                  marginBottom: 8,
                  maxWidth: 480,
                }}
              >
                Écrivez-nous pour préparer votre venue, ou retrouvez-nous
                sur la page Facebook du club.
              </p>
              <div className="contact-form-row">
                <Field label="Nom" placeholder="Prénom Nom" name="name" value={form.name} onChange={onField('name')} required />
                <Field label="Email" placeholder="vous@email.fr" type="email" name="email" value={form.email} onChange={onField('email')} required />
              </div>
              <Field
                label="Sujet"
                placeholder="Première séance · stage · partenariat…"
                name="subject"
                value={form.subject}
                onChange={onField('subject')}
              />
              <Field
                label="Message"
                placeholder="Quelques mots sur votre demande…"
                multiline
                name="message"
                value={form.message}
                onChange={onField('message')}
                required
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
                    maxWidth: 320,
                    lineHeight: 1.55,
                  }}
                >
                  Le bouton ouvre votre messagerie avec le message
                  pré-rempli. Pas de stockage de données côté site.
                </div>
                <button type="submit" className="btn">
                  {submitted ? 'Message préparé.' : 'Envoyer le message'}
                  <ArrowGlyph size={11} color="currentColor" />
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
// LEGAL MODAL — mentions légales + RGPD en overlay déclenché depuis le
// footer. L'état est synchronisé avec le hash de l'URL pour que les
// liens #mentions-legales et #rgpd restent fonctionnels (signets,
// partage de lien direct, retour arrière navigateur).
// ───────────────────────────────────────────────────────────────────
const LegalNotes = () => {
  const [openId, setOpenId] = React.useState(() => {
    if (typeof window === 'undefined') return null;
    const h = window.location.hash.replace('#', '');
    return h === 'mentions-legales' || h === 'rgpd' ? h : null;
  });

  // Sync URL hash → state
  React.useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace('#', '');
      if (h === 'mentions-legales' || h === 'rgpd') setOpenId(h);
      else if (openId) setOpenId(null);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [openId]);

  // Lock body scroll + ESC pour fermer
  React.useEffect(() => {
    if (!openId) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [openId]);

  const close = () => {
    setOpenId(null);
    // Retire le hash sans relancer le hashchange listener
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) close();
  };

  if (!openId) return null;

  const isMentions = openId === 'mentions-legales';

  return (
    <div
      className="legal-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      onClick={onBackdropClick}
    >
      <div className="legal-modal-panel" role="document">
        <div className="legal-modal-head">
          <div>
            <div className="legal-modal-eyebrow">Informations légales</div>
            <h2 id="legal-modal-title" className="legal-modal-title">
              {isMentions ? 'Mentions légales' : 'Confidentialité & RGPD'}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="legal-modal-close"
            aria-label="Fermer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
              <path d="M6 6L18 18M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="legal-modal-body">
          {isMentions ? (
            <>
              <p>
                Site édité par la section AMHE « De Feu et d'Acier » de l'USAM
                Clermont-Ferrand, association loi 1901 affiliée à la FFAMHE.
              </p>
              <dl className="legal-dl">
                <dt>Siège</dt>
                <dd>Gymnase Robert Pras — 3 rue Jean Monnet, 63100 Clermont-Ferrand</dd>
                <dt>Directrice de publication</dt>
                <dd>Clémence Sillac, présidente de section</dd>
                <dt>Contact</dt>
                <dd>
                  <a href="mailto:c.sillac@protonmail.com">c.sillac@protonmail.com</a>
                  {' · '}
                  <a href="tel:+33631585460">06 31 58 54 60</a>
                </dd>
                <dt>Hébergement</dt>
                <dd>Cloudflare Workers — Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA</dd>
              </dl>
              <p className="legal-mute">
                Les photographies et illustrations utilisées sont la propriété
                du club ou de leurs auteurs respectifs. Toute reproduction
                non autorisée est interdite.
              </p>
            </>
          ) : (
            <>
              <p>
                Ce site ne dépose <strong>aucun cookie</strong>, n'utilise{' '}
                <strong>aucun outil d'analyse</strong> et ne stocke aucune
                donnée personnelle côté serveur.
              </p>
              <p>
                Le formulaire de contact ouvre votre application de messagerie
                avec un message pré-rempli. Aucune information n'est envoyée
                vers ce site ni vers un service tiers : l'envoi se fait depuis
                votre propre boîte mail.
              </p>
              <p>
                Les coordonnées affichées (mail, téléphone, adresse) sont
                celles communiquées volontairement par les responsables du
                club pour leurs fonctions associatives.
              </p>
              <p className="legal-mute">
                Conformément au RGPD, vous disposez d'un droit d'accès, de
                rectification et de suppression sur les données qui vous
                concernent. Pour exercer ces droits, contactez la présidente
                de section à l'adresse ci-dessus.
              </p>
            </>
          )}

          <div className="legal-modal-switch">
            {isMentions ? (
              <a href="#rgpd" className="legal-modal-switch-link">
                Voir la politique de confidentialité
                <ArrowGlyph size={11} color="currentColor" />
              </a>
            ) : (
              <a href="#mentions-legales" className="legal-modal-switch-link">
                Voir les mentions légales
                <ArrowGlyph size={11} color="currentColor" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
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
          <img
            src="assets/logo.png?v=2"
            alt="De Feu et d'Acier"
            width="56"
            height="56"
            style={{ display: 'block', objectFit: 'contain' }}
          />
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
              ['La rigueur', '#rigueur'],
              ['Disciplines', '#disciplines'],
              ['FAQ', '#faq'],
              ['Tournois', '#tournois'],
              ['Galerie', '#galerie'],
            ],
          },
          {
            label: 'Pratique',
            items: [
              ['Créneaux et lieux', '#creneaux'],
              ['Adhésion', 'https://www.helloasso.com/associations/usam-amhe-clermont-ferrand/adhesions/inscription-usam-amhe-clermont-2025-2026'],
              ['Première séance', '#rejoindre'],
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
                letterSpacing: '0.26em',
                color: 'var(--parch-mute)',
                textTransform: 'uppercase',
                marginBottom: 22,
                fontWeight: 500,
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
                gap: 12,
              }}
            >
              {col.items.map(([l, h]) => {
                const ext = /^https?:/.test(h);
                return (
                  <li key={l}>
                    <a
                      href={h}
                      className="ulink"
                      {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      style={{
                        fontFamily: 'var(--body)',
                        fontSize: 14.5,
                        color: 'var(--parch)',
                      }}
                    >
                      {l}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div
        className="footer-foot"
        style={{
          fontFamily: 'var(--eyebrow)',
          fontSize: 10,
          letterSpacing: '0.26em',
          color: 'var(--parch-mute)',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}
      >
        <div>© 2026 · De Feu et d'Acier · Clermont-Ferrand</div>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          <a href="#mentions-legales" className="ulink">Mentions légales</a>
          <a href="#rgpd" className="ulink">Confidentialité</a>
        </div>
      </div>
    </div>
  </footer>
);

// Inject form-specific styles once
const ContactStyles = () => (
  <style>{`
    /* ── Section Rejoindre : prix + équipement ─────────────────────── */
    .rejoindre-price {
      padding: 32px 0 28px;
      border-top: 2px solid var(--accent);
      border-bottom: 1px solid var(--parch-line);
    }
    .rejoindre-price-eyebrow {
      font-family: var(--eyebrow);
      font-size: 10.5px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 18px;
    }
    .rejoindre-price-figure {
      display: flex;
      align-items: baseline;
      gap: 14px;
      font-family: var(--display);
      font-variant-numeric: tabular-nums;
      line-height: 0.92;
      margin-bottom: 14px;
    }
    .rejoindre-price-amount {
      font-size: clamp(96px, 11vw, 168px);
      font-weight: 500;
      letter-spacing: -0.025em;
      color: var(--parch);
    }
    .rejoindre-price-currency {
      font-size: clamp(40px, 4.4vw, 64px);
      font-weight: 400;
      color: var(--accent);
    }
    .rejoindre-price-per {
      font-family: var(--eyebrow);
      font-size: 11px;
      letter-spacing: 0.26em;
      text-transform: uppercase;
      color: var(--parch-mute);
      font-weight: 500;
      margin-left: auto;
      padding-bottom: 8px;
    }
    .rejoindre-price-headline {
      margin: 0;
      font-family: var(--display);
      font-style: italic;
      font-size: clamp(18px, 1.6vw, 22px);
      line-height: 1.4;
      color: var(--parch-soft);
      max-width: 480px;
    }

    .rejoindre-equip {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px;
    }
    .rejoindre-equip-col {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 22px 24px;
      border: 1px solid var(--parch-line);
      border-radius: 2px;
      background: linear-gradient(180deg, rgba(236,232,222,0.022), rgba(236,232,222,0.006));
    }
    .rejoindre-equip-col--later {
      background: linear-gradient(180deg, rgba(224,85,44,0.04), rgba(224,85,44,0.008));
      border-color: rgba(224,85,44,0.22);
    }
    .rejoindre-equip-l {
      font-family: var(--eyebrow);
      font-size: 10.5px;
      letter-spacing: 0.26em;
      text-transform: uppercase;
      color: var(--parch-mute);
      font-weight: 600;
    }
    .rejoindre-equip-col--later .rejoindre-equip-l { color: var(--accent); }
    .rejoindre-equip-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .rejoindre-equip-list li {
      font-family: var(--body);
      font-size: 14.5px;
      line-height: 1.5;
      color: var(--parch);
      padding-left: 18px;
      position: relative;
    }
    .rejoindre-equip-list li::before {
      content: '';
      position: absolute;
      left: 0; top: 0.7em;
      width: 6px; height: 1px;
      background: var(--accent);
    }
    .rejoindre-equip-note {
      margin: 6px 0 0;
      font-family: var(--body);
      font-size: 12.5px;
      line-height: 1.55;
      color: var(--parch-mute);
      font-style: italic;
    }

    @media (max-width: 640px) {
      .rejoindre-price-figure { flex-wrap: wrap; gap: 8px 14px; }
      .rejoindre-price-per { margin-left: 0; padding-bottom: 0; }
      .rejoindre-equip { grid-template-columns: 1fr; gap: 16px; }
    }

    .forge-field::placeholder {
      color: var(--parch-mute);
      opacity: 0.55;
      font-family: var(--body);
    }
    .forge-field:focus { caret-color: var(--accent); }

    /* Contact quick actions — tap-friendly tiles, ember pour l'action primaire */
    .contact-quick {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 56px;
    }
    .contact-quick-btn {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 18px 20px;
      min-height: 80px;
      border: 1px solid var(--parch-line);
      border-radius: 2px;
      background: linear-gradient(180deg, rgba(236,232,222,0.03), rgba(236,232,222,0.008));
      color: var(--parch);
      transition: border-color 220ms var(--ease), background 220ms var(--ease), transform 220ms var(--ease);
    }
    .contact-quick-btn:hover {
      border-color: rgba(236,232,222,0.28);
      background: linear-gradient(180deg, rgba(224,85,44,0.04), rgba(236,232,222,0.012));
      transform: translateY(-1px);
    }
    .contact-quick-btn--ember {
      background: linear-gradient(180deg, rgba(224,85,44,0.14), rgba(224,85,44,0.04));
      border-color: rgba(224,85,44,0.4);
    }
    .contact-quick-btn--ember:hover {
      border-color: var(--accent);
      background: linear-gradient(180deg, rgba(224,85,44,0.22), rgba(224,85,44,0.06));
    }
    .contact-quick-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      color: var(--accent);
    }
    .contact-quick-l {
      font-family: var(--eyebrow);
      font-size: 10.5px;
      letter-spacing: 0.26em;
      text-transform: uppercase;
      color: var(--parch-mute);
      font-weight: 500;
    }
    .contact-quick-btn--ember .contact-quick-l { color: var(--parch); }
    .contact-quick-v {
      font-family: var(--body);
      font-size: 16px;
      font-weight: 500;
      color: var(--parch);
      font-variant-numeric: tabular-nums;
      letter-spacing: 0;
    }

    @media (max-width: 900px) {
      .contact-quick { grid-template-columns: 1fr; gap: 10px; margin-bottom: 48px; }
      .contact-quick-btn {
        min-height: 56px;
        padding: 14px 18px;
        flex-direction: row;
        align-items: center;
        gap: 14px;
      }
      .contact-quick-btn .contact-quick-l { display: none; }
      .contact-quick-btn .contact-quick-v { font-size: 17px; }
      .contact-quick-btn::after {
        content: '';
        margin-left: auto;
        display: inline-block;
        width: 12px; height: 12px;
        border-right: 1.5px solid var(--parch-mute);
        border-top: 1.5px solid var(--parch-mute);
        transform: rotate(45deg);
      }
    }

    /* Contact info links — sober underline + small ember CTA chip */
    .contact-link {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 14px;
      color: var(--parch);
      transition: color 200ms var(--ease);
      position: relative;
    }
    .contact-link:hover { color: var(--accent); }
    .contact-link-cta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: var(--eyebrow);
      font-size: 10px;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: var(--accent);
      padding: 4px 10px;
      border: 1px solid var(--parch-line);
      border-radius: 2px;
      font-weight: 500;
      transition: border-color 200ms var(--ease), background 200ms var(--ease);
    }
    .contact-link:hover .contact-link-cta {
      border-color: var(--accent);
      background: rgba(224, 85, 44, 0.08);
    }

    .footer-marquee {
      font-family: var(--display);
      font-size: clamp(56px, 8vw, 138px);
      line-height: 0.92;
      letter-spacing: -0.02em;
      color: var(--parch);
      margin-bottom: 64px;
      text-align: center;
    }
    @media (max-width: 640px) {
      .footer-marquee { font-size: clamp(44px, 13vw, 84px); margin-bottom: 44px; }
    }

    /* ── Legal modal (overlay) ────────────────────────────────────── */
    .legal-modal {
      position: fixed;
      inset: 0;
      z-index: 100;
      background: rgba(8, 7, 6, 0.78);
      backdrop-filter: blur(8px) saturate(120%);
      -webkit-backdrop-filter: blur(8px) saturate(120%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      animation: legal-modal-fade 200ms var(--ease);
    }
    @keyframes legal-modal-fade {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    .legal-modal-panel {
      position: relative;
      background: var(--coal);
      border: 1px solid var(--parch-line);
      border-radius: 3px;
      max-width: 720px;
      width: 100%;
      max-height: calc(100vh - 96px);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow:
        0 30px 80px -20px rgba(0,0,0,0.6),
        0 0 0 1px rgba(236,232,222,0.04) inset;
      animation: legal-modal-rise 280ms var(--ease);
    }
    @keyframes legal-modal-rise {
      from { opacity: 0; transform: translateY(16px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .legal-modal-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding: 28px 32px 22px;
      border-bottom: 1px solid var(--parch-line);
    }
    .legal-modal-eyebrow {
      font-family: var(--eyebrow);
      font-size: 10.5px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 10px;
    }
    .legal-modal-title {
      margin: 0;
      font-family: var(--display);
      font-size: clamp(22px, 2.6vw, 30px);
      line-height: 1.15;
      color: var(--parch);
      font-weight: 500;
    }
    .legal-modal-close {
      background: transparent;
      border: 1px solid var(--parch-line);
      color: var(--parch-soft);
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border-radius: 2px;
      transition: border-color 200ms var(--ease), color 200ms var(--ease), background 200ms var(--ease);
    }
    .legal-modal-close:hover {
      border-color: var(--accent);
      color: var(--accent);
      background: rgba(224,85,44,0.06);
    }
    .legal-modal-body {
      padding: 24px 32px 32px;
      font-family: var(--body);
      font-size: 14.5px;
      line-height: 1.7;
      color: var(--parch-soft);
      overflow-y: auto;
    }
    .legal-modal-body p { margin: 14px 0 0; }
    .legal-modal-body p:first-of-type { margin-top: 0; }
    .legal-modal-body a { color: var(--parch); border-bottom: 1px solid var(--parch-line); }
    .legal-modal-body a:hover { color: var(--accent); border-bottom-color: var(--accent); }
    .legal-mute { color: var(--parch-mute) !important; font-size: 13px !important; }
    .legal-dl {
      margin: 18px 0 0;
      display: grid;
      grid-template-columns: 180px 1fr;
      gap: 6px 18px;
    }
    .legal-dl dt {
      font-family: var(--eyebrow);
      font-size: 10px;
      letter-spacing: 0.26em;
      text-transform: uppercase;
      color: var(--parch-mute);
      font-weight: 500;
      padding-top: 4px;
    }
    .legal-dl dd { margin: 0; color: var(--parch-soft); padding: 4px 0; }
    .legal-modal-switch {
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid var(--parch-line);
    }
    .legal-modal-switch-link {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-family: var(--eyebrow);
      font-size: 10.5px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--accent);
      font-weight: 500;
      padding-bottom: 2px;
      border-bottom: 1px solid transparent;
      transition: border-color 200ms var(--ease);
    }
    .legal-modal-switch-link:hover { border-bottom-color: var(--accent); }
    @media (max-width: 640px) {
      .legal-modal { padding: 24px 16px; }
      .legal-modal-head { padding: 22px 22px 18px; }
      .legal-modal-body { padding: 20px 22px 26px; }
      .legal-dl { grid-template-columns: 1fr; gap: 2px 0; }
      .legal-dl dt { padding-top: 10px; }
    }
  `}</style>
);

Object.assign(window, { Contact, LegalNotes, Footer, ContactStyles });
