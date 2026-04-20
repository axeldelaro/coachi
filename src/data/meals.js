// Meals reference ingredient IDs from groceries.js
// portionMultiplier: fraction of the daily base qty used in this meal

export const meals = [
  {
    id: 'midi', time: '12h00', label: 'Déjeuner',
    icon: '🥗',
    ingredients: [
      { ingredientId: 'chicken',      portionMultiplier: 1.0 },
      { ingredientId: 'sweet_potato', portionMultiplier: 0.5 },
      { ingredientId: 'broccoli',     portionMultiplier: 0.6 },
      { ingredientId: 'olive_oil',    portionMultiplier: 0.5 },
    ],
  },
  {
    id: 'seize', time: '16h00', label: 'Collation',
    icon: '🫙',
    ingredients: [
      { ingredientId: 'cottage',  portionMultiplier: 1.0 },
      { ingredientId: 'banana',   portionMultiplier: 0.5 },
      { ingredientId: 'almonds',  portionMultiplier: 0.5 },
    ],
  },
  {
    id: 'soir', time: '19h30', label: 'Dîner',
    icon: '🐟',
    ingredients: [
      { ingredientId: 'salmon',   portionMultiplier: 1.0 },
      { ingredientId: 'oat',      portionMultiplier: 0.4 },
      { ingredientId: 'spinach',  portionMultiplier: 1.0 },
      { ingredientId: 'avocado',  portionMultiplier: 0.5 },
    ],
  },
  {
    id: 'postworkout', time: '21h00', label: 'Post-Workout',
    icon: '⚡',
    ingredients: [
      { ingredientId: 'eggs',     portionMultiplier: 0.67 },
      { ingredientId: 'bread',    portionMultiplier: 0.5  },
      { ingredientId: 'zucchini', portionMultiplier: 0.5  },
      { ingredientId: 'tomato',   portionMultiplier: 0.5  },
    ],
  },
]
