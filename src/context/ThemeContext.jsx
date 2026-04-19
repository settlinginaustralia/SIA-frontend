import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'sia.themeMode'

const ThemeContext = createContext({
  themeMode: 'dark',
  setThemeMode: () => {},
  resolvedTheme: 'dark',
})

function readStoredTheme() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {
    /* ignore */
  }
  return 'dark'
}

function resolveFromMode(mode, systemIsDark) {
  if (mode === 'light' || mode === 'dark') return mode
  return systemIsDark ? 'dark' : 'light'
}

/**
 * themeMode: 'light' | 'dark' | 'system'
 * Sets document.documentElement data-theme to resolved 'light' | 'dark'
 */
export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(() => readStoredTheme())
  const [systemIsDark, setSystemIsDark] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : true
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemIsDark(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const resolvedTheme = resolveFromMode(themeMode, systemIsDark)

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme
    document.documentElement.dataset.themeMode = themeMode
  }, [resolvedTheme, themeMode])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, themeMode)
    } catch {
      /* ignore */
    }
  }, [themeMode])

  const value = useMemo(
    () => ({ themeMode, setThemeMode, resolvedTheme }),
    [themeMode, resolvedTheme]
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
