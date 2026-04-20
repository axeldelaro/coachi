import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import useAuth from './hooks/useAuth'
import AppShell from './components/layout/AppShell'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import GroceryPage from './pages/GroceryPage'
import DietPage from './pages/DietPage'
import WorkoutPage from './pages/WorkoutPage'
import ProfilePage from './pages/ProfilePage'
import CoachPage from './pages/CoachPage'

function AuthGuard({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#050505]">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white animate-spin" />
        <p className="text-white/30 text-sm tracking-widest uppercase">Chargement</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<AuthGuard><AppShell /></AuthGuard>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="grocery"   element={<GroceryPage />} />
            <Route path="diet"      element={<DietPage />} />
            <Route path="workout"   element={<WorkoutPage />} />
            <Route path="coach"     element={<CoachPage />} />
            <Route path="profile"   element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ThemeProvider>
    </HashRouter>
  )
}
