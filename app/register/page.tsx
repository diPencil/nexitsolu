"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { User, Mail, Lock, ArrowRight, Loader2, UserPlus, Phone, MapPin, AtSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n-context"
import { toast } from "sonner"

export default function RegisterPage() {
    const { lang } = useLanguage()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        phone: "",
        governorate: "",
        password: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast.success(lang === 'ar' ? "تم إنشاء الحساب بنجاح!" : "Account created successfully!")
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
                            <UserPlus className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            {lang === 'ar' ? 'انضم إلينا' : 'Join Us'}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {lang === 'ar' ? 'ابدأ تجربتك التقنية في نكست' : 'Start your tech journey with NexIT'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="relative md:col-span-2">
                            <User className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 text-muted-foreground`} />
                            <input
                                type="text"
                                required
                                placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                                className={`w-full bg-secondary border border-border rounded-2xl py-4 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-foreground focus:border-[#0066FF] outline-none transition-all placeholder:text-muted-foreground`}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Username */}
                        <div className="relative">
                            <AtSign className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 text-muted-foreground`} />
                            <input
                                type="text"
                                required
                                placeholder={lang === 'ar' ? 'اسم المستخدم' : 'Username'}
                                className={`w-full bg-secondary border border-border rounded-2xl py-4 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-foreground focus:border-[#0066FF] outline-none transition-all placeholder:text-muted-foreground`}
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>

                        {/* Phone */}
                        <div className="relative">
                            <Phone className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 text-muted-foreground`} />
                            <input
                                type="tel"
                                required
                                placeholder={lang === 'ar' ? 'رقم الموبايل' : 'Phone Number'}
                                className={`w-full bg-secondary border border-border rounded-2xl py-4 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-foreground focus:border-[#0066FF] outline-none transition-all placeholder:text-muted-foreground`}
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <Mail className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 text-muted-foreground`} />
                            <input
                                type="email"
                                required
                                placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                                className={`w-full bg-secondary border border-border rounded-2xl py-4 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-foreground focus:border-[#0066FF] outline-none transition-all placeholder:text-muted-foreground`}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* Governorate */}
                        <div className="relative">
                            <MapPin className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 text-muted-foreground`} />
                            <select
                                required
                                className={`w-full bg-secondary border border-border rounded-2xl py-4 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-foreground focus:border-[#0066FF] outline-none transition-all appearance-none cursor-pointer`}
                                value={formData.governorate}
                                onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                            >
                                <option value="" disabled className="text-muted-foreground/80">{lang === 'ar' ? 'اختر المحافظة' : 'Select Governorate'}</option>
                                {governorates.map((gov) => (
                                    <option key={gov} value={gov} className="bg-card">{gov}</option>
                                ))}
                            </select>
                        </div>

                        {/* Password */}
                        <div className="relative md:col-span-2">
                            <Lock className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 text-muted-foreground`} />
                            <input
                                type="password"
                                required
                                placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}
                                className={`w-full bg-secondary border border-border rounded-2xl py-4 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-foreground focus:border-[#0066FF] outline-none transition-all placeholder:text-muted-foreground`}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full md:col-span-2 h-14 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-foreground font-bold text-lg transition-all group mt-4 shadow-[0_0_30px_rgba(0,102,255,0.2)]"
                        >
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <span className="flex items-center gap-2">
                                    {lang === 'ar' ? 'إنشاء حساب' : 'Create Account'}
                                    <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center pt-8 border-t border-border">
                        <p className="text-muted-foreground text-sm">
                            {lang === 'ar' ? 'لديك حساب بالفعل؟' : "Already have an account?"}{" "}
                            <Link href="/login" className="text-[#0066FF] font-bold hover:underline">
                                {lang === 'ar' ? 'سجل دخولك' : 'Sign in'}
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
