import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FiltersSidebar } from "@/components/filters-sidebar"
import { ShopProductCard } from "@/components/shop-product-card"
import { getProducts, getCategories } from "@/lib/firebase-utils"
import { serializeProduct, serializeCategory } from "@/lib/serializers"

export default async function ShopPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Ensure searchParams is resolved
  const resolvedParams = await Promise.resolve(searchParams);
  
  // Fetch products and categories server-side for SEO and performance
  const [rawProducts, rawCategories] = await Promise.all([
    getProducts(),
    getCategories()
  ])
  let products = rawProducts.map(serializeProduct)
  const categories = rawCategories.map(serializeCategory)

  // Apply filters
  const categoryParam = resolvedParams.category
  const priceParam = resolvedParams.price
  
  const category = typeof categoryParam === 'string' ? categoryParam.toLowerCase() : undefined
  const price = typeof priceParam === 'string' ? priceParam : undefined

  if (category) {
    products = products.filter(p => p.category?.toLowerCase() === category)
  }

  if (price) {
    const [min, max] = price.split('-').map(Number)
    if (!isNaN(min)) {
      products = products.filter(p => {
        const productPrice = Number(p.price || 0)
        if (!isNaN(max)) {
          return productPrice >= min && productPrice <= max
        } else {
          return productPrice >= min
        }
      })
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-8">
          <FiltersSidebar categories={categories} />
          <section>
            <h1 className="text-2xl font-semibold mb-4">Shop</h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 9).map((p) => (
                <ShopProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="mt-8 flex items-center justify-center gap-2">
              <button className="h-8 w-8 rounded-full border bg-card text-sm">1</button>
              <button className="h-8 w-8 rounded-full border bg-card text-sm opacity-70">2</button>
              <button className="h-8 w-8 rounded-full border bg-card text-sm opacity-70">3</button>
              <span className="px-1 text-muted-foreground">…</span>
              <button className="h-8 w-8 rounded-full border bg-card text-sm opacity-70">10</button>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
