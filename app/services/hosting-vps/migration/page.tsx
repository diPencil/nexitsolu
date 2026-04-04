"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { RefreshCw, Server, Database, Globe, ArrowRight, ShieldCheck, Zap } from "lucide-react"

export default function HostingMigrationPage() {
    const { lang, t } = useLanguage()

    const migrationFeatures = [
        {
            icon: Server,
            title: t("services_pages.hosting.migration_details.features.full_transfer_title"),
            desc: t("services_pages.hosting.migration_details.features.full_transfer_desc")
        },
        {
            icon: Globe,
            title: t("services_pages.hosting.migration_details.features.dns_setup_title"),
            desc: t("services_pages.hosting.migration_details.features.dns_setup_desc")
        },
        {
            icon: Zap,
            title: t("services_pages.hosting.migration_details.features.zero_downtime_title"),
            desc: t("services_pages.hosting.migration_details.features.zero_downtime_desc")
        },
        {
            icon: ShieldCheck,
            title: t("services_pages.hosting.migration_details.features.post_mig_title"),
            desc: t("services_pages.hosting.migration_details.features.post_mig_desc")
        }
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-background min-h-screen text-foreground">
            <PageHero
                title={t("services_pages.hosting.migration_details.hero_title")}
                subtitle={t("services_pages.hosting.migration_details.hero_subtitle")}
            />

            <PageSection title={t("services_pages.hosting.migration_details.overview_title")} columns={2}>
                <div className="flex flex-col justify-center">
                    <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                        {t("services_pages.hosting.migration_details.overview_content")}
                    </p>
                    <div className="flex items-center gap-4 text-[#0066FF]">
                        <RefreshCw className="w-6 h-6 animate-spin-slow" />
                        <span className="font-bold tracking-tight uppercase">
                            {t("services_pages.hosting.migration_details.badge")}
                        </span>
                    </div>
                </div>
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-secondary/50 border border-border flex items-center justify-center p-8">
                    <div className="flex items-center gap-12 text-[#0066FF]">
                        <Server className="w-20 h-20 opacity-50" />
                        <motion.div
                            animate={{ x: [0, 40, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <Database className="w-12 h-12" />
                        </motion.div>
                        <Server className="w-20 h-20" />
                    </div>
                </div>
            </PageSection>

            <PageSection>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {migrationFeatures.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-3xl bg-secondary border border-border hover:border-[#0066FF]/50 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-[#0066FF] transition-colors">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
