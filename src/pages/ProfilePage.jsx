import { useState, useEffect, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import useUserDoc from '../hooks/useUserDoc'
import { useTheme } from '../context/ThemeContext'
import { LogOut, Plus, Minus } from 'lucide-react'

const ACCENT_PRESETS = [
  { label: 'Rouge',   value: '#ff3b30' },
  { label: 'Orange',  value: '#ff9f0a' },
  { label: 'Vert',    value: '#30d158' },
  { label: 'Bleu',    value: '#0a84ff' },
  { label: 'Violet',  value: '#bf5af2' },
  { label: 'Cyan',    value: '#64d2ff' },
]

const EQUIP_LIST = [
  { key: 'pullupBar',   icon: '🔧', label: 'Barre de Traction',   desc: 'Tractions, chin-ups, dead hangs' },
  { key: 'dipBars',     icon: '🏗️', label: 'Barres de Dips',       desc: 'Dips complets, L-sit sur barres' },
  { key: 'rings',       icon: '⭕', label: 'Anneaux de Gym',       desc: 'Pompes anneaux, ring rows, ring dips' },
  { key: 'parallettes', icon: '📐', label: 'Parallettes',          desc: 'L-sit, tuck planche, progressions' },
  { key: 'kettlebell',  icon: '🫙', label: 'Kettlebell',           desc: 'Swings, goblet squat, cardio force' },
  { key: 'jumpRope',    icon: '🪢', label: 'Corde à Sauter',       desc: 'Finisher cardio, coordination' },
  { key: 'vest',        icon: '🦺', label: 'Gilet Lesté',          desc: 'Surcharge progressive' },
  { key: 'band',        icon: '🟡', label: 'Élastiques',           desc: 'Assistance tractions, mobilité' },
  { key: 'abWheel',     icon: '⚙️', label: 'Roue Abdominale',      desc: 'Core profond, gainage dynamique' },
]

function Toggle({ id, checked, onChange, label, desc }) {
  return (
    <label htmlFor={id} className="flex items-center justify-between py-3 cursor-pointer">
      <div className="flex-1 pr-4">
        <span className="text-sm text-white">{label}</span>
        {desc && <p className="text-[10px] text-white/30 mt-0.5">{desc}</p>}
      </div>
      <div
        id={id}
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-all duration-200 relative cursor-pointer shrink-0 ${checked ? 'accent-bg' : 'bg-white/15'}`}
      >
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
      </div>
    </label>
  )
}

function StepperRow({ id, label, value, min, max, step = 1, unit, onChange }) {
  const handleDec = () => {
    if (value - step >= min) onChange(value - step)
  }
  const handleInc = () => {
    if (value + step <= max) onChange(value + step)
  }

  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <div className="flex flex-col pr-4">
        <label className="text-sm text-white font-medium">{label}</label>
        {unit && <span className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">{unit}</span>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button 
          onClick={handleDec} 
          disabled={value <= min}
          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center tap-scale disabled:opacity-20"
        >
          <Minus size={14} className="text-white" />
        </button>
        <div className="w-12 text-center">
          <span className="text-base font-bold accent-text">{value}</span>
        </div>
        <button 
          onClick={handleInc} 
          disabled={value >= max}
          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center tap-scale disabled:opacity-20"
        >
          <Plus size={14} className="text-white" />
        </button>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { data }                 = useOutletContext()
  const { updateProfile }        = useUserDoc()
  const { setAccent, accent }    = useTheme()

  const profile = data?.profile || {}
  const profileRef = useRef(profile)

  useEffect(() => {
    profileRef.current = profile
  }, [profile])

  const [localProf, setLocalProf] = useState({
    name:           profile.name           ?? '',
    weight:         profile.weight         ?? 75,
    maxPullups:     profile.maxPullups     ?? 8,
    maxPushups:     profile.maxPushups     ?? 30,
    maxDips:        profile.maxDips        ?? 15,
    maxHangSeconds: profile.maxHangSeconds ?? 30,
    equip:          profile.equip          ?? {
      pullupBar: true, dipBars: false, rings: false, parallettes: false,
      kettlebell: false, jumpRope: false, vest: false, band: false, abWheel: false,
    }
  })

  const handleChange = (key, value) => {
    setLocalProf((prev) => ({ ...prev, [key]: value }))
  }

  const toggleEquip = (key) => {
    setLocalProf((prev) => ({
      ...prev,
      equip: { ...prev.equip, [key]: !prev.equip[key] }
    }))
  }

  // Auto-save debounce
  useEffect(() => {
    const t = setTimeout(() => {
      // Build the final object to save
      const toSave = { ...profileRef.current, ...localProf, theme: accent }
      // Compare minimally
      if (JSON.stringify(toSave) !== JSON.stringify(profileRef.current)) {
        updateProfile(toSave)
      }
    }, 600)
    return () => clearTimeout(t)
  }, [localProf, accent, updateProfile])

  return (
    <div className="px-4 py-5 pb-28 flex flex-col gap-5">
      <div className="fade-up">
        <h2 className="text-xl font-black text-white">Profil</h2>
        <p className="text-xs text-white/30 mt-0.5">Personnalise ton coaching</p>
      </div>

      {/* Identity */}
      <div className="glass rounded-2xl p-4 flex flex-col gap-3 fade-up" style={{ animationDelay: '0.05s' }}>
        <p className="text-xs uppercase tracking-widest text-white/30 font-semibold">Identité</p>
        <input
          id="profile-name"
          type="text"
          placeholder="Ton prénom"
          value={localProf.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="input-dark"
        />
      </div>

      {/* Body metrics */}
      <div className="glass rounded-2xl p-4 flex flex-col fade-up" style={{ animationDelay: '0.1s' }}>
        <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-2">Métriques Corporelles</p>
        <StepperRow id="profile-weight"  label="Poids Actuel" value={localProf.weight} min={40} max={150} step={0.5} unit="kg" onChange={(v) => handleChange('weight', v)} />
      </div>

      {/* Performance maxes */}
      <div className="glass rounded-2xl p-4 flex flex-col fade-up" style={{ animationDelay: '0.12s' }}>
        <div className="mb-2">
          <p className="text-xs uppercase tracking-widest text-white/30 font-semibold">Maxima d'Exercices</p>
          <p className="text-[10px] text-white/20 mt-1">Mets à jour après chaque test — les séances s'ajustent automatiquement</p>
        </div>
        <div className="flex flex-col">
          <StepperRow id="profile-pullups" label="Tractions Poids de corps" value={localProf.maxPullups} min={0} max={50} unit="reps" onChange={(v) => handleChange('maxPullups', v)} />
          <StepperRow id="profile-pushups" label="Pompes Classiques" value={localProf.maxPushups} min={0} max={100} unit="reps" onChange={(v) => handleChange('maxPushups', v)} />
          <StepperRow id="profile-dips" label="Dips" value={localProf.maxDips} min={0} max={80} unit="reps" onChange={(v) => handleChange('maxDips', v)} />
          <StepperRow id="profile-hang" label="Suspension Barre" value={localProf.maxHangSeconds} min={5} max={180} step={5} unit="sec" onChange={(v) => handleChange('maxHangSeconds', v)} />
        </div>
      </div>

      {/* Equipment */}
      <div className="glass rounded-2xl px-4 py-3 flex flex-col gap-0 fade-up" style={{ animationDelay: '0.15s' }}>
        <div className="mb-2">
          <p className="text-xs uppercase tracking-widest text-white/30 font-semibold">Équipement Disponible</p>
          <p className="text-[10px] text-white/20 mt-1">Les séances s'adaptent à ce que tu as</p>
        </div>
        <div className="divide-y divide-white/5">
          {EQUIP_LIST.map(({ key, icon, label, desc }) => (
            <Toggle
              key={key}
              id={`equip-${key}`}
              checked={localProf.equip[key] ?? false}
              onChange={() => toggleEquip(key)}
              label={`${icon} ${label}`}
              desc={desc}
            />
          ))}
        </div>
      </div>

      {/* Accent color */}
      <div className="glass rounded-2xl p-4 fade-up" style={{ animationDelay: '0.2s' }}>
        <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-3">Couleur d'accent</p>
        <div className="grid grid-cols-6 gap-2">
          {ACCENT_PRESETS.map(({ label, value }) => (
            <button
              key={value}
              id={`accent-${label}`}
              onClick={() => setAccent(value)}
              title={label}
              className="w-10 h-10 rounded-xl tap-scale transition-all duration-150"
              style={{
                background: value,
                outline: accent === value ? '2px solid white' : '2px solid transparent',
                outlineOffset: '2px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Remove save button entirely, rely on auto-save */}

      {/* Logout */}
      <button
        id="logout-btn"
        onClick={() => signOut(auth)}
        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-white/40 text-sm font-semibold tap-scale fade-up"
        style={{ animationDelay: '0.3s' }}
      >
        <LogOut size={16} />
        Se déconnecter
      </button>
    </div>
  )
}
