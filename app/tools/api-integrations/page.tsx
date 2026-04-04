"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Link2, Zap, ShieldCheck, Database, RefreshCw, CreditCard, CloudLightning, Activity, TerminalSquare, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function APIIntegrations() {
    const { lang, t } = useLanguage()

    const apiFeatures = [
        {
            title: t("tools_pages.api.features.erp_crm.title"),
            desc: t("tools_pages.api.features.erp_crm.desc"),
            icon: Database,
            color: "text-accent",
            bg: "bg-accent/10"
        },
        {
            title: t("tools_pages.api.features.payment_gateways.title"),
            desc: t("tools_pages.api.features.payment_gateways.desc"),
            icon: CreditCard,
            color: "text-accent",
            bg: "bg-accent/10"
        },
        {
            title: t("tools_pages.api.features.mobile_sync.title"),
            desc: t("tools_pages.api.features.mobile_sync.desc"),
            icon: Zap,
            color: "text-accent",
            bg: "bg-accent/10"
        },
        {
            title: t("tools_pages.api.features.cloud_ai.title"),
            desc: t("tools_pages.api.features.cloud_ai.desc"),
            icon: CloudLightning,
            color: "text-accent",
            bg: "bg-accent/10"
        }
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-bg-primary min-h-screen">
            <PageHero
                title={t("tools_pages.api.hero_title")}
                subtitle={t("tools_pages.api.hero_subtitle")}
            />

            {/* Intro & Motivation */}
            <section className="py-32 relative border-y border-border-color bg-bg-secondary/20 overflow-hidden">
                <div className="absolute inset-0 bg-accent/3 blur-[120px] pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
                    <div className="inline-flex p-5 rounded-3xl bg-bg-primary border border-border-color shadow-2xl mb-10 group hover:border-accent transition-all duration-500">
                        <TerminalSquare className="w-12 h-12 text-accent group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-2xl md:text-4xl text-text-primary mb-10 leading-tight font-black tracking-tight italic">
                        &quot;{t("tools_pages.api.quote")}&quot;
                    </p>
                    <p className="text-lg md:text-xl text-text-secondary leading-relaxed opacity-80 max-w-2xl mx-auto">
                        {t("tools_pages.api.content")}
                    </p>
                </div>
            </section>

            {/* Features Expanded Grid */}
            <PageSection title={t("tools_pages.api.capabilities_title")}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {apiFeatures.map((feat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="group p-8 md:p-12 h-full border-border-color hover:border-accent/40 bg-bg-secondary/30 transition-all duration-500 overflow-hidden relative shadow-xl">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-[50px] group-hover:bg-accent/10 transition-colors pointer-events-none" />

                                <div className="flex flex-col h-full">
                                    <div className={`p-5 rounded-2xl ${feat.bg} w-fit mb-10 shadow-xl border border-accent/20 group-hover:scale-110 group-hover:bg-accent transition-all duration-500`}>
                                        <feat.icon className={`w-8 h-8 ${feat.color} group-hover:text-white transition-colors`} />
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-black text-text-primary mb-6 group-hover:text-accent transition-colors tracking-tight">{feat.title}</h3>
                                    <p className="text-text-secondary leading-relaxed text-lg font-medium opacity-80 group-hover:opacity-100 transition-opacity mb-8">{feat.desc}</p>
                                    
                                    <div className="mt-auto flex items-center gap-2 text-accent font-black uppercase tracking-widest text-xs border-b border-accent/20 pb-1 w-fit group-hover:border-accent group-hover:gap-4 transition-all">
                                        {t("tools_pages.api.view_details")}
                                        <ArrowRight className={`w-4 h-4 ${lang === "ar" ? "rotate-180" : ""}`} />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Architecture Visualization */}
            <PageSection className="bg-bg-secondary/30 py-32 border-y border-border-color relative overflow-hidden" columns={2}>
                <div className="absolute inset-0 bg-accent/3 blur-[120px] -z-10" />
                <div className="flex flex-col justify-center order-2 lg:order-1 pe-0 lg:pe-12 space-y-8">
                    <div>
                        <span className="inline-flex px-4 py-2 bg-accent/10 text-accent font-black tracking-widest uppercase mb-6 text-xs rounded-full border border-accent/20">{t("tools_pages.api.architecture.tag")}</span>
                        <h2 className="text-4xl md:text-5xl font-black text-text-primary mb-8 leading-tight tracking-tight">
                            {t("tools_pages.api.architecture.title")}<span className="text-accent">{t("tools_pages.api.architecture.subtitle")}</span>
                        </h2>
                        <p className="text-text-primary text-lg md:text-xl leading-relaxed opacity-90 max-w-xl">
                            {t("tools_pages.api.architecture.content")}
                        </p>
                    </div>

                    <div className="grid gap-4">
                        {[
                            { title: t("tools_pages.api.architecture.mapping"), icon: RefreshCw },
                            { title: t("tools_pages.api.architecture.auth"), icon: ShieldCheck },
                            { title: t("tools_pages.api.architecture.throughput"), icon: Activity },
                        ].map((item, id) => (
                            <div key={id} className="flex items-center gap-5 bg-bg-primary/50 backdrop-blur-md p-5 rounded-2xl border border-border-color shadow-xl group hover:border-accent/40 transition-all">
                                <div className="p-3 bg-accent/10 text-accent rounded-xl shrink-0 group-hover:bg-accent group-hover:text-white transition-all shadow-inner">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <span className="text-text-primary font-black tracking-tight">{item.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative order-1 lg:order-2 flex items-center justify-center min-h-[500px]">
                    <style jsx>{`
                        .animation-container {
                            position: relative;
                            width: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            transform: scale(0.85);
                        }
                        @media (min-width: 1024px) {
                            .animation-container { transform: scale(1.3); }
                        }
                        .animation-container .square {
                            position: absolute;
                            width: 200px;
                            height: 200px;
                            border: 3px solid var(--accent);
                            border-radius: 30px;
                            opacity: 0.3;
                            box-shadow: 0 0 40px var(--accent-transparent);
                        }
                        .animation-container .square:nth-child(2) {
                            transform: translate(-30%, -30%) rotateX(180deg);
                            filter: brightness(1.2);
                        }
                        .animation-container .square:nth-child(3) {
                            transform: translate(30%, 30%) rotate(180deg);
                            filter: brightness(0.8);
                        }
                        .animation-container .square::before {
                            content: '';
                            position: absolute;
                            width: 24px;
                            height: 24px;
                            background: var(--accent);
                            border-radius: 50%;
                            box-shadow: 0 0 20px var(--accent), 0 0 40px var(--accent-transparent);
                            animation: animateSquare 6s linear infinite;
                            z-index: 5;
                        }
                        @keyframes animateSquare {
                            0% { transform: translate(-12px, -12px); }
                            25% { transform: translate(188px, -12px); }
                            50% { transform: translate(188px, 188px); }
                            75% { transform: translate(-12px, 188px); }
                            100% { transform: translate(-12px, -12px); }
                        }
                        .animation-container .square span {
                            position: absolute;
                            inset: 0px;
                            overflow: hidden;
                            transform: rotate(calc(90deg * var(--i)));
                            border-radius: 30px;
                        }
                        .animation-container .square span::before {
                            content: '';
                            position: absolute;
                            width: 100%;
                            height: 4px;
                            background: linear-gradient(90deg, transparent, var(--accent), transparent);
                            transform: translateX(-100%);
                            animation: animateLine 6s linear infinite;
                            animation-delay: calc(1.5s * var(--i));
                        }
                        @keyframes animateLine {
                            0% { transform: translateX(-100%); }
                            50%, 100% { transform: translateX(100%); }
                        }
                    `}</style>

                    <div className="animation-container">
                        {[1, 2, 3].map((_, idx) => (
                            <div key={idx} className="square" style={{ '--accent-transparent': 'rgba(0, 102, 255, 0.2)' } as any}>
                                {[0, 1, 2, 3].map((i) => (
                                    <span key={i} style={{ '--i': i } as any}></span>
                                ))}
                            </div>
                        ))}
                        <div className="relative z-10 p-10 rounded-[40px] bg-accent text-white shadow-3xl transform hover:scale-110 transition-transform duration-700 active:scale-95 cursor-pointer">
                            <Link2 className="w-16 h-16 md:w-20 md:h-20" />
                        </div>
                    </div>

                    <div className="absolute bottom-4 px-10 py-4 bg-bg-secondary/80 border border-border-color backdrop-blur-xl rounded-full shadow-2xl group hover:border-accent transition-all">
                        <span className="text-text-primary font-black tracking-widest text-xs uppercase opacity-80 group-hover:opacity-100 transition-opacity">RESTful / WebSockets / GraphQL</span>
                    </div>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
