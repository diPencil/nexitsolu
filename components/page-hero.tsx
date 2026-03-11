"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n-context"

interface PageHeroProps {
    title: string
    subtitle: string
}

export function PageHero({ title, subtitle }: PageHeroProps) {
    const { lang } = useLanguage()

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-20">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-3xl md:text-4xl lg:text-5xl font-medium mb-8 leading-tight text-white"
                >
                    {title}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
                >
                    {subtitle}
                </motion.p>
            </div>
        </section>
    )
}
