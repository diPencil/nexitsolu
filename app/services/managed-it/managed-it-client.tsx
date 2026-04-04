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
    Lock, ShieldAlert, ArrowUpRight, ChevronRight, ChevronLeft
} from "lucide-react"
import { NexBotAI } from "@/components/nexbot-ai"
import { Card } from "@/components/ui/card"

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
        { id: "infra", label: t("services_pages.managed_it.form.services.infra"), icon: Cpu },
        { id: "cyber", label: t("services_pages.managed_it.form.services.cyber"), icon: ShieldCheck },
        { id: "helpdesk", label: t("services_pages.managed_it.form.services.helpdesk"), icon: Users },
        { id: "cloud", label: t("services_pages.managed_it.form.services.cloud"), icon: Globe },
        { id: "network", label: t("services_pages.managed_it.form.services.network"), icon: Zap },
        { id: "devops", label: t("services_pages.managed_it.form.services.maintenance"), icon: Monitor },
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
                alert(t("services_pages.managed_it.error_login"))
            }
        } catch (error) {
            console.error("Submission error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-bg-primary min-h-screen text-text-primary">
            {/* Header / Breadcrumb Area */}
            <div className="max-w-7xl mx-auto pt-32 px-6 md:px-12 relative z-20">
                <Link href="/" className="inline-flex items-center text-text-secondary hover:text-accent transition-all text-sm font-black uppercase tracking-widest group">
                    <div className="w-8 h-8 rounded-full border border-border-color flex items-center justify-center me-3 group-hover:bg-accent group-hover:text-white transition-all group-hover:border-accent">
                        {lang === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </div>
                    {t("services_pages.managed_it.back_to_home")}
                </Link>
            </div>

            {/* Premium Enterprise Hero */}
            <PageSection className="pt-12! pb-24!">
                <Card className="relative p-12 md:p-20 lg:p-24 overflow-hidden border-border-color bg-bg-secondary/30 backdrop-blur-3xl shadow-4xl group">
                    {/* Animated Decorative Blobs */}
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-[140px] animate-pulse pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-600/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />
                    
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-16 relative z-10">
                        <div className="max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black tracking-[0.2em] uppercase mb-10 shadow-xl"
                            >
                                <Building2 className="w-4 h-4" />
                                {t("services_pages.managed_it.hero_tag")}
                            </motion.div>
                            
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-black text-text-primary mb-8 tracking-tighter leading-[0.95]"
                            >
                                {t("services_pages.managed_it.hero_title")}<span className="text-accent">{t("services_pages.managed_it.hero_title_accent")}</span><br/>
                                {t("services_pages.managed_it.hero_title_suffix")}
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-text-secondary text-xl md:text-2xl leading-relaxed mb-12 max-w-2xl font-medium opacity-80"
                            >
                                {t("services_pages.managed_it.hero_subtitle")}
                            </motion.p>
                            
                            <div className="flex flex-wrap gap-8 items-center border-t border-border-color/50 pt-10">
                                {[
                                    { label: t("services_pages.managed_it.badges.plans"), color: 'bg-blue-500' },
                                    { label: t("services_pages.managed_it.badges.dashboard"), color: 'bg-indigo-500' },
                                    { label: t("services_pages.managed_it.badges.iso"), color: 'bg-emerald-500' }
                                ].map((badge, i) => (
                                    <div key={i} className="flex items-center gap-3 group/badge">
                                        <div className={`w-2.5 h-2.5 rounded-full ${badge.color} shadow-[0_0_10px_rgba(0,102,255,0.8)] group-hover/badge:scale-150 transition-transform`} />
                                        <span className="text-sm font-black uppercase tracking-widest text-text-secondary opacity-70 group-hover/badge:opacity-100 transition-opacity">
                                            {badge.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Auth Visual Block */}
                        <div className="w-full lg:w-auto">
                            <AnimatePresence mode="wait">
                                {status === 'authenticated' ? (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-10 rounded-[2.5rem] bg-bg-primary border border-border-color shadow-3xl text-center min-w-[320px] relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
                                        <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-accent to-purple-600 flex items-center justify-center font-black text-4xl text-white mx-auto mb-8 shadow-2xl relative z-10 border-4 border-bg-secondary">
                                            {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="mb-10 relative z-10">
                                            <p className="text-2xl font-black text-text-primary tracking-tight">{session?.user?.name}</p>
                                            <p className="text-sm text-text-secondary font-medium mt-1">{session?.user?.email}</p>
                                        </div>
                                        <Link
                                            href={(session?.user as any)?.role === 'ADMIN' ? '/admin' : '/profile'}
                                            className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 rounded-3xl bg-accent text-white font-black text-sm uppercase tracking-widest hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 group"
                                        >
                                            {(session?.user as any)?.role === 'ADMIN'
                                                ? t("services_pages.managed_it.auth.admin_panel")
                                                : t("services_pages.managed_it.auth.my_dashboard")
                                            }
                                            <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-2 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-2' : ''}`} />
                                        </Link>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-10 rounded-[2.5rem] bg-bg-primary border border-border-color shadow-3xl text-center min-w-[320px] relative overflow-hidden flex flex-col gap-6"
                                    >
                                        <div className="text-start mb-4">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">{t("services_pages.managed_it.auth.secure_access")}</p>
                                            <h3 className="text-2xl font-black tracking-tight">{t("services_pages.managed_it.auth.private_access")}</h3>
                                        </div>
                                        <Link href="/login" className="w-full">
                                            <button className="w-full px-8 py-4 rounded-2xl bg-bg-secondary border border-border-color text-text-primary hover:bg-accent/10 hover:border-accent/40 transition-all text-sm font-black uppercase tracking-widest">
                                                {t("services_pages.managed_it.auth.company_login")}
                                            </button>
                                        </Link>
                                        <Link href="/register/corporate" className="w-full">
                                            <button className="w-full px-8 py-4 rounded-2xl bg-accent text-white hover:bg-accent/90 transition-all text-sm font-black uppercase tracking-widest shadow-xl shadow-accent/20">
                                                {t("services_pages.managed_it.auth.register_now")}
                                            </button>
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </Card>
            </PageSection>

            {/* Main Form Section */}
            <PageSection className="py-24! max-w-7xl mx-auto px-6 md:px-12" id="request-form">
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    
                    {/* Feature Cards Column */}
                    <div className="lg:col-span-4 h-full flex flex-col gap-8">
                        <Card className="p-10 md:p-14 border-border-color bg-bg-secondary/30 backdrop-blur-2xl shadow-3xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-accent/20 group-hover:bg-accent transition-all duration-700" />
                            <h3 className="text-3xl font-black text-text-primary mb-10 tracking-tight leading-tight">
                                {t("services_pages.managed_it.advantage_title")}
                            </h3>
                            <div className="space-y-10">
                                {[
                                    { title: t("services_pages.managed_it.advantages.cost.title"), desc: t("services_pages.managed_it.advantages.cost.desc"), icon: Zap },
                                    { title: t("services_pages.managed_it.advantages.response.title"), desc: t("services_pages.managed_it.advantages.response.desc"), icon: Clock },
                                    { title: t("services_pages.managed_it.advantages.certified.title"), desc: t("services_pages.managed_it.advantages.certified.desc"), icon: ShieldCheck }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6 group/item">
                                        <div className="mt-1 w-10 h-10 rounded-xl bg-bg-primary border border-border-color flex items-center justify-center text-accent group-hover/item:bg-accent group-hover/item:text-white transition-all duration-500 shadow-lg">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-lg text-text-primary mb-2 group-hover/item:text-accent transition-colors tracking-tight uppercase">{item.title}</h4>
                                            <p className="text-text-secondary text-sm leading-relaxed opacity-70 group-hover/item:opacity-100 transition-opacity font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Visual Power Badge */}
                        <Card className="p-10 border-border-color bg-accent relative overflow-hidden group shadow-4xl shadow-accent/20">
                             <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.2),transparent_60%)] pointer-events-none" />
                             <ShieldCheck className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
                             <div className="flex items-center gap-6 relative z-10">
                                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl">
                                    <span className="text-white text-3xl font-black">{t("services_pages.managed_it.iso_count")}</span>
                                </div>
                                <div className="text-white">
                                    <p className="text-sm font-black uppercase tracking-[0.2em] opacity-70">{t("services_pages.managed_it.iso_badge")}</p>
                                    <h4 className="text-3xl font-black tracking-tighter">ISO 27001</h4>
                                </div>
                             </div>
                        </Card>
                    </div>

                    {/* Interactive Form Block */}
                    <div className="lg:col-span-8 h-full">
                         {(status === 'unauthenticated' || isCorporate) ? (
                            <Card className="bg-bg-secondary/30 border-border-color rounded-[3rem] overflow-hidden shadow-4xl h-full flex flex-col relative group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
                                
                                {!isSuccess && (
                                    <div className="p-10 md:p-14 flex flex-col md:flex-row items-center justify-between border-b border-border-color bg-bg-secondary/50 backdrop-blur-xl relative z-10">
                                        <div className="text-center md:text-start mb-8 md:mb-0">
                                            <motion.span 
                                                key={`step-label-${step}`}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-3 block"
                                            >
                                                {t("services_pages.managed_it.form.phase", { step })}
                                            </motion.span>
                                            <h2 className="text-3xl md:text-4xl font-black text-text-primary tracking-tighter uppercase whitespace-nowrap">
                                                {step === 1 && t("services_pages.managed_it.form.phases.1")}
                                                {step === 2 && t("services_pages.managed_it.form.phases.2")}
                                                {step === 3 && t("services_pages.managed_it.form.phases.3")}
                                                {step === 4 && t("services_pages.managed_it.form.phases.4")}
                                            </h2>
                                        </div>
                                        <div className="flex gap-4">
                                            {[1, 2, 3, 4].map(s => (
                                                <div 
                                                    key={s} 
                                                    className={`h-2.5 rounded-full transition-all duration-700 ${s <= step ? "bg-accent w-12 shadow-[0_0_10px_rgba(0,102,255,0.4)]" : "bg-border-color w-6"}`} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="p-10 md:p-14 grow min-h-[500px] flex flex-col relative z-10">
                                    <AnimatePresence mode="wait">
                                        {isSuccess ? (
                                            <motion.div 
                                                key="success-form"
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-center py-24 flex flex-col items-center justify-center h-full"
                                            >
                                                <div className="w-32 h-32 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-10 shadow-3xl border border-emerald-500/20 relative">
                                                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl animate-pulse" />
                                                    <CheckCircle2 className="w-16 h-16 relative z-10" />
                                                </div>
                                                <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">{t("services_pages.managed_it.form.success.title")}</h3>
                                                <p className="text-text-secondary text-lg md:text-xl mb-12 max-w-xl mx-auto font-medium opacity-80 leading-relaxed">
                                                    {t("services_pages.managed_it.form.success.desc")}
                                                </p>
                                                <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                                                    <Link href="/" className="px-12 py-5 rounded-2xl bg-accent text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-accent/20 hover:scale-105 transition-transform">
                                                        {t("services_pages.managed_it.form.success.return_home")}
                                                    </Link>
                                                    <button onClick={() => { setIsSuccess(false); setStep(1); }} className="px-12 py-5 rounded-2xl bg-bg-primary border border-border-color text-text-primary font-black text-sm uppercase tracking-widest hover:border-accent/40 transition-all">
                                                        {t("services_pages.managed_it.form.success.new_quote")}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key={`form-inner-step-${step}`}
                                                initial={{ opacity: 0, x: lang === 'ar' ? -30 : 30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: lang === 'ar' ? 30 : -30 }}
                                                transition={{ duration: 0.5, ease: "circOut" }}
                                                className="h-full flex flex-col"
                                            >
                                                {step === 1 && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                                                        {serviceOptions.map(opt => (
                                                            <button
                                                                key={opt.id}
                                                                onClick={() => toggleService(opt.id)}
                                                                className={`p-10 rounded-4xl border-2 transition-all duration-500 text-start flex items-center gap-8 group/opt relative overflow-hidden ${formData.services.includes(opt.id)
                                                                    ? "bg-accent/10 border-accent shadow-2xl shadow-accent/10 scale-[1.02]"
                                                                    : "bg-bg-primary border-border-color hover:border-accent/40"
                                                                    }`}
                                                            >
                                                                {formData.services.includes(opt.id) && (
                                                                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                                                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                                                    </div>
                                                                )}
                                                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl border ${formData.services.includes(opt.id) 
                                                                    ? "bg-accent text-white border-accent" 
                                                                    : "bg-bg-secondary text-text-secondary border-border-color group-hover/opt:bg-accent group-hover/opt:text-white"
                                                                    }`}>
                                                                    <opt.icon className="w-8 h-8" />
                                                                </div>
                                                                <span className={`font-black text-lg md:text-xl tracking-tight leading-tight transition-colors ${formData.services.includes(opt.id) ? "text-text-primary" : "text-text-secondary group-hover/opt:text-text-primary"}`}>
                                                                    {opt.label}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {step === 2 && (
                                                    <div className="space-y-8 pb-6">
                                                        {[
                                                            { id: "remote", title: t("services_pages.managed_it.form.models.remote.title"), desc: t("services_pages.managed_it.form.models.remote.desc"), icon: Globe },
                                                            { id: "part-time", title: t("services_pages.managed_it.form.models.part_time.title"), desc: t("services_pages.managed_it.form.models.part_time.desc"), icon: Clock },
                                                            { id: "full-time", title: t("services_pages.managed_it.form.models.full_time.title"), desc: t("services_pages.managed_it.form.models.full_time.desc"), icon: UserCheck },
                                                        ].map(opt => (
                                                            <button
                                                                key={opt.id}
                                                                onClick={() => setFormData({ ...formData, model: opt.id })}
                                                                className={`w-full p-10 md:p-12 rounded-[2.5rem] border-2 transition-all duration-500 text-start flex items-center gap-10 group/model overflow-hidden relative ${formData.model === opt.id
                                                                    ? "bg-accent border-accent shadow-3xl shadow-accent/20 scale-[1.01]"
                                                                    : "bg-bg-primary border-border-color hover:border-accent/40"
                                                                    }`}
                                                            >
                                                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 border-2 ${formData.model === opt.id 
                                                                    ? "bg-white text-accent border-white shadow-2xl" 
                                                                    : "bg-bg-secondary text-text-secondary border-border-color group-hover/model:border-accent/40 group-hover/model:text-accent"
                                                                    }`}>
                                                                    <opt.icon className="w-10 h-10" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className={`font-black text-2xl md:text-3xl tracking-tighter mb-2 ${formData.model === opt.id ? "text-white" : "text-text-primary"}`}>{opt.title}</h4>
                                                                    <p className={`text-sm md:text-lg font-medium leading-relaxed ${formData.model === opt.id ? "text-white/80" : "text-text-secondary opacity-70"}`}>{opt.desc}</p>
                                                                </div>
                                                                {formData.model === opt.id && (
                                                                    <div className="text-white">
                                                                        {lang === 'ar' ? <ChevronLeft className="w-8 h-8" /> : <ChevronRight className="w-8 h-8" />}
                                                                    </div>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {step === 3 && (
                                                    <div className="space-y-16 pb-6">
                                                        <div className="space-y-8">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-2 h-10 bg-accent rounded-full" />
                                                                <label className="text-sm font-black text-text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                                                                    <Calendar className="w-5 h-5 text-accent" />
                                                                    {formData.model === "full-time"
                                                                        ? t("services_pages.managed_it.form.scheduling.monthly")
                                                                        : t("services_pages.managed_it.form.scheduling.weekly")
                                                                    }
                                                                </label>
                                                            </div>
                                                            <div className="flex flex-wrap gap-4 px-6">
                                                                {(formData.model === "full-time" ? ["20", "24", "26"] : ["1", "2", "3", "4", "5", "6", "7"]).map(d => (
                                                                    <button
                                                                        key={d}
                                                                        onClick={() => setFormData({ ...formData, days: d })}
                                                                        className={`min-w-[64px] h-16 px-6 rounded-2xl border-2 flex items-center justify-center font-black text-xl transition-all duration-500 shadow-xl ${formData.days === d 
                                                                            ? "bg-accent border-accent text-white scale-110 shadow-accent/30" 
                                                                            : "bg-bg-primary border-border-color text-text-secondary hover:border-accent/40"
                                                                            }`}
                                                                    >
                                                                        {d}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-8">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-2 h-10 bg-accent rounded-full" />
                                                                <label className="text-sm font-black text-text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                                                                    <Clock className="w-5 h-5 text-accent" />
                                                                    {formData.model === "full-time"
                                                                        ? t("services_pages.managed_it.form.scheduling.daily_ops")
                                                                        : t("services_pages.managed_it.form.scheduling.support_hours")
                                                                    }
                                                                </label>
                                                            </div>
                                                            <div className="flex flex-wrap gap-4 px-6 items-center">
                                                                {formData.model === "remote" && (
                                                                    <button
                                                                        onClick={() => setFormData({ ...formData, hours: "24/7" })}
                                                                        className={`px-10 h-16 rounded-2xl border-2 flex items-center justify-center font-black text-lg transition-all duration-500 shadow-xl ${formData.hours === "24/7" 
                                                                            ? "bg-accent border-accent text-white scale-110 shadow-accent/30" 
                                                                            : "bg-bg-primary border-border-color text-text-secondary hover:border-accent/40"
                                                                            }`}
                                                                    >
                                                                        24/7 {t("services_pages.managed_it.form.scheduling.full_response")}
                                                                    </button>
                                                                )}
                                                                {(formData.model === "part-time" ? ["2", "4", "6", "8"] : (formData.model === "full-time" ? ["8", "9", "10", "12"] : ["4", "8", "12"])).map(h => (
                                                                    <button
                                                                        key={h}
                                                                        onClick={() => setFormData({ ...formData, hours: h })}
                                                                        className={`px-10 h-16 rounded-2xl border-2 flex items-center justify-center font-black text-lg transition-all duration-500 shadow-xl ${formData.hours === h 
                                                                            ? "bg-accent border-accent text-white scale-110 shadow-accent/30" 
                                                                            : "bg-bg-primary border-border-color text-text-secondary hover:border-accent/40"
                                                                            }`}
                                                                    >
                                                                        {h} {t("common.hours")}
                                                                    </button>
                                                                ))}
                                                                <div className="relative group/input">
                                                                    <input
                                                                        type="text"
                                                                        placeholder={t("services_pages.managed_it.form.scheduling.custom_placeholder")}
                                                                        className={`h-16 px-10 rounded-2xl border-2 bg-bg-primary outline-none transition-all duration-500 placeholder:text-text-secondary/40 text-lg font-black w-64 shadow-xl ${!["2", "4", "6", "8", "9", "10", "12", "24/7"].includes(formData.hours) && formData.hours !== "" 
                                                                            ? "border-accent text-text-primary" 
                                                                            : "border-border-color text-text-secondary focus:border-accent/60"
                                                                            }`}
                                                                        onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {step === 4 && (
                                                    <div className="space-y-10 pb-6">
                                                        <div className="grid md:grid-cols-2 gap-8">
                                                            <div className="space-y-3">
                                                                <label className="text-xs font-black text-text-secondary uppercase tracking-widest px-2">{t("services_pages.managed_it.form.company_data.name")}</label>
                                                                <div className="relative group/form">
                                                                    <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary mt-0.5 group-focus-within/form:text-accent transition-colors" />
                                                                    <input
                                                                        type="text"
                                                                        placeholder={t("services_pages.managed_it.form.company_data.placeholder_name")}
                                                                        className={`w-full border-2 rounded-2xl py-5 ps-16 pe-8 outline-none transition-all h-20 text-lg font-bold ${status === 'authenticated' ? 'bg-bg-secondary/50 border-border-color text-text-secondary/60 cursor-not-allowed' : 'bg-bg-primary border-border-color focus:border-accent'}`}
                                                                        value={formData.companyName}
                                                                        onChange={(e) => status !== 'authenticated' && setFormData({ ...formData, companyName: e.target.value })}
                                                                        readOnly={status === 'authenticated'}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <label className="text-xs font-black text-text-secondary uppercase tracking-widest px-2">{t("services_pages.managed_it.form.company_data.industry")} <span className="text-accent">*</span></label>
                                                                <div className="relative group/form">
                                                                    <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary mt-0.5 group-focus-within/form:text-accent transition-colors" />
                                                                    <input
                                                                        type="text"
                                                                        placeholder={t("services_pages.managed_it.form.company_data.placeholder_industry")}
                                                                        className="w-full bg-bg-primary border-2 border-border-color rounded-2xl py-5 ps-16 pe-8 focus:border-accent outline-none transition-all h-20 text-lg font-bold"
                                                                        value={formData.industry}
                                                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="space-y-10 pt-10 border-t border-border-color/50">
                                                            <div className="space-y-3">
                                                                <label className="text-xs font-black text-text-secondary uppercase tracking-widest px-2">{t("services_pages.managed_it.form.company_data.contact_name")} <span className="text-accent">*</span></label>
                                                                <div className="relative group/form">
                                                                    <UserCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary mt-0.5 group-focus-within/form:text-accent transition-colors" />
                                                                    <input
                                                                        type="text"
                                                                        placeholder={t("services_pages.managed_it.form.company_data.placeholder_contact")}
                                                                        className="w-full bg-bg-primary border-2 border-border-color rounded-2xl py-5 ps-16 pe-8 focus:border-accent outline-none transition-all h-20 text-lg font-bold"
                                                                        value={formData.contactName}
                                                                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="grid md:grid-cols-2 gap-8">
                                                                <div className="space-y-3">
                                                                    <label className="text-xs font-black text-text-secondary uppercase tracking-widest px-2">{t("services_pages.managed_it.form.company_data.email")}</label>
                                                                    <input
                                                                        type="email"
                                                                        className={`w-full border-2 rounded-2xl py-5 px-8 outline-none transition-all h-20 text-lg font-bold ${status === 'authenticated' ? 'bg-bg-secondary/50 border-border-color text-text-secondary/60 cursor-not-allowed' : 'bg-bg-primary border-border-color focus:border-accent'}`}
                                                                        value={formData.email}
                                                                        onChange={(e) => status !== 'authenticated' && setFormData({ ...formData, email: e.target.value })}
                                                                        readOnly={status === 'authenticated'}
                                                                    />
                                                                </div>
                                                                <div className="space-y-3">
                                                                    <label className="text-xs font-black text-text-secondary uppercase tracking-widest px-2">{t("services_pages.managed_it.form.company_data.phone")}</label>
                                                                    <input
                                                                        type="tel"
                                                                        className={`w-full border-2 rounded-2xl py-5 px-8 outline-none transition-all h-20 text-lg font-bold ${status === 'authenticated' ? 'bg-bg-secondary/50 border-border-color text-text-secondary/60 cursor-not-allowed' : 'bg-bg-primary border-border-color focus:border-accent'}`}
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

                                {/* Persistent Multi-step Footer */}
                                {!isSuccess && (
                                    <div className="bg-bg-secondary/50 p-10 md:p-14 border-t border-border-color backdrop-blur-3xl flex justify-between gap-10 mt-auto relative z-20">
                                        {step > 1 ? (
                                            <button
                                                onClick={prevStep}
                                                className="px-10 py-5 rounded-2xl border-2 border-border-color text-text-secondary font-black uppercase tracking-widest text-sm hover:border-accent/40 hover:text-text-primary transition-all flex items-center gap-3 group/back"
                                            >
                                                {lang === 'ar' ? <ChevronRight className="w-4 h-4 group-hover/back:translate-x-1" /> : <ChevronLeft className="w-4 h-4 group-hover/back:-translate-x-1" />}
                                                {t("services_pages.managed_it.form.footer.back")}
                                            </button>
                                        ) : <div />}

                                        {step < 4 ? (
                                            <button
                                                onClick={nextStep}
                                                disabled={step === 1 && formData.services.length === 0}
                                                className="px-14 py-5 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-sm hover:bg-accent/90 transition-all flex items-center gap-4 group/next disabled:opacity-40 disabled:cursor-not-allowed shadow-2xl shadow-accent/10 hover:scale-105"
                                            >
                                                {t("services_pages.managed_it.form.footer.next")}
                                                {lang === 'ar' ? <ChevronLeft className="w-5 h-5 group-hover/next:-translate-x-2 transition-transform" /> : <ChevronRight className="w-5 h-5 group-hover/next:translate-x-2 transition-transform" />}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleSubmit}
                                                disabled={isSubmitting || !formData.industry || !formData.contactName}
                                                className="px-14 py-5 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-sm hover:bg-accent/90 transition-all flex items-center gap-4 group/submit shadow-4xl shadow-accent/30 hover:scale-105 disabled:opacity-50"
                                            >
                                                {isSubmitting ? t("services_pages.managed_it.form.footer.submitting") : t("services_pages.managed_it.form.footer.confirm")}
                                                {!isSubmitting && <ArrowUpRight className="w-5 h-5" />}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </Card>
                         ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-bg-secondary/30 border-2 border-border-color rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden h-full flex flex-col items-center justify-center min-h-[700px] shadow-4xl backdrop-blur-3xl"
                            >
                                <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[140px] pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />
                                
                                <div className="w-32 h-32 rounded-[2.5rem] bg-accent/10 text-accent flex items-center justify-center mb-12 relative shadow-3xl border border-accent/20">
                                    <div className="absolute inset-0 bg-accent/20 rounded-[2.5rem] blur-2xl animate-pulse" />
                                    <Lock className="w-14 h-14 relative z-10" />
                                </div>
                                
                                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter uppercase">
                                    {t("services_pages.managed_it.locked.title")}
                                </h2>
                                
                                <p className="text-text-secondary text-xl md:text-2xl mb-14 max-w-2xl mx-auto leading-relaxed font-medium opacity-80">
                                    {t("services_pages.managed_it.locked.desc")}
                                </p>
                                
                                <div className="w-full max-w-xl">
                                    <div className="p-10 rounded-4xl bg-red-500/5 border-2 border-red-500/20 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
                                            <ShieldAlert className="w-8 h-8 text-red-500" />
                                        </div>
                                        <p className="text-lg text-red-500/90 font-bold text-center md:text-start leading-tight relative z-10">
                                            {t("services_pages.managed_it.locked.warning")}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-20 pt-12 border-t border-border-color w-full max-w-2xl text-center">
                                    <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.4em] mb-6 opacity-40">
                                        {t("services_pages.managed_it.locked.help")}
                                    </p>
                                    <Link href="/contact" className="inline-flex items-center gap-3 text-accent hover:underline text-lg font-black tracking-tight group">
                                        {t("services_pages.managed_it.locked.consult")}
                                        <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
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
