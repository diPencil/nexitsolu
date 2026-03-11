"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signIn } from "next-auth/react"
import Link from "next/link"
import {
    Building2, Clock, Calendar, ShieldCheck,
    Briefcase, MessageSquare, ArrowRight, CheckCircle2,
    Monitor, Cpu, Globe, Zap, Users, UserCheck, ArrowLeft,
    Lock, ShieldAlert
} from "lucide-react"
import { NexBotAI } from "@/components/nexbot-ai"
import { useRouter } from "next/navigation"

export default function ManagedITClient() {
    const { lang, t } = useLanguage()
    const { data: session, status } = useSession()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        companyName: "",
        industry: "",
        services: [] as string[],
        model: "remote", // remote, part-time, full-time
        days: "5",
        hours: "8",
        contactName: "",
        email: "",
        phone: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [requestId, setRequestId] = useState<string | null>(null)
    const isCorporate = (session?.user as any)?.role === 'COMPANY' || (session?.user as any)?.role === 'ADMIN'

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            const user = session.user as any;
            setFormData(prev => ({
                ...prev,
                companyName: user.username || user.name || "",
                contactName: user.name || "",
                email: user.email || "",
                phone: user.phone || ""
            }))
        }
    }, [session, status])

    const serviceOptions = [
        { id: "infra", label: lang === "ar" ? "إدارة البنية التحتية" : "Infrastructure Management", icon: Cpu },
        { id: "cyber", label: lang === "ar" ? "الأمن السيبراني" : "Cybersecurity Support", icon: ShieldCheck },
        { id: "helpdesk", label: lang === "ar" ? "دعم المستخدمين (Helpdesk)" : "Employee Helpdesk", icon: Users },
        { id: "cloud", label: lang === "ar" ? "إدارة السحابة" : "Cloud Management", icon: Globe },
        { id: "network", label: lang === "ar" ? "إدارة الشبكات" : "Network Administration", icon: Zap },
        { id: "devops", label: lang === "ar" ? "صيانة الأنظمة والبرمجيات" : "Software Maintenance", icon: Monitor },
    ]

    const nextStep = () => setStep(s => s + 1)
    const prevStep = () => setStep(s => s - 1)

    const toggleService = (id: string) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(id)
                ? prev.services.filter(s => s !== id)
                : [...prev.services, id]
        }))
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const res = await fetch("/api/managed-it", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                const data = await res.json()
                setRequestId(data.id)
                // If it was a guest submission, log them in automatically
                if (status !== 'authenticated') {
                    await signIn('credentials', {
                        email: formData.email,
                        password: "NexitGuest123!",
                        redirect: false
                    });
                }
                setIsSuccess(true)
            } else {
                alert(lang === 'ar' ? "فشل إرسال الطلب، تأكد من تسجيل الدخول كشركة." : "Failed to submit. Ensure you are logged in as a Company.")
            }
        } catch (error) {
            console.error("Submission error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen text-white">
            <div className="mx-4 md:mx-6 md:max-w-7xl lg:mx-auto pt-32 mt-4 mb-6 md:mt-8 md:mb-8">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                    <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180 ml-2' : 'mr-2'}`} />
                    {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                </Link>
            </div>

            {/* Custom Corporate Hero Section similar to Store Hero */}
            <div className="relative rounded-4xl md:rounded-[3rem] bg-zinc-950 border border-white/5 hover:border-[#0066FF]/50 hover:shadow-[0_0_80px_rgba(0,102,255,0.15)] transition-all duration-700 p-8 md:p-12 lg:p-16 mb-12 overflow-hidden mx-4 md:mx-6 md:max-w-7xl lg:mx-auto group">
                {/* Animated Blur Backgrounds */}
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-24 -left-24 w-96 h-96 bg-[#0066FF]/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#0066FF]/30 transition-colors duration-700"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, -30, 0],
                        scale: [1, 1.5, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#0066FF]/15 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#0066FF]/25 transition-colors duration-700"
                />

                <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10 w-full">
                    <div className="relative z-10 max-w-2xl">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-[#0066FF]/10 text-[#0066FF] text-xs font-bold tracking-widest uppercase mb-6">
                            {lang === 'ar' ? 'بوابة الشركات (B2B)' : 'Corporate Portal (B2B)'}
                        </span>
                        <h1 className="text-[26px] md:text-[34px] lg:text-[42px] font-semibold text-white mb-4 tracking-tight leading-tight">
                            {lang === 'ar' ? 'حلول الدعم المؤسسي' : 'Managed IT & Enterprise Solutions'}
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-8">
                            {lang === 'ar' ? 'قسّم فريق تقنية المعلومات الخاص بك حسب احتياجك. نوفر لك كوادر متخصصة لإدارة بنيتك التحتية بكفاءة عالمية.' : 'Your dedicated IT department. Scale your support team based on your business needs with our professional managed services.'}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                            <span className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                {lang === 'ar' ? 'اشتراكات للشركات' : 'Corporate Subscriptions'}
                            </span>
                            <span className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                {lang === 'ar' ? 'حساب خاص بك' : 'Private Dashboard'}
                            </span>
                            <span className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                {lang === 'ar' ? 'وصول لمتجر نكست' : 'Nexit Store Access'}
                            </span>
                        </div>
                    </div>

                    {/* Auth / Profile */}
                    <div className="flex flex-col gap-4 z-20 items-center md:items-end w-full md:w-auto mt-6 md:mt-0">
                        {status === 'authenticated' ? (
                            <div className="flex flex-col items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm min-w-[180px]">
                                <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#0066FF] to-purple-600 flex items-center justify-center font-bold text-xl text-white">
                                    {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-white">{session?.user?.name}</p>
                                    <p className="text-[10px] text-zinc-500">{session?.user?.email}</p>
                                </div>
                                <Link
                                    href={(session?.user as any)?.role === 'ADMIN' ? '/admin' : '/profile'}
                                    className="w-full px-4 py-2 rounded-full bg-[#0066FF] text-white text-xs font-bold text-center hover:bg-blue-600 transition-all"
                                >
                                    {(session?.user as any)?.role === 'ADMIN'
                                        ? (lang === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard')
                                        : (lang === 'ar' ? 'الداشبورد الخاصة' : 'Private Dashboard')
                                    }
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center md:items-end w-full bg-black/40 border border-white/5 p-6 rounded-2xl backdrop-blur-xl">
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest text-center md:text-right mb-4">
                                    {lang === 'ar' ? 'بوابة الشركات الخاصة' : 'Private Corporate Portal'}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 w-full">
                                    <Link href="/login" className="w-full sm:w-auto">
                                        <button className="w-full px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 hover:border-white/20 transition-all text-sm font-medium">
                                            {lang === 'ar' ? 'دخول الشركات' : 'Company Login'}
                                        </button>
                                    </Link>
                                    <Link href="/register/corporate" className="w-full sm:w-auto">
                                        <button className="w-full px-6 py-2.5 rounded-full bg-[#0066FF] text-white hover:bg-blue-600 transition-all text-sm font-medium shadow-[0_0_20px_rgba(0,102,255,0.4)] whitespace-nowrap">
                                            {lang === 'ar' ? 'إنشاء حساب جديد' : 'Register'}
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="flex justify-center -mt-6 -mb-4 relative z-10 w-full animate-bounce">
                <div onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })} className="flex flex-col items-center gap-2 cursor-pointer text-zinc-500 hover:text-white transition-colors">
                    <span className="text-xs font-bold uppercase tracking-widest">{lang === 'ar' ? 'اطلب الخدمة الآن' : 'Request Service Below'}</span>
                    <div className="p-3 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 rotate-90" />
                    </div>
                </div>
            </div>

            <PageSection className="pt-12! md:pt-16!">
                <div className="grid lg:grid-cols-3 gap-12 items-stretch">

                    {/* Left: Info & Features */}
                    <div className="lg:col-span-1 h-full flex flex-col space-y-8">
                        <div className="p-8 rounded-4xl bg-zinc-950 border border-white/5 space-y-6 flex-1">
                            <h3 className="text-2xl font-bold text-[#0066FF]">
                                {lang === "ar" ? "لماذا التعاقد مع NexIT؟" : "Why NexIT Managed Services?"}
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { title: lang === "ar" ? "توفير التكاليف" : "Cost Efficiency", desc: lang === "ar" ? "وفر تكاليف التوظيف والتجهيزات واحصل على فريق كامل بسعر موظف واحد." : "Save on recruitment and overhead costs while getting an entire team's expertise." },
                                    { title: lang === "ar" ? "استجابة فورية" : "SLA Guarantee", desc: lang === "ar" ? "نلتزم باتفاقية مستوى خدمة تضمن لك حل المشاكل في دقائق." : "Guaranteed response times to keep your operations running smoothly." },
                                    { title: lang === "ar" ? "خبراء معتمدين" : "Expert Access", desc: lang === "ar" ? "وصول مباشر لخبراء في مختلف المجالات التقنية دون الحاجة لتدريب." : "Direct access to senior talent across multiple domains instantly." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-[#0066FF]" /></div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white mb-1">{item.title}</h4>
                                            <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visual Badge */}
                        <div className="p-8 rounded-4xl bg-[#0066FF]/5 border border-[#0066FF]/20 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-[#0066FF] flex items-center justify-center shadow-[0_0_30px_rgba(0,102,255,0.3)]">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h4 className="font-black text-xl leading-tight">ISO 27001</h4>
                                <p className="text-zinc-500 text-xs uppercase tracking-widest">{lang === 'ar' ? 'معايير أمن دولية' : 'Security Standards'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Dynamic Multi-step Form or Restricted Access */}
                    <div className="lg:col-span-2 h-full">
                        {(status === 'unauthenticated' || isCorporate) ? (
                            <div className="bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl h-full">
                                {/* Form Header / Progress */}
                                {!isSuccess && (
                                    <div className="bg-zinc-900/50 p-6 md:p-8 flex items-center justify-between border-b border-white/5">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#0066FF] mb-1 block">
                                                {lang === 'ar' ? `الخطوة ${step} من 4` : `Step ${step} of 4`}
                                            </span>
                                            <h2 className="text-xl md:text-2xl font-bold">
                                                {step === 1 && (lang === 'ar' ? "اختر الخدمات المطلوبة" : "Select Service Scope")}
                                                {step === 2 && (lang === 'ar' ? "نموذج التشغيل" : "Choose Support Model")}
                                                {step === 3 && (lang === 'ar' ? "الجدول الزمني" : "Attendance & Schedule")}
                                                {step === 4 && (lang === 'ar' ? "بيانات التواصل" : "Company Details")}
                                            </h2>
                                        </div>
                                        <div className="hidden md:flex gap-2">
                                            {[1, 2, 3, 4].map(s => (
                                                <div key={s} className={`w-8 h-1 rounded-full transition-all ${s <= step ? "bg-[#0066FF]" : "bg-zinc-800"}`} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Form Body */}
                                <div className="p-6 md:p-10 min-h-[400px]">
                                    <AnimatePresence mode="wait">
                                        {isSuccess ? (
                                            <motion.div 
                                                key="success"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-center py-20"
                                            >
                                                <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-6">
                                                    <CheckCircle2 className="w-10 h-10" />
                                                </div>
                                                <h3 className="text-3xl font-black mb-4">{lang === 'ar' ? 'تم إرسال طلبك بنجاح!' : 'Request Sent Successfully!'}</h3>
                                                <p className="text-zinc-500 mb-8 max-w-sm mx-auto">
                                                    {lang === 'ar' 
                                                        ? 'سيقوم فريقنا بمراجعة تفاصيل شركتك والتواصل معك قريباً لمناقشة بنود التعاقد.' 
                                                        : 'Our team will review your company details and contact you shortly to discuss contract terms.'}
                                                </p>
                                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                    <Link href={`/profile/${formData.companyName || (session?.user as any)?.username || ''}`} className="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-all">
                                                        {lang === 'ar' ? 'متابعة الطلب' : 'Track Request'}
                                                    </Link>
                                                    <button onClick={() => { setIsSuccess(false); setStep(1); }} className="px-8 py-3 rounded-full bg-zinc-900 border border-white/10 text-white font-bold hover:bg-zinc-800 transition-all">
                                                        {lang === 'ar' ? 'طلب جديد' : 'New Request'}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key={`step-${step}`}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                            >
                                                {step === 1 && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {serviceOptions.map(opt => (
                                                            <button
                                                                key={opt.id}
                                                                onClick={() => toggleService(opt.id)}
                                                                className={`p-6 rounded-2xl border transition-all text-start flex items-center gap-4 group ${formData.services.includes(opt.id)
                                                                    ? "bg-[#0066FF]/10 border-[#0066FF] shadow-[0_0_20px_rgba(0,102,255,0.1)]"
                                                                    : "bg-zinc-900 border-white/5 hover:border-white/10"
                                                                    }`}
                                                            >
                                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${formData.services.includes(opt.id) ? "bg-[#0066FF] text-white" : "bg-zinc-800 text-zinc-500 group-hover:text-white"
                                                                    }`}>
                                                                    <opt.icon className="w-6 h-6" />
                                                                </div>
                                                                <span className={`font-bold text-sm ${formData.services.includes(opt.id) ? "text-white" : "text-zinc-400"}`}>
                                                                    {opt.label}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {step === 2 && (
                                                    <div className="space-y-6">
                                                        {[
                                                            { id: "remote", title: lang === 'ar' ? "دعم عن بُعد (24/7)" : "Remote Support (24/7)", desc: lang === 'ar' ? "تغطية شاملة وصيانة وقائية عن بُعد." : "Full remote coverage and preventive maintenance.", icon: Globe },
                                                            { id: "part-time", title: lang === 'ar' ? "دوام جزئي (ميداني)" : "Part-Time On-site", desc: lang === 'ar' ? "زيارات مجدولة أسبوعياً لمقر الشركة." : "Scheduled weekly visits to your company premises.", icon: Clock },
                                                            { id: "full-time", title: lang === 'ar' ? "دوام كلي (فريق مقيم)" : "Full-Time Resident Team", desc: lang === 'ar' ? "فريق تقني متواجد بشكل يومي ومستمر." : "A dedicated technical team on-site daily.", icon: UserCheck },
                                                        ].map(opt => (
                                                            <button
                                                                key={opt.id}
                                                                onClick={() => setFormData({ ...formData, model: opt.id })}
                                                                className={`w-full p-8 rounded-3xl border transition-all text-start flex items-center gap-6 group ${formData.model === opt.id
                                                                    ? "bg-[#0066FF]/10 border-[#0066FF]"
                                                                    : "bg-zinc-900 border-white/5 hover:border-white/10"
                                                                    }`}
                                                            >
                                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${formData.model === opt.id ? "bg-[#0066FF] text-white shadow-[0_0_20px_rgba(0,102,255,0.4)]" : "bg-zinc-800 text-zinc-500"
                                                                    }`}>
                                                                    <opt.icon className="w-7 h-7" />
                                                                </div>
                                                                <div>
                                                                    <h4 className={`font-black text-lg ${formData.model === opt.id ? "text-white" : "text-zinc-400"}`}>{opt.title}</h4>
                                                                    <p className="text-zinc-500 text-sm">{opt.desc}</p>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {step === 3 && (
                                                    <div className="space-y-12">
                                                        <div className="space-y-6">
                                                            <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-[#0066FF]" />
                                                                {formData.model === "full-time"
                                                                    ? (lang === 'ar' ? "عدد الأيام (شهرياً)" : "Days per Month")
                                                                    : (lang === 'ar' ? "عدد أيام الحضور (أسبوعياً)" : "Days per Week")
                                                                }
                                                            </label>
                                                            <div className="flex flex-wrap gap-4">
                                                                {(formData.model === "full-time" ? ["24", "26"] : ["1", "2", "3", "4", "5", "6", "7"]).map(d => (
                                                                    <button
                                                                        key={d}
                                                                        onClick={() => setFormData({ ...formData, days: d })}
                                                                        className={`min-w-[48px] h-12 px-4 rounded-xl border flex items-center justify-center font-bold transition-all ${formData.days === d ? "bg-[#0066FF] border-[#0066FF] text-white" : "bg-zinc-900 border-white/5 text-zinc-500"
                                                                            }`}
                                                                    >
                                                                        {d}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-6">
                                                            <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                                                <Clock className="w-4 h-4 text-[#0066FF]" />
                                                                {formData.model === "full-time"
                                                                    ? (lang === 'ar' ? "ساعات عمل الشركة المتعاقد عليها" : "Contracted Company Business Hours")
                                                                    : (lang === 'ar' ? "عدد الساعات (يومياً)" : "Hours per Day")
                                                                }
                                                            </label>
                                                            <div className="flex flex-wrap gap-4">
                                                                {formData.model === "remote" && (
                                                                    <button
                                                                        onClick={() => setFormData({ ...formData, hours: "24/7" })}
                                                                        className={`px-6 h-12 rounded-xl border flex items-center justify-center font-bold transition-all ${formData.hours === "24/7" ? "bg-[#0066FF] border-[#0066FF] text-white" : "bg-zinc-900 border-white/5 text-zinc-500"
                                                                            }`}
                                                                    >
                                                                        24/7 {lang === 'ar' ? 'دعم مستمر' : 'Support'}
                                                                    </button>
                                                                )}
                                                                {(formData.model === "part-time" ? ["2", "4", "6"] : (formData.model === "full-time" ? ["6", "8", "9", "10"] : ["4", "8", "12"])).map(h => (
                                                                    <button
                                                                        key={h}
                                                                        onClick={() => setFormData({ ...formData, hours: h })}
                                                                        className={`px-6 h-12 rounded-xl border flex items-center justify-center font-bold transition-all ${formData.hours === h ? "bg-[#0066FF] border-[#0066FF] text-white" : "bg-zinc-900 border-white/5 text-zinc-500"
                                                                            }`}
                                                                    >
                                                                        {h} {lang === 'ar' ? 'ساعات' : 'Hrs'}
                                                                    </button>
                                                                ))}
                                                                <div className="relative">
                                                                    <input
                                                                        type="text"
                                                                        placeholder={lang === 'ar' ? "أو وقت محدد (مثلاً: 9ص - 5م)..." : "Or specific time (e.g., 9AM - 5PM)..."}
                                                                        className={`h-12 px-6 rounded-xl border bg-zinc-900 outline-none transition-all placeholder:text-zinc-600 text-sm font-bold w-64 ${!["2", "4", "6", "8", "9", "10", "12", "24/7"].includes(formData.hours) && formData.hours !== "" ? "border-[#0066FF] text-white" : "border-white/5 text-zinc-400 focus:border-white/20"
                                                                            }`}
                                                                        onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {step === 4 && (
                                                    <div className="space-y-4">
                                                        <div className="grid md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold text-zinc-500 uppercase">{lang === 'ar' ? 'اسم الشركة' : 'Company Name'}</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Ex: NexIT Solutions"
                                                                    className={`w-full border rounded-2xl py-4 px-6 outline-none transition-all ${status === 'authenticated' ? 'bg-zinc-900/50 border-white/5 text-zinc-500 cursor-not-allowed' : 'bg-zinc-900 border-white/5 focus:border-[#0066FF]'}`}
                                                                    value={formData.companyName}
                                                                    onChange={(e) => status !== 'authenticated' && setFormData({ ...formData, companyName: e.target.value })}
                                                                    readOnly={status === 'authenticated'}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold text-zinc-500 uppercase">{lang === 'ar' ? 'المجال' : 'Industry'} <span className="text-red-500">*</span></label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Ex: Logistics"
                                                                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none transition-all"
                                                                    value={formData.industry}
                                                                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold text-zinc-500 uppercase">{lang === 'ar' ? 'اسم الشخص المسؤول' : 'Contact Person Name'} <span className="text-red-500">*</span></label>
                                                                <input
                                                                    type="text"
                                                                    placeholder={lang === 'ar' ? 'أدخل اسم المسؤول' : 'Enter contact person name'}
                                                                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none transition-all"
                                                                    value={formData.contactName}
                                                                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-xs font-bold text-zinc-500 uppercase">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                                                                    <input
                                                                        type="email"
                                                                        className={`w-full border rounded-2xl py-4 px-6 outline-none transition-all ${status === 'authenticated' ? 'bg-zinc-900/50 border-white/5 text-zinc-500 cursor-not-allowed' : 'bg-zinc-900 border-white/5 focus:border-[#0066FF]'}`}
                                                                        value={formData.email}
                                                                        onChange={(e) => status !== 'authenticated' && setFormData({ ...formData, email: e.target.value })}
                                                                        readOnly={status === 'authenticated'}
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-xs font-bold text-zinc-500 uppercase">{lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                                                                    <input
                                                                        type="tel"
                                                                        className={`w-full border rounded-2xl py-4 px-6 outline-none transition-all ${status === 'authenticated' ? 'bg-zinc-900/50 border-white/5 text-zinc-500 cursor-not-allowed' : 'bg-zinc-900 border-white/5 focus:border-[#0066FF]'}`}
                                                                        value={formData.phone}
                                                                        onChange={(e) => status !== 'authenticated' && setFormData({ ...formData, phone: e.target.value })}
                                                                        readOnly={status === 'authenticated'}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Form Footer */}
                                {!isSuccess && (
                                    <div className="bg-zinc-900/30 p-8 border-t border-white/5 flex justify-between gap-4 mt-auto">
                                        {step > 1 ? (
                                            <button
                                                onClick={prevStep}
                                                className="px-8 py-4 rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-all text-sm font-bold"
                                            >
                                                {lang === 'ar' ? "السابق" : "Back"}
                                            </button>
                                        ) : <div />}

                                        {step < 4 ? (
                                            <button
                                                onClick={nextStep}
                                                disabled={step === 1 && formData.services.length === 0}
                                                className="px-10 py-4 rounded-full bg-white text-black hover:bg-[#0066FF] hover:text-white transition-all text-sm font-black flex items-center gap-2 group disabled:opacity-50"
                                            >
                                                {lang === 'ar' ? "متابعة" : "Next Step"}
                                                <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${lang === 'ar' ? "rotate-180" : ""}`} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleSubmit}
                                                disabled={isSubmitting || !formData.industry || !formData.contactName}
                                                className="px-10 py-4 rounded-full bg-[#0066FF] text-white hover:bg-white hover:text-black transition-all text-sm font-black flex items-center gap-2 group shadow-[0_0_30px_rgba(0,102,255,0.3)] shadow-blue-950 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? (lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...') : (lang === 'ar' ? "إرسال طلب التعاقد" : "Submit Contract Request")}
                                                {!isSubmitting && <CheckCircle2 className="w-4 h-4" />}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-zinc-950 border border-[#0066FF]/20 rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden h-full flex flex-col items-center justify-center min-h-[600px]"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066FF]/5 rounded-full blur-[100px] pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />
                                
                                <div className="w-24 h-24 rounded-3xl bg-[#0066FF]/10 text-[#0066FF] flex items-center justify-center mb-8 relative">
                                    <div className="absolute inset-0 bg-[#0066FF]/20 rounded-3xl blur-xl animate-pulse" />
                                    <Lock className="w-10 h-10 relative z-10" />
                                </div>
                                
                                <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                                    {lang === 'ar' ? 'بوابة الشركات فقط' : 'Corporate Access Only'}
                                </h2>
                                
                                <p className="text-zinc-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                                    {lang === 'ar' 
                                        ? 'عذراً، هذه الخدمة والتعاقدات مخصصة فقط للحسابات المسجلة كشركات (B2B). لا يمكن للأفراد العاديين إرسال طلبات تعاقد managed IT.' 
                                        : 'Sorry, this service and contracting are exclusive to Registered Company accounts (B2B). Individual users cannot submit managed IT contract requests.'}
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                    <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20 flex items-center gap-4 max-w-md">
                                        <ShieldAlert className="w-8 h-8 text-red-500 shrink-0" />
                                        <p className="text-sm text-red-500/80 font-medium text-start">
                                            {lang === 'ar' 
                                                ? 'أنت مسجل كفرد حالياً. يرجى تسجيل الخروج والدخول بحساب الشركة الخاص بك للوصول لهذه الخدمة أو قدم طلبك كزائر وسيتم إنشاء حساب لك.'
                                                : 'You are currently logged in as an individual. Please logout and login with your Corporate account, or submit as a guest to have an account created.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-16 pt-8 border-t border-white/5 w-full max-w-md">
                                    <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-4">
                                        {lang === 'ar' ? 'هل تحتاج لمساعدة؟' : 'Need Assistance?'}
                                    </p>
                                    <Link href="/support" className="text-[#0066FF] hover:underline text-sm font-bold">
                                        {lang === 'ar' ? 'تواصل مع فريق المبيعات والتعاقدات' : 'Contact Sales & Contracts Team'}
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
