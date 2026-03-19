"use client"

import { createContext, useContext, useState } from "react"
import { TRANSLATIONS } from "./trans"

type LanguageCode = keyof typeof TRANSLATIONS

interface LanguageContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: keyof typeof TRANSLATIONS.en, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>("en")

  const t = (key: keyof typeof TRANSLATIONS.en, vars?: Record<string, string | number>): string => {
    const base = TRANSLATIONS[language][key as keyof (typeof TRANSLATIONS)[LanguageCode]] || TRANSLATIONS.en[key]
    if (!vars) return base
    return Object.keys(vars).reduce((s, varName) => s.replace(new RegExp(`{${varName}}`, "g"), String(vars[varName])), base)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
