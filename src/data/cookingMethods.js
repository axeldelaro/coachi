export const cookingMethods = {
  vapeur: {
    label: 'Cuisson Vapeur', icon: '♨️', time: '15-20 min',
    steps: [
      "Porter l'eau à ébullition dans une casserole",
      'Placer les aliments dans le panier vapeur',
      'Cuire 15-20 min selon l\'épaisseur (poulet : 20 min, légumes : 8 min)',
      'Assaisonner après cuisson pour préserver les nutriments',
    ],
    tip: 'Préserve un maximum de vitamines. Aucune matière grasse nécessaire.',
  },
  poele: {
    label: 'À la Poêle', icon: '🍳', time: '6-10 min',
    steps: [
      'Chauffer la poêle à feu moyen-vif',
      'Légère vapeur d\'huile en spray (ou 5ml huile)',
      'Cuire 3-4 min par côté sans toucher',
      'Vérifier la cuisson au cœur, ne pas sur-cuire',
    ],
    tip: 'Une poêle antiadhésive évite l\'excès de matière grasse.',
  },
  four: {
    label: 'Au Four', icon: '🔥', time: '25-30 min',
    steps: [
      'Préchauffer à 200°C (thermostat 7)',
      'Couper en cubes réguliers de 2 cm',
      'Disposer sur papier cuisson sans superposer',
      'Enfourner 25-30 min, retourner à mi-cuisson',
    ],
    tip: 'Papier cuisson = zéro nettoyage. Prépare pour 3 jours en une seule fournée.',
  },
  porridge: {
    label: 'Porridge', icon: '🥣', time: '5 min',
    steps: [
      'Verser 200 ml d\'eau (ou lait végétal non sucré)',
      'Ajouter les flocons d\'avoine',
      'Chauffer 3-5 min à feu doux en remuant',
      'Retirer, laisser épaissir 1 min hors du feu',
    ],
    tip: 'Peut se préparer la veille (overnight oats) avec du lait froid.',
  },
  durs: {
    label: 'Œufs Durs', icon: '🥚', time: '10 min',
    steps: [
      'Placer les œufs dans de l\'eau FROIDE',
      'Porter à ébullition',
      'Cuire exactement 8 min à frémissement',
      'Plonger immédiatement dans l\'eau glacée',
    ],
    tip: 'Cuire 10-12 d\'un coup : se conservent 5 jours au réfrigérateur.',
  },
  brouilles: {
    label: 'Œufs Brouillés', icon: '🍳', time: '3-4 min',
    steps: [
      'Fouetter les blancs (+ sel, poivre)',
      'Poêle antiadhésive à feu DOUX',
      'Remuer constamment avec une spatule souple',
      'Retirer du feu avant cuisson complète (chaleur résiduelle finit)',
    ],
    tip: 'Hors du feu quand encore légèrement baveux = texture parfaite.',
  },
  cuites: {
    label: 'Lentilles', icon: '🫘', time: '25 min',
    steps: [
      'Rincer les lentilles à l\'eau froide',
      'Ratio 1 volume lentilles / 2 volumes eau',
      'Cuire 20-25 min à feu moyen, sans couvercle',
      'Saler uniquement en fin de cuisson',
    ],
    tip: 'Peut être congelé en portions. Décongèle en 2 min au micro-ondes.',
  },
  cru: {
    label: 'Cru / Frais', icon: '🥗', time: '2 min',
    steps: [
      'Laver soigneusement sous eau froide',
      'Essorer ou sécher avec un torchon propre',
      'Couper si nécessaire (grosseur d\'une bouchée)',
      'Assaisonner juste avant de servir',
    ],
    tip: 'Maximum de vitamines et d\'enzymes préservées.',
  },
  cuisson: {
    label: 'Assaisonnement / Finition', icon: '🫒', time: '1 min',
    steps: [
      'Utiliser cru sur les préparations chaudes ou froides',
      'Doser précisément à la cuillère à soupe (15ml)',
      'Ne pas chauffer l\'huile d\'olive vierge au-dessus de 180°C',
    ],
    tip: 'Toujours ajouter après cuisson pour préserver les polyphénols.',
  },
}
