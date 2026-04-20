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

function Toggle({ id, checked, onChange, label }) {
  return (
    <label htmlFor={id} className="flex items-center justify-between py-3 cursor-pointer">
      <span className="text-sm text-white">{label}</span>
      <div
        id={id}
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-all duration-200 relative cursor-pointer ${checked ? 'accent-bg' : 'bg-white/15'}`}
      >
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
      </div>
    </label>
  )
}

export default function ProfilePage() {
  const { data } = useOutletContext()
  const { updateProfile } = useUserDoc()
  const { setAccent, accent } = useTheme()

  const profile = data?.profile
  const [name,      setName]     = useState(profile?.name     ?? '')
  const [weight,    setWeight]   = useState(profile?.weight   ?? 75)
  const [maxPull,   setMaxPull]  = useState(profile?.maxPullups ?? 8)
  const [maxPush,   setMaxPush]  = useState(profile?.maxPushups ?? 30)
  const [equip,     setEquip]    = useState(profile?.equip    ?? { pullupBar: true, vest: false, band: false, abWheel: false })
  const [saved,     setSaved]    = useState(false)

  const handleSave = async () => {
    await updateProfile({ name, weight: +weight, maxPullups: +maxPull, maxPushups: +maxPush, equip, theme: accent })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleEquip = (key) => setEquip((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="px-4 py-5 pb-6 flex flex-col gap-5">
      <div className="fade-up">
        <h2 className="text-xl font-black text-white">Profil</h2>
        <p className="text-xs text-white/30 mt-0.5">Paramètres du protocole</p>
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
      <div className="glass rounded-2xl p-4 flex flex-col gap-4 fade-up" style={{ animationDelay: '0.1s' }}>
        <p className="text-xs uppercase tracking-widest text-white/30 font-semibold">Métriques</p>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-white">Poids</label>
            <span className="text-sm font-bold accent-text">{weight} kg</span>
          </div>
          <input id="profile-weight" type="range" min="40" max="150" step="0.5" value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full accent-slider" style={{ accentColor: 'var(--accent)' }} />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-white">Max Tractions</label>
            <span className="text-sm font-bold accent-text">{maxPull} reps</span>
          </div>
          <input id="profile-pullups" type="range" min="1" max="40" step="1" value={maxPull}
            onChange={(e) => setMaxPull(e.target.value)}
            style={{ accentColor: 'var(--accent)', width: '100%' }} />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-white">Max Pompes</label>
            <span className="text-sm font-bold accent-text">{maxPush} reps</span>
          </div>
          <input id="profile-pushups" type="range" min="1" max="100" step="1" value={maxPush}
            onChange={(e) => setMaxPush(e.target.value)}
            style={{ accentColor: 'var(--accent)', width: '100%' }} />
        </div>
      </div>

      {/* Equipment */}
      <div className="glass rounded-2xl px-4 py-3 flex flex-col gap-0 fade-up" style={{ animationDelay: '0.15s' }}>
        <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-1">Équipement</p>
        <div className="divide-y divide-white/5">
          <Toggle id="equip-pullupBar" checked={equip.pullupBar} onChange={(v) => toggleEquip('pullupBar')} label="🔧 Barre de Traction" />
          <Toggle id="equip-vest"      checked={equip.vest}      onChange={(v) => toggleEquip('vest')}      label="🦺 Gilet Lesté" />
          <Toggle id="equip-band"      checked={equip.band}      onChange={(v) => toggleEquip('band')}      label="🟡 Élastiques" />
          <Toggle id="equip-abWheel"   checked={equip.abWheel}   onChange={(v) => toggleEquip('abWheel')}   label="⚙️ Roue Abdominale" />
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
                ring: accent === value ? `3px solid white` : 'none',
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
