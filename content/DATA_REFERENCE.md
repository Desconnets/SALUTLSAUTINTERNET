# Salut Salut Internet — Base de données de référence

Fichier de référence contenant l'ADN, les pitchs, les événements et les guidelines du projet. À utiliser comme base pour tout développement.

---

## Identité

**Nom :** Salut Salut Internet  
**Origine :** Montpellier  
**DA :** Années 1990/2000 garanties  
**Focus actuel :** Événements (soirées gaming, années 2000, blindtests)

---

## ADN & Pitch

> Enfants des années 90/2000, fraîchement emballés par le monde adulte, nos souvenirs sont teintés de couleurs RVB, de sonorités électroniques et de saveurs édulcorées. Notre démarche ? Promouvoir une culture libre, défendre un regard sur les jeux vidéo, le cinéma, la musique et la technologie à travers des podcasts de formats différents.
>
> Salut Salut Internet est né à Montpellier, et puise son inspiration directement dans le terreau culturel local.

> Aujourd'hui on fait essentiellement des événements ça a changé mais notre ADN reste toujours le même.

> On est l'association Salut Salut Internet on est là pour promouvoir la popculture et animer les pixels

> Des geeks amoureux de bières et de popculture !

---

## Typographie

| Usage | Police |
|-------|--------|
| Logo (texte principal) | Rollergirl — échelle horizontale 75% |
| Logo (accent) | WhoopAss |
| Logo (marque) | "salut salut" + "INTERNET" |
| Web (interface) | Bowlby One SC |

---

## Événements — Modèles & descriptions

### Salut salut les jeux vidéo #1
- **Concept :** Console de salon dans le bar du quartier, arène déjantée spéciale jeu vidéo. Public, joueurs, bières, défis pendant 1h30 de pixels titubants.
- **Lieu type :** Microbrasserie de la Barbote, Montpellier
- **Format :** Jeux vidéo par groupes tirés au sort, défis concoctés à l'avance
- **Mood :** Boissons rafraîchissantes, venir et kiffer
- **Inscription :** Conseillée (lien forms.gle)
- **Tarif :** Gratuit, chapeau pour soutenir l'association
- **Tagline :** « On est l'association Salut Salut Internet on est là pour promouvoir la popculture et animer les pixels »

---

### Soirée années 2000
- **Concept :** Danser sur les hits des années 2000, ambiance boom 2008. Fun, musique, happenings pour revivre la décennie.
- **Public cible :** Joueurs des Sims, utilisateurs de MSN, fans d'Avril Lavigne, nostalgiques de Benny Benassi, spectateurs de MTV, kids de Jimmy Neutron, skyblogueurs, collectionneurs de Diddle, groupies de Tokyo Hotel, graveurs de CD/DVD, Bratz, amoureux de Nintendogs, goûters Rick et Rock… bref tout le monde.
- **Tagline :** « diiiingoo diiiingue », « Feel like a 2000s kid again ! », « VENEZ FAIRE LA FÊTE AVEC NOUS »
- **Lieux historiques :** Le Réservoir, La Barbote, toit du Corum, Café Tropisme

---

### Mario Kart World + Soirée années 2000
- **Concept :** Mario Kart sur Switch 2 + hits années 2000
- **Lieu type :** La Barbote (1 Rue des deux Ponts, 34000 Montpellier)
- **Tarif :** Gratuit
- **Mood :** « T'es chaud ? Viens juste kiffer ! »

---

### Panorama 2000s Summer Hits
- **Lieu :** Toit du Corum
- **Concept :** Même principe que soirée années 2000, en extérieur

---

### Blindtest années 2000
- **Format :** Blindtest spécial années 2000, jouer entre potes ou solo
- **Lieu exemple :** Bar du marché de Noël au Peyrou
- **Extras :** Cadeaux de Noël ou orange à gagner
- **Tarif :** Gratuit, sans inscription
- **After :** After party 2000s pour la millennial vibe
- **Tagline :** « Tu vas quand même pas rester toute la journée sur ta console !! »

---

### Hips don't lie
- **Lieu :** Café Tropisme
- **Concept :** Soirée années 2000, même format
- **Signature :** « RDV au café tropisme : @+ »

---

## Structure du site (priorités)

1. **Phase 1 :** Mettre en avant les événements — passés et à venir
2. **Phase 2 :** Partenaires, podcasts

---

## Liens utiles

- Inscription événements : https://forms.gle/bkWHExkmj1NeUafB8

---

## Lieux récurrents

| Lieu | Adresse |
|------|---------|
| La Barbote | 1 Rue des deux Ponts, 34000 Montpellier |
| Le Réservoir | 55 rue de Montels Saint-Pierre, Montpellier |
| Corum (toit) | Montpellier |
| Café Tropisme | Montpellier |
| Bar du marché de Noël | Peyrou, Montpellier |

---

## TODO UI — Thèmes clair / sombre (backgrounds)

- Garder **deux niveaux de fond** via les variables CSS :
  - `--page-bg` : fond global de la page (`html, body`).
  - `--frame-bg` : fond de la fenêtre principale (`.screen-frame`).
- **Intention pour plus tard** :
  - Dans le thème clair ET dans le thème sombre :
    - Avoir un **fond global** (`--page-bg`) un peu plus **foncé / prononcé**.
    - Avoir un **fond de fenêtre** (`--frame-bg`) un peu plus **clair** que la page,
      pour renforcer l’effet “écran cathodique posé sur un mur”.
  - Les autres blocs (titlebar, panneaux, etc.) devront ensuite s’aligner
    sur ce duo `page-bg` / `frame-bg`.

---

## Règles d’animation (typo + médias)

- Tant que l’animation **typewriter** + l’apparition du **media** (image / gif)
  d’un bloc en cours ne sont pas terminées :
  - Les **événements suivants** du même bloc ne sont pas encore créés.
  - Les **boutons de navigation** (Prog / Flashback / Qui on est) sont désactivés
    (`isTyping === true` + `setButtonsEnabled(false)`), donc aucun **nouveau bloc
    d’information** ne peut être déclenché.
- Un nouveau bloc (chapitre) ne commence son animation **qu’une fois** :
  - que tous les événements du bloc précédent ont fini de taper leur texte,
  - et que leur media associé (ou fallback par défaut) a été inséré.
