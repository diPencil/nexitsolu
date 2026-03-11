"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ProfileRedirect() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        } else if (status === "authenticated" && session?.user) {
            const username = (session?.user as any)?.username || session?.user?.name || "user"
            const cleanSlug = username ? username.toLowerCase().replace(/\s+/g, '-') : ''
            router.replace(`/profile/${encodeURIComponent(cleanSlug)}`)
        }
    }, [status, router, session])

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-[#0066FF]" />
        </div>
    )
}
