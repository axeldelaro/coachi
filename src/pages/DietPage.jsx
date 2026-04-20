import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { meals } from '../data/meals'
import { groceries, resolveIngredient } from '../data/groceries'
import { cookingMethods } from '../data/cookingMethods'
import { ChevronDown, ChevronUp, FlameKindling } from 'lucide-react'

function MealCard({ meal, profile, iaState, groceryPrefs, batchX3 }) {
  const weight = profile?.weight ?? 75
  const calMult = iaState?.cal_multiplier ?? 1.0

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
        <span className="text-xl">{meal.icon}</span>
        <div className="flex-1">
          <p className="text-[11px] text-white/30 uppercase tracking-widest">{meal.time}</p>
          <p className="text-base font-bold text-white">{meal.label}</p>
        </div>
        {batchX3 && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'color-mix(in srgb, var(--accent) 20%, transparent)', color: 'var(--accent)' }}>
            ×3J
          </span>
        )}
      </div>
      <div className="px-4 py-3 flex flex-col gap-2.5">
        {meal.ingredients.map(({ ingredientId, portionMultiplier }) => {
          const base = groceries.find((g) => g.id === ingredientId)
          if (!base) return null
          const resolved = resolveIngredient(base, groceryPrefs)
          const qty = Math.round(resolved.baseQty * (weight / 63) * calMult * portionMultiplier * (batchX3 ? 3 : 1) * 10) / 10
          return (
            <div key={ingredientId} className="flex items-center justify-between">
              <span className="text-sm text-white font-medium">{resolved.name}</span>
              <span className="text-sm text-white/50 font-semibold">{qty} {resolved.unit}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CookingGuide({ groceryPrefs }) {
  const [open, setOpen] = useState(false)

  // Find all active cooking methods in use
  const activeMethods = new Set()
  meals.forEach((meal) => {
    meal.ingredients.forEach((ing) => {
      const base = groceries.find((g) => g.id === ing.ingredientId)
      if (base) {
        const resolved = resolveIngredient(base, groceryPrefs)
        if (resolved.cookMethod) activeMethods.add(resolved.cookMethod)
      }
    })
  })

  const entries = [...activeMethods].map((m) => cookingMethods[m]).filter(Boolean)

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button
        id="cooking-guide-toggle"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 tap-scale"
      >
        <div className="flex items-center gap-2">
          <FlameKindling size={16} className="accent-text" />
          <span className="text-sm font-bold text-white">Guide de Cuisson</span>
          <span className="text-xs text-white/30">{entries.length} méthodes</span>
        </div>
        {open ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
      </button>

      {open && (
        <div className="border-t border-white/5 px-4 py-4 flex flex-col gap-5">
          {entries.map((method) => (
            <div key={method.label}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{method.icon}</span>
                <span className="text-sm font-bold text-white">{method.label}</span>
                <span className="text-xs text-white/30 ml-auto">{method.time}</span>
              </div>
              <ol className="flex flex-col gap-1.5 pl-2">
                {method.steps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-xs text-white/60 leading-relaxed">
                    <span className="accent-text font-bold shrink-0 mt-0.5">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              {method.tip && (
                <p className="mt-2 text-xs text-white/30 italic pl-2">💡 {method.tip}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DietPage() {
  const { data } = useOutletContext()
  const [batchX3, setBatch] = useState(false)

  if (!data) return null
  const { profile, iaState, groceryPrefs } = data

  return (
    <div className="px-4 py-5 pb-28 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between fade-up">
        <div>
          <h2 className="text-xl font-black text-white">Diète & Cuisson</h2>
          <p className="text-xs text-white/30 mt-0.5">4 repas · fenêtre 12h–20h</p>
        </div>
        <button
          id="batch-toggle"
          onClick={() => setBatch(!batchX3)}
          className={`px-3 py-2 rounded-xl text-xs font-bold tap-scale transition-all ${
            batchX3 ? 'text-white' : 'bg-white/5 text-white/40'
          }`}
          style={batchX3 ? { background: 'var(--accent)' } : {}}
        >
          Batch 3J
        </button>
      </div>

      {/* Meal cards */}
      {meals.map((meal, i) => (
        <div key={meal.id} className="fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
          <MealCard
            meal={meal}
            profile={profile}
            iaState={iaState}
            groceryPrefs={groceryPrefs}
            batchX3={batchX3}
          />
        </div>
      ))}

      {/* Cooking guide */}
      <div className="fade-up" style={{ animationDelay: '0.2s' }}>
        <CookingGuide groceryPrefs={groceryPrefs} />
      </div>
    </div>
  )
}
