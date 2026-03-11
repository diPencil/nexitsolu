"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Code2, Database, Layout, Smartphone, ShieldCheck, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SoftwareServices() {
    const { lang, t } = useLanguage()

    const systems = [
        {
            key: "erp",
            icon: Database,
            image: "/services/software/Enterprise-Resource-Planning-(ERP-Systems).jpg",
            desc_ar: "أنظمة متكاملة لربط كافة أقسام المؤسسة ببعضها، من الموارد البشرية إلى المبيعات، لضمان تدفق سلس للبيانات.",
            desc_en: "Integrated systems to connect all departments of the organization, from HR to sales, ensuring seamless data flow."
        },
        {
            key: "crm",
            icon: Layout,
            image: "/services/software/Customer-Relationship-Management-(CRM).jpg",
            desc_ar: "برمجيات مخصصة لإدارة تفاعلاتك مع العملاء الحاليين والمحتملين وبناء استراتيجيات تسويقية فعالة تدعم ولاء العملاء.",
            desc_en: "Custom software to manage interactions with current and potential customers and build effective marketing strategies."
        },
        {
            key: "automation",
            icon: Code2,
            image: "/services/software/Business-Process-Automation-(BPA).jpg",
            desc_ar: "نظمة مصممة للقضاء على المهام اليدوية المتكررة وزيادة دقة المعاملات الإدارية ورفع كفاءة فريق العمل.",
            desc_en: "A system designed to eliminate repetitive manual tasks, increase transaction accuracy, and boost team efficiency."
        },
        {
            key: "custom",
            icon: ShieldCheck,
            image: "/services/software/Custom-Application-&-Platform-Development.jpg",
            desc_ar: "تطوير برمجيات من الصفر لتناسب طريقة عمل مؤسستك الخاصة وتتوافق مع متطلباتك وميزانيتك.",
            desc_en: "Developing software from scratch to fit your organization's unique workflow, matching your specific requirements and budget."
        },
        {
            key: "hrm",
            icon: Smartphone,
            image: "/services/software/Human-Resource-Management-(HRM).jpg",
            desc_ar: "نظام متكامل لإدارة الموارد البشرية من التوظيف وإعداد الموظفين وحتى الرواتب وتقييم الأداء والامتثال، كل ذلك في منصة واحدة ذكية.",
            desc_en: "A comprehensive system to manage all HR operations—from recruitment and onboarding to payroll, performance reviews, and compliance—in one smart platform."
        },
        {
            key: "bms",
            icon: Layout,
            image: "/services/software/Business-Management-System-(BMS).jpg",
            desc_ar: "نظام إدارة أعمال موحد يتيح للقيادة رؤية شاملة ولحظية على جميع العمليات، من المشاريع والمالية وحتى الفرق وإدارة العملاء.",
            desc_en: "A unified business management system that gives leadership a complete, real-time overview of all operations, from projects and financials to teams and client management."
        },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen">
            <PageHero
                title={t("services_pages.software.hero_title")}
                subtitle={t("services_pages.software.hero_subtitle")}
            />

            <PageSection>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {systems.map((system, i) => (
                        <motion.div
                            key={system.key}
                            whileHover={{ y: -10 }}
                            className="relative group pt-6 md:pt-10 cursor-pointer"
                        >
                            <Link href={`/services/software/${system.key}`} className="absolute inset-0 z-30" aria-label={`View ${system.key}`} />

                            {/* Layered Cards Effect behind */}
                            <div className="absolute top-2 left-3 right-3 h-10 md:top-4 md:left-6 md:right-6 md:h-20 bg-white/5 rounded-2xl md:rounded-4xl -z-10" />
                            <div className="absolute top-4 left-2 right-2 h-10 md:top-7 md:left-4 md:right-4 md:h-20 bg-white/10 rounded-2xl md:rounded-4xl -z-10 transition-all duration-300 group-hover:bg-[#0066FF]/20" />

                            {/* Main Card */}
                            <div className={`relative rounded-2xl md:rounded-3xl overflow-hidden bg-[#111111] border border-white/10 shadow-2xl transition-all duration-500 h-full flex flex-col group-hover:border-[#0066FF]/50 p-3 md:p-6`}>
                                <div className="border-b border-white/10 flex flex-col items-start gap-4 pb-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] group-hover:bg-[#0066FF] group-hover:text-white transition-colors duration-500">
                                        <system.icon className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <h3 className="text-sm md:text-xl font-medium text-white tracking-tight leading-snug group-hover:text-[#0066FF] transition-colors duration-300 min-h-[48px] md:min-h-0">
                                        {(t("services_pages.software") as any)[system.key]}
                                    </h3>
                                </div>

                                <div className="relative pt-4 grow flex flex-col justify-between gap-4">
                                    <p className="text-zinc-500 text-xs md:text-sm leading-relaxed mb-4 line-clamp-3">
                                        {lang === "ar" ? system.desc_ar : system.desc_en}
                                    </p>

                                    <div className="relative aspect-video w-full rounded-xl md:rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-inner group/img">
                                        <Image
                                            src={system.image}
                                            alt={system.key}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60 group-hover:opacity-100"
                                        />

                                        {/* Floating Button */}
                                        <button className={`absolute bottom-3 md:bottom-5 ${lang === "ar" ? "left-3 md:left-5" : "right-3 md:right-5"} p-2 md:p-3 rounded-full z-30 shadow-2xl transition-all duration-500 bg-white/10 text-white backdrop-blur-xl border border-white/10 group-hover:bg-white group-hover:text-black`}>
                                            <ArrowUpRight className={`w-3 h-3 md:w-4 md:h-4 ${lang === "ar" ? "-scale-x-100" : ""}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Custom Development Section */}
            <PageSection title={lang === "ar" ? "هندسة البرمجيات والحلول المخصصة" : "Tailored Software Engineering"} columns={2} className="bg-white/3">
                <div className="flex flex-col justify-center">
                    <p className="text-xl text-zinc-400 mb-10 leading-relaxed max-w-xl">
                        {lang === "ar"
                            ? "نحن نبني حلولاً برمجية من الصفر لتناسب احتياجاتك الفريدة، سواء كانت تطبيقات ويب معقدة أو أنظمة إدارة داخلية متطورة تضمن لك التفوق التقني الكامل."
                            : "We build software solutions from scratch to fit your unique needs, whether they are complex web applications or advanced internal management systems that ensure your full technical edge."}
                    </p>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] border border-[#0066FF]/20 group-hover:bg-[#0066FF] group-hover:text-white transition-all duration-500">
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <span className="text-zinc-300 font-medium group-hover:text-white transition-colors">{lang === "ar" ? "تطبيقات هواتف ذكية متكاملة" : "Integrated Mobile Applications"}</span>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] border border-[#0066FF]/20 group-hover:bg-[#0066FF] group-hover:text-white transition-all duration-500">
                                <Database className="w-6 h-6" />
                            </div>
                            <span className="text-zinc-300 font-medium group-hover:text-white transition-colors">{lang === "ar" ? "قواعد بيانات سحابية متطورة" : "Advanced Cloud Databases"}</span>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] border border-[#0066FF]/20 group-hover:bg-[#0066FF] group-hover:text-white transition-all duration-500">
                                <Code2 className="w-6 h-6" />
                            </div>
                            <span className="text-zinc-300 font-medium group-hover:text-white transition-colors">{lang === "ar" ? "تطوير أنظمة خاصة من الصفر" : "Custom Systems From Scratch"}</span>
                        </div>
                    </div>
                </div>
                <div className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
                    <Image
                        src="/services/software/Custom-Development.jpg"
                        alt="Custom Development"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#050505]/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 border-2 border-white/5 rounded-3xl z-10" />
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
