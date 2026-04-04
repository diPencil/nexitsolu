"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Globe, Server, Mail, ArrowRight, Check, ArrowUpRight, Cpu, Cloud, Database, Zap, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

function normalizeFeatureList(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value.map((item) => String(item)).filter(Boolean)
    }

    if (value && typeof value === "object") {
        return Object.values(value as Record<string, unknown>)
            .map((item) => String(item))
            .filter(Boolean)
    }

    if (typeof value === "string" && value.trim()) {
        return [value]
    }

    return []
}

export default function HostingVPS() {
    const { lang, t } = useLanguage()

    const plans = [
        { 
            name: t("services_pages.hosting.plans.starter.name"), 
            price: "2.99", 
            features: normalizeFeatureList(t("services_pages.hosting.plans.starter.features")), 
            popular: false 
        },
        { 
            name: t("services_pages.hosting.plans.professional.name"), 
            price: "4.99", 
            features: normalizeFeatureList(t("services_pages.hosting.plans.professional.features")), 
            popular: true 
        },
        { 
            name: t("services_pages.hosting.plans.enterprise.name"), 
            price: "9.99", 
            features: normalizeFeatureList(t("services_pages.hosting.plans.enterprise.features")), 
            popular: false 
        },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-bg-primary min-h-screen text-text-primary overflow-hidden">
            <PageHero
                title={t("services_pages.hosting.hero_title")}
                subtitle={t("services_pages.hosting.hero_subtitle")}
            />

            {/* Hosting Infrastructure Grid */}
            <PageSection className="pb-32!">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {[
                        { key: "buying", icon: Globe, image: "/services/hosting-vps/Domain-&-Hosting-Purchase.jpg" },
                        { key: "vps", icon: Cpu, image: "/services/hosting-vps/VPS-Virtual-Private-Server.jpg" },
                        { key: "cloud", icon: Cloud, image: "/services/hosting-vps/Cloud-Hosting.jpg" },
                        { key: "email", icon: Mail, image: "/services/hosting-vps/Business-Official-Emails.jpg" },
                        { key: "migration", icon: Server, image: "/services/hosting-vps/Website-&-Email-Migration.jpg" },
                        { key: "dedicated", icon: Database, image: "/services/hosting-vps/Dedicated-Server.jpg" },
                    ].map((item, i) => (
                        <motion.div
                            key={item.key}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link href={`/services/hosting-vps/${item.key}`} className="block h-full group">
                                <Card className="h-full p-0 overflow-hidden border-border-color hover:border-accent/40 bg-bg-secondary/20 transition-all duration-700 flex flex-col shadow-2xl hover:shadow-4xl relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="p-10 md:p-12 flex flex-col grow">
                                        <div className="w-16 h-16 rounded-[1.25rem] bg-bg-primary border border-border-color flex items-center justify-center text-accent mb-10 group-hover:bg-accent group-hover:text-white transition-all duration-700 shadow-xl group-hover:scale-110">
                                            <item.icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-black text-text-primary mb-6 group-hover:text-accent transition-colors tracking-tighter leading-tight uppercase">
                                            {(t("services_pages.hosting") as any)[item.key]}
                                        </h3>
                                        <p className="text-text-secondary text-lg leading-relaxed grow mb-12 max-w-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                                            {(t("services_pages.hosting") as any)[`${item.key}_desc`]}
                                        </p>

                                        <div className="relative aspect-16/10 w-full rounded-[2.5rem] overflow-hidden border border-border-color bg-bg-primary shadow-2xl group-hover:border-accent/40 transition-all duration-700">
                                            <Image
                                                src={item.image}
                                                alt={item.key}
                                                fill
                                                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-bg-primary/60 via-bg-primary/20 to-transparent pointer-events-none" />
                                            
                                            <div className="absolute bottom-6 right-6 p-4 rounded-2xl bg-accent text-white shadow-3xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                                                <ArrowUpRight className="w-6 h-6" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Hosting Plans Section */}
            <PageSection className="bg-bg-secondary/30 border-y border-border-color py-40! relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,102,255,0.05),transparent_70%)] pointer-events-none" />
                
                <div className="text-center mb-24 relative z-10">
                    <span className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black tracking-[0.3em] uppercase mb-10 shadow-xl">
                        <Zap className="w-4 h-4 fill-accent" />
                        {t("services_pages.hosting.plans.tag")}
                    </span>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-text-primary tracking-tighter leading-[0.95] uppercase">
                        {t("services_pages.hosting.plans.title")} <span className="text-accent">{t("services_pages.hosting.plans.subtitle")}</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 items-stretch relative z-10">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex"
                        >
                            <Card className={`relative p-12 md:px-14 md:py-16 flex flex-col grow border-border-color transition-all duration-700 hover:shadow-4xl hover:border-accent/40 bg-bg-primary/50 shadow-2xl backdrop-blur-3xl rounded-[3rem] ${plan.popular ? "border-accent/60 ring-2 ring-accent/10 scale-105 z-10 bg-bg-primary shadow-accent/5" : ""}`}>
                                {plan.popular && (
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-8 py-3 bg-accent text-white text-[11px] font-black rounded-full uppercase tracking-widest shadow-3xl shadow-accent/40 flex items-center gap-3">
                                        <Zap className="w-4 h-4 fill-current" />
                                        {t("services_pages.hosting.plans.most_popular")}
                                    </div>
                                )}
                                
                                <div className="mb-12">
                                    <h3 className="text-3xl font-black text-text-primary mb-3 tracking-tighter uppercase">{plan.name}</h3>
                                    <div className="flex items-end gap-2 group-hover:scale-105 transition-transform duration-500 origin-left">
                                        <span className="text-6xl font-black text-text-primary tracking-tighter leading-none">${plan.price}</span>
                                        <span className="text-text-secondary text-sm mb-2 font-black uppercase tracking-[0.2em] opacity-50">/{t("services_pages.hosting.plans.mo")}</span>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-16 flex-1 pt-8 border-t border-border-color/50">
                                    {plan.features.map((feat, j) => (
                                        <div key={j} className="flex items-start gap-5 group/feat">
                                            <div className="mt-1 w-7 h-7 rounded-lg bg-accent/5 flex items-center justify-center shrink-0 border border-accent/10 group-hover/feat:bg-accent group-hover/feat:text-white group-hover/feat:scale-110 transition-all duration-500">
                                                <Check className="w-4 h-4 text-accent group-hover/feat:text-white" />
                                            </div>
                                            <span className="text-text-secondary text-lg font-bold leading-tight group-hover/feat:text-text-primary transition-colors tracking-tight opacity-70 group-hover/feat:opacity-100">{feat}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button 
                                    className={`w-full rounded-3xl py-10 font-black text-sm uppercase tracking-[0.3em] transition-all duration-700 shadow-2xl active:scale-[0.98] ${plan.popular ? "bg-accent hover:bg-accent/90 text-white shadow-accent/30 hover:scale-[1.02]" : "bg-bg-secondary text-text-primary border-2 border-border-color hover:border-accent hover:bg-accent hover:text-white"}`}
                                >
                                    {t("services_pages.hosting.plans.activate")}
                                </Button>
                            </Card>
                        </motion.div>
                    ))}
                </div>
                
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.6 }}
                    className="text-center mt-24 pt-12 border-t border-border-color/30 max-w-2xl mx-auto flex flex-col items-center gap-6"
                >
                    <div className="flex items-center gap-4 text-accent/60">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t("services_pages.hosting.plans.guarantee")}</span>
                    </div>
                    <p className="text-text-secondary text-sm font-bold tracking-tight px-6 italic">
                        &quot;{t("services_pages.hosting.pricing_note")}&quot;
                    </p>
                </motion.div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
