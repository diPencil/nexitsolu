"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { CreditCard, Wallet, Landmark, ShieldCheck, Banknote, Globe, Lock, Zap, ArrowUpRight } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function PaymentGateways() {
    const { lang, t } = useLanguage()

    const egyptGateways = [
        { name: "Paymob", desc: t("tools_pages.payments.egy_gateways.paymob") },
        { name: "Fawry", desc: t("tools_pages.payments.egy_gateways.fawry") },
        { name: "Cowpay", desc: t("tools_pages.payments.egy_gateways.cowpay") },
        { name: "Accept", desc: t("tools_pages.payments.egy_gateways.accept") },
        { name: "Fawaterk", desc: t("tools_pages.payments.egy_gateways.fawaterk") },
        { name: "Kashier", desc: t("tools_pages.payments.egy_gateways.kashier") },
        { name: "Opay", desc: t("tools_pages.payments.egy_gateways.opay") },
        { name: "ValU", desc: t("tools_pages.payments.egy_gateways.valu") },
    ]

    const gulfGateways = [
        { name: "Tabby", desc: t("tools_pages.payments.gulf_gateways.tabby") },
        { name: "Tamara", desc: t("tools_pages.payments.gulf_gateways.tamara") },
        { name: "Moyasar", desc: t("tools_pages.payments.gulf_gateways.moyasar") },
        { name: "Stc Pay", desc: t("tools_pages.payments.gulf_gateways.stcpay") },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-bg-primary min-h-screen">
            <PageHero
                title={t("tools_pages.payments.hero_title")}
                subtitle={t("tools_pages.payments.hero_subtitle")}
            />

            {/* Intro Section */}
            <section className="py-32 border-y border-border-color bg-bg-secondary/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-accent/3 blur-[120px] pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
                    <div className="inline-flex p-5 rounded-3xl bg-bg-primary border border-border-color shadow-2xl mb-10 group hover:border-accent transition-all duration-500">
                        <CreditCard className="w-12 h-12 text-accent group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-2xl md:text-5xl text-text-primary mb-10 leading-tight font-black tracking-tight">
                        {t("tools_pages.payments.tagline.first")}
                        <span className="text-accent">
                            {t("tools_pages.payments.tagline.second")}
                        </span>
                    </p>
                    <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed opacity-80 font-medium">
                        {t("tools_pages.payments.content")}
                    </p>
                </div>
            </section>

            {/* Egypt Gateways Grid */}
            <PageSection title={t("tools_pages.payments.egypt_gateways_label")}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                    {egyptGateways.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="group relative p-8 md:p-10 h-full border-border-color hover:border-accent/40 bg-bg-secondary/30 transition-all duration-500 overflow-hidden shadow-xl text-center flex flex-col items-center">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors pointer-events-none" />

                                <div className="relative z-10 mx-auto mb-8 w-16 h-16 bg-bg-primary rounded-2xl flex items-center justify-center border border-border-color group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-xl">
                                    <Wallet className="w-8 h-8 text-accent group-hover:text-white transition-colors" />
                                </div>

                                <h3 className="relative z-10 text-xl md:text-2xl font-black text-text-primary mb-4 tracking-tight group-hover:text-accent transition-colors">{item.name}</h3>
                                <p className="relative z-10 text-text-secondary text-sm md:text-base leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                                
                                <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-700" />
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Gulf Gateways Grid */}
            <PageSection title={t("tools_pages.payments.gulf_gateways_label")} className="bg-bg-secondary/30 border-y border-border-color relative overflow-hidden">
                <div className="absolute inset-0 bg-accent/3 blur-[120px] -z-10" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                    {gulfGateways.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="group relative p-8 md:p-10 h-full bg-bg-primary/50 backdrop-blur-xl border-border-color hover:border-accent/40 transition-all duration-500 overflow-hidden shadow-xl text-center flex flex-col items-center">
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors pointer-events-none" />

                                <div className="relative z-10 mx-auto mb-8 w-16 h-16 bg-bg-primary rounded-2xl flex items-center justify-center border border-border-color group-hover:rotate-12 group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-xl">
                                    <Landmark className="w-8 h-8 text-accent group-hover:text-white transition-colors" />
                                </div>

                                <h3 className="relative z-10 text-xl md:text-2xl font-black text-text-primary mb-4 tracking-tight group-hover:text-accent transition-colors">{item.name}</h3>
                                <p className="relative z-10 text-text-secondary text-sm md:text-base leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                                
                                <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-700" />
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Security & Integration Section */}
            <PageSection className="py-32" columns={2}>
                <div className="relative rounded-[40px] bg-accent overflow-hidden group shadow-3xl flex flex-col min-h-[500px]">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />

                    <div className="relative z-10 p-10 md:p-16 grow flex flex-col justify-center">
                        <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl w-fit mb-10 border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <ShieldCheck className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black mb-8 text-white leading-tight tracking-tight">
                            {t("tools_pages.payments.security.title")}
                        </h3>
                        <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-12 font-medium">
                            {t("tools_pages.payments.security.desc")}
                        </p>

                        <div className="flex flex-wrap gap-4 mt-auto">
                            {["PCI-DSS Level 1", "3D Secure 2.0", "End-to-End Encryption"].map((tag) => (
                                <span key={tag} className="px-5 py-2.5 bg-white/10 rounded-full text-white text-xs font-black border border-white/20 backdrop-blur-md hover:bg-white/20 transition-colors cursor-default">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center ps-0 lg:ps-16 py-12">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-accent/10 text-accent rounded-xl border border-accent/20 shadow-md">
                            <Zap className="w-6 h-6 animate-pulse" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest text-accent opacity-80">{t("tools_pages.payments.integration.tag")}</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black mb-8 text-text-primary leading-tight tracking-tight">
                        {t("tools_pages.payments.integration.title")}<span className="text-accent">{t("tools_pages.payments.integration.subtitle")}</span>
                    </h2>

                    <p className="text-text-primary text-lg md:text-xl leading-relaxed mb-12 opacity-90 max-w-xl font-medium">
                        {t("tools_pages.payments.integration.desc")}
                    </p>

                    <div className="grid gap-4">
                        {[
                            { title: t("tools_pages.payments.integration.native"), icon: Globe },
                            { title: t("tools_pages.payments.integration.fraud"), icon: Lock },
                            { title: t("tools_pages.payments.integration.settlements"), icon: Banknote },
                        ].map((feat, idx) => (
                            <div key={idx} className="flex gap-5 items-center p-6 rounded-2xl bg-bg-secondary/30 border border-border-color group hover:border-accent/40 transition-all shadow-xl backdrop-blur-sm">
                                <div className="p-3 bg-accent/10 text-accent rounded-xl shrink-0 group-hover:bg-accent group-hover:text-white transition-all shadow-inner">
                                    <feat.icon className="w-6 h-6" />
                                </div>
                                <span className="text-text-primary font-black tracking-tight text-lg">{feat.title}</span>
                                <ArrowUpRight className="w-5 h-5 text-text-secondary ms-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
