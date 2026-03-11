import type { Metadata } from "next"
import SoftwareClient from "./software-client"

export const metadata: Metadata = {
    title: "Professional Software Development Services",
    description: "NexIT Solutions offers custom software development, including ERP, CRM, and automation systems tailored to your business needs.",
    openGraph: {
        title: "Software Development Solutions | NexIT",
        description: "Scale your business with our custom-built software solutions.",
        images: [{ url: "/services/software-og.png" }], // User should add this
    },
}

export default function Page() {
    return <SoftwareClient />
}
