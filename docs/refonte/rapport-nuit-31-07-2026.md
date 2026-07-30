# Rapport de la nuit du 30 au 31 juillet 2026

Tout ce qui suit a été fait pendant que tu dormais, commit par commit, pour que
tu puisses tout voir, tout vérifier et tout annuler si quelque chose ne te
plaît pas. Le site est en régime de croisière : **les profs enregistrent dans
l'admin, le site se reconstruit et se déploie tout seul.**

## 1. La mise en ligne automatique (Workers Builds) — le gros morceau

**Ce qui marche désormais** : chaque commit sur `main` (donc chaque
enregistrement dans l'admin Keystatic) déclenche build + déploiement chez
Cloudflare. Trois cycles complets ont été testés cette nuit, tous verts.

- Où le voir : dashboard Cloudflare (compte asso) → Workers & Pages →
  `dfda-amhe` → onglet **Deployments** ; le détail des étapes est dans
  Settings → **Build**.
- Configuration posée : dépôt `TheLiloji/de-feu-et-d-acier`, branche `main`,
  build `npm run build`, deploy `npx wrangler deploy -c dist/server/wrangler.json`,
  variable de build `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=dfda-amhe-keystatic`,
  cache de build activé.
- Durée observée : **15 à 17 minutes** pour les deux premiers builds (les
  1286 images pèsent lourd), puis **environ 1 minute** au troisième, une fois
  le cache de build rempli. En régime normal, une sauvegarde CMS est en ligne
  en quelques minutes.
- Le déblocage n'était pas évident : la connexion GitHub↔Cloudflare tournait
  en boucle (l'App GitHub étant déjà installée, GitHub perdait le jeton
  d'état). La sortie : refaire une vraie modification côté GitHub
  (Save sur la page d'installation) pour déclencher la redirection retour.
  L'App GitHub est bien revenue en accès restreint aux deux seuls dépôts
  (site + judo).
- À savoir : **pas d'alerte email possible en cas de build raté** (le type
  d'alerte n'existe pas encore chez Cloudflare, vérifié par l'API). Si un
  garde-fou refuse une publication, ça se voit uniquement dans le journal de
  build — d'où la consigne donnée aux profs (voir point 5).

## 2. Les brillances (commit `3ebb61f`)

Livrées par un binôme constructeur + contre-expert (le contre-expert a trouvé
et corrigé un vrai défaut : le logotype du hero perdait son métal une fois
l'animation finie).

- **« Top 1 % mondial » seul en or** sur la fiche de Gabriel ET sur sa carte
  d'accueil ; le « · épée longue acier » reste parchemin. La découpe est
  éditoriale : des astérisques dans le champ accroche (`*Top 1 % mondial* ·
  épée longue acier`), même syntaxe que les titres. Sans astérisques, toute
  la ligne redevient dorée.
- **Reflet un peu plus brillant** (nouveau jeton `--or-eclat`, cœur du reflet
  à 18,8:1 de contraste), au repos rien ne change d'un pixel.
- **« Acier » métallique** dans le logotype, partout ; seule la version du
  hero de l'accueil joue la passe de lumière au chargement. « Feu » intact.
- Où le voir : https://dfda-amhe.fr (hero + carte de Gabriel),
  https://dfda-amhe.fr/profs/gabriel-tardio/ ; recharge en vidant le cache
  (`Ctrl+Maj+R`). Survole la carte de Gabriel : la passe se rejoue.
- Vérifications : contrastes mesurés au pixel sur le rendu réel, fiches de
  Marie et Ludwig identiques à l'octet près, `prefers-reduced-motion` et le
  repli sans `background-clip` testés. 165 contrôles de recette verts.

## 3. La redirection www → apex (301)

Règle de zone Cloudflare « www vers apex (301) », chemin et paramètres
conservés. Testée : `www.dfda-amhe.fr/armes/` → `dfda-amhe.fr/armes/`.

- Où le voir : dashboard → zone `dfda-amhe.fr` → Rules ; ou
  `curl -I https://www.dfda-amhe.fr/`.

## 4. Flux RSS + security.txt + parité wrangler (commit `9930431`)

- **https://dfda-amhe.fr/rss.xml** : flux RSS des actualités, même source que
  la page (un article dépublié sort du flux tout seul). Annoncé aux lecteurs
  RSS par une balise invisible du `<head>` ; rien n'a changé visuellement.
- **https://dfda-amhe.fr/.well-known/security.txt** : le standard pour dire
  qui prévenir en cas de faille (l'adresse du club, échéance août 2027).
- `wrangler.jsonc` : le bloc des domaines personnalisés est décommenté — la
  config du dépôt dit désormais la vérité sur ce qui est déployé.
- La **recette passe de 163 à 165 contrôles** (nouveau contrôle n° 8 : ces
  deux adresses répondent et sont bien formées). `npm run recette` pour la
  rejouer, `docs/RECETTE.md` à jour.

## 5. Guide admin mis à jour (commits `c806fdd`, `606f1c7`)

- §12 : « enregistrez, c'est tout » — un quart d'heure d'attente, la marche à
  suivre si rien n'apparaît, et le réflexe « prévenez Zaccharie au bout d'une
  demi-heure » (car un refus de garde-fou n'est visible que dans le journal
  de build).
- §13 : précision sur qui voit le message de refus.
- L'aide du champ « Message » des annonces dit désormais qu'il est facultatif
  (le bandeau affiche le titre à défaut — c'était le bug de ta première
  annonce, corrigé hier soir).

## 6. Mail FFAMHE prêt à partir (commit `c0934a8`)

`docs/refonte/mail-ffamhe.md` : l'URL https://dfda-amhe.fr/sources/ est dans
le corps du mail, la check-list d'envoi est à jour. Il n'attend plus que ton
clic (voir liste ci-dessous).

## 7. Ce que j'ai choisi de NE PAS faire, et pourquoi

- **Web manifest / icônes d'app** : le logo n'existe qu'en 435 × 573 px, pas
  en carré ≥ 512 px — l'icône serait floue ou mal cadrée. Si tu veux un
  manifest, exporte-moi le blason en carré (idéalement 1024 × 1024) et je
  fais le reste.
- **Alerte email sur build raté** : impossible côté Cloudflare aujourd'hui
  (le type d'alerte n'existe pas pour Workers Builds sur ce compte).
- **Bucket R2 pour les vidéos** : toujours bloqué par le scope OAuth du
  wrangler local ; pas urgent, la vidéo de Gabriel est servie par le site
  sans problème. À créer depuis le dashboard le jour où la vidéothèque
  grossit.

## 8. La liste des choses que toi seul peux faire

1. **Search Console** (référencement Google) : avec ton compte Google, ajoute
   la propriété `dfda-amhe.fr` sur https://search.google.com/search-console —
   vérification par enregistrement DNS TXT (je peux poser l'enregistrement si
   tu me donnes la valeur), puis soumets `https://dfda-amhe.fr/sitemap.xml`.
2. **Fiche Google Business** du club : à créer/mettre à jour avec l'URL.
3. **Backlinks** : demander la mise à jour de l'URL sur l'annuaire FFAMHE, le
   site de l'USAM, HEMA Ratings (club n° 1155) et la page Facebook 63AMHE.
4. **Mail FFAMHE** : relire `docs/refonte/mail-ffamhe.md` et l'envoyer depuis
   l'adresse du club.
5. **Le `.biz`** : demander à ton prof de basculer les serveurs de noms de
   `dfda-amhe.biz` vers Cloudflare ; je ferai ensuite la redirection.
6. **Photos** : portrait de Marie ≥ 1000 px, vraie photo viking, photos du
   gymnase à la rentrée (l'emplacement CMS est prêt), autorisations de droit
   à l'image (personnes PSX_/Medievel-80), confirmer l'étendue de la cession
   d'Alexandre Vergne.
7. **Inviter les profs** sur GitHub (leurs identifiants) pour qu'ils accèdent
   à l'admin, et leur partager le GUIDE-ADMIN.
8. **Rotation des clés Keystatic** que tu avais prévue (régénérer le client
   secret de l'App `dfda-amhe-keystatic`, puis `wrangler secret put`).
9. Si tu veux le **manifest** : export carré du blason (cf. point 7 ci-dessus).

## Les commits de la nuit, dans l'ordre

| Commit | Contenu |
|---|---|
| `3ebb61f` | Brillances (or ciblé, carte accueil, Acier métallique) |
| `c806fdd` | Admin : champ message d'annonce dit facultatif |
| `c0934a8` | Mail FFAMHE : URL définitive |
| `9930431` | RSS, security.txt, routes wrangler, recette n° 8 |
| `606f1c7` | Guide admin : mise en ligne automatique |

Chaque commit est indépendant : un `git revert <hash>` annule proprement la
partie que tu n'aimerais pas.
