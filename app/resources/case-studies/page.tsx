"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion, AnimatePresence } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Filter, Zap, ShieldCheck, TrendingUp, Sparkles, ChevronRight, ChevronLeft } from "lucide-react"
import { useState } from "react"
import { Card } from "@/components/ui/card"

import { CASE_STUDIES_DATA } from "./case-studies-data"

export default function CaseStudies() {
    const { lang, t } = useLanguage()
    const isAr = lang === "ar"

    const categories = [
        { id: "ALL", en: "ALL", ar: "الكل" },
        { id: "Hospitality", en: "Hospitality", ar: "الضيافة" },
        { id: "Construction", en: "Construction", ar: "المقاولات" },
        { id: "Travel", en: "Travel", ar: "السياحة" },
        { id: "Technology", en: "Tech-Bio", ar: "تكنولوجيا" },
        { id: "Logistics", en: "Supply-Chain", ar: "اللوجستيات" },
        { id: "Retail", en: "Global Retail", ar: "التجزئة" }
    ]
    const [activeCategory, setActiveCategory] = useState("ALL")

    const allProjects = Object.values(CASE_STUDIES_DATA)

    const filteredProjects = activeCategory === "ALL" ? allProjects : allProjects.filter(p => p.cat.toUpperCase() === activeCategory.toUpperCase())

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-bg-primary min-h-screen text-text-primary overflow-hidden">
            <PageHero
                title={t("resources_pages.case_studies.hero_title")}
                subtitle={t("resources_pages.case_studies.hero_subtitle")}
            />

            <PageSection className="pb-40!">
                {/* Filter Bar - Premium Dashboard Style */}
                <div className="flex justify-center mb-24 sticky top-24 z-40 px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-bg-secondary/60 backdrop-blur-3xl border-2 border-border-color rounded-[2.5rem] p-3 shadow-4xl ring-8 ring-bg-primary/50"
                    >
                        <div className="ps-6 pe-4 text-accent hidden md:flex items-center gap-3 border-e border-border-color/50">
                            <Filter className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{isAr ? "فرز" : "Sort"}</span>
                        </div>
                        <div className="flex gap-2 p-1 overflow-x-auto hide-scrollbar max-w-full">
                            {categories.map((cat, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-8 py-3.5 rounded-full text-xs font-black tracking-widest uppercase whitespace-nowrap transition-all duration-700 active:scale-95 ${activeCategory === cat.id ? 'bg-accent text-white shadow-2xl shadow-accent/30' : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary/50'}`}
                                >
                                    {isAr ? cat.ar : cat.en}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 pt-12">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project, i) => (
                            <Link key={project.id} href={`/resources/case-studies/${project.slug}`}>
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.6, delay: i * 0.05, ease: "circOut" }}
                                    className="group relative h-full flex flex-col cursor-pointer"
                                >
                                    {/* Project Image Panel */}
                                    <div className="relative aspect-16/10 rounded-[3.5rem] overflow-hidden border-2 border-border-color mb-10 bg-bg-secondary shadow-4xl group-hover:border-accent/40 group-hover:shadow-accent/5 transition-all duration-700 ring-8 ring-bg-primary/50">
                                        <Image
                                            src={project.logo}
                                            alt={lang === "ar" ? project.title_ar : project.title_en}
                                            fill
                                            className="object-cover opacity-70 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-bg-primary via-bg-primary/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                                        {/* Status Tag */}
                                        <div className={`absolute top-8 ${lang === "ar" ? "right-8" : "left-8"}`}>
                                            <span className="px-6 py-2.5 bg-bg-secondary/40 backdrop-blur-2xl rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.3em] shadow-3xl border border-white/10 group-hover:bg-accent group-hover:border-accent transition-all duration-700">
                                                {lang === "ar" ? (categories.find(c => c.id === project.cat)?.ar || project.cat) : project.cat}
                                            </span>
                                        </div>

                                        {/* Hover Interaction Arrow */}
                                        <div className={`absolute top-8 ${lang === "ar" ? "left-8" : "right-8"} opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700`}>
                                            <div className="w-16 h-16 rounded-3xl bg-accent text-white shadow-4xl flex items-center justify-center border-2 border-white/10 group-hover:scale-110">
                                                <ArrowUpRight className={`w-8 h-8 ${lang === "ar" ? "-scale-x-100" : ""}`} />
                                            </div>
                                        </div>

                                        {/* Metric Badge Overlay */}
                                        <div className="absolute bottom-8 left-8 right-8 flex justify-end">
                                            <div className="px-8 py-4 rounded-3xl bg-bg-secondary/60 backdrop-blur-3xl border border-white/10 shadow-4xl group-hover:bg-bg-secondary/80 group-hover:border-accent/40 transition-all duration-700">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-accent text-3xl font-black tracking-tighter leading-none mb-1">{project.results.split(' ')[0]}</span>
                                                    <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{project.results.split(' ').slice(1).join(' ')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex flex-col grow px-6">
                                        <h3 className="text-3xl md:text-4xl font-black text-text-primary mb-4 group-hover:text-accent transition-all duration-500 tracking-tighter opacity-90 group-hover:opacity-100 leading-tight uppercase">
                                            {project.partner}
                                        </h3>
                                        <div className="flex items-start gap-4 mb-10">
                                             <span className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-accent group-hover:scale-150 transition-all duration-700 shadow-[0_0_10px_rgba(0,102,255,0.6)]" />
                                             <p className="text-text-secondary text-lg leading-relaxed font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                                                {lang === "ar" ? project.title_ar : project.title_en}
                                             </p>
                                        </div>

                                        <div className="mt-auto pt-6 border-t border-border-color/50 flex items-center justify-between group/link">
                                            <span className="text-accent text-xs font-black uppercase tracking-[0.4em] group-hover/link:tracking-[0.6em] transition-all duration-700">
                                                {lang === "ar" ? "تفاصيل الحالة" : "Case Intel"}
                                            </span>
                                            {lang === 'ar' ? <ChevronLeft className="w-5 h-5 text-accent group-hover/link:-translate-x-3 transition-transform" /> : <ChevronRight className="w-5 h-5 text-accent group-hover/link:translate-x-3 transition-transform" />}
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </PageSection>

            {/* Impact Banner CTA */}
            <section className="py-48! border-t border-border-color relative overflow-hidden bg-bg-secondary/30 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,102,255,0.1),transparent_70%)] pointer-events-none" />
                <div className="absolute inset-0 bg-accent/5 blur-[160px] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-28 h-28 rounded-[2.5rem] bg-accent/10 flex items-center justify-center mx-auto mb-16 border border-accent/20 shadow-4xl group hover:scale-110 transition-all duration-700"
                    >
                         <TrendingUp className="w-14 h-14 text-accent" />
                    </motion.div>

                    <h2 className="text-4xl md:text-7xl lg:text-8xl font-black text-text-primary mb-16 tracking-tighter leading-[0.95] uppercase">
                        {lang === "ar" ? "جاهز لقصة " : "Ready for your "}<br/>
                        <span className="text-accent">{lang === "ar" ? "نجاحك التالية؟" : "Next Milestone?"}</span>
                    </h2>

                    <p className="text-xl md:text-2xl text-text-secondary mb-20 max-w-3xl mx-auto font-medium opacity-80 leading-relaxed">
                        {lang === "ar" ? "انضم إلى نخبة الشركات التي حققت تحولاً رقمياً جذرياً معنا." : "Join the elite cohort of enterprise leaders who scaled their digital presence through our strategic IT engineering."}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                         <Link href="/quotation/request">
                            <button className="px-16 py-8 rounded-3xl bg-accent text-white font-black hover:scale-105 active:scale-95 shadow-4xl shadow-accent/30 transition-all duration-700 uppercase tracking-[0.3em] text-sm border-2 border-accent/20 flex items-center gap-6">
                                {lang === "ar" ? "ابدأ مشروعك الآن" : "Initialize Project"}
                                {lang === 'ar' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                            </button>
                        </Link>
                        <Link href="/services/managed-it" className="text-text-secondary text-sm font-black uppercase tracking-[0.4em] hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-2">
                             {lang === 'ar' ? 'استكشف الخدمات' : 'Browse Services'}
                        </Link>
                    </div>
                </div>
            </section>

            <NexBotAI />
        </main>
    )
}
