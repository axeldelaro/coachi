import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini API
// We move it inside the function or make it lazy to ensure it picks up the env var correctly
let genAI = null

export async function getCoachResponse(input, profile, iaState, logs, chatHistory = []) {
  if (!genAI) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      console.error("VITE_GEMINI_API_KEY is missing")
      return "Erreur : Clé API Gemini manquante dans le fichier .env"
    }
    genAI = new GoogleGenerativeAI(apiKey)
  }

  const name = profile?.name || 'champion'
  const weight = profile?.weight ?? 75
  const maxPull = profile?.maxPullups ?? 0
  const maxPush = profile?.maxPushups ?? 0
  const maxDips = profile?.maxDips ?? 0
  const maxHang = profile?.maxHangSeconds ?? 0
  const streak = logs?.streak ?? 0
  const calMult = iaState?.cal_multiplier ?? 1.0
  const repMult = iaState?.rep_multiplier ?? 1.0

  const equipMap = {
    pullupBar: 'Barre de traction',
    dipBars: 'Barres parallèles (dips)',
    rings: 'Anneaux de gym',
    parallettes: 'Parallettes',
    kettlebell: 'Kettlebell',
    jumpRope: 'Corde à sauter',
    vest: 'Gilet lesté',
    band: 'Élastiques',
    abWheel: 'Roue abdominale'
  }

  const userEquip = Object.entries(profile?.equip ?? {})
    .filter(([_, hasEquip]) => hasEquip)
    .map(([key]) => equipMap[key])
    .join(', ') || 'Poids du corps uniquement (aucun équipement)'

  const systemInstructionText = `Tu es le "Coach IA" de l'application fitness "Protocol Écorché".
Ton rôle est d'être un coach sportif expert en calisthenics (poids du corps), musculation et nutrition.
L'utilisateur avec qui tu parles s'appelle ${name}.

Voici ses statistiques actuelles (TRÈS IMPORTANT, base tes conseils dessus) :
- Poids de corps : ${weight} kg
- Tractions max : ${maxPull} reps
- Pompes max : ${maxPush} reps
- Dips max : ${maxDips} reps
- Temps de suspension à la barre (grip) max : ${maxHang} secondes
- Jours d'entraînement consécutifs actuels (streak) : ${streak} jours
- Équipement disponible à la maison : ${userEquip}
- Multiplicateur de difficulté IA actuel (Reps) : x${repMult.toFixed(2)}
- Multiplicateur de calories IA actuel : x${calMult.toFixed(2)}

Directives de personnalité et de style :
1. Sois direct, motivant, parfois strict mais toujours bienveillant. Ne sois pas un robot ennuyeux.
2. Utilise TOUJOURS le tutoiement.
3. Fais des réponses concises, aérées et directes (idéal pour être lu sur un téléphone pendant une séance).
4. L'utilisateur veut que tu répondes à TOUT, même si on te pose des questions qui n'ont rien à voir avec le sport (philosophie, blagues, travail, code, etc.). Réponds à la question, mais garde toujours ta "vibe" de coach expert dans la manière dont tu t'exprimes.
5. Ne dis jamais que tu es une intelligence artificielle ou un modèle de langage (sauf si on te force vraiment). Agis comme le vrai coach de l'application Protocol Écorché.
6. Ne fais pas de longues listes à puces interminables, va droit au but.`

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: {
        parts: [{ text: systemInstructionText }]
      },
    })

    // Format history for Gemini (roles must be 'user' or 'model')
    // CRITICAL: Gemini requires the history to START with a 'user' message.
    // We skip all leading 'coach' (model) messages like the welcome message.
    const rawHistory = chatHistory.map(msg => ({
      role: msg.role === 'coach' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }))

    // Drop all leading 'model' messages
    let startIdx = 0
    while (startIdx < rawHistory.length && rawHistory[startIdx].role === 'model') {
      startIdx++
    }
    const cleanedHistory = rawHistory.slice(startIdx)

    const chat = model.startChat({
      history: cleanedHistory,
    })

    const result = await chat.sendMessage(input)
    return result.response.text()
  } catch (error) {
    console.error("Erreur Gemini détaillée:", error)
    return `Oups, j'ai eu une petite défaillance technique. (Détail: ${error.message || 'Erreur inconnue'}). Réessaie dans quelques secondes, champion.`
  }
}

export const QUICK_REPLIES = [
  { label: '📊 Mon bilan', text: 'Où j\'en suis dans ma progression par rapport à mes max ?' },
  { label: '💪 Séance du jour', text: 'Donne-moi des conseils pour ma séance d\'aujourd\'hui.' },
  { label: '🛠️ Technique', text: 'J\'ai besoin d\'améliorer la technique d\'un mouvement.' },
  { label: '🥗 Nutrition', text: 'Quels sont tes meilleurs conseils de nutrition pour moi ?' },
  { label: '🧠 Mindset', text: 'J\'ai besoin d\'un coup de boost pour mon mindset.' },
  { label: '🎯 Mon objectif', text: 'Je veux faire le point sur mon objectif physique.' },
  { label: '📈 Bilan séance', text: 'Je viens de finir ma séance, on fait un bilan ?' },
  { label: '🧘 Stress', text: 'J\'ai un niveau de stress assez élevé en ce moment.' },
  { label: '💤 Récupération', text: 'J\'ai des courbatures aujourd\'hui, que faire ?' },
  { label: '🏆 Mon streak', text: 'Que penses-tu de mon streak d\'entraînement actuel ?' },
  { label: '🎯 Plateau', text: 'Je ne progresse plus sur mes reps, je stagne.' },
  { label: '😴 Sommeil', text: 'Je n\'ai pas bien dormi cette nuit.' },
]
