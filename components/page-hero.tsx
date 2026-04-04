"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n-context"

interface PageHeroProps {
    title: string
    subtitle: string
    badge?: string
    cta?: { label: string; href: string }
}

export function PageHero({ title, subtitle, badge, cta }: PageHeroProps) {
    const { lang } = useLanguage()

    return (
        <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 px-6 overflow-hidden bg-bg-primary">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-page h-full -z-10 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/3 rounded-full blur-[140px]" />
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                {badge && (
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[11px] font-black uppercase tracking-widest mb-8"
                    >
                        {badge}
                    </motion.span>
                )}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-text-primary tracking-tight"
                >
                    {title}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10"
                >
                    {subtitle}
                </motion.p>
                {cta && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <a
                            href={cta.href}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-accent/20"
                        >
                            {cta.label}
                        </a>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
