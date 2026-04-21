import { groceries } from './groceries'

function buildGroceryContext(groceryPrefs = {}) {
  return groceries.map(item => {
    const activeSubId  = groceryPrefs[item.id]
    const activeSub    = activeSubId ? item.substitutes.find(s => s.id === activeSubId) : null
    const currentName  = activeSub ? activeSub.name : item.name
    const subList      = item.substitutes.map(s => `${s.name}(id:${s.id})`).join(', ')
    const substituted  = activeSub ? ` [actuellement: ${activeSub.name}]` : ''
    return `• ${item.name}${substituted} [${item.macro}]`
  }).join('\n')
}

export function getCoachPrompt(profile, iaState, logs, groceryPrefs = {}) {
  const name    = profile?.name    || 'champion'
  const weight  = profile?.weight  ?? 75
  const maxPull = profile?.maxPullups ?? 0
  const maxPush = profile?.maxPushups ?? 0
  const maxDips = profile?.maxDips    ?? 0
  const maxHang = profile?.maxHangSeconds ?? 0
  const streak  = logs?.streak ?? 0
  const water   = logs?.water  ?? 0
  const calMult = iaState?.cal_multiplier ?? 1.0
  const repMult = iaState?.rep_multiplier ?? 1.0

  const equipMap = {
    pullupBar: 'Barre de traction', dipBars: 'Barres parallèles', rings: 'Anneaux',
    parallettes: 'Parallettes', kettlebell: 'Kettlebell', jumpRope: 'Corde à sauter',
    vest: 'Gilet lesté', band: 'Élastiques', abWheel: 'Roue abdominale',
  }
  const userEquip = Object.entries(profile?.equip ?? {})
    .filter(([, v]) => v).map(([k]) => equipMap[k]).join(', ') || 'Poids du corps uniquement'

  const groceryContext = buildGroceryContext(groceryPrefs)

  return `Tu es le "Coach IA" de l'application fitness "Protocol Écorché".
Tu es un coach sportif expert en calisthenics, musculation et nutrition.
L'utilisateur s'appelle ${name}.

DONNÉES ACTUELLES :
- Poids : ${weight} kg | Max Tractions : ${maxPull} | Max Pompes : ${maxPush} | Max Dips : ${maxDips} | Max Suspension : ${maxHang}s
- Streak : ${streak} jours | Eau : ${water} verres | Reps ×${repMult.toFixed(2)} | Calories ×${calMult.toFixed(2)}
- Équipement : ${userEquip}

LISTE DE COURSES ACTUELLE :
${groceryContext}

STYLE : Direct, motivant, tutoiement OBLIGATOIRE. Réponses courtes. Réponds à TOUT. Ne te présente pas comme une IA.`
}

export function getRecipesPrompt(activeIngredients) {
  const list = activeIngredients.map(i => `${i.name} (${i.macro})`).join(', ')
  return `Tu es un chef nutritionniste expert en fitness. Génère exactement 4 recettes fitness SIMPLES et RAPIDES (15-30 min) en utilisant principalement ces ingrédients disponibles :
${list}

Donne moi ces recettes sous un format clair avec les macros, les ingrédients et les étapes de préparation.`
}

