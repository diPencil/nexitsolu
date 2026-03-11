"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface CartItem {
    id: string
    name: string
    nameAr?: string
    price: number
    discountPrice?: number
    image?: string
    quantity: number
    stock: number
}

interface CartContextType {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    totalItems: number
    totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem("nexit-cart")
            if (saved) {
                setItems(JSON.parse(saved))
            }
        } catch (e) {}
    }, [])

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem("nexit-cart", JSON.stringify(items))
    }, [items])

    const addItem = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === item.id)
            if (existing) {
                return prev.map(i =>
                    i.id === item.id
                        ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) }
                        : i
                )
            }
            return [...prev, { ...item, quantity }]
        })
    }

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id))
    }

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id)
            return
        }
        setItems(prev =>
            prev.map(i =>
                i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
            )
        )
    }

    const clearCart = () => setItems([])

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
    const totalPrice = items.reduce((sum, i) => sum + (i.discountPrice || i.price) * i.quantity, 0)

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error("useCart must be used within CartProvider")
    return ctx
}
