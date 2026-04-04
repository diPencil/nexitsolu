"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { CheckCircle2, Zap, Globe, ArrowUpRight } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function Partners() {
    const { lang, t } = useLanguage()

    const partnerLogos = [
        { name: "Albkht Company", src: "/partners/Albkht-company.jpg" },
        { name: "Hainan Soliman", src: "/partners/Hainan-Soliman.jpg" },
        { name: "Vesper Group", src: "/partners/Vesper group.jpg" },
        { name: "Viva Egypt Travel", src: "/partners/Viva egypttravel.jpg" },
        { name: "Arkan", src: "/partners/arkan.jpg" },
        { name: "Onestaeg Hurghada", src: "/partners/onestaeg hurghada.jpg" },
        { name: "Pencil", src: "/partners/pencil.jpg" },
        { name: "Pioneer Construction", src: "/partners/pioneer construction.jpg" },
        { name: "Taxidia", src: "/partners/taxidia.jpg" },
        { name: "Withinsky", src: "/partners/withinsky.jpg" },
        { name: "Rivoli Suites", src: "/partners/rivoli-suites.jpg" },
        { name: "Rivoli Spa", src: "/partners/rivoli-spa.jpg" },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-bg-primary min-h-screen text-text-primary">
            <PageHero
                title={t("about_pages.partners.hero_title")}
                subtitle={t("about_pages.partners.hero_subtitle")}
            />

            {/* Intro Section */}
            <PageSection className="pb-32">
                <div className="max-w-5xl mx-auto text-center relative z-10 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-2xl md:text-5xl font-black mb-12 leading-[1.1] tracking-tighter text-text-primary">
                            {t("about_pages.partners.intro")}
                        </p>
                        <div className="w-32 h-2 bg-accent mx-auto rounded-full shadow-[0_0_20px_rgba(0,102,255,0.4)]" />
                    </motion.div>
                </div>
            </PageSection>

            {/* Partner Grid - Logos Marquee */}
            <section className="py-32 bg-bg-secondary/20 border-y border-border-color relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-48 bg-linear-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-48 bg-linear-to-l from-bg-primary to-transparent z-10 pointer-events-none" />

                <div className="flex gap-40 animate-marquee whitespace-nowrap items-center">
                    {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, i) => (
                        <div key={i} className="flex justify-center shrink-0">
                            <img
                                src={logo.src}
                                alt={logo.name}
                                className="h-28 md:h-36 w-auto object-contain opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000 cursor-default brightness-110 dark:brightness-150 scale-95 hover:scale-105"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Partner Section */}
            <PageSection title={t("about_pages.partners.why_partner")} className="py-40">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-24">
                    {(t("about_pages.partners.benefits") as any[]).map((benefit, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="group relative p-10 md:p-14 border-border-color hover:border-accent/40 bg-bg-secondary/30 transition-all duration-500 overflow-hidden flex flex-col items-center text-center h-full shadow-2xl backdrop-blur-sm">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-[60px] group-hover:bg-accent/15 transition-all pointer-events-none" />

                                <div className="p-5 bg-bg-primary text-accent rounded-2xl w-fit mb-8 group-hover:bg-accent group-hover:text-white transition-all duration-500 border border-border-color shadow-xl">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h3 className="text-text-primary text-xl md:text-2xl font-black leading-tight group-hover:text-accent transition-colors tracking-tight">
                                    {benefit}
                                </h3>
                                <ArrowUpRight className="w-6 h-6 text-accent mt-10 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0" />
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="p-12 md:p-20 border-border-color relative overflow-hidden group hover:border-accent/40 transition-all duration-1000 h-full bg-bg-secondary/30 shadow-3xl backdrop-blur-xl">
                            <div className="absolute inset-0 bg-accent/3 blur-[120px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <Globe className="absolute -bottom-16 -right-16 w-80 h-80 text-accent/5 group-hover:text-accent/10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-1000 pointer-events-none" />
                            
                            <h3 className="text-4xl md:text-5xl font-black mb-8 text-text-primary group-hover:text-accent transition-colors tracking-tighter">
                                {t("about_pages.partners.standards.title")}
                            </h3>
                            <p className="text-text-secondary text-lg md:text-2xl leading-relaxed relative z-10 max-w-xl font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                                {t("about_pages.partners.standards.desc")}
                            </p>
                            <div className="mt-12 relative z-10 w-24 h-2 bg-accent/20 rounded-full group-hover:w-48 group-hover:bg-accent transition-all duration-1000 shadow-[0_0_15px_rgba(0,102,255,0.3)]" />
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="p-12 md:p-20 bg-bg-primary relative overflow-hidden group hover:border-accent/40 transition-all duration-1000 h-full shadow-3xl border border-border-color/50">
                            <div className="absolute inset-0 bg-accent/5 blur-[120px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <Zap className="absolute -bottom-16 -right-16 w-80 h-80 text-accent/5 group-hover:text-accent/10 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-1000 pointer-events-none" />
                            
                            <h3 className="text-4xl md:text-5xl font-black mb-8 text-text-primary group-hover:text-accent transition-colors tracking-tighter">
                                {t("about_pages.partners.deployment.title")}
                            </h3>
                            <p className="text-text-secondary text-lg md:text-2xl leading-relaxed relative z-10 max-w-xl font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                                {t("about_pages.partners.deployment.desc")}
                            </p>
                            <div className="mt-12 relative z-10 w-24 h-2 bg-accent/20 rounded-full group-hover:w-48 group-hover:bg-accent transition-all duration-1000 shadow-[0_0_15px_rgba(0,102,255,0.3)]" />
                        </Card>
                    </motion.div>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
