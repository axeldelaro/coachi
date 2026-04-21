import { useState, useRef, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Send } from 'lucide-react'
import { getCoachResponse } from '../data/coachResponses'
import useUserDoc from '../hooks/useUserDoc'

const MAX_HISTORY = 60 // messages kept in Firebase (30 exchanges)

// ─── Bubble components ─────────────────────────────────────────────────────────

function CoachBubble({ msg }) {
  const isCoach = msg.role === 'coach'
  return (
    <div className={`flex gap-2.5 ${isCoach ? 'items-start' : 'items-start flex-row-reverse'} fade-up`}>
      {isCoach && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0 mt-0.5"
          style={{ background: 'linear-gradient(135deg, var(--accent), #7c1010)' }}
        >
          ⚡
        </div>
      )}
      <div
        className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
          isCoach ? 'rounded-tl-sm glass text-white' : 'rounded-tr-sm text-white font-medium'
        }`}
        style={isCoach ? {} : { background: 'var(--accent)' }}
      >
        {msg.text}
      </div>
    </div>
  )
}

function ActionBubble({ actions }) {
  const LABELS = {
    update_workout_intensity:  { icon: '🏋️', label: 'Intensité entraînement' },
    update_calorie_multiplier: { icon: '🥗', label: 'Apport calorique' },
    update_exercise_max:       { icon: '📊', label: 'Maximum exercice' },
    update_body_weight:        { icon: '⚖️', label: 'Poids de corps' },
    update_water_intake:       { icon: '💧', label: 'Hydratation' },
  }

  const formatValue = (name, args) => {
    if (name === 'update_workout_intensity')  return `Reps ×${args.multiplier?.toFixed(2)}`
    if (name === 'update_calorie_multiplier') return `Calories ×${args.multiplier?.toFixed(2)}`
    if (name === 'update_exercise_max') {
      const fieldLabels = { maxPullups: 'Tractions', maxPushups: 'Pompes', maxDips: 'Dips', maxHangSeconds: 'Suspension' }
      return `${fieldLabels[args.field] ?? args.field} → ${args.value}`
    }
    if (name === 'update_body_weight')  return `${args.weight_kg} kg`
    if (name === 'update_water_intake') return `${args.glasses} verres`
    return ''
  }

  return (
    <div className="flex items-start gap-2.5 fade-up">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5 bg-emerald-500/20 border border-emerald-500/30">
        ⚙️
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 max-w-[82%] border border-emerald-500/20">
        <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-2">Coach a modifié</p>
        {actions.map((action, i) => {
          const meta   = LABELS[action.name] ?? { icon: '🔧', label: action.name }
          const reason = action.args?.reason ?? ''
          return (
            <div key={i} className="flex items-start gap-2 mb-1 last:mb-0">
              <span>{meta.icon}</span>
              <div>
                <span className="text-xs font-semibold text-white">{formatValue(action.name, action.args)}</span>
                {reason && <p className="text-[11px] text-white/40 mt-0.5">{reason}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-2.5 items-start">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0"
        style={{ background: 'linear-gradient(135deg, var(--accent), #7c1010)' }}
      >
        ⚡
      </div>
      <div className="glass px-4 py-3.5 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white/40"
            style={{ animation: `typingDot 1.2s ${i * 0.2}s infinite ease-in-out` }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CoachPage() {
  const { data }                                          = useOutletContext()
  const { updateProfile, updateIaState, updateLogs, updateChatHistory } = useUserDoc()

  const profile = data?.profile
  const iaState = data?.iaState
  const logs    = data?.logs
  const name    = profile?.name || 'champion'

  // Welcome message shown only when no history yet
  const WELCOME = {
    role: 'coach',
    text: `Salut ${name} ! 👋 Je suis ton coach IA personnel.\n\nJe connais ton profil, tes perfs et ton programme. Pose-moi n'importe quelle question — sport, nutrition, récupération, ou même autre chose.\n\nJe peux adapter ton programme en direct : dis-moi si un exercice est trop dur ou trop facile, si tu as changé de poids, ou si tu veux faire une sèche. Je m'occupe du reste.\n\nPar quoi on commence ?`,
  }

  // Load history from Firebase data (already present in outlet context)
  const storedHistory = data?.chatHistory ?? []
  const initialMessages = storedHistory.length > 0 ? storedHistory : [WELCOME]

  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput]       = useState('')
  const [typing, setTyping]     = useState(false)
  const endRef                  = useRef(null)
  const historyLoaded           = useRef(false)

  // Sync when Firebase data arrives (first load)
  useEffect(() => {
    if (!historyLoaded.current && data?.chatHistory) {
      historyLoaded.current = true
      if (data.chatHistory.length > 0) {
        setMessages(data.chatHistory)
      }
    }
  }, [data?.chatHistory])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  // ── Execute a tool action returned by Gemini ──────────────────────────────
  const executeAction = async (action) => {
    const { name, args } = action
    if (!profile || !iaState || !logs) return

    switch (name) {
      case 'update_workout_intensity':
        await updateIaState({ ...iaState, rep_multiplier: Math.min(2.0, Math.max(0.4, args.multiplier)) })
        break
      case 'update_calorie_multiplier':
        await updateIaState({ ...iaState, cal_multiplier: Math.min(2.0, Math.max(0.5, args.multiplier)) })
        break
      case 'update_exercise_max': {
        const allowed = ['maxPullups', 'maxPushups', 'maxDips', 'maxHangSeconds']
        if (allowed.includes(args.field)) {
          await updateProfile({ ...profile, [args.field]: Math.max(0, args.value) })
        }
        break
      }
      case 'update_body_weight':
        await updateProfile({ ...profile, weight: Math.min(250, Math.max(30, args.weight_kg)) })
        break
      case 'update_water_intake':
        await updateLogs({ ...logs, water: Math.max(0, args.glasses) })
        break
      default:
        console.warn('Unknown action:', name)
    }
  }

  // ── Persist messages to Firebase (strip to MAX_HISTORY, drop action bubbles) ─
  const persistHistory = async (msgs) => {
    // Only persist 'user' and 'coach' messages (not 'action' UI bubbles)
    const persistable = msgs
      .filter(m => m.role === 'user' || m.role === 'coach')
      .slice(-MAX_HISTORY)
    await updateChatHistory(persistable)
  }

  // ── Send a message ────────────────────────────────────────────────────────
  const send = async (text) => {
    if (!text.trim() || typing) return

    const userMsg        = { role: 'user', text: text.trim() }
    const currentMessages = [...messages, userMsg]
    setMessages(currentMessages)
    setInput('')
    setTyping(true)

    // History sent to Gemini = only user/coach messages (no action bubbles)
    const geminiHistory = messages.filter(m => m.role === 'user' || m.role === 'coach')

    const { text: replyText, actions } = await getCoachResponse(
      text.trim(), profile, iaState, logs, geminiHistory,
    )

    setTyping(false)

    const newMessages = [...currentMessages, { role: 'coach', text: replyText }]

    if (actions.length > 0) {
      await Promise.all(actions.map(executeAction))
      newMessages.push({ role: 'action', actions })
    }

    setMessages(newMessages)
    await persistHistory(newMessages)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      {/* Header */}
      <div className="px-4 pt-5 pb-3 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-3 fade-up">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--accent), #7c1010)' }}
          >
            ⚡
          </div>
          <div className="flex-1">
            <h2 className="text-base font-black text-white">Coach IA</h2>
            <p className="text-[10px] text-white/30 uppercase tracking-wider">Personnalisé · Adaptatif · Temps réel</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ animation: 'pulseGlow 2s infinite' }} />
            <span className="text-[10px] text-green-400 font-semibold">En ligne</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
        style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
      >
        {messages.map((msg, i) =>
          msg.role === 'action'
            ? <ActionBubble key={i} actions={msg.actions} />
            : <CoachBubble key={i} msg={msg} />
        )}
        {typing && <TypingIndicator />}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="shrink-0 px-4 py-4 bg-[#050505] border-t border-white/5">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écris à ton coach..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors"
            disabled={typing}
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="absolute right-2 w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white disabled:opacity-30 tap-scale transition-all"
            style={input.trim() && !typing ? { background: 'var(--accent)' } : {}}
          >
            <Send size={14} />
          </button>
        </div>
      </form>

      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
