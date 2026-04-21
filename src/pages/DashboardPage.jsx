import { useOutletContext } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MetabolicClock from '../components/dashboard/MetabolicClock'
import WaterTracker from '../components/dashboard/WaterTracker'
import EveningDebrief from '../components/dashboard/EveningDebrief'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function DashboardPage() {
  const { data, updateLogs, updateIaState } = useOutletContext()
  const [clock, setClock] = useState(new Date())

  // Refresh clock every minute
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])

  if (!data) return null

  const { logs, iaState, profile } = data
  const today = todayStr()
  const isEvening = clock.getHours() >= 18 && clock.getHours() < 24
  const alreadyDebrief = logs?.lastDebriefDate === today

  // Auto-reset water at midnight
  const lastDate = logs?.lastLogDate
  const effectiveWater = lastDate === today ? (logs?.water ?? 0) : 0

  const handleWater = async (count) => {
    navigator.vibrate?.(50)
    await updateLogs({ ...logs, water: count, lastLogDate: today })
  }

  const handleDebrief = async ({ energy, hunger, zeroCheat }) => {
    const avg = (energy + hunger) / 2
    let calMult = iaState?.cal_multiplier ?? 1.0
    let repMult = iaState?.rep_multiplier ?? 1.0

    if (avg >= 4 && zeroCheat) {
      calMult = Math.min(1.3, calMult + 0.05)
      repMult = Math.min(1.3, repMult + 0.05)
    } else if (avg <= 2 || !zeroCheat) {
      calMult = Math.max(0.7, calMult - 0.05)
      repMult = Math.max(0.7, repMult - 0.05)
    }

    // Streak logic
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yStr = yesterday.toISOString().slice(0, 10)
    let streak = logs?.streak ?? 0
    if (logs?.lastDebriefDate === yStr || logs?.lastDebriefDate === today) streak += 1
    else streak = 1

    await updateIaState({ cal_multiplier: +calMult.toFixed(2), rep_multiplier: +repMult.toFixed(2) })
    await updateLogs({ ...logs, streak, water: effectiveWater, lastLogDate: today, lastDebriefDate: today })
  }

  return (
    <div className="px-4 py-5 flex flex-col gap-5 pb-28">
      {/* Greeting */}
      <div className="fade-up">
        <p className="text-xs text-white/30 uppercase tracking-widest font-medium">Bonjour,</p>
        <h2 className="text-xl font-black text-white">{profile?.name || 'Athlète'} 👋</h2>
      </div>

      {/* Metabolic Clock */}
      <div className="glass rounded-2xl p-4 flex flex-col items-center gap-2 fade-up" style={{ animationDelay: '0.05s' }}>
        <h3 className="text-xs uppercase tracking-widest text-white/30 font-semibold self-start">Horloge métabolique</h3>
        <MetabolicClock key={clock.getMinutes()} />
      </div>

      {/* IA multipliers */}
      <div className="grid grid-cols-2 gap-3 fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Calories IA</p>
          <p className="text-lg font-black accent-text">×{(iaState?.cal_multiplier ?? 1).toFixed(2)}</p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Reps IA</p>
          <p className="text-lg font-black accent-text">×{(iaState?.rep_multiplier ?? 1).toFixed(2)}</p>
        </div>
      </div>

      {/* Water Tracker */}
      <div className="fade-up" style={{ animationDelay: '0.15s' }}>
        <WaterTracker water={effectiveWater} onToggle={handleWater} />
      </div>

      {/* Evening Debrief */}
      {isEvening && (
        <div className="fade-up" style={{ animationDelay: '0.2s' }}>
          <EveningDebrief
            iaState={iaState}
            logs={logs}
            alreadyDone={alreadyDebrief}
            onSubmit={handleDebrief}
          />
        </div>
      )}
    </div>
  )
}
