"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ShoppingBag } from "lucide-react"
import { NavDropdown } from "./nav-dropdown"
import { MobileMenu } from "./mobile-menu"

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
          <nav className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-3xl border-b border-white/5 h-20 flex items-center px-6">
              <div className="max-w-[1600px] mx-auto w-full flex justify-between items-center">
                  <Link href="/">
                      <Image src="/nexitlogo.png" alt="Nexit Logo" width={110} height={26} className="h-6 w-auto object-contain" />
                  </Link>
                  <div className="flex items-center gap-4">
                      <button
                        onClick={() => setLang(lang === "en" ? "ar" : "en")}
                        className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-xs font-bold w-10 h-10 flex items-center justify-center shrink-0"
                      >
                        {lang === "en" ? "ع" : "EN"}
                      </button>
                      
                      <Link href="/store" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/5">
                          <ShoppingBag className="w-4 h-4" />
                          <span className="hidden sm:inline">{lang === 'ar' ? 'العودة للمتجر' : 'Back to Store'}</span>
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
      <div className="bg-black/50 backdrop-blur-[120px] rounded-full px-4 md:px-8 py-3 flex items-center justify-between shadow-lg border border-white/10 w-full shrink-0">
        <div className="flex items-center shrink-0">
          <Link href="/">
            <Image src="/nexitlogo.png" alt="Nexit Logo" width={130} height={30} className="h-6 md:h-8 w-auto object-contain brightness-110" />
          </Link>
        </div>

        <div className="hidden md:flex items-center justify-center gap-0.5 flex-1">
          <NavDropdown
            title={t("nav.about")}
            items={[
              { label: lang === "ar" ? "نيكسيت لاند" : "Nexit Land", href: "/about/nexit-land" },
              { label: lang === "ar" ? "شركائنا" : "Partners", href: "/about/partners" },
              { label: lang === "ar" ? "الدعم الفني" : "Tech Support", href: "/about/tech-support" },
              { label: lang === "ar" ? "فريق العمل" : "Team", href: "/about/team" },
              { label: lang === "ar" ? "تواصل معنا" : "Contact", href: "/contact" },
            ]}
          />

          <NavDropdown
            title={t("common.resources")}
            items={[
              { label: lang === "ar" ? "الصناعات والحلول" : "Industries & Solutions", href: "/resources/industries-solutions" },
              { label: lang === "ar" ? "البنية التحتية للـ IT" : "IT Infrastructure", href: "/resources/it-infrastructure" },
              { label: lang === "ar" ? "بنية تحتية متطورة" : "Advanced Infrastructure", href: "/resources/advanced-infrastructure" },
              { label: lang === "ar" ? "دراسات الحالة" : "Case Studies", href: "/resources/case-studies" },
              { label: lang === "ar" ? "أبحاث تقنية" : "Tech Insights", href: "/resources/tech-insights" },
            ]}
          />

          <NavDropdown
            title={lang === "ar" ? "الخدمات" : "Services"}
            items={[
              { label: lang === "ar" ? "مسرعات الـ IT" : "IT Accelerators", href: "/services/it-accelerators" },
              { label: lang === "ar" ? "رقميات" : "Digital", href: "/services/digital" },
              { label: lang === "ar" ? "برمجيات" : "Software", href: "/services/software" },
              { label: lang === "ar" ? "معدات هاردوير" : "Hardware", href: "/services/hardware" },
              { label: lang === "ar" ? "استضافة و VPS" : "Hosting & VPS", href: "/services/hosting-vps" },
              { label: lang === "ar" ? "طلب عرض سعر" : "Request a Quote", href: "/quotation/request" },
            ]}
          />

          <NavDropdown
            title={t("common.tools")}
            items={[
              { label: lang === "ar" ? "ربط الـ API" : "API Integrations", href: "/tools/api-integrations" },
              { label: lang === "ar" ? "إضافات وأنظمة" : "CMS Plugins", href: "/tools/cms-plugins" },
              { label: lang === "ar" ? "بوابات الدفع" : "Payment Gateways", href: "/tools/payment-gateways" },
            ]}
          />

          <Link href="/store" className="px-4 py-2 text-[#0066FF] hover:opacity-80 transition-all text-sm font-bold whitespace-nowrap flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            {lang === "ar" ? "متجر نكسيت" : "NexIT Store"}
          </Link>
        </div>

        <div className="flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="hidden md:flex px-4 py-2 rounded-full border border-zinc-700 text-sm font-medium hover:bg-white/10 transition-colors uppercase"
          >
            {lang === "en" ? "AR" : "EN"}
          </button>

          <Link
            href="/services/managed-it"
            className="hidden sm:flex px-[18px] py-[10px] rounded-full border border-[#0066FF] bg-[#0066FF]/50 text-white text-sm font-medium hover:scale-105 transition-transform duration-500 whitespace-nowrap"
          >
            {lang === "ar" ? "تعاقدات الشركات" : "Enterprise Support"}
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
                <Link href="/profile" className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-all">
                  <div className="w-5 h-5 rounded-full bg-[#0066FF] flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {session?.user?.name?.[0]}
                  </div>
                  <span className="text-sm font-medium">{lang === 'ar' ? 'حسابي' : 'Profile'}</span>
                </Link>
              )}
            </div>
          ) : null}

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="px-3 py-1.5 rounded-full border border-zinc-700 text-xs font-medium uppercase"
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
