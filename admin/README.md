# Admin Decap CMS — Salut Salut Internet

## Voir l’interface

### En local (sans connexion GitHub)

1. Démarrez le proxy :
   ```bash
   npx decap-server
   ```
2. Démarrez un serveur dans le projet :
   ```bash
   cd ..
   python3 -m http.server 8000
   ```
3. Dans `admin/config.yml`, décommentez : `local_backend: true`
4. Ouvrez : http://localhost:8000/admin/

### En ligne (avec GitHub)

1. Assurez-vous que `content/editorial.json` est commité.
2. Ouvrez : **https://votre-site.github.io/admin/** (ou votre URL de prod)
3. Cliquez sur « Login with GitHub » et autorisez.

> Pour que la connexion GitHub fonctionne, une OAuth App GitHub peut être nécessaire. Voir : https://decapcms.org/docs/github-backend/

## Fichiers

- `admin/config.yml` — Configuration des champs éditables
- `content/editorial.json` — Contenu éditorial (événements, textes, images)
