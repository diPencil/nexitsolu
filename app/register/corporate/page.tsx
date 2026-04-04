"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { User, Mail, Lock, Building2, Briefcase, Phone, MapPin, Loader2, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { toast } from "sonner"

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.552 4.197 1.6 6.037L0 24l6.105-1.605a11.774 11.774 0 005.94 1.605c6.634 0 12.048-5.414 12.048-12.05 0-3.212-1.25-6.232-3.522-8.505" fill="currentColor" stroke="none" />
    </svg>
)

export default function CorporateRegisterPage() {
    const { lang } = useLanguage()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        username: "",     // Used for Company Name
        name: "",         // Used for Account Owner Name
        position: "",     // Used for Position (Owner, Manager, etc.)
        email: "",        // Company Email
        phone: "",        // Company Phone
        whatsapp: "",     // Company WhatsApp
        governorate: "",  // Governorate
        password: ""      // Password
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch("/api/corporate/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast.success(lang === 'ar' ? "تم إنشاء حساب الشركة بنجاح!" : "Corporate account created successfully!")
                router.push("/login")
            } else {
                const errText = await res.text()
                toast.error(errText || (lang === 'ar' ? "فشل إنشاء الحساب." : "Failed to create account."))
            }
        } catch (err) {
            toast.error(lang === 'ar' ? "حدث خطأ ما." : "Something went wrong.")
        } finally {
            setIsLoading(false)
        }
    }

    const governorates = [
        "القاهرة (Cairo)", "الإسكندرية (Alexandria)", "الجيزة (Giza)", "بورسعيد (Port Said)", "السويس (Suez)", "دمياط (Damietta)", 
        "الدقهلية (Dakahlia)", "الشرقية (Sharkia)", "القليوبية (Kaliobia)", "كفر الشيخ (Kafr El Sheikh)", "الغربية (Gharbia)", 
        "المنوفية (Menofia)", "البحيرة (Beheira)", "الإسماعيلية (Ismailia)", "بني سويف (Beni Suef)", "الفيوم (Faiyum)", 
        "المنيا (Minya)", "أسيوط (Asyut)", "سوهاج (Sohag)", "قنا (Qena)", "الأقصر (Luxor)", "أسوان (Aswan)", 
        "الغردقة (Hurghada)", "رأس غارب (Ras Gharib)", "سفاجا (Safaga)", "القصير (El Qusiar)", "مرسى علم (Marsa Alam)", "الشلاتين (Shalateen)", "حلايب (Halaib)", 
        "الوادي الجديد (Wadi El Gedid)", "مطروح (Matrouh)", "شمال سيناء (North Sinai)", 
        "شرم الشيخ (Sharm El Sheikh)", "دهب (Dahab)", "نويبع (Nuweiba)", "طابا (Taba)", "سانت كاترين (Saint Catherine)", "الطور (El Tor)", "رأس سدر (Ras Sedr)"
    ]

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 lg:p-12 relative overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#0066FF]/10 rounded-full blur-[100px]" />
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl relative z-10"
            >
                <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0066FF]/10 text-[#0066FF] mb-6">
                            <Building2 className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            {lang === 'ar' ? 'تسجيل الشركات' : 'Corporate Registration'}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {lang === 'ar' ? 'انضم لشركائنا واحصل على خدمات ودعم تقني مخصص لشركتك' : 'Join our partners and get customized enterprise tech support'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                        {/* Company Name (Mapped to Username) */}
                        <div className="relative md:col-span-2">
                            <Building2 className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 text-zinc-600`} />
                            <input
                                type="text"
                                required
                                placeholder={lang === 'ar' ? 'اسم الشركة' : 'Company Name'}
                                className={`w-full bg-secondary border border-border rounded-2xl py-4 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-foreground focus:border-[#0066FF] outline-none transition-all placeholder:text-muted-foreground`}
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>

                        {/* Account Owner Name */}
                        <div className="relative w-full">
                            <User className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 text-zinc-600`} />
                            <input
                                type="text"
                                required
                                placeholder={lang === 'ar' ? 'اسم صاحب الحساب' : 'Account Owner Name'}
                                className={`w-full bg-secondary border border-border rounded-2xl py-4 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-foreground focus:border-[#0066FF] outline-none transition-all placeholder:text-muted-foreground`}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Position */}
                        <div className="relative w-full">
                            <Briefcase className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 text-zinc-600`} />
                            <select
                                required
                                className={`w-full bg-secondary border border-border rounded-2xl py-4 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-foreground focus:border-[#0066FF] outline-none transition-all appearance-none cursor-pointer`}
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            >
                                <option value="" disabled className="text-muted-foreground">
                                    {lang === 'ar' ? 'المنصب في الشركة' : 'Your Position'}
                                </option>
                                <option value="Owner">{lang === 'ar' ? 'صاحب الشركة' : 'Company Owner'}</option>
                                <option value="Department Manager">{lang === 'ar' ? 'مدير قسم' : 'Department Manager'}</option>
                                <option value="Contract Manager">{lang === 'ar' ? 'مسؤول تعاقدات' : 'Contract Manager'}</option>
                                <option value="Other">{lang === 'ar' ? 'أخرى' : 'Other'}</option>
                            </select>
                        </div>

                        {/* Company Email */}
                        <div className="relative">
                            <Mail className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 text-zinc-600`} />
                            <input
                                type="email"
                                required
                                placeholder={lang === 'ar' ? 'إيميل الشركة' : 'Company Email'}
                                className={`w-full bg-secondary border border-border rounded-2xl py-4 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-foreground focus:border-[#0066FF] outline-none transition-all placeholder:text-muted-foreground`}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* Company Phone */}
                        <div className="relative">
                            <Phone className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 text-zinc-600`} />
                            <input
                                type="tel"
                                required
                                placeholder={lang === 'ar' ? 'رقم الخاص بالشركة' : 'Company Phone'}
                                className={`w-full bg-secondary border border-border rounded-2xl py-4 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-foreground focus:border-[#0066FF] outline-none transition-all placeholder:text-muted-foreground`}
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        {/* Company WhatsApp */}
                        <div className="relative w-full">
                            <WhatsAppIcon className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 text-zinc-600`} />
                            <input
                                type="tel"
                                required
                                placeholder={lang === 'ar' ? 'رقم الواتساب الخاص بالشركة' : 'Company WhatsApp Number'}
                                className={`w-full bg-secondary border border-border rounded-2xl py-4 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-foreground focus:border-[#0066FF] outline-none transition-all placeholder:text-muted-foreground`}
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                            />
                        </div>

                        {/* Governorate */}
                        <div className="relative w-full">
                            <MapPin className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 text-muted-foreground/80 z-10 pointer-events-none`} />
                            <select
                                required
                                className={`w-full bg-secondary border border-border rounded-2xl py-4 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-foreground focus:border-[#0066FF] outline-none transition-all appearance-none cursor-pointer relative z-0`}
                                value={formData.governorate}
                                onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                            >
                                <option value="" disabled className="text-muted-foreground">
                                    {lang === 'ar' ? 'اختار المحافظة' : 'Select Governorate'}
                                </option>
                                {governorates.map((gov) => (
                                    <option key={gov} value={gov}>
                                        {gov}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Password */}
                        <div className="relative md:col-span-2">
                            <Lock className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 text-zinc-600`} />
                            <input
                                type="password"
                                required
                                placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}
                                className={`w-full bg-secondary border border-border rounded-2xl py-4 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-foreground focus:border-[#0066FF] outline-none transition-all placeholder:text-muted-foreground`}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="md:col-span-2 w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>{lang === 'ar' ? 'تسجيل الشركة' : 'Register Company'}</span>
                                    <ArrowRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-muted-foreground">
                        {lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}
                        <Link href="/login" className="text-[#0066FF] hover:underline mx-1">
                            {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
