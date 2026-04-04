"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n-context"
import { ReactNode } from "react"

interface PageSectionProps {
    title?: string
    subtitle?: string
    children: ReactNode
    columns?: 1 | 2 | 3 | 4
    className?: string
    id?: string
    reverse?: boolean
    centered?: boolean
}

export function PageSection({ title, subtitle, children, columns = 1, className = "", id, reverse = false, centered = false }: PageSectionProps) {
    const { lang } = useLanguage()

    return (
        <section id={id} className={`py-16 md:py-24 px-6 bg-bg-primary ${className}`}>
            <div className="max-w-page mx-auto">
                {(title || subtitle) && (
                    <div className={`mb-12 md:mb-16 ${centered ? 'text-center' : ''}`}>
                        {title && (
                            <motion.h2
                                initial={{ opacity: 0, x: lang === "ar" ? 20 : -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight"
                            >
                                {title}
                            </motion.h2>
                        )}
                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="mt-4 text-text-secondary text-base md:text-lg max-w-2xl leading-relaxed"
                            >
                                {subtitle}
                            </motion.p>
                        )}
                        {title && (
                            <div className={`mt-6 w-12 h-1 bg-accent rounded-full ${centered ? 'mx-auto' : ''}`} />
                        )}
                    </div>
                )}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className={`grid gap-8 md:gap-10 ${columns === 4 ? "md:grid-cols-2 lg:grid-cols-4" :
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
