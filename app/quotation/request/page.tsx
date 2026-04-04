"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Send, 
    CheckCircle2, 
    Loader2, 
    Building2, 
    User, 
    Mail, 
    Phone, 
    MessageSquare, 
    ChevronRight,
    Search,
    ArrowLeft,
    Zap,
    Globe,
    ArrowUpRight,
    ShieldCheck
} from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { toast } from "sonner"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { NexBotAI } from "@/components/nexbot-ai"

export default function QuotationRequestPage() {
    const { lang, t } = useLanguage()
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        message: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch("/api/quotations/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                setIsSubmitted(true)
                toast.success(lang === 'ar' ? "تم إرسال طلبك بنجاح" : "Your request has been sent successfully")
            } else {
                toast.error("Failed to send request")
            }
        } catch (err) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubmitted) {
        return (
            <main dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-bg-primary flex items-center justify-center p-6 text-text-primary">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-xl w-full"
                >
                    <Card className="p-12 md:p-20 text-center space-y-10 border-border-color bg-bg-secondary/30 backdrop-blur-3xl shadow-4xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="w-28 h-28 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-3xl relative">
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-[2.5rem] blur-2xl animate-pulse" />
                            <CheckCircle2 className="w-14 h-14 text-emerald-500 relative z-10" />
                        </div>
                        
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-text-primary mb-4">
                                {lang === 'ar' ? 'شكراً لثقتكم!' : 'Order Received!'}
                            </h1>
                            <p className="text-text-secondary text-lg md:text-xl leading-relaxed font-medium opacity-80 max-w-sm mx-auto">
                                {lang === 'ar' 
                                    ? "تم استلام طلب عروض السعر الخاص بكم بنجاح. سيقوم فريق المبيعات لدينا بمراجعة طلبكم والرد عليكم قريباً."
                                    : "Your enterprise quotation request is being processed. Our team will contact you within 24 business hours."}
                            </p>
                        </div>

                        <div className="pt-10 border-t border-border-color/50">
                            <Link 
                                href="/"
                                className="inline-flex items-center justify-center gap-4 px-12 py-5 bg-accent text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-accent/20"
                            >
                                <ArrowLeft className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                                {lang === 'ar' ? 'العودة للرئيسية' : 'Return Home'}
                            </Link>
                        </div>
                    </Card>
                </motion.div>
                <NexBotAI />
            </main>
        )
    }

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-bg-primary pt-40 pb-32 px-6 text-text-primary relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-20 items-stretch relative z-10">
                
                {/* Visual Content Column (Left) */}
                <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-center space-y-12">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <span className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black tracking-[0.3em] uppercase mb-10 shadow-xl">
                            <Zap className="w-4 h-4 fill-accent" />
                            {lang === 'ar' ? 'حلول الشركات الكبرى' : 'Enterprise Scale Solutions'}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-text-primary mt-6 leading-[0.95] mb-10">
                            {lang === 'ar' ? 'اطلب ' : 'Request '}<br />
                            <span className="text-accent">{lang === 'ar' ? 'سعر مخصص' : 'Custom Quote'}</span>
                        </h1>
                        <p className="text-text-secondary text-xl md:text-2xl leading-relaxed max-w-xl font-medium opacity-80">
                            {lang === 'ar' 
                                ? "احصل على أفضل الحلول التقنية المصممة خصيصاً لاحتياجات شركتك. فريقنا جاهز لتقديم عرض سعر تفصيلي خلال ساعات."
                                : "Transform your digital landscape with precision-engineered solutions. Our team provides high-detail enterprise quotations instantly."}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                        {[
                            { title: lang === 'ar' ? 'استشارات رقمية' : 'Digital Strategy', color: 'bg-blue-500', icon: Globe },
                            { title: lang === 'ar' ? 'تطوير برمجيات' : 'Code Architecture', color: 'bg-purple-500', icon: Zap },
                            { title: lang === 'ar' ? 'بنية تحتية' : 'Infra Planning', color: 'bg-emerald-500', icon: ShieldCheck },
                            { title: lang === 'ar' ? 'دعم فني متخصص' : 'Managed Support', color: 'bg-orange-500', icon: Building2 }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="p-6 md:p-8 bg-bg-secondary/30 border-border-color hover:border-accent/40 transition-all duration-500 group cursor-default shadow-3xl backdrop-blur-sm">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl bg-bg-primary border border-border-color flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all`}>
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <span className="font-black text-xs md:text-sm text-text-primary uppercase tracking-widest leading-tight">{item.title}</span>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Interaction Form Column (Right) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="lg:col-span-12 xl:col-span-7"
                >
                    <Card className="p-10 md:p-14 lg:p-16 border-border-color bg-bg-secondary/40 backdrop-blur-3xl rounded-[3rem] shadow-4xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 blur-[120px] -z-10 group-hover:bg-accent/10 transition-all duration-1000 pointer-events-none" />
                        
                        <div className="mb-14">
                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-text-primary uppercase">
                                {lang === 'ar' ? 'تواصل مع فريق المبيعات' : 'Contact Enterprise Sales'}
                            </h2>
                            <p className="text-text-secondary font-medium mt-3 opacity-70">
                                {lang === 'ar' ? 'يرجى تعبئة النموذج بدقة لضمان سرعة الرد.' : 'Provide accurate data for prioritized enterprise review.'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                        <User className="w-3.5 h-3.5 text-accent" /> {lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-bg-primary border-2 border-border-color rounded-2xl px-6 py-5 text-lg font-bold focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all placeholder:text-text-secondary/30 h-20"
                                        placeholder={lang === 'ar' ? 'اسمك هنا...' : 'Primary contact name...'}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                        <Mail className="w-3.5 h-3.5 text-accent" /> {lang === 'ar' ? 'البريد الإلكتروني' : 'Business Email'}
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-bg-primary border-2 border-border-color rounded-2xl px-6 py-5 text-lg font-bold focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all placeholder:text-text-secondary/30 h-20"
                                        placeholder="email@enterprise.com"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                        <Building2 className="w-3.5 h-3.5 text-accent" /> {lang === 'ar' ? 'الشركة' : 'Organization'}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full bg-bg-primary border-2 border-border-color rounded-2xl px-6 py-5 text-lg font-bold focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all placeholder:text-text-secondary/30 h-20"
                                        placeholder={lang === 'ar' ? 'اسم المنشأة...' : 'Company name...'}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                        <Search className="w-3.5 h-3.5 text-accent" /> {lang === 'ar' ? 'القطاع المطلوب' : 'Target Solution'}
                                    </label>
                                    <select
                                        required
                                        value={formData.service}
                                        onChange={e => setFormData({ ...formData, service: e.target.value })}
                                        className="w-full bg-bg-primary border-2 border-border-color rounded-2xl px-6 py-5 text-lg font-bold focus:border-accent outline-none transition-all text-text-primary h-20 appearance-none cursor-pointer"
                                    >
                                        <option value="" className="bg-bg-secondary font-black">{lang === 'ar' ? 'اختر خدمة...' : 'Select service scope...'}</option>
                                        <option value="Software" className="bg-bg-secondary">Software Development</option>
                                        <option value="Hardware" className="bg-bg-secondary">Hardware Systems</option>
                                        <option value="Network" className="bg-bg-secondary">Networking & Infra</option>
                                        <option value="ERP" className="bg-bg-secondary">Enterprise ERP</option>
                                        <option value="Others" className="bg-bg-secondary">Other Custom Solutions</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                    <MessageSquare className="w-3.5 h-3.5 text-accent" /> {lang === 'ar' ? 'تفاصيل الطلب الفنية' : 'Technical Specifications'}
                                </label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-bg-primary border-2 border-border-color rounded-3xl px-8 py-6 text-lg font-bold focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all placeholder:text-text-secondary/30 min-h-[200px] resize-none"
                                    placeholder={lang === 'ar' ? 'يرجى كتابة تفاصيل ما تحتاجه من حلول وقدرات برمجية أو إنشائية...' : 'Outline your technical requirements or system scale...'}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-accent text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.3em] hover:bg-accent/90 hover:scale-[1.02] transition-all flex items-center justify-center gap-6 active:scale-[0.98] disabled:opacity-50 shadow-4xl shadow-accent/20 group"
                            >
                                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />}
                                {lang === 'ar' ? 'تقديم الطلب الآن' : 'Initialize Proposal'}
                            </button>
                            
                            <p className="text-[10px] text-text-secondary text-center uppercase font-black tracking-[0.2em] opacity-50">
                                {lang === 'ar' ? 'نظام مشفر بالكامل - اتصال آمن' : 'Encrypted Transmission - SOC 2 Standard Communication'}
                            </p>
                        </form>
                    </Card>
                </motion.div>
            </div>
            <NexBotAI />
        </main>
    )
}
