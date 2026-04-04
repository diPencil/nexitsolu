"use client"

import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/sonner"
import { ChatBubble } from "@/components/chat-bubble"
import { CartProvider } from "@/lib/cart-context"
import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} disableTransitionOnChange={false}>
            <SessionProvider>
                <CartProvider>
                    {children}
                    <ChatBubble />
                    <Toaster position="top-center" />
                </CartProvider>
            </SessionProvider>
        </ThemeProvider>
    )
}
