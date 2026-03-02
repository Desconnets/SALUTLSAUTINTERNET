# Assets — SVG, images, GIF

Placez ici vos fichiers média pour les réutiliser sur le site :

- **`svg/`** — logos, icônes, illustrations vectorielles
- **`img/`** — photos, images, GIF (PNG, JPG, WebP, GIF)

## Message d'accueil
→ **`assets/img/welcome.gif`** — GIF affiché après « Feel like a 2000s kid again. Clique à droite. »

## Médias par item
Pour ajouter une image, GIF ou lien à un événement, éditez `js/data.js` et ajoutez :
- **Image (JPG, PNG, GIF)** : `media: { type: 'image', url: 'assets/img/ton-fichier.jpg' }`
- **Lien web** : `media: { type: 'link', url: 'https://...', label: 'Voir' }`

Extensions acceptées pour les images : .jpg, .jpeg, .png, .gif
