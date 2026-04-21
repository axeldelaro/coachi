import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { program, calcReps } from '../data/program'
import ActiveSession from '../components/workout/ActiveSession'
import ExerciseModal from '../components/workout/ExerciseModal'
import { Play, Moon, AlertCircle } from 'lucide-react'

export default function WorkoutPage() {
  const { data } = useOutletContext()
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)
  const [sessionActive, setSessionActive] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState(null)

  if (!data) return null

  const { profile, iaState } = data
  const repMult = iaState?.rep_multiplier ?? 1.0
  const equip   = profile?.equip ?? {}
  const day     = program[selectedDay]

  // Equipment-aware exercises
  const resolvedExercises = day.exercises.map((ex) => {
    if (ex.equipment && !equip[ex.equipment] && ex.substitute) {
      return { ...ex, name: ex.substitute.name, cues: ex.substitute.cues, ...(ex.substitute.fixedReps ? { fixedReps: ex.substitute.fixedReps, isTime: ex.substitute.isTime } : {}) }
    }
    return ex
  })
  const resolvedDay = { ...day, exercises: resolvedExercises }

  return (
    <>
      {sessionActive && (
        <ActiveSession
          day={resolvedDay}
          profile={profile}
          repMultiplier={repMult}
          onClose={() => setSessionActive(false)}
        />
      )}

      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          equip={equip}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      <div className="px-4 py-5 pb-28 flex flex-col gap-4">
        <div className="fade-up">
          <h2 className="text-xl font-black text-white">Programme</h2>
          <p className="text-xs text-white/30 mt-0.5">IA reps ×{repMult.toFixed(2)}</p>
        </div>

        {/* Day carousel */}
        <div className="flex gap-2 overflow-x-auto pb-1 fade-up" style={{ animationDelay: '0.05s', scrollbarWidth: 'none' }}>
          {program.map((d, i) => {
            const isSelected = i === selectedDay
            return (
              <button
                key={d.day}
                id={`day-${d.label}`}
                onClick={() => setSelectedDay(i)}
                className="flex flex-col items-center gap-1 shrink-0 py-2.5 px-3.5 rounded-xl tap-scale transition-all duration-200"
                style={
                  isSelected
                    ? { background: 'var(--accent)', minWidth: 60 }
                    : { background: 'rgba(255,255,255,0.05)', minWidth: 60 }
                }
              >
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">{d.label}</span>
                <span className="text-[9px] text-white/60">{d.isRest ? '😴' : d.exercises.length + 'ex'}</span>
              </button>
            )
          })}
        </div>

        {/* Day type badge */}
        <div className="flex items-center gap-2 fade-up" style={{ animationDelay: '0.1s' }}>
          <span className="text-base font-black text-white">{day.type}</span>
          {!day.isRest && equip.pullupBar === false && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/10">
              <AlertCircle size={11} className="text-yellow-400" />
              <span className="text-[10px] text-yellow-400 font-medium">Sans barre</span>
            </div>
          )}
        </div>

        {/* Rest day */}
        {day.isRest ? (
          <div className="glass rounded-2xl p-6 flex flex-col items-center text-center gap-3">
            <Moon size={32} className="text-white/30" />
            <p className="text-sm font-bold text-white">Jour de Repos</p>
            <p className="text-xs text-white/40 max-w-xs leading-relaxed">{day.restNote}</p>
          </div>
        ) : (
          <>
            {/* Exercise list */}
            <div className="flex flex-col gap-2">
              {resolvedExercises.map((ex, i) => {
                const reps = calcReps(ex, profile)
                const finalReps = Math.max(1, Math.round(reps * repMult))
                return (
                  <button 
                    key={ex.id} 
                    onClick={() => setSelectedExercise(ex)}
                    className="glass rounded-xl p-3 fade-up text-left tap-scale transition-all w-full flex items-center gap-3" 
                    style={{ animationDelay: `${0.12 + i * 0.04}s` }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex flex-col items-center justify-center shrink-0">
                      <span className="text-sm font-black accent-text leading-none">{finalReps}</span>
                      <span className="text-[8px] text-white/40 uppercase tracking-widest mt-0.5">{ex.isTime ? 'sec' : 'reps'}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white truncate">{ex.name}</p>
                        {ex.equipment && !equip[ex.equipment] && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-400 font-medium uppercase tracking-wider shrink-0">Sub</span>
                        )}
                      </div>
                      <p className="text-[10px] text-white/40 mt-0.5 truncate">
                        {ex.sets} séries · {Math.round(ex.intensityPct * 100)}% intensité
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Start session CTA */}
            <button
              id="start-session"
              onClick={() => setSessionActive(true)}
              className="btn-primary flex items-center justify-center gap-2 mt-1 pulse-glow"
            >
              <Play size={16} fill="white" />
              Démarrer la séance
            </button>
          </>
        )}
      </div>
    </>
  )
}
