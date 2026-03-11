"use client"

import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useLanguage } from "@/lib/i18n-context"

interface NavDropdownProps {
    title: string
    items: { label: string; href: string }[]
}

export function NavDropdown({ title, items }: NavDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { lang } = useLanguage()

    return (
        <div
            className="relative group"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className="px-4 py-2 text-white hover:text-zinc-300 transition-colors flex items-center gap-1.5 text-sm font-medium whitespace-nowrap">
                {title}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`absolute top-full pt-4 ${lang === "ar" ? "right-0" : "left-0"}`}
                    >
                        <div className="bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden min-w-[200px] flex flex-col p-2">
                            {items.map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.href}
                                    className="px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-all whitespace-nowrap"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
