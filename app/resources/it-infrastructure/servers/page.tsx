"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Server, Thermometer, Zap, LayoutGrid, Activity, ShieldCheck, Database } from "lucide-react"
import Image from "next/image"

export default function ServersPage() {
    const { lang, t } = useLanguage()

    const features = [
        {
            icon: Thermometer,
            title: t("resources_pages.it_infra.servers_details.features.cooling_title"),
            desc: t("resources_pages.it_infra.servers_details.features.cooling_desc")
        },
        {
            icon: Zap,
            title: t("resources_pages.it_infra.servers_details.features.power_title"),
            desc: t("resources_pages.it_infra.servers_details.features.power_desc")
        },
        {
            icon: LayoutGrid,
            title: t("resources_pages.it_infra.servers_details.features.racking_title"),
            desc: t("resources_pages.it_infra.servers_details.features.racking_desc")
        },
        {
            icon: Activity,
            title: t("resources_pages.it_infra.servers_details.features.monitoring_title"),
            desc: t("resources_pages.it_infra.servers_details.features.monitoring_desc")
        }
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen text-white">
            <PageHero
                title={t("resources_pages.it_infra.servers_details.hero_title")}
                subtitle={t("resources_pages.it_infra.servers_details.hero_subtitle")}
            />

            <PageSection title={t("resources_pages.it_infra.servers_details.overview_title")} columns={2}>
                <div className="flex flex-col justify-center">
                    <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                        {t("resources_pages.it_infra.servers_details.overview_content")}
                    </p>
                    <div className="flex items-center gap-4 text-[#0066FF]">
                        <Server className="w-6 h-6" />
                        <span className="font-bold tracking-tight uppercase">
                            {lang === "ar" ? "حلول مؤسسية متكاملة" : "Integrated Enterprise Solutions"}
                        </span>
                    </div>
                </div>
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 group">
                    <Image
                        src="/resources/it-infrastructure/Data-Centers-&-Server-Rooms-Design.jpg"
                        alt="Server Room"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-transparent z-10" />
                    <div className="absolute bottom-8 left-8 right-8 z-20">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-[#0066FF] rounded-full" />
                            <span className="text-sm font-bold tracking-[0.2em] uppercase text-zinc-400 group-hover:text-white transition-colors">
                                {t("resources_pages.it_infra.services.servers")}
                            </span>
                        </div>
                    </div>
                </div>
            </PageSection>

            <PageSection columns={4}>
                {features.map((feature, i) => (
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
            </PageSection>

            <PageSection title={lang === "ar" ? "لماذا تختار نكسيت؟" : "Why Choose Nexit?"} columns={3}>
                <div className="p-8 rounded-3xl bg-[#111111] border border-white/5">
                    <ShieldCheck className="w-10 h-10 text-[#0066FF] mb-4" />
                    <h4 className="text-lg font-bold mb-2">{lang === "ar" ? "أمان مطلق" : "Absolute Security"}</h4>
                    <p className="text-zinc-500 text-sm">{lang === "ar" ? "حماية فيزيائية وبرمجية لبياناتك." : "Physical and software protection for your data."}</p>
                </div>
                <div className="p-8 rounded-3xl bg-[#111111] border border-white/5">
                    <Activity className="w-10 h-10 text-[#0066FF] mb-4" />
                    <h4 className="text-lg font-bold mb-2">{lang === "ar" ? "استمرارية الأعمال" : "Business Continuity"}</h4>
                    <p className="text-zinc-500 text-sm">{lang === "ar" ? "ضمان عدم توقف الخدمات التقنية." : "Ensuring technical services never stop."}</p>
                </div>
                <div className="p-8 rounded-3xl bg-[#111111] border border-white/5">
                    <Database className="w-10 h-10 text-[#0066FF] mb-4" />
                    <h4 className="text-lg font-bold mb-2">{lang === "ar" ? "قابلية التوسع" : "Scalability"}</h4>
                    <p className="text-zinc-500 text-sm">{lang === "ar" ? "تصميم مرن ينمو مع احتياجات شركتك." : "Flexible design that grows with your company's needs."}</p>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
