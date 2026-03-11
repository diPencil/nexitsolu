"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion, AnimatePresence } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useState } from "react"

import { CASE_STUDIES_DATA } from "./case-studies-data"

export default function CaseStudies() {
    const { lang, t } = useLanguage()
    const isAr = lang === "ar"

    const categories = [
        { id: "ALL", en: "ALL", ar: "الكل" },
        { id: "Hospitality", en: "Hospitality", ar: "الضيافة" },
        { id: "Construction", en: "Construction", ar: "المقاولات" },
        { id: "Travel", en: "Travel", ar: "السياحة" },
        { id: "Technology", en: "Technology", ar: "التكنولوجيا" },
        { id: "Logistics", en: "Logistics", ar: "اللوجستيات" },
        { id: "Retail", en: "Retail", ar: "التجزئة" }
    ]
    const [activeCategory, setActiveCategory] = useState("ALL")

    const allProjects = Object.values(CASE_STUDIES_DATA)

    const filteredProjects = activeCategory === "ALL" ? allProjects : allProjects.filter(p => p.cat.toUpperCase() === activeCategory.toUpperCase())

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen">
            <PageHero
                title={t("resources_pages.case_studies.hero_title")}
                subtitle={t("resources_pages.case_studies.hero_subtitle")}
            />

            <PageSection>
                {/* Filter Bar */}
                <div className="max-w-7xl mx-auto px-6 mb-16 flex justify-center">
                    <div className="flex bg-[#0A0A0A] border border-white/10 rounded-full p-2 overflow-x-auto hide-scrollbar max-w-full shadow-2xl">
                        {categories.map((cat, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-6 py-3 md:py-4 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase whitespace-nowrap transition-all duration-300 ${activeCategory === cat.id ? 'bg-[#0066FF] text-white shadow-[0_0_20px_rgba(0,102,255,0.4)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                            >
                                {isAr ? cat.ar : cat.en}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <Link key={project.id} href={`/resources/case-studies/${project.slug}`}>
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="group relative cursor-pointer"
                                >
                                    <div className="relative aspect-video rounded-3xl md:rounded-4xl overflow-hidden border border-white/10 mb-6 bg-[#080808] shadow-2xl group/card">
                                        <Image
                                            src={project.logo}
                                            alt={lang === "ar" ? project.title_ar : project.title_en}
                                            fill
                                            className="object-cover opacity-50 grayscale group-hover/card:grayscale-0 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-700"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                                        <div className={`absolute top-4 md:top-6 ${lang === "ar" ? "right-4 md:right-6" : "left-4 md:left-6"}`}>
                                            <span className="px-3 md:px-4 py-1.5 md:py-2 bg-[#0066FF] shadow-[0_0_20px_rgba(0,102,255,0.4)] rounded-full text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest">
                                                {lang === "ar" ? (categories.find(c => c.id === project.cat)?.ar || project.cat) : project.cat}
                                            </span>
                                        </div>
                                        <div className={`absolute top-4 md:top-6 ${lang === "ar" ? "left-4 md:left-6" : "right-4 md:right-6"} opacity-0 group-hover/card:opacity-100 transition-opacity duration-500`}>
                                            <div className="p-3 md:p-4 rounded-full bg-white text-black hover:scale-110 active:scale-95 transition-transform shadow-xl">
                                                <ArrowUpRight className={`w-4 h-4 md:w-5 md:h-5 ${lang === "ar" ? "-scale-x-100" : ""}`} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-start gap-4 px-2 md:px-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-2xl md:text-3xl font-black text-white mb-2 group-hover:text-[#0066FF] transition-colors truncate">
                                                {project.partner}
                                            </h3>
                                            <p className="text-zinc-400 text-sm md:text-base leading-relaxed line-clamp-2 font-medium">
                                                <span className="text-[#0066FF] font-bold mr-1 rtl:ml-1">
                                                    {lang === "ar" ? "دراسة حالة:" : "Case Study:"}
                                                </span>
                                                {lang === "ar" ? project.title_ar : project.title_en}
                                            </p>
                                        </div>
                                        <div className="hidden sm:flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl p-4 shrink-0 min-w-[100px] group-hover:bg-[#0066FF]/20 group-hover:border-[#0066FF]/50 transition-colors">
                                            <span className="text-[#0066FF] text-xl font-bold mb-1">{project.results.split(' ')[0]}</span>
                                            <span className="text-zinc-500 text-[10px] font-medium uppercase tracking-widest text-center">{project.results.split(' ').slice(1).join(' ')}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </PageSection>

            {/* View All CTA */}
            <section className="py-24 md:py-32 bg-linear-to-b from-transparent to-[#0066FF]/5 text-center border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#0066FF]/10 rounded-full blur-[100px] pointer-events-none" />
                <Link href="/services/managed-it">
                    <button className="relative z-10 px-8 py-5 md:px-12 md:py-6 rounded-full border border-[#0066FF]/50 bg-[#0066FF]/10 text-white font-bold hover:bg-[#0066FF] hover:text-white hover:scale-105 hover:shadow-[0_0_40px_rgba(0,102,255,0.4)] transition-all duration-500 uppercase tracking-widest text-xs md:text-sm">
                        {lang === "ar" ? "استكشف خدمات الإدارة التقنية الشاملة" : "Explore Full Managed IT Solutions"}
                    </button>
                </Link>
            </section>

            <NexBotAI />
        </main>
    )
}
