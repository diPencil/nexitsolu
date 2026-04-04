"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { NexBotAI } from "@/components/nexbot-ai"
import { FileText, AlertCircle, Scale, RefreshCw, Ban, Globe, ShieldCheck, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

export default function TermsPage() {
    const { lang, t } = useLanguage()

    const sections = [
        {
            icon: FileText,
            title: t("terms_pages.sections.acceptance.title"),
            body: t("terms_pages.sections.acceptance.body"),
        },
        {
            icon: Globe,
            title: t("terms_pages.sections.scope.title"),
            body: t("terms_pages.sections.scope.body"),
        },
        {
            icon: Scale,
            title: t("terms_pages.sections.liability.title"),
            body: t("terms_pages.sections.liability.body"),
        },
        {
            icon: Ban,
            title: t("terms_pages.sections.prohibited.title"),
            body: t("terms_pages.sections.prohibited.body"),
        },
        {
            icon: RefreshCw,
            title: t("terms_pages.sections.modifications.title"),
            body: t("terms_pages.sections.modifications.body"),
        },
        {
            icon: AlertCircle,
            title: t("terms_pages.sections.governing_law.title"),
            body: t("terms_pages.sections.governing_law.body"),
        },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-bg-primary min-h-screen text-text-primary overflow-hidden">
            <PageHero
                title={t("terms_pages.hero_title")}
                subtitle={t("terms_pages.hero_subtitle")}
            />

            <PageSection className="pb-32!">
                <div className="max-w-4xl mx-auto space-y-10 pt-16">
                    {sections.map((sec, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <Card className="flex flex-col md:flex-row gap-8 p-10 md:p-12 rounded-[2.5rem] bg-bg-secondary/20 border-2 border-border-color hover:border-accent/40 transition-all duration-700 shadow-2xl group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="shrink-0 w-16 h-16 bg-bg-primary border-2 border-border-color rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-700 shadow-xl group-hover:scale-110 group-hover:rotate-6">
                                    <sec.icon className="w-8 h-8" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black text-text-primary group-hover:text-accent transition-colors tracking-tighter uppercase leading-none">
                                        {sec.title}
                                    </h3>
                                    <p className="text-text-secondary text-lg leading-relaxed font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                                        {sec.body}
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 p-12 rounded-[3rem] bg-bg-secondary/30 border-2 border-accent/20 text-center relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-accent/5 blur-[120px] pointer-events-none" />
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center justify-center gap-6 text-accent">
                            <Scale className="w-8 h-8" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t("terms_pages.compliance_tag")}</span>
                        </div>
                        <p className="text-text-primary text-xl md:text-2xl font-black tracking-tight max-w-2xl mx-auto uppercase">
                            {t("terms_pages.last_updated")}
                            <br/>
                            <a href="mailto:support@nexitsolu.com" className="text-accent hover:border-b-2 border-accent transition-all inline-block mt-4 lowercase">support@nexitsolu.com</a>
                        </p>
                    </div>
                </motion.div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
