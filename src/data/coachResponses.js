import { GoogleGenerativeAI } from '@google/generative-ai'

let genAI = null

// ─── Tool declarations for Gemini Function Calling ────────────────────────────
const COACH_TOOLS = [
  {
    functionDeclarations: [
      {
        name: 'update_workout_intensity',
        description:
          "Adjust the global rep multiplier to make ALL workouts easier or harder. " +
          "Call this when the user says exercises are too hard, too easy, they are tired, overtraining, etc. " +
          "Do NOT hesitate to call this — it is your main lever to adapt the program.",
        parameters: {
          type: 'OBJECT',
          properties: {
            multiplier: {
              type: 'NUMBER',
              description:
                'New rep multiplier. 1.0 = normal. ' +
                '0.7 = much easier (−30%). 0.85 = slightly easier. ' +
                '1.15 = slightly harder. 1.3 = much harder (+30%). Min: 0.4. Max: 2.0.',
            },
            reason: {
              type: 'STRING',
              description: 'Very short label shown to user (max 60 chars). Ex: "Charge réduite — tu es en récup"',
            },
          },
          required: ['multiplier', 'reason'],
        },
      },
      {
        name: 'update_calorie_multiplier',
        description:
          "Adjust the calorie multiplier (grocery quantities, meal sizes). " +
          "Use when user wants to bulk, cut, mentions hunger, or goal changes.",
        parameters: {
          type: 'OBJECT',
          properties: {
            multiplier: {
              type: 'NUMBER',
              description: 'New calorie multiplier. 1.0 = baseline. 0.85 = cut. 1.15 = lean bulk. Min: 0.5. Max: 2.0.',
            },
            reason: { type: 'STRING', description: 'Short label for the user. Ex: "Apport calorique réduit — sèche"' },
          },
          required: ['multiplier', 'reason'],
        },
      },
      {
        name: 'update_exercise_max',
        description:
          "Update the user's tested maximum reps/seconds for a specific exercise. " +
          "Use after the user reports a new personal record, or corrects a wrong value.",
        parameters: {
          type: 'OBJECT',
          properties: {
            field: {
              type: 'STRING',
              enum: ['maxPullups', 'maxPushups', 'maxDips', 'maxHangSeconds'],
              description: 'Which exercise max to update.',
            },
            value: { type: 'NUMBER', description: 'New maximum value (reps or seconds).' },
            reason: { type: 'STRING', description: 'Short label. Ex: "Max tractions mis à jour → 12 reps"' },
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
        description: "Update the user's daily water intake count (glasses).",
        parameters: {
          type: 'OBJECT',
          properties: {
            glasses: { type: 'NUMBER', description: 'Number of glasses of water today.' },
          },
          required: ['glasses'],
        },
      },
    ],
  },
]

// ─── Main coach response function ────────────────────────────────────────────
export async function getCoachResponse(input, profile, iaState, logs, chatHistory = []) {
  if (!genAI) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      console.error('VITE_GEMINI_API_KEY is missing')
      return { text: "Erreur : Clé API Gemini manquante dans le fichier .env", actions: [] }
    }
    genAI = new GoogleGenerativeAI(apiKey)
  }

  const name      = profile?.name || 'champion'
  const weight    = profile?.weight ?? 75
  const maxPull   = profile?.maxPullups ?? 0
  const maxPush   = profile?.maxPushups ?? 0
  const maxDips   = profile?.maxDips ?? 0
  const maxHang   = profile?.maxHangSeconds ?? 0
  const streak    = logs?.streak ?? 0
  const water     = logs?.water ?? 0
  const calMult   = iaState?.cal_multiplier ?? 1.0
  const repMult   = iaState?.rep_multiplier ?? 1.0

  const equipMap = {
    pullupBar: 'Barre de traction', dipBars: 'Barres parallèles (dips)',
    rings: 'Anneaux de gym', parallettes: 'Parallettes', kettlebell: 'Kettlebell',
    jumpRope: 'Corde à sauter', vest: 'Gilet lesté', band: 'Élastiques', abWheel: 'Roue abdominale',
  }
  const userEquip = Object.entries(profile?.equip ?? {})
    .filter(([, v]) => v).map(([k]) => equipMap[k]).join(', ') || 'Poids du corps uniquement'

  const systemInstructionText = `Tu es le "Coach IA" de l'application fitness "Protocol Écorché".
Tu es un coach sportif expert en calisthenics, musculation et nutrition.
L'utilisateur s'appelle ${name}.

DONNÉES ACTUELLES (base tes conseils dessus) :
- Poids : ${weight} kg
- Max Tractions : ${maxPull} reps | Max Pompes : ${maxPush} reps | Max Dips : ${maxDips} reps | Max Suspension : ${maxHang}s
- Streak d'entraînement : ${streak} jours | Eau aujourd'hui : ${water} verres
- Équipement : ${userEquip}
- Multiplicateur reps actuel : ×${repMult.toFixed(2)} | Multiplicateur calories : ×${calMult.toFixed(2)}

CAPACITÉ À MODIFIER L'APPLICATION (IMPORTANT) :
Tu as accès à des outils pour modifier directement les paramètres de l'application en temps réel.
Utilise-les PROACTIVEMENT quand la conversation le justifie :
- Si l'utilisateur dit qu'un exercice est trop dur → appelle update_workout_intensity pour baisser le multiplicateur
- Si il parle de prise de masse ou de sèche → adapte update_calorie_multiplier
- Si il mentionne un nouveau record → mets à jour update_exercise_max
- Si il indique son nouveau poids → mets à jour update_body_weight
- Si il mentionne combien de verres il a bu → mets à jour update_water_intake
Applique le changement ET explique ce que tu as fait en une phrase.

STYLE :
1. Direct, motivant, tutoiement OBLIGATOIRE.
2. Réponses courtes et aérées (idéal pour lecture sur téléphone).
3. Réponds à TOUT (sport, vie, blagues, code...) avec ta vibe de coach.
4. Ne dis pas que tu es une IA. Tu es le Coach de l'application.
5. Pas de longues listes à puces.`

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction: { parts: [{ text: systemInstructionText }] },
      tools: COACH_TOOLS,
    })

    // Build history — Gemini requires history to START with 'user'
    const rawHistory = chatHistory.map(msg => ({
      role: msg.role === 'coach' ? 'model' : 'user',
      parts: [{ text: msg.text }],
    }))
    let startIdx = 0
    while (startIdx < rawHistory.length && rawHistory[startIdx].role === 'model') startIdx++
    const cleanedHistory = rawHistory.slice(startIdx)

    const chat = model.startChat({ history: cleanedHistory })
    const result = await chat.sendMessage(input)
    const response = result.response

    // Check for function calls
    const functionCalls = response.functionCalls?.() ?? []
    const actions = []

    if (functionCalls.length > 0) {
      // Execute each tool call and send results back
      const functionResponses = functionCalls.map(call => {
        actions.push({ name: call.name, args: call.args })
        return {
          functionResponse: {
            name: call.name,
            response: { success: true },
          },
        }
      })

      // Send function results back to get the final text response
      const finalResult = await chat.sendMessage(functionResponses)
      return { text: finalResult.response.text(), actions }
    }

    return { text: response.text(), actions }
  } catch (error) {
    console.error('Erreur Gemini détaillée:', error)
    return {
      text: `Oups, j'ai eu une défaillance technique (${error.message?.substring(0, 60) || 'Erreur inconnue'}). Réessaie dans quelques secondes.`,
      actions: [],
    }
  }
}

