"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import en from "../locales/en.json"
import ar from "../locales/ar.json"

type Language = "en" | "ar"
type Translations = typeof en

interface LanguageContextProps {
    lang: Language
    setLang: (lang: Language) => void
    t: (key: string, variables?: Record<string, any>) => any
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined)

const dictionaries = { en, ar }

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLangState] = useState<Language>("en")

    useEffect(() => {
        const savedLang = localStorage.getItem("nexit-lang") as Language
        if (savedLang && (savedLang === "en" || savedLang === "ar")) {
            setLangState(savedLang)
        } else if (typeof window !== "undefined") {
            const browserLang = navigator.language.split("-")[0]
            if (browserLang === "ar") setLangState("ar")
        }
    }, [])

    const setLang = (newLang: Language) => {
        setLangState(newLang)
        localStorage.setItem("nexit-lang", newLang)
        document.documentElement.lang = newLang
        document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr"
    }

    useEffect(() => {
        document.documentElement.lang = lang
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    }, [lang])

    const t = (path: string, variables?: Record<string, any>) => {
        let value = path.split(".").reduce((obj: any, key) => obj?.[key], dictionaries[lang]) || path
        if (typeof value === "string" && variables) {
            Object.entries(variables).forEach(([key, val]) => {
                value = value.split(`{{${key}}}`).join(String(val))
            })
        }
        return value
    }

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => {
    const context = useContext(LanguageContext)
    if (!context) throw new Error("useLanguage must be used within a LanguageProvider")
    return context
}
