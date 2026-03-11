import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Cairo } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LenisProvider } from "@/components/lenis-provider"
import "./globals.css"

import { LanguageProvider } from "@/lib/i18n-context"
import { Providers } from "@/components/providers"
import { Navbar } from "@/components/navbar"
import { Topbar } from "@/components/topbar"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" })

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: {
    default: "NexIT Solutions | Innovative Software & System Integration",
    template: "%s | NexIT Solutions",
  },
  description: "NexIT Solutions provides professional software development, system integration, cybersecurity, and managed cloud services for businesses looking for digital transformation.",
  keywords: ["NexIT", "NexIT Solutions", "Software Development", "System Integration", "Cybersecurity", "Cloud Services", "IT Infrastructure", "Managed IT", "Digital Transformation", "نيكسيت", "برمجيات", "حلول ذكية", "خدمات سحابية"],
  authors: [{ name: "NexIT Engineering Team" }],
  creator: "NexIT Solutions",
  publisher: "NexIT Solutions",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://nexit-solutions.com"), // Replace with actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NexIT Solutions | Innovative Software & System Integration",
    description: "NexIT Solutions provides professional software development, system integration, cybersecurity, and managed cloud services.",
    url: "https://nexit-solutions.com",
    siteName: "NexIT Solutions",
    images: [
      {
        url: "/og-image.png", // We will create/replace this
        width: 1200,
        height: 630,
        alt: "NexIT Solutions - Digital Transformation Powerhouse",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexIT Solutions | Innovative Software & System Integration",
    description: "NexIT Solutions provides professional software development, system integration, cybersecurity, and managed cloud services.",
    images: ["/og-image.png"],
    creator: "@nexit_solutions",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icon.svg",
        color: "#0066FF",
      },
    ],
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${geist.variable} ${geistMono.variable} ${cairo.variable}`} suppressHydrationWarning>
      <body className="antialiased bg-black text-white" suppressHydrationWarning>
        <LanguageProvider>
          <Providers>
            <LenisProvider>
              <div className="flex flex-col min-h-screen">
                <Topbar />
                <Navbar />
                <main className="grow">{children}</main>
                <Footer />
                <ScrollToTop />
              </div>
            </LenisProvider>
          </Providers>
        </LanguageProvider>
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "NexIT Solutions",
              "url": "https://nexit-solutions.com",
              "logo": "https://nexit-solutions.com/nexitlogo.png",
              "sameAs": [
                "https://twitter.com/nexit_solutions",
                "https://linkedin.com/company/nexit-solutions",
                "https://github.com/nexit-solutions"
              ],
              "description": "Innovative software systems and digital transformation solutions provider."
            }),
          }}
        />
      </body>
    </html>
  )
}
