import type { Metadata } from "next"
import HomeClient from "./home-client"

export const metadata: Metadata = {
  title: "NexIT Solutions | Innovative Software & System Integration",
  description: "NexIT Solutions provides professional software development, system integration, cybersecurity, and managed cloud services. Discover our cutting-edge solutions for your digital growth.",
  alternates: {
    canonical: "https://nexitsolu.com",
    languages: {
      "en-US": "https://nexitsolu.com",
      "ar-EG": "https://nexitsolu.com",
    },
  },
  openGraph: {
    title: "NexIT Solutions - Transforming Businesses Digitally",
    description: "Empowering industries with smart software, robust infrastructure, and premium IT services.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NexIT Solutions Home",
      },
    ],
  },
}

export default function Page() {
  return <HomeClient />
}
