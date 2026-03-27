"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
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
    RotateCcw,
    Layers,
    ListOrdered,
} from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/confirm-dialog"
import {
    getSubscriptionServiceLabel,
    type SubscriptionServiceCatalogRow,
} from "@/lib/subscription-services"

type PlanCatalogRow = {
    id: string
    serviceKey: string | null
    nameEn: string
    nameAr: string
    suggestedAmount: number | null
    sortOrder: number
    active: boolean
}

export default function AdminSubscriptions() {
    const { lang } = useLanguage()
    const [subscriptions, setSubscriptions] = useState<any[]>([])
    const [companies, setCompanies] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [serviceCatalog, setServiceCatalog] = useState<
        (SubscriptionServiceCatalogRow & {
            id: string
            sortOrder: number
            active: boolean
        })[]
    >([])
    const [planCatalog, setPlanCatalog] = useState<PlanCatalogRow[]>([])
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null })
    const [formData, setFormData] = useState({
        id: "", // Added id for editing
        userId: "",
        serviceKey: "",
        planPickId: "" as "" | "__custom__" | string,
        planName: "",
        amount: "",
        type: "MONTHLY",
        durationMonths: "1"
    })

    const fetchServiceCatalog = async () => {
        try {
            const res = await fetch("/api/admin/subscription-services")
            if (res.ok) {
                const data = await res.json()
                setServiceCatalog(Array.isArray(data) ? data : [])
            }
        } catch {
            console.error("subscription services catalog")
        }
    }

    const fetchPlanCatalog = async () => {
        try {
            const res = await fetch("/api/admin/subscription-plans")
            if (res.ok) {
                const data = await res.json()
                setPlanCatalog(Array.isArray(data) ? data : [])
            }
        } catch {
            console.error("subscription plans catalog")
        }
    }

    useEffect(() => {
        fetchSubscriptions()
        fetchCompanies()
        fetchServiceCatalog()
        fetchPlanCatalog()
    }, [])

    useEffect(() => {
        if (isModalOpen) {
            fetchServiceCatalog()
            fetchPlanCatalog()
        }
    }, [isModalOpen])

    const formServiceOptions = useMemo(() => {
        const sorted = [...serviceCatalog].sort(
            (a, b) => a.sortOrder - b.sortOrder
        )
        return sorted.filter(
            (s) => s.active || s.key === formData.serviceKey
        )
    }, [serviceCatalog, formData.serviceKey])

    const formPlanOptions = useMemo(() => {
        const sk = formData.serviceKey
        const sorted = [...planCatalog].sort(
            (a, b) => a.sortOrder - b.sortOrder
        )
        return sorted.filter((p) => {
            const scopeOk =
                p.serviceKey == null || (sk !== "" && p.serviceKey === sk)
            const activeOk =
                p.active || p.id === formData.planPickId
            return scopeOk && activeOk
        })
    }, [planCatalog, formData.serviceKey, formData.planPickId])

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
        if (!formData.serviceKey) {
            toast.error(lang === 'ar' ? 'اختر الخدمة' : 'Please select a service')
            return
        }
        if (!formData.planPickId) {
            toast.error(
                lang === 'ar'
                    ? 'اختر الخطة من القائمة أو «اسم مخصص»'
                    : 'Pick a plan from the list or choose Custom name'
            )
            return
        }
        if (!String(formData.planName || '').trim()) {
            toast.error(
                lang === 'ar'
                    ? 'أدخل اسم الخطة أو اخترها من القائمة'
                    : 'Enter a plan name or select one from the list'
            )
            return
        }
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
                setFormData({ id: "", userId: "", serviceKey: "", planPickId: "", planName: "", amount: "", type: "MONTHLY", durationMonths: "1" })
                fetchSubscriptions()
            } else {
                toast.error(lang === 'ar' ? "فشل الحفظ" : "Failed to save")
            }
        } catch (error) {
            toast.error(lang === 'ar' ? "حدث خطأ" : "Error")
        }
    }

    const openEditModal = (sub: any) => {
        const sk = sub.serviceKey || ""
        const match = planCatalog.find(
            (p) =>
                (p.nameEn === sub.planName || p.nameAr === sub.planName) &&
                (p.serviceKey == null || p.serviceKey === sk)
        )
        setFormData({
            id: sub.id,
            userId: sub.userId,
            serviceKey: sk,
            planPickId: match ? match.id : "__custom__",
            planName: sub.planName,
            amount: sub.amount.toString(),
            type: sub.type,
            durationMonths: "0" // Usually duration isn't clear for active subs but we need it for API consistency if it recalulates, or handle in PATCH
        })
        setIsModalOpen(true)
    }

    const openAddModal = () => {
        setFormData({ id: "", userId: "", serviceKey: "", planPickId: "", planName: "", amount: "", type: "MONTHLY", durationMonths: "1" })
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
        const svc = (getSubscriptionServiceLabel(s.serviceKey, lang, serviceCatalog) || '').toLowerCase()
        const matchesSearch = (s.planName || '').toLowerCase().includes(search.toLowerCase()) ||
            (s.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
            svc.includes(search.toLowerCase());
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
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <Button onClick={openAddModal} className="bg-[#0066FF] hover:bg-blue-600 rounded-2xl h-12 px-5 sm:px-6 flex items-center gap-2 group shadow-lg text-white shadow-blue-500/20">
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        {lang === 'ar' ? 'اشتراك جديد' : 'New Subscription'}
                    </Button>
                    <Button
                        type="button"
                        asChild
                        variant="outline"
                        className="rounded-2xl h-12 px-4 sm:px-5 border-white/15 bg-zinc-900 text-white hover:bg-white/10 hover:text-white gap-2"
                    >
                        <Link
                            href="/admin/subscription-plans"
                            className="inline-flex items-center gap-2"
                        >
                            <ListOrdered className="w-4 h-4 text-[#0066FF] shrink-0" />
                            <span className="whitespace-nowrap">
                                {lang === "ar" ? "الخطط" : "Plans"}
                            </span>
                        </Link>
                    </Button>
                    <Button
                        type="button"
                        asChild
                        variant="outline"
                        className="rounded-2xl h-12 px-4 sm:px-5 border-white/15 bg-zinc-900 text-white hover:bg-white/10 hover:text-white gap-2"
                    >
                        <Link
                            href="/admin/subscription-services"
                            className="inline-flex items-center gap-2"
                        >
                            <Layers className="w-4 h-4 text-[#0066FF] shrink-0" />
                            <span className="whitespace-nowrap">
                                {lang === "ar" ? "الخدمات" : "Services"}
                            </span>
                        </Link>
                    </Button>
                    <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                        <Briefcase className="w-4 h-4 text-[#0066FF]" />
                        <span className="text-sm font-bold">{subscriptions.length}</span>
                        <span className="text-xs text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'اشتراك' : 'subscriptions'}</span>
                    </div>
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
                            {sub.serviceKey && (
                                <p className="text-xs font-bold text-[#0066FF]/90 mb-2 uppercase tracking-wide">
                                    {getSubscriptionServiceLabel(sub.serviceKey, lang, serviceCatalog)}
                                </p>
                            )}
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
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xl bg-black/80 overflow-y-auto">
                        <motion.div
                            initial={{ scale: 0.98, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.98, opacity: 0 }}
                            className="w-full max-w-[420px] max-h-[92vh] my-auto flex flex-col bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="px-4 py-3 border-b border-white/5 flex items-start justify-between gap-3 shrink-0">
                                <div className="min-w-0">
                                    <h2 className="text-lg font-bold leading-tight">{formData.id ? (lang === 'ar' ? 'تعديل اشتراك' : 'Edit Subscription') : (lang === 'ar' ? 'اشتراك جديد' : 'New Subscription')}</h2>
                                    <p className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-widest">{formData.id ? (lang === 'ar' ? 'تحديث بيانات الخطة' : 'Update plan') : (lang === 'ar' ? 'تعيين خطة لشركة' : 'Assign plan to a company')}</p>
                                </div>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-lg shrink-0"><X className="w-5 h-5" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
                            <div className="overflow-y-auto overscroll-contain px-4 py-3 space-y-3.5 max-h-[min(70vh,560px)]">
                                 <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'اختر الشركة' : 'Select Company'}</label>
                                    <select 
                                        required
                                        className={`w-full bg-zinc-900 border border-white/5 rounded-xl py-2.5 px-3 text-sm text-white outline-none focus:border-[#0066FF] ${lang === 'ar' ? 'text-right' : ''}`}
                                        value={formData.userId}
                                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                    >
                                        <option value="">{lang === 'ar' ? 'اختر شركة...' : 'Choose a company...'}</option>
                                        {companies.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'الخدمة' : 'Service'}</label>
                                    <select
                                        required
                                        className={`w-full bg-zinc-900 border border-white/5 rounded-xl py-2.5 px-3 text-sm text-white outline-none focus:border-[#0066FF] ${lang === 'ar' ? 'text-right' : ''}`}
                                        value={formData.serviceKey}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                serviceKey: e.target.value,
                                                planPickId: "",
                                                planName: "",
                                            })
                                        }
                                    >
                                        <option value="">
                                            {lang === 'ar' ? 'اختر الخدمة…' : 'Select a service…'}
                                        </option>
                                        {formData.serviceKey &&
                                            !formServiceOptions.some(
                                                (s) =>
                                                    s.key === formData.serviceKey
                                            ) && (
                                                <option
                                                    value={formData.serviceKey}
                                                >
                                                    {formData.serviceKey}
                                                    {lang === "ar"
                                                        ? " (غير مدرج)"
                                                        : " (not in list)"}
                                                </option>
                                            )}
                                        {formServiceOptions.map((opt) => (
                                            <option key={opt.key} value={opt.key}>
                                                {lang === 'ar' ? opt.nameAr : opt.nameEn}
                                                {!opt.active
                                                    ? lang === 'ar'
                                                        ? ' (موقوفة)'
                                                        : ' (inactive)'
                                                    : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-[9px] text-zinc-600 leading-snug">
                                        {lang === 'ar'
                                            ? 'أضف الخدمات من زر «الخدمات» بجانب اشتراك جديد.'
                                            : 'Add service types from the Services button next to New Subscription.'}
                                    </p>
                                </div>

                                 <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'الخطة' : 'Plan'}</label>
                                    <select
                                        disabled={!formData.serviceKey}
                                        className={`w-full bg-zinc-900 border border-white/5 rounded-xl py-2.5 px-3 text-sm text-white outline-none focus:border-[#0066FF] disabled:opacity-40 ${lang === 'ar' ? 'text-right' : ''}`}
                                        value={formData.planPickId}
                                        onChange={(e) => {
                                            const v = e.target.value
                                            if (v === "__custom__") {
                                                setFormData((fd) => ({
                                                    ...fd,
                                                    planPickId: "__custom__",
                                                    planName: "",
                                                }))
                                                return
                                            }
                                            if (!v) {
                                                setFormData((fd) => ({
                                                    ...fd,
                                                    planPickId: "",
                                                    planName: "",
                                                }))
                                                return
                                            }
                                            const row = planCatalog.find((p) => p.id === v)
                                            if (!row) return
                                            setFormData((fd) => ({
                                                ...fd,
                                                planPickId: v,
                                                planName:
                                                    lang === "ar"
                                                        ? row.nameAr
                                                        : row.nameEn,
                                                amount:
                                                    row.suggestedAmount != null
                                                        ? String(row.suggestedAmount)
                                                        : fd.amount,
                                            }))
                                        }}
                                    >
                                        <option value="">
                                            {lang === 'ar' ? 'اختر الخطة…' : 'Select a plan…'}
                                        </option>
                                        {formPlanOptions.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {lang === 'ar' ? p.nameAr : p.nameEn}
                                                {!p.active
                                                    ? lang === 'ar'
                                                        ? ' (موقوفة)'
                                                        : ' (inactive)'
                                                    : ''}
                                            </option>
                                        ))}
                                        <option value="__custom__">
                                            {lang === 'ar'
                                                ? '— اسم مخصص —'
                                                : '— Custom name —'}
                                        </option>
                                    </select>
                                    <input
                                        required
                                        readOnly={
                                            !!formData.planPickId &&
                                            formData.planPickId !== "__custom__"
                                        }
                                        className="w-full bg-zinc-900 border border-white/5 rounded-xl py-2.5 px-3 text-sm text-white outline-none focus:border-[#0066FF] read-only:opacity-80"
                                        placeholder={
                                            lang === 'ar'
                                                ? "يُملأ تلقائياً عند اختيار خطة، أو اكتب يدوياً مع «اسم مخصص»"
                                                : "Filled when you pick a plan, or type with “Custom name”"
                                        }
                                        value={formData.planName}
                                        onChange={(e) =>
                                            setFormData((fd) => ({
                                                ...fd,
                                                planName: e.target.value,
                                            }))
                                        }
                                    />
                                    <p className="text-[9px] text-zinc-600 leading-snug">
                                        {lang === 'ar'
                                            ? 'عرّف الخطط من زر «الخطط». الخطة المخصصة للخدمة تظهر بعد اختيار الخدمة؛ كل الخدمات = تظهر دائماً.'
                                            : 'Define plans under Plans. Service-specific tiers show after you pick a service; “all services” plans always appear.'}
                                    </p>
                                </div>
                               <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                         <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'المبلغ (ج.م)' : 'Amount (EGP)'}</label>
                                        <input 
                                            required
                                            type="number"
                                            className="w-full bg-zinc-900 border border-white/5 rounded-xl py-2.5 px-3 text-sm text-white outline-none focus:border-[#0066FF]"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'دورة الفوترة' : 'Billing'}</label>
                                        <select 
                                            className="w-full bg-zinc-900 border border-white/5 rounded-xl py-2.5 px-3 text-sm text-white outline-none focus:border-[#0066FF]"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="MONTHLY">{lang === 'ar' ? 'شهري' : 'Monthly'}</option>
                                            <option value="YEARLY">{lang === 'ar' ? 'سنوي' : 'Yearly'}</option>
                                        </select>
                                    </div>
                                </div>

                                 <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'المدة (شهور)' : 'Duration (mo.)'}</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-zinc-900 border border-white/5 rounded-xl py-2.5 px-3 text-sm text-white outline-none focus:border-[#0066FF]"
                                        value={formData.durationMonths}
                                        onChange={(e) => setFormData({ ...formData, durationMonths: e.target.value })}
                                    />
                                </div>
                            </div>

                                 <div className="flex gap-3 px-4 py-3 border-t border-white/5 shrink-0 bg-zinc-950/95">
                                    <Button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-10 text-sm rounded-xl bg-zinc-900 text-zinc-500 hover:text-white border border-white/5">
                                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                                    </Button>
                                    <Button type="submit" className="flex-1 h-10 text-sm rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold">
                                        {formData.id ? (lang === 'ar' ? 'تحديث' : 'Update') : (lang === 'ar' ? 'تفعيل' : 'Activate')}
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
