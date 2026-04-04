"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Paintbrush, Video, Play, Camera, ArrowUpRight, Zap, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export default function DigitalServices() {
    const { lang, t } = useLanguage()

    const services = [
        { key: "graphic_design", icon: Paintbrush, image: "/services/digital/Graphic-Design---Visual-Identity.jpg" },
        { key: "social_media", icon: Camera, image: "/services/digital/Social-Media-Managment.jpg" },
        { key: "ux_ui", icon: Paintbrush, image: "/services/digital/UXUI-Design-Pilot.jpg" },
        { key: "video", icon: Video, image: "/services/digital/Professional-Video-Production.jpg" },
        { key: "motion", icon: Play, image: "/services/digital/3D-Motion-Graphics-&-Animation.jpg" },
        { key: "marketing", icon: Camera, image: "/services/digital/Digital-Marketing-Strategy.jpg" },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-bg-primary min-h-screen text-text-primary overflow-hidden">
            <PageHero
                title={t("services_pages.digital.hero_title")}
                subtitle={t("services_pages.digital.hero_subtitle")}
            />

            {/* Digital Media Grid */}
            <PageSection className="pb-32!">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {services.map((service, i) => (
                        <motion.div
                            key={service.key}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link href={`/services/digital/${service.key.replace(/_/g, '-')}`} className="block h-full group">
                                <Card className="h-full p-0 overflow-hidden border-border-color hover:border-accent/40 bg-bg-secondary/20 transition-all duration-700 flex flex-col shadow-2xl hover:shadow-4xl relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="p-10 md:p-12 flex flex-col grow">
                                        <div className="w-16 h-16 rounded-[1.25rem] bg-bg-primary border border-border-color flex items-center justify-center text-accent mb-10 group-hover:bg-accent group-hover:text-white transition-all duration-700 shadow-xl group-hover:scale-110">
                                            <service.icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-black text-text-primary mb-6 group-hover:text-accent transition-colors tracking-tighter leading-tight uppercase">
                                            {t(`services_pages.digital.${service.key}`)}
                                        </h3>
                                        <p className="text-text-secondary text-lg leading-relaxed grow mb-12 max-w-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                                            {t(`services_pages.digital.${service.key}_desc`)}
                                        </p>

                                        <div className="relative aspect-16/10 w-full rounded-[2.5rem] overflow-hidden border border-border-color bg-bg-primary shadow-2xl group-hover:border-accent/40 transition-all duration-700">
                                            <Image
                                                src={service.image}
                                                alt={service.key}
                                                fill
                                                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-bg-primary/60 via-bg-primary/20 to-transparent pointer-events-none" />
                                            
                                            <div className="absolute bottom-6 right-6 p-4 rounded-2xl bg-accent text-white shadow-3xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                                                <ArrowUpRight className="w-6 h-6" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Creative Banner */}
            <section className="py-40! relative overflow-hidden bg-bg-secondary/30 border-y border-border-color text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,102,255,0.08),transparent_70%)] pointer-events-none" />
                <div className="absolute inset-0 bg-accent/3 blur-[140px] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-24 h-24 rounded-3xl bg-accent/10 flex items-center justify-center mx-auto mb-12 border border-accent/20 shadow-2xl group transition-all duration-700"
                    >
                        <Sparkles className="w-12 h-12 text-accent" />
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 0.1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-6xl md:text-9xl font-black text-text-primary uppercase tracking-tighter mb-16 select-none opacity-5 leading-none transition-opacity duration-1000"
                    >
                        {t("services_pages.digital.impact.title")}
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-black text-text-primary max-w-5xl mx-auto leading-tight tracking-tight mb-16"
                    >
                        &quot;{t("services_pages.digital.impact.subtitle")}&quot;
                    </motion.p>
                    <div className="w-32 h-2 bg-accent mx-auto rounded-full shadow-[0_0_20px_rgba(0,102,255,0.4)]" />
                </div>
            </section>

            <NexBotAI />
        </main>
    )
}
