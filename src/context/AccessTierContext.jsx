import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

/** 'free' | 'premium' — wire to your auth / subscription API later */
const STORAGE_KEY = 'sia.accessTier'

const AccessTierContext = createContext({
  tier: 'free',
  setTier: () => {},
})

function readTier() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'premium' || v === 'free') return v
  } catch {
    /* ignore */
  }
  return 'premium'
}

/**
 * Dev: switch tier in the console, then reload:
 *   localStorage.setItem('sia.accessTier', 'premium')
 *   localStorage.setItem('sia.accessTier', 'free')
 */
export function AccessTierProvider({ children }) {
  const [tier, setTierState] = useState(readTier)

  const setTier = useCallback((next) => {
    if (next !== 'free' && next !== 'premium') return
    setTierState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(() => ({ tier, setTier }), [tier, setTier])

  return (
    <AccessTierContext.Provider value={value}>
      {children}
    </AccessTierContext.Provider>
  )
}

export function useAccessTier() {
  return useContext(AccessTierContext)
}
