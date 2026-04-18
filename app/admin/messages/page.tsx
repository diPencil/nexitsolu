"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search,
    MessageCircle,
    Send,
    User,
    MoreVertical,
    CheckCheck,
    Loader2,
    ArrowLeft,
    X,
    ShieldCheck
} from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { pusherClient } from "@/lib/pusher"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

export default function AdminMessages() {
    const { lang } = useLanguage()
    const { data: session } = useSession()
    const [selectedConversation, setSelectedConversation] = useState<any>(null)
    const [conversations, setConversations] = useState<any[]>([])
    const [messages, setMessages] = useState<any[]>([])
    const [input, setInput] = useState("")
    const [isLoadingConversations, setIsLoadingConversations] = useState(true)
    const [isLoadingMessages, setIsLoadingMessages] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [showCloseMenu, setShowCloseMenu] = useState(false)
    const [showCloseModal, setShowCloseModal] = useState(false)
    const [closeReason, setCloseReason] = useState("resolved")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const fetchConversations = async () => {
        try {
            const res = await fetch("/api/admin/messages/conversations")
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
        fetchConversations()
        
        // Polling fallback
        const interval = setInterval(() => {
            fetchConversations()
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (!selectedConversation || !session?.user) return

        const fetchMsgs = () => {
            fetch(`/api/admin/messages/${selectedConversation.id}`)
                .then(res => res.json())
                .then(data => {
                    setMessages(data)
                    setIsLoadingMessages(false)
                })
        }
        
        fetchMsgs()
        
        // Polling fallback for messages
        const interval = setInterval(fetchMsgs, 5000)

        // Subscribe to real-time for this specific conversation
        const channel = pusherClient.subscribe(`conversation-${selectedConversation.id}`)

        channel.bind("new-message", (data: any) => {
            setMessages((prev: any[]) => {
                const exists = prev.find(m => m.id === data.id);
                if (exists) return prev;
                return [...prev, data];
            });
            // Also refresh conversations list to update last message/time
            fetchConversations()
        })

        channel.bind("conversation-closed", (data: any) => {
            if (selectedConversation.id === data.id) {
                setSelectedConversation((prev: any) => ({ ...prev, status: 'CLOSED', closedReason: data.reason }));
            }
            fetchConversations()
        });

        return () => {
            clearInterval(interval)
            pusherClient.unsubscribe(`conversation-${selectedConversation.id}`)
        }
    }, [selectedConversation, session])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || !selectedConversation || isSending) return

        setIsSending(true)
        try {
            const res = await fetch(`/api/admin/messages/${selectedConversation.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: input })
            })
            if (res.ok) {
                setInput("")
                // Message will be added via Pusher or next poll
            } else {
                let detail = lang === 'ar' ? "فشل الإرسال" : "Failed to send"
                const raw = await res.text()
                try {
                    const data = JSON.parse(raw) as { error?: string }
                    if (data?.error && typeof data.error === "string") detail = data.error
                    else if (raw && !data?.error) detail = raw.slice(0, 200)
                } catch {
                    if (raw) detail = raw.slice(0, 200)
                }
                toast.error(detail)
            }
        } catch (error) {
            console.error("Failed to send", error)
            toast.error(lang === 'ar' ? "فشل الإرسال" : "Failed to send")
        } finally {
            setIsSending(false)
        }
    }

    const handleCloseConversation = async () => {
        if (!selectedConversation) return;
        
        try {
            const res = await fetch(`/api/admin/messages/${selectedConversation.id}/close`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: closeReason })
            });

            if (res.ok) {
                toast.success(lang === 'ar' ? "تم إغلاق المحادثة" : "Conversation closed");
                setShowCloseModal(false);
                setShowCloseMenu(false);
                fetchConversations();
            }
        } catch (error) {
            toast.error(lang === 'ar' ? "حدث خطأ" : "An error occurred");
        }
    }

    const closeReasons = [
        { id: "resolved", ar: "تم حل المشكلة", en: "Issue resolved" },
        { id: "phone", ar: "سنتواصل بك هاتفياً", en: "Will contact via phone" },
        { id: "followup", ar: "متابعة لاحقة", en: "Follow-up scheduled" },
        { id: "other", ar: "أخرى", en: "Other" }
    ];

    const filteredConversations = conversations.filter(c => 
        (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.ticketId || '').toLowerCase().includes(searchQuery.toLowerCase())
    )

    const isClosed = selectedConversation?.status === 'CLOSED';

    return (
        <div className="h-[calc(100vh-160px)] flex flex-col gap-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{lang === 'ar' ? 'محادثات الدعم' : 'Support Conversations'}</h1>
                    <p className="text-muted-foreground">{lang === 'ar' ? 'إدارة محادثات الدعم المباشر مع العملاء.' : 'Manage live support conversations with customers.'}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-border px-4 py-2 rounded-2xl">
                        <MessageCircle className="w-4 h-4 text-[#0066FF]" />
                        <span className="text-sm font-bold">{conversations.length}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-widest">{lang === 'ar' ? 'محادثة' : 'chats'}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex gap-6 md:gap-8 flex-col lg:flex-row overflow-hidden min-h-0">
                {/* User List */}
                <div className={`lg:w-96 flex flex-col gap-6 min-h-0 ${selectedConversation ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="relative">
                        <Search className={`absolute top-3.5 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 text-muted-foreground/60`} />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={lang === 'ar' ? 'البحث عن تذكرة...' : "Search tickets..."}
                            className={`w-full bg-background border border-input rounded-2xl py-3.5 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-sm focus:border-primary outline-none transition-all placeholder:text-muted-foreground`}
                        />
                    </div>

                <div className="flex-1 bg-card border border-border rounded-2xl overflow-hidden shadow-none h-[calc(100vh-250px)] flex flex-col min-h-0">
                    {isLoadingConversations ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground text-sm">
                            {lang === 'ar' ? 'لا توجد تذاكر دعم' : 'No support tickets found'}
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0">
                            {filteredConversations.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => setSelectedConversation(chat)}
                                    className={`w-full p-4 rounded-2xl transition-all flex items-center gap-4 group text-start border ${selectedConversation?.id === chat.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:bg-muted text-muted-foreground'}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 ${selectedConversation?.id === chat.id ? 'bg-primary-foreground/20 text-primary-foreground' : (chat.status === 'CLOSED' ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary')}`}>
                                        {chat.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 text-start overflow-hidden">
                                        <div className="flex justify-between items-center mb-0.5 gap-2">
                                            <h4 className={`font-bold text-sm truncate ${selectedConversation?.id === chat.id ? 'text-primary-foreground' : 'text-foreground'}`}>
                                                {chat.name}
                                            </h4>
                                            <span className="text-[9px] opacity-60 whitespace-nowrap">{chat.time}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={`text-xs truncate flex-1 ${selectedConversation?.id === chat.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                                {chat.ticketId} - {chat.lastMsg}
                                            </p>
                                            {chat.status === 'CLOSED' && (
                                                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${selectedConversation?.id === chat.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-green-500/10 text-green-500'}`}>
                                                    {lang === 'ar' ? 'مغلق' : 'Closed'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 bg-card border border-border rounded-[3rem] flex flex-col overflow-hidden relative ${!selectedConversation ? 'hidden lg:flex' : 'flex'}`}>
                {selectedConversation ? (
                    <>
                        <header className="p-6 border-b border-border bg-muted/30 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setSelectedConversation(null)}
                                    className="lg:hidden p-2 rounded-xl bg-background text-foreground hover:bg-muted transition-all"
                                >
                                    <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                                </button>
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                                    {selectedConversation.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground text-sm md:text-base">
                                        {selectedConversation.name} 
                                        <span className="ml-2 text-xs text-primary font-black">{selectedConversation.ticketId}</span>
                                    </h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isClosed ? 'bg-muted-foreground' : 'bg-green-500 animate-pulse'}`} />
                                        <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">
                                            {selectedConversation.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {!isClosed && (
                                    <button 
                                        onClick={() => setShowCloseMenu(!showCloseMenu)}
                                        className={`p-3 rounded-2xl transition-all ${showCloseMenu ? 'bg-muted text-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                )}

                                <AnimatePresence>
                                    {showCloseMenu && !isClosed && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                            className={`absolute ${lang === 'ar' ? 'left-6' : 'right-6'} top-20 w-56 bg-popover border border-border rounded-3xl shadow-none z-50 overflow-hidden backdrop-blur-3xl`}
                                        >
                                            <button 
                                                onClick={() => setShowCloseModal(true)}
                                                className="w-full px-5 py-4 text-start hover:bg-muted flex items-center gap-3 text-destructive transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                                <span className="text-sm font-bold">{lang === 'ar' ? 'إغلاق المحادثة' : 'Close Conversation'}</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </header>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                            {isLoadingMessages ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <p className="text-sm font-medium">{lang === 'ar' ? 'جاري تحميل الرسائل...' : 'Loading messages...'}</p>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4 opacity-50">
                                    <div className="bg-muted px-4 py-2 border-y border-border">
                                        <MessageCircle className="w-10 h-10" />
                                    </div>
                                    <p className="text-sm font-medium">{lang === 'ar' ? 'لا توجد رسائل بعد. ابدأ المحادثة!' : 'No messages yet. Say hi!'}</p>
                                </div>
                            ) : (
                                <>
                                    {messages.map((m, i) => {
                                        const isMe = m.senderId === (session?.user as any).id
                                        return (
                                            <motion.div 
                                                key={m.id || i}
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[80%] md:max-w-[70%] p-4 md:p-5 rounded-3xl text-sm leading-relaxed ${isMe 
                                                    ? "bg-primary text-primary-foreground font-black border-primary"
                                                    : "bg-muted text-muted-foreground hover:bg-muted/80 border-border"
                                                }`}>
                                                    <p className="whitespace-pre-wrap">{m.content}</p>
                                                    <div className={`flex items-center justify-end mt-2 opacity-50 text-[8px] font-bold ${isMe ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                                                        <p className={`text-[10px] mt-1 opacity-60 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                        {isMe && <CheckCheck className="w-3 h-3 ml-1.5" />}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {isClosed ? (
                            <div className="p-6 border-t border-border bg-muted/50 text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h4 className="text-foreground font-bold text-sm">
                                    {lang === 'ar' ? 'هذه المحادثة مغلقة' : 'This conversation is closed'}
                                </h4>
                                <p className="text-muted-foreground text-[11px] max-w-md mx-auto leading-relaxed">
                                    {lang === 'ar' 
                                        ? `سبب الإغلاق: ${selectedConversation.closedReason === 'resolved' ? 'تم الحل' : (selectedConversation.closedReason === 'phone' ? 'تواصل هاتفياً' : (selectedConversation.closedReason === 'followup' ? 'متابعة' : 'أخرى'))}`
                                        : `Closed reason: ${selectedConversation.closedReason === 'resolved' ? 'Issue Resolved' : (selectedConversation.closedReason === 'phone' ? 'Phone Follow-up' : (selectedConversation.closedReason === 'followup' ? 'Scheduled Follow-up' : 'Other'))}`}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSend} className="p-6 md:p-8 border-t border-border bg-background/30 backdrop-blur-md flex gap-4 shrink-0">
                                <input
                                    autoFocus
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={lang === 'ar' ? 'اكتب ردك هنا...' : "Type your reply..."}
                                    className="flex-1 bg-background border border-input rounded-2xl px-6 py-4 text-sm text-foreground focus:border-primary outline-none transition-all placeholder:text-muted-foreground shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={isSending || !input.trim()}
                                    className="h-14 w-14 md:w-auto md:px-8 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-none font-bold disabled:opacity-50 disabled:grayscale"
                                >
                                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            <span className="hidden md:inline">{lang === 'ar' ? 'إرسال' : 'Send'}</span>
                                            <Send className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-6">
                        <div className="relative">
                            <MessageCircle className="w-24 h-24 mb-6 opacity-5 animate-pulse" />
                            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground/50">{lang === 'ar' ? 'حدد تذكرة للبدء' : 'Select a ticket to start'}</h3>
                        <p className="text-sm max-w-xs text-center leading-relaxed">
                            {lang === 'ar' ? 'اختر تذكرة دعم من القائمة الجانبية للرد على استفسارات العملاء.' : 'Choose a support ticket from the sidebar to reply to customer inquiries.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Close Conversation Modal */}
            <AnimatePresence>
                {showCloseModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-100 flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-card border-border shadow-none max-w-md rounded-[2.5rem] p-8 relative"
                        >
                            <h3 className="text-xl font-bold mb-6 text-foreground">
                                {lang === 'ar' ? 'إغلاق هذه التذكرة؟' : 'Close this ticket?'}
                            </h3>
                            
                            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                                {lang === 'ar' 
                                    ? 'يرجى اختيار سبب إغلاق التذكرة لتنبيه المستخدم.' 
                                    : 'Please select a reason for closing to notify the user.'}
                            </p>

                            <div className="space-y-3 mb-8">
                                {closeReasons.map((reason) => (
                                    <button
                                        key={reason.id}
                                        onClick={() => setCloseReason(reason.id)}
                                        className={`w-full p-4 rounded-2xl border transition-all text-start flex items-center justify-between ${
                                            closeReason === reason.id 
                                                ? 'bg-primary text-primary-foreground font-bold shadow-none' 
                                                : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                                        }`}
                                    >
                                        <span className="text-sm font-bold">{lang === 'ar' ? reason.ar : reason.en}</span>
                                        {closeReason === reason.id && <CheckCheck className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowCloseModal(false)}
                                    className="flex-1 py-4 rounded-2xl bg-secondary text-muted-foreground/70 font-bold hover:bg-muted transition-all border border-border"
                                >
                                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                                </button>
                                <button
                                    onClick={handleCloseConversation}
                                    className="flex-1 py-4 rounded-2xl bg-[#0066FF] text-primary-foreground font-bold hover:bg-blue-600 transition-all shadow-none"
                                >
                                    {lang === 'ar' ? 'إغلاق الآن' : 'Close Now'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
)
}
