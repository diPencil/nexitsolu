"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Plus, Search, Warehouse, Package,
    Truck, DollarSign, Calendar, X,
    Loader2, ArrowUpRight, BarChart3,
    CheckCircle2, AlertCircle
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n-context"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function PurchasesPage() {
    const { lang } = useLanguage()
    const [purchases, setPurchases] = useState<any[]>([])
    const [suppliers, setSuppliers] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const [formData, setFormData] = useState({
        supplierId: "",
        productId: "",
        quantity: "",
        unitPrice: "",
        status: "COMPLETED"
    })

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [purRes, supRes, proRes] = await Promise.all([
                fetch("/api/admin/purchases"),
                fetch("/api/admin/suppliers"),
                fetch("/api/products") // public products API is fine
            ])

            if (purRes.ok) setPurchases(await purRes.json())
            if (supRes.ok) setSuppliers(await supRes.json())
            if (proRes.ok) setProducts(await proRes.json())
        } catch (error) {
            toast.error("Failed to load data")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.supplierId || !formData.productId || !formData.quantity || !formData.unitPrice) {
            toast.error("Please fill all required fields")
            return
        }

        setIsSaving(true)
        try {
            const res = await fetch("/api/admin/purchases", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    supplierId: formData.supplierId,
                    productId: formData.productId,
                    quantity: parseInt(formData.quantity),
                    unitPrice: parseFloat(formData.unitPrice),
                    status: formData.status
                })
            })

            if (res.ok) {
                toast.success(lang === 'ar' ? "تم تسجيل المشتريات وتحديث المخزن!" : "Purchase recorded & stock updated!")
                setIsModalOpen(false)
                setFormData({ supplierId: "", productId: "", quantity: "", unitPrice: "", status: "COMPLETED" })
                fetchData()
            } else {
                const err = await res.json()
                toast.error(err.error || "Failed to record purchase")
            }
        } catch (error) {
            toast.error("Error saving purchase")
        } finally {
            setIsSaving(false)
        }
    }

    const filteredPurchases = purchases.filter(p =>
        p.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalStockValue = purchases.reduce((acc, p) => acc + (p.totalPrice || 0), 0)

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{lang === 'ar' ? 'المشتريات والمخزن' : 'Stock & Purchases'}</h1>
                    <p className="text-zinc-500">{lang === 'ar' ? 'سجل مشترياتك من الموردين وزود مخزون المنتجات.' : 'Record supplies and automatically update your inventory.'}</p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#0066FF] hover:bg-blue-600 text-white border-none rounded-2xl h-12 px-6 flex items-center gap-2 group font-black shadow-lg shadow-blue-500/20 transition-all font-inter"
                >
                    <Plus className="w-5 h-5 text-white transition-transform group-hover:rotate-90" />
                    {lang === 'ar' ? 'توريد جديد' : 'New Supply'}
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-inter">
                <div className="p-6 rounded-3xl bg-zinc-900 border border-white/5 flex items-center gap-4 group hover:border-blue-600/30 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20">
                        <Warehouse className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-black">{purchases.length}</p>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'عمليات التوريد' : 'Supply Operations'}</p>
                    </div>
                </div>
                <div className="p-6 rounded-3xl bg-zinc-900 border border-white/5 flex items-center gap-4 group hover:border-emerald-600/30 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center border border-emerald-600/20">
                        <BarChart3 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-black">{totalStockValue.toLocaleString()} <span className="text-xs text-zinc-500 font-bold">EGP</span></p>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'إجمالي قيمة المشتريات' : 'Total Purchase Value'}</p>
                    </div>
                </div>
                <div className="p-6 rounded-3xl bg-zinc-900 border border-white/5 flex items-center gap-4 group hover:border-orange-600/30 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-orange-600/10 flex items-center justify-center border border-orange-600/20">
                        <Package className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-black">{products.reduce((acc, p) => acc + p.stock, 0)}</p>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'إجمالي القطع بالمخزن' : 'Total Stock Units'}</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder={lang === 'ar' ? "ابحث عن منتج أو مورد..." : "Search product or supplier..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-blue-600 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-start">
                        <thead>
                            <tr className="border-b border-white/5 bg-zinc-950/50">
                                <th className="px-6 py-4 text-start text-[10px] font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'التفاصيل' : 'Details'}</th>
                                <th className="px-6 py-4 text-start text-[10px] font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'المورد' : 'Supplier'}</th>
                                <th className="px-6 py-4 text-start text-[10px] font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
                                <th className="px-6 py-4 text-start text-[10px] font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'التكلفة' : 'Cost'}</th>
                                <th className="px-6 py-4 text-end text-[10px] font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-inter">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-8 h-16 bg-white/5" />
                                    </tr>
                                ))
                            ) : filteredPurchases.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-zinc-500 italic">
                                        {lang === 'ar' ? 'لا يوجد سجلات توريد' : 'No supply records found'}
                                    </td>
                                </tr>
                            ) : (
                                filteredPurchases.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-600/20 flex items-center justify-center">
                                                    <Package className="w-5 h-5 text-orange-500" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm">{lang === 'ar' ? p.product?.nameAr || p.product?.name : p.product?.name}</p>
                                                    <p className="text-[10px] text-zinc-500 uppercase tracking-tight">Supply Record #{p.id.slice(-6).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Truck className="w-3.5 h-3.5 text-zinc-500" />
                                                <span className="text-sm text-zinc-300">{p.supplier?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-emerald-500">
                                            +{p.quantity} Units
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-black text-white">{p.totalPrice?.toLocaleString()} EGP</p>
                                            <p className="text-[9px] text-zinc-600 uppercase">@{p.unitPrice} each</p>
                                        </td>
                                        <td className="px-6 py-4 text-end">
                                            <div className="flex flex-col items-end">
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase mb-1">
                                                    <CheckCircle2 className="w-2.5 h-2.5" /> {p.status}
                                                </div>
                                                <p className="text-[10px] text-zinc-600 flex items-center gap-1">
                                                    <Calendar className="w-2.5 h-2.5" />
                                                    {new Date(p.purchaseDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-black/80 font-inter">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex items-start gap-3 min-w-0 flex-1">
                                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#0066FF]/10 flex items-center justify-center border border-[#0066FF]/20">
                                            <Warehouse className="w-6 h-6 text-[#0066FF]" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h2 className="text-2xl font-black leading-tight">{lang === 'ar' ? 'تسجيل توريد جديد' : 'New Supply Entry'}</h2>
                                            <p className="text-xs text-zinc-600 mt-1">{lang === 'ar' ? 'تحديث المخزن فوراً بعد الحفظ' : 'Instant stock update upon saving'}</p>
                                            <Link
                                                href="/admin/products/new"
                                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0066FF] hover:text-blue-300 transition-colors mt-2"
                                            >
                                                <Plus className="w-3 h-3 shrink-0" />
                                                {lang === "ar" ? "منتج جديد؟ أضف من هنا" : "New product? Add it here"}
                                            </Link>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-xl transition-all shrink-0">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                                <Truck className="w-3 h-3" /> {lang === 'ar' ? 'اختر المورد' : 'Select Supplier'}
                                            </label>
                                            <select
                                                required
                                                value={formData.supplierId}
                                                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                                                className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-blue-600 outline-none transition-all text-sm appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-zinc-950">{lang === 'ar' ? '-- اختر المورد --' : '-- Choose Supplier --'}</option>
                                                {suppliers.map(s => <option key={s.id} value={s.id} className="bg-zinc-950">{s.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                                <Package className="w-3 h-3" /> {lang === 'ar' ? 'المنتج' : 'Product'}
                                            </label>
                                            <select
                                                required
                                                value={formData.productId}
                                                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                                className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-blue-600 outline-none transition-all text-sm appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-zinc-950">{lang === 'ar' ? '-- اختر المنتج --' : '-- Choose Product --'}</option>
                                                {products.map(p => <option key={p.id} value={p.id} className="bg-zinc-950">{lang === 'ar' ? p.nameAr || p.name : p.name}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                                <ArrowUpRight className="w-3 h-3" /> {lang === 'ar' ? 'الكمية الموردة' : 'Supplied Quantity'}
                                            </label>
                                            <input
                                                required
                                                type="number"
                                                min="1"
                                                value={formData.quantity}
                                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                                className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-blue-600 outline-none transition-all text-sm font-black"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                                <DollarSign className="w-3 h-3" /> {lang === 'ar' ? 'سعر الشراء للقطعة' : 'Purchase Price / Unit'}
                                            </label>
                                            <input
                                                required
                                                type="number"
                                                step="0.01"
                                                value={formData.unitPrice}
                                                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                                                className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-blue-600 outline-none transition-all text-sm font-black text-emerald-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    {formData.quantity && formData.unitPrice && (
                                        <div className="p-6 rounded-3xl bg-[#0066FF]/5 border border-[#0066FF]/20 flex items-center justify-between">
                                            <span className="text-xs font-black uppercase text-zinc-500">{lang === 'ar' ? 'إجمالي تكلفة الشروه' : 'Total Batch Cost'}</span>
                                            <span className="text-xl font-black text-[#0066FF]">{(parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toLocaleString()} EGP</span>
                                        </div>
                                    )}

                                    <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 flex gap-3">
                                        <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                                        <p className="text-[11px] text-orange-500/80 leading-relaxed font-bold">
                                            {lang === 'ar' ? 'انتبه: بعد الحفظ سيتم إضافة هذه الكمية مباشرة إلى مخزون المنتج الحالي ولا يمكن التراجع تلقائياً.' : "Warning: Once saved, this quantity will be added immediately to the product's current stock."}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 bg-[#0066FF] hover:bg-blue-500 text-white rounded-2xl h-16 font-black shadow-xl shadow-blue-600/20 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (lang === 'ar' ? 'حفظ وتحديث المخزن' : 'Save & Update Stock')}
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-8 rounded-2xl bg-zinc-900 text-zinc-400 hover:text-white transition-all font-bold"
                                    >
                                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
