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
    Settings,
    Clock,
    XCircle
} from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/confirm-dialog"

export default function AdminTechSupport() {
    const { lang } = useLanguage()
    const [requests, setRequests] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [activeRequest, setActiveRequest] = useState<any>(null)
    const [confirmAction, setConfirmAction] = useState<{
        isOpen: boolean
        id: string | null
        action: 'delete' | 'status' | null
        statusValue?: string
    }>({ isOpen: false, id: null, action: null })

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/admin/tech-support")
            const data = await res.json()
            setRequests(data)
        } catch (err) {
            toast.error(lang === 'ar' ? "فشل تحميل الطلبات" : "Failed to load requests")
        } finally {
            setIsLoading(false)
        }
    }

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch("/api/admin/tech-support", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status })
            })
            if (res.ok) {
                toast.success(lang === 'ar' ? `تم تحديث حالة الطلب` : `Status marked as ${status}`)
                fetchRequests()
                if (activeRequest?.id === id) {
                    setActiveRequest({ ...activeRequest, status })
                }
                setConfirmAction({ isOpen: false, id: null, action: null })
            }
        } catch (error) {
            toast.error(lang === 'ar' ? "فشل تحديث الحالة" : "Failed to update status")
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/tech-support?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success(lang === 'ar' ? "تم الحذف" : "Deleted")
                fetchRequests()
                setConfirmAction({ isOpen: false, id: null, action: null })
                if (activeRequest?.id === id) {
                    setActiveRequest(null)
                }
            }
        } catch (error) {
            toast.error(lang === 'ar' ? "خطأ في الحذف" : "Error deleting")
        }
    }

    const filtered = requests.filter(r =>
        (r.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.supportType || '').toLowerCase().includes(search.toLowerCase())
    )

    const statusColors: Record<string, string> = {
        PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        IN_PROGRESS: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        RESOLVED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        CLOSED: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
    }

    const supportTypeLabels: Record<string, string> = {
        software: lang === 'ar' ? 'دعم البرمجيات والأنظمة' : 'Software & Systems Support',
        infrastructure: lang === 'ar' ? 'البنية التحتية والشبكات' : 'Infrastructure & Networking Support',
        hosting: lang === 'ar' ? 'استضافة السيرفرات' : 'Hosting & Servers Support',
        security: lang === 'ar' ? 'الأمن السيبراني' : 'Cybersecurity Support',
        managed_it: lang === 'ar' ? 'خدمات إدارة تكنولوجيا المعلومات' : 'Managed IT Services',
        consulting: lang === 'ar' ? 'استشارات تكنولوجيا المعلومات الاستراتيجية' : 'Strategic IT Consulting',
    }

    return (
        <div className="space-y-8 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{lang === 'ar' ? 'طلبات الدعم الفني' : 'Tech Support Requests'}</h1>
                    <p className="text-zinc-500">{lang === 'ar' ? 'مراجعة وتحديث طلبات الدعم الفني الواردة.' : 'Review and update incoming technical support inquiries.'}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                        <Settings className="w-4 h-4 text-[#0066FF]" />
                        <span className="text-sm font-bold">{requests.length}</span>
                        <span className="text-xs text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'طلب' : 'requests'}</span>
                    </div>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute top-4 left-5 w-5 h-5 text-zinc-600" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={lang === 'ar' ? 'ابحث بالاسم، الإيميل أو نوع الدعم...' : 'Search by name, email or type...'}
                    className={`w-full bg-zinc-950 border border-white/5 rounded-2xl py-4 ${lang === 'ar' ? 'pr-14 pl-6' : 'pl-14 pr-6'} text-sm focus:border-[#0066FF] outline-none transition-all shadow-inner`}
                />
            </div>

            {isLoading ? (
                <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-[#0066FF] mx-auto" /></div>
            ) : filtered.length === 0 ? (
                <div className="py-20 text-center bg-zinc-950 rounded-4xl border border-white/5 text-zinc-600 font-bold uppercase tracking-widest text-xs">
                    {lang === 'ar' ? 'لا توجد طلبات' : 'Zero requests found'}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((req, i) => (
                        <motion.div
                            key={req.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-8 rounded-[2.5rem] bg-zinc-950 border border-white/10 hover:border-[#0066FF]/50 transition-all group overflow-hidden relative shadow-2xl shadow-black/80 flex flex-col"
                        >
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#0066FF]/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-[#0066FF]/40 transition-all" />
                            <div className="absolute inset-px border border-white/5 rounded-[2.45rem] pointer-events-none z-20" />

                            <div className="relative z-30 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`text-[10px] px-3 py-1 rounded-full font-black tracking-widest uppercase border ${statusColors[req.status] || statusColors.PENDING}`}>
                                        {req.status}
                                    </span>
                                    <div className="text-end">
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">{lang === 'ar' ? 'نوع الدعم' : 'Support Type'}</p>
                                        <p className="text-xs font-black text-[#0066FF] capitalize">{supportTypeLabels[req.supportType] || req.supportType}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mb-4 relative z-10 transition-transform group-hover:translate-x-1">
                                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#0066FF]/20 to-purple-600/20 flex items-center justify-center font-black text-xl text-white border border-white/5 shrink-0">
                                        {req.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="font-bold text-lg text-white truncate w-full">{req.name}</h3>
                                        <p className="text-xs text-zinc-500 truncate w-full">{req.email}</p>
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between relative z-20">
                                    <p className="text-[10px] text-zinc-500 flex items-center gap-1.5 font-bold tracking-tighter">
                                        <Clock className="w-3 h-3" />
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </p>
                                    <Button
                                        onClick={() => setActiveRequest(req)}
                                        className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white border-none rounded-xl text-xs font-black h-10 w-10 p-0 shadow-lg shadow-[#0066FF]/20"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {activeRequest && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-black/80">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/50 shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#0066FF]/10 flex items-center justify-center border border-[#0066FF]/20">
                                        <Settings className="w-6 h-6 text-[#0066FF]" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black">{lang === 'ar' ? 'تفاصيل الطلب' : 'Request Details'}</h2>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Status: {activeRequest.status}</p>
                                    </div>
                                </div>
                                <button onClick={() => setActiveRequest(null)} className="p-3 hover:bg-white/5 rounded-2xl transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 p-8 overflow-y-auto min-h-0">
                                <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-6">
                                    <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Name</label>
                                        <p className="text-base font-bold text-white">{activeRequest.name}</p>
                                    </div>
                                    <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Support Type</label>
                                        <p className="text-sm font-bold text-[#0066FF] capitalize">{supportTypeLabels[activeRequest.supportType] || activeRequest.supportType}</p>
                                    </div>
                                </div>

                                <div className="py-6 border-b border-white/5 grid md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-[#0066FF]" />
                                        <div className="overflow-hidden">
                                            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Email</label>
                                            <p className="text-sm font-bold truncate">{activeRequest.email}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-[#0066FF]" />
                                        <div>
                                            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Phone/WhatsApp</label>
                                            <p className="text-xs font-bold leading-relaxed">
                                                PN: {activeRequest.phone || 'N/A'}<br />
                                                WA: {activeRequest.whatsapp || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">{lang === 'ar' ? 'الرسالة' : 'Issue Description'}</h4>
                                    <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 text-sm leading-relaxed text-zinc-300">
                                        {activeRequest.message}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/5 bg-zinc-900/50 flex flex-wrap gap-4 shrink-0">
                                {activeRequest.status !== 'RESOLVED' && activeRequest.status !== 'CLOSED' && (
                                    <>
                                        <button
                                            onClick={() => setConfirmAction({ isOpen: true, id: activeRequest.id, action: 'status', statusValue: 'IN_PROGRESS' })}
                                            disabled={activeRequest.status === 'IN_PROGRESS'}
                                            className="flex-1 h-12 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <Settings className="w-4 h-4" />
                                            {lang === 'ar' ? 'قيد العمل' : 'In Progress'}
                                        </button>
                                        <button
                                            onClick={() => setConfirmAction({ isOpen: true, id: activeRequest.id, action: 'status', statusValue: 'RESOLVED' })}
                                            className="flex-1 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            {lang === 'ar' ? 'تم الحل' : 'Mark Resolved'}
                                        </button>
                                    </>
                                )}
                                {(activeRequest.status === 'RESOLVED' || activeRequest.status === 'IN_PROGRESS') && (
                                    <button
                                        onClick={() => setConfirmAction({ isOpen: true, id: activeRequest.id, action: 'status', statusValue: 'CLOSED' })}
                                        disabled={activeRequest.status === 'CLOSED'}
                                        className="h-12 px-6 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        {lang === 'ar' ? 'إغلاق' : 'Close'}
                                    </button>
                                )}
                                <button
                                    onClick={() => setConfirmAction({ isOpen: true, id: activeRequest.id, action: 'delete' })}
                                    className="px-6 h-12 rounded-2xl bg-zinc-900 border border-red-500/20 text-red-500 hover:bg-red-500/20 font-bold hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all"
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
                        ? (lang === 'ar' ? 'حذف الطلب؟' : 'Delete Request?')
                        : (lang === 'ar' ? 'تأكيد التحديث؟' : 'Confirm Update?')
                }
                message={
                    confirmAction.action === 'delete'
                        ? (lang === 'ar' ? 'هل أنت متأكد من رغبتك في الحذف نهائياً؟' : 'Are you sure you want to permanently delete this request?')
                        : (lang === 'ar' ? 'هل أنت متأكد من تغيير حالة الطلب الحالي؟' : 'Are you sure you want to change the status of this request?')
                }
                confirmText={
                    confirmAction.action === 'delete'
                        ? (lang === 'ar' ? 'حذف الذلك' : 'Delete')
                        : (lang === 'ar' ? 'نعم، قم بالتحديث' : 'Yes, Update')
                }
                cancelText={lang === 'ar' ? 'إلغاء' : 'Cancel'}
                danger={confirmAction.action === 'delete' || confirmAction.statusValue === 'CLOSED'}
                icon={confirmAction.action === 'status' ? <CheckCircle2 className="w-7 h-7 text-[#0066FF]" /> : <Trash2 className="w-7 h-7 text-red-500" />}
            />
        </div>
    )
}
