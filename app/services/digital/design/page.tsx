"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Palette, MousePointer2, Layout, Zap, ArrowRight, ShieldCheck, PenTool } from "lucide-react"

export default function DigitalDesignPage() {
    const { lang, t } = useLanguage()

    const designFeatures = [
        {
            icon: Layout,
            title: t("services_pages.digital.design_details.features.ui_design_title"),
            desc: t("services_pages.digital.design_details.features.ui_design_desc")
        },
        {
            icon: MousePointer2,
            title: t("services_pages.digital.design_details.features.ux_research_title"),
            desc: t("services_pages.digital.design_details.features.ux_research_desc")
        },
        {
            icon: Palette,
            title: t("services_pages.digital.design_details.features.branding_title"),
            desc: t("services_pages.digital.design_details.features.branding_desc")
        },
        {
            icon: Zap,
            title: t("services_pages.digital.design_details.features.prototyping_title"),
            desc: t("services_pages.digital.design_details.features.prototyping_desc")
        }
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen text-white">
            <PageHero
                title={t("services_pages.digital.design_details.hero_title")}
                subtitle={t("services_pages.digital.design_details.hero_subtitle")}
            />

            <PageSection title={t("services_pages.digital.design_details.overview_title")} columns={2}>
                <div className="flex flex-col justify-center">
                    <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                        {t("services_pages.digital.design_details.overview_content")}
                    </p>
                    <div className="flex items-center gap-4 text-[#0066FF]">
                        <PenTool className="w-6 h-6" />
                        <span className="font-bold tracking-tight uppercase">
                            {lang === "ar" ? "إبداع بلا حدود" : "Boundless Creativity"}
                        </span>
                    </div>
                </div>
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-900/50 border border-white/10 flex items-center justify-center p-8">
                    <div className="w-full h-full relative border border-white/5 rounded-2xl p-4 bg-white/5 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-8 border-b border-white/5 flex items-center px-4 gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                            <div className="w-2 h-2 rounded-full bg-green-500/50" />
                        </div>
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="h-24 rounded-lg bg-white/5 border border-white/5 animate-pulse" />
                            <div className="h-24 rounded-lg bg-[#0066FF]/10 border border-[#0066FF]/20 animate-pulse" />
                        </div>
                        <motion.div
                            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        >
                            <MousePointer2 className="w-8 h-8 text-[#0066FF]" />
                        </motion.div>
                    </div>
                </div>
            </PageSection>

            <PageSection>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {designFeatures.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-3xl bg-zinc-900 border border-white/5 hover:border-[#0066FF]/50 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] mb-6 group-hover:bg-[#0066FF] group-hover:text-white transition-colors">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-[#0066FF] transition-colors">{feature.title}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
