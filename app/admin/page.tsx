"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import {
    Users,
    ShoppingCart,
    Package,
    TrendingUp,
    ArrowUpRight,
    DollarSign,
    Eye,
    Loader2,
    Clock,
    CheckCircle2,
    MessageCircle,
    Briefcase,
    ShieldCheck
} from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"

export default function AdminDashboard() {
    const { lang } = useLanguage()
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/stats")
            const json = await res.json()
            setData(json)
        } catch (err) {
            console.error("Failed to fetch stats")
        } finally {
            setIsLoading(false)
        }
    }

    const stats = data ? [
        {
            label: lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
            value: `${data?.stats?.totalRevenue?.toLocaleString() || '0'} ${lang === 'ar' ? 'ج.م' : 'EGP'}`,
            icon: TrendingUp,
            color: 'from-emerald-500 to-green-600',
            bgColor: 'bg-emerald-500/10',
            textColor: 'text-emerald-500'
        },
        {
            label: lang === 'ar' ? 'الطلبات' : 'Total Orders',
            value: (data?.stats?.totalOrders || 0).toString(),
            icon: ShoppingCart,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            textColor: 'text-blue-500'
        },
        {
            label: lang === 'ar' ? 'العملاء' : 'Customers',
            value: (data?.stats?.totalCustomers || 0).toString(),
            icon: Users,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-500/10',
            textColor: 'text-purple-500'
        },
        {
            label: lang === 'ar' ? 'المنتجات' : 'Products',
            value: (data?.stats?.totalProducts || 0).toString(),
            icon: Package,
            color: 'from-orange-500 to-amber-500',
            bgColor: 'bg-orange-500/10',
            textColor: 'text-orange-500'
        },
    ] : []

    const statusColors: Record<string, string> = {
        PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        PROCESSING: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        SHIPPED: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        DELIVERED: 'bg-green-500/10 text-green-500 border-green-500/20',
        CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 animate-spin text-[#0066FF]" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold mb-1">{lang === 'ar' ? 'لوحة القيادة' : 'Dashboard Overview'}</h1>
                <p className="text-zinc-500 text-sm">{lang === 'ar' ? 'تابع أداء متجر نكست والطلبات.' : 'Track NexIT Store performance and orders.'}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08 }}
                        className="relative p-5 rounded-2xl bg-zinc-950 border border-white/10 hover:border-[#0066FF]/40 transition-all group overflow-hidden"
                    >
                        {/* Blue Glow Influence - Matching Reference Image */}
                        <div className="absolute -right-14 -top-14 w-40 h-40 bg-[#0066FF]/20 blur-[70px] rounded-full pointer-events-none group-hover:bg-[#0066FF]/35 transition-all" />
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.textColor} border border-white/5 shadow-inner group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-4 h-4" />
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>{lang === 'ar' ? 'نشط' : 'Active'}</span>
                                </div>
                            </div>
                            
                            <div>
                                <p className="text-zinc-500 text-xs mb-1">{stat.label}</p>
                                <p className="text-xl font-bold text-white group-hover:text-[#0066FF] transition-all">{stat.value}</p>
                            </div>
                        </div>

                        {/* Double Border Effect */}
                        <div className="absolute inset-px border border-white/5 rounded-[0.95rem] pointer-events-none" />
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 rounded-2xl bg-zinc-950 border border-white/10 overflow-hidden relative group">
                    {/* Blue Glow Influence */}
                    <div className="absolute -right-24 -top-24 w-80 h-80 bg-[#0066FF]/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-[#0066FF]/15 transition-all" />
                    
                    {/* Double Border Effect */}
                    <div className="absolute inset-px border border-white/5 rounded-[0.95rem] pointer-events-none z-20" />

                    <div className="relative z-10">
                        <div className="p-6 flex items-center justify-between border-b border-white/5">
                        <h2 className="text-base font-bold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-zinc-500" />
                            {lang === 'ar' ? 'أحدث الطلبات' : 'Recent Orders'}
                        </h2>
                        <a href="/admin/orders" className="text-xs text-[#0066FF] font-bold hover:underline">{lang === 'ar' ? 'عرض الكل' : 'View All'}</a>
                    </div>

                    <div className="divide-y divide-white/5">
                        {data?.recentOrders?.length > 0 ? data.recentOrders.map((order: any) => (
                            <div key={order.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/2 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-[#0066FF]/10 text-[#0066FF] flex items-center justify-center font-bold text-[10px]">
                                        #{order.id.slice(-4).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{order.user?.name || 'Customer'}</p>
                                        <p className="text-[10px] text-zinc-600">
                                            {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} {lang === 'ar' ? 'قطع' : 'items'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-end flex items-center gap-3">
                                    <div>
                                        <p className="text-sm font-bold">{order.total} {lang === 'ar' ? 'ج.م' : 'EGP'}</p>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${statusColors[order.status] || statusColors.PENDING}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="px-6 py-16 text-center">
                                <ShoppingCart className="w-8 h-8 text-zinc-800 mx-auto mb-3" />
                                <p className="text-sm text-zinc-600">{lang === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}</p>
                            </div>
                        )}
                    </div>
                    </div>
                </div>

                {/* Top Customers */}
                <div className="rounded-2xl bg-zinc-950 border border-white/10 overflow-hidden relative group">
                    {/* Blue Glow Influence */}
                    <div className="absolute -right-24 -top-24 w-80 h-80 bg-[#0066FF]/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-[#0066FF]/15 transition-all" />
                    
                    {/* Double Border Effect */}
                    <div className="absolute inset-px border border-white/5 rounded-[0.95rem] pointer-events-none z-20" />

                    <div className="relative z-10">
                        <div className="p-6 border-b border-white/5">
                        <h2 className="text-base font-bold flex items-center gap-2">
                            <Users className="w-4 h-4 text-zinc-500" />
                            {lang === 'ar' ? 'أعلى العملاء' : 'Top Customers'}
                        </h2>
                    </div>

                    <div className="divide-y divide-white/5">
                        {data?.topCustomers?.length > 0 ? data.topCustomers.map((customer: any, i: number) => (
                            <div key={customer.id} className="flex items-center gap-3 px-6 py-4">
                                <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center font-bold text-xs text-white border border-white/5">
                                    {customer.name?.[0]?.toUpperCase() || '#'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{customer.name || 'User'}</p>
                                    <p className="text-[10px] text-zinc-600 truncate">{customer.email}</p>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md">
                                    <ShoppingCart className="w-3 h-3" />
                                    {customer._count?.orders || 0}
                                </div>
                            </div>
                        )) : (
                            <div className="px-6 py-16 text-center">
                                <Users className="w-8 h-8 text-zinc-800 mx-auto mb-3" />
                                <p className="text-sm text-zinc-600">{lang === 'ar' ? 'لا يوجد عملاء بعد' : 'No customers yet'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
                {[
                    { label: lang === 'ar' ? 'إضافة منتج' : 'Add Product', href: '/admin/products', icon: Package, color: 'from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border-blue-500/10' },
                    { label: lang === 'ar' ? 'عرض الطلبات' : 'View Orders', href: '/admin/orders', icon: ShoppingCart, color: 'from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border-purple-500/10' },
                    { label: lang === 'ar' ? 'إدارة العملاء' : 'Manage Customers', href: '/admin/customers', icon: Users, color: 'from-emerald-500/10 to-green-500/10 hover:from-emerald-500/20 hover:to-green-500/20 border-emerald-500/10' },
                    { label: lang === 'ar' ? 'الاشتراكات' : 'Subscriptions', href: '/admin/subscriptions', icon: Briefcase, color: 'from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 border-purple-500/10' },
                    { label: lang === 'ar' ? 'طلبات Managed IT' : 'Managed IT', href: '/admin/managed-it', icon: ShieldCheck, color: 'from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border-emerald-500/10' },
                    { label: lang === 'ar' ? 'المحادثات' : 'Messages', href: '/admin/messages', icon: MessageCircle, color: 'from-orange-500/10 to-amber-500/10 hover:from-orange-500/20 hover:to-amber-500/20 border-orange-500/10' },
                ].map((action, i) => (
                    <motion.a
                        key={i}
                        href={action.href}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className={`p-4 rounded-xl bg-linear-to-br ${action.color} border transition-all flex flex-col items-center gap-2 text-center group shadow-xs`}
                    >
                        <action.icon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                        <span className="text-[10px] font-bold text-zinc-500 group-hover:text-white transition-colors truncate w-full">{action.label}</span>
                    </motion.a>
                ))}
            </div>
        </div>
    )
}
