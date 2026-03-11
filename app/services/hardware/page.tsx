"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Monitor, Cpu, Network, Wrench, Camera, Briefcase, Laptop, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HardwareServices() {
    const { lang, t } = useLanguage()

    const items = [
        {
            key: "servers",
            icon: Cpu,
            image: "/services/hardware/Server-&-Workstation-Preparation.jpg",
            desc_ar: "نورّد ونجهز أحدث خوادم ومراكز بيانات مستقرة للتعامل مع أعباء العمل المؤسسية الثقيلة.",
            desc_en: "We supply and set up the latest stable servers and data centers to handle heavy enterprise workloads."
        },
        {
            key: "networks",
            icon: Network,
            image: "/services/hardware/Network-&-Cabling-Equipment.jpg",
            desc_ar: "بناء بنية تحتية شبكية سلكية ولاسلكية متطورة لضمان سرعة نقل البيانات داخل وخارج مقرك.",
            desc_en: "Building advanced wired and wireless network infrastructure to ensure fast data transfer across your premises."
        },
        {
            key: "maintenance",
            icon: Wrench,
            image: "/services/hardware/Maintenance-&-Tech-Support-Contracts.jpg",
            desc_ar: "عقود صيانة دورية شاملة وخدمات الدعم الفني لضمان استمرارية عمل عتادك بكفاءة عالية.",
            desc_en: "Comprehensive periodic maintenance contracts and tech support services to ensure continuous high-efficiency operation of your hardware."
        },
        {
            key: "cctv",
            icon: Camera,
            image: "/services/hardware/CCTV-&-Security-Systems.jpg",
            desc_ar: "تركيب وتشغيل كاميرات المراقبة المتطورة وأنظمة الأمان الحديثة لحماية مقراتك من أي خطر.",
            desc_en: "Installing and operating advanced CCTV cameras and modern security systems to protect your premises from any risks."
        },
        {
            key: "field_support",
            icon: Briefcase,
            image: "/services/hardware/Field-Technical-Support.jpg",
            desc_ar: "فرق دعم فني ميدانية تنزل لمقرك لتشخيص الأعطال الفيزيائية وحل المشاكل التقنية على أرض الواقع.",
            desc_en: "Field technical support teams dispatched to your site to diagnose physical breakdowns and resolve tech issues on the ground."
        },
        {
            key: "workstations",
            icon: Laptop,
            image: "/services/hardware/Workstations-&-Laptops.jpg",
            desc_ar: "توريد أجهزة حواسيب ومحطات عمل قوية، ولابتوبات مخصصة لتلبية احتياجات فريق عملك بإنتاجية أعلى.",
            desc_en: "Supplying powerful computers, workstations, and custom laptops tailored to meet your team's needs with higher productivity."
        },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen">
            <PageHero
                title={t("services_pages.hardware.hero_title")}
                subtitle={t("services_pages.hardware.hero_subtitle")}
            />

            <PageSection>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="relative group pt-6 md:pt-10 cursor-pointer"
                        >
                            <Link href={`/services/hardware/${item.key}`} className="absolute inset-0 z-30" aria-label={`View ${item.key}`} />

                            {/* Layered Cards Effect behind */}
                            <div className="absolute top-2 left-3 right-3 h-10 md:top-4 md:left-6 md:right-6 md:h-20 bg-white/5 rounded-2xl md:rounded-4xl -z-10" />
                            <div className="absolute top-4 left-2 right-2 h-10 md:top-7 md:left-4 md:right-4 md:h-20 bg-white/10 rounded-2xl md:rounded-4xl -z-10 transition-all duration-300 group-hover:bg-[#0066FF]/20" />

                            {/* Main Card */}
                            <div className={`relative rounded-2xl md:rounded-3xl overflow-hidden bg-[#111111] border border-white/10 shadow-2xl transition-all duration-500 h-full flex flex-col group-hover:border-[#0066FF]/50 p-3 md:p-6`}>
                                <div className="border-b border-white/10 flex flex-col items-start gap-4 pb-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] group-hover:bg-[#0066FF] group-hover:text-white transition-colors duration-500">
                                        <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <h3 className="text-sm md:text-xl font-medium text-white tracking-tight leading-snug group-hover:text-[#0066FF] transition-colors duration-300 min-h-[48px] md:min-h-0">
                                        {(t("services_pages.hardware") as any)[item.key]}
                                    </h3>
                                </div>

                                <div className="relative pt-4 grow flex flex-col justify-between gap-4">
                                    <p className="text-zinc-500 text-xs md:text-sm leading-relaxed mb-4 line-clamp-3">
                                        {lang === "ar" ? item.desc_ar : item.desc_en}
                                    </p>

                                    <div className="relative aspect-video w-full rounded-xl md:rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-inner group/img">
                                        <Image
                                            src={item.image}
                                            alt={item.key}
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

            <PageSection className="bg-white/3" columns={2}>
                <div className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
                    <Image
                        src="/services/hardware/Integrated-Equipment.jpg"
                        alt="Integrated Equipment"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#050505]/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 border-2 border-white/5 rounded-3xl z-10" />
                </div>
                <div className="flex flex-col justify-center">
                    <h2 className="text-3xl md:text-5xl font-medium text-white mb-8 tracking-tight">
                        {lang === "ar" ? "تجهيزات متكاملة وبنية صلبة" : "Integrated Equipment & Solid Infrastructure"}
                    </h2>
                    <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed max-w-xl">
                        {lang === "ar"
                            ? "من محطات العمل البسيطة إلى مراكز البيانات المعقدة، نحن شريكك المعتمد لتوفير العتاد التقني الذي يمثل العمود الفقري لنجاح أعمالك الرقمية."
                            : "From simple workstations to complex data centers, we are your certified partner for providing the hardware necessary for your project's success."}
                    </p>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] border border-[#0066FF]/20 group-hover:bg-[#0066FF] group-hover:text-white transition-all duration-500">
                                <Cpu className="w-6 h-6" />
                            </div>
                            <span className="text-zinc-300 font-medium group-hover:text-white transition-colors">
                                {lang === "ar" ? "توريد خوادم عالية الأداء" : "High-Performance Server Supply"}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] border border-[#0066FF]/20 group-hover:bg-[#0066FF] group-hover:text-white transition-all duration-500">
                                <Network className="w-6 h-6" />
                            </div>
                            <span className="text-zinc-300 font-medium group-hover:text-white transition-colors">
                                {lang === "ar" ? "تجهيز مراكز بيانات متكاملة" : "Complete Data Center Setup"}
                            </span>
                        </div>
                    </div>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
