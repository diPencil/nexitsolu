"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Laptop, Monitor, Settings, ShieldCheck, ArrowRight, MousePointer2, Keyboard } from "lucide-react"
import Image from "next/image"

export default function HardwareWorkstationsPage() {
    const { lang, t } = useLanguage()

    const workstationFeatures = [
        {
            icon: Laptop,
            title: t("services_pages.hardware.workstations_details.features.business_laptop_title"),
            desc: t("services_pages.hardware.workstations_details.features.business_laptop_desc")
        },
        {
            icon: Monitor,
            title: t("services_pages.hardware.workstations_details.features.pro_workstation_title"),
            desc: t("services_pages.hardware.workstations_details.features.pro_workstation_desc")
        },
        {
            icon: Settings,
            title: t("services_pages.hardware.workstations_details.features.custom_config_title"),
            desc: t("services_pages.hardware.workstations_details.features.custom_config_desc")
        },
        {
            icon: ShieldCheck,
            title: t("services_pages.hardware.workstations_details.features.lifecycle_title"),
            desc: t("services_pages.hardware.workstations_details.features.lifecycle_desc")
        }
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen text-white">
            <PageHero
                title={t("services_pages.hardware.workstations_details.hero_title")}
                subtitle={t("services_pages.hardware.workstations_details.hero_subtitle")}
            />

            <PageSection title={t("services_pages.hardware.workstations_details.overview_title")} columns={2}>
                <div className="flex flex-col justify-center">
                    <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                        {t("services_pages.hardware.workstations_details.overview_content")}
                    </p>
                    <div className="flex items-center gap-4 text-[#0066FF]">
                        <MousePointer2 className="w-6 h-6" />
                        <span className="font-bold tracking-tight uppercase">
                            {lang === "ar" ? "أدوات إنتاجية متميزة" : "Premium Productivity Tools"}
                        </span>
                    </div>
                </div>
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 group shadow-2xl">
                    <Image
                        src="/services/hardware/Workstations-&-Laptops.jpg"
                        alt="Workstations & Laptops"
                        fill
                        className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-transparent z-10" />
                    <div className="absolute bottom-8 left-8 right-8 z-20">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-[#0066FF] rounded-full" />
                            <span className="text-sm font-bold tracking-[0.2em] uppercase text-zinc-400 group-hover:text-white transition-colors">
                                {t("services_pages.hardware.workstations_details.hero_title")}
                            </span>
                        </div>
                    </div>
                </div>
            </PageSection>

            <PageSection>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {workstationFeatures.map((feature, i) => (
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
