"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Server, Network, Database, Layers, CheckCircle2, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

function ExpandableServiceCard({ index, serviceKey, icon: Icon, image, desc, lang, t }: any) {
    const [isOpen, setIsOpen] = useState(index === 1);

    const featureKeys = [
        "features.cooling_title", "features.power_title", "features.racking_title", "features.monitoring_title",
        "features.wireless_title", "features.security_title", "features.routing_title", "features.vpn_title",
        "features.nas_san_title", "features.backup_title", "features.dr_title", "features.encryption_title",
        "features.fiber_title", "features.cat6_title", "features.management_title", "features.labels_title"
    ];

    // Filter features relevant to this service
    const serviceFeatures = featureKeys.filter(f => {
        const fullKey = `resources_pages.it_infra.${serviceKey}_details.${f}`;
        const translated = t(fullKey);
        return translated !== fullKey;
    }).slice(0, 4);

    return (
        <motion.div
            layout
            initial={false}
            className={`relative rounded-3xl overflow-hidden bg-[#0a0a0a] border ${isOpen ? 'border-[#0066FF] shadow-[0_0_50px_-12px_rgba(0,102,255,0.2)]' : 'border-white/10'} hover:border-[#0066FF]/50 transition-all duration-500`}
        >
            <div
                className="p-6 md:p-12 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center gap-10">
                    {/* Number on the left */}
                    <div className={`shrink-0 text-3xl md:text-5xl font-black transition-colors ${isOpen ? 'text-[#0066FF]/40' : 'text-white/5'}`}>
                        {index.toString().padStart(2, '0')}.
                    </div>

                    <div className="grow">
                        <h3 className={`text-xl md:text-3xl font-bold transition-colors ${isOpen ? 'text-white mb-0' : 'text-zinc-400 mb-4'}`}>
                            {(t("resources_pages.it_infra.services") as any)[serviceKey]}
                        </h3>

                        <motion.div
                            initial={false}
                            animate={{ opacity: isOpen ? 0 : 1, height: isOpen ? 0 : "auto" }}
                            className="flex flex-wrap gap-3 overflow-hidden"
                        >
                            {serviceFeatures.map((f, idx) => (
                                <span key={idx} className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-500 text-[10px] md:text-xs font-medium uppercase tracking-wider">
                                    {t(`resources_pages.it_infra.${serviceKey}_details.${f}`)}
                                </span>
                            ))}
                        </motion.div>
                    </div>

                    <motion.div
                        initial={false}
                        animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.9 : 1, width: isOpen ? 0 : "auto" }}
                        className="shrink-0 overflow-hidden"
                    >
                        <div className="px-8 py-3 rounded-full bg-[#0066FF] text-white font-bold text-sm flex items-center gap-3">
                            {lang === "ar" ? "اقرأ المزيد" : "Learn More"}
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                    </motion.div>
                </div>

                {/* Expanded Content Section */}
                <motion.div
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-10 items-center">
                        {/* Text Container */}
                        <div className="space-y-8 order-2 lg:order-1 flex flex-col items-start h-full justify-center">
                            <div className="space-y-4">
                                <div className="w-12 h-1 bg-[#0066FF] rounded-full" />
                                <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
                                    {desc}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                {serviceFeatures.map((f, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#0066FF]/30 transition-all group/feat">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF] group-hover/feat:scale-150 transition-transform" />
                                        <span className="text-xs font-bold tracking-wide text-zinc-300">
                                            {t(`resources_pages.it_infra.${serviceKey}_details.${f}`)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 w-full md:w-auto">
                                <Link
                                    href={`/resources/it-infrastructure/${serviceKey}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-[#0066FF] text-white font-black hover:scale-105 transition-all shadow-2xl shadow-[#0066FF]/20 group/btn"
                                >
                                    {lang === "ar" ? "استكشف الخدمة بالكامل" : "Explore Full Service"}
                                    <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Image Container */}
                        <div className="relative aspect-video lg:aspect-video w-full rounded-2xl md:rounded-[40px] overflow-hidden border border-white/10 shadow-3xl group/img order-1 lg:order-2">
                            <Image
                                src={image}
                                alt={serviceKey}
                                fill
                                className="object-cover group-hover/img:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-linear-to-tr from-black/80 via-transparent to-transparent" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default function ITInfrastructure() {
    const { lang, t } = useLanguage()

    const services = [
        {
            key: "servers",
            icon: Server,
            image: "/resources/it-infrastructure/Data-Centers-&-Server-Rooms-Design.jpg",
            desc_ar: "بناء وتجهيز مراكز بيانات متكاملة وغرف خوادم تواكب متطلبات التشغيل العالية وتضمن استمرارية الأعمال الموثوقة.",
            desc_en: "Building and equipping integrated data centers and server rooms that meet high operational demands and ensure reliable business continuity."
        },
        {
            key: "networks",
            icon: Network,
            image: "/resources/it-infrastructure/Integrated-Networking-(Direct-&-Wireless-Connectivity).jpg",
            desc_ar: "تصميم وتنفيذ شبكات تواصل داخلية وخارجية (سلكية ولاسلكية) تضمن سرعة واستقرار اتصال موظفيك وأنظمتك.",
            desc_en: "Designing and implementing internal and external communication networks (wired and wireless) ensuring the speed and stability of your connections."
        },
        {
            key: "storage",
            icon: Database,
            image: "/resources/it-infrastructure/Data-Security-&-Advanced-Storage--Backup.jpg",
            desc_ar: "تقديم حلول متقدمة لتخزين البيانات المركزية مع خطط نسخ احتياطي آمنة لحماية معلوماتك من الفقد أو التلف.",
            desc_en: "Providing advanced centralized data storage solutions with secure backup plans to protect your information from loss or corruption."
        },
        {
            key: "cabling",
            icon: Layers,
            image: "/resources/it-infrastructure/Structured-Cabling-&-Fiber-Optics.jpg",
            desc_ar: "ننفذ تمديدات الكابلات الهيكلية وشبكات الألياف الضوئية للبنية التحتية لتوفير أساس قوي وقابل للتوسع المستفيد.",
            desc_en: "Implementing structured cabling and fiber optic networks for infrastructure to provide a strong, scalable foundation."
        },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen">
            <PageHero
                title={t("resources_pages.it_infra.hero_title")}
                subtitle={t("resources_pages.it_infra.hero_subtitle")}
            />

            <PageSection title={t("resources_pages.it_infra.title")}>
                <div className="flex flex-col gap-8 w-full">
                    {services.map((service, i) => {
                        return (
                            <ExpandableServiceCard
                                key={service.key}
                                index={i + 1}
                                serviceKey={service.key}
                                icon={service.icon}
                                image={service.image}
                                desc={lang === "ar" ? service.desc_ar : service.desc_en}
                                lang={lang}
                                t={t}
                            />
                        );
                    })}
                </div>
            </PageSection>

            {/* Features List Section */}
            <PageSection title={lang === "ar" ? "مميزات بنيتنا التحتية" : "Infrastructure Features"} columns={2}>
                <div className="flex flex-col gap-8">
                    <div className="space-y-6">
                        {[
                            { ar: "معايير أمان عالمية وحماية متقدمة للبيانات", en: "Global security standards and advanced data protection" },
                            { ar: "قابلية توسع عالية للمشاريع الكبرى والعالمية", en: "High scalability for large and global projects" },
                            { ar: "دعم فني متخصص على مدار الساعة 24/7", en: "24/7 specialized technical support" },
                            { ar: "تجهيزات ذكية موفرة للطاقة وصديقة للبيئة", en: "Smart energy-efficient and eco-friendly equipment" }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-start gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-[#0066FF]/30 transition-all group"
                            >
                                <div className="p-2 rounded-xl bg-[#0066FF]/10 text-[#0066FF] group-hover:scale-110 transition-transform">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-1">
                                        {lang === "ar" ? item.ar : item.en}
                                    </h4>
                                    <p className="text-zinc-500 text-sm">
                                        {lang === "ar" ? "نلتزم بأعلى معايير الجودة لضمان استقرار أعمالك." : "We commit to the highest quality standards to ensure your business stability."}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square lg:aspect-auto lg:h-full min-h-[400px] rounded-[40px] overflow-hidden border border-white/10 shadow-3xl"
                >
                    <Image
                        src="/resources/it-infrastructure/Infrastructure-Features.jpg"
                        alt="Infrastructure Features"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute bottom-10 left-10 right-10">
                        <div className="p-8 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 inline-block">
                            <p className="text-2xl font-black text-white leading-tight">
                                {lang === "ar" ? "جاهزون للتوسع العالمي" : "Ready for Global Scaling"}
                            </p>
                            <p className="text-[#0066FF] text-sm font-bold mt-2 uppercase tracking-widest">
                                Nexit Standard
                            </p>
                        </div>
                    </div>
                </motion.div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
