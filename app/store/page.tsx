"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n-context"
import { ShoppingBag, ArrowLeft, Heart, Share2, Search, SlidersHorizontal, Bookmark, Package } from "lucide-react"
import { NexBotAI } from "@/components/nexbot-ai"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { ChevronRight, ChevronLeft } from "lucide-react"

export default function StorePage() {
    const { lang, t } = useLanguage()
    const { data: session, status } = useSession()
    const router = useRouter()
    const { addItem, totalItems } = useCart()

    const [activeCategory, setActiveCategory] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("default") // 'default' | 'price-low' | 'price-high'
    const [showSort, setShowSort] = useState(false)
    const [dbCategories, setDbCategories] = useState<any[]>([])
    const storeCategoriesScrollRef = useRef<HTMLDivElement>(null)

    const safeDbCategories = Array.isArray(dbCategories) ? dbCategories : []

    /** LTR scrollport + row-reverse (Arabic) so scrollBy({ left }) is reliable. */
    const scrollCategoryStrip = (el: HTMLDivElement | null, direction: 1 | -1) => {
        if (!el) return
        const amount = Math.min(280, Math.max(120, el.clientWidth * 0.85))
        el.scrollBy({ left: direction * amount, behavior: "smooth" })
    }
    // Only "All" + categories created in Admin — no hardcoded store tabs
    const categories = [
        { id: "all", name: t("store.all_categories"), icon: ShoppingBag },
        ...safeDbCategories.map((c: any) => ({
            id: c.name,
            name: lang === "ar" ? c.nameAr : c.nameEn,
            icon: Package,
        })),
    ]

    const [products, setProducts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const [favorites, setFavorites] = useState<string[]>([])
    const [wishlist, setWishlist] = useState<string[]>([])

    useEffect(() => {
        fetch("/api/products")
            .then(async (res) => {
                const text = await res.text()
                try {
                    const data = JSON.parse(text)
                    setProducts(Array.isArray(data) ? data : [])
                } catch {
                    setProducts([])
                }
            })
            .catch(() => setProducts([]))
            .finally(() => setIsLoading(false))

        fetch("/api/categories")
            .then(async (res) => {
                const text = await res.text()
                try {
                    const data = JSON.parse(text)
                    setDbCategories(Array.isArray(data) ? data : [])
                } catch {
                    setDbCategories([])
                }
            })
            .catch(() => setDbCategories([]))

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
            toast.success(t("store.link_copied"))
        } catch (err) {
            toast.error(t("store.copy_failed"))
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
        const tagKey = tag?.toLowerCase();
        return t(`store.tags.${tagKey}`) || tag;
    };

    const filteredProducts = products
        .filter(p => {
            const pCat = String(p.category || p.cat || "").toLowerCase()
            const matchesCat =
                activeCategory === "all" || pCat === String(activeCategory).toLowerCase()
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
        <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto">
                <Link href="/" className="inline-flex items-center text-muted-foreground/70 hover:text-foreground mb-12 transition-colors">
                    <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180 ml-2' : 'mr-2'}`} />
                    {t("store.back_home")}
                </Link>

                {/* Hero Section */}
                <div className="relative rounded-4xl md:rounded-[3rem] bg-card border border-border hover:border-[#0066FF]/50 hover:shadow-[0_0_80px_rgba(0,102,255,0.15)] transition-all duration-700 p-8 md:p-16 mb-12 overflow-hidden group">
                    {/* Animated Blur Backgrounds (from NexBot AI style) */}
                    <motion.div
                        animate={{
                            x: [0, 100, 0],
                            y: [0, 30, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#0066FF]/30 transition-colors duration-700"
                    />
                    <motion.div
                        animate={{
                            x: [0, -100, 0],
                            y: [0, -30, 0],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/15 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#0066FF]/25 transition-colors duration-700"
                    />

                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                        <div className="relative z-10 max-w-2xl">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-[#0066FF]/10 text-[#0066FF] text-xs font-bold tracking-widest uppercase mb-6">
                                {t("store.special_offers")}
                            </span>
                            <h1 className="text-4xl md:text-7xl font-medium text-foreground mb-6 tracking-tight">
                                {t("store.hero_title")}
                            </h1>
                            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8">
                                {t("store.hero_desc")}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground/70">
                                <span className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    {t("store.original_hardware")}
                                </span>
                                <span className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    {t("store.certified_warranty")}
                                </span>
                                <span className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    {t("store.tech_support")}
                                </span>
                            </div>
                        </div>

                        {/* Auth / Profile */}
                        <div className="flex flex-col gap-4 z-20 items-center md:items-end w-full md:w-auto">
                            {status === 'authenticated' ? (
                                <div className="flex flex-col items-center gap-3 bg-secondary border border-border rounded-2xl p-5 backdrop-blur-sm min-w-[180px]">
                                    <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#0066FF] to-purple-600 flex items-center justify-center font-bold text-xl text-foreground">
                                        {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-foreground">{session?.user?.name}</p>
                                        <p className="text-[10px] text-muted-foreground/70">{session?.user?.email}</p>
                                    </div>
                                    <Link 
                                        href={(session?.user as any)?.role === 'ADMIN' ? '/admin' : '/profile'} 
                                        className="w-full px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold text-center hover:bg-blue-600 transition-all"
                                    >
                                        {(session?.user as any)?.role === 'ADMIN' 
                                            ? t("store.admin_dashboard")
                                            : t("store.view_profile")
                                        }
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <p className="text-muted-foreground/70 text-[10px] font-bold uppercase tracking-widest">
                                        {t("store.join_community")}
                                    </p>
                                    <div className="flex gap-3">
                                        <Link href="/login">
                                            <button className="px-6 py-2.5 rounded-full bg-secondary border border-border text-foreground hover:bg-white/20 hover:border-white/20 transition-all text-sm font-medium">
                                                {t("store.login")}
                                            </button>
                                        </Link>
                                        <Link href="/register">
                                            <button className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-blue-600 transition-all text-sm font-medium shadow-lg shadow-blue-500/25">
                                                {t("store.register")}
                                            </button>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <ShoppingBag className={`absolute bottom-[-20%] ${lang === 'ar' ? 'left-[-5%]' : 'right-[-5%]'} w-[40%] h-[40%] text-foreground/50/20 rotate-12 hidden lg:block`} />
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 w-full">
                    {/* Categories Tabs */}
                    <div className="flex items-center gap-2 md:gap-4 bg-secondary p-1 rounded-full border border-border backdrop-blur-md w-full lg:w-auto relative">
                        <div
                            ref={storeCategoriesScrollRef}
                            className="w-full overflow-x-auto flex items-center scroll-smooth [direction:ltr] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        >
                            <div className={`flex gap-1 min-w-max ${lang === "ar" ? "flex-row-reverse" : "flex-row"}`}>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`flex items-center gap-2 rounded-full px-4 md:px-6 py-2.5 text-xs md:text-sm font-medium transition-all ${
                                            activeCategory === cat.id
                                                ? "bg-muted text-foreground border border-border shadow-lg"
                                                : "text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        <span className="shrink-0">{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-1 md:gap-2 border-s border-border ps-2 md:ps-4 pe-1 md:pe-2 shrink-0">
                            <button
                                type="button"
                                aria-label={t("store.scroll_categories")}
                                onClick={() => scrollCategoryStrip(storeCategoriesScrollRef.current, lang === "ar" ? 1 : -1)}
                                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <ChevronLeft className={`w-5 h-5 ${lang === "ar" ? "rotate-180" : ""}`} />
                            </button>
                            <button
                                type="button"
                                aria-label={t("store.scroll_categories")}
                                onClick={() => scrollCategoryStrip(storeCategoriesScrollRef.current, lang === "ar" ? -1 : 1)}
                                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <ChevronRight className={`w-5 h-5 ${lang === "ar" ? "rotate-180" : ""}`} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-96 relative">
                        <Search className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} w-4 h-4 text-muted-foreground/70`} />
                        <input
                            type="text"
                            placeholder={t("store.search_placeholder")}
                            className={`w-full bg-card border border-border rounded-full py-3 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-sm text-foreground focus:outline-none focus:border-[#0066FF] transition-colors`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="relative">
                            <button
                                onClick={() => setShowSort(!showSort)}
                                className={`p-3 rounded-full border transition-all ${showSort ? 'bg-[#0066FF] border-primary text-primary-foreground' : 'bg-card border-border text-muted-foreground hover:text-foreground'}`}
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                            </button>

                            <AnimatePresence>
                                {showSort && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className={`absolute top-full mt-4 ${lang === 'ar' ? 'left-0' : 'right-0'} w-56 bg-card border border-border rounded-2xl p-2 shadow-2xl z-50 overflow-hidden backdrop-blur-xl`}
                                    >
                                        {[
                                            { id: 'default', label: t("store.sorting.default") },
                                            { id: 'price-low', label: t("store.sorting.price_low") },
                                            { id: 'price-high', label: t("store.sorting.price_high") },
                                        ].map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => {
                                                    setSortBy(option.id)
                                                    setShowSort(false)
                                                }}
                                                className={`w-full text-start px-4 py-2.5 rounded-xl text-sm transition-all ${sortBy === option.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Cart Button */}
                        <Link href="/store/cart" className="relative p-3 rounded-full bg-primary text-primary-foreground hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 shrink-0">
                            <ShoppingBag className="w-4 h-4" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-foreground text-[10px] font-black flex items-center justify-center shadow-lg">
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
                                className="group relative bg-card rounded-2xl md:rounded-4xl overflow-hidden border border-border hover:border-[#0066FF]/30 transition-all duration-500 flex flex-col"
                            >
                                <div className="relative aspect-square w-full overflow-hidden">
                                    <Image
                                        src={product.image || "/placeholder.svg"}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100"
                                    />
                                    <div className={`absolute top-2 md:top-4 ${lang === "ar" ? "right-2 md:right-4" : "left-2 md:left-4"}`}>
                                        <span className="px-2 py-0.5 md:px-3 md:py-1 bg-[#0066FF] rounded-full text-[7px] md:text-[9px] uppercase font-bold text-foreground shadow-lg">
                                            {translateTag(product.tag || 'NEW')}
                                        </span>
                                    </div>
                                    {/* Action Overlays */}
                                    <div className={`absolute top-2 md:top-4 ${lang === "ar" ? "left-2 md:left-4" : "right-2 md:right-4"} flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-y-0 transition-all duration-300`}>
                                        <button 
                                            onClick={() => toggleFavorite(product.id)}
                                            className={`p-1.5 md:p-2 backdrop-blur-md border rounded-full transition-all ${favorites.includes(product.id) ? 'bg-[#0066FF] border-primary text-primary-foreground' : 'bg-card/80 border-border text-foreground hover:bg-[#0066FF] hover:border-[#0066FF]'}`}
                                        >
                                            <Heart className={`w-3 h-3 md:w-3.5 md:h-3.5 ${favorites.includes(product.id) ? 'fill-white' : ''}`} />
                                        </button>
                                        <button 
                                            onClick={() => toggleWishlist(product.id)}
                                            className={`p-1.5 md:p-2 backdrop-blur-md border rounded-full transition-all ${wishlist.includes(product.id) ? 'bg-[#0066FF] border-primary text-primary-foreground' : 'bg-card/80 border-border text-foreground hover:bg-[#0066FF] hover:border-[#0066FF]'}`}
                                        >
                                            <Bookmark className={`w-3 h-3 md:w-3.5 md:h-3.5 ${wishlist.includes(product.id) ? 'fill-white' : ''}`} />
                                        </button>
                                        <button 
                                            onClick={() => handleShare(product.id)}
                                            className="p-1.5 md:p-2 bg-card/80 backdrop-blur-md border border-border rounded-full text-foreground hover:bg-[#0066FF] hover:border-[#0066FF] transition-all"
                                        >
                                            <Share2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div className={`p-3 md:p-5 flex flex-col grow justify-between ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                    <div>
                                        <Link href={`/store/${product.id}`}>
                                            <h3 className="text-sm md:text-base font-medium text-foreground mb-1 line-clamp-1 hover:text-[#0066FF] transition-colors">
                                                {lang === 'ar' ? (product.nameAr || product.name) : product.name}
                                            </h3>
                                        </Link>
                                        <p className="text-[10px] md:text-xs text-muted-foreground/70 mb-2 line-clamp-2">
                                            {lang === "ar" ? (product.descriptionAr || t("store.description_placeholder")) : (product.description || t("store.description_placeholder"))}
                                        </p>
                                    </div>

                                    <div className="flex flex-col mt-auto gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg md:text-xl font-bold text-foreground tracking-tight">{product.discountPrice || product.price} {t("store.currency")}</span>
                                            {product.discountPrice && (
                                                <span className="text-xs md:text-sm text-muted-foreground/70 line-through">{product.price} {t("store.currency")}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 w-full">
                                            <Link href={`/store/${product.id}`} className="flex-1">
                                                <Button size="sm" variant="outline" className="w-full rounded-full border-border h-8 md:h-9 text-[11px] md:text-xs hover:bg-white hover:border-white hover:text-[#0066FF] dark:hover:bg-white dark:hover:text-[#0066FF] transition-all">
                                                    {t("store.view_product")}
                                                </Button>
                                            </Link>
                                            <button 
                                                onClick={() => handleBuy(product)}
                                                className="flex-1 w-full rounded-full bg-[#0066FF] h-8 md:h-9 text-[11px] md:text-xs text-foreground hover:bg-white hover:text-[#0066FF] dark:text-foreground dark:hover:bg-white dark:hover:text-[#0066FF] transition-all"
                                            >
                                                {t("store.buy_now")}
                                            </button>
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
                        <ShoppingBag className="w-12 h-12 text-foreground/50 mx-auto mb-6" />
                        <h3 className="text-xl text-foreground font-medium mb-2">{t("store.no_products")}</h3>
                        <p className="text-muted-foreground/70">{t("store.no_products_desc")}</p>
                    </div>
                )}
            </div>
            <NexBotAI />
        </div>
    )
}
