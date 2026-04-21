import { GoogleGenerativeAI } from '@google/generative-ai'
import { groceries } from './groceries'

let genAI = null

// ── Model fallback chain (best → fastest, Pro account) ───────────────────────
const MODEL_CHAIN = [
  'gemini-2.5-flash-lite',  // Primary — Fast & light
]

// Errors that should trigger a model switch
const isRetryableError = (err) => {
  const msg = err?.message?.toLowerCase() ?? ''
  const status = err?.status ?? err?.code ?? 0
  return (
    status === 429 ||
    status === 503 ||
    status === 403 || // Accès refusé (ex: modèle pro sur tier gratuit)
    status === 400 || // Bad request (parfois utilisé pour des modèles non dispo)
    msg.includes('429') ||
    msg.includes('403') ||
    msg.includes('quota') ||
    msg.includes('rate') ||
    msg.includes('resource_exhausted') ||
    msg.includes('overloaded') ||
    msg.includes('unavailable') ||
    msg.includes('forbidden') ||
    msg.includes('not found') ||
    msg.includes('model')
  )
}
// ── Lazy init ────────────────────────────────────────────────────────────────
function getGenAI() {
  if (!genAI) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) throw new Error('VITE_GEMINI_API_KEY manquante')
    genAI = new GoogleGenerativeAI(apiKey)
  }
  return genAI
}

function buildGroceryContext(groceryPrefs = {}) {
  return groceries.map(item => {
    const activeSubId  = groceryPrefs[item.id]
    const activeSub    = activeSubId ? item.substitutes.find(s => s.id === activeSubId) : null
    const currentName  = activeSub ? activeSub.name : item.name
    const subList      = item.substitutes.map(s => `${s.name}(id:${s.id})`).join(', ')
    const substituted  = activeSub ? ` [actuellement: ${activeSub.name}]` : ''
    return `• ${item.name}(id:${item.id})${substituted} [${item.macro}] — substituts: ${subList}`
  }).join('\n')
}

// ─── Tool declarations ────────────────────────────────────────────────────────
const COACH_TOOLS = [
  {
    functionDeclarations: [
      {
        name: 'update_workout_intensity',
        description:
          'Adjust the global rep multiplier to make ALL workouts easier or harder. ' +
          'Call when the user says exercises are too hard, too easy, they are tired, overtraining, etc.',
        parameters: {
          type: 'OBJECT',
          properties: {
            multiplier: {
              type: 'NUMBER',
              description: '1.0=normal. 0.7=much easier. 0.85=slightly easier. 1.15=slightly harder. 1.3=much harder. Min:0.4 Max:2.0',
            },
            reason: { type: 'STRING', description: 'Very short label for user (max 60 chars).' },
          },
          required: ['multiplier', 'reason'],
        },
      },
      {
        name: 'update_calorie_multiplier',
        description: 'Adjust the calorie multiplier (grocery quantities, meal sizes). Use for bulk/cut goals or hunger/energy issues.',
        parameters: {
          type: 'OBJECT',
          properties: {
            multiplier: { type: 'NUMBER', description: '1.0=baseline. 0.85=cut. 1.15=lean bulk. Min:0.5 Max:2.0' },
            reason: { type: 'STRING', description: 'Short label for user.' },
          },
          required: ['multiplier', 'reason'],
        },
      },
      {
        name: 'update_exercise_max',
        description: 'Update the user\'s tested maximum reps/seconds for a specific exercise after a performance test or correction.',
        parameters: {
          type: 'OBJECT',
          properties: {
            field: {
              type: 'STRING',
              enum: ['maxPullups', 'maxPushups', 'maxDips', 'maxHangSeconds'],
              description: 'Which exercise max to update.',
            },
            value: { type: 'NUMBER', description: 'New maximum value (reps or seconds).' },
            reason: { type: 'STRING', description: 'Short label.' },
          },
          required: ['field', 'value', 'reason'],
        },
      },
      {
        name: 'update_body_weight',
        description: "Update the user's current body weight in kg.",
        parameters: {
          type: 'OBJECT',
          properties: {
            weight_kg: { type: 'NUMBER', description: 'New body weight in kilograms.' },
          },
          required: ['weight_kg'],
        },
      },
      {
        name: 'update_water_intake',
        description: "Update the user's daily water intake (glasses).",
        parameters: {
          type: 'OBJECT',
          properties: {
            glasses: { type: 'NUMBER', description: 'Number of glasses of water today.' },
          },
          required: ['glasses'],
        },
      },
      {
        name: 'update_grocery_substitute',
        description:
          'Change an ingredient in the shopping list to one of its available substitutes, or reset it to the original. ' +
          'Use when the user mentions dietary restrictions, allergies, dislikes, or wants to swap a food. ' +
          'You MUST use exact IDs from the grocery context provided in your system instructions.',
        parameters: {
          type: 'OBJECT',
          properties: {
            itemId: {
              type: 'STRING',
              description: 'The base ingredient ID (e.g. "chicken", "oat", "salmon"). Must be a valid id from the grocery list.',
            },
            substituteId: {
              type: 'STRING',
              description: 'The substitute ID to apply (e.g. "tofu", "rice"), or "original" to reset to the default ingredient.',
            },
            reason: { type: 'STRING', description: 'Short label shown to user.' },
          },
          required: ['itemId', 'substituteId', 'reason'],
        },
      },
    ],
  },
]

