import type { Metadata } from "next"
import ContactClient from "./contact-client"

export const metadata: Metadata = {
    title: "Contact NexIT Solutions | Get a Free Consultation",
    description: "Get in touch with NexIT Solutions for professional software development and IT services. Contact us today via email, phone, or visit our office.",
    openGraph: {
        title: "Contact Us | NexIT Solutions",
        description: "We are here to help you build your digital future. Reach out to our experts.",
    },
}

export default function Page() {
    return <ContactClient />
}
