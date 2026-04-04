"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Puzzle, PenTool, Layout, Rocket, ShoppingBag, Shield, Settings, MonitorSmartphone, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function CMSPlugins() {
    const { lang, t } = useLanguage()

    const platforms = [
        { icon: Puzzle, title: "WordPress", desc: t("tools_pages.cms.platforms.wordpress_desc"), color: "text-accent" },
        { icon: ShoppingBag, title: "Magento & Shopify", desc: t("tools_pages.cms.platforms.ecommerce_desc"), color: "text-accent" },
        { icon: Layout, title: "Custom CMS", desc: t("tools_pages.cms.platforms.custom_desc"), color: "text-accent" },
        { icon: Rocket, title: "Headless CMS", desc: t("tools_pages.cms.platforms.headless_desc"), color: "text-accent" },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-bg-primary min-h-screen">
            <PageHero
                title={t("tools_pages.cms.hero_title")}
                subtitle={t("tools_pages.cms.hero_subtitle")}
            />

            <section className="py-32 relative border-y border-border-color bg-bg-secondary/20 overflow-hidden">
                <div className="absolute inset-0 bg-accent/3 blur-[120px] pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
                    <div className="inline-flex p-5 rounded-3xl bg-bg-primary border border-border-color shadow-none dark:shadow-2xl mb-10 group hover:border-accent transition-all duration-500">
                        <MonitorSmartphone className="w-12 h-12 text-accent group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-2xl md:text-4xl text-text-primary mb-10 leading-tight font-black tracking-tight italic">
                        &quot;{t("tools_pages.cms.quote")}&quot;
                    </p>
                    <p className="text-lg md:text-xl text-text-secondary leading-relaxed opacity-80 max-w-2xl mx-auto">
                        {t("tools_pages.cms.content")}
                    </p>
                </div>
            </section>

            <PageSection title={t("tools_pages.cms.platforms_title")}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                    {platforms.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="group h-full p-8 md:p-10 border-border-color hover:border-accent/40 bg-bg-secondary/30 transition-all duration-500 text-center flex flex-col items-center shadow-none dark:shadow-xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors pointer-events-none" />
                                <div className="relative z-10 p-5 bg-bg-primary rounded-2xl mb-8 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-500 border border-border-color shadow-none dark:shadow-xl">
                                    <item.icon className={`w-10 h-10 ${item.color} group-hover:text-white transition-colors`} />
                                </div>
                                <h3 className="relative z-10 text-xl md:text-2xl font-black text-text-primary mb-4 group-hover:text-accent transition-colors tracking-tight">{item.title}</h3>
                                <p className="relative z-10 text-text-secondary leading-relaxed text-sm md:text-base font-medium opacity-80 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                                <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-700" />
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            <PageSection className="bg-bg-secondary/30 py-32 border-y border-border-color relative overflow-hidden" columns={2}>
                <div className="absolute inset-0 bg-accent/3 blur-[120px] -z-10" />
                <div className="relative order-2 lg:order-1 flex items-center justify-center min-h-[500px]">
                    <style jsx>{`
                        .main-wrapper {
                            position: relative;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            width: 100%;
                            height: 100%;
                            transform: scale(0.8);
                        }
                        .main {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            scale: 1.8;
                            position: relative;
                            z-index: 10;
                        }
                        @media (min-width: 1024px) {
                            .main { scale: 2.2; }
                            .main-wrapper { transform: scale(1.1); }
                        }
                        #pizza {
                            background-color: transparent;
                            transform-origin: center center;
                            animation: rotate 45s linear infinite;
                            filter: drop-shadow(0 0 40px rgba(0, 102, 255, 0.2));
                        }
                        #slice1 { animation: slice1 4s ease-in-out infinite; animation-delay: 0s; }
                        #slice2 { animation: slice2 4s ease-in-out infinite; animation-delay: 1s; }
                        #slice3 { animation: slice3 4s ease-in-out infinite; animation-delay: 2s; }
                        #slice4 { animation: slice4 4s ease-in-out infinite; animation-delay: 3s; }
                        #slice5 { animation: slice5 4s ease-in-out infinite; animation-delay: 4s; }
                        #slice6 { animation: slice6 4s ease-in-out infinite; animation-delay: 5s; }

                        @keyframes rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                        @keyframes slice1 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(5%, 5%); } }
                        @keyframes slice2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(0%, 7%); } }
                        @keyframes slice3 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-5%, 5%); } }
                        @keyframes slice4 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-5%, 0%); } }
                        @keyframes slice5 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(0%, -3%); } }
                        @keyframes slice6 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(5%, 0%); } }
                    `}</style>
                    <div className="main-wrapper">
                        <div className="absolute w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] z-0" />
                        <div className="main">
                            <svg width="168" height="158" viewBox="0 0 168 158" fill="none" xmlns="http://www.w3.org/2000/svg" id="pizza">
                                <g id="slice6">
                                    <path d="M110 34.8997C118.513 39.4198 125.582 45.921 130.497 53.75C135.412 61.579 138 70.4598 138 79.5L82 79.5L110 34.8997Z" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="2" opacity="0.9" />
                                    <circle cx="114" cy="63" r="6" fill="var(--accent)" />
                                    <path d="M96.3127 75.3748C93.8388 74.3499 93.5395 72.1249 96.4349 66.9246C100.861 64.107 105.48 66.5248 103.603 67.4062C101.726 68.2876 101.517 69.215 101.78 69.3984C101.78 69.3984 105.126 71.2856 104.991 72.8193C104.856 74.353 103.753 74.1725 103.409 74.5483C103.066 74.9242 99.9579 71.3905 99.9579 71.3905C96.0194 74.1256 98.7867 76.3997 96.3127 75.3748Z" fill="var(--accent)" opacity="0.2" stroke="var(--accent)" strokeWidth="0.5" />
                                </g>
                                <g id="slice5">
                                    <path d="M54 34.8997C62.5131 30.3796 72.1699 28 82 28C91.8301 28 101.487 30.3796 110 34.8997L82 79.5L54 34.8997Z" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="2" opacity="0.9" />
                                    <circle cx="82" cy="56" r="6" fill="var(--accent)" />
                                </g>
                                <g id="slice1">
                                    <path d="M138 79.5C138 88.5401 135.412 97.421 130.497 105.25C125.582 113.079 118.513 119.58 110 124.1L82 79.5H138Z" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="2" opacity="0.9" />
                                    <circle cx="119" cy="99" r="6" fill="var(--accent)" />
                                </g>
                                <g id="slice2">
                                    <path d="M110 124.1C101.487 128.62 91.8301 131 82 131C72.1699 131 62.5131 128.62 54 124.1L82 79.5L110 124.1Z" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="2" opacity="0.9" />
                                    <circle cx="78" cy="103" r="6" fill="var(--accent)" />
                                </g>
                                <g id="slice4">
                                    <path d="M26 79.5C26 70.4599 28.5876 61.579 33.5026 53.75C38.4176 45.921 45.4869 39.4198 54 34.8997L82 79.5L26 79.5Z" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="2" opacity="0.9" />
                                    <circle cx="64" cy="70" r="6" fill="var(--accent)" />
                                </g>
                                <g id="slice3">
                                    <path d="M54 124.1C45.4869 119.58 38.4176 113.079 33.5026 105.25C28.5876 97.421 26 88.5401 26 79.5L82 79.5L54 124.1Z" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="2" opacity="0.9" />
                                    <circle cx="42" cy="99" r="6" fill="var(--accent)" />
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center order-1 lg:order-2 ps-0 lg:ps-12 space-y-8">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-accent/10 text-accent rounded-xl border border-accent/20 shadow-md">
                                <Settings className="w-6 h-6 animate-[spin_6s_linear_infinite]" />
                            </div>
                            <span className="text-sm font-black uppercase tracking-widest text-accent opacity-80">{t("tools_pages.cms.benefits.tag")}</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black mb-8 text-text-primary leading-tight tracking-tight">
                            {t("tools_pages.cms.benefits.title")}<span className="text-accent">{t("tools_pages.cms.benefits.subtitle")}</span>
                        </h2>

                        <p className="text-text-primary text-lg md:text-xl leading-relaxed opacity-90 max-w-xl">
                            {t("tools_pages.cms.content")}
                        </p>
                    </div>

                    <div className="grid gap-4">
                        {[
                            { title: t("tools_pages.cms.benefits.perf"), icon: Rocket },
                            { title: t("tools_pages.cms.benefits.security"), icon: Shield },
                            { title: t("tools_pages.cms.benefits.integration"), icon: Puzzle },
                        ].map((feat, idx) => (
                            <div key={idx} className="flex gap-4 items-start bg-bg-primary/50 backdrop-blur-md p-5 rounded-2xl border border-border-color shadow-none dark:shadow-xl group hover:border-accent/40 transition-all">
                                <div className="p-3 bg-accent/10 text-accent rounded-xl shrink-0 group-hover:bg-accent group-hover:text-white transition-all shadow-none dark:shadow-inner">
                                    <feat.icon className="w-5 h-5" />
                                </div>
                                <p className="text-text-primary font-black tracking-tight pt-2">{feat.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
