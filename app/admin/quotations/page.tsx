"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import {
    FileText,
    Plus,
    Loader2,
    Eye,
    Trash2,
    X,
    Mail,
    Package,
    FileDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n-context"
import { toast } from "sonner"
import Image from "next/image"
import { ConfirmDialog } from "@/components/confirm-dialog"

type QuotationLine = {
    description: string
    price: number
    quantity: number
    productId?: string
    maxStock?: number
}

function AdminQuotationsContent() {
    const { lang } = useLanguage()
    const searchParams = useSearchParams()
    const urlUserId = searchParams.get("userId")
    const [quotations, setQuotations] = useState<any[]>([])
    const [companies, setCompanies] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [viewQuotation, setViewQuotation] = useState<any>(null)
    const [isSendingMail, setIsSendingMail] = useState<string | null>(null)
    
    // Form state
    const [formData, setFormData] = useState({
        quotationNo: `QTN-${Date.now().toString().slice(-6)}`,
        userId: "",
        notes: "",
        validUntil: "",
        status: "PENDING",
        tax: 0,
        discount: 0
    })

    const [storeProducts, setStoreProducts] = useState<any[]>([])
    const [quotationItems, setQuotationItems] = useState<QuotationLine[]>([
        { description: "", price: 0, quantity: 1 },
    ])

    const [confirmAction, setConfirmAction] = useState<{ isOpen: boolean, id: string | null, action: 'delete' | 'status' | null, statusValue?: string }>({ isOpen: false, id: null, action: null })

    useEffect(() => {
        fetchQuotations()
        fetchCompanies()
    }, [])

    useEffect(() => {
        if (urlUserId && companies.length > 0) {
            setFormData(prev => ({ ...prev, userId: urlUserId }))
            setIsModalOpen(true)
        }
    }, [urlUserId, companies])

    useEffect(() => {
        if (!isModalOpen) return
        fetch("/api/products")
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) setStoreProducts(data)
            })
            .catch(() => {})
    }, [isModalOpen])

    const eligibleStoreProducts = storeProducts.filter(
        (p) => p.active && Number(p.stock) > 0
    )

    const fetchQuotations = async () => {
        try {
            const res = await fetch("/api/admin/quotations")
            const data = await res.json()
            setQuotations(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error("Failed to fetch quotations")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchCompanies = async () => {
        try {
            const res = await fetch("/api/admin/customers")
            const data = await res.json()
            if (Array.isArray(data)) {
                setCompanies(data.filter(u => u.role === "COMPANY" || u.role === "CUSTOMER"))
            }
        } catch (err) {
            console.error("Failed to fetch companies")
        }
    }

    const addItem = () => {
        setQuotationItems([
            ...quotationItems,
            { description: "", price: 0, quantity: 1 },
        ])
    }

    const applyProductToRow = (index: number, productId: string) => {
        const next = [...quotationItems]
        if (!productId) {
            next[index] = {
                ...next[index],
                productId: undefined,
                maxStock: undefined,
            }
            setQuotationItems(next)
            return
        }
        const p = storeProducts.find((x) => x.id === productId)
        if (!p || Number(p.stock) < 1) {
            toast.error(
                lang === "ar"
                    ? "المنتج غير متاح"
                    : "Product unavailable or out of stock"
            )
            return
        }
        const unit = p.discountPrice || p.price
        const desc = lang === "ar" ? p.nameAr || p.name : p.name
        const q = Math.min(
            Math.max(1, Number(next[index].quantity) || 1),
            Number(p.stock)
        )
        next[index] = {
            ...next[index],
            description: desc,
            price: unit,
            quantity: q,
            productId: p.id,
            maxStock: Number(p.stock),
        }
        setQuotationItems(next)
    }

    const removeItem = (index: number) => {
        setQuotationItems(quotationItems.filter((_, i) => i !== index))
    }

    const updateItem = (index: number, field: string, value: string | number) => {
        const newItems = [...quotationItems]
        const cur = { ...newItems[index] }
        if (field === "quantity") {
            let q = parseInt(String(value), 10)
            if (!Number.isFinite(q) || q < 1) q = 1
            if (cur.productId != null && cur.maxStock != null) {
                q = Math.min(q, cur.maxStock)
            }
            cur.quantity = q
        } else if (field === "price") {
            cur.price = Number(value)
        } else if (field === "description") {
            cur.description = String(value)
        }
        newItems[index] = cur
        setQuotationItems(newItems)
    }

    const calculateTotals = () => {
        const subtotal = quotationItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0)
        const taxAmount = (subtotal * Number(formData.tax)) / 100
        const total = subtotal + taxAmount - Number(formData.discount)
        return { subtotal, taxAmount, total: total > 0 ? total : 0 }
    }

    const { subtotal, taxAmount, total } = calculateTotals()

    const handleCreateQuotation = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.userId) {
            toast.error(lang === 'ar' ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields")
            return
        }

        if (
            quotationItems.some(
                (i) =>
                    !String(i.description).trim() ||
                    Number(i.price) < 0 ||
                    Number(i.quantity) < 1
            )
        ) {
            toast.error(lang === 'ar' ? "يرجى مراجعة تفاصيل العناصر" : "Please check item details")
            return
        }

        try {
            const payload = {
                ...formData,
                amount: total,
                subtotal,
                tax: formData.tax,
                discount: formData.discount,
                items: quotationItems.map(({ description, price, quantity, productId }) => ({
                    description,
                    price,
                    quantity,
                    ...(productId ? { productId } : {}),
                })),
            }

            const res = await fetch("/api/admin/quotations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                toast.success(lang === 'ar' ? "تم إنشاء عرض السعر بنجاح" : "Quotation created successfully")
                setIsModalOpen(false)
                setFormData({
                    quotationNo: `QTN-${Date.now().toString().slice(-6)}`,
                    userId: "",
                    notes: "",
                    validUntil: "",
                    status: "PENDING",
                    tax: 0,
                    discount: 0
                })
                setQuotationItems([{ description: "", price: 0, quantity: 1 }])
                fetchQuotations()
            } else {
                const error = await res.json()
                toast.error(error.message || "Failed to create quotation")
            }
        } catch (err) {
            toast.error("Something went wrong")
        }
    }

    const handleDeleteQuotation = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/quotations?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success(lang === 'ar' ? "تم الحذف بنجاح" : "Quotation deleted successfully")
                fetchQuotations()
                setConfirmAction({ isOpen: false, id: null, action: null })
            }
        } catch (err) {
            toast.error(lang === 'ar' ? "فشل الحذف" : "Failed to delete")
        }
    }

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const res = await fetch("/api/admin/quotations", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus })
            })

            if (res.ok) {
                toast.success(lang === 'ar' ? "تم تحديث الحالة بنجاح" : "Status updated successfully")
                fetchQuotations()
                setConfirmAction({ isOpen: false, id: null, action: null })
                if (viewQuotation && viewQuotation.id === id) {
                    setViewQuotation({...viewQuotation, status: newStatus})
                }
            }
        } catch (err) {
            toast.error("Failed to update status")
        }
    }

    const sendEmail = async (id: string) => {
        setIsSendingMail(id)
        try {
            const res = await fetch("/api/admin/quotations/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })
            const data = await res.json()
            if (res.ok) {
                toast.success(lang === 'ar' ? "تم إرسال الإيميل بنجاح" : "Email sent successfully")
                fetchQuotations()
                if (viewQuotation && viewQuotation.id === id) {
                    setViewQuotation({...viewQuotation, status: 'SENT'})
                }
            } else {
                toast.error(data.error || "Failed to send email")
            }
        } catch (err) {
            toast.error("Error sending email")
        } finally {
            setIsSendingMail(null)
        }
    }

    const downloadQuotationPdf = async (id: string, quotationNo: string) => {
        try {
            const res = await fetch(
                `/api/admin/quotations/pdf?id=${encodeURIComponent(id)}`
            )
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                toast.error(
                    err.error ||
                        (lang === "ar"
                            ? "تعذر تنزيل الملف"
                            : "PDF download failed")
                )
                return
            }
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `Quotation-${quotationNo}.pdf`
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(url)
            toast.success(lang === "ar" ? "تم تنزيل PDF" : "PDF downloaded")
        } catch {
            toast.error(lang === "ar" ? "حدث خطأ" : "Download error")
        }
    }

    const statusColors: Record<string, string> = {
        PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        SENT: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        APPROVED: 'bg-green-500/10 text-green-500 border-green-500/20',
        REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20',
        EXPIRED: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{lang === 'ar' ? 'إدارة عروض السعر' : 'Quotation Management'}</h1>
                    <p className="text-zinc-500">{lang === 'ar' ? 'قم بإنشاء وإدارة عروض السعر للشركات.' : 'Create and manage quotations for companies.'}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                        <FileText className="w-4 h-4 text-[#0066FF]" />
                        <span className="text-sm font-bold">{quotations.length}</span>
                        <span className="text-xs text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'عرض سعر' : 'quotations'}</span>
                    </div>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#0066FF] hover:bg-blue-600 rounded-2xl h-12 px-6 flex items-center gap-2 group shadow-lg text-white shadow-blue-500/20"
                    >
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        {lang === 'ar' ? 'عرض سعر جديد' : 'New Quotation'}
                    </Button>
                </div>
            </div>

            {/* Quotations List */}
            <div className="bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden">
                {isLoading ? (
                    <div className="py-20 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-[#0066FF] mx-auto" />
                    </div>
                ) : quotations.length === 0 ? (
                    <div className="py-20 text-center">
                        <FileText className="w-10 h-10 text-zinc-800 mx-auto mb-3" />
                        <p className="text-sm text-zinc-600">{lang === 'ar' ? 'لا توجد عروض سعر' : 'No quotations found'}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5 bg-zinc-900/30">
                                    <th className="px-6 py-4 text-zinc-600 text-[10px] font-bold uppercase tracking-wider text-start">{lang === 'ar' ? 'رقم العرض' : 'Quotation No'}</th>
                                    <th className="px-6 py-4 text-zinc-600 text-[10px] font-bold uppercase tracking-wider text-start">{lang === 'ar' ? 'العميل' : 'Client'}</th>
                                    <th className="px-6 py-4 text-zinc-600 text-[10px] font-bold uppercase tracking-wider text-start">{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                                    <th className="px-6 py-4 text-zinc-600 text-[10px] font-bold uppercase tracking-wider text-start">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                                    <th className="px-6 py-4 text-zinc-600 text-[10px] font-bold uppercase tracking-wider text-start">{lang === 'ar' ? 'تاريخ الانتهاء' : 'Valid Until'}</th>
                                    <th className="px-6 py-4 text-zinc-600 text-[10px] font-bold uppercase tracking-wider text-end">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {quotations.map((q, i) => (
                                    <motion.tr
                                        key={q.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="hover:bg-white/2 transition-all cursor-pointer"
                                        onClick={() => setViewQuotation(q)}
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-mono font-bold text-[#0066FF]">{q.quotationNo}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium">{q.user?.name || 'N/A'}</p>
                                                <p className="text-[10px] text-zinc-600">{q.user?.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold">{q.amount} EGP</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={q.status}
                                                onClick={e => e.stopPropagation()}
                                                onChange={(e) => {
                                                    setConfirmAction({
                                                        isOpen: true,
                                                        id: q.id,
                                                        action: 'status',
                                                        statusValue: e.target.value
                                                    })
                                                }}
                                                className={`text-[10px] px-2.5 py-1 rounded-md border font-bold outline-none cursor-pointer ${statusColors[q.status] || statusColors.PENDING}`}
                                            >
                                                <option className="bg-zinc-900" value="PENDING">PENDING</option>
                                                <option className="bg-zinc-900" value="SENT">SENT</option>
                                                <option className="bg-zinc-900" value="APPROVED">APPROVED</option>
                                                <option className="bg-zinc-900" value="REJECTED">REJECTED</option>
                                                <option className="bg-zinc-900" value="EXPIRED">EXPIRED</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-zinc-500">{q.validUntil ? new Date(q.validUntil).toLocaleDateString() : 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-end">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); sendEmail(q.id); }}
                                                    disabled={isSendingMail === q.id}
                                                    title={lang === 'ar' ? 'إرسال إيميل' : 'Send Email'}
                                                    className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500/20 transition-all disabled:opacity-50"
                                                >
                                                    {isSendingMail === q.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); downloadQuotationPdf(q.id, q.quotationNo); }}
                                                    title={lang === 'ar' ? 'تنزيل PDF' : 'Download PDF'}
                                                    className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                                                >
                                                    <FileDown className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setViewQuotation(q); }}
                                                    className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-500 hover:text-white transition-all"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setConfirmAction({ isOpen: true, id: q.id, action: 'delete' }); }}
                                                    className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-500 hover:text-red-500 transition-all font-medium"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Quotation Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/80">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl"
                        >
                            <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md p-6 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Image src="/nexit-logo.png" alt="NexIT" width={100} height={32} className="object-contain" />
                                    <div className="h-6 w-px bg-white/10" />
                                    <h3 className="font-bold">{lang === 'ar' ? 'إنشاء عرض سعر جديد' : 'Create New Quotation'}</h3>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-lg transition-all"><X className="w-4 h-4" /></button>
                            </div>
                            <form onSubmit={handleCreateQuotation} className="p-6 space-y-6">
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-zinc-500 font-bold uppercase">{lang === 'ar' ? 'رقم العرض' : 'Quotation Number'}</label>
                                        <input
                                            type="text"
                                            value={formData.quotationNo}
                                            onChange={e => setFormData({ ...formData, quotationNo: e.target.value })}
                                            className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#0066FF] outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-zinc-500 font-bold uppercase">{lang === 'ar' ? 'تاريخ الصلاحية' : 'Valid Until'}</label>
                                        <input
                                            type="date"
                                            value={formData.validUntil}
                                            onChange={e => setFormData({ ...formData, validUntil: e.target.value })}
                                            className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#0066FF] outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-zinc-500 font-bold uppercase">{lang === 'ar' ? 'الشركة / العميل' : 'Company / Client'}</label>
                                        <select
                                            value={formData.userId}
                                            onChange={e => setFormData({ ...formData, userId: e.target.value })}
                                            className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#0066FF] outline-none transition-all"
                                            required
                                        >
                                            <option value="">{lang === 'ar' ? 'اختر عميلاً...' : 'Select a client...'}</option>
                                            {companies.map(c => (
                                                <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-zinc-500 font-bold uppercase">{lang === 'ar' ? 'الحالة' : 'Status'}</label>
                                        <select
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                            className={`w-full bg-zinc-900 border rounded-xl px-4 py-3 text-sm focus:border-[#0066FF] outline-none transition-all ${statusColors[formData.status]}`}
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="SENT">SENT</option>
                                            <option value="APPROVED">APPROVED</option>
                                            <option value="REJECTED">REJECTED</option>
                                            <option value="EXPIRED">EXPIRED</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Items Section */}
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-[#0066FF]">{lang === 'ar' ? 'عناصر العرض' : 'Quotation Items'}</h4>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <button type="button" onClick={addItem} className="text-xs flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors border border-white/5 font-medium">
                                                <Plus className="w-3 h-3" /> {lang === 'ar' ? 'سطر يدوي' : 'Add line'}
                                            </button>
                                            <span className="text-[10px] text-zinc-600 uppercase hidden sm:inline">{lang === 'ar' ? 'أو' : 'or'}</span>
                                            <div className="flex items-center gap-1.5 text-xs bg-zinc-900 border border-white/10 rounded-lg px-2 py-1">
                                                <Package className="w-3.5 h-3.5 text-[#0066FF]" />
                                                <select
                                                    defaultValue=""
                                                    onChange={(e) => {
                                                        const pid = e.target.value
                                                        if (!pid) return
                                                        setQuotationItems((prev) => {
                                                            const p = storeProducts.find((x) => x.id === pid)
                                                            if (!p || !p.active || Number(p.stock) < 1) return prev
                                                            const unit = p.discountPrice || p.price
                                                            const desc = lang === "ar" ? p.nameAr || p.name : p.name
                                                            return [
                                                                ...prev,
                                                                {
                                                                    description: desc,
                                                                    price: unit,
                                                                    quantity: 1,
                                                                    productId: p.id,
                                                                    maxStock: Number(p.stock),
                                                                },
                                                            ]
                                                        })
                                                        e.target.value = ""
                                                    }}
                                                    className="bg-transparent text-zinc-200 text-xs py-1.5 ps-1 pe-6 outline-none cursor-pointer max-w-[200px] sm:max-w-[260px]"
                                                >
                                                    <option value="">{lang === 'ar' ? 'إضافة من منتجات المتجر…' : 'Add from store catalog…'}</option>
                                                    {eligibleStoreProducts.map((p) => (
                                                        <option key={p.id} value={p.id}>
                                                            {lang === "ar" ? p.nameAr || p.name : p.name} ({p.stock} {lang === "ar" ? "متوفر" : "avail"})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-zinc-500">
                                        {lang === 'ar'
                                            ? 'المنتجات الظاهرة هنا فقط النشطة وبها مخزون. يمكنك دمج أسطر يدوية وأسطر من المتجر.'
                                            : 'Only active in-stock products are listed. Mix manual lines and store products.'}
                                    </p>
                                    <div className="space-y-3">
                                        {quotationItems.map((item, index) => (
                                            <div key={index} className="flex flex-col gap-2 sm:flex-row sm:gap-3 sm:items-start bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                                                <div className="flex-1 space-y-2 min-w-0">
                                                    <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1">
                                                        <Package className="w-3 h-3 text-zinc-500" />
                                                        {lang === 'ar' ? 'ربط بمنتج (اختياري)' : 'Link store product (optional)'}
                                                    </label>
                                                    <select
                                                        value={item.productId || ""}
                                                        onChange={(e) => applyProductToRow(index, e.target.value)}
                                                        className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs focus:border-[#0066FF] outline-none transition-all"
                                                    >
                                                        <option value="">{lang === 'ar' ? '— سطر مخصص / خدمة —' : '— Custom line / service —'}</option>
                                                        {eligibleStoreProducts.map((p) => (
                                                            <option key={p.id} value={p.id}>
                                                                {lang === "ar" ? p.nameAr || p.name : p.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <input type="text" placeholder={lang === 'ar' ? 'وصف المنتج / الخدمة' : 'Service / Product Description'} value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs focus:border-[#0066FF] outline-none transition-all" required />
                                                    {item.productId != null && item.maxStock != null && (
                                                        <p className="text-[10px] text-zinc-500">
                                                            {lang === 'ar' ? `الحد الأقصى للكمية: ${item.maxStock}` : `Max quantity: ${item.maxStock}`}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex gap-3 sm:contents">
                                                    <div className="w-24 space-y-2">
                                                        <label className="text-[9px] font-bold text-zinc-600 uppercase block sm:hidden">{lang === 'ar' ? 'السعر' : 'Price'}</label>
                                                        <input type="number" placeholder={lang === 'ar' ? 'السعر' : 'Price'} value={item.price} onChange={(e) => updateItem(index, 'price', e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs focus:border-[#0066FF] outline-none transition-all text-center" min={0} required />
                                                    </div>
                                                    <div className="w-20 space-y-2">
                                                        <label className="text-[9px] font-bold text-zinc-600 uppercase block sm:hidden">{lang === 'ar' ? 'كمية' : 'Qty'}</label>
                                                        <input type="number" placeholder={lang === 'ar' ? 'الكمية' : 'Qty'} value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs focus:border-[#0066FF] outline-none transition-all text-center" min={1} required />
                                                    </div>
                                                    <button type="button" onClick={() => removeItem(index)} disabled={quotationItems.length === 1} className={`p-2 rounded-lg self-end sm:self-start sm:mt-7 border border-transparent transition-colors ${quotationItems.length === 1 ? 'opacity-30 cursor-not-allowed text-zinc-600' : 'text-zinc-500 hover:bg-red-500/10 hover:text-red-500 border-white/5'}`}><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Totals */}
                                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs text-zinc-500 font-bold uppercase">Discount (EGP)</label>
                                                <input type="number" value={formData.discount} onChange={e => setFormData({ ...formData, discount: Number(e.target.value) })} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#0066FF] outline-none transition-all" min={0} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-zinc-500 font-bold uppercase">Tax (%)</label>
                                                <input type="number" value={formData.tax} onChange={e => setFormData({ ...formData, tax: Number(e.target.value) })} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#0066FF] outline-none transition-all" min={0} max={100} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-zinc-500 font-bold uppercase">Notes</label>
                                            <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#0066FF] outline-none transition-all min-h-[80px]" />
                                        </div>
                                    </div>
                                    <div className="bg-zinc-900/40 rounded-2xl p-6 border border-white/5 flex flex-col justify-center space-y-4">
                                        <div className="flex justify-between items-center text-sm"><span className="text-zinc-400">Subtotal</span><span className="font-bold">{subtotal.toFixed(2)} EGP</span></div>
                                        {Number(formData.discount) > 0 && <div className="flex justify-between items-center text-sm text-emerald-400"><span>Discount</span><span className="font-bold">- {Number(formData.discount).toFixed(2)} EGP</span></div>}
                                        {Number(formData.tax) > 0 && <div className="flex justify-between items-center text-sm text-yellow-500"><span>Tax ({formData.tax}%)</span><span className="font-bold">+ {taxAmount.toFixed(2)} EGP</span></div>}
                                        <div className="pt-4 border-t border-white/10 flex justify-between items-center"><span className="text-sm font-bold uppercase tracking-widest text-[#0066FF]">Total</span><span className="text-2xl font-black text-[#0066FF]">{total.toFixed(2)} EGP</span></div>
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-[#0066FF] text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 sticky bottom-0">
                                    {lang === 'ar' ? 'حفظ عرض السعر' : 'Save Quotation'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* View Quotation Modal */}
            <AnimatePresence>
                {viewQuotation && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/80" onClick={() => setViewQuotation(null)}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                        >
                            <div className="p-8 space-y-8 bg-[#0a0a0a] overflow-y-auto flex-1 invoice-print-area">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="mb-8">
                                            <Image src="/nexit-logo.png" alt="NexIT" width={160} height={48} className="object-contain" priority />
                                        </div>
                                        <h2 className="text-4xl font-black mb-1 tracking-tighter">{lang === 'ar' ? 'عرض سعر' : 'QUOTATION'}</h2>
                                        <p className="text-[#0066FF] font-mono text-sm tracking-widest">#{viewQuotation.quotationNo}</p>
                                    </div>
                                    <div className="text-end space-y-1 mt-4">
                                        <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Issue Date</p>
                                        <p className="text-sm font-medium border-b border-white/5 pb-2">{new Date(viewQuotation.createdAt).toLocaleDateString()}</p>
                                        {viewQuotation.validUntil && (
                                            <div className="pt-2">
                                                <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mt-4">Valid Until</p>
                                                <p className="text-sm font-medium text-red-500">{new Date(viewQuotation.validUntil).toLocaleDateString()}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
                                    <div>
                                        <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-4">From</p>
                                        <p className="font-bold text-lg text-white">Nexit Solutions</p>
                                        <p className="text-sm text-zinc-400 mt-1">sales@nexitsolu.com</p>
                                    </div>
                                    <div className="text-end">
                                        <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-4">To Client</p>
                                        <p className="font-bold text-lg text-white">{viewQuotation.user?.name}</p>
                                        <p className="text-sm text-zinc-400 mt-1">{viewQuotation.user?.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-white/5 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                                        <span className="flex-1">Description</span>
                                        <span className="w-20 text-center">Qty</span>
                                        <span className="w-24 text-center">Price</span>
                                        <span className="w-24 text-end pl-4">Total</span>
                                    </div>
                                    <div className="space-y-2">
                                        {viewQuotation.items && Array.isArray(viewQuotation.items) && viewQuotation.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                                <span className="flex-1 font-bold text-sm text-white">{item.description}</span>
                                                <span className="w-20 text-center text-sm font-medium text-zinc-400">{item.quantity}</span>
                                                <span className="w-24 text-center text-sm font-medium text-zinc-400">{item.price}</span>
                                                <span className="w-24 text-end font-black text-sm text-white pl-4">{(item.quantity * item.price).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6">
                                    <div className="w-full max-w-xs space-y-3 shrink-0">
                                        {viewQuotation.subtotal && <div className="flex justify-between text-sm"><span className="text-zinc-500">Subtotal:</span><span className="font-bold text-white">{viewQuotation.subtotal.toFixed(2)} EGP</span></div>}
                                        {viewQuotation.discount > 0 && <div className="flex justify-between text-sm"><span className="text-emerald-500">Discount:</span><span className="font-bold text-emerald-500">- {viewQuotation.discount.toFixed(2)} EGP</span></div>}
                                        {viewQuotation.tax > 0 && <div className="flex justify-between text-sm"><span className="text-yellow-500">Tax ({viewQuotation.tax}%):</span><span className="font-bold text-yellow-500">+ {((viewQuotation.subtotal * viewQuotation.tax) / 100).toFixed(2)} EGP</span></div>}
                                        <div className="pt-4 border-t border-white/10 flex justify-between items-center mt-2">
                                            <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Grand Total</span>
                                            <span className="text-3xl font-black text-[#0066FF]">{viewQuotation.amount} EGP</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-zinc-900 border-t border-white/5 flex justify-between gap-4 items-center rounded-b-3xl">
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${statusColors[viewQuotation.status]}`}>{viewQuotation.status}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-end">
                                    <button onClick={() => setViewQuotation(null)} className="px-6 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white transition-all text-sm font-bold">Close</button>
                                    <button type="button" onClick={() => downloadQuotationPdf(viewQuotation.id, viewQuotation.quotationNo)} className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-500/20 transition-all">
                                        <FileDown className="w-4 h-4" />
                                        {lang === 'ar' ? 'تحميل PDF' : 'Download PDF'}
                                    </button>
                                    <button onClick={() => sendEmail(viewQuotation.id)} disabled={isSendingMail === viewQuotation.id} className="flex items-center gap-2 bg-[#0066FF] text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all disabled:opacity-50">
                                        {isSendingMail === viewQuotation.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                                        {lang === 'ar' ? 'إرسال بالبريد' : 'Send via Email'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmDialog 
                isOpen={confirmAction.isOpen}
                onConfirm={() => {
                    if (!confirmAction.id) return
                    if (confirmAction.action === 'delete') handleDeleteQuotation(confirmAction.id)
                    else if (confirmAction.action === 'status' && confirmAction.statusValue) handleStatusUpdate(confirmAction.id, confirmAction.statusValue)
                }}
                onCancel={() => setConfirmAction({ isOpen: false, id: null, action: null })}
                title={confirmAction.action === 'delete' ? 'Delete Quotation?' : 'Update Status?'}
                message="Are you sure you want to proceed?"
                confirmText="Verify"
                cancelText="Cancel"
                danger={confirmAction.action === 'delete'}
            />
        </div>
    )
}

export default function AdminQuotations() {
    return (
        <Suspense fallback={<div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-[#0066FF] mx-auto" /></div>}>
            <AdminQuotationsContent />
            <style jsx global>{`
                @media print {
                    body { background: white !important; color: black !important; }
                    .fixed { position: absolute !important; background: white !important; }
                    .backdrop-blur-xl, .bg-black/80 { display: none !important; }
                    .invoice-print-area {
                        background: white !important; color: black !important; padding: 1.5cm !important;
                        position: fixed !important; top: 0 !important; left: 0 !important;
                        width: 100% !important; height: 100% !important; z-index: 9999 !important;
                        overflow: visible !important;
                    }
                    .invoice-print-area * { color: black !important; border-color: #eee !important; }
                    .no-print, button { display: none !important; }
                }
            `}</style>
        </Suspense>
    )
}
