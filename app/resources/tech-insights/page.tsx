"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion, AnimatePresence } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ARTICLES_CONTENT } from "./articles-data"

export default function TechInsights() {
    const { lang, t } = useLanguage()

    const categories = [
        { id: "ALL", label: lang === "ar" ? "الكل" : "ALL" },
        { id: "Security", label: lang === "ar" ? "الأمن السيبراني" : "Security" },
        { id: "AI", label: lang === "ar" ? "الذكاء الاصطناعي" : "AI" },
        { id: "Cloud", label: lang === "ar" ? "الخدمات السحابية" : "Cloud" },
        { id: "Infrastructure", label: lang === "ar" ? "البنية التحتية" : "Infrastructure" },
    ]
    const [activeCategory, setActiveCategory] = useState("ALL")

    const articles = Object.values(ARTICLES_CONTENT).map(art => ({
        id: art.id,
        slug: art.slug,
        title: lang === "ar" ? art.title_ar : art.title_en,
        cat: art.cat,
        date: art.date,
        image: art.image
    }))

    const filteredArticles = activeCategory === "ALL" ? articles : articles.filter(a => a.cat === activeCategory)

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen">
            <PageHero
                title={t("resources_pages.tech_insights.hero_title")}
                subtitle={t("resources_pages.tech_insights.hero_subtitle")}
            />

            {/* Categories */}
            <section className="py-12 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 mb-0 flex justify-center">
                    <div className="flex bg-[#0A0A0A] border border-white/10 rounded-full p-2 overflow-x-auto max-w-full shadow-2xl">
                        {categories.map((cat, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-6 py-3 md:py-4 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase whitespace-nowrap transition-all duration-300 ${activeCategory === cat.id ? 'bg-[#0066FF] text-white shadow-[0_0_20px_rgba(0,102,255,0.4)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <PageSection>
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                    <AnimatePresence mode="popLayout">
                        {filteredArticles.map((article, i) => (
                            <motion.div
                                layout
                                key={article.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group"
                            >
                                <Link
                                    href={`/resources/tech-insights/${article.slug}`}
                                    className="flex flex-col h-full items-start rounded-4xl bg-[#080808] border border-white/5 hover:bg-[#111] hover:border-[#0066FF]/50 transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-[#0066FF]/10 active:scale-[0.98] relative z-10 cursor-pointer"
                                >
                                    <div className="w-full aspect-video md:aspect-4/3 relative overflow-hidden shrink-0">
                                        <Image
                                            src={article.image}
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-[#080808] to-transparent opacity-80" />
                                        <div className="absolute top-6 left-6 md:right-6 md:left-auto">
                                            <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-black text-white uppercase tracking-widest group-hover:bg-[#0066FF] transition-colors">{article.cat}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-6 md:p-10 w-full relative flex flex-col">
                                        <span className="absolute top-0 right-0 w-32 h-32 bg-[#0066FF]/5 rounded-full blur-2xl group-hover:bg-[#0066FF]/20 transition-colors pointer-events-none" />
                                        <div className="flex gap-4 mb-4 items-center">
                                            <span className="text-zinc-500 font-bold text-xs tracking-widest bg-white/5 px-3 py-1 rounded-md">{article.date}</span>
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-6 group-hover:text-[#0066FF] transition-colors leading-relaxed line-clamp-3">{article.title}</h3>

                                        <div className="mt-auto flex items-center gap-2 text-white font-bold group-hover:text-[#0066FF] transition-colors group-hover:gap-4 text-sm md:text-base border-b border-white/10 group-hover:border-[#0066FF] pb-1 w-fit">
                                            {t("resources_pages.tech_insights.read_more")}
                                            <span className={`transition-transform ${lang === "ar" ? "rotate-180" : ""}`}>→</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
