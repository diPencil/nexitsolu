"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Cloud, Cpu, ShieldCheck, Zap } from "lucide-react"
import Image from "next/image"

export default function AdvancedInfrastructure() {
    const { lang, t } = useLanguage()

    const features = [
        { key: "cloud", icon: Cloud },
        { key: "edge", icon: Cpu },
        { key: "disaster", icon: ShieldCheck },
        { key: "sdn", icon: Zap },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen">
            <PageHero
                title={t("resources_pages.advanced_infra.hero_title")}
                subtitle={t("resources_pages.advanced_infra.hero_subtitle")}
            />

            <PageSection>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feat, i) => (
                        <motion.div
                            key={feat.key}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group relative h-full rounded-4xl bg-[#080808] border border-white/5 hover:bg-[#111] hover:border-[#0066FF] transition-all duration-500 overflow-hidden rtl:text-right ltr:text-left flex flex-col"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0066FF]/5 rounded-full blur-2xl group-hover:bg-[#0066FF]/20 transition-colors" />

                            <div className="p-8 md:p-10 flex flex-col grow justify-between relative z-10">
                                <div className="p-4 bg-white/5 text-zinc-400 group-hover:bg-[#0066FF] group-hover:text-white rounded-2xl w-fit mb-8 transition-colors duration-500 shadow-xl">
                                    <feat.icon className="w-8 h-8 md:w-10 md:h-10" />
                                </div>

                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-[#0066FF] transition-colors leading-tight">
                                        {(t("resources_pages.advanced_infra") as any)[feat.key]}
                                    </h3>
                                    <p className="text-zinc-500 text-sm md:text-base leading-relaxed mb-6 line-clamp-4">
                                        {lang === "ar"
                                            ? "نقدم تقنيات المستقبل التي تمكن شركتك من التفوق الرقمي. نحن نجمع بين أفضل الممارسات الأمنية والحوسبة السحابية."
                                            : "We offer future technologies that enable digital superiority. Combining best security practices with cloud computing."}
                                    </p>
                                </div>
                                <div className="mt-auto md:w-16 h-1 bg-white/10 group-hover:w-full group-hover:bg-[#0066FF] transition-all duration-700" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* AI Integration Section */}
            <PageSection className="bg-white/3 border-y border-white/5 py-32" columns={2}>
                <div className="flex flex-col justify-center order-2 md:order-1">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="p-2 bg-[#0066FF]/20 text-[#0066FF] rounded-lg">
                            <Zap className="w-5 h-5 animate-pulse" />
                        </span>
                        <span className="text-sm font-bold uppercase tracking-widest text-[#0066FF]">{lang === "ar" ? "نظام موجه بالذكاء الاصطناعي" : "AI Driven Infra"}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-medium text-white mb-6 leading-tight">
                        {lang === "ar" ? "إدارة " : "Intelligent "}<span className="text-[#0066FF]">{lang === "ar" ? "ذكية ومستقلة" : "Management"}</span>
                    </h2>
                    <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-8">
                        {lang === "ar"
                            ? "تحول من مجرد إدارة الأجهزة إلى إدارة المعرفة والذكاء. أنظمتنا المتطورة تتنبأ بالأعطال قبل حدوثها وتتخذ الإجراءات بشكل لحظي لتأمين بيئة العمل."
                            : "Shift from simple hardware management to knowledge intelligence. Our advanced systems predict failures before they occur and take instantaneous actions."}
                    </p>
                    <ul className="space-y-4">
                        {[
                            lang === "ar" ? "موازنة الأحمال بشكل تلقائي بين الخوادم." : "Automatic load balancing between servers.",
                            lang === "ar" ? "ردود أفعال سريعة ضد الهجمات الإلكترونية." : "Instant automated responses against cyber attacks.",
                            lang === "ar" ? "استهلاك ذكي للطاقة والموارد." : "Smart consumption of power and resources."
                        ].map((point, i) => (
                            <li key={i} className="flex items-center gap-3 text-zinc-300">
                                <div className="w-2 h-2 rounded-full bg-[#0066FF]" />
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="relative order-1 md:order-2"
                >
                    <div className="absolute inset-0 bg-linear-to-tr from-[#0066FF]/20 to-transparent blur-[80px]" />
                    <div className="relative aspect-square rounded-[3rem] border border-white/10 overflow-hidden shadow-3xl group">
                        <Image
                            src="/resources/advanced-infrastructure/Intelligent-Management.jpg"
                            alt="Intelligent Management"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-transparent" />

                        {/* Status Badge */}
                        <div className="absolute top-8 right-8 p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">System Active</span>
                        </div>
                    </div>
                </motion.div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