export const QUICK_REPLIES = [
  { label: '📊 Mon bilan',     text: "Où j'en suis dans ma progression par rapport à mes max ?" },
  { label: '💪 Séance du jour', text: "Donne-moi des conseils pour ma séance d'aujourd'hui." },
  { label: '🛠️ Technique',      text: "J'ai besoin d'améliorer la technique d'un mouvement." },
  { label: '🥗 Nutrition',      text: "Quels sont tes meilleurs conseils de nutrition pour moi ?" },
  { label: '🧠 Mindset',        text: "J'ai besoin d'un coup de boost pour mon mindset." },
  { label: '🎯 Mon objectif',   text: 'Je veux faire le point sur mon objectif physique.' },
  { label: '📈 Bilan séance',   text: 'Je viens de finir ma séance, on fait un bilan ?' },
  { label: '🧘 Stress',         text: "J'ai un niveau de stress assez élevé en ce moment." },
  { label: '💤 Récupération',   text: "J'ai des courbatures aujourd'hui, que faire ?" },
  { label: '🏆 Mon streak',     text: "Que penses-tu de mon streak d'entraînement actuel ?" },
  { label: '🎯 Plateau',        text: 'Je ne progresse plus sur mes reps, je stagne.' },
  { label: '😴 Sommeil',        text: "Je n'ai pas bien dormi cette nuit." },
]
