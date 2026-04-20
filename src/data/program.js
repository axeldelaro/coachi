// Weekly calisthenics programme — Mon(0) to Sun(6)
export const program = [
  {
    day: 0, label: 'Lun', type: 'Push 💪',
    exercises: [
      { id: 'pushup',       name: 'Pompes',           sets: 4, intensityPct: 0.75, maxKey: 'maxPushups', equipment: null,
        cues: ['Corps gainé, épaules stables', 'Descendre jusqu\'au sol', 'Expirer en poussant'] },
      { id: 'dip',          name: 'Dips (chaise)',     sets: 3, intensityPct: 0.70, maxKey: 'maxPushups', equipment: null,
        cues: ['Pencher légèrement en avant', 'Coudes près du corps', 'ROM complète'] },
      { id: 'pike_pushup',  name: 'Pompes Pike',       sets: 3, intensityPct: 0.65, maxKey: 'maxPushups', equipment: null,
        cues: ['Hanches hautes en V', 'Front vers le sol', 'Travail épaules'] },
      { id: 'diamond_pu',   name: 'Pompes Diamant',    sets: 3, intensityPct: 0.55, maxKey: 'maxPushups', equipment: null,
        cues: ['Pouces & index forment un diamant', 'Cibles : triceps', 'Lent en descente'] },
    ],
  },
  {
    day: 1, label: 'Mar', type: 'Pull 🔥',
    exercises: [
      { id: 'pullup',       name: 'Tractions',         sets: 4, intensityPct: 0.75, maxKey: 'maxPullups', equipment: 'pullupBar',
        substitute: { name: 'Tirage Inversé (Table)', cues: ['Corps incliné max', 'Tirer le sternum', 'Pause en haut 1s'] },
        cues: ['Coudes vers le bas', 'Omoplates serrées en haut', 'Chin over bar'] },
      { id: 'chin_up',      name: 'Supination Chins',  sets: 3, intensityPct: 0.65, maxKey: 'maxPullups', equipment: 'pullupBar',
        substitute: { name: 'Rangée sur Table', cues: ['Prise supination', 'Tirer vers le nombril'] },
        cues: ['Prise paumes vers soi', 'Biceps en priorité', 'Full extension en bas'] },
      { id: 'scap_pull',    name: 'Rétraction Scap.',  sets: 3, intensityPct: 1.0,  maxKey: 'maxPullups', fixedReps: 10, equipment: 'pullupBar',
        substitute: { name: 'Shrugs Dorsaux', cues: ['Mimer le mouvement debout', 'Contracter les trapèzes'] },
        cues: ['Bras tendus, serrer les omoplates', 'Tenir 2s en haut', 'Contrôle pur'] },
    ],
  },
  {
    day: 2, label: 'Mer', type: 'Core 🧱',
    exercises: [
      { id: 'hollow',       name: 'Hollow Body Hold',  sets: 4, intensityPct: 1.0, maxKey: null, fixedReps: 30, isTime: true, equipment: null,
        cues: ['Bas du dos collé au sol', 'Bras & jambes tendus', 'Respiration contrôlée'] },
      { id: 'ab_wheel',     name: 'Roue Abdominale',   sets: 3, intensityPct: 0.70, maxKey: 'maxPushups', equipment: 'abWheel',
        substitute: { name: 'Planche (45s)', fixedReps: 45, isTime: true, cues: ['Corps droit tête-talons', 'Gainage maximal'] },
        cues: ['Partir des genoux', 'Contrôle total du retour', 'Ne pas creuser le dos'] },
      { id: 'leg_raises',   name: 'Élévations Jambes', sets: 3, intensityPct: 0.75, maxKey: 'maxPushups', equipment: null,
        cues: ['Jambes tendues', 'Pas d\'élan', 'Descente lente 3s'] },
      { id: 'mt_climber',   name: 'Mountain Climbers', sets: 3, intensityPct: 1.0, maxKey: null, fixedReps: 20, equipment: null,
        cues: ['Explosif, hanche basse', '20 reps par côté', 'Core verrouillé'] },
    ],
  },
  {
    day: 3, label: 'Jeu', type: 'Repos 🌿', isRest: true,
    restNote: 'Récupération active. Marche 20-30 min, étirements, mobilité articulaire.',
    exercises: [],
  },
  {
    day: 4, label: 'Ven', type: 'Intensité ⚡',
    exercises: [
      { id: 'pullup_max',   name: 'Tractions Intensité',sets: 5, intensityPct: 0.85, maxKey: 'maxPullups', equipment: 'pullupBar',
        substitute: { name: 'Tirage Horizontal Max', cues: ['Corps le plus incliné possible', 'Maximiser ROM'] },
        cues: ['Reps propres uniquement', 'Pas de kipping', 'Qualité > quantité'] },
      { id: 'pushup_max',   name: 'Pompes Intensité',   sets: 5, intensityPct: 0.85, maxKey: 'maxPushups', equipment: null,
        cues: ['ROM complète', 'Pause 1s en bas', 'Phase concentrique explosive'] },
      { id: 'superman',     name: 'Superman Hold',      sets: 3, intensityPct: 1.0, maxKey: null, fixedReps: 30, isTime: true, equipment: null,
        cues: ['À plat ventre', 'Lever bras & jambes simultanément', 'Contracter fessiers & dos'] },
      { id: 'arch_body',    name: 'Arch Body Hold',     sets: 3, intensityPct: 1.0, maxKey: null, fixedReps: 20, isTime: true, equipment: null,
        cues: ['Sur le ventre', 'Gainage dos actif', 'Complément du hollow'] },
    ],
  },
  {
    day: 5, label: 'Sam', type: 'Volume 🏋️',
    exercises: [
      { id: 'vol_push',     name: 'Circuit Pompes',     sets: 4, intensityPct: 0.60, maxKey: 'maxPushups', equipment: null,
        cues: ['Large → serrée → pike, enchaîner', 'Pas de repos entre variantes', '60s repos entre circuits'] },
      { id: 'vol_pull',     name: 'Circuit Tractions',  sets: 4, intensityPct: 0.60, maxKey: 'maxPullups', equipment: 'pullupBar',
        substitute: { name: 'Circuit Tirage', cues: ['Tirage inversé → rangée table → Y-T-W', 'Pas de pause entre exercices'] },
        cues: ['Prise large → neutre → supination', 'Enchaîner les variantes', 'Volume pur'] },
      { id: 'vol_dip',      name: 'Dips + Diamant',     sets: 3, intensityPct: 0.65, maxKey: 'maxPushups', equipment: null,
        cues: ['Superset : Dip puis pompe diamant', 'Zéro repos intra-superset', 'Brûlure triceps totale'] },
    ],
  },
  {
    day: 6, label: 'Dim', type: 'Repos 🌙', isRest: true,
    restNote: 'Repos complet. Prépare ta semaine. Dors au moins 8h. Hydrate-toi.',
    exercises: [],
  },
]

/** Calculate reps for an exercise */
export function calcReps(exercise, profile) {
  if (exercise.fixedReps) return exercise.fixedReps
  if (!exercise.maxKey) return 10
  const max = profile?.[exercise.maxKey] ?? 10
  const repMult = 1.0 // passed separately
  return Math.max(1, Math.round(max * exercise.intensityPct * repMult))
}
