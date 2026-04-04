"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    MessageSquare,
    Menu,
} from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { cn } from "@/lib/utils"

export function ProfileMobileNav({ username }: { username: string }) {
    const { lang } = useLanguage()
    const pathname = usePathname() || ""
    const u = encodeURIComponent(username)
    const base = `/profile/${u}`
    const parts = pathname.replace(/\/$/, "").split("/").filter(Boolean)
    const pathUser = parts[1]
    const isOverview =
        parts[0] === "profile" &&
        pathUser === decodeURIComponent(username) &&
        parts.length === 2

    const items: {
        href: string
        label: string
        icon: typeof LayoutDashboard
        active: boolean
    }[] = [
        {
            href: base,
            label: lang === "ar" ? "نظرة" : "Overview",
            icon: LayoutDashboard,
            active: isOverview,
        },
        {
            href: "/store",
            label: lang === "ar" ? "متجر" : "Store",
            icon: ShoppingBag,
            active: pathname.startsWith("/store"),
        },
        {
            href: `${base}/orders`,
            label: lang === "ar" ? "طلبات" : "Orders",
            icon: Package,
            active: pathname.includes(`${base}/orders`),
        },
        {
            href: `${base}/messages`,
            label: lang === "ar" ? "رسائل" : "Messages",
            icon: MessageSquare,
            active: pathname.includes(`${base}/messages`),
        },
        {
            href: `${base}/more`,
            label: lang === "ar" ? "قائمة" : "Menu",
            icon: Menu,
            active: pathname.includes(`${base}/more`),
        },
    ]

    return (
        <nav
            className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom,0px)]"
            aria-label={lang === "ar" ? "تنقّل الحساب" : "Account navigation"}
        >
            <div
                className={cn(
                    "flex items-stretch justify-around gap-0 max-w-lg mx-auto safe-area-pb",
                    lang === "ar" && "flex-row-reverse"
                )}
            >
                {items.map(({ href, label, icon: Icon, active }) => (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 sm:py-2 px-0.5 text-[9px] sm:text-[10px] font-bold transition-colors min-w-0",
                            active ? "text-primary" : "text-muted-foreground active:text-foreground"
                        )}
                    >
                        <Icon className={cn("w-5 h-5 shrink-0", active && "text-[#0066FF]")} />
                        <span className="truncate w-full text-center leading-tight">
                            {label}
                        </span>
                    </Link>
                ))}
            </div>
        </nav>
    )
}
