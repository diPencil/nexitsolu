"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { NexBotAI } from "@/components/nexbot-ai"
import { Shield, Eye, Lock, Database, Bell, UserCheck } from "lucide-react"
import { motion } from "framer-motion"

export default function PrivacyPage() {
    const { lang } = useLanguage()

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
            title: lang === "ar" ? "مشاركة البيانات مع أطراف ثالثة" : "Third-Party Data Sharing",
            body: lang === "ar"
                ? "لا نبيع أو نشارك بياناتك الشخصية مع أي طرف ثالث لأغراض تجارية. قد نشارك البيانات فقط مع شركاء موثوقين لأغراض تشغيل الخدمة بموجب اتفاقيات سرية صارمة."
                : "We never sell or share your personal data with third parties for commercial purposes. We may share data only with trusted partners for service operations under strict confidentiality agreements.",
        },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen">
            <PageHero
                title={lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
                subtitle={lang === "ar" ? "نلتزم بحماية خصوصيتك وأمان بياناتك في كل وقت." : "We are committed to protecting your privacy and data security at all times."}
            />

            <section className="py-24 max-w-5xl mx-auto px-6">
                <div className="space-y-8">
                    {sections.map((sec, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="flex gap-6 p-8 rounded-3xl bg-[#080808] border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <div className="shrink-0 w-12 h-12 bg-[#0066FF]/10 rounded-2xl flex items-center justify-center">
                                <sec.icon className="w-6 h-6 text-[#0066FF]" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-xl mb-3">{sec.title}</h3>
                                <p className="text-zinc-400 leading-relaxed">{sec.body}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 p-8 rounded-3xl bg-[#0066FF]/5 border border-[#0066FF]/20 text-center">
                    <p className="text-zinc-300 text-sm">
                        {lang === "ar"
                            ? "آخر تحديث: مارس 2026 — لأي استفسارات تتعلق بالخصوصية، تواصل معنا على"
                            : "Last updated: March 2026 — For any privacy inquiries, contact us at"}
                        {" "}
                        <a href="mailto:privacy@nexit.com" className="text-[#0066FF] hover:underline font-medium">privacy@nexit.com</a>
                    </p>
                </div>
            </section>

            <NexBotAI />
        </main>
    )
}
