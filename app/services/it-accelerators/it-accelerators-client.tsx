"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Rocket, Zap, TrendingUp, BarChart3, Briefcase, Settings, Cloud, ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"

export default function ITAccelerators() {
    const { lang, t } = useLanguage()

    const solutions = [
        { key: "automation", icon: Zap, image: "/services/it-accelerators/Process-Automation.jpg" },
        { key: "analytics", icon: BarChart3, image: "/services/it-accelerators/Data-Analytics.jpg" },
        { key: "bi", icon: TrendingUp, image: "/services/it-accelerators/Business-Intelligence.jpg" },
        { key: "consulting", icon: Briefcase, image: "/services/it-accelerators/IT-Consulting.jpg" },
        { key: "managed_it", icon: Settings, image: "/services/it-accelerators/Managed-IT-Operations.jpg" },
        { key: "cloud_transformation", icon: Cloud, image: "/services/it-accelerators/Cloud-Transformation.jpg" },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-bg-primary min-h-screen text-text-primary overflow-hidden">
            <PageHero
                title={t("services_pages.accelerators.hero_title")}
                subtitle={t("services_pages.accelerators.hero_subtitle")}
            />

            {/* IT Accelerators Grid */}
            <PageSection className="pb-32!">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14 pt-12">
                    {solutions.map((sol, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative group"
                        >
                            <Link href={`/services/it-accelerators/${sol.key.replace(/_/g, '-')}`} className="absolute inset-0 z-30" />

                            {/* Main Card with Premium Stacked Look */}
                            <Card className="h-full p-0 overflow-hidden border-border-color bg-bg-secondary/20 transition-all duration-700 flex flex-col shadow-2xl group-hover:shadow-4xl relative rounded-[3rem] group-hover:scale-[1.02]">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="p-10 md:p-12 flex flex-col grow">
                                    <div className="flex items-center gap-6 mb-10 border-b border-border-color/50 pb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-bg-primary border border-border-color flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-700 shadow-xl group-hover:scale-110">
                                            <sol.icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-black text-text-primary tracking-tighter leading-tight uppercase group-hover:text-accent transition-colors">
                                            {t(`services_pages.accelerators.${sol.key}`)}
                                        </h3>
                                    </div>

                                    <p className="text-text-secondary text-lg leading-relaxed grow mb-12 max-w-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                                        {t(`services_pages.accelerators.${sol.key}_desc`)}
                                    </p>

                                    <div className="relative aspect-16/10 w-full rounded-[2.5rem] overflow-hidden border border-border-color bg-bg-primary shadow-2xl group-hover:border-accent/40 transition-all duration-700">
                                        <Image
                                            src={sol.image}
                                            alt={sol.key}
                                            fill
                                            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-bg-primary/60 via-bg-primary/20 to-transparent pointer-events-none" />
                                        
                                        <div className="absolute bottom-6 right-6 p-4 rounded-2xl bg-accent text-white shadow-3xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                                            <ArrowUpRight className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Accelerator Impact Section */}
            <PageSection className="bg-bg-secondary/30 border-y border-border-color py-40!" columns={2}>
                 <div className="flex flex-col justify-center lg:pe-20 order-2 lg:order-1 space-y-12">
                     <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black tracking-[0.3em] uppercase mb-10 shadow-xl">
                            <Rocket className="w-4 h-4" />
                            {t("services_pages.accelerators.impact.tag")}
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-10 tracking-tighter leading-[0.95]">
                            {t("services_pages.accelerators.impact.title")}<br/>
                            <span className="text-accent">{t("services_pages.accelerators.impact.subtitle")}</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed max-w-2xl font-medium opacity-80">
                            {t("services_pages.accelerators.impact.content")}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { icon: Sparkles, key: "ai" },
                                { icon: ShieldCheck, key: "enterprise" }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-center gap-6 group/badge"
                                >
                                    <div className={`w-16 h-16 rounded-2xl bg-bg-primary flex items-center justify-center text-accent border border-border-color group-hover/badge:bg-accent group-hover/badge:text-white transition-all duration-700 shadow-2xl`}>
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <span className="text-text-primary text-sm font-black uppercase tracking-widest group-hover/badge:text-accent transition-colors">
                                        {t(`services_pages.accelerators.impact.badges.${item.key}`)}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
                <div className="relative order-1 lg:order-2 flex items-center justify-center">
                    <div className="absolute inset-0 bg-accent/5 blur-[120px] pointer-events-none" />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative aspect-square md:aspect-auto w-full h-full min-h-[500px] rounded-[4rem] overflow-hidden border border-border-color group shadow-4xl"
                    >
                        <Image
                            src="/services/it-accelerators/Why-Accelerators.jpg"
                            alt="Why Accelerators"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-bg-primary/60 via-bg-primary/20 to-transparent pointer-events-none" />
                    </motion.div>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
