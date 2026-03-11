import { notFound } from "next/navigation"
import { ARTICLES_CONTENT } from "../articles-data"
import ArticleClient from "./article-client"

export function generateStaticParams() {
    return Object.keys(ARTICLES_CONTENT).map((slug) => ({
        slug: slug,
    }))
}

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params
    const article = ARTICLES_CONTENT[slug]

    if (!article) return notFound()

    // Get 3 related articles (different from current)
    const relatedArticles = Object.values(ARTICLES_CONTENT)
        .filter(a => a.slug !== slug)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)

    return <ArticleClient article={article} relatedArticles={relatedArticles} />
}
