"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { NexBotAI } from "@/components/nexbot-ai"
import { FileText, AlertCircle, Scale, RefreshCw, Ban, Globe } from "lucide-react"
import { motion } from "framer-motion"

export default function TermsPage() {
    const { lang } = useLanguage()

    const sections = [
        {
            icon: FileText,
            title: lang === "ar" ? "قبول الشروط" : "Acceptance of Terms",
            body: lang === "ar"
                ? "باستخدامك لموقع نكسيت سوليوشنز أو خدماتها، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى التوقف عن استخدام منصتنا فوراً."
                : "By using Nexit Solutions' website or services, you agree to be bound by these Terms and Conditions. If you do not agree to any of these terms, please stop using our platform immediately.",
        },
        {
            icon: Globe,
            title: lang === "ar" ? "نطاق الخدمات" : "Scope of Services",
            body: lang === "ar"
                ? "نقدم خدمات تقنية متكاملة تشمل: تطوير البرمجيات، حلول البنية التحتية، الأمن السيبراني، الاستضافة، وتكاملات الأنظمة. تخضع جميع الخدمات لاتفاقيات مستوى الخدمة (SLA) المتفق عليها مسبقاً."
                : "We provide comprehensive technology services including: software development, infrastructure solutions, cybersecurity, hosting, and system integrations. All services are governed by pre-agreed Service Level Agreements (SLAs).",
        },
        {
            icon: Scale,
            title: lang === "ar" ? "المسؤولية والتعويض" : "Liability & Indemnification",
            body: lang === "ar"
                ? "لا تتحمل نكسيت سوليوشنز مسؤولية الأضرار غير المباشرة أو العرضية الناجمة عن استخدام خدماتنا. تلتزم بتعويض الشركة عن أي مطالبات ناجمة عن انتهاكك لهذه الشروط."
                : "Nexit Solutions is not liable for indirect or incidental damages arising from the use of our services. You agree to indemnify the company for any claims arising from your violation of these terms.",
        },
        {
            icon: Ban,
            title: lang === "ar" ? "الاستخدام المحظور" : "Prohibited Uses",
            body: lang === "ar"
                ? "يُحظر استخدام خدماتنا لأغراض غير قانونية، أو لنشر محتوى ضار، أو لانتهاك حقوق الملكية الفكرية لأي طرف، أو لأي نشاط يتعارض مع القوانين المحلية والدولية المعمول بها."
                : "It is prohibited to use our services for illegal purposes, disseminating harmful content, infringing intellectual property rights of any party, or any activity conflicting with applicable local and international laws.",
        },
        {
            icon: RefreshCw,
            title: lang === "ar" ? "التعديلات على الشروط" : "Modifications to Terms",
            body: lang === "ar"
                ? "تحتفظ نكسيت سوليوشنز بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعارك بالتغييرات الجوهرية عبر البريد الإلكتروني أو إشعار بارز على الموقع قبل 30 يوماً من سريانها."
                : "Nexit Solutions reserves the right to modify these terms at any time. You will be notified of material changes via email or a prominent notice on the website 30 days before they take effect.",
        },
        {
            icon: AlertCircle,
            title: lang === "ar" ? "القانون الحاكم" : "Governing Law",
            body: lang === "ar"
                ? "تخضع هذه الشروط وتُفسَّر وفقاً لقوانين جمهورية مصر العربية. يتفق الطرفان على أن المحاكم المختصة في القاهرة هي الجهة الحصرية لتسوية أي نزاعات."
                : "These terms shall be governed and interpreted in accordance with the laws of the Arab Republic of Egypt. Both parties agree that the competent courts in Cairo shall be the exclusive venue for resolving any disputes.",
        },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen">
            <PageHero
                title={lang === "ar" ? "شروط الخدمة" : "Terms of Service"}
                subtitle={lang === "ar" ? "يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا." : "Please read these terms carefully before using our services."}
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
                            ? "آخر تحديث: مارس 2026 — لأي استفسارات قانونية، تواصل معنا على"
                            : "Last updated: March 2026 — For any legal inquiries, contact us at"}
                        {" "}
                        <a href="mailto:legal@nexit.com" className="text-[#0066FF] hover:underline font-medium">legal@nexit.com</a>
                    </p>
                </div>
            </section>

            <NexBotAI />
        </main>
    )
}
