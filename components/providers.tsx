"use client"

import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/sonner"
import { ChatBubble } from "@/components/chat-bubble"
import { CartProvider } from "@/lib/cart-context"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <CartProvider>
                {children}
                <ChatBubble />
                <Toaster position="top-center" />
            </CartProvider>
        </SessionProvider>
    )
}
