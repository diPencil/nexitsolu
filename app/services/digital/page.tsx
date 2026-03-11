"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Paintbrush, Video, Play, Camera, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function DigitalServices() {
    const { lang, t } = useLanguage()

    const services = [
        {
            key: "graphic_design",
            icon: Paintbrush,
            image: "/services/digital/Graphic-Design---Visual-Identity.jpg",
            desc_ar: "نبتكر هوية بصرية فريدة تعبر عن قيم علامتك التجارية وتصنع انطباعاً لا ينسى لدى جمهورك.",
            desc_en: "We create a unique visual identity that expresses your brand values and creates an unforgettable impression on your audience."
        },
        {
            key: "social_media",
            icon: Camera,
            image: "/services/digital/Social-Media-Managment.jpg",
            desc_ar: "ندير تواجدك على منصات التواصل الاجتماعي باحترافية، من بناء الاستراتيجية إلى التفاعل مع الجمهور.",
            desc_en: "We professionally manage your presence on social media platforms, from strategy building to audience engagement."
        },
        {
            key: "ux_ui",
            icon: Paintbrush,
            image: "/services/digital/UXUI-Design-Pilot.jpg",
            desc_ar: "نصمم واجهات مستخدم سلسة تركز على سهولة الاستخدام وتوفر تجربة رقمية استثنائية.",
            desc_en: "We design smooth user interfaces focused on ease of use, providing an exceptional digital experience."
        },
        {
            key: "video",
            icon: Video,
            image: "/services/digital/Professional-Video-Production.jpg",
            desc_ar: "إنتاج فيديوهات احترافية تروي قصة نجاحك وتصل برسالتك إلى جمهورك المستهدف بأعلى جودة.",
            desc_en: "Professional video production that tells your success story and reaches your target audience with the highest quality."
        },
        {
            key: "motion",
            icon: Play,
            image: "/services/digital/3D-Motion-Graphics-&-Animation.jpg",
            desc_ar: "نحول الأفكار المعقدة إلى مرئيات متحركة جذابة وسهلة الفهم باستخدام تقنيات 3D المتقدمة.",
            desc_en: "We transform complex ideas into attractive and easy-to-understand motion graphics using advanced 3D techniques."
        },
        {
            key: "marketing",
            icon: Camera,
            image: "/services/digital/Digital-Marketing-Strategy.jpg",
            desc_ar: "نخطط وننفذ استراتيجيات تسويقية شاملة تضمن نمو علامتك التجارية وزيادة معدلات التحويل.",
            desc_en: "We plan and execute comprehensive marketing strategies that ensure your brand growth and increase conversion rates."
        },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen">
            <PageHero
                title={t("services_pages.digital.hero_title")}
                subtitle={t("services_pages.digital.hero_subtitle")}
            />

            <PageSection>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, i) => (
                        <motion.div
                            key={service.key}
                            whileHover={{ y: -10 }}
                            className="relative group pt-6 md:pt-10 cursor-pointer"
                        >
                            <Link
                                href={`/services/digital/${service.key.replace(/_/g, '-')}`}
                                className="absolute inset-0 z-30"
                                aria-label={`View ${service.key}`}
                            />

                            {/* Layered Cards Effect behind */}
                            <div className="absolute top-2 left-3 right-3 h-10 md:top-4 md:left-6 md:right-6 md:h-20 bg-white/5 rounded-2xl md:rounded-4xl -z-10" />
                            <div className="absolute top-4 left-2 right-2 h-10 md:top-7 md:left-4 md:right-4 md:h-20 bg-white/10 rounded-2xl md:rounded-4xl -z-10 transition-all duration-300 group-hover:bg-[#0066FF]/20" />

                            {/* Main Card */}
                            <div className={`relative rounded-2xl md:rounded-3xl overflow-hidden bg-[#111111] border border-white/10 shadow-2xl transition-all duration-500 h-full flex flex-col group-hover:border-[#0066FF]/50 p-3 md:p-6`}>
                                <div className="border-b border-white/10 flex flex-col items-start gap-4 pb-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] group-hover:bg-[#0066FF] group-hover:text-white transition-colors duration-500">
                                        <service.icon className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <h3 className="text-sm md:text-xl font-medium text-white tracking-tight leading-snug group-hover:text-[#0066FF] transition-colors duration-300 min-h-[48px] md:min-h-0">
                                        {(t("services_pages.digital") as any)[service.key]}
                                    </h3>
                                </div>

                                <div className="relative pt-4 grow flex flex-col justify-between gap-4">
                                    <p className="text-zinc-500 text-xs md:text-sm leading-relaxed mb-4 line-clamp-3">
                                        {lang === "ar" ? service.desc_ar : service.desc_en}
                                    </p>

                                    <div className="relative aspect-video w-full rounded-xl md:rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-inner group/img">
                                        <Image
                                            src={service.image}
                                            alt={service.key}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60 group-hover:opacity-100"
                                        />

                                        {/* Floating Button */}
                                        <div className={`absolute bottom-3 md:bottom-5 ${lang === "ar" ? "left-3 md:left-5" : "right-3 md:right-5"} p-2 md:p-3 rounded-full z-30 shadow-2xl transition-all duration-500 bg-white/10 text-white backdrop-blur-xl border border-white/10 group-hover:bg-white group-hover:text-black`}>
                                            <ArrowUpRight className={`w-3 h-3 md:w-4 md:h-4 ${lang === "ar" ? "-scale-x-100" : ""}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Creative Banner */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#0066FF]/10 blur-[120px] -z-10" />
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-5xl md:text-8xl font-black text-white/5 uppercase tracking-tighter mb-12 select-none">CREATIVE ENGINE</h2>
                    <p className="text-2xl md:text-4xl font-medium text-white max-w-4xl mx-auto leading-tight italic">
                        {lang === "ar" ? "رؤية فنية، تنفيذ احترافي، نتائج مذهلة." : "Artistic vision, professional execution, stunning results."}
                    </p>
                </div>
            </section>

            <NexBotAI />
        </main>
    )
}
