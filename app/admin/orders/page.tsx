"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import {
    ShoppingCart,
    Search,
    Filter,
    Eye,
    Loader2,
    Clock,
    Package,
    ChevronDown,
    X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n-context"
import { toast } from "sonner"

export default function AdminOrders() {
    const { lang } = useLanguage()
    const [orders, setOrders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState("ALL")
    const [selectedOrder, setSelectedOrder] = useState<any>(null)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/admin/orders")
            const data = await res.json()
            setOrders(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error("Failed to fetch orders")
        } finally {
            setIsLoading(false)
        }
    }

    const statusColors: Record<string, string> = {
        PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        PROCESSING: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        SHIPPED: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        DELIVERED: 'bg-green-500/10 text-green-500 border-green-500/20',
        CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
    }

    const statusFilters = ['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{lang === 'ar' ? 'إدارة الطلبات' : 'Orders Management'}</h1>
                    <p className="text-zinc-500">{lang === 'ar' ? 'تابع وأدر طلبات العملاء.' : 'Track and manage customer orders.'}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                        <ShoppingCart className="w-4 h-4 text-[#0066FF]" />
                        <span className="text-sm font-bold">{orders.length}</span>
                        <span className="text-xs text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'طلب' : 'orders'}</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {statusFilters.map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === s
                                ? 'bg-[#0066FF] text-white'
                                : 'bg-zinc-900 text-zinc-500 hover:text-white border border-white/5'
                            }`}
                    >
                        {s === 'ALL' ? (lang === 'ar' ? 'الكل' : 'All') : s}
                        {s !== 'ALL' && (
                            <span className="ml-1.5 opacity-60">({orders.filter(o => o.status === s).length})</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden">
                {isLoading ? (
                    <div className="py-20 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-[#0066FF] mx-auto" />
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="py-20 text-center">
                        <ShoppingCart className="w-10 h-10 text-zinc-800 mx-auto mb-3" />
                        <p className="text-sm text-zinc-600">{lang === 'ar' ? 'لا توجد طلبات' : 'No orders found'}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5 bg-zinc-900/30">
                                    <th className="px-6 py-4 text-zinc-600 text-[10px] font-bold uppercase tracking-wider text-start">{lang === 'ar' ? 'رقم الطلب' : 'Order ID'}</th>
                                    <th className="px-6 py-4 text-zinc-600 text-[10px] font-bold uppercase tracking-wider text-start">{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                                    <th className="px-6 py-4 text-zinc-600 text-[10px] font-bold uppercase tracking-wider text-start">{lang === 'ar' ? 'المنتجات' : 'Items'}</th>
                                    <th className="px-6 py-4 text-zinc-600 text-[10px] font-bold uppercase tracking-wider text-start">{lang === 'ar' ? 'المبلغ' : 'Total'}</th>
                                    <th className="px-6 py-4 text-zinc-600 text-[10px] font-bold uppercase tracking-wider text-start">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                                    <th className="px-6 py-4 text-zinc-600 text-[10px] font-bold uppercase tracking-wider text-start">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                                    <th className="px-6 py-4 text-zinc-600 text-[10px] font-bold uppercase tracking-wider text-end">{lang === 'ar' ? 'عرض' : 'View'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredOrders.map((order, i) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="hover:bg-white/2 transition-all"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-mono font-bold text-[#0066FF]">#{order.id.slice(-6).toUpperCase()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium">{order.user?.name || 'N/A'}</p>
                                                <p className="text-[10px] text-zinc-600">{order.user?.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm">{order.items?.length || 0} {lang === 'ar' ? 'منتجات' : 'items'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                             <span className="text-sm font-bold">{order.total} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] px-2.5 py-1 rounded-md border font-bold ${statusColors[order.status] || statusColors.PENDING}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-end">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-500 hover:text-white transition-all"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/80" onClick={() => setSelectedOrder(null)}>
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={e => e.stopPropagation()}
                        className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold">{lang === 'ar' ? 'الطلب' : 'Order'} #{selectedOrder.id.slice(-6).toUpperCase()}</h3>
                                <p className="text-xs text-zinc-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/5 rounded-lg"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-zinc-500">{lang === 'ar' ? 'العميل' : 'Customer'}</span>
                                <span className="text-sm font-medium">{selectedOrder.user?.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-zinc-500">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</span>
                                <span className="text-sm">{selectedOrder.user?.email}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-zinc-500">{lang === 'ar' ? 'الحالة' : 'Status'}</span>
                                <select 
                                    className={`text-[10px] px-2.5 py-1 rounded-md border font-bold bg-transparent outline-none cursor-pointer ${statusColors[selectedOrder.status]}`}
                                    value={selectedOrder.status}
                                    onChange={async (e) => {
                                        const newStatus = e.target.value
                                        try {
                                            const res = await fetch('/api/admin/orders', {
                                                method: 'PATCH',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ id: selectedOrder.id, status: newStatus })
                                            })
                                            if (res.ok) {
                                                const updated = await res.json()
                                                setSelectedOrder(updated)
                                                fetchOrders()
                                                toast.success(lang === 'ar' ? "تم تحديث الحالة" : "Status updated")
                                            }
                                        } catch (err) {
                                            toast.error(lang === 'ar' ? "فشل تحديث الحالة" : "Failed to update status")
                                        }
                                    }}
                                >
                                    {Object.keys(statusColors).map(s => (
                                        <option key={s} value={s} className="bg-zinc-950 text-white">{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-zinc-500">{lang === 'ar' ? 'كود التتبع' : 'Tracking Code'}</span>
                                <span className="text-[10px] font-mono select-all bg-white/5 px-2 py-1 rounded border border-white/5">{selectedOrder.id}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-zinc-500">{lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</span>
                                <span className="text-sm font-bold text-[#0066FF] capitalize">{selectedOrder.paymentMethod ? selectedOrder.paymentMethod.replace(/_/g, ' ') : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-zinc-500">{lang === 'ar' ? 'نوع الدفع' : 'Payment Type'}</span>
                                <span className="text-sm font-bold">{selectedOrder.paymentType === 'DEPOSIT' ? (lang === 'ar' ? 'عربون 30%' : '30% Deposit') : (lang === 'ar' ? 'دفع كامل' : 'Full Payment')}</span>
                            </div>
                            {selectedOrder.transactionId && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-zinc-500">{lang === 'ar' ? 'رقم العملية' : 'Transaction ID'}</span>
                                    <span className="text-xs font-mono select-all bg-white/5 px-2 py-1 rounded border border-white/5">{selectedOrder.transactionId}</span>
                                </div>
                            )}
                            {selectedOrder.senderPhone && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-zinc-500">{lang === 'ar' ? 'رقم المحول' : 'Sender Phone'}</span>
                                    <span className="text-sm font-bold text-white">{selectedOrder.senderPhone}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-start pt-3 border-t border-white/5">
                                <span className="text-sm text-zinc-500">{lang === 'ar' ? 'بيانات الشحن' : 'Shipping Info'}</span>
                                <div className="text-end">
                                    <p className="text-sm font-bold text-white">{selectedOrder.shippingName || 'N/A'}</p>
                                    <p className="text-xs text-zinc-400">{selectedOrder.shippingPhone}</p>
                                    <p className="text-xs text-zinc-400 max-w-[200px] truncate">{selectedOrder.shippingCity} - {selectedOrder.shippingAddress}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                <span className="text-sm text-zinc-500">{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                                 <span className="text-base font-bold text-[#0066FF]">{selectedOrder.total} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-zinc-500">{lang === 'ar' ? 'المدفوع إلكترونياً' : 'Paid Amount'}</span>
                                 <span className="text-sm font-bold text-emerald-500">{selectedOrder.paidAmount || selectedOrder.total} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                            </div>
                            <div className="border-t border-white/5 pt-4">
                                <p className="text-xs text-zinc-500 font-bold mb-3 uppercase">{lang === 'ar' ? 'المنتجات' : 'Items'}</p>
                                {selectedOrder.items?.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-2">
                                            <Package className="w-4 h-4 text-zinc-600" />
                                            <span className="text-sm">{lang === 'ar' ? item.product?.nameAr || item.product?.name : item.product?.name || 'Product'}</span>
                                        </div>
                                         <span className="text-xs text-zinc-500">{item.quantity} × {item.price} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
