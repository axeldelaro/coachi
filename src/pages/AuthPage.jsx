import { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { Eye, EyeOff, Zap } from 'lucide-react'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      const msgs = {
        'auth/user-not-found':      'Aucun compte trouvé.',
        'auth/wrong-password':      'Mot de passe incorrect.',
        'auth/email-already-in-use':'Email déjà utilisé.',
        'auth/weak-password':       'Mot de passe trop faible (6 caractères min).',
        'auth/invalid-email':       'Email invalide.',
        'auth/invalid-credential':  'Identifiants incorrects.',
      }
      setError(msgs[err.code] || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-center px-6 bg-[#050505]"
      style={{ height: '100dvh' }}
    >
      {/* Logo */}
      <div className="mb-10 flex flex-col items-center gap-3 fade-up">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--accent), #7c1010)' }}
        >
          <Zap size={28} className="text-white" fill="white" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black tracking-tight text-white">Protocol Écorché</h1>
          <p className="text-xs text-white/30 mt-0.5 tracking-widest uppercase">Discipline. Résultats.</p>
        </div>
      </div>

      {/* Card */}
      <div className="glass rounded-2xl p-6 w-full max-w-sm fade-up" style={{ animationDelay: '0.1s' }}>
        {/* Tabs */}
        <div className="flex bg-white/5 rounded-xl p-1 mb-6">
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === m ? 'accent-bg text-white' : 'text-white/40'
              }`}
            >
              {m === 'login' ? 'Connexion' : 'Créer un compte'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-dark"
          />

          <div className="relative">
            <input
              id="auth-password"
              type={showPw ? 'text' : 'password'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-dark pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30"
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-center py-2 px-3 rounded-lg bg-red-500/10 text-red-400">{error}</p>
          )}

          <button
            id="auth-submit"
            type="submit"
            disabled={loading}
            className="btn-primary mt-1 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              mode === 'login' ? 'Se connecter' : "S'inscrire"
            )}
          </button>
        </form>
      </div>

      <p className="mt-6 text-[10px] text-white/15 text-center tracking-wider uppercase fade-up" style={{ animationDelay: '0.2s' }}>
        Zéro compromis. Protocole strict.
      </p>
    </div>
  )
}
