/** Fallback catalog (also used to seed DB). Site paths optional for marketing links only. */

export type SubscriptionServiceOption = {
    key: string
    labelEn: string
    labelAr: string
    href: string
}

export const STATIC_SUBSCRIPTION_SERVICE_OPTIONS: SubscriptionServiceOption[] = [
    {
        key: "IT_ACCELERATORS",
        labelEn: "IT Accelerators",
        labelAr: "مسرعات الـ IT",
        href: "/services/it-accelerators",
    },
    {
        key: "DIGITAL",
        labelEn: "Digital",
        labelAr: "رقميات",
        href: "/services/digital",
    },
    {
        key: "SOFTWARE",
        labelEn: "Software",
        labelAr: "برمجيات",
        href: "/services/software",
    },
    {
        key: "HARDWARE",
        labelEn: "Hardware",
        labelAr: "معدات هاردوير",
        href: "/services/hardware",
    },
    {
        key: "HOSTING_VPS",
        labelEn: "Hosting & VPS",
        labelAr: "استضافة و VPS",
        href: "/services/hosting-vps",
    },
    {
        key: "MANAGED_IT",
        labelEn: "Managed IT / Enterprise",
        labelAr: "تعاقدات الشركات / Managed IT",
        href: "/services/managed-it",
    },
]

export type SubscriptionServiceCatalogRow = {
    key: string
    nameEn: string
    nameAr: string
}

/** Resolve label: prefer live catalog from API, then static keys, then raw key. */
export function getSubscriptionServiceLabel(
    serviceKey: string | null | undefined,
    lang: string,
    catalog?: SubscriptionServiceCatalogRow[] | null
): string | null {
    if (!serviceKey) return null
    if (catalog?.length) {
        const row = catalog.find((o) => o.key === serviceKey)
        if (row) return lang === "ar" ? row.nameAr : row.nameEn
    }
    const stat = STATIC_SUBSCRIPTION_SERVICE_OPTIONS.find(
        (o) => o.key === serviceKey
    )
    if (stat) return lang === "ar" ? stat.labelAr : stat.labelEn
    return serviceKey
}
