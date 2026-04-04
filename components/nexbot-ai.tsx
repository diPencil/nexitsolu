"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, Star, ArrowUpRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n-context"
import { useRouter } from "next/navigation"

export function NexBotAI() {
    const { lang } = useLanguage()
    const router = useRouter()
    const [placeholder, setPlaceholder] = useState("")
    const [inputValue, setInputValue] = useState("")

    const quickReplies = lang === "ar" 
        ? [
            { id: 'services', label: 'خدماتنا', message: 'ماهي الخدمات التي تقدمها نكست؟' },
            { id: 'it_accelerators', label: 'تحسين تقني', message: 'أريد معرفة المزيد عن IT Accelerators' },
            { id: 'managed_it', label: 'الدعم المدار', message: 'أخبرني عن خدمات الدعم المدار (Managed IT)' },
            { id: 'contact', label: 'التواصل', message: 'كيف يمكنني التواصل معكم؟' }
        ]
        : [
            { id: 'services', label: 'Our Services', message: 'What services does Nexit offer?' },
            { id: 'it_accelerators', label: 'IT Accelerators', message: 'Tell me about IT Accelerators' },
            { id: 'managed_it', label: 'Managed IT', message: 'Tell me about Managed IT services' },
            { id: 'support', label: 'Support', message: 'How can I contact support?' }
        ]

    const phrases = lang === "ar"
        ? ["اسألني عن حلول البنية التحتية...", "كيف نبدأ رحلة التحول الرقمي؟", "ما هي أفضل خدمات الاستضافة؟", "احتاج إلى دعم فني فوري", "كيف أحمي بيانات شركتي؟"]
        : ["Ask about infrastructure solutions...", "How to start digital transformation?", "What are the best hosting services?", "I need instant technical support", "How to protect my company data?"]

    useEffect(() => {
        let isActive = true
        let currentPhraseIndex = 0
        let charIndex = 0
        let isDeleting = false
        let timeout: NodeJS.Timeout

        const type = () => {
            if (!isActive) return

            const currentPhrase = phrases[currentPhraseIndex]
            
            if (isDeleting) {
                setPlaceholder(currentPhrase.substring(0, charIndex - 1))
                charIndex--
            } else {
                setPlaceholder(currentPhrase.substring(0, charIndex + 1))
                charIndex++
            }

            let typingSpeed = isDeleting ? 50 : 100

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true
                typingSpeed = 2000
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length
                typingSpeed = 500
            }

            timeout = setTimeout(type, typingSpeed)
        }

        timeout = setTimeout(type, 1000)
        return () => {
            isActive = false
            clearTimeout(timeout)
        }
    }, [lang])

    const handleNavigate = (text: string) => {
        if (!text.trim()) return
        router.push(`/nexbot?q=${encodeURIComponent(text)}`)
    }

    return (
        <section className="relative z-20 container mx-auto px-4 pt-8 pb-16 md:py-24">
            <div className="relative rounded-4xl md:rounded-[4rem] bg-card border border-border hover:border-[#0066FF]/50 hover:shadow-[0_0_80px_rgba(0,102,255,0.15)] transition-all duration-700 p-6 md:py-16 md:px-8 text-center overflow-hidden group">
                {/* Background Glows */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity">
                    <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-[#0066FF] rounded-full blur-[120px]" />
                    <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-[#0066FF] rounded-full blur-[120px]" />
                </div>

                <div className="flex items-center justify-center gap-2 mb-4 md:mb-6 text-[#0066FF] font-bold uppercase tracking-widest text-[8px] md:text-xs animate-fade-in relative z-10">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 fill-[#0066FF]/20" />
                    {lang === "ar" ? "مرحبًا بك في مستقبل الدعم" : "Welcome to the future of support"}
                </div>

                <h2 className="text-2xl md:text-6xl font-semibold tracking-tighter leading-tight mb-4 md:mb-8 relative z-10">
                    {lang === "ar" ? "مساعد" : "Meet Our"} <span className="text-[#0066FF] mx-1 md:mx-2">{lang === "ar" ? "نيكسيت الذكي" : "NexBot AI"}</span>
                </h2>

                <p className="text-muted-foreground mb-6 md:mb-10 max-w-lg mx-auto text-xs md:text-lg px-2 leading-relaxed relative z-10">
                    {lang === "ar"
                        ? "احصل على إجابات فورية حول خدماتنا وتقنياتنا وحلول البنية التحتية."
                        : "Get instant answers about our services, infrastructure solutions, and technology."}
                </p>

                <div className="max-w-xl mx-auto flex flex-col md:block gap-3 md:gap-4 relative mb-10 md:mb-12 z-10">
                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleNavigate(inputValue); }}
                        className="w-full flex flex-col md:block"
                    >
                        <div className="relative w-full">
                            <div className={`absolute top-1/2 -translate-y-1/2 ${lang === "ar" ? "right-4 md:right-6" : "left-4 md:left-6"} z-10 text-[#0066FF]`}>
                                <Star className="w-4 h-4 md:w-5 md:h-5 fill-[#0066FF]" />
                            </div>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={placeholder}
                                className={`w-full bg-background/80 backdrop-blur-xl border border-border rounded-full ${lang === "ar" ? "pr-10 md:pr-14 pl-4 md:pl-44" : "pl-10 md:pl-14 pr-4 md:pr-44"} py-4 md:py-6 text-[10px] md:text-lg focus:outline-none focus:border-[#0066FF] transition-all placeholder:text-muted-foreground text-foreground`}
                            />
                        </div>
                        <Button 
                            type="submit"
                            className={`mt-4 md:mt-0 md:absolute ${lang === "ar" ? "md:left-2" : "md:right-2"} md:top-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-4 md:py-0 h-10 md:h-[calc(100%-16px)] font-black uppercase tracking-widest text-[9px] md:text-xs flex items-center justify-center gap-2 w-full md:w-auto transition-all`}
                        >
                            {lang === "ar" ? "اسأل الآن" : "ASK NOW"}
                            <ArrowUpRight className="w-4 h-4" />
                        </Button>
                    </form>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-8 relative z-10">
                    {quickReplies.map((reply) => (
                        <button
                            key={reply.id}
                            onClick={() => handleNavigate(reply.message)}
                            className="px-3 md:px-5 py-1.5 md:py-2.5 rounded-full bg-secondary border border-border hover:border-[#0066FF]/50 text-muted-foreground hover:text-[#0066FF] transition-all text-[8px] md:text-xs font-bold uppercase tracking-widest"
                        >
                            {reply.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-10 text-[7px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-widest relative z-10">
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-[#0066FF]" />
                        {lang === "ar" ? "ردود فورية" : "Instant Responses"}
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-[#0066FF]" />
                        {lang === "ar" ? "دعم ذكي 24/7" : "24/7 AI Support"}
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-[#0066FF]" />
                        {lang === "ar" ? "تحليل دقيق" : "Precision Analysis"}
                    </span>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex flex-col items-center justify-center gap-2 text-center text-xs md:text-sm text-muted-foreground font-medium relative z-10">
                    <div className="mt-2 text-[7px] md:text-[9px] opacity-80 max-w-4xl px-4 leading-relaxed tracking-wider font-bold text-foreground">
                        NexBOT Powered by SuperFeliz AI | &quot;Feliz&quot; (proprietary AI agent) of diPencil Studio. All rights reserved by <a href="https://dipencil.com" target="_blank" rel="noopener noreferrer" className="text-[#0066FF] hover:underline decoration-2 underline-offset-4 transition-all">Pencil Company</a> © 2026
                    </div>
                </div>
            </div>
        </section>
    )
}
