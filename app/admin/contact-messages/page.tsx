"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search,
    Trash2,
    Loader2,
    X,
    Mail,
    Phone,
    Eye,
    CheckCircle2,
    Clock,
    MessageCircle
} from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/confirm-dialog"

export default function AdminContactMessages() {
    const { lang } = useLanguage()
    const [messages, setMessages] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [activeMessage, setActiveMessage] = useState<any>(null)
    const [confirmAction, setConfirmAction] = useState<{
        isOpen: boolean
        id: string | null
        action: 'delete' | 'status' | null
        statusValue?: string
    }>({ isOpen: false, id: null, action: null })

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        try {
            const res = await fetch("/api/admin/contact-messages")
            const data = await res.json()
            setMessages(data)
        } catch (err) {
            toast.error(lang === 'ar' ? "فشل تحميل الرسائل" : "Failed to load messages")
        } finally {
            setIsLoading(false)
        }
    }

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch("/api/admin/contact-messages", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status })
            })
            if (res.ok) {
                toast.success(lang === 'ar' ? `تم تحديث حالة الرسالة` : `Message marked as ${status}`)
                fetchMessages()
                if (activeMessage?.id === id) {
                    setActiveMessage({ ...activeMessage, status })
                }
                setConfirmAction({ isOpen: false, id: null, action: null })
            }
        } catch (error) {
            toast.error(lang === 'ar' ? "فشل تحديث الحالة" : "Failed to update status")
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/contact-messages?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success(lang === 'ar' ? "تم الحذف" : "Deleted")
                fetchMessages()
                setConfirmAction({ isOpen: false, id: null, action: null })
                if (activeMessage?.id === id) {
                    setActiveMessage(null)
                }
            }
        } catch (error) {
            toast.error(lang === 'ar' ? "خطأ في الحذف" : "Error deleting")
        }
    }

    const filtered = messages.filter(m =>
        (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (m.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (m.subject || '').toLowerCase().includes(search.toLowerCase())
    )

    const statusColors: Record<string, string> = {
        UNREAD: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        READ: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        REPLIED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    }

    return (
        <div className="space-y-8 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{lang === 'ar' ? 'رسائل تواصل معنا' : 'Contact Messages'}</h1>
                    <p className="text-muted-foreground">{lang === 'ar' ? 'إدارة رسائل التواصل من الموقع الإلكتروني.' : 'Manage messages from the contact form.'}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-2xl">
                        <MessageCircle className="w-4 h-4 text-[#0066FF]" />
                        <span className="text-sm font-bold">{messages.length}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-widest">{lang === 'ar' ? 'رسالة' : 'messages'}</span>
                    </div>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute top-4 left-5 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={lang === 'ar' ? 'ابحث بالاسم، الإيميل أو الموضوع...' : 'Search by name, email or subject...'}
                    className={`w-full bg-card border border-border shadow-lg py-4 ${lang === 'ar' ? 'pr-14 pl-6' : 'pl-14 pr-6'} text-sm focus:border-[#0066FF] outline-none transition-all shadow-inner rounded-2xl`}
                />
            </div>

            {isLoading ? (
                <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-[#0066FF] mx-auto" /></div>
            ) : filtered.length === 0 ? (
                <div className="py-20 text-center bg-card rounded-4xl border border-border text-muted-foreground font-bold uppercase tracking-widest text-xs shadow-none">
                    {lang === 'ar' ? 'لا توجد رسائل' : 'Zero messages found'}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((msg, i) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-8 rounded-[2.5rem] bg-card border border-border hover:border-[#0066FF]/50 transition-all group overflow-hidden relative shadow-none"
                        >
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#0066FF]/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-[#0066FF]/20 transition-all" />
                            <div className="absolute inset-px border border-border rounded-[2.45rem] pointer-events-none z-20" />

                            <div className="relative z-30">
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`text-[10px] px-3 py-1 rounded-full font-black tracking-widest uppercase border ${statusColors[msg.status] || statusColors.UNREAD}`}>
                                        {msg.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 mb-4 relative z-10 transition-transform group-hover:translate-x-1">
                                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center font-black text-xl text-foreground border border-border shrink-0">
                                        {msg.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="font-bold text-lg text-foreground truncate w-full">{msg.name}</h3>
                                        <p className="text-xs text-muted-foreground truncate w-full">{msg.email}</p>
                                    </div>
                                </div>

                                <div className="mb-6 relative z-20">
                                    <p className="text-[10px] text-[#0066FF] font-black uppercase mb-1">{lang === 'ar' ? 'الموضوع' : 'Subject'}</p>
                                    <p className="text-sm font-bold text-foreground truncate">{msg.subject || (lang === 'ar' ? 'بدون موضوع' : 'No subject')}</p>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border relative z-20">
                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-bold tracking-tighter">
                                        <Clock className="w-3 h-3" />
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => {
                                                setActiveMessage(msg)
                                                if (msg.status === 'UNREAD') updateStatus(msg.id, 'READ')
                                            }}
                                            className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white border-none rounded-xl text-xs font-black h-10 w-10 p-0 shadow-lg shadow-[#0066FF]/20"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {activeMessage && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-black/80">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-2xl bg-card border border-border rounded-4xl shadow-none overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/50 shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#0066FF]/10 flex items-center justify-center border border-[#0066FF]/20">
                                        <MessageCircle className="w-6 h-6 text-[#0066FF]" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black">{lang === 'ar' ? 'تفاصيل الرسالة' : 'Message Details'}</h2>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Status: {activeMessage.status}</p>
                                    </div>
                                </div>
                                <button onClick={() => setActiveMessage(null)} className="p-3 hover:bg-muted rounded-2xl transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 p-8 overflow-y-auto min-h-0">
                                <div className="grid grid-cols-2 gap-4 border-b border-border pb-6">
                                    <div className="p-4 rounded-3xl bg-muted border border-border">
                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Name</label>
                                        <p className="text-base font-bold text-foreground">{activeMessage.name}</p>
                                    </div>
                                    <div className="p-4 rounded-3xl bg-muted border border-border">
                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Email</label>
                                        <p className="text-sm font-bold text-[#0066FF]">{activeMessage.email}</p>
                                    </div>
                                </div>

                                <div className="py-6 border-b border-border">
                                    <div className="p-4 rounded-3xl bg-muted border border-border flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-[#0066FF]" />
                                        <div>
                                            <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Phone Number</label>
                                            <p className="text-sm font-bold">{activeMessage.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">{lang === 'ar' ? 'الموضوع' : 'Subject'}</h4>
                                    <p className="text-lg font-bold text-foreground mb-6">{activeMessage.subject || 'No Subject'}</p>

                                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">{lang === 'ar' ? 'الرسالة' : 'Message Content'}</h4>
                                    <div className="p-6 rounded-3xl bg-muted/50 border border-border text-sm leading-relaxed text-foreground">
                                        {activeMessage.message}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-border bg-muted/50 flex gap-4 shrink-0">
                                <button
                                    onClick={() => setConfirmAction({ isOpen: true, id: activeMessage.id, action: 'status', statusValue: 'REPLIED' })}
                                    disabled={activeMessage.status === 'REPLIED'}
                                    className="flex-1 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-foreground font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    {lang === 'ar' ? 'تحديد كمقروء ومجاب عليه' : 'Mark as Replied'}
                                </button>
                                <button
                                    onClick={() => setConfirmAction({ isOpen: true, id: activeMessage.id, action: 'delete' })}
                                    className="px-6 h-12 rounded-2xl bg-muted border border-red-500/10 text-red-500 hover:bg-red-500/20 font-bold hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmDialog
                isOpen={confirmAction.isOpen}
                onConfirm={() => {
                    if (!confirmAction.id) return
                    if (confirmAction.action === 'delete') {
                        handleDelete(confirmAction.id)
                    } else if (confirmAction.action === 'status' && confirmAction.statusValue) {
                        updateStatus(confirmAction.id, confirmAction.statusValue)
                    }
                }}
                onCancel={() => setConfirmAction({ isOpen: false, id: null, action: null })}
                title={
                    confirmAction.action === 'delete'
                        ? (lang === 'ar' ? 'حذف الرسالة؟' : 'Delete Message?')
                        : (lang === 'ar' ? 'تأكيد الرد؟' : 'Confirm Reply?')
                }
                message={
                    confirmAction.action === 'delete'
                        ? (lang === 'ar' ? 'هل أنت متأكد من رغبتك في החذف نهائياً؟' : 'Are you sure you want to permanently delete this message?')
                        : (lang === 'ar' ? 'هل قمت بالفعل بالرد على رسالة هذا العميل؟' : 'Did you already reply to this message directly?')
                }
                confirmText={
                    confirmAction.action === 'delete'
                        ? (lang === 'ar' ? 'حذف' : 'Delete')
                        : (lang === 'ar' ? 'نعم، تم الرد' : 'Yes, Replied')
                }
                cancelText={lang === 'ar' ? 'إلغاء' : 'Cancel'}
                danger={confirmAction.action === 'delete'}
                icon={confirmAction.action === 'status' ? <CheckCircle2 className="w-7 h-7 text-[#0066FF]" /> : <Trash2 className="w-7 h-7 text-red-500" />}
            />
        </div>
    )
}
