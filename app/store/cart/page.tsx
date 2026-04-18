"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n-context"
import { useSession } from "next-auth/react"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart, ShieldCheck, Truck, CreditCard, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { NexBotAI } from "@/components/nexbot-ai"

export default function CartPage() {
    const { lang } = useLanguage()
    const { data: session, status } = useSession()
    const router = useRouter()
    const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart()
    const [isCheckingOut, setIsCheckingOut] = useState(false)

    const handleCheckout = async () => {
        if (status !== "authenticated") {
            router.push("/login")
            return
        }

        if (items.length === 0) {
            toast.error(lang === 'ar' ? 'السلة فارغة' : 'Cart is empty')
            return
        }

        setIsCheckingOut(true)
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.discountPrice || item.price
                    })),
                    total: totalPrice
                })
            })

            if (res.ok) {
                const order = await res.json()
                clearCart()
                toast.success(lang === 'ar' ? `تم إنشاء الطلب بنجاح! رقم الطلب: ${order.orderNumber}` : `Order placed successfully! Order #${order.orderNumber}`)
                router.push("/profile")
            } else {
                const err = await res.json()
                toast.error(err.error || (lang === 'ar' ? 'حدث خطأ أثناء إنشاء الطلب' : 'Failed to place order'))
            }
        } catch (error) {
            toast.error(lang === 'ar' ? 'حدث خطأ في الاتصال' : 'Connection error')
        } finally {
            setIsCheckingOut(false)
        }
    }

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-6 font-sans text-foreground" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="max-w-6xl mx-auto">
                <Link href="/store" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors text-sm font-medium">
                    {lang === 'ar' ? <ArrowLeft className="w-4 h-4 rotate-0 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
                    {lang === 'ar' ? 'العودة للمتجر' : 'Back to Store'}
                </Link>

                <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-[#0066FF]/10 flex items-center justify-center">
                        <ShoppingCart className="w-7 h-7 text-[#0066FF]" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                            {lang === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
                        </h1>
                        <p className="text-muted-foreground text-sm mt-0.5">
                            {totalItems} {lang === 'ar' ? 'منتج' : totalItems === 1 ? 'item' : 'items'}
                        </p>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-32">
                        <div className="w-24 h-24 rounded-3xl bg-secondary border border-border flex items-center justify-center mx-auto mb-6">
                            <ShoppingCart className="w-10 h-10 text-muted-foreground/80" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">
                            {lang === 'ar' ? 'سلتك فارغة' : 'Your cart is empty'}
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            {lang === 'ar' ? 'أضف بعض المنتجات لبدء التسوق' : 'Add some products to start shopping'}
                        </p>
                        <Link href="/store">
                            <Button className="rounded-full bg-[#0066FF] hover:bg-blue-600 px-8 py-3 font-bold">
                                {lang === 'ar' ? 'تصفح المتجر' : 'Browse Store'}
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => {
                                const itemPrice = item.discountPrice || item.price
                                const name = lang === 'ar' ? (item.nameAr || item.name) : item.name
                                return (
                                    <div key={item.id} className="flex gap-4 md:gap-6 p-4 md:p-6 rounded-3xl bg-card border border-border hover:border-border/60 transition-all group">
                                        {/* Image */}
                                        <Link href={`/store/${item.id}`} className="shrink-0">
                                            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-secondary overflow-hidden">
                                                <Image
                                                    src={item.image || "/placeholder.svg"}
                                                    alt={name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                        </Link>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <Link href={`/store/${item.id}`}>
                                                    <h3 className="font-medium text-foreground text-sm md:text-base truncate hover:text-[#0066FF] transition-colors">{name}</h3>
                                                </Link>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-lg md:text-xl font-bold text-foreground">{itemPrice} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                                                    {item.discountPrice && (
                                                        <span className="text-xs text-muted-foreground line-through">{item.price} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Quantity + Remove */}
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-1 bg-secondary border border-border rounded-xl overflow-hidden">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="w-10 text-center text-sm font-bold text-foreground">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={item.quantity >= item.stock}
                                                        className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-bold text-[#0066FF] hidden sm:inline">
                                                         {(itemPrice * item.quantity).toFixed(2)} {lang === 'ar' ? 'ج.م' : 'EGP'}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            removeItem(item.id)
                                                            toast.success(lang === 'ar' ? 'تم إزالة المنتج' : 'Item removed')
                                                        }}
                                                        className="p-2 rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Clear Cart */}
                            <button
                                onClick={() => {
                                    clearCart()
                                    toast.success(lang === 'ar' ? 'تم تفريغ السلة' : 'Cart cleared')
                                }}
                                className="text-sm text-muted-foreground/80 hover:text-red-400 transition-colors font-medium mt-2"
                            >
                                {lang === 'ar' ? 'تفريغ السلة' : 'Clear Cart'}
                            </button>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 rounded-3xl bg-card border border-border p-6 md:p-8 space-y-6">
                                <h2 className="text-lg font-bold text-foreground">
                                    {lang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
                                </h2>

                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                                        <span className="text-foreground font-bold">{totalPrice.toFixed(2)} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>{lang === 'ar' ? 'الشحن' : 'Shipping'}</span>
                                        <span className="text-green-400 font-bold">{lang === 'ar' ? 'مجاني' : 'Free'}</span>
                                    </div>
                                    <div className="h-px bg-border" />
                                    <div className="flex justify-between text-foreground text-lg font-bold">
                                        <span>{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                                        <span className="text-[#0066FF]">{totalPrice.toFixed(2)} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut || items.length === 0}
                                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-base shadow-[0_0_40px_rgba(0,102,255,0.3)] transition-all disabled:opacity-50"
                                >
                                    {isCheckingOut ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <CreditCard className={`w-5 h-5 ${lang === 'ar' ? 'ml-2' : 'mr-2'}`} />
                                            {lang === 'ar' ? 'إتمام الشراء' : 'Checkout'}
                                        </>
                                    )}
                                </Button>

                                {/* Trust Badges */}
                                <div className="space-y-3 pt-4 border-t border-border">
                                    {[
                                        { icon: ShieldCheck, text: lang === 'ar' ? 'دفع آمن ومشفر' : 'Secure Checkout' },
                                        { icon: Truck, text: lang === 'ar' ? 'شحن مجاني' : 'Free Shipping' },
                                    ].map((badge, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <badge.icon className="w-4 h-4 text-green-500 shrink-0" />
                                            <span>{badge.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <NexBotAI />
        </div>
    )
}
