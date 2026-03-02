// Actualités régionales — symboles Unicode (glyphes de police, pas d’emoji)
const NEWS_DATA = {
  categories: [
    { id: "miam", label: "Miam miam", symbol: "§" },
    { id: "potin", label: "Potin", symbol: "★" },
    { id: "culture", label: "Culture sortie", symbol: "◆" },
    { id: "local", label: "Infos locale", symbol: "●" }
  ],
  items: [
    { categoryId: "miam", title: "Chez Marcel", content: "Nouvelle terrasse. Spécialité : tarte Tatin." },
    { categoryId: "miam", title: "Boulangerie du coin", content: "Élue meilleure baguette du quartier." },
    { categoryId: "miam", title: "Marché du mercredi", content: "Producteurs locaux, fromages et primeurs." },
    { categoryId: "potin", title: "Café de la place", content: "Le nouveau serveur fait parler les habitués." },
    { categoryId: "potin", title: "Rénovation immeuble", content: "Les voisins spéculent sur les nouveaux locataires." },
    { categoryId: "potin", title: "Fête des voisins", content: "Organisation secrète en cours, tout le monde en parle." },
    { categoryId: "culture", title: "Cinéma Rex", content: "Cycle films noirs ce weekend. Entrée libre." },
    { categoryId: "culture", title: "Médiathèque", content: "Atelier écriture samedi 14h. Inscription sur place." },
    { categoryId: "culture", title: "Concert place centrale", content: "Orchestre municipal, dimanche 17h." },
    { categoryId: "local", title: "Travaux rue Principale", content: "Circulation modifiée jusqu'au 15 mars." },
    { categoryId: "local", title: "Mairie", content: "Réunion conseil municipal jeudi 18h." },
    { categoryId: "local", title: "Association des commerçants", content: "Opération soldes prolongée jusqu'à dimanche." }
  ]
};
