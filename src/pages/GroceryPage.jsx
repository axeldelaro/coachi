import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import MacroAccordion from '../components/grocery/MacroAccordion'
import { X, Check, ChevronDown, ChevronUp, RefreshCw, Sparkles } from 'lucide-react'
import { calcQty, groceries, resolveIngredient } from '../data/groceries'
import { generateRecipes } from '../data/coachResponses'

// ─── Recipe card ──────────────────────────────────────────────────────────────
function RecipeCard({ recipe }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3.5 tap-scale text-left"
      >
        <span className="text-2xl shrink-0">{recipe.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{recipe.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-white/30">{recipe.prepTime}</span>
            <span className="text-[10px] text-white/20">·</span>
            <span className="text-[10px] text-white/30">{recipe.difficulty}</span>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-white/40 shrink-0" /> : <ChevronDown size={16} className="text-white/40 shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-white/5 px-4 pb-4 pt-3 flex flex-col gap-4">
          {/* Macros */}
          <div className="px-3 py-2 rounded-xl bg-white/5">
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-1">Macros estimés</p>
            <p className="text-xs text-white/70">{recipe.macros}</p>
          </div>

          {/* Ingredients */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-2">Ingrédients</p>
            <ul className="flex flex-col gap-1">
              {recipe.ingredients?.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                  <span className="accent-text mt-0.5 shrink-0">•</span>
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-2">Préparation</p>
            <ol className="flex flex-col gap-2">
              {recipe.steps?.map((step, i) => (
                <li key={i} className="flex gap-2 text-xs text-white/70 leading-relaxed">
                  <span className="accent-text font-bold shrink-0 mt-0.5">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Typing dots loader ────────────────────────────────────────────────────────
function DotsLoader() {
  return (
    <div className="flex items-center justify-center gap-2 py-10">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-white/30"
          style={{ animation: `recipeDot 1.2s ${i * 0.2}s infinite ease-in-out` }}
        />
      ))}
      <style>{`
        @keyframes recipeDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// ─── Recipes section ───────────────────────────────────────────────────────────
function RecipesSection({ groceryPrefs }) {
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [recipes, setRecipes] = useState([])
  const [error, setError]     = useState(null)
  const hasRecipes            = recipes.length > 0

  const fetchRecipes = async () => {
    setLoading(true)
    setError(null)
    const activeIngredients = groceries.map(item => resolveIngredient(item, groceryPrefs))
    const result = await generateRecipes(activeIngredients)
    if (result.length === 0) {
      setError("Impossible de générer les recettes. Vérifie ta connexion et réessaie.")
    }
    setRecipes(result)
    setLoading(false)
  }

  const handleToggle = () => {
    if (!open && !hasRecipes && !loading) {
      setOpen(true)
      fetchRecipes()
    } else {
      setOpen(!open)
    }
  }

  const handleRefresh = (e) => {
    e.stopPropagation()
    fetchRecipes()
  }

  return (
    <div className="glass rounded-2xl overflow-hidden fade-up">
      {/* Header */}
      <button
        id="recipes-toggle"
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-4 py-3.5 tap-scale"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'color-mix(in srgb, var(--accent) 20%, transparent)' }}
          >
            <Sparkles size={14} className="accent-text" />
          </div>
          <span className="text-sm font-bold text-white">Recettes IA</span>
          <span className="text-xs text-white/30">selon tes courses</span>
        </div>
        <div className="flex items-center gap-2">
          {hasRecipes && !loading && (
            <button
              id="recipes-refresh"
              onClick={handleRefresh}
              className="p-1.5 rounded-lg bg-white/5 tap-scale"
              title="Regénérer"
            >
              <RefreshCw size={13} className="text-white/40" />
            </button>
          )}
          {open ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
        </div>
      </button>

      {/* Content */}
      {open && (
        <div className="border-t border-white/5 px-4 py-4">
          {loading ? (
            <div>
              <p className="text-center text-xs text-white/30 mb-2">Le chef IA prépare tes recettes…</p>
              <DotsLoader />
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <p className="text-xs text-white/40 mb-3">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white tap-scale"
                style={{ background: 'var(--accent)' }}
              >
                Réessayer
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recipes.map((recipe, i) => (
                <RecipeCard key={`${recipe.name}-${i}`} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function GroceryPage() {
  const { data, updateGroceryPrefs } = useOutletContext()
  const [subModal, setSubModal]   = useState(null)
  const [strikethrough, setStrike] = useState(new Set())

  if (!data) return null

  const { profile, iaState, groceryPrefs } = data
  const weight  = profile?.weight ?? 75
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
    <div className="px-4 py-5 pb-28 flex flex-col gap-4">
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

      {/* AI Recipes section */}
      <RecipesSection groceryPrefs={groceryPrefs} />

      {/* Substitute bottom sheet */}
      {subModal && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        >
          <div className="glass rounded-t-3xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">Remplacer</p>
                <p className="text-base font-bold text-white">{subModal.name}</p>
              </div>
              <button
                id="close-sub-modal"
                onClick={() => setSubModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center tap-scale"
              >
                <X size={16} className="text-white/60" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <button
                id="sub-original"
                onClick={() => clearSub(subModal.id)}
                className="flex items-center gap-3 p-3.5 rounded-xl tap-scale transition-all"
                style={
                  !groceryPrefs?.[subModal.id]
                    ? { background: 'color-mix(in srgb, var(--accent) 18%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)' }
                    : { background: 'rgba(255,255,255,0.05)' }
                }
              >
                <p className="flex-1 text-sm font-semibold text-white text-left">
                  {subModal.name} <span className="text-white/40">(original)</span>
                </p>
                {!groceryPrefs?.[subModal.id] && <Check size={16} className="accent-text shrink-0" />}
              </button>

              {subModal.substitutes.map((sub) => {
                const active = groceryPrefs?.[subModal.id] === sub.id
                const qty    = calcQty(sub.baseQty, weight, calMult)
                return (
                  <button
                    key={sub.id}
                    id={`sub-opt-${sub.id}`}
                    onClick={() => confirmSub(subModal, sub.id)}
                    className="flex items-center gap-3 p-3.5 rounded-xl tap-scale"
                    style={
                      active
                        ? { background: 'color-mix(in srgb, var(--accent) 18%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)' }
                        : { background: 'rgba(255,255,255,0.05)' }
                    }
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
