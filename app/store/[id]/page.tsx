"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n-context"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ShoppingCart, Heart, Share2, ShieldCheck, Truck, RotateCcw, Loader2, Zap, Plus, Minus, Bookmark, MapPin, ChevronDown, MoreVertical, Star, ShoppingBag, Eye, Banknote, X } from "lucide-react"
import ReviewsSection from '@/components/ReviewsSection';
import { motion } from "framer-motion"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { NexBotAI } from "@/components/nexbot-ai"
import { useCart } from "@/lib/cart-context"
import { CartModal } from "@/components/cart-modal"

// Fallback governorates
const FALLBACK_ZONES = [
    { name: "cairo", nameAr: "القاهرة", nameEn: "Cairo", price: 0 },
    { name: "giza", nameAr: "الجيزة", nameEn: "Giza", price: 0 },
    { name: "alexandria", nameAr: "الإسكندرية", nameEn: "Alexandria", price: 50 },
    { name: "red_sea", nameAr: "البحر الأحمر", nameEn: "Red Sea", price: 100 },
    { name: "hurghada", nameAr: "الغردقة", nameEn: "Hurghada", price: 100 },
    { name: "sharm_el_sheikh", nameAr: "شرم الشيخ", nameEn: "Sharm El-Sheikh", price: 120 },
]

const CATEGORIES_MAP: Record<string, any> = {
    "workstations": { ar: "أجهزة العمل", en: "Workstations" },
    "laptops":      { ar: "لابتوب",       en: "Laptops" },
    "accessories":  { ar: "ملحقات",      en: "Accessories" },
    "networking":   { ar: "شبكات",       en: "Networking" },
    "software":     { ar: "برمجيات",     en: "Software" },
    "pcs":          { ar: "أجهزة كمبيوتر", en: "PCS" }
}

