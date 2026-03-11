"use client"

import { ChevronDown } from "lucide-react"

import { useLanguage } from "@/lib/i18n-context"

export function ToolsDropdown() {
  const { t } = useLanguage()
  return (
    <button className="px-4 py-2 text-white hover:text-zinc-300 transition-colors flex items-center gap-2">
      {t("common.tools")}
      <ChevronDown className="w-4 h-4" />
    </button>
  )
}
