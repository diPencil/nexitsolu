"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { NexBotAI } from "@/components/nexbot-ai"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, Clock, Globe } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.552 4.197 1.6 6.037L0 24l6.105-1.605a11.774 11.774 0 005.94 1.605c6.634 0 12.048-5.414 12.048-12.05 0-3.212-1.25-6.232-3.522-8.505" />
    </svg>
);

export default function ContactPage() {
    const { lang } = useLanguage()

    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                setSent(true)
            } else {
                toast.error(lang === "ar" ? "حدث خطأ أثناء الإرسال" : "Failed to send message");
            }
        } catch (error) {
            toast.error(lang === "ar" ? "حدث خطأ غير متوقع" : "An unexpected error occurred");
        }
    }

    interface ContactSubItem {
        label: string;
        value?: string;
        href?: string;
    }

    interface ContactInfoItem {
        icon: any;
        title: string;
        items: ContactSubItem[];
        color: string;
        bg: string;
    }

    const contactInfo: ContactInfoItem[] = [
        {
            icon: Phone,
            title: lang === "ar" ? "اتصل بنا" : "Call Us",
            items: [
                {
                    label: lang === "ar" ? "فرع الغردقة" : "Hurghada Branch",
                    value: "+201031620990",
                    href: "tel:+201031620990"
                },
                {
                    label: lang === "ar" ? "فرع القاهرة" : "Cairo Branch",
                    value: "+201003778273",
                    href: "tel:+201003778273"
                }
            ],
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
        },
        {
            icon: Mail,
            title: lang === "ar" ? "راسلنا" : "Email Us",
            items: [
                { label: "info@nexitsolu.com", href: "mailto:info@nexitsolu.com" },
                { label: "sales@nexitsolu.com", href: "mailto:sales@nexitsolu.com" }
            ],
            color: "text-blue-400",
            bg: "bg-blue-400/10",
        },
        {
            icon: MapPin,
            title: lang === "ar" ? "نطاق الخدمة" : "Service Coverage",
            items: [
                { label: lang === "ar" ? "تغطية شاملة لجميع المحافظات" : "Nationwide Coverage" },
                { label: lang === "ar" ? "القاهرة، الغردقة، وكافة المدن." : "Cairo, Hurghada & all cities." }
            ],
            color: "text-rose-400",
            bg: "bg-rose-400/10",
        },
        {
            icon: Clock,
            title: lang === "ar" ? "ساعات العمل" : "Working Hours",
            items: [
                { label: lang === "ar" ? "على مدار الأسبوع" : "7 Days a week" },
                { label: lang === "ar" ? "24 ساعة يومياً" : "24 Hours daily" }
            ],
            color: "text-amber-400",
            bg: "bg-amber-400/10",
        },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen overflow-hidden">
            <PageHero
                title={lang === "ar" ? "تواصل معنا" : "Contact Us"}
                subtitle={lang === "ar" ? "نحن هنا للإجابة على كل استفساراتك ومساعدتك في أي وقت." : "We're here to answer all your questions and help you at any time."}
            />

            {/* Contact Cards */}
            <section className="py-16 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contactInfo.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -6 }}
                            className="group p-8 rounded-4xl bg-[#080808] border border-white/5 hover:border-white/10 hover:bg-[#111] transition-all duration-500 shadow-xl"
                        >
                            <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                <item.icon className={`w-7 h-7 ${item.color}`} />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-3">{item.title}</h3>
                            <div className="space-y-2">
                                {item.items.map((subItem, j) => (
                                    <div key={j} className="text-sm leading-relaxed">
                                        {'href' in subItem ? (
                                            <a
                                                href={subItem.href}
                                                className={`group/link flex ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'} items-center justify-start gap-2 hover:opacity-80 transition-opacity`}
                                                dir="ltr"
                                            >
                                                <span className="text-[#0066FF] font-bold whitespace-nowrap order-2">
                                                    {subItem.label}
                                                </span>
                                                {'value' in subItem && subItem.value && (
                                                    <span className="text-zinc-400 font-medium order-1" dir="ltr">{subItem.value}</span>
                                                )}
                                            </a>
                                        ) : (
                                            <p className="text-zinc-400">{subItem.label}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Form + Side Info */}
            <section id="contact-form" className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: lang === "ar" ? 40 : -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        className="relative p-10 md:p-14 rounded-4xl bg-[#080808] border border-white/5 shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066FF]/5 rounded-full blur-3xl pointer-events-none" />

                        {sent ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                                    <Send className="w-10 h-10 text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    {lang === "ar" ? "تم إرسال رسالتك!" : "Message Sent!"}
                                </h3>
                                <p className="text-zinc-400">
                                    {lang === "ar" ? "سيتواصل معك فريقنا قريباً." : "Our team will get back to you soon."}
                                </p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                    {lang === "ar" ? "أرسل لنا رسالة" : "Send Us a Message"}
                                </h2>
                                <p className="text-zinc-400 mb-10">
                                    {lang === "ar" ? "املأ النموذج وسنرد عليك في أقرب وقت." : "Fill the form and we'll reply as soon as possible."}
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-zinc-400 text-sm font-medium mb-2">
                                                {lang === "ar" ? "الاسم الكامل" : "Full Name"} <span className="text-[#0066FF]">*</span>
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                                placeholder={lang === "ar" ? "محمد أحمد" : "John Doe"}
                                                className="w-full bg-[#0e0e0e] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-zinc-600 focus:border-[#0066FF] transition-colors text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-zinc-400 text-sm font-medium mb-2">
                                                {lang === "ar" ? "البريد الإلكتروني" : "Email Address"} <span className="text-[#0066FF]">*</span>
                                            </label>
                                            <input
                                                required
                                                type="email"
                                                value={form.email}
                                                onChange={e => setForm({ ...form, email: e.target.value })}
                                                placeholder="example@company.com"
                                                className="w-full bg-[#0e0e0e] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-zinc-600 focus:border-[#0066FF] transition-colors text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-zinc-400 text-sm font-medium mb-2">
                                                {lang === "ar" ? "رقم الهاتف" : "Phone Number"}
                                            </label>
                                            <input
                                                type="tel"
                                                value={form.phone}
                                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                                placeholder="+20 103 162 0990"
                                                className="w-full bg-[#0e0e0e] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-zinc-600 focus:border-[#0066FF] transition-colors text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-zinc-400 text-sm font-medium mb-2">
                                                {lang === "ar" ? "موضوع الرسالة" : "Subject"}
                                            </label>
                                            <input
                                                type="text"
                                                value={form.subject}
                                                onChange={e => setForm({ ...form, subject: e.target.value })}
                                                placeholder={lang === "ar" ? "استفسار تقني" : "Technical inquiry"}
                                                className="w-full bg-[#0e0e0e] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-zinc-600 focus:border-[#0066FF] transition-colors text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-zinc-400 text-sm font-medium mb-2">
                                            {lang === "ar" ? "رسالتك" : "Your Message"} <span className="text-[#0066FF]">*</span>
                                        </label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={form.message}
                                            onChange={e => setForm({ ...form, message: e.target.value })}
                                            placeholder={lang === "ar" ? "اكتب رسالتك هنا..." : "Write your message here..."}
                                            className="w-full bg-[#0e0e0e] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-zinc-600 focus:border-[#0066FF] transition-colors text-sm resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-3 bg-[#0066FF] hover:bg-blue-500 text-white font-bold py-5 rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,102,255,0.4)] hover:scale-[1.02] active:scale-95 text-base"
                                    >
                                        <Send className="w-5 h-5" />
                                        {lang === "ar" ? "إرسال الرسالة" : "Send Message"}
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>

                    {/* Side Info */}
                    <motion.div
                        initial={{ opacity: 0, x: lang === "ar" ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="flex flex-col gap-8"
                    >
                        <div>
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066FF]/10 border border-[#0066FF]/20 rounded-full text-[#0066FF] text-sm font-bold mb-6">
                                <Globe className="w-4 h-4" />
                                {lang === "ar" ? "نخدمك في كل مكان" : "We serve you everywhere"}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                                {lang === "ar" ? "دعنا نبني " : "Let's build "}
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#0066FF] to-cyan-400">
                                    {lang === "ar" ? "مستقبلك الرقمي" : "your digital future"}
                                </span>
                            </h2>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                {lang === "ar"
                                    ? "فريق نكسيت يضم خبراء متخصصين مستعدون للإجابة على كل أسئلتك وتقديم أفضل الحلول التقنية المناسبة لمشروعك."
                                    : "The Nexit team includes specialized experts ready to answer all your questions and provide the best technical solutions suitable for your project."}
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-4">
                            <a href="mailto:info@nexitsolu.com" className="group flex items-center gap-5 p-6 rounded-3xl bg-[#080808] border border-white/5 hover:border-[#0066FF]/30 hover:bg-[#111] transition-all duration-500">
                                <div className="p-3 bg-blue-400/10 rounded-2xl">
                                    <Mail className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-white font-bold">{lang === "ar" ? "أرسل بريداً إلكترونياً" : "Send an Email"}</p>
                                    <p className="text-zinc-500 text-sm">info@nexitsolu.com</p>
                                </div>
                                <span className={`${lang === "ar" ? "mr-auto rotate-180" : "ml-auto"} text-zinc-600 group-hover:text-[#0066FF] transition-colors text-xl`}>→</span>
                            </a>

                            <a href="tel:+201031620990" className="group flex items-center gap-5 p-6 rounded-3xl bg-[#080808] border border-white/5 hover:border-emerald-400/30 hover:bg-[#111] transition-all duration-500">
                                <div className="p-3 bg-emerald-400/10 rounded-2xl">
                                    <Phone className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <p className="text-white font-bold">{lang === "ar" ? "فرع الغردقة" : "Hurghada Branch"}</p>
                                    <p className="text-zinc-500 text-sm" dir="ltr">+20 103 162 0990</p>
                                </div>
                                <span className={`${lang === "ar" ? "mr-auto rotate-180" : "ml-auto"} text-zinc-600 group-hover:text-emerald-400 transition-colors text-xl`}>→</span>
                            </a>

                            <a href="https://wa.me/201031620990" target="_blank" className="group flex items-center gap-5 p-6 rounded-3xl bg-[#080808] border border-white/5 hover:border-rose-400/30 hover:bg-[#111] transition-all duration-500">
                                <div className="p-3 bg-rose-400/10 rounded-2xl">
                                    <WhatsAppIcon className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-white font-bold">{lang === "ar" ? "تواصل عبر واتساب" : "Chat on WhatsApp"}</p>
                                    <p className="text-zinc-500 text-sm">{lang === "ar" ? "فرع الغردقة" : "Hurghada Branch"}</p>
                                </div>
                                <span className={`${lang === "ar" ? "mr-auto rotate-180" : "ml-auto"} text-zinc-600 group-hover:text-rose-400 transition-colors text-xl`}>→</span>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <NexBotAI />
        </main>
    )
}
