// Salut Salut Internet — Prog / Flashback / Qui on est

// GIF/image affiché après le message d'accueil (vide = aucun)
const WELCOME_MEDIA = 'assets/img/welcome.gif';

const NEWS_DATA = {
  categories: [
    { id: "prog", label: "Prog", symbol: "▸", subtitle: "à venir" },
    { id: "flashback", label: "Flashback", symbol: "◂" },
    { id: "qui-on-est", label: "Qui on est", symbol: "◆" }
  ],
  items: [
    // Prog (à venir)
    { categoryId: "prog", title: "Hips don't lie 2", date: "Jeudi 3 avril", time: "20h", address: "Café Tropisme — Montpellier", content: "Nouvelle édition de Hips don't lie : ambiance années 2000, hits, paillettes et bonne vibe au Café Tropisme. Viens danser, chanter et crier les refrains que tu connais par cœur.", media: { type: 'image', url: 'assets/img/hips-dont-lie.gif' } },

    // Flashback (passé) — du plus récent au plus ancien
    {
      categoryId: "flashback",
      title: "𝙃𝙞𝙥𝙨 𝙙𝙤𝙣'𝙩 𝙡𝙞𝙚 - soirée années 2000 👽🐬",
      date: "Ven, 6 févr. 2026",
      time: "—",
      address: "Café Tropisme · Montpellier",
      content: "Évènement organisé par Salut Salut Internet",
      media: { type: 'image', url: 'assets/img/hips-dont-lie.gif' }
    },
    {
      categoryId: "flashback",
      title: "𝗕𝗹𝗶𝗻𝗱𝘁𝗲𝘀𝘁 𝟮𝟬𝟬𝟬𝘀 👽🎁",
      date: "Ven, 5 déc. 2025",
      time: "—",
      address: "Marché de Noël de Montpellier · Montpellier",
      content: "Évènement organisé par Salut Salut Internet"
    },
    {
      categoryId: "flashback",
      title: "𝗣𝗮𝗻𝗼𝗿𝗮𝗺𝗮 𝟮𝟬𝟬𝟬𝘀 𝗦𝘂𝗺𝗺𝗲𝗿 𝗛𝗶𝘁𝘀 - sur le toit du Corum 👽🐬",
      date: "Sam, 2 août 2025",
      time: "—",
      address: "Corum de Montpellier · Montpellier",
      content: "Évènement organisé par Salut Salut Internet",
      media: { type: 'image', url: 'assets/img/panorama-summer-hits.jpg' }
    },
    {
      categoryId: "flashback",
      title: "𝗠𝗮𝗿𝗶𝗼 𝗞𝗮𝗿𝘁 𝗪𝗼𝗿𝗹𝗱 + 𝗦𝗼𝗶𝗿𝗲𝗲 𝗮𝗻𝗻𝗲𝗲𝘀 𝟮𝟬𝟬𝟬 ! (lesgo)🎮🕺",
      date: "Jeu, 5 juin 2025",
      time: "—",
      address: "Bar & Microbrasserie La Barbote · Montpellier",
      content: "Évènement organisé par Salut Salut Internet"
    },
    {
      categoryId: "flashback",
      title: "𝗣𝗹𝘇 𝗱𝗼𝗻'𝘁 𝘀𝘁𝗼𝗽 𝘁𝗵𝗲 𝗺𝘂𝘀𝗶𝗰 - soirée années 2000 ! 👽🎵🪩",
      date: "Sam, 8 mars 2025",
      time: "—",
      address: "Le Réservoir Montpellier · Montpellier",
      content: "Évènement organisé par Salut Salut Internet",
      media: { type: 'image', url: 'assets/img/plz-dont-stop.gif' }
    },
    {
      categoryId: "flashback",
      title: "𝗢𝗠𝗚 𝗼𝗻 𝗷𝗼𝘂𝘦 𝗮𝘂𝘅 𝗷𝗲𝘂𝘅 𝘃𝗶𝗱𝗲𝗼 𝗱𝗮𝗻𝘀 𝘂𝗻 𝗯𝗮𝗿 ! 🕹️🍻💥",
      date: "Sam, 7 déc. 2024",
      time: "—",
      address: "Bar & Microbrasserie La Barbote · Montpellier",
      content: "Évènement organisé par Salut Salut Internet",
      media: { type: 'image', url: 'assets/img/salut-jeux.jpg' }
    },

    // Qui on est
    { categoryId: "qui-on-est", title: "Notre ADN", content: "Enfants des années 90/2000. Couleurs RVB, sonorités électroniques, saveurs édulcorées. On promeut la culture libre et défend un regard sur les jeux vidéo, le cinéma, la musique et la tech." },
    { categoryId: "qui-on-est", title: "Montpellier", content: "Né à Montpellier, on puise notre inspiration dans le terreau culturel local. Des geeks amoureux de bières et de popculture !" },
    { categoryId: "qui-on-est", title: "Notre mission", content: "Promouvoir la popculture et animer les pixels. Événements, podcasts, et plein de surprises années 2000." }
  ]
};
