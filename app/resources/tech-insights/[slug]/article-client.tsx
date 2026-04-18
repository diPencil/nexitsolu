"use client"

import { useLanguage } from "@/lib/i18n-context"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
    Calendar,
    User,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Zap,
    Clock,
    Share2,
    BookOpen,
    ArrowRight
} from "lucide-react"
import { ArticleContent } from "../articles-data"
import { NexBotAI } from "@/components/nexbot-ai"

interface ArticleClientProps {
    article: ArticleContent;
    relatedArticles: ArticleContent[];
}

export default function ArticleClient({ article, relatedArticles }: ArticleClientProps) {
    const { lang } = useLanguage()
    const isAr = lang === "ar"

    return (
        <main dir={isAr ? "rtl" : "ltr"} className="bg-background min-h-screen text-foreground">
            {/* Article Hero */}
            <div className="pt-24 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Featured Image - Order 2 on Mobile, 2 on Desktop (Side by side) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: isAr ? -20 : 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-video rounded-4xl overflow-hidden border border-border shadow-2xl order-2"
                        >
                            <Image
                                src={article.image}
                                alt={isAr ? article.title_ar : article.title_en}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-background/40 via-transparent to-transparent" />
                        </motion.div>

                        {/* Text Content - Order 1 on Mobile, 1 on Desktop */}
                        <div className="space-y-8 order-1">
                            {/* Breadcrumbs */}
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Link href="/" className="hover:text-[#0066FF] transition-colors">{isAr ? "الرئيسية" : "Home"}</Link>
                                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                <Link href="/resources/tech-insights" className="hover:text-[#0066FF] transition-colors">{isAr ? "الرؤى التقنية" : "Tech Insights"}</Link>
                                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                <span className="text-foreground/60 truncate max-w-[150px]">{isAr ? article.title_ar : article.title_en}</span>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <span className="px-4 py-1.5 rounded-full bg-[#0066FF]/10 text-[#0066FF] text-xs font-black uppercase tracking-widest border border-[#0066FF]/20 w-fit block">
                                    {article.cat}
                                </span>
                                <h1 className="text-3xl md:text-4xl xl:text-5xl font-black leading-[1.2]">
                                    {isAr ? article.title_ar : article.title_en}
                                </h1>

                                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                            <User className="w-5 h-5 text-muted-foreground/70" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-muted-foreground uppercase font-black">{isAr ? "بواسطة" : "Written by"}</span>
                                            <span className="text-sm font-bold">{article.author}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-muted-foreground text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {article.date}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {article.readTime}
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
                                    className="p-8 rounded-4xl bg-card border border-border space-y-6 shadow-2xl relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#0066FF]/5 rounded-full blur-3xl group-hover:bg-[#0066FF]/10 transition-colors" />
                                    <h4 className="text-xl font-bold flex items-center gap-3 relative">
                                        <div className="w-8 h-8 rounded-lg bg-[#0066FF]/20 flex items-center justify-center">
                                            <Zap className="w-4 h-4 text-[#0066FF]" />
                                        </div>
                                        {isAr ? "النقاط الرئيسية" : "Key Takeaways"}
                                    </h4>
                                    <ul className="space-y-5 relative">
                                        {(isAr ? article.highlights_ar : article.highlights_en).map((h, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground/80 group/item">
                                                <div className="mt-1 w-5 h-5 rounded-full border border-[#0066FF]/30 flex items-center justify-center shrink-0 group-hover/item:border-[#0066FF] transition-colors">
                                                    <CheckCircle2 className="w-3 h-3 text-[#0066FF]" />
                                                </div>
                                                <span className="group-hover/item:text-foreground transition-colors">{h}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="p-8 rounded-4xl bg-linear-to-br from-[#0066FF]/10 via-card to-card border border-[#0066FF]/20 space-y-6 relative overflow-hidden"
                                >
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#0066FF]/10 rounded-full blur-3xl" />
                                    <h4 className="text-xl font-bold relative">{isAr ? "تحتاج مساعدة تقنية؟" : "Need Expert Advice?"}</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed relative">
                                        {isAr ? "خبراؤنا جاهزون لمساعدتك في تأمين وتطوير بنيتك التحتية بأحدث التقنيات وتقديم حلول مخصصة لأعمالك." : "Our experts are ready to help you secure and evolve your infrastructure with the latest technologies and custom solutions."}
                                    </p>
                                    <Link href="/contact" className="relative flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-[#0052cc] transition-all shadow-lg shadow-[#0066FF]/25 overflow-hidden group/btn">
                                        <span className="relative z-10">{isAr ? "تواصل معنا اليوم" : "Contact Us Today"}</span>
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
                                    <p className="text-2xl lg:text-3xl font-medium text-foreground/80 leading-relaxed italic ps-0">
                                        {isAr ? article.intro_ar : article.intro_en}
                                    </p>
                                </motion.div>

                                <div className="space-y-20">
                                    {article.content.map((sec, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            className="space-y-8 group"
                                        >
                                            <div className="space-y-4">
                                                <span className="text-[#0066FF] text-sm font-black uppercase tracking-widest">{isAr ? `القسم ${i + 1}` : `SECTION 0${i + 1}`}</span>
                                                <h2 className="text-3xl lg:text-4xl font-black text-foreground group-hover:text-primary transition-colors leading-tight">
                                                    {isAr ? sec.heading_ar : sec.heading_en}
                                                </h2>
                                            </div>
                                            <p className="text-muted-foreground/90 leading-[1.8] text-lg lg:text-xl font-light">
                                                {isAr ? sec.text_ar : sec.text_en}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Share & Footer */}
                            <div className="mt-24 pt-12 border-t border-border flex flex-wrap items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <span className="text-muted-foreground font-black uppercase tracking-tighter text-xs">{isAr ? "شارك المعرفة:" : "SHARE KNOWLEDGE:"}</span>
                                    <div className="flex gap-3">
                                        {[Share2, BookOpen].map((Icon, i) => (
                                            <button key={i} className="w-12 h-12 rounded-xl bg-white/5 border border-border flex items-center justify-center hover:bg-[#0066FF] hover:border-[#0066FF] hover:-translate-y-1 transition-all group">
                                                <Icon className="w-5 h-5 text-muted-foreground/70 group-hover:text-primary-foreground" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <Link
                                    href="/resources/tech-insights"
                                    className="flex items-center gap-3 text-[#0066FF] font-black hover:gap-5 transition-all group"
                                >
                                    <div className={`w-10 h-10 rounded-full border border-[#0066FF]/30 flex items-center justify-center group-hover:bg-[#0066FF] group-hover:border-[#0066FF] transition-all`}>
                                        {isAr ? <ChevronRight className="w-5 h-5 group-hover:text-primary-foreground" /> : <ChevronLeft className="w-5 h-5 group-hover:text-primary-foreground" />}
                                    </div>
                                    <span className="group-hover:translate-x-1 transition-transform">{isAr ? "استكشف المزيد من الرؤى" : "EXPLORE ALL INSIGHTS"}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Articles */}
            <section className="pb-32 px-6 border-t border-border pt-32 bg-card/30">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-3xl md:text-4xl font-black">
                            {isAr ? "مقالات " : "Related "}<span className="text-[#0066FF]">{isAr ? "ذات صلة" : "Insights"}</span>
                        </h3>
                        <Link href="/resources/tech-insights" className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                            {isAr ? "عرض الكل" : "View All"}
                            {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {relatedArticles.map((rel, i) => (
                            <Link
                                key={i}
                                href={`/resources/tech-insights/${rel.slug}`}
                                className="group flex flex-col rounded-4xl bg-card border border-border hover:border-[#0066FF]/30 transition-all overflow-hidden"
                            >
                                <div className="aspect-video relative overflow-hidden">
                                    <Image
                                        src={rel.image}
                                        alt={isAr ? rel.title_ar : rel.title_en}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                                    />
                                </div>
                                <div className="p-8 space-y-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0066FF]">{rel.cat}</span>
                                    <h4 className="text-xl font-bold leading-snug group-hover:text-[#0066FF] transition-colors line-clamp-2">
                                        {isAr ? rel.title_ar : rel.title_en}
                                    </h4>
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs pt-4 border-t border-border">
                                        <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-2 ${isAr ? "rotate-180" : ""}`} />
                                        {isAr ? "اقرأ المزيد" : "Read More"}
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
