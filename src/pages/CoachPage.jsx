import { useOutletContext } from 'react-router-dom'
import { ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { getCoachPrompt } from '../data/coachResponses'

export default function CoachPage() {
  const { data } = useOutletContext()
  const [copied, setCopied] = useState(false)

  if (!data) return null

  const { profile, iaState, logs, groceryPrefs } = data

  const handleOpenGemini = () => {
    const prompt = getCoachPrompt(profile, iaState, logs, groceryPrefs)
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    navigator.vibrate?.(50)
    window.open('https://gemini.google.com/app?hl=fr', '_blank')
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-6 pb-2">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-2xl shadow-red-500/20"
        style={{ background: 'linear-gradient(135deg, var(--accent), #7c1010)' }}
      >
        ⚡
      </div>
      
      <div>
        <h2 className="text-2xl font-black text-white mb-2">Coach IA Externe</h2>
        <p className="text-sm text-white/50 leading-relaxed">
          Le coach est désormais propulsé par Gemini. Clique ci-dessous pour copier automatiquement tes données actuelles (poids, perfs, courses) et ouvrir l'interface.
        </p>
      </div>

      {!copied ? (
        <button
          onClick={() => {
            const prompt = getCoachPrompt(profile, iaState, logs, groceryPrefs)
            navigator.clipboard.writeText(prompt).catch(console.error)
            setCopied(true)
            navigator.vibrate?.(50)
          }}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-bold text-base tap-scale transition-all"
          style={{ background: 'linear-gradient(135deg, var(--accent), #7c1010)' }}
        >
          <Copy size={20} />
          Générer & Copier mes données
        </button>
      ) : (
        <a
          href="https://gemini.google.com/app?hl=fr"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-bold text-base tap-scale transition-all"
          style={{ background: '#22c55e' }}
        >
          <Check size={20} />
          Copié ! Ouvrir Gemini
          <ExternalLink size={16} className="text-white/50" />
        </a>
      )}

      <div className="glass px-4 py-4 rounded-2xl border border-white/5 mt-4 text-left w-full">
        <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-2">Comment ça marche ?</p>
        <ul className="text-xs text-white/60 space-y-2">
          <li className="flex gap-2">
            <span className="accent-text mt-0.5">•</span>
            <span>Le bouton copie un prompt contenant ton contexte actuel.</span>
          </li>
          <li className="flex gap-2">
            <span className="accent-text mt-0.5">•</span>
            <span>Colle ce message (Ctrl+V ou appui long) dans Gemini.</span>
          </li>
          <li className="flex gap-2">
            <span className="accent-text mt-0.5">•</span>
            <span>Demande-lui de te créer des recettes, d'ajuster ta charge d'entraînement, etc.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
