"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { NexBotAI } from "@/components/nexbot-ai"
import {
    Zap, Award, Users, Target, Cpu, Globe,
    Shield, Activity, Wrench, Component,
    CheckCircle2, Eye, Rocket, Heart, ArrowUpRight
} from "lucide-react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"

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
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-bg-primary min-h-screen text-text-primary">
            <PageHero
                title={t("about_pages.nexit_land.hero_title")}
                subtitle={t("about_pages.nexit_land.hero_subtitle")}
            />

            {/* Stats Bar */}
            <div className="relative z-20 -mt-12 md:-mt-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.key}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="p-8 md:p-10 border-border-color shadow-none dark:shadow-2xl flex flex-col items-center text-center group hover:border-accent/40 bg-bg-secondary/30 transition-all duration-500 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors pointer-events-none" />
                                <div className="w-16 h-16 rounded-2xl bg-bg-primary flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-xl border border-border-color">
                                    <stat.icon className="w-8 h-8 text-accent group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black mb-2 tracking-tight group-hover:text-accent transition-colors">{stat.value}</h3>
                                <p className="text-text-secondary text-xs md:text-sm font-black uppercase tracking-widest opacity-70">{t(`about_pages.nexit_land.stats.${stat.key}`)}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* The Story Section */}
            <PageSection title={t("about_pages.nexit_land.story_title")} columns={2} className="pt-40">
                <div className="flex flex-col justify-center pe-0 lg:pe-16 space-y-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-accent rounded-full opacity-30 hidden md:block" />
                        <p className="text-xl md:text-2xl text-text-primary leading-relaxed md:ps-10 py-2 font-black tracking-tight italic opacity-90">
                            &quot;{t("about_pages.nexit_land.story_content")}&quot;
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(t("about_pages.nexit_land.values") as any).map(([key, value]: any, i) => (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-5 rounded-2xl bg-bg-secondary/30 border border-border-color hover:border-accent/40 transition-all group flex items-center gap-4 shadow-none dark:shadow-xl backdrop-blur-sm"
                            >
                                <div className="p-2 bg-accent/10 text-accent rounded-lg group-hover:bg-accent group-hover:text-white transition-all">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <span className="text-text-primary font-black tracking-tight text-sm md:text-base">{value}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="relative aspect-video lg:aspect-auto h-full min-h-[500px] rounded-4xl overflow-hidden border border-border-color shadow-3xl group">
                    <Image
                        src="/The-Nexit-Story.jpg"
                        alt="The Nexit Story"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-bg-primary/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-10 left-10 p-6 bg-bg-primary/70 backdrop-blur-xl rounded-2xl border border-border-color/60 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 shadow-2xl">
                        <p className="text-text-primary font-black uppercase tracking-widest text-xs">{lang === 'ar' ? 'رحلة ملهمة' : 'An Inspiring Journey'}</p>
                    </div>
                </div>
            </PageSection>

            {/* Journey Section */}
            <PageSection className="bg-bg-secondary/20 border-y border-border-color relative overflow-hidden py-40">
                <div className="absolute inset-0 bg-accent/3 blur-[120px] -z-10" />
                <div className="text-center mb-24">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest mb-6 border border-accent/20">
                        {lang === 'ar' ? 'خط زمني' : 'Timeline'}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black mb-8 text-text-primary tracking-tight leading-tight">{t("about_pages.nexit_land.journey.title")}</h2>
                    <div className="w-24 h-1.5 bg-accent mx-auto rounded-full" />
                </div>
                <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-accent/10 -translate-y-1/2 hidden md:block z-0" />

                    {journeySteps.map((step, i) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                        >
                            <Card className="relative z-10 p-10 h-full border-border-color hover:border-accent/40 bg-bg-primary transition-all duration-500 group shadow-none dark:shadow-2xl flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-white font-black text-2xl mb-10 shadow-2xl group-hover:scale-110 transition-transform duration-500 relative">
                                    <div className="absolute inset-0 bg-accent rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity" />
                                    <span className="relative z-10">{step.id}</span>
                                </div>
                                <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest mb-6 border border-accent/20">
                                    {step.tag}
                                </span>
                                <h3 className="text-2xl font-black mb-6 text-text-primary group-hover:text-accent transition-colors tracking-tight">{step.title}</h3>
                                <p className="text-text-secondary text-sm md:text-base leading-relaxed font-bold opacity-70 group-hover:opacity-100 transition-opacity">
                                    {step.desc}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Ecosystem Section */}
            <PageSection title={t("about_pages.nexit_land.ecosystem.title")}>
                <p className="text-text-secondary text-center max-w-2xl mx-auto mb-24 text-lg md:text-xl leading-relaxed font-medium opacity-80">
                    {t("about_pages.nexit_land.ecosystem.subtitle")}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {ecosystemItems.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="p-10 h-full border-border-color hover:border-accent/40 hover:bg-bg-secondary/30 transition-all duration-500 group flex flex-col items-center text-center shadow-none dark:shadow-xl relative overflow-hidden backdrop-blur-sm">
                                <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors pointer-events-none" />
                                <div className="w-16 h-16 rounded-2xl bg-bg-secondary flex items-center justify-center mb-8 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 border border-border-color shadow-inner">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black mb-6 text-text-primary group-hover:text-accent transition-colors tracking-tight">{item.title}</h3>
                                <p className="text-text-secondary text-base leading-relaxed font-medium opacity-70 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                                <ArrowUpRight className="w-5 h-5 text-accent ms-auto mt-8 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0" />
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Vision, Mission, Values Section */}
            <PageSection className="pb-40">
                <div className="relative rounded-3xl p-10 md:p-24 bg-bg-secondary/10 border border-border-color overflow-hidden shadow-3xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(0,102,255,0.08),transparent_70%)] pointer-events-none" />
                    <div className="absolute inset-0 bg-accent/3 blur-[120px] pointer-events-none" />

                    <div className="text-center mb-24 relative z-10">
                        <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest mb-8 border border-accent/20">
                            {lang === 'ar' ? 'البوصلة الاستراتيجية' : 'Strategic Compass'}
                        </span>
                        <h2 className="text-4xl md:text-7xl font-black mb-10 text-text-primary leading-tight max-w-5xl mx-auto tracking-tighter">
                            {lang === 'ar'
                                ? 'رؤية طموحة ورسالة واضحة تقودنا نحو الابتكار'
                                : 'Our Vision, Mission & The Values We Live By'}
                        </h2>
                        <p className="text-text-secondary max-w-3xl mx-auto text-lg md:text-xl leading-relaxed font-medium opacity-80">
                            {lang === 'ar'
                                ? 'نحن لا نبني برمجيات فقط؛ نحن نبني مستقبلاً رقمياً مستداماً يعتمد على النزاهة والبحث المستمر والقيم الإنسانية.'
                                : 'We don\'t just build software; we build a sustainable digital future based on integrity, research, and human-centric values.'}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative z-10">
                        {/* Vision Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="h-full p-10 md:p-14 border-border-color hover:border-accent/40 transition-all duration-500 flex flex-col items-center text-center group bg-bg-primary/50 backdrop-blur-xl shadow-none dark:shadow-2xl">
                                <div className="w-20 h-20 rounded-3xl bg-bg-secondary border border-border-color flex items-center justify-center mb-10 group-hover:bg-accent group-hover:text-white transition-all duration-500 text-accent shadow-xl">
                                    <Eye className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-black mb-6 text-text-primary uppercase tracking-tighter group-hover:text-accent transition-colors">{t("about_pages.nexit_land.vision_title")}</h3>
                                <p className="text-text-secondary text-base leading-relaxed font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                                    {t("about_pages.nexit_land.vision_content")}
                                </p>
                            </Card>
                        </motion.div>

                        {/* Mission Card - HIGHLIGHTED */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="z-20 transform md:scale-110"
                        >
                            <div className="h-full bg-accent p-10 md:p-14 rounded-[30px] shadow-none dark:shadow-3xl flex flex-col items-center text-center border border-white/15 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                <div className="w-20 h-20 rounded-3xl bg-foreground/10 flex items-center justify-center mb-10 border border-white/20 backdrop-blur-md shadow-2xl">
                                    <Rocket className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-3xl font-black mb-6 text-white uppercase tracking-tighter">{t("about_pages.nexit_land.mission_title")}</h3>
                                <p className="text-white text-base leading-relaxed font-black opacity-90">
                                    {t("about_pages.nexit_land.mission_content")}
                                </p>
                                <div className="mt-auto pt-10">
                                    <div className="flex gap-2">
                                        {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/35" />)}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Values Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="h-full p-10 md:p-14 border-border-color hover:border-accent/40 transition-all duration-500 flex flex-col items-center text-center group bg-bg-primary/50 backdrop-blur-xl shadow-none dark:shadow-2xl">
                                <div className="w-20 h-20 rounded-3xl bg-bg-secondary border border-border-color flex items-center justify-center mb-10 group-hover:bg-accent group-hover:text-white transition-all duration-500 text-accent shadow-xl">
                                    <Heart className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-black mb-8 text-text-primary uppercase tracking-tighter group-hover:text-accent transition-colors">
                                    {lang === 'ar' ? 'قيمنا الجوهرية' : 'Our Core Values'}
                                </h3>
                                <div className="grid grid-cols-2 gap-3 w-full">
                                    {Object.values(t("about_pages.nexit_land.values") as any).map((val: any, i) => (
                                        <span key={i} className="text-xs text-text-primary font-black bg-bg-secondary/50 p-3 rounded-xl border border-border-color group-hover:bg-accent group-hover:text-white group-hover:border-accent/20 transition-all duration-500 shadow-sm backdrop-blur-sm">
                                            {val}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </PageSection>

            {/* FAQ Section */}
            <PageSection className="bg-bg-secondary/20 border-y border-border-color py-40">
                <div className="grid lg:grid-cols-2 gap-24 lg:gap-40 items-start">
                    <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest mb-6 border border-accent/20">
                            {lang === 'ar' ? 'مساندة العملاء' : 'Client Support'}
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black mb-10 text-text-primary tracking-tighter leading-tight">
                            {t("about_pages.nexit_land.faq.title")}
                        </h2>
                        <p className="text-text-secondary text-lg md:text-xl max-w-lg leading-relaxed mb-16 font-medium opacity-80">
                            {lang === "ar"
                                ? "إليك بعض الأسئلة الشائعة التي قد تراودك حول منظومتنا التقنية وكيفية العمل معنا."
                                : "Frequently asked questions for us by our clients and partners regarding Nexit Land ecosystem."}
                        </p>

                        <div className="flex items-center gap-6 p-8 rounded-3xl bg-bg-primary border border-border-color group/cta max-w-md shadow-none dark:shadow-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover/cta:bg-accent/10 transition-colors pointer-events-none" />
                            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover/cta:bg-accent group-hover/cta:text-white transition-all duration-500 shadow-inner">
                                <Users className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-text-primary text-lg font-black mb-1 tracking-tight">
                                    {lang === 'ar' ? 'لم تجد إجابتك؟' : 'Still need help?'}
                                </h4>
                                <p className="text-text-secondary text-sm font-medium opacity-70">
                                    {lang === 'ar'
                                        ? 'فريقنا متاح دائماً للمساعدة'
                                        : 'Our team is ready to help you now.'}
                                </p>
                            </div>
                            <Link href="/contact" className="p-3 rounded-xl bg-bg-secondary border border-border-color text-accent hover:bg-accent hover:text-white transition-all shadow-sm">
                                <ArrowUpRight className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>

                    <div className="w-full space-y-6">
                        <Accordion type="single" collapsible className="space-y-6">
                            {[1, 2, 3].map((num) => (
                                <AccordionItem
                                    key={num}
                                    value={`item-${num}`}
                                    className="border border-border-color bg-bg-primary rounded-[30px] px-8 py-4 overflow-hidden hover:border-accent/40 transition-all duration-500 data-[state=open]:border-accent/40 shadow-none dark:shadow-2xl relative"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent/2 rounded-full blur-2xl pointer-events-none" />
                                    <AccordionTrigger className={`text-lg md:text-2xl font-black text-text-primary hover:no-underline py-8 ${lang === 'ar' ? 'text-right' : 'text-left'} hover:text-accent transition-colors tracking-tight`}>
                                        {t(`about_pages.nexit_land.faq.q${num}`)}
                                    </AccordionTrigger>
                                    <AccordionContent className={`text-text-secondary text-base md:text-lg leading-relaxed pb-10 pt-4 border-t border-border-color/30 mt-4 ${lang === 'ar' ? 'text-right' : 'text-left'} font-medium opacity-80`}>
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
