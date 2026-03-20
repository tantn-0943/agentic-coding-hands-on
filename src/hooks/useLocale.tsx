'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from '@/types/locale'
import type { LocaleCode } from '@/types/locale'

interface LocaleContextValue {
  locale: LocaleCode
  setLocale: (code: LocaleCode) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function readLocaleCookie(): LocaleCode {
  if (typeof document === 'undefined') return DEFAULT_LOCALE
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE_NAME}=([^;]*)`))
  const value = match?.[1]
  if (value === 'vi' || value === 'en') return value
  return DEFAULT_LOCALE
}

function writeLocaleCookie(code: LocaleCode) {
  document.cookie = `${LOCALE_COOKIE_NAME}=${code}; Path=/; SameSite=Lax; Max-Age=31536000`
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(readLocaleCookie)

  const setLocale = useCallback((code: LocaleCode) => {
    setLocaleState(code)
    writeLocaleCookie(code)
  }, [])

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider')
  return ctx
}
