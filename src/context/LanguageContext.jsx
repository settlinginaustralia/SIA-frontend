import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import de from '../locales/de.json'
import en from '../locales/en.json'
import es from '../locales/es.json'
import fr from '../locales/fr.json'
import zh from '../locales/zh.json'

const STORAGE_KEY = 'sia.locale'

const CATALOG = {
  en,
  es,
  fr,
  de,
  zh,
}

const DEFAULT_LOCALE = 'en'

const SUPPORTED = [
  { id: 'en', nameKey: 'meta.languageName_en' },
  { id: 'es', nameKey: 'meta.languageName_es' },
  { id: 'fr', nameKey: 'meta.languageName_fr' },
  { id: 'de', nameKey: 'meta.languageName_de' },
  { id: 'zh', nameKey: 'meta.languageName_zh' },
]

function resolvePath(obj, path) {
  if (!obj || !path) return undefined
  return path.split('.').reduce((acc, key) => {
    if (acc == null || typeof acc !== 'object') return undefined
    return acc[key]
  }, obj)
}

function interpolate(template, vars) {
  if (!vars || typeof template !== 'string') return template
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    vars[key] != null ? String(vars[key]) : ''
  )
}

function readStoredLocale() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v && CATALOG[v]) return v
  } catch {
    /* ignore */
  }
  if (typeof navigator !== 'undefined' && navigator.language) {
    const short = navigator.language.split('-')[0].toLowerCase()
    if (CATALOG[short]) return short
  }
  return DEFAULT_LOCALE
}

const LanguageContext = createContext({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key) => key,
  supportedLocales: SUPPORTED,
})

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(() => readStoredLocale())

  const setLocale = useCallback((next) => {
    if (!next || !CATALOG[next]) return
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next === 'zh' ? 'zh-CN' : next
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale
  }, [locale])

  const t = useCallback(
    (key, vars) => {
      const table = CATALOG[locale] ?? CATALOG[DEFAULT_LOCALE]
      const raw = resolvePath(table, key)
      if (typeof raw === 'string') return interpolate(raw, vars)
      const fallback = resolvePath(CATALOG[DEFAULT_LOCALE], key)
      if (typeof fallback === 'string') return interpolate(fallback, vars)
      return key
    },
    [locale]
  )

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      supportedLocales: SUPPORTED,
    }),
    [locale, setLocale, t]
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
