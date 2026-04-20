import { X, Info, Target, Repeat } from 'lucide-react'

export default function ExerciseModal({ exercise, equip, onClose }) {
  if (!exercise) return null

  const isSubstituted = exercise.equipment && !equip[exercise.equipment] && exercise.substitute
  const displayEx = isSubstituted ? exercise.substitute : exercise

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#050505]/80 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-md glass rounded-3xl p-5 fade-up relative max-h-[85vh] overflow-y-auto"
        style={{ animationDuration: '0.3s' }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center tap-scale"
        >
          <X size={16} className="text-white/60" />
        </button>

        <h2 className="text-xl font-black text-white pr-8">{displayEx.name}</h2>
        {isSubstituted && (
          <div className="flex items-center gap-1 mt-2 mb-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-400 font-medium">
              Remplacement (Manque: {exercise.equipment})
            </span>
          </div>
        )}

        <div className="flex flex-col gap-5 mt-6">
          {displayEx.target && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Target size={16} className="accent-text" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-0.5">Muscles Ciblés</p>
                <p className="text-sm text-white/80 leading-relaxed font-medium">{displayEx.target}</p>
              </div>
            </div>
          )}

          {displayEx.execution && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Info size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-0.5">Exécution</p>
                <p className="text-sm text-white/80 leading-relaxed">{displayEx.execution}</p>
              </div>
            </div>
          )}

          {displayEx.cues && displayEx.cues.length > 0 && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Repeat size={16} className="text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1.5">Points Clés (Cues)</p>
                <ul className="flex flex-col gap-2">
                  {displayEx.cues.map((cue, i) => (
                    <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                      <span className="text-white/20 mt-0.5">•</span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <button onClick={onClose} className="btn-primary w-full mt-8">
          J'ai compris
        </button>
      </div>
    </div>
  )
}
