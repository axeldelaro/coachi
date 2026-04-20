import { useRef, useState, useEffect, useCallback } from 'react'
import { X, Check, Play, SkipForward } from 'lucide-react'
import useWakeLock from '../../hooks/useWakeLock'

const TIMER_SECONDS = 90

function useAudio() {
  const ctxRef = useRef(null)
  const getCtx = () => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    return ctxRef.current
  }
  const beep = useCallback((duration = 0.12, freq = 880, gain = 0.3) => {
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.connect(g); g.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'square'
      g.gain.setValueAtTime(gain, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
    } catch (_) {}
  }, [])
  return { beep }
}

export default function ActiveSession({ day, profile, repMultiplier, onClose }) {
  useWakeLock(true)
  const { beep } = useAudio()

  const exercises = day.exercises || []
  const [exIdx,  setExIdx]  = useState(0)
  const [seriesDone, setSeriesDone] = useState([]) // array of Set per exercise
  const [timer, setTimer]   = useState(null) // null | number
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const timerRef = useRef(null)

  // Init series state
  useEffect(() => {
    setSeriesDone(exercises.map((ex) => new Set()))
  }, [])

  const currentEx = exercises[exIdx]

  const calcRep = (ex) => {
    if (ex.fixedReps) return ex.fixedReps
    if (!ex.maxKey) return 10
    const max = profile?.[ex.maxKey] ?? 10
    return Math.max(1, Math.round(max * ex.intensityPct * repMultiplier))
  }

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setTimer(TIMER_SECONDS)
    setRunning(true)
  }

  useEffect(() => {
    if (!running) return
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        const next = prev - 1
        if ([3, 2, 1].includes(next)) beep(0.1, 880)
        if (next <= 0) {
          beep(0.5, 440, 0.5)
          navigator.vibrate?.([200, 100, 200])
          setRunning(false)
          clearInterval(timerRef.current)
          return 0
        }
        return next
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [running])

  const toggleSerie = (serieIdx) => {
    const updated = seriesDone.map((s, i) => {
      if (i !== exIdx) return s
      const next = new Set(s)
      next.has(serieIdx) ? next.delete(serieIdx) : next.add(serieIdx)
      return next
    })
    setSeriesDone(updated)
    // Start rest timer on check
    const nowChecked = !seriesDone[exIdx]?.has(serieIdx)
    if (nowChecked) startTimer()
    navigator.vibrate?.(30)
  }

  const nextExercise = () => {
    if (exIdx < exercises.length - 1) {
      setExIdx(exIdx + 1)
      setTimer(null)
      setRunning(false)
      clearInterval(timerRef.current)
    } else {
      setFinished(true)
    }
  }

  const totalSets  = exercises.reduce((acc, ex) => acc + ex.sets, 0)
  const doneSets   = seriesDone.reduce((acc, s) => acc + s.size, 0)
  const progress   = totalSets > 0 ? doneSets / totalSets : 0

  if (finished) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] px-6 text-center">
        <div className="text-5xl mb-4">🏆</div>
        <h2 className="text-2xl font-black text-white mb-2">Séance Terminée !</h2>
        <p className="text-white/40 text-sm mb-2">{day.type}</p>
        <div className="glass rounded-2xl px-8 py-5 mt-4 w-full max-w-xs">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/40">Exercices</span>
            <span className="font-bold text-white">{exercises.length}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/40">Séries validées</span>
            <span className="font-bold accent-text">{doneSets} / {totalSets}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Complétion</span>
            <span className="font-bold text-white">{Math.round(progress * 100)}%</span>
          </div>
        </div>
        <button id="finish-session" onClick={onClose} className="btn-primary mt-6 max-w-xs">
          Fermer
        </button>
      </div>
    )
  }

  if (!currentEx) return null

  const reps = calcRep(currentEx)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050505]" style={{ height: '100dvh' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
        <button id="close-session" onClick={onClose} className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center tap-scale">
          <X size={18} className="text-white/60" />
        </button>
        <div className="text-center">
          <p className="text-xs text-white/30 uppercase tracking-wider">{day.type}</p>
          <p className="text-sm font-bold text-white">{exIdx + 1} / {exercises.length}</p>
        </div>
        <button id="skip-exercise" onClick={nextExercise} className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center tap-scale">
          <SkipForward size={18} className="text-white/60" />
        </button>
      </div>

      {/* Progress */}
      <div className="h-1 bg-white/5 shrink-0">
        <div className="h-full transition-all duration-500 accent-bg" style={{ width: `${progress * 100}%` }} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-5 py-5 overflow-y-auto gap-5">
        {/* Exercise name */}
        <div className="text-center">
          <h2 className="text-2xl font-black text-white">{currentEx.name}</h2>
          <p className="text-sm text-white/40 mt-1">
            {currentEx.sets} séries · {reps}{currentEx.isTime ? 's' : ' reps'}
          </p>
        </div>

        {/* Timer */}
        {timer !== null && (
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                timer <= 5 ? 'border-red-500' : 'border-white/20'
              }`}
              style={timer > 5 ? {} : { borderColor: 'var(--accent)' }}
            >
              <span className={`text-3xl font-black ${timer <= 5 ? 'accent-text' : 'text-white'}`}>
                {timer}s
              </span>
            </div>
            <p className="text-xs text-white/30">Repos avant prochaine série</p>
          </div>
        )}

        {/* Series checkboxes */}
        <div className="flex flex-col gap-3">
          {[...Array(currentEx.sets)].map((_, i) => {
            const done = seriesDone[exIdx]?.has(i)
            return (
              <button
                key={i}
                id={`serie-${exIdx}-${i}`}
                onClick={() => toggleSerie(i)}
                className="flex items-center gap-4 p-4 rounded-2xl tap-scale transition-all duration-200"
                style={{
                  background: done
                    ? 'color-mix(in srgb, var(--accent) 15%, transparent)'
                    : 'rgba(255,255,255,0.04)',
                  border: done ? '1px solid color-mix(in srgb, var(--accent) 35%, transparent)' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${done ? 'accent-bg border-transparent' : 'border-white/25'}`}>
                  {done && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm font-bold text-white">Série {i + 1}</span>
                </div>
                <span className={`text-sm font-bold ${done ? 'accent-text' : 'text-white/30'}`}>
                  {reps}{currentEx.isTime ? 's' : ''}
                </span>
              </button>
            )
          })}
        </div>

        {/* Cues */}
        {currentEx.cues?.length > 0 && (
          <div className="glass-light rounded-xl p-4">
            <p className="text-xs text-white/30 uppercase tracking-wider mb-2 font-semibold">Technique</p>
            {currentEx.cues.map((cue, i) => (
              <p key={i} className="text-xs text-white/60 mb-1 leading-relaxed">• {cue}</p>
            ))}
          </div>
        )}
      </div>

      {/* Next exercise button */}
      <div className="px-5 py-4 shrink-0 border-t border-white/5">
        <button
          id="next-exercise"
          onClick={nextExercise}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {exIdx < exercises.length - 1 ? (
            <>Exercice suivant <SkipForward size={16} /></>
          ) : (
            <>Terminer la séance <Check size={16} /></>
          )}
        </button>
      </div>
    </div>
  )
}
