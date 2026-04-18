"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Lock, User, ArrowRight, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n-context"

export default function LoginPage() {
    const { lang } = useLanguage()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        identifier: "",
        password: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const res = await signIn("credentials", {
                ...formData,
                redirect: false
            })

            if (res?.error) {
                setError(lang === 'ar' ? "فشل تسجيل الدخول. تأكد من البيانات." : "Login failed. Check your credentials.")
            } else {
                router.push("/store")
                router.refresh()
            }
        } catch (err) {
            setError(lang === 'ar' ? "حدث خطأ ما." : "Something went wrong.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#0066FF]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0066FF]/10 text-[#0066FF] mb-6">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            {lang === 'ar' ? 'مرحباً بعودتك' : 'Welcome Back'}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {lang === 'ar' ? 'سجل دخولك للوصول إلى حسابك' : 'Sign in to access your account'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <User className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 text-muted-foreground`} />
                                <input
                                    type="text"
                                    required
                                    placeholder={lang === 'ar' ? 'البريد أو اسم المستخدم' : 'Email or Username'}
                                    className={`w-full bg-secondary border border-border rounded-2xl py-4 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-foreground focus:border-[#0066FF] outline-none transition-all placeholder:text-muted-foreground`}
                                    value={formData.identifier}
                                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                                />
                            </div>
                            <div className="relative">
                                <Lock className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 text-muted-foreground`} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}
                                    className={`w-full bg-secondary border border-border rounded-2xl py-4 ${lang === 'ar' ? 'pr-12 pl-14' : 'pl-12 pr-14'} text-foreground focus:border-[#0066FF] outline-none transition-all placeholder:text-muted-foreground`}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((value) => !value)}
                                    className={`absolute top-1/2 -translate-y-1/2 ${lang === 'ar' ? 'left-4' : 'right-4'} text-muted-foreground hover:text-[#0066FF] transition-colors`}
                                    aria-label={showPassword ? (lang === 'ar' ? 'إخفاء كلمة المرور' : 'Hide password') : (lang === 'ar' ? 'إظهار كلمة المرور' : 'Show password')}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-xs text-center border border-red-500/20 bg-red-500/5 py-3 rounded-xl">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-lg transition-all group shadow-[0_0_30px_rgba(0,102,255,0.2)]"
                        >
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <span className="flex items-center gap-2">
                                    {lang === 'ar' ? 'دخول' : 'Sign In'}
                                    <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center pt-8 border-t border-border">
                        <p className="text-muted-foreground text-sm">
                            {lang === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{" "}
                            <Link href="/register" className="text-[#0066FF] font-bold hover:underline">
                                {lang === 'ar' ? 'أنشئ حساباً الآن' : 'Create one now'}
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
