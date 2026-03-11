export interface CaseStudyContent {
    id: number;
    slug: string;
    partner: string;
    cat: "Hospitality" | "Construction" | "Travel" | "Technology" | "Logistics" | "Retail";
    date: string;
    image: string;
    logo: string;
    results: string;
    title_en: string;
    title_ar: string;
    meta_desc_en: string;
    meta_desc_ar: string;
    intro_en: string;
    intro_ar: string;
    content: {
        heading_en: string;
        heading_ar: string;
        text_en: string;
        text_ar: string;
    }[];
    highlights_en: string[];
    highlights_ar: string[];
}

export const CASE_STUDIES_DATA: Record<string, CaseStudyContent> = {
    "rivoli-suites-integration": {
        id: 1,
        slug: "rivoli-suites-integration",
        partner: "Rivoli Suites",
        cat: "Hospitality",
        date: "FEB 12, 2024",
        image: "/pc-workstation.png",
        logo: "/partners/rivoli-suites.jpg",
        results: "+450% Speed",
        title_en: "Total Digital Transformation for Rivoli Suites Luxury Hotels",
        title_ar: "التحول الرقمي الشامل لفنادق ريفولي سويتس الفاخرة",
        meta_desc_en: "How Nexit implemented a unified server architecture and seamless booking system for Rivoli Suites.",
        meta_desc_ar: "كيف قامت نيكسيت بتنفيذ بنية تحتية موحدة للخوادم ونظام حجز سلس لفنادق ريفولي سويتس.",
        intro_en: "Rivoli Suites needed a robust infrastructure to handle high booking volumes and guest services autonomously across all their properties.",
        intro_ar: "كانت ريفولي سويتس بحاجة إلى بنية تحتية قوية للتعامل مع أحجام الحجز العالية وخدمات الضيوف بشكل مستقل عبر جميع عقاراتهم.",
        content: [
            {
                heading_en: "Server Consolidation",
                heading_ar: "دمج الخوادم",
                text_en: "We replaced legacy individual servers with a high-performance central cluster, reducing downtime to near zero.",
                text_ar: "قمنا باستبدال الخوادم الفردية القديمة بمجموعة مركزية عالية الأداء، مما قلل وقت التوقف إلى الصفر تقريباً."
            },
            {
                heading_en: "Network Interconnectivity",
                heading_ar: "ترابط الشبكات",
                text_en: "Every department from reception to the spa now operates on a lightning-fast, secure localized network.",
                text_ar: "كل قسم من الاستقبال إلى السبا يعمل الآن على شبكة محلية آمنة فائقة السرعة."
            }
        ],
        highlights_en: ["99.9% Server Uptime", "Centralized Management", "Enhanced Security"],
        highlights_ar: ["استقرار سيرفرات 99.9%", "إدارة مركزية", "أمن معزز"]
    },
    "viva-egypt-cloud-migration": {
        id: 2,
        slug: "viva-egypt-cloud-migration",
        partner: "Viva Egypt Travel",
        cat: "Travel",
        date: "JAN 25, 2024",
        image: "/it-infrastructure.png",
        logo: "/partners/Viva egypttravel.jpg",
        results: "Zero Downtime",
        title_en: "Scaling Tourism Operations during Peak Seasons with Cloud Solutions",
        title_ar: "توسيع عمليات السياحة خلال مواسم الذروة باستخدام حلول السحابة",
        meta_desc_en: "Ensuring stability for Viva Egypt Travel during high-pressure tourist seasons.",
        meta_desc_ar: "ضمان الاستقرار لشركة فيفا إيجيبت للسياحة خلال مواسم الذروة ذات الضغط العالي.",
        intro_en: "Viva Egypt faced frequent system crashes during the winter season. Nexit stepped in to provide a scalable cloud infrastructure.",
        intro_ar: "واجهت فيفا إيجيبت توقفات متكررة في النظام خلال فصل الشتاء. تدخلت نيكسيت لتوفير بنية تحتية سحابية قابلة للتوسع.",
        content: [
            {
                heading_en: "Cloud-Native Scaling",
                heading_ar: "التوسع السحابي التلقائي",
                text_en: "Our team implemented an auto-scaling architecture that adjusts resources based on real-time traffic.",
                text_ar: "قام فريقنا بتنفيذ معمارية توسع تلقائي تضبط الموارد بناءً على حركة الزوار في الوقت الفعلي."
            }
        ],
        highlights_en: ["Auto-scaling", "Performance Monitoring", "24/7 Support"],
        highlights_ar: ["نمو تلقائي للموارد", "مراقبة الأداء", "دعم 24/7"]
    },
    "pioneer-construction-security": {
        id: 3,
        slug: "pioneer-construction-security",
        partner: "Pioneer Construction",
        cat: "Construction",
        date: "MAR 05, 2024",
        image: "/data-security.png",
        logo: "/partners/pioneer construction.jpg",
        results: "+300% ROI",
        title_en: "Securing High-Stakes Project Data for Pioneer Construction",
        title_ar: "تأمين بيانات المشاريع الحساسة لشركة بايونير للمقاولات",
        meta_desc_en: "Protecting blueprint and employee data through advanced encryption and cloud storage.",
        meta_desc_ar: "حماية المخططات وبيانات الموظفين من خلال التشفير المتقدم والتخزين السحابي.",
        intro_en: "Construction blueprints and client contracts are valuable assets. Pioneer required a military-grade security solution.",
        intro_ar: "مخططات البناء وعقود العملاء هي أصول قيمة. طلبت بايونير حلاً أمنياً بمستوى عسكري.",
        content: [
            {
                heading_en: "Hybrid Cloud Storage",
                heading_ar: "تخزين سحابي هجين",
                text_en: "Implementing a secure hybrid storage system that allows on-site access while maintaining off-site backups.",
                text_ar: "تنفيذ نظام تخزين هجين آمن يسمح بالوصول في مواقع العمل مع الحفاظ على نسخ احتياطية خارجية."
            }
        ],
        highlights_en: ["End-to-End Encryption", "Disaster Recovery", "Access Audit"],
        highlights_ar: ["تشفير شامل", "استعادة البيانات", "تدقيق الوصول"]
    },
    "vesper-group-connectivity": {
        id: 4,
        slug: "vesper-group-connectivity",
        partner: "Vesper Group",
        cat: "Technology",
        date: "FEB 28, 2024",
        image: "/expert-team.png",
        logo: "/partners/Vesper group.jpg",
        results: "5 Branches",
        title_en: "Interconnecting National Branches for Vesper Group",
        title_ar: "ربط الفروع الوطنية لشركة فيسبر جروب",
        meta_desc_en: "Creating a secure private network for multi-branch operational efficiency.",
        meta_desc_ar: "إنشاء شبكة خاصة آمنة لزيادة كفاءة العمليات عبر فروع متعددة.",
        intro_en: "Operating across multiple cities required Vesper Group to have a unified and secure communication network.",
        intro_ar: "تطلب العمل عبر مدن متعددة من فيسبر جروب وجود شبكة اتصالات موحدة وآمنة.",
        content: [
            {
                heading_en: "VPN & SD-WAN",
                heading_ar: "شبكات خاصة ذكية",
                text_en: "We designed a customized SD-WAN solution that ensures high-priority traffic always gets the best path.",
                text_ar: "صممنا حلاً ذكياً للشبكات يضمن حصول حركة البيانات المهمة على أفضل مسار دائماً."
            }
        ],
        highlights_en: ["Branch Sync", "Low Latency", "Encrypted Tunneling"],
        highlights_ar: ["مزامنة الفروع", "سرعة استجابة", "تشفير القنوات"]
    },
    "onestaeg-surveillance": {
        id: 5,
        slug: "onestaeg-surveillance",
        partner: "Onestaeg Hurghada",
        cat: "Construction",
        date: "MAR 01, 2024",
        image: "/pc-workstation.png",
        logo: "/partners/onestaeg hurghada.jpg",
        results: "100% Secure",
        title_en: "Implementing AI-Powered Surveillance for Onestaeg Hurghada",
        title_ar: "تنفيذ أنظمة مراقبة مدعومة بالذكاء الاصطناعي لأونستيج الغردقة",
        meta_desc_en: "Upgrading hotel security with facial recognition and motion analytics.",
        meta_desc_ar: "تطوير أمن الفنادق باستخدام التعرف على الوجوه وتحليل الحركة.",
        intro_en: "Security in Hurghada's top resorts is paramount. Onestaeg needed a tech-forward approach to guest safety.",
        intro_ar: "الأمن في أرقى منتجعات الغردقة هو الأولوية الكبرى. طلب أونستيج نهجاً تقنياً متقدماً لسلامة الضيوف.",
        content: [
            {
                heading_en: "Smart Monitoring",
                heading_ar: "المراقبة الذكية",
                text_en: "Installed 4K cameras integrated with AI patterns to detect unauthorized entry and abandoned luggage.",
                text_ar: "تم تركيب كاميرات 4K متكاملة مع أنماط الذكاء الاصطناعي لاكتشاف الدخول غير المصرح به والحقائب المتروكة."
            }
        ],
        highlights_en: ["Real-time Alerts", "Night Vision 4K", "AI Analytics"],
        highlights_ar: ["تنبيهات فورية", "رؤية ليلية 4K", "تحليلات الذكاء الاصطناعي"]
    },
    "arkan-system-upgrade": {
        id: 6,
        slug: "arkan-system-upgrade",
        partner: "Arkan",
        cat: "Construction",
        date: "JAN 15, 2024",
        image: "/data-security.png",
        logo: "/partners/arkan.jpg",
        results: "Efficiency+",
        title_en: "Arkan's Infrastructure Overhaul for Modern Operations",
        title_ar: "تطوير شامل للبنية التحتية لشركة أركان للعمليات الحديثة",
        meta_desc_en: "Modernizing terminals and servers for Arkan's corporate scaling.",
        meta_desc_ar: "تحديث الأجهزة والسيرفرات لتوسيع نطاق شركة أركان.",
        intro_en: "Legacy hardware was slowing down Arkan's growth. Nexit delivered a full-stack hardware and server refresh.",
        intro_ar: "كانت الأجهزة القديمة تبطئ نمو أركان. قدمت نيكسيت تحديثاً كاملاً للأجهزة والسيرفرات.",
        content: [
            {
                heading_en: "Hardware Refresh",
                heading_ar: "تحديث الأجهزة",
                text_en: "We supplied high-end workstations and enterprise-grade servers tailored for intensive data tasks.",
                text_ar: "قمنا بتوفير محطات عمل متطورة وسيرفرات مؤسسات مهيئة لمهام البيانات المكثفة."
            }
        ],
        highlights_en: ["Workstation Supply", "Fast Response", "Ongoing Support"],
        highlights_ar: ["توريد محطات عمل", "استجابة سريعة", "دعم مستمر"]
    },
    "rivoli-spa-smart-management": {
        id: 7,
        slug: "rivoli-spa-smart-management",
        partner: "Rivoli Spa",
        cat: "Hospitality",
        date: "FEB 20, 2024",
        image: "/expert-team.png",
        logo: "/partners/rivoli-spa.jpg",
        results: "Smart UX",
        title_en: "Smart Management Systems for Rivoli Spa & Wellness",
        title_ar: "أنظمة الإدارة الذكية لريفولي سبا وويلنس",
        meta_desc_en: "Digitizing guest scheduling and inventory for a seamless spa experience.",
        meta_desc_ar: "رقمنة جدولة الضيوف والمخزون لتجربة سبا سلسة.",
        intro_en: "Manual scheduling often led to double bookings. Nexit implemented a smart, automated booking platform.",
        intro_ar: "كانت الجدولة اليدوية تؤدي غالباً لتكرار الحجز. نفذت نيكسيت منصة حجز ذكية وآلية.",
        content: [
            {
                heading_en: "Automated Resourcing",
                heading_ar: "أتمتة الموارد",
                text_en: "Resource management is now automated, ensuring therapists and rooms are perfectly synced.",
                text_ar: "إدارة الموارد الآن آلية، مما يضمن تزامن المعالجين والغرف بشكل مثالي."
            }
        ],
        highlights_en: ["Zero Booking Errors", "Inventory Sync", "Loyalty System"],
        highlights_ar: ["صفر أخطاء حجز", "مزامنة المخزون", "نظام الولاء"]
    },
    "pencil-creative-tech": {
        id: 8,
        slug: "pencil-creative-tech",
        partner: "Pencil",
        cat: "Technology",
        date: "MAR 10, 2024",
        image: "/pc-workstation.png",
        logo: "/partners/pencil.jpg",
        results: "Pro Performance",
        title_en: "High-Performance Tech for Pencil Creative Studio",
        title_ar: "تقنيات عالية الأداء لاستوديو بنسل الإبداعي",
        meta_desc_en: "Deploying high-end creative workstations for rendering and design.",
        meta_desc_ar: "تجهيز محطات عمل إبداعية متطورة للريندر والتصميم.",
        intro_en: "Pencil required immense processing power to handle 3D rendering and large-scale design projects.",
        intro_ar: "طلبت شركة بنسل قوة معالجة هائلة للتعامل مع الريندر ثلاثي الأبعاد ومشاريع التصميم الكبيرة.",
        content: [
            {
                heading_en: "Workstation Deployment",
                heading_ar: "تجهيز محطات العمل",
                text_en: "Nexit supplied top-tier Apple and Windows workstations configured for the creative industry.",
                text_ar: "وردت نيكسيت محطات عمل آبل وويندوز من الدرجة الأولى مهيئة للقطاع الإبداعي."
            }
        ],
        highlights_en: ["Rendering Speed", "Stable Workflow", "Tech Audit"],
        highlights_ar: ["سرعة الريندر", "سير عمل مستقر", "تدقيق تقني"]
    },
    "albkht-automation": {
        id: 9,
        slug: "albkht-automation",
        partner: "Albkht Company",
        cat: "Retail",
        date: "DEC 15, 2023",
        image: "/data-security.png",
        logo: "/partners/Albkht-company.jpg",
        results: "-40% Time",
        title_en: "Business Process Automation for Albkht Company",
        title_ar: "أتمتة العمليات التجارية لشركة البخت",
        meta_desc_en: "Reducing manual workload through custom ERP and automation scripts.",
        meta_desc_ar: "تقليل عبء العمل اليدوي من خلال أنظمة ERP مخصصة ونصوص أتمتة.",
        intro_en: "Albkht Co. struggled with repetitive manual data entry. Nexit provided a comprehensive automation suite.",
        intro_ar: "كانت شركة البخت تعاني من إدخال البيانات اليدوي المتكرر. قدمت نيكسيت حزمة أتمتة شاملة.",
        content: [
            {
                heading_en: "Workflow Automation",
                heading_ar: "أتمتة سير العمل",
                text_en: "Replacing sheets with a unified dashboard that automates sales and inventory tracking.",
                text_ar: "استبدال الجداول بلوحة تحكم موحدة تؤتمت مبيعات وتتبع المخزون."
            }
        ],
        highlights_en: ["40% Faster Ops", "Data Accuracy", "Scalable System"],
        highlights_ar: ["تشغيل أسرع 40%", "دقة البيانات", "سيستم قابل للتوسع"]
    },
    "hainan-soliman-infrastructure": {
        id: 10,
        slug: "hainan-soliman-infrastructure",
        partner: "Hainan Soliman",
        cat: "Logistics",
        date: "NOV 30, 2023",
        image: "/it-infrastructure.png",
        logo: "/partners/Hainan-Soliman.jpg",
        results: "+200% Capacity",
        title_en: "High-Traffic Infrastructure for Hainan Soliman Travel",
        title_ar: "بنية تحتية عالية الكثافة لهاينان سليمان للسياحة",
        meta_desc_en: "Optimizing web infrastructure for high concurrent user counts.",
        meta_desc_ar: "تحسين البنية التحتية للويب لأعداد المستخدمين المتزامنة العالية.",
        intro_en: "Hainan Soliman's platform needed to support thousands of simultaneous travelers without latency.",
        intro_ar: "كانت منصة هاينان سليمان بحاجة لدعم آلاف المسافرين المتزامنين بدون أي بطء.",
        content: [
            {
                heading_en: "Load Balancing",
                heading_ar: "توزيع الأحمال",
                text_en: "We implemented sophisticated load balancers and a global CDN for lightning-fast speeds.",
                text_ar: "قمنا بتنفيذ موزعات أحمال متطورة وشبكة توصيل محتوى عالمية لسرعات فائقة."
            }
        ],
        highlights_en: ["Massive Scaling", "Global Delivery", "Uptime Guarantee"],
        highlights_ar: ["توسع هائل", "توصيل عالمي", "ضمان الاستقرار"]
    },
    "taxidia-logistics-tech": {
        id: 11,
        slug: "taxidia-logistics-tech",
        partner: "Taxidia",
        cat: "Travel",
        date: "JAN 20, 2024",
        image: "/expert-team.png",
        logo: "/partners/taxidia.jpg",
        results: "Smart Routing",
        title_en: "Digital Transformation for Taxidia Logistics",
        title_ar: "التحول الرقمي لشركة تاكسيديا للخدمات اللوجستية",
        meta_desc_en: "Enhancing shipping operations with real-time tracking and GPS integration.",
        meta_desc_ar: "تحسين عمليات الشحن مع تتبع في الوقت الفعلي وتكامل GPS.",
        intro_en: "Taxidia required a modern platform to manage their expanding shipping and fleet logistics operations.",
        intro_ar: "طلبت تاكسيديا منصة حديثة لإدارة عمليات الشحن والخدمات اللوجستية المتوسعة الخاصة بهم.",
        content: [
            {
                heading_en: "Fleet Management",
                heading_ar: "إدارة الأسطول",
                text_en: "A unified system that tracks every vehicle, optimizing routes and reducing fuel costs.",
                text_ar: "نظام موحد يتتبع كل مركبة، ويحسن المسارات ويقلل تكاليف الوقود."
            }
        ],
        highlights_en: ["Real-time Tracking", "Fuel Efficiency", "Branch Integration"],
        highlights_ar: ["تتبع حي", "توفير الوقود", "تكامل الفروع"]
    },
    "withinsky-surveillance": {
        id: 12,
        slug: "withinsky-surveillance",
        partner: "Withinsky",
        cat: "Travel",
        date: "MAR 08, 2024",
        image: "/data-security.png",
        logo: "/partners/withinsky.jpg",
        results: "Full Visibility",
        title_en: "Comprehensive Security Architecture for Withinsky Corporate Offices",
        title_ar: "هندسة أمنية شاملة لمكاتب شركة ويذ إن سكاي",
        meta_desc_en: "Protecting corporate assets with advanced firewall and IP cameras.",
        meta_desc_ar: "حماية أصول الشركة باستخدام جدار حماية متطور وكاميرات IP.",
        intro_en: "Withinsky needed to secure their corporate facility against physical and digital intrusions.",
        intro_ar: "كانت شركة ويذ إن سكاي بحاجة لتأمين منشآتها ضد الاختراقات المادية والرقمية.",
        content: [
            {
                heading_en: "Integrated Security",
                heading_ar: "الأمن المتكامل",
                text_en: "We combined physical access control with digital network monitoring for 360-degree protection.",
                text_ar: "جمعنا بين التحكم في الوصول المادي ومراقبة الشبكة الرقمية لحماية شاملة 360 درجة."
            }
        ],
        highlights_en: ["Phisical Security", "Network Firewall", "Cloud Archive"],
        highlights_ar: ["أمن مادي", "جدار حماية الشبكة", "أرشفة سحابية"]
    }
};
