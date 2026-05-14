// useContent(section) — hook qui lit le contenu d'une section.
//
// Stratégie :
//   1. Au premier render, renvoie window.CONTENT_SEED[section] (fallback bundled).
//      → le site s'affiche immédiatement, pas de flash blanc.
//   2. En tâche de fond, fetch GET /api/content/<section>.
//      → si KV contient un override, on remplace et React re-render.
//      → si le fetch échoue ou que la clé n'existe pas (404/204), on garde le seed.
//
// Le cache est partagé entre tous les composants qui demandent la même section
// (singleton module-level Map), pour qu'une seule requête réseau par section
// suffise même si plusieurs composants montent en parallèle.

(function () {
  const cache = new Map(); // section -> { data, loaded }
  const subscribers = new Map(); // section -> Set<callback>
  const inflight = new Map(); // section -> Promise

  const getSeed = (section) =>
    (window.CONTENT_SEED && window.CONTENT_SEED[section]) || null;

  function notify(section, data) {
    const subs = subscribers.get(section);
    if (!subs) return;
    subs.forEach((cb) => {
      try {
        cb(data);
      } catch (_) {
        /* swallow subscriber errors */
      }
    });
  }

  function fetchSection(section) {
    if (inflight.has(section)) return inflight.get(section);
    const p = fetch(`/api/content/${encodeURIComponent(section)}`, {
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
    })
      .then((res) => {
        if (res.status === 404 || res.status === 204) return null;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && typeof data === 'object') {
          cache.set(section, { data, loaded: true });
          notify(section, data);
        } else {
          cache.set(section, { data: getSeed(section), loaded: true });
        }
      })
      .catch(() => {
        // KV pas configuré, offline, ou API indisponible : on garde le seed.
        cache.set(section, { data: getSeed(section), loaded: true });
      })
      .finally(() => {
        inflight.delete(section);
      });
    inflight.set(section, p);
    return p;
  }

  function useContent(section) {
    const cached = cache.get(section);
    const initial = cached ? cached.data : getSeed(section);
    const [data, setData] = React.useState(initial);

    React.useEffect(() => {
      let alive = true;

      // Abonnement aux updates ultérieures (autre composant a fetch, admin a sauvé).
      if (!subscribers.has(section)) subscribers.set(section, new Set());
      const cb = (next) => {
        if (alive) setData(next);
      };
      subscribers.get(section).add(cb);

      // Si le contenu n'a pas encore été chargé depuis KV, on lance le fetch.
      if (!cache.get(section)?.loaded) {
        fetchSection(section);
      }

      return () => {
        alive = false;
        subscribers.get(section)?.delete(cb);
      };
    }, [section]);

    return data;
  }

  // Permet à /admin (ou un dev en console) de pousser une update sans recharger.
  function setContent(section, data) {
    cache.set(section, { data, loaded: true });
    notify(section, data);
  }

  window.useContent = useContent;
  window.setContent = setContent;
})();