// ─── Main chat response ───────────────────────────────────────────────────────
export async function getCoachResponse(input, profile, iaState, logs, chatHistory = [], groceryPrefs = {}) {
  const ai = getGenAI()

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

  const systemText = `Tu es le "Coach IA" de l'application fitness "Protocol Écorché".
Tu es un coach sportif expert en calisthenics, musculation et nutrition.
L'utilisateur s'appelle ${name}.

DONNÉES ACTUELLES :
- Poids : ${weight} kg | Max Tractions : ${maxPull} | Max Pompes : ${maxPush} | Max Dips : ${maxDips} | Max Suspension : ${maxHang}s
- Streak : ${streak} jours | Eau : ${water} verres | Reps ×${repMult.toFixed(2)} | Calories ×${calMult.toFixed(2)}
- Équipement : ${userEquip}

LISTE DE COURSES ACTUELLE (pour modifier les substituts via update_grocery_substitute) :
${groceryContext}

OUTILS DISPONIBLES — Utilise-les PROACTIVEMENT :
- Exercice trop dur/facile → update_workout_intensity
- Objectif sèche/prise de masse → update_calorie_multiplier
- Nouveau record → update_exercise_max
- Nouveau poids → update_body_weight
- Eau consommée → update_water_intake
- Intolérance/allergie/déteste un aliment → update_grocery_substitute avec l'id exact de la liste

STYLE : Direct, motivant, tutoiement OBLIGATOIRE. Réponses courtes. Réponds à TOUT. Ne te présente pas comme une IA.`

  // Try each model in the fallback chain
  for (let i = 0; i < MODEL_CHAIN.length; i++) {
    const modelName = MODEL_CHAIN[i]
    try {
      const model = ai.getGenerativeModel({
        model: modelName,
        systemInstruction: { parts: [{ text: systemText }] },
        tools: COACH_TOOLS,
      })

      // Build history — must start with 'user'
      const raw = chatHistory.map(m => ({ role: m.role === 'coach' ? 'model' : 'user', parts: [{ text: m.text }] }))
      let j = 0
      while (j < raw.length && raw[j].role === 'model') j++
      const history = raw.slice(j)

      const chat   = model.startChat({ history })
      const result = await chat.sendMessage(input)
      const resp   = result.response

      const calls   = resp.functionCalls?.() ?? []
      const actions = []

      if (calls.length > 0) {
        const funcResponses = calls.map(call => {
          actions.push({ name: call.name, args: call.args })
          return { functionResponse: { name: call.name, response: { success: true } } }
        })
        const final = await chat.sendMessage(funcResponses)
        return { text: final.response.text(), actions }
      }

      return { text: resp.text(), actions: [] }

    } catch (err) {
      const retryable = isRetryableError(err)
      console.warn(`[Coach] Model ${modelName} failed (retryable=${retryable}):`, err?.message ?? err)

      // If last model in chain, return error message
      if (i === MODEL_CHAIN.length - 1) {
        console.error('[Coach] All models exhausted:', err)
        return {
          text: `Tous les modèles IA sont temporairement surchargés. Réessaie dans quelques instants.`,
          actions: [],
        }
      }

      // Only switch model if retryable, otherwise propagate
      if (!retryable) {
        console.error('[Coach] Non-retryable error:', err)
        return {
          text: `Oups, une défaillance technique (${err.message?.substring(0, 60) ?? 'Erreur'}). Réessaie.`,
          actions: [],
        }
      }
      // else: loop continues with next model
    }
  }
}

// ─── Generate recipes from active grocery list ────────────────────────────────
export async function generateRecipes(activeIngredients) {
  try {
    const ai = getGenAI()
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

    const list = activeIngredients.map(i => `${i.name} (${i.macro})`).join(', ')

    const prompt = `Tu es un chef nutritionniste expert en fitness. Génère exactement 4 recettes fitness SIMPLES et RAPIDES (15-30 min) en utilisant principalement ces ingrédients disponibles: ${list}.

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ou après:
[
  {
    "name": "Nom savoureux de la recette",
    "emoji": "emoji approprié",
    "prepTime": "X min",
    "difficulty": "Facile|Moyen|Rapide",
    "macros": "~XXg protéines · XXg glucides · XXg lipides",
    "ingredients": ["Quantité Ingrédient 1", "Quantité Ingrédient 2"],
    "steps": ["Étape courte 1.", "Étape courte 2.", "Étape courte 3."]
  }
]`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Extract JSON from response (handle potential markdown code blocks)
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return []
    return JSON.parse(jsonMatch[0])
  } catch (err) {
    console.error('Erreur génération recettes:', err)
    return []
  }
}
