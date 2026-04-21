import { exerciseLibrary, defaultActiveIds } from './exerciseLibrary'

export function getProgram(profile) {
  const activeIds = profile?.activeExercises || defaultActiveIds;
  const activeLib = exerciseLibrary.filter(ex => activeIds.includes(ex.id));

  const byCat = {
    push: activeLib.filter(e => e.category === 'push'),
    pull: activeLib.filter(e => e.category === 'pull'),
    core: activeLib.filter(e => e.category === 'core'),
    legs: activeLib.filter(e => e.category === 'legs'),
    cardio: activeLib.filter(e => e.category === 'cardio'),
  }

  // Safely take 'limit' items starting from 'start' index, looping if necessary, without duplicates.
  const safeSlice = (arr, start, limit) => {
    if (!arr || arr.length === 0) return [];
    const result = [];
    for(let i=0; i<limit; i++) {
       result.push(arr[(start + i) % arr.length]);
    }
    return [...new Set(result)]; // deduplicate
  }

  return [
    {
      day: 0, label: 'Lun', type: 'Push 💪',
      exercises: safeSlice(byCat.push, 0, 5)
    },
    {
      day: 1, label: 'Mar', type: 'Pull 🔥',
      exercises: safeSlice(byCat.pull, 0, 5)
    },
    {
      day: 2, label: 'Mer', type: 'Core & Legs 🧱',
      exercises: [...safeSlice(byCat.core, 0, 3), ...safeSlice(byCat.legs, 0, 2)]
    },
    {
      day: 3, label: 'Jeu', type: 'Repos 🌿', isRest: true,
      restNote: 'Récupération active. Marche 20-30 min, étirements, mobilité articulaire.',
      exercises: [],
    },
    {
      day: 4, label: 'Ven', type: 'Intensité ⚡',
      exercises: [...safeSlice(byCat.pull, 3, 2), ...safeSlice(byCat.push, 3, 2), ...safeSlice(byCat.legs, 2, 1)]
    },
    {
      day: 5, label: 'Sam', type: 'Volume & Cardio 🏋️',
      exercises: [...safeSlice(byCat.push, 1, 1), ...safeSlice(byCat.pull, 1, 1), ...safeSlice(byCat.cardio, 0, 3)]
    },
    {
      day: 6, label: 'Dim', type: 'Repos 🌙', isRest: true,
      restNote: 'Repos complet. Prépare ta semaine. Dors au moins 8h. Hydrate-toi.',
      exercises: [],
    },
  ]
}

export function calcReps(exercise, profile) {
  if (exercise.fixedReps) return exercise.fixedReps
  if (!exercise.maxKey) return 10
  const max = profile?.[exercise.maxKey] ?? 10
  return Math.max(1, Math.round(max * exercise.intensityPct))
}
