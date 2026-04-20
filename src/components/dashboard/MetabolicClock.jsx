// Metabolic clock — SVG arc showing IF 16:8 (fast 20h→12h, feed 12h→20h)
import { useMemo } from 'react'

function polarToCart(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arc(cx, cy, r, startDeg, endDeg) {
  const s = polarToCart(cx, cy, r, startDeg)
  const e = polarToCart(cx, cy, r, endDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`
}

export default function MetabolicClock() {
  const now = new Date()
  const h = now.getHours() + now.getMinutes() / 60

  // Map 0h→0°, 24h→360°
  const toDeg = (hour) => (hour / 24) * 360

  const fastStart  = 20   // 20:00
  const fastEnd    = 12   // 12:00 next day (crossing midnight)
  const feedStart  = 12
  const feedEnd    = 20

  // Is user currently fasting?
  const isFasting = h >= fastStart || h < fastEnd

  // Current hand angle
  const handDeg = toDeg(h)

  // Fasting arc: 20h → 12h (next day) = 300° → 180° crossing 0 (360°)
  // We draw it as 300° to 540° (= 300° to 180° + 360°) large arc
  const fastStartDeg = toDeg(fastStart)  // 300
  const fastEndDeg   = toDeg(fastEnd) + 360  // 180 + 360 = 540 → but SVG normalises

  // We'll draw two arcs for fasting: 300→360 and 0→180
  const CX = 100, CY = 100, R = 75, THIN = 8

  const outerR = R + THIN / 2
  const innerR = R - THIN / 2

  const handPt = polarToCart(CX, CY, R, handDeg)
  const handOuter = polarToCart(CX, CY, outerR + 6, handDeg)
  const handInner = polarToCart(CX, CY, innerR - 6, handDeg)

  // Hour labels
  const hours = [0, 6, 12, 18]

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 200 200" className="w-52 h-52 drop-shadow-lg">
        {/* Background track */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={THIN} />

        {/* Fasting arc: 20h → 12h next day (300° → 180°, crossing midnight) */}
        {/* Segment 1: 300° → 360° */}
        <path
          d={arc(CX, CY, R, 300, 360)}
          fill="none" stroke="var(--accent)" strokeWidth={THIN} strokeLinecap="round" opacity="0.9"
        />
        {/* Segment 2: 0° → 180° */}
        <path
          d={arc(CX, CY, R, 0, 180)}
          fill="none" stroke="var(--accent)" strokeWidth={THIN} strokeLinecap="round" opacity="0.9"
        />

        {/* Feed arc: 12h → 20h (180° → 300°) */}
        <path
          d={arc(CX, CY, R, 180, 300)}
          fill="none" stroke="#30d158" strokeWidth={THIN} strokeLinecap="round" opacity="0.75"
        />

        {/* Current time needle */}
        <line
          x1={handInner.x} y1={handInner.y}
          x2={handOuter.x} y2={handOuter.y}
          stroke="white" strokeWidth="2.5" strokeLinecap="round"
        />
        <circle cx={handPt.x} cy={handPt.y} r="4" fill="white" />

        {/* Hour markers */}
        {hours.map((hr) => {
          const d = toDeg(hr)
          const outer = polarToCart(CX, CY, R + THIN + 10, d)
          const label = hr === 0 ? '0h' : `${hr}h`
          return (
            <text
              key={hr}
              x={outer.x} y={outer.y + 4}
              textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.35)" fontFamily="Inter"
            >
              {label}
            </text>
          )
        })}

        {/* Center status */}
        <text x={CX} y={CY - 8} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.5)" fontFamily="Inter" fontWeight="500">
          {isFasting ? 'JEÛNE' : 'FENÊTRE'}
        </text>
        <text x={CX} y={CY + 8} textAnchor="middle" fontSize="18" fill="white" fontFamily="Inter" fontWeight="800">
          {String(now.getHours()).padStart(2, '0')}:{String(now.getMinutes()).padStart(2, '0')}
        </text>
        <text x={CX} y={CY + 22} textAnchor="middle" fontSize="9" fill={isFasting ? 'var(--accent)' : '#30d158'} fontFamily="Inter" fontWeight="600">
          {isFasting ? 'EN COURS' : 'OUVERTE'}
        </text>
      </svg>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-white/40">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full accent-bg inline-block" />
          Jeûne 20h→12h
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#30d158' }} />
          Fenêtre 12h→20h
        </span>
      </div>
    </div>
  )
}
