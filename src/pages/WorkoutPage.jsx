import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getProgram, calcReps } from '../data/program'
import { exerciseLibrary, defaultActiveIds } from '../data/exerciseLibrary'
import ActiveSession from '../components/workout/ActiveSession'
import ExerciseModal from '../components/workout/ExerciseModal'
import { Play, Moon, AlertCircle, ChevronUp, ChevronDown, CheckCircle2, Circle } from 'lucide-react'

export default function WorkoutPage() {
  const { data, updateProfile } = useOutletContext()
  const [activeTab, setActiveTab] = useState('program') // 'program' | 'library'
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)
  const [sessionActive, setSessionActive] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [expandedCats, setExpandedCats] = useState(['push', 'pull', 'core', 'legs', 'cardio'])

  if (!data) return null

  const { profile, iaState } = data
  const repMult = iaState?.rep_multiplier ?? 1.0
  const equip   = profile?.equip ?? {}
  
  const program = getProgram(profile)
  const day     = program[selectedDay]

  const activeIds = profile?.activeExercises || defaultActiveIds

  // --- PROGRAM TAB LOGIC ---
  const resolvedExercises = day.exercises.map((ex) => {
    if (ex.equipment && !equip[ex.equipment] && ex.substitute) {
      return { ...ex, name: ex.substitute.name, cues: ex.substitute.cues, ...(ex.substitute.fixedReps ? { fixedReps: ex.substitute.fixedReps, isTime: ex.substitute.isTime } : {}) }
    }
    return ex
  })

  const customOrder = profile?.customWorkoutOrder?.[selectedDay] || []
  const orderedExercises = [...resolvedExercises].sort((a, b) => {
    const idxA = customOrder.indexOf(a.id)
    const idxB = customOrder.indexOf(b.id)
    if (idxA !== -1 && idxB !== -1) return idxA - idxB
    if (idxA !== -1) return -1
    if (idxB !== -1) return 1
    return 0
  })

  const resolvedDay = { ...day, exercises: orderedExercises }

  const moveExercise = async (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= orderedExercises.length) return
    
    const currentOrder = orderedExercises.map(e => e.id)
    const temp = currentOrder[index]
    currentOrder[index] = currentOrder[newIndex]
    currentOrder[newIndex] = temp
    
    await updateProfile({
      ...profile,
      customWorkoutOrder: {
        ...(profile.customWorkoutOrder || {}),
        [selectedDay]: currentOrder
      }
    })
    navigator.vibrate?.(20)
  }

  // --- LIBRARY TAB LOGIC ---
  const toggleExercise = async (id) => {
    let newActive
    if (activeIds.includes(id)) {
      newActive = activeIds.filter(x => x !== id)
    } else {
      newActive = [...activeIds, id]
    }
    await updateProfile({ ...profile, activeExercises: newActive })
    navigator.vibrate?.(10)
  }

  const toggleCat = (id) => {
    setExpandedCats(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const categories = [
    { id: 'push', label: 'Push (Poussée)', color: 'text-red-400', bg: 'bg-red-400/10' },
    { id: 'pull', label: 'Pull (Tirage)', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { id: 'core', label: 'Core (Abdos)', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { id: 'legs', label: 'Legs (Jambes)', color: 'text-green-400', bg: 'bg-green-400/10' },
    { id: 'cardio', label: 'Cardio', color: 'text-purple-400', bg: 'bg-purple-400/10' }
  ]

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

      <div className="px-4 py-3 pb-2 flex flex-col gap-3">
        
        {/* Header Tabs */}
        <div className="flex gap-1 fade-up bg-white/5 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('program')} 
            className={`flex-1 py-1.5 rounded-md text-[11px] font-bold tap-scale transition-all ${activeTab === 'program' ? 'bg-white text-black shadow-sm' : 'text-white/50'}`}
          >
            Séance
          </button>
          <button 
            onClick={() => setActiveTab('library')} 
            className={`flex-1 py-1.5 rounded-md text-[11px] font-bold tap-scale transition-all ${activeTab === 'library' ? 'bg-white text-black shadow-sm' : 'text-white/50'}`}
          >
            Bibliothèque
          </button>
        </div>

        {activeTab === 'program' ? (
          // --- PROGRAM VIEW ---
          <>
            <div className="grid grid-cols-7 gap-1 w-full fade-up">
              {program.map((d, i) => {
                const isSelected = i === selectedDay
                return (
                  <button
                    key={d.day}
                    id={`day-${d.label}`}
                    onClick={() => setSelectedDay(i)}
                    className="flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg tap-scale transition-all duration-200"
                    style={
                      isSelected
                        ? { background: 'var(--accent)' }
                        : { background: 'rgba(255,255,255,0.05)' }
                    }
                  >
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider leading-none">
                      {d.label}
                    </span>
                    <span className="text-[8px] text-white/60 mt-0.5">
                      {d.isRest ? '🌙' : `${d.exercises.length}ex`}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between fade-up">
              <span className="text-sm font-black text-white">{day.type}</span>
              <div className="flex items-center gap-2">
                {!day.isRest && equip.pullupBar === false && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-yellow-500/10">
                    <AlertCircle size={9} className="text-yellow-400" />
                    <span className="text-[9px] text-yellow-400 font-medium">Sans barre</span>
                  </div>
                )}
                <span className="text-[10px] text-white/30">IA ×{repMult.toFixed(2)}</span>
              </div>
            </div>

            {day.isRest ? (
              <div className="glass rounded-2xl p-4 flex flex-col items-center text-center gap-2 flex-1 justify-center">
                <Moon size={28} className="text-white/30" />
                <p className="text-sm font-bold text-white">Jour de Repos</p>
                <p className="text-[11px] text-white/40 max-w-xs leading-relaxed">{day.restNote}</p>
              </div>
            ) : (
              <>
                {orderedExercises.length === 0 ? (
                  <div className="glass rounded-2xl p-6 flex flex-col items-center text-center gap-3">
                    <AlertCircle size={32} className="text-white/30" />
                    <p className="text-sm font-bold text-white">Aucun exercice</p>
                    <p className="text-xs text-white/40 leading-relaxed">Allez dans la Bibliothèque pour activer des exercices de cette catégorie.</p>
                  </div>
                ) : (
                  <div className="glass rounded-xl overflow-hidden fade-up flex-1">
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        {orderedExercises.map((ex, i) => {
                          const reps = calcReps(ex, profile)
                          const finalReps = Math.max(1, Math.round(reps * repMult))
                          
                          return (
                            <tr key={ex.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                              <td className="py-1 px-1 align-middle text-center w-8">
                                <div className="flex flex-col items-center">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); moveExercise(i, -1); }} 
                                    disabled={i === 0}
                                    className="p-1 text-white/30 hover:text-white disabled:opacity-10 tap-scale transition-colors"
                                  >
                                    <ChevronUp size={14} />
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); moveExercise(i, 1); }} 
                                    disabled={i === orderedExercises.length - 1}
                                    className="p-1 text-white/30 hover:text-white disabled:opacity-10 tap-scale transition-colors"
                                  >
                                    <ChevronDown size={14} />
                                  </button>
                                </div>
                              </td>
                              <td 
                                className="py-2 px-1 align-middle tap-scale cursor-pointer"
                                onClick={() => setSelectedExercise(ex)}
                              >
                                <div className="flex items-center gap-1.5">
                                  <p className="text-[13px] font-bold text-white leading-tight">{ex.name}</p>
                                  {ex.equipment && !equip[ex.equipment] && (
                                    <span className="text-[7px] px-1 py-0.5 rounded bg-yellow-500/15 text-yellow-400 font-bold uppercase tracking-wider shrink-0">Sub</span>
                                  )}
                                </div>
                                <p className="text-[9px] text-white/40 mt-0.5">
                                  {ex.sets} séries · {Math.round(ex.intensityPct * 100)}%
                                </p>
                              </td>
                              <td 
                                className="py-2 px-3 align-middle text-right tap-scale cursor-pointer"
                                onClick={() => setSelectedExercise(ex)}
                              >
                                <span className="text-[15px] font-black accent-text block leading-none">{finalReps}</span>
                                <span className="text-[7px] text-white/40 uppercase tracking-widest block mt-0.5">{ex.isTime ? 'sec' : 'reps'}</span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <button
                  id="start-session"
                  onClick={() => setSessionActive(true)}
                  disabled={orderedExercises.length === 0}
                  className="btn-primary flex items-center justify-center gap-2 mt-0 py-2.5 text-sm pulse-glow disabled:opacity-50 disabled:pulse-none rounded-xl font-bold"
                >
                  <Play size={14} fill="white" />
                  Démarrer la séance
                </button>
              </>
            )}
          </>
        ) : (
          // --- LIBRARY VIEW ---
          <div className="flex flex-col gap-3 fade-up pb-10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white">Exercices</h2>
              <span className="text-[10px] text-white/40 px-2 py-0.5 rounded-full bg-white/5">{activeIds.length} actifs</span>
            </div>

            <div className="flex flex-col gap-3">
              {categories.map(cat => {
                const catEx = exerciseLibrary.filter(e => e.category === cat.id)
                if (catEx.length === 0) return null
                const isExpanded = expandedCats.includes(cat.id)
                
                return (
                  <div key={cat.id} className="glass rounded-xl overflow-hidden">
                    <button 
                      onClick={() => toggleCat(cat.id)}
                      className={`w-full px-3 py-2 flex items-center justify-between transition-colors ${cat.bg} ${isExpanded ? 'border-b border-white/5' : ''}`}
                    >
                      <h3 className={`text-[11px] font-bold uppercase tracking-wider ${cat.color}`}>{cat.label}</h3>
                      <ChevronDown size={14} className={`text-white/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    {isExpanded && (
                      <div className="flex flex-col">
                        {catEx.map(ex => {
                          const isActive = activeIds.includes(ex.id)
                          return (
                            <div key={ex.id} className="flex items-center px-3 py-2.5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors text-left w-full">
                              <button
                                onClick={() => toggleExercise(ex.id)}
                                className="shrink-0 p-1 mr-2 tap-scale transition-colors"
                              >
                                {isActive ? (
                                  <CheckCircle2 size={16} className="text-white" />
                                ) : (
                                  <Circle size={16} className="text-white/20" />
                                )}
                              </button>
                              <button
                                onClick={() => setSelectedExercise(ex)}
                                className="flex-1 min-w-0 text-left tap-scale"
                              >
                                <p className={`text-[13px] font-bold truncate transition-colors ${isActive ? 'text-white' : 'text-white/40'}`}>
                                  {ex.name}
                                </p>
                                <p className="text-[9px] text-white/30 truncate mt-0.5">
                                  {ex.target}
                                </p>
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
