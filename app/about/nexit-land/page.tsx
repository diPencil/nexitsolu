import type { Metadata } from "next"
import NexitLandClient from "./nexit-land-client"

export const metadata: Metadata = {
    title: "Nexit Land | The Future of Digital Innovation",
    description: "Discover the Nexit Land ecosystem. Our vision, mission, and stories of digital transformation from the heart of Cairo to the world.",
    openGraph: {
        title: "About Nexit Land",
        description: "Explore our innovation journey and strategic compass.",
    },
}

export default function Page() {
    return <NexitLandClient />
}
