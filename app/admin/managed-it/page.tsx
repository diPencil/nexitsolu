"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ShieldCheck,
    Search,
    Trash2,
    Loader2,
    X,
    Building2,
    Calendar,
    ChevronDown,
    Mail,
    Phone,
    Eye,
    CheckCircle2,
    XCircle,
    Clock
} from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/confirm-dialog"

export default function AdminManagedIT() {
    const { lang } = useLanguage()
    const [requests, setRequests] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [activeRequest, setActiveRequest] = useState<any>(null)
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null })

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/admin/managed-it")
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
            const res = await fetch("/api/admin/managed-it", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status })
            })
            if (res.ok) {
                toast.success(lang === 'ar' ? `تم تحديث حالة الطلب إلى ${status}` : `Request marked as ${status}`)
                fetchRequests()
                if (activeRequest?.id === id) {
                    setActiveRequest(null)
                }
            }
        } catch (error) {
            toast.error(lang === 'ar' ? "فشل تحديث الحالة" : "Failed to update status")
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/managed-it?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success(lang === 'ar' ? "تم الحذف" : "Deleted")
                fetchRequests()
                setConfirmDelete({ isOpen: false, id: null })
            }
        } catch (error) {
            toast.error(lang === 'ar' ? "خطأ في الحذف" : "Error deleting")
        }
    }

    const filtered = requests.filter(r =>
        (r.companyName || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.user?.name || '').toLowerCase().includes(search.toLowerCase())
    )

    const statusColors: Record<string, string> = {
        PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        IN_REVIEW: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        ACCEPTED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20',
    }

    const serviceLabels: Record<string, any> = {
        infra: { ar: "إدارة البنية التحتية", en: "Infrastructure Management" },
        cyber: { ar: "الأمن السيبراني", en: "Cybersecurity Support" },
        helpdesk: { ar: "دعم المستخدمين (Helpdesk)", en: "Employee Helpdesk" },
        cloud: { ar: "إدارة السحابة", en: "Cloud Management" },
        network: { ar: "إدارة الشبكات", en: "Network Administration" },
        devops: { ar: "صيانة الأنظمة والبرمجيات", en: "Software Maintenance" },
    }

    return (
        <div className="space-y-8 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{lang === 'ar' ? 'عقود Managed IT' : 'Managed IT Contracts'}</h1>
                    <p className="text-zinc-500">{lang === 'ar' ? 'مراجعة ومعالجة طلبات الخدمة من بوابة الشركات.' : 'Review and process service requests from the Corporate Portal.'}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                        <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
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
                    placeholder={lang === 'ar' ? 'ابحث بالشركة أو المستخدم...' : 'Search by company or user...'}
                    className={`w-full bg-zinc-950 border border-white/5 rounded-2xl py-4 ${lang === 'ar' ? 'pr-14 pl-6' : 'pl-14 pr-6'} text-sm focus:border-[#0066FF] outline-none transition-all shadow-inner`}
                />
            </div>

            {isLoading ? (
                <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-[#0066FF] mx-auto" /></div>
            ) : filtered.length === 0 ? (
                <div className="py-20 text-center bg-zinc-950 rounded-4xl border border-white/5 text-zinc-600 font-bold uppercase tracking-widest text-xs">
                    {lang === 'ar' ? 'لا يوجد طلبات' : 'Zero requests found'}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((req, i) => (
                        <motion.div
                            key={req.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-8 rounded-[2.5rem] bg-zinc-950 border border-white/10 hover:border-[#0066FF]/50 transition-all group overflow-hidden relative shadow-2xl shadow-black/80"
                        >
                            {/* Blue Glow Influence - Intensified Dashboard Style */}
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#0066FF]/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-[#0066FF]/40 transition-all" />
                            <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-all" />
                            
                            {/* Double Border Effect */}
                            <div className="absolute inset-px border border-white/5 rounded-[2.45rem] pointer-events-none z-20" />

                            <div className="relative z-30">
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`text-[10px] px-3 py-1 rounded-full font-black tracking-widest uppercase border ${statusColors[req.status]}`}>
                                        {req.status}
                                    </span>
                                <div className="text-end">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">{lang === 'ar' ? 'الموديل' : 'Model'}</p>
                                    <p className="text-xs font-black text-white">{req.model}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-8 relative z-10 transition-transform group-hover:translate-x-1">
                                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#0066FF]/20 to-purple-600/20 flex items-center justify-center font-black text-xl text-white border border-white/5">
                                    {req.companyName?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">{req.companyName}</h3>
                                    <p className="text-xs text-zinc-500 flex items-center gap-1.5 uppercase font-bold tracking-tighter">
                                        <Clock className="w-3 h-3" />
                                        {lang === 'ar' ? 'بتاريخ' : 'On'} {new Date(req.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-8 relative z-20">
                                <div className="p-3 rounded-2xl bg-white/2 border border-white/5">
                                    <p className="text-[10px] text-zinc-500 font-black uppercase mb-1">{lang === 'ar' ? 'الأيام' : 'Days'}</p>
                                    <p className="text-xs font-bold text-white">{req.days}</p>
                                </div>
                                <div className="p-3 rounded-2xl bg-white/2 border border-white/5">
                                    <p className="text-[10px] text-zinc-500 font-black uppercase mb-1">{lang === 'ar' ? 'الساعات' : 'Hours'}</p>
                                    <p className="text-xs font-bold text-white">{req.hours}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 relative z-20">
                                <Button 
                                    onClick={() => setActiveRequest(req)} 
                                    className="flex-1 bg-[#0066FF] hover:bg-[#0066FF]/90 text-white border-none rounded-2xl text-xs font-black h-12 shadow-lg shadow-[#0066FF]/20 flex items-center justify-center gap-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    {lang === 'ar' ? 'عرض الاستمارة' : 'View Form'}
                                </Button>
                                <button
                                    onClick={() => setConfirmDelete({ isOpen: true, id: req.id })}
                                    className="p-3 bg-zinc-900 border border-white/5 rounded-2xl text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
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
                            className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-4xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">{lang === 'ar' ? 'تفاصيل الطلب' : 'Request Detail'}</h2>
                                    <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">{activeRequest.companyName}</p>
                                </div>
                                <button onClick={() => setActiveRequest(null)} className="p-3 hover:bg-white/5 rounded-2xl"><X className="w-7 h-7" /></button>
                            </div>

                            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-6">
                                    <div className="p-4 rounded-3xl bg-white/2 border border-white/5 text-center">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">{lang === 'ar' ? 'الموديل' : 'Model'}</label>
                                        <p className="text-lg font-black text-[#0066FF]">{activeRequest.model}</p>
                                    </div>
                                    <div className="p-4 rounded-3xl bg-white/2 border border-white/5 text-center">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">{lang === 'ar' ? 'الأيام' : 'Days'}</label>
                                        <p className="text-base font-bold text-white">{activeRequest.days}</p>
                                    </div>
                                    <div className="p-4 rounded-3xl bg-white/2 border border-white/5 text-center">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">{lang === 'ar' ? 'الساعات' : 'Hours'}</label>
                                        <p className="text-base font-bold text-white">{activeRequest.hours}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-3xl bg-white/2 border border-white/5">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">{lang === 'ar' ? 'مسؤول التواصل' : 'Contact Person'}</label>
                                        <p className="text-sm font-bold">{activeRequest.contactName}</p>
                                    </div>
                                    <div className="p-4 rounded-3xl bg-white/2 border border-white/5">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">{lang === 'ar' ? 'مجال العمل' : 'Industry'}</label>
                                        <p className="text-sm font-bold">{activeRequest.industry || (lang === 'ar' ? 'غير محدد' : 'N/A')}</p>
                                    </div>
                                    <div className="p-4 rounded-3xl bg-white/2 border border-white/5 flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-[#0066FF]" />
                                        <p className="text-sm font-bold">{activeRequest.email}</p>
                                    </div>
                                    <div className="p-4 rounded-3xl bg-white/2 border border-white/5 flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-[#0066FF]" />
                                        <p className="text-sm font-bold">{activeRequest.phone}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'الخدمات المختارة' : 'Selected Services'}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {JSON.parse(activeRequest.services).map((s: string, idx: number) => (
                                            <span key={idx} className="px-4 py-2 rounded-xl bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20 text-[10px] font-bold">
                                                {serviceLabels[s] ? (lang === 'ar' ? serviceLabels[s].ar : serviceLabels[s].en) : s}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6 border-t border-white/5">
                                    <button 
                                        onClick={() => updateStatus(activeRequest.id, 'ACCEPTED')}
                                        className="flex-1 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                        {lang === 'ar' ? 'قبول الطلب' : 'Accept Request'}
                                    </button>
                                    <button 
                                        onClick={() => updateStatus(activeRequest.id, 'REJECTED')}
                                        className="flex-1 h-14 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center gap-2"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        {lang === 'ar' ? 'رفض' : 'Reject'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmDialog 
                isOpen={confirmDelete.isOpen}
                onConfirm={() => confirmDelete.id && handleDelete(confirmDelete.id)}
                onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
                title={lang === 'ar' ? 'حذف الطلب؟' : 'Delete Request?'}
                message={lang === 'ar' ? 'هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً؟' : 'Are you sure you want to permanently delete this request?'}
                confirmText={lang === 'ar' ? 'حذف' : 'Delete'}
                cancelText={lang === 'ar' ? 'إلغاء' : 'Cancel'}
            />
        </div>
    )
}
