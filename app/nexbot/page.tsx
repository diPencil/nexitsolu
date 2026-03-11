import type { Metadata } from "next"
import NexBotClient from "./NexBotClient"

export const metadata: Metadata = {
    title: "NexBot AI | Your Intelligent Assistant",
    description: "Get instant answers about Nexit services, infrastructure, and digital transformation.",
}

export default function Page() {
    return <NexBotClient />
}
