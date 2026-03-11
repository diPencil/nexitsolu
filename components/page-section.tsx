"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n-context"
import { ReactNode } from "react"

interface PageSectionProps {
    title?: string
    children: ReactNode
    columns?: 1 | 2 | 3 | 4
    className?: string
    reverse?: boolean
}

export function PageSection({ title, children, columns = 1, className = "", reverse = false }: PageSectionProps) {
    const { lang } = useLanguage()

    return (
        <section className={`py-16 md:py-24 px-6 ${className}`}>
            <div className="max-w-7xl mx-auto">
                {title && (
                    <motion.h2
                        initial={{ opacity: 0, x: lang === "ar" ? 20 : -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-4xl font-medium mb-12 text-white"
                    >
                        {title}
                    </motion.h2>
                )}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className={`grid gap-12 ${columns === 4 ? "md:grid-cols-2 lg:grid-cols-4" :
                            columns === 3 ? "md:grid-cols-2 lg:grid-cols-3" :
                                columns === 2 ? "lg:grid-cols-2" : "grid-cols-1"
                        } ${reverse ? "rtl:flex-row-reverse" : ""}`}
                >
                    {children}
                </motion.div>
            </div>
        </section>
    )
}
