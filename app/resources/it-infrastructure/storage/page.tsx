"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Database, HardDrive, RotateCcw, ShieldAlert, Lock, Cloud, Save } from "lucide-react"
import Image from "next/image"

export default function StoragePage() {
    const { lang, t } = useLanguage()

    const features = [
        {
            icon: HardDrive,
            title: t("resources_pages.it_infra.storage_details.features.nas_san_title"),
            desc: t("resources_pages.it_infra.storage_details.features.nas_san_desc")
        },
        {
            icon: RotateCcw,
            title: t("resources_pages.it_infra.storage_details.features.backup_title"),
            desc: t("resources_pages.it_infra.storage_details.features.backup_desc")
        },
        {
            icon: ShieldAlert,
            title: t("resources_pages.it_infra.storage_details.features.dr_title"),
            desc: t("resources_pages.it_infra.storage_details.features.dr_desc")
        },
        {
            icon: Lock,
            title: t("resources_pages.it_infra.storage_details.features.encryption_title"),
            desc: t("resources_pages.it_infra.storage_details.features.encryption_desc")
        }
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen text-white">
            <PageHero
                title={t("resources_pages.it_infra.storage_details.hero_title")}
                subtitle={t("resources_pages.it_infra.storage_details.hero_subtitle")}
            />

            <PageSection title={t("resources_pages.it_infra.storage_details.overview_title")} columns={2}>
                <div className="flex flex-col justify-center">
                    <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                        {t("resources_pages.it_infra.storage_details.overview_content")}
                    </p>
                    <div className="flex items-center gap-4 text-[#0066FF]">
                        <Database className="w-6 h-6" />
                        <span className="font-bold tracking-tight uppercase">
                            {lang === "ar" ? "أمان بياناتك أولويتنا" : "Data Safety is Our Priority"}
                        </span>
                    </div>
                </div>
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 group">
                    <Image
                        src="/resources/it-infrastructure/Data-Security-&-Advanced-Storage--Backup.jpg"
                        alt="Data Storage & Security"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-transparent z-10" />
                    <div className="absolute bottom-8 left-8 right-8 z-20">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-[#0066FF] rounded-full" />
                            <span className="text-sm font-bold tracking-[0.2em] uppercase text-zinc-400 group-hover:text-white transition-colors">
                                {t("resources_pages.it_infra.services.storage")}
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

            <PageSection title={lang === "ar" ? "حلول الحماية القصوى" : "Ultimate Protection Solutions"} columns={3}>
                <div className="p-8 rounded-3xl bg-[#111111] border border-white/5">
                    <Cloud className="w-10 h-10 text-[#0066FF] mb-4" />
                    <h4 className="text-lg font-bold mb-2">{lang === "ar" ? "النسخ السحابي" : "Cloud Backup"}</h4>
                    <p className="text-zinc-500 text-sm">{lang === "ar" ? "نسخة إضافية خارج الموقع لزيادة الأمان." : "Off-site copy for enhanced safety."}</p>
                </div>
                <div className="p-8 rounded-3xl bg-[#111111] border border-white/5">
                    <Save className="w-10 h-10 text-[#0066FF] mb-4" />
                    <h4 className="text-lg font-bold mb-2">{lang === "ar" ? "استعادة سريعة" : "Rapid Recovery"}</h4>
                    <p className="text-zinc-500 text-sm">{lang === "ar" ? "استرجاع بياناتك في وقت قياسي." : "Get your data back in record time."}</p>
                </div>
                <div className="p-8 rounded-3xl bg-[#111111] border border-white/5">
                    <Lock className="w-10 h-10 text-[#0066FF] mb-4" />
                    <h4 className="text-lg font-bold mb-2">{lang === "ar" ? "دفاع سيبراني" : "Cyber Defense"}</h4>
                    <p className="text-zinc-500 text-sm">{lang === "ar" ? "حماية ضد الفيروسات وبرمجيات الفدية." : "Protection against viruses and ransomware."}</p>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
