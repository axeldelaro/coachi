import { Droplets } from 'lucide-react'

export default function WaterTracker({ water = 0, onToggle }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white">Hydratation</h3>
        <span className="text-xs text-white/40">{water * 500} / 3000 ml</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/8 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(water / 6) * 100}%`, background: 'var(--accent)' }}
        />
      </div>

      <div className="flex justify-between gap-2">
        {[...Array(6)].map((_, i) => {
          const filled = i < water
          return (
            <button
              key={i}
              id={`water-drop-${i}`}
              onClick={() => onToggle(filled ? i : i + 1)}
              className="flex-1 flex flex-col items-center gap-1 tap-scale"
            >
              <Droplets
                size={28}
                className="transition-all duration-200"
                style={{
                  color: filled ? 'var(--accent)' : 'rgba(255,255,255,0.12)',
                  fill:  filled ? 'color-mix(in srgb, var(--accent) 25%, transparent)' : 'transparent',
                  filter: filled ? 'drop-shadow(0 0 6px color-mix(in srgb, var(--accent) 60%, transparent))' : 'none',
                  transform: filled ? 'scale(1.05)' : 'scale(1)',
                }}
              />
              <span className="text-[8px] text-white/20 font-medium">{(i + 1) * 500}ml</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
