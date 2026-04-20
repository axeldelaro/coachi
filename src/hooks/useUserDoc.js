import { useState, useEffect, useCallback } from 'react'
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'

const DEFAULT_DOC = {
  profile: {
    name: '',
    weight: 75,
    maxPullups: 8,
    maxPushups: 30,
    theme: '#ff3b30',
    equip: { pullupBar: true, vest: false, band: false, abWheel: false },
  },
  iaState: { cal_multiplier: 1.0, rep_multiplier: 1.0 },
  logs: { streak: 0, water: 0, lastLogDate: '', lastDebriefDate: '' },
  groceryPrefs: {},
}

export default function useUserDoc() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = auth.currentUser
    if (!user) { setLoading(false); return }

    const ref = doc(db, 'users', user.uid)
    const unsub = onSnapshot(ref, async (snap) => {
      if (!snap.exists()) {
        await setDoc(ref, DEFAULT_DOC)
        setData(DEFAULT_DOC)
      } else {
        setData(snap.data())
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const updateField = useCallback(async (field, value) => {
    const user = auth.currentUser
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid), { [field]: value })
  }, [])

  const updateProfile = useCallback((p) => updateField('profile', p), [updateField])
  const updateIaState = useCallback((s) => updateField('iaState', s), [updateField])
  const updateLogs    = useCallback((l) => updateField('logs', l), [updateField])
  const updateGroceryPrefs = useCallback((g) => updateField('groceryPrefs', g), [updateField])

  return { data, loading, updateProfile, updateIaState, updateLogs, updateGroceryPrefs }
}
