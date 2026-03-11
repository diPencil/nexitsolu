"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { NexBotAI } from "@/components/nexbot-ai"
import { Wrench, ArrowRight } from "lucide-react"

export default function Team() {
    const { lang, t } = useLanguage()

    const departments = [
        { key: "dev", image: "/Development-&-Programming-Team.jpg" },
        { key: "infra", image: "/Infrastructure-Engineers.jpg" },
        { key: "design", image: "/Creatives-&-Designers.jpg" },
        { key: "support", image: "/Support-&-Success-Ambassadors.jpg" },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen">
            <PageHero
                title={t("about_pages.team.hero_title")}
                subtitle={t("about_pages.team.hero_subtitle")}
            />

            {/* Culture Section */}
            <PageSection title={t("about_pages.team.culture_title")} columns={2}>
                <div className="flex flex-col justify-center">
                    <p className="text-xl text-zinc-400 leading-relaxed italic border-l-4 border-[#0066FF] ps-6 py-4">
                        {t("about_pages.team.culture_content")}
                    </p>
                </div>
                <div className="relative aspect-video rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                    <Image
                        src="/expert-team.png"
                        alt="Team Culture"
                        fill
                        className="object-cover"
                    />
                </div>
            </PageSection>

            {/* Departments Grid */}
            <PageSection>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {departments.map((dept, i) => (
                        <motion.div
                            key={dept.key}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group relative h-[450px] rounded-4xl overflow-hidden border border-white/5 bg-zinc-900 shadow-2xl cursor-pointer"
                        >
                            <Image
                                src={dept.image}
                                alt={dept.key}
                                fill
                                className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                            {/* Decorative Top Line */}
                            <div className="absolute top-0 left-8 right-8 h-1 bg-linear-to-r from-transparent via-[#0066FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="absolute bottom-8 left-8 right-8 flex flex-col items-center text-center">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:-translate-y-2 transition-transform duration-500">
                                    {(t("about_pages.team.departments") as any)[dept.key]}
                                </h3>
                                <div className="w-12 h-1 bg-[#0066FF] rounded-full group-hover:w-full transition-all duration-700" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Core Values Section */}
            <PageSection title={lang === "ar" ? "قيمنا الأساسية" : "Our Core Values"} className="bg-white/3 border-y border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: lang === "ar" ? "الابتكار" : "Innovation", desc: lang === "ar" ? "نبحث دائماً عن حلول غير تقليدية لتحديات معقدة." : "Always looking for unconventional solutions to complex challenges." },
                        { title: lang === "ar" ? "الجودة" : "Quality", desc: lang === "ar" ? "لا نتنازل أبداً عن أعلى معايير الجودة في كل مشاريعنا." : "Never compromising on the highest quality standards in all projects." },
                        { title: lang === "ar" ? "التعاون" : "Collaboration", desc: lang === "ar" ? "نؤمن بأن العمل الجماعي هو مفتاح النجاح المبهر." : "Believing that teamwork is the key to stunning success." },
                    ].map((val, i) => (
                        <div key={i} className="p-10 rounded-4xl bg-[#080808] border border-white/5 hover:border-[#0066FF]/50 transition-all duration-500 text-center group">
                            <h3 className="text-2xl font-bold text-[#0066FF] mb-4 group-hover:scale-110 transition-transform duration-500">{val.title}</h3>
                            <p className="text-zinc-400 leading-relaxed text-lg">{val.desc}</p>
                        </div>
                    ))}
                </div>
            </PageSection>

            {/* Support CTA Section */}
            <section className="py-32 bg-linear-to-b from-[#050505] to-[#0A0A0A] border-t border-white/5 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,102,255,0.05),transparent_70%)] pointer-events-none" />

                <div className="max-w-3xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="w-20 h-20 rounded-3xl bg-[#0066FF]/10 flex items-center justify-center mx-auto mb-8 border border-[#0066FF]/20"
                    >
                        <Wrench className="w-10 h-10 text-[#0066FF]" />
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">
                        {lang === "ar" ? "تواجه تحديات تقنية؟" : "Facing Tech Challenges?"}
                    </h2>
                    <p className="text-zinc-400 text-lg md:text-xl mb-12 leading-relaxed">
                        {lang === "ar"
                            ? "فريقنا المتخصص جاهز لتقديم الدعم الفني الفوري والحلول المبتكرة لضمان استمرارية أعمالك ونموها."
                            : "Our specialist team is ready to provide immediate technical support and innovative solutions to ensure your business continuity and growth."}
                    </p>
                    <Link
                        href="/about/tech-support"
                        className="inline-flex items-center gap-3 px-12 py-5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-2xl font-black transition-all hover:scale-105 shadow-xl shadow-[#0066FF]/25 group"
                    >
                        {lang === "ar" ? "اطلب الدعم الفني الآن" : "Request Tech Support Now"}
                        <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-2 ${lang === "ar" ? "rotate-180 group-hover:-translate-x-2" : ""}`} />
                    </Link>
                </div>
            </section>

            <NexBotAI />
        </main>
    )
}
