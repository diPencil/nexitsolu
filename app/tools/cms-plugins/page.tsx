"use client"

import { useLanguage } from "@/lib/i18n-context"
import { PageHero } from "@/components/page-hero"
import { PageSection } from "@/components/page-section"
import { motion } from "framer-motion"
import { NexBotAI } from "@/components/nexbot-ai"
import { Puzzle, PenTool, Layout, Rocket, ShoppingBag, Shield, Settings, MonitorSmartphone } from "lucide-react"

export default function CMSPlugins() {
    const { lang, t } = useLanguage()

    const platforms = [
        { icon: Puzzle, title: "WordPress", desc: lang === "ar" ? "تطوير إضافات مخصصة (Plugins) وتعديل قوالب لتلبية احتياجاتك الخاصة وتحسين الأداء." : "Developing custom plugins and themes to meet your specific needs and improve performance.", color: "text-[#21759b]" },
        { icon: ShoppingBag, title: "Magento & Shopify", desc: lang === "ar" ? "حلول تجارة إلكترونية متكاملة مع إضافات تساعد في زيادة المبيعات وإدارة المخزون بذكاء." : "Integrated e-commerce solutions with extensions to boost sales and manage inventory smartly.", color: "text-[#f26d21]" },
        { icon: Layout, title: "Custom CMS", desc: lang === "ar" ? "بناء نظام إدارة محتوى (CMS) من الصفر، مصمم خصيصاً ليناسب سير عمل مؤسستك وبنية بياناتك." : "Building a tailor-made CMS from scratch, designed specifically to fit your workflow and data structure.", color: "text-[#0066FF]" },
        { icon: Rocket, title: "Headless CMS", desc: lang === "ar" ? "فصل الواجهة الأمامية عن الخلفية لتقديم سرعة مذهلة وتجربة مستخدم لا تضاهى على كل الأجهزة." : "Decoupling front-end from back-end to deliver blazing speed and unmatched UX across all devices.", color: "text-purple-500" },
    ]

    return (
        <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-[#050505] min-h-screen overflow-hidden">
            <PageHero
                title={t("tools_pages.cms.hero_title")}
                subtitle={t("tools_pages.cms.hero_subtitle")}
            />

            <section className="py-24 border-y border-white/5 bg-white/3 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
                    <MonitorSmartphone className="w-16 h-16 text-[#0066FF] mx-auto mb-8 opacity-60" />
                    <p className="text-2xl md:text-4xl text-white mb-6 leading-relaxed font-light">
                        {lang === "ar" ? "نأخذ منصتك إلى ما هو أبعد من القوالب الجاهزة." : "We take your platform far beyond off-the-shelf templates."}
                    </p>
                    <p className="text-lg text-zinc-400">
                        {t("tools_pages.api.content")}
                    </p>
                </div>
            </section>

            <PageSection title={lang === "ar" ? "منصات ندعمها ونطورها" : "Platforms We Support & Develop"}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {platforms.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group relative h-full p-8 md:p-10 rounded-4xl bg-[#080808] border border-white/5 hover:bg-[#111] hover:border-white/10 transition-all duration-500 text-center flex flex-col justify-start items-center shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-[#0066FF]/10 transition-colors pointer-events-none" />
                            <div className="relative z-10 p-5 bg-white/5 rounded-3xl mb-8 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 border border-white/5">
                                <item.icon className={`w-12 h-12 ${item.color} group-hover:text-white transition-colors`} />
                            </div>
                            <h3 className="relative z-10 text-xl font-bold text-white mb-4 group-hover:text-[#0066FF] transition-colors">{item.title}</h3>
                            <p className="relative z-10 text-zinc-400 leading-relaxed text-sm md:text-base">{item.desc}</p>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#0066FF] opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-700" />
                        </motion.div>
                    ))}
                </div>
            </PageSection>

            <PageSection className="bg-white/3 py-32 border-y border-white/5" columns={2}>
                <div className="relative order-2 md:order-1 flex items-center justify-center min-h-[600px]">
                    <style jsx>{`
                        .main-wrapper {
                            position: relative;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            width: 100%;
                            height: 100%;
                        }
                        .main {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            scale: 1.8;
                            position: relative;
                            z-index: 10;
                        }
                        @media (min-width: 1024px) {
                            .main { scale: 2.8; }
                        }
                        #pizza {
                            background-color: transparent;
                            transform-origin: center center;
                            animation: rotate 45s linear infinite;
                            filter: drop-shadow(0 0 30px rgba(238, 151, 88, 0.2));
                        }
                        #slice1 { animation: slice1 4s ease-in-out infinite; animation-delay: 0s; }
                        #slice2 { animation: slice2 4s ease-in-out infinite; animation-delay: 1s; }
                        #slice3 { animation: slice3 4s ease-in-out infinite; animation-delay: 2s; }
                        #slice4 { animation: slice4 4s ease-in-out infinite; animation-delay: 3s; }
                        #slice5 { animation: slice5 4s ease-in-out infinite; animation-delay: 4s; }
                        #slice6 { animation: slice6 4s ease-in-out infinite; animation-delay: 5s; }

                        @keyframes rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                        @keyframes slice1 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(5%, 5%); } }
                        @keyframes slice2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(0%, 7%); } }
                        @keyframes slice3 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-5%, 5%); } }
                        @keyframes slice4 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-5%, 0%); } }
                        @keyframes slice5 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(0%, -3%); } }
                        @keyframes slice6 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(5%, 0%); } }
                    `}</style>
                    <div className="main-wrapper">
                        <div className="absolute w-[400px] h-[400px] bg-[#EE9758]/5 rounded-full blur-[100px] z-0" />
                        <div className="main">
                            <svg width="168" height="158" viewBox="0 0 168 158" fill="none" xmlns="http://www.w3.org/2000/svg" id="pizza">
                                <g id="slice6">
                                    <path d="M110 34.8997C118.513 39.4198 125.582 45.921 130.497 53.75C135.412 61.579 138 70.4598 138 79.5L82 79.5L110 34.8997Z" fill="#FDDBA9" stroke="#EE9758" strokeWidth="2" />
                                    <circle cx="114" cy="63" r="6" fill="#F12424" />
                                    <path d="M96.3127 75.3748C93.8388 74.3499 93.5395 72.1249 96.4349 66.9246C100.861 64.107 105.48 66.5248 103.603 67.4062C101.726 68.2876 101.517 69.215 101.78 69.3984C101.78 69.3984 105.126 71.2856 104.991 72.8193C104.856 74.353 103.753 74.1725 103.409 74.5483C103.066 74.9242 99.9579 71.3905 99.9579 71.3905C96.0194 74.1256 98.7867 76.3997 96.3127 75.3748Z" fill="#E3DDDD" stroke="black" strokeWidth="0.5" />
                                    <path d="M129.841 65.2587C127.54 64.2211 127.021 63.5697 127.016 62.3249C128.094 61.8629 129.071 62.3249C130.14 62.8474 130.783 63.5952 131.961 65.2587C130.895 67.8704 129.392 69.2403C131.161 70.4193 131.961 72.3837C129.071 77.9719 127.016 76.994C126.863 74.9998 129.841 72.3837C127.016 69.2403 129.841 65.2587Z" fill="#FFFBFB" stroke="black" strokeWidth="0.5" />
                                    <path d="M121.34 55.4341C123.716 54.3509 125.824 55.2995C124.578 56.9337 120.055 57.1194C118.855 55.39 117.853 52.2096 113.327 51.9889C110.695 46.5489 109.803 45.6669 111.972 44.7368C114.612 50.3036 116.554 49.6053 119.294 50.32C121.34 55.4341Z" fill="#1EAA07" stroke="#FDDBA9" strokeWidth="0.5" />
                                </g>
                                <g id="slice5">
                                    <path d="M54 34.8997C62.5131 30.3796 72.1699 28 82 28C91.8301 28 101.487 30.3796 110 34.8997L82 79.5L54 34.8997Z" fill="#FDDBA9" stroke="#EE9758" strokeWidth="2" />
                                    <circle cx="82" cy="56" r="6" fill="#F12424" />
                                    <path d="M91.3127 43.3748C88.8388 42.3499 91.4349 34.9246C95.8614 32.107 100.48 34.5248 98.603 35.4062C96.7261 36.2876 96.7805 37.3984 99.9914 40.8193C98.4095 42.5483 94.9579 39.3905 91.3127 43.3748Z" fill="#E3DDDD" stroke="black" strokeWidth="0.5" />
                                    <path d="M92.1727 48.6661C93.9594 46.7623 96.27 46.8398C95.7373 48.8247 91.6233 50.713 87.7226 47.0063C83.4516 48.52 77.7915 44.0087 79.4458 42.3247C81.7725 42.7912 84.0009 46.473 88.3386 44.7112C90.034 45.1171 92.1727 48.6661Z" fill="#1EAA07" stroke="#FDDBA9" strokeWidth="0.5" />
                                    <path d="M70.8415 37.2587C68.5397 36.2211 68.0156 34.3249 70.0708 34.3249C71.1402 34.8474 72.9609 37.2587C71.8954 39.8704 70.3919 41.2403C72.9609 44.3837 70.0708 49.9719C68.0156 48.994C67.8631 46.9998 70.8415 44.3837C68.0156 41.2403 70.8415 37.2587Z" fill="#FFFBFB" stroke="black" strokeWidth="0.5" />
                                </g>
                                <g id="slice1">
                                    <path d="M138 79.5C138 88.5401 135.412 97.421 130.497 105.25C125.582 113.079 118.513 119.58 110 124.1L82 79.5H138Z" fill="#FDDBA9" stroke="#EE9758" strokeWidth="2" />
                                    <circle cx="119" cy="99" r="6" fill="#F12424" />
                                    <path d="M110.227 89.6851C111.587 87.456 113.864 87.0589C113.749 89.1109 110.109 91.8011 105.532 88.9712C101.661 91.3269 95.1975 88.0694 96.4722 86.0825C98.8451 86.063 101.78 89.2108 105.665 86.5986C110.227 89.6851Z" fill="#1EAA07" stroke="#FDDBA9" strokeWidth="0.5" />
                                    <path d="M108.882 106.032C106.425 106.612 104.854 105.427C106.484 104.175 108.615 104.139 110.563 104.741C110.951 109.463 114.904 110.391 116.016 116.583C113.791 117.06 112.455 114.225 113.223 111.682C110.911 110.911 108.882 106.032Z" fill="#FFFBFB" stroke="black" strokeWidth="0.5" />
                                </g>
                                <g id="slice2">
                                    <path d="M110 124.1C101.487 128.62 91.8301 131 82 131C72.1699 131 62.5131 128.62 54 124.1L82 79.5L110 124.1Z" fill="#FDDBA9" stroke="#EE9758" strokeWidth="2" />
                                    <circle cx="78" cy="103" r="6" fill="#F12424" />
                                    <path d="M86.3127 117.375C83.8388 116.35 86.4349 108.925C90.8614 106.107 93.603 109.406 91.7805 111.398C94.9914 114.819 93.4095 116.548 89.9579 113.391C86.3127 117.375Z" fill="#E3DDDD" stroke="black" strokeWidth="0.5" />
                                    <path d="M78.1727 124.666C79.9594 122.762 82.27 122.84 81.7373 124.825C77.6233 126.713 73.7226 123.006 69.4516 124.52C63.7915 120.009 65.4458 118.325 70.0009 122.473C74.3386 120.711 78.1727 124.666Z" fill="#1EAA07" stroke="#FDDBA9" strokeWidth="0.5" />
                                    <path d="M84.2386 90.8992C81.7811 91.4786 80.2103 90.2943C81.8401 89.0422 83.9717 89.0064 85.9193 89.608C86.3078 94.3305 90.26 95.258C91.3727 101.45C89.1471 101.927 88.5793 96.5492 84.4234 95.7782C84.2386 90.8992Z" fill="#FFFBFB" stroke="black" strokeWidth="0.5" />
                                </g>
                                <g id="slice4">
                                    <path d="M26 79.5C26 70.4599 28.5876 61.579 33.5026 53.75C38.4176 45.921 45.4869 39.4198 54 34.8997L82 79.5L26 79.5Z" fill="#FDDBA9" stroke="#EE9758" strokeWidth="2" />
                                    <circle cx="64" cy="70" r="6" fill="#F12424" />
                                    <path d="M43.3127 61.3748C40.8388 60.3499 43.4349 52.9246C47.8614 50.107 50.603 53.4062 48.7805 55.3984C51.9914 58.8193 50.4095 60.5483 46.9579 57.3905C43.3127 61.3748Z" fill="#E3DDDD" stroke="black" strokeWidth="0.5" />
                                    <path d="M57.8415 50.8697C55.0156 47.3859 57.0708 47.3859 59.9609 50.8697C57.3919 55.5979 59.9609 59.3306 57.0708 65.9666C55.0156 64.8053 57.8415 59.3306 55.0156 55.5979C57.8415 50.8697Z" fill="#1EAA07" stroke="#FDDBA9" strokeWidth="0.5" />
                                    <path d="M34.5084 66.9457C32.7549 68.7623 30.7931 68.6159C31.4866 66.6812 33.2601 65.4981 35.2235 64.9506C38.1047 68.7124 41.9306 67.3548 46.2158 71.9611C44.6017 73.5657 41.2154 69.3499 37.3029 70.9494C34.5084 66.9457Z" fill="#FFFBFB" stroke="black" strokeWidth="0.5" />
                                </g>
                                <g id="slice3">
                                    <path d="M54 124.1C45.4869 119.58 38.4176 113.079 33.5026 105.25C28.5876 97.421 26 88.5401 26 79.5L82 79.5L54 124.1Z" fill="#FDDBA9" stroke="#EE9758" strokeWidth="2" />
                                    <circle cx="42" cy="99" r="6" fill="#F12424" />
                                    <path d="M57.3127 93.3748C54.8388 92.3499 57.4349 84.9246C61.8614 82.107 64.603 85.4062 62.7805 87.3984C65.9914 90.8193 64.4095 92.5483 60.9579 89.3905C57.3127 93.3748Z" fill="#E3DDDD" stroke="black" strokeWidth="0.5" />
                                    <path d="M45.1727 88.6661C47.8409 86.462 49.27 86.8398 48.7373 88.8247C44.6233 90.713 40.7226 87.0063 30.7915 84.0087C32.4458 82.3247 37.0009 86.473 41.3386 84.7112C45.1727 88.6661Z" fill="#1EAA07" stroke="#FDDBA9" strokeWidth="0.5" />
                                    <path d="M53.4224 96.617C50.0787 94.2906C52.0944 93.8898 54.0214 94.8018 55.5011 96.2038C53.7578 100.61 56.8904 103.192 55.1454 109.236C52.9389 108.678 54.8116 103.605 51.4271 101.073C53.4224 96.617Z" fill="#FFFBFB" stroke="black" strokeWidth="0.5" />
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center order-1 md:order-2 pe-4">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="p-2 bg-[#0066FF]/20 text-[#0066FF] rounded-lg">
                            <Settings className="w-5 h-5 animate-[spin_4s_linear_infinite]" />
                        </span>
                        <span className="text-sm font-bold uppercase tracking-widest text-[#0066FF]">{lang === "ar" ? "حلول مفصلة" : "Tailored Solutions"}</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
                        {lang === "ar" ? "لماذا تحتاج لإضافة " : "Why do you need a "}<span className="text-[#0066FF]">{lang === "ar" ? "مخصصة؟" : "custom plugin?"}</span>
                    </h2>

                    <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-10">
                        {t("tools_pages.cms.content")}
                    </p>

                    <div className="space-y-6">
                        {[
                            { title: lang === "ar" ? "أداء خفيف وسريع يعتمد فقط على ما تحتاجه." : "Lightweight & fast performance based only on what you need.", icon: Rocket },
                            { title: lang === "ar" ? "أمان أعلى وتجنب ثغرات الإضافات العامة المفتوحة." : "Higher security by avoiding public open-source vulnerabilities.", icon: Shield },
                            { title: lang === "ar" ? "تكامل مباشر مع أنظمتك الأخرى بدون وسيط." : "Direct integration with your other internal systems without middleware.", icon: Puzzle },
                        ].map((feat, idx) => (
                            <div key={idx} className="flex gap-4 items-start">
                                <div className="p-3 bg-[#0066FF]/10 text-[#0066FF] rounded-xl shrink-0 mt-1">
                                    <feat.icon className="w-5 h-5" />
                                </div>
                                <p className="text-zinc-300 font-medium text-lg pt-2">{feat.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </PageSection>

            <NexBotAI />
        </main>
    )
}
