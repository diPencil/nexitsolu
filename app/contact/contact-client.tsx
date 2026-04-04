"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { NexBotAI } from "@/components/nexbot-ai"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, Clock, Globe, ArrowUpRight, Zap, ShieldCheck, Headphones, MessageSquare } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.552 4.197 1.6 6.037L0 24l6.105-1.605a11.774 11.774 0 005.94 1.605c6.634 0 12.048-5.414 12.048-12.05 0-3.212-1.25-6.232-3.522-8.505" />
    </svg>
);

export default function ContactPage() {
    const { lang, t } = useLanguage()
    const isAr = lang === "ar"

    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
    const [sent, setSent] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                setSent(true)
                toast.success(lang === "ar" ? "تم إرسال رسالتك بنجاح!" : "Message sent successfully!")
            } else {
                toast.error(lang === "ar" ? "حدث خطأ أثناء الإرسال" : "Failed to send message");
            }
        } catch (error) {
            toast.error(lang === "ar" ? "حدث خطأ غير متوقع" : "An unexpected error occurred");
        } finally {
            setSubmitting(false)
        }
    }

    interface ContactSubItem {
        label: string;
        value?: string;
        href?: string;
    }

    interface ContactItem {
        icon: any;
        title: string;
        items: ContactSubItem[];
        accent: string;
    }

    const contactInfo: ContactItem[] = [
        {
            icon: Phone,
            title: lang === "ar" ? "اتصل بنا" : "Call Center",
            items: [
                { label: lang === "ar" ? "فرع الغردقة" : "Hurghada HQ", value: "+201031620990", href: "tel:+201031620990" },
                { label: lang === "ar" ? "فرع القاهرة" : "Cairo Office", value: "+201003778273", href: "tel:+201003778273" }
            ],
            accent: "accent"
        },
        {
            icon: Mail,
            title: lang === "ar" ? "راسلنا" : "Electronic Mail",
            items: [
                { label: "info@nexitsolu.com", href: "mailto:info@nexitsolu.com" },
                { label: "sales@nexitsolu.com", href: "mailto:sales@nexitsolu.com" }
            ],
            accent: "blue-500"
        },
        {
            icon: MapPin,
            title: lang === "ar" ? "نطاق الخدمة" : "Operational Zone",
            items: [
                { label: lang === "ar" ? "تغطية شاملة للمحافظات" : "Nationwide Coverage" },
                { label: lang === "ar" ? "القاهرة، الغردقة، وكافة المدن" : "Cairo, Hurghada & Global" }
            ],
            accent: "emerald-500"
        },
        {
            icon: Clock,
            title: lang === "ar" ? "ساعات العمل" : "Live Availability",
            items: [
                { label: lang === "ar" ? "على مدار الأسبوع" : "7 Days a week" },
                { label: lang === "ar" ? "24 ساعة يومياً" : "24/7 Deployment" }
            ],
            accent: "amber-500"
        },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-bg-primary min-h-screen text-text-primary overflow-hidden">
            <PageHero
                title={lang === "ar" ? "تواصل مع الخبراء" : "Contact the Core"}
                subtitle={lang === "ar" ? "نحن هنا للإجابة على كل استفساراتك ومساعدتك في بناء مستقبلك الرقمي." : "Initialize a direct link to our expert consultants and start your digital evolution."}
            />

            {/* Tactical Contact Hub */}
            <PageSection className="pb-32!">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 pt-16">
                    {contactInfo.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="group p-10 rounded-[3rem] bg-bg-secondary/20 border-2 border-border-color hover:border-accent/40 transition-all duration-700 shadow-2xl hover:shadow-4xl relative overflow-hidden h-full">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className={`w-16 h-16 rounded-2xl bg-bg-primary border-2 border-border-color flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white transition-all duration-700 shadow-xl group-hover:scale-110 group-hover:-rotate-12`}>
                                    <item.icon className="w-8 h-8 text-accent group-hover:text-white transition-colors" />
                                </div>
                                
                                <h3 className="text-xl font-black text-text-primary mb-6 uppercase tracking-tighter group-hover:text-accent transition-colors">{item.title}</h3>
                                
                                <div className="space-y-4">
                                    {item.items.map((subItem, j) => (
                                        <div key={j} className="text-sm font-bold tracking-tight">
                                            {'href' in subItem ? (
                                                <a
                                                    href={subItem.href}
                                                    className="group/link flex flex-col items-start gap-1 hover:opacity-80 transition-opacity"
                                                >
                                                    <span className="text-text-secondary opacity-60 text-[10px] uppercase tracking-widest">{subItem.label}</span>
                                                    <span className="text-accent text-lg font-black tracking-tighter" dir="ltr">
                                                        {subItem.value || subItem.label}
                                                    </span>
                                                </a>
                                            ) : (
                                                <div className="flex flex-col items-start gap-1">
                                                    <span className="text-text-secondary opacity-60 text-[10px] uppercase tracking-widest">{subItem.label}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            {/* Strategic Information Split */}
            <PageSection className="bg-bg-secondary/30 border-y border-border-color py-40!" columns={2}>
                 {/* Communication Side */}
                 <div className="flex flex-col justify-center order-2 lg:order-1 lg:pe-24 space-y-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black tracking-[0.3em] uppercase mb-10 shadow-xl">
                            <Globe className="w-4 h-4" />
                            {lang === "ar" ? "نخدمك في كل مكان" : "Global Reach Core"}
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-12 tracking-tighter leading-[0.95] uppercase">
                            {lang === "ar" ? "دعنا نبني " : "Let's build "}<br/>
                            <span className="text-accent">{lang === "ar" ? "مستقبلك الرقمي" : "your digital future"}</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-text-secondary leading-relaxed mb-16 max-w-2xl font-medium opacity-80">
                            {lang === "ar"
                                ? "فريق نكسيت يضم خبراء متخصصين مستعدون للإجابة على كل أسئلتك وتقديم أفضل الحلول التقنية المناسبة لمشروعك."
                                : "The Nexit engine is manned by domain specialists ready to decode your technical requirements and deploy the optimal enterprise-grade solutions."}
                        </p>

                        <div className="space-y-6">
                            {[
                                { icon: Mail, label: lang === 'ar' ? "أرسل بريداً إلكترونياً" : "Direct Transmission", val: "info@nexitsolu.com", href: "mailto:info@nexitsolu.com" },
                                { icon: MessageSquare, label: lang === 'ar' ? "تواصل عبر واتساب" : "WhatsApp Priority", val: "+201031620990", href: "https://wa.me/201031620990" }
                            ].map((action, idx) => (
                                <Link key={idx} href={action.href} className="group/action block">
                                    <div className="flex items-center gap-6 p-8 rounded-4xl bg-bg-primary border-2 border-border-color group-hover/action:border-accent transition-all duration-700 shadow-2xl">
                                        <div className="w-14 h-14 rounded-2xl bg-accent/5 flex items-center justify-center text-accent group-hover/action:bg-accent group-hover/action:text-white transition-all duration-700">
                                            <action.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary opacity-60">{action.label}</span>
                                            <span className="text-xl font-black text-text-primary tracking-tighter" dir="ltr">{action.val}</span>
                                        </div>
                                        <ArrowUpRight className="ms-auto w-6 h-6 text-text-secondary opacity-20 group-hover/action:text-accent group-hover/action:opacity-100 group-hover/action:translate-x-1 group-hover/action:-translate-y-1 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Secure Form Side */}
                <div className="relative order-1 lg:order-2">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Card className="p-10 md:p-14 lg:p-16 border-2 border-border-color bg-bg-secondary/40 backdrop-blur-3xl shadow-4xl relative overflow-hidden rounded-[4rem] group ring-8 ring-bg-primary/50">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
                            
                            {sent ? (
                                <div className="text-center py-24 space-y-10 flex flex-col items-center">
                                    <motion.div 
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-32 h-32 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-emerald-500/20 shadow-4xl relative"
                                    >
                                        <Send className="w-16 h-16 text-emerald-500 relative z-10" />
                                    </motion.div>
                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-black text-text-primary tracking-tighter uppercase">
                                            {isAr ? "تم الإرسال بنجاح!" : "Signal Locked!"}
                                        </h3>
                                        <p className="text-text-secondary text-xl font-medium max-w-sm mx-auto leading-relaxed">
                                            {isAr ? "سيتواصل معك فريقنا في أقرب وقت ممكن." : "Your data has been successfully transmitted. A consultant will reach out shortly."}
                                        </p>
                                    </div>
                                    <Button onClick={() => setSent(false)} className="bg-accent text-white rounded-2xl px-12 py-8 font-black text-sm uppercase tracking-widest shadow-2xl">
                                        {isAr ? "إرسال رسالة أخرى" : "New Transmission"}
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-14 space-y-4">
                                        <span className="text-accent text-[10px] font-black tracking-[0.4em] uppercase">{isAr ? "تواصل معي" : "Secure Inbound Channel"}</span>
                                        <h2 className="text-4xl lg:text-5xl font-black text-text-primary tracking-tighter uppercase leading-none">
                                            {isAr ? "أرسل رسالة" : "Send Intel"}
                                        </h2>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-2">{isAr ? "الاسم" : "Full Name"} <span className="text-accent">*</span></label>
                                                <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Agent Name..." className="bg-bg-primary border-2 border-border-color rounded-2xl h-16 px-6 text-lg font-bold focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-2">{isAr ? "البريد الإلكتروني" : "Comm Link"} <span className="text-accent">*</span></label>
                                                <Input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@nexus.com" className="bg-bg-primary border-2 border-border-color rounded-2xl h-16 px-6 text-lg font-bold focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all" />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-2">{isAr ? "الموضوع" : "Mission Objective"}</label>
                                            <Input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Technical inquiry..." className="bg-bg-primary border-2 border-border-color rounded-2xl h-16 px-6 text-lg font-bold focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all" />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-2">{isAr ? "الرسالة" : "Diagnostic Text"} <span className="text-accent">*</span></label>
                                            <Textarea
                                                required
                                                rows={5}
                                                value={form.message}
                                                onChange={e => setForm({ ...form, message: e.target.value })}
                                                placeholder={isAr ? "كيف يمكننا مساعدتك؟" : "Describe your project scale and goals..."}
                                                className="bg-bg-primary border-2 border-border-color rounded-3xl min-h-[180px] p-6 text-lg font-bold focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all resize-none"
                                            />
                                        </div>

                                        <Button disabled={submitting} type="submit" className="w-full bg-accent hover:bg-accent/90 text-white rounded-3xl py-10 text-sm font-black uppercase tracking-[0.4em] transition-all shadow-4xl shadow-accent/20 group disabled:opacity-50 active:scale-[0.98]">
                                            {submitting ? (isAr ? "جاري الإرسال..." : "Transmitting...") : (isAr ? "إرسال الرسالة" : "Blast Transmission")}
                                            {!submitting && <Send className={`ms-4 w-6 h-6 transition-transform group-hover:translate-x-3 group-hover:-translate-y-3 ${isAr ? "rotate-180" : ""}`} />}
                                        </Button>
                                    </form>
                                </>
                            )}
                        </Card>
                    </motion.div>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
