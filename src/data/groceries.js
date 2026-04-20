// Groceries — 7-day base quantities per day at weight=63kg × cal_multiplier
// Final qty = baseQty * (weight/63) * cal_multiplier * 7

export const MACRO_ORDER = ['Protéines', 'Glucides', 'Légumes', 'Lipides']

export const groceries = [
  // ── PROTÉINES ──────────────────────────────────────────────────────────────
  {
    id: 'chicken', name: 'Blanc de Poulet', macro: 'Protéines',
    baseQty: 180, unit: 'g', cookMethod: 'vapeur',
    substitutes: [
      { id: 'tofu',   name: 'Tofu Ferme',       baseQty: 220, unit: 'g', cookMethod: 'poele' },
      { id: 'turkey', name: 'Dinde Émincée',     baseQty: 180, unit: 'g', cookMethod: 'vapeur' },
    ],
  },
  {
    id: 'eggs', name: 'Œufs Entiers', macro: 'Protéines',
    baseQty: 3, unit: 'unités', cookMethod: 'durs',
    substitutes: [
      { id: 'egg_whites', name: "Blancs d'Œuf", baseQty: 6, unit: 'blancs', cookMethod: 'brouilles' },
    ],
  },
  {
    id: 'salmon', name: 'Saumon Frais', macro: 'Protéines',
    baseQty: 130, unit: 'g', cookMethod: 'vapeur',
    substitutes: [
      { id: 'tuna',    name: 'Thon en Boîte (eau)',        baseQty: 140, unit: 'g', cookMethod: null },
      { id: 'sardine', name: 'Sardines (huile égouttée)', baseQty: 120, unit: 'g', cookMethod: null },
    ],
  },
  {
    id: 'cottage', name: 'Cottage Cheese 0%', macro: 'Protéines',
    baseQty: 150, unit: 'g', cookMethod: null,
    substitutes: [
      { id: 'greek_yogurt',    name: 'Yaourt Grec 0%',       baseQty: 150, unit: 'g', cookMethod: null },
      { id: 'fromage_blanc',   name: 'Fromage Blanc 0%',     baseQty: 150, unit: 'g', cookMethod: null },
    ],
  },

  // ── GLUCIDES ───────────────────────────────────────────────────────────────
  {
    id: 'oat', name: "Flocons d'Avoine", macro: 'Glucides',
    baseQty: 80, unit: 'g', cookMethod: 'porridge',
    substitutes: [
      { id: 'rice', name: 'Riz Basmati', baseQty: 70, unit: 'g (cru)', cookMethod: 'vapeur' },
    ],
  },
  {
    id: 'sweet_potato', name: 'Patate Douce', macro: 'Glucides',
    baseQty: 200, unit: 'g', cookMethod: 'four',
    substitutes: [
      { id: 'potato', name: 'Pomme de Terre', baseQty: 250, unit: 'g', cookMethod: 'vapeur' },
      { id: 'lentil', name: 'Lentilles',       baseQty: 180, unit: 'g', cookMethod: 'cuites' },
    ],
  },
  {
    id: 'banana', name: 'Banane', macro: 'Glucides',
    baseQty: 1, unit: 'unité', cookMethod: null,
    substitutes: [
      { id: 'apple', name: 'Pomme',           baseQty: 1, unit: 'unité',  cookMethod: null },
      { id: 'dates', name: 'Dattes Medjool',  baseQty: 2, unit: 'unités', cookMethod: null },
    ],
  },
  {
    id: 'bread', name: 'Pain de Seigle Complet', macro: 'Glucides',
    baseQty: 60, unit: 'g', cookMethod: null,
    substitutes: [
      { id: 'rice_cake',   name: 'Galettes de Riz',  baseQty: 40, unit: 'g', cookMethod: null },
      { id: 'spelt_bread', name: "Pain d'Épeautre",  baseQty: 60, unit: 'g', cookMethod: null },
    ],
  },

  // ── LÉGUMES ────────────────────────────────────────────────────────────────
  {
    id: 'broccoli', name: 'Brocoli', macro: 'Légumes',
    baseQty: 200, unit: 'g', cookMethod: 'vapeur',
    substitutes: [
      { id: 'cauliflower',  name: 'Chou-fleur',     baseQty: 200, unit: 'g', cookMethod: 'vapeur' },
      { id: 'green_beans',  name: 'Haricots Verts', baseQty: 200, unit: 'g', cookMethod: 'vapeur' },
    ],
  },
  {
    id: 'spinach', name: 'Épinards Frais', macro: 'Légumes',
    baseQty: 100, unit: 'g', cookMethod: 'cru',
    substitutes: [
      { id: 'arugula', name: 'Roquette',  baseQty: 100, unit: 'g', cookMethod: 'cru' },
      { id: 'kale',    name: 'Chou Kale', baseQty: 80,  unit: 'g', cookMethod: 'cru' },
    ],
  },
  {
    id: 'zucchini', name: 'Courgette', macro: 'Légumes',
    baseQty: 150, unit: 'g', cookMethod: 'poele',
    substitutes: [
      { id: 'asparagus', name: 'Asperges',   baseQty: 150, unit: 'g', cookMethod: 'vapeur' },
      { id: 'cucumber',  name: 'Concombre',  baseQty: 150, unit: 'g', cookMethod: 'cru' },
    ],
  },
  {
    id: 'tomato', name: 'Tomates Cerises', macro: 'Légumes',
    baseQty: 100, unit: 'g', cookMethod: 'cru',
    substitutes: [
      { id: 'bell_pepper', name: 'Poivron Rouge', baseQty: 100, unit: 'g', cookMethod: 'cru' },
    ],
  },

  // ── LIPIDES ────────────────────────────────────────────────────────────────
  {
    id: 'olive_oil', name: "Huile d'Olive Extra Vierge", macro: 'Lipides',
    baseQty: 15, unit: 'ml', cookMethod: 'cru',
    substitutes: [
      { id: 'avocado_oil', name: "Huile d'Avocat", baseQty: 15, unit: 'ml', cookMethod: 'cuisson' },
    ],
  },
  {
    id: 'avocado', name: 'Avocat', macro: 'Lipides',
    baseQty: 0.5, unit: 'unité', cookMethod: 'cru',
    substitutes: [
      { id: 'tahini', name: 'Purée de Sésame (Tahini)', baseQty: 20, unit: 'g', cookMethod: null },
    ],
  },
  {
    id: 'almonds', name: 'Amandes', macro: 'Lipides',
    baseQty: 30, unit: 'g', cookMethod: 'cru',
    substitutes: [
      { id: 'walnuts',  name: 'Noix',           baseQty: 25, unit: 'g', cookMethod: 'cru' },
      { id: 'cashews',  name: 'Noix de Cajou',  baseQty: 30, unit: 'g', cookMethod: 'cru' },
    ],
  },
]

/** Calculate 7-day scaled quantity */
export function calcQty(baseQty, weight, calMultiplier) {
  return Math.round(baseQty * (weight / 63) * calMultiplier * 7 * 10) / 10
}

/** Return the active ingredient (original or chosen substitute) */
export function resolveIngredient(item, groceryPrefs) {
  const chosenId = groceryPrefs?.[item.id]
  if (!chosenId) return item
  const sub = item.substitutes.find((s) => s.id === chosenId)
  return sub ? { ...item, ...sub } : item
}
