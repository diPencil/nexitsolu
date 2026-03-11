"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Network, Wifi, Shield, ArrowLeftRight, Lock, Satellite, Globe } from "lucide-react"
import Image from "next/image"

export default function NetworksPage() {
    const { lang, t } = useLanguage()

    const features = [
        {
            icon: Wifi,
            title: t("resources_pages.it_infra.networks_details.features.wireless_title"),
            desc: t("resources_pages.it_infra.networks_details.features.wireless_desc")
        },
        {
            icon: Shield,
            title: t("resources_pages.it_infra.networks_details.features.security_title"),
            desc: t("resources_pages.it_infra.networks_details.features.security_desc")
        },
        {
            icon: ArrowLeftRight,
            title: t("resources_pages.it_infra.networks_details.features.routing_title"),
            desc: t("resources_pages.it_infra.networks_details.features.routing_desc")
        },
        {
            icon: Lock,
            title: t("resources_pages.it_infra.networks_details.features.vpn_title"),
            desc: t("resources_pages.it_infra.networks_details.features.vpn_desc")
        }
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen text-white">
            <PageHero
                title={t("resources_pages.it_infra.networks_details.hero_title")}
                subtitle={t("resources_pages.it_infra.networks_details.hero_subtitle")}
            />

            <PageSection title={t("resources_pages.it_infra.networks_details.overview_title")} columns={2}>
                <div className="flex flex-col justify-center">
                    <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                        {t("resources_pages.it_infra.networks_details.overview_content")}
                    </p>
                    <div className="flex items-center gap-4 text-[#0066FF]">
                        <Network className="w-6 h-6" />
                        <span className="font-bold tracking-tight uppercase">
                            {lang === "ar" ? "اتصالات سريعة وآمنة" : "Fast & Secure Connectivity"}
                        </span>
                    </div>
                </div>
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 group">
                    <Image
                        src="/resources/it-infrastructure/Integrated-Networking-(Direct-&-Wireless-Connectivity).jpg"
                        alt="Network Infrastructure"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-transparent z-10" />
                    <div className="absolute bottom-8 left-8 right-8 z-20">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-[#0066FF] rounded-full" />
                            <span className="text-sm font-bold tracking-[0.2em] uppercase text-zinc-400 group-hover:text-white transition-colors">
                                {t("resources_pages.it_infra.services.networks")}
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

            <PageSection title={lang === "ar" ? "حلول الربط المتقدمة" : "Advanced Connectivity Solutions"} columns={3}>
                <div className="p-8 rounded-3xl bg-[#111111] border border-white/5">
                    <Satellite className="w-10 h-10 text-[#0066FF] mb-4" />
                    <h4 className="text-lg font-bold mb-2">{lang === "ar" ? "ربط فروع متعددة" : "Multi-Branch Connectivity"}</h4>
                    <p className="text-zinc-500 text-sm">{lang === "ar" ? "ربط كافة فروع شركتك بمنظومة واحدة." : "Connect all your company branches into one system."}</p>
                </div>
                <div className="p-8 rounded-3xl bg-[#111111] border border-white/5">
                    <Globe className="w-10 h-10 text-[#0066FF] mb-4" />
                    <h4 className="text-lg font-bold mb-2">{lang === "ar" ? "إدارة سحابية" : "Cloud Management"}</h4>
                    <p className="text-zinc-500 text-sm">{lang === "ar" ? "تحكم كامل في شبكتك من أي مكان." : "Full control over your network from anywhere."}</p>
                </div>
                <div className="p-8 rounded-3xl bg-[#111111] border border-white/5">
                    <Lock className="w-10 h-10 text-[#0066FF] mb-4" />
                    <h4 className="text-lg font-bold mb-2">{lang === "ar" ? "صفر ثقة (Zero Trust)" : "Zero Trust Architecture"}</h4>
                    <p className="text-zinc-500 text-sm">{lang === "ar" ? "أعلى معايير الأمان السيبراني." : "Highest standards of cybersecurity."}</p>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
