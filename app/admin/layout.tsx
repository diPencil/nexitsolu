"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    MessageCircle,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Bell,
    Settings,
    ExternalLink,
    CreditCard,
    Briefcase,
    ShieldCheck,
    Clock,
    Star,
    FileText
} from "lucide-react"
import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n-context"
import { motion, AnimatePresence } from "framer-motion"

interface NavItem {
    name: string
    icon: any
    href: string
    count?: number | null
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const { lang, setLang } = useLanguage()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [stats, setStats] = useState<any>(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats")
                if (res.ok) {
                    const data = await res.json()
                    setStats(data.stats)
                }
            } catch (error) {}
        }
        fetchStats()
        const interval = setInterval(fetchStats, 30000) // update every 30s
        return () => clearInterval(interval)
    }, [])

    // Hide main site navbar, topbar, footer
    useEffect(() => {
        const navbar = document.querySelector('nav') as HTMLElement
        const topbar = document.querySelector('.topbar, header:not([data-admin])') as HTMLElement
        const footer = document.querySelector('footer') as HTMLElement
        const mainNavbar = document.querySelector('[class*="sticky"][class*="top-"]') as HTMLElement

        // Hide all parent layout elements
        document.querySelectorAll('body > div > div > div > nav, body > div > div > div > header, body > div > div > div > footer').forEach(el => {
            (el as HTMLElement).style.display = 'none'
        })

        // More specific: hide all siblings of main content that are navbars/footers
        const mainContent = document.querySelector('main')
        if (mainContent?.parentElement) {
            Array.from(mainContent.parentElement.children).forEach(child => {
                if (child !== mainContent && child.tagName !== 'SCRIPT') {
                    (child as HTMLElement).style.display = 'none'
                }
            })
            // Make main take full height
            mainContent.style.flexGrow = '1'
            mainContent.style.padding = '0'
            mainContent.style.margin = '0'
            if (mainContent.parentElement) {
                mainContent.parentElement.style.minHeight = '100vh'
            }
        }

        return () => {
            // Restore when leaving admin
            if (mainContent?.parentElement) {
                Array.from(mainContent.parentElement.children).forEach(child => {
                    if (child !== mainContent && child.tagName !== 'SCRIPT') {
                        (child as HTMLElement).style.display = ''
                    }
                })
                mainContent.style.flexGrow = ''
                mainContent.style.padding = ''
                mainContent.style.margin = ''
            }
        }
    }, [])

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
        if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
            router.push("/")
        }
    }, [status, session, router])

    if (status === "loading") {
        return (
            <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-9999">
                <div className="flex flex-col items-center gap-4">
                    <Image src="/nexitlogo.png" alt="Nexit Logo" width={150} height={40} className="w-auto h-8 animate-pulse brightness-110" />
                    <p className="text-zinc-500 text-sm animate-pulse">{lang === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading admin panel...'}</p>
                </div>
            </div>
        )
    }

    if (status !== "authenticated" || (session?.user as any)?.role !== "ADMIN") {
        return null
    }

    const menuGroups: { title: string, items: NavItem[] }[] = [
        {
            title: lang === 'ar' ? 'الرئيسية' : 'Main',
            items: [
                { name: lang === 'ar' ? 'الرئيسية' : 'Dashboard', icon: LayoutDashboard, href: '/admin' },
            ]
        },
        {
            title: lang === 'ar' ? 'المتجر' : 'Shop',
            items: [
                { name: lang === 'ar' ? 'المنتجات' : 'Products', icon: Package, href: '/admin/products', count: stats?.totalProducts },
                { name: lang === 'ar' ? 'الطلبات' : 'Orders', icon: ShoppingCart, href: '/admin/orders', count: stats?.totalOrders },
                { name: lang === 'ar' ? 'الفواتير' : 'Invoices', icon: FileText, href: '/admin/invoices', count: stats?.totalInvoices },
                { name: lang === 'ar' ? 'عروض السعر' : 'Quotations', icon: FileText, href: '/admin/quotations', count: stats?.totalQuotations },
                { name: lang === 'ar' ? 'التقييمات' : 'Reviews', icon: Star, href: '/admin/reviews', count: stats?.totalReviews },
            ]
        },
        {
            title: lang === 'ar' ? 'العملاء' : 'CRM',
            items: [
                { name: lang === 'ar' ? 'العملاء' : 'Customers', icon: Users, href: '/admin/customers', count: stats?.totalCustomers },
                { name: lang === 'ar' ? 'الشركات' : 'Companies', icon: Briefcase, href: '/admin/companies', count: stats?.totalCompanies },
            ]
        },
        {
            title: lang === 'ar' ? 'الخدمات' : 'Services',
            items: [
                { name: lang === 'ar' ? 'الاشتراكات' : 'Subscriptions', icon: Briefcase, href: '/admin/subscriptions', count: stats?.totalSubscriptions },
                { name: lang === 'ar' ? 'العقود' : 'Contracts', icon: ShieldCheck, href: '/admin/managed-it', count: stats?.totalManagedIT },
                { name: lang === 'ar' ? 'الدعم الفني' : 'Tech Support', icon: ShieldCheck, href: '/admin/tech-support', count: stats?.totalTechSupport },
            ]
        },
        {
            title: lang === 'ar' ? 'التواصل' : 'Communication',
            items: [
                { name: lang === 'ar' ? 'تواصل معنا' : 'Contact Us', icon: MessageCircle, href: '/admin/contact-messages', count: stats?.totalContactMessages },
                { name: lang === 'ar' ? 'المحادثات' : 'Messages', icon: MessageCircle, href: '/admin/messages', count: stats?.totalConversations },
            ]
        },
        {
            title: lang === 'ar' ? 'النظام' : 'System',
            items: [
                { name: lang === 'ar' ? 'الإعدادات' : 'Settings', icon: Settings, href: '/admin/settings' },
            ]
        }
    ]

    const navItems = menuGroups.flatMap(group => group.items)
    const currentPage = navItems.find(item => item.href === pathname)?.name || (lang === 'ar' ? 'الرئيسية' : 'Dashboard')

    const handleLogout = async () => {
        await signOut({ redirect: true, callbackUrl: '/' })
    }

    return (
        <div className="fixed inset-0 bg-[#0a0a0a] text-white flex z-999" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-[260px]' : 'w-0'} border-e border-white/5 bg-[#0d0d0d] overflow-hidden flex flex-col transition-all duration-300 fixed md:relative h-full z-50`}
            >
                {/* Logo */}
                <div className="p-5 flex items-center gap-3 border-b border-white/5 shrink-0">
                    <Link href="/admin" className="flex items-center gap-2 mb-1">
                        <Image src="/nexitlogo.png" alt="Nexit Logo" width={140} height={32} className="h-8 w-auto object-contain brightness-110 shrink-0" />
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] bg-white/5 px-2 py-0.5 rounded-md border border-white/5 hidden sm:block mt-1">{lang === 'ar' ? 'الأدمن' : 'Admin'}</span>
                    </Link>
                </div>

                {/* Nav */}
                <nav 
                    className="flex-1 px-3 py-6 space-y-8 overflow-y-auto select-none"
                    data-lenis-prevent="true"
                >
                    {menuGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-1">
                            <p className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-3">
                                {group.title}
                            </p>
                            {group.items.map((item) => {
                                const isActive = pathname === item.href
                                const hasCount = item.count !== undefined && item.count !== null
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                            : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                                        <span className="truncate flex-1">{item.name}</span>
                                        {hasCount && (
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-blue-600/10 text-blue-500'} border border-white/5`}>
                                                {item.count}
                                            </span>
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    ))}
                </nav>

                {/* User + Logout */}
                <div className="p-3 border-t border-white/5 mt-auto">
                    {/* User Info */}
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative">
                            <Image src="/favicon.png" alt="Admin" fill className="object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{session?.user?.name || 'Admin'}</p>
                            <p className="text-[10px] text-zinc-600 truncate">{session?.user?.email}</p>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full text-start font-medium"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        {lang === 'ar' ? 'تسجيل خروج' : 'Logout'}
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden" data-lenis-prevent="true">
                {/* Top Bar */}
                <header data-admin="true" className="h-14 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg border border-white/5 hover:bg-white/5 transition-all"
                        >
                            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </button>
                        <div className="hidden sm:flex items-center gap-2 text-sm">
                            <Link href="/admin" className="text-zinc-500 hover:text-white transition-colors">{lang === 'ar' ? 'الأدمن' : 'Admin'}</Link>
                            <ChevronRight className={`w-3 h-3 text-zinc-700 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                            <span className="text-white font-medium">{currentPage}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Language Toggle */}
                        <button
                            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/5 hover:bg-white/5 transition-all text-xs font-bold text-zinc-400 hover:text-white"
                            title={lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
                        >
                            <span className="text-base leading-none">{lang === 'ar' ? '🇬🇧' : '🇪🇬'}</span>
                            <span className="hidden sm:inline">{lang === 'ar' ? 'EN' : 'عربي'}</span>
                        </button>

                        {/* Notifications */}
                        <NotificationBell lang={lang} />
                        
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/5 hover:bg-white/5 transition-all text-xs text-zinc-500 hover:text-white"
                        >
                            <ExternalLink className="w-3 h-3" />
                            <span className="hidden sm:inline">{lang === 'ar' ? 'الموقع' : 'View Site'}</span>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto min-h-0" data-lenis-prevent="true">
                    {children}
                </div>
            </div>
        </div>
    )
}

function NotificationBell({ lang }: { lang: string }) {
    const [notifications, setNotifications] = useState<any[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/admin/notifications')
            if (res.ok) {
                const data = await res.json()
                setNotifications(data)
            }
        } catch (error) {
            console.error("Failed to fetch notifications")
        }
    }

    useEffect(() => {
        fetchNotifications()
        
        // Setup polling interval since real-time websocket might not be configured
        const interval = setInterval(() => {
            fetchNotifications()
        }, 10000) // Poll every 10 seconds
        
        return () => clearInterval(interval)
    }, [])

    const unreadCount = notifications.filter(n => !n.read).length

    const markAllAsRead = async () => {
        try {
            await fetch('/api/admin/notifications', { 
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}) 
            })
            setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        } catch (error) {
            console.error("Failed to mark all as read")
        }
    }

    const handleNotificationClick = async (n: any) => {
        if (!n.read) {
            try {
                await fetch('/api/admin/notifications', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: n.id })
                })
                setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, read: true } : notif))
            } catch (err) {
                console.error("Failed to mark as read")
            }
        }

        setIsOpen(false)

        switch(n.type) {
             case 'ORDER': router.push('/admin/orders'); break;
             case 'REVIEW': router.push('/admin/reviews'); break;
             case 'CUSTOMER': router.push('/admin/customers'); break;
             case 'CONTACT': router.push('/admin/contact-messages'); break;
             case 'SUPPORT': router.push('/admin/tech-support'); break;
             case 'MANAGED_IT': router.push('/admin/managed-it'); break;
             case 'MESSAGE': router.push('/admin/messages'); break;
             case 'SUBSCRIPTION': router.push('/admin/subscriptions'); break;
             default: break;
        }
    }

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg border border-white/5 hover:bg-white/5 transition-all relative"
            >
                <Bell className="w-4 h-4 text-zinc-500" />
                {unreadCount > 0 && (
                    <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0066FF] border border-[#0a0a0a] text-[9px] flex items-center justify-center font-bold">
                        {unreadCount}
                    </div>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className={`absolute top-full ${lang === 'ar' ? 'left-0' : 'right-0'} mt-2 w-80 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden`}
                        >
                            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                <h3 className="font-bold text-sm">{lang === 'ar' ? 'التنبيهات' : 'Notifications'}</h3>
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={markAllAsRead}
                                        className="text-[10px] text-[#0066FF] hover:underline font-bold"
                                    >
                                        {lang === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all as read'}
                                    </button>
                                )}
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-zinc-600 text-xs">
                                        {lang === 'ar' ? 'لا توجد تنبيهات' : 'No notifications'}
                                    </div>
                                ) : (
                                    notifications.map(n => {
                                        const [titleAr, titleEn] = n.title.includes('|') ? n.title.split('|') : [n.title, n.title]
                                        const [msgAr, msgEn] = n.message.includes('|') ? n.message.split('|') : [n.message, n.message]
                                        const displayTitle = lang === 'ar' ? titleAr : titleEn
                                        const displayMsg = lang === 'ar' ? msgAr : msgEn

                                        return (
                                            <div 
                                                key={n.id} 
                                                onClick={() => handleNotificationClick(n)}
                                                className={`p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer ${!n.read ? 'bg-blue-500/5' : ''}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.type === 'ORDER' ? 'bg-emerald-500' : 'bg-[#0066FF]'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${!n.read ? 'text-white' : 'text-zinc-500'}`}>{displayTitle}</p>
                                                        <p className={`text-xs leading-relaxed ${!n.read ? 'text-zinc-200' : 'text-zinc-500'}`}>{displayMsg}</p>
                                                        <p className="text-[8px] text-zinc-600 mt-2 flex items-center gap-1 uppercase font-bold tracking-tighter">
                                                            <Clock className="w-2 h-2" />
                                                            {new Date(n.createdAt).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
