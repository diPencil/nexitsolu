"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n-context"
import { ShoppingBag, Laptop, Monitor, Cpu, HardDrive, ArrowLeft, Heart, Share2, Search, Filter, SlidersHorizontal, Bookmark, Package } from "lucide-react"
import { NexBotAI } from "@/components/nexbot-ai"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { ChevronRight, ChevronLeft } from "lucide-react"

export default function StorePage() {
    const { lang } = useLanguage()
    const { data: session, status } = useSession()
    const router = useRouter()
    const { addItem, totalItems } = useCart()

    const [activeCategory, setActiveCategory] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("default") // 'default' | 'price-low' | 'price-high'
    const [showSort, setShowSort] = useState(false)
    const [dbCategories, setDbCategories] = useState<any[]>([])

    const baseCategories = [
        { id: 'all', name: lang === 'ar' ? 'الكل' : 'All', icon: ShoppingBag },
        { id: 'laptops', name: lang === 'ar' ? 'أجهزة لابتوب' : 'Laptops', icon: Laptop },
        { id: 'monitors', name: lang === 'ar' ? 'شاشات' : 'Monitors', icon: Monitor },
        { id: 'components', name: lang === 'ar' ? 'قطع هاردوير' : 'Components', icon: Cpu },
        { id: 'accessories', name: lang === 'ar' ? 'ملحقات' : 'Accessories', icon: HardDrive },
    ]

    const categories = [
        ...baseCategories,
        ...dbCategories
            .filter((c: any) => !baseCategories.some(b => b.id === c.name))
            .map((c: any) => ({
                id: c.name,
                name: lang === 'ar' ? c.nameAr : c.nameEn,
                icon: Package
            }))
    ]

    const [products, setProducts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const [favorites, setFavorites] = useState<string[]>([])
    const [wishlist, setWishlist] = useState<string[]>([])

    useEffect(() => {
        fetch("/api/products")
            .then(res => res.json())
            .then(data => {
                setProducts(data)
                setIsLoading(false)
            })
            .catch(() => setIsLoading(false))
            
        fetch("/api/admin/categories")
            .then(res => res.json())
            .then(data => setDbCategories(data || []))
            .catch(() => {})

        if (status === "authenticated") {
            fetchFavorites()
            fetchWishlist()
        }
    }, [status])

    const fetchFavorites = async () => {
        try {
            const res = await fetch("/api/favorites")
            if (res.ok) {
                const data = await res.json()
                setFavorites(data.map((f: any) => f.productId))
            }
        } catch (error) {}
    }

    const fetchWishlist = async () => {
        try {
            const res = await fetch("/api/wishlist")
            if (res.ok) {
                const data = await res.json()
                setWishlist(data.map((f: any) => f.productId))
            }
        } catch (error) {}
    }

    const toggleFavorite = async (productId: string) => {
        if (status !== "authenticated") {
            window.location.href = "/login"
            return
        }
        try {
            const res = await fetch("/api/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId })
            })
            if (res.ok) {
                const data = await res.json()
                if (data.status === 'added') {
                    setFavorites(prev => [...prev, productId])
                } else {
                    setFavorites(prev => prev.filter(id => id !== productId))
                }
            }
        } catch (error) {}
    }

    const toggleWishlist = async (productId: string) => {
        if (status !== "authenticated") {
            window.location.href = "/login"
            return
        }
        try {
            const res = await fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId })
            })
            if (res.ok) {
                const data = await res.json()
                if (data.status === 'added') {
                    setWishlist(prev => [...prev, productId])
                } else {
                    setWishlist(prev => prev.filter(id => id !== productId))
                }
            }
        } catch (error) {}
    }

    const handleShare = async (productId: string) => {
        const url = `${window.location.origin}/store/${productId}`
        try {
            await navigator.clipboard.writeText(url)
            toast.success(lang === 'ar' ? 'تم نسخ الرابط الحافظة!' : 'Link copied to clipboard!')
        } catch (err) {
            toast.error(lang === 'ar' ? 'حدث خطأ أثناء النسخ' : 'Failed to copy link')
        }
    }

    const handleBuy = (product: any) => {
        addItem({
            id: product.id,
            name: product.name,
            nameAr: product.nameAr,
            price: product.price,
            discountPrice: product.discountPrice,
            image: product.image,
            stock: product.stock || 99
        })
        router.push('/store/checkout')
    }

    const parsePrice = (p: any) => typeof p === 'string' ? Number(p.replace(/[^0-9.-]+/g, "")) : p

    const translateTag = (tag: string) => {
        if (lang !== 'ar') return tag;
        const tags: Record<string, string> = {
            'NEW': 'جديد',
            'SALE': 'عرض خاص',
            'HOT': 'مميز',
            'OFFER': 'عرض',
            'BEST': 'الأفضل',
            'LIMITED': 'محدود'
        };
        return tags[tag?.toUpperCase()] || tag;
    };

    const filteredProducts = products
        .filter(p => {
            const matchesCat = activeCategory === "all" || p.cat === activeCategory || p.category === activeCategory
            const name = lang === 'ar' ? (p.nameAr || p.name) : p.name
            const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesCat && matchesSearch
        })
        .sort((a, b) => {
            if (sortBy === "price-low") return parsePrice(a.price) - parsePrice(b.price)
            if (sortBy === "price-high") return parsePrice(b.price) - parsePrice(a.price)
            return 0
        })

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-4 md:px-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-white mb-12 transition-colors">
                    <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180 ml-2' : 'mr-2'}`} />
                    {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                </Link>

                {/* Hero Section */}
                <div className="relative rounded-4xl md:rounded-[3rem] bg-zinc-950 border border-white/5 hover:border-[#0066FF]/50 hover:shadow-[0_0_80px_rgba(0,102,255,0.15)] transition-all duration-700 p-8 md:p-16 mb-12 overflow-hidden group">
                    {/* Animated Blur Backgrounds (from NexBot AI style) */}
                    <motion.div
                        animate={{
                            x: [0, 100, 0],
                            y: [0, 30, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-24 -left-24 w-96 h-96 bg-[#0066FF]/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#0066FF]/30 transition-colors duration-700"
                    />
                    <motion.div
                        animate={{
                            x: [0, -100, 0],
                            y: [0, -30, 0],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#0066FF]/15 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#0066FF]/25 transition-colors duration-700"
                    />

                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                        <div className="relative z-10 max-w-2xl">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-[#0066FF]/10 text-[#0066FF] text-xs font-bold tracking-widest uppercase mb-6">
                                {lang === 'ar' ? 'العروض المميزة' : 'Special Offers'}
                            </span>
                            <h1 className="text-4xl md:text-7xl font-medium text-white mb-6 tracking-tight">
                                {lang === 'ar' ? 'متجر نكست للمستلزمات' : 'Nexit Supply Store'}
                            </h1>
                            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-8">
                                {lang === 'ar'
                                    ? 'متجر متكامل لبيع مستلزمات الكمبيوتر والأجهزة التقنية الاحترافية بأعلى جودة وضمان.'
                                    : 'A comprehensive store for professional computer supplies and tech devices with top quality and warranty.'}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                                <span className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    {lang === 'ar' ? 'أجهزة أصلية' : 'Original Hardware'}
                                </span>
                                <span className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    {lang === 'ar' ? 'ضمان معتمد' : 'Certified Warranty'}
                                </span>
                                <span className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    {lang === 'ar' ? 'دعم فني' : 'Technical Support'}
                                </span>
                            </div>
                        </div>

                        {/* Auth / Profile */}
                        <div className="flex flex-col gap-4 z-20 items-center md:items-end w-full md:w-auto">
                            {status === 'authenticated' ? (
                                <div className="flex flex-col items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm min-w-[180px]">
                                    <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#0066FF] to-purple-600 flex items-center justify-center font-bold text-xl text-white">
                                        {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-white">{session?.user?.name}</p>
                                        <p className="text-[10px] text-zinc-500">{session?.user?.email}</p>
                                    </div>
                                    <Link 
                                        href={(session?.user as any)?.role === 'ADMIN' ? '/admin' : '/profile'} 
                                        className="w-full px-4 py-2 rounded-full bg-[#0066FF] text-white text-xs font-bold text-center hover:bg-blue-600 transition-all"
                                    >
                                        {(session?.user as any)?.role === 'ADMIN' 
                                            ? (lang === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard')
                                            : (lang === 'ar' ? 'حسابي' : 'View Profile')
                                        }
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                                        {lang === 'ar' ? 'انضم لمجتمعنا التقني' : 'Join our tech community'}
                                    </p>
                                    <div className="flex gap-3">
                                        <Link href="/login">
                                            <button className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 hover:border-white/20 transition-all text-sm font-medium">
                                                {lang === 'ar' ? 'دخول' : 'Login'}
                                            </button>
                                        </Link>
                                        <Link href="/register">
                                            <button className="px-6 py-2.5 rounded-full bg-[#0066FF] text-white hover:bg-blue-600 transition-all text-sm font-medium shadow-lg shadow-blue-500/25">
                                                {lang === 'ar' ? 'إنشاء حساب' : 'Register'}
                                            </button>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <ShoppingBag className={`absolute bottom-[-20%] ${lang === 'ar' ? 'left-[-5%]' : 'right-[-5%]'} w-[40%] h-[40%] text-zinc-800/20 rotate-12 hidden lg:block`} />
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 w-full">
                    {/* Categories Tabs */}
                    <div className="flex items-center gap-2 md:gap-4 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md w-full lg:w-auto relative">
                        <div id="store-categories-scroll" className="w-full overflow-x-auto flex items-center scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <div className="flex space-x-1 rtl:space-x-reverse min-w-max">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`flex items-center gap-2 rounded-full px-4 md:px-6 py-2.5 text-xs md:text-sm font-medium transition-all ${
                                            activeCategory === cat.id
                                                ? "bg-white/10 text-white border border-white/10 shadow-lg"
                                                : "text-zinc-400 hover:text-white"
                                        }`}
                                    >
                                        <span className="shrink-0">{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-1 md:gap-2 border-s border-white/10 ps-2 md:ps-4 pe-1 md:pe-2 shrink-0">
                            <button 
                                onClick={() => {
                                    const el = document.getElementById('store-categories-scroll')
                                    if(el) el.scrollBy({ left: lang === 'ar' ? 200 : -200, behavior: 'smooth' })
                                }}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                            >
                                <ChevronLeft className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                            </button>
                            <button 
                                onClick={() => {
                                    const el = document.getElementById('store-categories-scroll')
                                    if(el) el.scrollBy({ left: lang === 'ar' ? -200 : 200, behavior: 'smooth' })
                                }}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                            >
                                <ChevronRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-96 relative">
                        <Search className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} w-4 h-4 text-zinc-500`} />
                        <input
                            type="text"
                            placeholder={lang === 'ar' ? 'ابحث عن منتج...' : 'Search products...'}
                            className={`w-full bg-zinc-900 border border-zinc-800 rounded-full py-3 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-sm text-white focus:outline-none focus:border-[#0066FF] transition-colors`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="relative">
                            <button
                                onClick={() => setShowSort(!showSort)}
                                className={`p-3 rounded-full border transition-all ${showSort ? 'bg-[#0066FF] border-[#0066FF] text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                            </button>

                            <AnimatePresence>
                                {showSort && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className={`absolute top-full mt-4 ${lang === 'ar' ? 'left-0' : 'right-0'} w-56 bg-zinc-900 border border-white/5 rounded-2xl p-2 shadow-2xl z-50 overflow-hidden backdrop-blur-xl`}
                                    >
                                        {[
                                            { id: 'default', label: lang === 'ar' ? 'الافتراضي' : 'Default' },
                                            { id: 'price-low', label: lang === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High' },
                                            { id: 'price-high', label: lang === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low' },
                                        ].map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => {
                                                    setSortBy(option.id)
                                                    setShowSort(false)
                                                }}
                                                className={`w-full text-start px-4 py-2.5 rounded-xl text-sm transition-all ${sortBy === option.id ? 'bg-[#0066FF] text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Cart Button */}
                        <Link href="/store/cart" className="relative p-3 rounded-full bg-[#0066FF] text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 shrink-0">
                            <ShoppingBag className="w-4 h-4" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                    <AnimatePresence mode='popLayout'>
                        {filteredProducts.map((product, i) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="group relative bg-[#111111] rounded-2xl md:rounded-4xl overflow-hidden border border-white/5 hover:border-[#0066FF]/30 transition-all duration-500 flex flex-col"
                            >
                                <div className="relative aspect-square w-full overflow-hidden">
                                    <Image
                                        src={product.image || "/placeholder.svg"}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100"
                                    />
                                    <div className={`absolute top-2 md:top-4 ${lang === "ar" ? "right-2 md:right-4" : "left-2 md:left-4"}`}>
                                        <span className="px-2 py-0.5 md:px-3 md:py-1 bg-[#0066FF] rounded-full text-[7px] md:text-[9px] uppercase font-bold text-white shadow-lg">
                                            {translateTag(product.tag || 'NEW')}
                                        </span>
                                    </div>
                                    {/* Action Overlays */}
                                    <div className={`absolute top-2 md:top-4 ${lang === "ar" ? "left-2 md:left-4" : "right-2 md:right-4"} flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300`}>
                                        <button 
                                            onClick={() => toggleFavorite(product.id)}
                                            className={`p-1.5 md:p-2 backdrop-blur-md border rounded-full transition-all ${favorites.includes(product.id) ? 'bg-[#0066FF] border-[#0066FF] text-white' : 'bg-black/40 border-white/10 text-white hover:bg-[#0066FF] hover:border-[#0066FF]'}`}
                                        >
                                            <Heart className={`w-3 h-3 md:w-3.5 md:h-3.5 ${favorites.includes(product.id) ? 'fill-white' : ''}`} />
                                        </button>
                                        <button 
                                            onClick={() => toggleWishlist(product.id)}
                                            className={`p-1.5 md:p-2 backdrop-blur-md border rounded-full transition-all ${wishlist.includes(product.id) ? 'bg-[#0066FF] border-[#0066FF] text-white' : 'bg-black/40 border-white/10 text-white hover:bg-[#0066FF] hover:border-[#0066FF]'}`}
                                        >
                                            <Bookmark className={`w-3 h-3 md:w-3.5 md:h-3.5 ${wishlist.includes(product.id) ? 'fill-white' : ''}`} />
                                        </button>
                                        <button 
                                            onClick={() => handleShare(product.id)}
                                            className="p-1.5 md:p-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-[#0066FF] hover:border-[#0066FF] transition-all"
                                        >
                                            <Share2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div className={`p-3 md:p-5 flex flex-col grow justify-between ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                    <div>
                                        <Link href={`/store/${product.id}`}>
                                            <h3 className="text-sm md:text-base font-medium text-white mb-1 line-clamp-1 hover:text-[#0066FF] transition-colors">
                                                {lang === 'ar' ? (product.nameAr || product.name) : product.name}
                                            </h3>
                                        </Link>
                                        <p className="text-[10px] md:text-xs text-zinc-500 mb-2 line-clamp-2">
                                            {lang === "ar" ? (product.descriptionAr || "هاردوير احترافي مصمم لأقصى أداء.") : (product.description || "Professional hardware designed for extreme performance.")}
                                        </p>
                                    </div>

                                    <div className="flex flex-col mt-auto gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg md:text-xl font-bold text-white tracking-tight">{product.discountPrice || product.price} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                                            {product.discountPrice && (
                                                <span className="text-xs md:text-sm text-zinc-500 line-through">{product.price} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 w-full">
                                            <Link href={`/store/${product.id}`} className="flex-1">
                                                <Button size="sm" variant="outline" className="w-full rounded-full border-zinc-800 h-8 md:h-9 text-[11px] md:text-xs hover:bg-white hover:border-white hover:text-[#0066FF] dark:hover:bg-white dark:hover:text-[#0066FF] transition-all">
                                                    {lang === "ar" ? "عرض" : "View"}
                                                </Button>
                                            </Link>
                                            <Button 
                                                onClick={() => handleBuy(product)}
                                                className="flex-1 w-full rounded-full bg-[#0066FF] h-8 md:h-9 text-[11px] md:text-xs text-white hover:bg-white hover:text-[#0066FF] dark:text-white dark:hover:bg-white dark:hover:text-[#0066FF] transition-all"
                                            >
                                                {lang === "ar" ? "شراء" : "Buy"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* No Results */}
                {filteredProducts.length === 0 && (
                    <div className="py-24 text-center">
                        <ShoppingBag className="w-12 h-12 text-zinc-800 mx-auto mb-6" />
                        <h3 className="text-xl text-white font-medium mb-2">{lang === 'ar' ? 'لم يتم العثور على منتجات' : 'No products found'}</h3>
                        <p className="text-zinc-500">{lang === 'ar' ? 'جرب البحث بكلمات أخرى أو تغيير القسم.' : 'Try searching for something else or change category.'}</p>
                    </div>
                )}
            </div>
            <NexBotAI />
        </div>
    )
}
