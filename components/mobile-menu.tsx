import { Menu, X, Linkedin, Facebook, Instagram, ShoppingBag } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n-context"

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.552 4.197 1.6 6.037L0 24l6.105-1.605a11.774 11.774 0 005.94 1.605c6.634 0 12.048-5.414 12.048-12.05 0-3.212-1.25-6.232-3.522-8.505" />
  </svg>
);

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { t, lang } = useLanguage()

  const [openSections, setOpenSections] = useState<string[]>([])

  const toggleSection = (name: string) => {
    setOpenSections(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])
  }

  const menuItems = [
    {
      name: t("nav.about"),
      subLinks: [
        { label: lang === "ar" ? "نيكسيت لاند" : "Nexit Land", href: "/about/nexit-land" },
        { label: lang === "ar" ? "شركائنا" : "Partners", href: "/about/partners" },
        { label: lang === "ar" ? "الدعم الفني" : "Tech Support", href: "/about/tech-support" },
        { label: lang === "ar" ? "فريق العمل" : "Team", href: "/about/team" },
        { label: lang === "ar" ? "تواصل معنا" : "Contact", href: "/contact" },
      ]
    },
    {
      name: t("common.resources"),
      subLinks: [
        { label: lang === "ar" ? "الصناعات والحلول" : "Industries & Solutions", href: "/resources/industries-solutions" },
        { label: lang === "ar" ? "البنية التحتية للـ IT" : "IT Infrastructure", href: "/resources/it-infrastructure" },
        { label: lang === "ar" ? "بنية تحتية متطورة" : "Advanced Infrastructure", href: "/resources/advanced-infrastructure" },
        { label: lang === "ar" ? "دراسات الحالة" : "Case Studies", href: "/case-studies" },
        { label: lang === "ar" ? "أبحاث تقنية" : "Tech Insights", href: "/blog" },
      ]
    },
    {
      name: lang === "ar" ? "الخدمات" : "Services",
      subLinks: [
        { label: lang === "ar" ? "مسرعات الـ IT" : "IT Accelerators", href: "/services/it-accelerators" },
        { label: lang === "ar" ? "رقميات" : "Digital", href: "/services/digital" },
        { label: lang === "ar" ? "برمجيات" : "Software", href: "/services/software" },
        { label: lang === "ar" ? "معدات هاردوير" : "Hardware", href: "/services/hardware" },
        { label: lang === "ar" ? "استضافة و VPS" : "Hosting & VPS", href: "/services/hosting-vps" },
        { label: lang === "ar" ? "طلب عرض سعر" : "Request a Quote", href: "/quotation/request" },
      ]
    },
    {
      name: t("common.tools"),
      subLinks: [
        { label: lang === "ar" ? "ربط الـ API" : "API Integrations", href: "/tools/api-integrations" },
        { label: lang === "ar" ? "إضافات وأنظمة" : "CMS Plugins", href: "/tools/cms-plugins" },
        { label: lang === "ar" ? "بوابات الدفع" : "Payment Gateways", href: "/tools/payment-gateways" },
      ]
    }
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-white hover:text-[#0066FF] transition-colors"
        aria-label="Open Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Ultra-Compact White Floating Menu */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ease-in-out ${isOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
      >
        {/* Backdrop - lighter for a cleaner look */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
          onClick={() => setIsOpen(false)}
        />

        <div className="absolute inset-x-8 top-6 flex flex-col gap-2 max-w-[260px] mx-auto">
          {/* 1. Logo Pill - Tiny & White */}
          <div
            className={`bg-white rounded-[18px] px-4 py-2 flex justify-between items-center shadow-lg transition-all duration-500 transform ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
              }`}
          >
            <Image src="/nexitlogo.png" alt="Nexit Logo" width={60} height={14} className="h-3.5 w-auto object-contain brightness-0" />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-zinc-400 hover:text-black transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. Content Card - Pure White & Compact */}
          <div
            className={`bg-white rounded-[22px] p-5 shadow-xl border border-zinc-100 transition-all duration-500 delay-100 transform overflow-y-auto max-h-[70vh] ${isOpen ? "translate-y-0 opacity-100 scale-100" : "-translate-y-2 opacity-0 scale-95"
              }`}
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            <nav className="flex flex-col gap-4 mb-6">
              {menuItems.map((item) => (
                <div key={item.name} className="flex flex-col gap-2">
                  <button
                    onClick={() => toggleSection(item.name)}
                    className="flex items-center justify-between text-[10px] font-bold text-zinc-900 uppercase tracking-widest text-start transition-colors"
                  >
                    {item.name}
                    <span className="text-zinc-400 font-normal">{openSections.includes(item.name) ? "-" : "+"}</span>
                  </button>
                  {openSections.includes(item.name) && (
                    <div className="flex flex-col gap-2 pl-2 pr-2 border-l border-zinc-100 mt-1 mb-2">
                      {item.subLinks.map((subLink, idx) => (
                        <Link
                          key={idx}
                          href={subLink.href}
                          onClick={() => setIsOpen(false)}
                          className="text-[9px] font-medium text-zinc-500 hover:text-[#0066FF] uppercase tracking-wider transition-colors"
                        >
                          {subLink.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex flex-col gap-2 border-t pt-4 border-zinc-100">
                <Link
                  href="/store"
                  onClick={() => setIsOpen(false)}
                  className="text-[10px] font-bold text-[#0066FF] hover:text-black uppercase tracking-widest transition-colors flex items-center gap-2"
                >
                  <ShoppingBag className="w-3 h-3" />
                  {lang === "ar" ? "متجر نكسيت" : "NexIT Store"}
                </Link>
              </div>
            </nav>

            <Link
              href="/services/managed-it"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-black text-white rounded-full font-bold text-[8px] uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-sm mb-2"
            >
              <div className="w-3 h-3 rounded-full border border-white/20 flex items-center justify-center">
                <div className="w-1 h-1 bg-[#0066FF] rounded-full" />
              </div>
              {lang === "ar" ? "تعاقدات الشركات" : "Enterprise Support"}
            </Link>

            {/* Social Links */}
            <div className="flex justify-center gap-4 pt-4 border-t border-zinc-100">
              <a href="https://www.linkedin.com/company/nexitsolucom" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#0066FF] transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/nexitsolucom/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#0066FF] transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/nexitsolucom/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#0066FF] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://api.whatsapp.com/send/?phone=201031620990" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#0066FF] transition-colors">
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
