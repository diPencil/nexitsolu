"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Star, ArrowUpRight, CheckCircle2, Bot, User, Loader2, Send, Plus, ArrowLeft, RefreshCcw, ExternalLink, MessageCircle, Copy, ThumbsUp, ThumbsDown, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n-context"
import Link from "next/link"

const FormattedMessage = ({ content, role }: { content: string, role: 'user' | 'bot' }) => {
    if (role === 'user') return <>{content}</>;

    // Step 1: Handle Markdown links [label](url)
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = markdownLinkRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            parts.push(content.substring(lastIndex, match.index));
        }
        
        const label = match[1];
        const url = match[2];
        const isExternal = url.startsWith('http');
        const isWhatsApp = url.includes('wa.me');

        parts.push(
            <Link 
                key={`md-${match.index}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-[#0066FF] hover:underline inline-flex items-center gap-1 font-bold decoration-2 underline-offset-4 mx-1 ${isWhatsApp ? 'text-emerald-500' : ''}`}
            >
                {label}
                {isWhatsApp ? <MessageCircle className="w-3 h-3" /> : (isExternal && <ExternalLink className="w-3 h-3" />)}
            </Link>
        );
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
    }

    // Step 2: Handle raw URLs, Emails, and Phone Numbers in the remaining string parts
    const rawUrlRegex = /(https?:\/\/[^\s]+)/g;
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const whatsappPhoneRegex = /(?:whatsapp|واتس\s?اب|واتساب)[:\s]*(\+?\d{10,14})/gi;
    const phoneRegex = /(\+?\d{1,4}[\s-]?\d{3,4}[\s-]?\d{3,4}[\s-]?\d{3,4}|\d{10,14})/g;

    const midParts: (string | React.ReactNode)[] = [];

    parts.forEach((part, i) => {
        if (typeof part !== 'string') {
            midParts.push(part);
            return;
        }

        let lastIdx = 0;
        let combinedRegex = new RegExp(`${rawUrlRegex.source}|${emailRegex.source}|${whatsappPhoneRegex.source}|${phoneRegex.source}`, 'gi');
        let m;

        while ((m = combinedRegex.exec(part)) !== null) {
            if (m.index > lastIdx) {
                midParts.push(part.substring(lastIdx, m.index));
            }

            const matchText = m[0];
            
            if (matchText.match(rawUrlRegex)) {
                const isWhatsApp = matchText.includes('wa.me');
                midParts.push(
                    <Link 
                        key={`url-${i}-${m.index}`}
                        href={matchText}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-[#0066FF] hover:underline inline-flex items-center gap-1 font-bold decoration-2 underline-offset-4 mx-1 ${isWhatsApp ? 'text-emerald-400' : ''}`}
                    >
                        {matchText}
                        {isWhatsApp ? <MessageCircle className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                    </Link>
                );
            } else if (matchText.match(emailRegex)) {
                midParts.push(
                    <a 
                        key={`email-${i}-${m.index}`}
                        href={`mailto:${matchText}`}
                        className="text-[#0066FF] hover:underline inline-flex items-center gap-1 font-bold decoration-2 underline-offset-4 mx-1"
                    >
                        {matchText}
                    </a>
                );
            } else if (matchText.toLowerCase().includes('whatsapp') || matchText.includes('واتساب') || matchText.includes('واتس اب')) {
                // Handle text like "WhatsApp: +2010..."
                const numMatch = matchText.match(/\+?\d{10,14}/);
                const number = numMatch ? numMatch[0].replace(/\+/g, '').replace(/\s/g, '') : '';
                midParts.push(
                    <a 
                        key={`wa-${i}-${m.index}`}
                        href={`https://wa.me/${number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-bold decoration-2 underline-offset-4 mx-1"
                    >
                        {matchText}
                        <MessageCircle className="w-3 h-3" />
                    </a>
                );
            } else if (matchText.match(phoneRegex)) {
                const cleanPhone = matchText.replace(/\s/g, '');
                midParts.push(
                    <a 
                        key={`phone-${i}-${m.index}`}
                        href={`tel:${cleanPhone}`}
                        className="text-[#0066FF] hover:underline inline-flex items-center gap-1 font-bold decoration-2 underline-offset-4 mx-1"
                    >
                        {matchText}
                    </a>
                );
            }
            lastIdx = m.index + matchText.length;
        }
        if (lastIdx < part.length) {
            midParts.push(part.substring(lastIdx));
        }
    });

    return <>{midParts}</>;
};

export default function NexBotClient() {
    const { lang } = useLanguage()
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get("q")
    
    const [inputValue, setInputValue] = useState("")
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([])
    const [feedback, setFeedback] = useState<Record<number, 'up' | 'down' | null>>({})
    const [isLoading, setIsLoading] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)
    const isInitialQueryExecuted = useRef(false)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        const isActive = messages.length > 0
        window.dispatchEvent(new CustomEvent('nexbot-chat-active', { detail: isActive }))
        
        return () => {
            window.dispatchEvent(new CustomEvent('nexbot-chat-active', { detail: false }))
        }
    }, [messages.length])

    const phrases = lang === "ar"
        ? ["اسألني عن حلول البنية التحتية...", "كيف نبدأ رحلة التحول الرقمي؟", "ما هي أفضل خدمات الاستضافة؟", "احتاج إلى دعم فني فوري", "كيف أحمي بيانات شركتي؟"]
        : ["Ask about infrastructure solutions...", "How to start digital transformation?", "What are the best hosting services?", "I need instant technical support", "How to protect my company data?"]

    const quickReplies = lang === "ar" 
        ? [
            { id: 'services', label: 'خدماتنا', message: 'ماهي الخدمات التي تقدمها نكست؟' },
            { id: 'managed_it', label: 'الدعم المدار', message: 'أخبرني عن خدمات الدعم المدار (Managed IT)' },
            { id: 'contact', label: 'التواصل', message: 'كيف يمكنني التواصل معكم؟' }
        ]
        : [
            { id: 'services', label: 'Our Services', message: 'What services does Nexit offer?' },
            { id: 'managed_it', label: 'Managed IT', message: 'Tell me about Managed IT services' },
            { id: 'contact', label: 'Support', message: 'How can I contact support?' }
        ]

    useEffect(() => {
        if (initialQuery && !isInitialQueryExecuted.current) {
            isInitialQueryExecuted.current = true
            handleSendMessage(initialQuery)
        }
    }, [initialQuery])

    useEffect(() => {
        // Only scroll if it's NOT the first message from the URL query
        if (isInitialQueryExecuted.current && messages.length <= 2) return
        
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isLoading])

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return
        
        const userMsg = { role: 'user' as const, content: text }
        setMessages(prev => [...prev, userMsg])
        setInputValue("")
        setIsLoading(true)

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    history: messages.map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content })),
                    lang
                })
            })
            const data = await res.json()
            if (data.response) {
                setMessages(prev => [...prev, { role: 'bot', content: data.response }])
            } else {
                throw new Error("Empty response from AI")
            }
        } catch (error) {
            console.error("Chat Error:", error)
            setMessages(prev => [...prev, { role: 'bot', content: lang === 'ar' ? "عذراً، حدث خطأ ما." : "Sorry, something went wrong." }])
        } finally {
            setIsLoading(false)
        }
    }

    const resetChat = () => {
        setMessages([])
        isInitialQueryExecuted.current = false
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className={`bg-[#050505] text-white flex-1 w-full flex flex-col min-h-[calc(100dvh-160px)] ${messages.length === 0 ? 'justify-start pt-32 md:pt-40 pb-0' : 'pb-0 pt-2 md:pt-4'}`}>
            <AnimatePresence mode="wait">
                {messages.length === 0 ? (
                    /* Hero Section */
                    <motion.section 
                        key="hero"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-20 container mx-auto px-4 pt-4 pb-0 md:pt-8 md:pb-0 flex-1 flex flex-col justify-center"
                    >
                        <div className="relative rounded-4xl md:rounded-[4rem] bg-zinc-950 border border-white/5 hover:border-[#0066FF]/20 transition-all duration-700 p-6 md:p-12 mb-0 text-center overflow-hidden group shadow-2xl">
                            <div className="absolute inset-0 bg-linear-to-b from-[#0066FF]/5 to-transparent pointer-events-none" />
                            
                            <div className="flex items-center justify-center gap-2 mb-6 text-[#0066FF] font-bold uppercase tracking-widest text-[10px] md:text-xs">
                                <Sparkles className="w-4 h-4 fill-[#0066FF]/20" />
                                {lang === "ar" ? "مرحبًا بك في مستقبل الدعم" : "Welcome to the future of support"}
                            </div>

                            <h1 className="text-3xl md:text-7xl font-semibold tracking-tighter leading-tight mb-1 md:mb-2 flex flex-col items-center justify-center">
                                <div>
                                    {lang === "ar" ? "مساعد" : "Meet Our"} <span className="text-[#0066FF] mx-1 md:mx-2">{lang === "ar" ? "نيكسيت الذكي" : "NexBot"}</span>
                                </div>
                            </h1>

                            <p className="text-zinc-500 mb-10 max-w-5xl mx-auto text-base md:text-lg px-2">
                                {lang === "ar"
                                    ? "احصل على إجابات فورية حول خدماتنا وتقنياتنا وحلول البنية التحتية."
                                    : "Get instant answers about our services, infrastructure solutions, and technology."}
                            </p>

                            <div className="max-w-2xl mx-auto relative mb-12">
                                <form 
                                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
                                    className="w-full flex flex-col md:block"
                                >
                                    <div className="relative w-full">
                                        <div className={`absolute top-1/2 -translate-y-1/2 ${lang === "ar" ? "right-5" : "left-5"} z-10 text-[#0066FF]`}>
                                            <Star className="w-5 h-5 fill-[#0066FF]" />
                                        </div>
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder={phrases[0]}
                                            className={`w-full bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-full ${lang === "ar" ? "pr-14 pl-4 md:pl-44" : "pl-14 pr-4 md:pr-44"} py-5 md:py-7 text-sm md:text-xl focus:outline-none focus:border-[#0066FF] transition-all placeholder:text-zinc-600 shadow-2xl`}
                                        />
                                    </div>
                                    <Button 
                                        type="submit"
                                        disabled={isLoading}
                                        className={`mt-4 md:mt-0 md:absolute ${lang === "ar" ? "md:left-2.5" : "md:right-2.5"} md:top-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full px-10 py-5 md:py-0 h-14 md:h-[calc(100%-20px)] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 w-full md:w-auto transition-all shadow-lg`}
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (lang === "ar" ? "اسأل الآن" : "ASK NOW")}
                                        <ArrowUpRight className="w-5 h-5" />
                                    </Button>
                                </form>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-8">
                                {quickReplies.map((reply) => (
                                    <button
                                        key={reply.id}
                                        onClick={() => handleSendMessage(reply.message)}
                                        className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-[#0066FF]/50 text-zinc-400 hover:text-[#0066FF] transition-all text-xs font-bold uppercase tracking-widest backdrop-blur-sm"
                                    >
                                        {reply.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-[9px] md:text-[11px] text-zinc-500 font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#0066FF]" />
                                    {lang === "ar" ? "ردود فورية" : "Instant Responses"}
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#0066FF]" />
                                    {lang === "ar" ? "دعم ذكي 24/7" : "24/7 AI Support"}
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#0066FF]" />
                                    {lang === "ar" ? "تحليل دقيق" : "Precision Analysis"}
                                </span>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center justify-center gap-2 text-center text-xs md:text-sm text-zinc-500 font-medium">
                                <div className="mt-2 text-[9px] md:text-[11px] opacity-80 max-w-4xl px-4 leading-relaxed tracking-wider font-bold text-white">
                                    NexBOT Powered by SuperFeliz AI | &quot;Feliz&quot; (proprietary AI agent) of diPencil Studio. All rights reserved by <a href="https://dipencil.com" target="_blank" rel="noopener noreferrer" className="text-[#0066FF] hover:underline decoration-2 underline-offset-4 transition-all">Pencil Company</a> © 2026
                                </div>
                            </div>
                        </div>
                    </motion.section>
                ) : (
                    /* Chat Mode Header */
                    <motion.div 
                        key="chat-header"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 py-4 mb-10"
                    >
                        <div className="container mx-auto px-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#0066FF] text-white flex items-center justify-center shadow-lg shadow-[#0066FF]/20">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-sm md:text-lg">{lang === "ar" ? "نيكسيت الذكي - تم التطوير بواسطة SuperFeliz AI" : "NexBot - by SuperFeliz AI"}</h2>
                                    <p className="text-[8px] md:text-[10px] text-zinc-500 font-medium uppercase tracking-widest">
                                        {lang === "ar" ? "مساعدك التقني الذكي" : "Your intelligent AI assistant"}
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={resetChat}
                                variant="ghost"
                                className="text-zinc-400 hover:text-white hover:bg-zinc-900 border border-white/5 rounded-full flex items-center gap-2 text-[10px] md:text-sm font-bold uppercase tracking-widest px-4 py-2"
                            >
                                <RefreshCcw className="w-3 h-3 md:w-4 md:h-4" />
                                <span>{lang === "ar" ? "محادثة جديدة" : "New Chat"}</span>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Messages Section */}
            <section className="container mx-auto px-4 max-w-4xl pb-16 md:pb-20">
                <div className="space-y-8">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-4 max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl shrink-0 flex items-center justify-center shadow-lg ${msg.role === 'user' ? 'bg-zinc-800 text-zinc-400' : 'bg-[#0066FF] text-white'}`}>
                                    {msg.role === 'user' ? <User className="w-5 h-5 md:w-6 md:h-6" /> : <Bot className="w-5 h-5 md:w-6 md:h-6" />}
                                </div>
                                <div className="flex flex-col gap-2 w-full max-w-[calc(100%-3rem)] md:max-w-[calc(100%-4rem)]">
                                    <div className={`p-5 md:p-8 rounded-3xl text-sm md:text-lg leading-relaxed shadow-xl whitespace-pre-wrap ${
                                        msg.role === 'user' 
                                        ? 'bg-[#0066FF] text-white rounded-tr-none' 
                                        : 'bg-zinc-900 border border-white/5 text-zinc-300 rounded-tl-none'
                                    }`}>
                                        {msg.role === 'bot' && (
                                            <span className="mb-2 md:mb-3 block">
                                                <span className="text-sm md:text-base text-[#0066FF] font-bold block">Feliz Oper</span>
                                                <span className="text-[10px] md:text-xs text-[#0066FF] font-normal opacity-75 block">Powered by diPencil</span>
                                            </span>
                                        )}
                                        <FormattedMessage content={msg.content} role={msg.role} />
                                    </div>
                                    {msg.role === 'bot' && (
                                        <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-1 md:mt-2 px-1 w-full" dir="ltr">
                                            <div className="flex items-center gap-0.5 md:gap-1.5 text-zinc-500 shrink-0">
                                                <button className="p-1.5 md:p-2 hover:text-white hover:bg-zinc-800 rounded-lg transition-all" title="Copy" onClick={() => navigator.clipboard.writeText(msg.content)}>
                                                    <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                </button>
                                                <button 
                                                    className={`p-1.5 md:p-2 rounded-lg transition-all ${feedback[i] === 'up' ? 'text-emerald-500 bg-zinc-800' : 'hover:text-white hover:bg-zinc-800'}`}
                                                    title="Good Response"
                                                    onClick={() => setFeedback(prev => ({ ...prev, [i]: prev[i] === 'up' ? null : 'up' }))}
                                                >
                                                    <ThumbsUp className={`w-3.5 h-3.5 md:w-4 md:h-4 ${feedback[i] === 'up' ? 'fill-emerald-500' : ''}`} />
                                                </button>
                                                <button 
                                                    className={`p-1.5 md:p-2 rounded-lg transition-all ${feedback[i] === 'down' ? 'text-red-500 bg-zinc-800' : 'hover:text-white hover:bg-zinc-800'}`}
                                                    title="Bad Response"
                                                    onClick={() => setFeedback(prev => ({ ...prev, [i]: prev[i] === 'down' ? null : 'down' }))}
                                                >
                                                    <ThumbsDown className={`w-3.5 h-3.5 md:w-4 md:h-4 ${feedback[i] === 'down' ? 'fill-red-500' : ''}`} />
                                                </button>
                                                <button className="p-1.5 md:p-2 hover:text-white hover:bg-zinc-800 rounded-lg transition-all" title="Share" onClick={() => {
                                                    if (navigator.share) {
                                                        navigator.share({ title: 'AI Response', text: msg.content })
                                                    }
                                                }}>
                                                    <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                </button>
                                            </div>
                                            <span className="text-[7px] md:text-[9px] font-medium flex items-center gap-1 md:gap-1.5 whitespace-nowrap text-[#0066FF] hover:bg-[#0066FF]/10 hover:border-[#0066FF]/50 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full border border-[#0066FF]/30 transition-all cursor-default shrink-0">
                                                <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                                Creation Using SuperFeliz
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    
                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="flex gap-4 max-w-[80%]">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center shadow-lg">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div className="p-8 rounded-3xl bg-zinc-900 border border-white/5 text-zinc-300 rounded-tl-none">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-[#0066FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-[#0066FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-[#0066FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={chatEndRef} />
                </div>

            </section>
            {/* Persistent Bottom Input Section */}
            {messages.length > 0 && (
                <div className="fixed bottom-0 left-0 w-full z-100 bg-linear-to-t from-[#050505] via-[#050505] to-transparent pt-2 pb-2 md:pt-3 md:pb-6">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <form 
                            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
                            className="relative w-full group"
                        >
                            <div className={`absolute top-1/2 -translate-y-1/2 ${lang === "ar" ? "right-6" : "left-6"} z-10 text-[#0066FF] group-hover:scale-110 transition-transform`}>
                                <Star className="w-5 h-5 fill-[#0066FF]" />
                            </div>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={lang === "ar" ? "اكتب رسالتك هنا..." : "Type your message here..."}
                                className={`w-full bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-full ${lang === "ar" ? "pr-14 pl-20" : "pl-14 pr-20"} py-5 md:py-6 text-sm md:text-lg focus:outline-none focus:border-[#0066FF]/50 transition-all placeholder:text-zinc-600 shadow-2xl focus:shadow-[#0066FF]/10`}
                            />
                            <button 
                                type="submit"
                                disabled={isLoading || !inputValue.trim()}
                                className={`absolute ${lang === "ar" ? "left-2" : "right-2"} top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90 disabled:opacity-50 disabled:scale-100`}
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 md:w-6 md:h-6" />}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}
