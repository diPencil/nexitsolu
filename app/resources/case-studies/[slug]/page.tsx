import { notFound } from "next/navigation"
import { CASE_STUDIES_DATA } from "../case-studies-data"
import CaseStudyClient from "./case-study-client"

export function generateStaticParams() {
    return Object.keys(CASE_STUDIES_DATA).map((slug) => ({
        slug: slug,
    }))
}

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function CaseStudyPage({ params }: PageProps) {
    const { slug } = await params
    const caseStudy = CASE_STUDIES_DATA[slug]

    if (!caseStudy) return notFound()

    // Get 3 related case studies
    const relatedCaseStudies = Object.values(CASE_STUDIES_DATA)
        .filter(a => a.slug !== slug)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)

    return <CaseStudyClient caseStudy={caseStudy} relatedCaseStudies={relatedCaseStudies} />
}
