"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion, AnimatePresence } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { useState } from "react"
import { Code2, Server, Globe, ShieldAlert, Send, Briefcase, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function TechSupport() {
    const { lang, t } = useLanguage()
    const [selectedService, setSelectedService] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        whatsapp: "",
        message: ""
    })

    const services = [
        { id: "software", icon: Code2, label: t("about_pages.tech_support.options.software") },
        { id: "infrastructure", icon: Server, label: t("about_pages.tech_support.options.infrastructure") },
        { id: "hosting", icon: Globe, label: t("about_pages.tech_support.options.hosting") },
        { id: "security", icon: ShieldAlert, label: t("about_pages.tech_support.options.security") },
        { id: "managed_it", icon: Settings, label: t("about_pages.tech_support.options.managed_it") },
        { id: "consulting", icon: Briefcase, label: t("about_pages.tech_support.options.consulting") },
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedService) return
        
        setSubmitting(true)
        try {
            const res = await fetch("/api/tech-support", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    supportType: selectedService
                })
            })

            if (res.ok) {
                setSuccess(true)
                toast.success(lang === "ar" ? "تم إرسال طلب الدعم الفني بنجاح!" : "Tech support request submitted successfully!")
            } else {
                toast.error(lang === "ar" ? "حدث خطأ" : "Failed to submit request")
            }
        } catch {
            toast.error(lang === "ar" ? "تأكد من الاتصال بالإنترنت" : "Network error, please try again")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen">
            <PageHero
                title={t("about_pages.tech_support.hero_title")}
                subtitle={t("about_pages.tech_support.hero_subtitle")}
            />

            <PageSection title={t("about_pages.tech_support.select_service")}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {services.map((service) => (
                        <motion.button
                            key={service.id}
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedService(service.id)}
                            className={`p-8 rounded-4xl border transition-all duration-300 flex flex-col items-center text-center gap-6 ${selectedService === service.id
                                ? "bg-[#0066FF] border-[#0066FF] shadow-[0_0_30px_rgba(0,102,255,0.4)]"
                                : "bg-white/5 border-white/10 hover:border-white/20"
                                }`}
                        >
                            <div className={`p-4 rounded-2xl ${selectedService === service.id ? "bg-white/20" : "bg-[#0066FF]/10 text-[#0066FF]"}`}>
                                <service.icon className="w-8 h-8" />
                            </div>
                            <span className={`font-medium ${selectedService === service.id ? "text-white" : "text-zinc-300"}`}>
                                {service.label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </PageSection>

            <AnimatePresence mode="wait">
                {selectedService && (
                    <motion.div
                        key={selectedService}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="pb-32 px-6"
                    >
                        <div className="max-w-3xl mx-auto p-8 md:p-12 rounded-4xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            {success ? (
                                <div className="text-center py-10 space-y-4">
                                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Send className="w-10 h-10 text-emerald-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">
                                        {lang === "ar" ? "تم استلام الطلب!" : "Request Received!"}
                                    </h3>
                                    <p className="text-zinc-400">
                                        {lang === "ar" ? "سيقوم فريق الدعم الفني بالتواصل معك قريباً لمعالجة طلبك." : "Our technical support team will contact you soon regarding your request."}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-medium mb-8 text-white">{t("about_pages.tech_support.form_title")}</h3>
                                    <form className="space-y-6" onSubmit={handleSubmit}>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm text-zinc-400">{lang === "ar" ? "الاسم الكامل" : "Full Name"} <span className="text-[#0066FF]">*</span></label>
                                                <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={lang === "ar" ? "أدخل اسمك" : "Enter name"} className="bg-white/5 border-white/10 rounded-xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-zinc-400">{lang === "ar" ? "البريد الإلكتروني" : "Email Address"} <span className="text-[#0066FF]">*</span></label>
                                                <Input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" className="bg-white/5 border-white/10 rounded-xl" />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm text-zinc-400">{lang === "ar" ? "رقم الهاتف" : "Phone Number"}</label>
                                                <Input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+20 100 000 0000" className="bg-white/5 border-white/10 rounded-xl text-start" dir="ltr" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-zinc-400">{lang === "ar" ? "رقم الواتساب" : "WhatsApp Number"}</label>
                                                <Input type="tel" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="+20 100 000 0000" className="bg-white/5 border-white/10 rounded-xl text-start" dir="ltr" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-zinc-400">{t("about_pages.tech_support.form_title")} <span className="text-[#0066FF]">*</span></label>
                                            <Textarea
                                                required
                                                value={form.message}
                                                onChange={e => setForm({ ...form, message: e.target.value })}
                                                placeholder={t("about_pages.tech_support.form_placeholder")}
                                                className="bg-white/5 border-white/10 rounded-2xl min-h-[150px]"
                                            />
                                        </div>
                                        <Button disabled={submitting} type="submit" size="lg" className="w-full bg-[#0066FF] hover:bg-[#0052CC] rounded-full py-6 group disabled:opacity-50">
                                            {submitting ? (lang === "ar" ? "جاري الإرسال..." : "Submitting...") : (lang === "ar" ? "إرسال الطلب" : "Submit Request")}
                                            {!submitting && <Send className={`ms-2 w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${lang === "ar" ? "rotate-180" : ""}`} />}
                                        </Button>
                                    </form>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* How It Works Section */}
            <PageSection title={lang === "ar" ? "كيف نعمل؟" : "How It Works"} className="bg-white/3 border-y border-white/5 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-linear-to-r from-[#0066FF]/10 via-[#0066FF]/50 to-[#0066FF]/10 -translate-y-1/2 z-0" />

                    {[
                        { step: "01", title: lang === "ar" ? "تقديم الطلب" : "Submit Request", desc: lang === "ar" ? "قم باختيار الخدمة ووصف المشكلة بالتفصيل." : "Select the service and describe the issue in detail." },
                        { step: "02", title: lang === "ar" ? "المراجعة" : "Review", desc: lang === "ar" ? "يقوم فريقنا بمراجعة طلبك وتحديد الأولويات." : "Our team reviews your request and sets priorities." },
                        { step: "03", title: lang === "ar" ? "التنفيذ" : "Execution", desc: lang === "ar" ? "نبدأ في العمل على حل المشكلة بأسرع وقت." : "We start working on solving the issue ASAP." },
                        { step: "04", title: lang === "ar" ? "الاختبار والتسليم" : "Test & Delivery", desc: lang === "ar" ? "نتأكد من كفاءة الحل ونقوم بتسليمه لك." : "We ensure the efficiency of the solution and deliver it." },
                    ].map((item, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-full bg-[#111] border-2 border-[#0066FF] text-[#0066FF] flex items-center justify-center text-xl font-black mb-6 group-hover:scale-110 group-hover:bg-[#0066FF] group-hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(0,102,255,0.2)]">
                                {item.step}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
