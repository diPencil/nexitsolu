"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { CircleArrowRight, ArrowRight, CheckCircle2, Server, Smartphone, Cloud, ShieldCheck, Database, Layout, Star, Quote, ArrowUpRight, ChevronLeft, ChevronRight, ShoppingBag, Sparkles, Bot, Heart, Share2 } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import Script from "next/script"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { NexBotAI } from "@/components/nexbot-ai"

import { useLanguage } from "@/lib/i18n-context"
import { CASE_STUDIES_DATA } from "./resources/case-studies/case-studies-data"
import { ARTICLES_CONTENT } from "./resources/tech-insights/articles-data"

const SplineViewer = "spline-viewer" as any

const CATEGORIES_MAP: Record<string, any> = {
    "workstations": { ar: "أجهزة العمل", en: "Workstations" },
    "laptops":      { ar: "لابتوب",       en: "Laptops" },
    "accessories":  { ar: "ملحقات",      en: "Accessories" },
    "networking":   { ar: "شبكات",       en: "Networking" },
    "software":     { ar: "برمجيات",     en: "Software" },
    "pcs":          { ar: "أجهزة كمبيوتر", en: "PCS" }
}

export default function Home() {
  const router = useRouter()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [products, setProducts] = useState<any[]>([])
  const [dbCategories, setDbCategories] = useState<any[]>([])
  const [isProductsLoading, setIsProductsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const { lang, t } = useLanguage()
  const isAr = lang === "ar"
  const journeyRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)

  const scrollJourney = (direction: "left" | "right") => {
    if (journeyRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300
      journeyRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const scrollServices = (direction: "left" | "right") => {
    if (servicesRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400
      servicesRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  useEffect(() => {
    setIsMounted(true)
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products")
        const data = await res.json()
        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products")
      } finally {
        setIsProductsLoading(false)
      }
    }
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories")
        const data = await res.json()
        setDbCategories(data || [])
      } catch (error) {}
    }
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const progress = Math.min(scrollY / viewportHeight, 1)
      setScrollProgress(progress)
    }

    const handleStepScroll = () => {
      const stepsSection = document.getElementById("process-steps")
      if (!stepsSection) return

      const rect = stepsSection.getBoundingClientRect()
      const viewHeight = window.innerHeight
      if (rect.top < viewHeight && rect.bottom > 0) {
        const stepProgress = Math.abs(rect.top) / rect.height
        const stepIndex = Math.floor(stepProgress * 4)
        setActiveStep(Math.min(Math.max(stepIndex, 0), 3))
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("scroll", handleStepScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("scroll", handleStepScroll)
    }
  }, [])

  const linesOpacity = 1 - scrollProgress
  const linesScale = 1 - scrollProgress * 0.3

  const techIcons = [
    { name: "Workstations", arName: "محطات العمل", icon: Server },
    { name: "Cloud Infrastructure", arName: "البنية التحتية السحابية", icon: Cloud },
    { name: "Cybersecurity", arName: "الأمن السيبراني", icon: ShieldCheck },
    { name: "Data Centers", arName: "مراكز البيانات", icon: Database },
    { name: "Networking", arName: "الشبكات المتطورة", icon: Layout },
    { name: "Enterprise IT", arName: "حلول الشركات", icon: Server },
    { name: "Laptops", arName: "أجهزة الابتوب", icon: Layout },
    { name: "Automation (RPA)", arName: "الأتمتة والذكاء", icon: ShieldCheck },
  ];

  const capabilities = [
    { key: "it_accelerators", tag: "Infrastructure", image: "/services/it-accelerators/Managed-IT-Operations.jpg", color: "bg-[#0066FF]", href: "/services/it-accelerators" },
    { key: "digital", tag: "Marketing", image: "/services/digital/Digital-Marketing-Strategy.jpg", color: "bg-purple-600", href: "/services/digital" },
    { key: "software", tag: "Development", image: "/services/software/Custom-Development.jpg", color: "bg-teal-600", href: "/services/software" },
    { key: "hardware", tag: "Enterprise", image: "/services/hardware/Server-&-Workstation-Preparation.jpg", color: "bg-orange-600", href: "/services/hardware" },
    { key: "hosting_vps", tag: "Cloud", image: "/services/hosting-vps/Cloud-Hosting.jpg", color: "bg-zinc-800", href: "/services/hosting-vps" },
  ];

  const baseTabs = [
    { id: "all", labelEn: "All", labelAr: "الكل", filter: () => true },
    { id: "pcs", labelEn: "Workstations", labelAr: "أجهزة", filter: (p: any) => p.category === 'workstations' || p.category === 'pcs' },
    { id: "laptops", labelEn: "Laptops", labelAr: "لابتوب", filter: (p: any) => p.category === 'laptops' },
    { id: "accessories", labelEn: "Accessories", labelAr: "ملحقات", filter: (p: any) => p.category === 'accessories' }
  ]

  const storeTabs = [
    ...baseTabs,
    ...dbCategories
      .filter((c: any) => !baseTabs.some(b => b.id === c.name))
      .map((c: any) => ({
        id: c.name,
        labelEn: c.nameEn,
        labelAr: c.nameAr,
        filter: (p: any) => p.category === c.name
      }))
  ]

  return (
    <main dir={lang === "ar" ? "rtl" : "ltr"} className="relative bg-[#050505] text-white selection:bg-[#0066FF] selection:text-white pb-16 md:pb-32 overflow-x-hidden">
      <Script
        src="https://unpkg.com/@splinetool/viewer@1.0.17/build/spline-viewer.js"
        type="module"
        strategy="afterInteractive"
      />

      {/* Hero Lines Background */}
      <div
        className="fixed inset-0 z-0 w-screen h-screen pointer-events-none transition-all duration-100"
        style={{
          opacity: linesOpacity,
          transform: `scale(${linesScale})`,
        }}
      >
        <div className="bg-lines-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="2269" height="2108" viewBox="0 0 2269 2108" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <path d="M510.086 0.543457L507.556 840.047C506.058 1337.18 318.091 1803.4 1.875 2094.29" stroke="#0066FF" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="100px 99999px" className="animate-line-race-1" />
            <path d="M929.828 0.543457L927.328 829.877C925.809 1334 737.028 1807.4 418.435 2106" stroke="#0066FF" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="100px 99999px" className="animate-line-race-2" />
            <path d="M1341.9 0.543457L1344.4 829.876C1345.92 1334 1534.7 1807.4 1853.29 2106" stroke="#0066FF" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="100px 99999px" className="animate-line-race-3" />
            <path d="M1758.96 0.543457L1761.49 840.047C1762.99 1337.18 1950.96 1803.4 2267.17 2094.29" stroke="#0066FF" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="100px 99999px" className="animate-line-race-4" />
          </svg>
        </div>
      </div>

      {/* 3D Spline Viewer */}
      <div
        className={`fixed top-0 w-full lg:w-1/2 h-screen pointer-events-none z-10 transition-opacity duration-500 opacity-40 lg:opacity-100 ${lang === "ar" ? "left-0" : "right-0"
          }`}
        style={{
          opacity: linesOpacity,
          transform: `scale(${linesScale})`,
        }}
      >
        <div className="track">
          <SplineViewer
            url="https://prod.spline.design/ZxKIijKh056svcM5/scene.splinecode"
            className="w-full h-full lg:scale-125"
            style={{
              position: "sticky",
              top: "0px",
              height: "100vh",
              filter: "brightness(2) contrast(1) sepia(1) hue-rotate(180deg) saturate(5) drop-shadow(0 0 60px rgba(0, 110, 255, 0.5))",
              transform: "rotate(180deg) scaleX(-1)"
            }}
          />
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 container mx-auto px-6 lg:px-12 pt-24 pb-32 min-h-screen flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Status Toggle */}
          <div className="flex items-center gap-3 mb-12 animate-fade-in">
            <div className="relative w-14 h-7 bg-linear-to-r from-green-400 to-green-500 rounded-full">
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${lang === "ar" ? "left-1" : "right-1"}`} />
            </div>
            <span className="text-sm text-zinc-300">{t("hero.status")}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-medium mb-8 leading-tight animate-fade-in-up text-balance">
            {t("hero.title")}
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 mb-12 animate-fade-in-up animation-delay-200">
            {t("hero.subheading")}
          </p>

            <div className="animate-fade-in-up animation-delay-400 flex flex-row items-center gap-2 sm:gap-4 w-full">
            <Link href="/contact#contact-form" className="flex-1 sm:flex-none">
              <Button
                size="lg"
                className="group bg-[#0066FF] hover:bg-[#0052CC] text-white px-2 sm:px-8 py-0 h-[48px] sm:h-[52px] text-[14px] font-bold sm:font-normal sm:text-base rounded-full transition-all duration-650 hover:scale-[1.02] flex-1 sm:flex-none flex items-center justify-center whitespace-nowrap w-full"
              >
                <span className="hidden sm:inline">{t("hero.cta")}</span>
                <span className="inline sm:hidden whitespace-nowrap">{lang === "ar" ? "استشارة مجانية" : "Consultation"}</span>
                <CircleArrowRight className={`ms-1.5 sm:ms-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-transform duration-650 group-hover:rotate-45 ${lang === "ar" ? "rotate-180" : ""}`} />
              </Button>
            </Link>
            <button 
              onClick={() => router.push('/nexbot')}
              className="uiverse-button group flex-1 sm:flex-none"
            >
              <div className="uiverse-blob1"></div>
              <div className="uiverse-inner w-full flex items-center justify-center px-2! sm:px-[30px]! py-0! h-[44px]! sm:h-[48px]! text-[14px] font-bold sm:font-semibold sm:text-[0.95rem] gap-1.5! sm:gap-[12px]!">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#3fe9ff] fill-[#3fe9ff]/10 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">{lang === "ar" ? "اسأل بوت نيكسيت" : "ASK NexIT BOT"}</span>
                <span className="inline sm:hidden whitespace-nowrap">{lang === "ar" ? "اسأل نيكسيت" : "ASK NexIT"}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Trust / Metrics Strip */}
      <section className="relative z-20 py-12 border-y border-zinc-900 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl font-light text-[#0066FF]">50+</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">{t("trust.metrics.projects")}</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-light text-[#0066FF]">10+</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">{t("trust.metrics.years")}</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-light text-[#0066FF]">100%</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">{t("trust.metrics.clients")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section (Reference Style) */}
      <section className="relative z-20 py-16 md:py-32 px-6 lg:px-24 bg-[#050505] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-8">
            <div className="flex items-center gap-6">
              <div className="p-3 bg-white/5 rounded-2xl">
                <Layout className="w-6 h-6 text-[#0066FF]" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight">
                  {lang === "ar" ? "أهم" : "Our"} <span className="text-[#0066FF]">{lang === "ar" ? "الخدمات" : "Services"}</span>
                </h2>
                {/* Scroll Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollServices(lang === "ar" ? "right" : "left")}
                    className="p-3 rounded-full border border-white/10 hover:bg-[#0066FF] hover:border-[#0066FF] transition-all group/btn"
                  >
                    <ChevronLeft className="w-5 h-5 text-zinc-400 group-hover/btn:text-white" />
                  </button>
                  <button
                    onClick={() => scrollServices(lang === "ar" ? "left" : "right")}
                    className="p-3 rounded-full border border-white/10 hover:bg-[#0066FF] hover:border-[#0066FF] transition-all group/btn"
                  >
                    <ChevronRight className="w-5 h-5 text-zinc-400 group-hover/btn:text-white" />
                  </button>
                </div>
              </div>
            </div>
            <p className="text-zinc-500 max-w-sm md:text-end text-sm leading-relaxed">
              {t("capabilities.description")}
            </p>
          </div>

          <div className="h-px w-full bg-zinc-800/50 mb-10" />

          <div
            ref={servicesRef}
            className="flex flex-row gap-3 md:gap-6 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-8 h-full"
          >
            {capabilities.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="relative group pt-4 md:pt-8 shrink-0 w-[75vw] sm:w-[280px] md:w-[320px] snap-center"
              >
                {/* Layered Cards Effect behind */}
                <div className="absolute top-2 left-3 right-3 h-8 md:top-4 md:left-6 md:right-6 md:h-16 bg-white/5 rounded-2xl md:rounded-[32px] -z-10" />
                <div className="absolute top-4 left-2 right-2 h-8 md:top-7 md:left-4 md:right-4 md:h-16 bg-white/10 rounded-2xl md:rounded-[32px] -z-10" />

                {/* Main Card */}
                <div className={`relative rounded-3xl md:rounded-[32px] overflow-hidden ${i === 0 ? "bg-[#000000] border md:bg-[#0066FF] border-[#0066FF]" : "bg-[#111111]"} border border-white/10 shadow-2xl transition-all duration-500 h-full flex flex-col group/main`}>
                  <div className="p-6 md:p-8 border-b border-white/10 min-h-[100px] md:min-h-[130px] flex flex-col justify-center">
                    <h3 className="text-lg md:text-xl font-black text-white tracking-tight leading-tight mb-2">{t(`capabilities.cards.${item.key}.title`)}</h3>
                    <p className={`text-xs md:text-sm ${i === 0 ? "text-white" : "text-zinc-400"} font-medium line-clamp-2 leading-relaxed opacity-80`}>
                      {t(`capabilities.cards.${item.key}.description`)}
                    </p>
                  </div>

                  <div className="relative p-5 md:p-6 grow flex flex-col justify-end">
                    <div className="relative aspect-video w-full rounded-xl md:rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-inner">
                      <Image
                        src={item.image}
                        alt={item.key}
                        fill
                        className={`object-cover transition-transform duration-1000 ${i === 0 ? "opacity-100 grayscale-0" : "opacity-80 grayscale group-hover/main:grayscale-0 group-hover/main:opacity-100"} group-hover/main:scale-110`}
                      />
                    </div>

                    {/* Floating Button */}
                    <Link href={item.href || "#"}>
                      <button className={`absolute bottom-4 md:bottom-6 ${lang === "ar" ? "left-4 md:left-6" : "right-4 md:right-6"} p-2.5 md:p-3.5 rounded-full z-20 shadow-2xl transition-all duration-500 ${i === 0 ? "bg-[#0066FF] md:bg-white text-white md:text-[#0066FF]" : "bg-white/10 text-white backdrop-blur-xl border border-white/10 group-hover/main:bg-[#0066FF] group-hover/main:text-white group-hover/main:border-[#0066FF]"}`}>
                        <ArrowUpRight className={`w-4 h-4 md:w-5 md:h-5 ${lang === "ar" ? "-scale-x-100" : ""}`} />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Services CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 p-6 md:p-8 border border-white/5 bg-white/5 backdrop-blur-sm rounded-4xl flex flex-col xl:flex-row justify-between items-center gap-6"
          >
            <h3 className="text-xl md:text-2xl font-medium text-white tracking-tight text-center xl:text-start shrink-0">
              {lang === "ar" ? "دعنا نلقي نظرة على" : "Let's Have a Look at"} <span className="text-[#0066FF]">{lang === "ar" ? "خدماتنا" : "Our Services"}</span>
            </h3>
            <div className="flex flex-wrap items-center justify-center xl:justify-end gap-2 sm:gap-3 w-full">
              {[
                { name: "IT", href: "/services/it-accelerators" },
                { name: "Digital", href: "/services/digital" },
                { name: "Software", href: "/services/software" },
                { name: "Hardware", href: "/services/hardware" },
                { name: "Hosting & VPS", href: "/services/hosting-vps" },
              ].map((service, i) => (
                <Link key={i} href={service.href} className="w-auto flex-auto sm:flex-none">
                  <Button size="sm" className="w-full bg-white/5 hover:bg-[#0066FF] border border-white/10 hover:border-[#0066FF] text-white px-4 sm:px-6 py-5 md:py-6 rounded-full group transition-all duration-300 text-xs sm:text-sm font-medium">
                    {service.name}
                    <ArrowUpRight className={`ms-1.5 sm:ms-2 w-3 h-3 sm:w-4 sm:h-4 transition-transform ${lang === "ar" ? "group-hover:-translate-x-1 group-hover:-translate-y-1 -scale-x-100" : "group-hover:translate-x-1 group-hover:-translate-y-1"}`} />
                  </Button>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Store Section (Reference Style) */}
      <section className="relative z-20 py-16 md:py-24 px-4 md:px-6 lg:px-24 bg-black overflow-hidden border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          {isMounted ? (
            <Tabs defaultValue="all" className="w-full" dir={lang === "ar" ? "rtl" : "ltr"}>
              <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
                <div className="flex items-center gap-6">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <ShoppingBag className="w-6 h-6 text-[#0066FF]" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-5xl font-medium text-white tracking-tight">
                      {lang === "ar" ? "متجر" : "Featured"} <span className="text-[#0066FF]">{lang === "ar" ? "نكسيت" : "Store"}</span>
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-6 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md w-full md:w-auto relative">
                  <div className="w-full overflow-x-auto flex items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <TabsList className="bg-transparent border-none h-auto p-0 flex space-x-1 rtl:space-x-reverse min-w-max">
                      {storeTabs.map(tab => (
                        <TabsTrigger key={`trigger-${tab.id}`} value={tab.id} className="rounded-full px-4 md:px-6 py-2.5 text-xs md:text-sm font-medium data-[state=active]:bg-[#0066FF] data-[state=active]:text-white text-zinc-400 hover:text-white transition-all">
                          {lang === "ar" ? tab.labelAr : tab.labelEn}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2 border-s border-white/10 ps-2 md:ps-4 pe-1 md:pe-2 shrink-0">
                    <button 
                      onClick={() => {
                        // find the active tab and its carousel
                        const activeTab = document.querySelector('[role="tab"][data-state="active"]')?.getAttribute('value');
                        if (activeTab) {
                            const carousel = document.getElementById(`products-carousel-${activeTab}`);
                            if (carousel) carousel.scrollBy({ left: lang === 'ar' ? 320 : -320, behavior: 'smooth' });
                        }
                      }}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                    >
                      <ChevronLeft className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                    </button>
                    <button 
                       onClick={() => {
                        const activeTab = document.querySelector('[role="tab"][data-state="active"]')?.getAttribute('value');
                        if (activeTab) {
                            const carousel = document.getElementById(`products-carousel-${activeTab}`);
                            if (carousel) carousel.scrollBy({ left: lang === 'ar' ? -320 : 320, behavior: 'smooth' });
                        }
                      }}
                       className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                    >
                      <ChevronRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {storeTabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-0 outline-none focus:outline-none">
                  <div className="relative">
                    <div 
                      id={`products-carousel-${tab.id}`}
                      className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 pt-4 px-4 -mx-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                      {isProductsLoading ? (
                        [1, 2, 3, 4].map((n) => (
                          <div key={n} className="w-[240px] md:w-[280px] aspect-square bg-zinc-900 animate-pulse rounded-4xl snap-start shrink-0 flex-none" />
                        ))
                      ) : products.filter(tab.filter).length === 0 ? (
                        <div className="w-full py-20 text-center text-zinc-500">
                          {lang === 'ar' ? 'لا توجد منتجات حالياً' : 'No products found'}
                        </div>
                      ) : products.filter(tab.filter).map((product, i) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className="w-[240px] md:w-[280px] group relative bg-[#111111] rounded-2xl md:rounded-4xl overflow-hidden border border-white/5 hover:border-[#0066FF]/30 transition-all duration-500 flex flex-col snap-start shrink-0 flex-none"
                        >
                          <Link href={`/store/${product.id}`} className="relative aspect-square w-full overflow-hidden block">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100" />
                            ) : (
                              <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                                <ShoppingBag className="w-12 h-12 text-zinc-800" />
                              </div>
                            )}
                            <div className={`absolute top-2 md:top-4 ${lang === 'ar' ? 'right-2 md:right-4' : 'left-2 md:left-4'}`}>
                              <span className="px-2 py-0.5 md:px-3 md:py-1 bg-[#0066FF] rounded-full text-[7px] md:text-[9px] uppercase font-bold text-white shadow-lg">
                                 {CATEGORIES_MAP[product.category?.toLowerCase()]?.[lang] || product.category}
                              </span>
                            </div>
                            
                            {/* Action Overlays similar to store page */}
                            <div className={`absolute top-2 md:top-4 ${lang === "ar" ? "left-2 md:left-4" : "right-2 md:right-4"} flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300`}>
                                <button className="p-1.5 md:p-2 backdrop-blur-md border bg-black/40 border-white/10 text-white hover:bg-[#0066FF] hover:border-[#0066FF] rounded-full transition-all">
                                    <Heart className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                </button>
                                <button className="p-1.5 md:p-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-[#0066FF] hover:border-[#0066FF] transition-all">
                                    <Share2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                </button>
                            </div>
                          </Link>

                          <div className={`p-3 md:p-5 flex flex-col grow justify-between ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                            <div>
                                <Link href={`/store/${product.id}`}>
                                    <h3 className="text-sm md:text-base font-medium text-white mb-2 line-clamp-1 hover:text-[#0066FF] transition-colors">
                                        {lang === "ar" ? product.nameAr || product.name : product.name}
                                    </h3>
                                </Link>
                            </div>

                            <div className="flex flex-col mt-3 gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg md:text-xl font-bold text-white tracking-tight">{product.discountPrice || product.price} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                                {product.discountPrice && (
                                    <span className="text-xs md:text-sm text-zinc-500 line-through">{product.price} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 w-full">
                                <Link href={`/store/${product.id}`} className="flex-1">
                                  <Button size="sm" variant="outline" className="w-full rounded-full border-zinc-800 h-8 md:h-9 text-[11px] md:text-xs hover:bg-white hover:border-white hover:text-[#0066FF] dark:hover:bg-white dark:hover:text-[#0066FF] transition-all">
                                    {lang === "ar" ? "عرض" : "View"}
                                  </Button>
                                </Link>
                                <Link href={`/store/checkout?buyNow=${encodeURIComponent(JSON.stringify(product))}`} className="flex-1">
                                  <Button size="sm" className="w-full rounded-full bg-[#0066FF] h-8 md:h-9 text-[11px] md:text-xs text-white hover:bg-white hover:text-[#0066FF] dark:text-white dark:hover:bg-white dark:hover:text-[#0066FF] transition-all">
                                    {lang === "ar" ? "شراء" : "Buy"}
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="w-full space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl animate-pulse" />
                  <div className="w-48 h-10 bg-white/5 rounded-xl animate-pulse" />
                </div>
                <div className="w-64 h-12 bg-white/5 rounded-full animate-pulse" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="aspect-square bg-white/5 animate-pulse rounded-4xl" />
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 flex justify-center">
            <div className="flex gap-2">
              <div className="w-8 h-1 bg-[#0066FF] rounded-full" />
              <div className="w-2 h-1 bg-zinc-800 rounded-full" />
              <div className="w-2 h-1 bg-zinc-800 rounded-full" />
            </div>
          </div>

          {/* View All Store CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 p-6 md:p-8 border border-white/5 bg-white/5 backdrop-blur-sm rounded-4xl flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <h3 className="text-xl md:text-2xl font-medium text-white tracking-tight text-center md:text-start">
              {lang === "ar" ? "دعنا نلقي نظرة على" : "Let's Have a Look at"} <span className="text-[#0066FF]">{lang === "ar" ? "متجرنا" : "Our Store"}</span>
            </h3>
            <Link href="/store" className="w-full md:w-auto">
              <Button size="lg" className="w-full md:w-auto bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 py-6 rounded-full group transition-all duration-300">
                {lang === "ar" ? "رؤية المزيد" : "See More"}
                <ArrowUpRight className="ms-2 w-4 h-4 transition-transform group-hover:-translate-y-1 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>



      {/* Why Hire Me Section (Reference: Why You Hire Me) */}
      <section className="relative z-20 py-16 md:py-32 px-4 md:px-6 lg:px-24 bg-[#080808]/40 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-20">
          <div className="relative w-full max-w-sm md:max-w-md lg:w-1/2 mx-auto">

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-15, 15] }}
              transition={{ repeat: Infinity, duration: 3, repeatType: "reverse", ease: "easeInOut" }}
              className="absolute top-10 -right-4 md:right-10 z-20 bg-[#0066FF] p-3 md:p-4 rounded-xl md:rounded-2xl shadow-[0_0_30px_rgba(0,102,255,0.4)]"
            >
              <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </motion.div>

            <motion.div
              animate={{ y: [15, -15] }}
              transition={{ repeat: Infinity, duration: 3.5, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 md:bottom-20 -left-4 md:left-4 z-20 bg-zinc-900 border border-white/10 p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-2xl"
            >
              <Server className="w-8 h-8 md:w-10 md:h-10 text-[#0066FF]" />
            </motion.div>

            <motion.div
              animate={{ scale: [0.9, 1.1], opacity: [0.5, 1] }}
              transition={{ repeat: Infinity, duration: 4, repeatType: "reverse", ease: "easeInOut" }}
              className="absolute top-1/2 -left-4 md:-left-6 z-20 bg-white p-2 md:p-3 rounded-full shadow-xl"
            >
              <Cloud className="w-5 h-5 md:w-6 md:h-6 text-black" />
            </motion.div>

            <div className="relative z-10 w-full aspect-square rounded-full overflow-hidden border-4 md:border-8 border-zinc-900 shadow-2xl group">
              <Image src="/The-Nexit-Story.jpg" alt="The Nexit Story" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-linear-to-tr from-[#0066FF]/20 to-transparent mix-blend-overlay"></div>
            </div>
            {/* Decorative Light Blue Circle Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#0066FF]/10 rounded-full blur-[60px] md:blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-40 md:w-64 h-40 md:h-64 bg-[#0066FF]/20 rounded-full blur-[60px] md:blur-[80px] hidden md:block pointer-events-none" />
          </div>

          <div className="lg:w-1/2 text-center lg:text-start w-full">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4 text-[#0066FF] font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
              <Sparkles className="w-4 h-4" />
              {lang === "ar" ? "لماذا نكسيت؟" : "Why Choose Nexit?"}
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium mb-6 md:mb-8 leading-tight">
              {lang === "ar" ? "شريكك في " : "Your Partner in "} <span className="text-[#0066FF]">{lang === "ar" ? "التحول الرقمي" : "Digital Transformation"}</span>
            </h2>
            <p className="text-zinc-500 text-sm md:text-lg mb-10 md:mb-12 leading-relaxed">
              {t("why_us.description")}
            </p>

            <div className="grid grid-cols-2 gap-6 md:gap-10 mb-10 md:mb-12">
              <div className="flex flex-col items-center lg:items-start">
                <p className="text-3xl md:text-4xl font-light text-white mb-2">50+</p>
                <p className="text-[9px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{t("why_us.metrics.projects")}</p>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <p className="text-3xl md:text-4xl font-light text-white mb-2">10+</p>
                <p className="text-[9px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{t("why_us.metrics.experience")}</p>
              </div>
            </div>

            {/* About Us CTA (Replacing the button) */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 p-6 md:p-8 border border-white/5 bg-white/5 backdrop-blur-sm rounded-4xl flex flex-col md:flex-row justify-between items-center gap-6"
            >
              <h3 className="text-xl font-medium text-white tracking-tight text-center md:text-start lg:text-lg xl:text-xl">
                {lang === "ar" ? "تعرف أكثر على" : "Learn More About"} <span className="text-[#0066FF]">{lang === "ar" ? "هوية نكسيت" : "Nexit Identity"}</span>
              </h3>
              <Link href="/nexit-land/" className="w-full md:w-auto">
                <Button size="lg" className="w-full md:w-auto bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 py-5 rounded-full group transition-all duration-300">
                  {lang === "ar" ? "عن الشركة" : "About Company"}
                  <ArrowUpRight className={`ms-2 w-4 h-4 transition-transform group-hover:-translate-y-1 ${lang === "ar" ? "-scale-x-100 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Moving Marquee (Inter-section decoration) */}
      <div className="relative z-20 bg-[#0066FF] py-6 overflow-hidden -rotate-2 -mx-10 shadow-2xl">
        <div className="flex gap-20 animate-marquee whitespace-nowrap">
          {[...techIcons, ...techIcons, ...techIcons].map((item, i) => (
            <div key={i} className="flex items-center gap-4 text-white font-black text-2xl uppercase tracking-[0.2em] italic">
              <span>{lang === "ar" ? item.arName : item.name}</span>
              <Star className="fill-white w-6 h-6" />
            </div>
          ))}
        </div>
      </div>

      {/* Experience Section (Reference: My Work Experience) */}
      <section className="relative z-20 py-16 md:py-32 px-4 md:px-6 lg:px-24 mt-12 md:mt-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-[-50%] pointer-events-none -z-10 flex items-center justify-center">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-linear-to-r from-[#0066FF]/20 via-[#0066FF]/10 to-transparent rounded-full blur-[100px]"
          />
        </div>

        <div className="text-center mb-16 md:mb-24 relative z-10">
          <h2 className="text-2xl md:text-5xl font-medium mb-4">
            {lang === "ar" ? "مسيرتنا" : "Our Journey"} & <span className="text-[#0066FF]">{lang === "ar" ? "خبراتنا" : "Expertise"}</span>
          </h2>
          {/* journey controls - mobile only */}
          <div className="flex md:hidden items-center justify-center gap-4 mt-6">
            <button
              onClick={() => scrollJourney(lang === "ar" ? "right" : "left")}
              className="p-3 rounded-full border border-zinc-800 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => scrollJourney(lang === "ar" ? "left" : "right")}
              className="p-3 rounded-full border border-zinc-800 hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div
          ref={journeyRef}
          className="max-w-4xl mx-auto flex flex-row md:flex-col gap-6 md:gap-16 relative overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {/* Vertical Line on Desktop */}
          <div className="absolute left-[50%] top-0 bottom-0 w-px bg-zinc-800 hidden md:block" />
          {/* Horizontal Line on Mobile */}
          <div className="absolute left-0 right-0 top-[64px] h-px bg-zinc-800 block md:hidden pointer-events-none" />

          {(t("experience.items") as unknown as any[]).map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className={`flex flex-col md:flex-row items-center gap-4 md:gap-10 shrink-0 md:shrink w-[85vw] sm:w-[320px] md:w-full snap-center ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
            >
              <div className={`w-full md:flex-1 text-center flex items-end md:items-center justify-center h-[40px] md:h-auto ${i % 2 !== 0 ? "md:justify-start" : "md:justify-end"}`}>
                <p className={`text-lg font-bold text-[#0066FF] md:text-white ${i % 2 !== 0 ? "md:text-start" : "md:text-end"}`}>{exp.date}</p>
              </div>

              {/* Dot */}
              <div className="z-10 w-4 h-4 rounded-full bg-[#0066FF] border-4 border-black ring-4 ring-zinc-900 shrink-0" />

              <div className={`w-full md:flex-1 px-4 md:px-0 text-center ${i % 2 !== 0 ? "md:text-end" : "md:text-start"}`}>
                <h3 className={`text-lg md:text-xl font-bold mb-2 md:mb-3`}>{exp.role}</h3>
                <p className={`text-zinc-500 text-xs md:text-sm leading-relaxed`}>{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Portfolio Slider (Reference: Portfolio Layout) */}
      <section className="relative z-20 pt-16 md:pt-32 pb-8 md:pb-16 px-4 md:px-6 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-24 gap-6 md:gap-8">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-white/5 rounded-2xl">
              <Star className="w-6 h-6 text-[#0066FF]" />
            </div>
            <div>
              <h2 className="text-2xl md:text-5xl font-medium text-white tracking-tight">
                {lang === "ar" ? "قصص" : "Our"} <span className="text-[#0066FF]">{lang === "ar" ? "نجاحنا" : "Success Stories"}</span>
              </h2>
            </div>
          </div>
          <Link href="/resources/case-studies" className="hidden md:flex items-center justify-center border-zinc-800 rounded-full p-4 h-14 w-14 hover:bg-white/10">
            <ArrowRight className={`${lang === "ar" ? "rotate-180" : ""}`} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {Object.values(CASE_STUDIES_DATA).slice(0, 4).map((project, i) => (
            <Link
              key={i}
              href={`/resources/case-studies/${project.slug}`}
              className="relative group rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-900 aspect-square shadow-2xl cursor-pointer border border-white/5 hover:border-[#0066FF]/30 transition-all"
            >
              <Image
                src={project.logo}
                alt={project.partner}
                fill
                className="object-cover group-hover:scale-110 transition-all duration-1000 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-90 transition-opacity duration-500" />

              {/* Top Right Action Button */}
              <div className={`absolute top-3 md:top-6 ${lang === "ar" ? "left-3 md:left-6" : "right-3 md:right-6"} opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-10`}>
                <div className="p-2 md:p-3 rounded-full bg-white text-black shadow-2xl hover:scale-110 active:scale-95 transition-transform">
                  <ArrowUpRight className={`w-3 h-3 md:w-4 md:h-4 ${lang === "ar" ? "-scale-x-100" : ""}`} />
                </div>
              </div>

              <div className={`absolute bottom-3 md:bottom-8 ${lang === "ar" ? "right-3 md:right-8 text-right" : "left-3 md:left-8 text-left"} ${lang === "ar" ? "left-3 md:left-8" : "right-3 md:right-8"} z-10`}>
                <span className={`bg-[#0066FF] text-white px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[7px] md:text-[9px] uppercase font-black mb-1.5 md:mb-3 inline-block shadow-lg`}>
                  {project.cat}
                </span>
                <h3 className="text-xs sm:text-sm md:text-xl lg:text-2xl font-black text-white leading-tight md:leading-snug">
                  {project.partner}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Portfolio CTA (Mobile Only) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 p-6 md:p-8 border border-white/5 bg-white/5 backdrop-blur-sm rounded-4xl flex md:hidden flex-col items-center gap-6"
        >
          <h3 className="text-xl font-medium text-white tracking-tight text-center">
            {lang === "ar" ? "دعنا نلقي نظرة على" : "Let's Have a Look at"} <span className="text-[#0066FF]">{lang === "ar" ? "أعمالنا" : "Our Projects"}</span>
          </h3>
          <Link href="/resources/case-studies" className="w-full">
            <Button size="lg" className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 py-6 rounded-full group transition-all duration-300">
              {lang === "ar" ? "رؤية المزيد" : "See More"}
              <ArrowUpRight className={`ms-2 w-4 h-4 transition-transform group-hover:-translate-y-1 ${lang === "ar" ? "-scale-x-100 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Client Logos Marquee */}
      <section className="relative z-20 py-20 bg-black border-y border-white/5 overflow-hidden">
        <div className="text-center mb-12">
          <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">{lang === "ar" ? "شركاء النجاح الموثوق بهم" : "Trusted by industry leaders"}</p>
        </div>

        {/* Shadow Overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-black to-transparent z-10 pointer-events-none" />

        <div className="flex gap-32 animate-marquee whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity duration-500">
          {[
            { name: "Albkht Company", src: "/partners/Albkht-company.jpg" },
            { name: "Hainan Soliman", src: "/partners/Hainan-Soliman.jpg" },
            { name: "Vesper Group", src: "/partners/Vesper group.jpg" },
            { name: "Viva Egypt Travel", src: "/partners/Viva egypttravel.jpg" },
            { name: "Arkan", src: "/partners/arkan.jpg" },
            { name: "Onestaeg Hurghada", src: "/partners/onestaeg hurghada.jpg" },
            { name: "Pencil", src: "/partners/pencil.jpg" },
            { name: "Pioneer Construction", src: "/partners/pioneer construction.jpg" },
            { name: "Taxidia", src: "/partners/taxidia.jpg" },
            { name: "Withinsky", src: "/partners/withinsky.jpg" },
            { name: "Rivoli Suites", src: "/partners/rivoli-suites.jpg" },
            { name: "Rivoli Spa", src: "/partners/rivoli-spa.jpg" },
          ].map((logo, i) => (
            <div key={i} className="flex items-center justify-center shrink-0">
              <img
                src={logo.src}
                alt={logo.name}
                className="h-24 md:h-32 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-500 brightness-125"
              />
            </div>
          ))}
          {/* Double for continuous marquee */}
          {[
            { name: "Albkht Company", src: "/partners/Albkht-company.jpg" },
            { name: "Hainan Soliman", src: "/partners/Hainan-Soliman.jpg" },
            { name: "Vesper Group", src: "/partners/Vesper group.jpg" },
            { name: "Viva Egypt Travel", src: "/partners/Viva egypttravel.jpg" },
            { name: "Arkan", src: "/partners/arkan.jpg" },
            { name: "Onestaeg Hurghada", src: "/partners/onestaeg hurghada.jpg" },
            { name: "Pencil", src: "/partners/pencil.jpg" },
            { name: "Pioneer Construction", src: "/partners/pioneer construction.jpg" },
            { name: "Taxidia", src: "/partners/taxidia.jpg" },
            { name: "Withinsky", src: "/partners/withinsky.jpg" },
            { name: "Rivoli Suites", src: "/partners/rivoli-suites.jpg" },
            { name: "Rivoli Spa", src: "/partners/rivoli-spa.jpg" },
          ].map((logo, i) => (
            <div key={i + 12} className="flex items-center justify-center shrink-0">
              <img
                src={logo.src}
                alt={logo.name}
                className="h-24 md:h-32 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-500 brightness-125"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials (Reference: Testimonials) */}
      <section className="relative z-20 py-16 md:py-32 px-4 md:px-6 lg:px-24 bg-[#080808]/60 text-center overflow-hidden">
        {/* Animated Background Quote Icon */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none -translate-y-12">
          <motion.div
            animate={{
              y: [-15, 15, -15],
              rotate: [-5, 5, -5],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Quote className="w-40 h-40 md:w-64 md:h-64 text-white/3 fill-white/3" />
          </motion.div>
        </div>

        <div className="relative z-10 mb-12 md:mb-20">
          <h2 className="text-2xl md:text-6xl font-medium mb-4 md:mb-6">
            {lang === "ar" ? "آراء " : "Partner "} <span className="text-[#0066FF]">{lang === "ar" ? "شركائنا" : "Feedback"}</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {t("testimonials.description")}
          </p>
        </div>

        <div
          className="relative h-[800px] overflow-hidden flex flex-col items-center"
          style={{
            maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full max-w-7xl mx-auto px-4 h-[150%]">
            {[0, 1, 2].map((colIndex) => {
              const columnTestimonials = [
                { id: 1, text: lang === "ar" ? "نكسيت نظمت لنا سيرفرات الحجز وربطت شبكات الفندق بالكامل. السرعة والأمان بقوا ممتازين، وخدمة العملاء معانا على مدار الساعة." : "Nexit organized our booking servers and interconnected the entire hotel's networks. Speed and security are now excellent with 24/7 support.", name: lang === "ar" ? "محمد طارق" : "Mohamed Tarek", role: lang === "ar" ? "مدير الـ IT، ريفولي سويتس" : "IT Manager, Rivoli Suites" },
                { id: 2, text: lang === "ar" ? "السيرفرات عندنا كانت بتقع وقت المواسم السياحية، لكن بعد شغل نكسيت، السيستم مستقر جداً ومبيقعش تحت أي ضغط مهما كان عداد الحجوزات." : "Our servers used to crash during peak tourist seasons, but after Nexit's work, the system is rock solid and doesn't fail under pressure.", name: lang === "ar" ? "ياسمين عادل" : "Yasmine Adel", role: lang === "ar" ? "مدير العمليات، فيفا إيجيبت" : "Operations Manager, Viva Egypt" },
                { id: 3, text: lang === "ar" ? "نقلنا كل بياناتنا وقاعدة عملاء المقاولات على أنظمة سحابية مؤمنة عن طريق نكسيت. الدعم التقني بتاعهم ممتاز وسريع جداً." : "We moved all our construction project data to secure cloud systems through Nexit. Their technical support is fast and excellent.", name: lang === "ar" ? "كريم نبيل" : "Kareem Nabil", role: lang === "ar" ? "مدير المشروعات، بايونير للمقاولات" : "Project Manager, Pioneer Construction" },
                { id: 4, text: lang === "ar" ? "ربطنا أكتر من 5 فروع ببعض عن طريق شبكات مقفولة وآمنة. شغل نكسيت محترف ووفر علينا وقت ومجهود كبير في إدارة الشركة." : "We connected over 5 branches together via closed, highly secure networks. Nexit's work is professional and saved us time.", name: lang === "ar" ? "هشام فوزي" : "Hisham Fawzy", role: lang === "ar" ? "رئيس التكنولوجيا، فيسبر جروب" : "Head of IT, Vesper Group" },
                { id: 5, text: lang === "ar" ? "تجهيز الكاميرات وأنظمة الحماية في الفندق تم بأعلى جودة. فريق نكسيت فنيين فاهمين شغلهم وتوريداتهم دايماً في الميعاد." : "The installation of cameras and security systems in our hotels was done with top quality. Nexit's team delivers on time.", name: lang === "ar" ? "رانيا محمود" : "Rania Mahmoud", role: lang === "ar" ? "مشرف الـ IT، أونستيج الغردقة" : "IT Supervisor, Onestaeg Hurghada" },
                { id: 6, text: lang === "ar" ? "أجهزة الكمبيوتر والسيرفرات اللي استلمناها من نكسيت شغالة بكفاءة عالية في كل فروعنا. فريقهم متميز في الاستجابة للأعطال." : "The computers and servers we received from Nexit operate with high efficiency across all our branches. Their response time is great.", name: lang === "ar" ? "عمرو صلاح" : "Amr Salah", role: lang === "ar" ? "مسؤول الشبكات، أركان" : "Network Admin, Arkan" },
                { id: 7, text: lang === "ar" ? "أنظمة السبا والويلنس عندنا بقت ذكية وبسيطة في إدارتها بفضل حلول نكسيت التقنية، فعلاً نقلوا التجربة لمستوى تاني." : "Our Spa & Wellness systems became smart and simple to manage thanks to Nexit's tech solutions. Truly next level.", name: lang === "ar" ? "ليلى سليم" : "Layla Selim", role: lang === "ar" ? "مديرة العمليات، ريفولي سبا" : "Operations Director, Rivoli Spa" },
                { id: 8, text: lang === "ar" ? "استلمنا أجهزة لابتوب ووركس تيشن احترافية من نكسيت لمصممينا. الأداء جبار والتوريد كان في وقت قياسي." : "We received pro laptops and workstations from Nexit for our designers. The performance is massive and delivery was fast.", name: lang === "ar" ? "أحمد مراد" : "Ahmed Mourad", role: lang === "ar" ? "المدير الإبداعي، بنسل" : "Creative Director, Pencil" },
                { id: 9, text: lang === "ar" ? "نكسيت قدموا لنا حلول أتمتة لعملياتنا التجارية وفرت علينا 40% من الوقت الضايع في المعاملات اليدوية. احترافية عالية." : "Nexit provided automation solutions that saved 40% of manual processing time. High professionalism.", name: lang === "ar" ? "سامح البخت" : "Sameh Albkht", role: lang === "ar" ? "المدير العام، شركة البخت" : "General Manager, Albkht Co." },
                { id: 10, text: lang === "ar" ? "بفضل البنية التحتية اللي صممتها نكسيت، منصة الحجز بتاعتنا بقت بتستوعب آلاف الزوار في نفس اللحظة بدون أي تأخير." : "Thanks to Nexit's infrastructure, our travel platform handles thousands of concurrent users with zero lag.", name: lang === "ar" ? "هاني سليمان" : "Hani Soliman", role: lang === "ar" ? "مؤسس، هاينان سليمان" : "Founder, Hainan Soliman" },
                { id: 11, text: lang === "ar" ? "دعم نكسيت التقني لمنظومة الشحن واللوجستيات عندنا كان هو المفتاح للتوسع في أكتر من مدينة بسرعة وكفاءة هائلة." : "Nexit's technical support for our shipping systems was key to expanding across multiple cities efficiently.", name: lang === "ar" ? "محمود عزمي" : "Mahmoud Azmy", role: lang === "ar" ? "مدير اللوجيستيات، تاكسيديا" : "Logistics Manager, Taxidia" },
                { id: 12, text: lang === "ar" ? "تعاوننا مع نكسيت في تطوير أنظمة المراقبة الذكية أعطانا راحة بال كاملة بخصوص أمن مقراتنا وفروعنا." : "Teaming up with Nexit for smart surveillance gave us complete peace of mind regarding our facility security.", name: lang === "ar" ? "نور الدين" : "Nour El-Din", role: lang === "ar" ? "رئيس الأمن، ويذ إن سكاي" : "Security Lead, Within Sky" },
              ];

              // Variations per column without breaking hydration (Math.random causes mismatches)
              const displayTestimonials = [...columnTestimonials.slice(colIndex), ...columnTestimonials.slice(0, colIndex)];

              return (
                <motion.div
                  key={colIndex}
                  animate={{
                    y: colIndex % 2 === 0 ? ["-50%", "0%"] : ["0%", "-50%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 30 + (colIndex * 5), // slightly different speeds
                    ease: "linear",
                  }}
                  className="flex flex-col gap-6 lg:gap-8 pt-10"
                >
                  {[...displayTestimonials, ...displayTestimonials].map((testimonial, i) => (
                    <div
                      key={i}
                      className="p-8 rounded-4xl bg-[#111111] border border-white/10 shadow-xl hover:border-[#0066FF]/30 transition-colors"
                    >
                      <p className="text-sm md:text-base text-zinc-300 leading-relaxed mb-8">
                        {testimonial.text}
                      </p>
                      <div>
                        <p className="font-bold text-white text-base">{testimonial.name}</p>
                        <p className="text-xs text-zinc-500">{testimonial.role}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Section (Reference: Blog Post) */}
      <section className="relative z-20 py-16 md:py-32 px-4 md:px-6 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-24 gap-6 md:gap-8">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-white/5 rounded-2xl">
              <Star className="w-6 h-6 text-[#0066FF]" />
            </div>
            <div>
              <h2 className="text-2xl md:text-5xl font-medium text-white tracking-tight">
                {lang === "ar" ? "أحدث" : "Latest"} <span className="text-[#0066FF]">{lang === "ar" ? "المقالات" : "Insights"}</span>
              </h2>
            </div>
          </div>
          <Link href="/resources/tech-insights" className="hidden md:block text-xs font-black uppercase tracking-widest border-b border-white hover:text-zinc-400 transition-colors">
            {isAr ? "جميع المقالات" : "View All Insights"}
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {Object.values(ARTICLES_CONTENT).slice(0, 4).map((article, i) => (
            <Link key={i} href={`/resources/tech-insights/${article.slug}`} className="group block">
              <motion.div whileHover={{ y: -10 }}>
                <div className="relative aspect-square rounded-2xl md:rounded-4xl overflow-hidden mb-3 md:mb-8 border border-white/5 bg-zinc-900 shadow-xl group-hover:border-[#0066FF]/30 transition-all">
                  <Image src={article.image} alt={isAr ? article.title_ar : article.title_en} fill className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-90 transition-opacity duration-500" />
                  <div className="absolute top-3 md:top-6 left-3 md:left-6 flex flex-col gap-2 z-10">
                    <span className="bg-[#0066FF] text-white px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[7px] md:text-[9px] uppercase font-bold w-fit shadow-lg">{article.cat}</span>
                  </div>
                  <div className={`absolute bottom-3 md:bottom-6 z-10 ${lang === "ar" ? "left-3 md:left-6" : "right-3 md:right-6"}`}>
                    <div className="p-2 md:p-3 rounded-full bg-white text-black shadow-2xl group-hover:bg-[#0066FF] group-hover:text-white transition-colors">
                      <ArrowUpRight className={`w-3 h-3 md:w-4 md:h-4 ${lang === "ar" ? "-scale-x-100" : ""}`} />
                    </div>
                  </div>
                </div>
                <p className="text-[8px] md:text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1.5 md:mb-4">{article.date} • {article.readTime}</p>
                <h3 className={`text-xs sm:text-sm md:text-xl font-bold group-hover:text-[#0066FF] transition-colors leading-tight md:leading-tight line-clamp-2 ${lang === "ar" ? "text-right" : "text-left"}`}>
                  {isAr ? article.title_ar : article.title_en}
                </h3>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* View All Blog CTA (Mobile Only) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 p-6 md:p-8 border border-white/5 bg-white/5 backdrop-blur-sm rounded-4xl flex md:hidden flex-col items-center gap-6"
        >
          <h3 className="text-xl font-medium text-white tracking-tight text-center">
            {lang === "ar" ? "دعنا نلقي نظرة على" : "Let's Have a Look at"} <span className="text-[#0066FF]">{lang === "ar" ? "مقالاتنا" : "Our Articles"}</span>
          </h3>
          <Link href="/resources/tech-insights" className="w-full">
            <Button size="lg" className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 py-6 rounded-full group transition-all duration-300">
              {lang === "ar" ? "رؤية المزيد" : "See More"}
              <ArrowUpRight className={`ms-2 w-4 h-4 transition-transform group-hover:-translate-y-1 ${lang === "ar" ? "-scale-x-100 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* NexBot AI Section */}
      <NexBotAI />
    </main >
  )
}
