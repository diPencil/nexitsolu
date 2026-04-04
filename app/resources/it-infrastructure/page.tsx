"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion, AnimatePresence } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Server, Network, Database, Layers, CheckCircle2, ArrowUpRight, Zap, ShieldCheck, Globe } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Card } from "@/components/ui/card"

function ExpandableServiceCard({ index, serviceKey, icon: Icon, image, desc, lang, t }: any) {
    const [isOpen, setIsOpen] = useState(index === 1);

    const featureKeys = [
        "features.cooling_title", "features.power_title", "features.racking_title", "features.monitoring_title",
        "features.wireless_title", "features.security_title", "features.routing_title", "features.vpn_title",
        "features.nas_san_title", "features.backup_title", "features.dr_title", "features.encryption_title",
        "features.fiber_title", "features.cat6_title", "features.management_title", "features.labels_title"
    ];

    const serviceFeatures = featureKeys.filter(f => {
        const fullKey = `resources_pages.it_infra.${serviceKey}_details.${f}`;
        const translated = t(fullKey);
        return translated !== fullKey;
    }).slice(0, 4);

    return (
        <motion.div
            layout
            initial={false}
            className="w-full"
        >
            <Card className={`relative overflow-hidden border-2 transition-all duration-700 hover:border-accent/50 group rounded-[3rem] ${isOpen ? 'ring-8 ring-accent/5 border-accent shadow-4xl bg-bg-secondary/40' : 'bg-bg-secondary/20 border-border-color shadow-2xl'}`}>
                <div
                    className="p-10 md:p-14 lg:p-16 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
                        <div className={`shrink-0 text-5xl md:text-7xl font-black transition-all duration-700 uppercase tracking-tighter ${isOpen ? 'text-accent opacity-40 scale-110' : 'text-text-secondary opacity-10'}`}>
                            {index.toString().padStart(2, '0')}.
                        </div>

                        <div className="grow">
                            <h3 className={`text-3xl md:text-5xl font-black transition-all duration-700 tracking-tighter uppercase leading-none ${isOpen ? 'text-accent' : 'text-text-primary group-hover:text-accent group-hover:translate-x-3 transition-transform'}`}>
                                {(t("resources_pages.it_infra.services") as any)[serviceKey]}
                            </h3>

                            <motion.div
                                initial={false}
                                animate={{ opacity: isOpen ? 0 : 1, height: isOpen ? 0 : "auto" }}
                                className="flex flex-wrap gap-4 mt-8 overflow-hidden"
                            >
                                {serviceFeatures.map((f, idx) => (
                                    <span key={idx} className="px-5 py-2 rounded-xl border-2 border-border-color bg-bg-primary text-text-secondary text-xs font-black uppercase tracking-widest opacity-60">
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
                            <div className="px-10 py-5 rounded-3xl bg-accent text-white font-black text-sm uppercase tracking-widest flex items-center gap-4 group-hover:scale-105 transition-all shadow-xl shadow-accent/20">
                                {lang === "ar" ? "تفاصيل" : "Deploy"}
                                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={false}
                        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pt-16 items-start">
                            <div className="space-y-12 order-2 lg:order-1 flex flex-col items-start h-full justify-center">
                                <div className="space-y-8">
                                    <div className="w-20 h-2 bg-accent rounded-full shadow-[0_0_15px_rgba(0,102,255,0.4)]" />
                                    <p className="text-text-secondary text-xl md:text-2xl leading-relaxed max-w-2xl font-medium opacity-80">
                                        {desc}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                                    {serviceFeatures.map((f, idx) => (
                                        <div key={idx} className="flex items-center gap-6 p-6 rounded-3xl bg-bg-primary border-2 border-border-color hover:border-accent/40 transition-all group/feat shadow-lg">
                                            <div className="w-3 h-3 rounded-full bg-accent group-hover/feat:scale-[1.5] transition-transform shadow-[0_0_10px_rgba(0,102,255,0.5)]" />
                                            <span className="text-sm font-black tracking-widest text-text-primary uppercase">
                                                {t(`resources_pages.it_infra.${serviceKey}_details.${f}`)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-8 w-full sm:w-auto">
                                    <Link
                                        href={`/resources/it-infrastructure/${serviceKey}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center justify-center gap-4 px-14 py-6 rounded-3xl bg-accent text-white font-black text-sm uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-4xl shadow-accent/20 group/btn"
                                    >
                                        {lang === "ar" ? "استكشف الخدمة بالكامل" : "Explore Global Service"}
                                        <ArrowUpRight className="w-6 h-6 transition-transform group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2" />
                                    </Link>
                                </div>
                            </div>

                            <div className="relative aspect-16/10 w-full rounded-[3.5rem] overflow-hidden border-2 border-border-color shadow-4xl group/img order-1 lg:order-2 self-start ring-8 ring-bg-primary/50">
                                <Image
                                    src={image}
                                    alt={serviceKey}
                                    fill
                                    className="object-cover group-hover/img:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100 grayscale hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-linear-to-tr from-bg-primary/60 via-bg-primary/10 to-transparent pointer-events-none" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Card>
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
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-bg-primary min-h-screen text-text-primary overflow-hidden">
            <PageHero
                title={t("resources_pages.it_infra.hero_title")}
                subtitle={t("resources_pages.it_infra.hero_subtitle")}
            />

            <PageSection title={t("resources_pages.it_infra.title")}>
                <div className="flex flex-col gap-10 w-full pt-16">
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

            {/* Premium Features Grid */}
            <PageSection title={lang === "ar" ? "مميزات بنيتنا التحتية" : "Cloud Core Specs"} columns={2} className="bg-bg-secondary/30 border-y border-border-color py-40!">
                <div className="flex flex-col gap-10 justify-center pe-4 lg:pe-20">
                     <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                         <span className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black tracking-[0.3em] uppercase mb-10 shadow-xl">
                            <ShieldCheck className="w-4 h-4" />
                            {lang === "ar" ? "معايير نكست" : "The Nexit Standard"}
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-12 tracking-tighter leading-[0.95] uppercase">
                            {lang === "ar" ? "أداء " : "Unrivaled "}<span className="text-accent">{lang === "ar" ? "بلا حدود" : "Latency"}</span><br/>
                            {lang === "ar" ? "بنية صلبة" : "& Global Nodes"}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {[
                            { ar: "أمان عالمي", en: "Global Security", icon: ShieldCheck },
                            { ar: "توسع لحظي", en: "Instant Scale", icon: Zap },
                            { ar: "دعم 24/7", en: "Expert Help", icon: Globe },
                            { ar: "استدامة ذكية", en: "Smart Power", icon: Server }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="p-8 border-2 border-border-color hover:border-accent/40 bg-bg-primary transition-all duration-700 group shadow-2xl rounded-[2.5rem]">
                                    <div className="w-14 h-14 rounded-2xl bg-accent/5 text-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-700 border border-accent/10">
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <h4 className="text-text-primary font-black text-lg mb-3 tracking-widest uppercase">
                                        {lang === "ar" ? item.ar : item.en}
                                    </h4>
                                    <p className="text-text-secondary text-sm leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity font-medium">
                                        {lang === "ar" ? "أعلى معايير الجودة لضمان استقرار ونمو أعمالك." : "Exceeding uptime metrics across all regional deployments."}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-accent/5 blur-[140px] pointer-events-none" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative aspect-square md:aspect-auto w-full h-full min-h-[600px] rounded-[4rem] overflow-hidden border-2 border-border-color shadow-4xl group group-hover:border-accent/40 transition-all duration-1000"
                    >
                        <Image
                            src="/resources/it-infrastructure/Infrastructure-Features.jpg"
                            alt="Infrastructure Features"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-bg-primary/80 via-bg-primary/20 to-transparent pointer-events-none" />
                        <div className="absolute bottom-12 left-12 right-12">
                            <div className="p-10 md:p-14 rounded-[3rem] bg-bg-secondary/40 backdrop-blur-3xl border-2 border-white/10 group-hover:bg-bg-secondary/60 group-hover:border-accent/40 transition-all duration-700 shadow-4xl">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="w-1.5 h-12 bg-accent rounded-full" />
                                    <p className="text-3xl md:text-4xl font-black text-text-primary leading-none tracking-tighter uppercase">
                                        {lang === "ar" ? "جاهزون للتوسع العالمي" : "Bridges to Global Scale"}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between border-t border-white/10 pt-8">
                                    <p className="text-accent text-xs font-black uppercase tracking-[0.4em]">
                                        Nexit Engineered
                                    </p>
                                    <ArrowUpRight className="w-8 h-8 text-white/40 group-hover:text-accent group-hover:translate-x-2 group-hover:-translate-y-2 transition-all" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
