"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Briefcase,
    Search,
    Plus,
    Trash2,
    Loader2,
    X,
    Building2,
    Calendar,
    ChevronDown,
    DollarSign,
    Users,
    Pencil,
    History,
    CheckCircle2,
    AlertCircle,
    RotateCcw
} from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/confirm-dialog"

export default function AdminSubscriptions() {
    const { lang } = useLanguage()
    const [subscriptions, setSubscriptions] = useState<any[]>([])
    const [companies, setCompanies] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null })
    const [formData, setFormData] = useState({
        id: "", // Added id for editing
        userId: "",
        planName: "",
        amount: "",
        type: "MONTHLY",
        durationMonths: "1"
    })

    useEffect(() => {
        fetchSubscriptions()
        fetchCompanies()
    }, [])

    const fetchSubscriptions = async () => {
        try {
            const res = await fetch("/api/admin/subscriptions")
            const data = await res.json()
            setSubscriptions(data)
        } catch (err) {
            toast.error(lang === 'ar' ? "فشل تحميل الاشتراكات" : "Failed to load subscriptions")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchCompanies = async () => {
        try {
            const res = await fetch("/api/admin/customers")
            const data = await res.json()
            const onlyCompanies = Array.isArray(data) ? data.filter((c: any) => c.role === "COMPANY") : []
            setCompanies(onlyCompanies)
        } catch (err) {
            console.error(err)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const isEditing = !!formData.id
            const res = await fetch("/api/admin/subscriptions", {
                method: isEditing ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                toast.success(lang === 'ar' ? (isEditing ? "تم التعديل!" : "تم الإضافة!") : (isEditing ? "Updated!" : "Added!"))
                setIsModalOpen(false)
                setFormData({ id: "", userId: "", planName: "", amount: "", type: "MONTHLY", durationMonths: "1" })
                fetchSubscriptions()
            } else {
                toast.error(lang === 'ar' ? "فشل الحفظ" : "Failed to save")
            }
        } catch (error) {
            toast.error(lang === 'ar' ? "حدث خطأ" : "Error")
        }
    }

    const openEditModal = (sub: any) => {
        setFormData({
            id: sub.id,
            userId: sub.userId,
            planName: sub.planName,
            amount: sub.amount.toString(),
            type: sub.type,
            durationMonths: "0" // Usually duration isn't clear for active subs but we need it for API consistency if it recalulates, or handle in PATCH
        })
        setIsModalOpen(true)
    }

    const openAddModal = () => {
        setFormData({ id: "", userId: "", planName: "", amount: "", type: "MONTHLY", durationMonths: "1" })
        setIsModalOpen(true)
    }

    const handleTerminate = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/subscriptions?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success(lang === 'ar' ? "تم إيقاف الخطة" : "Plan Terminated")
                fetchSubscriptions()
                setConfirmDelete({ isOpen: false, id: null })
            }
        } catch (error) {
            toast.error(lang === 'ar' ? "خطأ في الإيقاف" : "Error terminating")
        }
    }

    const handleReactivate = async (id: string) => {
        try {
            const res = await fetch("/api/admin/subscriptions", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: "ACTIVE" })
            })
            if (res.ok) {
                toast.success(lang === 'ar' ? "تمت إعادة التفعيل" : "Reactivated")
                fetchSubscriptions()
            }
        } catch (error) {
            toast.error(lang === 'ar' ? "خطأ" : "Error")
        }
    }

    const filtered = subscriptions.filter(s => {
        const matchesSearch = (s.planName || '').toLowerCase().includes(search.toLowerCase()) ||
            (s.user?.name || '').toLowerCase().includes(search.toLowerCase());
        const matchesTab = activeTab === 'ACTIVE' ? s.status === 'ACTIVE' : s.status === 'ENDED';
        return matchesSearch && matchesTab;
    })

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{lang === 'ar' ? 'اشتراكات الشركات' : 'Corporate Subscriptions'}</h1>
                    <p className="text-zinc-500">{lang === 'ar' ? 'إدارة عقود الخدمة والخطط النشطة للشركات.' : 'Manage active service contracts and plans for companies.'}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                        <Briefcase className="w-4 h-4 text-[#0066FF]" />
                        <span className="text-sm font-bold">{subscriptions.length}</span>
                        <span className="text-xs text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'اشتراك' : 'subscriptions'}</span>
                    </div>
                    <Button onClick={openAddModal} className="bg-[#0066FF] hover:bg-blue-600 rounded-2xl h-12 px-6 flex items-center gap-2 group shadow-lg text-white shadow-blue-500/20">
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        {lang === 'ar' ? 'اشتراك جديد' : 'New Subscription'}
                    </Button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute top-4 left-5 w-5 h-5 text-zinc-600" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={lang === 'ar' ? 'ابحث بالخطة أو الشركة...' : 'Search by plan or company...'}
                    className={`w-full bg-zinc-950 border border-white/5 rounded-2xl py-4 ${lang === 'ar' ? 'pr-14 pl-6' : 'pl-14 pr-6'} text-sm focus:border-[#0066FF] outline-none transition-all shadow-inner`}
                />
            </div>

            <div className="flex bg-zinc-950 p-1.5 rounded-2xl border border-white/5 w-fit">
                <button
                    onClick={() => setActiveTab('ACTIVE')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'ACTIVE' ? 'bg-[#0066FF] text-white shadow-lg shadow-blue-500/20' : 'text-zinc-500 hover:text-white'}`}
                >
                    <CheckCircle2 className="w-4 h-4" />
                    {lang === 'ar' ? 'الاشتراكات النشطة' : 'Active Plans'}
                </button>
                <button
                    onClick={() => setActiveTab('HISTORY')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'HISTORY' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-zinc-500 hover:text-white'}`}
                >
                    <History className="w-4 h-4" />
                    {lang === 'ar' ? 'سجل الاشتراكات' : 'History'}
                </button>
            </div>

            {isLoading ? (
                <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-[#0066FF] mx-auto" /></div>
            ) : filtered.length === 0 ? (
                <div className="py-20 text-center bg-zinc-950 rounded-4xl border border-white/5 text-zinc-600">
                    {lang === 'ar' ? (activeTab === 'ACTIVE' ? 'لا توجد اشتراكات نشطة' : 'السجل فارغ') : (activeTab === 'ACTIVE' ? 'No active plans found' : 'History is empty')}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((sub, i) => (
                        <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-6 rounded-4xl bg-zinc-950 border border-white/10 hover:border-[#0066FF]/50 transition-all relative group overflow-hidden shadow-2xl shadow-black/80"
                        >
                            {/* Blue Glow Influence - Intensified Dashboard Style */}
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#0066FF]/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-[#0066FF]/40 transition-all" />
                            <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-all" />
                            
                            {/* Double Border Effect */}
                            <div className="absolute inset-px border border-white/5 rounded-[2.2rem] pointer-events-none z-20" />

                            <div className="relative z-30">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 rounded-2xl bg-[#0066FF]/10 text-[#0066FF]">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <div className="text-end">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${sub.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {sub.status === 'ACTIVE' ? (lang === 'ar' ? 'نشط' : 'ACTIVE') : (lang === 'ar' ? 'منتهي' : 'ENDED')}
                                    </span>
                                    <p className="text-xl font-black mt-2">{sub.amount} {lang === 'ar' ? 'ج.م' : 'EGP'}</p>
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-bold mb-1">{sub.planName}</h3>
                            <div className="flex items-center gap-2 text-zinc-500 mb-6">
                                <Building2 className="w-4 h-4" />
                                <span className="text-sm font-medium">{sub.user?.name}</span>
                            </div>

                            <div className="space-y-3 py-4 border-y border-white/5 mb-6">
                                <div className="flex justify-between text-xs">
                                    <span className="text-zinc-500">{lang === 'ar' ? 'البداية' : 'Start'}</span>
                                    <span className="text-zinc-300">{new Date(sub.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-zinc-500">{lang === 'ar' ? 'الانتهاء' : 'Expiry'}</span>
                                    <span className={`font-bold ${sub.status === 'ACTIVE' ? 'text-[#0066FF]' : 'text-red-500'}`}>{new Date(sub.endDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                              <div className="flex gap-2">
                                {sub.status === 'ACTIVE' ? (
                                    <>
                                        <button
                                            onClick={() => openEditModal(sub)}
                                            className="p-3 bg-zinc-900 border border-white/5 rounded-2xl text-zinc-500 hover:text-[#0066FF] hover:bg-blue-500/10 transition-all"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setConfirmDelete({ isOpen: true, id: sub.id })}
                                            className="flex-1 py-3 rounded-2xl bg-zinc-900 border border-white/5 text-[10px] text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 font-black uppercase tracking-widest"
                                        >
                                            <AlertCircle className="w-4 h-4" />
                                            {lang === 'ar' ? 'إيقاف الخطة' : 'Stop Plan'}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleReactivate(sub.id)}
                                        className="w-full py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2 font-black uppercase tracking-widest"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        {lang === 'ar' ? 'إعادة تفعيل' : 'Reactivate Plan'}
                                    </button>
                                )}
                              </div>
                             </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-black/80">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-4xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">{formData.id ? (lang === 'ar' ? 'تعديل اشتراك' : 'Edit Subscription') : (lang === 'ar' ? 'اشتراك جديد' : 'New Subscription')}</h2>
                                    <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">{formData.id ? (lang === 'ar' ? 'تحديث بيانات الخطة' : 'Assign plan to a company') : (lang === 'ar' ? 'تعيين خطة لشركة' : 'Assign plan to a company')}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/5 rounded-2xl"><X className="w-7 h-7" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'اختر الشركة' : 'Select Company'}</label>
                                    <select 
                                        required
                                        className={`w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#0066FF] ${lang === 'ar' ? 'text-right' : ''}`}
                                        value={formData.userId}
                                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                    >
                                        <option value="">{lang === 'ar' ? 'اختر شركة...' : 'Choose a company...'}</option>
                                        {companies.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                                        ))}
                                    </select>
                                </div>

                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'اسم الخطة' : 'Plan Name'}</label>
                                    <input 
                                        required
                                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#0066FF]"
                                        placeholder={lang === 'ar' ? 'بريميوم - فضي' : 'Managed IT - Silver'}
                                        value={formData.planName}
                                        onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                                    />
                                </div>
                               <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                         <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'المبلغ (ج.م)' : 'Amount (EGP)'}</label>
                                        <input 
                                            required
                                            type="number"
                                            className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#0066FF]"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'دورة الفوترة' : 'Billing Period'}</label>
                                        <select 
                                            className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#0066FF]"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="MONTHLY">{lang === 'ar' ? 'شهري' : 'Monthly'}</option>
                                            <option value="YEARLY">{lang === 'ar' ? 'سنوي' : 'Yearly'}</option>
                                        </select>
                                    </div>
                                </div>

                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'المدة (بالشهور)' : 'Duration (Months)'}</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#0066FF]"
                                        value={formData.durationMonths}
                                        onChange={(e) => setFormData({ ...formData, durationMonths: e.target.value })}
                                    />
                                </div>

                                 <div className="flex gap-4 pt-4">
                                    <Button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-14 rounded-2xl bg-zinc-900 text-zinc-500 hover:text-white border-white/5">
                                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                                    </Button>
                                    <Button type="submit" className="flex-1 h-14 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold">
                                        {formData.id ? (lang === 'ar' ? 'تحديث' : 'Update') : (lang === 'ar' ? 'تفعيل الخطة' : 'Activate Plan')}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmDialog 
                isOpen={confirmDelete.isOpen}
                onConfirm={() => confirmDelete.id && handleTerminate(confirmDelete.id)}
                onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
                title={lang === 'ar' ? 'إيقاف الاشتراك؟' : 'Stop Subscription?'}
                message={lang === 'ar' ? 'هل أنت متأكد من رغبتك في إيقاف هذا الاشتراك مؤقتاً؟ لن يتم حذفه من السجلات.' : 'Are you sure you want to stop this plan? It will be moved to history but not deleted.'}
                confirmText={lang === 'ar' ? 'تأكيد الإيقاف' : 'Stop Plan'}
                cancelText={lang === 'ar' ? 'إلغاء' : 'Cancel'}
            />
        </div>
    )
}
