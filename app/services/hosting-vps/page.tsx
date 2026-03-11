"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Globe, Server, Mail, ArrowRight, Check, ArrowUpRight, Cpu, Cloud, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function HostingVPS() {
    const { lang, t } = useLanguage()

    const plans = [
        { name: "Starter", price: "2.99", features: ["1 Website", "50 GB SSD", "100 GB Bandwidth", "Free SSL"] },
        { name: "Professional", price: "4.99", features: ["100 Websites", "200 GB SSD", "Unlimited Bandwidth", "Free Domain", "Daily Backups"], popular: true },
        { name: "Enterprise", price: "9.99", features: ["300 Websites", "400 GB SSD", "Unlimited Bandwidth", "Dedicated Resources", "Priority Support"] },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen">
            <PageHero
                title={t("services_pages.hosting.hero_title")}
                subtitle={t("services_pages.hosting.hero_subtitle")}
            />

            {/* Other Services */}
            <PageSection title={lang === "ar" ? "خدمات الاستضافة المدارة" : "Managed Hosting Services"}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                            whileHover={{ y: -10 }}
                            className="relative group pt-6 md:pt-10 cursor-pointer"
                        >
                            <Link href={`/services/hosting-vps/${item.key}`} className="absolute inset-0 z-30" aria-label={`View ${item.key}`} />

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
                                        {(t("services_pages.hosting") as any)[item.key]}
                                    </h3>
                                </div>

                                <div className="relative pt-4 grow flex flex-col justify-between gap-4">
                                    <p className="text-zinc-500 text-xs md:text-sm leading-relaxed mb-4 line-clamp-3">
                                        {(t("services_pages.hosting") as any)[`${item.key}_desc`]}
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

            <PageSection title={lang === "ar" ? "خطط الاستضافة" : "Hosting Plans"}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative p-10 rounded-4xl border transition-all duration-500 flex flex-col ${plan.popular ? "bg-[#111] border-[#0066FF] scale-105 z-10" : "bg-white/5 border-white/10"}`}
                        >
                            {plan.popular && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0066FF] text-white text-xs font-bold rounded-full uppercase tracking-widest">
                                    {lang === "ar" ? "الأكثر مبيعاً" : "Most Popular"}
                                </span>
                            )}
                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="flex items-end gap-1 mb-8">
                                <span className="text-4xl font-black text-white">${plan.price}</span>
                                <span className="text-zinc-500 mb-1">/{lang === "ar" ? "شهر" : "mo"}</span>
                            </div>
                            <div className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feat, j) => (
                                    <div key={j} className="flex items-center gap-3">
                                        <Check className="w-4 h-4 text-[#0066FF]" />
                                        <span className="text-zinc-400 text-sm">{feat}</span>
                                    </div>
                                ))}
                            </div>
                            <Button className={`w-full rounded-xl py-6 ${plan.popular ? "bg-[#0066FF] hover:bg-[#0052CC]" : "bg-white/5 border-white/10 hover:bg-white/10 border"}`}>
                                {lang === "ar" ? "اختر الخطة" : "Select Plan"}
                            </Button>
                        </motion.div>
                    ))}
                </div>
                <p className="text-center mt-12 text-zinc-600 text-sm italic">
                    {t("services_pages.hosting.pricing_note")}
                </p>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
