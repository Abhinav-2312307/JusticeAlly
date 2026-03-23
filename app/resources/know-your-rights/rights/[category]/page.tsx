import { notFound } from "next/navigation"
import RightsList from "@/components/know-your-rights/rights-list"
import { getCategoryRights, getRightCategories } from "@/lib/rights"

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)
  const rights = getCategoryRights(decodedCategory)

  if (rights.length === 0) {
    notFound()
  }

  return (
    <main className="page-section">
      <div className="container-shell space-y-8">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Know Your Rights</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight md:text-6xl">{decodedCategory}</h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
            Read rights in this category, open the source documents, and ask the AI assistant to explain protections, violations, and next steps.
          </p>
        </div>

        <RightsList rights={rights} />
      </div>
    </main>
  )
}

export function generateStaticParams() {
  return getRightCategories().map((category) => ({
    category: encodeURIComponent(category),
  }))
}
