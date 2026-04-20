// Weekly calisthenics programme — Mon(0) to Sun(6)
// Equipment keys: pullupBar, dipBars, rings, parallettes, kettlebell, jumpRope, vest, abWheel

export const program = [
  {
    day: 0, label: 'Lun', type: 'Push 💪',
    exercises: [
      { id: 'pushup',       name: 'Pompes',             sets: 4, intensityPct: 0.75, maxKey: 'maxPushups', equipment: null,
        cues: ['Corps gainé, épaules stables', 'Descendre jusqu\'au sol', 'Expirer en poussant'] },
      { id: 'dip',          name: 'Dips',               sets: 3, intensityPct: 0.70, maxKey: 'maxDips', equipment: 'dipBars',
        substitute: { name: 'Dips sur Chaise', cues: ['Pieds au sol, mains sur chaise', 'Pencher en avant', 'ROM complète'] },
        cues: ['Pencher légèrement en avant', 'Coudes près du corps', 'ROM complète'] },
      { id: 'ring_pushup',  name: 'Pompes sur Anneaux', sets: 3, intensityPct: 0.60, maxKey: 'maxPushups', equipment: 'rings',
        substitute: { name: 'Pompes Pike', cues: ['Hanches hautes en V', 'Front vers le sol', 'Travail épaules'] },
        cues: ['Anneaux tournés vers l\'intérieur', 'Stabilisation maximale', 'Travail profond des pectoraux'] },
      { id: 'pike_pushup',  name: 'Pompes Pike',        sets: 3, intensityPct: 0.65, maxKey: 'maxPushups', equipment: null,
        cues: ['Hanches hautes en V', 'Front vers le sol', 'Travail épaules'] },
      { id: 'diamond_pu',   name: 'Pompes Diamant',     sets: 3, intensityPct: 0.55, maxKey: 'maxPushups', equipment: null,
        cues: ['Pouces & index forment un diamant', 'Cibles : triceps', 'Lent en descente'] },
    ],
  },
  {
    day: 1, label: 'Mar', type: 'Pull 🔥',
    exercises: [
      { id: 'pullup',       name: 'Tractions',          sets: 4, intensityPct: 0.75, maxKey: 'maxPullups', equipment: 'pullupBar',
        substitute: { name: 'Tirage Inversé (Table)', cues: ['Corps incliné max', 'Tirer le sternum', 'Pause en haut 1s'] },
        cues: ['Coudes vers le bas', 'Omoplates serrées en haut', 'Chin over bar'] },
      { id: 'ring_row',     name: 'Tractions sur Anneaux', sets: 3, intensityPct: 0.70, maxKey: 'maxPullups', equipment: 'rings',
        substitute: { name: 'Rangée sur Table', cues: ['Prise neutre', 'Tirer vers le nombril', 'Corps droit'] },
        cues: ['Corps inclinable selon difficulté', 'Coudes proches', 'Pause en haut 1s'] },
      { id: 'chin_up',      name: 'Supination Chins',   sets: 3, intensityPct: 0.65, maxKey: 'maxPullups', equipment: 'pullupBar',
        substitute: { name: 'Rangée sur Table', cues: ['Prise supination', 'Tirer vers le nombril'] },
        cues: ['Prise paumes vers soi', 'Biceps en priorité', 'Full extension en bas'] },
      { id: 'scap_pull',    name: 'Rétraction Scap.',   sets: 3, intensityPct: 1.0,  maxKey: 'maxPullups', fixedReps: 10, equipment: 'pullupBar',
        substitute: { name: 'Shrugs Dorsaux', cues: ['Mimer le mouvement debout', 'Contracter les trapèzes'] },
        cues: ['Bras tendus, serrer les omoplates', 'Tenir 2s en haut', 'Contrôle pur'] },
      { id: 'dead_hang',    name: 'Dead Hang (grip)',    sets: 3, intensityPct: 1.0, maxKey: null, fixedReps: 30, isTime: true, equipment: 'pullupBar',
        substitute: { name: 'Serrer les Poings', fixedReps: 30, isTime: true, cues: ['Serrer fort une balle', 'Grip statique', 'Alterner les mains'] },
        cues: ['Omoplates actives', 'Respiration lente', 'Progresser vers 60s'] },
    ],
  },
  {
    day: 2, label: 'Mer', type: 'Core 🧱',
    exercises: [
      { id: 'hollow',       name: 'Hollow Body Hold',   sets: 4, intensityPct: 1.0, maxKey: null, fixedReps: 30, isTime: true, equipment: null,
        cues: ['Bas du dos collé au sol', 'Bras & jambes tendus', 'Respiration contrôlée'] },
      { id: 'l_sit',        name: 'L-Sit (Parallettes)', sets: 3, intensityPct: 1.0, maxKey: null, fixedReps: 15, isTime: true, equipment: 'parallettes',
        substitute: { name: 'L-Sit sur Chaises', fixedReps: 10, isTime: true, cues: ['Mains sur 2 chaises', 'Genoux pliés si nécessaire', 'Corps soulevé du sol'] },
        cues: ['Bras tendus, épaules basses', 'Jambes à l\'horizontale', 'Core maximal'] },
      { id: 'ab_wheel',     name: 'Roue Abdominale',    sets: 3, intensityPct: 0.70, maxKey: 'maxPushups', equipment: 'abWheel',
        substitute: { name: 'Planche (45s)', fixedReps: 45, isTime: true, cues: ['Corps droit tête-talons', 'Gainage maximal'] },
        cues: ['Partir des genoux', 'Contrôle total du retour', 'Ne pas creuser le dos'] },
      { id: 'leg_raises',   name: 'Élévations Jambes',  sets: 3, intensityPct: 0.75, maxKey: 'maxPushups', equipment: null,
        cues: ['Jambes tendues', 'Pas d\'élan', 'Descente lente 3s'] },
      { id: 'mt_climber',   name: 'Mountain Climbers',  sets: 3, intensityPct: 1.0, maxKey: null, fixedReps: 20, equipment: null,
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
      { id: 'pullup_max',   name: 'Tractions Intensité', sets: 5, intensityPct: 0.85, maxKey: 'maxPullups', equipment: 'pullupBar',
        substitute: { name: 'Tirage Horizontal Max', cues: ['Corps le plus incliné possible', 'Maximiser ROM'] },
        cues: ['Reps propres uniquement', 'Pas de kipping', 'Qualité > quantité'] },
      { id: 'ring_dip',     name: 'Dips sur Anneaux',    sets: 3, intensityPct: 0.65, maxKey: 'maxDips', equipment: 'rings',
        substitute: { name: 'Dips Intensité', cues: ['Dips sur chaise, charge max', 'Pause 1s en bas', 'Explosif en montée'] },
        cues: ['Anneaux tournés vers l\'intérieur en haut', 'Contrôle total', 'Difficile — progression lente'] },
      { id: 'pushup_max',   name: 'Pompes Intensité',    sets: 5, intensityPct: 0.85, maxKey: 'maxPushups', equipment: null,
        cues: ['ROM complète', 'Pause 1s en bas', 'Phase concentrique explosive'] },
      { id: 'kb_swing',     name: 'Kettlebell Swings',   sets: 4, intensityPct: 1.0, maxKey: null, fixedReps: 15, equipment: 'kettlebell',
        substitute: { name: 'Superman Hold', fixedReps: 30, isTime: true, cues: ['À plat ventre', 'Lever bras & jambes', 'Contracter fessiers & dos'] },
        cues: ['Charnière hanches (hip hinge)', 'Propulser avec les fessiers', 'Core verrouillé tout le long'] },
      { id: 'superman',     name: 'Superman Hold',       sets: 3, intensityPct: 1.0, maxKey: null, fixedReps: 30, isTime: true, equipment: null,
        cues: ['À plat ventre', 'Lever bras & jambes simultanément', 'Contracter fessiers & dos'] },
    ],
  },
  {
    day: 5, label: 'Sam', type: 'Volume 🏋️',
    exercises: [
      { id: 'vol_push',     name: 'Circuit Pompes',      sets: 4, intensityPct: 0.60, maxKey: 'maxPushups', equipment: null,
        cues: ['Large → serrée → pike, enchaîner', 'Pas de repos entre variantes', '60s repos entre circuits'] },
      { id: 'vol_pull',     name: 'Circuit Tractions',   sets: 4, intensityPct: 0.60, maxKey: 'maxPullups', equipment: 'pullupBar',
        substitute: { name: 'Circuit Tirage', cues: ['Tirage inversé → rangée table → Y-T-W', 'Pas de pause entre exercices'] },
        cues: ['Prise large → neutre → supination', 'Enchaîner les variantes', 'Volume pur'] },
      { id: 'vol_dip',      name: 'Dips Volume',         sets: 4, intensityPct: 0.65, maxKey: 'maxDips', equipment: 'dipBars',
        substitute: { name: 'Dips + Diamant (superset)', cues: ['Dip chaise puis pompe diamant', 'Zéro repos intra', 'Brûlure triceps totale'] },
        cues: ['Volume pur, focus triceps', 'Amplitude complète', 'Rythme régulier'] },
      { id: 'jump_rope',    name: 'Corde à Sauter',      sets: 3, intensityPct: 1.0, maxKey: null, fixedReps: 60, isTime: true, equipment: 'jumpRope',
        substitute: { name: 'Arch Body Hold', fixedReps: 20, isTime: true, cues: ['Sur le ventre', 'Gainage dos actif', 'Complément du hollow'] },
        cues: ['Finisher cardio', 'Rythme régulier', 'Repos 30s entre séries'] },
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
  return Math.max(1, Math.round(max * exercise.intensityPct))
}
