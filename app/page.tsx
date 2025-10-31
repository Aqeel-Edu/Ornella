import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/hero"
import { ProductCard } from "@/components/product-card"
import { CollectionCard } from "@/components/collection-card"
import { Newsletter } from "@/components/newsletter"
import { Carousel } from "@/components/carousel"
import { getFeaturedProducts, getCategories } from "@/lib/firebase-utils"
import { serializeProduct, serializeCategory } from "@/lib/serializers"

export default async function HomePage() {
  // Fetch featured products from Firestore (server-side)
  const featuredProducts = await getFeaturedProducts()

  const featuredProductItems = featuredProducts.slice(0, 8).map((p) => (
    <ProductCard key={p.id} product={serializeProduct(p)} />
  ))

  // Fetch categories from Firestore
  const rawCategories = await getCategories()
  const categories = rawCategories.map(serializeCategory)
  
  const collectionItems = categories.map((category) => (
    <CollectionCard
      key={category.id}
      title={category.title || ''}
      imageSrc={category.image || "/images/collections/placeholder.jpg"}
      href={`/shop?category=${encodeURIComponent(category.id.toLowerCase())}`}
    />
  ))

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <section className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-center text-lg font-semibold">Featured Products</h2>
          <div className="mt-6">
            <Carousel items={featuredProductItems} itemsPerView={{ sm: 2, lg: 4 }} />
          </div>
        </section>

        <section className="bg-secondary/60 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-center text-lg font-semibold">Shop by Collection</h2>
            <div className="mt-8">
              <Carousel items={collectionItems} itemsPerView={{ sm: 2, lg: 4 }} />
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      <SiteFooter />
    </>
  )
}
