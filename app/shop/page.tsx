import Link from "next/link"
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
  
  // Get current page from params
  const pageParam = resolvedParams.page;
  const currentPage = typeof pageParam === 'string' ? parseInt(pageParam) : 1;
  const itemsPerPage = 16;
  
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
  const searchParam = resolvedParams.search
  
  const category = typeof categoryParam === 'string' ? categoryParam.toLowerCase() : undefined
  const price = typeof priceParam === 'string' ? priceParam : undefined
  const searchQuery = typeof searchParam === 'string' ? searchParam.toLowerCase() : undefined

  // Apply search filter
  if (searchQuery) {
    products = products.filter(p => 
      p.title?.toLowerCase().includes(searchQuery) ||
      p.description?.toLowerCase().includes(searchQuery) ||
      p.category?.toLowerCase().includes(searchQuery)
    )
  }

  // Apply category filter
  if (category) {
    products = products.filter(p => {
      const productCategory = p.category?.toLowerCase() || ''
      // Match against both category ID and title
      return productCategory === category || 
             productCategory === categories.find(c => c.id.toLowerCase() === category)?.title?.toLowerCase()
    })
  }

  // Apply price filter
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
      <main className="max-w-[1400px] ml-0 mr-auto pl-28 pr-3 md:pr-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-8">
          <FiltersSidebar categories={categories} />
          <section>
            {searchQuery && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing {products.length} results for "{searchQuery}"
                </p>
              </div>
            )}
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found.</p>
                {searchQuery && (
                  <Link href="/shop" className="text-primary hover:underline mt-2 inline-block">
                    Clear search
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((p) => (
                    <ShopProductCard key={p.id} product={p} />
                  ))}
                </div>
                {products.length > itemsPerPage && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    {currentPage > 1 && (
                      <Link
                        href={`/shop?${new URLSearchParams({ ...Object.fromEntries(Object.entries(resolvedParams).filter(([k]) => k !== 'page')), page: String(currentPage - 1) }).toString()}`}
                        className="h-8 px-3 rounded-full border bg-card text-sm hover:bg-accent transition-colors"
                      >
                        Previous
                      </Link>
                    )}
                    {Array.from({ length: Math.ceil(products.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                      <Link
                        key={page}
                        href={`/shop?${new URLSearchParams({ ...Object.fromEntries(Object.entries(resolvedParams).filter(([k]) => k !== 'page')), page: String(page) }).toString()}`}
                        className={`h-8 w-8 rounded-full border bg-card text-sm flex items-center justify-center hover:bg-accent transition-colors ${
                          page === currentPage ? 'bg-primary text-primary-foreground hover:bg-primary' : ''
                        }`}
                      >
                        {page}
                      </Link>
                    ))}
                    {currentPage < Math.ceil(products.length / itemsPerPage) && (
                      <Link
                        href={`/shop?${new URLSearchParams({ ...Object.fromEntries(Object.entries(resolvedParams).filter(([k]) => k !== 'page')), page: String(currentPage + 1) }).toString()}`}
                        className="h-8 px-3 rounded-full border bg-card text-sm hover:bg-accent transition-colors"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
