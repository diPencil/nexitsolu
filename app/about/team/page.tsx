"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { NexBotAI } from "@/components/nexbot-ai"
import { Wrench, ArrowRight, Star, Heart, Lightbulb } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function Team() {
    const { lang, t } = useLanguage()

    const departments = [
        { key: "dev", image: "/Development-&-Programming-Team.jpg" },
        { key: "infra", image: "/Infrastructure-Engineers.jpg" },
        { key: "design", image: "/Creatives-&-Designers.jpg" },
        { key: "support", image: "/Support-&-Success-Ambassadors.jpg" },
    ]

    const cultureTags = [
        { label: t("about_pages.team.culture_tags.creative"), icon: Lightbulb },
        { label: t("about_pages.team.culture_tags.passion"), icon: Star },
        { label: t("about_pages.team.culture_tags.spirit"), icon: Heart },
    ]

    const coreValues = [
        { 
            title: t("about_pages.team.values.innovation.title"), 
            desc: t("about_pages.team.values.innovation.desc"), 
            icon: Lightbulb 
        },
        { 
            title: t("about_pages.team.values.quality.title"), 
            desc: t("about_pages.team.values.quality.desc"), 
            icon: Star 
        },
        { 
            title: t("about_pages.team.values.collaboration.title"), 
            desc: t("about_pages.team.values.collaboration.desc"), 
            icon: Heart 
        },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-bg-primary min-h-screen text-text-primary">
            <PageHero
                title={t("about_pages.team.hero_title")}
                subtitle={t("about_pages.team.hero_subtitle")}
            />

            {/* Culture Section */}
            <PageSection title={t("about_pages.team.culture_title")} columns={2} className="py-40">
                <div className="flex flex-col justify-center pe-0 lg:pe-20 space-y-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute top-0 left-0 bottom-0 w-2 bg-accent rounded-full opacity-30 hidden md:block" />
                        <p className="text-2xl md:text-3xl text-text-primary leading-relaxed md:ps-12 py-4 font-black tracking-tight italic opacity-95">
                            &quot;{t("about_pages.team.culture_content")}&quot;
                        </p>
                    </motion.div>
                    
                    <div className="flex flex-wrap gap-4 md:ps-12">
                         {cultureTags.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-bg-secondary border border-border-color shadow-xl hover:border-accent/40 transition-colors">
                                <item.icon className="w-5 h-5 text-accent" />
                                <span className="font-black text-sm uppercase tracking-widest opacity-80">{item.label}</span>
                            </div>
                         ))}
                    </div>
                </div>
                <div className="relative aspect-video lg:aspect-auto h-full min-h-[500px] rounded-[50px] overflow-hidden border border-border-color shadow-3xl group">
                    <Image
                        src="/expert-team.png"
                        alt="Team Culture"
                        fill
                        className="object-cover grayscale hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-bg-primary/60 via-transparent to-transparent pointer-events-none" />
                </div>
            </PageSection>

            {/* Departments Grid */}
            <PageSection className="bg-bg-secondary/20 border-y border-border-color py-40">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {departments.map((dept, i) => (
                        <motion.div
                            key={dept.key}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="group relative h-[600px] rounded-[40px] overflow-hidden border-border-color bg-bg-secondary shadow-2xl cursor-pointer">
                                <Image
                                    src={dept.image}
                                    alt={dept.key}
                                    fill
                                    className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-bg-primary via-bg-primary/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-700" />

                                {/* Decorative Top Line */}
                                <div className="absolute top-0 left-12 right-12 h-1.5 bg-accent opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-full shadow-[0_0_15px_rgba(0,102,255,0.8)]" />

                                <div className="absolute bottom-12 left-12 right-12 flex flex-col items-center text-center">
                                    <h3 className="text-2xl md:text-3xl font-black text-text-primary mb-6 group-hover:-translate-y-2 transition-transform duration-500 tracking-tighter">
                                        {(t("about_pages.team.departments") as any)[dept.key]}
                                    </h3>
                                    <div className="w-16 h-1.5 bg-accent rounded-full group-hover:w-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,102,255,0.4)]" />
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Core Values Section */}
            <PageSection title={t("about_pages.team.values_title")} className="py-40">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {coreValues.map((val, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="p-14 md:p-20 border-border-color hover:border-accent/40 bg-bg-secondary/30 transition-all duration-500 text-center group h-full shadow-3xl backdrop-blur-sm relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors pointer-events-none" />
                                <div className="w-20 h-20 rounded-3xl bg-bg-primary flex items-center justify-center mx-auto mb-10 group-hover:bg-accent group-hover:text-white transition-all duration-500 border border-border-color shadow-xl">
                                    <val.icon className="w-10 h-10 text-accent group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-3xl font-black text-text-primary mb-6 group-hover:text-accent transition-colors tracking-tighter uppercase">{val.title}</h3>
                                <p className="text-text-secondary leading-relaxed text-lg font-medium opacity-80 group-hover:opacity-100 transition-opacity">{val.desc}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Support CTA Section */}
            <section className="py-40 bg-bg-secondary/20 border-t border-border-color text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,102,255,0.08),transparent_70%)] pointer-events-none" />
                <div className="absolute inset-0 bg-accent/3 blur-[140px] pointer-events-none" />

                <div className="max-w-4xl mx-auto px-10 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-24 h-24 rounded-3xl bg-accent/10 flex items-center justify-center mx-auto mb-12 border border-accent/20 shadow-2xl group transition-all duration-700"
                    >
                        <Wrench className="w-12 h-12 text-accent" />
                    </motion.div>
                    <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter text-text-primary leading-tight">
                        {t("about_pages.team.cta_title")}
                    </h2>
                    <p className="text-text-secondary text-xl md:text-2xl mb-16 leading-relaxed max-w-3xl mx-auto font-medium opacity-80">
                        {t("about_pages.team.cta_subtitle")}
                    </p>
                    <Link
                        href="/about/tech-support"
                        className="inline-flex items-center gap-6 px-14 py-6 bg-accent hover:bg-accent/90 text-white rounded-4xl font-black transition-all hover:scale-105 shadow-3xl shadow-accent/20 group uppercase tracking-widest text-sm"
                    >
                        {t("about_pages.team.cta_button")}
                        <ArrowRight className={`w-6 h-6 transition-transform group-hover:translate-x-3 ${lang === "ar" ? "rotate-180 group-hover:-translate-x-3" : ""}`} />
                    </Link>
                </div>
            </section>

            <NexBotAI />
        </main>
    )
}
