import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HtmlContent } from "@/components/html-content"
import { getProductById, getProductBySlug } from "@/lib/firebase-utils"
import { ProductDetailActions } from "@/components/product-detail-actions"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await getProductBySlug(id);
    
    if (!product) {
      return {
        title: 'Product not found',
        description: 'The requested product could not be found.'
      };
    }

    return {
      title: product.title || 'Product',
      description: product.description || '',
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'There was an error loading the product.'
    };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = (await getProductBySlug(id)) ?? {
    id: 'not-found',
    title: 'Product not found',
    price: 0,
    image: '/placeholder.svg',
  }

  return (
    <>
      <SiteHeader />
      <main className="w-[88%] mx-auto px-8 py-10 grid gap-12 lg:grid-cols-[1.5fr_420px]">
        <section className="w-full">
          <div className="w-full rounded-lg overflow-hidden border bg-card flex items-center justify-center bg-muted/20" style={{ height: '66%' }}>
            <img 
              src={product.image || "/placeholder.svg"} 
              alt={product.title || ''} 
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        <section>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.title}</h1>
          <div className="mt-2 text-primary font-semibold">Rs {Math.round(Number(product.price || 0))}</div>
          <HtmlContent 
            html={product.description ?? 'No description available.'} 
            className="mt-4 text-sm leading-relaxed text-muted-foreground"
          />

          <ProductDetailActions product={product} />

          <hr className="my-8" />

          <h3 className="text-lg md:text-xl font-bold">Product Specifications</h3>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Material</dt>
              <dd>{product.material ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Dimensions</dt>
              <dd>{product.dimensions ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Weight</dt>
              <dd>{product.weight ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Color</dt>
              <dd>{product.color ?? '—'}</dd>
            </div>
          </dl>

          <hr className="my-8" />

          <h3 className="text-lg md:text-xl font-bold">Care Instructions</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {product.careInstructions ?? 'Wipe clean with a soft, damp cloth. Avoid harsh chemicals or abrasive cleaners.'}
          </p>

          <div className="mt-10">
            <Link href="/shop" className="text-sm text-primary underline">
              Back to shop
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
