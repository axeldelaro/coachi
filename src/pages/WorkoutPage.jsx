import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { program } from '../data/program'
import ActiveSession from '../components/workout/ActiveSession'
import { Play, Moon, ChevronRight, AlertCircle } from 'lucide-react'

function calcRep(ex, profile, repMult) {
  if (ex.fixedReps) return ex.fixedReps
  if (!ex.maxKey) return 10
  const max = profile?.[ex.maxKey] ?? 10
  return Math.max(1, Math.round(max * ex.intensityPct * repMult))
}

export default function WorkoutPage() {
  const { data } = useOutletContext()
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)
  const [sessionActive, setSessionActive] = useState(false)

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

      <div className="px-4 py-5 pb-28 flex flex-col gap-5">
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
            <div className="flex flex-col gap-3">
              {resolvedExercises.map((ex, i) => {
                const reps = calcRep(ex, profile, repMult)
                return (
                  <div key={ex.id} className="glass rounded-2xl p-4 fade-up" style={{ animationDelay: `${0.12 + i * 0.04}s` }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">#{i + 1}</span>
                          {ex.equipment && !equip[ex.equipment] && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-400 font-medium">Substitué</span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-white">{ex.name}</p>
                        <p className="text-xs text-white/40 mt-1">
                          {ex.sets} × {reps}{ex.isTime ? 's' : ' reps'} · {Math.round(ex.intensityPct * 100)}% intensité
                        </p>
                        {ex.cues?.length > 0 && (
                          <p className="text-xs text-white/25 mt-1 italic">{ex.cues[0]}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xl font-black accent-text">{reps}</span>
                        <p className="text-[9px] text-white/30">{ex.isTime ? 'sec' : 'reps'}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Start session CTA */}
            <button
              id="start-session"
              onClick={() => setSessionActive(true)}
              className="btn-primary flex items-center justify-center gap-2 mt-2 pulse-glow"
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
