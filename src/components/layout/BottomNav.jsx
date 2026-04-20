import { NavLink } from 'react-router-dom'
import { Home, ShoppingCart, UtensilsCrossed, Dumbbell, User, MessageCircle } from 'lucide-react'

const tabs = [
  { to: '/dashboard', icon: Home,           label: 'Accueil'  },
  { to: '/grocery',   icon: ShoppingCart,   label: 'Courses'  },
  { to: '/diet',      icon: UtensilsCrossed,label: 'Diète'    },
  { to: '/workout',   icon: Dumbbell,       label: 'Séance'   },
  { to: '/coach',     icon: MessageCircle,  label: 'Coach'    },
  { to: '/profile',   icon: User,           label: 'Profil'   },
]

export default function BottomNav() {
  return (
    <nav
      className="shrink-0 glass border-t border-white/5 flex items-end justify-around px-1"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)', paddingTop: '6px' }}
    >
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl tap-scale transition-all duration-200 ${
              isActive ? 'accent-text' : 'text-white/30'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'accent-bg bg-opacity-15' : ''}`}
                style={isActive ? { backgroundColor: 'color-mix(in srgb, var(--accent) 18%, transparent)' } : {}}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className={`text-[8px] font-semibold tracking-wide uppercase ${isActive ? 'accent-text' : 'text-white/25'}`}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
