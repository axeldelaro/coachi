import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import useUserDoc from '../hooks/useUserDoc'
import { useTheme } from '../context/ThemeContext'
import { LogOut, Save } from 'lucide-react'

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

function SliderRow({ id, label, value, min, max, step = 1, unit, onChange }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="text-sm text-white">{label}</label>
        <span className="text-sm font-bold accent-text">{value} {unit}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        style={{ accentColor: 'var(--accent)' }}
      />
    </div>
  )
}

export default function ProfilePage() {
  const { data }                 = useOutletContext()
  const { updateProfile }        = useUserDoc()
  const { setAccent, accent }    = useTheme()

  const profile = data?.profile
  const [name,       setName]      = useState(profile?.name          ?? '')
  const [weight,     setWeight]    = useState(profile?.weight        ?? 75)
  const [maxPull,    setMaxPull]   = useState(profile?.maxPullups    ?? 8)
  const [maxPush,    setMaxPush]   = useState(profile?.maxPushups    ?? 30)
  const [maxDips,    setMaxDips]   = useState(profile?.maxDips       ?? 15)
  const [maxHang,    setMaxHang]   = useState(profile?.maxHangSeconds ?? 30)
  const [equip,      setEquip]     = useState(profile?.equip ?? {
    pullupBar: true, dipBars: false, rings: false, parallettes: false,
    kettlebell: false, jumpRope: false, vest: false, band: false, abWheel: false,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    await updateProfile({
      name,
      weight:         +weight,
      maxPullups:     +maxPull,
      maxPushups:     +maxPush,
      maxDips:        +maxDips,
      maxHangSeconds: +maxHang,
      equip,
      theme: accent,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleEquip = (key) => setEquip((prev) => ({ ...prev, [key]: !prev[key] }))

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
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-dark"
        />
      </div>

      {/* Body metrics */}
      <div className="glass rounded-2xl p-4 flex flex-col gap-5 fade-up" style={{ animationDelay: '0.1s' }}>
        <p className="text-xs uppercase tracking-widest text-white/30 font-semibold">Métriques Corporelles</p>
        <SliderRow id="profile-weight"  label="Poids"           value={weight}  min={40}  max={150} step={0.5} unit="kg"  onChange={setWeight} />
      </div>

      {/* Performance maxes */}
      <div className="glass rounded-2xl p-4 flex flex-col gap-5 fade-up" style={{ animationDelay: '0.12s' }}>
        <div>
          <p className="text-xs uppercase tracking-widest text-white/30 font-semibold">Maxima d'Exercices</p>
          <p className="text-[10px] text-white/20 mt-1">Mets à jour après chaque test — les séances s'ajustent automatiquement</p>
        </div>
        <SliderRow id="profile-pullups"  label="Max Tractions"   value={maxPull} min={1}   max={40}  unit="reps" onChange={setMaxPull} />
        <SliderRow id="profile-pushups"  label="Max Pompes"      value={maxPush} min={1}   max={100} unit="reps" onChange={setMaxPush} />
        <SliderRow id="profile-dips"     label="Max Dips"        value={maxDips} min={1}   max={60}  unit="reps" onChange={setMaxDips} />
        <SliderRow id="profile-hang"     label="Suspension Max"  value={maxHang} min={5}   max={180} step={5}   unit="sec"  onChange={setMaxHang} />
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
              checked={equip[key] ?? false}
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

      {/* Save */}
      <button id="profile-save" onClick={handleSave} className="btn-primary flex items-center justify-center gap-2 fade-up" style={{ animationDelay: '0.25s' }}>
        {saved ? '✓ Sauvegardé !' : <><Save size={16} /> Sauvegarder</>}
      </button>

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
