"use client"

import { useLanguage } from "@/lib/i18n-context"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Zap,
    Clock,
    Share2,
    BookOpen,
    ArrowRight,
    Building2,
    BarChart3
} from "lucide-react"
import { CaseStudyContent } from "../case-studies-data"
import { NexBotAI } from "@/components/nexbot-ai"

interface CaseStudyClientProps {
    caseStudy: CaseStudyContent;
    relatedCaseStudies: CaseStudyContent[];
}

export default function CaseStudyClient({ caseStudy, relatedCaseStudies }: CaseStudyClientProps) {
    const { lang } = useLanguage()
    const isAr = lang === "ar"

    return (
        <main dir={isAr ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen text-white">
            {/* Case Study Hero */}
            <div className="pt-24 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Featured Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: isAr ? -20 : 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-video rounded-4xl overflow-hidden border border-white/10 shadow-2xl order-2"
                        >
                            <Image
                                src={caseStudy.image}
                                alt={isAr ? caseStudy.title_ar : caseStudy.title_en}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-[#050505]/40 via-transparent to-transparent" />
                        </motion.div>

                        {/* Text Content */}
                        <div className="space-y-8 order-1">
                            {/* Breadcrumbs */}
                            <div className="flex items-center gap-2 text-zinc-500 text-sm">
                                <Link href="/" className="hover:text-[#0066FF] transition-colors">{isAr ? "الرئيسية" : "Home"}</Link>
                                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                <Link href="/resources/case-studies" className="hover:text-[#0066FF] transition-colors">{isAr ? "دراسات الحالة" : "Case Studies"}</Link>
                                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                <span className="text-zinc-300 truncate max-w-[150px]">{isAr ? caseStudy.title_ar : caseStudy.title_en}</span>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <span className="px-4 py-1.5 rounded-full bg-[#0066FF]/10 text-[#0066FF] text-xs font-black uppercase tracking-widest border border-[#0066FF]/20 w-fit block">
                                    {caseStudy.cat}
                                </span>
                                <h1 className="text-3xl md:text-4xl xl:text-5xl font-black leading-[1.2]">
                                    {isAr ? caseStudy.title_ar : caseStudy.title_en}
                                </h1>

                                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center">
                                            <img src={caseStudy.logo} alt={caseStudy.partner} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-zinc-500 uppercase font-black">{isAr ? "الشريك" : "Partner"}</span>
                                            <span className="text-sm font-bold">{caseStudy.partner}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-zinc-500 text-sm">
                                        <div className="flex items-center gap-2">
                                            <BarChart3 className="w-4 h-4 text-[#0066FF]" />
                                            <span className="text-white font-bold">{caseStudy.results}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {caseStudy.date}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <section className="pb-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                        {/* Sidebar */}
                        <div className="lg:col-span-4 order-2 lg:order-1">
                            <div className="sticky top-32 space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="p-8 rounded-4xl bg-[#0A0A0A] border border-white/5 space-y-6 shadow-2xl relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#0066FF]/5 rounded-full blur-3xl group-hover:bg-[#0066FF]/10 transition-colors" />
                                    <h4 className="text-xl font-bold flex items-center gap-3 relative">
                                        <div className="w-8 h-8 rounded-lg bg-[#0066FF]/20 flex items-center justify-center">
                                            <Zap className="w-4 h-4 text-[#0066FF]" />
                                        </div>
                                        {isAr ? "النتائج المحققة" : "Key Outcomes"}
                                    </h4>
                                    <ul className="space-y-5 relative">
                                        {(isAr ? caseStudy.highlights_ar : caseStudy.highlights_en).map((h, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-zinc-400 group/item">
                                                <div className="mt-1 w-5 h-5 rounded-full border border-[#0066FF]/30 flex items-center justify-center shrink-0 group-hover/item:border-[#0066FF] transition-colors">
                                                    <CheckCircle2 className="w-3 h-3 text-[#0066FF]" />
                                                </div>
                                                <span className="group-hover/item:text-zinc-200 transition-colors">{h}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="p-8 rounded-4xl bg-linear-to-br from-[#0066FF]/10 via-[#0A0A0A] to-[#0A0A0A] border border-[#0066FF]/20 space-y-6 relative overflow-hidden"
                                >
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#0066FF]/10 rounded-full blur-3xl" />
                                    <h4 className="text-xl font-bold relative">{isAr ? "تريد حلولاً مماثلة؟" : "Want Similar Solutions?"}</h4>
                                    <p className="text-zinc-400 text-sm leading-relaxed relative">
                                        {isAr ? "خبراؤنا جاهزون لتكرار هذا النجاح في شركتك وتقديم بنية تحتية مخصصة تلبي احتياجات نموك." : "Our experts are ready to replicate this success for your business with tailored infrastructure solutions."}
                                    </p>
                                    <Link href="/services/managed-it" className="relative flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#0066FF] text-white font-bold hover:bg-[#0052cc] transition-all shadow-lg shadow-[#0066FF]/25 overflow-hidden group/btn">
                                        <span className="relative z-10">{isAr ? "تواصل معنا اليوم" : "Request a Consultation"}</span>
                                        <ArrowRight className={`w-4 h-4 relative z-10 transition-transform group-hover/btn:translate-x-1 ${isAr ? "rotate-180 group-hover/btn:-translate-x-1" : ""}`} />
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                    </Link>
                                </motion.div>
                            </div>
                        </div>

                        {/* Article Text */}
                        <div className="lg:col-span-8 order-1 lg:order-2">
                            <div className="prose prose-invert prose-lg max-w-none">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="relative mb-16"
                                >
                                    <div className="absolute -left-6 lg:-left-12 top-0 bottom-0 w-1 bg-linear-to-b from-[#0066FF] to-transparent rounded-full" />
                                    <p className="text-2xl lg:text-3xl font-medium text-zinc-200 leading-relaxed italic ps-0">
                                        {isAr ? caseStudy.intro_ar : caseStudy.intro_en}
                                    </p>
                                </motion.div>

                                <div className="space-y-20">
                                    {caseStudy.content.map((sec, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            className="space-y-8 group"
                                        >
                                            <div className="space-y-4">
                                                <span className="text-[#0066FF] text-sm font-black uppercase tracking-widest">{isAr ? `الخطوة ${i + 1}` : `PHASE 0${i + 1}`}</span>
                                                <h2 className="text-3xl lg:text-4xl font-black text-white group-hover:text-[#0066FF] transition-colors leading-tight">
                                                    {isAr ? sec.heading_ar : sec.heading_en}
                                                </h2>
                                            </div>
                                            <p className="text-zinc-400 leading-[1.8] text-lg lg:text-xl font-light">
                                                {isAr ? sec.text_ar : sec.text_en}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Share & Footer */}
                            <div className="mt-24 pt-12 border-t border-white/5 flex flex-wrap items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <span className="text-zinc-500 font-black uppercase tracking-tighter text-xs">{isAr ? "شارك دراسة الحالة:" : "SHARE CASE STUDY:"}</span>
                                    <div className="flex gap-3">
                                        {[Share2, BookOpen].map((Icon, i) => (
                                            <button key={i} className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-[#0066FF] hover:border-[#0066FF] hover:-translate-y-1 transition-all group">
                                                <Icon className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <Link
                                    href="/resources/case-studies"
                                    className="flex items-center gap-3 text-[#0066FF] font-black hover:gap-5 transition-all group"
                                >
                                    <div className={`w-10 h-10 rounded-full border border-[#0066FF]/30 flex items-center justify-center group-hover:bg-[#0066FF] group-hover:border-[#0066FF] transition-all`}>
                                        {isAr ? <ChevronRight className="w-5 h-5 group-hover:text-white" /> : <ChevronLeft className="w-5 h-5 group-hover:text-white" />}
                                    </div>
                                    <span className="group-hover:translate-x-1 transition-transform">{isAr ? "استكشف جميع دراسات الحالة" : "EXPLORE ALL CASE STUDIES"}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Case Studies */}
            <section className="pb-32 px-6 border-t border-white/5 pt-32 bg-[#080808]/30">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-3xl md:text-4xl font-black">
                            {isAr ? "دراسات حالة " : "Related "}<span className="text-[#0066FF]">{isAr ? "أخرى" : "Success Stories"}</span>
                        </h3>
                        <Link href="/resources/case-studies" className="hidden md:flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                            {isAr ? "عرض الكل" : "View All"}
                            {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {relatedCaseStudies.map((rel, i) => (
                            <Link
                                key={i}
                                href={`/resources/case-studies/${rel.slug}`}
                                className="group flex flex-col rounded-4xl bg-[#0A0A0A] border border-white/5 hover:border-[#0066FF]/30 transition-all overflow-hidden shadow-2xl"
                            >
                                <div className="aspect-video relative overflow-hidden bg-[#080808] group/card">
                                    <Image
                                        src={rel.logo}
                                        alt={rel.partner}
                                        fill
                                        className="object-cover opacity-60 grayscale group-hover/card:grayscale-0 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-700"
                                    />
                                    <div className={`absolute top-4 ${isAr ? "right-4" : "left-4"}`}>
                                        <span className="px-3 py-1 bg-[#0066FF] rounded-full text-[9px] font-black text-white uppercase tracking-widest shadow-lg">
                                            {rel.cat}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 space-y-4">
                                    <h4 className="text-2xl font-black text-white group-hover:text-[#0066FF] transition-colors truncate">
                                        {rel.partner}
                                    </h4>
                                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
                                        <span className="text-[#0066FF] font-bold mr-1 rtl:ml-1">
                                            {isAr ? "دراسة حالة:" : "Case Study:"}
                                        </span>
                                        {isAr ? rel.title_ar : rel.title_en}
                                    </p>
                                    <div className="flex items-center gap-2 text-zinc-500 text-xs pt-4 border-t border-white/5">
                                        <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-2 ${isAr ? "rotate-180 group-hover:-translate-x-2" : ""}`} />
                                        {isAr ? "عرض التفاصيل" : "View Details"}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <NexBotAI />
        </main>
    )
}
