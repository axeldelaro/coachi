import { useState, useRef, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Send, Wifi } from 'lucide-react'
import { getCoachResponse, QUICK_REPLIES } from '../data/coachResponses'

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

export default function CoachPage() {
  const { data } = useOutletContext()
  const profile = data?.profile
  const iaState = data?.iaState
  const logs    = data?.logs
  const name    = profile?.name || 'champion'

  const [messages, setMessages] = useState([
    {
      role: 'coach',
      text: `Salut ${name} ! 👋 Je suis ton coach IA personnel.\n\nJe connais ton profil, tes performances et ton programme. Pose-moi n'importe quelle question — nutrition, séance, récupération ou motivation.\n\nPar quoi on commence ?`,
    },
  ])
  const [input, setInput]   = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = async (text) => {
    if (!text.trim() || typing) return
    setMessages((prev) => [...prev, { role: 'user', text: text.trim() }])
    setInput('')
    setTyping(true)
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 700))
    const reply = getCoachResponse(text.trim(), profile, iaState, logs)
    setTyping(false)
    setMessages((prev) => [...prev, { role: 'coach', text: reply }])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      {/* Coach header */}
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
            <p className="text-[10px] text-white/30 uppercase tracking-wider">Personnalisé · Temps réel</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ animation: 'pulseGlow 2s infinite' }} />
            <span className="text-[10px] text-green-400 font-semibold">En ligne</span>
          </div>
        </div>
      </div>

      {/* Messages scroll area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
        style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
      >
        {messages.map((msg, i) => (
          <CoachBubble key={i} msg={msg} />
        ))}
        {typing && <TypingIndicator />}
        <div ref={endRef} />
      </div>

      {/* Quick replies block (Dynamic based on context) */}
      <div className="shrink-0 px-4 pb-6 pt-3 border-t border-white/5 bg-[#050505]">
        <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-3 text-center">Sélectionne une réponse</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {(() => {
            let currentReplies = QUICK_REPLIES
            const lastMsg = messages[messages.length - 1]
            if (lastMsg.role === 'coach') {
              const txt = lastMsg.text.toLowerCase()
              if (txt.includes('mouvement specifique ?') || txt.includes('quel exercice') || txt.includes('quelle zone')) {
                currentReplies = [
                  { label: '🔥 Tractions', text: 'Conseils pour les tractions' },
                  { label: '🏋️ Pompes', text: 'Conseils pour les pompes' },
                  { label: '💪 Dips', text: 'Conseils pour les dips' },
                  { label: '🦵 Jambes', text: 'Conseils pour les jambes' },
                  { label: '↩️ Retour', text: 'Merci, c\'est tout' },
                ]
              } else if (txt.includes('lequel des deux ?') || txt.includes('aigue ou diffuse ?')) {
                currentReplies = [
                  { label: '⚡ Douleur Aiguë', text: 'C\'est une douleur aigue' },
                  { label: '🔥 Courbatures', text: 'Ce sont juste des courbatures' },
                  { label: '↩️ Retour', text: 'Merci, c\'est tout' },
                ]
              } else if (txt.includes('repas specifique ?') || txt.includes('repas specifique')) {
                currentReplies = [
                  { label: '🍳 Petit-déj', text: 'Idée de repas pour le petit déjeuner' },
                  { label: '🥗 Déjeuner', text: 'Idée de repas pour le déjeuner' },
                  { label: '🍽️ Dîner', text: 'Idée de repas pour le dîner' },
                  { label: '↩️ Retour', text: 'Merci, c\'est tout' },
                ]
              } else if (txt.includes('qu\'est-ce qui te bloque ?') || txt.includes('stagnation')) {
                currentReplies = [
                  { label: '🥱 Trop fatigué', text: 'Je suis trop fatigué' },
                  { label: '📉 Plus de progrès', text: 'Je ne progresse plus' },
                  { label: '↩️ Retour', text: 'Merci, c\'est tout' },
                ]
              }
            }
            return currentReplies.map((qr) => (
              <button
                key={qr.label}
                onClick={() => send(qr.text)}
                disabled={typing}
                className="text-xs px-4 py-2.5 rounded-xl text-white font-medium tap-scale transition-all disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                {qr.label}
              </button>
            ))
          })()}
        </div>
      </div>

      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
