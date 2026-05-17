// /admin — interface d'édition du contenu pour les chefs.
// Stack identique au site : React UMD + Babel standalone, sans build.

const SCHEMAS = window.CMS_SCHEMAS;
const SECTION_KEYS = Object.keys(SCHEMAS);

// ───────────────────────────────────────────────────────────────────
// Helpers réseau
// ───────────────────────────────────────────────────────────────────
async function api(method, url, opts = {}) {
  const res = await fetch(url, {
    method,
    credentials: 'same-origin',
    ...opts,
  });
  if (res.status === 204) return null;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) throw Object.assign(new Error(data?.error || `HTTP ${res.status}`), { status: res.status, data });
    return data;
  }
  if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { status: res.status });
  return res;
}

// Renvoie le contenu d'une section : KV s'il existe, sinon le seed bundled.
async function loadSection(section) {
  try {
    const data = await api('GET', `/api/content/${section}`);
    if (data) return { data, fromKV: true };
  } catch (e) {
    if (e.status !== 404) console.warn(`load ${section}:`, e.message);
  }
  // Fallback : seed bundled. On charge le seed du site.
  if (!window.CONTENT_SEED) {
    // Charge le script seed du site (chemin relatif depuis /admin/)
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = '../content/seed.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  return { data: structuredClone(window.CONTENT_SEED[section] || {}), fromKV: false };
}

// Clone deep pour éviter de muter le state directement
const clone = (x) => structuredClone(x);

// ───────────────────────────────────────────────────────────────────
// Login screen
// ───────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api('POST', '/api/login', {
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      onLogin();
    } catch (err) {
      setError(err.status === 401 ? 'Mot de passe incorrect' : `Erreur : ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-shell">
      <form onSubmit={submit} className="login-card">
        <h1>Administration</h1>
        <p className="muted">De Feu et d'Acier — édition du contenu</p>
        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={busy || !password}>
          {busy ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// Image picker — preview + saisie chemin + modal R2 + upload
// ───────────────────────────────────────────────────────────────────
function ImagePicker({ value, onChange }) {
  const [showLibrary, setShowLibrary] = React.useState(false);
  const [images, setImages] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState('');
  const fileRef = React.useRef(null);

  React.useEffect(() => {
    if (!showLibrary || images) return;
    api('GET', '/api/images').then((d) => setImages(d.images || [])).catch(() => setImages([]));
  }, [showLibrary, images]);

  const upload = async (file) => {
    setUploading(true);
    setUploadError('');
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('name', file.name);
      const out = await api('POST', '/api/images', { body: form });
      // Rafraîchit la liste et applique
      setImages(null);
      onChange(out.url);
      setShowLibrary(false);
    } catch (e) {
      setUploadError(e.message || 'Échec upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="img-picker">
      <div className="img-picker-row">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="assets/foo.jpg ou /images/uploaded.webp"
        />
        <button type="button" onClick={() => setShowLibrary(true)}>Bibliothèque</button>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? '⏳' : 'Uploader'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = '';
          }}
        />
      </div>
      {uploadError && <div className="error small">{uploadError}</div>}
      {value && (
        <div className="img-preview">
          <img src={value.startsWith('http') || value.startsWith('/') || value.startsWith('assets/') ? value : value} alt="" />
          <span className="muted small">{value}</span>
        </div>
      )}
      {showLibrary && (
        <ImageLibrary
          images={images}
          onSelect={(url) => { onChange(url); setShowLibrary(false); }}
          onClose={() => setShowLibrary(false)}
          onReload={() => setImages(null)}
        />
      )}
    </div>
  );
}

function ImageLibrary({ images, onSelect, onClose, onReload }) {
  const remove = async (key) => {
    if (!confirm(`Supprimer "${key}" ?`)) return;
    try {
      await api('DELETE', `/api/images/${encodeURIComponent(key)}`);
      onReload();
    } catch (e) {
      alert(`Échec : ${e.message}`);
    }
  };
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <h2>Bibliothèque d'images (uploadées)</h2>
          <button type="button" onClick={onClose}>Fermer</button>
        </div>
        {images == null ? (
          <p className="muted">Chargement…</p>
        ) : images.length === 0 ? (
          <p className="muted">Aucune image uploadée. Utilise le bouton "Uploader" pour en ajouter.</p>
        ) : (
          <div className="img-grid">
            {images.map((img) => (
              <div key={img.key} className="img-tile">
                <img src={img.url} alt={img.key} />
                <div className="img-tile-info">
                  <span className="img-tile-key">{img.key}</span>
                  <span className="muted small">{Math.round(img.size / 1024)} KB</span>
                </div>
                <div className="img-tile-actions">
                  <button type="button" onClick={() => onSelect(img.url)}>Utiliser</button>
                  <button type="button" className="danger" onClick={() => remove(img.key)}>Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// FocalPicker — picker visuel pour le focal point d'une image. Affiche
// l'image (lue depuis le champ frère `imageKey`), un réticule à la
// position courante, et permet de cliquer pour déplacer le focal point.
// Tombe en simple input texte si aucune image n'est dispo.
// Format de valeur : "X% Y%" (ex. "50% 40%").
// ───────────────────────────────────────────────────────────────────
function parseFocal(s) {
  if (!s) return null;
  const m = String(s).match(/^\s*(\d+(?:\.\d+)?)\s*%\s+(\d+(?:\.\d+)?)\s*%\s*$/);
  if (!m) return null;
  return { x: Number(m[1]), y: Number(m[2]) };
}

function FocalPicker({ value, onChange, imageUrl }) {
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
    onChange(`${clamp(x)}% ${clamp(y)}%`);
  };
  const pt = parseFocal(value);

  return (
    <div className="focal-picker">
      {imageUrl ? (
        <div
          className="focal-stage"
          onClick={handleClick}
          title="Clic = définir le focal point"
        >
          <img src={imageUrl} alt="" />
          {pt && (
            <span
              className="focal-marker"
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              aria-hidden="true"
            />
          )}
        </div>
      ) : (
        <div className="focal-empty small muted">Renseigne d'abord une image au-dessus.</div>
      )}
      <div className="focal-row">
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="50% 50%"
        />
        <button type="button" onClick={() => onChange('50% 50%')} title="Centrer">Centrer</button>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// Field renderer récursif (par type)
// `parent` : objet parent (item d'array, object schema, ou section root).
// Utilisé pour les types qui doivent lire un champ frère, ex. 'focal'
// qui lit `parent[field.imageKey]` pour afficher la bonne image.
// ───────────────────────────────────────────────────────────────────
function Field({ field, value, onChange, parent }) {
  const t = field.type;

  if (t === 'string' || t === 'url') {
    return (
      <FieldShell label={field.label} help={field.help}>
        <input
          type={t === 'url' ? 'url' : 'text'}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </FieldShell>
    );
  }
  if (t === 'number') {
    return (
      <FieldShell label={field.label} help={field.help}>
        <input
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        />
      </FieldShell>
    );
  }
  if (t === 'boolean') {
    return (
      <FieldShell label={field.label} help={field.help} inline>
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
        />
      </FieldShell>
    );
  }
  if (t === 'longtext') {
    return (
      <FieldShell label={field.label} help={field.help}>
        <textarea
          rows={Math.max(3, Math.min(10, ((value || '').length / 80) | 0 + 3))}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </FieldShell>
    );
  }
  if (t === 'html') {
    return (
      <FieldShell label={field.label} help={field.help || 'HTML autorisé : <strong>, <em>, <a>, <br>, &nbsp;'}>
        <textarea
          rows={Math.max(3, Math.min(10, ((value || '').length / 80) | 0 + 3))}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="mono"
        />
        {value && (
          <div className="html-preview" dangerouslySetInnerHTML={{ __html: value }} />
        )}
      </FieldShell>
    );
  }
  if (t === 'image') {
    return (
      <FieldShell label={field.label} help={field.help}>
        <ImagePicker value={value} onChange={onChange} />
      </FieldShell>
    );
  }
  if (t === 'focal') {
    const imageUrl = parent ? parent[field.imageKey] : null;
    return (
      <FieldShell label={field.label} help={field.help || 'Clic sur l\'image pour définir le focal point.'}>
        <FocalPicker value={value} onChange={onChange} imageUrl={imageUrl} />
      </FieldShell>
    );
  }
  if (t === 'tuple') {
    const v = Array.isArray(value) ? value : ['', ''];
    return (
      <div className="tuple-row">
        <input
          type="text"
          placeholder="Libellé"
          value={v[0] || ''}
          onChange={(e) => onChange([e.target.value, v[1] || ''])}
        />
        <input
          type="text"
          placeholder="URL"
          value={v[1] || ''}
          onChange={(e) => onChange([v[0] || '', e.target.value])}
        />
      </div>
    );
  }
  if (t === 'paragraphs') {
    const arr = Array.isArray(value) ? value : [];
    return (
      <FieldShell label={field.label} help={field.help || 'Un paragraphe par bloc — HTML autorisé.'}>
        <div className="paragraphs">
          {arr.map((para, i) => (
            <div key={i} className="paragraph-row">
              <textarea
                rows={3}
                value={para}
                onChange={(e) => {
                  const next = [...arr];
                  next[i] = e.target.value;
                  onChange(next);
                }}
              />
              <div className="paragraph-actions">
                <button type="button" disabled={i === 0} onClick={() => {
                  const next = [...arr];
                  [next[i - 1], next[i]] = [next[i], next[i - 1]];
                  onChange(next);
                }}>↑</button>
                <button type="button" disabled={i === arr.length - 1} onClick={() => {
                  const next = [...arr];
                  [next[i + 1], next[i]] = [next[i], next[i + 1]];
                  onChange(next);
                }}>↓</button>
                <button type="button" className="danger" onClick={() => {
                  onChange(arr.filter((_, j) => j !== i));
                }}>×</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => onChange([...arr, ''])}>+ Ajouter un paragraphe</button>
        </div>
      </FieldShell>
    );
  }
  if (t === 'object') {
    const obj = value && typeof value === 'object' ? value : {};
    return (
      <fieldset className="nested">
        <legend>{field.label}</legend>
        {field.schema.fields.map((sub) => (
          <Field
            key={sub.key}
            field={sub}
            value={obj[sub.key]}
            parent={obj}
            onChange={(v) => onChange({ ...obj, [sub.key]: v })}
          />
        ))}
      </fieldset>
    );
  }
  if (t === 'array') {
    const arr = Array.isArray(value) ? value : [];
    const itemFields = field.item.fields;
    // Cas "single field" : si le seul champ est __self → on traite la valeur comme primitive
    const isPrimitive = itemFields.length === 1 && (itemFields[0].key === '__self' || itemFields[0].key === '__tuple');

    return (
      <FieldShell label={field.label} help={field.help}>
        <div className="array">
          {arr.map((item, i) => (
            <ArrayItem
              key={i}
              index={i}
              total={arr.length}
              labelFn={field.itemLabel}
              item={item}
              onChange={(v) => {
                const next = [...arr];
                next[i] = v;
                onChange(next);
              }}
              onMove={(dir) => {
                const j = i + dir;
                if (j < 0 || j >= arr.length) return;
                const next = [...arr];
                [next[i], next[j]] = [next[j], next[i]];
                onChange(next);
              }}
              onRemove={() => onChange(arr.filter((_, j) => j !== i))}
              itemFields={itemFields}
              isPrimitive={isPrimitive}
            />
          ))}
          <button type="button" onClick={() => {
            if (isPrimitive) {
              const k = itemFields[0].key;
              onChange([...arr, k === '__tuple' ? ['', ''] : '']);
            } else {
              onChange([...arr, defaultFor(itemFields)]);
            }
          }}>
            + Ajouter
          </button>
        </div>
      </FieldShell>
    );
  }
  return <div className="error">Type non géré : {t}</div>;
}

function defaultFor(fields) {
  const obj = {};
  for (const f of fields) {
    if (f.type === 'string' || f.type === 'url' || f.type === 'longtext' || f.type === 'html' || f.type === 'image' || f.type === 'focal') obj[f.key] = '';
    else if (f.type === 'number') obj[f.key] = 0;
    else if (f.type === 'boolean') obj[f.key] = false;
    else if (f.type === 'paragraphs') obj[f.key] = [];
    else if (f.type === 'array') obj[f.key] = [];
    else if (f.type === 'object') obj[f.key] = defaultFor(f.schema.fields);
    else obj[f.key] = null;
  }
  return obj;
}

function ArrayItem({ index, total, labelFn, item, onChange, onMove, onRemove, itemFields, isPrimitive }) {
  const [collapsed, setCollapsed] = React.useState(true);
  const label = labelFn ? labelFn(item, index) : `Item ${index + 1}`;

  return (
    <div className="array-item">
      <div className="array-item-head">
        <button type="button" className="collapse" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '▶' : '▼'} {label}
        </button>
        <div className="array-item-actions">
          <button type="button" disabled={index === 0} onClick={() => onMove(-1)}>↑</button>
          <button type="button" disabled={index === total - 1} onClick={() => onMove(1)}>↓</button>
          <button type="button" className="danger" onClick={() => {
            if (confirm('Supprimer cet élément ?')) onRemove();
          }}>×</button>
        </div>
      </div>
      {!collapsed && (
        <div className="array-item-body">
          {isPrimitive ? (
            <Field
              field={itemFields[0]}
              value={item}
              onChange={onChange}
            />
          ) : (
            itemFields.map((sub) => (
              <Field
                key={sub.key}
                field={sub}
                value={item?.[sub.key]}
                parent={item || {}}
                onChange={(v) => onChange({ ...(item || {}), [sub.key]: v })}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function FieldShell({ label, help, children, inline }) {
  return (
    <div className={`field ${inline ? 'field-inline' : ''}`}>
      <label>
        <span className="field-label">{label}</span>
        {help && <span className="field-help">{help}</span>}
        {children}
      </label>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// Section editor
// ───────────────────────────────────────────────────────────────────
function SectionEditor({ sectionKey }) {
  const schema = SCHEMAS[sectionKey];
  const [state, setState] = React.useState(null); // { data, fromKV, dirty }
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    setState(null);
    setMessage('');
    loadSection(sectionKey).then(({ data, fromKV }) => {
      setState({ data, fromKV, dirty: false });
    });
  }, [sectionKey]);

  if (!state) return <div className="muted">Chargement…</div>;

  const update = (key, v) => {
    setState((s) => ({ ...s, data: { ...s.data, [key]: v }, dirty: true }));
    setMessage('');
  };

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      await api('PUT', `/api/content/${sectionKey}`, {
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(state.data),
      });
      setState((s) => ({ ...s, fromKV: true, dirty: false }));
      setMessage('✓ Enregistré');
      setTimeout(() => setMessage(''), 3000);
    } catch (e) {
      setMessage(`Erreur : ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const resetToSeed = async () => {
    if (!confirm('Remettre cette section à son contenu par défaut ?\n(Supprime l\'override en base, restaure le seed bundled.)')) return;
    setSaving(true);
    try {
      await api('DELETE', `/api/content/${sectionKey}`);
      const fresh = await loadSection(sectionKey);
      setState({ data: fresh.data, fromKV: fresh.fromKV, dirty: false });
      setMessage('✓ Remis au défaut');
      setTimeout(() => setMessage(''), 3000);
    } catch (e) {
      setMessage(`Erreur : ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="editor">
      <div className="editor-head">
        <h2>{schema.label}</h2>
        <div className="editor-actions">
          <span className={`badge ${state.fromKV ? 'badge-on' : 'badge-off'}`}>
            {state.fromKV ? 'Override actif (KV)' : 'Contenu par défaut (seed)'}
          </span>
          {state.fromKV && (
            <button type="button" onClick={resetToSeed} disabled={saving}>
              Revenir au défaut
            </button>
          )}
          <button
            type="button"
            className="primary"
            onClick={save}
            disabled={saving || !state.dirty}
          >
            {saving ? 'Enregistrement…' : state.dirty ? 'Enregistrer' : 'À jour'}
          </button>
        </div>
      </div>
      {message && <div className={message.startsWith('✓') ? 'success' : 'error'}>{message}</div>}
      <div className="editor-fields">
        {schema.fields.map((f) => (
          <Field
            key={f.key}
            field={f}
            value={state.data[f.key]}
            parent={state.data}
            onChange={(v) => update(f.key, v)}
          />
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// App shell
// ───────────────────────────────────────────────────────────────────
function AdminApp() {
  const [authed, setAuthed] = React.useState(null);
  const [section, setSection] = React.useState(SECTION_KEYS[0]);

  React.useEffect(() => {
    api('GET', '/api/session')
      .then((d) => setAuthed(!!d?.authenticated))
      .catch(() => setAuthed(false));
  }, []);

  const logout = async () => {
    await api('POST', '/api/logout').catch(() => {});
    setAuthed(false);
  };

  if (authed === null) return <div className="login-shell"><div className="muted">Chargement…</div></div>;
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar-head">
          <strong>D.F.D.A · Admin</strong>
          <button type="button" onClick={logout}>Déconnexion</button>
        </div>
        <nav>
          {SECTION_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              className={k === section ? 'active' : ''}
              onClick={() => setSection(k)}
            >
              {SCHEMAS[k].label}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <a href="/" target="_blank" rel="noopener">Voir le site →</a>
        </div>
      </aside>
      <main className="main">
        <SectionEditor sectionKey={section} />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AdminApp />);
