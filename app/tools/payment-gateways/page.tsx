"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { CreditCard, Wallet, Landmark, ShieldCheck, Banknote, Globe, Lock, Zap } from "lucide-react"

export default function PaymentGateways() {
    const { lang, t } = useLanguage()

    const egyptGateways = [
        { name: "Paymob", desc: lang === "ar" ? "حلول دفع شاملة للبطاقات والمحافظ الإلكترونية وطرق التقسيط." : "Comprehensive solutions for cards, e-wallets, and installment plans.", color: "from-blue-600/20 to-transparent" },
        { name: "Fawry", desc: lang === "ar" ? "أكبر شبكة دفع إلكتروني في مصر تناسب جميع القطاعات." : "The largest e-payment network in Egypt suitable for all sectors.", color: "from-yellow-500/20 to-transparent" },
        { name: "Cowpay", desc: lang === "ar" ? "تسهيلات دفع وتحصيل سلسة للشركات الناشئة والمتاجر." : "Seamless payment and collection facilities for startups and stores.", color: "from-purple-500/20 to-transparent" },
        { name: "Accept", desc: lang === "ar" ? "دفع رقمي آمن ومباشر بقبول عالي لمختلف البطاقات البنكية." : "Secure and direct digital payment with high acceptance for bank cards.", color: "from-emerald-500/20 to-transparent" },
        { name: "Fawaterk", desc: lang === "ar" ? "منصة رائدة لإدارة الفواتير والمدفوعات الإلكترونية بسهولة وأمان." : "A leading platform for managing invoices and electronic payments with ease and security.", color: "from-orange-600/20 to-transparent" },
        { name: "Kashier", desc: lang === "ar" ? "بوابة دفع متكاملة تساعد الشركات على قبول المدفوعات عبر الإنترنت وبسرعة." : "Integrated payment gateway helping businesses accept online payments quickly.", color: "from-cyan-400/20 to-transparent" },
        { name: "Opay", desc: lang === "ar" ? "مزود خدمات مالية رقمية عالمي يقدم حلولاً مبتكرة للتجار والمستخدمين." : "A global digital financial services provider offering innovative solutions for merchants and users.", color: "from-green-500/20 to-transparent" },
        { name: "ValU", desc: lang === "ar" ? "المنصة الرائدة للشراء الآن والدفع لاحقاً، لتعزيز القوة الشرائية للعملاء." : "The leading 'Buy Now, Pay Later' platform, enhancing customer purchasing power.", color: "from-pink-500/20 to-transparent" },
    ]

    const gulfGateways = [
        { name: "Tabby", desc: lang === "ar" ? "الرائد في حلول 'اشتر الآن وادفع لاحقاً' في منطقة الخليج." : "The leader in 'Buy Now, Pay Later' solutions in the Gulf region.", color: "from-cyan-500/20 to-transparent" },
        { name: "Tamara", desc: lang === "ar" ? "خيارات دفع مرنة لتعزيز المبيعات وولاء العملاء في السعودية والإمارات." : "Flexible payment options to boost sales and loyalty in KSA & UAE.", color: "from-orange-500/20 to-transparent" },
        { name: "Moyasar", desc: lang === "ar" ? "بوابة دفع سعودية موثوقة تدعم بطاقات مدى وابل باي وغيرها." : "Reliable Saudi gateway supporting Mada, Apple Pay, and more.", color: "from-indigo-500/20 to-transparent" },
        { name: "Stc Pay", desc: lang === "ar" ? "محفظة رقمية متكاملة للتحويلات والمدفوعات داخل المملكة وخارجها." : "Integrated digital wallet for transfers and payments inside & outside KSA.", color: "from-rose-500/20 to-transparent" },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen overflow-hidden">
            <PageHero
                title={t("tools_pages.payments.hero_title")}
                subtitle={t("tools_pages.payments.hero_subtitle")}
            />

            {/* Intro Section */}
            <section className="py-24 border-y border-white/5 bg-white/3 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
                    <CreditCard className="w-20 h-20 text-[#0066FF] mx-auto mb-8 opacity-60" />
                    <p className="text-2xl md:text-5xl text-white mb-6 leading-tight font-medium">
                        {lang === "ar" ? "نجعل من كل معاملة " : "We make every transaction a "}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-[#0066FF] to-cyan-400">
                            {lang === "ar" ? "تجربة سلسة ومضمونة" : "seamless & secure experience"}
                        </span>
                    </p>
                    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        {t("tools_pages.payments.content")}
                    </p>
                </div>
            </section>

            {/* Egypt Gateways Grid */}
            <PageSection title={t("tools_pages.payments.egypt_gateways")}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {egyptGateways.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group relative p-8 rounded-4xl bg-[#080808] border border-white/5 hover:bg-[#111] hover:border-white/10 transition-all duration-500 overflow-hidden shadow-xl hover:shadow-[0_0_40px_rgba(0,102,255,0.1)]"
                        >
                            <div className={`absolute top-0 right-0 w-full h-full bg-linear-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                            <div className="relative z-10 mb-6 w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                <Wallet className="w-8 h-8 text-white/60 group-hover:text-white transition-colors" />
                            </div>

                            <h3 className="relative z-10 text-2xl font-black text-white mb-3 tracking-wide">{item.name}</h3>
                            <p className="relative z-10 text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Gulf Gateways Grid */}
            <PageSection title={t("tools_pages.payments.gulf_gateways")} className="bg-white/3 border-y border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {gulfGateways.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group relative p-8 rounded-4xl bg-zinc-950/50 backdrop-blur-xl border border-white/5 hover:bg-black hover:border-white/10 transition-all duration-500 overflow-hidden"
                        >
                            <div className={`absolute bottom-0 left-0 w-full h-full bg-linear-to-tr ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                            <div className="relative z-10 mb-6 w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform duration-500">
                                <Landmark className="w-8 h-8 text-white/50 group-hover:text-[#0066FF] transition-colors" />
                            </div>

                            <h3 className="relative z-10 text-2xl font-black text-zinc-300 mb-3 tracking-wide group-hover:text-white transition-colors">{item.name}</h3>
                            <p className="relative z-10 text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-400 transition-colors">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Security & Integration Section */}
            <PageSection className="pb-32" columns={2}>
                <div className="relative rounded-4xl bg-[#0066FF] overflow-hidden group shadow-[0_0_80px_rgba(0,102,255,0.4)]">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />

                    <div className="relative z-10 p-12 md:p-16 h-full flex flex-col justify-center">
                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl w-fit mb-8 border border-white/20 shadow-inner">
                            <ShieldCheck className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black mb-6 text-white leading-tight">
                            {lang === "ar" ? "أمان بنكي أعلى من المقاييس" : "Bank-Grade Supreme Security"}
                        </h3>
                        <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 font-light">
                            {lang === "ar"
                                ? "نحن نطبق أعلى معايير تشفير البيانات (PCI-DSS) ومعماريات Zero-Trust لضمان حماية معلومات عملائك المالية من أي اختراق."
                                : "We implement the highest PCI-DSS data encryption standards and Zero-Trust architectures to ensure bulletproof protection of financial information."}
                        </p>

                        <div className="flex flex-wrap gap-4 mt-auto">
                            <span className="px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium border border-white/20 backdrop-blur-md">PCI-DSS Level 1</span>
                            <span className="px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium border border-white/20 backdrop-blur-md">3D Secure 2.0</span>
                            <span className="px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium border border-white/20 backdrop-blur-md">End-to-End Encryption</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center p-8 lg:p-16">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="p-2 bg-[#0066FF]/20 text-[#0066FF] rounded-lg">
                            <Zap className="w-5 h-5" />
                        </span>
                        <span className="text-sm font-bold uppercase tracking-widest text-[#0066FF]">{lang === "ar" ? "تكامل سريع الذكاء" : "Smart Rapid Integration"}</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white leading-tight">
                        {lang === "ar" ? "ربط " : "Seamless "}<span className="text-transparent bg-clip-text bg-linear-to-r from-[#0066FF] to-cyan-400">{lang === "ar" ? "لا تشعر به!" : "Connectivity!"}</span>
                    </h2>

                    <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-10">
                        {lang === "ar"
                            ? "نوفر واجهات برمجية (APIs) موثقة وشاملة، تسمح بربط أنظمة الدفع بمنصتك في زمن قياسي مع توفير بيئات اختبار (Sandbox) قوية قبل الإطلاق المباشر لضمان خلو العمليات من الأخطاء."
                            : "We provide comprehensive, well-documented APIs allowing you to integrate payment systems into your platform in record time, offering robust Sandbox environments before going live."}
                    </p>

                    <div className="space-y-6 flex-1">
                        {[
                            { title: lang === "ar" ? "تجربة مستخدم أصلية ومدمجة داخل التطبيق" : "Native & embedded in-app checkout experience", icon: Globe },
                            { title: lang === "ar" ? "منع الاحتيال الآلي واكتشاف التلاعب" : "Automated fraud prevention & detection", icon: Lock },
                            { title: lang === "ar" ? "تسويات مالية وتقارير أرباح لحظية" : "Instant financial settlements & revenue reports", icon: Banknote },
                        ].map((feat, idx) => (
                            <div key={idx} className="flex gap-4 items-start p-4 rounded-3xl bg-[#080808] border border-white/5 hover:border-[#0066FF]/30 transition-colors">
                                <div className="p-3 bg-[#0066FF]/10 text-[#0066FF] rounded-xl shrink-0">
                                    <feat.icon className="w-6 h-6" />
                                </div>
                                <p className="text-zinc-300 font-medium text-lg pt-2">{feat.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
