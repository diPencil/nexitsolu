"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ShoppingBag } from "lucide-react"
import { NavDropdown } from "./nav-dropdown"
import { MobileMenu } from "./mobile-menu"
import { ThemeToggle } from "./theme-toggle"

import { useLanguage } from "@/lib/i18n-context"
import { useSession } from "next-auth/react"

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { data: session, status } = useSession()
  const { lang, setLang, t } = useLanguage()
  const pathname = usePathname()
  const [isChatActive, setIsChatActive] = useState(false)

  useEffect(() => {
    const handleChatActive = (e: any) => {
        setIsChatActive(e.detail)
    }
    window.addEventListener('nexbot-chat-active' as any, handleChatActive)
    return () => window.removeEventListener('nexbot-chat-active' as any, handleChatActive)
  }, [])

  useEffect(() => {
    setIsChatActive(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login') || pathname?.startsWith('/register') || isChatActive) return null
  
  if (pathname?.startsWith('/profile')) {
      return (
          <nav className="fixed top-0 left-0 w-full z-50 bg-background/50 backdrop-blur-3xl border-b border-border h-20 flex items-center px-6">
              <div className="max-w-[1600px] mx-auto w-full flex justify-between items-center">
                  <Link href="/">
                      <Image src="/nexit-logo.png" alt="Nexit Logo" width={110} height={26} className="h-6 w-auto object-contain dark:hidden" />
                      <Image src="/nexitlogo.png" alt="Nexit Logo" width={110} height={26} className="h-6 w-auto object-contain hidden dark:block" />
                  </Link>
                  <div className="flex items-center gap-4">
                      <ThemeToggle />
                      <button
                        onClick={() => setLang(lang === "en" ? "ar" : "en")}
                        className="p-2 rounded-full border border-border hover:bg-accent text-foreground transition-colors text-xs font-bold w-10 h-10 flex items-center justify-center shrink-0"
                      >
                        {lang === "en" ? "ع" : "EN"}
                      </button>
                      
                      <Link href="/store" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors bg-accent/50 hover:bg-accent px-4 py-2.5 rounded-xl border border-border">
                          <ShoppingBag className="w-4 h-4" />
                          <span className="hidden sm:inline">{t("nav.back_to_store")}</span>
                      </Link>
                  </div>
              </div>
          </nav>
      )
  }

  return (
    <nav
      className={`fixed left-1/2 -translate-x-1/2 z-50 px-6 w-full max-w-7xl transition-all duration-700 ease-in-out ${isVisible ? "top-8 opacity-100" : "-top-24 opacity-0"
        }`}
    >
      <div className="bg-background/50 border-border/80 backdrop-blur-[120px] rounded-full px-4 md:px-8 py-3 flex items-center justify-between shadow-lg border w-full shrink-0">
        <div className="flex items-center shrink-0">
          <Link href="/">
            <Image src="/nexit-logo.png" alt="Nexit Logo" width={130} height={30} className="h-6 md:h-8 w-auto object-contain dark:hidden" />
            <Image src="/nexitlogo.png" alt="Nexit Logo" width={130} height={30} className="h-6 md:h-8 w-auto object-contain brightness-110 hidden dark:block" />
          </Link>
        </div>

        <div className="hidden md:flex items-center justify-center gap-0.5 flex-1">
          <NavDropdown
            title={t("nav.about")}
            items={[
              { label: t("nav.nexit_land"), href: "/about/nexit-land" },
              { label: t("nav.partners"), href: "/about/partners" },
              { label: t("nav.tech_support"), href: "/about/tech-support" },
              { label: t("nav.team"), href: "/about/team" },
              { label: t("nav.contact"), href: "/contact" },
            ]}
          />

          <NavDropdown
            title={t("common.resources")}
            items={[
              { label: t("nav.industries_solutions"), href: "/resources/industries-solutions" },
              { label: t("nav.it_infrastructure"), href: "/resources/it-infrastructure" },
              { label: t("nav.advanced_infrastructure"), href: "/resources/advanced-infrastructure" },
              { label: t("nav.case_studies"), href: "/resources/case-studies" },
              { label: t("nav.tech_insights"), href: "/resources/tech-insights" },
            ]}
          />

          <NavDropdown
            title={t("common.services")}
            items={[
              { label: t("nav.it_accelerators"), href: "/services/it-accelerators" },
              { label: t("nav.digital"), href: "/services/digital" },
              { label: t("nav.software"), href: "/services/software" },
              { label: t("nav.hardware"), href: "/services/hardware" },
              { label: t("nav.hosting_vps"), href: "/services/hosting-vps" },
              { label: t("nav.request_quote"), href: "/quotation/request" },
            ]}
          />

          <NavDropdown
            title={t("common.tools")}
            items={[
              { label: t("nav.api_integrations"), href: "/tools/api-integrations" },
              { label: t("nav.cms_plugins"), href: "/tools/cms-plugins" },
              { label: t("nav.payment_gateways"), href: "/tools/payment-gateways" },
            ]}
          />

          <Link href="/store" className="px-4 py-2 text-[#0066FF] hover:opacity-80 transition-all text-sm font-bold whitespace-nowrap flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            {t("nav.nexit_store")}
          </Link>
        </div>

        <div className="flex items-center justify-end gap-3 shrink-0">
          <ThemeToggle />
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="hidden md:flex px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors uppercase"
          >
            {lang === "en" ? "AR" : "EN"}
          </button>

          <Link
            href="/services/managed-it"
            className="hidden sm:flex px-[18px] py-[10px] rounded-full border border-[#0066FF] bg-[#0066FF]/50 text-primary-foreground text-sm font-medium hover:scale-105 transition-transform duration-500 whitespace-nowrap"
          >
            {t("nav.enterprise_support")}
          </Link>

          {status === "authenticated" ? (
            <div className="hidden md:flex items-center gap-2">
              {(session?.user as any)?.role === "ADMIN" ? (
                <Link href="/admin" className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  {lang === 'ar' ? 'لوحة التحكم' : 'Admin'}
                </Link>
              ) : (
                <Link href="/profile" className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border hover:bg-accent transition-all">
                  <div className="w-5 h-5 rounded-full bg-[#0066FF] flex items-center justify-center text-[10px] font-bold text-primary-foreground uppercase">
                    {session?.user?.name?.[0]}
                  </div>
                  <span className="text-sm font-medium">{lang === 'ar' ? 'حسابي' : 'Profile'}</span>
                </Link>
              )}
            </div>
          ) : null}

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="px-3 py-1.5 rounded-full border border-border text-xs font-medium uppercase"
            >
              {lang === "en" ? "AR" : "EN"}
            </button>
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}
