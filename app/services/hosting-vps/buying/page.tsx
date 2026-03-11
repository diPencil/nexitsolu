"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Globe, Server, Lock, Settings, ArrowRight, ShieldCheck, Zap } from "lucide-react"

export default function HostingBuyingPage() {
    const { lang, t } = useLanguage()

    const buyingFeatures = [
        {
            icon: Globe,
            title: t("services_pages.hosting.buying_details.features.domain_reg_title"),
            desc: t("services_pages.hosting.buying_details.features.domain_reg_desc")
        },
        {
            icon: Server,
            title: t("services_pages.hosting.buying_details.features.cloud_hosting_title"),
            desc: t("services_pages.hosting.buying_details.features.cloud_hosting_desc")
        },
        {
            icon: Lock,
            title: t("services_pages.hosting.buying_details.features.ssl_cert_title"),
            desc: t("services_pages.hosting.buying_details.features.ssl_cert_desc")
        },
        {
            icon: Settings,
            title: t("services_pages.hosting.buying_details.features.pro_config_title"),
            desc: t("services_pages.hosting.buying_details.features.pro_config_desc")
        }
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen text-white">
            <PageHero
                title={t("services_pages.hosting.buying_details.hero_title")}
                subtitle={t("services_pages.hosting.buying_details.hero_subtitle")}
            />

            <PageSection title={t("services_pages.hosting.buying_details.overview_title")} columns={2}>
                <div className="flex flex-col justify-center">
                    <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                        {t("services_pages.hosting.buying_details.overview_content")}
                    </p>
                    <div className="flex items-center gap-4 text-[#0066FF]">
                        <Zap className="w-6 h-6 fill-[#0066FF]" />
                        <span className="font-bold tracking-tight uppercase">
                            {lang === "ar" ? "سرعة وأمان فائقان" : "Ultimate Speed & Security"}
                        </span>
                    </div>
                </div>
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-900/50 border border-white/10 flex items-center justify-center p-12">
                    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                        <div className="w-full h-12 rounded-xl bg-white/5 border border-white/10 flex items-center px-4 gap-3">
                            <Globe className="w-4 h-4 text-zinc-500" />
                            <div className="text-zinc-400 text-sm">www.yourbrand.com</div>
                            <div className="ml-auto text-[#0066FF] text-[10px] font-bold uppercase tracking-tighter">Available</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="h-24 rounded-xl bg-[#0066FF]/5 border border-[#0066FF]/20 flex flex-col items-center justify-center gap-2">
                                <Lock className="w-6 h-6 text-[#0066FF]" />
                                <span className="text-[10px] text-white/50 uppercase">SSL Secure</span>
                            </div>
                            <div className="h-24 rounded-xl bg-green-500/5 border border-green-500/20 flex flex-col items-center justify-center gap-2">
                                <Zap className="w-6 h-6 text-green-500" />
                                <span className="text-[10px] text-white/50 uppercase">99.9% Uptime</span>
                            </div>
                        </div>
                    </div>
                </div>
            </PageSection>

            <PageSection>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {buyingFeatures.map((feature, i) => (
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
