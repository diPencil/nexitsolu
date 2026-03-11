import type { Metadata } from "next"
import ITAcceleratorsClient from "./it-accelerators-client"

export const metadata: Metadata = {
    title: "IT Accelerators & Business Intelligence | Nexit",
    description: "Accelerate your digital growth with Nexit's IT accelerators. We offer data analytics, business intelligence, and optimized IT operations.",
    openGraph: {
        title: "IT Accelerators for Progressive Businesses",
        description: "Harness the power of data and automation to scale your operations.",
    },
}

export default function Page() {
    return <ITAcceleratorsClient />
}
