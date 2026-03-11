"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, X, Trash2, Plus, Minus, CreditCard, ArrowRight } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useLanguage } from "@/lib/i18n-context"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface CartModalProps {
    isOpen: boolean
    onClose: () => void
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
    const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart()
    const { lang } = useLanguage()
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isMounted) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-100"
                    />
                    <motion.div
                        initial={{ x: lang === 'ar' ? '-100%' : '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: lang === 'ar' ? '-100%' : '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={`fixed top-0 ${lang === 'ar' ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-[#050505] border-x border-white/5 z-101 flex flex-col shadow-2xl`}
                        dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingCart className="w-5 h-5 text-[#0066FF]" />
                                <h2 className="font-bold text-lg">{lang === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}</h2>
                                <span className="bg-[#0066FF] text-white text-[10px] font-black px-2 py-0.5 rounded-full">{totalItems}</span>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                <X className="w-5 h-5 text-zinc-500" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                                    <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                                        <ShoppingCart className="w-8 h-8 text-zinc-700" />
                                    </div>
                                    <p className="text-sm font-medium text-zinc-400">
                                        {lang === 'ar' ? 'سلتك فارغة تماماً' : 'Your cart is empty'}
                                    </p>
                                    <button 
                                        onClick={() => {
                                            onClose()
                                            router.push('/store')
                                        }}
                                        className="text-[#0066FF] text-xs font-bold hover:underline"
                                    >
                                        {lang === 'ar' ? 'تصفح المتجر الآن' : 'Browse Store Now'}
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => {
                                    const name = lang === 'ar' ? (item.nameAr || item.name) : item.name
                                    const price = item.discountPrice || item.price
                                    return (
                                        <div key={item.id} className="flex gap-4 p-3 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all">
                                            <div className="relative w-20 h-20 rounded-xl bg-zinc-800 overflow-hidden shrink-0">
                                                <Image src={item.image || "/placeholder.svg"} alt={name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-sm font-medium text-white truncate">{name}</h3>
                                                    <p className="text-[#0066FF] font-bold text-xs mt-1">{price} EGP</p>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1 bg-zinc-800 rounded-lg overflow-hidden border border-white/5">
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <button 
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-1.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/5 bg-zinc-900/20 space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-zinc-500 text-sm font-medium">{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                                    <span className="text-white text-xl font-bold tracking-tight">{totalPrice.toFixed(2)} EGP</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => {
                                            onClose()
                                            router.push('/store/cart')
                                        }}
                                        className="h-12 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart className="w-3.5 h-3.5" />
                                        {lang === 'ar' ? 'عرض السلة' : 'View Cart'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            onClose()
                                            router.push('/store/checkout')
                                        }}
                                        className="h-12 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                                    >
                                        <CreditCard className="w-3.5 h-3.5" />
                                        {lang === 'ar' ? 'الدفع' : 'Checkout'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
