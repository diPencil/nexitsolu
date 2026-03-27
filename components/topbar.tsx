"use client"

import Link from "next/link"
import { Mail, Phone, Circle } from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { usePathname } from "next/navigation"

export function Topbar() {
    const { t } = useLanguage()
    const pathname = usePathname()

    if (pathname?.startsWith('/admin')) return null

    return (
        <div className="w-full bg-zinc-950 border-b border-zinc-900 py-2 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-[11px] font-medium text-zinc-500 uppercase tracking-widest">
                <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500 animate-pulse" />
                        <span>{t("topbar.status")}</span>
                    </div>
                </div>

                <div className="flex items-center justify-center w-full md:w-auto gap-4 md:gap-6">
                    <a href={`mailto:${t("topbar.email")}`} className="flex items-center gap-1.5 md:gap-2 hover:text-white transition-colors">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span dir="ltr" className="[unicode-bidi:isolate] normal-case">
                            {t("topbar.email")}
                        </span>
                    </a>
                    <a
                        href={`tel:${String(t("topbar.phone")).replace(/\s/g, "")}`}
                        className="flex items-center gap-1.5 md:gap-2 hover:text-white transition-colors"
                    >
                        <Phone className="h-3 w-3 shrink-0" />
                        <span dir="ltr" className="[unicode-bidi:isolate]">
                            {t("topbar.phone")}
                        </span>
                    </a>
                </div>
            </div>
        </div>
    )
}
