import { MetadataRoute } from 'next'

export const dynamic = 'force-static'


export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/private/'],
        },
        sitemap: 'https://nexit-solutions.com/sitemap.xml',
    }
}
