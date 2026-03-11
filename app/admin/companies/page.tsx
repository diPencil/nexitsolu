"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
    Building2,
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
    Briefcase,
    FileText,
    ShieldCheck
} from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/confirm-dialog"

export default function AdminCompanies() {
    const { lang } = useLanguage()
    const { data: session, update } = useSession()
    const [companies, setCompanies] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        role: "COMPANY",
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
            toast.error(lang === 'ar' ? "فشل تحميل تفاصيل الشركة" : "Failed to load company details")
        } finally {
            setDetailLoading(false)
        }
    }

    const governorates = [
        "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum", 
        "Gharbia", "Ismailia", "Monufia", "Minya", "Qalyubia", "New Valley", 
        "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", 
        "South Sinai", "Kafr El Sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag"
    ]

    useEffect(() => {
        fetchCompanies()
    }, [])

    useEffect(() => {
        if (editingUser) {
            setFormData({
                name: editingUser.name || "",
                email: editingUser.email || "",
                username: editingUser.username || "",
                password: "", 
                role: editingUser.role || "COMPANY",
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
                role: "COMPANY",
                phone: "",
                whatsapp: "",
                position: "",
                governorate: "",
                status: "ACTIVE"
            })
        }
    }, [editingUser])

    const fetchCompanies = async () => {
        try {
            const res = await fetch("/api/admin/customers?role=COMPANY")
            const data = await res.json()
            setCompanies(Array.isArray(data) ? data : [])
        } catch (err) {
            toast.error(lang === 'ar' ? "فشل تحميل الشركات" : "Failed to load companies")
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
                toast.success(editingUser ? (lang === 'ar' ? "تم تحديث بيانات الشركة!" : "Company details updated!") : (lang === 'ar' ? "تم إنشاء حساب الشركة!" : "Company account created!"))
                
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
                fetchCompanies()
            } else {
                const err = await res.json()
                toast.error(err.error || (lang === 'ar' ? "حدث خطأ ما" : "Something went wrong"))
            }
        } catch (error) {
            toast.error(lang === 'ar' ? "خطأ في حفظ البيانات" : "Error saving data")
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
                toast.success(newStatus === 'BLOCKED' ? (lang === 'ar' ? "تم حظر الشركة" : "Company blocked") : (lang === 'ar' ? "تم إلغاء الحظر" : "Company unblocked"))
                fetchCompanies()
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
                toast.success(lang === 'ar' ? "تم حذف حساب الشركة بنجاح" : "Company account deleted successfully")
                fetchCompanies()
                setConfirmDelete({ isOpen: false, id: null, name: null })
            } else {
                const msg = await res.text()
                toast.error(msg)
            }
        } catch (error) {
            toast.error(lang === 'ar' ? "خطأ في حذف الشركة" : "Error deleting company")
        }
    }

    const filteredCompanies = companies.filter(c =>
        (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (c.phone || '').includes(search)
    )

    return (
        <div className="space-y-8 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{lang === 'ar' ? 'إدارة الشركات' : 'Companies Management'}</h1>
                    <p className="text-zinc-500">{lang === 'ar' ? 'تحكم في صلاحيات وبيانات حسابات الشركات.' : 'Manage permissions and data for company accounts.'}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                        <Briefcase className="w-4 h-4 text-[#0066FF]" />
                        <span className="text-sm font-bold">{companies.length}</span>
                        <span className="text-xs text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'شركة' : 'companies'}</span>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingUser(null)
                            setIsModalOpen(true)
                        }}
                        className="bg-[#0066FF] hover:bg-blue-600 rounded-2xl h-12 px-6 flex items-center gap-2 group shadow-lg text-white shadow-blue-500/20"
                    >
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        {lang === 'ar' ? 'إضافة شركة' : 'Add Company'}
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className={`absolute top-4 ${lang === 'ar' ? 'right-5' : 'left-5'} w-5 h-5 text-zinc-600`} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={lang === 'ar' ? 'ابحث بالاسم أو البريد أو الهاتف...' : 'Search by name, email or phone...'}
                        className={`w-full bg-zinc-950 border border-white/5 rounded-2xl py-4 ${lang === 'ar' ? 'pr-14 pl-6' : 'pl-14 pr-6'} text-sm focus:border-[#0066FF] outline-none transition-all shadow-inner`}
                    />
                </div>
            </div>

            {/* Companies Grid */}
            {isLoading ? (
                <div className="py-32 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-[#0066FF] mx-auto mb-4" />
                    <p className="text-zinc-500 animate-pulse">{lang === 'ar' ? 'جاري تحميل قائمة الشركات...' : 'Loading companies list...'}</p>
                </div>
            ) : filteredCompanies.length === 0 ? (
                <div className="py-32 text-center bg-zinc-950 border border-white/5 rounded-[2.5rem]">
                    <Building2 className="w-16 h-16 text-zinc-900 mx-auto mb-6 opacity-20" />
                    <p className="text-xl font-bold text-zinc-700">{lang === 'ar' ? 'لا توجد شركات تطابق بحثك' : 'No companies found matching your search'}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanies.map((company, i) => (
                        <motion.div
                            key={company.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.02 }}
                            className={`p-6 rounded-[2.5rem] bg-zinc-950 border transition-all group relative overflow-hidden shadow-2xl shadow-black/80 ${company.status === 'BLOCKED' ? 'border-red-500/50 grayscale-[0.8]' : 'border-white/10 hover:border-[#0066FF]/50'}`}
                        >
                            <div className={`absolute -right-20 -top-20 w-64 h-64 blur-[100px] rounded-full pointer-events-none transition-all ${company.status === 'BLOCKED' ? 'bg-red-500/20' : 'bg-[#0066FF]/20 group-hover:bg-[#0066FF]/40'}`} />
                            <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-all" />
                            
                            {company.status === 'BLOCKED' && (
                                <div className="absolute top-0 left-0 right-0 py-1 bg-red-500/10 border-b border-red-500/20 z-40 flex justify-center items-center gap-1.5 backdrop-blur-md">
                                    <Ban className="w-2.5 h-2.5 text-red-500" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-red-500">{lang === 'ar' ? 'محظور' : 'ACCOUNT BLOCKED'}</span>
                                </div>
                            )}

                            <div className="absolute inset-px border border-white/5 rounded-[2.45rem] pointer-events-none z-20" />

                            <div className="absolute top-6 right-6 z-30">
                                <span className="text-[9px] px-3 py-1 rounded-full font-black tracking-widest uppercase border bg-purple-500/10 text-purple-500 border-purple-500/20">
                                    {company.role}
                                </span>
                            </div>

                            <div className="relative z-30 flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#0066FF]/20 to-purple-600/20 flex items-center justify-center font-black text-xl text-white border border-white/5 shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                    {company.name?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div className="flex-1 min-w-0 pr-12">
                                    <h3 className="font-bold text-lg truncate group-hover:text-[#0066FF] transition-colors">{company.name || 'Unnamed'}</h3>
                                    <p className="text-[10px] text-zinc-500 truncate mb-2 font-mono uppercase tracking-tighter">@{company.username || 'company'}</p>
                                    
                                    <div className="space-y-1.5 pt-2">
                                        <p className="text-xs text-zinc-500 truncate flex items-center gap-2">
                                            <Mail className="w-3.5 h-3.5 text-zinc-700" />
                                            {company.email}
                                        </p>
                                        {company.phone && (
                                            <p className="text-xs text-zinc-500 truncate flex items-center gap-2">
                                                <Phone className="w-3.5 h-3.5 text-zinc-700" />
                                                {company.phone}
                                            </p>
                                        )}
                                        {company.governorate && (
                                            <p className="text-xs text-zinc-500 truncate flex items-center gap-2 capitalize">
                                                <MapPin className="w-3.5 h-3.5 text-zinc-700" />
                                                {company.governorate}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => fetchUserDetails(company.id)}
                                className="relative z-30 w-full grid grid-cols-4 gap-1 py-4 border-y border-white/5 mb-6 bg-white/2 rounded-2xl px-1 hover:bg-white/5 transition-colors text-start"
                            >
                                <div className="text-center">
                                    <p className="text-[8px] text-zinc-500 font-black uppercase mb-1">inv</p>
                                    <p className="text-emerald-500 font-black text-sm">{company._count?.invoices || 0}</p>
                                </div>
                                <div className="text-center border-s border-white/5">
                                    <p className="text-[8px] text-zinc-500 font-black uppercase mb-1">cont</p>
                                    <p className="text-amber-500 font-black text-sm">{company._count?.managedITRequests || 0}</p>
                                </div>
                                <div className="text-center border-s border-white/5">
                                    <p className="text-[8px] text-zinc-500 font-black uppercase mb-1">subs</p>
                                    <p className="text-purple-500 font-black text-sm">{company._count?.subscriptions || 0}</p>
                                </div>
                                <div className="text-center border-s border-white/5">
                                    <p className="text-[8px] text-zinc-500 font-black uppercase mb-1">ords</p>
                                    <p className="text-[#0066FF] font-black text-sm">{company._count?.orders || 0}</p>
                                </div>
                            </button>

                            <div className="relative z-30 flex items-center justify-between">
                                <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold">
                                    <Calendar className="w-3 h-3" />
                                    <span>{lang === 'ar' ? 'انضم في' : 'Joined'} {new Date(company.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => {
                                            if (company.status === "ACTIVE") {
                                                setConfirmBlock({ isOpen: true, id: company.id, name: company.name, currentStatus: company.status })
                                            } else {
                                                handleToggleStatus(company.id, company.status)
                                            }
                                        }}
                                        className={`p-2.5 rounded-xl bg-zinc-900 border border-white/5 transition-all ${company.status === 'BLOCKED' ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-zinc-500 hover:text-red-500 hover:bg-red-500/10'}`}
                                    >
                                        {company.status === 'BLOCKED' ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                    </button>
                                    <button 
                                        onClick={() => {
                                            window.location.href = `/admin/invoices?userId=${company.id}`
                                        }}
                                        className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 text-emerald-500 hover:bg-emerald-500/10 transition-all"
                                        title={lang === 'ar' ? 'إضافة فاتورة' : 'Add Invoice'}
                                    >
                                        <FileText className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setEditingUser(company)
                                            setIsModalOpen(true)
                                        }}
                                        className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-500 hover:text-white hover:bg-[#0066FF] transition-all"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => setConfirmDelete({ isOpen: true, id: company.id, name: company.name })}
                                        className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {isDetailModalOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-black/80">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-4xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
                                <div>
                                    <h2 className="text-2xl font-bold">{lang === 'ar' ? 'سجل الشركة' : 'Company Records'}</h2>
                                    <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">{selectedDetailUser?.name || 'Loading...'}</p>
                                </div>
                                <button onClick={() => setIsDetailModalOpen(false)} className="p-3 hover:bg-white/5 rounded-2xl transition-all">
                                    <X className="w-7 h-7" />
                                </button>
                            </div>

                            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
                                {detailLoading ? (
                                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                                        <Loader2 className="w-10 h-10 animate-spin text-[#0066FF]" />
                                        <p className="text-sm text-zinc-500">Accessing company records...</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Invoices */}
                                        <section>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-sm font-black uppercase text-emerald-500 tracking-widest flex items-center gap-2">
                                                    <FileText className="w-4 h-4" />
                                                    {lang === 'ar' ? 'الفواتير' : 'Invoices'} ({selectedDetailUser?.invoices?.length || 0})
                                                </h3>
                                                <Button 
                                                    size="sm" 
                                                    className="h-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[10px] font-black"
                                                    onClick={() => window.location.href = `/admin/invoices?userId=${selectedDetailUser.id}`}
                                                >
                                                    <Plus className="w-3 h-3 mr-1" />
                                                    {lang === 'ar' ? 'جديد' : 'NEW'}
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3">
                                                {selectedDetailUser?.invoices?.length === 0 ? (
                                                    <p className="text-xs text-zinc-700 italic">{lang === 'ar' ? 'لا توجد فواتير.' : 'No invoices yet.'}</p>
                                                ) : selectedDetailUser?.invoices?.map((inv: any) => (
                                                    <div key={inv.id} className="p-4 rounded-2xl bg-white/2 border border-white/5 flex justify-between items-center text-sm">
                                                        <div>
                                                            <p className="font-bold text-white">#{inv.invoiceNo}</p>
                                                            <p className="text-[10px] text-zinc-500">{new Date(inv.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="text-end">
                                                            <p className="font-black text-emerald-500">{inv.amount} EGP</p>
                                                            <span className="text-[8px] uppercase font-black px-2 py-0.5 rounded-full border border-zinc-800 text-zinc-500">{inv.status}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        {/* Contracts / Managed IT */}
                                        <section>
                                            <h3 className="text-sm font-black uppercase text-amber-500 tracking-widest mb-4 flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4" />
                                                {lang === 'ar' ? 'العقود / Managed IT' : 'Contracts / Managed IT'} ({selectedDetailUser?.managedITRequests?.length || 0})
                                            </h3>
                                            <div className="grid grid-cols-1 gap-3">
                                                {selectedDetailUser?.managedITRequests?.length === 0 ? (
                                                    <p className="text-xs text-zinc-700 italic">{lang === 'ar' ? 'لا توجد عقود.' : 'No contracts yet.'}</p>
                                                ) : selectedDetailUser?.managedITRequests?.map((req: any) => (
                                                    <div key={req.id} className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-2">
                                                        <div className="flex justify-between items-start">
                                                            <p className="text-sm font-bold text-white">{req.services}</p>
                                                            <span className="text-[8px] px-2 py-0.5 rounded-full border border-amber-500/20 text-amber-500 font-black uppercase">{req.status}</span>
                                                        </div>
                                                        <p className="text-[10px] text-zinc-500">{lang === 'ar' ? 'تاريخ التقديم:' : 'Applied on:'} {new Date(req.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        {/* Subscriptions */}
                                        <section>
                                            <h3 className="text-sm font-black uppercase text-purple-500 tracking-widest mb-4 flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" />
                                                {lang === 'ar' ? 'الاشتراكات' : 'Subscriptions'} ({selectedDetailUser?.subscriptions?.length || 0})
                                            </h3>
                                            <div className="grid grid-cols-1 gap-3">
                                                {selectedDetailUser?.subscriptions?.length === 0 ? (
                                                    <p className="text-xs text-zinc-700 italic">{lang === 'ar' ? 'لا توجد اشتراكات.' : 'No subscriptions yet.'}</p>
                                                ) : selectedDetailUser?.subscriptions?.map((sub: any) => (
                                                    <div key={sub.id} className="p-4 rounded-2xl bg-white/2 border border-white/5 flex justify-between items-center text-sm font-bold">
                                                        <div>
                                                            <p className="text-white">{sub.planName}</p>
                                                            <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">
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
                                                {lang === 'ar' ? 'الطلبات' : 'Orders'} ({selectedDetailUser?.orders?.length || 0})
                                            </h3>
                                            <div className="grid grid-cols-1 gap-3">
                                                {selectedDetailUser?.orders?.length === 0 ? (
                                                    <p className="text-xs text-zinc-700 italic">{lang === 'ar' ? 'لا توجد طلبات.' : 'No orders yet.'}</p>
                                                ) : selectedDetailUser?.orders?.map((o: any) => (
                                                    <div key={o.id} className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs font-bold font-mono text-white">#{o.orderNumber || o.id.slice(-6).toUpperCase()}</span>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${o.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : o.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>{o.status}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                                            <span className="text-[10px] text-zinc-600">{new Date(o.createdAt).toLocaleDateString()}</span>
                                                            <span className="text-sm font-bold text-[#0066FF]">{o.total} EGP</span>
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
                            className="w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-4xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
                                <div>
                                    <h2 className="text-2xl font-bold">{editingUser ? (lang === 'ar' ? 'تعديل بيانات الشركة' : 'Edit Company Profile') : (lang === 'ar' ? 'إضافة شركة جديدة' : 'Create New Company')}</h2>
                                    <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">{editingUser ? 'Updating corporate records' : 'Expanding Nexit partner network'}</p>
                                </div>
                                <button onClick={() => {
                                    setIsModalOpen(false)
                                    setEditingUser(null)
                                }} className="p-3 hover:bg-white/5 rounded-2xl transition-all">
                                    <X className="w-7 h-7" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10">
                                <div className="grid md:grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'اسم الشركة' : 'Company Name'}</label>
                                            <input required className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-white transition-all" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nexit Solutions" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                                            <input required type="email" className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-white transition-all" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="corp@nexit.com" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'اسم المستخدم' : 'Username'}</label>
                                                <input required className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-white transition-all" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="nexit_corp" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                                                <input className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-white transition-all" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder={editingUser ? "Leave blank" : "Min 8 chars"} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                                                <input className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-white transition-all" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+20 1..." />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</label>
                                                <input className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-white transition-all" value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} placeholder="+20 1..." />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'المجال / النشاط' : 'Position / Activity'}</label>
                                            <input className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-white transition-all" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} placeholder="Software House / Retail" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'المحافظة' : 'Governorate'}</label>
                                            <select 
                                                className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-white transition-all appearance-none"
                                                value={formData.governorate}
                                                onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                                            >
                                                <option value="">Select Location</option>
                                                {governorates.map(gov => (
                                                    <option key={gov} value={gov}>{gov}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex gap-4 pt-8 border-t border-white/5">
                                    <Button type="button" onClick={() => {
                                        setIsModalOpen(false)
                                        setEditingUser(null)
                                    }} className="flex-1 h-16 rounded-3xl border border-zinc-900 text-zinc-500 hover:text-white bg-zinc-900/50 font-bold text-xs">
                                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                                    </Button>
                                    <Button type="submit" className="flex-1 h-16 rounded-3xl bg-[#0066FF] hover:bg-blue-600 text-white font-black text-sm uppercase tracking-[0.2em]">
                                        {editingUser ? (lang === 'ar' ? 'تحديث السجل' : 'Update Records') : (lang === 'ar' ? 'إنشاء الحساب' : 'Create Account')}
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
                title={lang === 'ar' ? 'حذف الشركة؟' : 'Delete Company?'}
                message={lang === 'ar' 
                    ? `هل أنت متأكد من رغبتك في حذف ${confirmDelete.name || 'هذه الشركة'}؟` 
                    : `Are you sure you want to delete ${confirmDelete.name || 'this company'}?`
                }
                confirmText={lang === 'ar' ? 'حذف' : 'Delete'}
                cancelText={lang === 'ar' ? 'إلغاء' : 'Cancel'}
            />

            <ConfirmDialog 
                isOpen={confirmBlock.isOpen}
                onConfirm={() => confirmBlock.id && confirmBlock.currentStatus && handleToggleStatus(confirmBlock.id, confirmBlock.currentStatus)}
                onCancel={() => setConfirmBlock({ isOpen: false, id: null, name: null, currentStatus: null })}
                title={lang === 'ar' ? 'حظر الشركة؟' : 'Block Company?'}
                message={lang === 'ar' 
                    ? `هل أنت متأكد من رغبتك في حظر ${confirmBlock.name || 'هذه الشركة'}؟` 
                    : `Are you sure you want to block ${confirmBlock.name || 'this company'}?`
                }
                confirmText={lang === 'ar' ? 'حظر' : 'Block'}
                cancelText={lang === 'ar' ? 'إلغاء' : 'Cancel'}
                danger={true}
                icon={<Ban className="w-7 h-7 text-red-400" />}
            />
        </div>
    )
}
