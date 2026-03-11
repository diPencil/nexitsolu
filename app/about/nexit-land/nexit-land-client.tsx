"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import Image from "next/image"
import { NexBotAI } from "@/components/nexbot-ai"
import {
    Zap, Award, Users, Target, Cpu, Globe,
    Shield, Activity, Wrench, Component,
    ArrowRight, CheckCircle2, ChevronDown,
    Eye, Rocket, Heart
} from "lucide-react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function NexitLand() {
    const { lang, t } = useLanguage()

    const stats = [
        { key: "partners", value: "250+", icon: Users },
        { key: "projects", value: "480+", icon: Target },
        { key: "years", value: "5+", icon: Zap },
        { key: "awards", value: "12", icon: Award },
    ]

    const journeySteps = [
        { id: 1, tag: t("about_pages.nexit_land.journey.step1_tag"), title: t("about_pages.nexit_land.journey.step1_title"), desc: t("about_pages.nexit_land.journey.step1_desc") },
        { id: 2, tag: t("about_pages.nexit_land.journey.step2_tag"), title: t("about_pages.nexit_land.journey.step2_title"), desc: t("about_pages.nexit_land.journey.step2_desc") },
        { id: 3, tag: t("about_pages.nexit_land.journey.step3_tag"), title: t("about_pages.nexit_land.journey.step3_title"), desc: t("about_pages.nexit_land.journey.step3_desc") },
    ]

    const ecosystemItems = [
        { title: t("about_pages.nexit_land.ecosystem.item1_title"), desc: t("about_pages.nexit_land.ecosystem.item1_desc"), icon: Globe },
        { title: t("about_pages.nexit_land.ecosystem.item2_title"), desc: t("about_pages.nexit_land.ecosystem.item2_desc"), icon: Component },
        { title: t("about_pages.nexit_land.ecosystem.item3_title"), desc: t("about_pages.nexit_land.ecosystem.item3_desc"), icon: Cpu },
        { title: t("about_pages.nexit_land.ecosystem.item4_title"), desc: t("about_pages.nexit_land.ecosystem.item4_desc"), icon: Activity },
        { title: t("about_pages.nexit_land.ecosystem.item5_title"), desc: t("about_pages.nexit_land.ecosystem.item5_desc"), icon: Shield },
        { title: t("about_pages.nexit_land.ecosystem.item6_title"), desc: t("about_pages.nexit_land.ecosystem.item6_desc"), icon: Wrench },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen text-white overflow-x-hidden">
            <PageHero
                title={t("about_pages.nexit_land.hero_title")}
                subtitle={t("about_pages.nexit_land.hero_subtitle")}
            />

            {/* Stats Bar */}
            <div className="relative z-20 -mt-12 md:-mt-20 container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.key}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-white/5 shadow-2xl flex flex-col items-center text-center group hover:border-[#0066FF]/50 transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-4 group-hover:bg-[#0066FF]/10 transition-colors">
                                <stat.icon className="w-6 h-6 text-[#0066FF]" />
                            </div>
                            <h3 className="text-2xl md:text-4xl font-black mb-1">{stat.value}</h3>
                            <p className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-widest">{t(`about_pages.nexit_land.stats.${stat.key}`)}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* The Story Section */}
            <PageSection title={t("about_pages.nexit_land.story_title")} columns={2} className="pt-32">
                <div className="flex flex-col justify-center">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-lg md:text-xl text-zinc-300 leading-relaxed mb-12 border-s-4 border-[#0066FF] ps-6 py-2"
                    >
                        {t("about_pages.nexit_land.story_content")}
                    </motion.p>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(t("about_pages.nexit_land.values") as any).map(([key, value]: any, i) => (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-5 rounded-2xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/50 transition-all"
                            >
                                <CheckCircle2 className="w-5 h-5 text-[#0066FF] mb-3" />
                                <h4 className="text-white font-bold mb-1 text-sm md:text-base">{value}</h4>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="relative aspect-square lg:aspect-auto h-full min-h-[400px] rounded-4xl overflow-hidden border border-white/5 shadow-2xl group">
                    <Image
                        src="/The-Nexit-Story.jpg"
                        alt="The Nexit Story"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                </div>
            </PageSection>

            {/* Journey Section */}
            <PageSection className="bg-[#080808]/50 border-y border-white/5">
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-4xl font-medium mb-6 text-white">{t("about_pages.nexit_land.journey.title")}</h2>
                    <div className="w-16 h-1 bg-[#0066FF] mx-auto rounded-full" />
                </div>
                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connection Line (Desktop) */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -translate-y-1/2 hidden md:block z-0" />

                    {journeySteps.map((step, i) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.2 }}
                            className="relative z-10 p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 hover:border-[#0066FF]/50 transition-all group lg:min-h-[300px]"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-[#0066FF] flex items-center justify-center text-white font-black mb-8 shadow-[0_0_20px_rgba(0,102,255,0.4)] group-hover:scale-110 transition-transform">
                                {step.id}
                            </div>
                            <span className="inline-block px-3 py-1 rounded-full bg-[#0066FF]/10 text-[#0066FF] text-[10px] font-black uppercase tracking-widest mb-4">
                                {step.tag}
                            </span>
                            <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">{step.title}</h3>
                            <p className="text-zinc-400 text-sm md:text-base leading-relaxed group-hover:text-zinc-300">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Ecosystem Section */}
            <PageSection title={t("about_pages.nexit_land.ecosystem.title")} columns={1}>
                <p className="text-zinc-500 text-start max-w-2xl mb-16 text-lg leading-relaxed">
                    {t("about_pages.nexit_land.ecosystem.subtitle")}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ecosystemItems.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-3xl bg-[#080808] border border-white/5 hover:border-[#0066FF]/30 hover:bg-[#111] transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center mb-6 group-hover:text-[#0066FF] transition-colors">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#0066FF] transition-colors">{item.title}</h3>
                            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Vision, Mission, Values Section - Reference Style */}
            <PageSection className="pb-16 md:pb-24">
                <div className="relative rounded-[3rem] p-8 md:p-20 bg-[#080808]/50 border border-white/5 overflow-hidden group">
                    {/* Background Decorative Element */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(0,102,255,0.1),transparent_70%)] pointer-events-none" />

                    <div className="text-center mb-20 relative z-10">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-zinc-900 text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-6 border border-white/5">
                            {lang === 'ar' ? 'البوصلة الاستراتيجية' : 'Strategic Compass'}
                        </span>
                        <h2 className="text-2xl md:text-4xl font-medium mb-6 text-white leading-tight max-w-4xl mx-auto">
                            {lang === 'ar'
                                ? 'رؤية طموحة ورسالة واضحة تقودنا نحو الابتكار'
                                : 'Our Vision, Mission & The Values We Live By'}
                        </h2>
                        <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed">
                            {lang === 'ar'
                                ? 'نحن لا نبني برمجيات فقط؛ نحن نبني مستقبلاً رقمياً مستداماً يعتمد على النزاهة والبحث المستمر والقيم الإنسانية.'
                                : 'We don\'t just build software; we build a sustainable digital future based on integrity, research, and human-centric values.'}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 relative z-10 items-stretch">
                        {/* Vision Card */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-zinc-950 p-10 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all flex flex-col items-center text-center group/card"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-8 group-hover/card:bg-[#0066FF]/10 transition-colors">
                                <Eye className="w-8 h-8 text-[#0066FF]" />
                            </div>
                            <h3 className="text-2xl font-black mb-4 text-white uppercase tracking-tight">{t("about_pages.nexit_land.vision_title")}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {t("about_pages.nexit_land.vision_content")}
                            </p>
                        </motion.div>

                        {/* Mission Card - HIGHLIGHTED */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-[#0066FF] p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,102,255,0.3)] flex flex-col items-center text-center transform md:scale-105 z-20 relative border border-white/10"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-8">
                                <Rocket className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-black mb-4 text-white uppercase tracking-tight">{t("about_pages.nexit_land.mission_title")}</h3>
                            <p className="text-white/90 text-sm leading-relaxed">
                                {t("about_pages.nexit_land.mission_content")}
                            </p>
                        </motion.div>

                        {/* Values Card */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-zinc-950 p-10 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all flex flex-col items-center text-center group/card"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-8 group-hover/card:bg-[#0066FF]/10 transition-colors">
                                <Heart className="w-8 h-8 text-[#0066FF]" />
                            </div>
                            <h3 className="text-2xl font-black mb-4 text-white uppercase tracking-tight">
                                {lang === 'ar' ? 'قيمنا الجوهرية' : 'Our Core Values'}
                            </h3>
                            <div className="grid grid-cols-2 gap-2 w-full mt-2">
                                {Object.values(t("about_pages.nexit_land.values") as any).map((val: any, i) => (
                                    <span key={i} className="text-[10px] md:text-xs text-zinc-400 font-bold bg-white/5 p-2 rounded-xl border border-white/5 group-hover/card:bg-white/10 transition-all">
                                        {val}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </PageSection>

            {/* FAQ Section */}
            <PageSection className="bg-[#080808]/30 border-y border-white/5 pb-32">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">
                    <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                        <h2 className="text-2xl md:text-4xl font-medium mb-6 text-white leading-tight">
                            {t("about_pages.nexit_land.faq.title")}
                        </h2>
                        <p className="text-zinc-500 text-lg md:text-xl max-w-sm leading-relaxed mb-8">
                            {lang === "ar"
                                ? "إليك بعض الأسئلة الشائعة التي قد تراودك حول منظومتنا التقنية وكيفية العمل معنا."
                                : "Frequently asked questions for us by our clients and partners regarding Nexit Land ecosystem."}
                        </p>

                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-950 border border-white/5 group/cta max-w-xs md:max-w-sm">
                            <div className="w-12 h-12 rounded-xl bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] shrink-0 group-hover/cta:bg-[#0066FF] group-hover/cta:text-white transition-all">
                                <Users className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-white text-sm font-bold mb-0.5">
                                    {lang === 'ar' ? 'لم تجد إجابتك؟' : 'Still need help?'}
                                </h4>
                                <p className="text-zinc-500 text-[11px] leading-tight">
                                    {lang === 'ar'
                                        ? 'فريقنا متاح دائماً للمساعدة'
                                        : 'Our team is ready to help you now.'}
                                </p>
                            </div>
                            <button className="px-4 py-2.5 rounded-lg bg-white text-black font-black text-[10px] uppercase tracking-wider hover:bg-[#0066FF] hover:text-white transition-all shrink-0">
                                {lang === 'ar' ? 'تواصل' : 'Contact'}
                            </button>
                        </div>
                    </div>

                    <div className="w-full">
                        <Accordion type="single" collapsible className="space-y-4">
                            {[1, 2, 3].map((num) => (
                                <AccordionItem
                                    key={num}
                                    value={`item-${num}`}
                                    className="border border-white/5 bg-zinc-950/50 rounded-2xl px-6 md:px-8 py-2 overflow-hidden hover:bg-zinc-900/40 transition-all data-[state=open]:border-[#0066FF]/30 data-[state=open]:bg-zinc-950"
                                >
                                    <AccordionTrigger className={`text-base md:text-xl font-medium text-white hover:no-underline py-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                        {t(`about_pages.nexit_land.faq.q${num}`)}
                                    </AccordionTrigger>
                                    <AccordionContent className={`text-zinc-400 text-sm md:text-lg leading-relaxed pb-6 pt-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                        {t(`about_pages.nexit_land.faq.a${num}`)}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
