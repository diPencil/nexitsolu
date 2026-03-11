import type { Metadata } from "next"
import ManagedITClient from "./managed-it-client"

export const metadata: Metadata = {
    title: "Enterprise IT Support & Managed Services | NexIT",
    description: "Secure a professional IT support contract for your business. Custom plans for full-time, part-time, and on-site IT management tailored to your company needs.",
    openGraph: {
        title: "NexIT Managed Services - Enterprise IT Solutions",
        description: "Scale your business infrastructure with our expert IT support contracts.",
    },
}

export default function Page() {
    return <ManagedITClient />
}
