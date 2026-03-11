"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Mail, Shield, Smartphone, Globe, ArrowRight, ShieldCheck, Inbox } from "lucide-react"

export default function HostingEmailPage() {
    const { lang, t } = useLanguage()

    const emailFeatures = [
        {
            icon: Globe,
            title: t("services_pages.hosting.email_details.features.custom_domain_title"),
            desc: t("services_pages.hosting.email_details.features.custom_domain_desc")
        },
        {
            icon: Shield,
            title: t("services_pages.hosting.email_details.features.anti_spam_title"),
            desc: t("services_pages.hosting.email_details.features.anti_spam_desc")
        },
        {
            icon: Smartphone,
            title: t("services_pages.hosting.email_details.features.sync_title"),
            desc: t("services_pages.hosting.email_details.features.sync_desc")
        },
        {
            icon: ShieldCheck,
            title: t("services_pages.hosting.email_details.features.security_title"),
            desc: t("services_pages.hosting.email_details.features.security_desc")
        }
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen text-white">
            <PageHero
                title={t("services_pages.hosting.email_details.hero_title")}
                subtitle={t("services_pages.hosting.email_details.hero_subtitle")}
            />

            <PageSection title={t("services_pages.hosting.email_details.overview_title")} columns={2}>
                <div className="flex flex-col justify-center">
                    <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                        {t("services_pages.hosting.email_details.overview_content")}
                    </p>
                    <div className="flex items-center gap-4 text-[#0066FF]">
                        <Inbox className="w-6 h-6" />
                        <span className="font-bold tracking-tight uppercase">
                            {lang === "ar" ? "تواصل احترافي" : "Professional Communication"}
                        </span>
                    </div>
                </div>
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-900/50 border border-white/10 flex items-center justify-center p-12">
                    <div className="w-full max-w-sm space-y-3">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#0066FF]/20 flex items-center justify-center text-[#0066FF]">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="h-2 w-24 bg-white/20 rounded-full mb-2" />
                                <div className="h-2 w-full bg-white/10 rounded-full" />
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 opacity-50">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="h-2 w-20 bg-white/10 rounded-full mb-2" />
                                <div className="h-2 w-3/4 bg-white/5 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </PageSection>

            <PageSection>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {emailFeatures.map((feature, i) => (
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
