import { MetadataRoute } from 'next'

export const dynamic = 'force-static'


export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://nexit-solutions.com'

    const routes = [
        '',
        '/about/nexit-land',
        '/about/partners',
        '/about/team',
        '/about/tech-support',
        '/contact',
        '/privacy',
        '/resources/it-infrastructure',
        '/resources/case-studies',
        '/resources/industries-solutions',
        '/resources/tech-insights',
        '/services/digital',
        '/services/hardware',
        '/services/hosting-vps',
        '/services/it-accelerators',
        '/services/software',
        '/store',
        '/terms',
        '/tools/api-integrations',
        '/tools/cms-plugins',
        '/tools/payment-gateways',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return routes
}
