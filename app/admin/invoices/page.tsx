"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import {
    FileText,
    Search,
    Plus,
    Loader2,
    Eye,
    Trash2,
    X,
    Calendar,
    DollarSign,
    Minus,
    CheckCircle2,
    Edit2,
    Mail,
    FileDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n-context"
import { toast } from "sonner"
import Image from "next/image"
import { ConfirmDialog } from "@/components/confirm-dialog"

function AdminInvoicesContent() {
    const { lang } = useLanguage()
    const searchParams = useSearchParams()
    const urlUserId = searchParams.get("userId")
    const [invoices, setInvoices] = useState<any[]>([])
    const [companies, setCompanies] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [viewInvoice, setViewInvoice] = useState<any>(null)
    const [editInvoice, setEditInvoice] = useState<any>(null)
    const [isSendingMail, setIsSendingMail] = useState<string | null>(null)
    
    // Form state
    const [formData, setFormData] = useState({
        invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
        userId: "",
        notes: "",
        dueDate: "",
        status: "PENDING",
        tax: 0,
        discount: 0
    })

    const [invoiceItems, setInvoiceItems] = useState([
        { description: "", price: 0, quantity: 1 }
    ])

    const [confirmAction, setConfirmAction] = useState<{ isOpen: boolean, id: string | null, action: 'delete' | 'status' | null, statusValue?: string }>({ isOpen: false, id: null, action: null })

    useEffect(() => {
        fetchInvoices()
        fetchCompanies()
    }, [])

    useEffect(() => {
        if (urlUserId && companies.length > 0) {
            setFormData(prev => ({ ...prev, userId: urlUserId }))
            setIsModalOpen(true)
        }
    }, [urlUserId, companies])

    const fetchInvoices = async () => {
        try {
            const res = await fetch("/api/admin/invoices")
            const data = await res.json()
            setInvoices(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error("Failed to fetch invoices")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchCompanies = async () => {
        try {
            const res = await fetch("/api/admin/customers")
            const data = await res.json()
            if (Array.isArray(data)) {
                setCompanies(data.filter(u => u.role === "COMPANY"))
            }
        } catch (err) {
            console.error("Failed to fetch companies")
        }
    }

    const addItem = () => {
        setInvoiceItems([...invoiceItems, { description: "", price: 0, quantity: 1 }])
    }

    const removeItem = (index: number) => {
        setInvoiceItems(invoiceItems.filter((_, i) => i !== index))
    }

    const updateItem = (index: number, field: string, value: string | number) => {
        const newItems = [...invoiceItems]
        newItems[index] = { ...newItems[index], [field]: value }
        setInvoiceItems(newItems)
    }

    const calculateTotals = () => {
        const subtotal = invoiceItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0)
        const taxAmount = (subtotal * Number(formData.tax)) / 100
        const total = subtotal + taxAmount - Number(formData.discount)
        return { subtotal, taxAmount, total: total > 0 ? total : 0 }
    }

    const { subtotal, taxAmount, total } = calculateTotals()

    const handleCreateInvoice = async (e: React.FormEvent) => {
        e.preventDefault()

        const isEditing = !!editInvoice;
        if (!formData.userId) {
            toast.error(lang === 'ar' ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields")
            return
        }

        // Validate items
        if (invoiceItems.some(i => !i.description || Number(i.price) < 0 || Number(i.quantity) < 1)) {
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
                items: invoiceItems
            }

            const res = await fetch("/api/admin/invoices", {
                method: isEditing ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(isEditing ? { ...payload, id: editInvoice.id } : payload)
            })

            if (res.ok) {
                toast.success(isEditing 
                    ? (lang === 'ar' ? "تم تحديث الفاتورة بنجاح" : "Invoice updated successfully")
                    : (lang === 'ar' ? "تم إنشاء الفاتورة بنجاح" : "Invoice created successfully")
                )
                setIsModalOpen(false)
                setEditInvoice(null)
                setFormData({
                    invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
                    userId: "",
                    notes: "",
                    dueDate: "",
                    status: "PENDING",
                    tax: 0,
                    discount: 0
                })
                setInvoiceItems([{ description: "", price: 0, quantity: 1 }])
                fetchInvoices()
            } else {
                const error = await res.json()
                toast.error(error.message || "Failed to create invoice")
            }
        } catch (err) {
            toast.error("Something went wrong")
        }
    }

    const handleDeleteInvoice = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/invoices?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success(lang === 'ar' ? "تم الحذف بنجاح" : "Invoice deleted successfully")
                fetchInvoices()
                setConfirmAction({ isOpen: false, id: null, action: null })
            }
        } catch (err) {
            toast.error(lang === 'ar' ? "فشل الحذف" : "Failed to delete")
        }
    }

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const res = await fetch("/api/admin/invoices", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus })
            })

            if (res.ok) {
                toast.success(lang === 'ar' ? "تم تحديث الحالة بنجاح" : "Status updated successfully")
                fetchInvoices()
                setConfirmAction({ isOpen: false, id: null, action: null })
                if (viewInvoice && viewInvoice.id === id) {
                    setViewInvoice({...viewInvoice, status: newStatus})
                }
            }
        } catch (err) {
            toast.error("Failed to update status")
        }
    }

    const sendEmail = async (id: string) => {
        setIsSendingMail(id)
        try {
            const res = await fetch("/api/admin/invoices/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })
            const data = await res.json()
            if (res.ok) {
                toast.success(lang === 'ar' ? "تم إرسال الإيميل بنجاح" : "Email sent successfully")
            } else {
                toast.error(data.error || "Failed to send email")
            }
        } catch (err) {
            toast.error("Error sending email")
        } finally {
            setIsSendingMail(null)
        }
    }

    const downloadPdf = async (id: string, invoiceNo: string) => {
        try {
            const res = await fetch(`/api/admin/invoices/pdf?id=${id}&lang=${lang}`)
            if (res.ok) {
                const blob = await res.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `Invoice-${invoiceNo}.pdf`
                document.body.appendChild(a)
                a.click()
                a.remove()
                toast.success(lang === 'ar' ? "تم تنزيل PDF" : "PDF downloaded")
            } else {
                const err = await res.json().catch(() => ({}))
                toast.error(err.error || "Failed to download PDF")
            }
        } catch (err) {
            toast.error("Error downloading PDF")
        }
    }

    const statusColors: Record<string, string> = {
        PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        PAID: 'bg-green-500/10 text-green-500 border-green-500/20',
        CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{lang === 'ar' ? 'إدارة الفواتير' : 'Invoice Management'}</h1>
                    <p className="text-muted-foreground">{lang === 'ar' ? 'قم بإنشاء وإدارة فواتير الشركات.' : 'Create and manage company invoices.'}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-background border border-border px-4 py-2 rounded-2xl">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold">{invoices.length}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-widest">{lang === 'ar' ? 'فاتورة' : 'invoices'}</span>
                    </div>
                    <Button
                        onClick={() => {
                            setEditInvoice(null)
                            setFormData({
                                invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
                                userId: "",
                                notes: "",
                                dueDate: "",
                                status: "PENDING",
                                tax: 0,
                                discount: 0
                            })
                            setInvoiceItems([{ description: "", price: 0, quantity: 1 }])
                            setIsModalOpen(true)
                        }}
                        className="bg-primary hover:bg-primary/90 rounded-2xl h-12 px-6 flex items-center gap-2 group text-primary-foreground"
                    >
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        {lang === 'ar' ? 'فاتورة جديدة' : 'New Invoice'}
                    </Button>
                </div>
            </div>

            {/* Invoices List */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-none">
                {isLoading ? (
                    <div className="py-20 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="py-20 text-center">
                        <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">{lang === 'ar' ? 'لا توجد فواتير' : 'No invoices found'}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="px-6 py-4 text-muted-foreground text-[10px] font-bold uppercase tracking-wider text-start">{lang === 'ar' ? 'رقم الفاتورة' : 'Invoice No'}</th>
                                    <th className="px-6 py-4 text-muted-foreground text-[10px] font-bold uppercase tracking-wider text-start">{lang === 'ar' ? 'الشركة' : 'Company'}</th>
                                    <th className="px-6 py-4 text-muted-foreground text-[10px] font-bold uppercase tracking-wider text-start">{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                                    <th className="px-6 py-4 text-muted-foreground text-[10px] font-bold uppercase tracking-wider text-start">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                                    <th className="px-6 py-4 text-muted-foreground text-[10px] font-bold uppercase tracking-wider text-start">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                                    <th className="px-6 py-4 text-muted-foreground text-[10px] font-bold uppercase tracking-wider text-end">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {invoices.map((inv, i) => (
                                    <motion.tr
                                        key={inv.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="hover:bg-muted/50 transition-all cursor-pointer"
                                        onClick={() => setViewInvoice(inv)}
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-mono font-bold text-primary">{inv.invoiceNo}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium">{inv.user?.name || 'N/A'}</p>
                                                <p className="text-[10px] text-muted-foreground">{inv.user?.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold">{inv.amount} EGP</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={inv.status}
                                                onChange={(e) => {
                                                    e.stopPropagation()
                                                    setConfirmAction({
                                                        isOpen: true,
                                                        id: inv.id,
                                                        action: 'status',
                                                        statusValue: e.target.value
                                                    })
                                                }}
                                                className={`text-[10px] px-2.5 py-1 rounded-md border font-bold outline-none cursor-pointer ${statusColors[inv.status] || statusColors.PENDING}`}
                                            >
                                                <option className="bg-background text-yellow-500" value="PENDING">{lang === 'ar' ? 'معلق (PENDING)' : 'PENDING'}</option>
                                                <option className="bg-background text-green-500" value="PAID">{lang === 'ar' ? 'مدفوع (PAID)' : 'PAID'}</option>
                                                <option className="bg-background text-red-500" value="CANCELLED">{lang === 'ar' ? 'ملغى (CANCELLED)' : 'CANCELLED'}</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-muted-foreground">{new Date(inv.createdAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-end">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); sendEmail(inv.id); }}
                                                    disabled={isSendingMail === inv.id}
                                                    title={lang === 'ar' ? 'إرسال إيميل' : 'Send Email'}
                                                    className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500/20 transition-all disabled:opacity-50"
                                                >
                                                    {isSendingMail === inv.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); downloadPdf(inv.id, inv.invoiceNo); }}
                                                    title={lang === 'ar' ? 'تنزيل PDF' : 'Download PDF'}
                                                    className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                                                >
                                                    <FileDown className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={(e) => { 
                                                        e.stopPropagation(); 
                                                        setEditInvoice(inv);
                                                        setFormData({
                                                            invoiceNo: inv.invoiceNo,
                                                            userId: inv.userId || "",
                                                            notes: inv.notes || "",
                                                            dueDate: inv.dueDate ? new Date(inv.dueDate).toISOString().split('T')[0] : "",
                                                            status: inv.status || "PENDING",
                                                            tax: inv.tax || 0,
                                                            discount: inv.discount || 0
                                                        });
                                                        setInvoiceItems(inv.items && Array.isArray(inv.items) ? inv.items : [{ description: "", price: 0, quantity: 1 }]);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="p-2 rounded-lg bg-background border border-border text-muted-foreground hover:text-foreground transition-all"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setViewInvoice(inv); }}
                                                    className="p-2 rounded-lg bg-background border border-border text-muted-foreground hover:text-foreground transition-all"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setConfirmAction({ isOpen: true, id: inv.id, action: 'delete' }); }}
                                                    className="p-2 rounded-lg bg-background border border-border text-muted-foreground hover:text-red-500 transition-all font-medium"
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

            {/* Create Invoice Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-background/80">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-none"
                        >
                            <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-md p-6 border-b border-border flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Image 
                                        src="/nexitlogo.png" 
                                        alt="Nexit" 
                                        width={100} 
                                        height={30} 
                                        className="object-contain"
                                    />
                                    <div className="h-6 w-px bg-border" />
                                    <h3 className="font-bold">{editInvoice ? (lang === 'ar' ? 'تعديل الفاتورة' : 'Edit Invoice') : (lang === 'ar' ? 'إنشاء فاتورة جديدة' : 'Create New Invoice')}</h3>
                                </div>
                                <button onClick={() => { setIsModalOpen(false); setEditInvoice(null); }} className="p-2 hover:bg-muted rounded-lg transition-all"><X className="w-4 h-4" /></button>
                            </div>
                            <form onSubmit={handleCreateInvoice} className="p-6 space-y-6">
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-muted-foreground font-bold uppercase">{lang === 'ar' ? 'رقم الفاتورة' : 'Invoice Number'}</label>
                                        <input
                                            type="text"
                                            value={formData.invoiceNo}
                                            onChange={e => setFormData({ ...formData, invoiceNo: e.target.value })}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-muted-foreground font-bold uppercase">{lang === 'ar' ? 'الحالة' : 'Status'}</label>
                                        <select
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                            className={`w-full bg-background border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all ${
                                                formData.status === 'PAID' ? 'text-green-500 border-green-500/20' :
                                                formData.status === 'CANCELLED' ? 'text-red-500 border-red-500/20' :
                                                'text-yellow-500 border-yellow-500/20'
                                            }`}
                                        >
                                            <option value="PENDING">{lang === 'ar' ? 'معلق (PENDING)' : 'PENDING'}</option>
                                            <option value="PAID">{lang === 'ar' ? 'مدفوع (PAID)' : 'PAID'}</option>
                                            <option value="CANCELLED">{lang === 'ar' ? 'ملغى (CANCELLED)' : 'CANCELLED'}</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-muted-foreground font-bold uppercase">{lang === 'ar' ? 'اختر الشركة' : 'Select Company'}</label>
                                        <select
                                            value={formData.userId}
                                            onChange={e => setFormData({ ...formData, userId: e.target.value })}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                                            required
                                        >
                                            <option value="">{lang === 'ar' ? 'اختر شركة...' : 'Select a company...'}</option>
                                            {companies.map(c => (
                                                <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-muted-foreground font-bold uppercase">{lang === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}</label>
                                        <input
                                            type="date"
                                            value={formData.dueDate}
                                            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Items Section */}
                                <div className="space-y-4 pt-4 border-t border-border">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-primary">{lang === 'ar' ? 'عناصر الفاتورة' : 'Invoice Items'}</h4>
                                        <button 
                                            type="button" 
                                            onClick={addItem}
                                            className="text-xs flex items-center gap-1 bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-lg transition-colors border border-border font-medium"
                                        >
                                            <Plus className="w-3 h-3" /> {lang === 'ar' ? 'إضافة عنصر' : 'Add Item'}
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {invoiceItems.map((item, index) => (
                                            <div key={index} className="flex gap-3 items-start bg-muted/50 p-3 rounded-xl border border-border">
                                                <div className="flex-1 space-y-2">
                                                    <input
                                                        type="text"
                                                        placeholder={lang === 'ar' ? 'وصف المنتج / الخدمة' : 'Service / Product Description'}
                                                        value={item.description}
                                                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:border-primary outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="w-24 space-y-2">
                                                    <input
                                                        type="number"
                                                        placeholder={lang === 'ar' ? 'السعر' : 'Price'}
                                                        value={item.price}
                                                        onChange={(e) => updateItem(index, 'price', e.target.value)}
                                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:border-primary outline-none transition-all text-center"
                                                        min={0}
                                                        required
                                                    />
                                                </div>
                                                <div className="w-20 space-y-2">
                                                    <input
                                                        type="number"
                                                        placeholder={lang === 'ar' ? 'الكمية' : 'Qty'}
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:border-primary outline-none transition-all text-center"
                                                        min={1}
                                                        required
                                                    />
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeItem(index)}
                                                    disabled={invoiceItems.length === 1}
                                                    className={`p-2 rounded-lg mt-0.5 border border-transparent transition-colors ${invoiceItems.length === 1 ? 'opacity-30 cursor-not-allowed text-muted-foreground' : 'text-muted-foreground hover:bg-red-500/10 hover:text-red-500 border-border'}`}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Totals & Discounts */}
                                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs text-muted-foreground font-bold uppercase">{lang === 'ar' ? 'الخصم (EGP)' : 'Discount (EGP)'}</label>
                                            <input
                                                type="number"
                                                value={formData.discount}
                                                onChange={e => setFormData({ ...formData, discount: Number(e.target.value) })}
                                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                                                min={0}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-muted-foreground font-bold uppercase">{lang === 'ar' ? 'الضريبة (%)' : 'Tax (%)'}</label>
                                            <input
                                                type="number"
                                                value={formData.tax}
                                                onChange={e => setFormData({ ...formData, tax: Number(e.target.value) })}
                                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                                                min={0}
                                                max={100}
                                            />
                                        </div>
                                        <div className="space-y-2 pb-4">
                                            <label className="text-xs text-muted-foreground font-bold uppercase">{lang === 'ar' ? 'ملاحظات' : 'Notes'}</label>
                                            <textarea
                                                value={formData.notes}
                                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all min-h-[80px]"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-muted/40 rounded-2xl p-6 border border-border flex flex-col justify-center space-y-4 mb-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground font-medium">{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                                            <span className="font-bold">{subtotal.toFixed(2)} EGP</span>
                                        </div>
                                        
                                        {Number(formData.discount) > 0 && (
                                            <div className="flex justify-between items-center text-sm text-emerald-500">
                                                <span className="font-medium">{lang === 'ar' ? 'الخصم' : 'Discount'}</span>
                                                <span className="font-bold">- {Number(formData.discount).toFixed(2)} EGP</span>
                                            </div>
                                        )}
                                        
                                        {Number(formData.tax) > 0 && (
                                            <div className="flex justify-between items-center text-sm text-yellow-500">
                                                <span className="font-medium">{lang === 'ar' ? 'الضريبة' : 'Tax'} ({formData.tax}%)</span>
                                                <span className="font-bold">+ {taxAmount.toFixed(2)} EGP</span>
                                            </div>
                                        )}
                                        
                                        <div className="pt-4 border-t border-border flex justify-between items-center">
                                            <span className="text-sm font-bold uppercase tracking-widest text-primary">{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                                            <span className="text-2xl font-black text-primary">{total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg sticky bottom-0"
                                >
                                    {editInvoice 
                                        ? (lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes')
                                        : (lang === 'ar' ? 'إنشاء وإرسال الفاتورة' : 'Create & Send Invoice')
                                    }
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* View Invoice Modal */}
            <AnimatePresence>
                {viewInvoice && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-background/80" onClick={() => setViewInvoice(null)}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-2xl bg-card border border-border rounded-3xl overflow-hidden shadow-none max-h-[90vh] flex flex-col"
                        >
                            {/* Digital Invoice Layout */}
                            <div className="p-8 space-y-8 bg-card overflow-y-auto flex-1 invoice-print-area">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="mb-8">
                                            {/* Nexit Logo - White for Screen, Colored for Print */}
                                            <div className="relative">
                                                <Image 
                                                    src="/nexitlogo.png" 
                                                    alt="Nexitweb Logo" 
                                                    width={160} 
                                                    height={50} 
                                                    className="object-contain print:hidden"
                                                    priority
                                                />
                                                <Image 
                                                    src="/nexit-logo.png" 
                                                    alt="Nexitweb Logo" 
                                                    width={160} 
                                                    height={50} 
                                                    className="object-contain hidden print:block"
                                                    priority
                                                />
                                            </div>
                                        </div>
                                        <h2 className="text-4xl font-black mb-1 tracking-tighter">{lang === 'ar' ? 'فاتورة' : 'INVOICE'}</h2>
                                        <p className="text-primary font-mono text-sm tracking-widest">#{viewInvoice.invoiceNo}</p>
                                    </div>
                                    <div className="text-end space-y-1 mt-4">
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{lang === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}</p>
                                        <p className="text-sm font-medium border-b border-border pb-2">{new Date(viewInvoice.createdAt).toLocaleDateString()}</p>
                                        
                                        {viewInvoice.dueDate && (
                                            <div className="pt-2">
                                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mt-4">{lang === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}</p>
                                                <p className="text-sm font-medium text-red-500">{new Date(viewInvoice.dueDate).toLocaleDateString()}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 py-8 border-y border-border">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-4">{lang === 'ar' ? 'مقدم من' : 'From'}</p>
                                        <p className="font-bold text-lg text-foreground">Nexit Solutions Ltd - Engineering Excellence.</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">Operational Zone - Nationwide Coverage</p>
                                        <p className="text-[10px] text-muted-foreground">Cairo, Hurghada & Global</p>
                                        <p className="text-sm text-muted-foreground mt-1 underline">sales@nexitsolu.com</p>
                                    </div>
                                    <div className="text-end">
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-4">{lang === 'ar' ? 'إلى عميل' : 'Bill To'}</p>
                                        <p className="font-bold text-lg text-foreground">{viewInvoice.user?.name}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{viewInvoice.user?.email}</p>
                                        {viewInvoice.user?.phone && <p className="text-xs text-muted-foreground mt-1">{viewInvoice.user?.phone}</p>}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-muted/50 p-4 rounded-xl border border-border text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                                        <span className="flex-1">{lang === 'ar' ? 'الوصف' : 'Description'}</span>
                                        <span className="w-20 text-center">{lang === 'ar' ? 'الكمية' : 'Qty'}</span>
                                        <span className="w-24 text-center">{lang === 'ar' ? 'السعر' : 'Price'}</span>
                                        <span className="w-24 text-end pl-4">{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                                    </div>
                                    <div className="space-y-2">
                                        {viewInvoice.items && Array.isArray(viewInvoice.items) ? (
                                            viewInvoice.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center p-4 bg-muted/30 rounded-xl border border-border hover:bg-muted transition-colors">
                                                    <span className="flex-1 font-bold text-sm text-foreground">{item.description}</span>
                                                    <span className="w-20 text-center text-sm font-medium text-muted-foreground">{item.quantity}</span>
                                                    <span className="w-24 text-center text-sm font-medium text-muted-foreground">{item.price}</span>
                                                    <span className="w-24 text-end font-black text-sm text-foreground pl-4">{(item.quantity * item.price).toFixed(2)}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex justify-between items-center p-4 bg-muted/30 rounded-xl border border-border">
                                                <span className="flex-1 font-bold text-sm text-foreground">{lang === 'ar' ? 'منتجات / خدمات برمجية' : 'Software Services / Products'}</span>
                                                <span className="w-24 text-end font-black text-sm text-foreground pl-4">{viewInvoice.amount}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Summary calculations */}
                                <div className="flex justify-end pt-6">
                                    <div className="w-full max-w-xs space-y-3 shrink-0">
                                        {viewInvoice.subtotal !== null && viewInvoice.subtotal !== undefined && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground font-medium">{lang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                                                <span className="font-bold text-foreground">{viewInvoice.subtotal.toFixed(2)} EGP</span>
                                            </div>
                                        )}
                                        {viewInvoice.discount > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-emerald-500 font-medium">{lang === 'ar' ? 'الخصم:' : 'Discount:'}</span>
                                                <span className="font-bold text-emerald-500">- {viewInvoice.discount.toFixed(2)} EGP</span>
                                            </div>
                                        )}
                                        {viewInvoice.tax > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-yellow-500 font-medium">{lang === 'ar' ? 'الضريبة:' : `Tax (${viewInvoice.tax}%):`}</span>
                                                <span className="font-bold text-yellow-500">
                                                    + {viewInvoice.subtotal ? ((viewInvoice.subtotal * viewInvoice.tax) / 100).toFixed(2) : 'Included'} EGP
                                                </span>
                                            </div>
                                        )}
                                        
                                        <div className="pt-4 border-t border-border flex justify-between items-center mt-2">
                                            <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{lang === 'ar' ? 'الإجمالي النهائي' : 'Grand Total'}</span>
                                            <span className="text-3xl font-black text-primary">{viewInvoice.amount} EGP</span>
                                        </div>
                                    </div>
                                </div>

                                {viewInvoice.notes && (
                                    <div className="bg-primary/5 border border-primary/20 p-5 rounded-xl mt-8">
                                        <p className="text-[10px] text-primary font-black mb-2 uppercase tracking-widest flex items-center gap-2">
                                            <FileText className="w-3 h-3" />
                                            {lang === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
                                        </p>
                                        <p className="text-sm text-muted-foreground italic leading-relaxed whitespace-pre-wrap">{viewInvoice.notes}</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-muted border-t border-border flex justify-between gap-4 items-center rounded-b-3xl">
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${statusColors[viewInvoice.status]}`}>
                                        {viewInvoice.status}
                                    </span>
                                    
                                    {/* Quick Status Update inside View */}
                                    {viewInvoice.status === 'PENDING' && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setConfirmAction({
                                                    isOpen: true,
                                                    id: viewInvoice.id,
                                                    action: 'status',
                                                    statusValue: 'PAID'
                                                })
                                            }}
                                            className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors border border-emerald-500/10"
                                        >
                                            {lang === 'ar' ? 'تحديد كمدفوع' : 'Mark as Paid'}
                                        </button>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setViewInvoice(null)}
                                        className="px-6 py-2.5 rounded-xl border border-border text-zinc-400 hover:text-foreground hover:bg-accent/50 transition-all text-sm font-bold"
                                    >
                                        {lang === 'ar' ? 'إغلاق' : 'Close'}
                                    </button>
                                    <button 
                                        onClick={() => downloadPdf(viewInvoice.id, viewInvoice.invoiceNo)}
                                        className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-500/20 transition-all"
                                    >
                                        <FileDown className="w-4 h-4" />
                                        {lang === 'ar' ? 'تحميل PDF' : 'Download PDF'}
                                    </button>
                                    <button 
                                        onClick={() => sendEmail(viewInvoice.id)}
                                        disabled={isSendingMail === viewInvoice.id}
                                        className="flex items-center gap-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-500/20 transition-all disabled:opacity-50"
                                    >
                                        {isSendingMail === viewInvoice.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                                        {lang === 'ar' ? 'إرسال بالبريد' : 'Send via Email'}
                                    </button>
                                    <button 
                                        onClick={() => window.print()}
                                        className="flex items-center gap-2 bg-[#0066FF] text-foreground px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        <DollarSign className="w-4 h-4" />
                                        {lang === 'ar' ? 'طباعة' : 'Print PDF'}
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
                    if (confirmAction.action === 'delete') {
                        handleDeleteInvoice(confirmAction.id)
                    } else if (confirmAction.action === 'status' && confirmAction.statusValue) {
                        handleStatusUpdate(confirmAction.id, confirmAction.statusValue)
                    }
                }}
                onCancel={() => setConfirmAction({ isOpen: false, id: null, action: null })}
                title={
                    confirmAction.action === 'delete' 
                        ? (lang === 'ar' ? 'حذف الفاتورة؟' : 'Delete Invoice?') 
                        : (lang === 'ar' ? 'تحديث الحالة؟' : 'Update Status?')
                }
                message={
                    confirmAction.action === 'delete'
                        ? (lang === 'ar' ? 'هل أنت متأكد من رغبتك في حذف هذه الفاتورة؟' : 'Are you sure you want to delete this invoice?')
                        : (lang === 'ar' ? `هل أنت متأكد من تحديث حالة الفاتورة إلى ${confirmAction.statusValue}؟` : `Are you sure you want to update invoice status to ${confirmAction.statusValue}?`)
                }
                confirmText={confirmAction.action === 'delete' ? (lang === 'ar' ? 'حذف' : 'Delete') : (lang === 'ar' ? 'تأكيد' : 'Confirm')}
                cancelText={lang === 'ar' ? 'إلغاء' : 'Cancel'}
                danger={confirmAction.action === 'delete' || confirmAction.statusValue === 'CANCELLED'}
            />
        </div>
    )
}

export default function AdminInvoices() {
    return (
        <Suspense fallback={
            <div className="py-20 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#0066FF] mx-auto" />
            </div>
        }>
            <AdminInvoicesContent />
            <style jsx global>{`
                @media print {
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    .fixed {
                        position: absolute !important;
                        background: white !important;
                    }
                    .backdrop-blur-xl, .bg-black/80 {
                        display: none !important;
                    }
                    .invoice-print-area {
                        background: white !important;
                        color: black !important;
                        padding: 1.5cm !important;
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                        z-index: 9999 !important;
                        overflow: visible !important;
                    }
                    .invoice-print-area * {
                        color: black !important;
                        border-color: #eee !important;
                    }
                    .invoice-print-area .text-muted-foreground, 
                    .invoice-print-area .text-zinc-400,
                    .invoice-print-area .text-muted-foreground/60 {
                        color: #666 !important;
                    }
                    .invoice-print-area .bg-secondary\/50,
                    .invoice-print-area .bg-white\/5 {
                        background: #f9f9f9 !important;
                        border-color: #eee !important;
                    }
                    .invoice-print-area .text-\[\#0066FF\] {
                        color: #0066FF !important;
                    }
                    .no-print, button, .p-4.bg-secondary.border-t {
                        display: none !important;
                    }
                }
            `}</style>
        </Suspense>
    )
}
