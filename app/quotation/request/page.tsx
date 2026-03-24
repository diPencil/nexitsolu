"use client"

import { useState } from "react"
import { motion } from "motion/react"
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
    ArrowLeft
} from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { toast } from "sonner"
import Link from "next/link"

export default function QuotationRequestPage() {
    const { lang } = useLanguage()
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
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-zinc-950 border border-white/5 rounded-3xl p-10 text-center space-y-6 shadow-2xl"
                >
                    <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-white">
                        {lang === 'ar' ? 'شكراً لثقتكم!' : 'Thank You!'}
                    </h1>
                    <p className="text-zinc-400 leading-relaxed">
                        {lang === 'ar' 
                            ? "تم استلام طلب عروض السعر الخاص بكم بنجاح. سيقوم فريق المبيعات لدينا بمراجعة طلبكم والرد عليكم عبر البريد الإلكتروني في أقرب وقت ممكن."
                            : "Your quotation request has been successfully received. Our sales team will review your details and respond via email as soon as possible."}
                    </p>
                    <div className="pt-6">
                        <Link 
                            href="/"
                            className="bg-[#0066FF] text-white px-8 py-3.5 rounded-2xl font-bold hover:scale-105 transition-all inline-flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                        </Link>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] py-32 px-6">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                
                {/* Content Side */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <span className="text-[#0066FF] font-black text-xs uppercase tracking-[0.3em] bg-[#0066FF]/10 px-4 py-2 rounded-full border border-[#0066FF]/20">
                            {lang === 'ar' ? 'حلول الشركات' : 'ENTERPRISE SOLUTIONS'}
                        </span>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white mt-6 leading-[1.1]">
                            {lang === 'ar' ? 'اطلب عرض' : 'Request a'} <br />
                            <span className="text-[#0066FF]">{lang === 'ar' ? 'سعر مخصص' : 'Custom Quote'}</span>
                        </h1>
                    </motion.div>
                    
                    <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                        {lang === 'ar' 
                            ? "احصل على أفضل الحلول التقنية المصممة خصيصاً لاحتياجات شركتك. فريقنا جاهز لتقديم عرض سعر تفصيلي خلال 24 ساعة عمل."
                            : "Get the best tech solutions tailored specifically to your company's needs. Our team is ready to provide a detailed quote within 24 working hours."}
                    </p>

                    <div className="space-y-4">
                        {[
                            { title: lang === 'ar' ? 'استشارات رقمية' : 'Digital Consulting', color: 'bg-blue-500' },
                            { title: lang === 'ar' ? 'تطوير برمجيات' : 'Software Development', color: 'bg-purple-500' },
                            { title: lang === 'ar' ? 'بنية تحتية للشركات' : 'IT Infrastructure', color: 'bg-emerald-500' }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-4 bg-zinc-950/50 border border-white/5 p-4 rounded-2xl hover:border-white/10 transition-colors"
                            >
                                <div className={`w-2 h-2 rounded-full ${item.color} shadow-[0_0_10px_currentColor]`} />
                                <span className="font-bold text-sm text-zinc-300">{item.title}</span>
                                <ChevronRight className="w-4 h-4 text-zinc-800 ml-auto" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Form Side */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-950 border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066FF]/10 blur-[100px] -z-10 group-hover:bg-[#0066FF]/20 transition-all duration-700" />
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 flex items-center gap-2">
                                    <User className="w-3 h-3" /> {lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 outline-none transition-all placeholder:text-zinc-700"
                                    placeholder={lang === 'ar' ? 'ادخل اسمك هنا...' : 'Enter your name...'}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 flex items-center gap-2">
                                    <Mail className="w-3 h-3" /> {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 outline-none transition-all placeholder:text-zinc-700"
                                    placeholder="example@nexitsolu.com"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 flex items-center gap-2">
                                    <Building2 className="w-3 h-3" /> {lang === 'ar' ? 'الشركة' : 'Company Name'}
                                </label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-[#0066FF] outline-none transition-all placeholder:text-zinc-700"
                                    placeholder={lang === 'ar' ? 'اختياري...' : 'Optional...'}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 flex items-center gap-2">
                                    <Search className="w-3 h-3" /> {lang === 'ar' ? 'الخدمة المطلوبة' : 'Requested Service'}
                                </label>
                                <select
                                    required
                                    value={formData.service}
                                    onChange={e => setFormData({ ...formData, service: e.target.value })}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-[#0066FF] outline-none transition-all text-white"
                                >
                                    <option value="" className="bg-zinc-950 font-bold">{lang === 'ar' ? 'اختر خدمة...' : 'Select service...'}</option>
                                    <option value="Software" className="bg-zinc-950">Software Development</option>
                                    <option value="Hardware" className="bg-zinc-950">Hardware Systems</option>
                                    <option value="Network" className="bg-zinc-950">Networking & Infrastructure</option>
                                    <option value="ERP" className="bg-zinc-950">ERP Systems</option>
                                    <option value="Others" className="bg-zinc-950">Others</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 flex items-center gap-2">
                                <MessageSquare className="w-3 h-3" /> {lang === 'ar' ? 'تفاصيل الطلب' : 'Request Details'}
                            </label>
                            <textarea
                                required
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-[#0066FF] outline-none transition-all placeholder:text-zinc-700 min-h-[120px] resize-none"
                                placeholder={lang === 'ar' ? 'يرجى كتابة تفاصيل ما تحتاجه شركتم من حلول...' : 'Briefly explain what solutions your company needs...'}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#0066FF] text-white py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:shadow-[0_0_30px_rgba(0,102,255,0.3)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            {lang === 'ar' ? 'إرسال الطلب الآن' : 'Submit Request Now'}
                        </button>
                        
                        <p className="text-[10px] text-zinc-500 text-center uppercase font-bold tracking-tighter">
                            {lang === 'ar' ? 'بمجرد الإرسال، سيتم التواصل معكم خلال أقل من 12 ساعة.' : 'Once submitted, we usually respond in less than 12 hours.'}
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}
