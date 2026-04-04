"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Linkedin, Instagram, ArrowRight, Mail, Phone, MapPin, HeartHandshake } from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { usePathname } from "next/navigation"

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.552 4.197 1.6 6.037L0 24l6.105-1.605a11.774 11.774 0 005.94 1.605c6.634 0 12.048-5.414 12.048-12.05 0-3.212-1.25-6.232-3.522-8.505" />
    </svg>
);

export function Footer() {
    const { t, lang } = useLanguage()
    const pathname = usePathname()

    if (pathname?.startsWith('/admin')) return null
    
    // Pages that should show the mini footer instead of the full giant footer
    const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/profile') || pathname?.startsWith('/nexbot')

    if (isAuthPage) {
        return (
            <footer className={`bg-background border-t border-border py-6 px-6 ${pathname?.startsWith('/nexbot') ? 'hidden md:block' : ''}`}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                    <div>{lang === 'ar' ? 'نيكسيت سوليوشنز © ٢٠٢٦ - جميع الحقوق محفوظة' : `Nexit Solutions © ${new Date().getFullYear()} — Engineering Excellence. All Rights Reserved.`}</div>
                    <a 
                        href="https://dipencil.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                    >
                        {lang === "ar" ? "NexIT Solutions مدعوم بواسطة بنسل استوديو" : "NexIT Solutions Powered by Pencil Studio"}
                    </a>
                </div>
            </footer>
        )
    }

    return (
        <footer className="bg-background border-t border-border pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Column 1: About */}
                    <div className="space-y-6">
                        <Image src="/nexit-logo.png" alt="Nexit Logo" width={130} height={30} className="h-8 w-auto object-contain dark:hidden" />
                        <Image src="/nexitlogo.png" alt="Nexit Logo" width={130} height={30} className="h-8 w-auto object-contain brightness-110 hidden dark:block" />
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            {t("footer.description")}
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.linkedin.com/company/nexitsolucom" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-border hover:border-primary/50 hover:bg-accent transition-all text-muted-foreground hover:text-foreground">
                                <Linkedin className="h-4 w-4" />
                            </a>
                            <a href="https://www.facebook.com/nexitsolucom/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-border hover:border-primary/50 hover:bg-accent transition-all text-muted-foreground hover:text-foreground">
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a href="https://www.instagram.com/nexitsolucom/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-border hover:border-primary/50 hover:bg-accent transition-all text-muted-foreground hover:text-foreground">
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a href="https://api.whatsapp.com/send/?phone=201031620990" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-border hover:border-primary/50 hover:bg-accent transition-all text-muted-foreground hover:text-foreground">
                                <WhatsAppIcon className="h-4 w-4" />
                            </a>
                        </div>
                        <a
                            href="https://dipencil.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 pt-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                        >
                            <HeartHandshake className="w-3.5 h-3.5 text-primary" />
                            <span>
                                {lang === "ar" ? "NexIT Solutions مدعوم بواسطة بنسل استوديو" : "NexIT Solutions Powered by Pencil Studio"}
                            </span>
                        </a>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-foreground font-semibold uppercase tracking-wider text-xs">{t("footer.columns.links")}</h4>
                        <ul className="space-y-1">
                            <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">{lang === "ar" ? "الرئيسية" : "Home"}</Link></li>
                            <li><Link href="/about/nexit-land" className="text-muted-foreground hover:text-primary transition-colors text-sm">{lang === "ar" ? "من نحن" : "About Nexit"}</Link></li>
                            <li><Link href="/about/team" className="text-muted-foreground hover:text-primary transition-colors text-sm">{lang === "ar" ? "فريقنا" : "Our Team"}</Link></li>
                            <li><Link href="/about/partners" className="text-muted-foreground hover:text-primary transition-colors text-sm">{lang === "ar" ? "شركاؤنا" : "Partners"}</Link></li>
                            <li><Link href="/resources/case-studies" className="text-muted-foreground hover:text-primary transition-colors text-sm">{lang === "ar" ? "دراسات الحالة" : "Case Studies"}</Link></li>
                            <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">{lang === "ar" ? "تواصل معنا" : "Contact Us"}</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Services */}
                    <div className="space-y-6">
                        <h4 className="text-foreground font-semibold uppercase tracking-wider text-xs">{t("footer.columns.services_footer")}</h4>
                        <ul className="space-y-1">
                            <li><Link href="/services/it-accelerators" className="text-muted-foreground hover:text-primary transition-colors text-sm">{lang === "ar" ? "خدمات IT" : "IT Accelerators"}</Link></li>
                            <li><Link href="/services/digital" className="text-muted-foreground hover:text-primary transition-colors text-sm">{lang === "ar" ? "الخدمات الرقمية" : "Digital Services"}</Link></li>
                            <li><Link href="/services/software" className="text-muted-foreground hover:text-primary transition-colors text-sm">{lang === "ar" ? "تطوير البرمجيات" : "Software Development"}</Link></li>
                            <li><Link href="/services/hardware" className="text-muted-foreground hover:text-primary transition-colors text-sm">{lang === "ar" ? "الأجهزة والحلول" : "Hardware Solutions"}</Link></li>
                            <li><Link href="/services/hosting-vps" className="text-muted-foreground hover:text-primary transition-colors text-sm">{lang === "ar" ? "الاستضافة وVPS" : "Hosting & VPS"}</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter + Contact */}
                    <div className="space-y-6">
                        <h4 className="text-foreground font-semibold uppercase tracking-wider text-xs">{t("footer.newsletter.title")}</h4>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder={t("footer.newsletter.placeholder")}
                                className="w-full bg-input/50 border border-border rounded-full py-3 px-6 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                                style={{ borderRadius: "9999px" }}
                                dir={lang === "ar" ? "rtl" : "ltr"}
                            />
                            <button className={`absolute top-1/2 -translate-y-1/2 p-2 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-all ${lang === "ar" ? "left-1.5" : "right-1.5"}`}>
                                <ArrowRight className={`h-4 w-4 ${lang === "ar" ? "rotate-180" : ""}`} />
                            </button>
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{t("footer.rights")} &copy; {new Date().getFullYear()}</p>

                        {/* Quick Contact Icons */}
                        <div className="space-y-3 pt-2 border-t border-border">
                            <h4 className="text-foreground font-semibold uppercase tracking-wider text-xs">{lang === "ar" ? "تواصل سريع" : "Quick Contact"}</h4>
                            <div className="flex items-center gap-3">
                                <a href="mailto:info@nexitsolu.com" title="info@nexitsolu.com" className="p-2 rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-all text-muted-foreground hover:text-primary">
                                    <Mail className="w-4 h-4" />
                                </a>
                                <a href="tel:+201031620990" title={lang === "ar" ? "فرع الغردقة: +201031620990" : "Hurghada Branch: +201031620990"} className="p-2 rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-all text-muted-foreground hover:text-primary">
                                    <Phone className="w-4 h-4" />
                                </a>
                                <a href="/contact" title={lang === "ar" ? "فروع القاهرة والغردقة" : "Cairo & Hurghada Branches"} className="p-2 rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-all text-muted-foreground hover:text-primary">
                                    <MapPin className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                    <div>Nexit Solutions — Engineering Excellence</div>
                    <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center md:justify-end">
                        <Link href="/privacy" className="hover:text-foreground transition-colors">{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">{lang === 'ar' ? 'شروط الخدمة' : 'Terms of Service'}</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

