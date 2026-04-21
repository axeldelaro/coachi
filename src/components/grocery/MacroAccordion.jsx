import { useState } from 'react'
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { groceries, MACRO_ORDER, calcQty, resolveIngredient } from '../../data/groceries'

const MACRO_COLORS = {
  'Protéines': '#ff3b30',
  'Glucides':  '#ff9f0a',
  'Légumes':   '#30d158',
  'Lipides':   '#0a84ff',
}

export default function MacroAccordion({ weight, calMultiplier, groceryPrefs, onSubstitute, strikethrough, onStrike }) {
  const [open, setOpen] = useState(new Set())

  const toggle = (macro) => {
    setOpen((prev) => {
      const next = new Set(prev)
      next.has(macro) ? next.delete(macro) : next.add(macro)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {MACRO_ORDER.map((macro) => {
        const items = groceries.filter((g) => g.macro === macro)
        const isOpen = open.has(macro)
        const color = MACRO_COLORS[macro] || 'var(--accent)'

        return (
          <div key={macro} className="glass rounded-2xl overflow-hidden">
            {/* Header */}
            <button
              id={`macro-${macro}`}
              onClick={() => toggle(macro)}
              className="w-full flex items-center justify-between px-4 py-3.5 tap-scale"
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span className="text-sm font-bold text-white">{macro}</span>
                <span className="text-xs text-white/30">{items.length} aliments</span>
              </div>
              {isOpen ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
            </button>

            {/* Items */}
            {isOpen && (
              <div className="border-t border-white/5">
                {items.map((item, idx) => {
                  const resolved = resolveIngredient(item, groceryPrefs)
                  const qty = calcQty(resolved.baseQty, weight, calMultiplier)
                  const isSubstituted = groceryPrefs?.[item.id] !== undefined
                  const isStruck = strikethrough?.has(item.id)

                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 px-4 py-3 tap-scale ${idx < items.length - 1 ? 'border-b border-white/5' : ''}`}
                    >
                      {/* Strike checkbox */}
                      <button
                        id={`strike-${item.id}`}
                        onClick={() => onStrike(item.id)}
                        className="w-5 h-5 rounded-md border border-white/20 flex items-center justify-center shrink-0 tap-scale"
                        style={isStruck ? { background: color, borderColor: color } : {}}
                      >
                        {isStruck && <span className="text-white text-[10px] font-bold">✓</span>}
                      </button>

                      {/* Name & qty */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold text-white truncate ${isStruck ? 'line-through opacity-40' : ''}`}>
                          {resolved.name}
                          {isSubstituted && <span className="ml-1 text-[10px] text-white/30">(sub)</span>}
                        </p>
                        <p className="text-xs text-white/40 mt-0.5">{qty} {resolved.unit} / semaine</p>
                      </div>

                      {/* Substitute button */}
                      {item.substitutes.length > 0 && (
                        <button
                          id={`sub-${item.id}`}
                          onClick={() => onSubstitute(item)}
                          className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 tap-scale"
                        >
                          <RefreshCw size={12} className="text-white/50" />
                          <span className="text-[10px] text-white/50 font-medium">Remplacer</span>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
