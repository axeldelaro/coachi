import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

function Star({ id, value, selected, onClick }) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold tap-scale transition-all duration-150 ${
        selected ? 'accent-bg text-white' : 'bg-white/5 text-white/30'
      }`}
    >
      {value}
    </button>
  )
}

export default function EveningDebrief({ iaState, logs, onSubmit, alreadyDone }) {
  const [energy, setEnergy]   = useState(0)
  const [hunger, setHunger]   = useState(0)
  const [zeroCheat, setZero]  = useState(false)
  const [submitted, setSubmitted] = useState(alreadyDone)

  const handleSubmit = () => {
    if (!energy || !hunger) return
    onSubmit({ energy, hunger, zeroCheat })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="glass rounded-2xl p-5 flex flex-col items-center gap-2 text-center">
        <CheckCircle size={32} className="accent-text" />
        <p className="text-sm font-bold text-white">Bilan enregistré</p>
        <p className="text-xs text-white/40">Jusqu'à demain. Récupère bien.</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-bold text-white mb-0.5">Bilan du Soir</h3>
        <p className="text-xs text-white/30">Évalue ta journée pour adapter le protocole.</p>
      </div>

      {/* Energy */}
      <div>
        <p className="text-xs text-white/50 mb-2 uppercase tracking-wider font-semibold">Niveau d'énergie</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((v) => (
            <Star key={v} id={`energy-${v}`} value={v} selected={energy === v} onClick={() => setEnergy(v)} />
          ))}
        </div>
      </div>

      {/* Hunger */}
      <div>
        <p className="text-xs text-white/50 mb-2 uppercase tracking-wider font-semibold">Niveau de faim</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((v) => (
            <Star key={v} id={`hunger-${v}`} value={v} selected={hunger === v} onClick={() => setHunger(v)} />
          ))}
        </div>
      </div>

      {/* Zero cheat */}
      <button
        id="zero-cheat-toggle"
        onClick={() => setZero(!zeroCheat)}
        className={`flex items-center gap-3 p-3 rounded-xl tap-scale transition-all duration-200 ${
          zeroCheat ? 'accent-bg bg-opacity-20' : 'bg-white/5'
        }`}
        style={zeroCheat ? { background: 'color-mix(in srgb, var(--accent) 20%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 40%, transparent)' } : {}}
      >
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${zeroCheat ? 'accent-bg border-transparent' : 'border-white/20'}`}>
          {zeroCheat && <CheckCircle size={12} className="text-white" fill="white" />}
        </div>
        <span className="text-sm font-semibold text-white">Zéro écart aujourd'hui 🎯</span>
      </button>

      <button
        id="debrief-submit"
        onClick={handleSubmit}
        disabled={!energy || !hunger}
        className="btn-primary disabled:opacity-30"
      >
        Valider le bilan
      </button>
    </div>
  )
}
