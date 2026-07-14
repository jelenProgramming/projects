import { createContext, useContext, useState, useEffect, useCallback } from 'react'

/**
 * Study mode: 'calm' (stressed / cramming - condensed, minimal decoration) or
 * 'explore' (time to learn - full content + bold animation). Persisted to
 * localStorage. On first visit `chosen` is false so the app can ask the user.
 *
 * Algorithm step-animations always run; only DECORATIVE motion is gated by mode.
 */
const ModeContext = createContext({ mode: 'calm', chosen: true, setMode: () => {} })

export function ModeProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    if (typeof localStorage === 'undefined') return 'calm'
    return localStorage.getItem('algoviz-mode') || 'calm'
  })
  const [chosen, setChosen] = useState(() => {
    if (typeof localStorage === 'undefined') return true
    return localStorage.getItem('algoviz-mode') != null
  })

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.setAttribute('data-mode', mode)
  }, [mode])

  const setMode = useCallback((m) => {
    setModeState(m)
    setChosen(true)
    if (typeof localStorage !== 'undefined') localStorage.setItem('algoviz-mode', m)
  }, [])

  return (
    <ModeContext.Provider value={{ mode, chosen, setMode }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  return useContext(ModeContext)
}
