"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, User, Loader2, Sparkles, CheckCheck, History, ArrowLeft, Clock, Copy, ThumbsUp, ThumbsDown, Share2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { pusherClient } from "@/lib/pusher"
import { useLanguage } from "@/lib/i18n-context"
import { usePathname } from "next/navigation"

export function ChatBubble() {
    const { data: session } = useSession()
    const { lang } = useLanguage()
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<any[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isClosed, setIsClosed] = useState(false)
    const [closeReason, setCloseReason] = useState<string | null>(null)
    const [view, setView] = useState<'chat' | 'history'>('chat')
    const [conversations, setConversations] = useState<any[]>([])
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
    const [isLoadingConversations, setIsLoadingConversations] = useState(false)
    const [feedback, setFeedback] = useState<Record<string, 'up' | 'down' | null>>({})
    const scrollRef = useRef<HTMLDivElement>(null)

    const fetchConversations = async () => {
        setIsLoadingConversations(true)
        try {
            const res = await fetch("/api/messages/conversations")
            if (res.ok) {
                const data = await res.json()
                setConversations(data)
            }
        } catch (error) {
            console.error("Failed to fetch conversations")
        } finally {
            setIsLoadingConversations(false)
        }
    }

    useEffect(() => {
        if (!session?.user || !isOpen) return

        // Fetch history func
        const fetchMsgs = () => {
            const url = selectedConversationId 
                ? `/api/messages?conversationId=${selectedConversationId}`
                : "/api/messages"
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    // messages in DB are desc (newest first), we want asc for chat view
                    setMessages([...data].reverse())
                    
                    // Update closure status based on the messages' conversation if selected
                    if (selectedConversationId && data.length > 0 && data[0].conversation) {
                        setIsClosed(data[0].conversation.status === "CLOSED")
                        setCloseReason(data[0].conversation.closedReason)
                    }
                })
        }

        fetchMsgs()

        // Poll messages as fallback
        const msgInterval = setInterval(fetchMsgs, 5000)

        // Fetch general profile closure status (for the latest active chat)
        if (!selectedConversationId) {
            fetch("/api/profile")
                .then(res => res.json())
                .then(data => {
                    setIsClosed(data.isSupportClosed)
                    setCloseReason(data.closedReason)
                })
        }

        // Subscribe to real-time events
        const userId = (session.user as any).id
        
        const channel = pusherClient.subscribe(`user-${userId}`)

        channel.bind("new-message", (data: any) => {
            if (!selectedConversationId || data.conversationId === selectedConversationId) {
                setMessages(prev => {
                    const exists = prev.find(m => m.id === data.id)
                    if (exists) return prev
                    return [...prev, data]
                })
                setIsClosed(false)
                setCloseReason(null)
            }
        })

        channel.bind("conversation-closed", (data: any) => {
            if (!selectedConversationId || data.id === selectedConversationId) {
                setIsClosed(true)
                setCloseReason(data.reason)
            }
        })

        return () => {
            clearInterval(msgInterval)
            pusherClient.unsubscribe(`user-${userId}`)
        }
    }, [session, isOpen, selectedConversationId])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        setIsLoading(true)
        try {
            await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: input
                })
            })
            setInput("")
        } catch (error) {
            console.error("Failed to send")
        } finally {
            setIsLoading(false)
        }
    }

    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => setIsMounted(true), [])

    if (
        !isMounted ||
        !session?.user ||
        pathname?.includes("/nexbot") ||
        pathname?.startsWith("/profile")
    )
        return null

    return (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-9999">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="absolute bottom-16 md:bottom-20 right-0 w-[calc(100vw-32px)] sm:w-[350px] md:w-[400px] h-[450px] md:h-[600px] bg-zinc-950 border border-white/10 rounded-3xl md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden backdrop-blur-3xl"
                    >
                        {/* Header */}
                        <div className="p-6 bg-[#0066FF] text-white flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                {view === 'chat' && selectedConversationId ? (
                                    <button 
                                        onClick={() => {
                                            setView('history')
                                            setSelectedConversationId(null)
                                        }}
                                        className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-all"
                                    >
                                        <ArrowLeft className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                                    </button>
                                ) : (
                                    <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-sm">
                                        {view === 'history' ? (lang === 'ar' ? 'سجل المحادثات' : 'History') : 'NexIT Support'}
                                    </h3>
                                    <p className="text-[10px] text-white/70 uppercase font-black tracking-widest">{lang === 'ar' ? 'متصل الآن' : 'Always Online'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {view === 'chat' && !selectedConversationId && (
                                    <button 
                                        onClick={() => {
                                            setView('history')
                                            fetchConversations()
                                        }}
                                        className="p-2 hover:bg-white/10 rounded-full transition-all"
                                        title={lang === 'ar' ? 'السجل' : 'History'}
                                    >
                                        <History className="w-5 h-5" />
                                    </button>
                                )}
                                {view === 'history' && (
                                    <button 
                                        onClick={() => setView('chat')}
                                        className="p-2 hover:bg-white/10 rounded-full transition-all text-xs font-bold uppercase tracking-wider"
                                    >
                                        {lang === 'ar' ? 'الدردشة' : 'Chat'}
                                    </button>
                                )}
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {view === 'history' ? (
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-950/50">
                                {isLoadingConversations ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="w-6 h-6 animate-spin text-[#0066FF]" />
                                    </div>
                                ) : conversations.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                        <Clock className="w-12 h-12 text-zinc-800 mb-4" />
                                        <p className="text-zinc-500 text-sm">
                                            {lang === 'ar' ? 'لا يوجد سجل محادثات بعد' : 'No conversation history yet'}
                                        </p>
                                    </div>
                                ) : (
                                    conversations.map(conv => (
                                        <button
                                            key={conv.id}
                                            onClick={() => {
                                                setSelectedConversationId(conv.id)
                                                setView('chat')
                                            }}
                                            className="w-full p-4 rounded-3xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 transition-all text-left flex items-center justify-between group"
                                        >
                                            <div className="flex-1 min-w-0" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-bold text-[#0066FF] uppercase tracking-tighter bg-blue-500/10 px-2 py-0.5 rounded-lg">
                                                        {conv.ticketId}
                                                    </span>
                                                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-lg uppercase ${
                                                        conv.status === 'OPEN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-500/10 text-zinc-500'
                                                    }`}>
                                                        {conv.status === 'OPEN' ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'مغلق' : 'Closed')}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-zinc-300 truncate font-medium">
                                                    {conv.messages?.[0]?.content || (lang === 'ar' ? 'لا توجد رسائل' : 'No messages')}
                                                </p>
                                                <p className="text-[8px] text-zinc-600 mt-2 uppercase font-black">
                                                    {new Date(conv.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                                                </p>
                                            </div>
                                            <ArrowLeft className={`w-4 h-4 text-zinc-700 group-hover:text-[#0066FF] transition-all transform ${lang === 'ar' ? '' : 'rotate-180'}`} />
                                        </button>
                                    ))
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Messages Area */}
                                <div 
                                    className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-[#0066FF]/40 hover:scrollbar-thumb-[#0066FF]/60 scrollbar-track-transparent overscroll-contain"
                                    data-lenis-prevent
                                >
                                    {messages.map((m, i) => {
                                        const isMe = m.senderId === (session.user as any).id
                                        return (
                                            <div key={m.id || i} className={`flex flex-col gap-2 w-full ${isMe ? 'items-end' : 'items-start'}`}>
                                                <div className={`max-w-[85%] p-3 md:p-4 rounded-2xl text-xs md:text-sm shadow-md whitespace-pre-wrap ${isMe ? 'bg-[#0066FF] text-white rounded-br-none' : 'bg-zinc-800 text-zinc-200 rounded-bl-none border border-white/5'
                                                    }`}>
                                                    {!isMe && (
                                                        <span className="mb-2 block">
                                                            <span className="text-xs text-[#0066FF] font-bold block">Feliz Oper</span>
                                                            <span className="text-[10px] text-[#0066FF] font-normal opacity-75 block">Powered by diPencil</span>
                                                        </span>
                                                    )}
                                                    <p>{m.content}</p>
                                                    <span className="text-[8px] opacity-40 mt-1 block text-end">
                                                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                {!isMe && (
                                                    <div className="flex flex-wrap items-center gap-2 md:gap-3 text-zinc-500 max-w-full px-1 w-full" dir="ltr">
                                                        <div className="flex items-center gap-0.5 shrink-0">
                                                            <button className="p-1 hover:text-white hover:bg-zinc-800 rounded-md transition-all" title="Copy" onClick={() => navigator.clipboard.writeText(m.content)}>
                                                                <Copy className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                                            </button>
                                                            <button 
                                                                className={`p-1 rounded-md transition-all ${feedback[m.id || i] === 'up' ? 'text-emerald-500 bg-zinc-800' : 'hover:text-white hover:bg-zinc-800'}`}
                                                                title="Good Response"
                                                                onClick={() => setFeedback(prev => ({ ...prev, [m.id || i]: prev[m.id || i] === 'up' ? null : 'up' }))}
                                                            >
                                                                <ThumbsUp className={`w-3 h-3 md:w-3.5 md:h-3.5 ${feedback[m.id || i] === 'up' ? 'fill-emerald-500' : ''}`} />
                                                            </button>
                                                            <button 
                                                                className={`p-1 rounded-md transition-all ${feedback[m.id || i] === 'down' ? 'text-red-500 bg-zinc-800' : 'hover:text-white hover:bg-zinc-800'}`}
                                                                title="Bad Response"
                                                                onClick={() => setFeedback(prev => ({ ...prev, [m.id || i]: prev[m.id || i] === 'down' ? null : 'down' }))}
                                                            >
                                                                <ThumbsDown className={`w-3 h-3 md:w-3.5 md:h-3.5 ${feedback[m.id || i] === 'down' ? 'fill-red-500' : ''}`} />
                                                            </button>
                                                            <button className="p-1 hover:text-white hover:bg-zinc-800 rounded-md transition-all" title="Share" onClick={() => {
                                                                if (navigator.share) {
                                                                    navigator.share({ title: 'AI Response', text: m.content })
                                                                }
                                                            }}>
                                                                <Share2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                                            </button>
                                                        </div>
                                                        <span className="text-[7px] md:text-[8px] font-medium flex items-center gap-1 whitespace-nowrap text-[#0066FF] hover:bg-[#0066FF]/10 hover:border-[#0066FF]/50 px-2 pt-1 pb-1 rounded-full border border-[#0066FF]/30 transition-all cursor-default shrink-0">
                                                            <Sparkles className="w-2.5 h-2.5" />
                                                            Creation Using SuperFeliz
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                    <div ref={scrollRef} />
                                </div>

                                {/* Input Area */}
                                {isClosed ? (
                                    <div className="p-8 border-t border-white/5 bg-zinc-900/80 text-center space-y-3 shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-[#0066FF]/10 text-[#0066FF] flex items-center justify-center mx-auto">
                                            <CheckCheck className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-white font-bold text-sm">
                                            {lang === 'ar' ? 'تم إغلاق المحادثة' : 'Conversation Closed'}
                                        </h4>
                                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                                            {lang === 'ar' 
                                                ? `السبب: ${closeReason === 'resolved' ? 'تم الحل' : (closeReason === 'phone' ? 'تواصل هاتفياً' : (closeReason === 'followup' ? 'متابعة' : 'أخرى'))}`
                                                : `Reason: ${closeReason === 'resolved' ? 'Resolved' : (closeReason === 'phone' ? 'Phone' : (closeReason === 'followup' ? 'Follow-up' : 'Other'))}`}
                                        </p>
                                        <button 
                                            onClick={() => {
                                                setIsClosed(false);
                                                setSelectedConversationId(null);
                                                setView('chat');
                                            }}
                                            className="w-full py-3 rounded-2xl bg-[#0066FF] text-white text-xs font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                                        >
                                            {lang === 'ar' ? 'بدء محادثة جديدة' : 'Start New Conversation'}
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSend} className="p-6 border-t border-white/5 bg-zinc-900/50 flex gap-3 shrink-0">
                                        <input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder={lang === 'ar' ? 'اكتب رسالتك...' : "Type your message..."}
                                            className="flex-1 bg-zinc-950 border border-white/5 rounded-2xl px-4 text-sm text-white focus:border-[#0066FF] outline-none transition-all"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-12 h-12 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                                        >
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                        </button>
                                    </form>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#0066FF] text-white shadow-2xl shadow-blue-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all relative z-10"
            >
                {isOpen ? <X className="w-6 h-6 md:w-8 md:h-8" /> : <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />}
                <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-3 h-3 md:w-5 md:h-5 bg-red-500 rounded-full border-2 md:border-4 border-black animate-pulse" />
            </button>
        </div>
    )
}
