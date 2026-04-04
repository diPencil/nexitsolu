"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion, AnimatePresence } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Calendar, Clock, Filter, ArrowRight, Zap, ChevronRight, ChevronLeft, Search } from "lucide-react"
import { ARTICLES_CONTENT } from "./articles-data"
import { Card } from "@/components/ui/card"

export default function TechInsights() {
    const { lang, t } = useLanguage()

    const categories = [
        { id: "ALL", label: lang === "ar" ? "الكل" : "ALL" },
        { id: "Security", label: lang === "ar" ? "الأمن السيبراني" : "Cyber-Sec" },
        { id: "AI", label: lang === "ar" ? "الذكاء الاصطناعي" : "Neural AI" },
        { id: "Cloud", label: lang === "ar" ? "الخدمات السحابية" : "Cloud Arch" },
        { id: "Infrastructure", label: lang === "ar" ? "البنية التحتية" : "Infra Core" },
    ]
    const [activeCategory, setActiveCategory] = useState("ALL")

    const articles = Object.values(ARTICLES_CONTENT).map(art => ({
        id: art.id,
        slug: art.slug,
        title: lang === "ar" ? art.title_ar : art.title_en,
        cat: art.cat,
        date: art.date,
        image: art.image,
        readTime: lang === 'ar' ? "قراءة 5 د" : "5 min read"
    }))

    const filteredArticles = activeCategory === "ALL" ? articles : articles.filter(a => a.cat === activeCategory)

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-bg-primary min-h-screen text-text-primary overflow-hidden">
            <PageHero
                title={t("resources_pages.tech_insights.hero_title")}
                subtitle={t("resources_pages.tech_insights.hero_subtitle")}
            />

            {/* Premium Filter Navigation */}
            <div className="sticky top-24 z-40 px-6 py-12 flex justify-center">
                 <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 bg-bg-secondary/60 backdrop-blur-3xl border-2 border-border-color rounded-[2.5rem] p-3 shadow-4xl ring-8 ring-bg-primary/50"
                >
                    <div className="ps-6 pe-4 text-accent hidden md:flex items-center gap-3 border-e border-border-color/50">
                        <Search className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">{lang === "ar" ? "بحث" : "Scan"}</span>
                    </div>
                    <div className="flex gap-2 p-1 overflow-x-auto hide-scrollbar max-w-full">
                        {categories.map((cat, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-8 py-3.5 rounded-full text-xs font-black tracking-widest uppercase whitespace-nowrap transition-all duration-700 active:scale-95 ${activeCategory === cat.id ? 'bg-accent text-white shadow-2xl shadow-accent/30' : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary/50'}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            <PageSection className="pb-40!">
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 pt-12">
                    <AnimatePresence mode="popLayout">
                        {filteredArticles.map((article, i) => (
                            <motion.div
                                layout
                                key={article.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.6, delay: i * 0.05, ease: "circOut" }}
                                className="group flex flex-col h-full cursor-pointer"
                            >
                                <Link
                                    href={`/resources/tech-insights/${article.slug}`}
                                    className="flex flex-col h-full rounded-[3rem] bg-bg-secondary/20 border-2 border-border-color hover:border-accent/40 transition-all duration-700 overflow-hidden shadow-2xl hover:shadow-4xl relative z-10 group-hover:scale-[1.02]"
                                >
                                    {/* Article Reveal Image */}
                                    <div className="w-full aspect-16/10 relative overflow-hidden shrink-0 border-b-2 border-border-color group-hover:border-accent/40 transition-all duration-700">
                                        <Image
                                            src={article.image}
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-all duration-1000 opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-bg-primary/90 via-bg-primary/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
                                        
                                        {/* Category Badge Overlap */}
                                        <div className={`absolute top-8 ${lang === "ar" ? "right-8" : "left-8"}`}>
                                            <span className="px-6 py-2.5 bg-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-3xl border border-white/10 group-hover:scale-110 transition-transform">
                                                {article.cat}
                                            </span>
                                        </div>

                                        {/* Hover Icon HUD */}
                                        <div className="absolute bottom-8 right-8 pointer-events-none opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                                            <div className="w-14 h-14 rounded-2xl bg-bg-secondary/60 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-accent shadow-4xl ring-4 ring-bg-primary/50">
                                                <Zap className="w-6 h-6 fill-accent" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tactical Metadata & Title */}
                                    <div className="flex-1 p-10 md:p-12 w-full relative flex flex-col bg-bg-secondary/10 group-hover:bg-bg-secondary/30 transition-all duration-700">
                                        <div className="flex items-center gap-10 mb-8 border-b border-border-color/30 pb-6 whitespace-nowrap">
                                            <div className="flex items-center gap-3 text-text-secondary opacity-60 group-hover:opacity-100 transition-opacity">
                                                <Calendar className="w-4 h-4 text-accent" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{article.date}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-text-secondary opacity-60 group-hover:opacity-100 transition-opacity">
                                                <Clock className="w-4 h-4 text-accent" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{article.readTime}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl md:text-3xl font-black text-text-primary mb-10 group-hover:text-accent transition-all duration-500 leading-tight tracking-tighter line-clamp-3 uppercase">
                                            {article.title}
                                        </h3>

                                        <div className="mt-auto flex items-center justify-between group/link">
                                            <span className="text-accent text-[10px] font-black uppercase tracking-[0.4em] group-hover/link:tracking-[0.6em] transition-all duration-700 border-b border-accent/20 pb-1 group-hover/link:border-accent">
                                                {t("resources_pages.tech_insights.read_more")}
                                            </span>
                                            {lang === 'ar' ? <ChevronLeft className="w-5 h-5 text-accent group-hover/link:-translate-x-3 transition-transform" /> : <ChevronRight className="w-5 h-5 text-accent group-hover/link:translate-x-3 transition-transform" />}
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
