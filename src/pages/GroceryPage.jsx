import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import useUserDoc from '../hooks/useUserDoc'
import MacroAccordion from '../components/grocery/MacroAccordion'
import { X, Check } from 'lucide-react'
import { calcQty } from '../data/groceries'

export default function GroceryPage() {
  const { data } = useOutletContext()
  const { updateGroceryPrefs } = useUserDoc()
  const [subModal, setSubModal]   = useState(null) // item being substituted
  const [strikethrough, setStrike] = useState(new Set())

  if (!data) return null

  const { profile, iaState, groceryPrefs } = data
  const weight = profile?.weight ?? 75
  const calMult = iaState?.cal_multiplier ?? 1.0

  const handleSubstitute = (item) => setSubModal(item)

  const confirmSub = async (item, subId) => {
    const next = { ...(groceryPrefs ?? {}), [item.id]: subId }
    await updateGroceryPrefs(next)
    setSubModal(null)
  }

  const clearSub = async (itemId) => {
    const next = { ...(groceryPrefs ?? {}) }
    delete next[itemId]
    await updateGroceryPrefs(next)
    setSubModal(null)
  }

  const handleStrike = (id) => {
    setStrike((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="px-4 py-5 pb-6 flex flex-col gap-4">
      <div className="fade-up">
        <h2 className="text-xl font-black text-white">Liste de Courses</h2>
        <p className="text-xs text-white/30 mt-0.5">
          7 jours · {weight} kg · IA ×{calMult.toFixed(2)}
        </p>
      </div>

      <MacroAccordion
        weight={weight}
        calMultiplier={calMult}
        groceryPrefs={groceryPrefs}
        onSubstitute={handleSubstitute}
        strikethrough={strikethrough}
        onStrike={handleStrike}
      />

      {/* Substitute bottom sheet */}
      {subModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="glass rounded-t-3xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">Remplacer</p>
                <p className="text-base font-bold text-white">{subModal.name}</p>
              </div>
              <button id="close-sub-modal" onClick={() => setSubModal(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center tap-scale">
                <X size={16} className="text-white/60" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {/* Original option */}
              <button
                id="sub-original"
                onClick={() => clearSub(subModal.id)}
                className={`flex items-center gap-3 p-3.5 rounded-xl tap-scale transition-all ${
                  !groceryPrefs?.[subModal.id] ? 'accent-bg bg-opacity-20' : 'bg-white/5'
                }`}
                style={!groceryPrefs?.[subModal.id] ? { background: 'color-mix(in srgb, var(--accent) 18%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)' } : {}}
              >
                <p className="flex-1 text-sm font-semibold text-white text-left">{subModal.name} <span className="text-white/40">(original)</span></p>
                {!groceryPrefs?.[subModal.id] && <Check size={16} className="accent-text shrink-0" />}
              </button>

              {subModal.substitutes.map((sub) => {
                const active = groceryPrefs?.[subModal.id] === sub.id
                const qty = calcQty(sub.baseQty, weight, calMult)
                return (
                  <button
                    key={sub.id}
                    id={`sub-opt-${sub.id}`}
                    onClick={() => confirmSub(subModal, sub.id)}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 tap-scale"
                    style={active ? { background: 'color-mix(in srgb, var(--accent) 18%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)' } : {}}
                  >
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-white">{sub.name}</p>
                      <p className="text-xs text-white/40">{qty} {sub.unit} / semaine</p>
                    </div>
                    {active && <Check size={16} className="accent-text shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
