"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
    Users,
    Search,
    Mail,
    Shield,
    ShoppingCart,
    Loader2,
    Phone,
    MapPin,
    Calendar,
    Plus,
    X,
    MessageCircle,
    User as UserIcon,
    Trash2,
    Edit,
    Heart,
    Star,
    MoreVertical,
    Check,
    Ban,
    UserCheck,
    FileText, ShieldCheck, Briefcase
} from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/confirm-dialog"

export default function AdminCustomers() {
    const { lang, t } = useLanguage()
    const isAr = lang === "ar"
    const { data: session, update } = useSession()
    const [customers, setCustomers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        role: "CUSTOMER",
        phone: "",
        whatsapp: "",
        position: "",
        governorate: "",
        status: "ACTIVE"
    })

    const [confirmBlock, setConfirmBlock] = useState<{ isOpen: boolean, id: string | null, name: string | null, currentStatus: string | null }>({ isOpen: false, id: null, name: null, currentStatus: null })

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [selectedDetailUser, setSelectedDetailUser] = useState<any>(null)
    const [detailLoading, setDetailLoading] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: string | null, name: string | null }>({ isOpen: false, id: null, name: null })

    const fetchUserDetails = async (id: string) => {
        setDetailLoading(true)
        setIsDetailModalOpen(true)
        try {
            const res = await fetch(`/api/admin/customers/${id}`)
            if (res.ok) {
                const data = await res.json()
                setSelectedDetailUser(data)
            }
        } catch (error) {
            toast.error(lang === 'ar' ? "فشل تحميل تفاصيل العميل" : "Failed to load user details")
        } finally {
            setDetailLoading(false)
        }
    }

    const roles = ["CUSTOMER", "COMPANY", "ADMIN"]
    const governorates = [
        "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum", 
        "Gharbia", "Ismailia", "Monufia", "Minya", "Qalyubia", "New Valley", 
        "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", 
        "South Sinai", "Kafr El Sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag"
    ]

    useEffect(() => {
        fetchCustomers()
    }, [])

    useEffect(() => {
        if (editingUser) {
            setFormData({
                name: editingUser.name || "",
                email: editingUser.email || "",
                username: editingUser.username || "",
                password: "", // Don't show password
                role: editingUser.role || "CUSTOMER",
                phone: editingUser.phone || "",
                whatsapp: editingUser.whatsapp || "",
                position: editingUser.position || "",
                governorate: editingUser.governorate || "",
                status: editingUser.status || "ACTIVE"
            })
        } else {
            setFormData({
                name: "",
                email: "",
                username: "",
                password: "",
                role: "CUSTOMER",
                phone: "",
                whatsapp: "",
                position: "",
                governorate: "",
                status: "ACTIVE"
            })
        }
    }, [editingUser])

    const fetchCustomers = async () => {
        try {
            const res = await fetch("/api/admin/customers?role=CUSTOMER")
            const data = await res.json()
            setCustomers(Array.isArray(data) ? data : [])
        } catch (err) {
            toast.error(lang === 'ar' ? "فشل تحميل العملاء" : "Failed to load customers")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const method = editingUser ? "PUT" : "POST"
            const url = editingUser ? `/api/admin/customers/${editingUser.id}` : "/api/admin/customers"
            
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            
            if (res.ok) {
                toast.success(editingUser ? (lang === 'ar' ? "تم تحديث المستخدم!" : "User updated!") : (lang === 'ar' ? "تم إنشاء المستخدم!" : "User created!"))
                
                // If the admin is editing their own profile, update the session
                if (editingUser && editingUser.id === (session?.user as any)?.id) {
                    await update({
                        name: formData.name,
                        email: formData.email,
                        username: formData.username,
                        phone: formData.phone,
                        whatsapp: formData.whatsapp,
                        position: formData.position,
                        governorate: formData.governorate
                    })
                }

                setIsModalOpen(false)
                setEditingUser(null)
                fetchCustomers()
            } else {
                const err = await res.json()
                toast.error(err.error || (lang === 'ar' ? "حدث خطأ ما" : "Something went wrong"))
            }
        } catch (error) {
            toast.error(lang === 'ar' ? "خطأ في حفظ المستخدم" : "Error saving user")
        }
    }

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE"
        try {
            const res = await fetch(`/api/admin/customers/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            })
            if (res.ok) {
                toast.success(newStatus === 'BLOCKED' ? (lang === 'ar' ? "تم حظر المستخدم" : "User blocked") : (lang === 'ar' ? "تم إلغاء الحظر" : "User unblocked"))
                fetchCustomers()
                setConfirmBlock({ isOpen: false, id: null, name: null, currentStatus: null })
            } else {
                toast.error(lang === 'ar' ? "خطأ في تحديث الحالة" : "Error updating status")
            }
        } catch (error) {
            toast.error(lang === 'ar' ? "خطأ في الشبكة" : "Network error")
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/customers/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success(lang === 'ar' ? "تم حذف المستخدم بنجاح" : "User deleted successfully")
                fetchCustomers()
                setConfirmDelete({ isOpen: false, id: null, name: null })
            } else {
                const msg = await res.text()
                toast.error(msg)
            }
        } catch (error) {
            toast.error(lang === 'ar' ? "خطأ في حذف المستخدم" : "Error deleting user")
        }
    }

    const filteredCustomers = customers.filter(c =>
        (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (c.phone || '').includes(search)
    )

    const roleLabel = (role: string) => {
        if (role === "ADMIN") {
            return isAr ? "مدير" : "ADMIN"
        }

        if (role === "COMPANY") {
            return isAr ? "شركة" : "COMPANY"
        }

        return isAr ? "عميل" : "CUSTOMER"
    }

    return (
        <div className="space-y-8 pb-32" dir={isAr ? "rtl" : "ltr"}>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{t('admin.customers.title')}</h1>
                    <p className="text-muted-foreground">{t('admin.customers.subtitle')}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-border px-4 py-2 rounded-2xl">
                        <Users className="w-4 h-4 text-[#0066FF]" />
                        <span className="text-sm font-bold">{customers.length}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-widest">{t('admin.customers.users_count')}</span>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingUser(null)
                            setIsModalOpen(true)
                        }}
                        className="bg-[#0066FF] hover:bg-blue-600 rounded-2xl h-12 px-6 flex items-center gap-2 group text-primary-foreground"
                    >
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        {t('admin.customers.add_user')}
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className={`absolute top-4 ${lang === 'ar' ? 'right-5' : 'left-5'} w-5 h-5 text-muted-foreground/60`} />
                    <Search className={`absolute top-4 ${lang === 'ar' ? 'right-5' : 'left-5'} w-5 h-5 text-muted-foreground`} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('admin.customers.search_placeholder')}
                        className={`w-full bg-card border border-border py-4 ${isAr ? 'pr-14 pl-6' : 'pl-14 pr-6'} text-sm focus:border-[#0066FF] outline-none transition-all rounded-2xl`}
                    />
                </div>
            </div>

            {/* Customers Grid */}
            {isLoading ? (
                <div className="py-32 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-[#0066FF] mx-auto mb-4" />
                    <p className="text-muted-foreground animate-pulse">{t('admin.common.loading')}</p>
                </div>
            ) : filteredCustomers.length === 0 ? (
                <div className="py-32 text-center bg-card border border-border rounded-[2.5rem] shadow-none">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
                    <p className="text-xl font-bold text-muted-foreground">{isAr ? 'لا يوجد عملاء يطابقون بحثك' : 'No users found matching your search'}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCustomers.map((customer, i) => (
                        <motion.div
                            key={customer.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.02 }}
                            className={`p-6 rounded-[2.5rem] bg-card border transition-all group relative overflow-hidden shadow-none ${customer.status === 'BLOCKED' ? 'border-red-500/50 grayscale-[0.8]' : 'border-border hover:border-[#0066FF]/50'}`}
                        >
                            {/* Blue Glow Influence - Intensified Dashboard Style */}
                            <div className={`absolute -top-20 w-64 h-64 blur-[100px] rounded-full pointer-events-none transition-all ${isAr ? '-left-20' : '-right-20'} ${customer.status === 'BLOCKED' ? 'bg-red-500/20' : 'bg-[#0066FF]/20 group-hover:bg-[#0066FF]/40'}`} />
                            <div className={`absolute -bottom-20 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-all ${isAr ? '-right-20' : '-left-20'}`} />
                            
                            {/* Status Overlay for Blocked */}
                            {customer.status === 'BLOCKED' && (
                                <div className="absolute top-0 left-0 right-0 py-1 bg-red-500/10 border-b border-red-500/20 z-40 flex justify-center items-center gap-1.5 backdrop-blur-md">
                                    <Ban className="w-2.5 h-2.5 text-red-500" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-red-500">{t('admin.customers.account_blocked_label')}</span>
                                </div>
                            )}

                            {/* Double Border Effect */}
                            <div className="absolute inset-px border border-border rounded-[2.45rem] pointer-events-none z-20" />

                            {/* Role Badge */}
                            <div className={`absolute top-6 z-30 ${isAr ? 'left-6' : 'right-6'}`}>
                                <span className={`text-[9px] px-3 py-1 rounded-full font-black tracking-widest uppercase border ${customer.role === 'ADMIN'
                                        ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                        : customer.role === 'COMPANY'
                                            ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                                            : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                    }`}>
                                    {roleLabel(customer.role)}
                                </span>
                            </div>

                            <div className="relative z-30 flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center font-black text-xl text-foreground border border-border shrink-0 group-hover:scale-110 transition-transform">
                                    {customer.name?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg truncate group-hover:text-[#0066FF] transition-colors">{customer.name || 'Unnamed'}</h3>
                                    <p className="text-[10px] text-muted-foreground truncate mb-2 font-mono uppercase tracking-tighter">@{customer.username || 'ghost_user'}</p>
                                    
                                    <div className="space-y-1.5 pt-2">
                                        <p className="text-xs text-muted-foreground truncate flex items-center gap-2">
                                            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                            {customer.email}
                                        </p>
                                        {customer.phone && (
                                            <p className="text-xs text-muted-foreground truncate flex items-center gap-2">
                                                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                                {customer.phone}
                                            </p>
                                        )}
                                        {customer.governorate && (
                                            <p className="text-xs text-muted-foreground truncate flex items-center gap-2 capitalize">
                                                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                                {customer.governorate}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <button 
                                onClick={() => fetchUserDetails(customer.id)}
                                className="relative z-30 w-full grid grid-cols-3 gap-2 py-4 border-y border-border mb-6 bg-muted/50 rounded-2xl px-2 hover:bg-muted transition-colors"
                            >
                                <div className="text-center">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">{t('admin.customers.stats.orders')}</p>
                                    <p className="text-emerald-500 font-black">{customer._count?.orders || 0}</p>
                                </div>
                                <div className="text-center border-x border-border">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">{t('admin.customers.stats.favs')}</p>
                                    <p className="text-rose-500 font-black">{customer._count?.favorites || 0}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">{t('admin.customers.stats.wish')}</p>
                                    <p className="text-amber-500 font-black">{customer._count?.wishlist || 0}</p>
                                </div>
                            </button>

                            <div className="relative z-30 flex items-center justify-between">
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold">
                                    <Calendar className="w-3 h-3" />
                                    <span>{t('admin.customers.joined')} {new Date(customer.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => {
                                            if (customer.status === "ACTIVE") {
                                                setConfirmBlock({ isOpen: true, id: customer.id, name: customer.name, currentStatus: customer.status })
                                            } else {
                                                handleToggleStatus(customer.id, customer.status)
                                            }
                                        }}
                                        className={`p-2.5 rounded-xl bg-background border border-border transition-all ${customer.status === 'BLOCKED' ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'}`}
                                    >
                                        {customer.status === 'BLOCKED' ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setEditingUser(customer)
                                            setIsModalOpen(true)
                                        }}
                                        className="p-2.5 rounded-xl bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-[#0066FF] transition-all"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    {customer.role !== 'ADMIN' && (
                                        <button 
                                            onClick={() => setConfirmDelete({ isOpen: true, id: customer.id, name: customer.name })}
                                            className="p-2.5 rounded-xl bg-background border border-border text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Detail Modal (Wishlist/Favorites) */}
            <AnimatePresence>
                {isDetailModalOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-black/80">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-2xl bg-card border border-border rounded-4xl shadow-none overflow-hidden"
                        >
                            <div className="p-8 border-b border-border flex items-center justify-between bg-muted/50">
                                <div>
                                    <h2 className="text-2xl font-bold">{t('admin.customers.details_title')}</h2>
                                    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">{selectedDetailUser?.name || t('admin.common.loading')}</p>
                                </div>
                                <button onClick={() => setIsDetailModalOpen(false)} className="p-3 hover:bg-muted rounded-2xl transition-all">
                                    <X className="w-7 h-7" />
                                </button>
                            </div>

                            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
                                {detailLoading ? (
                                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                                        <Loader2 className="w-10 h-10 animate-spin text-[#0066FF]" />
                                        <p className="text-sm text-muted-foreground">{t('admin.common.loading')}</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Invoices */}
                                        <section>
                                             <h3 className="text-sm font-black uppercase text-emerald-500 tracking-widest mb-4 flex items-center gap-2">
                                                 <FileText className="w-4 h-4" />
                                                {t('admin.companies.stats.inv')} ({selectedDetailUser?.invoices?.length || 0})
                                             </h3>
                                             <div className="grid grid-cols-1 gap-3">
                                                 {selectedDetailUser?.invoices?.length === 0 ? (
                                                     <p className="text-xs text-muted-foreground italic">{t('admin.companies.no_invoices')}</p>
                                                 ) : selectedDetailUser?.invoices?.map((inv: any) => (
                                                     <div key={inv.id} className="p-4 rounded-2xl bg-muted border border-border flex justify-between items-center text-sm">
                                                         <div>
                                                             <p className="font-bold text-foreground">#{inv.invoiceNo}</p>
                                                             <p className="text-[10px] text-muted-foreground">{new Date(inv.createdAt).toLocaleDateString()}</p>
                                                         </div>
                                                         <div className="text-end">
                                                             <p className="font-black text-emerald-500">{inv.amount} EGP</p>
                                                             <span className="text-[8px] uppercase font-black px-2 py-0.5 rounded-full border border-border text-muted-foreground">{inv.status}</span>
                                                         </div>
                                                     </div>
                                                 ))}
                                             </div>
                                         </section>

                                         {/* Contracts / Managed IT */}
                                         <section>
                                             <h3 className="text-sm font-black uppercase text-amber-500 tracking-widest mb-4 flex items-center gap-2">
                                                 <ShieldCheck className="w-4 h-4" />
                                                 {t('admin.companies.stats.cont')} ({selectedDetailUser?.managedITRequests?.length || 0})
                                             </h3>
                                             <div className="grid grid-cols-1 gap-3">
                                                 {selectedDetailUser?.managedITRequests?.length === 0 ? (
                                                     <p className="text-xs text-muted-foreground italic">{t('admin.companies.no_contracts')}</p>
                                                 ) : selectedDetailUser?.managedITRequests?.map((req: any) => (
                                                     <div key={req.id} className="p-4 rounded-2xl bg-muted border border-border space-y-2">
                                                         <div className="flex justify-between items-start">
                                                             <p className="text-sm font-bold text-foreground">{req.services}</p>
                                                             <span className="text-[8px] px-2 py-0.5 rounded-full border border-amber-500/20 text-amber-500 font-black uppercase">{req.status}</span>
                                                         </div>
                                                         <p className="text-[10px] text-muted-foreground">{t('admin.companies.applied_on')} {new Date(req.createdAt).toLocaleDateString()}</p>
                                                     </div>
                                                 ))}
                                             </div>
                                         </section>

                                         {/* Subscriptions */}
                                         <section>
                                             <h3 className="text-sm font-black uppercase text-purple-500 tracking-widest mb-4 flex items-center gap-2">
                                                 <Briefcase className="w-4 h-4" />
                                                 {t('admin.companies.stats.subs')} ({selectedDetailUser?.subscriptions?.length || 0})
                                             </h3>
                                             <div className="grid grid-cols-1 gap-3">
                                                 {selectedDetailUser?.subscriptions?.length === 0 ? (
                                                     <p className="text-xs text-muted-foreground italic">{t('admin.companies.no_subscriptions')}</p>
                                                 ) : selectedDetailUser?.subscriptions?.map((sub: any) => (
                                                     <div key={sub.id} className="p-4 rounded-2xl bg-muted border border-border flex justify-between items-center text-sm font-bold">
                                                         <div>
                                                             <p className="text-foreground">{sub.planName}</p>
                                                             <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                                                                 {new Date(sub.startDate).toLocaleDateString()} - {new Date(sub.endDate).toLocaleDateString()}
                                                             </p>
                                                         </div>
                                                         <span className="text-purple-500 font-black">{sub.amount} EGP</span>
                                                     </div>
                                                 ))}
                                             </div>
                                         </section>

                                         {/* Orders */}
                                         <section>
                                             <h3 className="text-sm font-black uppercase text-[#0066FF] tracking-widest mb-4 flex items-center gap-2">
                                                 <ShoppingCart className="w-4 h-4" />
                                                 {t('admin.customers.past_orders')} ({selectedDetailUser?.orders?.length || 0})
                                             </h3>
                                             <div className="grid grid-cols-1 gap-3">
                                                 {selectedDetailUser?.orders?.length === 0 ? (
                                                     <p className="text-xs text-muted-foreground/40 italic">{t('admin.companies.no_orders')}</p>
                                                 ) : selectedDetailUser?.orders?.map((o: any) => (
                                                     <div key={o.id} className="p-4 rounded-2xl bg-white/2 border border-border space-y-3">
                                                         <div className="flex justify-between items-center">
                                                             <span className="text-xs font-bold font-mono text-foreground">#{o.orderNumber || o.id.slice(-6).toUpperCase()}</span>
                                                             <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${o.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : o.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>{o.status}</span>
                                                         </div>
                                                         <div className="space-y-1">
                                                             {o.items?.map((item: any, i: number) => (
                                                                 <p key={i} className="text-xs text-muted-foreground/70 truncate w-full">• {isAr ? item.product?.nameAr || item.product?.name : item.product?.name} (x{item.quantity})</p>
                                                             ))}
                                                         </div>
                                                         <div className="flex justify-between items-center pt-2 border-t border-border">
                                                             <span className="text-[10px] text-muted-foreground/60">{new Date(o.createdAt).toLocaleDateString()}</span>
                                                             <span className="text-sm font-bold text-[#0066FF]">{o.total} EGP</span>
                                                         </div>
                                                     </div>
                                                 ))}
                                             </div>
                                         </section>

                                        {/* Favorites */}
                                        <section>
                                            <h3 className="text-sm font-black uppercase text-rose-500 tracking-widest mb-4 flex items-center gap-2">
                                                <Heart className="w-4 h-4" />
                                                {t('admin.customers.favorites')} ({selectedDetailUser?.favorites?.length || 0})
                                            </h3>
                                            <div className="grid grid-cols-1 gap-3">
                                                {selectedDetailUser?.favorites?.length === 0 ? (
                                                    <p className="text-xs text-muted-foreground/40 italic">{t('admin.customers.no_favorites')}</p>
                                                ) : selectedDetailUser?.favorites?.map((p: any) => (
                                                    <div key={p.id} className="flex items-center gap-4 p-3 rounded-2xl bg-white/2 border border-border">
                                                        <img src={p.image} className="w-10 h-10 rounded-lg object-cover bg-secondary" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold truncate">{lang === 'ar' ? p.nameAr || p.name : p.name}</p>
                                                            <p className="text-[10px] text-emerald-500 font-bold">{p.price} EGP</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        {/* Wishlist */}
                                        <section>
                                            <h3 className="text-sm font-black uppercase text-amber-500 tracking-widest mb-4 flex items-center gap-2">
                                                <Star className="w-4 h-4" />
                                                {t('admin.customers.wishlist')} ({selectedDetailUser?.wishlist?.length || 0})
                                            </h3>
                                            <div className="grid grid-cols-1 gap-3">
                                                {selectedDetailUser?.wishlist?.length === 0 ? (
                                                    <p className="text-xs text-muted-foreground/40 italic">{t('admin.customers.no_wishlist')}</p>
                                                ) : selectedDetailUser?.wishlist?.map((p: any) => (
                                                    <div key={p.id} className="flex items-center gap-4 p-3 rounded-2xl bg-white/2 border border-border">
                                                        <img src={p.image} className="w-10 h-10 rounded-lg object-cover bg-secondary" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold truncate">{lang === 'ar' ? p.nameAr || p.name : p.name}</p>
                                                            <p className="text-[10px] text-emerald-500 font-bold">{p.price} EGP</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-black/80">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-4xl bg-popover border border-border rounded-4xl shadow-none overflow-hidden"
                        >
                            <div className="p-8 border-b border-border flex items-center justify-between bg-muted/30">
                                <div>
                                    <h2 className="text-2xl font-bold">{editingUser ? t('admin.customers.form.edit_title') : t('admin.customers.form.add_title')}</h2>
                                    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">{editingUser ? t('admin.customers.form.edit_subtitle') : t('admin.customers.form.add_subtitle')}</p>
                                </div>
                                <button onClick={() => {
                                    setIsModalOpen(false)
                                    setEditingUser(null)
                                }} className="p-3 hover:bg-accent/50 rounded-2xl transition-all">
                                    <X className="w-7 h-7" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10">
                                <div className="grid md:grid-cols-2 gap-8 mb-8">
                                    {/* General Info */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('admin.customers.form.full_name')}</label>
                                            <input required className="w-full bg-secondary border border-border rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-foreground transition-all shadow-inner" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('admin.customers.form.email')}</label>
                                            <input required type="email" className="w-full bg-secondary border border-border rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-foreground transition-all" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('admin.customers.form.username')}</label>
                                                <input required className="w-full bg-secondary border border-border rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-foreground transition-all" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="johndoe123" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('admin.customers.form.password')}</label>
                                                <input className="w-full bg-secondary border border-border rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-foreground transition-all" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder={editingUser ? (lang === 'ar' ? "اتركه فارغاً للإبقاء" : "Leave blank to keep") : (lang === 'ar' ? "8 رموز كحد أدنى" : "Min 8 chars")} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('admin.customers.form.role')}</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {roles.map(r => (
                                                    <button
                                                        key={r}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, role: r })}
                                                        className={`py-3 rounded-2xl text-[10px] font-black border transition-all ${formData.role === r 
                                                            ? 'bg-[#0066FF] border-[#0066FF] text-foreground' 
                                                            : 'bg-muted border-border/50 text-muted-foreground hover:border-border'}`}
                                                    >
                                                        {roleLabel(r)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Info */}
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('admin.customers.form.phone')}</label>
                                                <input className="w-full bg-secondary border border-border rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-foreground transition-all" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+20 1..." />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('admin.customers.form.whatsapp')}</label>
                                                <input className="w-full bg-secondary border border-border rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-foreground transition-all" value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} placeholder="+20 1..." />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('admin.customers.form.position')}</label>
                                            <input className="w-full bg-secondary border border-border rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-foreground transition-all" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} placeholder={lang === 'ar' ? "مهندس برمجيات / مدير شركة" : "Software Engineer / Company Manager"} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('admin.customers.form.governorate')}</label>
                                            <select 
                                                className="w-full bg-secondary border border-border rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-foreground transition-all appearance-none"
                                                value={formData.governorate}
                                                onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                                            >
                                                <option value="">{isAr ? 'اختر الموقع' : 'Select Location'}</option>
                                                {governorates.map(gov => (
                                                    <option key={gov} value={gov}>{gov}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="pt-4 p-6 bg-[#0066FF]/5 rounded-4xl border border-[#0066FF]/10 flex items-start gap-4">
                                            <Shield className="w-6 h-6 text-[#0066FF] shrink-0" />
                                            <p className="text-[10px] text-muted-foreground/70 font-medium leading-relaxed italic">
                                                {isAr 
                                                    ? 'من خلال إنشاء أو تحديث هذا الحساب، فإنك تؤكد أن بيانات المستخدم تتوافق مع سياسة الخصوصية ومعايير الأمان الخاصة بالموقع.' 
                                                    : "By creating or updating this account, you confirm that the user data complies with the site's privacy policy and security standards."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex gap-4 pt-8 border-t border-border">
                                    <Button type="button" onClick={() => {
                                        setIsModalOpen(false)
                                        setEditingUser(null)
                                    }} className="flex-1 h-16 rounded-3xl border border-zinc-900 text-muted-foreground hover:text-foreground transition-all bg-muted/30 font-bold uppercase tracking-widest text-xs">
                                        {isAr ? 'إلغاء' : 'Cancel'}
                                    </Button>
                                    <Button type="submit" className="flex-1 h-16 rounded-3xl bg-[#0066FF] hover:bg-blue-600 text-foreground font-black text-sm shadow-2xl shadow-blue-500/30 uppercase tracking-[0.2em]">
                                        {editingUser ? (isAr ? 'تحديث السجلات' : 'Update Records') : (isAr ? 'تفعيل الحساب' : 'Initialize Account')}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmDialog 
                isOpen={confirmDelete.isOpen}
                onConfirm={() => confirmDelete.id && handleDelete(confirmDelete.id)}
                onCancel={() => setConfirmDelete({ isOpen: false, id: null, name: null })}
                title={t('admin.common.delete') + '?'}
                message={t('admin.common.confirm_delete', { name: confirmDelete.name || t('admin.common.this_user') })}
                confirmText={t('admin.common.delete')}
                cancelText={t('admin.common.cancel')}
            />

            <ConfirmDialog 
                isOpen={confirmBlock.isOpen}
                onConfirm={() => confirmBlock.id && confirmBlock.currentStatus && handleToggleStatus(confirmBlock.id, confirmBlock.currentStatus)}
                onCancel={() => setConfirmBlock({ isOpen: false, id: null, name: null, currentStatus: null })}
                title={t('admin.common.block') + '?'}
                message={t('admin.common.confirm_block', { name: confirmBlock.name || t('admin.common.this_user') })}
                confirmText={t('admin.common.block')}
                cancelText={t('admin.common.cancel')}
                danger={true}
                icon={<Ban className="w-7 h-7 text-red-400" />}
            />
        </div>
    )
}
