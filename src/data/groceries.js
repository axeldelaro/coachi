// Groceries — 7-day base quantities per day at weight=63kg × cal_multiplier
// Final qty = baseQty * (weight/63) * cal_multiplier * 7

export const MACRO_ORDER = ['Protéines', 'Glucides', 'Légumes', 'Lipides']

export const groceries = [
  // ── PROTÉINES ──────────────────────────────────────────────────────────────
  {
    id: 'chicken', name: 'Blanc de Poulet', macro: 'Protéines',
    baseQty: 180, unit: 'g', cookMethod: 'vapeur',
    substitutes: [
      { id: 'turkey',    name: 'Dinde Émincée',        baseQty: 180, unit: 'g',      cookMethod: 'vapeur' },
      { id: 'tofu',      name: 'Tofu Ferme',            baseQty: 220, unit: 'g',      cookMethod: 'poele' },
      { id: 'beef',      name: 'Steak Haché 5%MG',     baseQty: 160, unit: 'g',      cookMethod: 'poele' },
      { id: 'shrimp',    name: 'Crevettes Décortiquées',baseQty: 200, unit: 'g',      cookMethod: 'vapeur' },
      { id: 'tempeh',    name: 'Tempeh',                baseQty: 180, unit: 'g',      cookMethod: 'poele' },
      { id: 'seitan',    name: 'Seitan',                baseQty: 150, unit: 'g',      cookMethod: 'poele' },
    ],
  },
  {
    id: 'eggs', name: 'Œufs Entiers', macro: 'Protéines',
    baseQty: 3, unit: 'unités', cookMethod: 'durs',
    substitutes: [
      { id: 'egg_whites',   name: "Blancs d'Œuf",      baseQty: 6,   unit: 'blancs', cookMethod: 'brouilles' },
      { id: 'cottage_prot', name: 'Skyr Nature 0%',    baseQty: 200, unit: 'g',      cookMethod: null },
      { id: 'omelette',     name: 'Œufs Omelette',     baseQty: 3,   unit: 'unités', cookMethod: 'poele' },
    ],
  },
  {
    id: 'salmon', name: 'Saumon Frais', macro: 'Protéines',
    baseQty: 130, unit: 'g', cookMethod: 'vapeur',
    substitutes: [
      { id: 'tuna',     name: 'Thon en Boîte (eau)',    baseQty: 140, unit: 'g', cookMethod: null },
      { id: 'sardine',  name: 'Sardines Huile Égouttée',baseQty: 120, unit: 'g', cookMethod: null },
      { id: 'mackerel', name: 'Maquereau Fumé',         baseQty: 130, unit: 'g', cookMethod: null },
      { id: 'tilapia',  name: 'Filet de Tilapia',       baseQty: 150, unit: 'g', cookMethod: 'vapeur' },
      { id: 'cod',      name: 'Morue / Cabillaud',      baseQty: 160, unit: 'g', cookMethod: 'vapeur' },
    ],
  },
  {
    id: 'cottage', name: 'Cottage Cheese 0%', macro: 'Protéines',
    baseQty: 150, unit: 'g', cookMethod: null,
    substitutes: [
      { id: 'greek_yogurt',  name: 'Yaourt Grec 0%',    baseQty: 150, unit: 'g', cookMethod: null },
      { id: 'fromage_blanc', name: 'Fromage Blanc 0%',  baseQty: 150, unit: 'g', cookMethod: null },
      { id: 'skyr',          name: 'Skyr Nature',        baseQty: 130, unit: 'g', cookMethod: null },
      { id: 'ricotta',       name: 'Ricotta Légère',     baseQty: 120, unit: 'g', cookMethod: null },
    ],
  },

  // ── GLUCIDES ───────────────────────────────────────────────────────────────
  {
    id: 'oat', name: "Flocons d'Avoine", macro: 'Glucides',
    baseQty: 80, unit: 'g', cookMethod: 'porridge',
    substitutes: [
      { id: 'rice',     name: 'Riz Basmati',           baseQty: 70,  unit: 'g (cru)',    cookMethod: 'vapeur' },
      { id: 'quinoa',   name: 'Quinoa',                 baseQty: 70,  unit: 'g (cru)',    cookMethod: 'bouilli' },
      { id: 'buckwheat',name: 'Sarrasin (Kasha)',       baseQty: 75,  unit: 'g (cru)',    cookMethod: 'bouilli' },
      { id: 'millet',   name: 'Millet',                 baseQty: 75,  unit: 'g (cru)',    cookMethod: 'vapeur' },
      { id: 'spelt',    name: "Épeautre (grain)",       baseQty: 70,  unit: 'g (cru)',    cookMethod: 'bouilli' },
    ],
  },
  {
    id: 'sweet_potato', name: 'Patate Douce', macro: 'Glucides',
    baseQty: 200, unit: 'g', cookMethod: 'four',
    substitutes: [
      { id: 'potato',     name: 'Pomme de Terre',        baseQty: 250, unit: 'g', cookMethod: 'vapeur' },
      { id: 'lentil',     name: 'Lentilles Vertes',      baseQty: 180, unit: 'g', cookMethod: 'cuites' },
      { id: 'chickpeas',  name: 'Pois Chiches (boîte)',  baseQty: 200, unit: 'g', cookMethod: 'égouttés' },
      { id: 'butternut',  name: 'Butternut Rôti',        baseQty: 250, unit: 'g', cookMethod: 'four' },
      { id: 'red_lentil', name: 'Lentilles Corail',      baseQty: 160, unit: 'g', cookMethod: 'cuites' },
    ],
  },
  {
    id: 'banana', name: 'Banane', macro: 'Glucides',
    baseQty: 1, unit: 'unité', cookMethod: null,
    substitutes: [
      { id: 'apple',  name: 'Pomme',            baseQty: 1, unit: 'unité',  cookMethod: null },
      { id: 'dates',  name: 'Dattes Medjool',   baseQty: 2, unit: 'unités', cookMethod: null },
      { id: 'mango',  name: 'Mangue (1/2)',      baseQty: 1, unit: 'portion',cookMethod: null },
      { id: 'kiwi',   name: 'Kiwi',             baseQty: 2, unit: 'unités', cookMethod: null },
      { id: 'figs',   name: 'Figues Fraîches',  baseQty: 2, unit: 'unités', cookMethod: null },
    ],
  },
  {
    id: 'bread', name: 'Pain de Seigle Complet', macro: 'Glucides',
    baseQty: 60, unit: 'g', cookMethod: null,
    substitutes: [
      { id: 'rice_cake',     name: 'Galettes de Riz',       baseQty: 40, unit: 'g', cookMethod: null },
      { id: 'spelt_bread',   name: "Pain d'Épeautre",        baseQty: 60, unit: 'g', cookMethod: null },
      { id: 'whole_bread',   name: 'Pain Complet',           baseQty: 60, unit: 'g', cookMethod: null },
      { id: 'buckwheat_pan', name: 'Galette Sarrasin',       baseQty: 50, unit: 'g', cookMethod: null },
      { id: 'corn_tortilla', name: 'Tortilla Maïs',          baseQty: 50, unit: 'g', cookMethod: null },
    ],
  },

  // ── LÉGUMES ────────────────────────────────────────────────────────────────
  {
    id: 'broccoli', name: 'Brocoli', macro: 'Légumes',
    baseQty: 200, unit: 'g', cookMethod: 'vapeur',
    substitutes: [
      { id: 'cauliflower',  name: 'Chou-fleur',          baseQty: 200, unit: 'g', cookMethod: 'vapeur' },
      { id: 'green_beans',  name: 'Haricots Verts',      baseQty: 200, unit: 'g', cookMethod: 'vapeur' },
      { id: 'brussels',     name: 'Choux de Bruxelles',  baseQty: 180, unit: 'g', cookMethod: 'vapeur' },
      { id: 'pak_choi',     name: 'Pak Choi',            baseQty: 200, unit: 'g', cookMethod: 'poele' },
      { id: 'edamame',      name: 'Edamame',             baseQty: 150, unit: 'g', cookMethod: 'vapeur' },
    ],
  },
  {
    id: 'spinach', name: 'Épinards Frais', macro: 'Légumes',
    baseQty: 100, unit: 'g', cookMethod: 'cru',
    substitutes: [
      { id: 'arugula',   name: 'Roquette',        baseQty: 100, unit: 'g', cookMethod: 'cru' },
      { id: 'kale',      name: 'Chou Kale',       baseQty: 80,  unit: 'g', cookMethod: 'cru' },
      { id: 'mache',     name: 'Mâche',           baseQty: 100, unit: 'g', cookMethod: 'cru' },
      { id: 'blettes',   name: 'Blettes',         baseQty: 150, unit: 'g', cookMethod: 'vapeur' },
      { id: 'watercress', name: 'Cresson',        baseQty: 80,  unit: 'g', cookMethod: 'cru' },
    ],
  },
  {
    id: 'zucchini', name: 'Courgette', macro: 'Légumes',
    baseQty: 150, unit: 'g', cookMethod: 'poele',
    substitutes: [
      { id: 'asparagus',  name: 'Asperges',           baseQty: 150, unit: 'g', cookMethod: 'vapeur' },
      { id: 'cucumber',   name: 'Concombre',          baseQty: 150, unit: 'g', cookMethod: 'cru' },
      { id: 'fennel',     name: 'Fenouil',            baseQty: 150, unit: 'g', cookMethod: 'poele' },
      { id: 'eggplant',   name: 'Aubergine',          baseQty: 200, unit: 'g', cookMethod: 'four' },
      { id: 'celery',     name: 'Céleri Branche',     baseQty: 150, unit: 'g', cookMethod: 'cru' },
    ],
  },
  {
    id: 'tomato', name: 'Tomates Cerises', macro: 'Légumes',
    baseQty: 100, unit: 'g', cookMethod: 'cru',
    substitutes: [
      { id: 'bell_pepper', name: 'Poivron Rouge',    baseQty: 100, unit: 'g', cookMethod: 'cru' },
      { id: 'radish',      name: 'Radis',            baseQty: 100, unit: 'g', cookMethod: 'cru' },
      { id: 'carrot',      name: 'Carotte Râpée',    baseQty: 100, unit: 'g', cookMethod: 'cru' },
      { id: 'beet',        name: 'Betterave Cuite',  baseQty: 100, unit: 'g', cookMethod: 'cuit' },
    ],
  },

  // ── LIPIDES ────────────────────────────────────────────────────────────────
  {
    id: 'olive_oil', name: "Huile d'Olive Extra Vierge", macro: 'Lipides',
    baseQty: 15, unit: 'ml', cookMethod: 'cru',
    substitutes: [
      { id: 'avocado_oil', name: "Huile d'Avocat",     baseQty: 15, unit: 'ml', cookMethod: 'cuisson' },
      { id: 'walnut_oil',  name: 'Huile de Noix',      baseQty: 15, unit: 'ml', cookMethod: 'cru' },
      { id: 'coconut_oil', name: 'Huile de Coco Bio',  baseQty: 12, unit: 'ml', cookMethod: 'cuisson' },
    ],
  },
  {
    id: 'avocado', name: 'Avocat', macro: 'Lipides',
    baseQty: 0.5, unit: 'unité', cookMethod: 'cru',
    substitutes: [
      { id: 'tahini',     name: 'Purée de Sésame (Tahini)', baseQty: 20, unit: 'g', cookMethod: null },
      { id: 'chia',       name: 'Graines de Chia',          baseQty: 20, unit: 'g', cookMethod: null },
      { id: 'flax',       name: 'Graines de Lin Moulues',   baseQty: 20, unit: 'g', cookMethod: null },
      { id: 'brazil_nut', name: 'Noix du Brésil',           baseQty: 20, unit: 'g', cookMethod: null },
    ],
  },
  {
    id: 'almonds', name: 'Amandes', macro: 'Lipides',
    baseQty: 30, unit: 'g', cookMethod: 'cru',
    substitutes: [
      { id: 'walnuts',    name: 'Noix',                    baseQty: 25, unit: 'g', cookMethod: 'cru' },
      { id: 'cashews',    name: 'Noix de Cajou',           baseQty: 30, unit: 'g', cookMethod: 'cru' },
      { id: 'pistachios', name: 'Pistaches',               baseQty: 30, unit: 'g', cookMethod: 'cru' },
      { id: 'peanut_butter', name: 'Beurre de Cacahuète', baseQty: 20, unit: 'g', cookMethod: null },
      { id: 'pumpkin_seeds', name: 'Graines de Courge',   baseQty: 25, unit: 'g', cookMethod: 'cru' },
    ],
  },
]

/** Calculate 7-day scaled quantity */
export function calcQty(baseQty, weight, calMultiplier) {
  return Math.round(baseQty * (weight / 63) * calMultiplier * 7 * 10) / 10
}

/** Return the active ingredient (original or chosen substitute), respecting blacklist */
export function resolveIngredient(item, groceryPrefs, blacklist = []) {
  let chosenId = groceryPrefs?.[item.id]

  // If chosen substitute is blacklisted, fallback
  if (chosenId && blacklist.includes(chosenId)) {
    chosenId = null
  }

  // If base item is blacklisted, auto-pick first valid substitute
  if (!chosenId && blacklist.includes(item.id)) {
    const firstValidSub = item.substitutes.find((s) => !blacklist.includes(s.id))
    if (firstValidSub) chosenId = firstValidSub.id
  }

  if (!chosenId) return item

  const sub = item.substitutes.find((s) => s.id === chosenId)
  return sub ? { ...item, ...sub } : item
}
