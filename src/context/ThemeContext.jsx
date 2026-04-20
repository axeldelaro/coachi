import { createContext, useContext, useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [accent, setAccentState] = useState('#ff3b30')

  const applyAccent = (color) => {
    if (!color) return
    setAccentState(color)
    document.documentElement.style.setProperty('--accent', color)
  }

  const setAccent = async (color) => {
    applyAccent(color)
    const user = auth.currentUser
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), { 'profile.theme': color })
    }
  }

  return (
    <ThemeContext.Provider value={{ accent, setAccent, applyAccent }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
