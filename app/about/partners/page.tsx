import type { Metadata } from "next"
import PartnersClient from "./partners-client"

export const metadata: Metadata = {
    title: "Our Strategic Partners | Nexit Solutions",
    description: "Learn about the global technology leaders we partner with—including Microsoft, AWS, and Google—to deliver world-class IT solutions.",
    openGraph: {
        title: "Nexit Strategic Partnerships",
        description: "Collaborating with global leaders for digital excellence.",
    },
}

export default function Page() {
    return <PartnersClient />
}
