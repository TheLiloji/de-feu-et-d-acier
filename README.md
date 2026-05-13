# De Feu et d'Acier

Site web de **De Feu et d'Acier**, section AMHE (Arts Martiaux Historiques Européens) de l'USAM Clermont-Ferrand.

## Stack

Site statique en **React UMD + Babel standalone**, sans étape de build. Les fichiers JSX sont servis tels quels et transpilés par Babel dans le navigateur.

## Structure

```
.
├── De Feu et D'Acier.html   # Point d'entrée
├── src/
│   ├── app.jsx              # Composant racine
│   ├── hero.jsx             # Section héros
│   ├── sections.jsx         # Sections de contenu
│   ├── contact.jsx          # Section contact
│   └── primitives.jsx       # Composants UI réutilisables
├── assets/                  # Images, vidéos, logo
└── tweaks-panel.jsx         # Panneau de réglages (dev)
```

## Lancer en local

Aucun build nécessaire. Servir le dossier avec un serveur HTTP statique :

```bash
python3 -m http.server 8000
```

Puis ouvrir <http://localhost:8000/De%20Feu%20et%20D%27Acier.html>.

## Liens

- [Page USAM Clermont-Ferrand](https://www.usam-clermont.fr/)
- [HelloAsso](https://www.helloasso.com/)
- [Facebook](https://www.facebook.com/)
- [HEMA Ratings](https://hemaratings.com/)
