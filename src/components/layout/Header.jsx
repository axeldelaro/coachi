import { Flame } from 'lucide-react'

export default function Header({ data }) {
  const name = data?.profile?.name || 'Athlète'
  const streak = data?.logs?.streak ?? 0

  return (
    <header className="flex items-center justify-between px-5 py-3 glass border-b border-white/5 shrink-0">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium">Mon</p>
        <h1 className="text-[17px] font-bold tracking-tight leading-tight text-white">Coach Interactif</h1>
      </div>

      <div className="flex items-center gap-2">
        {streak > 0 && (
          <div className="flex items-center gap-1 bg-white/5 rounded-full px-3 py-1.5">
            <Flame size={13} className="accent-text" />
            <span className="text-xs font-bold text-white">{streak}</span>
          </div>
        )}
        <div className="w-8 h-8 rounded-full accent-bg flex items-center justify-center text-sm font-bold text-white select-none">
          {name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}