export default function ProductDetailPage() {
    const { lang } = useLanguage()
    const { data: session, status } = useSession()
    const params = useParams()
    const router = useRouter()
    
    const [product, setProduct] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isFavorite, setIsFavorite] = useState(false)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [zones, setZones] = useState<any[]>([])
    const [selectedZone, setSelectedZone] = useState<any>(null)
    const [mainImage, setMainImage] = useState<string>("")
    const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
    const [relatedProducts, setRelatedProducts] = useState<any[]>([])
    const [isRelatedLoading, setIsRelatedLoading] = useState(true)
    const [reviewsCount, setReviewsCount] = useState(0)
    const [averageRating, setAverageRating] = useState(0)
    const [storeCategories, setStoreCategories] = useState<any[]>([])
    const [extraTab, setExtraTab] = useState<"reviews" | "description">("reviews")

    useEffect(() => {
        fetch("/api/categories")
            .then((r) => r.json())
            .then((data) => setStoreCategories(Array.isArray(data) ? data : []))
            .catch(() => setStoreCategories([]))
    }, [])

    useEffect(() => {
        if (product?.image) setMainImage(product.image)
        if (product?.id) {
            fetchRelatedProducts()
            fetchReviews()
        }
    }, [product])

    useEffect(() => {
        if (!product?.id) return
        const has = String(product.longDescription || product.longDescriptionAr || "").trim()
        setExtraTab(has ? "description" : "reviews")
    }, [product?.id, product?.longDescription, product?.longDescriptionAr])

    const scrollToProductExtra = () => {
        requestAnimationFrame(() =>
            document.getElementById("product-extra-section")?.scrollIntoView({ behavior: "smooth", block: "start" })
        )
    }

    useEffect(() => {
        if (!lightboxUrl) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightboxUrl(null)
        }
        document.body.style.overflow = "hidden"
        window.addEventListener("keydown", onKey)
        return () => {
            document.body.style.overflow = ""
            window.removeEventListener("keydown", onKey)
        }
    }, [lightboxUrl])

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?productId=${product.id}`)
            if (res.ok) {
                const data = await res.json()
                setReviewsCount(data.length)
                if (data.length > 0) {
                    const avg = data.reduce((acc: number, r: any) => acc + r.rating, 0) / data.length
                    setAverageRating(Math.round(avg))
                }
            }
        } catch (error) {}
    }

    const fetchRelatedProducts = async () => {
        try {
            const res = await fetch("/api/products")
            if (res.ok) {
                const allProducts = await res.json()
                // 1. Try exact/case-insensitive category match
                let related = allProducts.filter((p: any) => 
                    p.id !== product.id && 
                    p.category?.toLowerCase() === product.category?.toLowerCase()
                )

                // 2. Fallback: If no related by category, just show other products (trending)
                if (related.length === 0) {
                    related = allProducts
                        .filter((p: any) => p.id !== product.id)
                        .sort(() => Math.random() - 0.5)
                }

                // Shuffle and take 4
                const shuffled = related.sort(() => Math.random() - 0.5).slice(0, 4)
                setRelatedProducts(shuffled)
            }
        } catch (error) {
            console.error("Failed to fetch related products", error)
        } finally {
            setIsRelatedLoading(false)
        }
    }

    useEffect(() => {
        // Fetch shipping zones
        fetch("/api/admin/shipping")
            .then(res => res.json())
            .then(data => {
                const activeZones = data.filter((z: any) => z.isActive)
                setZones(activeZones.length > 0 ? activeZones : FALLBACK_ZONES)
                
                // Check if there's a saved zone in localStorage
                const savedZoneName = localStorage.getItem('nexit_shipping_city')
                if (savedZoneName) {
                    const zone = activeZones.find((z: any) => z.name === savedZoneName)
                    if (zone) setSelectedZone(zone)
                }
            })
            .catch(() => setZones(FALLBACK_ZONES))
    }, [])

    useEffect(() => {
        if (!params.id) return

        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${params.id}`)
                if (!res.ok) throw new Error("Product not found")
                const data = await res.json()
                setProduct(data)
                
                // Increment view count immediately after fetching - No trailing slash
                if (data.id) {
                    const statsUrl = `/api/products/${data.id}/stats`;
                    fetch(statsUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ type: "view" })
                    })
                    .then(r => r.json())
                    .then(stats => {
                        if (stats.success) {
                            setProduct((prev: any) => prev ? { ...prev, views: stats.views } : prev);
                        } else {
                            console.warn("View increment failed:", stats.error);
                        }
                    })
                    .catch(e => console.error("Stats update failed:", e));
                }
            } catch (error) {
                toast.error(lang === 'ar' ? 'حدث خطأ في جلب المنتج' : 'Failed to load product')
            } finally {
                setIsLoading(false)
            }
        }

        fetchProduct()
    }, [params.id])

    useEffect(() => {
        if (status === "authenticated" && params.id) {
            checkFavorite()
            checkWishlist()
        }
    }, [status, params.id])

    const checkFavorite = async () => {
        try {
            const res = await fetch("/api/favorites")
            if (res.ok) {
                const data = await res.json()
                if (data.some((f: any) => f.productId === params.id)) {
                    setIsFavorite(true)
                }
            }
        } catch (error) {}
    }

    const checkWishlist = async () => {
        try {
            const res = await fetch("/api/wishlist")
            if (res.ok) {
                const data = await res.json()
                if (data.some((f: any) => f.productId === params.id)) {
                    setIsWishlisted(true)
                }
            }
        } catch (error) {}
    }

    const toggleFavorite = async () => {
        if (status !== "authenticated") {
            router.push("/login")
            return
        }
        try {
            const res = await fetch("/api/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id })
            })
            if (res.ok) {
                const data = await res.json()
                setIsFavorite(data.status === 'added')
                toast.success(data.status === 'added' ? (lang === 'ar' ? 'تمت الإضافة للمفضلة' : 'Added to favorites') : (lang === 'ar' ? 'تم الحذف من المفضلة' : 'Removed from favorites'))
            }
        } catch (error) {}
    }

    const toggleWishlist = async () => {
        if (status !== "authenticated") {
            router.push("/login")
            return
        }
        try {
            const res = await fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id })
            })
            if (res.ok) {
                const data = await res.json()
                setIsWishlisted(data.status === 'added')
                toast.success(data.status === 'added' ? (lang === 'ar' ? 'تمت الإضافة لقائمة الأمنيات' : 'Added to wishlist') : (lang === 'ar' ? 'تم الحذف من قائمة الأمنيات' : 'Removed from wishlist'))
            }
        } catch (error) {}
    }

    const handleShare = async () => {
        const url = window.location.href
        try {
            await navigator.clipboard.writeText(url)
            toast.success(lang === 'ar' ? 'تم نسخ الرابط الحافظة!' : 'Link copied to clipboard!')
            
            // Increment share count
            if (product?.id) {
                fetch(`/api/products/${product.id}/stats`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "share" })
                })
                .then(r => r.json())
                .then(stats => {
                    if (stats.success) {
                        setProduct((prev: any) => prev ? { ...prev, shares: stats.shares } : prev);
                    }
                })
                .catch(e => console.error("Share stats update failed:", e));
            }
        } catch (err) {
            toast.error(lang === 'ar' ? 'حدث خطأ أثناء النسخ' : 'Failed to copy link')
        }
    }

    const { addItem, updateQuantity, items: cartItems } = useCart()
    const [qty, setQty] = useState(1)
    const cartItem = cartItems.find((i: any) => i.id === product?.id)

    const handleAddToCart = () => {
        if (!product) return
        addItem({
            id: product.id,
            name: product.name,
            nameAr: product.nameAr,
            price: product.price,
            discountPrice: product.discountPrice,
            image: product.image,
            stock: product.stock || 99
        }, qty)
        toast.success(lang === 'ar' ? 'تمت إضافة المنتج للسلة' : 'Added to cart!')
    }

    const handleBuyNow = () => {
        if (!product) return
        const buyNowData = encodeURIComponent(JSON.stringify({
            id: product.id,
            name: product.name,
            nameAr: product.nameAr,
            price: product.price,
            discountPrice: product.discountPrice,
            image: product.image,
            stock: product.stock || 99,
            quantity: qty,
            city: selectedZone?.name
        }))
        router.push(`/store/checkout?buyNow=${buyNowData}`)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black pt-32 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#0066FF]" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-black pt-32 text-center text-white">
                <h1 className="text-2xl font-bold">{lang === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}</h1>
                <Link href="/store" className="text-[#0066FF] mt-4 inline-block">{lang === 'ar' ? 'العودة للمتجر' : 'Back to Store'}</Link>
            </div>
        )
    }

    const name = lang === 'ar' ? (product.nameAr || product.name) : product.name
    const description = lang === 'ar' ? (product.descriptionAr || product.description) : product.description

    const categoryTitle = (() => {
        const slug = (product.category || "").toLowerCase()
        const row = storeCategories.find((c: any) => String(c.name).toLowerCase() === slug)
        if (row) return lang === "ar" ? row.nameAr : row.nameEn
        return CATEGORIES_MAP[slug]?.[lang] || product.category
    })()
    const longDescription = (lang === 'ar'
        ? (product.longDescriptionAr || product.longDescription)
        : (product.longDescription || product.longDescriptionAr)
    )?.trim() || ""
    const hasDiscount = !!product.discountPrice

    // Prepare gallery images
    const galleryImages = [
        product.image,
        ...(product.gallery ? product.gallery.split(',').map((img: string) => img.trim()) : [])
    ].filter(Boolean)

    return (
        <>
        <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 md:px-6 text-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto">
                <Link href="/store" className="inline-flex items-center text-zinc-500 hover:text-white mb-8 transition-colors text-sm font-medium">
                    {lang === 'ar' ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
                    {lang === 'ar' ? 'العودة للمتجر' : 'Back to Store'}
                </Link>

                    {/* Main Product Layout */}
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-y-8 lg:gap-x-12 xl:gap-x-20 items-start ${lang === 'ar' ? 'dir-rtl' : 'dir-ltr'}`}>
                        
                        {/* 1. Header Block */}
                        <div className={`flex flex-col space-y-6 lg:col-start-2 lg:row-start-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[#0066FF] font-black text-[10px] uppercase tracking-[0.2em]">
                                        {categoryTitle}
                                    </p>
                                    <div
                                        className="flex items-center gap-4 group cursor-pointer"
                                        onClick={() => {
                                            setExtraTab("reviews")
                                            scrollToProductExtra()
                                        }}
                                    >
                                        <div className="flex bg-yellow-500/10 px-2 py-1 rounded-lg mr-1 items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star key={star} className={`w-2.5 h-2.5 ${star <= averageRating ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-700'}`} />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                                            {lang === 'ar' ? 'التقييمات' : 'Reviews'}
                                            <span className="ml-1 text-[#0066FF]">({reviewsCount})</span>
                                        </span>
                                        <div className="h-4 w-px bg-white/10 hidden sm:block" />
                                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                            <Eye className="w-3 h-3 text-orange-500" />
                                            <span>{product.views || 0} {lang === 'ar' ? 'مشاهدة' : 'Views'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start justify-between gap-8">
                                    <h1 className="text-3xl md:text-5xl font-semibold tracking-tighter leading-tight flex-1">
                                        {name}
                                    </h1>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <button onClick={() => setIsCartOpen(true)} className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:border-[#0066FF] hover:text-[#0066FF] transition-all relative group/cart">
                                            <ShoppingCart className="w-5 h-5" />
                                            {cartItem && <span className="absolute top-3 right-3 w-2 h-2 bg-[#0066FF] rounded-full border-2 border-zinc-900" />}
                                        </button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align={lang === 'ar' ? "start" : "end"} className="w-56 bg-zinc-900 border-white/10 rounded-2xl p-2">
                                                <DropdownMenuItem onClick={toggleFavorite} className={`rounded-xl p-3 flex items-center gap-3 cursor-pointer ${isFavorite ? 'text-red-500 bg-red-500/10' : 'text-zinc-400 hover:text-white'}`}>
                                                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                                                    <span className="font-bold text-sm">{lang === 'ar' ? 'أضف للمفضلة' : 'Add to Favorite'}</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={toggleWishlist} className={`rounded-xl p-3 flex items-center gap-3 cursor-pointer ${isWishlisted ? 'text-blue-500 bg-blue-500/10' : 'text-zinc-400 hover:text-white'}`}>
                                                    <Bookmark className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                                                    <span className="font-bold text-sm">{lang === 'ar' ? 'قائمة الأمنيات' : 'Wishlist'}</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={handleShare} className="rounded-xl p-3 flex items-center gap-3 text-zinc-400 hover:text-white cursor-pointer">
                                                    <Share2 className="w-4 h-4" />
                                                    <span className="font-bold text-sm">{lang === 'ar' ? 'مشاركة المنتج' : 'Share Product'}</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>

                            <div className={`flex items-baseline gap-4 pt-2 ${lang === 'ar' ? 'justify-start' : 'justify-start'}`}>
                                <span className="text-4xl md:text-5xl font-medium text-white tracking-tight">
                                    {(product.discountPrice || product.price) + (selectedZone?.price || 0)} {lang === 'ar' ? 'ج.م' : 'EGP'}
                                </span>
                                {hasDiscount && (
                                    <span className="text-xl text-zinc-600 line-through">
                                        {product.price + (selectedZone?.price || 0)} {lang === 'ar' ? 'ج.م' : 'EGP'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* 2. Images Block */}
                        <div className="space-y-6 lg:col-start-1 lg:row-start-1 lg:row-span-2">
                            <button
                                type="button"
                                onClick={() => {
                                    const u = mainImage || product.image
                                    if (u) setLightboxUrl(u)
                                }}
                                className="relative aspect-square w-full rounded-3xl md:rounded-[2.5rem] bg-zinc-950 border border-white/5 overflow-hidden group text-left p-0 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                                aria-label={lang === 'ar' ? 'عرض الصورة بالحجم الكامل' : 'View full size image'}
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066FF]/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#0066FF]/30 transition-colors duration-700" />
                                <Image
                                    src={mainImage || product.image || "/placeholder.svg"}
                                    alt={name}
                                    fill
                                    className="object-cover p-4 group-hover:scale-105 transition-transform duration-700 relative z-10 pointer-events-none"
                                    priority
                                />
                                <div className={`absolute top-6 ${lang === 'ar' ? 'left-6' : 'right-6'} flex gap-2 z-20 pointer-events-none`}>
                                    <span className="px-4 py-1.5 bg-[#0066FF] rounded-full text-xs font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(0,102,255,0.4)]">
                                        {lang === 'ar' && product.tag === 'NEW' ? 'جديد' : (product.tag || 'NEW')}
                                    </span>
                                    {hasDiscount && (
                                        <span className="px-4 py-1.5 bg-red-500 rounded-full text-xs font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                                            {lang === 'ar' ? 'عرض خاص' : 'SALE'}
                                        </span>
                                    )}
                                </div>
                            </button>

                            {galleryImages.length > 0 && (
                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                    {galleryImages.map((img: string, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => setMainImage(img)}
                                            className={`relative w-24 h-24 rounded-2xl bg-zinc-950 border overflow-hidden shrink-0 transition-all ${mainImage === img ? 'border-[#0066FF] ring-2 ring-[#0066FF]/20 scale-95' : 'border-white/5 opacity-50 hover:opacity-100 hover:border-white/20'}`}
                                        >
                                            <Image src={img} alt={`${name} ${i}`} fill className="object-cover p-2" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 3. Details Block (Description, Features, Buy) */}
                        <div className={`flex flex-col space-y-6 lg:col-start-2 lg:row-start-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                            <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed bg-white/5 p-6 rounded-3xl border border-white/5 w-full">
                                <h3 className="text-white font-bold mb-2 text-sm uppercase tracking-widest">
                                    {lang === 'ar' ? 'الوصف' : 'Description'}
                                </h3>
                                <p>{description || (lang === 'ar' ? 'لا يوجد وصف متاح.' : 'No description available for this product.')}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { icon: ShieldCheck, title: lang === 'ar' ? 'ضمان أصلي' : 'Original Warranty' },
                                    { icon: Truck, title: lang === 'ar' ? 'شحن سريع' : 'Fast Delivery' },
                                    { icon: RotateCcw, title: lang === 'ar' ? 'إرجاع في ١٤ يوم' : '14-Days Return' },
                                ].map((f, i) => (
                                    <div key={i} className={`flex items-center gap-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-900 text-zinc-300 ${lang === 'ar' ? 'flex-row' : ''}`}>
                                        <f.icon className="w-5 h-5 text-[#0066FF]" />
                                        <span className="text-sm font-bold">{f.title}</span>
                                    </div>
                                ))}
                                
                                <div className="relative group/ship">
                                    <div className={`flex items-center gap-3 p-4 rounded-2xl bg-zinc-950 border transition-all ${selectedZone ? 'border-[#0066FF]/50 ring-1 ring-[#0066FF]/20' : 'border-zinc-900'}`}>
                                        <MapPin className={`w-5 h-5 ${selectedZone ? 'text-[#0066FF]' : 'text-zinc-500'}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">
                                                {lang === 'ar' ? 'منطقة الشحن' : 'Shipping Zone'}
                                            </p>
                                            <select 
                                                onChange={(e) => {
                                                    const zone = zones.find(z => z.name === e.target.value)
                                                    setSelectedZone(zone || null)
                                                    if (zone) localStorage.setItem('nexit_shipping_city', zone.name)
                                                    else localStorage.removeItem('nexit_shipping_city')
                                                }}
                                                className={`w-full bg-transparent text-sm font-black text-white focus:outline-none appearance-none cursor-pointer ${lang === 'ar' ? 'pl-4' : 'pr-4'}`}
                                                value={selectedZone?.name || ""}
                                            >
                                                <option value="" className="bg-zinc-950 text-zinc-500">{lang === 'ar' ? 'اختر المحافظة...' : 'Select Governorate...'}</option>
                                                {zones.map(z => (
                                                    <option key={z.name} value={z.name} className="bg-zinc-950 text-white">
                                                        {lang === 'ar' ? z.nameAr : z.nameEn} ({z.price} {lang === 'ar' ? 'ج.م' : 'EGP'})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover/ship:translate-y-0.5 transition-transform" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5 pt-4">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-3 w-3">
                                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                      <span className={`relative inline-flex rounded-full h-3 w-3 ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    </span>
                                    <span className="text-sm font-bold text-zinc-300">
                                        {product.stock > 0 
                                            ? (lang === 'ar' ? `${product.stock} متوفر في المخزن` : `${product.stock} Items in Stock`) 
                                            : (lang === 'ar' ? 'نفذت الكمية' : 'Out of Stock')}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <p className="text-sm font-bold text-zinc-400">{lang === 'ar' ? 'الكمية:' : 'Quantity:'}</p>
                                    <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                                        <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="w-10 text-center text-sm font-bold text-white">{qty}</span>
                                        <button onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))} className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        onClick={handleBuyNow}
                                        disabled={product.stock === 0}
                                        className="flex-1 h-13 rounded-2xl bg-[#0066FF] text-white hover:bg-white hover:text-[#0066FF] dark:text-white dark:hover:bg-white dark:hover:text-[#0066FF] font-black text-base shadow-[0_0_40px_rgba(0,102,255,0.3)] transition-all"
                                    >
                                        <Zap className={`w-5 h-5 ${lang === 'ar' ? 'ml-2' : 'mr-2'}`} fill="currentColor" />
                                        {lang === 'ar' ? 'اشتري الآن' : 'Buy Now'}
                                    </Button>

                                    <Button
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0}
                                        variant="outline"
                                        className="flex-1 h-13 rounded-2xl border-zinc-700 text-white hover:bg-white hover:border-white hover:text-[#0066FF] dark:hover:bg-white dark:hover:text-[#0066FF] font-bold text-base transition-all"
                                    >
                                        <ShoppingCart className={`w-5 h-5 ${lang === 'ar' ? 'ml-2' : 'mr-2'}`} />
                                        {cartItem
                                            ? (lang === 'ar' ? `في السلة (${cartItem.quantity})` : `In Cart (${cartItem.quantity})`)
                                            : (lang === 'ar' ? 'أضف للسلة' : 'Add to Cart')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="mt-16 md:mt-20 max-w-4xl mx-auto space-y-8 scroll-mt-28"
                        id="product-extra-section"
                    >
                        <div
                            className={`flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-white/5 border border-white/10 w-full sm:w-fit ${lang === "ar" ? "sm:mr-auto sm:ms-0" : "sm:mx-auto"}`}
                            role="tablist"
                            aria-label={lang === "ar" ? "الوصف والتقييمات" : "Description and reviews"}
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={extraTab === "description"}
                                onClick={() => {
                                    setExtraTab("description")
                                    scrollToProductExtra()
                                }}
                                className={`rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
                                    extraTab === "description"
                                        ? "bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/25"
                                        : "text-zinc-400 hover:text-white"
                                }`}
                            >
                                {lang === "ar" ? "الوصف الكامل" : "Full description"}
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={extraTab === "reviews"}
                                onClick={() => {
                                    setExtraTab("reviews")
                                    scrollToProductExtra()
                                }}
                                className={`rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
                                    extraTab === "reviews"
                                        ? "bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/25"
                                        : "text-zinc-400 hover:text-white"
                                }`}
                            >
                                {lang === "ar" ? `التقييمات (${reviewsCount})` : `Reviews (${reviewsCount})`}
                            </button>
                        </div>

                        {extraTab === "description" && (
                            <div
                                className={`rounded-3xl border border-white/5 bg-white/3 p-6 md:p-8 ${lang === "ar" ? "text-right" : "text-left"}`}
                                role="tabpanel"
                            >
                                {longDescription ? (
                                    <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                                        {longDescription}
                                    </div>
                                ) : (
                                    <p className="text-zinc-500 text-center py-10 text-sm">
                                        {lang === "ar"
                                            ? "لا يوجد وصف تفصيلي لهذا المنتج بعد."
                                            : "No full description for this product yet."}
                                    </p>
                                )}
                            </div>
                        )}

                        {extraTab === "reviews" && (
                            <div className="scroll-mt-32" id="reviews-section" role="tabpanel">
                                <ReviewsSection productId={product.id} />
                            </div>
                        )}
                    </div>

                    {/* Related Products Section */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-32 pb-20">
                            <div className="flex items-center justify-between mb-8 md:mb-12">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#0066FF]/10 flex items-center justify-center border border-[#0066FF]/20 shrink-0">
                                        <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-[#0066FF]" />
                                    </div>
                                    <h2 className="text-xl md:text-4xl font-black text-white">
                                        {lang === 'ar' ? 'قد يعجبك أيضاً' : 'You Might Also Like'}
                                    </h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                                {relatedProducts.map((p, i) => (
                                    <motion.div
                                        key={p.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="group relative bg-[#0a0a0a] rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 hover:border-[#0066FF]/30 transition-all duration-500 flex flex-col"
                                    >
                                        <Link href={`/store/${p.id}`} className="relative aspect-square w-full overflow-hidden block">
                                            {p.image ? (
                                                <Image 
                                                    src={p.image} 
                                                    alt={p.name} 
                                                    fill 
                                                    className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100" 
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                                                    <ShoppingBag className="w-12 h-12 text-zinc-800" />
                                                </div>
                                            )}
                                            
                                            <div className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'}`}>
                                                <span className="px-3 py-1 bg-[#0066FF] rounded-full text-[10px] uppercase font-bold text-white shadow-lg">
                                                    {(() => {
                                                        const s = (p.category || "").toLowerCase()
                                                        const row = storeCategories.find((c: any) => String(c.name).toLowerCase() === s)
                                                        if (row) return lang === "ar" ? row.nameAr : row.nameEn
                                                        return CATEGORIES_MAP[s]?.[lang] || p.category
                                                    })()}
                                                </span>
                                            </div>

                                            <div className={`absolute top-4 ${lang === "ar" ? "left-4" : "right-4"} flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300`}>
                                                <button className="p-2 backdrop-blur-md border bg-black/40 border-white/10 text-white hover:bg-[#0066FF] hover:border-[#0066FF] rounded-full transition-all">
                                                    <Heart className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-[#0066FF] hover:border-[#0066FF] transition-all">
                                                    <Share2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </Link>

                                        <div className={`p-3 md:p-6 flex flex-col grow justify-between ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                            <div>
                                                <Link href={`/store/${p.id}`}>
                                                    <h3 className="text-sm md:text-base font-bold text-white mb-1 md:mb-2 line-clamp-1 hover:text-[#0066FF] transition-colors">
                                                        {lang === "ar" ? p.nameAr || p.name : p.name}
                                                    </h3>
                                                </Link>
                                                <p className="text-zinc-500 text-[10px] md:text-xs line-clamp-2 mb-2 md:mb-4 h-7 md:h-8">
                                                    {lang === 'ar' ? p.descriptionAr || p.description : p.description}
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-2 md:gap-4">
                                                <div className="flex flex-wrap items-center gap-1 md:gap-3">
                                                    <span className="text-base md:text-xl font-black text-white">
                                                        {p.discountPrice || p.price} {lang === 'ar' ? 'ج.م' : 'EGP'}
                                                    </span>
                                                    {p.discountPrice && (
                                                        <span className="text-[10px] md:text-sm text-zinc-500 line-through font-medium">
                                                            {p.price}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex gap-1 md:gap-2">
                                                    <Link href={`/store/${p.id}`} className="flex-1">
                                                        <Button variant="outline" className="w-full rounded-lg md:rounded-xl border-zinc-800 h-8 md:h-10 text-[8px] md:text-[10px] font-black hover:bg-white hover:border-white hover:text-[#0066FF] transition-all px-0">
                                                            {lang === "ar" ? "عرض" : "VIEW"}
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/store/checkout?buyNow=${encodeURIComponent(JSON.stringify(p))}`} className="flex-1">
                                                        <Button className="w-full rounded-lg md:rounded-xl bg-[#0066FF] h-8 md:h-10 text-[8px] md:text-[10px] font-black hover:bg-white hover:text-[#0066FF] transition-all px-0">
                                                            {lang === "ar" ? "شراء" : "BUY"}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
            </div>
            <NexBotAI />
            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>

        {lightboxUrl && (
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={lang === "ar" ? "صورة المنتج" : "Product image"}
                className="fixed inset-0 z-200 flex items-center justify-center bg-black/90 p-4 md:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                onClick={() => setLightboxUrl(null)}
            >
                <button
                    type="button"
                    className="absolute top-4 inset-e-4 z-10 w-12 h-12 rounded-2xl bg-zinc-900/90 border border-white/10 text-white flex items-center justify-center hover:bg-zinc-800 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation()
                        setLightboxUrl(null)
                    }}
                    aria-label={lang === "ar" ? "إغلاق" : "Close"}
                >
                    <X className="w-6 h-6" />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary product image URLs */}
                <img
                    src={lightboxUrl}
                    alt=""
                    className="max-h-[85vh] max-w-full w-auto object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                />
            </motion.div>
        )}
        </>
    )
}
