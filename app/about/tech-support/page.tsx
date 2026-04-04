"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion, AnimatePresence } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { useState } from "react"
import { Code2, Server, Globe, ShieldAlert, Send, Briefcase, Settings, CheckCircle2, Headphones, Sparkles, ArrowRight, Zap, LifeBuoy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"

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
        if (!selectedService) {
            toast.error(lang === 'ar' ? "يرجى اختيار نوع الخدمة" : "Please select a service type")
            return
        }
        
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
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-bg-primary min-h-screen text-text-primary overflow-hidden">
            <PageHero
                title={t("about_pages.tech_support.hero_title")}
                subtitle={t("about_pages.tech_support.hero_subtitle")}
            />

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center -mt-8 mb-12 flex flex-col items-center gap-3 relative z-20"
            >
                <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-bg-secondary/50 border border-border-color backdrop-blur-xl group hover:border-accent/40 transition-all duration-500">
                    <Send className={`w-4 h-4 text-accent animate-pulse ${lang === "ar" ? "rotate-180" : ""}`} />
                    <span className="text-sm md:text-base font-medium text-text-secondary">
                        {t("about_pages.tech_support.email_support_note")}
                    </span>
                    <a 
                        href={`mailto:${t("about_pages.tech_support.email_support_email")}`}
                        className="text-sm md:text-base font-black text-accent hover:underline decoration-accent/30 underline-offset-4 tracking-tighter"
                    >
                        {t("about_pages.tech_support.email_support_email")}
                    </a>
                </div>
            </motion.div>

            {/* Service Selection Section */}
            <PageSection title={t("about_pages.tech_support.select_service")}>
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8 pt-12">
                    {services.map((service, i) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <button
                                onClick={() => setSelectedService(service.id)}
                                className="w-full h-full block group outline-none focus:ring-0"
                            >
                                <Card className={`h-full p-8 border-2 transition-all duration-700 flex flex-col items-center text-center gap-6 relative overflow-hidden rounded-4xl ${selectedService === service.id
                                    ? "ring-4 ring-accent/10 border-accent bg-accent/5 shadow-4xl"
                                    : "bg-bg-secondary/20 border-border-color hover:border-accent/40"
                                    }`}>
                                    <div className={`w-16 h-16 rounded-2xl transition-all duration-700 border-2 flex items-center justify-center ${selectedService === service.id 
                                        ? "bg-accent text-white border-accent shadow-xl rotate-12" 
                                        : "bg-bg-primary text-accent border-border-color group-hover:bg-accent group-hover:text-white group-hover:border-accent group-hover:-rotate-12 group-hover:scale-110"
                                        }`}>
                                        <service.icon className="w-8 h-8" />
                                    </div>
                                    <span className={`text-sm md:text-base font-black transition-colors duration-500 uppercase tracking-tighter leading-tight ${selectedService === service.id ? "text-accent" : "text-text-primary group-hover:text-accent"}`}>
                                        {service.label}
                                    </span>
                                    {selectedService === service.id && (
                                        <motion.div 
                                            layoutId="selected-indicator"
                                            className="absolute top-4 right-4 text-accent"
                                        >
                                            <CheckCircle2 className="w-6 h-6" />
                                        </motion.div>
                                    )}
                                </Card>
                            </button>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Dynamic Form Section */}
            <AnimatePresence mode="wait">
                {selectedService && (
                    <PageSection className="pb-32!">
                        <motion.div
                            key={selectedService}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            transition={{ duration: 0.6, ease: "circOut" }}
                            className="max-w-4xl mx-auto"
                        >
                            <Card className="p-10 md:p-16 lg:p-20 border-border-color bg-bg-secondary/40 backdrop-blur-3xl shadow-4xl relative overflow-hidden rounded-[3.5rem] group">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-accent/10 transition-all duration-1000" />
                                
                                {success ? (
                                    <div className="text-center py-20 space-y-10 flex flex-col items-center">
                                        <motion.div 
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="w-32 h-32 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-emerald-500/20 shadow-4xl relative shadow-emerald-500/10"
                                        >
                                            <div className="absolute inset-0 bg-emerald-500/20 rounded-[2.5rem] blur-2xl animate-pulse" />
                                            <CheckCircle2 className="w-16 h-16 text-emerald-500 relative z-10" />
                                        </motion.div>
                                        <div className="space-y-4">
                                            <h3 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter uppercase whitespace-nowrap">
                                                {lang === "ar" ? "تم استلام الطلب!" : "Request Active!"}
                                            </h3>
                                            <p className="text-text-secondary text-xl font-medium max-w-lg mx-auto leading-relaxed opacity-80">
                                                {lang === "ar" ? "سيقوم فريق الدعم الفني بالتواصل معك قريباً لمعالجة طلبك عبر الهاتف أو البريد الإلكتروني." : "Our rapid response team has been notified. We will reach out via your preferred channel shortly."}
                                            </p>
                                        </div>
                                        <Button 
                                            onClick={() => setSuccess(false)}
                                            className="bg-accent hover:bg-accent/90 text-white rounded-2xl px-12 py-8 font-black text-sm uppercase tracking-widest shadow-2xl shadow-accent/20 hover:scale-105 transition-transform"
                                        >
                                            {lang === "ar" ? "إرسال طلب آخر" : "New Transmission"}
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-col md:flex-row md:items-center gap-8 mb-16 pb-12 border-b border-border-color/50">
                                            <div className="w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center text-accent border-2 border-accent/20 shadow-3xl">
                                                <LifeBuoy className="w-10 h-10 animate-spin-slow" />
                                            </div>
                                            <div>
                                                <h3 className="text-4xl font-black text-text-primary tracking-tighter uppercase leading-none mb-3">
                                                    {t("about_pages.tech_support.form_title")}
                                                </h3>
                                                <p className="text-text-secondary text-lg font-medium opacity-60">
                                                    {lang === "ar" ? "يرجى تعبئة التفاصيل أدناه بدقة لضمان استجابة فورية." : "Initialize detailed diagnostic input for rapid deployment."}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <form className="space-y-10" onSubmit={handleSubmit}>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-text-secondary uppercase tracking-[0.3em] px-2">{lang === "ar" ? "الاسم الكامل" : "Agent Name"} <span className="text-accent">*</span></label>
                                                    <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={lang === "ar" ? "أدخل اسمك" : "Full legal name..."} className="bg-bg-primary border-2 border-border-color rounded-2xl h-20 px-8 text-lg font-bold focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all" />
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-text-secondary uppercase tracking-[0.3em] px-2">{lang === "ar" ? "البريد الإلكتروني" : "Comm Link"} <span className="text-accent">*</span></label>
                                                    <Input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@nexus.com" className="bg-bg-primary border-2 border-border-color rounded-2xl h-20 px-8 text-lg font-bold focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all" />
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-text-secondary uppercase tracking-[0.3em] px-2">{lang === "ar" ? "رقم الهاتف" : "Direct Ph"}</label>
                                                    <Input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+00 000 000 0000" className="bg-bg-primary border-2 border-border-color rounded-2xl h-20 px-8 text-lg font-bold focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all text-start" dir="ltr" />
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-text-secondary uppercase tracking-[0.3em] px-2">{lang === "ar" ? "رقم الواتساب" : "WhatsApp"}</label>
                                                    <Input type="tel" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="+00 000 000 0000" className="bg-bg-primary border-2 border-border-color rounded-2xl h-20 px-8 text-lg font-bold focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all text-start" dir="ltr" />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-xs font-black text-text-secondary uppercase tracking-[0.3em] px-2">{lang === 'ar' ? 'وصف المشكلة التقنية' : 'Diagnostic Overview' } <span className="text-accent">*</span></label>
                                                <Textarea
                                                    required
                                                    value={form.message}
                                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                                    placeholder={t("about_pages.tech_support.form_placeholder")}
                                                    className="bg-bg-primary border-2 border-border-color rounded-3xl min-h-[220px] p-8 text-lg font-bold focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all resize-none"
                                                />
                                            </div>
                                            <Button disabled={submitting} type="submit" className="w-full bg-accent hover:bg-accent/90 text-white rounded-3xl py-10 text-sm font-black uppercase tracking-[0.4em] transition-all shadow-4xl shadow-accent/20 group disabled:opacity-50 active:scale-[0.98]">
                                                {submitting ? (lang === "ar" ? "جاري الإرسال..." : "Transmitting Data...") : (lang === "ar" ? "إرسال طلب الدعم" : "Deploy Support Request")}
                                                {!submitting && <Send className={`ms-4 w-6 h-6 transition-transform group-hover:translate-x-3 group-hover:-translate-y-3 ${lang === "ar" ? "rotate-180" : ""}`} />}
                                            </Button>
                                        </form>
                                    </>
                                )}
                            </Card>
                        </motion.div>
                    </PageSection>
                )}
            </AnimatePresence>

            {/* Professional Workflow Section */}
            <PageSection title={lang === "ar" ? "بروتوكول المعالجة" : "Operational Protocol"} className="bg-bg-secondary/30 border-y border-border-color pt-40! pb-60! relative">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_50%_0%,rgba(0,102,255,0.05),transparent_70%)] pointer-events-none" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10 pt-16">
                    <div className="hidden lg:block absolute top-[60px] left-20 right-20 h-0.5 bg-accent/20 z-0" />

                    {[
                        { step: "01", title: lang === "ar" ? "تقديم الطلب" : "Ingest", desc: lang === "ar" ? "قم باختيار الخدمة ووصف المشكلة بالتفصيل." : "Primary data collection and scope definition." },
                        { step: "02", title: lang === "ar" ? "المراجعة" : "Analyze", desc: lang === "ar" ? "يقوم فريقنا بمراجعة طلبك وتحديد الأولويات." : "Expert triage and priority matrix assignment." },
                        { step: "03", title: lang === "ar" ? "التنفيذ" : "Execute", desc: lang === "ar" ? "نبدأ في العمل على حل المشكلة بأسرع وقت." : "Rapid technical deployment and resolution." },
                        { step: "04", title: lang === "ar" ? "الاختبار والتسليم" : "Verify", desc: lang === "ar" ? "نتأكد من كفاءة الحل ونقوم بتسليمه لك." : "Quality assurance and final hand-off." },
                    ].map((item, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative z-10 flex flex-col items-center text-center group"
                        >
                            <div className="w-24 h-24 rounded-4xl bg-bg-primary border-2 border-border-color text-accent flex items-center justify-center text-3xl font-black mb-10 group-hover:-translate-y-4 group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-700 shadow-2xl group-hover:rotate-12">
                                {item.step}
                            </div>
                            <h3 className="text-2xl font-black text-text-primary mb-6 tracking-tighter group-hover:text-accent transition-colors uppercase">{item.title}</h3>
                            <p className="text-text-secondary text-sm md:text-lg leading-relaxed max-w-[260px] mx-auto font-medium opacity-70 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
