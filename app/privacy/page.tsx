"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { NexBotAI } from "@/components/nexbot-ai"
import { Shield, Eye, Lock, Database, Bell, UserCheck, ShieldCheck, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

export default function PrivacyPage() {
    const { lang, t } = useLanguage()

    const sections = [
        {
            icon: Database,
            title: lang === "ar" ? "البيانات التي نجمعها" : "Data We Collect",
            body: lang === "ar"
                ? "نجمع المعلومات الضرورية فقط لتقديم خدماتنا، بما في ذلك: الاسم، البريد الإلكتروني، رقم الهاتف، ومعلومات الشركة. لا نجمع أي بيانات حساسة دون موافقتك الصريحة."
                : "We collect only necessary information to provide our services, including: name, email address, phone number, and company information. We never collect sensitive data without your explicit consent.",
        },
        {
            icon: Eye,
            title: lang === "ar" ? "كيف نستخدم بياناتك" : "How We Use Your Data",
            body: lang === "ar"
                ? "نستخدم بياناتك لتقديم الخدمات المطلوبة، التواصل معك، تحسين تجربتك، وإرسال التحديثات المتعلقة بخدماتنا فقط عند موافقتك."
                : "We use your data to deliver requested services, communicate with you, improve your experience, and send service updates only with your consent.",
        },
        {
            icon: Lock,
            title: lang === "ar" ? "أمان البيانات" : "Data Security",
            body: lang === "ar"
                ? "نطبق أعلى معايير تشفير البيانات (SSL/TLS) ونتبع بروتوكولات الأمان الصارمة وفقاً لمعيار PCI-DSS لضمان حماية معلوماتك من الاختراق أو الاستخدام غير المصرح به."
                : "We implement the highest data encryption standards (SSL/TLS) and follow strict security protocols per PCI-DSS to protect your information from unauthorized access or breach.",
        },
        {
            icon: UserCheck,
            title: lang === "ar" ? "حقوقك" : "Your Rights",
            body: lang === "ar"
                ? "لك الحق في الوصول إلى بياناتك، طلب تصحيحها أو حذفها في أي وقت. يمكنك إلغاء الاشتراك في القوائم البريدية بضغطة واحدة في أي رسالة تتلقاها."
                : "You have the right to access, correct, or delete your data at any time. You can unsubscribe from mailing lists with a single click in any email you receive.",
        },
        {
            icon: Bell,
            title: lang === "ar" ? "ملفات الكوكيز" : "Cookies Policy",
            body: lang === "ar"
                ? "نستخدم ملفات تعريف الارتباط الضرورية فقط لتشغيل الموقع. يمكنك التحكم في إعدادات الكوكيز من إعدادات متصفحك في أي وقت دون التأثير سلبياً على وظائف الموقع الأساسية."
                : "We use only essential cookies required to operate the website. You can control cookie settings from your browser settings at any time without negatively affecting core website functionality.",
        },
        {
            icon: Shield,
            title: lang === "ar" ? "مشاركة البيانات" : "Third-Party Data",
            body: lang === "ar"
                ? "لا نبيع أو نشارك بياناتك الشخصية مع أي طرف ثالث لأغراض تجارية. قد نشارك البيانات فقط مع شركاء موثوقين لأغراض تشغيل الخدمة بموجب اتفاقيات سرية صارمة."
                : "We never sell or share your personal data with third parties for commercial purposes. We may share data only with trusted partners for service operations under strict confidentiality agreements.",
        },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-bg-primary min-h-screen text-text-primary overflow-hidden">
            <PageHero
                title={lang === "ar" ? "سياسة الخصوصية" : "Privacy Protocol"}
                subtitle={lang === "ar" ? "نلتزم بحماية خصوصيتك وأمان بياناتك في كل وقت." : "We establish high-fidelity data protection layers to secure your institutional legacy."}
            />

            <PageSection className="pb-32!">
                <div className="max-w-4xl mx-auto space-y-10 pt-16">
                    {sections.map((sec, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <Card className="flex flex-col md:flex-row gap-8 p-10 md:p-12 rounded-[2.5rem] bg-bg-secondary/20 border-2 border-border-color hover:border-accent/40 transition-all duration-700 shadow-2xl group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="shrink-0 w-16 h-16 bg-bg-primary border-2 border-border-color rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-700 shadow-xl group-hover:scale-110 group-hover:rotate-6">
                                    <sec.icon className="w-8 h-8" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black text-text-primary group-hover:text-accent transition-colors tracking-tighter uppercase leading-none">
                                        {sec.title}
                                    </h3>
                                    <p className="text-text-secondary text-lg leading-relaxed font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                                        {sec.body}
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 p-12 rounded-[3rem] bg-bg-secondary/30 border-2 border-accent/20 text-center relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-accent/5 blur-[120px] pointer-events-none" />
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center justify-center gap-6 text-accent">
                            <ShieldCheck className="w-8 h-8 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{lang === "ar" ? "ضمان نكسيت" : "Nexit Trust Protocol"}</span>
                        </div>
                        <p className="text-text-primary text-xl md:text-2xl font-black tracking-tight max-w-2xl mx-auto uppercase">
                            {lang === "ar"
                                ? "آخر تحديث: مارس 2026 — لأي استفسارات تتعلق بالخصوصية، تواصل معنا على"
                                : "Last updated: March 2026 — Secure diagnostic inquiries should be directed to"}
                            <br/>
                            <a href="mailto:privacy@nexitsolu.com" className="text-accent hover:border-b-2 border-accent transition-all inline-block mt-4 lowercase">privacy@nexitsolu.com</a>
                        </p>
                    </div>
                </motion.div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
