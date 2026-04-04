"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Layers, Share2, ClipboardCheck, Tag, Cable, Construction, ShieldCheck } from "lucide-react"
import Image from "next/image"

export default function CablingPage() {
    const { lang, t } = useLanguage()

    const features = [
        {
            icon: Cable,
            title: t("resources_pages.it_infra.cabling_details.features.fiber_title"),
            desc: t("resources_pages.it_infra.cabling_details.features.fiber_desc")
        },
        {
            icon: Share2,
            title: t("resources_pages.it_infra.cabling_details.features.cat6_title"),
            desc: t("resources_pages.it_infra.cabling_details.features.cat6_desc")
        },
        {
            icon: Layers,
            title: t("resources_pages.it_infra.cabling_details.features.management_title"),
            desc: t("resources_pages.it_infra.cabling_details.features.management_desc")
        },
        {
            icon: Tag,
            title: t("resources_pages.it_infra.cabling_details.features.labels_title"),
            desc: t("resources_pages.it_infra.cabling_details.features.labels_desc")
        }
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-background min-h-screen text-foreground">
            <PageHero
                title={t("resources_pages.it_infra.cabling_details.hero_title")}
                subtitle={t("resources_pages.it_infra.cabling_details.hero_subtitle")}
            />

            <PageSection title={t("resources_pages.it_infra.cabling_details.overview_title")} columns={2}>
                <div className="flex flex-col justify-center">
                    <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                        {t("resources_pages.it_infra.cabling_details.overview_content")}
                    </p>
                    <div className="flex items-center gap-4 text-[#0066FF]">
                        <Layers className="w-6 h-6" />
                        <span className="font-bold tracking-tight uppercase">
                            {lang === "ar" ? "دقة في التنفيذ" : "Precision in Execution"}
                        </span>
                    </div>
                </div>
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-secondary border border-border group">
                    <Image
                        src="/resources/it-infrastructure/Structured-Cabling-&-Fiber-Optics.jpg"
                        alt="Structured Cabling"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10" />
                    <div className="absolute bottom-8 left-8 right-8 z-20">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-[#0066FF] rounded-full" />
                            <span className="text-sm font-bold tracking-[0.2em] uppercase text-muted-foreground group-hover:text-primary transition-colors">
                                {t("resources_pages.it_infra.services.cabling")}
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
                        className="p-8 rounded-3xl bg-secondary border border-border hover:border-[#0066FF]/50 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <feature.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-[#0066FF] transition-colors">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                    </motion.div>
                ))}
            </PageSection>

            <PageSection title={lang === "ar" ? "معايير التميز في التأسيس" : "Foundation Excellence Standards"} columns={3}>
                <div className="p-8 rounded-3xl bg-card border border-border">
                    <Construction className="w-10 h-10 text-[#0066FF] mb-4" />
                    <h4 className="text-lg font-bold mb-2">{lang === "ar" ? "مطابق للمواصفات" : "Specs Compliant"}</h4>
                    <p className="text-muted-foreground text-sm">{lang === "ar" ? "الالتزام بالمعايير العالمية للاتصالات." : "Adherence to international telecom standards."}</p>
                </div>
                <div className="p-8 rounded-3xl bg-card border border-border">
                    <ShieldCheck className="w-10 h-10 text-[#0066FF] mb-4" />
                    <h4 className="text-lg font-bold mb-2">{lang === "ar" ? "ضمان ممتد" : "Extended Warranty"}</h4>
                    <p className="text-muted-foreground text-sm">{lang === "ar" ? "نضمن جودة التوصيل وكفاءة الأسلاك." : "Guaranteeing cabling quality and efficiency."}</p>
                </div>
                <div className="p-8 rounded-3xl bg-card border border-border">
                    <ClipboardCheck className="w-10 h-10 text-[#0066FF] mb-4" />
                    <h4 className="text-lg font-bold mb-2">{lang === "ar" ? "توثيق هندسي" : "Engineering Docs"}</h4>
                    <p className="text-muted-foreground text-sm">{lang === "ar" ? "تقديم خرائط كاملة للبنية التحتية." : "Providing full infrastructure maps."}</p>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
