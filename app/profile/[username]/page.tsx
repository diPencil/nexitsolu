"use client"

import { useState, useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
    User,
    Package,
    Clock,
    ChevronRight,
    ArrowLeft,
    ArrowRight,
    LogOut,
    ShoppingBag,
    Loader2,
    Building2,
    ShieldCheck,
    Briefcase,
    MessageSquare,
    Headset,
    Key,
    Send,
    Eye,
    EyeOff,
    Heart,
    Search,
    Cpu,
    Truck,
    Bookmark,
    ShieldAlert,
    MapPin,
    Plus,
    LayoutDashboard,
    CheckCheck,
    X,
    FileText,
    DollarSign
} from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { pusherClient } from "@/lib/pusher"
import {
    getSubscriptionServiceLabel,
    type SubscriptionServiceCatalogRow,
} from "@/lib/subscription-services"

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { lang } = useLanguage()
    
    // States
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCompany, setIsCompany] = useState(false)
    const [activeTab, setActiveTab] = useState("dashboard") // Default to dashboard
    const [selectedChat, setSelectedChat] = useState<string | null>(null)
    const [favorites, setFavorites] = useState<any[]>([])
    const [wishlist, setWishlist] = useState<any[]>([])
    const [subscriptions, setSubscriptions] = useState<any[]>([])
    const [subscriptionServiceCatalog, setSubscriptionServiceCatalog] =
        useState<SubscriptionServiceCatalogRow[]>([])
    const [managedRequests, setManagedRequests] = useState<any[]>([])
    const [invoices, setInvoices] = useState<any[]>([])
    const [viewInvoice, setViewInvoice] = useState<any>(null)
    
    // Messaging State
    const [messages, setMessages] = useState<any[]>([])
    const [conversations, setConversations] = useState<any[]>([])
    const [selectedConversation, setSelectedConversation] = useState<any>(null)
    const [newMessage, setNewMessage] = useState("")
    const [isSending, setIsSending] = useState(false)
    const [isClosed, setIsClosed] = useState(false)
    const [closeReason, setCloseReason] = useState<string | null>(null)
    
    // Passwords State
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })
    const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false })
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

    // Tracking State
    const [trackId, setTrackId] = useState("")
    const [trackResult, setTrackResult] = useState<any>(null)
    const [isTracking, setIsTracking] = useState(false)
    const [isProfileComplete, setIsProfileComplete] = useState(true)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
    const [completionData, setCompletionData] = useState({
        whatsapp: "",
        position: "",
        governorate: ""
    })

    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: "smooth"
            })
        }
    }

    useEffect(() => {
        if (activeTab === "messages" && selectedChat) {
            scrollToBottom()
        }
    }, [messages, activeTab, selectedChat])

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        } else if (status === "authenticated") {
            const companyRole = (session?.user as any)?.role === "COMPANY"
            setIsCompany(companyRole)
            setIsCompany(companyRole)

            fetchOrders()
            fetchConversations()
            fetchFavorites()
            fetchWishlist()
            
            if (companyRole) {
                fetchSubscriptions()
                fetchSubscriptionServiceCatalog()
                fetchManagedITRequests()
                fetchInvoices()
            }
            
            const username = (session?.user as any)?.username || session?.user?.name || "user"
            const user = session.user as any;
            const incomplete = companyRole && (!user.whatsapp || !user.position || !user.governorate);
            setIsProfileComplete(!incomplete);
            setCompletionData({
                whatsapp: user.whatsapp || "",
                position: user.position || "",
                governorate: user.governorate || ""
            })

            if (window.location.pathname === '/profile') {
                const cleanSlug = username ? username.toLowerCase().replace(/\s+/g, '-') : ''
                router.replace(`/profile/${encodeURIComponent(cleanSlug)}`)
            }
        }
    }, [status, router, session])

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders")
            const data = await res.json()
            setOrders(data)
        } catch (error) {
            console.error("Failed to load orders")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchConversations = async () => {
        try {
            const res = await fetch("/api/messages/conversations")
            const data = await res.json()
            setConversations(data)
        } catch (error) {
            console.error("Failed to load conversations")
        }
    }

    const fetchMessages = async (conversationId?: string) => {
        try {
            const res = await fetch(`/api/messages${conversationId ? `?conversationId=${conversationId}` : ""}`)
            const data = await res.json()
            setMessages(data)
            
            // If data has messages, check the conversation status from the first one
            if (data.length > 0 && data[0].conversation) {
                setIsClosed(data[0].conversation.status === "CLOSED");
                setCloseReason(data[0].conversation.closedReason);
            } else if (!conversationId) {
                // Default if no messages yet
                setIsClosed(false);
                setCloseReason(null);
            }
        } catch (error) {
            console.error("Failed to load messages")
        }
    }

    const fetchFavorites = async () => {
        try {
            const res = await fetch("/api/favorites")
            if (res.ok) {
                const data = await res.json()
                setFavorites(data)
            }
        } catch (error) {
            console.error("Failed to fetch favorites")
        }
    }

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsUpdatingProfile(true)
        try {
            const res = await fetch("/api/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(completionData)
            })
            if (res.ok) {
                toast.success(lang === 'ar' ? "تم تحديث البيانات بنجاح!" : "Profile updated successfully!")
                setIsProfileComplete(true)
                setShowUpdateModal(false)
                // Refresh session to update UI
                window.location.reload()
            }
        } catch (error) {
            toast.error(lang === 'ar' ? "فشل التحديث" : "Update failed")
        } finally {
            setIsUpdatingProfile(false)
        }
    }

    const governorates = [
        "القاهرة (Cairo)", "الإسكندرية (Alexandria)", "الجيزة (Giza)", "بورسعيد (Port Said)", "السويس (Suez)", "دمياط (Damietta)", 
        "الدقهلية (Dakahlia)", "الشرقية (Sharkia)", "القليوبية (Kaliobia)", "كفر الشيخ (Kafr El Sheikh)", "الغربية (Gharbia)", 
        "المنوفية (Menofia)", "البحيرة (Beheira)", "الإسماعيلية (Ismailia)", "بني سويف (Beni Suef)", "الفيوم (Faiyum)", 
        "المنيا (Minya)", "أسيوط (Asyut)", "سوهاج (Sohag)", "قنا (Qena)", "الأقصر (Luxor)", "أسوان (Aswan)", 
        "الغردقة (Hurghada)", "رأس غارب (Ras Gharib)", "سفاجا (Safaga)", "القصير (El Qusiar)", "مرسى علم (Marsa Alam)", "الشلاتين (Shalateen)", "حلايب (Halaib)", 
        "الوادي الجديد (Wadi El Gedid)", "مطروح (Matrouh)", "شمال سيناء (North Sinai)", 
        "شرم الشيخ (Sharm El Sheikh)", "دهب (Dahab)", "نويبع (Nuweiba)", "طابا (Taba)", "سانت كاترين (Saint Catherine)", "الطور (El Tor)", "رأس سدر (Ras Sedr)"
    ]

    const toggleFavorite = async (productId: string) => {
        try {
            const res = await fetch("/api/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId })
            })
            if (res.ok) {
                fetchFavorites()
            }
        } catch (error) {
            toast.error(lang === 'ar' ? 'حدث خطأ ما' : 'Something went wrong')
        }
    }

    const fetchWishlist = async () => {
        try {
            const res = await fetch("/api/wishlist")
            if (res.ok) {
                const data = await res.json()
                setWishlist(data)
            }
        } catch (error) {
            console.error("Failed to fetch wishlist")
        }
    }

    const fetchSubscriptions = async () => {
        try {
            const res = await fetch("/api/subscriptions")
            if (res.ok) {
                const data = await res.json()
                setSubscriptions(data)
            }
        } catch (error) {
            console.error("Failed to fetch subscriptions")
        }
    }

    const fetchSubscriptionServiceCatalog = async () => {
        try {
            const res = await fetch("/api/subscription-services")
            if (res.ok) {
                const data = await res.json()
                setSubscriptionServiceCatalog(Array.isArray(data) ? data : [])
            }
        } catch {
            console.error("Failed to fetch subscription services")
        }
    }

    const fetchManagedITRequests = async () => {
        try {
            const res = await fetch("/api/managed-it")
            if (res.ok) {
                const data = await res.json()
                setManagedRequests(data)
            }
        } catch (error) {
            console.error("Failed to fetch managed IT requests")
        }
    }

    const fetchInvoices = async () => {
        try {
            const res = await fetch("/api/invoices")
            if (res.ok) {
                const data = await res.json()
                setInvoices(data)
            }
        } catch (error) {
            console.error("Failed to fetch invoices")
        }
    }

    const toggleWishlist = async (productId: string) => {
        try {
            const res = await fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId })
            })
            if (res.ok) {
                fetchWishlist()
            }
        } catch (error) {
            toast.error(lang === 'ar' ? 'حدث خطأ ما' : 'Something went wrong')
        }
    }
    useEffect(() => {
        if (!session?.user) return;
        const userId = (session.user as any).id;
        
        // Polling fallback
        const convInterval = setInterval(() => {
            fetchConversations();
        }, 10000);

        // Listen for new conversations (tickets)
        const userChannel = pusherClient.subscribe(`user-${userId}`);
        userChannel.bind("new-conversation", (data: any) => {
            setConversations(prev => {
                const exists = prev.find(c => c.id === data.conversation.id);
                if (exists) return prev;
                return [data.conversation, ...prev];
            });
        });

        // Listen for message closure globally per user for now, or per conversation
        userChannel.bind("conversation-closed", (data: any) => {
            fetchConversations();
            if (selectedConversation?.id === data.id) {
                setIsClosed(true);
                setCloseReason(data.reason);
            }
        });

        return () => {
            clearInterval(convInterval);
            pusherClient.unsubscribe(`user-${userId}`);
        };
    }, [session, selectedConversation]);

    useEffect(() => {
        if (!selectedConversation) return;

        // Polling fallback for messages
        const msgInterval = setInterval(() => {
            fetchMessages(selectedConversation.id);
        }, 5000);

        const convChannel = pusherClient.subscribe(`conversation-${selectedConversation.id}`);
        convChannel.bind("new-message", (message: any) => {
            setMessages(prev => {
                const exists = prev.find(m => m.id === message.id);
                if (exists) return prev;
                return [message, ...prev];
            });
            // Update the conversation's last message in the list
            setConversations(prev => prev.map(c => 
                c.id === selectedConversation.id 
                ? { ...c, messages: [message] } 
                : c
            ));
        });

        return () => {
            clearInterval(msgInterval);
            pusherClient.unsubscribe(`conversation-${selectedConversation.id}`);
        };
    }, [selectedConversation]);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return
        setIsSending(true)
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newMessage })
            })
            if (res.ok) {
                const msg = await res.json()
                setMessages(prev => [msg, ...prev])
                setNewMessage("")
                
                // If it was a new conversation, refresh the list
                if (!selectedConversation) {
                    fetchConversations()
                    setSelectedConversation(msg.conversation)
                }
            } else {
                toast.error(lang === 'ar' ? 'فشل إرسال الرسالة' : 'Failed to send message')
            }
        } catch (err) {
            toast.error(lang === 'ar' ? 'حدث خطأ' : 'An error occurred')
        } finally {
            setIsSending(false)
        }
    }

    const handleTrackOrder = async (e?: React.FormEvent, manualId?: string) => {
        if (e) e.preventDefault()
        const input = (manualId || trackId).trim();
        if (!input) return
        
        setIsTracking(true)
        setTrackResult(null)
        
        try {
            let cleanId = input.includes('#') ? input.split('#')[1] : (input.toUpperCase().startsWith('ORD-') ? input.replace(/ord-/i, '') : input)
            
            // If it starts with NEX, keep it as is (orderNumber)
            if (input.toUpperCase().startsWith('NEX-')) {
                cleanId = input.toUpperCase();
            }

            const res = await fetch(`/api/orders/track/${cleanId}`)
            if (res.ok) {
                const data = await res.json()
                setTrackResult(data)
            } else {
                toast.error(lang === 'ar' ? 'رقم الطلب غير صحيح' : 'Invalid Order ID')
            }
        } catch (error) {
            toast.error(lang === 'ar' ? 'حدث خطأ في التتبع' : 'Tracking error')
        } finally {
            setIsTracking(false)
        }
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passwords.new !== passwords.confirm) {
            toast.error(lang === 'ar' ? 'كلمات المرور غير متطابقة!' : 'Passwords do not match!')
            return
        }
        setIsUpdatingPassword(true)
        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    currentPassword: passwords.current, 
                    newPassword: passwords.new 
                })
            })
            if (res.ok) {
                toast.success(lang === 'ar' ? 'تم تحديث كلمة المرور بنجاح!' : 'Password updated successfully!')
                setPasswords({ current: "", new: "", confirm: "" })
            } else {
                const errText = await res.text()
                toast.error(errText || (lang === 'ar' ? 'فشل تحديث كلمة المرور' : 'Failed to update password'))
            }
        } catch (err) {
            toast.error(lang === 'ar' ? 'حدث خطأ' : 'An error occurred')
        } finally {
            setIsUpdatingPassword(false)
        }
    }

    if (status === "loading" || (status === "authenticated" && window.location.pathname === '/profile')) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-[#0066FF]" />
        </div>
    )

    return (
        <div
            className="min-h-screen bg-[#050505] pt-20 sm:pt-24 md:pt-28 pb-8 md:pb-10 px-3 sm:px-4 md:px-10 overflow-x-hidden"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
            <div className="max-w-[1600px] mx-auto w-full min-w-0">
                <div className="w-full flex justify-end mb-4"></div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-start mb-12 md:mb-20">
                    {/* Left: User / Company Info & Navigation */}
                    <div className="order-2 md:order-none md:col-span-1 md:sticky md:top-28 w-full min-w-0">
                        <div className="bg-zinc-950 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 text-center relative overflow-hidden group flex flex-col min-h-0 md:min-h-[750px]">
                            <div className="flex-1">
                                <div className="absolute inset-0 bg-[#0066FF]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                <div className="w-24 h-24 rounded-full bg-linear-to-br from-[#0066FF] to-purple-600 mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-500/20">
                                    {isCompany ? (
                                        <Building2 className="w-10 h-10" />
                                    ) : (
                                        session?.user?.name?.[0]?.toUpperCase() || <User className="w-10 h-10" />
                                    )}
                                </div>
                                
                                {isCompany && (
                                    <span className="inline-block px-3 py-1 bg-[#0066FF]/10 text-[#0066FF] text-[10px] font-bold rounded-full mb-3 uppercase tracking-widest">
                                        {lang === 'ar' ? 'حساب شركة' : 'Corporate Account'}
                                    </span>
                                )}
                                
                                <h2 className="text-xl font-bold text-white mb-1">
                                    {isCompany ? (session?.user as any)?.username : session?.user?.name}
                                </h2>
                                <p className="text-zinc-500 text-sm mb-6">{session?.user?.email}</p>

                                {/* Company Menu */}
                                {isCompany && (
                                    <div
                                        className="space-y-1 mb-4 md:mb-6 text-left border-y border-white/10 py-3 md:py-4 max-h-[min(60vh,28rem)] md:max-h-none overflow-y-auto overscroll-contain -mx-1 px-1 md:mx-0 md:px-0 [scrollbar-width:thin]"
                                        dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                    >
                                        <button onClick={() => setActiveTab("dashboard")} className={`w-full transition-all py-2.5 px-4 rounded-xl flex items-center justify-between group/tab ${activeTab === 'dashboard' ? 'bg-[#0066FF]/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <LayoutDashboard className={`w-4 h-4 transition-colors ${activeTab === 'dashboard' ? 'text-[#0066FF]' : 'text-zinc-500 group-hover/tab:text-[#0066FF]'}`} />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'نظرة عامة' : 'Overview'}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''} ${activeTab === 'dashboard' ? 'translate-x-1 opacity-100' : 'opacity-0 shadow-sm'}`} />
                                        </button>
                                        <Link href="/services/managed-it" className="w-full text-zinc-400 hover:text-white hover:bg-[#0066FF]/10 py-2.5 px-4 rounded-xl flex items-center justify-between transition-colors mb-2">
                                            <div className="flex items-center gap-3">
                                                <Building2 className="w-4 h-4 text-[#0066FF]" />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'بوابة الشركات' : 'Corporate Portal'}</span>
                                            </div>
                                            <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? '' : 'rotate-180'}`} />
                                        </Link>
                                        <button onClick={() => setActiveTab("subscriptions")} className={`w-full transition-all py-2.5 px-4 rounded-xl flex items-center justify-between group/tab ${activeTab === 'subscriptions' ? 'bg-[#0066FF]/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <Briefcase className={`w-4 h-4 transition-colors ${activeTab === 'subscriptions' ? 'text-[#0066FF]' : 'text-zinc-500 group-hover/tab:text-[#0066FF]'}`} />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'الاشتراكات' : 'Subscriptions'}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''} ${activeTab === 'subscriptions' ? 'translate-x-1 opacity-100' : 'opacity-0 shadow-sm'}`} />
                                        </button>
                                        <button onClick={() => setActiveTab("contracts")} className={`w-full transition-all py-2.5 px-4 rounded-xl flex items-center justify-between group/tab ${activeTab === 'contracts' ? 'bg-[#0066FF]/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <ShieldCheck className={`w-4 h-4 transition-colors ${activeTab === 'contracts' ? 'text-[#0066FF]' : 'text-zinc-500 group-hover/tab:text-[#0066FF]'}`} />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'العقود والطلبات' : 'Contracts & Requests'}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''} ${activeTab === 'contracts' ? 'translate-x-1 opacity-100' : 'opacity-0 shadow-sm'}`} />
                                        </button>
                                        <button onClick={() => setActiveTab("orders")} className={`w-full transition-all py-2.5 px-4 rounded-xl flex items-center justify-between group/tab ${activeTab === 'orders' ? 'bg-[#0066FF]/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <Package className={`w-4 h-4 transition-colors ${activeTab === 'orders' ? 'text-[#0066FF]' : 'text-zinc-500 group-hover/tab:text-[#0066FF]'}`} />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'الطلبات' : 'Orders'}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''} ${activeTab === 'orders' ? 'translate-x-1 opacity-100' : 'opacity-0 shadow-sm'}`} />
                                        </button>
                                        <button onClick={() => setActiveTab("track")} className={`w-full transition-all py-2.5 px-4 rounded-xl flex items-center justify-between group/tab ${activeTab === 'track' ? 'bg-[#0066FF]/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <Clock className={`w-4 h-4 transition-colors ${activeTab === 'track' ? 'text-[#0066FF]' : 'text-zinc-500 group-hover/tab:text-[#0066FF]'}`} />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'تتبع الطلبات' : 'Track Order'}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''} ${activeTab === 'track' ? 'translate-x-1 opacity-100' : 'opacity-0 shadow-sm'}`} />
                                        </button>
                                        <button onClick={() => setActiveTab("messages")} className={`w-full transition-all py-2.5 px-4 rounded-xl flex items-center justify-between group/tab ${activeTab === 'messages' ? 'bg-[#0066FF]/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <MessageSquare className={`w-4 h-4 transition-colors ${activeTab === 'messages' ? 'text-[#0066FF]' : 'text-zinc-500 group-hover/tab:text-[#0066FF]'}`} />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'الرسائل' : 'Messages'}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''} ${activeTab === 'messages' ? 'translate-x-1 opacity-100' : 'opacity-0 shadow-sm'}`} />
                                        </button>

                                        <button onClick={() => setActiveTab("invoices")} className={`w-full transition-all py-2.5 px-4 rounded-xl flex items-center justify-between group/tab ${activeTab === 'invoices' ? 'bg-[#0066FF]/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <FileText className={`w-4 h-4 transition-colors ${activeTab === 'invoices' ? 'text-[#0066FF]' : 'text-zinc-500 group-hover/tab:text-[#0066FF]'}`} />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'الفواتير' : 'Invoices'}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''} ${activeTab === 'invoices' ? 'translate-x-1 opacity-100' : 'opacity-0 shadow-sm'}`} />
                                        </button>

                                        <button onClick={() => setActiveTab("favorites")} className={`w-full transition-all py-2.5 px-4 rounded-xl flex items-center justify-between group/tab ${activeTab === 'favorites' ? 'bg-[#0066FF]/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <Heart className={`w-4 h-4 transition-colors ${activeTab === 'favorites' ? 'text-[#0066FF]' : 'text-zinc-500 group-hover/tab:text-[#0066FF]'}`} />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'المفضلة' : 'Favorites'}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''} ${activeTab === 'favorites' ? 'translate-x-1 opacity-100' : 'opacity-0 shadow-sm'}`} />
                                        </button>
                                        <button onClick={() => setActiveTab("wishlist")} className={`w-full transition-all py-2.5 px-4 rounded-xl flex items-center justify-between group/tab ${activeTab === 'wishlist' ? 'bg-[#0066FF]/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <Bookmark className={`w-4 h-4 transition-colors ${activeTab === 'wishlist' ? 'text-[#0066FF]' : 'text-zinc-500 group-hover/tab:text-[#0066FF]'}`} />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'قائمة الأماني' : 'Wishlist'}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''} ${activeTab === 'wishlist' ? 'translate-x-1 opacity-100' : 'opacity-0 shadow-sm'}`} />
                                        </button>
                                        <button onClick={() => setActiveTab("settings")} className={`w-full transition-all py-2.5 px-4 rounded-xl flex items-center justify-between group/tab ${activeTab === 'settings' ? 'bg-[#0066FF]/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <Key className={`w-4 h-4 transition-colors ${activeTab === 'settings' ? 'text-[#0066FF]' : 'text-zinc-500 group-hover/tab:text-[#0066FF]'}`} />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'تغيير الباسورد' : 'Change Password'}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''} ${activeTab === 'settings' ? 'translate-x-1 opacity-100' : 'opacity-0 shadow-sm'}`} />
                                        </button>
                                        <button onClick={() => setActiveTab("support")} className={`w-full transition-all py-2.5 px-4 rounded-xl flex items-center justify-between group/tab ${activeTab === 'support' ? 'bg-[#0066FF]/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <Headset className={`w-4 h-4 transition-colors ${activeTab === 'support' ? 'text-[#0066FF]' : 'text-zinc-500 group-hover/tab:text-[#0066FF]'}`} />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'الدعم' : 'Support'}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''} ${activeTab === 'support' ? 'translate-x-1 opacity-100' : 'opacity-0 shadow-sm'}`} />
                                        </button>
                                    </div>
                                )}

                                {/* Regular User Menu */}
                                {!isCompany && (
                                    <div
                                        className="space-y-1 mb-4 md:mb-6 text-left border-y border-white/10 py-3 md:py-4 max-h-[min(60vh,28rem)] md:max-h-none overflow-y-auto overscroll-contain -mx-1 px-1 md:mx-0 md:px-0 [scrollbar-width:thin]"
                                        dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                    >
                                        <button onClick={() => setActiveTab("dashboard")} className={`w-full transition-all py-2.5 px-4 rounded-xl flex items-center justify-between group/tab ${activeTab === 'dashboard' ? 'bg-[#0066FF]/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <LayoutDashboard className={`w-4 h-4 transition-colors ${activeTab === 'dashboard' ? 'text-[#0066FF]' : 'text-zinc-500 group-hover/tab:text-[#0066FF]'}`} />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'نظرة عامة' : 'Overview'}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''} ${activeTab === 'dashboard' ? 'translate-x-1 opacity-100' : 'opacity-0 shadow-sm'}`} />
                                        </button>
                                        <Link href="/store" className="w-full text-zinc-400 hover:text-white hover:bg-[#0066FF]/10 py-2.5 px-4 rounded-xl flex items-center justify-between transition-colors mb-2">
                                            <div className="flex items-center gap-3">
                                                <ShoppingBag className="w-4 h-4 text-[#0066FF]" />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'العودة للمتجر' : 'Back to Store'}</span>
                                            </div>
                                            <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? '' : 'rotate-180'}`} />
                                        </Link>
                                        <button onClick={() => setActiveTab("orders")} className={`w-full transition-all py-2.5 px-4 rounded-xl flex items-center justify-between group/tab ${activeTab === 'orders' ? 'bg-[#0066FF]/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <Package className={`w-4 h-4 transition-colors ${activeTab === 'orders' ? 'text-[#0066FF]' : 'text-zinc-500 group-hover/tab:text-[#0066FF]'}`} />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'طلباتي' : 'My Orders'}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''} ${activeTab === 'orders' ? 'translate-x-1 opacity-100' : 'opacity-0 shadow-sm'}`} />
                                        </button>
                                        <button onClick={() => setActiveTab("track")} className={`w-full transition-all py-2.5 px-4 rounded-xl flex items-center justify-between group/tab ${activeTab === 'track' ? 'bg-[#0066FF]/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <Clock className={`w-4 h-4 transition-colors ${activeTab === 'track' ? 'text-[#0066FF]' : 'text-zinc-500 group-hover/tab:text-[#0066FF]'}`} />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'تتبع الطلبات' : 'Track Order'}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''} ${activeTab === 'track' ? 'translate-x-1 opacity-100' : 'opacity-0 shadow-sm'}`} />
                                        </button>
                                        <button onClick={() => setActiveTab("messages")} className={`w-full transition-all py-2.5 px-4 rounded-xl flex items-center justify-between group/tab ${activeTab === 'messages' ? 'bg-[#0066FF]/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <MessageSquare className={`w-4 h-4 transition-colors ${activeTab === 'messages' ? 'text-[#0066FF]' : 'text-zinc-500 group-hover/tab:text-[#0066FF]'}`} />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'الرسائل' : 'Messages'}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''} ${activeTab === 'messages' ? 'translate-x-1 opacity-100' : 'opacity-0 shadow-sm'}`} />
                                        </button>
                                        <button onClick={() => setActiveTab("favorites")} className={`w-full transition-all py-2.5 px-4 rounded-xl flex items-center justify-between group/tab ${activeTab === 'favorites' ? 'bg-[#0066FF]/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <Heart className={`w-4 h-4 transition-colors ${activeTab === 'favorites' ? 'text-[#0066FF]' : 'text-zinc-500 group-hover/tab:text-[#0066FF]'}`} />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'المفضلة' : 'Favorites'}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''} ${activeTab === 'favorites' ? 'translate-x-1 opacity-100' : 'opacity-0 shadow-sm'}`} />
                                        </button>
                                        <button onClick={() => setActiveTab("wishlist")} className={`w-full transition-all py-2.5 px-4 rounded-xl flex items-center justify-between group/tab ${activeTab === 'wishlist' ? 'bg-[#0066FF]/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <Bookmark className={`w-4 h-4 transition-colors ${activeTab === 'wishlist' ? 'text-[#0066FF]' : 'text-zinc-500 group-hover/tab:text-[#0066FF]'}`} />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'قائمة الأماني' : 'Wishlist'}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''} ${activeTab === 'wishlist' ? 'translate-x-1 opacity-100' : 'opacity-0 shadow-sm'}`} />
                                        </button>
                                        <button onClick={() => setActiveTab("settings")} className={`w-full transition-all py-2.5 px-4 rounded-xl flex items-center justify-between group/tab ${activeTab === 'settings' ? 'bg-[#0066FF]/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <Key className={`w-4 h-4 transition-colors ${activeTab === 'settings' ? 'text-[#0066FF]' : 'text-zinc-500 group-hover/tab:text-[#0066FF]'}`} />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'تغيير الباسورد' : 'Change Password'}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''} ${activeTab === 'settings' ? 'translate-x-1 opacity-100' : 'opacity-0 shadow-sm'}`} />
                                        </button>
                                        <button onClick={() => setActiveTab("support")} className={`w-full transition-all py-2.5 px-4 rounded-xl flex items-center justify-between group/tab ${activeTab === 'support' ? 'bg-[#0066FF]/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <Headset className={`w-4 h-4 transition-colors ${activeTab === 'support' ? 'text-[#0066FF]' : 'text-zinc-500 group-hover/tab:text-[#0066FF]'}`} />
                                                <span className="text-sm font-medium">{lang === 'ar' ? 'الدعم' : 'Support'}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''} ${activeTab === 'support' ? 'translate-x-1 opacity-100' : 'opacity-0 shadow-sm'}`} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-4 space-y-3">
                                {(session?.user as any)?.role === "ADMIN" && (
                                    <Link
                                        href="/admin"
                                        className="relative z-10 w-full py-3 rounded-2xl bg-[#0066FF]/10 border border-[#0066FF]/20 text-sm text-[#0066FF] hover:bg-[#0066FF]/20 transition-all flex items-center justify-center gap-2 font-bold mb-3"
                                    >
                                        <ShieldCheck className="w-4 h-4" />
                                        {lang === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}
                                    </Link>
                                )}

                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="relative z-10 w-full py-4 rounded-2xl bg-zinc-900 border border-white/5 text-sm text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 font-medium"
                                >
                                    <LogOut className="w-4 h-4" />
                                    {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Dynamics Content Area based on Tab */}
                    <div className="order-1 md:order-none md:col-span-3 flex flex-col min-h-0 md:min-h-[600px] w-full min-w-0">
                        
                        {/* Profile Completion Warning */}
                        {isCompany && !isProfileComplete && (
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => setShowUpdateModal(true)}
                                className="mb-6 p-4 sm:p-6 rounded-2xl md:rounded-[2.5rem] bg-red-500/5 border border-red-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 cursor-pointer hover:bg-red-500/10 transition-all group overflow-hidden relative shrink-0"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
                                <div className="flex items-center gap-5 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                                        <ShieldAlert className="w-7 h-7 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="text-white text-lg font-bold mb-1">{lang === 'ar' ? 'أكمل بيانات حسابك' : 'Complete Your Profile'}</h3>
                                        <p className="text-zinc-500 text-sm max-w-md leading-relaxed">
                                            {lang === 'ar' ? 'يرجى إكمال بيانات الشركة (الموقع، التواصل) لنتمكن من متابعة طلبك بشكل أسرع وتقديم أفضل خدمة.' : 'Please complete company details (location, contact) so we can process your request faster.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="relative z-10 px-8 py-3 rounded-full bg-red-500 text-white text-xs font-black uppercase tracking-widest group-hover:scale-105 transition-transform text-center shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                                    {lang === 'ar' ? 'أكمل الآن' : 'Complete Now'}
                                </div>
                            </motion.div>
                        )}
                        {/* 0. Dashboard Tab */}
                        {activeTab === "dashboard" && (
                            <div className="space-y-6">
                                {/* Welcome Card */}
                                <div className="bg-zinc-950 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066FF]/10 rounded-full blur-[80px] group-hover:bg-[#0066FF]/20 transition-all pointer-events-none" />
                                    <div className="relative z-10 text-start">
                                        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 break-words">
                                            {lang === 'ar' ? `أهلاً بك، ${session?.user?.name?.split(' ')[0] || 'مستخدمنا'}` : `Welcome back, ${session?.user?.name?.split(' ')[0] || 'User'}`}
                                        </h1>
                                        <p className="text-zinc-500 max-w-lg leading-relaxed">
                                            {lang === 'ar' ? 'يمكنك من هنا متابعة طلباتك، تتبع الشحن، والخدمات الخاصة بك بكل سهولة.' : 'From here you can monitor your orders, track shipping, and manage your services easily.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div onClick={() => setActiveTab("orders")} className="bg-zinc-950 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-5 sm:p-6 hover:border-[#0066FF]/30 transition-all cursor-pointer group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Package className="w-6 h-6" />
                                            </div>
                                            <span className="text-2xl font-black text-white">{orders.length}</span>
                                        </div>
                                        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</p>
                                    </div>

                                    {isCompany ? (
                                        <>
                                            <div onClick={() => setActiveTab("subscriptions")} className="bg-zinc-950 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-5 sm:p-6 hover:border-[#0066FF]/30 transition-all cursor-pointer group">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-[#0066FF] flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Briefcase className="w-6 h-6" />
                                                    </div>
                                                    <span className="text-2xl font-black text-white">{subscriptions.length}</span>
                                                </div>
                                                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'الاشتراكات' : 'Subscriptions'}</p>
                                            </div>
                                            <div onClick={() => setActiveTab("contracts")} className="bg-zinc-950 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-5 sm:p-6 hover:border-[#0066FF]/30 transition-all cursor-pointer group">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-[#0066FF]/10 text-[#0066FF] flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <ShieldCheck className="w-6 h-6" />
                                                    </div>
                                                    <span className="text-2xl font-black text-white">{managedRequests.length}</span>
                                                </div>
                                                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'العقود والطلبات' : 'Contracts'}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div onClick={() => setActiveTab("messages")} className="bg-zinc-950 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-5 sm:p-6 hover:border-purple-500/30 transition-all cursor-pointer group">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <MessageSquare className="w-6 h-6" />
                                                    </div>
                                                    <span className="text-2xl font-black text-white">{messages.length > 0 ? 1 : 0}</span>
                                                </div>
                                                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'الرسائل' : 'Messages'}</p>
                                            </div>
                                            <div onClick={() => setActiveTab("favorites")} className="bg-zinc-950 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-5 sm:p-6 hover:border-red-500/30 transition-all cursor-pointer group">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Heart className="w-6 h-6" />
                                                    </div>
                                                    <span className="text-2xl font-black text-white">{favorites.length}</span>
                                                </div>
                                                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'المفضلة' : 'Favorites'}</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Recent Activity / Order */}
                                {orders.length > 0 && (
                                    <div className="bg-zinc-950 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 text-start">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                                            <h2 className="text-xl font-bold flex items-center gap-3">
                                                <div className="p-2 rounded-xl bg-[#0066FF]/10">
                                                    <Clock className="w-5 h-5 text-[#0066FF]" />
                                                </div>
                                                {lang === 'ar' ? 'أحدث الطلبات' : 'Latest Orders'}
                                            </h2>
                                            <button onClick={() => setActiveTab("orders")} className="text-[#0066FF] text-[10px] font-black uppercase tracking-widest hover:underline transition-all">
                                                {lang === 'ar' ? 'عرض الكل' : 'View All'}
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {orders.slice(0, 2).map((order: any) => (
                                                <div key={order.id} className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 hover:bg-white/10 transition-colors min-w-0">
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <div className="w-12 h-12 rounded-2xl bg-zinc-900 overflow-hidden shrink-0 border border-white/5">
                                                            {order.items[0]?.product?.images?.[0] ? (
                                                                <img src={order.items[0].product.images[0]} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">?</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                             <p className="font-bold text-white text-sm">#{order.orderNumber || order.id.slice(-6).toUpperCase()}</p>
                                                             <p className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
                                                         </div>
                                                     </div>
                                                     <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6 w-full sm:w-auto shrink-0">
                                                         <div className="text-start sm:text-end sm:hidden">
                                                             <p className="font-black text-[#0066FF]">{order.total} {lang === 'ar' ? 'ج.م' : 'EGP'}</p>
                                                             <span className="text-[9px] px-2 py-0.5 bg-white/5 rounded-full text-zinc-400 font-bold uppercase tracking-widest">{order.status}</span>
                                                         </div>
                                                         <div className="text-end hidden sm:block">
                                                             <p className="font-black text-[#0066FF]">{order.total} {lang === 'ar' ? 'ج.م' : 'EGP'}</p>
                                                             <span className="text-[9px] px-2 py-0.5 bg-white/5 rounded-full text-zinc-400 font-bold uppercase tracking-widest">{order.status}</span>
                                                         </div>
                                                         <button 
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setTrackId(order.orderNumber || order.id);
                                                                 setActiveTab("track");
                                                                 handleTrackOrder(undefined, order.orderNumber || order.id);
                                                             }}
                                                             className="p-2.5 rounded-xl bg-[#0066FF]/10 text-[#0066FF] hover:bg-[#0066FF] hover:text-white transition-all shadow-lg shadow-blue-500/10 group/btn"
                                                             title={lang === 'ar' ? 'تتبع الطلب' : 'Track Order'}
                                                         >
                                                             <Clock className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                                         </button>
                                                     </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* 1. Subscriptions Tab (Company Only) */}
                        {activeTab === "subscriptions" && isCompany && (
                            <div className="bg-zinc-950 border border-[#0066FF]/20 rounded-2xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 relative overflow-hidden h-full min-w-0">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066FF]/5 rounded-full blur-[80px] pointer-events-none" />
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-bold flex items-center gap-3">
                                        <Briefcase className="w-6 h-6 text-[#0066FF]" />
                                        {lang === 'ar' ? 'اشتراكات الإدارة والخطط' : 'Managed Plans & Subscriptions'}
                                    </h2>
                                </div>
                                
                                {subscriptions.length > 0 ? (
                                    <div className="grid gap-4">
                                        {subscriptions.map((sub: any) => (
                                            <div key={sub.id} className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-zinc-900 border ${sub.status === 'ACTIVE' ? 'border-emerald-500/20' : 'border-red-500/20'} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between group hover:border-[#0066FF]/50 transition-all min-w-0`}>
                                                <div className="flex items-center gap-4 min-w-0 text-start">
                                                    <div className={`w-12 h-12 rounded-2xl ${sub.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(239,44,44,0.1)]'} flex items-center justify-center`}>
                                                        <Briefcase className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-lg">{sub.planName}</h4>
                                                        {sub.serviceKey && (
                                                            <p className="text-sm text-[#0066FF] font-semibold mt-0.5">
                                                                {getSubscriptionServiceLabel(
                                                                    sub.serviceKey,
                                                                    lang,
                                                                    subscriptionServiceCatalog
                                                                )}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-zinc-500 text-sm">
                                                                {lang === 'ar' ? `ينتهي في: ${new Date(sub.endDate).toLocaleDateString('ar-EG')}` : `Expires: ${new Date(sub.endDate).toLocaleDateString()}`}
                                                            </p>
                                                            <div className={`w-1 h-1 rounded-full ${sub.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                                            <span className={`text-[10px] font-black uppercase tracking-widest ${sub.status === 'ACTIVE' ? 'text-emerald-500' : 'text-red-500'}`}>
                                                                {sub.status === 'ACTIVE' ? (lang === 'ar' ? 'نشط' : 'ACTIVE') : (lang === 'ar' ? 'منتهي' : 'ENDED')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-start sm:text-end shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t border-white/5 sm:border-0">
                                                    <p className={`text-xl font-black ${sub.status === 'ACTIVE' ? 'text-[#0066FF]' : 'text-zinc-600'}`}>{sub.amount} {lang === 'ar' ? 'ج.م' : 'EGP'}</p>
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${sub.status === 'ACTIVE' ? 'bg-[#0066FF]/10 text-[#0066FF]' : 'bg-red-500/5 text-red-500'}`}>
                                                        {sub.type}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 border-2 border-dashed border-[#0066FF]/10 rounded-3xl bg-[#0066FF]/5">
                                        <Briefcase className="w-12 h-12 text-[#0066FF]/50 mx-auto mb-4" />
                                        <h3 className="text-white font-bold text-lg mb-2">
                                            {lang === 'ar' ? 'لا توجد خطط مفعلة' : 'No Active Plans'}
                                        </h3>
                                        <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                                            {lang === 'ar' ? 'سيقوم المسئول بإضافة خطط مخصصة لشركتك بعد الاتفاق على تفاصيل التعاقد.' : 'Admin will add custom plans for your company after agreement on contract terms.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 1.1 Contracts Tab (Managed IT Requests) */}
                        {activeTab === "contracts" && isCompany && (
                            <div className="bg-zinc-950 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 min-w-0 relative overflow-hidden h-full">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                    <ShieldCheck className="w-6 h-6 text-[#0066FF]" />
                                    {lang === 'ar' ? 'طلبات Managed IT' : 'Managed IT Requests'}
                                </h2>
                                
                                {managedRequests.length > 0 ? (
                                    <div className="grid gap-4">
                                        {managedRequests.map((req: any) => (
                                            <div key={req.id} className="p-6 rounded-3xl bg-zinc-900 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                                        req.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-500' :
                                                        req.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                                                        'bg-[#0066FF]/10 text-[#0066FF]'
                                                    }`}>
                                                        <ShieldCheck className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-lg">{req.model} Support</h4>
                                                        <p className="text-zinc-500 text-sm">
                                                            {lang === 'ar' ? `تاريخ الطلب: ${new Date(req.createdAt).toLocaleDateString('ar-EG')}` : `Date: ${new Date(req.createdAt).toLocaleDateString()}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-white">{req.hours} / {req.days} days</p>
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                                                            req.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-500' :
                                                            req.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                                                            'bg-[#0066FF]/10 text-[#0066FF]'
                                                        }`}>
                                                            {req.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-3xl bg-white/2">
                                        <ShieldCheck className="w-12 h-12 text-[#0066FF]/50 mx-auto mb-4" />
                                        <h3 className="text-white font-bold text-lg mb-2">
                                            {lang === 'ar' ? 'لا يوجد طلبات تعاقد نشطة' : 'No Active Contract Requests'}
                                        </h3>
                                        <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                                            {lang === 'ar' ? 'الطلبات التي ترسلها من صفحة خدمات Managed IT ستظهر هنا لمتابعة حالتها.' : 'Requests you send from the Managed IT services page will appear here to track their status.'}
                                        </p>
                                        <Link href="/services/managed-it" className="mt-6 inline-block px-6 py-2.5 rounded-full bg-[#0066FF] text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-transform hover:scale-105">
                                            {lang === 'ar' ? 'إرسال طلب جديد' : 'Send New Request'}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 2. Orders Tab */}
                        {activeTab === "orders" && (
                            <div className="bg-zinc-950 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 min-w-0 h-full">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                    <ShoppingBag className="w-6 h-6 text-[#0066FF]" />
                                    {lang === 'ar' ? (isCompany ? 'مشتريات الشركة من المتجر' : 'طلباتي السابقة') : (isCompany ? 'Company Store Orders' : 'Order History')}
                                </h2>

                                {isLoading ? (
                                    <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#0066FF]" /></div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                                        <Package className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                                        <p className="text-zinc-500">{lang === 'ar' ? 'ليس لديك أي طلبات بعد.' : "You haven't placed any orders yet."}</p>
                                        <Link href="/store" className="mt-4 inline-block text-[#0066FF] font-bold hover:underline">
                                            {lang === 'ar' ? 'ابدأ التسوق الآن' : 'Start shopping now'}
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order: any) => (
                                            <motion.div
                                                key={order.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-[#0066FF]/30 transition-all cursor-pointer group flex items-center justify-between gap-6"
                                            >
                                                <div className="flex items-center gap-6">
                                                    {/* Product Images */}
                                                    <div className="flex -space-x-4 space-x-reverse overflow-hidden shrink-0">
                                                        {order.items.slice(0, 3).map((item: any, i: number) => (
                                                            <div key={i} className="w-12 h-12 rounded-2xl border-2 border-zinc-950 bg-zinc-900 overflow-hidden shadow-lg" title={item.product.name}>
                                                                {item.product.image ? <img src={item.product.image} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-500">{item.product.name[0]}</div>}
                                                            </div>
                                                        ))}
                                                        {order.items.length > 3 && (
                                                            <div className="w-12 h-12 rounded-2xl border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center text-[10px] text-white font-black">
                                                                +{order.items.length - 3}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Order Info */}
                                                    <div>
                                                         <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black mb-0.5">#{order.orderNumber || order.id.slice(-6).toUpperCase()}</p>
                                                         <p className="font-bold text-white text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                     </div>
                                                </div>

                                                <div className="flex items-center gap-8">
                                                    <div className="text-end hidden sm:block">
                                                        <p className="text-lg font-black text-[#0066FF] leading-tight">{order.total} {lang === 'ar' ? 'ج.م' : 'EGP'}</p>
                                                        <span className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest ${order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setTrackId(order.id);
                                                            setActiveTab("track");
                                                            handleTrackOrder(undefined, order.id);
                                                        }}
                                                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0066FF] text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(0,102,255,0.2)]"
                                                    >
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {lang === 'ar' ? 'تتبع' : 'Track'}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. Messages Tab */}
                        {activeTab === "messages" && (
                            <div className="bg-zinc-950 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-4 sm:p-6 md:p-10 min-h-0 h-[min(100dvh-10rem,850px)] max-h-[min(100dvh-10rem,850px)] md:h-[calc(100vh-180px)] md:min-h-[520px] md:max-h-[850px] flex flex-col overflow-hidden min-w-0">
                                {!selectedChat ? (
                                    <>
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 shrink-0">
                                            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
                                                <div className="p-2 rounded-xl bg-[#0066FF]/10 shrink-0">
                                                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-[#0066FF]" />
                                                </div>
                                                {lang === 'ar' ? 'صندوق الوارد' : 'Inbox'}
                                            </h2>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedConversation(null);
                                                        setSelectedChat("admin");
                                                        setMessages([]);
                                                        setIsClosed(false);
                                                        setCloseReason(null);
                                                    }}
                                                    className="w-full sm:w-auto justify-center px-4 sm:px-5 py-2.5 sm:py-2 rounded-full bg-[#0066FF] hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] sm:hover:scale-105 flex items-center gap-2 shadow-[0_0_20px_rgba(0,102,255,0.2)]"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    {lang === 'ar' ? 'محادثة جديدة' : 'New Chat'}
                                                </button>
                                                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-black hidden sm:inline">{conversations.length} {lang === 'ar' ? 'محادثة' : 'Conversations'}</span>
                                            </div>
                                        </div>
                                        
                                        <div 
                                            className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#0066FF]/40 hover:scrollbar-thumb-[#0066FF]/60 scrollbar-track-transparent overscroll-contain"
                                            data-lenis-prevent
                                        >
                                            {conversations.length === 0 ? (
                                                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/2">
                                                    <MessageSquare className="w-16 h-16 text-zinc-800 mx-auto mb-6 opacity-20" />
                                                    <h3 className="text-white font-bold text-xl mb-2">
                                                        {lang === 'ar' ? 'لا توجد محادثات' : 'No Conversations'}
                                                    </h3>
                                                    <p className="text-zinc-500 mb-8 max-w-xs mx-auto">
                                                        {lang === 'ar' ? 'ابدأ محادثة جديدة مع فريق الدعم للإجابة على استفساراتك.' : 'Start a new conversation with our support team to answer your inquiries.'}
                                                    </p>
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedConversation(null);
                                                            setSelectedChat("admin");
                                                            setMessages([]);
                                                            setIsClosed(false);
                                                            setCloseReason(null);
                                                        }}
                                                        className="px-8 py-3 rounded-full bg-[#0066FF] text-white font-bold hover:scale-105 transition-transform inline-flex items-center gap-2 shadow-lg shadow-blue-500/20"
                                                    >
                                                        <Plus className="w-5 h-5" />
                                                        {lang === 'ar' ? 'ابدأ محادثة الآن' : 'Start Chat Now'}
                                                    </button>
                                                </div>
                                            ) : (
                                                conversations.map((conv: any) => (
                                                    <div 
                                                        key={conv.id}
                                                        onClick={() => {
                                                            setSelectedConversation(conv);
                                                            setSelectedChat("admin");
                                                            fetchMessages(conv.id);
                                                        }}
                                                        className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/5 hover:border-[#0066FF]/30 transition-all cursor-pointer group flex items-center gap-4 sm:gap-6 min-w-0"
                                                    >
                                                        <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500 ${conv.status === 'CLOSED' ? 'bg-zinc-800 text-zinc-500' : 'bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20 group-hover:bg-[#0066FF] group-hover:text-white'}`}>
                                                            {conv.status === 'CLOSED' ? <CheckCheck className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
                                                        </div>
                                                        <div className="flex-1 text-start overflow-hidden">
                                                            <div className="flex items-center justify-between mb-1.5">
                                                                <h3 className="text-white font-bold text-lg group-hover:text-[#0066FF] transition-colors">
                                                                    {lang === 'ar' ? 'تذكرة دعم' : 'Support Ticket'} 
                                                                    <span className="ml-2 text-xs font-black text-[#0066FF]/60">{conv.ticketId}</span>
                                                                </h3>
                                                                <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">
                                                                    {new Date(conv.updatedAt || conv.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-sm text-zinc-400 truncate flex-1 pr-4">
                                                                    {conv.messages?.[0]?.content || (lang === 'ar' ? 'لا توجد رسائل بعد' : 'No messages yet')}
                                                                </p>
                                                                {conv.status === 'CLOSED' && (
                                                                    <span className="text-[9px] px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full font-bold uppercase tracking-widest">
                                                                        {lang === 'ar' ? 'مغلق' : 'Closed'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Chat Header */}
                                        <div className="flex items-center gap-4 mb-6 shrink-0 border-b border-white/5 pb-4">
                                            <button onClick={() => setSelectedChat(null)} className="p-2 bg-zinc-900 hover:bg-[#0066FF]/20 hover:text-[#0066FF] rounded-full text-zinc-400 transition-colors">
                                                <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                                            </button>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#0066FF]/20 text-[#0066FF] flex items-center justify-center">
                                                    <ShieldCheck className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-bold leading-tight">
                                                        {selectedConversation ? (
                                                            <>
                                                                {lang === 'ar' ? 'تذكرة' : 'Ticket'} {selectedConversation.ticketId}
                                                            </>
                                                        ) : (
                                                            lang === 'ar' ? 'محادثة جديدة' : 'New Conversation'
                                                        )}
                                                    </h3>
                                                    <span className="text-[10px] text-green-500">{lang === 'ar' ? 'فريق الدعم متاح' : 'Support Team Available'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div 
                                            ref={scrollContainerRef}
                                            className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-[#0066FF]/40 hover:scrollbar-thumb-[#0066FF]/60 scrollbar-track-transparent mb-6 overscroll-contain"
                                            data-lenis-prevent
                                        >
                                            <div className="flex flex-col-reverse gap-4 px-2">
                                                {messages.map((msg, i) => {
                                                    const isMine = msg.senderId === (session?.user as any)?.id
                                                    return (
                                                        <div key={msg.id || i} className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${isMine ? 'bg-[#0066FF] text-white self-end rounded-tr-sm shadow-blue-500/10' : 'bg-zinc-900 text-zinc-300 self-start border border-white/5 rounded-tl-sm shadow-black/20'}`}>
                                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                            <span className="text-[10px] opacity-60 mt-2 block w-full text-end">
                                                                {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                            </span>
                                                        </div>
                                                    )
                                                })}
                                                <div ref={messagesEndRef} />
                                            </div>
                                        </div>
                                        
                                        {isClosed ? (
                                            <div className="max-w-4xl w-full mx-auto p-8 rounded-3xl bg-zinc-900/50 border border-[#0066FF]/20 text-center space-y-4">
                                                <div className="w-16 h-16 rounded-full bg-[#0066FF]/10 text-[#0066FF] flex items-center justify-center mx-auto">
                                                    <CheckCheck className="w-8 h-8" />
                                                </div>
                                                <h3 className="text-white font-bold text-lg">
                                                    {lang === 'ar' ? 'تم إغلاق المحادثة' : 'Conversation Closed'}
                                                </h3>
                                                <p className="text-zinc-500 text-sm max-w-md mx-auto">
                                                    {lang === 'ar' 
                                                        ? `سبب الإغلاق: ${closeReason === 'resolved' ? 'تم حل المشكلة' : (closeReason === 'phone' ? 'سنتواصل بك هاتفياً' : (closeReason === 'followup' ? 'متابعة لاحقة' : 'أخرى'))}`
                                                        : `Reason: ${closeReason === 'resolved' ? 'Issue Resolved' : (closeReason === 'phone' ? 'Phone Follow-up' : (closeReason === 'followup' ? 'Scheduled Follow-up' : 'Other'))}`}
                                                </p>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedConversation(null);
                                                        setSelectedChat("admin");
                                                        setMessages([]);
                                                        setIsClosed(false);
                                                        setCloseReason(null);
                                                    }}
                                                    className="px-8 py-3 rounded-full bg-[#0066FF] text-white font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                                                >
                                                    {lang === 'ar' ? 'فتح تذكرة جديدة' : 'Open New Ticket'}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="max-w-4xl w-full mx-auto shrink-0 relative mt-auto">
                                                <form onSubmit={handleSendMessage}>
                                                    <input 
                                                        type="text" 
                                                        placeholder={lang === 'ar' ? 'اكتب رسالتك...' : 'Type a message...'}
                                                        required
                                                        value={newMessage}
                                                        onChange={(e)=>setNewMessage(e.target.value)}
                                                        className={`w-full bg-zinc-900 border border-white/10 rounded-full py-4 ${lang === 'ar' ? 'pr-6 pl-14' : 'pl-6 pr-14'} text-white focus:border-[#0066FF] outline-none transition-all placeholder:text-zinc-600 shadow-xl`}
                                                    />
                                                    <button type="submit" disabled={isSending} className={`absolute top-2 ${lang === 'ar' ? 'left-2' : 'right-2'} w-10 h-10 rounded-full bg-[#0066FF] hover:bg-blue-600 flex items-center justify-center text-white transition-colors disabled:opacity-50`}>
                                                        {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''} ml-1`} />}
                                                    </button>
                                                </form>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* 4. Track Order Tab */}
                        {activeTab === "track" && (
                            <div className="bg-zinc-950 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 min-w-0 h-full overflow-y-auto">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-[#0066FF]/10">
                                        <Clock className="w-6 h-6 text-[#0066FF]" />
                                    </div>
                                    {lang === 'ar' ? 'تتبع الطلب' : 'Track Order'}
                                </h2>

                                <div>
                                    <p className="text-sm text-zinc-500 mb-6">
                                        {lang === 'ar' ? 'أدخل رقم الطلب الخاص بك لمتابعة حالة الشحن والتوصيل بشكل مباشر.' : 'Enter your order ID to track shipping and delivery status in real-time.'}
                                    </p>
                                    
                                    <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-3 sm:gap-2 mb-10 w-full min-w-0">
                                        <div className="relative flex-1 min-w-0">
                                            <Search className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-3.5 w-4 h-4 text-zinc-600`} />
                                            <input 
                                                type="text" 
                                                value={trackId}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setTrackId(val);
                                                    if (!val) setTrackResult(null);
                                                }}
                                                placeholder={lang === 'ar' ? 'رقم الطلب (Order ID)' : 'Order ID'}
                                                className={`w-full bg-zinc-900 border border-white/5 rounded-2xl py-3.5 ${lang === 'ar' ? 'pr-12' : 'pl-12'} px-4 text-white focus:border-[#0066FF] outline-none transition-all placeholder:text-zinc-700`}
                                            />
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={isTracking}
                                            className="w-full sm:w-auto shrink-0 px-6 sm:px-8 py-3.5 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold transition-all disabled:opacity-50 hover:scale-[1.02]"
                                        >
                                            {isTracking ? <Loader2 className="w-5 h-5 animate-spin"/> : (lang === 'ar' ? 'بحث' : 'Track')}
                                        </button>
                                    </form>

                                    <AnimatePresence>
                                        {trackResult && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white/2 border border-white/5 rounded-4xl p-8 md:p-10 overflow-hidden relative"
                                            >
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
                                                    <div>
                                                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#0066FF] font-black mb-1 block">Status Found</span>
                                                        <h3 className="text-2xl font-black text-white">Order #{trackResult.id.slice(-6)}</h3>
                                                        <p className="text-zinc-500 text-xs mt-1">{new Date(trackResult.createdAt).toLocaleDateString()} at {new Date(trackResult.createdAt).toLocaleTimeString()}</p>
                                                    </div>
                                                    <div className="px-5 py-2 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/20 text-[#0066FF] font-black text-xs uppercase tracking-widest">
                                                        {trackResult.status}
                                                    </div>
                                                </div>

                                                {/* Tracking Progress Bar */}
                                                <div className="relative pt-8 pb-12 px-2 md:px-0">
                                                    <div className="absolute top-[48px] left-0 right-0 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ 
                                                                width: trackResult.status === 'PENDING' ? '12.5%' : 
                                                                        trackResult.status === 'PROCESSING' ? '37.5%' : 
                                                                        trackResult.status === 'SHIPPED' ? '62.5%' : 
                                                                        trackResult.status === 'DELIVERED' ? '87.5%' : '0%' 
                                                            }}
                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                            className="h-full bg-linear-to-r from-[#0066FF] to-purple-500 shadow-[0_0_20px_rgba(0,102,255,0.5)]"
                                                        />
                                                    </div>

                                                    <div className="flex justify-between relative z-10 gap-1 overflow-x-auto pb-2 sm:pb-0 sm:overflow-visible -mx-1 px-1 [scrollbar-width:thin]">
                                                        {[
                                                            { id: 'PENDING', label: lang === 'ar' ? 'تم الاستلام' : 'Placed', icon: Package },
                                                            { id: 'PROCESSING', label: lang === 'ar' ? 'قيد التجهيز' : 'Processing', icon: Cpu },
                                                            { id: 'SHIPPED', label: lang === 'ar' ? 'تم الشحن' : 'Shipped', icon: Truck },
                                                            { id: 'DELIVERED', label: lang === 'ar' ? 'تم التوصيل' : 'Delivered', icon: ShieldCheck }
                                                        ].map((step, idx) => {
                                                            const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']
                                                            const currentIdx = statuses.indexOf(trackResult.status)
                                                            const stepIdx = statuses.indexOf(step.id)
                                                            const isCompleted = stepIdx <= currentIdx
                                                            const isCurrent = stepIdx === currentIdx

                                                            return (
                                                                <div key={step.id} className="flex flex-col items-center gap-4 flex-1">
                                                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${isCompleted ? 'bg-[#0066FF] border-[#0066FF] text-white shadow-[0_0_20px_rgba(0,102,255,0.3)]' : 'bg-black border-zinc-800 text-zinc-600'}`}>
                                                                        <step.icon className={`w-4 h-4 md:w-5 md:h-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                                                                    </div>
                                                                    <span className={`text-[9px] md:text-[10px] uppercase font-black tracking-widest text-center ${isCompleted ? 'text-white' : 'text-zinc-600'}`}>
                                                                        {step.label}
                                                                    </span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="bg-zinc-900/50 rounded-3xl p-6 border border-white/5">
                                                    <h4 className="text-xs font-black uppercase text-zinc-500 tracking-widest mb-4">Items Overview</h4>
                                                    <div className="space-y-3">
                                                        {trackResult.items.map((item: any, i: number) => (
                                                            <div key={i} className="flex justify-between items-center text-sm">
                                                                <span className="text-zinc-300">{lang === 'ar' ? (item.product.nameAr || item.product.name) : item.product.name} <span className="text-[#0066FF] ml-2">x{item.quantity}</span></span>
                                                                <span className="text-white font-bold">{item.price * item.quantity} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                                                            </div>
                                                        ))}
                                                        <div className="pt-3 mt-3 border-t border-white/5 flex justify-between items-center">
                                                            <span className="text-white font-black uppercase tracking-widest">{lang === 'ar' ? 'المبلغ الإجمالي' : 'Total Amount'}</span>
                                                            <span className="text-xl font-black text-[#0066FF]">{trackResult.total} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}

                        {/* 5. Support Tab */}
                        {activeTab === "support" && (
                            <div className="bg-zinc-950 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 min-w-0 h-full">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                    <Headset className="w-6 h-6 text-[#0066FF]" />
                                    {lang === 'ar' ? 'الدعم الفني للشركات' : 'Corporate Support'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:bg-[#0066FF]/5 hover:border-[#0066FF]/30 transition-all cursor-pointer">
                                        <Headset className="w-10 h-10 text-[#0066FF] mx-auto mb-4" />
                                        <h3 className="text-white font-bold mb-2">{lang === 'ar' ? 'طلب دعم مخصص' : 'Request Dedicated Support'}</h3>
                                        <p className="text-zinc-500 text-sm">{lang === 'ar' ? 'افتح تذكرة دعم فني وسيقوم مهندسونا بمتابعة طلبك' : 'Open a technical support ticket and our engineers will follow up'}</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:bg-[#0066FF]/5 hover:border-[#0066FF]/30 transition-all cursor-pointer" onClick={()=>setActiveTab("messages")}>
                                        <MessageSquare className="w-10 h-10 text-[#0066FF] mx-auto mb-4" />
                                        <h3 className="text-white font-bold mb-2">{lang === 'ar' ? 'تواصل معنا' : 'Chat with Us'}</h3>
                                        <p className="text-zinc-500 text-sm">{lang === 'ar' ? 'محادثة مباشرة مع فريق دعم المنصة' : 'Live chat with our platform support team'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 6. Settings Tab / Change Password */}
                        {activeTab === "settings" && (
                            <div className="bg-zinc-950 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 min-w-0 h-full">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                    <Key className="w-6 h-6 text-[#0066FF]" />
                                    {lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                                </h2>
                                
                                <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-sm text-zinc-400">{lang === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}</label>
                                        <div className="relative">
                                            <input 
                                                type={showPassword.current ? "text" : "password"} 
                                                required
                                                value={passwords.current}
                                                onChange={(e)=>setPasswords({...passwords, current: e.target.value})}
                                                className={`w-full bg-zinc-900 border border-white/10 rounded-xl py-3 ${lang === 'ar' ? 'pr-4 pl-12' : 'pl-4 pr-12'} text-white focus:border-[#0066FF] outline-none transition-all placeholder:text-zinc-700`}
                                            />
                                            <button type="button" onClick={()=>setShowPassword({...showPassword, current: !showPassword.current})} className={`absolute top-3 ${lang === 'ar' ? 'left-4' : 'right-4'} text-zinc-500 hover:text-white`}>
                                                {showPassword.current ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm text-zinc-400">{lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                                        <div className="relative">
                                            <input 
                                                type={showPassword.new ? "text" : "password"} 
                                                required minLength={6}
                                                value={passwords.new}
                                                onChange={(e)=>setPasswords({...passwords, new: e.target.value})}
                                                className={`w-full bg-zinc-900 border border-white/10 rounded-xl py-3 ${lang === 'ar' ? 'pr-4 pl-12' : 'pl-4 pr-12'} text-white focus:border-[#0066FF] outline-none transition-all placeholder:text-zinc-700`}
                                            />
                                            <button type="button" onClick={()=>setShowPassword({...showPassword, new: !showPassword.new})} className={`absolute top-3 ${lang === 'ar' ? 'left-4' : 'right-4'} text-zinc-500 hover:text-white`}>
                                                {showPassword.new ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm text-zinc-400">{lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                                        <div className="relative">
                                            <input 
                                                type={showPassword.confirm ? "text" : "password"} 
                                                required minLength={6}
                                                value={passwords.confirm}
                                                onChange={(e)=>setPasswords({...passwords, confirm: e.target.value})}
                                                className={`w-full bg-zinc-900 border border-white/10 rounded-xl py-3 ${lang === 'ar' ? 'pr-4 pl-12' : 'pl-4 pr-12'} text-white focus:border-[#0066FF] outline-none transition-all placeholder:text-zinc-700`}
                                            />
                                            <button type="button" onClick={()=>setShowPassword({...showPassword, confirm: !showPassword.confirm})} className={`absolute top-3 ${lang === 'ar' ? 'left-4' : 'right-4'} text-zinc-500 hover:text-white`}>
                                                {showPassword.confirm ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                            </button>
                                        </div>
                                    </div>

                                    <button disabled={isUpdatingPassword} type="submit" className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold transition-all disabled:opacity-50 hover:scale-[1.02]">
                                        {isUpdatingPassword ? <Loader2 className="w-5 h-5 animate-spin"/> : (lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* 9. Invoices Tab */}
                        {activeTab === "invoices" && (
                            <div className="bg-zinc-950 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 min-w-0 h-full overflow-y-auto">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-[#0066FF]/10">
                                        <FileText className="w-6 h-6 text-[#0066FF]" />
                                    </div>
                                    {lang === 'ar' ? 'فواتيري' : 'My Invoices'}
                                </h2>

                                {invoices.length === 0 ? (
                                    <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl bg-white/2">
                                        <FileText className="w-16 h-16 text-zinc-800 mx-auto mb-6 opacity-20" />
                                        <h3 className="text-white font-bold text-xl mb-2">{lang === 'ar' ? 'لا توجد فواتير' : 'No Invoices Yet'}</h3>
                                        <p className="text-zinc-500">{lang === 'ar' ? 'سيتم عرض الفواتير المرسلة إليك هنا.' : 'Invoices sent to you will appear here.'}</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {invoices.map((inv) => (
                                            <div key={inv.id} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 hover:border-[#0066FF]/30 transition-all flex flex-col justify-between">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <span className="text-[10px] font-black text-[#0066FF] uppercase tracking-widest block mb-1">Invoice</span>
                                                        <h4 className="text-white font-bold text-lg">#{inv.invoiceNo}</h4>
                                                        <p className="text-zinc-500 text-xs">{new Date(inv.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${inv.status === 'PAID' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                                        {inv.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                                    <div>
                                                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{lang === 'ar' ? 'المبلغ' : 'Amount'}</p>
                                                        <p className="text-xl font-black text-white">{inv.amount} EGP</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => setViewInvoice(inv)}
                                                        className="px-6 py-2.5 rounded-xl bg-[#0066FF] text-white text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                                                    >
                                                        {lang === 'ar' ? 'عرض الفاتورة' : 'View Invoice'}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {/* 7. Favorites Tab */}
                        {activeTab === "favorites" && (
                            <div className="bg-zinc-950 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 min-w-0 h-full overflow-y-auto">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                    <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                                    {lang === 'ar' ? 'المنتجات المفضلة' : 'My Favorites'}
                                </h2>

                                {favorites.length === 0 ? (
                                    <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl bg-white/2">
                                        <Heart className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                                        <h3 className="text-white font-bold text-xl mb-2">{lang === 'ar' ? 'قائمتك فارغة' : 'Your favorites are empty'}</h3>
                                        <p className="text-zinc-500 mb-8">{lang === 'ar' ? 'اضغط على أيقونة القلب في المتجر لإضافة منتجات هنا.' : 'Click the heart icon in the store to add products here.'}</p>
                                        <Link href="/store" className="px-8 py-3 rounded-full bg-[#0066FF] text-white font-bold hover:scale-105 transition-transform inline-block">
                                            {lang === 'ar' ? 'اكتشف المنتجات' : 'Explore Products'}
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {favorites.map((fav: any) => (
                                            <div key={fav.id} className="group relative bg-[#111111] rounded-3xl overflow-hidden border border-white/5 hover:border-[#0066FF]/30 transition-all p-4 flex gap-4">
                                                <Link href={`/store/${fav.product.id}`} className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-900 shrink-0">
                                                    {fav.product.image ? (
                                                        <img src={fav.product.image} alt={fav.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-900">
                                                            <ShoppingBag className="w-8 h-8" />
                                                        </div>
                                                    )}
                                                </Link>
                                                <div className="flex-1 flex flex-col justify-between py-1">
                                                    <div>
                                                        <Link href={`/store/${fav.product.id}`}>
                                                            <h4 className="text-white font-bold group-hover:text-[#0066FF] transition-colors">{lang === 'ar' ? (fav.product.nameAr || fav.product.name) : fav.product.name}</h4>
                                                        </Link>
                                                        <p className="text-[#0066FF] font-black mt-1">${fav.product.price}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Link href={`/store/${fav.product.id}`} className="text-[10px] text-zinc-500 hover:text-white underline uppercase tracking-widest font-bold">
                                                            {lang === 'ar' ? 'عرض' : 'View'}
                                                        </Link>
                                                        <button 
                                                            onClick={() => toggleFavorite(fav.product.id)}
                                                            className="text-[10px] text-red-500/70 hover:text-red-500 underline uppercase tracking-widest font-bold"
                                                        >
                                                            {lang === 'ar' ? 'إزالة' : 'Remove'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 8. Wishlist Tab */}
                        {activeTab === "wishlist" && (
                            <div className="bg-zinc-950 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 min-w-0 h-full overflow-y-auto">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                    <Bookmark className="w-6 h-6 text-[#0066FF]" />
                                    {lang === 'ar' ? 'قائمة الأماني' : 'My Wishlist'}
                                </h2>

                                {wishlist.length === 0 ? (
                                    <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl bg-white/2">
                                        <ShoppingBag className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                                        <h3 className="text-white font-bold text-xl mb-2">{lang === 'ar' ? 'قائمة الأماني فارغة' : 'Your wishlist is empty'}</h3>
                                        <p className="text-zinc-500 mb-8">{lang === 'ar' ? 'اضغط على زر الحقيبة الصغير في المنتج لحفظه هنا.' : 'Click the small bag icon in the product to save it here.'}</p>
                                        <Link href="/store" className="px-8 py-3 rounded-full bg-[#0066FF] text-white font-bold hover:scale-105 transition-transform inline-block">
                                            {lang === 'ar' ? 'اكتشف المنتجات' : 'Explore Products'}
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {wishlist.map((item: any) => (
                                            <div key={item.id} className="group relative bg-[#111111] rounded-3xl overflow-hidden border border-white/5 hover:border-[#0066FF]/30 transition-all p-4 flex gap-4">
                                                <Link href={`/store/${item.product.id}`} className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-900 shrink-0">
                                                    {item.product.image ? (
                                                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-900">
                                                            <ShoppingBag className="w-8 h-8" />
                                                        </div>
                                                    )}
                                                </Link>
                                                <div className="flex-1 flex flex-col justify-between py-1">
                                                    <div>
                                                        <Link href={`/store/${item.product.id}`}>
                                                            <h4 className="text-white font-bold group-hover:text-[#0066FF] transition-colors">{lang === 'ar' ? (item.product.nameAr || item.product.name) : item.product.name}</h4>
                                                        </Link>
                                                        <p className="text-[#0066FF] font-black mt-1">${item.product.price}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Link href={`/store/${item.product.id}`} className="text-[10px] text-zinc-500 hover:text-white underline uppercase tracking-widest font-bold">
                                                            {lang === 'ar' ? 'عرض' : 'View'}
                                                        </Link>
                                                        <button 
                                                            onClick={() => toggleWishlist(item.product.id)}
                                                            className="text-[10px] text-[#0066FF]/70 hover:text-[#0066FF] underline uppercase tracking-widest font-bold"
                                                        >
                                                            {lang === 'ar' ? 'إزالة' : 'Remove'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Profile Completion Modal */}
            <AnimatePresence>
                {showUpdateModal && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowUpdateModal(false)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[3.5rem] p-8 md:p-14 relative z-10 overflow-y-auto max-h-[90vh] shadow-[0_0_150px_rgba(0,102,255,0.2)] scrollbar-hide"
                        >
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#0066FF]/10 text-[#0066FF] mb-6 relative">
                                    <div className="absolute inset-0 bg-[#0066FF]/20 rounded-3xl blur-2xl animate-pulse" />
                                    <Building2 className="w-10 h-10 relative z-10" />
                                </div>
                                <h1 className="text-3xl font-black text-white mb-3">
                                    {lang === 'ar' ? 'بيانات المؤسسة' : 'Company Details'}
                                </h1>
                                <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mx-auto">
                                    {lang === 'ar' ? 'يرجى إكمال الحقول التالية لتفعيل جميع ميزات حسابك ومتابعة طلباتك بكفاءة.' : 'Please fill missing fields to activate all features and track requests efficiently.'}
                                </p>
                            </div>

                            <form onSubmit={updateProfile} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Company Name - ReadOnly */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">{lang === 'ar' ? 'اسم الشركة' : 'Company Name'}</label>
                                        <div className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl py-4 px-6 text-zinc-500 cursor-not-allowed font-medium text-sm">
                                            {(session?.user as any)?.username || (session?.user as any)?.name}
                                        </div>
                                    </div>
                                    {/* Phone - ReadOnly */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">{lang === 'ar' ? 'رقم الهاتف' : 'Contact Phone'}</label>
                                        <div className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl py-4 px-6 text-zinc-500 cursor-not-allowed font-medium text-sm">
                                            {(session?.user as any)?.phone}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 pt-8 border-t border-white/5">
                                    {/* Position */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#0066FF] ml-2">{lang === 'ar' ? 'منصبك الوظيفي' : 'Your Position'} *</label>
                                        <div className="relative group">
                                            <Briefcase className="absolute left-4 top-4 w-5 h-5 text-zinc-600 group-focus-within:text-[#0066FF] transition-colors" />
                                            <input
                                                type="text"
                                                required
                                                placeholder="CEO, IT Manager, etc."
                                                className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white focus:border-[#0066FF] font-medium outline-none transition-all placeholder:text-zinc-700 text-sm"
                                                value={completionData.position}
                                                onChange={(e) => setCompletionData({...completionData, position: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    {/* WhatsApp */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#0066FF] ml-2">{lang === 'ar' ? 'رقم الواتساب' : 'WhatsApp Number'} *</label>
                                        <div className="relative group">
                                            <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-zinc-600 group-focus-within:text-[#0066FF] transition-colors" />
                                            <input
                                                type="tel"
                                                required
                                                placeholder="+20 123..."
                                                className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white focus:border-[#0066FF] font-medium outline-none transition-all placeholder:text-zinc-700 text-sm"
                                                value={completionData.whatsapp}
                                                onChange={(e) => setCompletionData({...completionData, whatsapp: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Governorate */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0066FF] ml-2">{lang === 'ar' ? 'المحافظة' : 'Governorate'} *</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-zinc-600 group-focus-within:text-[#0066FF] transition-colors" />
                                        <select
                                            required
                                            className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white focus:border-[#0066FF] font-medium outline-none transition-all appearance-none cursor-pointer text-sm"
                                            value={completionData.governorate}
                                            onChange={(e) => setCompletionData({...completionData, governorate: e.target.value})}
                                        >
                                            <option value="" disabled className="text-zinc-700">{lang === 'ar' ? 'اختر المحافظة' : 'Select Governorate'}</option>
                                            {governorates.map((gov) => (
                                                <option key={gov} value={gov} className="bg-zinc-900">{gov}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={isUpdatingProfile}
                                        className="w-full h-15 rounded-2xl bg-[#0066FF] hover:bg-white hover:text-black text-white font-black text-lg transition-all group shadow-[0_20px_40px_rgba(0,102,255,0.2)] flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isUpdatingProfile ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                            <>
                                                {lang === 'ar' ? 'تحديث وتفعيل الحساب' : 'Update & Activate Account'}
                                                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${lang === 'ar' ? 'rotate-180' : ''}`} />
                                            </>
                                        )}
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={() => setShowUpdateModal(false)}
                                        className="w-full text-zinc-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors py-6"
                                    >
                                        {lang === 'ar' ? 'تذكيري لاحقاً' : 'Remind me later'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* View Invoice Modal */}
            <AnimatePresence>
                {viewInvoice && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 backdrop-blur-xl bg-black/80" onClick={() => setViewInvoice(null)}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-2xl min-w-0 bg-zinc-950 border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90dvh] flex flex-col"
                        >
                            {/* Digital Invoice Layout */}
                            <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 bg-[#0a0a0a] overflow-y-auto flex-1 invoice-print-area min-w-0">
                                <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-start">
                                    <div>
                                        <div className="mb-8 flex flex-col items-start gap-3">
                                            {/* Nexit Logo */}
                                            <Image 
                                                src="/nexitlogo.png" 
                                                alt="Nexitweb Logo" 
                                                width={160} 
                                                height={50} 
                                                className="object-contain"
                                                priority
                                            />
                                        </div>
                                        <h2 className="text-2xl sm:text-4xl font-black mb-1 tracking-tighter text-white">{lang === 'ar' ? 'فاتورة' : 'INVOICE'}</h2>
                                        <p className="text-[#0066FF] font-mono text-sm tracking-widest">#{viewInvoice.invoiceNo}</p>
                                    </div>
                                    <div className="text-start sm:text-end space-y-1 sm:mt-4">
                                        <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">{lang === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}</p>
                                        <p className="text-sm font-medium border-b border-white/5 pb-2 text-white">{new Date(viewInvoice.createdAt).toLocaleDateString()}</p>
                                        
                                        {viewInvoice.dueDate && (
                                            <div className="pt-2">
                                                <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mt-4">{lang === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}</p>
                                                <p className="text-sm font-medium text-red-500">{new Date(viewInvoice.dueDate).toLocaleDateString()}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 py-6 sm:py-8 border-y border-white/5">
                                    <div>
                                        <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-4">{lang === 'ar' ? 'مقدم من' : 'From'}</p>
                                        <p className="font-bold text-lg text-white">Nexit Solutions</p>
                                        <p className="text-sm text-zinc-400 mt-1">admin@nexitweb.com</p>
                                    </div>
                                    <div className="text-start sm:text-end">
                                        <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-4">{lang === 'ar' ? 'إلى عميل' : 'Bill To'}</p>
                                        <p className="font-bold text-lg text-white">{(session?.user as any)?.username || session?.user?.name}</p>
                                        <p className="text-sm text-zinc-400 mt-1">{session?.user?.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 min-w-0 overflow-x-auto">
                                    <div className="flex justify-between items-center bg-zinc-900/50 p-3 sm:p-4 rounded-xl border border-white/5 text-[10px] uppercase font-bold tracking-widest text-zinc-500 min-w-[320px] sm:min-w-0">
                                        <span className="flex-1 text-start">{lang === 'ar' ? 'الوصف' : 'Description'}</span>
                                        <span className="w-20 text-center">{lang === 'ar' ? 'الكمية' : 'Qty'}</span>
                                        <span className="w-24 text-center">{lang === 'ar' ? 'السعر' : 'Price'}</span>
                                        <span className="w-24 text-end pr-4">{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                                    </div>
                                    <div className="space-y-2">
                                        {viewInvoice.items && Array.isArray(viewInvoice.items) ? (
                                            viewInvoice.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                                    <span className="flex-1 font-bold text-sm text-white text-start">{item.description}</span>
                                                    <span className="w-20 text-center text-sm font-medium text-zinc-400">{item.quantity}</span>
                                                    <span className="w-24 text-center text-sm font-medium text-zinc-400">{item.price}</span>
                                                    <span className="w-24 text-end font-black text-sm text-white pr-4">{(item.quantity * item.price).toFixed(2)}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 text-start">
                                                <span className="flex-1 font-bold text-sm text-white">{lang === 'ar' ? 'منتجات / خدمات برمجية' : 'Software Services / Products'}</span>
                                                <span className="w-24 text-end font-black text-sm text-white pr-4">{Number(viewInvoice.amount).toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Summary calculations */}
                                <div className="flex justify-end pt-6">
                                    <div className="w-full max-w-xs space-y-3 shrink-0">
                                        {viewInvoice.subtotal !== null && viewInvoice.subtotal !== undefined && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-zinc-500 font-medium">{lang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                                                <span className="font-bold text-white">{Number(viewInvoice.subtotal).toFixed(2)} EGP</span>
                                            </div>
                                        )}
                                        {viewInvoice.discount > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-emerald-500 font-medium">{lang === 'ar' ? 'الخصم:' : 'Discount:'}</span>
                                                <span className="font-bold text-emerald-500">- {Number(viewInvoice.discount).toFixed(2)} EGP</span>
                                            </div>
                                        )}
                                        {viewInvoice.tax > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-yellow-500 font-medium">{lang === 'ar' ? 'الضريبة:' : `Tax (${viewInvoice.tax}%):`}</span>
                                                <span className="font-bold text-yellow-500">
                                                    + {viewInvoice.subtotal ? ((Number(viewInvoice.subtotal) * Number(viewInvoice.tax)) / 100).toFixed(2) : 'Included'} EGP
                                                </span>
                                            </div>
                                        )}
                                        
                                        <div className="pt-4 border-t border-white/10 flex justify-between items-center mt-2">
                                            <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{lang === 'ar' ? 'الإجمالي النهائي' : 'Grand Total'}</span>
                                            <span className="text-3xl font-black text-[#0066FF]">{Number(viewInvoice.amount).toFixed(2)} EGP</span>
                                        </div>
                                    </div>
                                </div>

                                {viewInvoice.notes && (
                                    <div className="bg-[#0066FF]/5 border border-[#0066FF]/20 p-5 rounded-xl mt-8">
                                        <p className="text-[10px] text-[#0066FF] font-black mb-2 uppercase tracking-widest flex items-center gap-2">
                                            <FileText className="w-3 h-3" />
                                            {lang === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
                                        </p>
                                        <p className="text-sm text-zinc-300 italic leading-relaxed whitespace-pre-wrap text-start">"{viewInvoice.notes}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-zinc-900/50 border-t border-white/5 flex justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${viewInvoice.status === 'PAID' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                        {viewInvoice.status}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setViewInvoice(null)}
                                        className="px-6 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white transition-all text-sm font-bold"
                                    >
                                        {lang === 'ar' ? 'إغلاق' : 'Close'}
                                    </button>
                                    <button 
                                        onClick={() => window.print()}
                                        className="flex items-center gap-2 bg-[#0066FF] text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        <DollarSign className="w-4 h-4" />
                                        {lang === 'ar' ? 'طباعة / تحميل' : 'Print / Download'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
