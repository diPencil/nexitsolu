"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from "react"
import { useLanguage } from "@/lib/i18n-context"
import { useSession } from "next-auth/react"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
    ArrowLeft, ArrowRight, ShoppingCart, Truck, CreditCard, Wallet,
    Smartphone, Loader2, CheckCircle, MapPin, User, Phone,
    Building2, ChevronRight, ShieldCheck, Banknote, Hash
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Info } from "lucide-react"

const DEPOSIT_PERCENT = 30 // 30% deposit option

function CheckoutContent() {
    const { lang } = useLanguage()
    const { data: session, status } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const { items, clearCart, totalPrice } = useCart()

    // If buyNow query param is present it holds a JSON product for direct checkout
    const buyNowParam = searchParams.get("buyNow")
    let buyNowProduct: any = null
    if (buyNowParam) {
        try {
            buyNowProduct = JSON.parse(decodeURIComponent(buyNowParam))
        } catch {
            buyNowProduct = null
        }
    }

    // Determine which items we are checking out
    const checkoutItems = buyNowProduct ? [{ ...buyNowProduct, quantity: 1 }] : items
    const orderTotal = buyNowProduct
        ? (buyNowProduct.discountPrice || buyNowProduct.price)
        : totalPrice

    const [step, setStep] = useState<1 | 2 | 3>(1) // 1=Shipping, 2=Payment, 3=Confirm
    const [isLoading, setIsLoading] = useState(false)
    const [orderDone, setOrderDone] = useState<string | null>(null)

    // Payment options
    const [paymentMethod, setPaymentMethod] = useState<"CASH_ON_DELIVERY" | "EWALLET" | "INSTAPAY">("CASH_ON_DELIVERY")
    const [paymentType, setPaymentType] = useState<"FULL" | "DEPOSIT">("FULL")
    // Transfer details (required for E-Wallet & InstaPay)
    const [senderPhone, setSenderPhone] = useState("")
    const [transactionId, setTransactionId] = useState("")
    const needsTransferDetails = paymentMethod === "EWALLET" || paymentMethod === "INSTAPAY"

    const [shipping, setShipping] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
    })

    const [zones, setZones] = useState<any[]>([])
    const [shippingFee, setShippingFee] = useState(0)

    useEffect(() => {
        // Fetch shipping zones
        fetch("/api/admin/shipping")
            .then(res => res.json())
            .then(data => {
                const activeZones = data.filter((z: any) => z.isActive)
                setZones(activeZones)
                
                // If city is already set (from session), calc its fee
                if (shipping.city) {
                    const zone = activeZones.find((z: any) => z.name === shipping.city)
                    if (zone) setShippingFee(zone.price)
                }
            })
            .catch(() => {})
    }, [])

    useEffect(() => {
        const zone = zones.find(z => z.name === shipping.city)
        setShippingFee(zone ? zone.price : 0)
    }, [shipping.city, zones])

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?redirect=/store/checkout")
        }
    }, [status])

    // Pre-fill from user profile / localStorage / buyNow
    useEffect(() => {
        let cityToSet = ""

        // 1. Check buyNow product
        if (buyNowProduct?.city) {
            cityToSet = buyNowProduct.city
        } 
        
        // 2. If not, check localStorage
        if (!cityToSet) {
            cityToSet = localStorage.getItem('nexit_shipping_city') || ""
        }

        // 3. If not, check session
        if (!cityToSet && session?.user) {
            const user = session.user as any
            cityToSet = user.governorate || ""
        }

        if (session?.user) {
            const user = session.user as any
            setShipping(prev => {
                const newName = user.name || ""
                const newPhone = user.phone || ""
                const newCity = cityToSet || prev.city
                
                // Only update if something actually changed to prevent loops
                if (prev.name === newName && prev.phone === newPhone && prev.city === newCity) {
                    return prev
                }
                
                return {
                    ...prev,
                    name: newName,
                    phone: newPhone,
                    city: newCity,
                }
            })
        } else if (cityToSet) {
            setShipping(prev => {
                if (prev.city === cityToSet) return prev
                return { ...prev, city: cityToSet }
            })
        }
    }, [status, session, buyNowParam]) // Use buyNowParam string instead of buyNowProduct object

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#0066FF]" />
            </div>
        )
    }

    if (checkoutItems.length === 0 && !orderDone) {
        return (
            <div className="min-h-screen bg-[#050505] pt-32 text-center text-white">
                <ShoppingCart className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-4">{lang === 'ar' ? 'لا توجد منتجات للشراء' : 'No items to checkout'}</h1>
                <Link href="/store" className="text-[#0066FF] hover:underline">{lang === 'ar' ? 'العودة للمتجر' : 'Back to Store'}</Link>
            </div>
        )
    }

    const totalWithShipping = orderTotal + shippingFee
    const depositAmount = +(totalWithShipping * DEPOSIT_PERCENT / 100).toFixed(2)
    const paidAmount = paymentType === "FULL" ? totalWithShipping : depositAmount
    const remainingAmount = +(totalWithShipping - depositAmount).toFixed(2)

    const handlePlaceOrder = async () => {
        if (!shipping.name || !shipping.phone || !shipping.address || !shipping.city) {
            toast.error(lang === 'ar' ? 'من فضلك أكمل بيانات الشحن' : 'Please complete shipping info')
            setStep(1)
            return
        }
        if (needsTransferDetails && (!senderPhone || !transactionId)) {
            toast.error(lang === 'ar' ? 'من فضلك أدخل رقم المحول منه ورقم العملية' : 'Please enter sender phone and transaction ID')
            setStep(2)
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: checkoutItems.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.discountPrice || item.price
                    })),
                    total: totalWithShipping,
                    shippingFee,
                    paidAmount,
                    paymentMethod,
                    paymentType,
                    senderPhone: needsTransferDetails ? senderPhone : undefined,
                    transactionId: needsTransferDetails ? transactionId : undefined,
                    shippingName: shipping.name,
                    shippingPhone: shipping.phone,
                    shippingAddress: shipping.address,
                    shippingCity: shipping.city,
                })
            })

            if (res.ok) {
                const order = await res.json()
                if (!buyNowProduct) clearCart()
                setOrderDone(order.orderNumber)
            } else {
                const err = await res.json()
                toast.error(err.error || "Failed to place order")
            }
        } catch {
            toast.error("Connection error")
        } finally {
            setIsLoading(false)
        }
    }

    // ── SUCCESS SCREEN ──
    if (orderDone) {
        return (
            <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 flex items-center justify-center font-sans">
                <div className="max-w-md w-full text-center">
                    <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-8">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">
                        {lang === 'ar' ? 'تم تأكيد طلبك!' : 'Order Confirmed!'}
                    </h1>
                    <p className="text-zinc-400 mb-2">
                        {lang === 'ar' ? 'رقم الطلب' : 'Order Number'}
                    </p>
                    <div className="text-2xl font-black text-[#0066FF] mb-8 tracking-widest">{orderDone}</div>

                    <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6 mb-8 text-start space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">{lang === 'ar' ? 'إجمالي المنتجات' : 'Products Total'}</span>
                            <span className="text-white font-bold">{orderTotal.toFixed(2)} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">{lang === 'ar' ? 'الشحن' : 'Shipping'}</span>
                            <span className="text-[#0066FF] font-bold">{shippingFee.toFixed(2)} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                            <span className="text-zinc-500 font-bold">{lang === 'ar' ? 'الإجمالي الكلي' : 'Grand Total'}</span>
                            <span className="text-white font-black">{totalWithShipping.toFixed(2)} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">{lang === 'ar' ? 'المبلغ المدفوع' : 'Amount Paid'}</span>
                            <span className="text-green-400 font-bold">{paidAmount.toFixed(2)} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                        </div>
                        {paymentType === "DEPOSIT" && (
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">{lang === 'ar' ? 'المتبقي عند الاستلام' : 'Remaining on Delivery'}</span>
                                <span className="text-yellow-400 font-bold">{remainingAmount.toFixed(2)} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">{lang === 'ar' ? 'طريقة الدفع' : 'Payment'}</span>
                            <span className="text-white font-bold capitalize">{paymentMethod.replace(/_/g, " ")}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link href="/profile">
                            <Button className="w-full h-12 rounded-2xl bg-[#0066FF] hover:bg-blue-500 font-bold">
                                {lang === 'ar' ? 'تتبع طلبك' : 'Track Your Order'}
                            </Button>
                        </Link>
                        <Link href="/store">
                            <Button variant="outline" className="w-full h-12 rounded-2xl border-zinc-800 hover:bg-white/5 text-white">
                                {lang === 'ar' ? 'مواصلة التسوق' : 'Continue Shopping'}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-28 pb-20 px-4 md:px-6 font-sans text-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <button onClick={() => router.back()} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all">
                        {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                            {lang === 'ar' ? 'إتمام الشراء' : 'Checkout'}
                        </h1>
                        <p className="text-zinc-500 text-sm">{lang === 'ar' ? 'أكمل تفاصيل طلبك' : 'Complete your order details'}</p>
                    </div>
                </div>

                {/* Steps */}
                <div className="flex items-center gap-2 mb-10">
                    {[
                        { n: 1, label: lang === 'ar' ? 'الشحن' : 'Shipping' },
                        { n: 2, label: lang === 'ar' ? 'الدفع' : 'Payment' },
                        { n: 3, label: lang === 'ar' ? 'التأكيد' : 'Confirm' },
                    ].map((s, i, arr) => (
                        <div key={s.n} className="flex items-center gap-2 flex-1">
                            <div
                                onClick={() => { if (s.n < step) setStep(s.n as 1|2|3) }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer flex-1 justify-center ${step === s.n ? 'bg-[#0066FF] text-white shadow-[0_0_20px_rgba(0,102,255,0.3)]' : step > s.n ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-zinc-900 text-zinc-600 border border-zinc-800'}`}
                            >
                                {step > s.n ? <CheckCircle className="w-4 h-4" /> : <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">{s.n}</span>}
                                <span className="hidden sm:block">{s.label}</span>
                            </div>
                            {i < arr.length - 1 && <ChevronRight className="w-4 h-4 text-zinc-700 shrink-0" />}
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Steps Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* ── STEP 1: SHIPPING ── */}
                        {step === 1 && (
                            <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6 md:p-8 space-y-5">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-[#0066FF]" />
                                    {lang === 'ar' ? 'بيانات الشحن' : 'Shipping Details'}
                                </h2>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {[
                                        { key: 'name', label: lang === 'ar' ? 'الاسم الكامل' : 'Full Name', icon: User, type: 'text' },
                                        { key: 'phone', label: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number', icon: Phone, type: 'tel' },
                                    ].map(f => (
                                        <div key={f.key}>
                                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">{f.label}</label>
                                            <div className="relative">
                                                <f.icon className={`absolute top-1/2 -translate-y-1/2 ${lang === 'ar' ? 'right-4' : 'left-4'} w-4 h-4 text-zinc-500`} />
                                                <input
                                                    type={f.type}
                                                    value={(shipping as any)[f.key]}
                                                    onChange={e => setShipping(p => ({ ...p, [f.key]: e.target.value }))}
                                                    className={`w-full bg-zinc-900 border border-zinc-800 rounded-xl h-12 ${lang === 'ar' ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-sm text-white focus:outline-none focus:border-[#0066FF] transition-colors`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">
                                        {lang === 'ar' ? 'المدينة / المحافظة' : 'City / Governorate'}
                                    </label>
                                    <div className="relative">
                                        <Building2 className={`absolute top-1/2 -translate-y-1/2 ${lang === 'ar' ? 'right-4' : 'left-4'} w-4 h-4 text-zinc-500`} />
                                        <select
                                            value={shipping.city}
                                            onChange={e => setShipping(p => ({ ...p, city: e.target.value }))}
                                            className={`w-full bg-zinc-900 border border-zinc-800 rounded-xl h-12 ${lang === 'ar' ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-sm text-white focus:outline-none focus:border-[#0066FF] transition-colors appearance-none cursor-pointer`}
                                        >
                                            <option value="" className="bg-zinc-950 text-zinc-500">{lang === 'ar' ? 'اختر المحافظة...' : 'Select Governorate...'}</option>
                                            {zones.map(z => (
                                                <option key={z.name} value={z.name} className="bg-zinc-950 text-white">
                                                    {lang === 'ar' ? z.nameAr : z.nameEn} ({z.price} EGP)
                                                </option>
                                            ))}
                                            {!zones.length && (
                                                <option value={shipping.city} className="bg-zinc-950 text-white">{shipping.city}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">
                                        {lang === 'ar' ? 'عنوان التسليم التفصيلي' : 'Detailed Delivery Address'}
                                    </label>
                                    <div className="relative">
                                        <MapPin className={`absolute top-3.5 ${lang === 'ar' ? 'right-4' : 'left-4'} w-4 h-4 text-zinc-500`} />
                                        <textarea
                                            rows={3}
                                            value={shipping.address}
                                            onChange={e => setShipping(p => ({ ...p, address: e.target.value }))}
                                            placeholder={lang === 'ar' ? 'الشارع، رقم المبنى، الشقة، أي علامات مميزة...' : 'Street, building no., apartment, landmarks...'}
                                            className={`w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 ${lang === 'ar' ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-sm text-white focus:outline-none focus:border-[#0066FF] transition-colors resize-none`}
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={() => {
                                        if (!shipping.name || !shipping.phone || !shipping.address || !shipping.city) {
                                            toast.error(lang === 'ar' ? 'أكمل جميع الحقول المطلوبة' : 'Please fill all required fields')
                                            return
                                        }
                                        setStep(2)
                                    }}
                                    className="w-full h-13 rounded-2xl bg-[#0066FF] hover:bg-blue-500 font-bold text-base mt-2"
                                >
                                    {lang === 'ar' ? 'التالي: طريقة الدفع' : 'Next: Payment Method'}
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        )}

                        {/* ── STEP 2: PAYMENT ── */}
                        {step === 2 && (
                            <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-[#0066FF]" />
                                    {lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
                                </h2>

                                {/* Payment Methods */}
                                <div className="grid gap-3">
                                    {[
                                        {
                                            id: 'CASH_ON_DELIVERY',
                                            icon: Banknote,
                                            label: lang === 'ar' ? 'كاش عند الاستلام' : 'Cash on Delivery',
                                            desc: lang === 'ar' ? 'ادفع نقداً عند استلام طلبك' : 'Pay cash when you receive your order',
                                            color: 'text-green-400'
                                        },
                                        {
                                            id: 'EWALLET',
                                            icon: Wallet,
                                            label: lang === 'ar' ? 'محفظة إلكترونية' : 'E-Wallet',
                                            desc: lang === 'ar' ? 'فودافون كاش، اورانج كاش، إتصالات كاش' : 'Vodafone Cash, Orange Cash, Etisalat Cash',
                                            color: 'text-orange-400'
                                        },
                                        {
                                            id: 'INSTAPAY',
                                            icon: Smartphone,
                                            label: 'InstaPay',
                                            desc: lang === 'ar' ? 'ادفع عبر تطبيق InstaPay' : 'Pay via InstaPay app',
                                            color: 'text-purple-400'
                                        },
                                    ].map(m => (
                                        <button
                                            key={m.id}
                                            onClick={() => {
                                                setPaymentMethod(m.id as any);
                                                if (m.id === 'CASH_ON_DELIVERY') setPaymentType("FULL");
                                            }}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border text-start transition-all ${paymentMethod === m.id ? 'bg-[#0066FF]/10 border-[#0066FF] shadow-[0_0_20px_rgba(0,102,255,0.15)]' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
                                        >
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-zinc-800 shrink-0 ${paymentMethod === m.id ? 'bg-[#0066FF]/20' : ''}`}>
                                                <m.icon className={`w-5 h-5 ${paymentMethod === m.id ? 'text-[#0066FF]' : m.color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-sm text-white">{m.label}</p>
                                                <p className="text-xs text-zinc-500 mt-0.5">{m.desc}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === m.id ? 'border-[#0066FF] bg-[#0066FF]' : 'border-zinc-700'}`}>
                                                {paymentMethod === m.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Transfer details — shown only for E-Wallet / InstaPay */}
                                {needsTransferDetails && (
                                    <div className="rounded-2xl border border-[#0066FF]/30 bg-[#0066FF]/5 p-5 space-y-4">
                                        <p className="text-xs font-black text-[#0066FF] uppercase tracking-widest flex items-center gap-2">
                                            <Smartphone className="w-4 h-4" />
                                            {lang === 'ar' ? 'بيانات التحويل المطلوبة' : 'Transfer Details (Required)'}
                                        </p>

                                        {/* Sender phone */}
                                        <div>
                                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block">
                                                {lang === 'ar' ? 'رقم الهاتف المحوَّل منه *' : 'Sender Phone Number *'}
                                            </label>
                                            <div className="relative">
                                                <Phone className={`absolute top-1/2 -translate-y-1/2 ${lang === 'ar' ? 'right-4' : 'left-4'} w-4 h-4 text-zinc-500`} />
                                                <input
                                                    type="tel"
                                                    required
                                                    value={senderPhone}
                                                    onChange={e => setSenderPhone(e.target.value)}
                                                    placeholder={lang === 'ar' ? 'مثال: 01001234567' : 'e.g. 01001234567'}
                                                    className={`w-full bg-zinc-900 border ${senderPhone ? 'border-green-500/50' : 'border-zinc-700'} rounded-xl h-12 ${lang === 'ar' ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-sm text-white focus:outline-none focus:border-[#0066FF] transition-colors`}
                                                />
                                            </div>
                                        </div>

                                        {/* Transaction ID */}
                                        <div>
                                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block">
                                                {lang === 'ar' ? 'رقم العملية / كود التحويل *' : 'Transaction ID / Reference Code *'}
                                            </label>
                                            <div className="relative">
                                                <Hash className={`absolute top-1/2 -translate-y-1/2 ${lang === 'ar' ? 'right-4' : 'left-4'} w-4 h-4 text-zinc-500`} />
                                                <input
                                                    type="text"
                                                    required
                                                    value={transactionId}
                                                    onChange={e => setTransactionId(e.target.value)}
                                                    placeholder={lang === 'ar' ? 'أدخل رقم العملية أو كود التأكيد' : 'Enter transaction ID or confirmation code'}
                                                    className={`w-full bg-zinc-900 border ${transactionId ? 'border-green-500/50' : 'border-zinc-700'} rounded-xl h-12 ${lang === 'ar' ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-sm text-white focus:outline-none focus:border-[#0066FF] transition-colors`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod !== "CASH_ON_DELIVERY" && (
                                    <div>
                                        <h3 className="text-sm font-bold text-zinc-400 mb-3 uppercase tracking-widest">
                                            {lang === 'ar' ? 'نوع الدفع' : 'Payment Amount'}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => setPaymentType("FULL")}
                                                className={`p-4 rounded-2xl border text-start transition-all ${paymentType === "FULL" ? 'bg-[#0066FF]/10 border-[#0066FF]' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
                                            >
                                                <p className="font-black text-white text-lg">{totalWithShipping.toFixed(2)} {lang === 'ar' ? 'ج.م' : 'EGP'}</p>
                                                <p className={`text-xs mt-1 font-bold ${paymentType === "FULL" ? 'text-[#0066FF]' : 'text-zinc-500'}`}>
                                                    {lang === 'ar' ? 'الدفع الكامل' : 'Full Payment'}
                                                </p>
                                                <p className="text-[10px] text-zinc-600 mt-0.5">
                                                    {lang === 'ar' ? 'ادفع كل المبلغ الآن' : 'Pay everything now'}
                                                </p>
                                            </button>

                                            <button
                                                onClick={() => setPaymentType("DEPOSIT")}
                                                className={`p-4 rounded-2xl border text-start transition-all ${paymentType === "DEPOSIT" ? 'bg-[#0066FF]/10 border-[#0066FF]' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
                                            >
                                                <p className="font-black text-white text-lg">{depositAmount.toFixed(2)} {lang === 'ar' ? 'ج.م' : 'EGP'}</p>
                                                <p className={`text-xs mt-1 font-bold ${paymentType === "DEPOSIT" ? 'text-[#0066FF]' : 'text-zinc-500'}`}>
                                                    {lang === 'ar' ? `عربون ${DEPOSIT_PERCENT}%` : `${DEPOSIT_PERCENT}% Deposit`}
                                                </p>
                                                <p className="text-[10px] text-zinc-600 mt-0.5">
                                                    {lang === 'ar' ? `والباقي ${remainingAmount} ج.م عند الاستلام` : `${remainingAmount} EGP on delivery`}
                                                </p>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 rounded-2xl border-zinc-800 hover:bg-white/5 text-white">
                                        {lang === 'ar' ? 'السابق' : 'Back'}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            if (needsTransferDetails && (!senderPhone || !transactionId)) {
                                                toast.error(lang === 'ar' ? 'أدخل رقم المحول منه ورقم العملية أولاً' : 'Enter sender phone and transaction ID first')
                                                return
                                            }
                                            setStep(3)
                                        }}
                                        className="flex-1 h-12 rounded-2xl bg-[#0066FF] hover:bg-blue-500 font-bold"
                                    >
                                        {lang === 'ar' ? 'مراجعة الطلب' : 'Review Order'}
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 3: CONFIRM ── */}
                        {step === 3 && (
                            <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-[#0066FF]" />
                                    {lang === 'ar' ? 'مراجعة وتأكيد الطلب' : 'Review & Confirm Order'}
                                </h2>

                                {/* Shipping Summary */}
                                <div className="bg-zinc-900 rounded-2xl p-4 space-y-2">
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Truck className="w-4 h-4" /> {lang === 'ar' ? 'تفاصيل الشحن' : 'Shipping Info'}
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                                        <div><span className="text-zinc-500">{lang === 'ar' ? 'الاسم: ' : 'Name: '}</span><span className="text-white font-bold">{shipping.name}</span></div>
                                        <div><span className="text-zinc-500">{lang === 'ar' ? 'الهاتف: ' : 'Phone: '}</span><span className="text-white font-bold">{shipping.phone}</span></div>
                                        <div className="sm:col-span-2"><span className="text-zinc-500">{lang === 'ar' ? 'العنوان: ' : 'Address: '}</span><span className="text-white font-bold">{shipping.city} - {shipping.address}</span></div>
                                    </div>
                                </div>

                                {/* Payment Summary */}
                                <div className="bg-zinc-900 rounded-2xl p-4 space-y-2">
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" /> {lang === 'ar' ? 'تفاصيل الدفع' : 'Payment Info'}
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                                        <div><span className="text-zinc-500">{lang === 'ar' ? 'الطريقة: ' : 'Method: '}</span><span className="text-white font-bold">{paymentMethod.replace(/_/g, " ")}</span></div>
                                        <div><span className="text-zinc-500">{lang === 'ar' ? 'النوع: ' : 'Type: '}</span><span className="text-white font-bold">{paymentType === "FULL" ? (lang === 'ar' ? 'دفع كامل' : 'Full Payment') : (lang === 'ar' ? 'عربون' : 'Deposit')}</span></div>
                                        <div><span className="text-zinc-500">{lang === 'ar' ? 'المدفوع الآن: ' : 'Paying Now: '}</span><span className="text-[#0066FF] font-black">{paidAmount.toFixed(2)} {lang === 'ar' ? 'ج.م' : 'EGP'}</span></div>
                                        {paymentType === "DEPOSIT" && (
                                            <div><span className="text-zinc-500">{lang === 'ar' ? 'على الاستلام: ' : 'On Delivery: '}</span><span className="text-yellow-400 font-black">{remainingAmount.toFixed(2)} {lang === 'ar' ? 'ج.م' : 'EGP'}</span></div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12 rounded-2xl border-zinc-800 hover:bg-white/5 text-white">
                                        {lang === 'ar' ? 'السابق' : 'Back'}
                                    </Button>
                                    <Button
                                        onClick={handlePlaceOrder}
                                        disabled={isLoading}
                                        className="flex-1 h-12 rounded-2xl bg-[#0066FF] hover:bg-blue-500 font-bold text-base shadow-[0_0_30px_rgba(0,102,255,0.3)]"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (lang === 'ar' ? 'تأكيد الطلب' : 'Place Order')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <div className="rounded-3xl bg-zinc-950 border border-white/5 p-6 space-y-4">
                                <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                                    {lang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
                                </h2>

                                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                                    {checkoutItems.map((item: any) => {
                                        const itemPrice = item.discountPrice || item.price
                                        const name = lang === 'ar' ? (item.nameAr || item.name) : item.name
                                        return (
                                            <div key={item.id} className="flex gap-3 items-center">
                                                <div className="relative w-14 h-14 rounded-xl bg-zinc-900 overflow-hidden shrink-0">
                                                    <Image src={item.image || "/placeholder.svg"} alt={name} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">{name}</p>
                                                    <p className="text-xs text-zinc-500">x{item.quantity}</p>
                                                </div>
                                                 <span className="text-sm font-bold text-white shrink-0">{(itemPrice * item.quantity).toFixed(2)} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="h-px bg-zinc-800" />

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-zinc-400">
                                        <span>{lang === 'ar' ? 'المجموع' : 'Subtotal'}</span>
                                        <span className="text-white">{orderTotal.toFixed(2)} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-400">
                                        <span>{lang === 'ar' ? 'الشحن' : 'Shipping'}</span>
                                         <span className={shippingFee > 0 ? "text-[#0066FF] font-bold" : "text-green-400 font-bold"}>
                                             {shippingFee > 0 ? `${shippingFee.toFixed(2)} ${lang === 'ar' ? 'ج.م' : 'EGP'}` : (lang === 'ar' ? 'مجاني' : 'Free')}
                                         </span>
                                    </div>
                                    <div className="h-px bg-zinc-800 my-1" />
                                     <div className="flex justify-between font-black text-base">
                                         <span className="text-zinc-300">{lang === 'ar' ? 'المدفوع الآن' : 'Pay Now'}</span>
                                         <span className="text-[#0066FF]">{paidAmount.toFixed(2)} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                                     </div>
                                    {paymentType === "DEPOSIT" && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-zinc-500">{lang === 'ar' ? 'على الاستلام' : 'On Delivery'}</span>
                                            <span className="text-yellow-400 font-bold">{remainingAmount.toFixed(2)} EGP</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-xs text-zinc-600 pt-2">
                                    <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                                    {lang === 'ar' ? 'طلبك محمي وآمن' : 'Your order is safe & secure'}
                                </div>
                            </div>

                            {/* Payment Instructions Box */}
                            <AnimatePresence>
                                {needsTransferDetails && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                        className="rounded-3xl bg-[#0066FF]/5 border border-[#0066FF]/20 p-6 space-y-4 shadow-[0_0_40px_rgba(0,102,255,0.1)]"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-xl bg-[#0066FF] flex items-center justify-center shadow-lg shadow-[#0066FF]/20">
                                                <Smartphone className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                                                    {lang === 'ar' ? 'بيانات التحويل' : 'Transfer Details'}
                                                </h3>
                                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                                                    {paymentMethod === 'EWALLET' ? (lang === 'ar' ? 'محفظة إلكترونية' : 'E-Wallet Transfer') : 'InstaPay Transfer'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 group relative overflow-hidden">
                                                <div className="absolute inset-0 bg-linear-to-r from-[#0066FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">{lang === 'ar' ? 'رقم التحويل' : 'Transfer Number'}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xl font-black text-white tracking-tighter">+20 10 61441530</span>
                                                    <button 
                                                        onClick={() => {
                                                            navigator.clipboard.writeText("01061441530");
                                                            toast.success(lang === 'ar' ? 'تم نسخ الرقم!' : 'Number copied!');
                                                        }}
                                                        className="p-2 rounded-lg bg-white/5 hover:bg-[#0066FF] hover:text-white transition-all text-zinc-400"
                                                    >
                                                        <Copy className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 items-start p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
                                                <Info className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                                                <p className="text-[11px] font-bold text-zinc-400 leading-relaxed">
                                                    {lang === 'ar' 
                                                        ? 'بعد التحويل، يرجى كتابة رقم الهاتف الذي قمت بالتحويل منه ورقم العملية في خانة (Transfer Details) المجاورة لتأكيد طلبك.' 
                                                        : 'After transfer, please add the sender phone number and transaction ID in the Transfer Details section to confirm your order.'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#0066FF]" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    )
}
