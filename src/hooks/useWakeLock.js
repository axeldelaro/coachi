import { useEffect, useRef } from 'react'

export default function useWakeLock(active) {
  const lockRef = useRef(null)

  useEffect(() => {
    if (!active) {
      lockRef.current?.release()
      lockRef.current = null
      return
    }
    if (!('wakeLock' in navigator)) return
    navigator.wakeLock.request('screen').then((lock) => {
      lockRef.current = lock
    }).catch(() => {})

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && active) {
        navigator.wakeLock.request('screen').then((lock) => {
          lockRef.current = lock
        }).catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      lockRef.current?.release()
      lockRef.current = null
    }
  }, [active])
}
