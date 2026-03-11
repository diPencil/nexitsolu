"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Building2, HeartPulse, ShoppingCart, Factory, GraduationCap, Gavel, Lightbulb, Ship, Palmtree, Bed, Coffee } from "lucide-react"
import Image from "next/image"

export default function Industries() {
    const { lang, t } = useLanguage()

    const sectors = [
        { key: "finance", icon: Building2, color: "text-blue-500" },
        { key: "healthcare", icon: HeartPulse, color: "text-red-500" },
        { key: "retail", icon: ShoppingCart, color: "text-green-500" },
        { key: "government", icon: Gavel, color: "text-zinc-400" },
        { key: "telecom", icon: Ship, color: "text-cyan-500" },
        { key: "energy", icon: Lightbulb, color: "text-yellow-500" },
        { key: "tourism", icon: Palmtree, color: "text-orange-500" },
        { key: "hotels", icon: Bed, color: "text-amber-500" },
        { key: "fnb", icon: Coffee, color: "text-rose-500" },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen">
            <PageHero
                title={t("resources_pages.industries.hero_title")}
                subtitle={t("resources_pages.industries.hero_subtitle")}
            />

            <PageSection title={t("resources_pages.industries.title")}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {sectors.map((ind, i) => (
                        <motion.div
                            key={ind.key}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group relative h-full rounded-4xl bg-[#080808] border border-white/5 hover:bg-[#111] hover:border-[#0066FF] transition-all duration-500 overflow-hidden rtl:text-right ltr:text-left flex flex-col"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0066FF]/5 rounded-full blur-2xl group-hover:bg-[#0066FF]/20 transition-colors" />

                            <div className="p-8 md:p-10 flex flex-col grow justify-between relative z-10">
                                <div className={`p-4 bg-white/5 ${ind.color} group-hover:bg-[#0066FF] group-hover:text-white rounded-2xl w-fit mb-8 transition-colors duration-500 shadow-xl`}>
                                    <ind.icon className="w-8 h-8 md:w-10 md:h-10" />
                                </div>

                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-[#0066FF] transition-colors leading-tight">
                                        {(t("industries") as any)[ind.key]?.title || ind.key}
                                    </h3>
                                    <p className="text-zinc-500 text-sm md:text-base leading-relaxed mb-6 line-clamp-4">
                                        {(t("industries") as any)[ind.key]?.description}
                                    </p>
                                </div>
                                <div className="mt-auto md:w-16 h-1 bg-white/10 group-hover:w-full group-hover:bg-[#0066FF] transition-all duration-700" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Strategy Section */}
            <PageSection className="bg-white/3 py-32 border-y border-white/5" columns={2}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="relative aspect-video lg:aspect-square rounded-[40px] overflow-hidden border border-white/10 group shadow-3xl"
                >
                    <Image
                        src="/resources/industries-solutions/How-we-design-solutions.jpg"
                        alt="How we design solutions"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />

                    {/* Floating Badge */}
                    <div className="absolute bottom-8 left-8 right-8 z-20">
                        <div className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 inline-flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#0066FF] flex items-center justify-center text-white shadow-lg shadow-[#0066FF]/20">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-white leading-tight">
                                    {lang === "ar" ? "تصميم مخصص" : "Custom Design"}
                                </p>
                                <p className="text-[#0066FF] text-xs font-bold mt-1 uppercase tracking-widest">
                                    Nexit Engineering
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
                <div className="flex flex-col justify-center px-4 md:px-0">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="p-2 bg-[#0066FF]/20 text-[#0066FF] rounded-lg">
                            <Lightbulb className="w-5 h-5 animate-pulse" />
                        </span>
                        <span className="text-sm font-bold uppercase tracking-widest text-[#0066FF]">{lang === "ar" ? "الفكر الاستراتيجي" : "Strategic Thinking"}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black mb-8 text-white leading-tight">
                        {lang === "ar" ? "كيف نصمم " : "How we design "}<span className="text-[#0066FF]">{lang === "ar" ? "الحلول؟" : "solutions?"}</span>
                    </h2>
                    <p className="text-zinc-300 text-lg md:text-xl leading-relaxed mb-8">
                        {lang === "ar"
                            ? "نبدأ بدراسة عميقة لسير العمل في مؤسستك، وتحديد نقاط الألم والفرص الضائعة."
                            : "We start with a deep study of your organization's workflow, identifying pain points and missed opportunities."}
                    </p>
                    <div className="p-6 md:p-8 rounded-3xl bg-[#0A0A0A] border border-white/5 border-s-4 border-s-[#0066FF]">
                        <p className="text-zinc-400 text-base md:text-lg leading-relaxed italic">
                            {lang === "ar"
                                ? '"هدفنا هو بناء وحياكة نظام مخصص ليس فقط لكي يعمل، بل ليضيف قيمة حقيقية وملموسة لأرباحك ومكانتك في السوق."'
                                : '"Our goal is to weave and build a custom system that does not just work, but adds real, tangible value to your bottom line and market position."'}
                        </p>
                    </div>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
