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
              } else if (txt.includes('repas specifique ?')) {
                currentReplies = [
                  { label: '🍳 Petit-déj', text: 'Idée de repas pour le petit déjeuner' },
                  { label: '🥗 Déjeuner', text: 'Idée de repas pour le déjeuner' },
                  { label: '🍽️ Dîner', text: 'Idée de repas pour le dîner' },
                  { label: '↩️ Retour', text: 'Merci, c\'est tout' },
                ]
              } else if (txt.includes('qu\'est-ce qui te bloque ?')) {
                currentReplies = [
                  { label: '🥱 Trop fatigué', text: 'Je suis trop fatigué' },
                  { label: '📉 Plus de progrès', text: 'Je ne progresse plus' },
                  { label: '↩️ Retour', text: 'Merci, c\'est tout' },
                ]
              } else if (txt.includes('trop facile, parfaite, ou vraiment epuisante ?')) {
                currentReplies = [
                  { label: '🥱 Trop facile', text: 'C\'était trop facile' },
                  { label: '👌 Parfaite', text: 'C\'était une séance parfaite' },
                  { label: '🥵 Épuisante', text: 'C\'était épuisante' },
                ]
              } else if (txt.includes('perdre du gras') && txt.includes('objectif principal')) {
                currentReplies = [
                  { label: '🔥 Sèche', text: 'Je veux faire une seche' },
                  { label: '💪 Prise de Masse', text: 'Je veux faire une prise de masse' },
                  { label: '⚖️ Maintien', text: 'Je veux faire un maintien' },
                ]
              } else if (txt.includes('zen ou sous grosse pression ?')) {
                currentReplies = [
                  { label: '🧘 Zen', text: 'Je suis zen' },
                  { label: '🤯 Sous pression', text: 'Je suis sous pression' },
                ]
              } else if (txt.includes('15 min ou 30 min ?')) {
                currentReplies = [
                  { label: '⚡ 15 min', text: 'J\'ai 15 min' },
                  { label: '⏱️ 30 min', text: 'J\'ai 30 min' },
                ]
              // --- NUTRITION PROFONDE ---
              } else if (txt.includes('proteines, de tes glucides, ou de tes graisses')) {
                currentReplies = [
                  { label: '🥩 Protéines', text: 'mes proteines' },
                  { label: '🍚 Glucides', text: 'mes glucides' },
                  { label: '🥑 Graisses', text: 'mes graisses' },
                ]
              } else if (txt.includes('tu y arrives facilement, ou ca bloque')) {
                currentReplies = [
                  { label: '💪 Facilement', text: 'j\'y arrive facilement' },
                  { label: '📉 Ça bloque', text: 'ca bloque' },
                ]
              } else if (txt.includes('le plus faible en proteines pour toi ?')) {
                currentReplies = [
                  { label: '🍳 Petit-déj', text: 'le petit dej' },
                  { label: '🥗 Déjeuner', text: 'le dejeuner' },
                  { label: '🍽️ Dîner', text: 'le diner' },
                ]
              } else if (txt.includes('manque d\'energie pendant la seance, ou plutot gonfle')) {
                currentReplies = [
                  { label: '🥱 Manque d\'énergie', text: 'manque d\'energie' },
                  { label: '🎈 Gonflé', text: 'plutot gonfle' },
                ]
              } else if (txt.includes('assez d\'avocat, d\'huile d\'olive et d\'oleagineux')) {
                currentReplies = [
                  { label: '✅ Oui', text: 'oui pour les graisses' },
                  { label: '❌ Non', text: 'non pour les graisses' },
                ]
              // --- MINDSET ---
              } else if (txt.includes('la fatigue du travail, les distractions, ou le manque de resultats')) {
                currentReplies = [
                  { label: '💼 Fatigue Travail', text: 'la fatigue du travail' },
                  { label: '📱 Distractions', text: 'les distractions' },
                  { label: '📉 Manque Résultats', text: 'le manque de resultats' },
                ]
              } else if (txt.includes('fatigue physique reelle') && txt.includes('fatigue mentale')) {
                currentReplies = [
                  { label: '🛌 Physique', text: 'fatigue physique reelle' },
                  { label: '🤯 Mentale', text: 'fatigue mentale' },
                ]
              // --- TECHNIQUE ---
              } else if (txt.includes('les tractions, les pompes, les dips, ou le core (abdos)')) {
                currentReplies = [
                  { label: '🔥 Tractions', text: 'les tractions posent probleme' },
                  { label: '🏋️ Pompes', text: 'les pompes posent probleme' },
                  { label: '💪 Dips', text: 'les dips posent probleme' },
                  { label: '🧱 Abdos (Core)', text: 'le core pose probleme' },
                ]
              } else if (txt.includes('ton dos, tes biceps, ou ton grip')) {
                currentReplies = [
                  { label: '🦍 Mon Dos', text: 'mon dos lache' },
                  { label: '💪 Mes Biceps', text: 'mes biceps lachent' },
                  { label: '✊ Mon Grip', text: 'mon grip lache' },
                ]
              } else if (txt.includes('douleur aux poignets, ou c\'est juste un manque de force')) {
                currentReplies = [
                  { label: '⚡ Douleur Poignets', text: 'douleur aux poignets' },
                  { label: '📉 Manque Force', text: 'manque de force pure' },
                ]
              } else if (txt.includes('douleur aux epaules (ou sternum), ou tu stagnes')) {
                currentReplies = [
                  { label: '⚡ Douleur (Épaules/Sternum)', text: 'douleur aux epaules' },
                  { label: '📉 Stagnation Reps', text: 'stagne au niveau des reps' },
                ]
              } else if (txt.includes('mal au bas du dos quand tu les travailles, ou tu n\'arrives pas a tenir')) {
                currentReplies = [
                  { label: '⚡ Douleur Bas du Dos', text: 'mal au bas du dos' },
                  { label: '📉 Gainage Trop Dur', text: 'pas a tenir le gainage' },
                ]
              // --- CARDIO & SOUPLESSE ---
              } else if (txt.includes('ton endurance (cardio) ou de ta mobilite (souplesse)')) {
                currentReplies = [
                  { label: '🏃 Cardio', text: 'mon endurance cardio' },
                  { label: '🤸 Souplesse', text: 'ma mobilite souplesse' },
                ]
              } else if (txt.includes('sante de ton coeur, ou dans l\'objectif principal de perdre du gras')) {
                currentReplies = [
                  { label: '❤️ Santé (Cœur)', text: 'sante de mon coeur' },
                  { label: '🔥 Perdre du Gras', text: 'pour perdre du gras' },
                ]
              } else if (txt.includes('bas du corps (hanches/jambes) ou le haut du corps (epaules/dos) qui bloque')) {
                currentReplies = [
                  { label: '🦵 Bas du Corps', text: 'bas du corps bloque' },
                  { label: '🦍 Haut du Corps', text: 'haut du corps bloque' },
                ]
              // --- RECUPERATION ---
              } else if (txt.includes('courbatures musculaires classiques (doms), ou une douleur precises')) {
                currentReplies = [
                  { label: '💪 Courbatures', text: 'c\'est des courbatures' },
                  { label: '⚡ Douleur Précise', text: 'douleur articulaire' },
                ]
              } else if (txt.includes('ca te gene le plus ? haut du corps ou bas du corps')) {
                currentReplies = [
                  { label: '🦍 Haut du Corps', text: 'courbatures haut du corps' },
                  { label: '🦵 Bas du Corps', text: 'courbatures bas du corps' },
                ]
              } else if (txt.includes('epaule, coude, poignet, genou')) {
                currentReplies = [
                  { label: '🦴 Épaule', text: 'douleur a l\'epaule' },
                  { label: '💪 Coude', text: 'douleur au coude' },
                  { label: '✊ Poignet', text: 'douleur au poignet' },
                  { label: '🦵 Genou', text: 'douleur au genou' },
                ]
              // --- HYDRATATION ---
              } else if (txt.includes('eau plate, ou tu utilises aussi des boissons sport')) {
                currentReplies = [
                  { label: '💧 Eau plate', text: 'surtout de l\'eau plate' },
                  { label: '☕ Thé/Café aussi', text: 'du the et du cafe aussi' },
                ]
              // --- SOMMEIL ---
              } else if (txt.includes('du mal a t\'endormir, ou tu te reveilles pendant la nuit')) {
                currentReplies = [
                  { label: '😩 Mal à m\'endormir', text: 'du mal a m\'endormir' },
                  { label: '😰 Réveils nocturnes', text: 'je me reveille pendant la nuit' },
                ]
              } else if (txt.includes('quelle heure tu te couches')) {
                currentReplies = [
                  { label: '🌙 Avant 22h', text: 'je me couche a 22h' },
                  { label: '🌃 Après 23h', text: 'je me couche vers minuit' },
                ]
              // --- PLATEAU ---
              } else if (txt.includes('moins de 2 semaines ou plus de 2 semaines')) {
                currentReplies = [
                  { label: '📅 < 2 semaines', text: 'moins de 2 semaines' },
                  { label: '📆 > 2 semaines', text: 'plus de 2 semaines' },
                ]
              } else if (txt.includes('sur quel exercice tu stagnes ? tractions, pompes, ou dips')) {
                currentReplies = [
                  { label: '🔥 Tractions', text: 'stagne tractions' },
                  { label: '🏋️ Pompes', text: 'stagne pompes' },
                  { label: '💪 Dips', text: 'stagne dips' },
                ]
              // --- EQUIPEMENT ---
              } else if (txt.includes('quoi acheter en priorite, ou') && txt.includes('optimiser ce que tu as')) {
                currentReplies = [
                  { label: '🛒 Quoi acheter', text: 'quoi acheter en priorite' },
                  { label: '⚙️ Optimiser', text: 'optimiser ce que j\'ai' },
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
