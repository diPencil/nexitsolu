"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion, AnimatePresence } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Cloud, Cpu, ShieldCheck, Zap, Sparkles, Server, Globe, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

export default function AdvancedInfrastructure() {
    const { lang, t } = useLanguage()

    const features = [
        { key: "cloud", icon: Cloud },
        { key: "edge", icon: Cpu },
        { key: "disaster", icon: ShieldCheck },
        { key: "sdn", icon: Zap },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-bg-primary min-h-screen text-text-primary overflow-hidden">
            <PageHero
                title={t("resources_pages.advanced_infra.hero_title")}
                subtitle={t("resources_pages.advanced_infra.hero_subtitle")}
            />

            {/* Premium Feature Grid */}
            <PageSection className="pb-32!">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 pt-16">
                    {features.map((feat, i) => (
                        <motion.div
                            key={feat.key}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="group relative h-full border-2 border-border-color bg-bg-secondary/20 hover:border-accent/40 transition-all duration-700 overflow-hidden flex flex-col shadow-2xl rounded-[3rem] hover:scale-[1.02] hover:shadow-4xl">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-[100px] group-hover:bg-accent/15 transition-all duration-1000 pointer-events-none" />

                                <div className="p-12 md:p-14 flex flex-col grow justify-between relative z-10">
                                    <div className="w-20 h-20 bg-bg-primary text-accent group-hover:bg-accent group-hover:text-white rounded-3xl flex items-center justify-center mb-12 transition-all duration-700 shadow-2xl border-2 border-border-color group-hover:border-accent group-hover:-rotate-12">
                                        <feat.icon className="w-10 h-10" />
                                    </div>

                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-black text-text-primary mb-6 group-hover:text-accent transition-colors leading-tight tracking-tighter uppercase">
                                            {(t("resources_pages.advanced_infra") as any)[feat.key]}
                                        </h3>
                                        <p className="text-text-secondary text-lg leading-relaxed mb-12 line-clamp-4 font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                                            {lang === "ar"
                                                ? "نقدم تقنيات المستقبل التي تمكن شركتك من التفوق الرقمي. نحن نجمع بين أفضل الممارسات الأمنية والحوسبة السحابية."
                                                : "Architecting the future through high-performance compute density and secure data fabrics."}
                                        </p>
                                    </div>
                                    <div className="mt-auto h-2 w-16 bg-accent/20 group-hover:w-full group-hover:bg-accent transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(0,102,255,0.4)]" />
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* AI Integration Section */}
            <PageSection className="bg-bg-secondary/30 border-y border-border-color py-40!" columns={2}>
                <div className="flex flex-col justify-center order-2 lg:order-1 lg:pe-24">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black tracking-[0.3em] uppercase mb-10 shadow-xl">
                            <Sparkles className="w-5 h-5 animate-pulse" />
                            {lang === "ar" ? "نظام معالجة ذكي" : "Intelligent System Core"}
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-10 leading-[0.95] tracking-tighter uppercase pt-4">
                            {lang === "ar" ? "إدارة " : "Autonomous "}<span className="text-accent">{lang === "ar" ? "ذكية ومستقلة" : "Deployment"}</span><br/>
                            {lang === "ar" ? "للبنية التحتية" : "& Global Scale"}
                        </h2>
                        <p className="text-xl md:text-2xl text-text-secondary leading-relaxed mb-16 max-w-2xl font-medium opacity-80">
                            {lang === "ar"
                                ? "تحول من مجرد إدارة الأجهزة إلى إدارة المعرفة والذكاء. أنظمتنا المتطورة تتنبأ بالأعطال قبل حدوثها وتتخذ الإجراءات بشكل لحظي لتأمين بيئة العمل."
                                : "Transcend traditional hardware Ops. Our predictive neural systems anticipate failover points and recalibrate resources in micro-seconds for zero-downtime scaling."}
                        </p>
                    </motion.div>

                    <div className="space-y-6">
                        {[
                            lang === "ar" ? "موازنة الأحمال بشكل تلقائي بين الخوادم." : "Automated neural load balancing across global nodes.",
                            lang === "ar" ? "ردود أفعال سريعة ضد الهجمات الإلكترونية." : "Instant algorithmic shielding against zero-day threats.",
                            lang === "ar" ? "استهلاك ذكي للطاقة والموارد." : "Resource-aware power optimizations for green computing."
                        ].map((point, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-6 group/item"
                            >
                                <div className="w-3.5 h-3.5 rounded-full bg-accent shadow-[0_0_15px_rgba(0,102,255,0.6)] group-hover/item:scale-150 transition-transform" />
                                <span className="text-lg md:text-xl font-black text-text-primary uppercase tracking-tighter transition-colors group-hover/item:text-accent">{point}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="relative order-1 lg:order-2 flex items-center justify-center">
                    <div className="absolute inset-0 bg-accent/10 blur-[140px] pointer-events-none" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative aspect-square md:aspect-auto w-full h-full min-h-[600px] rounded-[4rem] border-2 border-border-color overflow-hidden shadow-4xl group group-hover:border-accent/40 transition-all duration-1000"
                    >
                        <Image
                            src="/resources/advanced-infrastructure/Intelligent-Management.jpg"
                            alt="Intelligent Management"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-bg-primary/80 via-bg-primary/10 to-transparent pointer-events-none" />

                        {/* Professional Status HUD */}
                        <div className="absolute top-12 right-12 px-10 py-5 rounded-4xl bg-bg-secondary/40 backdrop-blur-3xl border-2 border-white/10 flex items-center gap-6 shadow-4xl group-hover:bg-bg-secondary/60 group-hover:border-accent/40 transition-all duration-700">
                            <div className="w-3.5 h-3.5 rounded-full bg-accent animate-pulse shadow-[0_0_15px_rgba(0,102,255,0.7)]" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-text-primary uppercase tracking-[0.4em] opacity-60">Engine Status</span>
                                <span className="text-sm font-black text-text-primary uppercase tracking-widest">Core Active</span>
                            </div>
                        </div>

                         <div className="absolute bottom-12 left-12 right-12">
                            <div className="p-10 md:p-14 rounded-[3rem] bg-bg-secondary/40 backdrop-blur-3xl border-2 border-white/10 group-hover:bg-bg-secondary/60 group-hover:border-accent/40 transition-all duration-700 shadow-4xl">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="w-1.5 h-12 bg-accent rounded-full" />
                                    <p className="text-3xl md:text-4xl font-black text-text-primary leading-none tracking-tighter uppercase whitespace-nowrap">
                                        {lang === "ar" ? "أنظمة ذكية بالكامل" : "Full Neural Stack"}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between border-t border-white/10 pt-8">
                                    <p className="text-accent text-xs font-black uppercase tracking-[0.4em]">
                                        Powered by AI
                                    </p>
                                    <ArrowUpRight className="w-8 h-8 text-white/40 group-hover:text-accent group-hover:translate-x-2 group-hover:-translate-y-2 transition-all" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
