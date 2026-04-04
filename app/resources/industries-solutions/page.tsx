"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Building2, HeartPulse, ShoppingCart, Factory, GraduationCap, Gavel, Lightbulb, Ship, Palmtree, Bed, Coffee, ArrowUpRight, Zap, ShieldCheck, Sparkles } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

export default function Industries() {
    const { lang, t } = useLanguage()

    const sectors = [
        { key: "finance", icon: Building2, color: "text-blue-500" },
        { key: "healthcare", icon: HeartPulse, color: "text-red-500" },
        { key: "retail", icon: ShoppingCart, color: "text-green-500" },
        { key: "government", icon: Gavel, color: "text-text-secondary" },
        { key: "telecom", icon: Ship, color: "text-cyan-500" },
        { key: "energy", icon: Lightbulb, color: "text-yellow-500" },
        { key: "tourism", icon: Palmtree, color: "text-orange-500" },
        { key: "hotels", icon: Bed, color: "text-amber-500" },
        { key: "fnb", icon: Coffee, color: "text-rose-500" },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-bg-primary min-h-screen text-text-primary overflow-hidden">
            <PageHero
                title={t("resources_pages.industries.hero_title")}
                subtitle={t("resources_pages.industries.hero_subtitle")}
            />

            {/* Tactical Sector Grid */}
            <PageSection className="pb-32!">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14 pt-16">
                    {sectors.map((ind, i) => (
                        <motion.div
                            key={ind.key}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="group h-full p-0 overflow-hidden border-2 border-border-color hover:border-accent/40 bg-bg-secondary/20 transition-all duration-700 flex flex-col shadow-2xl hover:shadow-4xl relative rounded-[3rem] hover:scale-[1.02]">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors pointer-events-none" />
                                
                                <div className="p-10 md:p-14 flex flex-col grow relative z-10">
                                    <div className="flex justify-between items-start mb-12">
                                        <div className={`w-18 h-18 rounded-2xl bg-bg-primary border-2 border-border-color flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-700 shadow-xl group-hover:scale-110 group-hover:rotate-12`}>
                                            <ind.icon className="w-9 h-9" />
                                        </div>
                                        <div className="p-4 rounded-full bg-accent/5 group-hover:bg-accent text-accent group-hover:text-white transition-all duration-700 opacity-0 group-hover:opacity-100 shadow-2xl shadow-accent/20">
                                            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </div>
                                    </div>

                                    <div className="grow">
                                        <h3 className="text-2xl md:text-3xl font-black text-text-primary mb-6 group-hover:text-accent transition-colors leading-tight tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                                            {(t("industries") as any)[ind.key]?.title || ind.key}
                                        </h3>
                                        <p className="text-text-secondary text-lg leading-relaxed mb-10 line-clamp-4 font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                                            {(t("industries") as any)[ind.key]?.description}
                                        </p>
                                    </div>
                                    
                                    <div className="mt-auto flex items-center gap-4 text-accent text-[10px] font-black uppercase tracking-[0.4em] border-b border-accent/20 pb-2 w-fit group-hover:border-accent group-hover:tracking-[0.6em] transition-all">
                                        {lang === "ar" ? "استكشف الحلول" : "Review Intel"}
                                        <span className={lang === "ar" ? "rotate-180" : ""}>→</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-accent opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-1000 shadow-[0_0_15px_rgba(0,102,255,0.4)]" />
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Design Strategy Section */}
            <PageSection className="bg-bg-secondary/30 py-40! border-y border-border-color" columns={2}>
                 <div className="flex flex-col justify-center order-2 lg:order-1 lg:pe-24 space-y-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                         <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black tracking-[0.3em] uppercase mb-10 shadow-xl">
                            <Sparkles className="w-5 h-5 animate-pulse" />
                            {lang === "ar" ? "الرؤية الاستراتيجية" : "Strategic Ops Core"}
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-12 tracking-tighter leading-[0.95] uppercase pt-4">
                            {lang === "ar" ? "كيف نصمم " : "How we design "}<br/>
                            <span className="text-accent">{lang === "ar" ? "الحلول المتكاملة؟" : "Vertical Solutions"}</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-text-secondary leading-relaxed mb-16 max-w-2xl font-medium opacity-80">
                            {lang === "ar"
                                ? "نبدأ بدراسة عميقة لسير العمل في مؤسستك، وتحديد نقاط الألم والفرص الضائعة لنقدم لك حلاً يتجاوز مجرد 'البرمجيات'."
                                : "We commence with a high-fidelity diagnostic of your operational landscape, isolating friction points and legacy bottlenecks to engineer more than just 'software'—we build value."}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {[
                                { ar: "تحليل معمق", en: "Deep Analysis", icon: Zap },
                                { ar: "تطوير مخصص", en: "Custom Dev", icon: ShieldCheck }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-center gap-6 group/badge"
                                >
                                    <div className={`w-16 h-16 rounded-[1.25rem] bg-bg-primary flex items-center justify-center text-accent border-2 border-border-color group-hover/badge:bg-accent group-hover/badge:text-white transition-all duration-700 shadow-2xl`}>
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <span className="text-text-primary text-sm font-black uppercase tracking-widest group-hover/badge:text-accent transition-colors">{lang === 'ar' ? item.ar : item.en}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="relative order-1 lg:order-2 flex items-center justify-center">
                    <div className="absolute inset-0 bg-accent/5 blur-[140px] pointer-events-none" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative aspect-square md:aspect-auto w-full h-full min-h-[600px] rounded-[4rem] border-2 border-border-color overflow-hidden shadow-4xl group group-hover:border-accent/40 transition-all duration-1000 ring-8 ring-bg-primary/50"
                    >
                        <Image
                            src="/resources/industries-solutions/How-we-design-solutions.jpg"
                            alt="How we design solutions"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100 grayscale hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-bg-primary/80 via-bg-primary/10 to-transparent pointer-events-none" />

                         <div className="absolute bottom-12 left-12 right-12">
                            <Card className="p-10 md:p-14 rounded-[3rem] bg-bg-secondary/40 backdrop-blur-3xl border-2 border-white/10 group-hover:bg-bg-secondary/60 group-hover:border-accent/40 transition-all duration-700 shadow-4xl">
                                <div className="flex flex-col gap-8">
                                     <div className="flex items-center gap-6 mb-2">
                                        <div className="w-1.5 h-12 bg-accent rounded-full" />
                                        <p className="text-3xl md:text-4xl font-black text-text-primary leading-none tracking-tighter uppercase">
                                            {lang === "ar" ? "الفكر الاستراتيجي" : "The Core Strategy"}
                                        </p>
                                    </div>
                                    <p className="text-text-secondary text-lg md:text-xl italic font-black opacity-80 leading-relaxed border-s-4 border-accent ps-8">
                                        {lang === "ar"
                                            ? '"هدفنا هو بناء نظام مخصص ليضيف قيمة حقيقية لأرباحك ومكانتك في السوق."'
                                            : '"Our goal is to weave custom systems that add tangible value to your bottom line and global market position."'}
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
