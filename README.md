# Salut l'saut internet — Actualités régionales

Application web d’actualités locales avec interface rétro 2-bit.

## Structure

```
SALUTLSAUTINTERNET/
├── index.html      # Page principale
├── assets/         # SVG, images (logo, icônes)
│   ├── svg/
│   └── img/
├── content/        # Données de référence, guidelines
├── css/
│   └── style.css
└── js/
    ├── data.js     # Données des catégories et actualités
    └── app.js      # Logique applicative
```

## Lancer le projet

Ouvrir `index.html` dans un navigateur (double-clic ou glisser-déposer).

Pour éviter les restrictions CORS avec `file://`, utiliser un serveur local :
```bash
# Avec Python
python3 -m http.server 8000

# Avec Node (npx)
npx serve .
```

Puis ouvrir http://localhost:8000

## Données

Les actualités sont définies dans `js/data.js`. Les catégories : Miam miam, Potin, Culture sortie, Infos locale.
