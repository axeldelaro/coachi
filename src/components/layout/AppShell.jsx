import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './Header'
import BottomNav from './BottomNav'
import useUserDoc from '../../hooks/useUserDoc'
import { useTheme } from '../../context/ThemeContext'

export default function AppShell() {
  const { data } = useUserDoc()
  const { applyAccent } = useTheme()

  useEffect(() => {
    if (data?.profile?.theme) applyAccent(data.profile.theme)
  }, [data?.profile?.theme])

  return (
    <div className="flex flex-col bg-[#050505]" style={{ height: '100dvh', overflow: 'hidden' }}>
      <Header data={data} />
      <main className="flex-1 scroll-area">
        <Outlet context={{ data }} />
      </main>
      <BottomNav />
    </div>
  )
}
