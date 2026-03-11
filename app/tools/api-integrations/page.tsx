"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Link2, Zap, ShieldCheck, Database, RefreshCw, CreditCard, CloudLightning, Activity, TerminalSquare } from "lucide-react"

export default function APIIntegrations() {
    const { lang, t } = useLanguage()

    const apiFeatures = [
        {
            title: lang === "ar" ? "ربط أنظمة الـ ERP والـ CRM" : "ERP & CRM Integration",
            desc: lang === "ar" ? "تأمين تدفق مستمر ومنتظم للبيانات بين أنظمة إدارة الموارد وعلاقات العملاء الخاصة بك، مما يسرع دقة اتخاذ القرار." : "Secure continuous data flow between your ERP and CRM systems, accelerating decision accuracy.",
            icon: Database,
            color: "text-[#0066FF]",
            bg: "bg-[#0066FF]/10"
        },
        {
            title: lang === "ar" ? "بوابات الدفع والتجارة الإلكترونية" : "Payment Gateways",
            desc: lang === "ar" ? "تكامل سلس وموثوق مع مختلف بوابات الدفع العالمية والمحلية دون المساس بتجربة المستخدم الآمنة." : "Seamless and reliable integration with global and local payment gateways without compromising secure user experience.",
            icon: CreditCard,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            title: lang === "ar" ? "واجهات تطبيقات الجوال" : "Mobile App Sync",
            desc: lang === "ar" ? "دع أجهزتك وتطبيقاتك تتواصل لحظياً للعمل كمنظومة واحدة، عبر توفير بيئة API سريعة وخفيفة." : "Let your devices and apps communicate instantly to work as one ecosystem through fast and lightweight APIs.",
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
            title: lang === "ar" ? "خدمات سحابية وأدوات ذكية" : "Cloud & AI Services",
            desc: lang === "ar" ? "توسيع إمكانيات خدماتك عبر الربط السهل بخدمات خارجية متقدمة وبرمجيات الطرف الثالث المتوافقة مع احتياجاتك." : "Expand your services' capabilities easily connecting to advanced external cloud services and 3rd party software.",
            icon: CloudLightning,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        }
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen overflow-hidden">
            <PageHero
                title={t("tools_pages.api.hero_title")}
                subtitle={t("tools_pages.api.hero_subtitle")}
            />

            {/* Intro & Motivation */}
            <section className="py-24 relative hidden md:block border-y border-white/5 bg-white/3">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
                    <TerminalSquare className="w-16 h-16 text-[#0066FF] mx-auto mb-8 opacity-50" />
                    <p className="text-2xl md:text-4xl text-white mb-6 leading-relaxed font-light">
                        {lang === "ar" ? 'نحن لا نربط الأنظمة فقط، نحن "نوحد" عقليات البرمجيات لتعمل كعقل واحد.' : 'We don’t just connect systems, we “unify” software mentalities to function as a single brain.'}
                    </p>
                    <p className="text-lg text-zinc-400">
                        {t("tools_pages.api.content")}
                    </p>
                </div>
            </section>

            {/* Features Expanded Grid */}
            <PageSection title={lang === "ar" ? "قدرات الربط المتقدمة" : "Advanced API Capabilities"}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {apiFeatures.map((feat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group p-8 md:p-12 rounded-4xl bg-[#0A0A0A] border border-white/5 hover:border-[#0066FF]/40 transition-all duration-500 overflow-hidden relative shadow-2xl"
                        >
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0066FF]/5 rounded-full blur-[50px] group-hover:bg-[#0066FF]/20 transition-colors pointer-events-none" />

                            <div className={`p-4 rounded-2xl ${feat.bg} w-fit mb-8 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                                <feat.icon className={`w-8 h-8 ${feat.color}`} />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#0066FF] transition-colors">{feat.title}</h3>
                            <p className="text-zinc-400 leading-relaxed md:text-lg">{feat.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Architecture Visualization */}
            <PageSection className="bg-white/3 py-32 border-y border-white/5" columns={2}>
                <div className="flex flex-col justify-center order-2 md:order-1 pe-4">
                    <span className="text-[#0066FF] font-black tracking-widest uppercase mb-4 text-sm">{lang === "ar" ? "بنية متكاملة" : "Integrated Architecture"}</span>
                    <h2 className="text-4xl md:text-5xl font-medium text-white mb-6 leading-tight">
                        {lang === "ar" ? "مزامنة " : "Real-time "}<span className="text-[#0066FF]">{lang === "ar" ? "وقت فعلي" : "Sync"}</span>
                    </h2>
                    <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                        {lang === "ar"
                            ? "نبني بنية تحتية مرنة لربط الـ API تتيح لأنظمتك المتباينة التحدث بنفس اللغة وبسرعة خيالية. نهتم بمعايير الأمان باستخدام أحدث تقنيات التشفير لضمان سرية تدفق البيانات بين المنصات."
                            : "We build a flexible API integration infrastructure allowing your disparate systems to speak the same language at incredible speeds. We adhere to top security standards using modern encryption to protect cross-platform data flows."}
                    </p>

                    <div className="space-y-6">
                        {[
                            { title: lang === "ar" ? "تحويل البيانات بسلاسة (Data Mapping)" : "Seamless Data Mapping", icon: RefreshCw },
                            { title: lang === "ar" ? "تأمين التداولات والمصادقة (OAuth 2.0 & JWT)" : "Secure Authentication (OAuth 2.0 & JWT)", icon: ShieldCheck },
                            { title: lang === "ar" ? "أداء عالي ومعالجة ضخمة (High-Throughput)" : "High-Throughput Processing", icon: Activity },
                        ].map((item, id) => (
                            <div key={id} className="flex items-center gap-4 bg-[#080808] p-4 rounded-2xl border border-white/5">
                                <div className="p-2 bg-[#0066FF]/10 text-[#0066FF] rounded-lg shrink-0">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className="text-white font-medium">{item.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative order-1 md:order-2 flex items-center justify-center min-h-[500px]">
                    <style jsx>{`
                        .animation-container {
                            position: relative;
                            width: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            transform: scale(0.8);
                        }
                        @media (min-width: 768px) {
                            .animation-container { transform: scale(1.2); }
                        }
                        .animation-container .square {
                            position: absolute;
                            width: 200px;
                            height: 200px;
                            border: 2px solid #0066FF;
                            border-radius: 20px;
                        }
                        .animation-container .square:nth-child(2) {
                            transform: translate(-25%, -25%) rotateX(180deg);
                            filter: hue-rotate(60deg);
                        }
                        .animation-container .square:nth-child(3) {
                            transform: translate(25%, 25%) rotate(180deg);
                            filter: hue-rotate(180deg);
                        }
                        .animation-container .square::before {
                            content: '';
                            position: absolute;
                            width: 20px;
                            height: 20px;
                            background: #0066FF;
                            border-radius: 50%;
                            box-shadow: 0 0 0 8px rgba(0, 102, 255, 0.2), 0 0 0 15px rgba(0, 102, 255, 0.1);
                            animation: animateSquare 4s linear infinite;
                        }
                        @keyframes animateSquare {
                            0% { transform: translate(-10px, -10px); }
                            25% { transform: translate(190px, -10px); }
                            50% { transform: translate(190px, 190px); }
                            75% { transform: translate(-10px, 190px); }
                            100% { transform: translate(-10px, -10px); }
                        }
                        .animation-container .square span {
                            position: absolute;
                            inset: 10px;
                            overflow: hidden;
                            transform: rotate(calc(90deg * var(--i)));
                        }
                        .animation-container .square span::before {
                            content: '';
                            position: absolute;
                            width: 100%;
                            height: 4px;
                            background: #0066FF;
                            transform: translateX(-100%);
                            animation: animateLine 4s linear infinite;
                            animation-delay: calc(1s * var(--i));
                        }
                        @keyframes animateLine {
                            0% { transform: translateX(-100%); }
                            50%, 100% { transform: translateX(100%); }
                        }
                    `}</style>

                    <div className="animation-container">
                        {[1, 2, 3].map((_, idx) => (
                            <div key={idx} className="square">
                                {[0, 1, 2, 3].map((i) => (
                                    <span key={i} style={{ '--i': i } as any}></span>
                                ))}
                            </div>
                        ))}
                        <div className="relative z-10 p-8 rounded-3xl bg-[#0066FF] text-white shadow-[0_0_50px_rgba(0,102,255,0.4)]">
                            <Link2 className="w-12 h-12 md:w-16 md:h-16" />
                        </div>
                    </div>

                    <div className="absolute bottom-4 px-8 py-3 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                        <span className="text-zinc-300 font-medium tracking-wide">RESTful / WebSockets / GraphQL</span>
                    </div>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
