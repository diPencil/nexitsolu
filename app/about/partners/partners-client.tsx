"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { CheckCircle2, ShieldCheck, Zap, Globe, Shield } from "lucide-react"

export default function Partners() {
    const { lang, t } = useLanguage()

    const partnerLogos = [
        { name: "Albkht Company", src: "/partners/Albkht-company.jpg" },
        { name: "Hainan Soliman", src: "/partners/Hainan-Soliman.jpg" },
        { name: "Vesper Group", src: "/partners/Vesper group.jpg" },
        { name: "Viva Egypt Travel", src: "/partners/Viva egypttravel.jpg" },
        { name: "Arkan", src: "/partners/arkan.jpg" },
        { name: "Onestaeg Hurghada", src: "/partners/onestaeg hurghada.jpg" },
        { name: "Pencil", src: "/partners/pencil.jpg" },
        { name: "Pioneer Construction", src: "/partners/pioneer construction.jpg" },
        { name: "Taxidia", src: "/partners/taxidia.jpg" },
        { name: "Withinsky", src: "/partners/withinsky.jpg" },
        { name: "Rivoli Suites", src: "/partners/rivoli-suites.jpg" },
        { name: "Rivoli Spa", src: "/partners/rivoli-spa.jpg" },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen">
            <PageHero
                title={t("about_pages.partners.hero_title")}
                subtitle={t("about_pages.partners.hero_subtitle")}
            />

            {/* Intro Section */}
            <PageSection>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <p className="text-xl md:text-3xl text-zinc-300 mb-8 leading-relaxed font-light">
                        {t("about_pages.partners.intro")}
                    </p>
                    <div className="w-24 h-1 bg-[#0066FF] mx-auto rounded-full" />
                </div>
            </PageSection>

            {/* Partner Grid - Logos Marquee */}
            <section className="py-24 bg-black border-y border-white/5 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-black to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-black to-transparent z-10 pointer-events-none" />

                <div className="flex gap-32 animate-marquee whitespace-nowrap items-center">
                    {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, i) => (
                        <div key={i} className="flex justify-center shrink-0">
                            <img
                                src={logo.src}
                                alt={logo.name}
                                className="h-24 md:h-32 w-auto object-contain opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default brightness-125"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Partner Section Enhancements */}
            <PageSection title={t("about_pages.partners.why_partner")}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(t("about_pages.partners.benefits") as any[]).map((benefit, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group relative p-8 md:p-10 rounded-4xl bg-[#080808] border border-white/5 hover:bg-[#111] hover:border-[#0066FF]/50 transition-all duration-500 overflow-hidden rtl:text-right ltr:text-left flex flex-col items-start"
                        >
                            {/* Glow Effect */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0066FF]/10 rounded-full blur-[50px] group-hover:bg-[#0066FF]/30 transition-colors" />

                            <div className="p-4 bg-[#0066FF]/10 text-[#0066FF] rounded-2xl w-fit mb-6 group-hover:bg-[#0066FF] group-hover:text-white transition-colors duration-500 relative z-20">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <span className="text-white text-xl md:text-2xl font-bold leading-relaxed relative z-20 group-hover:text-[#0066FF] transition-colors">{benefit}</span>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                    <div className="p-10 md:p-16 rounded-4xl bg-linear-to-br from-[#0066FF]/20 to-[#000000] border border-[#0066FF]/30 relative overflow-hidden group hover:border-[#0066FF] transition-all duration-700">
                        <Globe className="absolute -bottom-10 -right-10 w-64 h-64 text-[#0066FF]/10 group-hover:text-[#0066FF]/20 group-hover:scale-110 transition-all duration-700 pointer-events-none" />
                        <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white relative z-10">{lang === "ar" ? "معايير عالمية" : "Global Standards"}</h3>
                        <p className="text-zinc-300 text-lg md:text-xl leading-relaxed relative z-10">
                            {lang === "ar" ? "نحن نضمن توافق حلولنا مع المعايير الدولية للأمن والجودة بشكل تام لتلبية تطلعاتك بأعلى المقاييس." : "We ensure our solutions comply with international security and quality standards to meet your expectations at the highest levels."}
                        </p>
                        <div className="mt-8 relative z-10 w-16 h-1 bg-[#0066FF] rounded-full group-hover:w-32 transition-all duration-500" />
                    </div>
                    <div className="p-10 md:p-16 rounded-4xl bg-linear-to-br from-white/5 to-[#000000] border border-white/10 relative overflow-hidden group hover:border-white/30 transition-all duration-700">
                        <Zap className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 group-hover:scale-110 transition-all duration-700 pointer-events-none" />
                        <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white relative z-10">{lang === "ar" ? "تنفيذ سريع وفعال" : "Rapid Deployment"}</h3>
                        <p className="text-zinc-300 text-lg md:text-xl leading-relaxed relative z-10">
                            {lang === "ar" ? "بفضل شراكاتنا القوية، نوفر وصولاً سريعاً ومباشراً للموارد والتقنيات المطلوبة لتسريع نمو أعمالك وتحقيق أهدافك." : "Thanks to our strong partnerships, we provide rapid and direct access to required resources and technologies to accelerate your business growth."}
                        </p>
                        <div className="mt-8 relative z-10 w-16 h-1 bg-white/50 rounded-full group-hover:w-32 transition-all duration-500" />
                    </div>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
